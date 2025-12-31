"""Core orchestrator logic for the Infinity Matrix.

The orchestrator is responsible for:
- Task distribution across agents
- Load balancing
- Agent lifecycle management
- State management
- Event bus coordination
"""

from typing import Any
from uuid import uuid4


class Agent:
    """Agent representation in the orchestrator."""

    def __init__(
        self,
        agent_id: str,
        agent_type: str,
        authority_level: int,
        capabilities: list[str],
    ):
        self.agent_id = agent_id
        self.agent_type = agent_type
        self.authority_level = authority_level
        self.capabilities = capabilities
        self.status = "idle"
        self.current_tasks: list[str] = []
        self.task_count = 0

    def can_handle(self, task_type: str) -> bool:
        """Check if agent can handle a specific task type."""
        return task_type in self.capabilities or "*" in self.capabilities

    def assign_task(self, task_id: str) -> None:
        """Assign a task to this agent."""
        self.current_tasks.append(task_id)
        self.status = "busy"
        self.task_count += 1

    def complete_task(self, task_id: str) -> None:
        """Mark a task as complete for this agent."""
        if task_id in self.current_tasks:
            self.current_tasks.remove(task_id)
        if not self.current_tasks:
            self.status = "idle"


class Task:
    """Task representation in the orchestrator."""

    def __init__(
        self,
        task_id: str,
        task_type: str,
        priority: str,
        payload: dict[str, Any],
        target_agent_id: str | None = None,
    ):
        self.task_id = task_id
        self.task_type = task_type
        self.priority = priority
        self.payload = payload
        self.target_agent_id = target_agent_id
        self.status = "pending"
        self.assigned_agent_id: str | None = None
        self.result: dict[str, Any] | None = None

    def get_priority_score(self) -> int:
        """Get numeric priority score for sorting."""
        priority_map = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        return priority_map.get(self.priority, 2)


class AgentManager:
    """Manages agent lifecycle and state."""

    def __init__(self):
        self.agents: dict[str, Agent] = {}

    def register_agent(
        self,
        agent_id: str,
        agent_type: str,
        authority_level: int,
        capabilities: list[str],
    ) -> Agent:
        """Register a new agent."""
        agent = Agent(agent_id, agent_type, authority_level, capabilities)
        self.agents[agent_id] = agent
        print(f"✅ Agent registered: {agent_id} (type: {agent_type})")
        return agent

    def deregister_agent(self, agent_id: str) -> None:
        """Deregister an agent."""
        if agent_id in self.agents:
            del self.agents[agent_id]
            print(f"🗑️  Agent deregistered: {agent_id}")

    def get_agent(self, agent_id: str) -> Agent | None:
        """Get an agent by ID."""
        return self.agents.get(agent_id)

    def get_available_agents(self, task_type: str) -> list[Agent]:
        """Get all agents that can handle a task type."""
        return [
            agent
            for agent in self.agents.values()
            if agent.can_handle(task_type) and agent.status == "idle"
        ]

    def get_best_agent(self, task_type: str) -> Agent | None:
        """Select the best agent for a task based on load balancing."""
        available = self.get_available_agents(task_type)
        if not available:
            return None

        # Simple load balancing: choose agent with least tasks
        return min(available, key=lambda a: a.task_count)


