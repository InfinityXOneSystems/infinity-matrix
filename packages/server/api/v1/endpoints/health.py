"""
Health check endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ....core.database import get_db
from ....core.redis_client import get_redis

router = APIRouter()


@router.get("/liveness")
async def liveness() -> dict:
    """Liveness probe"""
    return {"status": "alive"}


@router.get("/readiness")
async def readiness(
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Readiness probe with dependency checks"""
    redis = get_redis()

    # Check Redis
    try:
        await redis.ping()
        redis_status = "healthy"
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"

    # Check Database
    try:
        await db.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    all_healthy = redis_status == "healthy" and db_status == "healthy"

    return {
        "status": "ready" if all_healthy else "not_ready",
        "checks": {
            "redis": redis_status,
            "database": db_status,
        },
    }
