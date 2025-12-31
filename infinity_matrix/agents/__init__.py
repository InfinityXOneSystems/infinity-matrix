"""Agent system initialization."""

from infinity_matrix.agents.base_agent import BaseAgent
from infinity_matrix.agents.registry import AgentRegistry, get_registry

__all__ = ["AgentRegistry", "BaseAgent", "get_registry"]
