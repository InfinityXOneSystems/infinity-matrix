"""Agent scheduler for managing automated tasks."""

from datetime import datetime, timedelta
from enum import Enum
from collections.abc import Callable, Any, , dict, list, Optional
from uuid import uuid4

from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    """Task status enumeration."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class TaskPriority(str, Enum):
    """Task priority enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ScheduledTask(BaseModel):
    """Scheduled task model."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    description: Optional[str] = None
    cron_expression: Optional[str] = None
    interval: Optional[timedelta] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    next_run: Optional[datetime] = None
    last_run: Optional[datetime] = None
    run_count: int = 0
    metadata: dict[str, Any] = Field(default_factory=dict)


class AgentScheduler:
    """Scheduler for automated tasks."""
    
    def __init__(self):
        self._tasks: dict[str, ScheduledTask] = {}
        self._handlers: dict[str, Callable] = {}
    
    def schedule(
        self,
        task: ScheduledTask,
        handler: Callable
    ) -> str:
        """
        Schedule a new task.
        
        Args:
            task: Task to schedule
            handler: Function to call when task runs
            
        Returns:
            Task ID
        """
        self._tasks[task.id] = task
        self._handlers[task.id] = handler
        
        # Calculate next run time
        if task.interval:
            task.next_run = datetime.utcnow() + task.interval
        
        return task.id
    
    def cancel(self, task_id: str) -> bool:
        """Cancel a scheduled task."""
        if task_id in self._tasks:
            self._tasks[task_id].status = TaskStatus.CANCELLED
            return True
        return False
    
    def get(self, task_id: str) -> Optional[ScheduledTask]:
        """Get task by ID."""
        return self._tasks.get(task_id)
    
    def list(
        self,
        status: Optional[TaskStatus] = None,
        priority: Optional[TaskPriority] = None
    ) -> list[ScheduledTask]:
        """list tasks with optional filtering."""
        tasks = list(self._tasks.values())
        
        if status:
            tasks = [t for t in tasks if t.status == status]
        
        if priority:
            tasks = [t for t in tasks if t.priority == priority]
        
        return tasks
    
    def run_pending(self) -> list[str]:
        """
        Run all pending tasks that are due.
        
        Returns:
            list of task IDs that were executed
        """
        executed = []
        now = datetime.utcnow()
        
        for task_id, task in self._tasks.items():
            if task.status != TaskStatus.PENDING:
                continue
            
            if task.next_run and task.next_run <= now:
                # Run the task
                task.status = TaskStatus.RUNNING
                
                try:
                    handler = self._handlers.get(task_id)
                    if handler:
                        handler(task)
                    
                    task.status = TaskStatus.COMPLETED
                    task.last_run = now
                    task.run_count += 1
                    executed.append(task_id)
                    
                    # Schedule next run
                    if task.interval:
                        task.next_run = now + task.interval
                        task.status = TaskStatus.PENDING
                    
                except Exception as e:
                    task.status = TaskStatus.FAILED
                    task.metadata["last_error"] = str(e)
        
        return executed


# Global scheduler instance
_scheduler = AgentScheduler()


def get_scheduler() -> AgentScheduler:
    """Get the global agent scheduler."""
    return _scheduler
