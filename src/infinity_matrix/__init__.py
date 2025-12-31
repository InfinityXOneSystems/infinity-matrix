"""
Infinity Matrix - Autonomous Multi-Agent System

A FAANG-level enterprise platform for AI-powered automation and orchestration.
"""

__version__ = "0.1.0"
__author__ = "InfinityXOne Systems"
__license__ = "MIT"

from infinity_matrix.core.config import Config
from infinity_matrix.core.registry import AgentRegistry
from infinity_matrix.core.system import InfinityMatrix

__all__ = [
    "Config",
    "AgentRegistry",
    "InfinityMatrix",
    "__version__",
]
