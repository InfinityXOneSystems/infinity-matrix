"""Main FastAPI application for the Infinity Matrix API Gateway.

This module serves as the entry point for the API Gateway, handling:
- Request routing and load balancing
- Authentication and authorization
- Rate limiting and throttling
- Request/response transformation
- API versioning
"""

from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from .middleware import RateLimitMiddleware, RequestLoggingMiddleware
from .routers import agents, health, tasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown events."""
    # Startup
    print("🚀 Infinity Matrix API Gateway starting...")
    print("📡 Initializing connections...")
    # TODO: Initialize database connections, cache, etc.
    yield
    # Shutdown
    print("🛑 Infinity Matrix API Gateway shutting down...")
    print("🔌 Closing connections...")
    # TODO: Close database connections, cache, etc.


# Create FastAPI application
app = FastAPI(
    title="Infinity Matrix API Gateway",
    description="Enterprise-grade AI agent orchestration platform API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add custom middleware
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global exception handler for unhandled errors."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "path": str(request.url),
        },
    )


@app.get("/", summary="Root endpoint", response_model=dict[str, Any])
async def root() -> dict[str, Any]:
    """Root endpoint with API information."""
    return {
        "name": "Infinity Matrix API Gateway",
        "version": "0.1.0",
        "status": "operational",
        "docs": "/docs",
        "health": "/health",
    }
