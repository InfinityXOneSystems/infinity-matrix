"""Agent management endpoints."""

from typing import Any
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

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
    name: str = Field(..., description="Human-readable agent name")
    capabilities: list[str] = Field(default_factory=list, description="Agent capabilities")


class AgentResponse(BaseModel):
    """Agent response model."""

    agent_id: str = Field(..., description="Unique agent identifier")
    agent_type: str = Field(..., description="Type of agent")
    name: str = Field(..., description="Agent name")
    status: str = Field(..., description="Registration status")
    api_key: str = Field(..., description="API key for agent authentication")


# In-memory agent storage (TODO: Replace with database)
_agents: dict[str, dict[str, Any]] = {}


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
            last_active=agent_data.get("last_active", "2025-12-30T22:47:42.913Z"),
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
    # Generate agent ID and API key
    agent_id = f"agent_{uuid4().hex[:12]}"
    api_key = f"key_{uuid4().hex}"

    # Determine authority level based on agent type
    authority_levels = {
        "user": 0,
        "vscode": 1,
        "github": 2,
        "monitoring": 3,
        "worker": 3,
    }
    authority_level = authority_levels.get(agent.agent_type.lower(), 3)

    # Store agent data
    _agents[agent_id] = {
        "agent_id": agent_id,
        "agent_type": agent.agent_type,
        "name": agent.name,
        "capabilities": agent.capabilities,
        "authority_level": authority_level,
        "status": "active",
        "api_key": api_key,
        "created_at": "2025-12-30T22:47:42.913Z",
        "last_active": "2025-12-30T22:47:42.913Z",
    }

    return AgentResponse(
        agent_id=agent_id,
        agent_type=agent.agent_type,
        name=agent.name,
        status="registered",
        api_key=api_key,
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
        last_active=agent_data.get("last_active", "2025-12-30T22:47:42.913Z"),
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
