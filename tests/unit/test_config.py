"""Tests for core configuration."""

import pytest

from infinity_matrix.core.config import Settings, get_settings


def test_settings_defaults():
    """Test default settings values."""
    settings = Settings()
    assert settings.environment == "development"
    assert settings.debug is False
    assert settings.api_host == "0.0.0.0"
    assert settings.api_port == 8000


def test_settings_validation():
    """Test settings validation."""
    # Valid environment
    settings = Settings(environment="production")
    assert settings.environment == "production"

    # Invalid environment should raise error
    with pytest.raises(ValueError):
        Settings(environment="invalid")


def test_settings_log_level_validation():
    """Test log level validation."""
    # Valid log level
    settings = Settings(log_level="DEBUG")
    assert settings.log_level == "DEBUG"

    # Invalid log level should raise error
    with pytest.raises(ValueError):
        Settings(log_level="INVALID")


def test_settings_is_production():
    """Test production environment check."""
    settings = Settings(environment="production")
    assert settings.is_production is True
    assert settings.is_development is False


def test_settings_is_development():
    """Test development environment check."""
    settings = Settings(environment="development")
    assert settings.is_development is True
    assert settings.is_production is False


def test_get_settings_cached():
    """Test that get_settings returns cached instance."""
    settings1 = get_settings()
    settings2 = get_settings()
    assert settings1 is settings2
