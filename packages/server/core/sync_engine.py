"""
MCP synchronization engine for real-time context sharing
"""
import asyncio
from typing import dict, list, set

import structlog

from .mcp_protocol import (
    AIProvider,
    ContextData,
    IntelligenceShare,
    MCPMessage,
    MCPProtocol,
    MessageType,
)
from .redis_client import RedisCache, get_redis

logger = structlog.get_logger()


class SyncEngine:
    """Real-time synchronization engine for MCP"""

    def __init__(self):
        self.redis = get_redis()
        self.cache = RedisCache(self.redis)
        self.subscribers: dict[AIProvider, Set[str]] = {}
        self.message_queue: asyncio.Queue = asyncio.Queue()
        self._running = False
        self._worker_task: asyncio.Task | None = None

    async def start(self) -> None:
        """Start the sync engine"""
        if self._running:
            logger.warning("Sync engine already running")
            return

        self._running = True
        self._worker_task = asyncio.create_task(self._process_messages())
        logger.info("Sync engine started")

    async def stop(self) -> None:
        """Stop the sync engine"""
        if not self._running:
            return

        self._running = False
        if self._worker_task:
            self._worker_task.cancel()
            try:
                await self._worker_task
            except asyncio.CancelledError:
                pass

        logger.info("Sync engine stopped")

    async def register_provider(self, provider: AIProvider, connection_id: str) -> None:
        """Register an AI provider connection"""
        if provider not in self.subscribers:
            self.subscribers[provider] = set()

        self.subscribers[provider].add(connection_id)
        logger.info("Provider registered", provider=provider.value, connection_id=connection_id)

    async def unregister_provider(self, provider: AIProvider, connection_id: str) -> None:
        """Unregister an AI provider connection"""
        if provider in self.subscribers:
            self.subscribers[provider].discard(connection_id)
            if not self.subscribers[provider]:
                del self.subscribers[provider]

        logger.info("Provider unregistered", provider=provider.value, connection_id=connection_id)

    async def publish_message(self, message: MCPMessage) -> None:
        """Publish a message to the sync engine"""
        await self.message_queue.put(message)

        # Also publish to Redis pub/sub for distributed systems
        channel = f"mcp:{message.message_type.value}"
        await self.redis.publish(channel, message.to_dict().__str__())

        logger.info(
            "Message published",
            message_id=message.message_id,
            type=message.message_type.value,
            sender=message.sender.value,
        )

    async def sync_context(self, context: ContextData, target_providers: list[AIProvider]) -> None:
        """Synchronize context across specified providers"""
        for provider in target_providers:
            if provider == context.provider:
                continue

            message = MCPProtocol.create_context_sync_message(
                context=context,
                sender=context.provider,
                recipient=provider,
            )
            await self.publish_message(message)

        # Store context in cache
        cache_key = f"context:{context.context_id}"
        await self.cache.set(cache_key, str(context.to_dict()), ttl=3600)

        logger.info(
            "Context synchronized",
            context_id=context.context_id,
            targets=len(target_providers),
        )

    async def share_intelligence(
        self,
        intelligence: IntelligenceShare,
        target_providers: list[AIProvider] | None = None,
    ) -> None:
        """Share intelligence across providers"""
        if target_providers is None:
            target_providers = intelligence.applicable_to or list(AIProvider)

        messages = MCPProtocol.create_intelligence_share_message(
            intelligence=intelligence,
            sender=intelligence.source_provider,
            recipients=target_providers,
        )

        for message in messages:
            await self.publish_message(message)

        # Store intelligence in cache
        cache_key = f"intelligence:{intelligence.intelligence_id}"
        await self.cache.set(cache_key, str(intelligence.to_dict()), ttl=86400)

        logger.info(
            "Intelligence shared",
            intelligence_id=intelligence.intelligence_id,
            targets=len(target_providers),
        )

    async def get_context(self, context_id: str) -> dict | None:
        """Retrieve context from cache"""
        cache_key = f"context:{context_id}"
        context_data = await self.cache.get(cache_key)
        if context_data:
            return eval(context_data)  # In production, use proper JSON serialization
        return None

    async def get_intelligence(self, intelligence_id: str) -> dict | None:
        """Retrieve intelligence from cache"""
        cache_key = f"intelligence:{intelligence_id}"
        intelligence_data = await self.cache.get(cache_key)
        if intelligence_data:
            return eval(intelligence_data)  # In production, use proper JSON serialization
        return None

    async def _process_messages(self) -> None:
        """Process messages from the queue"""
        while self._running:
            try:
                message = await asyncio.wait_for(
                    self.message_queue.get(),
                    timeout=1.0
                )
                await self._handle_message(message)
            except TimeoutError:
                continue
            except Exception as e:
                logger.exception("Error processing message", error=str(e))

    async def _handle_message(self, message: MCPMessage) -> None:
        """Handle a single message"""
        logger.debug(
            "Handling message",
            message_id=message.message_id,
            type=message.message_type.value,
        )

        # Route message to appropriate handler
        if message.message_type == MessageType.CONTEXT_SYNC:
            await self._handle_context_sync(message)
        elif message.message_type == MessageType.INTELLIGENCE_SHARE:
            await self._handle_intelligence_share(message)
        elif message.message_type == MessageType.QUERY:
            await self._handle_query(message)
        elif message.message_type == MessageType.RESPONSE:
            await self._handle_response(message)
        elif message.message_type == MessageType.ERROR:
            await self._handle_error(message)

    async def _handle_context_sync(self, message: MCPMessage) -> None:
        """Handle context synchronization message"""
        # Store in database and notify subscribers
        # This would integrate with the AI provider adapters

    async def _handle_intelligence_share(self, message: MCPMessage) -> None:
        """Handle intelligence sharing message"""
        # Process and distribute intelligence

    async def _handle_query(self, message: MCPMessage) -> None:
        """Handle query message"""
        # Route query to appropriate AI provider

    async def _handle_response(self, message: MCPMessage) -> None:
        """Handle response message"""
        # Deliver response to requester

    async def _handle_error(self, message: MCPMessage) -> None:
        """Handle error message"""
        logger.error(
            "Received error message",
            message_id=message.message_id,
            error=message.payload.get("error"),
        )


# Global sync engine instance
_sync_engine: SyncEngine | None = None


def get_sync_engine() -> SyncEngine:
    """Get the global sync engine instance"""
    global _sync_engine
    if _sync_engine is None:
        _sync_engine = SyncEngine()
    return _sync_engine
