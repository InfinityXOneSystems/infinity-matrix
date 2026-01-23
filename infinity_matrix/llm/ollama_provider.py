"""Ollama LLM provider for local models."""

import uuid
from datetime import datetime
from typing import Any, dict

import httpx

from infinity_matrix.llm.base import BaseLLMProvider
from infinity_matrix.models import AnalysisResult, NormalizedData


class OllamaProvider(BaseLLMProvider):
    """Ollama provider for local LLM models."""

    def __init__(self, config: dict[str, Any]):
        """Initialize Ollama provider."""
        super().__init__(config)

        self.base_url = config.get("base_url", "http://localhost:11434")
        self.model = config.get("model", "llama2")
        self.temperature = config.get("temperature", 0.7)

    def get_provider_name(self) -> str:
        """Get provider name."""
        return "ollama"

    def validate_config(self) -> bool:
        """Validate configuration."""
        return True  # Ollama doesn't require API keys

    async def analyze(
        self,
        data: NormalizedData,
        prompt_template: str,
        **kwargs
    ) -> AnalysisResult:
        """Analyze data using Ollama."""
        # Format prompt
        prompt = self._format_prompt(prompt_template, data)

        try:
            # Call Ollama API
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": self.temperature,
                        }
                    }
                )
                response.raise_for_status()

                result_data = response.json()
                analysis_text = result_data.get("response", "")

                # Parse insights
                insights = self._extract_insights(analysis_text)

                # Create analysis result
                result = AnalysisResult(
                    id=str(uuid.uuid4()),
                    normalized_data_id=data.id,
                    provider=self.get_provider_name(),
                    model=self.model,
                    prompt_template=prompt_template,
                    analysis=analysis_text,
                    insights=insights,
                    confidence_score=0.7,
                    tokens_used=0,  # Ollama doesn't report token usage
                    analyzed_at=datetime.utcnow(),
                )

                return result

        except Exception as e:
            self.logger.error(f"Error calling Ollama API: {e}", exc_info=True)
            raise

    def _extract_insights(self, text: str) -> list:
        """Extract key insights from analysis text."""
        insights = []
        for line in text.split('\n'):
            line = line.strip()
            if line.startswith(('- ', '* ', '• ')) or (len(line) > 0 and line[0].isdigit() and '. ' in line):
                insight = line.lstrip('- * • 0123456789. ')
                if insight:
                    insights.append(insight)

        return insights[:10]
