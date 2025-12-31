"""Unit tests for core configuration."""

import pytest
from pathlib import Path

from infinity_matrix.core.config import Config, load_config


def test_config_defaults():
    """Test default configuration values."""
    config = Config()
    
    assert config.debug is False
    assert config.log_level == "INFO"
    assert config.agents.max_concurrent == 10
    assert config.vision.enabled is True
    assert config.builder.enabled is True


def test_config_from_env(monkeypatch):
    """Test configuration from environment variables."""
    monkeypatch.setenv("INFINITY_MATRIX_DEBUG", "true")
    monkeypatch.setenv("INFINITY_MATRIX_LOG_LEVEL", "DEBUG")
    
    config = Config.from_env()
    
    assert config.debug is True
    assert config.log_level == "DEBUG"


def test_config_save_load(tmp_path):
    """Test saving and loading configuration."""
    config = Config()
    config.debug = True
    config.log_level = "DEBUG"
    
    config_path = tmp_path / "config.yaml"
    config.save(config_path)
    
    assert config_path.exists()
    
    loaded = Config.from_file(config_path)
    assert loaded.debug is True
    assert loaded.log_level == "DEBUG"


def test_ensure_directories(tmp_path):
    """Test directory creation."""
    config = Config()
    config.data_dir = tmp_path / "data"
    
    config.ensure_directories()
    
    assert (config.data_dir / "logs").exists()
    assert (config.data_dir / "cache").exists()
    assert (config.data_dir / "agents").exists()
