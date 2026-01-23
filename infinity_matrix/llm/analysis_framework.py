"""LLM analysis framework."""

import logging
from typing import list

from infinity_matrix.core.config import get_config
from infinity_matrix.core.state_manager import StateManager
from infinity_matrix.llm.factory import LLMFactory
from infinity_matrix.models import AnalysisResult, NormalizedData

logger = logging.getLogger(__name__)


class AnalysisFramework:
    """Framework for LLM-based data analysis."""

    # Default prompt templates
    DEFAULT_PROMPTS = {
        "insights": """
Analyze the following content and provide key insights:

Title: {title}
Description: {description}
Keywords: {keywords}

Content:
{content}

Please provide:
1. Key insights and findings
2. Main themes and topics
3. Potential business value or applications
4. Notable trends or patterns

Format your response as a structured analysis.
""",
        "summary": """
Summarize the following content in 3-5 sentences:

Title: {title}
Content: {content}

Provide a concise summary highlighting the most important information.
""",
        "categorization": """
Categorize the following content:

Title: {title}
Description: {description}
Content: {content}

Provide:
1. Primary category
2. Sub-categories
3. Industry relevance
4. Target audience
""",
    }

    def __init__(
        self,
        state_manager: StateManager,
        provider_name: str | None = None
    ):
        """Initialize analysis framework."""
        self.state_manager = state_manager
        self.config = get_config()

        # Determine provider
        if provider_name is None:
            provider_name = self.config.llm.default_provider

        # Get provider config
        provider_config = self.config.llm.providers.get(provider_name, {})

        # Create provider
        self.provider = LLMFactory.create_provider(provider_name, provider_config)

        if self.provider is None:
            logger.warning(f"Could not create LLM provider {provider_name}")

    async def analyze_data(
        self,
        data: NormalizedData,
        prompt_type: str = "insights",
        custom_prompt: str | None = None,
    ) -> AnalysisResult | None:
        """Analyze normalized data using LLM.

        Args:
            data: Normalized data to analyze
            prompt_type: Type of prompt to use (insights, summary, categorization)
            custom_prompt: Custom prompt template (overrides prompt_type)

        Returns:
            Analysis result or None if provider not available
        """
        if self.provider is None:
            logger.warning("No LLM provider available")
            return None

        # Get prompt template
        if custom_prompt:
            prompt = custom_prompt
        else:
            prompt = self.DEFAULT_PROMPTS.get(prompt_type, self.DEFAULT_PROMPTS["insights"])

        try:
            # Analyze
            result = await self.provider.analyze(data, prompt)

            # Save result
            await self.state_manager.save_analysis_result(result)

            logger.info(f"Analyzed data {data.id} using {self.provider.get_provider_name()}")

            return result

        except Exception as e:
            logger.error(f"Error analyzing data {data.id}: {e}", exc_info=True)
            return None

    async def batch_analyze(
        self,
        data_list: list[NormalizedData],
        prompt_type: str = "insights",
        custom_prompt: str | None = None,
    ) -> list[AnalysisResult]:
        """Analyze multiple data items in batch.

        Args:
            data_list: list of normalized data to analyze
            prompt_type: Type of prompt to use
            custom_prompt: Custom prompt template

        Returns:
            list of analysis results
        """
        if self.provider is None:
            logger.warning("No LLM provider available")
            return []

        # Get prompt template
        if custom_prompt:
            prompt = custom_prompt
        else:
            prompt = self.DEFAULT_PROMPTS.get(prompt_type, self.DEFAULT_PROMPTS["insights"])

        try:
            # Batch analyze
            results = await self.provider.batch_analyze(data_list, prompt)

            # Save results
            for result in results:
                await self.state_manager.save_analysis_result(result)

            logger.info(f"Batch analyzed {len(results)} items using {self.provider.get_provider_name()}")

            return results

        except Exception as e:
            logger.error(f"Error in batch analysis: {e}", exc_info=True)
            return []

    def get_available_prompts(self) -> list[str]:
        """Get list of available prompt types."""
        return list(self.DEFAULT_PROMPTS.keys())

    def add_custom_prompt(self, name: str, template: str):
        """Add a custom prompt template.

        Args:
            name: Prompt name
            template: Prompt template
        """
        self.DEFAULT_PROMPTS[name] = template
