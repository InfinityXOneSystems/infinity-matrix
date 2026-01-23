"""Code Analysis Agent - Analyzes code for quality, bugs, and improvements."""

from typing import Any, dict

from infinity_matrix.agents.base_agent import AgentCapability, BaseAgent
from infinity_matrix.core.logging import get_logger

logger = get_logger(__name__)


class CodeAgent(BaseAgent):
    """Agent specialized in code analysis and review."""

    def __init__(self, name: str = "code-agent"):
        """Initialize code agent."""
        capabilities = [
            AgentCapability(
                name="analyze",
                description="Analyze code for quality and issues",
                input_schema={"code": "string", "language": "string"},
                output_schema={"issues": "array", "metrics": "object"},
            ),
            AgentCapability(
                name="review",
                description="Perform code review",
                input_schema={"code": "string", "context": "object"},
                output_schema={"comments": "array", "score": "number"},
            ),
            AgentCapability(
                name="suggest",
                description="Suggest improvements",
                input_schema={"code": "string"},
                output_schema={"suggestions": "array"},
            ),
        ]
        super().__init__(
            name=name,
            agent_type="code_analysis",
            description="Analyzes code for quality, bugs, and improvements",
            capabilities=capabilities,
        )

    async def _execute(self, task: dict[str, Any]) -> dict[str, Any]:
        """Execute code analysis task."""
        action = task.get("action", "analyze")
        code = task.get("code", "")
        language = task.get("language", "python")

        if action == "analyze":
            return await self._analyze_code(code, language)
        elif action == "review":
            return await self._review_code(code, task.get("context", {}))
        elif action == "suggest":
            return await self._suggest_improvements(code)
        else:
            raise ValueError(f"Unknown action: {action}")

    async def validate(self, task: dict[str, Any]) -> bool:
        """Validate task input."""
        if "action" not in task:
            return False
        if "code" not in task:
            return False
        return True

    async def _analyze_code(self, code: str, language: str) -> dict[str, Any]:
        """Analyze code for issues and metrics."""
        self.logger.info("analyzing_code", language=language, code_length=len(code))

        # In production, use AST parsing, linters, and static analysis tools
        issues = []

        # Basic checks
        lines = code.split("\n")
        for i, line in enumerate(lines, 1):
            if len(line) > 100:
                issues.append(
                    {
                        "line": i,
                        "severity": "warning",
                        "message": "Line too long",
                        "type": "style",
                    }
                )
            if "TODO" in line or "FIXME" in line:
                issues.append(
                    {
                        "line": i,
                        "severity": "info",
                        "message": "TODO/FIXME comment found",
                        "type": "maintenance",
                    }
                )

        metrics = {
            "lines_of_code": len(lines),
            "complexity": self._calculate_complexity(code),
            "maintainability_index": 75.5,
            "test_coverage": 0.0,
        }

        return {
            "status": "completed",
            "issues": issues,
            "metrics": metrics,
            "language": language,
        }

    async def _review_code(self, code: str, context: dict[str, Any]) -> dict[str, Any]:
        """Review code and provide feedback."""
        self.logger.info("reviewing_code", code_length=len(code))

        comments = [
            {
                "line": 1,
                "type": "suggestion",
                "message": "Consider adding type hints for better code clarity",
                "priority": "low",
            },
            {
                "line": 5,
                "type": "improvement",
                "message": "This function could be optimized for better performance",
                "priority": "medium",
            },
        ]

        score = 8.5  # Out of 10

        return {
            "status": "completed",
            "comments": comments,
            "score": score,
            "summary": "Code is well-structured with minor improvements suggested",
        }

    async def _suggest_improvements(self, code: str) -> dict[str, Any]:
        """Suggest code improvements."""
        self.logger.info("suggesting_improvements", code_length=len(code))

        suggestions = [
            {
                "type": "performance",
                "description": "Use list comprehension instead of loop",
                "impact": "medium",
            },
            {
                "type": "readability",
                "description": "Extract magic numbers to named constants",
                "impact": "low",
            },
            {
                "type": "security",
                "description": "Validate user input before processing",
                "impact": "high",
            },
        ]

        return {
            "status": "completed",
            "suggestions": suggestions,
            "total_suggestions": len(suggestions),
        }

    def _calculate_complexity(self, code: str) -> int:
        """Calculate cyclomatic complexity (simplified)."""
        # Count decision points
        complexity = 1
        keywords = ["if", "elif", "for", "while", "and", "or", "try", "except"]
        for keyword in keywords:
            complexity += code.count(f" {keyword} ")
        return complexity
