"""
Agent Registry - Central registry for all agents in the Infinity Matrix system.

Handles:
- Agent startup registration
- Health monitoring
- Context, roles, and permissions management
- Always-on communication with cortex
- Memory event propagation
"""

import asyncio
import logging
from collections.abc import Callable, dict, list, Optional, Any, 
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AgentStatus(Enum):
    """Agent status enumeration."""
    REGISTERING = "registering"
    ACTIVE = "active"
    IDLE = "idle"
    BUSY = "busy"
    UNHEALTHY = "unhealthy"
    OFFLINE = "offline"


class AgentType(Enum):
    """Agent type enumeration."""
    FINANCIAL = "financial"
    REAL_ESTATE = "real_estate"
    LOAN = "loan"
    ANALYTICS = "analytics"
    NLP = "nlp"
    CRAWLER = "crawler"
    CUSTOM = "custom"


@dataclass
class AgentContext:
    """Agent context information."""
    agent_id: str
    roles: list[str] = field(default_factory=list)
    permissions: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)
    capabilities: list[str] = field(default_factory=list)


@dataclass
class HealthCheck:
    """Health check information."""
    agent_id: str
    status: AgentStatus
    last_heartbeat: datetime
    response_time_ms: float
    error_count: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class RegisteredAgent:
    """Registered agent information."""
    agent_id: str
    agent_type: AgentType
    context: AgentContext
    status: AgentStatus = AgentStatus.REGISTERING
    registered_at: datetime = field(default_factory=datetime.utcnow)
    last_heartbeat: datetime = field(default_factory=datetime.utcnow)
    health: Optional[HealthCheck] = None
    endpoint: Optional[str] = None
    version: str = "1.0.0"


