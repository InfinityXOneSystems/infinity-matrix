"""
Governance API endpoints for approvals and audit logs.
"""
from typing import Any, dict, list

from fastapi import APIRouter, HTTPException
from infinity_matrix.governance import ApprovalSystem, AuditLog
from infinity_matrix.governance.approval_system import ApprovalStatus, RiskLevel
from infinity_matrix.governance.audit_log import AuditActionType
from pydantic import BaseModel

router = APIRouter()

# Global instances
approval_system = ApprovalSystem()
audit_log = AuditLog()


class ApprovalRequest(BaseModel):
    """Approval request submission."""
    operation: str
    risk_level: str
    requester: str
    description: str
    metadata: dict[str, Any] | None = None


class ApprovalDecision(BaseModel):
    """Approval decision."""
    approver: str
    comment: str | None = None


class RejectionDecision(BaseModel):
    """Rejection decision."""
    approver: str
    reason: str


class EscalationRequest(BaseModel):
    """Escalation request."""
    escalated_to: str
    reason: str


class AuditLogRequest(BaseModel):
    """Audit log entry request."""
    actor: str
    actor_type: str
    action: str
    resource_type: str
    resource_id: str
    description: str
    metadata: dict[str, Any] | None = None


@router.post("/approvals")
async def submit_approval_request(request: ApprovalRequest) -> dict[str, Any]:
    """Submit new approval request."""
    try:
        risk_level = RiskLevel(request.risk_level)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid risk level")

    approval_request = await approval_system.submit_approval_request(
        operation=request.operation,
        risk_level=risk_level,
        requester=request.requester,
        description=request.description,
        metadata=request.metadata,
    )

    return approval_request.to_dict()


@router.post("/approvals/{request_id}/approve")
async def approve_request(
    request_id: str,
    decision: ApprovalDecision,
) -> dict[str, Any]:
    """Approve a request."""
    try:
        approval_request = await approval_system.approve_request(
            request_id=request_id,
            approver=decision.approver,
            comment=decision.comment,
        )
        return approval_request.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/approvals/{request_id}/reject")
async def reject_request(
    request_id: str,
    decision: RejectionDecision,
) -> dict[str, Any]:
    """Reject a request."""
    try:
        approval_request = await approval_system.reject_request(
            request_id=request_id,
            approver=decision.approver,
            reason=decision.reason,
        )
        return approval_request.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/approvals/{request_id}/escalate")
async def escalate_request(
    request_id: str,
    escalation: EscalationRequest,
) -> dict[str, Any]:
    """Escalate a request."""
    try:
        approval_request = await approval_system.escalate_request(
            request_id=request_id,
            escalated_to=escalation.escalated_to,
            reason=escalation.reason,
        )
        return approval_request.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/approvals")
async def list_approvals(
    status: str | None = None,
    risk_level: str | None = None,
    requester: str | None = None,
) -> list[dict[str, Any]]:
    """list approval requests."""
    status_filter = ApprovalStatus(status) if status else None
    risk_filter = RiskLevel(risk_level) if risk_level else None

    requests = approval_system.list_requests(
        status=status_filter,
        risk_level=risk_filter,
        requester=requester,
    )

    return [r.to_dict() for r in requests]


@router.get("/approvals/{request_id}")
async def get_approval(request_id: str) -> dict[str, Any]:
    """Get specific approval request."""
    approval_request = approval_system.get_request(request_id)
    if not approval_request:
        raise HTTPException(status_code=404, detail="Request not found")
    return approval_request.to_dict()


@router.get("/approvals/stats")
async def get_approval_stats() -> dict[str, Any]:
    """Get approval statistics."""
    return approval_system.get_statistics()


@router.post("/audit/log")
async def log_audit_entry(request: AuditLogRequest) -> dict[str, Any]:
    """Create audit log entry."""
    try:
        action = AuditActionType(request.action)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid action type")

    entry = await audit_log.log_action(
        actor=request.actor,
        actor_type=request.actor_type,
        action=action,
        resource_type=request.resource_type,
        resource_id=request.resource_id,
        description=request.description,
        metadata=request.metadata,
    )

    return entry.to_dict()


@router.get("/audit/search")
async def search_audit_logs(
    actor: str | None = None,
    actor_type: str | None = None,
    resource_type: str | None = None,
    resource_id: str | None = None,
    limit: int = 100,
) -> list[dict[str, Any]]:
    """Search audit logs."""
    entries = audit_log.search_entries(
        actor=actor,
        actor_type=actor_type,
        resource_type=resource_type,
        resource_id=resource_id,
        limit=limit,
    )

    return [e.to_dict() for e in entries]


@router.get("/audit/actor/{actor}")
async def get_actor_history(actor: str, limit: int = 100) -> list[dict[str, Any]]:
    """Get audit history for actor."""
    entries = audit_log.get_actor_history(actor, limit)
    return [e.to_dict() for e in entries]


@router.get("/audit/resource/{resource_type}/{resource_id}")
async def get_resource_history(
    resource_type: str,
    resource_id: str,
    limit: int = 100,
) -> list[dict[str, Any]]:
    """Get audit history for resource."""
    entries = audit_log.get_resource_history(resource_type, resource_id, limit)
    return [e.to_dict() for e in entries]


@router.get("/audit/attribution/{resource_type}/{resource_id}")
async def get_attribution_report(
    resource_type: str,
    resource_id: str,
) -> dict[str, Any]:
    """Get attribution report for resource."""
    return audit_log.generate_attribution_report(resource_type, resource_id)


@router.get("/audit/stats")
async def get_audit_stats() -> dict[str, Any]:
    """Get audit statistics."""
    return audit_log.get_statistics()
