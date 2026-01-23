"""Analytics module initialization."""

from infinity_matrix.analytics.predictions import (
    ClassificationPredictor,
    EnsemblePredictor,
    RegressionPredictor,
    TimeSeriesPredictor,
)
from infinity_matrix.analytics.sentiment import SentimentAnalyzer, SentimentLabel

__all__ = [
    "SentimentAnalyzer",
    "SentimentLabel",
    "TimeSeriesPredictor",
    "ClassificationPredictor",
    "RegressionPredictor",
    "EnsemblePredictor",
]
