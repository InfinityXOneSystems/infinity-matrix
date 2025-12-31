"""Test configuration."""

import pytest


@pytest.fixture(autouse=True)
def reset_environment(monkeypatch):
    """Reset environment for each test."""
    # Clear environment variables that might interfere
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
