"""
Intelligence sharing endpoints
"""
from typing import Any, dict, list

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ....core.mcp_protocol import AIProvider, IntelligenceShare
from ....core.sync_engine import get_sync_engine

router = APIRouter()


class IntelligenceRequest(BaseModel):
    """Request model for intelligence sharing"""
    source_provider: str
    intelligence_type: str = "general"
    content: dict[str, Any]
    confidence_score: float = 1.0
    tags: list[str] = []
    target_providers: list[str] = []


@router.post("/share")
async def share_intelligence(request: IntelligenceRequest) -> dict:
    """Share intelligence across providers"""
    try:
        source_provider = AIProvider(request.source_provider)
        target_providers = [AIProvider(p) for p in request.target_providers] if request.target_providers else None

        intelligence = IntelligenceShare(
            source_provider=source_provider,
            intelligence_type=request.intelligence_type,
            content=request.content,
            confidence_score=request.confidence_score,
            tags=request.tags,
            applicable_to=target_providers or list(AIProvider),
        )

        sync_engine = get_sync_engine()
        await sync_engine.share_intelligence(intelligence, target_providers)

        return {
            "status": "success",
            "intelligence_id": intelligence.intelligence_id,
            "shared_with": [p.value for p in (target_providers or list(AIProvider))],
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{intelligence_id}")
async def get_intelligence(intelligence_id: str) -> dict:
    """Get intelligence by ID"""
    sync_engine = get_sync_engine()
    intelligence = await sync_engine.get_intelligence(intelligence_id)

    if not intelligence:
        raise HTTPException(status_code=404, detail="Intelligence not found")

    return intelligence
