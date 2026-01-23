"""
Redis client for caching and pub/sub
"""

import structlog
from redis.asyncio import Redis
from redis.asyncio.connection import ConnectionPool

from ..config import settings

logger = structlog.get_logger()

# Global Redis client
_redis_client: Redis | None = None
_redis_pool: ConnectionPool | None = None


async def init_redis() -> None:
    """Initialize Redis connection"""
    global _redis_client, _redis_pool

    logger.info("Initializing Redis connection", host=settings.REDIS_HOST)

    _redis_pool = ConnectionPool.from_url(
        settings.REDIS_URL,
        decode_responses=True,
        max_connections=50,
    )

    _redis_client = Redis(connection_pool=_redis_pool)

    # Test connection
    await _redis_client.ping()

    logger.info("Redis connection initialized")


async def close_redis() -> None:
    """Close Redis connection"""
    global _redis_client, _redis_pool

    if _redis_client:
        logger.info("Closing Redis connection")
        await _redis_client.close()
        _redis_client = None

    if _redis_pool:
        await _redis_pool.disconnect()
        _redis_pool = None

    logger.info("Redis connection closed")


def get_redis() -> Redis:
    """Get Redis client"""
    if _redis_client is None:
        raise RuntimeError("Redis not initialized. Call init_redis() first.")
    return _redis_client


class RedisCache:
    """Redis cache manager"""

    def __init__(self, redis: Redis):
        self.redis = redis

    async def get(self, key: str) -> str | None:
        """Get value from cache"""
        return await self.redis.get(key)

    async def set(self, key: str, value: str, ttl: int = 3600) -> None:
        """Set value in cache with TTL"""
        await self.redis.setex(key, ttl, value)

    async def delete(self, key: str) -> None:
        """Delete key from cache"""
        await self.redis.delete(key)

    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        return bool(await self.redis.exists(key))

    async def increment(self, key: str, amount: int = 1) -> int:
        """Increment counter"""
        return await self.redis.incrby(key, amount)

    async def expire(self, key: str, ttl: int) -> None:
        """Set expiration on key"""
        await self.redis.expire(key, ttl)
