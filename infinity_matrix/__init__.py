"""
Infinity Matrix - Enterprise Intelligence Platform

A state-of-the-art platform for autonomous data collection, AI-powered analysis,
and real-time predictions across multiple industries.
"""

__version__ = "1.0.0"
__author__ = "InfinityXOneSystems"
__license__ = "MIT"

from infinity_matrix.core.config import settings
from infinity_matrix.core.logging import setup_logging

# Initialize logging on import
logger = setup_logging()

__all__ = ["settings", "logger", "__version__"]
