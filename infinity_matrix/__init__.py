"""
Infinity Matrix - Master Universal System/App Builder

An AI-powered universal application builder and orchestrator that transforms
natural language prompts into production-ready applications across any stack.
"""

__version__ = "0.1.0"
__author__ = "InfinityXOne Systems"
__license__ = "MIT"

from infinity_matrix.core.engine.builder import UniversalBuilder
from infinity_matrix.core.ai.cortex import VisionCortex

__all__ = ["UniversalBuilder", "VisionCortex"]
