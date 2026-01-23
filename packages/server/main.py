"""
Main FastAPI application entry point
"""
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator, 

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app

from .config import settings
from .core.database import init_db, close_db
from .core.redis_client import init_redis, close_redis
from .api.v1 import router as api_v1_router
from .core.exceptions import MCPException

# Configure structured logging
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan management"""
    logger.info("Starting Infinity Matrix MCP Server", version=__version__)
    
    # Initialize connections
    await init_db()
    await init_redis()
    
    logger.info("MCP Server started successfully")
    
    yield
    
    # Cleanup
    logger.info("Shutting down MCP Server")
    await close_redis()
    await close_db()
    logger.info("MCP Server shutdown complete")


# Create FastAPI application
app = FastAPI(
    title="Infinity Matrix MCP Server",
    description="Production-ready Model Context Protocol server for AI intelligence sharing",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Gzip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Mount Prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)


@app.exception_handler(MCPException)
async def mcp_exception_handler(request: Request, exc: MCPException) -> JSONResponse:
    """Handle MCP-specific exceptions"""
    logger.error(
        "MCP exception occurred",
        error=str(exc),
        status_code=exc.status_code,
        path=request.url.path,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.error_code,
            "message": exc.message,
            "details": exc.details,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle general exceptions"""
    logger.exception("Unexpected exception occurred", path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred",
        },
    )


@app.get("/")
async def root() -> dict:
    """Root endpoint"""
    return {
        "name": "Infinity Matrix MCP Server",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
    }


@app.get("/ready")
async def readiness_check() -> dict:
    """Readiness check endpoint"""
    # TODO: Add database and Redis connectivity checks
    return {
        "status": "ready",
        "checks": {
            "database": "ok",
            "redis": "ok",
        },
    }


# Include API routers
app.include_router(api_v1_router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
