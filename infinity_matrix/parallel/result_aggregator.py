
"""
Result Aggregator
Collect and merge results from parallel instances
"""

from typing import Any, dict, list


class ResultAggregator:
    """
    Aggregate results from parallel execution
    """

    def __init__(self):
        self.results: dict[str, list[Any]] = {}

    async def collect(self, task_id: str, instance_id: str, result: Any):
        """
        Collect result from instance
        """
        if task_id not in self.results:
            self.results[task_id] = []
        self.results[task_id].append({
            "instance": instance_id,
            "result": result
        })

    async def aggregate(self, task_id: str) -> Any:
        """
        Aggregate all results for task
        """
        if task_id not in self.results:
            return None

        results = self.results[task_id]

        # Simple aggregation - merge all results
        aggregated = {
            "count": len(results),
            "results": [r["result"] for r in results]
        }

        return aggregated
