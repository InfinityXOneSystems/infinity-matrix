"""
Feedback API endpoints.
"""
from datetime import datetime
from typing import Any, dict, list

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

feedback_store: list[dict[str, Any]] = []


class FeedbackRequest(BaseModel):
    """Feedback submission request."""
    user_id: str
    type: str  # bug, feature, improvement, other
    message: str
    metadata: dict[str, Any] | None = None


@router.post("/submit")
async def submit_feedback(request: FeedbackRequest) -> dict[str, Any]:
    """Submit user feedback."""
    feedback_id = f"FB-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    feedback = {
        "id": feedback_id,
        "user_id": request.user_id,
        "type": request.type,
        "message": request.message,
        "metadata": request.metadata or {},
        "timestamp": datetime.now().isoformat(),
        "status": "submitted",
    }
    feedback_store.append(feedback)
    return feedback


@router.get("/list")
async def list_feedback(
    type: str | None = None,
    limit: int = 100,
) -> list[dict[str, Any]]:
    """list feedback submissions."""
    results = feedback_store

    if type:
        results = [f for f in results if f["type"] == type]

    return results[-limit:]


@router.get("/stats")
async def get_feedback_stats() -> dict[str, Any]:
    """Get feedback statistics."""
    by_type = {}
    for fb in feedback_store:
        fb_type = fb["type"]
        by_type[fb_type] = by_type.get(fb_type, 0) + 1

    return {
        "total_feedback": len(feedback_store),
        "by_type": by_type,
    }
