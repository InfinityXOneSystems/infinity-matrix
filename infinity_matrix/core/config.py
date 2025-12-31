"""Core configuration management using Pydantic settings."""

from functools import lru_cache
from typing import Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Environment
    environment: str = Field(default="development", description="Environment name")
    debug: bool = Field(default=False, description="Debug mode")

    # API Configuration
    api_host: str = Field(default="0.0.0.0", description="API host")
    api_port: int = Field(default=8000, description="API port")
    api_workers: int = Field(default=4, description="Number of API workers")
    api_reload: bool = Field(default=False, description="Auto-reload on changes")

    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://localhost:5432/infinity_matrix",
        description="Database connection URL",
    )
    database_pool_size: int = Field(default=20, description="Database pool size")
    database_max_overflow: int = Field(default=10, description="Max overflow connections")

    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0", description="Redis URL")
    redis_max_connections: int = Field(default=50, description="Max Redis connections")

    # MongoDB
    mongodb_url: str = Field(default="mongodb://localhost:27017", description="MongoDB URL")
    mongodb_database: str = Field(default="infinity_matrix", description="MongoDB database")

    # OpenAI
    openai_api_key: Optional[str] = Field(default=None, description="OpenAI API key")
    openai_model: str = Field(default="gpt-4-turbo-preview", description="OpenAI model")
    openai_max_tokens: int = Field(default=4096, description="Max tokens for OpenAI")

    # Anthropic
    anthropic_api_key: Optional[str] = Field(default=None, description="Anthropic API key")
    anthropic_model: str = Field(
        default="claude-3-opus-20240229", description="Anthropic model"
    )

    # Google Cloud
    google_cloud_project: Optional[str] = Field(default=None, description="GCP project ID")
    google_application_credentials: Optional[str] = Field(
        default=None, description="Path to GCP credentials"
    )
    vertex_ai_location: str = Field(default="us-central1", description="Vertex AI location")

    # Twilio
    twilio_account_sid: Optional[str] = Field(default=None, description="Twilio account SID")
    twilio_auth_token: Optional[str] = Field(default=None, description="Twilio auth token")
    twilio_phone_number: Optional[str] = Field(default=None, description="Twilio phone number")

    # SendGrid
    sendgrid_api_key: Optional[str] = Field(default=None, description="SendGrid API key")
    sendgrid_from_email: str = Field(
        default="noreply@infinityxonesystems.com", description="From email"
    )
    sendgrid_from_name: str = Field(default="Infinity Matrix", description="From name")

    # Scraping
    scraper_user_agent: str = Field(
        default="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        description="User agent for scraping",
    )
    scraper_rate_limit: int = Field(default=10, description="Requests per second limit")
    scraper_concurrent_requests: int = Field(
        default=5, description="Concurrent scraping requests"
    )
    scraper_timeout: int = Field(default=30, description="Scraper timeout in seconds")
    scraper_retry_attempts: int = Field(default=3, description="Retry attempts")

    # Proxy
    proxy_enabled: bool = Field(default=False, description="Enable proxy")
    proxy_http: Optional[str] = Field(default=None, description="HTTP proxy URL")
    proxy_https: Optional[str] = Field(default=None, description="HTTPS proxy URL")

    # Financial APIs
    alpha_vantage_api_key: Optional[str] = Field(
        default=None, description="Alpha Vantage API key"
    )
    fred_api_key: Optional[str] = Field(default=None, description="FRED API key")
    coinmarketcap_api_key: Optional[str] = Field(
        default=None, description="CoinMarketCap API key"
    )

    # Security
    secret_key: str = Field(
        default="change-me-in-production", description="Secret key for encryption"
    )
    jwt_algorithm: str = Field(default="HS256", description="JWT algorithm")
    jwt_expiration_hours: int = Field(default=24, description="JWT expiration in hours")

    # Logging
    log_level: str = Field(default="INFO", description="Logging level")
    log_format: str = Field(default="json", description="Log format (json or text)")
    sentry_dsn: Optional[str] = Field(default=None, description="Sentry DSN")

    # Worker Configuration
    celery_broker_url: str = Field(
        default="redis://localhost:6379/1", description="Celery broker URL"
    )
    celery_result_backend: str = Field(
        default="redis://localhost:6379/2", description="Celery result backend"
    )
    worker_concurrency: int = Field(default=4, description="Worker concurrency")
    worker_max_tasks_per_child: int = Field(
        default=100, description="Max tasks per worker child"
    )

    # Feature Flags
    enable_crawlers: bool = Field(default=True, description="Enable crawlers")
    enable_predictions: bool = Field(default=True, description="Enable predictions")
    enable_campaigns: bool = Field(default=True, description="Enable campaigns")
    enable_voice: bool = Field(default=False, description="Enable voice features")
    enable_email: bool = Field(default=True, description="Enable email features")

    # Rate Limits
    rate_limit_requests_per_minute: int = Field(
        default=60, description="Rate limit requests per minute"
    )
    rate_limit_burst: int = Field(default=10, description="Rate limit burst")

    # Cache
    cache_ttl_seconds: int = Field(default=3600, description="Cache TTL in seconds")
    cache_max_size_mb: int = Field(default=1000, description="Max cache size in MB")

    # Cross-Repo Integration
    real_estate_api_url: Optional[str] = Field(
        default=None, description="Real Estate API URL"
    )
    real_estate_api_key: Optional[str] = Field(
        default=None, description="Real Estate API key"
    )
    financial_oracle_url: Optional[str] = Field(
        default=None, description="Financial Oracle URL"
    )
    sentiment_pulse_url: Optional[str] = Field(default=None, description="Sentiment Pulse URL")
    lead_nexus_url: Optional[str] = Field(default=None, description="Lead Nexus URL")

    # Monitoring
    prometheus_port: int = Field(default=9090, description="Prometheus port")
    metrics_enabled: bool = Field(default=True, description="Enable metrics")
    health_check_interval: int = Field(default=60, description="Health check interval")

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


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
