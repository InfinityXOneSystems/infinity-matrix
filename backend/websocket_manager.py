"""WebSocket manager for real-time updates"""

from datetime import datetime
from typing import dict, list

from fastapi import WebSocket


class ConnectionManager:
    """Manages WebSocket connections and broadcasts"""

    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.connection_ids: dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, client_id: str = None):
        """Accept and register a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        if client_id:
            self.connection_ids[websocket] = client_id

        # Send connection confirmation
        await self.send_personal_message(
            {
                "type": "connection_established",
                "timestamp": datetime.utcnow().isoformat(),
                "client_id": client_id
            },
            websocket
        )

    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if websocket in self.connection_ids:
            del self.connection_ids[websocket]

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send a message to a specific client"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            print(f"Error sending message: {e}")
            self.disconnect(websocket)

    async def broadcast(self, message: dict):
        """Broadcast a message to all connected clients"""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting to client: {e}")
                disconnected.append(connection)

        # Clean up disconnected clients
        for connection in disconnected:
            self.disconnect(connection)

    async def broadcast_lead_created(self, lead_data: dict):
        """Broadcast new lead creation event"""
        await self.broadcast({
            "type": "lead_created",
            "data": lead_data,
            "timestamp": datetime.utcnow().isoformat()
        })

    async def broadcast_call_started(self, call_data: dict):
        """Broadcast call initiation event"""
        await self.broadcast({
            "type": "call_started",
            "data": call_data,
            "timestamp": datetime.utcnow().isoformat()
        })

    async def broadcast_call_updated(self, call_data: dict):
        """Broadcast call status update"""
        await self.broadcast({
            "type": "call_updated",
            "data": call_data,
            "timestamp": datetime.utcnow().isoformat()
        })

    async def broadcast_data_enriched(self, enrichment_data: dict):
        """Broadcast data enrichment completion"""
        await self.broadcast({
            "type": "data_enriched",
            "data": enrichment_data,
            "timestamp": datetime.utcnow().isoformat()
        })

    async def broadcast_calendar_updated(self, calendar_data: dict):
        """Broadcast calendar event update"""
        await self.broadcast({
            "type": "calendar_updated",
            "data": calendar_data,
            "timestamp": datetime.utcnow().isoformat()
        })

    async def broadcast_crm_updated(self, crm_data: dict):
        """Broadcast CRM update event"""
        await self.broadcast({
            "type": "crm_updated",
            "data": crm_data,
            "timestamp": datetime.utcnow().isoformat()
        })

    def get_connected_clients(self) -> int:
        """Return number of connected clients"""
        return len(self.active_connections)


# Global connection manager instance
manager = ConnectionManager()
