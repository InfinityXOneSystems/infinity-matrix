"""Audit logging for tracking all system actions."""

from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional
from uuid import uuid4

import json
from pydantic import BaseModel, Field


class AuditLevel(str, Enum):
    """Audit log level enumeration."""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class AuditAction(str, Enum):
    """Audit action enumeration."""
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    EXECUTE = "execute"
    LOGIN = "login"
    LOGOUT = "logout"
    CONFIG_CHANGE = "config_change"


class AuditLog(BaseModel):
    """Audit log entry model."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    level: AuditLevel
    action: AuditAction
    user: Optional[str] = None
    resource: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)
    ip_address: Optional[str] = None
    success: bool = True


class AuditLogger:
    """Logger for audit events."""
    
    def __init__(self, log_dir: Optional[Path] = None):
        if log_dir is None:
            log_dir = Path.home() / ".infinity-matrix" / "audit"
        
        self.log_dir = log_dir
        self.log_dir.mkdir(parents=True, exist_ok=True)
        
        self._logs: List[AuditLog] = []
    
    def log(
        self,
        level: AuditLevel,
        action: AuditAction,
        user: Optional[str] = None,
        resource: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        success: bool = True
    ) -> AuditLog:
        """
        Log an audit event.
        
        Args:
            level: Log level
            action: Action performed
            user: User who performed the action
            resource: Resource affected
            details: Additional details
            ip_address: IP address of the user
            success: Whether the action succeeded
            
        Returns:
            Created audit log entry
        """
        log_entry = AuditLog(
            level=level,
            action=action,
            user=user,
            resource=resource,
            details=details or {},
            ip_address=ip_address,
            success=success
        )
        
        self._logs.append(log_entry)
        self._write_to_file(log_entry)
        
        return log_entry
    
    def _write_to_file(self, log_entry: AuditLog) -> None:
        """Write log entry to file."""
        # Create daily log file
        date_str = log_entry.timestamp.strftime("%Y-%m-%d")
        log_file = self.log_dir / f"audit-{date_str}.jsonl"
        
        with open(log_file, "a") as f:
            f.write(json.dumps(log_entry.model_dump(), default=str) + "\n")
    
    def query(
        self,
        user: Optional[str] = None,
        action: Optional[AuditAction] = None,
        resource: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 100
    ) -> List[AuditLog]:
        """
        Query audit logs with filters.
        
        Args:
            user: Filter by user
            action: Filter by action
            resource: Filter by resource
            start_time: Filter by start time
            end_time: Filter by end time
            limit: Maximum number of results
            
        Returns:
            List of matching audit log entries
        """
        results = self._logs
        
        if user:
            results = [log for log in results if log.user == user]
        
        if action:
            results = [log for log in results if log.action == action]
        
        if resource:
            results = [log for log in results if log.resource == resource]
        
        if start_time:
            results = [log for log in results if log.timestamp >= start_time]
        
        if end_time:
            results = [log for log in results if log.timestamp <= end_time]
        
        # Sort by timestamp descending and limit
        results.sort(key=lambda x: x.timestamp, reverse=True)
        return results[:limit]
    
    def info(self, action: AuditAction, **kwargs: Any) -> AuditLog:
        """Log an info level event."""
        return self.log(AuditLevel.INFO, action, **kwargs)
    
    def warning(self, action: AuditAction, **kwargs: Any) -> AuditLog:
        """Log a warning level event."""
        return self.log(AuditLevel.WARNING, action, **kwargs)
    
    def error(self, action: AuditAction, **kwargs: Any) -> AuditLog:
        """Log an error level event."""
        return self.log(AuditLevel.ERROR, action, **kwargs)
    
    def critical(self, action: AuditAction, **kwargs: Any) -> AuditLog:
        """Log a critical level event."""
        return self.log(AuditLevel.CRITICAL, action, **kwargs)


# Global audit logger instance
_audit_logger = AuditLogger()


def get_audit_logger() -> AuditLogger:
    """Get the global audit logger."""
    return _audit_logger
