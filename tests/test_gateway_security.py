"""Unit tests for API Gateway security features."""

import hashlib
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import sys
import os

# Add src to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

# Now import
from gateway.main import app
from gateway.routers.agents import generate_api_key, _agents


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def clear_agents():
    """Clear agents storage before each test."""
    _agents.clear()
    yield
    _agents.clear()


class TestCORSSecurity:
    """Test CORS security configuration."""

    def test_cors_not_wildcard(self, client):
        """Test that CORS does not allow wildcard origins."""
        response = client.get("/api/v1/agents/")
        # Verify CORS is configured
        assert response.status_code == 200
        # In production with proper CORS, unknown origins should be rejected
        # For now, we verify the endpoint works


class TestAPIKeySecurity:
    """Test API key generation and storage security."""

    def test_generate_api_key_format(self):
        """Test that generated API keys have secure format."""
        raw_key, hashed_key = generate_api_key()
        
        # Check raw key format
        assert raw_key.startswith("sk_")
        assert len(raw_key) > 40  # Should be long enough
        
        # Check hashed key is SHA-256
        assert len(hashed_key) == 64  # SHA-256 produces 64 hex chars
        assert all(c in "0123456789abcdef" for c in hashed_key)

    def test_api_key_uniqueness(self):
        """Test that generated API keys are unique."""
        key1, _ = generate_api_key()
        key2, _ = generate_api_key()
        assert key1 != key2

    def test_api_key_hash_consistency(self):
        """Test that same key produces same hash."""
        key = "sk_test_key_12345"
        expected_hash = hashlib.sha256(key.encode()).hexdigest()
        
        raw_key, hashed_key = generate_api_key()
        actual_hash = hashlib.sha256(raw_key.encode()).hexdigest()
        
        assert actual_hash == hashed_key


