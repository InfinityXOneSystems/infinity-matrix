"""Base agent interface and common functionality."""

from abc import ABC, abstractmethod
from datetime import datetime
from enum import Enum
from typing import Any
from uuid import uuid4

from pydantic import BaseModel, Field


class AgentType(str, Enum):
    """Types of agents in the system."""

    CRAWLER = "crawler"
    INGESTION = "ingestion"
    PREDICTOR = "predictor"
    CEO = "ceo"
    STRATEGIST = "strategist"
    ORGANIZER = "organizer"
    VALIDATOR = "validator"
    DOCUMENTOR = "documentor"


class AgentStatus(str, Enum):
    """Agent execution status."""

    IDLE = "idle"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AgentTask(BaseModel):
    """Task assigned to an agent."""

    id: str = Field(default_factory=lambda: str(uuid4()))
    agent_type: AgentType
    action: str
    input_data: dict[str, Any] = Field(default_factory=dict)
    context: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AgentResult(BaseModel):
    """Result from agent execution."""

    task_id: str
    agent_type: AgentType
    status: AgentStatus
    output_data: dict[str, Any] = Field(default_factory=dict)
    error: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = None
    duration_seconds: float | None = None


class BaseAgent(ABC):
    """
    Base class for all agents in the system.

    Each agent is a specialized component that performs specific tasks
    in the auto-builder pipeline.
    """

    def __init__(self, agent_type: AgentType, config: dict[str, Any] | None = None):
        """Initialize the agent."""
        self.agent_type = agent_type
        self.config = config or {}
        self.status = AgentStatus.IDLE

    @abstractmethod
    async def execute(self, task: AgentTask) -> AgentResult:
        """
        Execute a task.

        Args:
            task: The task to execute

        Returns:
            AgentResult with the execution results
        """

    async def validate_task(self, task: AgentTask) -> bool:
        """
        Validate if the task can be executed by this agent.

        Args:
            task: The task to validate

        Returns:
            True if task is valid for this agent
        """
        return task.agent_type == self.agent_type

    def get_capabilities(self) -> list[str]:
        """
        Get the list of capabilities this agent provides.

        Returns:
            list of capability names
        """
        return []

    def __repr__(self) -> str:
        """String representation."""
        return f"<{self.__class__.__name__}(type={self.agent_type}, status={self.status})>"
