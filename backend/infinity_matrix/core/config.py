"""
Application configuration using Pydantic settings.
"""
from functools import lru_cache
from typing import list

from pydantic import Field, PostgresDsn, RedisDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "Infinity-Matrix"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # API
    API_PREFIX: str = "/api"
    API_KEY: str = Field(default="change-me-in-production")

    # Database
    DATABASE_URL: PostgresDsn = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/infinity_matrix"
    )

    # Redis
    REDIS_URL: RedisDsn = Field(default="redis://localhost:6379/0")

    # Security
    SECRET_KEY: str = Field(default="change-me-in-production-use-strong-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:8000"]
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | list[str]) -> list[str]:
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds

    # Monitoring
    DRIFT_CHECK_INTERVAL: int = 86400  # 24 hours in seconds
    COST_CHECK_INTERVAL: int = 3600  # 1 hour in seconds

    # Compliance
    ENABLE_PII_REDACTION: bool = True
    COMPLIANCE_FRAMEWORKS: list[str] = ["HIPAA", "SOC2", "GDPR"]

    # Backup/DR
    BACKUP_RETENTION_DAYS: int = 30
    BACKUP_LOCATION: str = "/backups"

    # Internationalization
    DEFAULT_LANGUAGE: str = "en"
    SUPPORTED_LANGUAGES: list[str] = ["en", "es", "fr", "de", "ja", "zh-CN"]

    # Celery
    CELERY_BROKER_URL: str = Field(default="redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = Field(default="redis://localhost:6379/0")


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
