"""Test configuration for pytest."""

import pytest


@pytest.fixture
def test_config():
    """Provide test configuration."""
    return {
        "api_url": "http://localhost:8000",
        "test_mode": True,
    }


# TODO: Add more fixtures for:
# - Database connections
# - Mock agents
# - Test data
# - Authentication tokens
