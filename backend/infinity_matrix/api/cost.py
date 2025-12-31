"""
Cost analysis API endpoints (alias for monitoring costs).
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/dashboard")
async def get_cost_dashboard() -> dict:
    """Get cost dashboard summary."""
    return {
        "message": "Cost dashboard - use /api/monitoring/costs endpoints",
        "endpoints": {
            "realtime": "/api/monitoring/costs/realtime",
            "chart": "/api/monitoring/costs/chart",
            "recommendations": "/api/monitoring/costs/recommendations",
        }
    }
