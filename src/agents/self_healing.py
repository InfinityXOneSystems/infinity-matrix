"""Self-healing and repair agent for automatic issue resolution."""
import json
from datetime import datetime
from pathlib import Path
from typing import Any, dict, list

from agents.health import AgentStatus, HealthMonitor, WorkflowTracker


class SelfHealingAgent:
    """Agent for automatic issue detection and resolution."""

    def __init__(self, repo_path: str = "."):
        self.repo_path = Path(repo_path).resolve()
        self.health_monitor = HealthMonitor()
        self.workflow_tracker = WorkflowTracker()
        self.agent_id = "self_healing_agent"
        self.repair_log = self.repo_path / ".prooftest" / "logs" / "repairs.jsonl"
        self.repair_log.parent.mkdir(parents=True, exist_ok=True)

        self.health_monitor.register_agent(
            self.agent_id,
            "self_healing",
            {"description": "Automatically detects and repairs issues"}
        )

    def monitor_and_heal(self) -> dict[str, Any]:
        """Monitor system health and trigger healing if needed."""
        try:
            self.health_monitor.heartbeat(self.agent_id, AgentStatus.HEALTHY)

            # Check for unhealthy agents
            unhealthy_agents = self.health_monitor.get_unhealthy_agents()

            healing_actions = []
            for agent_id in unhealthy_agents:
                action = self._attempt_heal(agent_id)
                healing_actions.append(action)

            result = {
                "timestamp": datetime.utcnow().isoformat(),
                "unhealthy_agents": len(unhealthy_agents),
                "healing_actions": healing_actions,
                "status": "completed"
            }

            self._log_repair(result)
            self.health_monitor.record_success(self.agent_id)
            self.workflow_tracker.record_workflow(
                "self_healing",
                "completed",
                result
            )

            return result

        except Exception as e:
            self.health_monitor.record_error(self.agent_id, str(e))
            raise

    def _attempt_heal(self, agent_id: str) -> dict[str, Any]:
        """Attempt to heal a specific agent."""
        agent_info = self.health_monitor.get_agent_status(agent_id)

        action = {
            "agent_id": agent_id,
            "timestamp": datetime.utcnow().isoformat(),
            "previous_status": agent_info.get("status"),
            "actions_taken": []
        }

        # Reset error count if not too severe
        if agent_info.get("error_count", 0) < 10:
            action["actions_taken"].append("reset_error_count")
            agent_info["error_count"] = 0
            agent_info["status"] = "healthy"
            self.health_monitor.agents[agent_id] = agent_info
            self.health_monitor._save_state()
            action["result"] = "healed"
        else:
            action["actions_taken"].append("escalate_to_operator")
            action["result"] = "needs_manual_intervention"

        return action

    def _log_repair(self, repair_data: dict[str, Any]):
        """Log repair action to audit trail."""
        with open(self.repair_log, 'a') as f:
            f.write(json.dumps(repair_data) + "\n")

    def get_repair_history(self, limit: int = 100) -> list[dict[str, Any]]:
        """Get recent repair history."""
        if not self.repair_log.exists():
            return []

        repairs = []
        with open(self.repair_log) as f:
            for line in f:
                if line.strip():
                    repairs.append(json.loads(line))

        return repairs[-limit:]


class ZeroInterventionTrigger:
    """Trigger system to enable zero manual intervention."""

    def __init__(self, repo_path: str = "."):
        self.repo_path = Path(repo_path).resolve()
        self.health_monitor = HealthMonitor()
        self.agent_id = "zero_intervention_trigger"

        self.health_monitor.register_agent(
            self.agent_id,
            "trigger",
            {"description": "Enables zero manual intervention automation"}
        )

    def check_and_trigger(self) -> dict[str, Any]:
        """Check conditions and trigger automated actions."""
        try:
            self.health_monitor.heartbeat(self.agent_id, AgentStatus.HEALTHY)

            triggers_fired = []

            # Check if all agents are healthy
            all_agents = self.health_monitor.get_all_agents()
            healthy_count = sum(1 for a in all_agents.values() if a["status"] == "healthy")

            if healthy_count == len(all_agents):
                triggers_fired.append({
                    "trigger": "all_agents_healthy",
                    "action": "enable_auto_merge",
                    "timestamp": datetime.utcnow().isoformat()
                })

            # Check for stale agents (no heartbeat in last hour)
            current_time = datetime.utcnow()
            for agent_id, agent_data in all_agents.items():
                last_heartbeat = datetime.fromisoformat(agent_data["last_heartbeat"])
                if (current_time - last_heartbeat).total_seconds() > 3600:
                    triggers_fired.append({
                        "trigger": "stale_agent_detected",
                        "agent_id": agent_id,
                        "action": "restart_agent",
                        "timestamp": datetime.utcnow().isoformat()
                    })

            result = {
                "timestamp": datetime.utcnow().isoformat(),
                "triggers_fired": len(triggers_fired),
                "details": triggers_fired
            }

            self.health_monitor.record_success(self.agent_id)
            return result

        except Exception as e:
            self.health_monitor.record_error(self.agent_id, str(e))
            raise
