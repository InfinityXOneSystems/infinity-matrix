"""
MCP protocol endpoints
"""
from typing import Any, dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ....core.mcp_protocol import AIProvider, MCPMessage
from ....core.sync_engine import get_sync_engine

router = APIRouter()


class MessageRequest(BaseModel):
    """Request model for sending messages"""
    sender: str
    recipient: str | None = None
    message_type: str
    payload: dict[str, Any]
    correlation_id: str | None = None


@router.post("/messages")
async def send_message(request: MessageRequest) -> dict:
    """Send an MCP message"""
    try:
        sender = AIProvider(request.sender)
        recipient = AIProvider(request.recipient) if request.recipient else None

        message = MCPMessage.from_dict({
            "message_type": request.message_type,
            "sender": sender.value,
            "recipient": recipient.value if recipient else None,
            "payload": request.payload,
            "correlation_id": request.correlation_id,
        })

        sync_engine = get_sync_engine()
        await sync_engine.publish_message(message)

        return {
            "status": "success",
            "message_id": message.message_id,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/messages/{message_id}")
async def get_message(message_id: str) -> dict:
    """Get message details"""
    # TODO: Implement message retrieval from database
    return {
        "message_id": message_id,
        "status": "not_implemented",
    }


@router.get("/stats")
async def get_stats() -> dict:
    """Get MCP statistics"""
    sync_engine = get_sync_engine()

    return {
        "active_providers": len(sync_engine.subscribers),
        "total_connections": sum(len(conns) for conns in sync_engine.subscribers.values()),
        "queue_size": sync_engine.message_queue.qsize(),
    }
