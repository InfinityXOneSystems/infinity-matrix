"""
Manus Core Intelligence Loop
Observe-Plan-Execute-Validate-Evolve (OPEVE) cycle for autonomous agents
"""
import asyncio
import logging
import uuid
from datetime import datetime
from typing import Any, dict, list

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/manus", tags=["Manus Core"])

# ============================================================================
# Data Models
# ============================================================================

class AgentConfig(BaseModel):
    """Configuration for a Manus Core agent"""
    name: str
    role: str
    capabilities: list[str]
    max_iterations: int = 5
    timeout_seconds: int = 300

class ObservationData(BaseModel):
    """Data from the Observe phase"""
    timestamp: datetime
    data_sources: list[str]
    raw_data: dict[str, Any]
    metadata: dict[str, Any] = {}

class Plan(BaseModel):
    """Execution plan from the Plan phase"""
    steps: list[dict[str, Any]]
    estimated_duration: float
    risk_level: str
    contingencies: list[str] = []

class ExecutionResult(BaseModel):
    """Result from the Execute phase"""
    step_id: str
    status: str  # success, failure, partial
    output: dict[str, Any]
    duration: float
    errors: list[str] = []

class ValidationResult(BaseModel):
    """Result from the Validate phase"""
    is_valid: bool
    confidence_score: float
    issues: list[str] = []
    recommendations: list[str] = []

class EvolutionUpdate(BaseModel):
    """Update from the Evolve phase"""
    improvements: list[str]
    new_capabilities: list[str] = []
    performance_metrics: dict[str, float] = {}

class AgentState(BaseModel):
    """Complete state of an agent in the OPEVE cycle"""
    agent_id: str
    agent_name: str
    current_phase: str  # observe, plan, execute, validate, evolve
    iteration: int
    observation: ObservationData | None = None
    plan: Plan | None = None
    execution_results: list[ExecutionResult] = []
    validation: ValidationResult | None = None
    evolution: EvolutionUpdate | None = None
    status: str  # active, completed, failed, paused
    created_at: datetime
    updated_at: datetime
    metadata: dict[str, Any] = {}

# ============================================================================
# In-Memory State Management (replace with database in production)
# ============================================================================

agents: dict[str, AgentState] = {}
agent_configs: dict[str, AgentConfig] = {}

# ============================================================================
# Core OPEVE Logic
# ============================================================================

async def observe(agent_id: str, data_sources: list[str]) -> ObservationData:
    """
    OBSERVE Phase: Gather and analyze data from multiple sources
    """
    logger.info(f"Agent {agent_id}: OBSERVE phase started")

    raw_data = {}
    for source in data_sources:
        # Simulate data collection from various sources
        raw_data[source] = {
            "status": "collected",
            "timestamp": datetime.now().isoformat(),
            "sample_data": f"Data from {source}"
        }
        await asyncio.sleep(0.1)  # Simulate I/O

    observation = ObservationData(
        timestamp=datetime.now(),
        data_sources=data_sources,
        raw_data=raw_data,
        metadata={"collection_method": "automated", "sources_count": len(data_sources)}
    )

    logger.info(f"Agent {agent_id}: OBSERVE phase completed")
    return observation

async def plan(agent_id: str, observation: ObservationData) -> Plan:
    """
    PLAN Phase: Create execution strategy based on observations
    """
    logger.info(f"Agent {agent_id}: PLAN phase started")

    # Analyze observation and create plan
    steps = [
        {
            "step_id": f"step_{i}",
            "action": f"Execute action {i} based on observation",
            "parameters": {"source": observation.data_sources[i % len(observation.data_sources)]}
        }
        for i in range(3)
    ]

    plan = Plan(
        steps=steps,
        estimated_duration=30.0,
        risk_level="low",
        contingencies=["Fallback to previous state", "Retry with different parameters"]
    )

    logger.info(f"Agent {agent_id}: PLAN phase completed with {len(steps)} steps")
    return plan

