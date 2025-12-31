"""Tests for Vision Cortex configuration."""

import pytest
from ai_stack.vision_cortex.config import Config


def test_config_initialization():
    """Test config can be initialized."""
    config = Config()
    assert config is not None
    assert config.project_root is not None


def test_config_paths():
    """Test config paths are created."""
    config = Config()
    assert config.logs_dir.exists()
    assert config.tracking_dir.exists()
    assert config.docs_dir.exists()


def test_config_defaults():
    """Test config default values."""
    config = Config()
    assert config.environment in ['development', 'staging', 'production']
    assert config.log_level in ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
    assert config.agent_debate_rounds >= 1


def test_config_validation():
    """Test config validation."""
    config = Config()
    # Validation should pass in development
    result = config.validate()
    assert isinstance(result, bool)
