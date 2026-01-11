"""Blueprint models for defining build specifications."""

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class ProjectType(str, Enum):
    """Supported project types."""

    MICROSERVICE = "microservice"
    WEB_APP = "web-app"
    CLI_TOOL = "cli-tool"
    LIBRARY = "library"
    API = "api"
    MOBILE_APP = "mobile-app"
    DATA_PIPELINE = "data-pipeline"
    ML_MODEL = "ml-model"
    INFRASTRUCTURE = "infrastructure"


class ComponentType(str, Enum):
    """Component types."""

    REST_API = "rest-api"
    GRAPHQL_API = "graphql-api"
    DATABASE = "database"
    CACHE = "cache"
    MESSAGE_QUEUE = "message-queue"
    WORKER = "worker"
    FRONTEND = "frontend"
    BACKEND = "backend"


class DeploymentPlatform(str, Enum):
    """Deployment platforms."""

    KUBERNETES = "kubernetes"
    DOCKER = "docker"
    AWS = "aws"
    GCP = "gcp"
    AZURE = "azure"
    HEROKU = "heroku"
    VERCEL = "vercel"
    SERVERLESS = "serverless"


class Component(BaseModel):
    """Blueprint component specification."""

    name: str
    type: ComponentType
    framework: str | None = None
    language: str | None = None
    features: list[str] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    config: dict[str, Any] = Field(default_factory=dict)


class Environment(BaseModel):
    """Environment variable specification."""

    name: str
    value: str | None = None
    secret: bool = False
    required: bool = True


class DeploymentConfig(BaseModel):
    """Deployment configuration."""

    platform: DeploymentPlatform
    replicas: int = 1
    resources: dict[str, Any] = Field(default_factory=dict)
    environment: list[Environment] = Field(default_factory=list)
    health_check: dict[str, Any] | None = None


class TestingConfig(BaseModel):
    """Testing configuration."""

    unit_tests: bool = True
    integration_tests: bool = True
    e2e_tests: bool = False
    coverage_threshold: int = 80
    frameworks: list[str] = Field(default_factory=list)


class DocumentationConfig(BaseModel):
    """Documentation configuration."""

    api_docs: str | None = "openapi"
    readme: bool = True
    architecture_diagram: bool = True
    deployment_guide: bool = True
    contributing_guide: bool = False


class Blueprint(BaseModel):
    """
    Blueprint model defining project specifications.

    This is the core data structure for defining what should be built.
    """

    # Basic Information
    name: str = Field(..., description="Project name")
    version: str = Field(default="1.0.0", description="Project version")
    type: ProjectType = Field(..., description="Type of project")
    description: str = Field(..., description="Project description")

    # Requirements
    requirements: list[str] = Field(
        default_factory=list,
        description="High-level requirements (e.g., authentication, database)"
    )

    # Components
    components: list[Component] = Field(
        default_factory=list,
        description="Project components"
    )

    # Deployment
    deployment: DeploymentConfig | None = Field(
        None,
        description="Deployment configuration"
    )

    # Testing
    testing: TestingConfig = Field(
        default_factory=TestingConfig,
        description="Testing configuration"
    )

    # Documentation
    documentation: DocumentationConfig = Field(
        default_factory=DocumentationConfig,
        description="Documentation configuration"
    )

    # Metadata
    tags: list[str] = Field(default_factory=list)
    author: str | None = None
    license: str = "MIT"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Additional Configuration
    config: dict[str, Any] = Field(
        default_factory=dict,
        description="Additional configuration"
    )

    class Config:
        """Pydantic configuration."""

        json_schema_extra = {
            "example": {
                "name": "user-service",
                "version": "1.0.0",
                "type": "microservice",
                "description": "User management microservice with REST API",
                "requirements": ["authentication", "database", "caching"],
                "components": [
                    {
                        "name": "user-api",
                        "type": "rest-api",
                        "framework": "fastapi",
                        "features": ["jwt-auth", "rate-limiting"]
                    }
                ],
                "deployment": {
                    "platform": "kubernetes",
                    "replicas": 3
                }
            }
        }

    @classmethod
    def from_prompt(cls, prompt: str) -> "Blueprint":
        """
        Create a blueprint from a natural language prompt.

        This is a simplified version - in production, this would use
        LLM to parse the prompt into a structured blueprint.
        """
        # Simple heuristic-based parsing
        name = "generated-project"
        project_type = ProjectType.API

        # Extract project type hints
        if "microservice" in prompt.lower():
            project_type = ProjectType.MICROSERVICE
        elif "web app" in prompt.lower() or "website" in prompt.lower():
            project_type = ProjectType.WEB_APP
        elif "cli" in prompt.lower() or "command line" in prompt.lower():
            project_type = ProjectType.CLI_TOOL
        elif "library" in prompt.lower():
            project_type = ProjectType.LIBRARY

        return cls(
            name=name,
            type=project_type,
            description=prompt,
        )
