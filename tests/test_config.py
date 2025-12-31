"""Tests for core configuration."""

import pytest
from pathlib import Path
from infinity_matrix.core.config import Config, AIConfig, SecurityConfig, AgentConfig


def test_default_config():
    """Test default configuration values."""
    config = Config()
    
    assert config.version == "0.1.0"
    assert config.ai.provider == "openai"
    assert config.security.encryption_enabled is True
    assert config.agents.enabled is True


def test_ai_config():
    """Test AI configuration."""
    ai_config = AIConfig(
        provider="anthropic",
        model="claude-3",
        max_tokens=8000
    )
    
    assert ai_config.provider == "anthropic"
    assert ai_config.model == "claude-3"
    assert ai_config.max_tokens == 8000


def test_security_config():
    """Test security configuration."""
    security_config = SecurityConfig(
        encryption_enabled=True,
        rbac_enabled=True,
        audit_logging=True
    )
    
    assert security_config.encryption_enabled is True
    assert security_config.rbac_enabled is True
    assert security_config.audit_logging is True


def test_agent_config():
    """Test agent configuration."""
    agent_config = AgentConfig(
        enabled=True,
        auto_heal=True,
        frameworks=["langchain", "autogpt"]
    )
    
    assert agent_config.enabled is True
    assert agent_config.auto_heal is True
    assert "langchain" in agent_config.frameworks


def test_config_load_and_save(tmp_path):
    """Test configuration load and save."""
    config_path = tmp_path / "config.yaml"
    
    # Create and save config
    config = Config()
    config.save(config_path)
    
    assert config_path.exists()
    
    # Load config
    loaded_config = Config.load(config_path)
    assert loaded_config.version == config.version
    assert loaded_config.ai.provider == config.ai.provider
