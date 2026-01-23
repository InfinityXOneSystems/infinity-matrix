"""Core configuration management for Infinity Matrix."""

from pathlib import Path

import yaml
from pydantic import BaseModel, ConfigDict, Field
from pydantic_settings import BaseSettings


class AgentConfig(BaseModel):
    """Agent system configuration."""

    max_concurrent: int = Field(default=10, ge=1, le=1000)
    registry_backend: str = Field(default="memory")
    heartbeat_interval: int = Field(default=30, ge=1)
    timeout: int = Field(default=300, ge=1)


class VisionConfig(BaseModel):
    """Vision Cortex configuration."""

    enabled: bool = Field(default=True)
    models: list[str] = Field(default_factory=lambda: ["gpt-4-vision"])
    max_image_size: int = Field(default=20_000_000)  # 20MB
    ocr_enabled: bool = Field(default=True)


class BuilderConfig(BaseModel):
    """Auto-Builder configuration."""

    enabled: bool = Field(default=True)
    platforms: list[str] = Field(default_factory=lambda: ["python", "node", "go"])
    parallel_builds: int = Field(default=4, ge=1)
    cache_enabled: bool = Field(default=True)


class DocsConfig(BaseModel):
    """Evolution Doc System configuration."""

    enabled: bool = Field(default=True)
    auto_generate: bool = Field(default=True)
    formats: list[str] = Field(default_factory=lambda: ["markdown", "html", "pdf"])
    update_on_commit: bool = Field(default=True)


class IndexConfig(BaseModel):
    """Index System configuration."""

    enabled: bool = Field(default=True)
    backend: str = Field(default="elasticsearch")
    semantic_search: bool = Field(default=True)
    embedding_model: str = Field(default="text-embedding-ada-002")


class TaxonomyConfig(BaseModel):
    """Taxonomy System configuration."""

    enabled: bool = Field(default=True)
    auto_classify: bool = Field(default=True)
    categories: list[str] = Field(default_factory=list)


class PREngineConfig(BaseModel):
    """PR/Merge Engine configuration."""

    enabled: bool = Field(default=True)
    auto_review: bool = Field(default=True)
    auto_merge: bool = Field(default=False)
    required_approvals: int = Field(default=1, ge=0)
    conflict_resolution: str = Field(default="manual")


class ETLConfig(BaseModel):
    """ETL System configuration."""

    enabled: bool = Field(default=True)
    max_workers: int = Field(default=10, ge=1)
    rate_limit: int = Field(default=100)  # requests per minute
    retry_attempts: int = Field(default=3, ge=0)


class GitHubIntegration(BaseModel):
    """GitHub integration settings."""

    enabled: bool = Field(default=True)
    token: str | None = Field(default=None)
    api_url: str = Field(default="https://api.github.com")
    webhook_secret: str | None = Field(default=None)


class GCPIntegration(BaseModel):
    """Google Cloud Platform integration settings."""

    enabled: bool = Field(default=False)
    project_id: str | None = Field(default=None)
    credentials_file: str | None = Field(default=None)


class HostingerIntegration(BaseModel):
    """Hostinger integration settings."""

    enabled: bool = Field(default=False)
    api_key: str | None = Field(default=None)
    api_url: str = Field(default="https://api.hostinger.com")


class VSCodeIntegration(BaseModel):
    """VS Code integration settings."""

    enabled: bool = Field(default=True)
    extension_id: str = Field(default="infinityxone.infinity-matrix")
    lsp_enabled: bool = Field(default=True)


class IntegrationsConfig(BaseModel):
    """External integrations configuration."""

    github: GitHubIntegration = Field(default_factory=GitHubIntegration)
    gcp: GCPIntegration = Field(default_factory=GCPIntegration)
    hostinger: HostingerIntegration = Field(default_factory=HostingerIntegration)
    vscode: VSCodeIntegration = Field(default_factory=VSCodeIntegration)


class Config(BaseSettings):
    """Main configuration for Infinity Matrix system."""

    model_config = ConfigDict(
        env_prefix="INFINITY_MATRIX_",
        env_nested_delimiter="__",
        case_sensitive=False
    )

    # Core settings
    debug: bool = Field(default=False)
    log_level: str = Field(default="INFO")
    data_dir: Path = Field(default=Path.home() / ".infinity-matrix")

    # Component configurations
    agents: AgentConfig = Field(default_factory=AgentConfig)
    vision: VisionConfig = Field(default_factory=VisionConfig)
    builder: BuilderConfig = Field(default_factory=BuilderConfig)
    docs: DocsConfig = Field(default_factory=DocsConfig)
    index: IndexConfig = Field(default_factory=IndexConfig)
    taxonomy: TaxonomyConfig = Field(default_factory=TaxonomyConfig)
    pr_engine: PREngineConfig = Field(default_factory=PREngineConfig)
    etl: ETLConfig = Field(default_factory=ETLConfig)
    integrations: IntegrationsConfig = Field(default_factory=IntegrationsConfig)

    @classmethod
    def from_file(cls, path: Path) -> "Config":
        """Load configuration from YAML file."""
        with open(path) as f:
            data = yaml.safe_load(f) or {}

        # Handle nested infinity_matrix key
        if "infinity_matrix" in data:
            data = data["infinity_matrix"]

        return cls(**data)

    @classmethod
    def from_env(cls) -> "Config":
        """Load configuration from environment variables."""
        return cls()

    def save(self, path: Path) -> None:
        """Save configuration to YAML file."""
        path.parent.mkdir(parents=True, exist_ok=True)

        # Convert to dict and serialize Path objects
        data = self.model_dump(exclude_none=True, mode='json')
        wrapped_data = {"infinity_matrix": data}

        with open(path, "w") as f:
            yaml.safe_dump(wrapped_data, f, default_flow_style=False, indent=2)

    def ensure_directories(self) -> None:
        """Ensure all required directories exist."""
        directories = [
            self.data_dir,
            self.data_dir / "logs",
            self.data_dir / "cache",
            self.data_dir / "agents",
            self.data_dir / "artifacts",
        ]

        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)


def load_config(config_path: Path | None = None) -> Config:
    """Load configuration from file or environment."""
    if config_path and config_path.exists():
        return Config.from_file(config_path)

    # Try default locations
    default_paths = [
        Path.cwd() / "config.yaml",
        Path.cwd() / "infinity-matrix.yaml",
        Path.home() / ".infinity-matrix" / "config.yaml",
    ]

    for path in default_paths:
        if path.exists():
            return Config.from_file(path)

    # Fall back to environment
    return Config.from_env()
