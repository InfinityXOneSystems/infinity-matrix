"""Agent management endpoints."""

import hashlib
import secrets
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, field_validator

router = APIRouter()


class AgentStatus(BaseModel):
    """Agent status model."""

    agent_id: str = Field(..., description="Unique agent identifier")
    agent_type: str = Field(..., description="Type of agent (user, vscode, github)")
    status: str = Field(..., description="Current status (active, idle, offline)")
    authority_level: int = Field(..., description="Agent authority level (0-5)")
    last_active: str = Field(..., description="Last activity timestamp")


class AgentRegistration(BaseModel):
    """Agent registration request model."""

    agent_type: str = Field(..., description="Type of agent to register")
    name: str = Field(..., description="Human-readable agent name", min_length=1, max_length=100)
    capabilities: list[str] = Field(default_factory=list, description="Agent capabilities")

    @field_validator("agent_type")
    @classmethod
    def validate_agent_type(cls, v: str) -> str:
        """Validate agent type is allowed."""
        allowed_types = {"user", "vscode", "github", "monitoring", "worker"}
        if v.lower() not in allowed_types:
            raise ValueError(
                f"Invalid agent_type. Must be one of: {', '.join(allowed_types)}"
            )
        return v.lower()

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate agent name."""
        if not v or v.strip() == "":
            raise ValueError("Agent name cannot be empty")
        # Remove any control characters
        cleaned = "".join(char for char in v if char.isprintable())
        return cleaned.strip()

    @field_validator("capabilities")
    @classmethod
    def validate_capabilities(cls, v: list[str]) -> list[str]:
        """Validate capabilities list."""
        if len(v) > 50:
            raise ValueError("Maximum 50 capabilities allowed")
        # Validate each capability string
        validated = []
        for cap in v:
            if not isinstance(cap, str):
                raise ValueError("All capabilities must be strings")
            if len(cap) > 100:
                raise ValueError("Capability name too long (max 100 chars)")
            validated.append(cap.strip())
        return validated


class AgentResponse(BaseModel):
    """Agent response model."""

    agent_id: str = Field(..., description="Unique agent identifier")
    agent_type: str = Field(..., description="Type of agent")
    name: str = Field(..., description="Agent name")
    status: str = Field(..., description="Registration status")
    api_key: str = Field(..., description="API key for agent authentication")


# In-memory agent storage (TODO: Replace with database)
_agents: dict[str, dict[str, Any]] = {}


def generate_api_key() -> tuple[str, str]:
    """Generate a secure API key and its hash.
    
    Returns:
        Tuple of (raw_key, hashed_key) where:
        - raw_key: The plaintext key to return to client (only shown once)
        - hashed_key: The hashed key to store in database
    """
    # Generate a cryptographically secure random key
    raw_key = f"sk_{secrets.token_urlsafe(32)}"
    
    # Hash the key for storage (using SHA-256)
    hashed_key = hashlib.sha256(raw_key.encode()).hexdigest()
    
    return raw_key, hashed_key


def get_current_timestamp() -> str:
    """Get current timestamp in ISO format with UTC timezone."""
    return datetime.now(timezone.utc).isoformat()


@router.get(
    "/",
    summary="list all agents",
    response_model=list[AgentStatus],
)
async def list_agents() -> list[AgentStatus]:
    """list all registered agents.

    Returns:
        list of agent status information
    """
    return [
        AgentStatus(
            agent_id=agent_id,
            agent_type=agent_data["agent_type"],
            status=agent_data.get("status", "idle"),
            authority_level=agent_data.get("authority_level", 3),
            last_active=agent_data.get("last_active", get_current_timestamp()),
        )
        for agent_id, agent_data in _agents.items()
    ]


@router.post(
    "/",
    summary="Register a new agent",
    status_code=status.HTTP_201_CREATED,
    response_model=AgentResponse,
)
async def register_agent(agent: AgentRegistration) -> AgentResponse:
    """Register a new agent in the system.

    Args:
        agent: Agent registration details

    Returns:
        Registered agent information with API key
    """
    # Generate agent ID and secure API key
    agent_id = f"agent_{uuid4().hex[:12]}"
    api_key, api_key_hash = generate_api_key()

    # Determine authority level based on agent type
    authority_levels = {
        "user": 0,
        "vscode": 1,
        "github": 2,
        "monitoring": 3,
        "worker": 3,
    }
    authority_level = authority_levels.get(agent.agent_type.lower(), 3)
    
    current_time = get_current_timestamp()

    # Store agent data (store hash, not the raw key)
    _agents[agent_id] = {
        "agent_id": agent_id,
        "agent_type": agent.agent_type,
        "name": agent.name,
        "capabilities": agent.capabilities,
        "authority_level": authority_level,
        "status": "active",
        "api_key_hash": api_key_hash,  # Store hash only
        "created_at": current_time,
        "last_active": current_time,
    }

    # Return raw API key only once during registration
    return AgentResponse(
        agent_id=agent_id,
        agent_type=agent.agent_type,
        name=agent.name,
        status="registered",
        api_key=api_key,  # Only shown during registration
    )


@router.get(
    "/{agent_id}",
    summary="Get agent details",
    response_model=AgentStatus,
)
async def get_agent(agent_id: str) -> AgentStatus:
    """Get details of a specific agent.

    Args:
        agent_id: Unique agent identifier

    Returns:
        Agent status information

    Raises:
        HTTPException: If agent not found
    """
    if agent_id not in _agents:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent {agent_id} not found",
        )

    agent_data = _agents[agent_id]
    return AgentStatus(
        agent_id=agent_id,
        agent_type=agent_data["agent_type"],
        status=agent_data.get("status", "idle"),
        authority_level=agent_data.get("authority_level", 3),
        last_active=agent_data.get("last_active", get_current_timestamp()),
    )


@router.delete(
    "/{agent_id}",
    summary="Deregister an agent",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def deregister_agent(agent_id: str) -> None:
    """Deregister an agent from the system.

    Args:
        agent_id: Unique agent identifier

    Raises:
        HTTPException: If agent not found
    """
    if agent_id not in _agents:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent {agent_id} not found",
        )

    del _agents[agent_id]
