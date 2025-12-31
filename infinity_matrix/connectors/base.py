"""Base connector interface for data sources."""

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
import logging

from infinity_matrix.models import DataSource, RawData

logger = logging.getLogger(__name__)


class BaseConnector(ABC):
    """Base class for all data source connectors."""
    
    def __init__(self):
        """Initialize connector."""
        self.logger = logging.getLogger(self.__class__.__name__)
    
    @abstractmethod
    async def fetch(self, url: str, source: DataSource) -> List[RawData]:
        """Fetch data from the source.
        
        Args:
            url: The URL to fetch from
            source: The data source configuration
            
        Returns:
            List of RawData objects
        """
        pass
    
    @abstractmethod
    def can_handle(self, source_type: str) -> bool:
        """Check if this connector can handle the given source type.
        
        Args:
            source_type: The source type to check
            
        Returns:
            True if this connector can handle the source type
        """
        pass
    
    def validate_credentials(self, source: DataSource) -> bool:
        """Validate credentials for the source.
        
        Args:
            source: The data source configuration
            
        Returns:
            True if credentials are valid
        """
        return True
    
    def get_rate_limit(self, source: DataSource) -> Optional[int]:
        """Get rate limit for the source.
        
        Args:
            source: The data source configuration
            
        Returns:
            Rate limit in requests per minute, or None
        """
        return source.rate_limit
    
    async def _extract_metadata(self, response: Any) -> Dict[str, Any]:
        """Extract metadata from response.
        
        Args:
            response: The HTTP response or API response
            
        Returns:
            Dictionary of metadata
        """
        return {}
