"""
Admin Control Plane API
Task management, approvals, and system monitoring
"""
import logging
import uuid
from datetime import datetime
from enum import Enum
from typing import Any, dict, list

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["Admin Control Plane"])

# ============================================================================
# Enums
# ============================================================================

class ApprovalStatus(str, Enum):
    """Approval workflow statuses"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    ESCALATED = "escalated"

class TaskPriority(str, Enum):
    """Task priority levels"""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"

# ============================================================================
# Data Models
# ============================================================================

class AdminTask(BaseModel):
    """Task for admin approval and execution"""
    task_id: str
    name: str
    description: str
    task_type: str
    parameters: dict[str, Any]
    priority: TaskPriority
    created_by: str
    created_at: datetime
    updated_at: datetime
    status: str  # pending, approved, rejected, executing, completed, failed
    approval_status: ApprovalStatus = ApprovalStatus.PENDING
    approval_notes: str | None = None
    approved_by: str | None = None
    approved_at: datetime | None = None
    execution_result: dict[str, Any] | None = None
    error_message: str | None = None

class ApprovalRequest(BaseModel):
    """Request to approve or reject a task"""
    task_id: str
    approved: bool
    notes: str | None = None
    approved_by: str

class SystemLog(BaseModel):
    """System activity log entry"""
    log_id: str
    timestamp: datetime
    level: str  # info, warning, error, critical
    component: str
    message: str
    details: dict[str, Any] = {}

class SystemHealth(BaseModel):
    """System health status"""
    status: str  # healthy, degraded, critical
    uptime_seconds: float
    active_tasks: int
    completed_tasks: int
    failed_tasks: int
    agents_online: int
    memory_usage_percent: float
    cpu_usage_percent: float
    last_check: datetime

# ============================================================================
# In-Memory Storage (replace with database in production)
# ============================================================================

admin_tasks: dict[str, AdminTask] = {}
system_logs: list[SystemLog] = []
approval_queue: dict[str, AdminTask] = {}

# ============================================================================
# Helper Functions
# ============================================================================

def add_log(level: str, component: str, message: str, details: dict[str, Any] = None):
    """Add an entry to the system log"""
    if details is None:
        details = {}
    log = SystemLog(
        log_id=str(uuid.uuid4()),
        timestamp=datetime.now(),
        level=level,
        component=component,
        message=message,
        details=details
    )
    system_logs.append(log)
    logger.log(
        level=getattr(logging, level.upper()),
        msg=f"[{component}] {message}"
    )

# ============================================================================
# API Endpoints
# ============================================================================

@router.post("/tasks")
async def create_admin_task(
    name: str,
    description: str,
    task_type: str,
    parameters: dict[str, Any],
    priority: TaskPriority = TaskPriority.NORMAL,
    created_by: str = "system"
) -> dict[str, Any]:
    """
    Create a new admin task for approval
    """
    task_id = str(uuid.uuid4())

    task = AdminTask(
        task_id=task_id,
        name=name,
        description=description,
        task_type=task_type,
        parameters=parameters,
        priority=priority,
        created_by=created_by,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        status="pending",
        approval_status=ApprovalStatus.PENDING
    )

    admin_tasks[task_id] = task
    approval_queue[task_id] = task

    add_log(
        "info",
        "AdminControlPlane",
        f"Task created: {name}",
        {"task_id": task_id, "priority": priority.value}
    )

    return {
        "task_id": task_id,
        "status": "created",
        "approval_status": "pending",
        "message": f"Task {name} created and awaiting approval"
    }

@router.get("/approvals")
async def get_approval_queue(
    status: str | None = None,
    priority: str | None = None
) -> dict[str, Any]:
    """
    Get the approval queue with optional filtering
    """
    queue = []

    for _task_id, task in approval_queue.items():
        if status and task.approval_status.value != status:
            continue
        if priority and task.priority.value != priority:
            continue

        queue.append({
            "task_id": task.task_id,
            "name": task.name,
            "description": task.description,
            "priority": task.priority.value,
            "created_by": task.created_by,
            "created_at": task.created_at.isoformat(),
            "approval_status": task.approval_status.value
        })

    return {
        "total_pending": len(queue),
        "filtered_status": status,
        "filtered_priority": priority,
        "tasks": queue
    }

@router.post("/approvals/{task_id}/approve")
async def approve_task(
    task_id: str,
    approved_by: str,
    notes: str | None = None,
    background_tasks: BackgroundTasks = None
) -> dict[str, Any]:
    """
    Approve a task for execution
    """
    if task_id not in admin_tasks:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    task = admin_tasks[task_id]

    if task.approval_status != ApprovalStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail=f"Task {task_id} is already {task.approval_status.value}"
        )

    task.approval_status = ApprovalStatus.APPROVED
    task.approved_by = approved_by
    task.approved_at = datetime.now()
    task.approval_notes = notes
    task.status = "approved"
    task.updated_at = datetime.now()

    if task_id in approval_queue:
        del approval_queue[task_id]

    add_log(
        "info",
        "AdminControlPlane",
        f"Task approved: {task.name}",
        {"task_id": task_id, "approved_by": approved_by}
    )

    return {
        "task_id": task_id,
        "approval_status": "approved",
        "approved_by": approved_by,
        "message": f"Task {task.name} approved successfully"
    }

@router.post("/approvals/{task_id}/reject")
async def reject_task(
    task_id: str,
    approved_by: str,
    notes: str | None = None
) -> dict[str, Any]:
    """
    Reject a task
    """
    if task_id not in admin_tasks:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    task = admin_tasks[task_id]

    if task.approval_status != ApprovalStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail=f"Task {task_id} is already {task.approval_status.value}"
        )

    task.approval_status = ApprovalStatus.REJECTED
    task.approved_by = approved_by
    task.approved_at = datetime.now()
    task.approval_notes = notes
    task.status = "rejected"
    task.updated_at = datetime.now()

    if task_id in approval_queue:
        del approval_queue[task_id]

    add_log(
        "warning",
        "AdminControlPlane",
        f"Task rejected: {task.name}",
        {"task_id": task_id, "rejected_by": approved_by}
    )

    return {
        "task_id": task_id,
        "approval_status": "rejected",
        "rejected_by": approved_by,
        "message": f"Task {task.name} rejected"
    }

@router.post("/execute/{task_id}")
async def execute_approved_task(task_id: str) -> dict[str, Any]:
    """
    Execute an approved task
    """
    if task_id not in admin_tasks:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    task = admin_tasks[task_id]

    if task.approval_status != ApprovalStatus.APPROVED:
        raise HTTPException(
            status_code=400,
            detail=f"Task {task_id} is not approved (status: {task.approval_status.value})"
        )

    task.status = "executing"
    task.updated_at = datetime.now()

    try:
        # Simulate task execution
        task.execution_result = {
            "task_id": task_id,
            "task_type": task.task_type,
            "status": "success",
            "output": {
                "processed_parameters": task.parameters,
                "timestamp": datetime.now().isoformat()
            }
        }

        task.status = "completed"

        add_log(
            "info",
            "AdminControlPlane",
            f"Task executed: {task.name}",
            {"task_id": task_id, "result": "success"}
        )

        return {
            "task_id": task_id,
            "status": "completed",
            "result": task.execution_result,
            "message": f"Task {task.name} executed successfully"
        }

    except Exception as e:
        task.status = "failed"
        task.error_message = str(e)

        add_log(
            "error",
            "AdminControlPlane",
            f"Task execution failed: {task.name}",
            {"task_id": task_id, "error": str(e)}
        )

        raise HTTPException(status_code=500, detail=f"Task execution failed: {str(e)}")

@router.get("/logs")
async def get_system_logs(
    level: str | None = None,
    component: str | None = None,
    limit: int = 100
) -> dict[str, Any]:
    """
    Get system activity logs with optional filtering
    """
    logs = []

    for log in reversed(system_logs[-limit:]):
        if level and log.level != level:
            continue
        if component and log.component != component:
            continue

        logs.append({
            "log_id": log.log_id,
            "timestamp": log.timestamp.isoformat(),
            "level": log.level,
            "component": log.component,
            "message": log.message,
            "details": log.details
        })

    return {
        "total_logs": len(logs),
        "filtered_level": level,
        "filtered_component": component,
        "logs": logs
    }

@router.get("/health")
async def get_system_health() -> dict[str, Any]:
    """
    Get overall system health status
    """
    # Calculate metrics
    total_tasks = len(admin_tasks)
    completed_tasks = sum(1 for t in admin_tasks.values() if t.status == "completed")
    failed_tasks = sum(1 for t in admin_tasks.values() if t.status == "failed")
    active_tasks = sum(1 for t in admin_tasks.values() if t.status == "executing")

    # Determine health status
    if failed_tasks > total_tasks * 0.2:
        health_status = "degraded"
    elif failed_tasks > total_tasks * 0.5:
        health_status = "critical"
    else:
        health_status = "healthy"

    health = SystemHealth(
        status=health_status,
        uptime_seconds=3600.0,  # Simulated
        active_tasks=active_tasks,
        completed_tasks=completed_tasks,
        failed_tasks=failed_tasks,
        agents_online=5,  # Simulated
        memory_usage_percent=45.2,  # Simulated
        cpu_usage_percent=32.1,  # Simulated
        last_check=datetime.now()
    )

    return health.dict()

@router.get("/tasks/{task_id}")
async def get_task_details(task_id: str) -> dict[str, Any]:
    """
    Get detailed information about a specific task
    """
    if task_id not in admin_tasks:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    task = admin_tasks[task_id]

    return {
        "task_id": task.task_id,
        "name": task.name,
        "description": task.description,
        "task_type": task.task_type,
        "priority": task.priority.value,
        "status": task.status,
        "approval_status": task.approval_status.value,
        "created_by": task.created_by,
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat(),
        "approved_by": task.approved_by,
        "approved_at": task.approved_at.isoformat() if task.approved_at else None,
        "approval_notes": task.approval_notes,
        "parameters": task.parameters,
        "execution_result": task.execution_result,
        "error_message": task.error_message
    }

@router.get("/dashboard")
async def get_admin_dashboard() -> dict[str, Any]:
    """
    Get comprehensive admin dashboard data
    """
    total_tasks = len(admin_tasks)
    pending_approvals = len(approval_queue)
    completed_tasks = sum(1 for t in admin_tasks.values() if t.status == "completed")
    failed_tasks = sum(1 for t in admin_tasks.values() if t.status == "failed")

    # Get recent logs
    recent_logs = [
        {
            "timestamp": log.timestamp.isoformat(),
            "level": log.level,
            "message": log.message
        }
        for log in system_logs[-10:]
    ]

    return {
        "summary": {
            "total_tasks": total_tasks,
            "pending_approvals": pending_approvals,
            "completed_tasks": completed_tasks,
            "failed_tasks": failed_tasks,
            "success_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        },
        "recent_activity": recent_logs,
        "system_health": {
            "status": "healthy",
            "uptime_hours": 24,
            "agents_online": 5
        }
    }
