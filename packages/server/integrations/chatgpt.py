"""
OpenAI ChatGPT integration
"""
from typing import Any, dict, list

import structlog
from openai import AsyncOpenAI

from ..config import settings
from ..core.exceptions import AIProviderException
from ..core.mcp_protocol import AIProvider, ContextData, IntelligenceShare

logger = structlog.get_logger()


class ChatGPTIntegration:
    """ChatGPT integration for MCP"""

    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required")

        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            organization=settings.OPENAI_ORG_ID,
        )
        self.model = settings.OPENAI_MODEL
        self.provider = AIProvider.CHATGPT

    async def sync_context(self, context: ContextData) -> dict[str, Any]:
        """Sync context with ChatGPT"""
        try:
            logger.info("Syncing context with ChatGPT", context_id=context.context_id)

            # Convert context to ChatGPT format
            messages = self._convert_context_to_messages(context)

            # Store context metadata for future use
            # In production, this would integrate with ChatGPT's conversation API
            return {
                "status": "synced",
                "provider": self.provider.value,
                "context_id": context.context_id,
                "message_count": len(messages),
            }
        except Exception as e:
            logger.exception("Error syncing context with ChatGPT", error=str(e))
            raise AIProviderException(self.provider.value, str(e))

    async def query(
        self,
        prompt: str,
        context: ContextData | None = None,
        **kwargs
    ) -> dict[str, Any]:
        """Query ChatGPT with optional context"""
        try:
            messages = []

            if context:
                messages.extend(self._convert_context_to_messages(context))

            messages.append({"role": "user", "content": prompt})

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                **kwargs
            )

            return {
                "response": response.choices[0].message.content,
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens,
                },
            }
        except Exception as e:
            logger.exception("Error querying ChatGPT", error=str(e))
            raise AIProviderException(self.provider.value, str(e))

    async def extract_intelligence(
        self,
        conversation: list[dict[str, Any]]
    ) -> IntelligenceShare:
        """Extract intelligence from conversation"""
        try:
            # Use ChatGPT to analyze and extract key insights
            prompt = f"""
            Analyze the following conversation and extract key insights, patterns,
            and learnings that could be shared with other AI systems:

            {conversation}

            Return structured insights including:
            - Key concepts discussed
            - Code patterns or best practices
            - User preferences or behaviors
            - Problem-solving approaches
            """

            result = await self.query(prompt)

            intelligence = IntelligenceShare(
                source_provider=self.provider,
                intelligence_type="conversation_analysis",
                content={
                    "insights": result["response"],
                    "source_conversation_length": len(conversation),
                },
                confidence_score=0.85,
                tags=["conversation", "analysis"],
            )

            return intelligence
        except Exception as e:
            logger.exception("Error extracting intelligence", error=str(e))
            raise AIProviderException(self.provider.value, str(e))

    def _convert_context_to_messages(self, context: ContextData) -> list[dict[str, Any]]:
        """Convert context to ChatGPT message format"""
        messages = []

        # Add system context
        if context.code_context:
            system_msg = f"Code context: {context.code_context}"
            messages.append({"role": "system", "content": system_msg})

        # Add conversation history
        for msg in context.conversation_history[-10:]:  # Last 10 messages
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", ""),
            })

        return messages


# Singleton instance
_chatgpt_integration: ChatGPTIntegration | None = None


def get_chatgpt_integration() -> ChatGPTIntegration:
    """Get ChatGPT integration instance"""
    global _chatgpt_integration
    if _chatgpt_integration is None:
        _chatgpt_integration = ChatGPTIntegration()
    return _chatgpt_integration
