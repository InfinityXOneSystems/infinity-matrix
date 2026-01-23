"""
Main FastAPI application with all enterprise features integrated.
"""
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator, 

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app
import structlog

from infinity_matrix.api import (
    security_router,
    monitoring_router,
    governance_router,
    compliance_router,
    cost_router,
    docs_router,
    feedback_router,
    dr_router,
    audit_router,
)
from infinity_matrix.core.config import get_settings
from infinity_matrix.core.logging import setup_logging
from infinity_matrix.core.rate_limiter import RateLimiter
from infinity_matrix.db.database import init_db, close_db

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager."""
    settings = get_settings()
    logger.info("Starting Infinity-Matrix Platform", version=app.version)
    
    # Initialize database
    await init_db()
    logger.info("Database initialized")
    
    # Initialize rate limiter
    app.state.rate_limiter = RateLimiter()
    logger.info("Rate limiter initialized")
    
    yield
    
    # Cleanup
    await close_db()
    logger.info("Shutting down Infinity-Matrix Platform")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    setup_logging()
    
    app = FastAPI(
        title="Infinity-Matrix API",
        description="Enterprise-Grade AI Platform with Security, Compliance, and Cost Optimization",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(security_router, prefix="/api/security", tags=["Security"])
    app.include_router(monitoring_router, prefix="/api/monitoring", tags=["Monitoring"])
    app.include_router(governance_router, prefix="/api/governance", tags=["Governance"])
    app.include_router(compliance_router, prefix="/api/compliance", tags=["Compliance"])
    app.include_router(cost_router, prefix="/api/costs", tags=["Cost Analysis"])
    app.include_router(docs_router, prefix="/api/docs", tags=["Documentation"])
    app.include_router(feedback_router, prefix="/api/feedback", tags=["Feedback"])
    app.include_router(dr_router, prefix="/api/dr", tags=["Disaster Recovery"])
    app.include_router(audit_router, prefix="/api/audit", tags=["Audit"])
    
    # Prometheus metrics
    metrics_app = make_asgi_app()
    app.mount("/metrics", metrics_app)
    
    @app.get("/health", status_code=status.HTTP_200_OK)
    async def health_check() -> dict[str, str]:
        """Health check endpoint."""
        return {"status": "healthy", "version": app.version}
    
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Global exception handler with logging."""
        logger.error("Unhandled exception", exc_info=exc, path=request.url.path)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"},
        )
    
    return app


app = create_app()
