"""Base classes for Infinity Matrix components."""

from abc import ABC, abstractmethod
from typing import Any, dict
from uuid import uuid4

from pydantic import BaseModel, Field

from infinity_matrix.core.logging import get_logger

logger = get_logger(__name__)


class Task(BaseModel):
    """Base task model."""

    id: str = Field(default_factory=lambda: str(uuid4()))
    type: str
    input: dict[str, Any]
    metadata: dict[str, Any] = Field(default_factory=dict)


class TaskResult(BaseModel):
    """Base task result model."""

    task_id: str
    status: str  # success, failure, partial
    output: dict[str, Any]
    error: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class Component(ABC):
    """Base component class."""

    def __init__(self, name: str, component_type: str):
        """Initialize component."""
        self.name = name
        self.component_type = component_type
        self.id = str(uuid4())
        self.logger = get_logger(f"{__name__}.{name}")

    @abstractmethod
    async def initialize(self) -> None:
        """Initialize component."""

    @abstractmethod
    async def shutdown(self) -> None:
        """Shutdown component."""

    @abstractmethod
    async def health_check(self) -> dict[str, Any]:
        """Perform health check."""

    def __repr__(self) -> str:
        """String representation."""
        return f"{self.__class__.__name__}(name={self.name}, id={self.id})"


class BaseProcessor(Component):
    """Base processor class for processing tasks."""

    @abstractmethod
    async def process(self, task: Task) -> TaskResult:
        """Process a task."""

    @abstractmethod
    async def validate(self, task: Task) -> bool:
        """Validate task input."""


class BaseService(Component):
    """Base service class."""

    def __init__(self, name: str):
        """Initialize service."""
        super().__init__(name=name, component_type="service")
        self._initialized = False

    async def initialize(self) -> None:
        """Initialize service."""
        if self._initialized:
            return
        self.logger.info("service_initializing")
        await self._initialize()
        self._initialized = True
        self.logger.info("service_initialized")

    async def shutdown(self) -> None:
        """Shutdown service."""
        if not self._initialized:
            return
        self.logger.info("service_shutting_down")
        await self._shutdown()
        self._initialized = False
        self.logger.info("service_shutdown_complete")

    async def health_check(self) -> dict[str, Any]:
        """Perform health check."""
        return {
            "name": self.name,
            "type": self.component_type,
            "status": "healthy" if self._initialized else "not_initialized",
            "id": self.id,
        }

    @abstractmethod
    async def _initialize(self) -> None:
        """Internal initialization logic."""

    @abstractmethod
    async def _shutdown(self) -> None:
        """Internal shutdown logic."""

    @property
    def is_initialized(self) -> bool:
        """Check if service is initialized."""
        return self._initialized
