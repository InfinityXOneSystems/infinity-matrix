"""
Context synchronization endpoints
"""
from typing import Any, dict, list

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ....core.mcp_protocol import AIProvider, ContextData
from ....core.sync_engine import get_sync_engine

router = APIRouter()


class ContextRequest(BaseModel):
    """Request model for context synchronization"""
    provider: str
    conversation_id: str | None = None
    user_id: str | None = None
    workspace_id: str | None = None
    code_context: dict[str, Any] = {}
    conversation_history: list[dict[str, Any]] = []
    file_references: list[str] = []
    preferences: dict[str, Any] = {}
    target_providers: list[str] = []


@router.post("/sync")
async def sync_context(request: ContextRequest) -> dict:
    """Synchronize context across providers"""
    try:
        provider = AIProvider(request.provider)
        target_providers = [AIProvider(p) for p in request.target_providers]

        context = ContextData(
            provider=provider,
            conversation_id=request.conversation_id,
            user_id=request.user_id,
            workspace_id=request.workspace_id,
            code_context=request.code_context,
            conversation_history=request.conversation_history,
            file_references=request.file_references,
            preferences=request.preferences,
        )

        sync_engine = get_sync_engine()
        await sync_engine.sync_context(context, target_providers)

        return {
            "status": "success",
            "context_id": context.context_id,
            "synced_to": [p.value for p in target_providers],
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{context_id}")
async def get_context(context_id: str) -> dict:
    """Get context by ID"""
    sync_engine = get_sync_engine()
    context = await sync_engine.get_context(context_id)

    if not context:
        raise HTTPException(status_code=404, detail="Context not found")

    return context
