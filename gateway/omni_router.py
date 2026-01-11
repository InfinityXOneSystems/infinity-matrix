"""
Omni Router - Smart routing gateway for the Infinity Matrix system.

Handles:
- Agent/API registration
- Smart routing with load balancing
- Credential and policy gateway
- Pathway interface
- Pub/Sub layer
- Secret management (Google/Hostinger/VSCode)
- RBAC policy enforcement
"""

import logging
import asyncio
from collections.abc import Callable, dict, list, Optional, Any, 
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Permission(Enum):
    """Permission types for RBAC."""
    READ = "read"
    WRITE = "write"
    EXECUTE = "execute"
    ADMIN = "admin"


@dataclass
class Policy:
    """Security policy definition."""
    name: str
    roles: list[str]
    permissions: list[Permission]
    resources: list[str]
    conditions: dict[str, Any] = field(default_factory=dict)


@dataclass
class Credential:
    """Credential information."""
    name: str
    credential_type: str  # google, hostinger, vscode, api_key, etc.
    value: str
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())


@dataclass
class Route:
    """Route definition."""
    path: str
    agent_id: str
    method: str = "POST"
    requires_auth: bool = True
    policies: list[str] = field(default_factory=list)
    rate_limit: Optional[int] = None


class SecretManager:
    """Manages secrets and credentials."""
    
    def __init__(self):
        self.secrets: dict[str, Credential] = {}
        logger.info("Secret Manager initialized")
    
    def store_secret(self, name: str, credential_type: str, value: str, 
                     metadata: Optional[dict[str, Any]] = None) -> None:
        """Store a secret credential."""
        self.secrets[name] = Credential(
            name=name,
            credential_type=credential_type,
            value=value,
            metadata=metadata or {}
        )
        logger.info(f"Stored secret: {name} (type: {credential_type})")
    
    def get_secret(self, name: str) -> Optional[Credential]:
        """Retrieve a secret credential."""
        return self.secrets.get(name)
    
    def delete_secret(self, name: str) -> bool:
        """Delete a secret credential."""
        if name in self.secrets:
            del self.secrets[name]
            logger.info(f"Deleted secret: {name}")
            return True
        return False
    
    def list_secrets(self) -> list[str]:
        """list all secret names (not values)."""
        return list(self.secrets.keys())


class PolicyEnforcer:
    """Enforces RBAC policies."""
    
    def __init__(self):
        self.policies: dict[str, Policy] = {}
        self.user_roles: dict[str, list[str]] = {}
        logger.info("Policy Enforcer initialized")
    
    def add_policy(self, policy: Policy) -> None:
        """Add a security policy."""
        self.policies[policy.name] = policy
        logger.info(f"Added policy: {policy.name}")
    
    def assign_role(self, user_id: str, role: str) -> None:
        """Assign a role to a user."""
        if user_id not in self.user_roles:
            self.user_roles[user_id] = []
        if role not in self.user_roles[user_id]:
            self.user_roles[user_id].append(role)
            logger.info(f"Assigned role '{role}' to user '{user_id}'")
    
    def check_permission(self, user_id: str, resource: str, 
                         permission: Permission) -> bool:
        """Check if user has permission for a resource."""
        user_roles = self.user_roles.get(user_id, [])
        
        for policy in self.policies.values():
            # Check if user has any of the required roles
            if not any(role in user_roles for role in policy.roles):
                continue
            
            # Check if permission is granted
            if permission not in policy.permissions:
                continue
            
            # Check if resource matches
            if resource in policy.resources or "*" in policy.resources:
                logger.debug(f"Permission granted: {user_id} -> {resource} ({permission.value})")
                return True
        
        logger.warning(f"Permission denied: {user_id} -> {resource} ({permission.value})")
        return False
    
    def get_user_permissions(self, user_id: str) -> dict[str, Any]:
        """Get all permissions for a user."""
        user_roles = self.user_roles.get(user_id, [])
        permissions = {
            "roles": user_roles,
            "policies": []
        }
        
        for policy in self.policies.values():
            if any(role in user_roles for role in policy.roles):
                permissions["policies"].append({
                    "name": policy.name,
                    "permissions": [p.value for p in policy.permissions],
                    "resources": policy.resources
                })
        
        return permissions


