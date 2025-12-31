"""LLM provider factory."""

from typing import Dict, Any, Optional
import logging

from infinity_matrix.llm.base import BaseLLMProvider
from infinity_matrix.llm.openai_provider import OpenAIProvider
from infinity_matrix.llm.ollama_provider import OllamaProvider

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
        config: Dict[str, Any]
    ) -> Optional[BaseLLMProvider]:
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
        """List all registered providers."""
        return list(cls._providers.keys())
