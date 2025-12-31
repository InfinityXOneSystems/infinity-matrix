"""Core module initialization."""

from infinity_matrix.core.base import Component, Task, TaskResult
from infinity_matrix.core.config import get_settings
from infinity_matrix.core.logging import get_logger
from infinity_matrix.core.metrics import get_metrics_collector

__all__ = [
    "Component",
    "Task",
    "TaskResult",
    "get_settings",
    "get_logger",
    "get_metrics_collector",
]
