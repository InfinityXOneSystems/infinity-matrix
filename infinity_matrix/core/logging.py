"""Structured logging configuration using structlog."""

import logging
import sys
from typing import Any

import structlog
from structlog.types import Processor

from infinity_matrix.core.config import settings


def setup_logging() -> structlog.BoundLogger:
    """Configure structured logging for the application."""

    # Determine processors based on log format
    if settings.log_format == "json":
        processors: list[Processor] = [
            structlog.contextvars.merge_contextvars,
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer(),
        ]
    else:
        processors = [
            structlog.contextvars.merge_contextvars,
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.dev.ConsoleRenderer(),
        ]

    # Configure structlog
    structlog.configure(
        processors=processors,
        wrapper_class=structlog.stdlib.BoundLogger,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    # Configure standard library logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, settings.log_level),
    )

    # Configure Sentry if DSN is provided
    if settings.sentry_dsn:
        try:
            import sentry_sdk

            sentry_sdk.init(
                dsn=settings.sentry_dsn,
                environment=settings.environment,
                traces_sample_rate=0.1 if settings.environment == "production" else 1.0,
            )
        except ImportError:
            pass

    return structlog.get_logger()


def get_logger(name: str) -> structlog.BoundLogger:
    """Get a logger instance with the given name."""
    return structlog.get_logger(name)


class LoggerMixin:
    """Mixin to add logging capabilities to any class."""

    @property
    def logger(self) -> structlog.BoundLogger:
        """Get logger for this class."""
        return get_logger(self.__class__.__name__)

    def log_info(self, event: str, **kwargs: Any) -> None:
        """Log info message."""
        self.logger.info(event, **kwargs)

    def log_error(self, event: str, **kwargs: Any) -> None:
        """Log error message."""
        self.logger.error(event, **kwargs)

    def log_warning(self, event: str, **kwargs: Any) -> None:
        """Log warning message."""
        self.logger.warning(event, **kwargs)

    def log_debug(self, event: str, **kwargs: Any) -> None:
        """Log debug message."""
        self.logger.debug(event, **kwargs)
