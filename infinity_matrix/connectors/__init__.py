"""Connectors package initialization."""

from infinity_matrix.connectors.base import BaseConnector
from infinity_matrix.connectors.factory import ConnectorFactory
from infinity_matrix.connectors.github import GitHubConnector
from infinity_matrix.connectors.web_scraper import WebScraperConnector

__all__ = [
    "BaseConnector",
    "ConnectorFactory",
    "GitHubConnector",
    "WebScraperConnector",
]
