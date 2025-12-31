"""Infinity Matrix - Universal Seed & Ingestion System.

Enterprise-grade data collection, normalization, and AI-powered analysis
across multiple business verticals.
"""

__version__ = "1.0.0"
__author__ = "InfinityXOneSystems"

from infinity_matrix.core.config import Config
from infinity_matrix.core.ingestion_engine import IngestionEngine
from infinity_matrix.core.seed_manager import SeedManager

__all__ = [
    "Config",
    "IngestionEngine",
    "SeedManager",
    "__version__",
    "__author__",
]
