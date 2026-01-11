"""Role-Based Access Control (RBAC) implementation."""

from datetime import datetime
from enum import Enum
from typing import Optional, list, set
from uuid import uuid4

from pydantic import BaseModel, Field


class Permission(str, Enum):
    """Permission enumeration."""
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    EXECUTE = "execute"
    ADMIN = "admin"


class Role(BaseModel):
    """Role model."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    description: str | None = None
    permissions: Set[Permission] = Field(default_factory=set)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class User(BaseModel):
    """User model."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    username: str
    email: str
    roles: Set[str] = Field(default_factory=set)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RBACManager:
    """Manager for Role-Based Access Control."""

    def __init__(self):
        self._roles: dict[str, Role] = {}
        self._users: dict[str, User] = {}

        # Create default roles
        self._create_default_roles()

    def _create_default_roles(self) -> None:
        """Create default system roles."""
        admin_role = Role(
            name="admin",
            description="Administrator with full access",
            permissions={
                Permission.READ,
                Permission.WRITE,
                Permission.DELETE,
                Permission.EXECUTE,
                Permission.ADMIN
            }
        )

        developer_role = Role(
            name="developer",
            description="Developer with read/write access",
            permissions={
                Permission.READ,
                Permission.WRITE,
                Permission.EXECUTE
            }
        )

        viewer_role = Role(
            name="viewer",
            description="Viewer with read-only access",
            permissions={Permission.READ}
        )

        self._roles[admin_role.name] = admin_role
        self._roles[developer_role.name] = developer_role
        self._roles[viewer_role.name] = viewer_role

    def create_role(self, role: Role) -> None:
        """Create a new role."""
        self._roles[role.name] = role

    def get_role(self, name: str) -> Role | None:
        """Get role by name."""
        return self._roles.get(name)

    def list_roles(self) -> list[Role]:
        """list all roles."""
        return list(self._roles.values())

    def create_user(self, user: User) -> None:
        """Create a new user."""
        self._users[user.username] = user

    def get_user(self, username: str) -> User | None:
        """Get user by username."""
        return self._users.get(username)

    def assign_role(self, username: str, role_name: str) -> bool:
        """Assign a role to a user."""
        user = self._users.get(username)
        if user and role_name in self._roles:
            user.roles.add(role_name)
            return True
        return False

    def revoke_role(self, username: str, role_name: str) -> bool:
        """Revoke a role from a user."""
        user = self._users.get(username)
        if user and role_name in user.roles:
            user.roles.remove(role_name)
            return True
        return False

    def has_permission(self, username: str, permission: Permission) -> bool:
        """Check if user has a specific permission."""
        user = self._users.get(username)
        if not user:
            return False

        for role_name in user.roles:
            role = self._roles.get(role_name)
            if role and permission in role.permissions:
                return True

        return False

    def get_user_permissions(self, username: str) -> Set[Permission]:
        """Get all permissions for a user."""
        user = self._users.get(username)
        if not user:
            return set()

        permissions = set()
        for role_name in user.roles:
            role = self._roles.get(role_name)
            if role:
                permissions.update(role.permissions)

        return permissions


# Global RBAC manager instance
_rbac_manager = RBACManager()


def get_rbac_manager() -> RBACManager:
    """Get the global RBAC manager."""
    return _rbac_manager
