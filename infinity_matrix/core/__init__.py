"""Core module initialization."""

from infinity_matrix.core.config import Config, get_config, set_config
from infinity_matrix.core.seed_manager import SeedManager
from infinity_matrix.core.state_manager import StateManager
from infinity_matrix.core.ingestion_engine import IngestionEngine

__all__ = [
    "Config",
    "get_config",
    "set_config",
    "SeedManager",
    "StateManager",
    "IngestionEngine",
]
