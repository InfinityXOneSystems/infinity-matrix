"""Configuration management for Infinity Matrix."""

from pathlib import Path
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        env_prefix="INFINITY_",
    )

    # Application
    app_name: str = "Infinity Matrix Auto-Builder"
    app_version: str = "0.1.0"
    debug: bool = False
    log_level: str = "INFO"

    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_prefix: str = "/api/v1"
    cors_origins: list[str] = Field(default_factory=lambda: ["*"])

    # Security
    secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # Repository Configuration
    repo_base_path: Path = Field(default_factory=lambda: Path("./builds"))
    templates_path: Path = Field(default_factory=lambda: Path("./templates"))
    blueprints_path: Path = Field(default_factory=lambda: Path("./blueprints"))

    # GitHub Integration
    github_token: Optional[str] = None
    github_org: Optional[str] = None
    github_base_url: str = "https://api.github.com"

    # Agent Configuration
    max_concurrent_agents: int = 10
    agent_timeout: int = 300  # seconds

    # Build Configuration
    max_concurrent_builds: int = 5
    build_timeout: int = 3600  # seconds
    cleanup_old_builds: bool = True
    keep_builds_days: int = 7

    # CI/CD Configuration
    enable_auto_merge: bool = False
    enable_auto_deploy: bool = False
    validation_required: bool = True

    # Database (for future use)
    database_url: Optional[str] = None

    def __init__(self, **kwargs):  # type: ignore
        super().__init__(**kwargs)
        # Create required directories
        self.repo_base_path.mkdir(parents=True, exist_ok=True)
        self.templates_path.mkdir(parents=True, exist_ok=True)
        self.blueprints_path.mkdir(parents=True, exist_ok=True)


# Global settings instance
settings = Settings()
