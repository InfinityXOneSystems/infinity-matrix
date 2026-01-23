"""Base agent class and interfaces."""

import asyncio
from abc import ABC, abstractmethod
from typing import Any, dict, list

import structlog

from infinity_matrix.core.registry import AgentCapability, AgentMetadata, AgentRegistry, AgentStatus

logger = structlog.get_logger()


class BaseAgent(ABC):
    """Base class for all agents in the system."""

    def __init__(
        self,
        name: str,
        agent_type: str,
        capabilities: list[AgentCapability],
        registry: AgentRegistry | None = None,
        config: dict[str, Any] | None = None
    ):
        """Initialize the base agent.

        Args:
            name: Agent name
            agent_type: Agent type identifier
            capabilities: list of agent capabilities
            registry: Agent registry instance
            config: Agent configuration
        """
        self.name = name
        self.agent_type = agent_type
        self.capabilities = capabilities
        self.registry = registry
        self.config = config or {}

        self.metadata = AgentMetadata(
            name=name,
            type=agent_type,
            capabilities=capabilities,
            config=self.config
        )

        self.agent_id: str | None = None
        self._running = False
        self._heartbeat_task: asyncio.Task | None = None

    async def start(self) -> None:
        """Start the agent."""
        if self._running:
            return

        logger.info("Starting agent", name=self.name, type=self.agent_type)

        # Register with registry if available
        if self.registry:
            self.agent_id = await self.registry.register(self, self.metadata)

        # Initialize agent
        await self.initialize()

        # Start heartbeat
        self._running = True
        self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())

        # Update status
        if self.registry and self.agent_id:
            await self.registry.update_status(self.agent_id, AgentStatus.IDLE)

        logger.info("Agent started", name=self.name, agent_id=self.agent_id)

    async def stop(self) -> None:
        """Stop the agent."""
        if not self._running:
            return

        logger.info("Stopping agent", name=self.name)

        self._running = False

        # Cancel heartbeat
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
            try:
                await self._heartbeat_task
            except asyncio.CancelledError:
                pass

        # Cleanup agent
        await self.cleanup()

        # Update status
        if self.registry and self.agent_id:
            await self.registry.update_status(self.agent_id, AgentStatus.STOPPED)

        # Unregister
        if self.registry and self.agent_id:
            await self.registry.unregister(self.agent_id)

        logger.info("Agent stopped", name=self.name)

    async def execute_task(self, task: dict[str, Any]) -> dict[str, Any]:
        """Execute a task.

        Args:
            task: Task definition

        Returns:
            Task result
        """
        if not self._running:
            raise RuntimeError("Agent not running")

        logger.info("Executing task", agent=self.name, task_id=task.get("id"))

        # Update status
        if self.registry and self.agent_id:
            await self.registry.update_status(self.agent_id, AgentStatus.RUNNING)

        try:
            result = await self.process_task(task)

            # Update statistics
            if self.registry and self.agent_id:
                metadata = await self.registry.get_metadata(self.agent_id)
                if metadata:
                    metadata.tasks_completed += 1

            logger.info("Task completed", agent=self.name, task_id=task.get("id"))
            return result

        except Exception as e:
            # Update statistics
            if self.registry and self.agent_id:
                metadata = await self.registry.get_metadata(self.agent_id)
                if metadata:
                    metadata.tasks_failed += 1

            logger.error("Task failed", agent=self.name, task_id=task.get("id"), error=str(e))
            raise

        finally:
            # Update status back to idle
            if self.registry and self.agent_id:
                await self.registry.update_status(self.agent_id, AgentStatus.IDLE)

    @abstractmethod
    async def initialize(self) -> None:
        """Initialize the agent. Override in subclasses."""

    @abstractmethod
    async def cleanup(self) -> None:
        """Cleanup agent resources. Override in subclasses."""

    @abstractmethod
    async def process_task(self, task: dict[str, Any]) -> dict[str, Any]:
        """Process a task. Override in subclasses.

        Args:
            task: Task definition

        Returns:
            Task result
        """

    async def _heartbeat_loop(self) -> None:
        """Send periodic heartbeats to the registry."""
        while self._running:
            try:
                if self.registry and self.agent_id:
                    await self.registry.heartbeat(self.agent_id)

                await asyncio.sleep(30)  # Heartbeat every 30 seconds

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Heartbeat error", agent=self.name, error=str(e))
                await asyncio.sleep(30)
