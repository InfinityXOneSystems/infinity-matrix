"""Test configuration."""

import pytest


@pytest.fixture
def sample_lead():
    """Sample lead for testing."""
    return {
        "id": "test_lead_1",
        "type": "business",
        "contact": {
            "name": "Test Lead",
            "email": "test@example.com",
            "phone": "+1-555-1234",
        },
        "profile": {
            "location": "San Francisco, CA",
            "price_range": (100000, 500000),
        },
    }


@pytest.fixture
def sample_financial_data():
    """Sample financial data for testing."""
    return {
        "symbol": "AAPL",
        "timeframe": "1d",
        "analysis_type": "stock",
    }
