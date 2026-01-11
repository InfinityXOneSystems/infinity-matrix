"""Agent health monitoring and status tracking system."""
import json
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any, dict, list


class AgentStatus(Enum):
    """Agent operational status."""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    FAILED = "failed"
    UNKNOWN = "unknown"


class HealthMonitor:
    """Monitor and track agent health across the system."""

    def __init__(self, log_dir: str = ".prooftest/logs"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.health_file = self.log_dir / "agent_health.json"
        self.agents: dict[str, dict[str, Any]] = {}
        self._load_state()

    def _load_state(self):
        """Load existing agent state from disk."""
        if self.health_file.exists():
            with open(self.health_file) as f:
                self.agents = json.load(f)

    def _save_state(self):
        """Persist agent state to disk."""
        with open(self.health_file, 'w') as f:
            json.dump(self.agents, f, indent=2)

    def register_agent(self, agent_id: str, agent_type: str, metadata: dict[str, Any] = None):
        """Register a new agent in the monitoring system."""
        self.agents[agent_id] = {
            "type": agent_type,
            "status": AgentStatus.HEALTHY.value,
            "registered_at": datetime.utcnow().isoformat(),
            "last_heartbeat": datetime.utcnow().isoformat(),
            "error_count": 0,
            "success_count": 0,
            "metadata": metadata or {}
        }
        self._save_state()
        self._log_event(agent_id, "REGISTER", "Agent registered")

    def heartbeat(self, agent_id: str, status: AgentStatus = AgentStatus.HEALTHY):
        """Update agent heartbeat and status."""
        if agent_id not in self.agents:
            self.register_agent(agent_id, "unknown")

        self.agents[agent_id]["last_heartbeat"] = datetime.utcnow().isoformat()
        self.agents[agent_id]["status"] = status.value
        self._save_state()

    def record_success(self, agent_id: str):
        """Record a successful operation."""
        if agent_id in self.agents:
            self.agents[agent_id]["success_count"] += 1
            self.agents[agent_id]["status"] = AgentStatus.HEALTHY.value
            self._save_state()
            self._log_event(agent_id, "SUCCESS", "Operation completed successfully")

    def record_error(self, agent_id: str, error_msg: str):
        """Record an error event."""
        if agent_id in self.agents:
            self.agents[agent_id]["error_count"] += 1
            if self.agents[agent_id]["error_count"] > 3:
                self.agents[agent_id]["status"] = AgentStatus.FAILED.value
            else:
                self.agents[agent_id]["status"] = AgentStatus.DEGRADED.value
            self._save_state()
            self._log_event(agent_id, "ERROR", error_msg)

    def _log_event(self, agent_id: str, event_type: str, message: str):
        """Log an event to the audit trail."""
        event_log = self.log_dir / f"events_{datetime.utcnow().strftime('%Y%m%d')}.jsonl"
        event = {
            "timestamp": datetime.utcnow().isoformat(),
            "agent_id": agent_id,
            "event_type": event_type,
            "message": message
        }
        with open(event_log, 'a') as f:
            f.write(json.dumps(event) + "\n")

    def get_agent_status(self, agent_id: str) -> dict[str, Any]:
        """Get current status of an agent."""
        return self.agents.get(agent_id, {})

    def get_all_agents(self) -> dict[str, dict[str, Any]]:
        """Get status of all agents."""
        return self.agents

    def get_unhealthy_agents(self) -> list[str]:
        """Get list of agents that need attention."""
        unhealthy = []
        for agent_id, data in self.agents.items():
            if data["status"] in [AgentStatus.DEGRADED.value, AgentStatus.FAILED.value]:
                unhealthy.append(agent_id)
        return unhealthy


class WorkflowTracker:
    """Track workflow completions and metrics."""

    def __init__(self, log_dir: str = ".prooftest/logs"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.workflow_file = self.log_dir / "workflows.json"
        self.workflows: dict[str, list[dict[str, Any]]] = {}
        self._load_state()

    def _load_state(self):
        """Load workflow history from disk."""
        if self.workflow_file.exists():
            with open(self.workflow_file) as f:
                self.workflows = json.load(f)

    def _save_state(self):
        """Persist workflow history to disk."""
        with open(self.workflow_file, 'w') as f:
            json.dump(self.workflows, f, indent=2)

    def record_workflow(self, workflow_id: str, status: str, details: dict[str, Any]):
        """Record a workflow execution."""
        if workflow_id not in self.workflows:
            self.workflows[workflow_id] = []

        execution = {
            "timestamp": datetime.utcnow().isoformat(),
            "status": status,
            "details": details
        }
        self.workflows[workflow_id].append(execution)
        self._save_state()

    def get_workflow_history(self, workflow_id: str) -> list[dict[str, Any]]:
        """Get execution history for a workflow."""
        return self.workflows.get(workflow_id, [])

    def get_recent_workflows(self, limit: int = 10) -> list[dict[str, Any]]:
        """Get most recent workflow executions."""
        all_executions = []
        for workflow_id, executions in self.workflows.items():
            for execution in executions:
                all_executions.append({
                    "workflow_id": workflow_id,
                    **execution
                })

        all_executions.sort(key=lambda x: x["timestamp"], reverse=True)
        return all_executions[:limit]
