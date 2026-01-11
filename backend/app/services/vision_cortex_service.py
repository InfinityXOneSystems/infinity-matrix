"""
Vision Cortex Service - Interactive Intelligence Interface
"""
import logging
from datetime import datetime
from typing import Any, dict, list

from app.intelligence.llm_service import LLMService
from app.models.models import (
    Discovery,
    IntelligenceReport,
    Proposal,
    Simulation,
    VisionCortexSession,
)
from app.models.schemas import VisionCortexChatResponse, VisionCortexMessage
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


class VisionCortexService:
    """Vision Cortex - Interactive intelligence interface"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.llm_service = LLMService()

    async def process_message(
        self,
        session: VisionCortexSession,
        message: str,
        context_ids: list[int] | None = None
    ) -> VisionCortexChatResponse:
        """
        Process a chat message and generate intelligent response.

        Features:
        - Context-aware responses based on discovery data
        - Knowledge summaries
        - Strategic insights
        - Ask-me-anything about findings
        """
        # Add user message to history
        user_message = VisionCortexMessage(
            role="user",
            content=message,
            timestamp=datetime.utcnow()
        )

        conversation_history = session.conversation_history or []
        conversation_history.append(user_message.dict())

        # Gather context
        context = await self._gather_context(session, context_ids)

        # Generate response using LLM
        response_text = await self.llm_service.generate_cortex_response(
            message=message,
            conversation_history=conversation_history,
            context=context,
            user_type=session.user_type
        )

        # Add assistant response to history
        assistant_message = VisionCortexMessage(
            role="assistant",
            content=response_text,
            timestamp=datetime.utcnow()
        )
        conversation_history.append(assistant_message.dict())

        # Update session
        session.conversation_history = conversation_history
        session.last_activity = datetime.utcnow()

        # Extract related insights
        related_insights = await self._extract_related_insights(
            message=message,
            context=context
        )

        return VisionCortexChatResponse(
            response=response_text,
            session_token=session.session_token,
            conversation_history=[
                VisionCortexMessage(**msg) for msg in conversation_history
            ],
            related_insights=related_insights
        )

    async def _gather_context(
        self,
        session: VisionCortexSession,
        context_ids: list[int] | None = None
    ) -> dict[str, Any]:
        """Gather relevant context for the conversation"""
        context = {
            "session_info": {
                "user_type": session.user_type,
                "discovery_id": session.discovery_id
            },
            "discovery_data": None,
            "intelligence_data": None,
            "proposals": [],
            "simulations": []
        }

        if session.discovery_id:
            # Get discovery
            result = await self.db.execute(
                select(Discovery).where(Discovery.id == session.discovery_id)
            )
            discovery = result.scalar_one_or_none()

            if discovery:
                context["discovery_data"] = {
                    "client_name": discovery.client_name,
                    "business_name": discovery.business_name,
                    "status": discovery.status.value,
                    "data": discovery.discovery_data
                }

                # Get intelligence report
                result = await self.db.execute(
                    select(IntelligenceReport)
                    .where(IntelligenceReport.discovery_id == session.discovery_id)
                    .order_by(IntelligenceReport.created_at.desc())
                )
                intel_report = result.scalar_one_or_none()

                if intel_report:
                    context["intelligence_data"] = {
                        "business_analysis": intel_report.business_analysis,
                        "competitive_analysis": intel_report.competitive_analysis,
                        "market_analysis": intel_report.market_analysis,
                        "opportunities": intel_report.opportunity_analysis,
                        "blind_spots": intel_report.blind_spots
                    }

                # Get proposals
                result = await self.db.execute(
                    select(Proposal)
                    .where(Proposal.discovery_id == session.discovery_id)
                    .order_by(Proposal.created_at.desc())
                )
                proposals = result.scalars().all()
                context["proposals"] = [
                    {
                        "id": p.id,
                        "type": p.proposal_type,
                        "title": p.title,
                        "summary": p.executive_summary
                    }
                    for p in proposals
                ]

                # Get simulations
                result = await self.db.execute(
                    select(Simulation)
                    .where(Simulation.discovery_id == session.discovery_id)
                    .order_by(Simulation.created_at.desc())
                )
                simulations = result.scalars().all()
                context["simulations"] = [
                    {
                        "id": s.id,
                        "type": s.simulation_type,
                        "scenarios": {
                            "optimistic": s.optimistic_scenario,
                            "realistic": s.realistic_scenario,
                            "conservative": s.conservative_scenario
                        }
                    }
                    for s in simulations
                ]

        return context

    async def _extract_related_insights(
        self,
        message: str,
        context: dict[str, Any]
    ) -> list[dict[str, Any]]:
        """Extract insights related to the user's query"""
        insights = []

        # Extract relevant insights based on message keywords
        message_lower = message.lower()

        if context.get("intelligence_data"):
            intel_data = context["intelligence_data"]

            if any(word in message_lower for word in ["opportunity", "opportunities", "growth"]):
                if intel_data.get("opportunities"):
                    insights.append({
                        "type": "opportunity",
                        "data": intel_data["opportunities"]
                    })

            if any(word in message_lower for word in ["risk", "weakness", "challenge", "blind"]):
                if intel_data.get("blind_spots"):
                    insights.append({
                        "type": "blind_spot",
                        "data": intel_data["blind_spots"]
                    })

            if any(word in message_lower for word in ["competitor", "competition", "competitive"]):
                if intel_data.get("competitive_analysis"):
                    insights.append({
                        "type": "competitive",
                        "data": intel_data["competitive_analysis"]
                    })

        return insights[:5]  # Limit to 5 most relevant insights
