"""Agent registry for managing autonomous agents."""

from datetime import datetime
from enum import Enum
from typing import Any, Optional, dict, list
from uuid import uuid4

from pydantic import BaseModel, Field


class AgentStatus(str, Enum):
    """Agent status enumeration."""
    IDLE = "idle"
    RUNNING = "running"
    PAUSED = "paused"
    FAILED = "failed"
    STOPPED = "stopped"


class AgentType(str, Enum):
    """Agent type enumeration."""
    CODE_REVIEW = "code_review"
    AUTO_UPDATE = "auto_update"
    MONITORING = "monitoring"
    SECURITY_SCAN = "security_scan"
    DOCUMENTATION = "documentation"
    TESTING = "testing"
    DEPLOYMENT = "deployment"
    CUSTOM = "custom"


class Agent(BaseModel):
    """Agent model."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    type: AgentType
    status: AgentStatus = AgentStatus.IDLE
    config: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_run: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class AgentRegistry:
    """Registry for managing agents."""

    def __init__(self):
        self._agents: dict[str, Agent] = {}

    def register(self, agent: Agent) -> None:
        """Register a new agent."""
        self._agents[agent.id] = agent

    def unregister(self, agent_id: str) -> None:
        """Unregister an agent."""
        if agent_id in self._agents:
            del self._agents[agent_id]

    def get(self, agent_id: str) -> Agent | None:
        """Get agent by ID."""
        return self._agents.get(agent_id)

    def list(
        self,
        type: AgentType | None = None,
        status: AgentStatus | None = None
    ) -> list[Agent]:
        """list agents with optional filtering."""
        agents = list(self._agents.values())

        if type:
            agents = [a for a in agents if a.type == type]

        if status:
            agents = [a for a in agents if a.status == status]

        return agents

    def update_status(self, agent_id: str, status: AgentStatus) -> None:
        """Update agent status."""
        if agent_id in self._agents:
            self._agents[agent_id].status = status
            self._agents[agent_id].updated_at = datetime.utcnow()

    def update_last_run(self, agent_id: str) -> None:
        """Update agent last run time."""
        if agent_id in self._agents:
            self._agents[agent_id].last_run = datetime.utcnow()
            self._agents[agent_id].updated_at = datetime.utcnow()


# Global registry instance
_registry = AgentRegistry()


def get_registry() -> AgentRegistry:
    """Get the global agent registry."""
    return _registry
