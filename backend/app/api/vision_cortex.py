"""
Vision Cortex API Endpoints - Interactive Intelligence Interface
"""
import json
import uuid

from app.core.database import get_db
from app.models.models import Discovery, VisionCortexSession
from app.models.schemas import VisionCortexChatRequest, VisionCortexChatResponse
from app.services.vision_cortex_service import VisionCortexService
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.post("/session/create")
async def create_vision_cortex_session(
    discovery_id: int = None,
    user_type: str = "client",
    db: AsyncSession = Depends(get_db)
):
    """Create a new Vision Cortex interactive session"""
    if discovery_id:
        # Verify discovery exists
        result = await db.execute(
            select(Discovery).where(Discovery.id == discovery_id)
        )
        discovery = result.scalar_one_or_none()
        if not discovery:
            raise HTTPException(status_code=404, detail="Discovery not found")

    # Create session
    session_token = str(uuid.uuid4())
    session = VisionCortexSession(
        discovery_id=discovery_id,
        session_token=session_token,
        user_type=user_type,
        conversation_history=[]
    )

    db.add(session)
    await db.commit()
    await db.refresh(session)

    return {
        "session_token": session_token,
        "discovery_id": discovery_id,
        "user_type": user_type,
        "status": "active"
    }


@router.post("/chat", response_model=VisionCortexChatResponse)
async def vision_cortex_chat(
    request: VisionCortexChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Interactive chat with Vision Cortex intelligence system.

    Features:
    - Conversational Q&A about discovery findings
    - Knowledge summaries
    - Insight exploration
    - Strategic guidance
    """
    # Get session
    result = await db.execute(
        select(VisionCortexSession)
        .where(VisionCortexSession.session_token == request.session_token)
        .where(VisionCortexSession.is_active)
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found or inactive")

    # Process chat message
    cortex_service = VisionCortexService(db)
    response = await cortex_service.process_message(
        session=session,
        message=request.message,
        context_ids=request.context_ids
    )

    # Update session
    await db.commit()
    await db.refresh(session)

    return response


@router.get("/session/{session_token}/history")
async def get_session_history(
    session_token: str,
    db: AsyncSession = Depends(get_db)
):
    """Get conversation history for a session"""
    result = await db.execute(
        select(VisionCortexSession)
        .where(VisionCortexSession.session_token == session_token)
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return {
        "session_token": session_token,
        "conversation_history": session.conversation_history,
        "context_summary": session.context_summary
    }


@router.websocket("/ws/{session_token}")
async def vision_cortex_websocket(websocket: WebSocket, session_token: str):
    """
    WebSocket endpoint for real-time Vision Cortex interaction
    """
    await websocket.accept()

    try:
        # Get database session (this is a simplified version)
        # In production, you'd use a proper async context manager
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(VisionCortexSession)
                .where(VisionCortexSession.session_token == session_token)
                .where(VisionCortexSession.is_active)
            )
            session = result.scalar_one_or_none()

            if not session:
                await websocket.send_json({
                    "error": "Invalid or inactive session"
                })
                await websocket.close()
                return

            cortex_service = VisionCortexService(db)

            while True:
                # Receive message
                data = await websocket.receive_text()
                message_data = json.loads(data)

                # Process message
                response = await cortex_service.process_message(
                    session=session,
                    message=message_data.get("message", ""),
                    context_ids=message_data.get("context_ids")
                )

                await db.commit()

                # Send response
                await websocket.send_json({
                    "response": response.response,
                    "related_insights": response.related_insights
                })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({
            "error": str(e)
        })
        await websocket.close()


@router.post("/session/{session_token}/close")
async def close_session(
    session_token: str,
    db: AsyncSession = Depends(get_db)
):
    """Close a Vision Cortex session"""
    result = await db.execute(
        select(VisionCortexSession)
        .where(VisionCortexSession.session_token == session_token)
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.is_active = False
    await db.commit()

    return {"status": "closed"}


# Import AsyncSessionLocal for websocket
from app.core.database import AsyncSessionLocal
