"""
Real-time cost analyzer and auto-optimization system.
"""
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, dict, list

import structlog

logger = structlog.get_logger()


class ResourceType(str, Enum):
    """Types of resources to track."""
    AI_MODEL = "ai_model"
    COMPUTE = "compute"
    STORAGE = "storage"
    NETWORK = "network"
    DATABASE = "database"


class CostAlert(str, Enum):
    """Cost alert levels."""
    NORMAL = "normal"
    WARNING = "warning"
    CRITICAL = "critical"


class CostAnalyzer:
    """Real-time cost analyzer with auto-optimization."""

    def __init__(self):
        self.cost_history: list[dict[str, Any]] = []
        self.resources: dict[str, dict[str, Any]] = {}
        self.budget_limits = {
            "hourly": 100.0,
            "daily": 2000.0,
            "monthly": 50000.0,
        }
        self.throttling_enabled = False
        self.queuing_enabled = False

    def register_resource(
        self,
        resource_id: str,
        resource_type: ResourceType,
        cost_per_hour: float,
        metadata: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Register a resource for cost tracking."""
        resource_info = {
            "resource_id": resource_id,
            "resource_type": resource_type.value,
            "cost_per_hour": cost_per_hour,
            "metadata": metadata or {},
            "registered_at": datetime.now().isoformat(),
            "total_cost": 0.0,
            "usage_hours": 0.0,
        }

        self.resources[resource_id] = resource_info
        logger.info("Resource registered for cost tracking", resource_id=resource_id)

        return resource_info

    async def track_usage(
        self,
        resource_id: str,
        usage_hours: float,
    ) -> dict[str, Any]:
        """Track resource usage and calculate cost."""
        if resource_id not in self.resources:
            raise ValueError(f"Resource {resource_id} not registered")

        resource = self.resources[resource_id]
        cost = usage_hours * resource["cost_per_hour"]

        resource["usage_hours"] += usage_hours
        resource["total_cost"] += cost

        cost_entry = {
            "resource_id": resource_id,
            "timestamp": datetime.now().isoformat(),
            "usage_hours": usage_hours,
            "cost": cost,
            "total_cost": resource["total_cost"],
        }

        self.cost_history.append(cost_entry)

        return cost_entry

    async def get_realtime_costs(self) -> dict[str, Any]:
        """Get real-time cost analysis."""
        now = datetime.now()

        # Calculate costs for different periods
        hourly_cost = self._calculate_cost_for_period(hours=1)
        daily_cost = self._calculate_cost_for_period(hours=24)
        monthly_cost = self._calculate_cost_for_period(hours=24 * 30)

        # Check budget limits
        alert_level = CostAlert.NORMAL
        if hourly_cost > self.budget_limits["hourly"]:
            alert_level = CostAlert.CRITICAL
        elif hourly_cost > self.budget_limits["hourly"] * 0.8:
            alert_level = CostAlert.WARNING

        # Get cost breakdown by resource type
        breakdown = self._get_cost_breakdown()

        results = {
            "timestamp": now.isoformat(),
            "costs": {
                "current_hourly": hourly_cost,
                "current_daily": daily_cost,
                "projected_monthly": monthly_cost,
            },
            "budget_limits": self.budget_limits,
            "alert_level": alert_level.value,
            "breakdown": breakdown,
            "throttling_active": self.throttling_enabled,
            "queuing_active": self.queuing_enabled,
        }

        # Auto-optimization
        if alert_level == CostAlert.CRITICAL:
            optimization = await self._auto_optimize()
            results["optimization"] = optimization

        return results

    def _calculate_cost_for_period(self, hours: int) -> float:
        """Calculate total cost for a time period."""
        cutoff = datetime.now() - timedelta(hours=hours)

        period_costs = [
            entry["cost"]
            for entry in self.cost_history
            if datetime.fromisoformat(entry["timestamp"]) >= cutoff
        ]

        return sum(period_costs)

    def _get_cost_breakdown(self) -> dict[str, float]:
        """Get cost breakdown by resource type."""
        breakdown = {}

        for resource in self.resources.values():
            resource_type = resource["resource_type"]
            total_cost = resource["total_cost"]
            breakdown[resource_type] = breakdown.get(resource_type, 0.0) + total_cost

        return breakdown

    async def _auto_optimize(self) -> dict[str, Any]:
        """Execute auto-optimization procedures."""
        logger.warning("Cost threshold exceeded, activating auto-optimization")

        optimization_actions = []

        # Enable throttling
        if not self.throttling_enabled:
            self.throttling_enabled = True
            optimization_actions.append({
                "action": "enable_throttling",
                "description": "Rate limiting activated to reduce costs",
                "timestamp": datetime.now().isoformat(),
            })

        # Enable queuing
        if not self.queuing_enabled:
            self.queuing_enabled = True
            optimization_actions.append({
                "action": "enable_queuing",
                "description": "Request queuing activated to batch processing",
                "timestamp": datetime.now().isoformat(),
            })

        # Identify high-cost resources
        high_cost_resources = sorted(
            self.resources.values(),
            key=lambda x: x["total_cost"],
            reverse=True,
        )[:5]

        optimization_actions.append({
            "action": "identify_high_cost_resources",
            "resources": [
                {
                    "resource_id": r["resource_id"],
                    "total_cost": r["total_cost"],
                }
                for r in high_cost_resources
            ],
            "timestamp": datetime.now().isoformat(),
        })

        return {
            "timestamp": datetime.now().isoformat(),
            "status": "optimization_activated",
            "actions": optimization_actions,
        }

    def get_cost_chart_data(self, days: int = 30) -> dict[str, Any]:
        """Get cost data for charts."""
        cutoff = datetime.now() - timedelta(days=days)

        # Filter history for time period
        history = [
            entry for entry in self.cost_history
            if datetime.fromisoformat(entry["timestamp"]) >= cutoff
        ]

        # Group by day
        daily_costs: dict[str, float] = {}
        for entry in history:
            date = entry["timestamp"][:10]  # YYYY-MM-DD
            daily_costs[date] = daily_costs.get(date, 0.0) + entry["cost"]

        dates = sorted(daily_costs.keys())
        costs = [daily_costs[date] for date in dates]

        return {
            "period_days": days,
            "data_points": len(dates),
            "dates": dates,
            "costs": costs,
            "total_cost": sum(costs),
            "average_daily_cost": sum(costs) / len(costs) if costs else 0.0,
        }

    def get_optimization_recommendations(self) -> list[dict[str, Any]]:
        """Get cost optimization recommendations."""
        recommendations = []

        # Check for underutilized resources
        for resource in self.resources.values():
            if resource["usage_hours"] < 1.0 and resource["total_cost"] > 10.0:
                recommendations.append({
                    "type": "underutilized_resource",
                    "resource_id": resource["resource_id"],
                    "description": f"Resource has low usage ({resource['usage_hours']:.2f}h) but significant cost (${resource['total_cost']:.2f})",
                    "action": "Consider scaling down or removing this resource",
                    "potential_savings": resource["total_cost"] * 0.5,
                })

        # Check for batch processing opportunities
        if len(self.cost_history) > 100:
            recommendations.append({
                "type": "batch_processing",
                "description": "High frequency of small requests detected",
                "action": "Enable request batching to reduce overhead",
                "potential_savings": sum(e["cost"] for e in self.cost_history[-100:]) * 0.2,
            })

        return recommendations
