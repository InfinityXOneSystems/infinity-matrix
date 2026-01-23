"""Audit trail implementation for the Infinity Matrix.

Provides:
- Immutable audit logs
- Event tracking
- Compliance reporting
- Forensic analysis
"""

from datetime import datetime
from typing import Any
from uuid import uuid4


class AuditEvent:
    """Represents a single audit event."""

    def __init__(
        self,
        event_type: str,
        actor_id: str,
        actor_type: str,
        resource_type: str,
        resource_id: str,
        action: str,
        result: str,
        metadata: dict[str, Any] | None = None,
    ):
        """Initialize audit event.

        Args:
            event_type: Type of event
            actor_id: ID of the actor
            actor_type: Type of actor (user, agent, system)
            resource_type: Type of resource
            resource_id: ID of the resource
            action: Action performed
            result: Result of the action
            metadata: Additional metadata
        """
        self.event_id = str(uuid4())
        self.timestamp = datetime.utcnow().isoformat()
        self.event_type = event_type
        self.actor_id = actor_id
        self.actor_type = actor_type
        self.resource_type = resource_type
        self.resource_id = resource_id
        self.action = action
        self.result = result
        self.metadata = metadata or {}

    def to_dict(self) -> dict[str, Any]:
        """Convert event to dictionary.

        Returns:
            Dictionary representation of the event
        """
        return {
            "event_id": self.event_id,
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "actor": {
                "id": self.actor_id,
                "type": self.actor_type,
            },
            "resource": {
                "type": self.resource_type,
                "id": self.resource_id,
            },
            "action": self.action,
            "result": self.result,
            "metadata": self.metadata,
        }


class AuditTrail:
    """Manages audit trail for the system."""

    def __init__(self):
        """Initialize audit trail."""
        self.events: list[AuditEvent] = []

    def record_event(
        self,
        event_type: str,
        actor_id: str,
        actor_type: str,
        resource_type: str,
        resource_id: str,
        action: str,
        result: str,
        metadata: dict[str, Any] | None = None,
    ) -> str:
        """Record an audit event.

        Args:
            event_type: Type of event
            actor_id: ID of the actor
            actor_type: Type of actor
            resource_type: Type of resource
            resource_id: ID of the resource
            action: Action performed
            result: Result of the action
            metadata: Additional metadata

        Returns:
            Event ID
        """
        event = AuditEvent(
            event_type=event_type,
            actor_id=actor_id,
            actor_type=actor_type,
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            result=result,
            metadata=metadata,
        )

        self.events.append(event)
        print(f"📝 Audit event recorded: {event.event_id}")

        # TODO: Persist to immutable storage (e.g., Cloud Logging, BigQuery)

        return event.event_id

    def get_events(
        self,
        actor_id: str | None = None,
        resource_id: str | None = None,
        event_type: str | None = None,
        start_time: str | None = None,
        end_time: str | None = None,
    ) -> list[dict[str, Any]]:
        """Query audit events.

        Args:
            actor_id: Filter by actor ID
            resource_id: Filter by resource ID
            event_type: Filter by event type
            start_time: Filter by start time (ISO format)
            end_time: Filter by end time (ISO format)

        Returns:
            list of matching audit events
        """
        filtered_events = self.events

        if actor_id:
            filtered_events = [
                e for e in filtered_events if e.actor_id == actor_id
            ]

        if resource_id:
            filtered_events = [
                e for e in filtered_events if e.resource_id == resource_id
            ]

        if event_type:
            filtered_events = [
                e for e in filtered_events if e.event_type == event_type
            ]

        # TODO: Add time filtering

        return [e.to_dict() for e in filtered_events]


# Global audit trail instance
audit_trail = AuditTrail()
