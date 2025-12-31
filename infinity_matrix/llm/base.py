"""Base LLM provider interface."""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import logging

from infinity_matrix.models import NormalizedData, AnalysisResult

logger = logging.getLogger(__name__)


class BaseLLMProvider(ABC):
    """Base class for all LLM providers."""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize LLM provider.
        
        Args:
            config: Provider-specific configuration
        """
        self.config = config
        self.logger = logging.getLogger(self.__class__.__name__)
    
    @abstractmethod
    async def analyze(
        self,
        data: NormalizedData,
        prompt_template: str,
        **kwargs
    ) -> AnalysisResult:
        """Analyze data using the LLM.
        
        Args:
            data: The normalized data to analyze
            prompt_template: The prompt template to use
            **kwargs: Additional provider-specific arguments
            
        Returns:
            Analysis result
        """
        pass
    
    async def batch_analyze(
        self,
        data_list: List[NormalizedData],
        prompt_template: str,
        **kwargs
    ) -> List[AnalysisResult]:
        """Analyze multiple data items in batch.
        
        Args:
            data_list: List of normalized data to analyze
            prompt_template: The prompt template to use
            **kwargs: Additional provider-specific arguments
            
        Returns:
            List of analysis results
        """
        results = []
        for data in data_list:
            try:
                result = await self.analyze(data, prompt_template, **kwargs)
                results.append(result)
            except Exception as e:
                self.logger.error(f"Error analyzing data {data.id}: {e}")
        
        return results
    
    @abstractmethod
    def get_provider_name(self) -> str:
        """Get the provider name."""
        pass
    
    def _format_prompt(self, template: str, data: NormalizedData) -> str:
        """Format prompt template with data.
        
        Args:
            template: The prompt template
            data: The normalized data
            
        Returns:
            Formatted prompt
        """
        return template.format(
            title=data.title or "",
            description=data.description or "",
            content=data.content[:4000],  # Limit content length
            keywords=", ".join(data.keywords),
            entities=", ".join(data.entities),
        )
    
    def validate_config(self) -> bool:
        """Validate provider configuration.
        
        Returns:
            True if configuration is valid
        """
        return True
