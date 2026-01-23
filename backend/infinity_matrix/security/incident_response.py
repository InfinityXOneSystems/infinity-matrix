"""
Automated incident response system with auto-lockdown and escalation.
"""
import asyncio
from datetime import datetime
from enum import Enum
from typing import Any, dict, list

import structlog

logger = structlog.get_logger()


class IncidentSeverity(str, Enum):
    """Incident severity levels."""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class IncidentStatus(str, Enum):
    """Incident status."""
    DETECTED = "detected"
    INVESTIGATING = "investigating"
    CONTAINED = "contained"
    RESOLVED = "resolved"
    CLOSED = "closed"


class Incident:
    """Incident data model."""

    def __init__(
        self,
        incident_id: str,
        title: str,
        description: str,
        severity: IncidentSeverity,
        source: str,
        metadata: dict[str, Any] | None = None,
    ):
        self.incident_id = incident_id
        self.title = title
        self.description = description
        self.severity = severity
        self.source = source
        self.status = IncidentStatus.DETECTED
        self.metadata = metadata or {}
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.actions_taken: list[dict[str, Any]] = []

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "incident_id": self.incident_id,
            "title": self.title,
            "description": self.description,
            "severity": self.severity.value,
            "source": self.source,
            "status": self.status.value,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "actions_taken": self.actions_taken,
        }


class IncidentResponseSystem:
    """Automated incident response with lockdown, alerting, rollback, and escalation."""

    def __init__(self):
        self.incidents: dict[str, Incident] = {}
        self.auto_lockdown_enabled = True
        self.alert_channels = ["email", "slack", "pagerduty"]

    async def detect_incident(
        self,
        title: str,
        description: str,
        severity: IncidentSeverity,
        source: str,
        metadata: dict[str, Any] | None = None,
    ) -> Incident:
        """Detect and create new incident."""
        incident_id = f"INC-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

        incident = Incident(
            incident_id=incident_id,
            title=title,
            description=description,
            severity=severity,
            source=source,
            metadata=metadata,
        )

        self.incidents[incident_id] = incident

        logger.warning(
            "Incident detected",
            incident_id=incident_id,
            severity=severity.value,
            title=title,
        )

        # Auto-response based on severity
        await self._auto_respond(incident)

        return incident

    async def _auto_respond(self, incident: Incident) -> None:
        """Automated incident response."""
        actions = []

        # Alert
        alert_action = await self._send_alert(incident)
        actions.append(alert_action)

        # Auto-lockdown for critical incidents
        if incident.severity == IncidentSeverity.CRITICAL and self.auto_lockdown_enabled:
            lockdown_action = await self._auto_lockdown(incident)
            actions.append(lockdown_action)

        # Escalate high/critical incidents
        if incident.severity in [IncidentSeverity.CRITICAL, IncidentSeverity.HIGH]:
            escalation_action = await self._escalate(incident)
            actions.append(escalation_action)

        incident.actions_taken.extend(actions)
        incident.updated_at = datetime.now()

    async def _send_alert(self, incident: Incident) -> dict[str, Any]:
        """Send alert to configured channels."""
        logger.info(
            "Sending alerts",
            incident_id=incident.incident_id,
            channels=self.alert_channels,
        )

        # Simulate sending alerts
        await asyncio.sleep(0.1)

        return {
            "action": "alert",
            "timestamp": datetime.now().isoformat(),
            "channels": self.alert_channels,
            "status": "sent",
        }

    async def _auto_lockdown(self, incident: Incident) -> dict[str, Any]:
        """Execute auto-lockdown procedures."""
        logger.warning(
            "Executing auto-lockdown",
            incident_id=incident.incident_id,
        )

        # Simulate lockdown actions
        lockdown_actions = [
            "Disabled external API access",
            "Enabled rate limiting",
            "Activated circuit breakers",
            "Notified security team",
        ]

        await asyncio.sleep(0.1)

        incident.status = IncidentStatus.CONTAINED

        return {
            "action": "lockdown",
            "timestamp": datetime.now().isoformat(),
            "actions": lockdown_actions,
            "status": "executed",
        }

    async def _escalate(self, incident: Incident) -> dict[str, Any]:
        """Escalate incident to on-call team."""
        logger.warning(
            "Escalating incident",
            incident_id=incident.incident_id,
            severity=incident.severity.value,
        )

        # Simulate escalation
        await asyncio.sleep(0.1)

        return {
            "action": "escalate",
            "timestamp": datetime.now().isoformat(),
            "escalated_to": "on-call-team",
            "notification_method": "pagerduty",
            "status": "escalated",
        }

    async def rollback(self, incident: Incident, target_version: str) -> dict[str, Any]:
        """Rollback to previous version."""
        logger.info(
            "Executing rollback",
            incident_id=incident.incident_id,
            target_version=target_version,
        )

        # Simulate rollback
        await asyncio.sleep(0.1)

        rollback_action = {
            "action": "rollback",
            "timestamp": datetime.now().isoformat(),
            "target_version": target_version,
            "status": "completed",
        }

        incident.actions_taken.append(rollback_action)
        incident.status = IncidentStatus.RESOLVED
        incident.updated_at = datetime.now()

        return rollback_action

    def get_incident(self, incident_id: str) -> Incident | None:
        """Get incident by ID."""
        return self.incidents.get(incident_id)

    def list_incidents(
        self,
        status: IncidentStatus | None = None,
        severity: IncidentSeverity | None = None,
    ) -> list[Incident]:
        """list incidents with optional filters."""
        incidents = list(self.incidents.values())

        if status:
            incidents = [i for i in incidents if i.status == status]

        if severity:
            incidents = [i for i in incidents if i.severity == severity]

        return sorted(incidents, key=lambda x: x.created_at, reverse=True)

    def get_statistics(self) -> dict[str, Any]:
        """Get incident statistics."""
        total = len(self.incidents)

        by_severity = {}
        by_status = {}

        for incident in self.incidents.values():
            by_severity[incident.severity.value] = by_severity.get(incident.severity.value, 0) + 1
            by_status[incident.status.value] = by_status.get(incident.status.value, 0) + 1

        return {
            "total_incidents": total,
            "by_severity": by_severity,
            "by_status": by_status,
        }
