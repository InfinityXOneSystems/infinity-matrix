"""
Base Agent - Abstract base class for all agents in the system.
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, dict, list

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """Abstract base class for all agents."""

    def __init__(
        self,
        agent_id: str,
        agent_type: str,
        roles: list[str],
        permissions: list[str],
        capabilities: list[str]
    ):
        self.agent_id = agent_id
        self.agent_type = agent_type
        self.roles = roles
        self.permissions = permissions
        self.capabilities = capabilities
        self.is_running = False
        self.registry = None
        self.cortex = None
        self._heartbeat_task: asyncio.Task | None = None
        self.heartbeat_interval = 30  # seconds
        logger.info(f"Agent initialized: {agent_id} (type: {agent_type})")

    def connect_registry(self, registry) -> None:
        """Connect to the agent registry."""
        self.registry = registry
        logger.info(f"{self.agent_id}: Connected to registry")

    def connect_cortex(self, cortex) -> None:
        """Connect to the vision cortex."""
        self.cortex = cortex
        logger.info(f"{self.agent_id}: Connected to cortex")

    async def register(self) -> bool:
        """Register with the agent registry."""
        if not self.registry:
            logger.error(f"{self.agent_id}: Registry not connected")
            return False

        from agent_registry import AgentType

        # Map agent type string to enum
        type_map = {
            "financial": AgentType.FINANCIAL,
            "real_estate": AgentType.REAL_ESTATE,
            "loan": AgentType.LOAN,
            "analytics": AgentType.ANALYTICS,
            "nlp": AgentType.NLP,
            "crawler": AgentType.CRAWLER,
            "custom": AgentType.CUSTOM
        }

        agent_type_enum = type_map.get(self.agent_type, AgentType.CUSTOM)

        return self.registry.register_agent(
            agent_id=self.agent_id,
            agent_type=agent_type_enum,
            roles=self.roles,
            permissions=self.permissions,
            capabilities=self.capabilities,
            metadata=self.get_metadata()
        )

    async def unregister(self) -> bool:
        """Unregister from the agent registry."""
        if not self.registry:
            return False

        return self.registry.unregister_agent(self.agent_id)

    async def _heartbeat_loop(self) -> None:
        """Send periodic heartbeats to registry."""
        while self.is_running:
            try:
                if self.registry:
                    self.registry.heartbeat(self.agent_id, self.get_status())
                await asyncio.sleep(self.heartbeat_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"{self.agent_id}: Error in heartbeat loop: {e}")

    async def start(self) -> None:
        """Start the agent."""
        if self.is_running:
            logger.warning(f"{self.agent_id}: Agent already running")
            return

        self.is_running = True
        logger.info(f"{self.agent_id}: Starting agent")

        # Register with registry
        if self.registry:
            await self.register()

        # Start heartbeat
        self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())

        # Run agent-specific initialization
        await self.on_start()

    async def stop(self) -> None:
        """Stop the agent."""
        if not self.is_running:
            logger.warning(f"{self.agent_id}: Agent not running")
            return

        self.is_running = False
        logger.info(f"{self.agent_id}: Stopping agent")

        # Stop heartbeat
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
            try:
                await self._heartbeat_task
            except asyncio.CancelledError:
                pass

        # Run agent-specific cleanup
        await self.on_stop()

        # Unregister from registry
        if self.registry:
            await self.unregister()

    @abstractmethod
    async def process_request(self, request: dict[str, Any]) -> dict[str, Any]:
        """Process a request. Must be implemented by subclasses."""

    @abstractmethod
    async def on_start(self) -> None:
        """Called when agent starts. Can be overridden by subclasses."""

    @abstractmethod
    async def on_stop(self) -> None:
        """Called when agent stops. Can be overridden by subclasses."""

    def get_status(self) -> dict[str, Any]:
        """Get agent status."""
        return {
            "agent_id": self.agent_id,
            "agent_type": self.agent_type,
            "is_running": self.is_running,
            "timestamp": datetime.utcnow().isoformat()
        }

    def get_metadata(self) -> dict[str, Any]:
        """Get agent metadata."""
        return {
            "agent_type": self.agent_type,
            "capabilities": self.capabilities,
            "version": "1.0.0"
        }
