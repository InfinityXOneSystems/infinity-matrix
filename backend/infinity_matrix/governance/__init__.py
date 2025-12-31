"""
Governance module with approval gates and escalation.
"""
from infinity_matrix.governance.approval_system import ApprovalSystem
from infinity_matrix.governance.audit_log import AuditLog

__all__ = ["ApprovalSystem", "AuditLog"]
