"""OpenAI LLM provider implementation."""

import uuid
from datetime import datetime
from typing import Any, dict

import openai

from infinity_matrix.llm.base import BaseLLMProvider
from infinity_matrix.models import AnalysisResult, NormalizedData


class OpenAIProvider(BaseLLMProvider):
    """OpenAI (ChatGPT) LLM provider."""

    def __init__(self, config: dict[str, Any]):
        """Initialize OpenAI provider."""
        super().__init__(config)

        self.api_key = config.get("api_key")
        self.model = config.get("model", "gpt-4o-mini")
        self.temperature = config.get("temperature", 0.7)
        self.max_tokens = config.get("max_tokens", 2000)

        if self.api_key:
            openai.api_key = self.api_key

    def get_provider_name(self) -> str:
        """Get provider name."""
        return "openai"

    def validate_config(self) -> bool:
        """Validate configuration."""
        if not self.api_key:
            self.logger.error("OpenAI API key not provided")
            return False
        return True

    async def analyze(
        self,
        data: NormalizedData,
        prompt_template: str,
        **kwargs
    ) -> AnalysisResult:
        """Analyze data using OpenAI API."""
        if not self.validate_config():
            raise ValueError("Invalid OpenAI configuration")

        # Format prompt
        prompt = self._format_prompt(prompt_template, data)

        try:
            # Call OpenAI API
            client = openai.OpenAI(api_key=self.api_key)

            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert analyst helping to extract insights from data."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )

            # Extract response
            analysis_text = response.choices[0].message.content
            tokens_used = response.usage.total_tokens if response.usage else 0

            # Parse insights (simple extraction for now)
            insights = self._extract_insights(analysis_text)
            categories = self._extract_categories(analysis_text)
            sentiment = self._extract_sentiment(analysis_text)

            # Create analysis result
            result = AnalysisResult(
                id=str(uuid.uuid4()),
                normalized_data_id=data.id,
                provider=self.get_provider_name(),
                model=self.model,
                prompt_template=prompt_template,
                analysis=analysis_text,
                insights=insights,
                sentiment=sentiment,
                categories=categories,
                confidence_score=0.8,  # Could be calculated based on response
                tokens_used=tokens_used,
                analyzed_at=datetime.utcnow(),
            )

            return result

        except Exception as e:
            self.logger.error(f"Error calling OpenAI API: {e}", exc_info=True)
            raise

    def _extract_insights(self, text: str) -> list:
        """Extract key insights from analysis text."""
        # Simple extraction - split by bullet points or numbered lists
        insights = []
        for line in text.split('\n'):
            line = line.strip()
            if line.startswith(('- ', '* ', '• ')) or (len(line) > 0 and line[0].isdigit() and '. ' in line):
                insight = line.lstrip('- * • 0123456789. ')
                if insight:
                    insights.append(insight)

        return insights[:10]  # Limit to top 10

    def _extract_categories(self, text: str) -> list:
        """Extract categories from analysis text."""
        # Look for common category keywords
        categories = []
        category_keywords = [
            "technology", "finance", "healthcare", "retail", "real estate",
            "energy", "manufacturing", "media", "transportation", "services"
        ]

        text_lower = text.lower()
        for keyword in category_keywords:
            if keyword in text_lower:
                categories.append(keyword)

        return categories

    def _extract_sentiment(self, text: str) -> str:
        """Extract sentiment from analysis text."""
        text_lower = text.lower()

        # Simple keyword-based sentiment
        positive_words = ["positive", "good", "excellent", "strong", "growth", "success"]
        negative_words = ["negative", "bad", "poor", "weak", "decline", "failure"]

        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)

        if positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        else:
            return "neutral"
