"""Tests for real estate module."""

import pytest

from infinity_matrix.industries.real_estate import RealEstateEngine, RealEstateLeadGenerator


@pytest.mark.asyncio
async def test_real_estate_engine_initialization():
    """Test real estate engine initialization."""
    engine = RealEstateEngine()
    await engine.initialize()
    assert engine is not None
    await engine.shutdown()


@pytest.mark.asyncio
async def test_discover_leads():
    """Test lead discovery."""
    engine = RealEstateEngine()
    await engine.initialize()

    leads = await engine.discover_leads(
        location="San Francisco, CA",
        criteria={"lead_type": "buyer"}
    )

    await engine.shutdown()

    assert leads is not None
    assert isinstance(leads, list)
    assert len(leads) > 0
    assert "score" in leads[0]


@pytest.mark.asyncio
async def test_lead_scoring():
    """Test lead scoring."""
    generator = RealEstateLeadGenerator()
    await generator.initialize()

    lead = {
        "id": "test",
        "contact": {"email": "test@example.com", "phone": "+1234567890"},
        "profile": {"price_range": (100000, 500000)},
    }

    score = await generator.score_lead(lead)

    await generator.shutdown()

    assert score >= 0.0
    assert score <= 1.0
