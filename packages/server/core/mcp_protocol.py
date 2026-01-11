"""
Model Context Protocol implementation
"""
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, dict, list
from uuid import uuid4


class MessageType(str, Enum):
    """MCP message types"""
    CONTEXT_SYNC = "context_sync"
    INTELLIGENCE_SHARE = "intelligence_share"
    STATE_UPDATE = "state_update"
    QUERY = "query"
    RESPONSE = "response"
    ERROR = "error"
    HEARTBEAT = "heartbeat"


class AIProvider(str, Enum):
    """Supported AI providers"""
    VERTEX_AI = "vertex_ai"
    CHATGPT = "chatgpt"
    GITHUB_COPILOT = "github_copilot"
    VSCODE_COPILOT = "vscode_copilot"
    CUSTOM = "custom"


@dataclass
class MCPMessage:
    """MCP message structure"""
    message_id: str = field(default_factory=lambda: str(uuid4()))
    message_type: MessageType = MessageType.CONTEXT_SYNC
    sender: AIProvider = AIProvider.CUSTOM
    recipient: AIProvider | None = None
    timestamp: datetime = field(default_factory=datetime.utcnow)
    payload: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)
    correlation_id: str | None = None

    def to_dict(self) -> dict[str, Any]:
        """Convert message to dictionary"""
        return {
            "message_id": self.message_id,
            "message_type": self.message_type.value,
            "sender": self.sender.value,
            "recipient": self.recipient.value if self.recipient else None,
            "timestamp": self.timestamp.isoformat(),
            "payload": self.payload,
            "metadata": self.metadata,
            "correlation_id": self.correlation_id,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "MCPMessage":
        """Create message from dictionary"""
        return cls(
            message_id=data.get("message_id", str(uuid4())),
            message_type=MessageType(data["message_type"]),
            sender=AIProvider(data["sender"]),
            recipient=AIProvider(data["recipient"]) if data.get("recipient") else None,
            timestamp=datetime.fromisoformat(data["timestamp"]) if "timestamp" in data else datetime.utcnow(),
            payload=data.get("payload", {}),
            metadata=data.get("metadata", {}),
            correlation_id=data.get("correlation_id"),
        )


@dataclass
class ContextData:
    """Context data structure for AI synchronization"""
    context_id: str = field(default_factory=lambda: str(uuid4()))
    provider: AIProvider = AIProvider.CUSTOM
    conversation_id: str | None = None
    user_id: str | None = None
    workspace_id: str | None = None
    code_context: dict[str, Any] = field(default_factory=dict)
    conversation_history: list[dict[str, Any]] = field(default_factory=list)
    file_references: list[str] = field(default_factory=list)
    symbol_references: list[dict[str, Any]] = field(default_factory=list)
    preferences: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        """Convert context to dictionary"""
        return {
            "context_id": self.context_id,
            "provider": self.provider.value,
            "conversation_id": self.conversation_id,
            "user_id": self.user_id,
            "workspace_id": self.workspace_id,
            "code_context": self.code_context,
            "conversation_history": self.conversation_history,
            "file_references": self.file_references,
            "symbol_references": self.symbol_references,
            "preferences": self.preferences,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


@dataclass
class IntelligenceShare:
    """Intelligence sharing data structure"""
    intelligence_id: str = field(default_factory=lambda: str(uuid4()))
    source_provider: AIProvider = AIProvider.CUSTOM
    intelligence_type: str = "general"
    content: dict[str, Any] = field(default_factory=dict)
    confidence_score: float = 1.0
    tags: list[str] = field(default_factory=list)
    applicable_to: list[AIProvider] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        """Convert intelligence to dictionary"""
        return {
            "intelligence_id": self.intelligence_id,
            "source_provider": self.source_provider.value,
            "intelligence_type": self.intelligence_type,
            "content": self.content,
            "confidence_score": self.confidence_score,
            "tags": self.tags,
            "applicable_to": [p.value for p in self.applicable_to],
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
        }


class MCPProtocol:
    """MCP protocol handler"""

    @staticmethod
    def create_context_sync_message(
        context: ContextData,
        sender: AIProvider,
        recipient: AIProvider | None = None,
    ) -> MCPMessage:
        """Create context synchronization message"""
        return MCPMessage(
            message_type=MessageType.CONTEXT_SYNC,
            sender=sender,
            recipient=recipient,
            payload=context.to_dict(),
        )

    @staticmethod
    def create_intelligence_share_message(
        intelligence: IntelligenceShare,
        sender: AIProvider,
        recipients: list[AIProvider],
    ) -> list[MCPMessage]:
        """Create intelligence sharing messages"""
        messages = []
        for recipient in recipients:
            message = MCPMessage(
                message_type=MessageType.INTELLIGENCE_SHARE,
                sender=sender,
                recipient=recipient,
                payload=intelligence.to_dict(),
            )
            messages.append(message)
        return messages

    @staticmethod
    def create_query_message(
        query: str,
        sender: AIProvider,
        recipient: AIProvider,
        context: dict[str, Any] | None = None,
    ) -> MCPMessage:
        """Create query message"""
        return MCPMessage(
            message_type=MessageType.QUERY,
            sender=sender,
            recipient=recipient,
            payload={
                "query": query,
                "context": context or {},
            },
        )

    @staticmethod
    def create_response_message(
        response: Any,
        sender: AIProvider,
        recipient: AIProvider,
        correlation_id: str,
    ) -> MCPMessage:
        """Create response message"""
        return MCPMessage(
            message_type=MessageType.RESPONSE,
            sender=sender,
            recipient=recipient,
            payload={"response": response},
            correlation_id=correlation_id,
        )

    @staticmethod
    def create_error_message(
        error: str,
        sender: AIProvider,
        recipient: AIProvider | None = None,
        correlation_id: str | None = None,
    ) -> MCPMessage:
        """Create error message"""
        return MCPMessage(
            message_type=MessageType.ERROR,
            sender=sender,
            recipient=recipient,
            payload={"error": error},
            correlation_id=correlation_id,
        )