async def execute(agent_id: str, plan: Plan) -> list[ExecutionResult]:
    """
    EXECUTE Phase: Run the planned actions
    """
    logger.info(f"Agent {agent_id}: EXECUTE phase started")

    results = []
    for step in plan.steps:
        try:
            # Simulate execution
            await asyncio.sleep(0.2)

            result = ExecutionResult(
                step_id=step["step_id"],
                status="success",
                output={"result": f"Completed {step['action']}", "data": step["parameters"]},
                duration=0.2,
                errors=[]
            )
            results.append(result)
            logger.info(f"Agent {agent_id}: Step {step['step_id']} executed successfully")
        except Exception as e:
            logger.error(f"Agent {agent_id}: Step {step['step_id']} failed: {str(e)}")
            results.append(ExecutionResult(
                step_id=step["step_id"],
                status="failure",
                output={},
                duration=0.0,
                errors=[str(e)]
            ))

    logger.info(f"Agent {agent_id}: EXECUTE phase completed")
    return results

async def validate(agent_id: str, execution_results: list[ExecutionResult]) -> ValidationResult:
    """
    VALIDATE Phase: Verify execution results meet quality criteria
    """
    logger.info(f"Agent {agent_id}: VALIDATE phase started")

    successful_steps = sum(1 for r in execution_results if r.status == "success")
    total_steps = len(execution_results)
    confidence = successful_steps / total_steps if total_steps > 0 else 0.0

    issues = []
    if confidence < 0.8:
        issues.append("Low success rate in execution")

    validation = ValidationResult(
        is_valid=confidence >= 0.8,
        confidence_score=confidence,
        issues=issues,
        recommendations=["Increase data quality", "Refine execution parameters"] if issues else []
    )

    logger.info(f"Agent {agent_id}: VALIDATE phase completed (confidence: {confidence:.2%})")
    return validation

async def evolve(agent_id: str, validation: ValidationResult, iteration: int) -> EvolutionUpdate:
    """
    EVOLVE Phase: Learn and improve from results
    """
    logger.info(f"Agent {agent_id}: EVOLVE phase started (iteration {iteration})")

    improvements = []
    new_capabilities = []

    if not validation.is_valid:
        improvements.append("Adjust execution strategy based on validation feedback")
        improvements.append("Increase monitoring granularity")
    else:
        improvements.append("Maintain current execution strategy")
        if iteration > 2:
            new_capabilities.append("Advanced data correlation")
            new_capabilities.append("Predictive analysis")

    evolution = EvolutionUpdate(
        improvements=improvements,
        new_capabilities=new_capabilities,
        performance_metrics={
            "validation_confidence": validation.confidence_score,
            "iteration": iteration,
            "timestamp": datetime.now().isoformat()
        }
    )

    logger.info(f"Agent {agent_id}: EVOLVE phase completed")
    return evolution

async def run_opeve_cycle(agent_id: str, data_sources: list[str], max_iterations: int = 3) -> AgentState:
    """
    Run a complete OPEVE cycle for an agent
    """
    if agent_id not in agents:
        raise ValueError(f"Agent {agent_id} not found")

    agent_state = agents[agent_id]

    for iteration in range(1, max_iterations + 1):
        logger.info(f"Agent {agent_id}: Starting OPEVE cycle iteration {iteration}/{max_iterations}")

        try:
            # OBSERVE
            agent_state.current_phase = "observe"
            agent_state.observation = await observe(agent_id, data_sources)

            # PLAN
            agent_state.current_phase = "plan"
            agent_state.plan = await plan(agent_id, agent_state.observation)

            # EXECUTE
            agent_state.current_phase = "execute"
            agent_state.execution_results = await execute(agent_id, agent_state.plan)

            # VALIDATE
            agent_state.current_phase = "validate"
            agent_state.validation = await validate(agent_id, agent_state.execution_results)

            # EVOLVE
            agent_state.current_phase = "evolve"
            agent_state.evolution = await evolve(agent_id, agent_state.validation, iteration)

            agent_state.iteration = iteration
            agent_state.updated_at = datetime.now()

            # Check if we should continue
            if agent_state.validation.is_valid and iteration > 1:
                logger.info(f"Agent {agent_id}: Validation passed, stopping cycle")
                break

        except Exception as e:
            logger.error(f"Agent {agent_id}: OPEVE cycle failed at {agent_state.current_phase}: {str(e)}")
            agent_state.status = "failed"
            raise

    agent_state.status = "completed"
    agent_state.current_phase = "idle"
    logger.info(f"Agent {agent_id}: OPEVE cycle completed successfully")

    return agent_state

