"""Integration tests for the API."""

import pytest
from httpx import AsyncClient
from infinity_matrix.integrations.api.server import create_app


@pytest.mark.asyncio
async def test_health_endpoint():
    """Test health check endpoint."""
    app = create_app()
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_readiness_endpoint():
    """Test readiness endpoint."""
    app = create_app()
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/ready")
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_list_agents_endpoint():
    """Test list agents endpoint."""
    app = create_app()
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/agents")
        assert response.status_code == 200
        data = response.json()
        assert "total_agents" in data
        assert data["total_agents"] > 0
