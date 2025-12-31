"""Test suite initialization."""

import pytest


@pytest.fixture
def sample_config():
    """Sample configuration for testing."""
    from infinity_matrix.core.config import Config
    return Config()


@pytest.fixture
async def registry():
    """Agent registry fixture."""
    from infinity_matrix.core.registry import AgentRegistry
    
    reg = AgentRegistry()
    await reg.start()
    yield reg
    await reg.stop()


@pytest.fixture
async def system():
    """System fixture."""
    from infinity_matrix.core.config import Config
    from infinity_matrix.core.system import InfinityMatrix
    
    config = Config()
    sys = InfinityMatrix(config)
    await sys.start()
    yield sys
    await sys.stop()
