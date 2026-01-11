"""Tests for sentiment analysis module."""

import pytest

from infinity_matrix.analytics.sentiment import SentimentAnalyzer


@pytest.mark.asyncio
async def test_sentiment_analyzer_initialization():
    """Test sentiment analyzer initialization."""
    analyzer = SentimentAnalyzer()
    assert analyzer is not None


@pytest.mark.asyncio
async def test_analyze_positive_sentiment():
    """Test positive sentiment analysis."""
    analyzer = SentimentAnalyzer()

    result = await analyzer.analyze_text(
        "This is absolutely wonderful and amazing!",
        method="vader"
    )

    assert result is not None
    assert result["success"] is True
    assert result["score"] > 0
    assert "positive" in result["label"].lower()


@pytest.mark.asyncio
async def test_analyze_negative_sentiment():
    """Test negative sentiment analysis."""
    analyzer = SentimentAnalyzer()

    result = await analyzer.analyze_text(
        "This is terrible and awful.",
        method="vader"
    )

    assert result is not None
    assert result["success"] is True
    assert result["score"] < 0
    assert "negative" in result["label"].lower()


@pytest.mark.asyncio
async def test_analyze_neutral_sentiment():
    """Test neutral sentiment analysis."""
    analyzer = SentimentAnalyzer()

    result = await analyzer.analyze_text(
        "This is a statement.",
        method="vader"
    )

    assert result is not None
    assert result["success"] is True
