"""Configuration management for Infinity Matrix."""

from pathlib import Path
from typing import Optional

import yaml
from pydantic import BaseModel, Field


class AIConfig(BaseModel):
    """AI/LLM configuration."""

    provider: str = Field(default="openai", description="AI provider (openai, anthropic, etc.)")
    model: str = Field(default="gpt-4", description="Model to use")
    api_key: str | None = Field(default=None, description="API key for AI provider")
    max_tokens: int = Field(default=4096, description="Maximum tokens for responses")
    temperature: float = Field(default=0.7, description="Temperature for generation")


class SecurityConfig(BaseModel):
    """Security configuration."""

    encryption_enabled: bool = Field(default=True, description="Enable encryption")
    secrets_backend: str = Field(default="local", description="Secrets backend (local, vault, aws, etc.)")
    rbac_enabled: bool = Field(default=True, description="Enable RBAC")
    audit_logging: bool = Field(default=True, description="Enable audit logging")


class AgentConfig(BaseModel):
    """Agent configuration."""

    enabled: bool = Field(default=True, description="Enable agents")
    frameworks: list[str] = Field(default_factory=lambda: ["langchain"], description="Agent frameworks")
    auto_heal: bool = Field(default=False, description="Enable auto-healing")
    auto_document: bool = Field(default=True, description="Enable auto-documentation")


class TemplateConfig(BaseModel):
    """Template configuration."""

    template_dir: str = Field(default="~/.infinity-matrix/templates")
    custom_templates: list[str] = Field(default_factory=list, description="Custom template paths")

    def get_template_dir(self) -> Path:
        """Get template directory as Path."""
        return Path(self.template_dir).expanduser()

    def get_custom_templates(self) -> list[Path]:
        """Get custom template paths as list of Path objects."""
        return [Path(p).expanduser() for p in self.custom_templates]


class Config(BaseModel):
    """Main configuration for Infinity Matrix."""

    version: str = Field(default="0.1.0")
    ai: AIConfig = Field(default_factory=AIConfig)
    security: SecurityConfig = Field(default_factory=SecurityConfig)
    agents: AgentConfig = Field(default_factory=AgentConfig)
    templates: TemplateConfig = Field(default_factory=TemplateConfig)

    @classmethod
    def load(cls, config_path: Path | None = None) -> "Config":
        """Load configuration from file."""
        if config_path is None:
            config_path = Path("~/.infinity-matrix/config.yaml").expanduser()

        if config_path.exists():
            with open(config_path) as f:
                data = yaml.safe_load(f)
                if data:
                    return cls(**data)

        return cls()

    def save(self, config_path: Path | None = None) -> None:
        """Save configuration to file."""
        if config_path is None:
            config_path = Path("~/.infinity-matrix/config.yaml").expanduser()

        config_path.parent.mkdir(parents=True, exist_ok=True)

        with open(config_path, "w") as f:
            yaml.dump(self.model_dump(), f, default_flow_style=False)


def get_config() -> Config:
    """Get the global configuration instance."""
    return Config.load()
