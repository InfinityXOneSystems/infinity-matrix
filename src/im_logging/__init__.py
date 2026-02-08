"""Centralized logging infrastructure for the Infinity Matrix.

Provides:
- Structured logging
- Log aggregation
- Log formatting
- Log level management
"""

import json
import logging
import sys
from datetime import datetime
from typing import Any


class StructuredLogger:
    """Structured JSON logger for the Infinity Matrix."""

    def __init__(self, name: str, level: str = "INFO"):
        """Initialize structured logger.

        Args:
            name: Logger name
            level: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        """
        self.logger = logging.getLogger(name)
        self.logger.setLevel(getattr(logging, level))

        # Configure handler
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(self._get_formatter())
        self.logger.addHandler(handler)

    def _get_formatter(self) -> logging.Formatter:
        """Get JSON formatter for logs."""
        return logging.Formatter(
            '{"timestamp": "%(asctime)s", "level": "%(levelname)s", '
            '"logger": "%(name)s", "message": "%(message)s"}'
        )

    def _log_structured(
        self,
        level: str,
        message: str,
        **kwargs: Any,
    ) -> None:
        """Log a structured message.

        Args:
            level: Log level
            message: Log message
            **kwargs: Additional fields to include in the log
        """
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": level,
            "message": message,
            **kwargs,
        }

        log_method = getattr(self.logger, level.lower())
        log_method(json.dumps(log_data))

    def debug(self, message: str, **kwargs: Any) -> None:
        """Log a debug message."""
        self._log_structured("DEBUG", message, **kwargs)

    def info(self, message: str, **kwargs: Any) -> None:
        """Log an info message."""
        self._log_structured("INFO", message, **kwargs)

    def warning(self, message: str, **kwargs: Any) -> None:
        """Log a warning message."""
        self._log_structured("WARNING", message, **kwargs)

    def error(self, message: str, **kwargs: Any) -> None:
        """Log an error message."""
        self._log_structured("ERROR", message, **kwargs)

    def critical(self, message: str, **kwargs: Any) -> None:
        """Log a critical message."""
        self._log_structured("CRITICAL", message, **kwargs)


class AuditLogger:
    """Specialized logger for audit trails."""

    def __init__(self):
        """Initialize audit logger."""
        self.logger = StructuredLogger("audit", level="INFO")

    def log_event(
        self,
        event_type: str,
        actor: dict[str, Any],
        resource: dict[str, Any],
        action: str,
        result: str,
        metadata: dict[str, Any] | None = None,
    ) -> None:
        """Log an audit event.

        Args:
            event_type: Type of event (e.g., "authentication", "authorization")
            actor: Information about who performed the action
            resource: Information about what was acted upon
            action: What action was performed
            result: Result of the action (success, failure, etc.)
            metadata: Additional metadata
        """
        self.logger.info(
            f"Audit event: {event_type}",
            event_type=event_type,
            actor=actor,
            resource=resource,
            action=action,
            result=result,
            metadata=metadata or {},
        )


# Global logger instances
logger = StructuredLogger("infinity-matrix")
audit_logger = AuditLogger()
