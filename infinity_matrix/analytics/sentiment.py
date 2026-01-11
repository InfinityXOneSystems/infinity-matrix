"""Sentiment analysis engine using multiple approaches."""

from enum import Enum
from typing import Any, dict, list

from infinity_matrix.core.logging import LoggerMixin


class SentimentLabel(str, Enum):
    """Sentiment labels."""
    VERY_POSITIVE = "very_positive"
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"
    VERY_NEGATIVE = "very_negative"


class SentimentAnalyzer(LoggerMixin):
    """Multi-model sentiment analysis engine."""

    def __init__(self, use_llm: bool = False):
        """Initialize sentiment analyzer."""
        self.use_llm = use_llm
        self._vader = None
        self._textblob = None
        self.log_info("sentiment_analyzer_initialized", use_llm=use_llm)

    def _get_vader(self) -> Any:
        """Lazy load VADER."""
        if self._vader is None:
            from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
            self._vader = SentimentIntensityAnalyzer()
        return self._vader

    def _get_textblob(self) -> Any:
        """Lazy load TextBlob."""
        if self._textblob is None:
            from textblob import TextBlob
            self._textblob = TextBlob
        return self._textblob

    async def analyze_text(
        self, text: str, method: str = "vader"
    ) -> dict[str, Any]:
        """
        Analyze sentiment of text.

        Args:
            text: Text to analyze
            method: Analysis method (vader, textblob, llm)

        Returns:
            Sentiment analysis results
        """
        if method == "vader":
            return await self._analyze_vader(text)
        elif method == "textblob":
            return await self._analyze_textblob(text)
        elif method == "llm":
            return await self._analyze_llm(text)
        else:
            raise ValueError(f"Unknown method: {method}")

    async def _analyze_vader(self, text: str) -> dict[str, Any]:
        """Analyze using VADER."""
        vader = self._get_vader()
        scores = vader.polarity_scores(text)

        # Determine label
        compound = scores["compound"]
        if compound >= 0.5:
            label = SentimentLabel.VERY_POSITIVE
        elif compound >= 0.05:
            label = SentimentLabel.POSITIVE
        elif compound <= -0.5:
            label = SentimentLabel.VERY_NEGATIVE
        elif compound <= -0.05:
            label = SentimentLabel.NEGATIVE
        else:
            label = SentimentLabel.NEUTRAL

        return {
            "method": "vader",
            "score": compound,
            "label": label,
            "scores": scores,
            "success": True,
        }

    async def _analyze_textblob(self, text: str) -> dict[str, Any]:
        """Analyze using TextBlob."""
        TextBlob = self._get_textblob()
        blob = TextBlob(text)

        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity

        # Determine label
        if polarity >= 0.5:
            label = SentimentLabel.VERY_POSITIVE
        elif polarity >= 0.1:
            label = SentimentLabel.POSITIVE
        elif polarity <= -0.5:
            label = SentimentLabel.VERY_NEGATIVE
        elif polarity <= -0.1:
            label = SentimentLabel.NEGATIVE
        else:
            label = SentimentLabel.NEUTRAL

        return {
            "method": "textblob",
            "score": polarity,
            "label": label,
            "polarity": polarity,
            "subjectivity": subjectivity,
            "success": True,
        }

    async def _analyze_llm(self, text: str) -> dict[str, Any]:
        """Analyze using LLM."""
        from infinity_matrix.ai.llm import analyze_with_llm

        result = await analyze_with_llm(text, "sentiment")

        # Parse LLM response to extract score
        # This is a simplified version - production would need proper parsing
        response = result.get("result", "")

        # Try to extract numeric score from response
        import re
        match = re.search(r"[-+]?\d*\.?\d+", response)
        score = float(match.group()) if match else 0.0

        # Determine label
        if score >= 0.5:
            label = SentimentLabel.VERY_POSITIVE
        elif score >= 0.1:
            label = SentimentLabel.POSITIVE
        elif score <= -0.5:
            label = SentimentLabel.VERY_NEGATIVE
        elif score <= -0.1:
            label = SentimentLabel.NEGATIVE
        else:
            label = SentimentLabel.NEUTRAL

        return {
            "method": "llm",
            "score": score,
            "label": label,
            "raw_response": response,
            "success": True,
        }

    async def analyze_batch(
        self, texts: list[str], method: str = "vader"
    ) -> list[dict[str, Any]]:
        """Analyze multiple texts."""
        import asyncio

        tasks = [self.analyze_text(text, method) for text in texts]
        results = await asyncio.gather(*tasks)

        self.log_info("batch_sentiment_analysis_complete", count=len(results))
        return results

    async def analyze_consensus(self, text: str) -> dict[str, Any]:
        """
        Analyze using multiple methods and return consensus.

        Args:
            text: Text to analyze

        Returns:
            Consensus sentiment analysis
        """
        methods = ["vader", "textblob"]
        if self.use_llm:
            methods.append("llm")

        results = await self.analyze_batch([text] * len(methods), method=methods[0])

        # Calculate average score
        scores = [r["score"] for r in results if r.get("success")]
        avg_score = sum(scores) / len(scores) if scores else 0.0

        # Determine consensus label
        if avg_score >= 0.5:
            label = SentimentLabel.VERY_POSITIVE
        elif avg_score >= 0.1:
            label = SentimentLabel.POSITIVE
        elif avg_score <= -0.5:
            label = SentimentLabel.VERY_NEGATIVE
        elif avg_score <= -0.1:
            label = SentimentLabel.NEGATIVE
        else:
            label = SentimentLabel.NEUTRAL

        return {
            "consensus_score": avg_score,
            "consensus_label": label,
            "individual_results": results,
            "confidence": self._calculate_confidence(scores),
            "success": True,
        }

    def _calculate_confidence(self, scores: list[float]) -> float:
        """Calculate confidence based on score variance."""
        if len(scores) < 2:
            return 1.0

        import statistics
        variance = statistics.variance(scores)
        # Lower variance = higher confidence
        confidence = max(0.0, min(1.0, 1.0 - variance))
        return confidence

    async def track_sentiment_over_time(
        self,
        texts_with_timestamps: list[tuple[str, str]],
        method: str = "vader",
    ) -> dict[str, Any]:
        """
        Track sentiment changes over time.

        Args:
            texts_with_timestamps: list of (text, timestamp) tuples
            method: Analysis method

        Returns:
            Sentiment trend analysis
        """
        results = []
        for text, timestamp in texts_with_timestamps:
            sentiment = await self.analyze_text(text, method)
            results.append({
                "timestamp": timestamp,
                "sentiment": sentiment,
            })

        # Calculate trend
        scores = [r["sentiment"]["score"] for r in results]
        trend = "increasing" if scores[-1] > scores[0] else "decreasing"

        return {
            "timeline": results,
            "trend": trend,
            "start_score": scores[0],
            "end_score": scores[-1],
            "average_score": sum(scores) / len(scores),
            "success": True,
        }
