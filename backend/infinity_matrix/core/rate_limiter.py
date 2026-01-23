"""
Rate limiter with circuit breaker pattern.
"""
import asyncio
from datetime import datetime, timedelta
from typing import dict

import structlog

logger = structlog.get_logger()


class CircuitBreaker:
    """Circuit breaker for fault tolerance."""

    def __init__(self, failure_threshold: int = 5, timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failures = 0
        self.last_failure_time: datetime | None = None
        self.state = "closed"  # closed, open, half_open

    def record_success(self) -> None:
        """Record successful operation."""
        self.failures = 0
        self.state = "closed"

    def record_failure(self) -> None:
        """Record failed operation."""
        self.failures += 1
        self.last_failure_time = datetime.now()

        if self.failures >= self.failure_threshold:
            self.state = "open"
            logger.warning(
                "Circuit breaker opened",
                failures=self.failures,
                threshold=self.failure_threshold,
            )

    def can_execute(self) -> bool:
        """Check if operation can be executed."""
        if self.state == "closed":
            return True

        if self.state == "open":
            if self.last_failure_time and \
               datetime.now() - self.last_failure_time > timedelta(seconds=self.timeout):
                self.state = "half_open"
                logger.info("Circuit breaker half-open, allowing test request")
                return True
            return False

        # half_open state
        return True


class RateLimiter:
    """Token bucket rate limiter with circuit breaker."""

    def __init__(self):
        self.buckets: dict[str, dict] = {}
        self.circuit_breakers: dict[str, CircuitBreaker] = {}
        self._lock = asyncio.Lock()

    async def check_rate_limit(
        self,
        key: str,
        max_requests: int = 100,
        window_seconds: int = 60,
    ) -> bool:
        """
        Check if request is within rate limit.

        Args:
            key: Unique identifier (e.g., user_id, api_key)
            max_requests: Maximum requests allowed
            window_seconds: Time window in seconds

        Returns:
            True if request is allowed, False otherwise
        """
        async with self._lock:
            now = datetime.now()

            if key not in self.buckets:
                self.buckets[key] = {
                    "tokens": max_requests,
                    "last_update": now,
                }

            bucket = self.buckets[key]
            time_passed = (now - bucket["last_update"]).total_seconds()

            # Refill tokens based on time passed
            tokens_to_add = (time_passed / window_seconds) * max_requests
            bucket["tokens"] = min(max_requests, bucket["tokens"] + tokens_to_add)
            bucket["last_update"] = now

            # Check if we have tokens available
            if bucket["tokens"] >= 1:
                bucket["tokens"] -= 1
                return True

            logger.warning("Rate limit exceeded", key=key, tokens=bucket["tokens"])
            return False

    def get_circuit_breaker(self, service: str) -> CircuitBreaker:
        """Get or create circuit breaker for service."""
        if service not in self.circuit_breakers:
            self.circuit_breakers[service] = CircuitBreaker()
        return self.circuit_breakers[service]
