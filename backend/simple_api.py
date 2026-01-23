"""
Infinity Matrix - Complete Backend API
Integrates Manus Core, Agent Endpoints, and Admin Control Plane
"""
import logging
import os
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import routers
from admin_control_plane import router as admin_router
from agent_endpoints import router as agent_router
from manus_core import router as manus_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Infinity Matrix API",
    description="Complete backend for infinityxai.com with Manus Core, Autonomous Agents, and Admin Control Plane",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Core Endpoints
# ============================================================================

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Infinity Matrix",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "Infinity Matrix API",
        "version": "1.0.0",
        "description": "Complete backend for infinityxai.com",
        "modules": {
            "manus_core": "Observe-Plan-Execute-Validate-Evolve intelligence loops",
            "agents": "Autonomous agent task execution and validation",
            "admin": "Admin Control Plane for task management and approvals"
        },
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "redoc": "/redoc",
            "manus_core": "/api/manus",
            "agents": "/api/agents",
            "admin": "/api/admin"
        }
    }

# ============================================================================
# Include Routers
# ============================================================================

logger.info("Registering Manus Core router...")
app.include_router(manus_router)

logger.info("Registering Agent Endpoints router...")
app.include_router(agent_router)

logger.info("Registering Admin Control Plane router...")
app.include_router(admin_router)

# ============================================================================
# Startup and Shutdown
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    logger.info("=" * 60)
    logger.info("Infinity Matrix Backend Starting")
    logger.info("=" * 60)
    logger.info("✅ Manus Core Intelligence Loops: ACTIVE")
    logger.info("✅ Autonomous Agent Endpoints: ACTIVE")
    logger.info("✅ Admin Control Plane: ACTIVE")
    logger.info("=" * 60)
    logger.info("API Documentation: http://localhost:8000/docs")
    logger.info("=" * 60)

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Infinity Matrix Backend Shutting Down")

# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
