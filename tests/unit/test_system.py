"""Unit tests for main system."""

import pytest

from infinity_matrix.core.config import Config
from infinity_matrix.core.system import InfinityMatrix


@pytest.mark.asyncio
async def test_system_initialization():
    """Test system initialization."""
    config = Config()
    system = InfinityMatrix(config)

    assert system.config is config
    assert system.registry is not None


@pytest.mark.asyncio
async def test_system_start_stop():
    """Test system lifecycle."""
    config = Config()
    system = InfinityMatrix(config)

    await system.start()
    assert system._running is True

    await system.stop()
    assert system._running is False


@pytest.mark.asyncio
async def test_system_status():
    """Test system status reporting."""
    config = Config()
    system = InfinityMatrix(config)

    await system.start()

    status = await system.get_status()
    assert status["running"] is True
    assert "version" in status
    assert "components" in status
    assert "registry" in status

    await system.stop()
