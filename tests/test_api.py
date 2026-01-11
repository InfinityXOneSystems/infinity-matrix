"""Tests for API endpoints."""

import pytest
from fastapi.testclient import TestClient

from gateway_stack.api.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


def test_root_endpoint(client):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data['name'] == "Infinity-Matrix API"
    assert data['status'] == "operational"


def test_health_endpoint(client):
    """Test health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == "healthy"


def test_system_status_endpoint(client):
    """Test system status endpoint."""
    response = client.get("/api/v1/system/status")
    assert response.status_code == 200
    data = response.json()
    assert 'status' in data
    assert 'agents' in data


def test_list_agents_endpoint(client):
    """Test list agents endpoint."""
    response = client.get("/api/v1/agents")
    assert response.status_code == 200
    data = response.json()
    assert 'agents' in data
    assert data['total'] >= 0


def test_get_agent_details_endpoint(client):
    """Test get agent details endpoint."""
    response = client.get("/api/v1/agents/crawler")
    assert response.status_code == 200
    data = response.json()
    assert data['name'] == 'crawler'


def test_list_events_endpoint(client):
    """Test list events endpoint."""
    response = client.get("/api/v1/events")
    assert response.status_code == 200
    data = response.json()
    assert 'events' in data


def test_get_metrics_endpoint(client):
    """Test get metrics endpoint."""
    response = client.get("/api/v1/metrics")
    assert response.status_code == 200
    data = response.json()
    assert 'timestamp' in data
