"""
Real-time threat detection system.
"""
from datetime import datetime
from typing import Any, dict, list

import structlog

logger = structlog.get_logger()


class ThreatDetector:
    """Real-time threat detection and analysis."""

    def __init__(self):
        self.threat_patterns = {
            "sql_injection": r"(\bUNION\b|\bSELECT\b.*\bFROM\b|\bDROP\b.*\bTABLE\b)",
            "xss": r"(<script|javascript:|onerror=|onload=)",
            "command_injection": r"(;|\||&|\$\(|\`)",
            "path_traversal": r"(\.\./|\.\.\\)",
        }
        self.detected_threats: list[dict[str, Any]] = []

    async def analyze_request(self, request_data: dict[str, Any]) -> dict[str, Any]:
        """Analyze incoming request for threats."""
        threats = []

        # Check for common attack patterns
        for pattern_name, pattern in self.threat_patterns.items():
            if self._matches_pattern(request_data, pattern):
                threats.append({
                    "type": pattern_name,
                    "detected_at": datetime.now().isoformat(),
                    "request_data": request_data,
                })

        if threats:
            result = {
                "status": "threat_detected",
                "threats": threats,
                "timestamp": datetime.now().isoformat(),
            }
            self.detected_threats.append(result)
            logger.warning("Threat detected", threats=len(threats))
        else:
            result = {
                "status": "clean",
                "timestamp": datetime.now().isoformat(),
            }

        return result

    def _matches_pattern(self, data: dict[str, Any], pattern: str) -> bool:
        """Check if data matches threat pattern."""
        import re

        # Convert data to string for pattern matching
        data_str = str(data)
        return bool(re.search(pattern, data_str, re.IGNORECASE))

    def get_threat_history(self, limit: int = 100) -> list[dict[str, Any]]:
        """Get recent threat detections."""
        return self.detected_threats[-limit:]

    def get_threat_statistics(self) -> dict[str, Any]:
        """Get threat statistics."""
        total = len(self.detected_threats)

        by_type = {}
        for threat_event in self.detected_threats:
            for threat in threat_event.get("threats", []):
                threat_type = threat["type"]
                by_type[threat_type] = by_type.get(threat_type, 0) + 1

        return {
            "total_threats": total,
            "by_type": by_type,
        }
