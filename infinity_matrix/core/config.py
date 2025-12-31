"""Configuration management for the ingestion system."""

import os
from pathlib import Path
from typing import Any, Dict, Optional
import yaml
from pydantic import BaseModel, Field
from dotenv import load_dotenv


class DatabaseConfig(BaseModel):
    """Database configuration."""
    type: str = "postgresql"
    host: str = "localhost"
    port: int = 5432
    database: str = "infinity_matrix"
    username: str = "postgres"
    password: str = ""
    pool_size: int = 10


class RedisConfig(BaseModel):
    """Redis configuration."""
    host: str = "localhost"
    port: int = 6379
    db: int = 0
    password: Optional[str] = None


class CeleryConfig(BaseModel):
    """Celery configuration."""
    broker_url: str = "redis://localhost:6379/0"
    result_backend: str = "redis://localhost:6379/0"
    task_serializer: str = "json"
    result_serializer: str = "json"
    accept_content: list[str] = Field(default_factory=lambda: ["json"])
    timezone: str = "UTC"
    enable_utc: bool = True


class CrawlerConfig(BaseModel):
    """Crawler configuration."""
    user_agent: str = "InfinityMatrix/1.0 (+https://github.com/InfinityXOneSystems/infinity-matrix)"
    max_concurrent_requests: int = 10
    download_delay: float = 1.0
    respect_robots_txt: bool = True
    max_retries: int = 3
    retry_delay: int = 5
    timeout: int = 30


class LLMConfig(BaseModel):
    """LLM provider configuration."""
    default_provider: str = "openai"
    providers: Dict[str, Dict[str, Any]] = Field(default_factory=dict)


class StorageConfig(BaseModel):
    """Storage configuration."""
    base_path: str = "data"
    raw_data_path: str = "data/raw"
    normalized_data_path: str = "data/normalized"
    analyzed_data_path: str = "data/analyzed"


class Config(BaseModel):
    """Main configuration."""
    database: DatabaseConfig = Field(default_factory=DatabaseConfig)
    redis: RedisConfig = Field(default_factory=RedisConfig)
    celery: CeleryConfig = Field(default_factory=CeleryConfig)
    crawler: CrawlerConfig = Field(default_factory=CrawlerConfig)
    llm: LLMConfig = Field(default_factory=LLMConfig)
    storage: StorageConfig = Field(default_factory=StorageConfig)
    
    @classmethod
    def load(cls, config_path: Optional[str] = None) -> "Config":
        """Load configuration from file and environment variables."""
        # Load environment variables
        load_dotenv()
        
        # Default config path
        if config_path is None:
            config_path = os.getenv("INFINITY_MATRIX_CONFIG", "config/config.yaml")
        
        # Load from file if exists
        config_data = {}
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                config_data = yaml.safe_load(f) or {}
        
        # Override with environment variables
        if os.getenv("DB_HOST"):
            config_data.setdefault("database", {})["host"] = os.getenv("DB_HOST")
        if os.getenv("DB_PORT"):
            config_data.setdefault("database", {})["port"] = int(os.getenv("DB_PORT"))
        if os.getenv("DB_NAME"):
            config_data.setdefault("database", {})["database"] = os.getenv("DB_NAME")
        if os.getenv("DB_USER"):
            config_data.setdefault("database", {})["username"] = os.getenv("DB_USER")
        if os.getenv("DB_PASSWORD"):
            config_data.setdefault("database", {})["password"] = os.getenv("DB_PASSWORD")
        
        if os.getenv("REDIS_HOST"):
            config_data.setdefault("redis", {})["host"] = os.getenv("REDIS_HOST")
        if os.getenv("REDIS_PORT"):
            config_data.setdefault("redis", {})["port"] = int(os.getenv("REDIS_PORT"))
        if os.getenv("REDIS_PASSWORD"):
            config_data.setdefault("redis", {})["password"] = os.getenv("REDIS_PASSWORD")
        
        # LLM API keys
        llm_providers = {}
        if os.getenv("OPENAI_API_KEY"):
            llm_providers["openai"] = {"api_key": os.getenv("OPENAI_API_KEY")}
        if os.getenv("ANTHROPIC_API_KEY"):
            llm_providers["anthropic"] = {"api_key": os.getenv("ANTHROPIC_API_KEY")}
        if os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            llm_providers["vertex_ai"] = {
                "credentials_path": os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            }
        if os.getenv("OLLAMA_BASE_URL"):
            llm_providers["ollama"] = {"base_url": os.getenv("OLLAMA_BASE_URL")}
        
        if llm_providers:
            config_data.setdefault("llm", {})["providers"] = llm_providers
        
        return cls(**config_data)
    
    def save(self, config_path: str):
        """Save configuration to file."""
        config_dict = self.model_dump()
        Path(config_path).parent.mkdir(parents=True, exist_ok=True)
        with open(config_path, 'w') as f:
            yaml.safe_dump(config_dict, f, default_flow_style=False)


# Global config instance
_config: Optional[Config] = None


def get_config() -> Config:
    """Get global configuration instance."""
    global _config
    if _config is None:
        _config = Config.load()
    return _config


def set_config(config: Config):
    """Set global configuration instance."""
    global _config
    _config = config
