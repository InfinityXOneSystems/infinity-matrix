"""
REST API for Infinity Matrix Auto-Builder.

This module provides HTTP endpoints for triggering builds, monitoring status,
and managing the auto-builder system.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from collections.abc import AsyncGenerator, Any, , Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel, Field

from infinity_matrix.core.auto_builder import AutoBuilder, BuildStatus
from infinity_matrix.core.blueprint import Blueprint
from infinity_matrix.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manage application lifespan."""
    # Startup
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print(f"API available at: http://{settings.api_host}:{settings.api_port}{settings.api_prefix}")
    yield
    # Shutdown
    print("Shutting down Infinity Matrix Auto-Builder")


# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Enterprise-grade autonomous code generation and deployment system",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer(auto_error=False)

# Global AutoBuilder instance
auto_builder = AutoBuilder()


# Request/Response Models
class BuildRequest(BaseModel):
    """Request to create a new build."""

    blueprint: Optional[Blueprint] = Field(None, description="Blueprint object")
    prompt: Optional[str] = Field(None, description="Natural language prompt")
    blueprint_url: Optional[str] = Field(None, description="URL to blueprint file")


class BuildResponse(BaseModel):
    """Response for build creation."""

    build_id: str
    status: str
    message: str
    build_status: BuildStatus


class StatusResponse(BaseModel):
    """API status response."""

    status: str
    version: str
    agents: list[dict[str, Any]]
    active_builds: int


class ErrorResponse(BaseModel):
    """Error response."""

    error: str
    detail: Optional[str] = None


class TokenData(BaseModel):
    """JWT token data."""

    username: Optional[str] = None


# Authentication
def create_access_token(data: dict[str, Any]) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.jwt_algorithm,
    )
    return encoded_jwt


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> TokenData:
    """Get current user from JWT token."""
    # If no token is required (for development), return default user
    if not credentials:
        return TokenData(username="anonymous")

    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        username: str = payload.get("sub", "unknown")
        return TokenData(username=username)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )


# API Endpoints
@app.get("/", response_model=StatusResponse)
async def root() -> StatusResponse:
    """Root endpoint - API status."""
    vision_cortex = auto_builder.get_vision_cortex()
    return StatusResponse(
        status="operational",
        version=settings.app_version,
        agents=vision_cortex.list_agents(),
        active_builds=len(vision_cortex.active_builds),
    )


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post(
    f"{settings.api_prefix}/builds",
    response_model=BuildResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_build(
    request: BuildRequest,
    current_user: TokenData = Depends(get_current_user),
) -> BuildResponse:
    """
    Create a new build.
    
    Accepts either a blueprint object, a natural language prompt,
    or a URL to a blueprint file.
    """
    try:
        # Trigger build
        build_status = await auto_builder.build(
            blueprint=request.blueprint,
            prompt=request.prompt,
        )

        return BuildResponse(
            build_id=build_status.id,
            status="created",
            message="Build created successfully",
            build_status=build_status,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create build: {str(e)}",
        )


@app.get(f"{settings.api_prefix}/builds/{{build_id}}", response_model=BuildStatus)
async def get_build(
    build_id: str,
    current_user: TokenData = Depends(get_current_user),
) -> BuildStatus:
    """Get build status by ID."""
    build_status = await auto_builder.get_build_status(build_id)

    if not build_status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Build {build_id} not found",
        )

    return build_status


@app.get(f"{settings.api_prefix}/builds", response_model=list[BuildStatus])
async def list_builds(
    current_user: TokenData = Depends(get_current_user),
) -> list[BuildStatus]:
    """list all builds."""
    return await auto_builder.list_builds()


@app.delete(f"{settings.api_prefix}/builds/{{build_id}}")
async def cancel_build(
    build_id: str,
    current_user: TokenData = Depends(get_current_user),
) -> dict[str, str]:
    """Cancel a running build."""
    success = await auto_builder.cancel_build(build_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Build not found or not running",
        )

    return {"status": "cancelled", "build_id": build_id}


@app.get(f"{settings.api_prefix}/agents")
async def list_agents(
    current_user: TokenData = Depends(get_current_user),
) -> dict[str, Any]:
    """list all registered agents."""
    vision_cortex = auto_builder.get_vision_cortex()
    return {
        "agents": vision_cortex.list_agents(),
        "total": len(vision_cortex.agents),
    }


@app.post(f"{settings.api_prefix}/blueprints/validate")
async def validate_blueprint(
    blueprint: Blueprint,
    current_user: TokenData = Depends(get_current_user),
) -> dict[str, Any]:
    """Validate a blueprint."""
    # Basic validation is done by Pydantic
    # Additional custom validation could be added here
    return {
        "valid": True,
        "blueprint": blueprint,
        "message": "Blueprint is valid",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "infinity_matrix.api.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
