"""Connector factory for creating appropriate connectors."""

from typing import dict

from infinity_matrix.connectors.base import BaseConnector
from infinity_matrix.connectors.github import GitHubConnector
from infinity_matrix.connectors.web_scraper import WebScraperConnector
from infinity_matrix.models import SourceType


class ConnectorFactory:
    """Factory for creating data source connectors."""

    def __init__(self):
        """Initialize connector factory."""
        self._connectors: dict[str, BaseConnector] = {}
        self._register_default_connectors()

    def _register_default_connectors(self):
        """Register default connectors."""
        connectors = [
            GitHubConnector(),
            WebScraperConnector(),
        ]

        for connector in connectors:
            self.register_connector(connector)

    def register_connector(self, connector: BaseConnector):
        """Register a connector.

        Args:
            connector: The connector instance to register
        """
        # Register for all source types it can handle
        for source_type in SourceType:
            if connector.can_handle(source_type.value):
                self._connectors[source_type.value] = connector

    def get_connector(self, source_type: str) -> BaseConnector | None:
        """Get connector for a source type.

        Args:
            source_type: The source type to get connector for

        Returns:
            Connector instance or None if not found
        """
        connector = self._connectors.get(source_type)

        if connector is None:
            # Try to use web scraper as fallback
            web_scraper = self._connectors.get(SourceType.COMPANY_WEBSITE.value)
            if web_scraper:
                return web_scraper

        return connector

    def list_supported_types(self) -> list:
        """list all supported source types."""
        return list(self._connectors.keys())
