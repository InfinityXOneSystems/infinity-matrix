"""Agent registry for managing and discovering agents."""

import asyncio
import uuid
from datetime import UTC, datetime, timedelta
from enum import Enum
from typing import Any, dict, list

from pydantic import BaseModel, Field


class AgentStatus(str, Enum):
    """Agent status enumeration."""

    INITIALIZING = "initializing"
    IDLE = "idle"
    RUNNING = "running"
    PAUSED = "paused"
    ERROR = "error"
    STOPPED = "stopped"


class AgentCapability(str, Enum):
    """Agent capability types."""

    VISION = "vision"
    BUILD = "build"
    DOCUMENTATION = "documentation"
    INDEXING = "indexing"
    CLASSIFICATION = "classification"
    CODE_REVIEW = "code_review"
    MERGE = "merge"
    SCRAPING = "scraping"
    ETL = "etl"
    ORCHESTRATION = "orchestration"


from pydantic import ConfigDict


class AgentMetadata(BaseModel):
    """Agent metadata."""

    model_config = ConfigDict(use_enum_values=True)

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str
    capabilities: list[AgentCapability] = Field(default_factory=list)
    status: AgentStatus = Field(default=AgentStatus.INITIALIZING)
    version: str = Field(default="0.1.0")

    # Runtime information
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    last_heartbeat: datetime = Field(default_factory=lambda: datetime.now(UTC))
    tasks_completed: int = Field(default=0)
    tasks_failed: int = Field(default=0)

    # Configuration
    config: dict[str, Any] = Field(default_factory=dict)
    tags: list[str] = Field(default_factory=list)


class AgentRegistry:
    """Central registry for agent discovery and management."""

    def __init__(self, backend: str = "memory"):
        """Initialize the agent registry.

        Args:
            backend: Storage backend type (memory, redis, postgresql)
        """
        self.backend = backend
        self._agents: dict[str, AgentMetadata] = {}
        self._agent_instances: dict[str, Any] = {}
        self._locks: dict[str, asyncio.Lock] = {}
        self._heartbeat_task: asyncio.Task | None = None
        self._running = False

    async def start(self) -> None:
        """Start the registry and background tasks."""
        if self._running:
            return

        self._running = True
        self._heartbeat_task = asyncio.create_task(self._heartbeat_monitor())

    async def stop(self) -> None:
        """Stop the registry and background tasks."""
        self._running = False

        if self._heartbeat_task:
            self._heartbeat_task.cancel()
            try:
                await self._heartbeat_task
            except asyncio.CancelledError:
                pass

    async def register(
        self,
        agent: Any,
        metadata: AgentMetadata
    ) -> str:
        """Register a new agent.

        Args:
            agent: Agent instance
            metadata: Agent metadata

        Returns:
            Agent ID
        """
        agent_id = metadata.id

        async with self._get_lock(agent_id):
            self._agents[agent_id] = metadata
            self._agent_instances[agent_id] = agent
            metadata.status = AgentStatus.IDLE
            metadata.last_heartbeat = datetime.now(UTC)

        return agent_id

    async def unregister(self, agent_id: str) -> None:
        """Unregister an agent.

        Args:
            agent_id: Agent identifier
        """
        async with self._get_lock(agent_id):
            self._agents.pop(agent_id, None)
            self._agent_instances.pop(agent_id, None)
            self._locks.pop(agent_id, None)

    async def get_agent(self, agent_id: str) -> Any | None:
        """Get agent instance by ID.

        Args:
            agent_id: Agent identifier

        Returns:
            Agent instance or None
        """
        return self._agent_instances.get(agent_id)

    async def get_metadata(self, agent_id: str) -> AgentMetadata | None:
        """Get agent metadata by ID.

        Args:
            agent_id: Agent identifier

        Returns:
            Agent metadata or None
        """
        return self._agents.get(agent_id)

    async def update_status(
        self,
        agent_id: str,
        status: AgentStatus
    ) -> None:
        """Update agent status.

        Args:
            agent_id: Agent identifier
            status: New status
        """
        if agent_id in self._agents:
            self._agents[agent_id].status = status
            self._agents[agent_id].last_heartbeat = datetime.now(UTC)

    async def heartbeat(self, agent_id: str) -> None:
        """Record agent heartbeat.

        Args:
            agent_id: Agent identifier
        """
        if agent_id in self._agents:
            self._agents[agent_id].last_heartbeat = datetime.now(UTC)

    async def find_agents(
        self,
        capability: AgentCapability | None = None,
        status: AgentStatus | None = None,
        tags: list[str] | None = None
    ) -> list[AgentMetadata]:
        """Find agents matching criteria.

        Args:
            capability: Required capability
            status: Required status
            tags: Required tags

        Returns:
            list of matching agent metadata
        """
        results = []

        for metadata in self._agents.values():
            # Check capability
            if capability and capability not in metadata.capabilities:
                continue

            # Check status
            if status and metadata.status != status:
                continue

            # Check tags
            if tags and not all(tag in metadata.tags for tag in tags):
                continue

            results.append(metadata)

        return results

    async def list_agents(self) -> list[AgentMetadata]:
        """list all registered agents.

        Returns:
            list of all agent metadata
        """
        return list(self._agents.values())

    async def get_statistics(self) -> dict[str, Any]:
        """Get registry statistics.

        Returns:
            Statistics dictionary
        """
        total = len(self._agents)
        by_status = {}
        by_type = {}
        total_tasks = 0
        total_failures = 0

        for metadata in self._agents.values():
            # Count by status
            status = metadata.status
            by_status[status] = by_status.get(status, 0) + 1

            # Count by type
            agent_type = metadata.type
            by_type[agent_type] = by_type.get(agent_type, 0) + 1

            # Sum tasks
            total_tasks += metadata.tasks_completed
            total_failures += metadata.tasks_failed

        return {
            "total_agents": total,
            "by_status": by_status,
            "by_type": by_type,
            "total_tasks_completed": total_tasks,
            "total_tasks_failed": total_failures,
            "success_rate": (
                total_tasks / (total_tasks + total_failures)
                if (total_tasks + total_failures) > 0
                else 0.0
            ),
        }

    def _get_lock(self, agent_id: str) -> asyncio.Lock:
        """Get or create lock for agent.

        Args:
            agent_id: Agent identifier

        Returns:
            Asyncio lock
        """
        if agent_id not in self._locks:
            self._locks[agent_id] = asyncio.Lock()
        return self._locks[agent_id]

    async def _heartbeat_monitor(self) -> None:
        """Monitor agent heartbeats and mark stale agents."""
        timeout = timedelta(minutes=5)

        while self._running:
            try:
                now = datetime.now(UTC)

                for agent_id, metadata in list(self._agents.items()):
                    if now - metadata.last_heartbeat > timeout:
                        # Agent is stale
                        if metadata.status not in (AgentStatus.STOPPED, AgentStatus.ERROR):
                            await self.update_status(agent_id, AgentStatus.ERROR)

                await asyncio.sleep(30)  # Check every 30 seconds

            except asyncio.CancelledError:
                break
            except Exception:
                await asyncio.sleep(30)
