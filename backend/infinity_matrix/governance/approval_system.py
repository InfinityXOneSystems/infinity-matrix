"""
Approval system with multi-level gates for high-risk operations.
"""
from datetime import datetime
from enum import Enum
from typing import Any, dict, list

import structlog

logger = structlog.get_logger()


class ApprovalStatus(str, Enum):
    """Approval request status."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    ESCALATED = "escalated"
    EXPIRED = "expired"


class RiskLevel(str, Enum):
    """Risk level for operations."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ApprovalRequest:
    """Approval request data model."""

    def __init__(
        self,
        request_id: str,
        operation: str,
        risk_level: RiskLevel,
        requester: str,
        description: str,
        metadata: dict[str, Any] | None = None,
    ):
        self.request_id = request_id
        self.operation = operation
        self.risk_level = risk_level
        self.requester = requester
        self.description = description
        self.metadata = metadata or {}
        self.status = ApprovalStatus.PENDING
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.approvers: list[dict[str, Any]] = []
        self.comments: list[dict[str, Any]] = []

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "request_id": self.request_id,
            "operation": self.operation,
            "risk_level": self.risk_level.value,
            "requester": self.requester,
            "description": self.description,
            "metadata": self.metadata,
            "status": self.status.value,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "approvers": self.approvers,
            "comments": self.comments,
        }


class ApprovalSystem:
    """Multi-level approval system with agent handoff and escalation."""

    def __init__(self):
        self.requests: dict[str, ApprovalRequest] = {}
        self.approval_rules = {
            RiskLevel.LOW: {"required_approvals": 1, "auto_approve_threshold": 0.9},
            RiskLevel.MEDIUM: {"required_approvals": 2, "auto_approve_threshold": 0.95},
            RiskLevel.HIGH: {"required_approvals": 3, "auto_approve_threshold": None},
            RiskLevel.CRITICAL: {"required_approvals": 5, "auto_approve_threshold": None},
        }

    async def submit_approval_request(
        self,
        operation: str,
        risk_level: RiskLevel,
        requester: str,
        description: str,
        metadata: dict[str, Any] | None = None,
    ) -> ApprovalRequest:
        """Submit new approval request."""
        request_id = f"APR-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

        request = ApprovalRequest(
            request_id=request_id,
            operation=operation,
            risk_level=risk_level,
            requester=requester,
            description=description,
            metadata=metadata,
        )

        self.requests[request_id] = request

        logger.info(
            "Approval request submitted",
            request_id=request_id,
            operation=operation,
            risk_level=risk_level.value,
        )

        # Check if auto-approval is possible
        rules = self.approval_rules[risk_level]
        if rules["auto_approve_threshold"] and \
           metadata and \
           metadata.get("confidence", 0) >= rules["auto_approve_threshold"]:
            await self._auto_approve(request)

        return request

    async def _auto_approve(self, request: ApprovalRequest) -> None:
        """Auto-approve low-risk requests with high confidence."""
        request.status = ApprovalStatus.APPROVED
        request.updated_at = datetime.now()
        request.approvers.append({
            "approver": "system-auto-approval",
            "decision": "approved",
            "timestamp": datetime.now().isoformat(),
            "comment": "Auto-approved based on confidence threshold",
        })

        logger.info("Request auto-approved", request_id=request.request_id)

    async def approve_request(
        self,
        request_id: str,
        approver: str,
        comment: str | None = None,
    ) -> ApprovalRequest:
        """Approve a request."""
        if request_id not in self.requests:
            raise ValueError(f"Request {request_id} not found")

        request = self.requests[request_id]

        if request.status != ApprovalStatus.PENDING:
            raise ValueError(f"Request {request_id} is not pending")

        request.approvers.append({
            "approver": approver,
            "decision": "approved",
            "timestamp": datetime.now().isoformat(),
            "comment": comment or "",
        })

        # Check if enough approvals
        required_approvals = self.approval_rules[request.risk_level]["required_approvals"]
        if len(request.approvers) >= required_approvals:
            request.status = ApprovalStatus.APPROVED
            logger.info("Request fully approved", request_id=request_id)
        else:
            logger.info(
                "Partial approval",
                request_id=request_id,
                approvals=len(request.approvers),
                required=required_approvals,
            )

        request.updated_at = datetime.now()

        return request

    async def reject_request(
        self,
        request_id: str,
        approver: str,
        reason: str,
    ) -> ApprovalRequest:
        """Reject a request."""
        if request_id not in self.requests:
            raise ValueError(f"Request {request_id} not found")

        request = self.requests[request_id]

        if request.status != ApprovalStatus.PENDING:
            raise ValueError(f"Request {request_id} is not pending")

        request.status = ApprovalStatus.REJECTED
        request.updated_at = datetime.now()
        request.approvers.append({
            "approver": approver,
            "decision": "rejected",
            "timestamp": datetime.now().isoformat(),
            "comment": reason,
        })

        logger.info("Request rejected", request_id=request_id, approver=approver)

        return request

    async def escalate_request(
        self,
        request_id: str,
        escalated_to: str,
        reason: str,
    ) -> ApprovalRequest:
        """Escalate a request to higher authority."""
        if request_id not in self.requests:
            raise ValueError(f"Request {request_id} not found")

        request = self.requests[request_id]

        request.status = ApprovalStatus.ESCALATED
        request.updated_at = datetime.now()
        request.comments.append({
            "type": "escalation",
            "escalated_to": escalated_to,
            "reason": reason,
            "timestamp": datetime.now().isoformat(),
        })

        logger.warning(
            "Request escalated",
            request_id=request_id,
            escalated_to=escalated_to,
        )

        return request

    def get_request(self, request_id: str) -> ApprovalRequest | None:
        """Get approval request by ID."""
        return self.requests.get(request_id)

    def list_requests(
        self,
        status: ApprovalStatus | None = None,
        risk_level: RiskLevel | None = None,
        requester: str | None = None,
    ) -> list[ApprovalRequest]:
        """list approval requests with filters."""
        requests = list(self.requests.values())

        if status:
            requests = [r for r in requests if r.status == status]

        if risk_level:
            requests = [r for r in requests if r.risk_level == risk_level]

        if requester:
            requests = [r for r in requests if r.requester == requester]

        return sorted(requests, key=lambda x: x.created_at, reverse=True)

    def get_statistics(self) -> dict[str, Any]:
        """Get approval statistics."""
        total = len(self.requests)

        by_status = {}
        by_risk_level = {}

        for request in self.requests.values():
            by_status[request.status.value] = by_status.get(request.status.value, 0) + 1
            by_risk_level[request.risk_level.value] = by_risk_level.get(request.risk_level.value, 0) + 1

        return {
            "total_requests": total,
            "by_status": by_status,
            "by_risk_level": by_risk_level,
        }
