"""Monitoring infrastructure for the Infinity Matrix.

Provides:
- Metrics collection
- Health checks
- Performance monitoring
- SLO tracking
"""

import time
from typing import Any


class MetricsCollector:
    """Collect and expose metrics for monitoring."""

    def __init__(self):
        """Initialize metrics collector."""
        self.metrics: dict[str, Any] = {}
        self.start_time = time.time()

    def record_metric(
        self,
        metric_name: str,
        value: float,
        labels: dict[str, str] | None = None,
    ) -> None:
        """Record a metric value.

        Args:
            metric_name: Name of the metric
            value: Metric value
            labels: Optional labels for the metric
        """
        if metric_name not in self.metrics:
            self.metrics[metric_name] = []

        self.metrics[metric_name].append({
            "value": value,
            "timestamp": time.time(),
            "labels": labels or {},
        })

    def get_metric(self, metric_name: str) -> list[dict[str, Any]]:
        """Get all values for a metric.

        Args:
            metric_name: Name of the metric

        Returns:
            list of metric values with timestamps
        """
        return self.metrics.get(metric_name, [])

    def get_all_metrics(self) -> dict[str, Any]:
        """Get all collected metrics.

        Returns:
            Dictionary of all metrics
        """
        return {
            "uptime_seconds": time.time() - self.start_time,
            "metrics": self.metrics,
        }


class HealthChecker:
    """Perform health checks on system components."""

    def __init__(self):
        """Initialize health checker."""
        self.checks: dict[str, dict[str, Any]] = {}

    def register_check(
        self,
        name: str,
        check_fn: callable,
        interval_seconds: int = 60,
    ) -> None:
        """Register a health check.

        Args:
            name: Name of the health check
            check_fn: Function that performs the check
            interval_seconds: How often to run the check
        """
        self.checks[name] = {
            "function": check_fn,
            "interval": interval_seconds,
            "last_run": 0,
            "status": "unknown",
        }

    async def run_checks(self) -> dict[str, Any]:
        """Run all registered health checks.

        Returns:
            Dictionary with health check results
        """
        results = {}
        current_time = time.time()

        for name, check in self.checks.items():
            # Check if it's time to run this check
            if current_time - check["last_run"] >= check["interval"]:
                try:
                    status = await check["function"]()
                    check["status"] = "healthy" if status else "unhealthy"
                    check["last_run"] = current_time
                except Exception as e:
                    check["status"] = "error"
                    check["error"] = str(e)

            results[name] = {
                "status": check["status"],
                "last_checked": check["last_run"],
            }

        return results


class PerformanceMonitor:
    """Monitor system performance metrics."""

    def __init__(self):
        """Initialize performance monitor."""
        self.request_times: list[float] = []
        self.error_count = 0
        self.success_count = 0

    def record_request(self, duration_seconds: float, success: bool) -> None:
        """Record a request and its duration.

        Args:
            duration_seconds: Request duration in seconds
            success: Whether the request was successful
        """
        self.request_times.append(duration_seconds)
        if success:
            self.success_count += 1
        else:
            self.error_count += 1

        # Keep only last 1000 requests
        if len(self.request_times) > 1000:
            self.request_times = self.request_times[-1000:]

    def get_stats(self) -> dict[str, Any]:
        """Get performance statistics.

        Returns:
            Dictionary with performance stats
        """
        if not self.request_times:
            return {
                "total_requests": 0,
                "avg_response_time": 0,
                "error_rate": 0,
            }

        sorted_times = sorted(self.request_times)
        total = self.success_count + self.error_count

        return {
            "total_requests": total,
            "success_count": self.success_count,
            "error_count": self.error_count,
            "error_rate": self.error_count / total if total > 0 else 0,
            "avg_response_time": sum(self.request_times) / len(self.request_times),
            "p50": sorted_times[len(sorted_times) // 2],
            "p95": sorted_times[int(len(sorted_times) * 0.95)],
            "p99": sorted_times[int(len(sorted_times) * 0.99)],
        }


# Global instances
metrics_collector = MetricsCollector()
health_checker = HealthChecker()
performance_monitor = PerformanceMonitor()
