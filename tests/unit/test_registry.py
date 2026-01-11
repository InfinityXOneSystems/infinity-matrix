"""Unit tests for agent registry."""

import pytest

from infinity_matrix.core.registry import AgentCapability, AgentMetadata, AgentRegistry


@pytest.mark.asyncio
async def test_registry_start_stop():
    """Test registry lifecycle."""
    registry = AgentRegistry()

    await registry.start()
    assert registry._running is True

    await registry.stop()
    assert registry._running is False


@pytest.mark.asyncio
async def test_agent_registration():
    """Test agent registration."""
    registry = AgentRegistry()
    await registry.start()

    metadata = AgentMetadata(
        name="test-agent",
        type="test",
        capabilities=[AgentCapability.BUILD]
    )

    agent_id = await registry.register(None, metadata)
    assert agent_id == metadata.id

    retrieved = await registry.get_metadata(agent_id)
    assert retrieved is not None
    assert retrieved.name == "test-agent"

    await registry.stop()


@pytest.mark.asyncio
async def test_agent_unregistration():
    """Test agent unregistration."""
    registry = AgentRegistry()
    await registry.start()

    metadata = AgentMetadata(
        name="test-agent",
        type="test"
    )

    agent_id = await registry.register(None, metadata)
    await registry.unregister(agent_id)

    retrieved = await registry.get_metadata(agent_id)
    assert retrieved is None

    await registry.stop()


@pytest.mark.asyncio
async def test_find_agents():
    """Test finding agents by criteria."""
    registry = AgentRegistry()
    await registry.start()

    # Register multiple agents
    for i in range(3):
        metadata = AgentMetadata(
            name=f"agent-{i}",
            type="test",
            capabilities=[AgentCapability.BUILD] if i % 2 == 0 else []
        )
        await registry.register(None, metadata)

    # Find by capability
    agents = await registry.find_agents(capability=AgentCapability.BUILD)
    assert len(agents) == 2

    await registry.stop()


@pytest.mark.asyncio
async def test_registry_statistics():
    """Test registry statistics."""
    registry = AgentRegistry()
    await registry.start()

    metadata = AgentMetadata(
        name="test-agent",
        type="test"
    )
    metadata.tasks_completed = 10
    metadata.tasks_failed = 2

    await registry.register(None, metadata)

    stats = await registry.get_statistics()
    assert stats["total_agents"] == 1
    assert stats["total_tasks_completed"] == 10
    assert stats["total_tasks_failed"] == 2

    await registry.stop()
