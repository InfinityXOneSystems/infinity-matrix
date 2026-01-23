"""Tests for base agent functionality."""

import pytest

from ai_stack.agents.base_agent import AgentStatus, BaseAgent


class TestAgent(BaseAgent):
    """Test agent implementation."""

    async def on_start(self):
        """Start handler."""

    async def on_stop(self):
        """Stop handler."""

    async def run(self):
        """Run handler."""
        return {"result": "success"}


@pytest.fixture
def test_agent(mocker):
    """Create a test agent."""
    config = mocker.Mock()
    return TestAgent(config, "test_agent")


def test_agent_initialization(test_agent):
    """Test agent can be initialized."""
    assert test_agent.name == "test_agent"
    assert test_agent.status == AgentStatus.IDLE


@pytest.mark.asyncio
async def test_agent_start(test_agent):
    """Test agent can start."""
    await test_agent.start()
    assert test_agent.status == AgentStatus.RUNNING


@pytest.mark.asyncio
async def test_agent_stop(test_agent):
    """Test agent can stop."""
    await test_agent.stop()
    assert test_agent.status == AgentStatus.STOPPED


@pytest.mark.asyncio
async def test_agent_execute(test_agent):
    """Test agent can execute."""
    result = await test_agent.execute()
    assert result == {"result": "success"}
    assert test_agent.metadata['executions'] == 1


@pytest.mark.asyncio
async def test_agent_health_check(test_agent):
    """Test agent health check."""
    health = await test_agent.health_check()
    assert health['name'] == "test_agent"
    assert health['healthy'] is True