class TaskDistributor:
    """Handles task distribution and routing."""

    def __init__(self, agent_manager: AgentManager):
        self.agent_manager = agent_manager
        self.tasks: dict[str, Task] = {}
        self.task_queue: list[Task] = []

    def create_task(
        self,
        task_type: str,
        priority: str,
        payload: dict[str, Any],
        target_agent_id: str | None = None,
    ) -> Task:
        """Create a new task."""
        task_id = f"task_{uuid4().hex[:12]}"
        task = Task(task_id, task_type, priority, payload, target_agent_id)
        self.tasks[task_id] = task
        self.task_queue.append(task)
        self.task_queue.sort(key=lambda t: -t.get_priority_score())
        print(f"📋 Task created: {task_id} (type: {task_type}, priority: {priority})")
        return task

    def assign_task(self, task: Task) -> bool:
        """Assign a task to an appropriate agent."""
        # Check if specific agent is targeted
        if task.target_agent_id:
            agent = self.agent_manager.get_agent(task.target_agent_id)
            if agent and agent.can_handle(task.task_type):
                agent.assign_task(task.task_id)
                task.assigned_agent_id = agent.agent_id
                task.status = "assigned"
                print(f"✅ Task {task.task_id} assigned to {agent.agent_id}")
                return True
            else:
                print(
                    f"❌ Target agent {task.target_agent_id} "
                    "cannot handle task or not found"
                )
                return False

        # Find best available agent
        agent = self.agent_manager.get_best_agent(task.task_type)
        if agent:
            agent.assign_task(task.task_id)
            task.assigned_agent_id = agent.agent_id
            task.status = "assigned"
            print(f"✅ Task {task.task_id} assigned to {agent.agent_id}")
            return True

        print(f"⏳ No available agent for task {task.task_id}")
        return False

    def process_queue(self) -> int:
        """Process pending tasks in the queue."""
        assigned_count = 0
        for task in self.task_queue[:]:
            if task.status == "pending":
                if self.assign_task(task):
                    self.task_queue.remove(task)
                    assigned_count += 1
        return assigned_count

    def complete_task(self, task_id: str, result: dict[str, Any]) -> None:
        """Mark a task as complete."""
        task = self.tasks.get(task_id)
        if not task:
            print(f"❌ Task {task_id} not found")
            return

        task.status = "completed"
        task.result = result

        if task.assigned_agent_id:
            agent = self.agent_manager.get_agent(task.assigned_agent_id)
            if agent:
                agent.complete_task(task_id)

        print(f"✅ Task {task_id} completed")

    def fail_task(self, task_id: str, error: str) -> None:
        """Mark a task as failed."""
        task = self.tasks.get(task_id)
        if not task:
            print(f"❌ Task {task_id} not found")
            return

        task.status = "failed"
        task.result = {"error": error}

        if task.assigned_agent_id:
            agent = self.agent_manager.get_agent(task.assigned_agent_id)
            if agent:
                agent.complete_task(task_id)

        print(f"❌ Task {task_id} failed: {error}")


class Orchestrator:
    """Main orchestrator class that coordinates all agent activities."""

    def __init__(self):
        self.agent_manager = AgentManager()
        self.task_distributor = TaskDistributor(self.agent_manager)
        print("🚀 Infinity Matrix Orchestrator initialized")

    def register_agent(
        self,
        agent_id: str,
        agent_type: str,
        authority_level: int,
        capabilities: list[str],
    ) -> Agent:
        """Register a new agent with the orchestrator."""
        return self.agent_manager.register_agent(
            agent_id, agent_type, authority_level, capabilities
        )

    def deregister_agent(self, agent_id: str) -> None:
        """Deregister an agent from the orchestrator."""
        self.agent_manager.deregister_agent(agent_id)

    def submit_task(
        self,
        task_type: str,
        priority: str = "medium",
        payload: dict[str, Any] | None = None,
        target_agent_id: str | None = None,
    ) -> Task:
        """Submit a new task to the orchestrator."""
        task = self.task_distributor.create_task(
            task_type, priority, payload or {}, target_agent_id
        )
        self.task_distributor.assign_task(task)
        return task

    def get_task_status(self, task_id: str) -> dict[str, Any] | None:
        """Get the status of a task."""
        task = self.task_distributor.tasks.get(task_id)
        if not task:
            return None

        return {
            "task_id": task.task_id,
            "task_type": task.task_type,
            "status": task.status,
            "assigned_agent_id": task.assigned_agent_id,
            "result": task.result,
        }

    def complete_task(self, task_id: str, result: dict[str, Any]) -> None:
        """Mark a task as completed with result."""
        self.task_distributor.complete_task(task_id, result)

    def process_pending_tasks(self) -> int:
        """Process all pending tasks in the queue."""
        return self.task_distributor.process_queue()
