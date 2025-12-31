"""Analytics module initialization."""

from infinity_matrix.analytics.sentiment import SentimentAnalyzer, SentimentLabel
from infinity_matrix.analytics.predictions import (
    TimeSeriesPredictor,
    ClassificationPredictor,
    RegressionPredictor,
    EnsemblePredictor,
)

__all__ = [
    "SentimentAnalyzer",
    "SentimentLabel",
    "TimeSeriesPredictor",
    "ClassificationPredictor",
    "RegressionPredictor",
    "EnsemblePredictor",
]
