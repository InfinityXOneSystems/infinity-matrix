
"""
CEO Agent
Strategic decision making and high-level planning
"""

from typing import Any, dict

from .autonomous_agent import AutonomousAgent


class CEOAgent(AutonomousAgent):
    """
    CEO-level strategic intelligence
    """

    def __init__(self):
        super().__init__(
            agent_id="ceo",
            capabilities=["strategic_planning", "decision_making", "resource_allocation"]
        )

    async def make_decision(self, context: dict[str, Any]) -> dict[str, Any]:
        """
        Make strategic decision
        """
        task = {
            "goal": "strategic_decision",
            "context": context,
            "method": "analyze_decide_plan"
        }
        return await self.process_task(task)
