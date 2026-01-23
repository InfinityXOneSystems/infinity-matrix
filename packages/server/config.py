"""
Application configuration using pydantic-settings
"""
from typing import list

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Server Configuration
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 3000
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: list[str] = ["*"]

    # Database Configuration
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "infinity_matrix"
    POSTGRES_USER: str = "infinity_matrix"
    POSTGRES_PASSWORD: str = "changeme"

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis Configuration
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str | None = None
    REDIS_DB: int = 0

    @property
    def REDIS_URL(self) -> str:
        auth = f":{self.REDIS_PASSWORD}@" if self.REDIS_PASSWORD else ""
        return f"redis://{auth}{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # OpenAI Configuration
    OPENAI_API_KEY: str | None = None
    OPENAI_ORG_ID: str | None = None
    OPENAI_MODEL: str = "gpt-4-turbo-preview"

    # Google Cloud Configuration
    GOOGLE_CLOUD_PROJECT: str | None = None
    GOOGLE_APPLICATION_CREDENTIALS: str | None = None
    VERTEX_AI_LOCATION: str = "us-central1"
    VERTEX_AI_MODEL: str = "gemini-pro"

    # GitHub Configuration
    GITHUB_TOKEN: str | None = None
    GITHUB_APP_ID: int | None = None
    GITHUB_APP_PRIVATE_KEY_PATH: str | None = None
    GITHUB_WEBHOOK_SECRET: str | None = None

    # Authentication
    JWT_SECRET: str = "change-this-in-production"
    JWT_EXPIRY: str = "24h"
    OAUTH_CLIENT_ID: str | None = None
    OAUTH_CLIENT_SECRET: str | None = None

    # Feature Flags
    ENABLE_VERTEX_AI: bool = True
    ENABLE_OPENAI: bool = True
    ENABLE_GITHUB_COPILOT: bool = True
    ENABLE_AUTO_MERGE: bool = False
    ENABLE_AUTO_APPROVE: bool = False

    # Rate Limiting
    RATE_LIMIT_WINDOW_MS: int = 60000
    RATE_LIMIT_MAX_REQUESTS: int = 100

    # Monitoring
    SENTRY_DSN: str | None = None
    DATADOG_API_KEY: str | None = None


settings = Settings()
