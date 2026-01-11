"""Tests for financial analysis module."""

import pytest

from infinity_matrix.industries.finance import CryptoAnalyzer, FinancialAnalyzer


@pytest.mark.asyncio
async def test_financial_analyzer_initialization():
    """Test financial analyzer initialization."""
    analyzer = FinancialAnalyzer()
    await analyzer.initialize()
    assert analyzer is not None
    await analyzer.shutdown()


@pytest.mark.asyncio
async def test_analyze_stock():
    """Test stock analysis."""
    analyzer = FinancialAnalyzer()
    await analyzer.initialize()

    result = await analyzer.analyze_stock("AAPL", "1d", "1mo")

    await analyzer.shutdown()

    assert result is not None
    assert "symbol" in result
    assert result["symbol"] == "AAPL"


@pytest.mark.asyncio
async def test_crypto_analyzer_initialization():
    """Test crypto analyzer initialization."""
    analyzer = CryptoAnalyzer()
    await analyzer.initialize()
    assert analyzer is not None
    await analyzer.shutdown()


@pytest.mark.asyncio
async def test_analyze_crypto():
    """Test crypto analysis."""
    analyzer = CryptoAnalyzer()
    await analyzer.initialize()

    result = await analyzer.analyze_crypto("BTC")

    await analyzer.shutdown()

    assert result is not None
    assert "symbol" in result
