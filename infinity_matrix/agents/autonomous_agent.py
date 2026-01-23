
"""
Autonomous Agent with Manus Intelligence
Self-aware agent that can plan, execute, and evolve
"""

from typing import Any, dict, list

from ..builder.diagnoser import Diagnoser
from ..builder.executor import Executor
from ..builder.planner import Planner
from ..builder.validator import Validator


class AutonomousAgent:
    """
    Self-aware agent with full Manus loop
    """

    def __init__(self, agent_id: str, capabilities: list[str]):
        self.agent_id = agent_id
        self.capabilities = capabilities
        self.planner = Planner()
        self.executor = Executor()
        self.validator = Validator()
        self.diagnoser = Diagnoser()
        self.state = "idle"

    async def process_task(self, task: dict[str, Any]) -> dict[str, Any]:
        """
        Process task using Manus intelligence loop
        """
        self.state = "planning"
        plan = await self.planner.create_plan(task)

        self.state = "executing"
        result = await self.executor.execute_plan(plan)

        self.state = "validating"
        is_valid = await self.validator.validate_result(result, plan)

        if not is_valid:
            self.state = "diagnosing"
            diagnosis = await self.diagnoser.diagnose_failure(result, plan)
            # Auto-fix if possible
            if diagnosis.get("auto_fixable"):
                fixed_plan = await self.planner.create_plan(task, context=diagnosis)
                result = await self.executor.execute_plan(fixed_plan)

        self.state = "idle"
        return result

    async def evolve(self, feedback: dict[str, Any]):
        """
        Learn from feedback and improve
        """
        # Update internal models based on feedback
