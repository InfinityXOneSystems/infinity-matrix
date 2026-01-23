"""AI Vision Cortex for intelligent prompt interpretation and blueprint selection."""

import os
from typing import Any, dict, list

from pydantic import BaseModel

from infinity_matrix.core.config import Config


class Requirement(BaseModel):
    """Extracted requirement from user prompt."""

    category: str
    description: str
    priority: str = "medium"
    technical_details: dict[str, Any] | None = None


class PromptAnalysis(BaseModel):
    """Analysis result from prompt interpretation."""

    intent: str
    requirements: list[Requirement]
    suggested_stack: list[str]
    suggested_modules: list[str]
    complexity: str
    estimated_time: str


class VisionCortex:
    """AI-powered vision cortex for interpreting prompts and selecting blueprints."""

    def __init__(self, config: Config):
        self.config = config
        self._llm_client = None

    def analyze_prompt(self, prompt: str) -> PromptAnalysis:
        """
        Analyze user prompt to extract requirements and suggest architecture.

        Args:
            prompt: Natural language description of the desired application

        Returns:
            PromptAnalysis containing extracted requirements and suggestions
        """
        # For now, use rule-based analysis
        # In full implementation, this would use LLM
        return self._rule_based_analysis(prompt)

    def _rule_based_analysis(self, prompt: str) -> PromptAnalysis:
        """Rule-based prompt analysis for basic functionality."""
        prompt_lower = prompt.lower()

        # Detect intent
        intent = "build_application"
        if "api" in prompt_lower:
            intent = "build_api"
        elif "website" in prompt_lower or "web app" in prompt_lower:
            intent = "build_web_app"
        elif "microservice" in prompt_lower:
            intent = "build_microservice"

        # Extract requirements
        requirements = []

        if "auth" in prompt_lower or "authentication" in prompt_lower:
            requirements.append(Requirement(
                category="security",
                description="User authentication and authorization",
                priority="high"
            ))

        if "database" in prompt_lower or "db" in prompt_lower or "data" in prompt_lower:
            requirements.append(Requirement(
                category="storage",
                description="Database integration",
                priority="high"
            ))

        if "api" in prompt_lower or "rest" in prompt_lower or "graphql" in prompt_lower:
            requirements.append(Requirement(
                category="api",
                description="API endpoints",
                priority="high"
            ))

        if "ui" in prompt_lower or "frontend" in prompt_lower or "interface" in prompt_lower:
            requirements.append(Requirement(
                category="frontend",
                description="User interface",
                priority="medium"
            ))

        # Suggest stack
        suggested_stack = []
        if "python" in prompt_lower:
            suggested_stack.append("python")
        elif "node" in prompt_lower or "javascript" in prompt_lower or "typescript" in prompt_lower:
            suggested_stack.append("node")
        elif "go" in prompt_lower or "golang" in prompt_lower:
            suggested_stack.append("go")
        else:
            # Default to Python for versatility
            suggested_stack.append("python")

        # Suggest modules
        suggested_modules = []
        if any(req.category == "security" for req in requirements):
            suggested_modules.append("auth")
        if any(req.category == "storage" for req in requirements):
            suggested_modules.append("database")
        if any(req.category == "api" for req in requirements):
            suggested_modules.append("api")
        if any(req.category == "frontend" for req in requirements):
            suggested_modules.append("ui")

        # Determine complexity
        complexity = "simple"
        if len(requirements) > 5:
            complexity = "complex"
        elif len(requirements) > 2:
            complexity = "moderate"

        return PromptAnalysis(
            intent=intent,
            requirements=requirements,
            suggested_stack=suggested_stack,
            suggested_modules=suggested_modules,
            complexity=complexity,
            estimated_time="15-30 minutes"
        )

    def select_blueprint(self, analysis: PromptAnalysis) -> str:
        """
        Select the best blueprint/template based on analysis.

        Args:
            analysis: PromptAnalysis from analyze_prompt

        Returns:
            Template name to use
        """
        stack = analysis.suggested_stack[0] if analysis.suggested_stack else "python"

        # Map intent and requirements to template
        if analysis.intent == "build_api":
            if stack == "python":
                return "python-fastapi-api"
            elif stack == "node":
                return "node-express-api"
            elif stack == "go":
                return "go-gin-api"

        if analysis.intent == "build_web_app":
            if stack == "python":
                return "python-django-web"
            elif stack == "node":
                return "node-nextjs-web"

        # Default templates
        if stack == "python":
            return "python-fastapi-starter"
        elif stack == "node":
            return "node-express-starter"
        elif stack == "go":
            return "go-gin-starter"

        return "python-fastapi-starter"

    def _get_llm_client(self) -> Any:
        """Get or create LLM client."""
        if self._llm_client is not None:
            return self._llm_client

        # Initialize LLM client based on config
        provider = self.config.ai.provider
        api_key = self.config.ai.api_key or os.getenv(f"{provider.upper()}_API_KEY")

        if not api_key:
            # Return None if no API key available, fall back to rule-based
            return None

        # In full implementation, initialize actual LLM client
        # For now, return None to use rule-based analysis
        return None
