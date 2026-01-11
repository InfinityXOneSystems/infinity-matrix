import pytest
from app.intelligence.business_analyzer import BusinessAnalyzer


@pytest.mark.asyncio
async def test_business_analyzer():
    """Test BusinessAnalyzer"""
    analyzer = BusinessAnalyzer()

    business_name = "Test Company"
    crawled_data = [
        {"url": "test.com", "content": "test content"}
    ]

    result = await analyzer.analyze(business_name, crawled_data)

    assert "business_overview" in result
    assert "financial_data" in result
    assert "operational_analysis" in result
    assert result["business_overview"]["name"] == business_name


@pytest.mark.asyncio
async def test_business_analyzer_capabilities():
    """Test BusinessAnalyzer capabilities assessment"""
    analyzer = BusinessAnalyzer()

    result = await analyzer.analyze("Test Co", [])

    assert "capabilities" in result
    capabilities = result["capabilities"]
    assert isinstance(capabilities, dict)
    assert "technical_capability" in capabilities
    assert capabilities["technical_capability"] > 0
