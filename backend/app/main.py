"""
Infinity Matrix - Intelligence Discovery System
Main FastAPI Application
"""
import logging
import time
from contextlib import asynccontextmanager

from app.api import discovery, intelligence, proposals, simulations, vision_cortex
from app.core.config import settings
from app.core.database import Base, engine
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Starting Intelligence Discovery System...")

    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    logger.info("Database initialized")
    yield

    logger.info("Shutting down Intelligence Discovery System...")
    await engine.dispose()


# Create FastAPI application
app = FastAPI(
    title="Infinity Matrix - Intelligence Discovery System",
    description="Enterprise-grade automated business intelligence and discovery platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Intelligence Discovery System",
        "version": "1.0.0"
    }


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "Infinity Matrix - Intelligence Discovery System",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "features": [
            "Automated business intelligence discovery",
            "Competitive analysis",
            "AI-powered proposal generation",
            "Investment simulations",
            "Vision Cortex integration"
        ]
    }


# Include API routers
app.include_router(discovery.router, prefix="/api/discovery", tags=["Discovery"])
app.include_router(intelligence.router, prefix="/api/intelligence", tags=["Intelligence"])
app.include_router(proposals.router, prefix="/api/proposals", tags=["Proposals"])
app.include_router(simulations.router, prefix="/api/simulations", tags=["Simulations"])
app.include_router(vision_cortex.router, prefix="/api/vision-cortex", tags=["Vision Cortex"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
