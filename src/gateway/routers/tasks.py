"""Task management endpoints."""

from typing import Any
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter()


class TaskRequest(BaseModel):
    """Task creation request model."""

    task_type: str = Field(..., description="Type of task to execute")
    agent_id: str = Field(..., description="Target agent identifier")
    priority: str = Field(default="medium", description="Task priority (low, medium, high, critical)")
    payload: dict[str, Any] = Field(default_factory=dict, description="Task payload data")


class TaskStatus(BaseModel):
    """Task status model."""

    task_id: str = Field(..., description="Unique task identifier")
    task_type: str = Field(..., description="Type of task")
    agent_id: str = Field(..., description="Assigned agent identifier")
    status: str = Field(..., description="Task status (pending, running, completed, failed)")
    priority: str = Field(..., description="Task priority")
    created_at: str = Field(..., description="Task creation timestamp")
    updated_at: str = Field(..., description="Last update timestamp")
    result: dict[str, Any] | None = Field(default=None, description="Task result data")


# In-memory task storage (TODO: Replace with database)
_tasks: dict[str, dict[str, Any]] = {}


@router.get(
    "/",
    summary="list all tasks",
    response_model=list[TaskStatus],
)
async def list_tasks(
    agent_id: str | None = None,
    status_filter: str | None = None,
) -> list[TaskStatus]:
    """list all tasks, optionally filtered by agent or status.

    Args:
        agent_id: Optional agent ID to filter tasks
        status_filter: Optional status to filter tasks

    Returns:
        list of task status information
    """
    tasks = _tasks.values()

    # Apply filters
    if agent_id:
        tasks = [t for t in tasks if t.get("agent_id") == agent_id]
    if status_filter:
        tasks = [t for t in tasks if t.get("status") == status_filter]

    return [
        TaskStatus(
            task_id=task["task_id"],
            task_type=task["task_type"],
            agent_id=task["agent_id"],
            status=task["status"],
            priority=task["priority"],
            created_at=task["created_at"],
            updated_at=task["updated_at"],
            result=task.get("result"),
        )
        for task in tasks
    ]


@router.post(
    "/",
    summary="Create a new task",
    status_code=status.HTTP_201_CREATED,
    response_model=TaskStatus,
)
async def create_task(task: TaskRequest) -> TaskStatus:
    """Create a new task for an agent.

    Args:
        task: Task creation details

    Returns:
        Created task status
    """
    # Generate task ID
    task_id = f"task_{uuid4().hex[:12]}"
    timestamp = "2025-12-30T22:47:42.913Z"

    # Store task data
    task_data = {
        "task_id": task_id,
        "task_type": task.task_type,
        "agent_id": task.agent_id,
        "status": "pending",
        "priority": task.priority,
        "payload": task.payload,
        "created_at": timestamp,
        "updated_at": timestamp,
    }
    _tasks[task_id] = task_data

    # TODO: Send task to orchestrator for execution

    return TaskStatus(**task_data, result=None)


@router.get(
    "/{task_id}",
    summary="Get task details",
    response_model=TaskStatus,
)
async def get_task(task_id: str) -> TaskStatus:
    """Get details of a specific task.

    Args:
        task_id: Unique task identifier

    Returns:
        Task status information

    Raises:
        HTTPException: If task not found
    """
    if task_id not in _tasks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found",
        )

    task_data = _tasks[task_id]
    return TaskStatus(**task_data, result=task_data.get("result"))


@router.patch(
    "/{task_id}",
    summary="Update task status",
    response_model=TaskStatus,
)
async def update_task(
    task_id: str,
    new_status: str,
    result: dict[str, Any] | None = None,
) -> TaskStatus:
    """Update the status of a task.

    Args:
        task_id: Unique task identifier
        new_status: New task status
        result: Optional task result data

    Returns:
        Updated task status

    Raises:
        HTTPException: If task not found
    """
    if task_id not in _tasks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found",
        )

    # Update task
    _tasks[task_id]["status"] = new_status
    _tasks[task_id]["updated_at"] = "2025-12-30T22:47:42.913Z"
    if result:
        _tasks[task_id]["result"] = result

    task_data = _tasks[task_id]
    return TaskStatus(**task_data, result=task_data.get("result"))


@router.delete(
    "/{task_id}",
    summary="Cancel a task",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def cancel_task(task_id: str) -> None:
    """Cancel a pending or running task.

    Args:
        task_id: Unique task identifier

    Raises:
        HTTPException: If task not found or already completed
    """
    if task_id not in _tasks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found",
        )

    task = _tasks[task_id]
    if task["status"] in ["completed", "failed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel a completed or failed task",
        )

    # Update task status to cancelled
    _tasks[task_id]["status"] = "cancelled"
    _tasks[task_id]["updated_at"] = "2025-12-30T22:47:42.913Z"