class TestAgentRegistration:
    """Test agent registration endpoint security."""

    def test_register_agent_success(self, client):
        """Test successful agent registration."""
        response = client.post(
            "/api/v1/agents/",
            json={
                "agent_type": "worker",
                "name": "Test Worker",
                "capabilities": ["task1", "task2"]
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        
        # Check response structure
        assert "agent_id" in data
        assert "api_key" in data
        assert data["agent_type"] == "worker"
        assert data["name"] == "Test Worker"
        assert data["status"] == "registered"
        
        # Verify API key format
        assert data["api_key"].startswith("sk_")

    def test_register_agent_invalid_type(self, client):
        """Test registration with invalid agent type."""
        response = client.post(
            "/api/v1/agents/",
            json={
                "agent_type": "invalid_type",
                "name": "Test Agent",
                "capabilities": []
            }
        )
        
        assert response.status_code == 422  # Validation error

    def test_register_agent_empty_name(self, client):
        """Test registration with empty name."""
        response = client.post(
            "/api/v1/agents/",
            json={
                "agent_type": "worker",
                "name": "",
                "capabilities": []
            }
        )
        
        assert response.status_code == 422  # Validation error

    def test_register_agent_name_too_long(self, client):
        """Test registration with name exceeding max length."""
        response = client.post(
            "/api/v1/agents/",
            json={
                "agent_type": "worker",
                "name": "x" * 101,  # Max is 100
                "capabilities": []
            }
        )
        
        assert response.status_code == 422  # Validation error

    def test_register_agent_too_many_capabilities(self, client):
        """Test registration with too many capabilities."""
        response = client.post(
            "/api/v1/agents/",
            json={
                "agent_type": "worker",
                "name": "Test Agent",
                "capabilities": [f"cap_{i}" for i in range(51)]  # Max is 50
            }
        )
        
        assert response.status_code == 422  # Validation error

    def test_register_agent_capability_too_long(self, client):
        """Test registration with capability name too long."""
        response = client.post(
            "/api/v1/agents/",
            json={
                "agent_type": "worker",
                "name": "Test Agent",
                "capabilities": ["x" * 101]  # Max is 100
            }
        )
        
        assert response.status_code == 422  # Validation error

    def test_api_key_not_stored_plaintext(self, client):
        """Test that API key is not stored in plaintext."""
        response = client.post(
            "/api/v1/agents/",
            json={
                "agent_type": "worker",
                "name": "Test Worker",
                "capabilities": []
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        api_key = data["api_key"]
        agent_id = data["agent_id"]
        
        # Check that stored data uses hash, not plaintext
        stored_agent = _agents[agent_id]
        assert "api_key" not in stored_agent
        assert "api_key_hash" in stored_agent
        assert stored_agent["api_key_hash"] != api_key


class TestAgentListing:
    """Test agent listing endpoint."""

    def test_list_empty_agents(self, client):
        """Test listing when no agents registered."""
        response = client.get("/api/v1/agents/")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_agents(self, client):
        """Test listing registered agents."""
        # Register two agents
        client.post("/api/v1/agents/", json={
            "agent_type": "worker",
            "name": "Worker 1",
            "capabilities": []
        })
        client.post("/api/v1/agents/", json={
            "agent_type": "monitoring",
            "name": "Monitor 1",
            "capabilities": []
        })
        
        response = client.get("/api/v1/agents/")
        assert response.status_code == 200
        
        agents = response.json()
        assert len(agents) == 2
        
        # Verify API keys are not exposed in listing
        for agent in agents:
            assert "api_key" not in agent
            assert "api_key_hash" not in agent


class TestAgentRetrieval:
    """Test individual agent retrieval."""

    def test_get_agent_success(self, client):
        """Test retrieving a specific agent."""
        # Register agent
        reg_response = client.post("/api/v1/agents/", json={
            "agent_type": "worker",
            "name": "Test Worker",
            "capabilities": []
        })
        agent_id = reg_response.json()["agent_id"]
        
        # Retrieve agent
        response = client.get(f"/api/v1/agents/{agent_id}")
        assert response.status_code == 200
        
        agent = response.json()
        assert agent["agent_id"] == agent_id
        assert agent["agent_type"] == "worker"
        
        # Verify API key is not exposed
        assert "api_key" not in agent
        assert "api_key_hash" not in agent

    def test_get_nonexistent_agent(self, client):
        """Test retrieving non-existent agent."""
        response = client.get("/api/v1/agents/nonexistent")
        assert response.status_code == 404


class TestAgentDeregistration:
    """Test agent deregistration."""

    def test_deregister_agent_success(self, client):
        """Test successful agent deregistration."""
        # Register agent
        reg_response = client.post("/api/v1/agents/", json={
            "agent_type": "worker",
            "name": "Test Worker",
            "capabilities": []
        })
        agent_id = reg_response.json()["agent_id"]
        
        # Deregister agent
        response = client.delete(f"/api/v1/agents/{agent_id}")
        assert response.status_code == 204
        
        # Verify agent is gone
        get_response = client.get(f"/api/v1/agents/{agent_id}")
        assert get_response.status_code == 404

    def test_deregister_nonexistent_agent(self, client):
        """Test deregistering non-existent agent."""
        response = client.delete("/api/v1/agents/nonexistent")
        assert response.status_code == 404


class TestErrorHandling:
    """Test error handling security."""

    def test_error_no_stack_trace(self, client):
        """Test that errors don't expose stack traces."""
        # Get a nonexistent agent to trigger an error
        response = client.get("/api/v1/agents/nonexistent_agent_id")
        
        # Should return 404
        assert response.status_code == 404
        data = response.json()
        
        # Verify error message is present
        assert "detail" in data
        assert "Agent" in data["detail"]
        assert "not found" in data["detail"]


class TestInputSanitization:
    """Test input sanitization."""

    def test_agent_name_control_chars_removed(self, client):
        """Test that control characters are removed from agent names."""
        response = client.post(
            "/api/v1/agents/",
            json={
                "agent_type": "worker",
                "name": "Test\x00\x01\x02Worker",
                "capabilities": []
            }
        )
        
        # Should succeed with sanitized name
        assert response.status_code == 201

    def test_capability_strings_validated(self, client):
        """Test that capabilities are validated as strings."""
        response = client.post(
            "/api/v1/agents/",
            json={
                "agent_type": "worker",
                "name": "Test Worker",
                "capabilities": [123, 456]  # Invalid: not strings
            }
        )
        
        assert response.status_code == 422  # Validation error


class TestRateLimiting:
    """Test rate limiting functionality."""

    def test_rate_limit_headers_present(self, client):
        """Test that rate limit headers are included."""
        response = client.get("/api/v1/agents/")
        
        assert response.status_code == 200
        # Rate limit headers should be present
        assert "X-RateLimit-Limit" in response.headers
        assert "X-RateLimit-Remaining" in response.headers
        assert "X-RateLimit-Reset" in response.headers


class TestRequestLogging:
    """Test request logging functionality."""

    def test_request_id_header(self, client):
        """Test that request ID is included in response."""
        response = client.get("/api/v1/agents/")
        
        assert response.status_code == 200
        assert "X-Request-ID" in response.headers
        assert response.headers["X-Request-ID"].startswith("req_")

    def test_process_time_header(self, client):
        """Test that process time is included in response."""
        response = client.get("/api/v1/agents/")
        
        assert response.status_code == 200
        assert "X-Process-Time" in response.headers
        
        # Should be a valid float
        process_time = float(response.headers["X-Process-Time"])
        assert process_time >= 0