class AgentRegistry:
    """Central registry for all agents."""
    
    def __init__(self):
        self.agents: dict[str, RegisteredAgent] = {}
        self.cortex = None
        self.event_subscribers: dict[str, list[Callable]] = {}
        self.health_check_interval = 30  # seconds
        self.heartbeat_timeout = 60  # seconds
        self.is_running = False
        self._health_check_task: Optional[asyncio.Task] = None
        logger.info("Agent Registry initialized")
    
    def connect_cortex(self, cortex) -> None:
        """Connect to the Vision Cortex."""
        self.cortex = cortex
        logger.info("Connected to Vision Cortex")
    
    def register_agent(
        self,
        agent_id: str,
        agent_type: AgentType,
        roles: list[str],
        permissions: list[str],
        capabilities: list[str] = None,
        endpoint: Optional[str] = None,
        metadata: Optional[dict[str, Any]] = None
    ) -> bool:
        """Register a new agent."""
        if agent_id in self.agents:
            logger.warning(f"Agent already registered: {agent_id}")
            return False
        
        context = AgentContext(
            agent_id=agent_id,
            roles=roles,
            permissions=permissions,
            capabilities=capabilities or [],
            metadata=metadata or {}
        )
        
        agent = RegisteredAgent(
            agent_id=agent_id,
            agent_type=agent_type,
            context=context,
            status=AgentStatus.ACTIVE,
            endpoint=endpoint
        )
        
        self.agents[agent_id] = agent
        logger.info(f"Registered agent: {agent_id} (type: {agent_type.value})")
        
        # Notify cortex
        if self.cortex:
            self.cortex.register_agent(agent_id, {
                "type": agent_type.value,
                "roles": roles,
                "permissions": permissions,
                "capabilities": capabilities or [],
                "endpoint": endpoint
            })
        
        # Publish event
        self.publish_event("agent_registered", {
            "agent_id": agent_id,
            "type": agent_type.value,
            "roles": roles
        })
        
        return True
    
    def unregister_agent(self, agent_id: str) -> bool:
        """Unregister an agent."""
        if agent_id not in self.agents:
            logger.warning(f"Agent not found: {agent_id}")
            return False
        
        self.agents[agent_id].status = AgentStatus.OFFLINE
        logger.info(f"Unregistered agent: {agent_id}")
        
        # Notify cortex
        if self.cortex:
            self.cortex.unregister_agent(agent_id)
        
        # Publish event
        self.publish_event("agent_unregistered", {"agent_id": agent_id})
        
        return True
    
    def update_agent_status(self, agent_id: str, status: AgentStatus) -> bool:
        """Update agent status."""
        if agent_id not in self.agents:
            logger.warning(f"Agent not found: {agent_id}")
            return False
        
        old_status = self.agents[agent_id].status
        self.agents[agent_id].status = status
        logger.info(f"Updated agent status: {agent_id} ({old_status.value} -> {status.value})")
        
        # Publish event
        self.publish_event("agent_status_changed", {
            "agent_id": agent_id,
            "old_status": old_status.value,
            "new_status": status.value
        })
        
        return True
    
    def heartbeat(self, agent_id: str, metadata: Optional[dict[str, Any]] = None) -> bool:
        """Record agent heartbeat."""
        if agent_id not in self.agents:
            logger.warning(f"Agent not found: {agent_id}")
            return False
        
        agent = self.agents[agent_id]
        agent.last_heartbeat = datetime.utcnow()
        
        # Update health check
        if agent.health is None:
            agent.health = HealthCheck(
                agent_id=agent_id,
                status=AgentStatus.ACTIVE,
                last_heartbeat=agent.last_heartbeat,
                response_time_ms=0.0,
                metadata=metadata or {}
            )
        else:
            agent.health.last_heartbeat = agent.last_heartbeat
            agent.health.status = AgentStatus.ACTIVE
            if metadata:
                agent.health.metadata.update(metadata)
        
        logger.debug(f"Heartbeat received: {agent_id}")
        return True
    
    def get_agent(self, agent_id: str) -> Optional[RegisteredAgent]:
        """Get agent information."""
        return self.agents.get(agent_id)
    
    def list_agents(
        self,
        agent_type: Optional[AgentType] = None,
        status: Optional[AgentStatus] = None
    ) -> list[RegisteredAgent]:
        """list agents with optional filters."""
        agents = list(self.agents.values())
        
        if agent_type:
            agents = [a for a in agents if a.agent_type == agent_type]
        
        if status:
            agents = [a for a in agents if a.status == status]
        
        return agents
    
    def get_agent_health(self, agent_id: str) -> Optional[HealthCheck]:
        """Get agent health information."""
        agent = self.agents.get(agent_id)
        if agent:
            return agent.health
        return None
    
    def subscribe_to_event(self, event_type: str, callback: Callable) -> None:
        """Subscribe to registry events."""
        if event_type not in self.event_subscribers:
            self.event_subscribers[event_type] = []
        self.event_subscribers[event_type].append(callback)
        logger.info(f"Subscribed to event: {event_type}")
    
    def publish_event(self, event_type: str, data: dict[str, Any]) -> None:
        """Publish a registry event."""
        event = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        logger.info(f"Publishing event: {event_type}")
        
        # Notify local subscribers
        if event_type in self.event_subscribers:
            for callback in self.event_subscribers[event_type]:
                try:
                    callback(event)
                except Exception as e:
                    logger.error(f"Error in event callback: {e}")
        
        # Notify cortex
        if self.cortex:
            try:
                self.cortex.publish_event(f"registry_{event_type}", data)
            except Exception as e:
                logger.error(f"Error publishing to cortex: {e}")
    
    async def _health_check_loop(self) -> None:
        """Periodic health check loop."""
        while self.is_running:
            try:
                await self._perform_health_checks()
                await asyncio.sleep(self.health_check_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in health check loop: {e}")
    
    async def _perform_health_checks(self) -> None:
        """Perform health checks on all agents."""
        now = datetime.utcnow()
        timeout_threshold = now - timedelta(seconds=self.heartbeat_timeout)
        
        for agent_id, agent in self.agents.items():
            if agent.status == AgentStatus.OFFLINE:
                continue
            
            # Check if agent has timed out
            if agent.last_heartbeat < timeout_threshold:
                logger.warning(f"Agent unhealthy (timeout): {agent_id}")
                self.update_agent_status(agent_id, AgentStatus.UNHEALTHY)
                
                if agent.health:
                    agent.health.status = AgentStatus.UNHEALTHY
                    agent.health.error_count += 1
    
    async def start(self) -> None:
        """Start the Agent Registry."""
        if self.is_running:
            logger.warning("Agent Registry already running")
            return
        
        self.is_running = True
        logger.info("Agent Registry started")
        
        # Start health check loop
        self._health_check_task = asyncio.create_task(self._health_check_loop())
        
        # Publish event
        self.publish_event("registry_started", {})
    
    async def stop(self) -> None:
        """Stop the Agent Registry."""
        if not self.is_running:
            logger.warning("Agent Registry not running")
            return
        
        self.is_running = False
        logger.info("Agent Registry stopping")
        
        # Cancel health check task
        if self._health_check_task:
            self._health_check_task.cancel()
            try:
                await self._health_check_task
            except asyncio.CancelledError:
                pass
        
        logger.info("Agent Registry stopped")
        
        # Publish event
        self.publish_event("registry_stopped", {})
    
    def get_status(self) -> dict[str, Any]:
        """Get registry status."""
        agents_by_status = {}
        for agent in self.agents.values():
            status = agent.status.value
            agents_by_status[status] = agents_by_status.get(status, 0) + 1
        
        agents_by_type = {}
        for agent in self.agents.values():
            agent_type = agent.agent_type.value
            agents_by_type[agent_type] = agents_by_type.get(agent_type, 0) + 1
        
        return {
            "status": "running" if self.is_running else "stopped",
            "total_agents": len(self.agents),
            "agents_by_status": agents_by_status,
            "agents_by_type": agents_by_type,
            "health_check_interval": self.health_check_interval,
            "heartbeat_timeout": self.heartbeat_timeout,
            "timestamp": datetime.utcnow().isoformat()
        }


# Singleton instance
_registry_instance: Optional[AgentRegistry] = None


def get_registry() -> AgentRegistry:
    """Get or create the Agent Registry singleton instance."""
    global _registry_instance
    if _registry_instance is None:
        _registry_instance = AgentRegistry()
    return _registry_instance


async def main():
    """Main entry point for Agent Registry."""
    registry = get_registry()
    await registry.start()
    
    try:
        # Keep running
        while registry.is_running:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        logger.info("Received shutdown signal")
    finally:
        await registry.stop()


if __name__ == "__main__":
    asyncio.run(main())
