"""Base classes for the platform."""

from abc import ABC, abstractmethod
from typing import Any, Dict, Generic, Optional, TypeVar

from pydantic import BaseModel

from infinity_matrix.core.logging import LoggerMixin


T = TypeVar("T")
ResultT = TypeVar("ResultT")


class BaseResult(BaseModel):
    """Base result model for all operations."""

    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    metadata: Dict[str, Any] = {}


class BaseEngine(ABC, LoggerMixin):
    """Base class for all engines."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize engine with optional configuration."""
        self.config = config or {}
        self.log_info("engine_initialized", engine=self.__class__.__name__)

    @abstractmethod
    async def initialize(self) -> None:
        """Initialize the engine resources."""
        pass

    @abstractmethod
    async def shutdown(self) -> None:
        """Shutdown and cleanup engine resources."""
        pass


class BaseAnalyzer(BaseEngine, Generic[T, ResultT]):
    """Base class for all analyzers."""

    @abstractmethod
    async def analyze(self, data: T) -> ResultT:
        """Analyze the given data."""
        pass


class BaseCrawler(BaseEngine):
    """Base class for all crawlers."""

    @abstractmethod
    async def crawl(self, url: str, **kwargs: Any) -> Dict[str, Any]:
        """Crawl the given URL."""
        pass


class BasePredictor(BaseEngine, Generic[T, ResultT]):
    """Base class for all predictors."""

    @abstractmethod
    async def predict(self, data: T) -> ResultT:
        """Generate prediction for the given data."""
        pass

    @abstractmethod
    async def train(self, training_data: list[T]) -> None:
        """Train the predictor with historical data."""
        pass


class BaseLeadGenerator(BaseEngine):
    """Base class for lead generation engines."""

    @abstractmethod
    async def discover_leads(self, criteria: Dict[str, Any]) -> list[Dict[str, Any]]:
        """Discover leads based on criteria."""
        pass

    @abstractmethod
    async def score_lead(self, lead: Dict[str, Any]) -> float:
        """Score a lead (0.0 to 1.0)."""
        pass


class BaseCampaignEngine(BaseEngine):
    """Base class for campaign automation engines."""

    @abstractmethod
    async def create_campaign(
        self, name: str, leads: list[Dict[str, Any]], template: str
    ) -> str:
        """Create a new campaign."""
        pass

    @abstractmethod
    async def launch_campaign(self, campaign_id: str) -> None:
        """Launch a campaign."""
        pass

    @abstractmethod
    async def get_campaign_status(self, campaign_id: str) -> Dict[str, Any]:
        """Get campaign status."""
        pass
