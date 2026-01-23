"""
Admin Control Plane API
Mobile-first autonomous cloud command center

Endpoints:
- POST /admin/builder/invoke - Start new build task
- GET /admin/builder/status - Get current builder state
- POST /admin/builder/kill - Emergency shutdown
- GET /admin/approvals - list pending PRs
- POST /admin/approvals/:id/approve - Approve PR
- POST /admin/approvals/:id/reject - Reject PR
- GET /admin/health - System health metrics
- GET /admin/logs - Query audit logs
"""

import os
import sys
from datetime import datetime
from enum import Enum
from typing import Any, dict, list

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from infinity_matrix.builder.governance import Governance
from infinity_matrix.builder.observer import Observer
from infinity_matrix.builder.orchestrator import TaskOrchestrator

app = FastAPI(title="Infinity Matrix Admin API", version="1.0.0")

# CORS for mobile PWA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize core systems
orchestrator = TaskOrchestrator()
governance = Governance()
observer = Observer()

# ============================================================================
# MODELS
# ============================================================================

class TaskRequest(BaseModel):
    goal: str
    priority: str = "normal"  # low, normal, high, critical
    auto_approve: bool = False

class TaskStatus(BaseModel):
    task_id: str
    status: str  # pending, planning, executing, validating, complete, failed
    progress: float  # 0.0 to 1.0
    current_phase: str
    created_at: datetime
    updated_at: datetime
    error: str | None = None

class BuilderStatus(BaseModel):
    enabled: bool
    current_task: TaskStatus | None
    queue_length: int
    last_action: str | None
    uptime_seconds: int

class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Approval(BaseModel):
    id: str
    pr_number: int
    title: str
    description: str
    diff_url: str
    files_changed: int
    additions: int
    deletions: int
    risk_score: str  # low, medium, high
    created_at: datetime
    status: ApprovalStatus

class ApprovalAction(BaseModel):
    comment: str | None = None

class HealthMetrics(BaseModel):
    uptime_seconds: int
    error_rate: float  # 0.0 to 1.0
    avg_response_time_ms: float
    active_tasks: int
    completed_tasks_24h: int
    failed_tasks_24h: int
    cpu_percent: float
    memory_percent: float
    disk_percent: float
    cost_today_usd: float

class LogEntry(BaseModel):
    timestamp: datetime
    level: str  # info, warning, error, critical
    action: str
    user: str
    details: dict[str, Any]

class LogQuery(BaseModel):
    start_date: datetime | None = None
    end_date: datetime | None = None
    level: str | None = None
    action: str | None = None
    limit: int = 100

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.post("/admin/builder/invoke", response_model=TaskStatus)
async def invoke_builder(request: TaskRequest):
    """
    Start a new autonomous build task

    The builder will:
    1. Decompose goal into subtasks
    2. Analyze dependencies and risks
    3. Create execution plan
    4. Generate PRs for approval (unless auto_approve=True)
    """
    if not governance.is_builder_enabled():
        raise HTTPException(status_code=503, detail="Builder is disabled (kill switch active)")

    try:
        task_id = orchestrator.invoke_task(
            goal=request.goal,
            priority=request.priority,
            auto_approve=request.auto_approve
        )

        status = orchestrator.get_task_status(task_id)

        governance.log_action(
            action="builder_invoked",
            user="admin",  # TODO: Get from auth
            details={"task_id": task_id, "goal": request.goal}
        )

        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/builder/status", response_model=BuilderStatus)
async def get_builder_status():
    """Get current builder state and activity"""
    return orchestrator.get_status()

@app.post("/admin/builder/kill")
async def kill_builder():
    """
    Emergency shutdown - immediately disable builder

    This sets a kill switch flag that prevents any new actions.
    Running tasks will complete their current step then pause.
    """
    try:
        governance.activate_kill_switch(reason="Manual admin shutdown")

        governance.log_action(
            action="kill_switch_activated",
            user="admin",  # TODO: Get from auth
            details={"reason": "Manual shutdown"}
        )

        return {"status": "killed", "message": "Builder disabled successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/builder/enable")
async def enable_builder():
    """Re-enable builder after kill switch"""
    try:
        governance.deactivate_kill_switch()

        governance.log_action(
            action="builder_enabled",
            user="admin",
            details={}
        )

        return {"status": "enabled", "message": "Builder re-enabled successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/approvals", response_model=list[Approval])
async def list_approvals(status: ApprovalStatus | None = None):
    """
    list PRs requiring approval

    Returns pending PRs with:
    - Diff preview
    - Risk assessment
    - Test results
    - Rollback plan
    """
    try:
        approvals = orchestrator.get_pending_approvals(status=status)
        return approvals
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/approvals/{approval_id}/approve")
async def approve_pr(approval_id: str, action: ApprovalAction):
    """
    Approve a PR for merge

    This will:
    1. Merge PR to main
    2. Deploy to staging
    3. Run smoke tests
    4. Deploy to production (if tests pass)
    """
    try:
        result = orchestrator.approve_pr(approval_id, comment=action.comment)

        governance.log_action(
            action="pr_approved",
            user="admin",
            details={"approval_id": approval_id, "comment": action.comment}
        )

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/approvals/{approval_id}/reject")
async def reject_pr(approval_id: str, action: ApprovalAction):
    """
    Reject a PR

    The PR will be closed and the builder will be notified.
    If auto-fix is enabled, the builder may create a revised PR.
    """
    try:
        result = orchestrator.reject_pr(approval_id, comment=action.comment)

        governance.log_action(
            action="pr_rejected",
            user="admin",
            details={"approval_id": approval_id, "comment": action.comment}
        )

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/health", response_model=HealthMetrics)
async def get_health():
    """
    System health metrics

    Includes:
    - Uptime, error rate, response time
    - Active/completed/failed tasks
    - Resource usage (CPU, memory, disk)
    - Cost tracking
    """
    try:
        metrics = observer.collect_health_metrics()
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/logs", response_model=list[LogEntry])
async def query_logs(query: LogQuery):
    """
    Query audit logs

    All builder actions are logged immutably.
    Logs cannot be deleted or modified.
    """
    try:
        logs = governance.query_logs(
            start_date=query.start_date,
            end_date=query.end_date,
            level=query.level,
            action=query.action,
            limit=query.limit
        )
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/healthz")
async def healthz():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/readyz")
async def readyz():
    """Readiness check endpoint"""
    if not governance.is_builder_enabled():
        raise HTTPException(status_code=503, detail="Builder disabled")
    return {"status": "ready"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
