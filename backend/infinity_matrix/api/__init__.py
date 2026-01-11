"""
API routers for all endpoints.
"""

from infinity_matrix.api.audit import router as audit_router
from infinity_matrix.api.compliance import router as compliance_router
from infinity_matrix.api.cost import router as cost_router
from infinity_matrix.api.docs import router as docs_router
from infinity_matrix.api.dr import router as dr_router
from infinity_matrix.api.feedback import router as feedback_router
from infinity_matrix.api.governance import router as governance_router
from infinity_matrix.api.monitoring import router as monitoring_router
from infinity_matrix.api.security import router as security_router

__all__ = [
    "security_router",
    "monitoring_router",
    "governance_router",
    "compliance_router",
    "cost_router",
    "docs_router",
    "feedback_router",
    "dr_router",
    "audit_router",
]
