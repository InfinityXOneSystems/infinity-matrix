"""Agent Registry - Dynamic agent registration and discovery system."""

import asyncio
from typing import dict, list

from infinity_matrix.agents.base_agent import BaseAgent
from infinity_matrix.core.base import BaseService
from infinity_matrix.core.config import get_settings
from infinity_matrix.core.logging import get_logger

logger = get_logger(__name__)


class AgentRegistry(BaseService):
    """Centralized agent registry for discovery and management."""

    def __init__(self) -> None:
        """Initialize agent registry."""
        super().__init__(name="agent_registry")
        self.settings = get_settings()
        self._agents: dict[str, BaseAgent] = {}
        self._agents_by_type: dict[str, list[BaseAgent]] = {}
        self._lock = asyncio.Lock()

    async def _initialize(self) -> None:
        """Initialize registry."""
        self.logger.info("agent_registry_initializing")

    async def _shutdown(self) -> None:
        """Shutdown registry and all agents."""
        self.logger.info("agent_registry_shutting_down")
        async with self._lock:
            for agent in self._agents.values():
                try:
                    await agent.shutdown()
                except Exception as e:
                    self.logger.error(
                        "agent_shutdown_failed",
                        agent=agent.name,
                        error=str(e),
                    )
            self._agents.clear()
            self._agents_by_type.clear()

    async def register(self, agent: BaseAgent) -> None:
        """Register an agent."""
        async with self._lock:
            if agent.name in self._agents:
                raise ValueError(f"Agent {agent.name} already registered")

            # Initialize agent
            await agent.initialize()

            # Register agent
            self._agents[agent.name] = agent

            # Index by type
            if agent.agent_type not in self._agents_by_type:
                self._agents_by_type[agent.agent_type] = []
            self._agents_by_type[agent.agent_type].append(agent)

            self.logger.info(
                "agent_registered",
                agent=agent.name,
                type=agent.agent_type,
                total_agents=len(self._agents),
            )

    async def unregister(self, agent_name: str) -> None:
        """Unregister an agent."""
        async with self._lock:
            if agent_name not in self._agents:
                raise ValueError(f"Agent {agent_name} not found")

            agent = self._agents[agent_name]

            # Shutdown agent
            await agent.shutdown()

            # Remove from registry
            del self._agents[agent_name]

            # Remove from type index
            if agent.agent_type in self._agents_by_type:
                self._agents_by_type[agent.agent_type] = [
                    a for a in self._agents_by_type[agent.agent_type] if a.name != agent_name
                ]
                if not self._agents_by_type[agent.agent_type]:
                    del self._agents_by_type[agent.agent_type]

            self.logger.info(
                "agent_unregistered",
                agent=agent_name,
                total_agents=len(self._agents),
            )

    def get_agent(self, agent_name: str) -> BaseAgent | None:
        """Get agent by name."""
        return self._agents.get(agent_name)

    def get_agents_by_type(self, agent_type: str) -> list[BaseAgent]:
        """Get all agents of a specific type."""
        return self._agents_by_type.get(agent_type, [])

    def list_agents(self) -> list[BaseAgent]:
        """list all registered agents."""
        return list(self._agents.values())

    def list_agent_types(self) -> list[str]:
        """list all registered agent types."""
        return list(self._agents_by_type.keys())

    async def get_available_agent(self, agent_type: str) -> BaseAgent | None:
        """Get an available (not busy) agent of specified type."""
        agents = self.get_agents_by_type(agent_type)
        for agent in agents:
            if not agent.is_busy:
                return agent
        return None

    async def execute_on_agent(self, agent_name: str, task: dict) -> dict:
        """Execute task on specific agent."""
        agent = self.get_agent(agent_name)
        if not agent:
            raise ValueError(f"Agent {agent_name} not found")

        return await agent.execute(task)

    async def execute_on_available_agent(self, agent_type: str, task: dict) -> dict:
        """Execute task on any available agent of specified type."""
        agent = await self.get_available_agent(agent_type)
        if not agent:
            raise RuntimeError(f"No available agent of type {agent_type}")

        return await agent.execute(task)

    async def get_registry_status(self) -> dict:
        """Get registry status."""
        agent_statuses = []
        for agent in self._agents.values():
            health = await agent.health_check()
            agent_statuses.append(health)

        return {
            "total_agents": len(self._agents),
            "agent_types": list(self._agents_by_type.keys()),
            "agents": agent_statuses,
        }


# Global registry instance
_registry: AgentRegistry | None = None


def get_registry() -> AgentRegistry:
    """Get global agent registry instance."""
    global _registry
    if _registry is None:
        _registry = AgentRegistry()
    return _registry
