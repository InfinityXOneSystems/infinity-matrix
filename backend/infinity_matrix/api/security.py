"""
Security API endpoints.
"""
from typing import Any, dict, list

from fastapi import APIRouter, HTTPException
from infinity_matrix.security.incident_response import IncidentSeverity
from pydantic import BaseModel

from infinity_matrix.security import IncidentResponseSystem, SecurityScanner, ThreatDetector

router = APIRouter()

# Global instances
security_scanner = SecurityScanner()
incident_system = IncidentResponseSystem()
threat_detector = ThreatDetector()


class ScanRequest(BaseModel):
    """Security scan request."""
    include_containers: bool = False


class IncidentRequest(BaseModel):
    """Incident creation request."""
    title: str
    description: str
    severity: str
    source: str
    metadata: dict[str, Any] | None = None


@router.post("/scan")
async def run_security_scan(request: ScanRequest) -> dict[str, Any]:
    """Run comprehensive security scan."""
    result = await security_scanner.run_full_scan(request.include_containers)
    return result


@router.get("/scan/history")
async def get_scan_history(limit: int = 10) -> list[dict[str, Any]]:
    """Get security scan history."""
    return security_scanner.get_scan_history(limit)


@router.post("/incidents")
async def create_incident(request: IncidentRequest) -> dict[str, Any]:
    """Create new security incident."""
    try:
        severity = IncidentSeverity(request.severity)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid severity level")

    incident = await incident_system.detect_incident(
        title=request.title,
        description=request.description,
        severity=severity,
        source=request.source,
        metadata=request.metadata,
    )

    return incident.to_dict()


@router.get("/incidents")
async def list_incidents() -> list[dict[str, Any]]:
    """list all incidents."""
    incidents = incident_system.list_incidents()
    return [i.to_dict() for i in incidents]


@router.get("/incidents/{incident_id}")
async def get_incident(incident_id: str) -> dict[str, Any]:
    """Get specific incident."""
    incident = incident_system.get_incident(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident.to_dict()


@router.get("/incidents/stats")
async def get_incident_stats() -> dict[str, Any]:
    """Get incident statistics."""
    return incident_system.get_statistics()


@router.post("/threats/analyze")
async def analyze_threat(request_data: dict[str, Any]) -> dict[str, Any]:
    """Analyze request for threats."""
    result = await threat_detector.analyze_request(request_data)
    return result


@router.get("/threats/history")
async def get_threat_history(limit: int = 100) -> list[dict[str, Any]]:
    """Get threat detection history."""
    return threat_detector.get_threat_history(limit)


@router.get("/threats/stats")
async def get_threat_stats() -> dict[str, Any]:
    """Get threat statistics."""
    return threat_detector.get_threat_statistics()
