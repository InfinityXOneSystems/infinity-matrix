"""Performance metrics and monitoring for Infinity Matrix."""

import time
from functools import wraps
from collections.abc import Callable, Any, , dict, Optional

from prometheus_client import Counter, Gauge, Histogram, start_http_server

from infinity_matrix.core.config import get_settings
from infinity_matrix.core.logging import get_logger

logger = get_logger(__name__)

# Define metrics
REQUEST_COUNT = Counter(
    "infinity_matrix_requests_total",
    "Total request count",
    ["method", "endpoint", "status"],
)

REQUEST_DURATION = Histogram(
    "infinity_matrix_request_duration_seconds",
    "Request duration in seconds",
    ["method", "endpoint"],
)

AGENT_EXECUTION_COUNT = Counter(
    "infinity_matrix_agent_executions_total",
    "Total agent execution count",
    ["agent_type", "status"],
)

AGENT_EXECUTION_DURATION = Histogram(
    "infinity_matrix_agent_execution_duration_seconds",
    "Agent execution duration in seconds",
    ["agent_type"],
)

VISION_PROCESSING_COUNT = Counter(
    "infinity_matrix_vision_processing_total",
    "Total vision processing count",
    ["task_type", "status"],
)

BUILD_COUNT = Counter("infinity_matrix_builds_total", "Total build count", ["status"])

ACTIVE_AGENTS = Gauge("infinity_matrix_active_agents", "Number of active agents", ["agent_type"])


class MetricsCollector:
    """Centralized metrics collector."""

    def __init__(self) -> None:
        """Initialize metrics collector."""
        self.settings = get_settings()
        self._server_started = False

    def start_metrics_server(self) -> None:
        """Start Prometheus metrics server."""
        if not self.settings.enable_metrics or self._server_started:
            return

        try:
            start_http_server(self.settings.prometheus_port)
            self._server_started = True
            logger.info("metrics_server_started", port=self.settings.prometheus_port)
        except Exception as e:
            logger.error("metrics_server_start_failed", error=str(e))

    def record_request(self, method: str, endpoint: str, status: int, duration: float) -> None:
        """Record API request metrics."""
        REQUEST_COUNT.labels(method=method, endpoint=endpoint, status=status).inc()
        REQUEST_DURATION.labels(method=method, endpoint=endpoint).observe(duration)

    def record_agent_execution(self, agent_type: str, status: str, duration: float) -> None:
        """Record agent execution metrics."""
        AGENT_EXECUTION_COUNT.labels(agent_type=agent_type, status=status).inc()
        AGENT_EXECUTION_DURATION.labels(agent_type=agent_type).observe(duration)

    def record_vision_processing(self, task_type: str, status: str) -> None:
        """Record vision processing metrics."""
        VISION_PROCESSING_COUNT.labels(task_type=task_type, status=status).inc()

    def record_build(self, status: str) -> None:
        """Record build metrics."""
        BUILD_COUNT.labels(status=status).inc()

    def set_active_agents(self, agent_type: str, count: int) -> None:
        """Set active agent count."""
        ACTIVE_AGENTS.labels(agent_type=agent_type).set(count)


def track_execution_time(
    metric_name: str = "execution", labels: Optional[dict[str, str]] = None
) -> Callable:
    """Decorator to track execution time."""

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time
                logger.debug(
                    f"{metric_name}_completed",
                    duration=duration,
                    labels=labels or {},
                )
                return result
            except Exception as e:
                duration = time.time() - start_time
                logger.error(
                    f"{metric_name}_failed",
                    duration=duration,
                    error=str(e),
                    labels=labels or {},
                )
                raise

        @wraps(func)
        def sync_wrapper(*args: Any, **kwargs: Any) -> Any:
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                logger.debug(
                    f"{metric_name}_completed",
                    duration=duration,
                    labels=labels or {},
                )
                return result
            except Exception as e:
                duration = time.time() - start_time
                logger.error(
                    f"{metric_name}_failed",
                    duration=duration,
                    error=str(e),
                    labels=labels or {},
                )
                raise

        # Return appropriate wrapper based on function type
        import inspect

        if inspect.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper

    return decorator


# Global metrics collector instance
_metrics_collector: Optional[MetricsCollector] = None


def get_metrics_collector() -> MetricsCollector:
    """Get global metrics collector instance."""
    global _metrics_collector
    if _metrics_collector is None:
        _metrics_collector = MetricsCollector()
    return _metrics_collector