class OmniRouter:
    """Smart routing gateway for the Infinity Matrix system."""
    
    def __init__(self):
        self.routes: dict[str, Route] = {}
        self.api_registry: dict[str, dict[str, Any]] = {}
        self.secret_manager = SecretManager()
        self.policy_enforcer = PolicyEnforcer()
        self.event_handlers: dict[str, list[Callable]] = {}
        self.request_count: dict[str, int] = {}
        self.is_running = False
        logger.info("Omni Router initialized")
        
        # Initialize default policies
        self._setup_default_policies()
    
    def _setup_default_policies(self) -> None:
        """Setup default RBAC policies."""
        # Admin policy
        admin_policy = Policy(
            name="admin_policy",
            roles=["admin"],
            permissions=[Permission.READ, Permission.WRITE, Permission.EXECUTE, Permission.ADMIN],
            resources=["*"]
        )
        self.policy_enforcer.add_policy(admin_policy)
        
        # Agent policy
        agent_policy = Policy(
            name="agent_policy",
            roles=["agent"],
            permissions=[Permission.READ, Permission.WRITE, Permission.EXECUTE],
            resources=["agents/*", "memory/*", "documents/*"]
        )
        self.policy_enforcer.add_policy(agent_policy)
        
        # Read-only policy
        readonly_policy = Policy(
            name="readonly_policy",
            roles=["viewer"],
            permissions=[Permission.READ],
            resources=["*"]
        )
        self.policy_enforcer.add_policy(readonly_policy)
    
    def register_route(self, route: Route) -> None:
        """Register a route."""
        self.routes[route.path] = route
        logger.info(f"Registered route: {route.method} {route.path} -> {route.agent_id}")
    
    def register_api(self, api_id: str, api_info: dict[str, Any]) -> None:
        """Register an API."""
        self.api_registry[api_id] = {
            "info": api_info,
            "registered_at": datetime.utcnow().isoformat(),
            "status": "active"
        }
        logger.info(f"Registered API: {api_id}")
    
    def unregister_api(self, api_id: str) -> None:
        """Unregister an API."""
        if api_id in self.api_registry:
            self.api_registry[api_id]["status"] = "inactive"
            logger.info(f"Unregistered API: {api_id}")
    
    def subscribe_to_event(self, event_type: str, handler: Callable) -> None:
        """Subscribe to routing events."""
        if event_type not in self.event_handlers:
            self.event_handlers[event_type] = []
        self.event_handlers[event_type].append(handler)
        logger.info(f"Subscribed to event: {event_type}")
    
    def publish_event(self, event_type: str, data: dict[str, Any]) -> None:
        """Publish a routing event."""
        event = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        logger.info(f"Publishing event: {event_type}")
        
        if event_type in self.event_handlers:
            for handler in self.event_handlers[event_type]:
                try:
                    handler(event)
                except Exception as e:
                    logger.error(f"Error in event handler: {e}")
    
    async def route(self, request: dict[str, Any]) -> dict[str, Any]:
        """Route a request with smart routing and policy enforcement."""
        path = request.get("path", "")
        user_id = request.get("user_id", "anonymous")
        method = request.get("method", "POST")
        
        # Find matching route
        route = self.routes.get(path)
        if not route:
            logger.warning(f"No route found for: {path}")
            return {
                "status": "error",
                "message": f"No route found for path: {path}"
            }
        
        # Check method
        if route.method != method:
            return {
                "status": "error",
                "message": f"Method not allowed: {method}"
            }
        
        # Check authentication
        if route.requires_auth and user_id == "anonymous":
            logger.warning(f"Authentication required for: {path}")
            return {
                "status": "error",
                "message": "Authentication required"
            }
        
        # Check policies
        if route.policies:
            for policy_name in route.policies:
                if policy_name in self.policy_enforcer.policies:
                    policy = self.policy_enforcer.policies[policy_name]
                    if not self.policy_enforcer.check_permission(
                        user_id, path, Permission.EXECUTE
                    ):
                        return {
                            "status": "error",
                            "message": "Permission denied"
                        }
        
        # Rate limiting
        if route.rate_limit:
            request_key = f"{user_id}:{path}"
            self.request_count[request_key] = self.request_count.get(request_key, 0) + 1
            if self.request_count[request_key] > route.rate_limit:
                logger.warning(f"Rate limit exceeded: {request_key}")
                return {
                    "status": "error",
                    "message": "Rate limit exceeded"
                }
        
        # Route to agent
        logger.info(f"Routing request: {path} -> {route.agent_id}")
        self.publish_event("request_routed", {
            "path": path,
            "agent_id": route.agent_id,
            "user_id": user_id
        })
        
        return {
            "status": "success",
            "agent_id": route.agent_id,
            "path": path,
            "routed_at": datetime.utcnow().isoformat()
        }
    
    def get_status(self) -> dict[str, Any]:
        """Get gateway status."""
        return {
            "status": "running" if self.is_running else "stopped",
            "routes": len(self.routes),
            "apis": len(self.api_registry),
            "secrets": len(self.secret_manager.secrets),
            "policies": len(self.policy_enforcer.policies),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def start(self) -> None:
        """Start the Omni Router."""
        if self.is_running:
            logger.warning("Omni Router already running")
            return
        
        self.is_running = True
        logger.info("Omni Router started")
        self.publish_event("router_started", {})
    
    async def stop(self) -> None:
        """Stop the Omni Router."""
        if not self.is_running:
            logger.warning("Omni Router not running")
            return
        
        self.is_running = False
        logger.info("Omni Router stopped")
        self.publish_event("router_stopped", {})


# Singleton instance
_router_instance: Optional[OmniRouter] = None


def get_router() -> OmniRouter:
    """Get or create the Omni Router singleton instance."""
    global _router_instance
    if _router_instance is None:
        _router_instance = OmniRouter()
    return _router_instance


async def main():
    """Main entry point for Omni Router."""
    router = get_router()
    await router.start()
    
    try:
        # Keep running
        while router.is_running:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        logger.info("Received shutdown signal")
    finally:
        await router.stop()


if __name__ == "__main__":
    asyncio.run(main())
