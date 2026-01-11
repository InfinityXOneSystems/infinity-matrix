"""
Pub/Sub Integration - Event propagation and messaging system.

Handles:
- Event publishing and subscription
- Message routing
- Event persistence
- Integration with cortex and agents
"""

import asyncio
import logging
from collections.abc import Callable, dict, list, Optional, Any, 
from datetime import datetime
from dataclasses import dataclass, field
from collections import defaultdict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class Message:
    """Pub/Sub message."""
    message_id: str
    topic: str
    data: dict[str, Any]
    attributes: dict[str, str] = field(default_factory=dict)
    published_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class Subscription:
    """Subscription information."""
    subscription_id: str
    topic: str
    callback: Callable
    filter_attributes: dict[str, str] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)


class PubSubIntegration:
    """Manages Pub/Sub messaging and event propagation."""
    
    def __init__(self, project_id: Optional[str] = None):
        self.project_id = project_id or "infinity-matrix-default"
        self.topics: dict[str, list[Message]] = defaultdict(list)
        self.subscriptions: dict[str, Subscription] = {}
        self.topic_subscribers: dict[str, list[str]] = defaultdict(list)
        self.message_counter = 0
        self.is_connected = False
        logger.info(f"Pub/Sub Integration initialized (project: {self.project_id})")
    
    async def connect(self) -> bool:
        """Connect to Pub/Sub service."""
        # In production, this would initialize the actual Pub/Sub client
        # For now, we use in-memory messaging as a mock
        self.is_connected = True
        logger.info("Connected to Pub/Sub (mock mode)")
        return True
    
    async def disconnect(self) -> None:
        """Disconnect from Pub/Sub service."""
        self.is_connected = False
        logger.info("Disconnected from Pub/Sub")
    
    async def create_topic(self, topic: str) -> bool:
        """Create a topic."""
        if not self.is_connected:
            logger.error("Not connected to Pub/Sub")
            return False
        
        if topic not in self.topics:
            self.topics[topic] = []
            logger.info(f"Created topic: {topic}")
        return True
    
    async def delete_topic(self, topic: str) -> bool:
        """Delete a topic."""
        if topic in self.topics:
            del self.topics[topic]
            # Remove subscriptions for this topic
            to_remove = [
                sub_id for sub_id, sub in self.subscriptions.items()
                if sub.topic == topic
            ]
            for sub_id in to_remove:
                del self.subscriptions[sub_id]
            if topic in self.topic_subscribers:
                del self.topic_subscribers[topic]
            logger.info(f"Deleted topic: {topic}")
            return True
        return False
    
    async def publish(
        self,
        topic: str,
        data: dict[str, Any],
        attributes: Optional[dict[str, str]] = None
    ) -> str:
        """Publish a message to a topic."""
        if not self.is_connected:
            logger.error("Not connected to Pub/Sub")
            return ""
        
        # Ensure topic exists
        await self.create_topic(topic)
        
        # Create message
        self.message_counter += 1
        message_id = f"msg-{self.message_counter}-{datetime.utcnow().timestamp()}"
        message = Message(
            message_id=message_id,
            topic=topic,
            data=data,
            attributes=attributes or {}
        )
        
        # Store message
        self.topics[topic].append(message)
        logger.info(f"Published message to {topic}: {message_id}")
        
        # Deliver to subscribers
        await self._deliver_message(topic, message)
        
        return message_id
    
    async def subscribe(
        self,
        subscription_id: str,
        topic: str,
        callback: Callable,
        filter_attributes: Optional[dict[str, str]] = None
    ) -> bool:
        """Subscribe to a topic."""
        if not self.is_connected:
            logger.error("Not connected to Pub/Sub")
            return False
        
        # Ensure topic exists
        await self.create_topic(topic)
        
        # Create subscription
        subscription = Subscription(
            subscription_id=subscription_id,
            topic=topic,
            callback=callback,
            filter_attributes=filter_attributes or {}
        )
        
        self.subscriptions[subscription_id] = subscription
        self.topic_subscribers[topic].append(subscription_id)
        logger.info(f"Created subscription: {subscription_id} -> {topic}")
        return True
    
    async def unsubscribe(self, subscription_id: str) -> bool:
        """Unsubscribe from a topic."""
        if subscription_id not in self.subscriptions:
            logger.warning(f"Subscription not found: {subscription_id}")
            return False
        
        subscription = self.subscriptions[subscription_id]
        topic = subscription.topic
        
        # Remove subscription
        del self.subscriptions[subscription_id]
        if subscription_id in self.topic_subscribers[topic]:
            self.topic_subscribers[topic].remove(subscription_id)
        
        logger.info(f"Removed subscription: {subscription_id}")
        return True
    
    async def _deliver_message(self, topic: str, message: Message) -> None:
        """Deliver a message to all subscribers."""
        if topic not in self.topic_subscribers:
            return
        
        for subscription_id in self.topic_subscribers[topic]:
            if subscription_id not in self.subscriptions:
                continue
            
            subscription = self.subscriptions[subscription_id]
            
            # Check filter attributes
            if subscription.filter_attributes:
                match = all(
                    message.attributes.get(k) == v
                    for k, v in subscription.filter_attributes.items()
                )
                if not match:
                    continue
            
            # Call subscriber callback
            try:
                if asyncio.iscoroutinefunction(subscription.callback):
                    await subscription.callback(message)
                else:
                    subscription.callback(message)
                logger.debug(f"Delivered message {message.message_id} to {subscription_id}")
            except Exception as e:
                logger.error(f"Error delivering message to {subscription_id}: {e}")
    
    async def pull_messages(
        self,
        subscription_id: str,
        max_messages: int = 10
    ) -> list[Message]:
        """Pull messages from a subscription."""
        if subscription_id not in self.subscriptions:
            logger.warning(f"Subscription not found: {subscription_id}")
            return []
        
        subscription = self.subscriptions[subscription_id]
        topic = subscription.topic
        
        if topic not in self.topics:
            return []
        
        # Get messages from topic
        messages = self.topics[topic][-max_messages:]
        logger.info(f"Pulled {len(messages)} messages from {subscription_id}")
        return messages
    
    def list_topics(self) -> list[str]:
        """list all topics."""
        return list(self.topics.keys())
    
    def list_subscriptions(self, topic: Optional[str] = None) -> list[str]:
        """list subscriptions, optionally filtered by topic."""
        if topic:
            return self.topic_subscribers.get(topic, [])
        return list(self.subscriptions.keys())
    
    def get_topic_stats(self, topic: str) -> Optional[dict[str, Any]]:
        """Get statistics for a topic."""
        if topic not in self.topics:
            return None
        
        return {
            "topic": topic,
            "message_count": len(self.topics[topic]),
            "subscriber_count": len(self.topic_subscribers.get(topic, [])),
            "latest_message": (
                self.topics[topic][-1].published_at.isoformat()
                if self.topics[topic] else None
            )
        }
    
    def get_status(self) -> dict[str, Any]:
        """Get integration status."""
        total_messages = sum(len(msgs) for msgs in self.topics.values())
        
        return {
            "connected": self.is_connected,
            "project_id": self.project_id,
            "topics": len(self.topics),
            "subscriptions": len(self.subscriptions),
            "total_messages": total_messages,
            "timestamp": datetime.utcnow().isoformat()
        }


# Singleton instance
_pubsub_instance: Optional[PubSubIntegration] = None


def get_pubsub() -> PubSubIntegration:
    """Get or create the Pub/Sub integration singleton instance."""
    global _pubsub_instance
    if _pubsub_instance is None:
        _pubsub_instance = PubSubIntegration()
    return _pubsub_instance


async def main():
    """Example usage."""
    pubsub = get_pubsub()
    await pubsub.connect()
    
    # Create topic
    await pubsub.create_topic("test-topic")
    
    # Subscribe
    def handler(message: Message):
        print(f"Received: {message.data}")
    
    await pubsub.subscribe("test-sub", "test-topic", handler)
    
    # Publish
    await pubsub.publish("test-topic", {"message": "Hello, World!"})
    
    await asyncio.sleep(1)
    await pubsub.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
