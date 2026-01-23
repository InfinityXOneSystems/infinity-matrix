"""LLM provider factory."""

import logging
from typing import Any, dict

from infinity_matrix.llm.base import BaseLLMProvider
from infinity_matrix.llm.ollama_provider import OllamaProvider
from infinity_matrix.llm.openai_provider import OpenAIProvider

logger = logging.getLogger(__name__)


class LLMFactory:
    """Factory for creating LLM providers."""

    _providers = {
        "openai": OpenAIProvider,
        "ollama": OllamaProvider,
    }

    @classmethod
    def create_provider(
        cls,
        provider_name: str,
        config: dict[str, Any]
    ) -> BaseLLMProvider | None:
        """Create an LLM provider instance.

        Args:
            provider_name: Name of the provider (openai, ollama, etc.)
            config: Provider configuration

        Returns:
            Provider instance or None if not found
        """
        provider_class = cls._providers.get(provider_name.lower())

        if provider_class is None:
            logger.error(f"Unknown LLM provider: {provider_name}")
            return None

        try:
            provider = provider_class(config)
            if not provider.validate_config():
                logger.error(f"Invalid configuration for {provider_name}")
                return None
            return provider
        except Exception as e:
            logger.error(f"Error creating {provider_name} provider: {e}")
            return None

    @classmethod
    def register_provider(cls, name: str, provider_class: type):
        """Register a custom provider.

        Args:
            name: Provider name
            provider_class: Provider class
        """
        cls._providers[name.lower()] = provider_class

    @classmethod
    def list_providers(cls) -> list:
        """list all registered providers."""
        return list(cls._providers.keys())
