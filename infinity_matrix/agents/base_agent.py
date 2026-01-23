"""Base agent class for all agents in the system."""

from abc import abstractmethod
from datetime import datetime
from typing import Any, dict, list

from pydantic import BaseModel, Field

from infinity_matrix.core.base import Component
from infinity_matrix.core.logging import get_logger
from infinity_matrix.core.metrics import get_metrics_collector, track_execution_time

logger = get_logger(__name__)


class AgentCapability(BaseModel):
    """Agent capability definition."""

    name: str
    description: str
    input_schema: dict[str, Any] = Field(default_factory=dict)
    output_schema: dict[str, Any] = Field(default_factory=dict)


class AgentMetadata(BaseModel):
    """Agent metadata."""

    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_execution: datetime | None = None
    execution_count: int = 0
    success_count: int = 0
    failure_count: int = 0
    average_duration: float = 0.0


class BaseAgent(Component):
    """Base class for all agents."""

    def __init__(
        self,
        name: str,
        agent_type: str,
        description: str = "",
        capabilities: list[AgentCapability] | None = None,
    ):
        """Initialize agent."""
        super().__init__(name=name, component_type="agent")
        self.agent_type = agent_type
        self.description = description
        self.capabilities = capabilities or []
        self.metadata = AgentMetadata()
        self.metrics = get_metrics_collector()
        self._is_busy = False

    async def initialize(self) -> None:
        """Initialize agent."""
        self.logger.info("agent_initializing", agent_type=self.agent_type)
        await self._initialize()
        self.logger.info("agent_initialized", agent_type=self.agent_type)

    async def shutdown(self) -> None:
        """Shutdown agent."""
        self.logger.info("agent_shutting_down", agent_type=self.agent_type)
        await self._shutdown()
        self.logger.info("agent_shutdown_complete", agent_type=self.agent_type)

    async def health_check(self) -> dict[str, Any]:
        """Perform health check."""
        return {
            "name": self.name,
            "type": self.agent_type,
            "status": "busy" if self._is_busy else "ready",
            "metadata": self.metadata.model_dump(),
        }

    @track_execution_time("agent_execution")
    async def execute(self, task: dict[str, Any]) -> dict[str, Any]:
        """Execute agent task."""
        if self._is_busy:
            raise RuntimeError(f"Agent {self.name} is busy")

        self._is_busy = True
        start_time = datetime.utcnow()

        try:
            # Validate input
            if not await self.validate(task):
                raise ValueError("Invalid task input")

            # Execute task
            result = await self._execute(task)

            # Update metadata
            self.metadata.last_execution = datetime.utcnow()
            self.metadata.execution_count += 1
            self.metadata.success_count += 1

            # Update metrics
            duration = (datetime.utcnow() - start_time).total_seconds()
            self.metrics.record_agent_execution(self.agent_type, "success", duration)

            self.logger.info(
                "agent_execution_success",
                agent=self.name,
                duration=duration,
            )

            return result

        except Exception as e:
            self.metadata.execution_count += 1
            self.metadata.failure_count += 1

            duration = (datetime.utcnow() - start_time).total_seconds()
            self.metrics.record_agent_execution(self.agent_type, "failure", duration)

            self.logger.error(
                "agent_execution_failed",
                agent=self.name,
                error=str(e),
                duration=duration,
            )
            raise

        finally:
            self._is_busy = False

    @abstractmethod
    async def _execute(self, task: dict[str, Any]) -> dict[str, Any]:
        """Internal execution logic to be implemented by subclasses."""

    @abstractmethod
    async def validate(self, task: dict[str, Any]) -> bool:
        """Validate task input."""

    async def _initialize(self) -> None:
        """Internal initialization logic."""

    async def _shutdown(self) -> None:
        """Internal shutdown logic."""

    def get_capabilities(self) -> list[AgentCapability]:
        """Get agent capabilities."""
        return self.capabilities

    def add_capability(self, capability: AgentCapability) -> None:
        """Add a new capability."""
        self.capabilities.append(capability)

    @property
    def is_busy(self) -> bool:
        """Check if agent is busy."""
        return self._is_busy

    @property
    def success_rate(self) -> float:
        """Calculate success rate."""
        if self.metadata.execution_count == 0:
            return 0.0
        return self.metadata.success_count / self.metadata.execution_count
