"""Core module initialization."""

from infinity_matrix.core.config import Config, load_config
from infinity_matrix.core.registry import AgentRegistry
from infinity_matrix.core.system import InfinityMatrix

__all__ = [
    "Config",
    "load_config",
    "AgentRegistry",
    "InfinityMatrix",
]
