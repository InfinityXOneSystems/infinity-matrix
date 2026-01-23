"""
Google Vertex AI integration
"""
from typing import Any, dict

import structlog
from google.cloud import aiplatform
from google.oauth2 import service_account

from ..config import settings
from ..core.exceptions import AIProviderException
from ..core.mcp_protocol import AIProvider, ContextData, IntelligenceShare

logger = structlog.get_logger()


class VertexAIIntegration:
    """Vertex AI integration for MCP"""

    def __init__(self):
        if not settings.GOOGLE_CLOUD_PROJECT:
            raise ValueError("GOOGLE_CLOUD_PROJECT is required")

        # Initialize Vertex AI
        if settings.GOOGLE_APPLICATION_CREDENTIALS:
            credentials = service_account.Credentials.from_service_account_file(
                settings.GOOGLE_APPLICATION_CREDENTIALS
            )
        else:
            credentials = None

        aiplatform.init(
            project=settings.GOOGLE_CLOUD_PROJECT,
            location=settings.VERTEX_AI_LOCATION,
            credentials=credentials,
        )

        self.model_name = settings.VERTEX_AI_MODEL
        self.provider = AIProvider.VERTEX_AI

    async def sync_context(self, context: ContextData) -> dict[str, Any]:
        """Sync context with Vertex AI"""
        try:
            logger.info("Syncing context with Vertex AI", context_id=context.context_id)

            # Store context for Vertex AI use
            # In production, this would integrate with Vertex AI's context management
            return {
                "status": "synced",
                "provider": self.provider.value,
                "context_id": context.context_id,
            }
        except Exception as e:
            logger.exception("Error syncing context with Vertex AI", error=str(e))
            raise AIProviderException(self.provider.value, str(e))

    async def query(
        self,
        prompt: str,
        context: ContextData | None = None,
        **kwargs
    ) -> dict[str, Any]:
        """Query Vertex AI with optional context"""
        try:
            from vertexai.generative_models import GenerativeModel

            model = GenerativeModel(self.model_name)

            # Prepare prompt with context
            full_prompt = prompt
            if context:
                context_str = self._format_context(context)
                full_prompt = f"{context_str}\n\n{prompt}"

            response = model.generate_content(full_prompt)

            return {
                "response": response.text,
                "model": self.model_name,
            }
        except Exception as e:
            logger.exception("Error querying Vertex AI", error=str(e))
            raise AIProviderException(self.provider.value, str(e))

    async def extract_intelligence(
        self,
        data: dict[str, Any]
    ) -> IntelligenceShare:
        """Extract intelligence from data"""
        try:
            intelligence = IntelligenceShare(
                source_provider=self.provider,
                intelligence_type="vertex_analysis",
                content=data,
                confidence_score=0.90,
                tags=["vertex-ai", "analysis"],
            )

            return intelligence
        except Exception as e:
            logger.exception("Error extracting intelligence", error=str(e))
            raise AIProviderException(self.provider.value, str(e))

    def _format_context(self, context: ContextData) -> str:
        """Format context for Vertex AI"""
        parts = []

        if context.code_context:
            parts.append(f"Code context: {context.code_context}")

        if context.file_references:
            parts.append(f"Files: {', '.join(context.file_references)}")

        if context.conversation_history:
            parts.append("Recent conversation:")
            for msg in context.conversation_history[-5:]:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                parts.append(f"{role}: {content}")

        return "\n".join(parts)


# Singleton instance
_vertex_ai_integration: VertexAIIntegration | None = None


def get_vertex_ai_integration() -> VertexAIIntegration:
    """Get Vertex AI integration instance"""
    global _vertex_ai_integration
    if _vertex_ai_integration is None:
        _vertex_ai_integration = VertexAIIntegration()
    return _vertex_ai_integration
