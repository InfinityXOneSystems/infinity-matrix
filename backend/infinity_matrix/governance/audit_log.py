"""
Comprehensive audit logging with attribution and tracing.
"""
from datetime import datetime
from enum import Enum
from typing import Any, dict, list

import structlog

logger = structlog.get_logger()


class AuditActionType(str, Enum):
    """Types of actions to audit."""
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    EXECUTE = "execute"
    APPROVE = "approve"
    REJECT = "reject"
    ESCALATE = "escalate"


class AuditEntry:
    """Audit log entry."""

    def __init__(
        self,
        entry_id: str,
        actor: str,
        actor_type: str,
        action: AuditActionType,
        resource_type: str,
        resource_id: str,
        description: str,
        metadata: dict[str, Any] | None = None,
    ):
        self.entry_id = entry_id
        self.actor = actor
        self.actor_type = actor_type  # user, agent, system
        self.action = action
        self.resource_type = resource_type
        self.resource_id = resource_id
        self.description = description
        self.metadata = metadata or {}
        self.timestamp = datetime.now()
        self.ip_address = metadata.get("ip_address") if metadata else None
        self.user_agent = metadata.get("user_agent") if metadata else None

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "entry_id": self.entry_id,
            "actor": self.actor,
            "actor_type": self.actor_type,
            "action": self.action.value,
            "resource_type": self.resource_type,
            "resource_id": self.resource_id,
            "description": self.description,
            "metadata": self.metadata,
            "timestamp": self.timestamp.isoformat(),
            "ip_address": self.ip_address,
            "user_agent": self.user_agent,
        }


class AuditLog:
    """Complete audit logging with attribution and tracing."""

    def __init__(self):
        self.entries: list[AuditEntry] = []
        self.entries_by_actor: dict[str, list[str]] = {}
        self.entries_by_resource: dict[str, list[str]] = {}

    async def log_action(
        self,
        actor: str,
        actor_type: str,
        action: AuditActionType,
        resource_type: str,
        resource_id: str,
        description: str,
        metadata: dict[str, Any] | None = None,
    ) -> AuditEntry:
        """Log an action to the audit trail."""
        entry_id = f"AUD-{datetime.now().strftime('%Y%m%d-%H%M%S-%f')}"

        entry = AuditEntry(
            entry_id=entry_id,
            actor=actor,
            actor_type=actor_type,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            description=description,
            metadata=metadata,
        )

        self.entries.append(entry)

        # Index by actor
        if actor not in self.entries_by_actor:
            self.entries_by_actor[actor] = []
        self.entries_by_actor[actor].append(entry_id)

        # Index by resource
        resource_key = f"{resource_type}:{resource_id}"
        if resource_key not in self.entries_by_resource:
            self.entries_by_resource[resource_key] = []
        self.entries_by_resource[resource_key].append(entry_id)

        logger.info(
            "Audit entry created",
            entry_id=entry_id,
            actor=actor,
            action=action.value,
            resource=resource_key,
        )

        return entry

    def get_entry(self, entry_id: str) -> AuditEntry | None:
        """Get audit entry by ID."""
        for entry in self.entries:
            if entry.entry_id == entry_id:
                return entry
        return None

    def search_entries(
        self,
        actor: str | None = None,
        actor_type: str | None = None,
        action: AuditActionType | None = None,
        resource_type: str | None = None,
        resource_id: str | None = None,
        start_time: datetime | None = None,
        end_time: datetime | None = None,
        limit: int = 100,
    ) -> list[AuditEntry]:
        """Search audit entries with filters."""
        results = self.entries.copy()

        if actor:
            results = [e for e in results if e.actor == actor]

        if actor_type:
            results = [e for e in results if e.actor_type == actor_type]

        if action:
            results = [e for e in results if e.action == action]

        if resource_type:
            results = [e for e in results if e.resource_type == resource_type]

        if resource_id:
            results = [e for e in results if e.resource_id == resource_id]

        if start_time:
            results = [e for e in results if e.timestamp >= start_time]

        if end_time:
            results = [e for e in results if e.timestamp <= end_time]

        # Sort by timestamp descending
        results = sorted(results, key=lambda x: x.timestamp, reverse=True)

        return results[:limit]

    def get_actor_history(self, actor: str, limit: int = 100) -> list[AuditEntry]:
        """Get complete history for an actor."""
        entry_ids = self.entries_by_actor.get(actor, [])
        entries = [self.get_entry(entry_id) for entry_id in entry_ids]
        entries = [e for e in entries if e is not None]
        return sorted(entries, key=lambda x: x.timestamp, reverse=True)[:limit]

    def get_resource_history(
        self,
        resource_type: str,
        resource_id: str,
        limit: int = 100,
    ) -> list[AuditEntry]:
        """Get complete history for a resource."""
        resource_key = f"{resource_type}:{resource_id}"
        entry_ids = self.entries_by_resource.get(resource_key, [])
        entries = [self.get_entry(entry_id) for entry_id in entry_ids]
        entries = [e for e in entries if e is not None]
        return sorted(entries, key=lambda x: x.timestamp, reverse=True)[:limit]

    def get_statistics(self) -> dict[str, Any]:
        """Get audit statistics."""
        total = len(self.entries)

        by_actor_type = {}
        by_action = {}
        by_resource_type = {}

        for entry in self.entries:
            by_actor_type[entry.actor_type] = by_actor_type.get(entry.actor_type, 0) + 1
            by_action[entry.action.value] = by_action.get(entry.action.value, 0) + 1
            by_resource_type[entry.resource_type] = by_resource_type.get(entry.resource_type, 0) + 1

        return {
            "total_entries": total,
            "unique_actors": len(self.entries_by_actor),
            "unique_resources": len(self.entries_by_resource),
            "by_actor_type": by_actor_type,
            "by_action": by_action,
            "by_resource_type": by_resource_type,
        }

    def generate_attribution_report(
        self,
        resource_type: str,
        resource_id: str,
    ) -> dict[str, Any]:
        """Generate detailed attribution report for a resource."""
        history = self.get_resource_history(resource_type, resource_id)

        actors = {entry.actor for entry in history}
        actions = {}

        for entry in history:
            action = entry.action.value
            if action not in actions:
                actions[action] = []
            actions[action].append({
                "actor": entry.actor,
                "timestamp": entry.timestamp.isoformat(),
                "description": entry.description,
            })

        return {
            "resource_type": resource_type,
            "resource_id": resource_id,
            "total_actions": len(history),
            "unique_actors": len(actors),
            "actors": list(actors),
            "action_timeline": actions,
            "created_by": history[-1].actor if history else None,
            "created_at": history[-1].timestamp.isoformat() if history else None,
            "last_modified_by": history[0].actor if history else None,
            "last_modified_at": history[0].timestamp.isoformat() if history else None,
        }
