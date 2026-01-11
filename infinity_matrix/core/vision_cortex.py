"""
Vision Cortex - The orchestrator brain for the auto-builder system.

Vision Cortex coordinates all agents and manages the build lifecycle.
"""

import asyncio
from datetime import datetime
from typing import Any
from uuid import uuid4

from pydantic import BaseModel, Field

from infinity_matrix.agents.base import AgentTask, AgentType, BaseAgent
from infinity_matrix.agents.implementations import (
    CEOAgent,
    CrawlerAgent,
    DocumentorAgent,
    IngestionAgent,
    OrganizerAgent,
    PredictorAgent,
    StrategistAgent,
    ValidatorAgent,
)
from infinity_matrix.core.blueprint import Blueprint


class BuildPhase(BaseModel):
    """Represents a phase in the build process."""

    name: str
    tasks: list[AgentTask] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    status: str = "pending"  # pending, running, completed, failed


class BuildPlan(BaseModel):
    """Complete build plan with phases and tasks."""

    build_id: str
    blueprint: Blueprint
    phases: list[BuildPhase] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict[str, Any] = Field(default_factory=dict)


class VisionCortex:
    """
    Vision Cortex is the high-level orchestrator that coordinates all agents.

    It acts as the brain of the auto-builder system, managing:
    - Agent registration and lifecycle
    - Task scheduling and execution
    - Build planning and coordination
    - Inter-agent communication
    """

    def __init__(self, config: dict[str, Any] | None = None):
        """Initialize Vision Cortex."""
        self.config = config or {}
        self.agents: dict[AgentType, BaseAgent] = {}
        self.active_builds: dict[str, BuildPlan] = {}
        self._initialize_agents()

    def _initialize_agents(self) -> None:
        """Initialize all agents."""
        self.agents = {
            AgentType.CRAWLER: CrawlerAgent(self.config.get("crawler", {})),
            AgentType.INGESTION: IngestionAgent(self.config.get("ingestion", {})),
            AgentType.PREDICTOR: PredictorAgent(self.config.get("predictor", {})),
            AgentType.CEO: CEOAgent(self.config.get("ceo", {})),
            AgentType.STRATEGIST: StrategistAgent(self.config.get("strategist", {})),
            AgentType.ORGANIZER: OrganizerAgent(self.config.get("organizer", {})),
            AgentType.VALIDATOR: ValidatorAgent(self.config.get("validator", {})),
            AgentType.DOCUMENTOR: DocumentorAgent(self.config.get("documentor", {})),
        }

    async def orchestrate_build(self, blueprint: Blueprint) -> BuildPlan:
        """
        Orchestrate a complete build process.

        This is the main entry point that coordinates all agents to complete a build.

        Args:
            blueprint: The blueprint defining what to build

        Returns:
            BuildPlan with execution results
        """
        build_id = str(uuid4())
        build_plan = await self._create_build_plan(build_id, blueprint)
        self.active_builds[build_id] = build_plan

        # Execute phases in order
        for phase in build_plan.phases:
            await self._execute_phase(phase)

        return build_plan

    async def _create_build_plan(self, build_id: str, blueprint: Blueprint) -> BuildPlan:
        """
        Create a build plan with phases and tasks.

        Args:
            build_id: Unique build identifier
            blueprint: The blueprint to build from

        Returns:
            BuildPlan with phases and tasks
        """
        phases = []

        # Phase 1: Analysis and Planning
        analysis_phase = BuildPhase(
            name="Analysis & Planning",
            tasks=[
                AgentTask(
                    agent_type=AgentType.CRAWLER,
                    action="scan_templates",
                    input_data={"blueprint": blueprint.model_dump()},
                ),
                AgentTask(
                    agent_type=AgentType.INGESTION,
                    action="parse_blueprint",
                    input_data={"blueprint": blueprint.model_dump()},
                ),
                AgentTask(
                    agent_type=AgentType.PREDICTOR,
                    action="predict_architecture",
                    input_data={"requirements": blueprint.requirements},
                ),
            ],
        )
        phases.append(analysis_phase)

        # Phase 2: Decision Making
        decision_phase = BuildPhase(
            name="Decision Making",
            dependencies=[analysis_phase.name],
            tasks=[
                AgentTask(
                    agent_type=AgentType.CEO,
                    action="approve_architecture",
                    input_data={"blueprint": blueprint.model_dump()},
                ),
                AgentTask(
                    agent_type=AgentType.STRATEGIST,
                    action="create_strategy",
                    input_data={"blueprint": blueprint.model_dump()},
                ),
            ],
        )
        phases.append(decision_phase)

        # Phase 3: Organization
        organization_phase = BuildPhase(
            name="Organization",
            dependencies=[decision_phase.name],
            tasks=[
                AgentTask(
                    agent_type=AgentType.ORGANIZER,
                    action="organize_structure",
                    input_data={"project_type": blueprint.type.value},
                ),
                AgentTask(
                    agent_type=AgentType.ORGANIZER,
                    action="manage_dependencies",
                    input_data={"blueprint": blueprint.model_dump()},
                ),
            ],
        )
        phases.append(organization_phase)

        # Phase 4: Validation
        validation_phase = BuildPhase(
            name="Validation",
            dependencies=[organization_phase.name],
            tasks=[
                AgentTask(
                    agent_type=AgentType.VALIDATOR,
                    action="validate_code",
                    input_data={"project_name": blueprint.name},
                ),
                AgentTask(
                    agent_type=AgentType.VALIDATOR,
                    action="check_security",
                    input_data={"project_name": blueprint.name},
                ),
            ],
        )
        phases.append(validation_phase)

        # Phase 5: Documentation
        documentation_phase = BuildPhase(
            name="Documentation",
            dependencies=[validation_phase.name],
            tasks=[
                AgentTask(
                    agent_type=AgentType.DOCUMENTOR,
                    action="generate_readme",
                    input_data={"project": blueprint.model_dump()},
                ),
                AgentTask(
                    agent_type=AgentType.DOCUMENTOR,
                    action="generate_api_docs",
                    input_data={"project": blueprint.model_dump()},
                ),
            ],
        )
        phases.append(documentation_phase)

        return BuildPlan(
            build_id=build_id,
            blueprint=blueprint,
            phases=phases,
        )

    async def _execute_phase(self, phase: BuildPhase) -> None:
        """
        Execute a build phase.

        Args:
            phase: The phase to execute
        """
        phase.status = "running"

        # Execute all tasks in the phase concurrently
        tasks = []
        for task in phase.tasks:
            agent = self.agents.get(task.agent_type)
            if agent:
                tasks.append(agent.execute(task))

        # Wait for all tasks to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Check if any task failed
        failed = any(
            isinstance(result, Exception) or (hasattr(result, "status") and result.status == "failed")
            for result in results
        )

        phase.status = "failed" if failed else "completed"

    async def execute_task(
        self,
        agent_type: AgentType,
        action: str,
        input_data: dict[str, Any] | None = None,
    ) -> Any:
        """
        Execute a single task with a specific agent.

        Args:
            agent_type: The type of agent to use
            action: The action to perform
            input_data: Input data for the task

        Returns:
            AgentResult from task execution
        """
        agent = self.agents.get(agent_type)
        if not agent:
            raise ValueError(f"Agent type {agent_type} not found")

        task = AgentTask(
            agent_type=agent_type,
            action=action,
            input_data=input_data or {},
        )

        return await agent.execute(task)

    def get_agent(self, agent_type: AgentType) -> BaseAgent | None:
        """Get an agent by type."""
        return self.agents.get(agent_type)

    def list_agents(self) -> list[dict[str, Any]]:
        """list all registered agents."""
        return [
            {
                "type": agent_type.value,
                "status": agent.status.value,
                "capabilities": agent.get_capabilities(),
            }
            for agent_type, agent in self.agents.items()
        ]

    def get_build_status(self, build_id: str) -> dict[str, Any] | None:
        """Get the status of a build."""
        build_plan = self.active_builds.get(build_id)
        if not build_plan:
            return None

        return {
            "build_id": build_id,
            "blueprint_name": build_plan.blueprint.name,
            "phases": [
                {
                    "name": phase.name,
                    "status": phase.status,
                    "tasks": len(phase.tasks),
                }
                for phase in build_plan.phases
            ],
            "created_at": build_plan.created_at.isoformat(),
        }

    def list_active_builds(self) -> list[dict[str, Any]]:
        """list all active builds."""
        return [
            self.get_build_status(build_id)
            for build_id in self.active_builds.keys()
        ]
