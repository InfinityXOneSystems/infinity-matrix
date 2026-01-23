"""
Infinity Matrix - Auto-Resolve and Auto-Merge System

A powerful system designed to automatically resolve all systems and auto-merge
their states in the correct dependency order.
"""

from .infinity_matrix import (
    AutoMerger,
    InfinityMatrix,
    System,
    SystemResolver,
    SystemState,
    create_sample_systems,
)

__version__ = "1.0.0"
__author__ = "Infinity X One Systems"

__all__ = [
    "InfinityMatrix",
    "System",
    "SystemState",
    "SystemResolver",
    "AutoMerger",
    "create_sample_systems",
]
