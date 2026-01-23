"""
AI provider management endpoints
"""
from fastapi import APIRouter

from ....core.mcp_protocol import AIProvider

router = APIRouter()


@router.get("/")
async def list_providers() -> dict:
    """list all supported AI providers"""
    return {
        "providers": [
            {
                "id": provider.value,
                "name": provider.value.replace("_", " ").title(),
                "enabled": True,  # TODO: Check feature flags
            }
            for provider in AIProvider
        ]
    }


@router.get("/{provider_id}/status")
async def get_provider_status(provider_id: str) -> dict:
    """Get status of a specific provider"""
    try:
        provider = AIProvider(provider_id)
        # TODO: Check actual provider connection status
        return {
            "provider": provider.value,
            "status": "connected",
            "latency_ms": 0,
        }
    except ValueError:
        return {
            "provider": provider_id,
            "status": "unknown",
        }
