"""
Compliance API endpoints.
"""
from typing import Any, dict

from fastapi import APIRouter, HTTPException
from infinity_matrix.compliance import ComplianceChecker, PIIRedactor
from infinity_matrix.compliance.compliance_checker import ComplianceFramework
from pydantic import BaseModel

router = APIRouter()

pii_redactor = PIIRedactor()
compliance_checker = ComplianceChecker()


class RedactionRequest(BaseModel):
    """PII redaction request."""
    text: str
    replacement: str = "[REDACTED]"


class ComplianceCheckRequest(BaseModel):
    """Compliance check request."""
    framework: str
    system_config: dict[str, Any]


@router.post("/pii/redact")
async def redact_pii(request: RedactionRequest) -> dict[str, Any]:
    """Redact PII from text."""
    return pii_redactor.redact_text(request.text, request.replacement)


@router.get("/pii/stats")
async def get_redaction_stats() -> dict[str, Any]:
    """Get PII redaction statistics."""
    return pii_redactor.get_redaction_statistics()


@router.post("/check")
async def run_compliance_check(request: ComplianceCheckRequest) -> dict[str, Any]:
    """Run compliance check."""
    try:
        framework = ComplianceFramework(request.framework)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid framework")

    result = await compliance_checker.run_compliance_check(
        framework=framework,
        system_config=request.system_config,
    )
    return result


@router.get("/report")
async def generate_compliance_report(
    frameworks: str | None = None,
) -> dict[str, Any]:
    """Generate compliance report."""
    framework_list = None
    if frameworks:
        try:
            framework_list = [ComplianceFramework(f) for f in frameworks.split(",")]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid framework")

    return compliance_checker.generate_compliance_report(framework_list)


@router.get("/templates/{framework}")
async def get_compliance_templates(framework: str) -> dict[str, Any]:
    """Get compliance templates."""
    try:
        fw = ComplianceFramework(framework)
    except ValueError:
        raise HTTPException(status_code=404, detail="Framework not found")

    return compliance_checker.get_compliance_templates(fw)
