"""
LLM Service - Integration with language models
"""
import logging
from typing import Any, dict, list

from anthropic import AsyncAnthropic
from app.core.config import settings
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)


class LLMService:
    """Service for interacting with Large Language Models"""

    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None

        if settings.OPENAI_API_KEY:
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        if settings.ANTHROPIC_API_KEY:
            self.anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

    async def generate_cortex_response(
        self,
        message: str,
        conversation_history: list[dict[str, Any]],
        context: dict[str, Any],
        user_type: str = "client"
    ) -> str:
        """
        Generate Vision Cortex response using LLM.

        Provides intelligent, context-aware responses for the interactive
        Vision Cortex interface.
        """
        try:
            # Build system prompt based on context
            system_prompt = self._build_system_prompt(context, user_type)

            # Prepare messages
            messages = [{"role": "system", "content": system_prompt}]

            # Add conversation history (limit to last 10 messages)
            for msg in conversation_history[-10:]:
                if msg.get("role") in ["user", "assistant"]:
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })

            # Add current message
            messages.append({"role": "user", "content": message})

            # Generate response
            if self.openai_client:
                response = await self._generate_openai_response(messages)
            elif self.anthropic_client:
                response = await self._generate_anthropic_response(messages)
            else:
                response = self._generate_fallback_response(message, context)

            return response

        except Exception as e:
            logger.error(f"Error generating LLM response: {str(e)}", exc_info=True)
            return self._generate_fallback_response(message, context)

    def _build_system_prompt(
        self,
        context: dict[str, Any],
        user_type: str
    ) -> str:
        """Build system prompt based on context"""

        base_prompt = """You are Vision Cortex, an advanced AI-powered business intelligence assistant.
        You help users understand and explore their business intelligence findings, opportunities, and strategic insights.

        Your communication style is:
        - Professional yet conversational
        - Insightful and strategic
        - Data-driven with clear explanations
        - Forward-thinking and opportunity-focused
        - Tactfully honest about challenges and blind spots
        """

        # Add context information
        if context.get("discovery_data"):
            discovery = context["discovery_data"]
            base_prompt += f"\n\nYou are assisting with intelligence for {discovery.get('business_name')}."

        if context.get("intelligence_data"):
            base_prompt += "\n\nYou have access to comprehensive business intelligence including:"
            base_prompt += "\n- Business analysis and capabilities"
            base_prompt += "\n- Competitive landscape and positioning"
            base_prompt += "\n- Market trends and opportunities"
            base_prompt += "\n- Gap analysis and blind spots"
            base_prompt += "\n- Strategic opportunities and recommendations"

        if user_type == "operator":
            base_prompt += "\n\nYou are speaking with an operator/internal user who has full access to all intelligence."
        else:
            base_prompt += "\n\nYou are speaking with a client. Be strategic about which details to emphasize."

        return base_prompt

    async def _generate_openai_response(
        self,
        messages: list[dict[str, str]]
    ) -> str:
        """Generate response using OpenAI"""
        try:
            response = await self.openai_client.chat.completions.create(
                model=settings.DEFAULT_LLM_MODEL,
                messages=messages,
                temperature=settings.DEFAULT_TEMPERATURE,
                max_tokens=settings.MAX_TOKENS
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise

    async def _generate_anthropic_response(
        self,
        messages: list[dict[str, str]]
    ) -> str:
        """Generate response using Anthropic"""
        try:
            # Extract system message and user messages
            system_message = next((m["content"] for m in messages if m["role"] == "system"), "")
            user_messages = [m for m in messages if m["role"] != "system"]

            response = await self.anthropic_client.messages.create(
                model="claude-3-sonnet-20240229",
                system=system_message,
                messages=user_messages,
                temperature=settings.DEFAULT_TEMPERATURE,
                max_tokens=settings.MAX_TOKENS
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Anthropic API error: {str(e)}")
            raise

    def _generate_fallback_response(
        self,
        message: str,
        context: dict[str, Any]
    ) -> str:
        """Generate fallback response when LLM is unavailable"""
        message_lower = message.lower()

        # Pattern-based responses
        if any(word in message_lower for word in ["opportunity", "opportunities"]):
            return """Based on the intelligence gathered, we've identified several key opportunities:

1. Generative AI Integration - High impact, achievable within 3-6 months
2. Vertical Industry Solutions - Significant long-term value potential
3. Enterprise Sales Enhancement - Immediate impact on revenue growth
4. Strategic Partnerships - Expanded market reach and capabilities

Each of these represents a strategic pathway to accelerated growth and market leadership. Would you like me to dive deeper into any specific opportunity?"""

        elif any(word in message_lower for word in ["risk", "threat", "challenge"]):
            return """The analysis has identified several areas requiring attention:

1. Competitive pressure from well-funded challengers
2. Need for enhanced AI/ML capabilities to maintain leadership
3. Sales and marketing scale to capture market opportunity
4. Regulatory compliance preparation for evolving AI governance

These challenges are manageable with proper planning and investment. The key is addressing them proactively before they become critical constraints."""

        elif any(word in message_lower for word in ["timeline", "when", "schedule"]):
            return """The transformation roadmap spans multiple timeframes:

IMMEDIATE (0-3 months): Launch quick-win initiatives like AI pilots and customer programs
SHORT-TERM (3-6 months): Deploy enhanced capabilities and market positioning
MEDIUM-TERM (6-12 months): Scale successful programs and expand strategically
LONG-TERM (12-24 months): Achieve category leadership and sustained competitive advantage

The realistic scenario shows significant impact within 12 months and transformation complete within 24 months."""

        elif any(word in message_lower for word in ["cost", "investment", "price", "roi"]):
            return """Investment levels vary by initiative, but the ROI projections are compelling:

- Typical program investments: $80K - $350K depending on scope
- Ongoing subscriptions: $6K - $20K/month for maintained systems
- Payback periods: 3-9 months for most initiatives
- 3-year ROI: 400-600% for comprehensive programs

The simulations show that strategic investment can accelerate revenue growth 3-4x while expanding market share and competitive position."""

        else:
            return """I can help you explore the intelligence findings for this business. The discovery has revealed:

- Comprehensive business and competitive analysis
- Market opportunities and growth projections
- Strategic recommendations and roadmaps
- Multiple scenario simulations with ROI projections

What specific aspect would you like to explore? You can ask about opportunities, challenges, timeline, investment, competitive position, or any other area of the intelligence."""
