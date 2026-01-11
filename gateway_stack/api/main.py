"""
FastAPI main application for Infinity-Matrix Gateway
"""

import sys
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from ai_stack.vision_cortex.config import Config

# Initialize configuration
config = Config()

# Create FastAPI app
app = FastAPI(
    title="Infinity-Matrix API",
    description="API Gateway for the Infinity-Matrix Autonomous System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests."""
    start_time = datetime.utcnow()
    response = await call_next(request)
    duration = (datetime.utcnow() - start_time).total_seconds()

    print(f"{request.method} {request.url.path} - {response.status_code} - {duration:.3f}s")

    return response


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Infinity-Matrix API",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": config.environment
    }


@app.get("/api/v1/system/status")
async def get_system_status():
    """Get system status."""
    # TODO: Integrate with Vision Cortex for real status
    return {
        "status": "operational",
        "agents": {
            "total": 8,
            "active": 8,
            "idle": 0,
            "error": 0
        },
        "uptime": "0d 0h 0m",
        "last_update": datetime.utcnow().isoformat()
    }


@app.get("/api/v1/agents")
async def list_agents():
    """list all agents."""
    # TODO: Integrate with Vision Cortex
    agents = [
        {"name": "crawler", "status": "idle", "type": "data"},
        {"name": "ingestion", "status": "idle", "type": "data"},
        {"name": "predictor", "status": "idle", "type": "data"},
        {"name": "ceo", "status": "idle", "type": "executive"},
        {"name": "strategist", "status": "idle", "type": "executive"},
        {"name": "organizer", "status": "idle", "type": "executive"},
        {"name": "validator", "status": "idle", "type": "support"},
        {"name": "documentor", "status": "idle", "type": "support"},
    ]

    return {
        "agents": agents,
        "total": len(agents)
    }


@app.get("/api/v1/agents/{agent_name}")
async def get_agent_details(agent_name: str):
    """Get details for a specific agent."""
    # TODO: Integrate with Vision Cortex
    return {
        "name": agent_name,
        "status": "idle",
        "metadata": {
            "executions": 0,
            "errors": 0,
            "last_execution": None
        }
    }


@app.get("/api/v1/events")
async def list_events(limit: int = 100, event_type: str = None):
    """list recent events."""
    # TODO: Integrate with State Manager
    return {
        "events": [],
        "total": 0,
        "limit": limit,
        "event_type": event_type
    }


@app.get("/api/v1/metrics")
async def get_metrics():
    """Get system metrics."""
    # TODO: Integrate with monitoring
    return {
        "cpu_usage": 0.0,
        "memory_usage": 0.0,
        "disk_usage": 0.0,
        "network_io": {
            "sent": 0,
            "received": 0
        },
        "timestamp": datetime.utcnow().isoformat()
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler."""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "timestamp": datetime.utcnow().isoformat()
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=config.api_host,
        port=config.api_port,
        log_level=config.log_level.lower()
    )
