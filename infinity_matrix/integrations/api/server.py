"""REST API server using FastAPI."""

from contextlib import asynccontextmanager
from typing import Any, dict

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from infinity_matrix.agents import get_registry
from infinity_matrix.agents.code_agent import CodeAgent
from infinity_matrix.agents.doc_agent import DocAgent
from infinity_matrix.agents.review_agent import ReviewAgent
from infinity_matrix.agents.test_agent import TestAgent
from infinity_matrix.builder.pipeline import BuildConfig, BuildPipeline
from infinity_matrix.core.config import get_settings
from infinity_matrix.core.logging import get_logger
from infinity_matrix.core.metrics import get_metrics_collector
from infinity_matrix.logs.audit import AuditEventType, get_audit_logger
from infinity_matrix.vision.processor import VisionProcessor

logger = get_logger(__name__)


# Request/Response Models
class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    version: str
    environment: str


class AgentExecuteRequest(BaseModel):
    """Agent execution request."""

    agent_name: str
    task: dict[str, Any]


class AgentExecuteResponse(BaseModel):
    """Agent execution response."""

    result: dict[str, Any]
    status: str


class VisionProcessRequest(BaseModel):
    """Vision processing request."""

    task_type: str
    image_data: str  # Base64 encoded


class BuildRequest(BaseModel):
    """Build request."""

    project_path: str
    build_command: str = "python -m build"
    test_command: str = "pytest"
    lint_command: str = "ruff check ."


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("application_starting")
    get_settings()

    # Initialize services
    registry = get_registry()
    await registry.initialize()

    # Register default agents
    await registry.register(CodeAgent())
    await registry.register(DocAgent())
    await registry.register(TestAgent())
    await registry.register(ReviewAgent())

    # Initialize other services
    vision = VisionProcessor()
    await vision.initialize()

    pipeline = BuildPipeline()
    await pipeline.initialize()

    audit_logger = get_audit_logger()
    await audit_logger.initialize()

    # Start metrics server
    metrics = get_metrics_collector()
    metrics.start_metrics_server()

    # Store in app state
    app.state.registry = registry
    app.state.vision = vision
    app.state.pipeline = pipeline
    app.state.audit_logger = audit_logger

    logger.info("application_started")

    yield

    # Shutdown
    logger.info("application_shutting_down")
    await registry.shutdown()
    await vision.shutdown()
    await pipeline.shutdown()
    await audit_logger.shutdown()
    logger.info("application_shutdown_complete")


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="Infinity Matrix",
        description="FAANG-level production-grade autonomous AI system",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request logging middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        """Log all requests."""
        import time

        start_time = time.time()

        # Log request
        logger.info(
            "request_received",
            method=request.method,
            path=request.url.path,
        )

        response = await call_next(request)

        # Log response and metrics
        duration = time.time() - start_time
        logger.info(
            "request_completed",
            method=request.method,
            path=request.url.path,
            status=response.status_code,
            duration=duration,
        )

        # Record metrics
        metrics = get_metrics_collector()
        metrics.record_request(
            request.method,
            request.url.path,
            response.status_code,
            duration,
        )

        return response

    # Health endpoints
    @app.get("/health", response_model=HealthResponse)
    async def health() -> HealthResponse:
        """Health check endpoint."""
        return HealthResponse(
            status="healthy",
            version="1.0.0",
            environment=settings.environment,
        )

    @app.get("/ready")
    async def readiness() -> dict[str, Any]:
        """Readiness check endpoint."""
        registry = app.state.registry
        status = await registry.get_registry_status()
        return {
            "ready": status["total_agents"] > 0,
            "agents": status["total_agents"],
        }

    # Agent endpoints
    @app.get(f"{settings.api_prefix}/agents")
    async def list_agents() -> dict[str, Any]:
        """list all registered agents."""
        registry = app.state.registry
        status = await registry.get_registry_status()
        return status

    @app.post(f"{settings.api_prefix}/agents/execute", response_model=AgentExecuteResponse)
    async def execute_agent(request: AgentExecuteRequest) -> AgentExecuteResponse:
        """Execute task on agent."""
        registry = app.state.registry
        audit_logger = app.state.audit_logger

        try:
            # Log audit event
            await audit_logger.log_event(
                event_type=AuditEventType.AGENT_EXECUTION,
                actor="api_user",
                action="execute_agent",
                resource=request.agent_name,
                status="in_progress",
                metadata={"task": request.task},
            )

            result = await registry.execute_on_agent(
                request.agent_name,
                request.task,
            )

            await audit_logger.log_event(
                event_type=AuditEventType.AGENT_EXECUTION,
                actor="api_user",
                action="execute_agent",
                resource=request.agent_name,
                status="success",
                metadata={"result": result},
            )

            return AgentExecuteResponse(result=result, status="success")

        except Exception as e:
            await audit_logger.log_event(
                event_type=AuditEventType.AGENT_EXECUTION,
                actor="api_user",
                action="execute_agent",
                resource=request.agent_name,
                status="failure",
                metadata={"error": str(e)},
            )
            raise HTTPException(status_code=500, detail=str(e))

    # Vision endpoints
    @app.post(f"{settings.api_prefix}/vision/process")
    async def process_vision(request: VisionProcessRequest) -> dict[str, Any]:
        """Process vision task."""
        import base64

        from infinity_matrix.core.base import Task

        vision = app.state.vision

        # Decode image data
        image_bytes = base64.b64decode(request.image_data)

        task = Task(
            type="vision",
            input={
                "task_type": request.task_type,
                "image": image_bytes,
            },
        )

        result = await vision.process(task)

        return {
            "task_id": result.task_id,
            "status": result.status,
            "output": result.output,
        }

    # Builder endpoints
    @app.post(f"{settings.api_prefix}/build")
    async def start_build(request: BuildRequest) -> dict[str, Any]:
        """Start a build."""
        pipeline = app.state.pipeline
        audit_logger = app.state.audit_logger

        config = BuildConfig(
            project_path=request.project_path,
            build_command=request.build_command,
            test_command=request.test_command,
            lint_command=request.lint_command,
        )

        await audit_logger.log_event(
            event_type=AuditEventType.BUILD_STARTED,
            actor="api_user",
            action="start_build",
            resource=request.project_path,
            status="in_progress",
        )

        result = await pipeline.execute_build(config)

        await audit_logger.log_event(
            event_type=AuditEventType.BUILD_COMPLETED,
            actor="api_user",
            action="build_completed",
            resource=request.project_path,
            status=result.status.value,
            metadata={"build_id": result.build_id},
        )

        return result.model_dump()

    @app.get(f"{settings.api_prefix}/build/{{build_id}}")
    async def get_build_status(build_id: str) -> dict[str, Any]:
        """Get build status."""
        pipeline = app.state.pipeline
        result = pipeline.get_build_status(build_id)

        if not result:
            raise HTTPException(status_code=404, detail="Build not found")

        return result.model_dump()

    # Audit endpoints
    @app.get(f"{settings.api_prefix}/audit/events")
    async def get_audit_events(
        event_type: str = None,
        limit: int = 100,
    ) -> dict[str, Any]:
        """Get audit events."""
        from infinity_matrix.logs.audit import AuditEventType

        audit_logger = app.state.audit_logger

        event_type_enum = None
        if event_type:
            try:
                event_type_enum = AuditEventType(event_type)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid event type")

        events = await audit_logger.get_events(
            event_type=event_type_enum,
            limit=limit,
        )

        return {
            "events": [e.model_dump() for e in events],
            "count": len(events),
        }

    return app