# ============================================================================
# API Endpoints
# ============================================================================

@router.post("/create_agent")
async def create_agent(config: AgentConfig) -> dict[str, Any]:
    """Create a new Manus Core agent"""
    agent_id = str(uuid.uuid4())

    agent_state = AgentState(
        agent_id=agent_id,
        agent_name=config.name,
        current_phase="idle",
        iteration=0,
        status="active",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        metadata={"role": config.role, "capabilities": config.capabilities}
    )

    agents[agent_id] = agent_state
    agent_configs[agent_id] = config

    logger.info(f"Created agent {agent_id}: {config.name}")

    return {
        "agent_id": agent_id,
        "agent_name": config.name,
        "status": "created",
        "message": f"Agent {config.name} created successfully"
    }

@router.post("/invoke")
async def invoke_agent(agent_id: str, data_sources: list[str]) -> dict[str, Any]:
    """Invoke an agent to run the OPEVE cycle"""
    if agent_id not in agents:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")

    if agent_id not in agent_configs:
        raise HTTPException(status_code=400, detail=f"Agent {agent_id} has no configuration")

    config = agent_configs[agent_id]

    try:
        agent_state = await run_opeve_cycle(agent_id, data_sources, config.max_iterations)

        return {
            "agent_id": agent_id,
            "status": agent_state.status,
            "iterations_completed": agent_state.iteration,
            "final_phase": agent_state.current_phase,
            "validation_confidence": agent_state.validation.confidence_score if agent_state.validation else None,
            "message": "OPEVE cycle completed successfully"
        }
    except Exception as e:
        logger.error(f"Failed to invoke agent {agent_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Agent invocation failed: {str(e)}")

@router.get("/status/{agent_id}")
async def get_agent_status(agent_id: str) -> dict[str, Any]:
    """Get the current status of an agent"""
    if agent_id not in agents:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")

    agent_state = agents[agent_id]

    return {
        "agent_id": agent_id,
        "agent_name": agent_state.agent_name,
        "status": agent_state.status,
        "current_phase": agent_state.current_phase,
        "iteration": agent_state.iteration,
        "created_at": agent_state.created_at.isoformat(),
        "updated_at": agent_state.updated_at.isoformat(),
        "validation_confidence": agent_state.validation.confidence_score if agent_state.validation else None,
        "execution_results_count": len(agent_state.execution_results),
        "metadata": agent_state.metadata
    }

@router.post("/config")
async def configure_agent(agent_id: str, config: AgentConfig) -> dict[str, Any]:
    """Configure or reconfigure an agent"""
    if agent_id not in agents:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")

    agent_configs[agent_id] = config
    agents[agent_id].metadata["role"] = config.role
    agents[agent_id].metadata["capabilities"] = config.capabilities
    agents[agent_id].updated_at = datetime.now()

    logger.info(f"Configured agent {agent_id}: {config.name}")

    return {
        "agent_id": agent_id,
        "status": "configured",
        "message": f"Agent {config.name} configured successfully"
    }

@router.get("/agents")
async def list_agents() -> dict[str, Any]:
    """list all agents and their statuses"""
    agent_list = []
    for agent_id, agent_state in agents.items():
        agent_list.append({
            "agent_id": agent_id,
            "agent_name": agent_state.agent_name,
            "status": agent_state.status,
            "current_phase": agent_state.current_phase,
            "iteration": agent_state.iteration
        })

    return {
        "total_agents": len(agent_list),
        "agents": agent_list
    }
