"""Data models for the ingestion system."""

from datetime import datetime
from enum import Enum
from typing import Any, Optional, dict, list

from pydantic import BaseModel, Field, HttpUrl


class IndustryType(str, Enum):
    """Supported industry types."""
    TECHNOLOGY = "technology"
    FINANCE = "finance"
    HEALTHCARE = "healthcare"
    RETAIL = "retail"
    REAL_ESTATE = "real_estate"
    ENERGY = "energy"
    MANUFACTURING = "manufacturing"
    MEDIA = "media"
    TRANSPORTATION = "transportation"
    PROFESSIONAL_SERVICES = "professional_services"


class SourceType(str, Enum):
    """Data source types."""
    GITHUB = "github"
    GITLAB = "gitlab"
    HUGGINGFACE = "huggingface"
    KAGGLE = "kaggle"
    PAPERS_WITH_CODE = "papers_with_code"
    REAL_ESTATE_PORTAL = "real_estate_portal"
    GOVERNMENT = "government"
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    REDDIT = "reddit"
    YOUTUBE = "youtube"
    NEWS = "news"
    COMPANY_WEBSITE = "company_website"
    API = "api"
    RSS = "rss"


class CrawlStatus(str, Enum):
    """Crawl task status."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    PAUSED = "paused"


class Industry(BaseModel):
    """Industry configuration."""
    id: str
    name: str
    type: IndustryType
    description: str
    keywords: list[str] = Field(default_factory=list)
    priority: int = Field(default=5, ge=1, le=10)
    enabled: bool = True
    metadata: dict[str, Any] = Field(default_factory=dict)


class DataSource(BaseModel):
    """Data source configuration."""
    id: str
    name: str
    type: SourceType
    base_url: HttpUrl
    industry_id: str
    enabled: bool = True
    rate_limit: int | None = None  # requests per minute
    authentication_required: bool = False
    credentials_key: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class SeedUrl(BaseModel):
    """Seed URL for crawling."""
    url: HttpUrl
    source_id: str
    industry_id: str
    priority: int = Field(default=5, ge=1, le=10)
    depth: int = Field(default=2, ge=0, le=10)
    metadata: dict[str, Any] = Field(default_factory=dict)


class CrawlTask(BaseModel):
    """Crawl task tracking."""
    id: str
    url: HttpUrl
    source_id: str
    industry_id: str
    status: CrawlStatus = CrawlStatus.PENDING
    attempts: int = 0
    max_attempts: int = 3
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: datetime | None = None
    completed_at: datetime | None = None
    last_error: str | None = None
    result_count: int = 0
    metadata: dict[str, Any] = Field(default_factory=dict)


class RawData(BaseModel):
    """Raw ingested data."""
    id: str
    task_id: str
    source_id: str
    industry_id: str
    url: HttpUrl
    content_type: str
    raw_content: str
    headers: dict[str, str] = Field(default_factory=dict)
    collected_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict[str, Any] = Field(default_factory=dict)


class NormalizedData(BaseModel):
    """Normalized data after processing."""
    id: str
    raw_data_id: str
    source_id: str
    industry_id: str
    title: str | None = None
    description: str | None = None
    content: str
    entities: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)
    structured_data: dict[str, Any] = Field(default_factory=dict)
    quality_score: float = Field(default=0.0, ge=0.0, le=1.0)
    normalized_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict[str, Any] = Field(default_factory=dict)


class AnalysisResult(BaseModel):
    """LLM analysis result."""
    id: str
    normalized_data_id: str
    provider: str
    model: str
    prompt_template: str
    analysis: str
    insights: list[str] = Field(default_factory=list)
    sentiment: str | None = None
    categories: list[str] = Field(default_factory=list)
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0)
    tokens_used: int = 0
    analyzed_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict[str, Any] = Field(default_factory=dict)


class IngestionStats(BaseModel):
    """Ingestion statistics."""
    industry_id: str
    total_tasks: int = 0
    pending_tasks: int = 0
    in_progress_tasks: int = 0
    completed_tasks: int = 0
    failed_tasks: int = 0
    total_data_collected: int = 0
    total_data_normalized: int = 0
    total_data_analyzed: int = 0
    last_update: datetime = Field(default_factory=datetime.utcnow)
