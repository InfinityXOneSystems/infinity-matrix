"""Core configuration management for Infinity Matrix."""

from functools import lru_cache
from typing import list

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # System Configuration
    environment: str = Field(default="development", description="Environment name")
    debug: bool = Field(default=False, description="Debug mode")
    log_level: str = Field(default="INFO", description="Logging level")

    # API Configuration
    api_host: str = Field(default="0.0.0.0", description="API host")
    api_port: int = Field(default=8000, description="API port")
    api_workers: int = Field(default=4, description="Number of API workers")
    api_prefix: str = Field(default="/api/v1", description="API prefix")

    # Database Configuration
    database_url: str = Field(default="sqlite:///./infinity_matrix.db", description="Database URL")
    redis_url: str = Field(default="redis://localhost:6379/0", description="Redis URL")

    # Vision Cortex Configuration
    vision_model: str = Field(
        default="openai/clip-vit-base-patch32", description="Vision model name"
    )
    vision_batch_size: int = Field(default=32, description="Vision batch size")
    vision_max_image_size: int = Field(default=1024, description="Max image dimension")

    # Agent Configuration
    agent_pool_size: int = Field(default=10, description="Agent pool size")
    agent_timeout: int = Field(default=300, description="Agent timeout in seconds")
    agent_max_retries: int = Field(default=3, description="Max agent retries")

    # Security Configuration
    secret_key: str = Field(default="change-me-in-production", description="Secret key")
    api_key_header: str = Field(default="X-API-Key", description="API key header")
    allowed_origins: list[str] = Field(default=["*"], description="CORS allowed origins")
    rate_limit_per_minute: int = Field(default=60, description="Rate limit per minute")

    # Monitoring Configuration
    prometheus_port: int = Field(default=9090, description="Prometheus port")
    enable_tracing: bool = Field(default=True, description="Enable tracing")
    enable_metrics: bool = Field(default=True, description="Enable metrics")

    # Auto-Builder Configuration
    builder_workspace: str = Field(default="./workspace", description="Builder workspace")
    builder_max_concurrent: int = Field(default=5, description="Max concurrent builds")

    # Proof Logs Configuration
    logs_retention_days: int = Field(default=90, description="Log retention days")
    logs_storage_path: str = Field(default="./logs", description="Log storage path")

    @field_validator("log_level")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        """Validate log level."""
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in valid_levels:
            raise ValueError(f"Invalid log level. Must be one of {valid_levels}")
        return v.upper()

    @field_validator("environment")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        """Validate environment."""
        valid_envs = ["development", "staging", "production"]
        if v.lower() not in valid_envs:
            raise ValueError(f"Invalid environment. Must be one of {valid_envs}")
        return v.lower()

    @property
    def is_production(self) -> bool:
        """Check if running in production."""
        return self.environment == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development."""
        return self.environment == "development"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
