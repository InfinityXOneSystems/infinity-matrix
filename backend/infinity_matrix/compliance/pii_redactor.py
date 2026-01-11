"""
PII detection and redaction pipeline.
"""
import re
from datetime import datetime
from typing import Any, dict, list

import structlog

logger = structlog.get_logger()


class PIIRedactor:
    """Automated PII detection and redaction."""

    def __init__(self):
        self.patterns = {
            "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
            "phone": r'\b(\+?1-?)?(\()?\d{3}(\))?[-.\s]?\d{3}[-.\s]?\d{4}\b',
            "credit_card": r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
            "ip_address": r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
        }
        self.redaction_history: list[dict[str, Any]] = []

    def redact_text(
        self,
        text: str,
        replacement: str = "[REDACTED]",
    ) -> dict[str, Any]:
        """Redact PII from text."""
        original_text = text
        redacted_text = text
        findings = []

        for pii_type, pattern in self.patterns.items():
            matches = re.finditer(pattern, redacted_text)
            match_count = 0

            for match in matches:
                findings.append({
                    "type": pii_type,
                    "value": match.group(),
                    "position": match.span(),
                })
                match_count += 1

            if match_count > 0:
                redacted_text = re.sub(pattern, replacement, redacted_text)

        result = {
            "timestamp": datetime.now().isoformat(),
            "original_length": len(original_text),
            "redacted_length": len(redacted_text),
            "findings_count": len(findings),
            "findings": findings,
            "redacted_text": redacted_text,
        }

        self.redaction_history.append(result)

        if findings:
            logger.info(
                "PII redacted",
                findings_count=len(findings),
                types=[f["type"] for f in findings],
            )

        return result

    def redact_dict(
        self,
        data: dict[str, Any],
        replacement: str = "[REDACTED]",
    ) -> dict[str, Any]:
        """Recursively redact PII from dictionary."""
        redacted = {}

        for key, value in data.items():
            if isinstance(value, str):
                result = self.redact_text(value, replacement)
                redacted[key] = result["redacted_text"]
            elif isinstance(value, dict):
                redacted[key] = self.redact_dict(value, replacement)
            elif isinstance(value, list):
                redacted[key] = [
                    self.redact_text(item, replacement)["redacted_text"]
                    if isinstance(item, str)
                    else item
                    for item in value
                ]
            else:
                redacted[key] = value

        return redacted

    def get_redaction_statistics(self) -> dict[str, Any]:
        """Get PII redaction statistics."""
        total_redactions = len(self.redaction_history)
        total_findings = sum(r["findings_count"] for r in self.redaction_history)

        by_type = {}
        for record in self.redaction_history:
            for finding in record.get("findings", []):
                pii_type = finding["type"]
                by_type[pii_type] = by_type.get(pii_type, 0) + 1

        return {
            "total_redactions": total_redactions,
            "total_findings": total_findings,
            "by_type": by_type,
        }
