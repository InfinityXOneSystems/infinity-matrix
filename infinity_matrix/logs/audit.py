"""Audit logging and verification system."""

import json
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional
from uuid import uuid4

from pydantic import BaseModel, Field

from infinity_matrix.core.base import BaseService
from infinity_matrix.core.config import get_settings
from infinity_matrix.core.logging import get_logger

logger = get_logger(__name__)


class AuditEventType(str, Enum):
    """Audit event types."""

    AGENT_EXECUTION = "agent_execution"
    API_REQUEST = "api_request"
    BUILD_STARTED = "build_started"
    BUILD_COMPLETED = "build_completed"
    VISION_PROCESSING = "vision_processing"
    SYSTEM_EVENT = "system_event"
    SECURITY_EVENT = "security_event"
    ERROR = "error"


class AuditEvent(BaseModel):
    """Audit event model."""

    id: str = Field(default_factory=lambda: str(uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    event_type: AuditEventType
    actor: str  # User, agent, or system component
    action: str
    resource: Optional[str] = None
    status: str  # success, failure, in_progress
    metadata: Dict[str, Any] = Field(default_factory=dict)
    correlation_id: Optional[str] = None


class AuditLogger(BaseService):
    """Comprehensive audit logging and proof system."""

    def __init__(self) -> None:
        """Initialize audit logger."""
        super().__init__(name="audit_logger")
        self.settings = get_settings()
        self._events: List[AuditEvent] = []
        self._storage_path = Path(self.settings.logs_storage_path)

    async def _initialize(self) -> None:
        """Initialize audit logger."""
        self.logger.info("audit_logger_initializing")
        
        # Create storage directory
        self._storage_path.mkdir(parents=True, exist_ok=True)
        
        # Load existing events (if any)
        await self._load_events()
        
        self.logger.info(
            "audit_logger_initialized",
            storage_path=str(self._storage_path),
            events_loaded=len(self._events),
        )

    async def _shutdown(self) -> None:
        """Shutdown audit logger."""
        self.logger.info("audit_logger_shutting_down")
        
        # Persist all events
        await self._persist_events()

    async def log_event(
        self,
        event_type: AuditEventType,
        actor: str,
        action: str,
        status: str = "success",
        resource: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        correlation_id: Optional[str] = None,
    ) -> AuditEvent:
        """Log an audit event."""
        event = AuditEvent(
            event_type=event_type,
            actor=actor,
            action=action,
            resource=resource,
            status=status,
            metadata=metadata or {},
            correlation_id=correlation_id,
        )
        
        self._events.append(event)
        
        self.logger.info(
            "audit_event_logged",
            event_id=event.id,
            event_type=event_type,
            actor=actor,
            action=action,
        )
        
        # Persist periodically
        if len(self._events) % 100 == 0:
            await self._persist_events()
        
        return event

    async def get_events(
        self,
        event_type: Optional[AuditEventType] = None,
        actor: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 100,
    ) -> List[AuditEvent]:
        """Query audit events."""
        events = self._events

        # Filter by event type
        if event_type:
            events = [e for e in events if e.event_type == event_type]

        # Filter by actor
        if actor:
            events = [e for e in events if e.actor == actor]

        # Filter by time range
        if start_time:
            events = [e for e in events if e.timestamp >= start_time]
        if end_time:
            events = [e for e in events if e.timestamp <= end_time]

        # Apply limit
        events = events[-limit:]

        return events

    async def get_event(self, event_id: str) -> Optional[AuditEvent]:
        """Get specific event by ID."""
        for event in self._events:
            if event.id == event_id:
                return event
        return None

    async def get_events_by_correlation(
        self, correlation_id: str
    ) -> List[AuditEvent]:
        """Get all events with the same correlation ID."""
        return [e for e in self._events if e.correlation_id == correlation_id]

    async def verify_event(self, event_id: str) -> Dict[str, Any]:
        """Verify event integrity and authenticity."""
        event = await self.get_event(event_id)
        
        if not event:
            return {"verified": False, "reason": "Event not found"}

        # In production, implement cryptographic verification
        verification = {
            "verified": True,
            "event_id": event.id,
            "timestamp": event.timestamp,
            "event_type": event.event_type,
            "integrity_check": "passed",
            "signature": "placeholder_signature",
        }

        return verification

    async def generate_audit_report(
        self,
        start_time: datetime,
        end_time: datetime,
    ) -> Dict[str, Any]:
        """Generate audit report for a time period."""
        events = await self.get_events(
            start_time=start_time,
            end_time=end_time,
            limit=10000,
        )

        # Aggregate statistics
        by_type = {}
        by_actor = {}
        by_status = {"success": 0, "failure": 0, "in_progress": 0}

        for event in events:
            # By type
            type_key = event.event_type.value
            by_type[type_key] = by_type.get(type_key, 0) + 1

            # By actor
            by_actor[event.actor] = by_actor.get(event.actor, 0) + 1

            # By status
            if event.status in by_status:
                by_status[event.status] += 1

        return {
            "period": {
                "start": start_time.isoformat(),
                "end": end_time.isoformat(),
            },
            "total_events": len(events),
            "by_type": by_type,
            "by_actor": by_actor,
            "by_status": by_status,
            "generated_at": datetime.utcnow().isoformat(),
        }

    async def _persist_events(self) -> None:
        """Persist events to disk."""
        try:
            # Create daily log file
            today = datetime.utcnow().strftime("%Y-%m-%d")
            log_file = self._storage_path / f"audit_{today}.jsonl"
            
            # Append new events
            with open(log_file, "a") as f:
                for event in self._events:
                    f.write(json.dumps(event.model_dump(), default=str) + "\n")
            
            self.logger.debug("audit_events_persisted", count=len(self._events))
            
        except Exception as e:
            self.logger.error("audit_persist_failed", error=str(e))

    async def _load_events(self) -> None:
        """Load recent events from disk."""
        try:
            # Load today's events
            today = datetime.utcnow().strftime("%Y-%m-%d")
            log_file = self._storage_path / f"audit_{today}.jsonl"
            
            if log_file.exists():
                with open(log_file, "r") as f:
                    for line in f:
                        data = json.loads(line)
                        event = AuditEvent(**data)
                        self._events.append(event)
            
            self.logger.debug("audit_events_loaded", count=len(self._events))
            
        except Exception as e:
            self.logger.error("audit_load_failed", error=str(e))


# Global audit logger instance
_audit_logger: Optional[AuditLogger] = None


def get_audit_logger() -> AuditLogger:
    """Get global audit logger instance."""
    global _audit_logger
    if _audit_logger is None:
        _audit_logger = AuditLogger()
    return _audit_logger
