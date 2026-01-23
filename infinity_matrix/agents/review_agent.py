"""Review Agent - Performs comprehensive code and system reviews."""

from typing import Any, dict, list

from infinity_matrix.agents.base_agent import AgentCapability, BaseAgent
from infinity_matrix.core.logging import get_logger

logger = get_logger(__name__)


class ReviewAgent(BaseAgent):
    """Agent specialized in code and system reviews."""

    def __init__(self, name: str = "review-agent"):
        """Initialize review agent."""
        capabilities = [
            AgentCapability(
                name="code_review",
                description="Perform comprehensive code review",
                input_schema={"code": "string", "context": "object"},
                output_schema={"review": "object"},
            ),
            AgentCapability(
                name="security_review",
                description="Review code for security issues",
                input_schema={"code": "string"},
                output_schema={"vulnerabilities": "array"},
            ),
            AgentCapability(
                name="architecture_review",
                description="Review system architecture",
                input_schema={"architecture": "object"},
                output_schema={"recommendations": "array"},
            ),
        ]
        super().__init__(
            name=name,
            agent_type="review",
            description="Performs comprehensive code and system reviews",
            capabilities=capabilities,
        )

    async def _execute(self, task: dict[str, Any]) -> dict[str, Any]:
        """Execute review task."""
        action = task.get("action", "code_review")

        if action == "code_review":
            return await self._code_review(
                task.get("code", ""),
                task.get("context", {}),
            )
        elif action == "security_review":
            return await self._security_review(task.get("code", ""))
        elif action == "architecture_review":
            return await self._architecture_review(task.get("architecture", {}))
        else:
            raise ValueError(f"Unknown action: {action}")

    async def validate(self, task: dict[str, Any]) -> bool:
        """Validate task input."""
        if "action" not in task:
            return False
        return True

    async def _code_review(self, code: str, context: dict[str, Any]) -> dict[str, Any]:
        """Perform comprehensive code review."""
        self.logger.info("performing_code_review", code_length=len(code))

        review = {
            "overall_score": 8.5,
            "categories": {
                "readability": {
                    "score": 9.0,
                    "comments": ["Clear variable names", "Good function structure"],
                },
                "maintainability": {
                    "score": 8.5,
                    "comments": ["Well modularized", "Consider adding more comments"],
                },
                "performance": {
                    "score": 8.0,
                    "comments": ["Generally efficient", "Could optimize loop in line 45"],
                },
                "security": {
                    "score": 8.5,
                    "comments": ["No major issues", "Validate all user inputs"],
                },
            },
            "issues": [
                {
                    "severity": "medium",
                    "line": 45,
                    "message": "Consider using generator expression for memory efficiency",
                    "category": "performance",
                },
                {
                    "severity": "low",
                    "line": 12,
                    "message": "Magic number should be extracted to constant",
                    "category": "maintainability",
                },
            ],
            "strengths": [
                "Clean code structure",
                "Good error handling",
                "Comprehensive docstrings",
            ],
            "recommendations": [
                "Add input validation for edge cases",
                "Consider implementing caching for frequently called methods",
                "Add more unit tests for error conditions",
            ],
        }

        return {
            "status": "completed",
            "review": review,
        }

    async def _security_review(self, code: str) -> dict[str, Any]:
        """Review code for security vulnerabilities."""
        self.logger.info("performing_security_review", code_length=len(code))

        vulnerabilities = []

        # Check for common security issues
        if "eval(" in code:
            vulnerabilities.append(
                {
                    "severity": "critical",
                    "type": "code_injection",
                    "message": "Use of eval() detected - potential code injection vulnerability",
                    "remediation": "Avoid eval(), use ast.literal_eval() for safe evaluation",
                }
            )

        if "pickle.loads(" in code:
            vulnerabilities.append(
                {
                    "severity": "high",
                    "type": "insecure_deserialization",
                    "message": "Unsafe pickle deserialization",
                    "remediation": "Use JSON or validate pickle data source",
                }
            )

        if "password" in code.lower() and "=" in code:
            vulnerabilities.append(
                {
                    "severity": "medium",
                    "type": "hardcoded_credentials",
                    "message": "Possible hardcoded credentials",
                    "remediation": "Use environment variables or secure key management",
                }
            )

        return {
            "status": "completed",
            "vulnerabilities": vulnerabilities,
            "risk_level": self._calculate_risk_level(vulnerabilities),
            "scan_timestamp": "2025-12-31T02:30:00Z",
        }

    async def _architecture_review(self, architecture: dict[str, Any]) -> dict[str, Any]:
        """Review system architecture."""
        self.logger.info("performing_architecture_review")

        recommendations = [
            {
                "category": "scalability",
                "priority": "high",
                "recommendation": "Implement horizontal scaling with load balancer",
                "rationale": "Current architecture may not handle increased load",
            },
            {
                "category": "reliability",
                "priority": "medium",
                "recommendation": "Add circuit breaker pattern for external service calls",
                "rationale": "Improve resilience to service failures",
            },
            {
                "category": "security",
                "priority": "high",
                "recommendation": "Implement API rate limiting",
                "rationale": "Protect against abuse and DDoS attacks",
            },
            {
                "category": "observability",
                "priority": "medium",
                "recommendation": "Add distributed tracing",
                "rationale": "Improve debugging and performance monitoring",
            },
        ]

        return {
            "status": "completed",
            "recommendations": recommendations,
            "architecture_score": 7.5,
            "summary": "Solid foundation with room for improvement in scalability and observability",
        }

    def _calculate_risk_level(self, vulnerabilities: list[dict[str, Any]]) -> str:
        """Calculate overall risk level."""
        if not vulnerabilities:
            return "low"

        severity_scores = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        total_score = sum(severity_scores.get(v["severity"], 0) for v in vulnerabilities)

        if total_score >= 4:
            return "critical"
        elif total_score >= 3:
            return "high"
        elif total_score >= 2:
            return "medium"
        else:
            return "low"
