"""Tests for agent registry."""

import pytest

from infinity_matrix.agents import AgentRegistry, BaseAgent


class TestAgent(BaseAgent):
    """Test agent implementation."""

    def __init__(self, name: str = "test-agent"):
        super().__init__(name=name, agent_type="test", description="Test agent")

    async def _execute(self, task):
        return {"result": "success"}

    async def validate(self, task):
        return True


@pytest.mark.asyncio
async def test_registry_initialization():
    """Test registry initialization."""
    registry = AgentRegistry()
    await registry.initialize()
    assert registry.is_initialized
    await registry.shutdown()


@pytest.mark.asyncio
async def test_register_agent():
    """Test agent registration."""
    registry = AgentRegistry()
    await registry.initialize()

    agent = TestAgent()
    await registry.register(agent)

    assert len(registry.list_agents()) == 1
    assert registry.get_agent("test-agent") is not None

    await registry.shutdown()


@pytest.mark.asyncio
async def test_unregister_agent():
    """Test agent unregistration."""
    registry = AgentRegistry()
    await registry.initialize()

    agent = TestAgent()
    await registry.register(agent)
    await registry.unregister("test-agent")

    assert len(registry.list_agents()) == 0
    assert registry.get_agent("test-agent") is None

    await registry.shutdown()


@pytest.mark.asyncio
async def test_get_agents_by_type():
    """Test getting agents by type."""
    registry = AgentRegistry()
    await registry.initialize()

    agent1 = TestAgent(name="test-agent-1")
    agent2 = TestAgent(name="test-agent-2")

    await registry.register(agent1)
    await registry.register(agent2)

    test_agents = registry.get_agents_by_type("test")
    assert len(test_agents) == 2

    await registry.shutdown()


@pytest.mark.asyncio
async def test_execute_on_agent():
    """Test executing task on agent."""
    registry = AgentRegistry()
    await registry.initialize()

    agent = TestAgent()
    await registry.register(agent)

    result = await registry.execute_on_agent("test-agent", {"action": "test"})
    assert result["result"] == "success"

    await registry.shutdown()
