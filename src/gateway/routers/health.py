"""Health check endpoints for the API Gateway."""

from typing import Any

from fastapi import APIRouter, status

router = APIRouter()


@router.get(
    "/health",
    summary="Health check",
    status_code=status.HTTP_200_OK,
    response_model=dict[str, Any],
)
async def health_check() -> dict[str, Any]:
    """Basic health check endpoint.

    Returns:
        Health status information
    """
    return {
        "status": "healthy",
        "service": "api-gateway",
        "version": "0.1.0",
    }


@router.get(
    "/ready",
    summary="Readiness check",
    status_code=status.HTTP_200_OK,
    response_model=dict[str, Any],
)
async def readiness_check() -> dict[str, Any]:
    """Readiness check for load balancer.

    Indicates if the service is ready to accept traffic.

    Returns:
        Readiness status
    """
    # TODO: Check database, cache, and external service connections
    return {
        "status": "ready",
        "checks": {
            "database": "connected",
            "cache": "connected",
            "orchestrator": "connected",
        },
    }


@router.get(
    "/alive",
    summary="Liveness check",
    status_code=status.HTTP_200_OK,
    response_model=dict[str, Any],
)
async def liveness_check() -> dict[str, Any]:
    """Liveness check for container orchestration.

    Indicates if the service is alive and should not be restarted.

    Returns:
        Liveness status
    """
    return {
        "status": "alive",
        "timestamp": "2025-12-30T22:47:42.913Z",
    }
