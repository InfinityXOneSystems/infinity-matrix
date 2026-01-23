"""
API v1 router
"""
from fastapi import APIRouter

from .endpoints import context, github, health, intelligence, mcp, providers

router = APIRouter()

# Include endpoint routers
router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(mcp.router, prefix="/mcp", tags=["mcp"])
router.include_router(context.router, prefix="/context", tags=["context"])
router.include_router(intelligence.router, prefix="/intelligence", tags=["intelligence"])
router.include_router(providers.router, prefix="/providers", tags=["providers"])
router.include_router(github.router, prefix="/github", tags=["github"])
