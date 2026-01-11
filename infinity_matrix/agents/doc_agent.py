"""Documentation Agent - Generates and manages documentation."""

from typing import Any, dict, list

from infinity_matrix.agents.base_agent import AgentCapability, BaseAgent
from infinity_matrix.core.logging import get_logger

logger = get_logger(__name__)


class DocAgent(BaseAgent):
    """Agent specialized in documentation generation and management."""

    def __init__(self, name: str = "doc-agent"):
        """Initialize documentation agent."""
        capabilities = [
            AgentCapability(
                name="generate",
                description="Generate documentation from code",
                input_schema={"code": "string", "format": "string"},
                output_schema={"documentation": "string"},
            ),
            AgentCapability(
                name="update",
                description="Update existing documentation",
                input_schema={"documentation": "string", "changes": "array"},
                output_schema={"updated_documentation": "string"},
            ),
            AgentCapability(
                name="validate",
                description="Validate documentation completeness",
                input_schema={"documentation": "string", "code": "string"},
                output_schema={"is_valid": "boolean", "issues": "array"},
            ),
        ]
        super().__init__(
            name=name,
            agent_type="documentation",
            description="Generates and manages documentation",
            capabilities=capabilities,
        )

    async def _execute(self, task: dict[str, Any]) -> dict[str, Any]:
        """Execute documentation task."""
        action = task.get("action", "generate")

        if action == "generate":
            return await self._generate_docs(
                task.get("code", ""),
                task.get("format", "markdown"),
            )
        elif action == "update":
            return await self._update_docs(
                task.get("documentation", ""),
                task.get("changes", []),
            )
        elif action == "validate":
            return await self._validate_docs(
                task.get("documentation", ""),
                task.get("code", ""),
            )
        else:
            raise ValueError(f"Unknown action: {action}")

    async def validate(self, task: dict[str, Any]) -> bool:
        """Validate task input."""
        if "action" not in task:
            return False
        return True

    async def _generate_docs(self, code: str, format: str) -> dict[str, Any]:
        """Generate documentation from code."""
        self.logger.info("generating_documentation", format=format)

        # In production, use AST parsing and docstring extraction
        documentation = self._create_documentation(code, format)

        return {
            "status": "completed",
            "documentation": documentation,
            "format": format,
            "sections": ["overview", "api", "examples"],
        }

    async def _update_docs(
        self, documentation: str, changes: list[dict[str, Any]]
    ) -> dict[str, Any]:
        """Update existing documentation."""
        self.logger.info("updating_documentation", changes_count=len(changes))

        # Apply changes
        updated_doc = documentation
        for change in changes:
            section = change.get("section")
            content = change.get("content")
            # In production, intelligently merge changes
            updated_doc += f"\n\n## {section}\n{content}"

        return {
            "status": "completed",
            "updated_documentation": updated_doc,
            "changes_applied": len(changes),
        }

    async def _validate_docs(self, documentation: str, code: str) -> dict[str, Any]:
        """Validate documentation completeness."""
        self.logger.info("validating_documentation")

        issues = []

        # Check for required sections
        required_sections = ["Overview", "Installation", "Usage", "API"]
        for section in required_sections:
            if section.lower() not in documentation.lower():
                issues.append(
                    {
                        "type": "missing_section",
                        "severity": "warning",
                        "message": f"Missing section: {section}",
                    }
                )

        # Check if documentation matches code
        if code and len(documentation) < len(code) * 0.1:
            issues.append(
                {
                    "type": "incomplete",
                    "severity": "error",
                    "message": "Documentation seems too brief for the codebase",
                }
            )

        is_valid = len([i for i in issues if i["severity"] == "error"]) == 0

        return {
            "status": "completed",
            "is_valid": is_valid,
            "issues": issues,
            "completeness_score": max(0, 100 - len(issues) * 10),
        }

    def _create_documentation(self, code: str, format: str) -> str:
        """Create documentation content."""
        if format == "markdown":
            return self._generate_markdown(code)
        elif format == "html":
            return self._generate_html(code)
        else:
            return self._generate_markdown(code)

    def _generate_markdown(self, code: str) -> str:
        """Generate markdown documentation."""
        return """# API Documentation

## Overview

This module provides functionality for processing and analysis.

## Installation

```bash
pip install infinity-matrix
```

## Usage

```python
# Example usage
from infinity_matrix import Component

component = Component()
result = component.process()
```

## API Reference

### Classes

#### Component

Main component class for processing.

**Methods:**

- `process()` - Process data
- `validate()` - Validate input

## Examples

See the examples directory for more usage examples.
"""

    def _generate_html(self, code: str) -> str:
        """Generate HTML documentation."""
        return """<!DOCTYPE html>
<html>
<head><title>API Documentation</title></head>
<body>
<h1>API Documentation</h1>
<h2>Overview</h2>
<p>This module provides functionality for processing and analysis.</p>
</body>
</html>"""
