"""Base agent class for all agents in the Vision Cortex system."""

import logging
from abc import ABC, abstractmethod
from datetime import datetime
from enum import Enum
from typing import Any, dict


class AgentStatus(Enum):
    """Agent status states."""
    IDLE = "idle"
    RUNNING = "running"
    ERROR = "error"
    STOPPED = "stopped"


class BaseAgent(ABC):
    """
    Abstract base class for all agents.

    All agents must inherit from this class and implement the required methods.
    """

    def __init__(self, config, name: str):
        """
        Initialize the agent.

        Args:
            config: System configuration
            name: Agent name
        """
        self.config = config
        self.name = name
        self.status = AgentStatus.IDLE
        self.logger = logging.getLogger(f"agent.{name}")
        self.metadata = {
            'created_at': datetime.utcnow().isoformat(),
            'executions': 0,
            'errors': 0,
            'last_execution': None
        }

    async def start(self):
        """Start the agent."""
        self.logger.info(f"{self.name} agent starting...")
        self.status = AgentStatus.RUNNING
        await self.on_start()

    async def stop(self):
        """Stop the agent."""
        self.logger.info(f"{self.name} agent stopping...")
        self.status = AgentStatus.STOPPED
        await self.on_stop()

    async def execute(self) -> Any:
        """
        Execute the agent's main task.

        Returns:
            Result of the execution
        """
        try:
            self.status = AgentStatus.RUNNING
            self.metadata['executions'] += 1
            self.metadata['last_execution'] = datetime.utcnow().isoformat()

            result = await self.run()

            self.status = AgentStatus.IDLE
            return result

        except Exception as e:
            self.logger.error(f"Error in {self.name} execution: {e}", exc_info=True)
            self.status = AgentStatus.ERROR
            self.metadata['errors'] += 1
            raise

    async def health_check(self) -> dict[str, Any]:
        """
        Check agent health.

        Returns:
            Health status dictionary
        """
        return {
            'name': self.name,
            'status': self.status.value,
            'metadata': self.metadata,
            'healthy': self.status != AgentStatus.ERROR
        }

    def get_status(self) -> dict[str, Any]:
        """Get agent status."""
        return {
            'name': self.name,
            'status': self.status.value,
            'metadata': self.metadata
        }

    async def debate(self, issue: dict[str, Any], previous_positions: list) -> dict[str, Any]:
        """
        Participate in a debate.

        Args:
            issue: The issue being debated
            previous_positions: Previous positions from other agents

        Returns:
            Agent's position on the issue
        """
        # Default implementation - can be overridden by specific agents
        return {
            'agent': self.name,
            'position': 'neutral',
            'reasoning': 'No strong opinion on this issue',
            'timestamp': datetime.utcnow().isoformat()
        }

    # Abstract methods that must be implemented by subclasses

    @abstractmethod
    async def on_start(self):
        """Called when agent starts. Must be implemented by subclass."""

    @abstractmethod
    async def on_stop(self):
        """Called when agent stops. Must be implemented by subclass."""

    @abstractmethod
    async def run(self) -> Any:
        """Main agent logic. Must be implemented by subclass."""
