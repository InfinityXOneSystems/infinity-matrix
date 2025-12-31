"""
Audit API endpoints (alias for governance audit).
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/dashboard")
async def get_audit_dashboard() -> dict:
    """Get audit dashboard summary."""
    return {
        "message": "Audit dashboard - use /api/governance/audit endpoints",
        "endpoints": {
            "search": "/api/governance/audit/search",
            "actor_history": "/api/governance/audit/actor/{actor}",
            "resource_history": "/api/governance/audit/resource/{type}/{id}",
            "attribution": "/api/governance/audit/attribution/{type}/{id}",
            "stats": "/api/governance/audit/stats",
        }
    }
