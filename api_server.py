"""
API Server - REST API endpoints for system monitoring and control.
"""

import logging
from datetime import datetime

try:
    from aiohttp import web
    AIOHTTP_AVAILABLE = True
except ImportError:
    AIOHTTP_AVAILABLE = False
    web = None

logger = logging.getLogger(__name__)


class APIServer:
    """REST API server for system management."""

    def __init__(self, host: str = "0.0.0.0", port: int = 8080):
        self.host = host
        self.port = port
        self.app = None
        self.runner = None
        self.cortex = None
        self.gateway = None
        self.registry = None
        logger.info(f"API Server initialized on {host}:{port}")

    def connect_components(self, cortex, gateway, registry):
        """Connect to system components."""
        self.cortex = cortex
        self.gateway = gateway
        self.registry = registry
        logger.info("Connected to system components")

    async def handle_status(self, request) -> web.Response:
        """Get overall system status."""
        status = {
            "system": "Infinity Matrix",
            "status": "running",
            "timestamp": datetime.utcnow().isoformat(),
            "components": {}
        }

        if self.cortex:
            status["components"]["cortex"] = self.cortex.get_status()

        if self.gateway:
            status["components"]["gateway"] = self.gateway.get_status()

        if self.registry:
            status["components"]["registry"] = self.registry.get_status()

        return web.json_response(status)

    async def handle_agents_list(self, request) -> web.Response:
        """list all agents."""
        if not self.registry:
            return web.json_response({"error": "Registry not connected"}, status=500)

        agents = self.registry.list_agents()
        agent_list = [
            {
                "agent_id": agent.agent_id,
                "type": agent.agent_type.value,
                "status": agent.status.value,
                "roles": agent.context.roles,
                "capabilities": agent.context.capabilities
            }
            for agent in agents
        ]

        return web.json_response({"agents": agent_list})

    async def handle_agent_status(self, request) -> web.Response:
        """Get status of a specific agent."""
        agent_id = request.match_info.get("agent_id")

        if not self.registry:
            return web.json_response({"error": "Registry not connected"}, status=500)

        agent = self.registry.get_agent(agent_id)
        if not agent:
            return web.json_response({"error": f"Agent not found: {agent_id}"}, status=404)

        return web.json_response({
            "agent_id": agent.agent_id,
            "type": agent.agent_type.value,
            "status": agent.status.value,
            "registered_at": agent.registered_at.isoformat(),
            "last_heartbeat": agent.last_heartbeat.isoformat(),
            "roles": agent.context.roles,
            "permissions": agent.context.permissions,
            "capabilities": agent.context.capabilities
        })

    async def handle_agent_health(self, request) -> web.Response:
        """Get health of a specific agent."""
        agent_id = request.match_info.get("agent_id")

        if not self.registry:
            return web.json_response({"error": "Registry not connected"}, status=500)

        health = self.registry.get_agent_health(agent_id)
        if not health:
            return web.json_response({"error": f"Agent not found: {agent_id}"}, status=404)

        return web.json_response({
            "agent_id": health.agent_id,
            "status": health.status.value,
            "last_heartbeat": health.last_heartbeat.isoformat(),
            "response_time_ms": health.response_time_ms,
            "error_count": health.error_count
        })

    async def handle_routes_list(self, request) -> web.Response:
        """list all routes."""
        if not self.gateway:
            return web.json_response({"error": "Gateway not connected"}, status=500)

        routes = [
            {
                "path": route.path,
                "agent_id": route.agent_id,
                "method": route.method,
                "requires_auth": route.requires_auth,
                "policies": route.policies
            }
            for route in self.gateway.routes.values()
        ]

        return web.json_response({"routes": routes})

    async def handle_dashboard(self, request) -> web.Response:
        """Dashboard audit endpoint."""
        dashboard = {
            "system": "Infinity Matrix",
            "timestamp": datetime.utcnow().isoformat(),
            "summary": {}
        }

        if self.cortex:
            cortex_status = self.cortex.get_status()
            dashboard["summary"]["cortex"] = {
                "status": cortex_status["status"],
                "agents": cortex_status["agents"],
                "documents": cortex_status["documents"]
            }

        if self.registry:
            registry_status = self.registry.get_status()
            dashboard["summary"]["registry"] = {
                "total_agents": registry_status["total_agents"],
                "agents_by_status": registry_status["agents_by_status"]
            }

        if self.gateway:
            gateway_status = self.gateway.get_status()
            dashboard["summary"]["gateway"] = {
                "routes": gateway_status["routes"],
                "policies": gateway_status["policies"]
            }

        return web.json_response(dashboard)

    async def start(self) -> None:
        """Start the API server."""
        if not AIOHTTP_AVAILABLE:
            logger.warning("aiohttp not available, API server disabled")
            return

        self.app = web.Application()

        # Register routes
        self.app.router.add_get("/api/status", self.handle_status)
        self.app.router.add_get("/api/agents", self.handle_agents_list)
        self.app.router.add_get("/api/agents/{agent_id}", self.handle_agent_status)
        self.app.router.add_get("/api/agents/{agent_id}/health", self.handle_agent_health)
        self.app.router.add_get("/api/routes", self.handle_routes_list)
        self.app.router.add_get("/api/dashboard", self.handle_dashboard)

        self.runner = web.AppRunner(self.app)
        await self.runner.setup()

        site = web.TCPSite(self.runner, self.host, self.port)
        await site.start()

        logger.info(f"API Server started on http://{self.host}:{self.port}")

    async def stop(self) -> None:
        """Stop the API server."""
        if self.runner:
            await self.runner.cleanup()
            logger.info("API Server stopped")
