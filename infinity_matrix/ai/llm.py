"""LLM integration for OpenAI, Anthropic, and local models."""

from abc import ABC, abstractmethod
from collections.abc import AsyncIterator, Any, , dict, Optional

from infinity_matrix.core.config import settings
from infinity_matrix.core.logging import LoggerMixin


class BaseLLM(ABC, LoggerMixin):
    """Base class for LLM providers."""

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> str:
        """Generate text from prompt."""

    @abstractmethod
    async def generate_stream(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> AsyncIterator[str]:
        """Stream generated text from prompt."""


class OpenAILLM(BaseLLM):
    """OpenAI GPT integration."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        """Initialize OpenAI client."""
        self.api_key = api_key or settings.openai_api_key
        self.model = model or settings.openai_model
        
        if not self.api_key:
            raise ValueError("OpenAI API key not provided")

        from openai import AsyncOpenAI
        self.client = AsyncOpenAI(api_key=self.api_key)
        
        self.log_info("openai_llm_initialized", model=self.model)

    async def generate(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None,
        **kwargs: Any,
    ) -> str:
        """Generate text using OpenAI."""
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens or settings.openai_max_tokens,
                temperature=temperature,
                **kwargs,
            )
            
            content = response.choices[0].message.content
            self.log_info("openai_generation_complete", tokens=len(content.split()))
            return content

        except Exception as e:
            self.log_error("openai_generation_failed", error=str(e))
            raise

    async def generate_stream(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None,
        **kwargs: Any,
    ) -> AsyncIterator[str]:
        """Stream text generation using OpenAI."""
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})

        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens or settings.openai_max_tokens,
                temperature=temperature,
                stream=True,
                **kwargs,
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            self.log_error("openai_streaming_failed", error=str(e))
            raise


class AnthropicLLM(BaseLLM):
    """Anthropic Claude integration."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        """Initialize Anthropic client."""
        self.api_key = api_key or settings.anthropic_api_key
        self.model = model or settings.anthropic_model
        
        if not self.api_key:
            raise ValueError("Anthropic API key not provided")

        from anthropic import AsyncAnthropic
        self.client = AsyncAnthropic(api_key=self.api_key)
        
        self.log_info("anthropic_llm_initialized", model=self.model)

    async def generate(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None,
        **kwargs: Any,
    ) -> str:
        """Generate text using Anthropic."""
        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens or 4096,
                temperature=temperature,
                system=system_prompt or "",
                messages=[{"role": "user", "content": prompt}],
                **kwargs,
            )
            
            content = response.content[0].text
            self.log_info("anthropic_generation_complete", tokens=len(content.split()))
            return content

        except Exception as e:
            self.log_error("anthropic_generation_failed", error=str(e))
            raise

    async def generate_stream(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None,
        **kwargs: Any,
    ) -> AsyncIterator[str]:
        """Stream text generation using Anthropic."""
        try:
            async with self.client.messages.stream(
                model=self.model,
                max_tokens=max_tokens or 4096,
                temperature=temperature,
                system=system_prompt or "",
                messages=[{"role": "user", "content": prompt}],
                **kwargs,
            ) as stream:
                async for text in stream.text_stream:
                    yield text

        except Exception as e:
            self.log_error("anthropic_streaming_failed", error=str(e))
            raise


class LLMFactory:
    """Factory for creating LLM instances."""

    @staticmethod
    def create(provider: str = "openai", **kwargs: Any) -> BaseLLM:
        """
        Create an LLM instance.
        
        Args:
            provider: LLM provider (openai, anthropic)
            **kwargs: Provider-specific arguments
            
        Returns:
            LLM instance
        """
        providers = {
            "openai": OpenAILLM,
            "anthropic": AnthropicLLM,
        }

        if provider not in providers:
            raise ValueError(f"Unknown provider: {provider}")

        return providers[provider](**kwargs)


# Convenience functions
async def generate_text(
    prompt: str,
    provider: str = "openai",
    **kwargs: Any,
) -> str:
    """Generate text using specified provider."""
    llm = LLMFactory.create(provider, **kwargs)
    return await llm.generate(prompt, **kwargs)


async def analyze_with_llm(
    data: str,
    analysis_type: str,
    provider: str = "openai",
    **kwargs: Any,
) -> dict[str, Any]:
    """
    Analyze data using LLM.
    
    Args:
        data: Data to analyze
        analysis_type: Type of analysis (sentiment, summary, extraction, etc.)
        provider: LLM provider
        **kwargs: Additional arguments
        
    Returns:
        Analysis results
    """
    prompts = {
        "sentiment": f"Analyze the sentiment of the following text and provide a score from -1 (very negative) to 1 (very positive), along with reasoning:\n\n{data}",
        "summary": f"Provide a concise summary of the following text:\n\n{data}",
        "extraction": f"Extract key information from the following text in JSON format:\n\n{data}",
        "classification": f"Classify the following text into relevant categories:\n\n{data}",
    }

    if analysis_type not in prompts:
        raise ValueError(f"Unknown analysis type: {analysis_type}")

    llm = LLMFactory.create(provider, **kwargs)
    result = await llm.generate(prompts[analysis_type])

    return {
        "analysis_type": analysis_type,
        "result": result,
        "provider": provider,
    }
