"""
Monitoring API endpoints for drift and cost analysis.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from infinity_matrix.monitoring import DriftDetector, CostAnalyzer
from infinity_matrix.monitoring.cost_analyzer import ResourceType

router = APIRouter()

# Global instances
drift_detector = DriftDetector()
cost_analyzer = CostAnalyzer()


class ModelRegistration(BaseModel):
    """Model registration request."""
    model_id: str
    model_name: str
    model_type: str
    baseline_metrics: Dict[str, float]


class DriftCheckRequest(BaseModel):
    """Drift check request."""
    model_id: str
    current_metrics: Dict[str, float]


class ResourceRegistration(BaseModel):
    """Resource registration request."""
    resource_id: str
    resource_type: str
    cost_per_hour: float
    metadata: Optional[Dict[str, Any]] = None


class UsageTrackingRequest(BaseModel):
    """Usage tracking request."""
    resource_id: str
    usage_hours: float


@router.post("/models/register")
async def register_model(request: ModelRegistration) -> Dict[str, Any]:
    """Register model for drift monitoring."""
    return drift_detector.register_model(
        model_id=request.model_id,
        model_name=request.model_name,
        model_type=request.model_type,
        baseline_metrics=request.baseline_metrics,
    )


@router.post("/drift/check")
async def check_drift(request: DriftCheckRequest) -> Dict[str, Any]:
    """Check for model drift."""
    result = await drift_detector.check_drift(
        model_id=request.model_id,
        current_metrics=request.current_metrics,
    )
    return result


@router.post("/drift/audit")
async def run_monthly_audit() -> Dict[str, Any]:
    """Run monthly drift audit."""
    result = await drift_detector.run_monthly_audit()
    return result


@router.get("/drift/history")
async def get_drift_history(
    model_id: Optional[str] = None,
    limit: int = 100,
) -> List[Dict[str, Any]]:
    """Get drift detection history."""
    return drift_detector.get_drift_history(model_id, limit)


@router.get("/drift/chart/{model_id}")
async def get_drift_chart(model_id: str, days: int = 30) -> Dict[str, Any]:
    """Get drift chart data."""
    return drift_detector.get_drift_chart_data(model_id, days)


@router.post("/costs/resources/register")
async def register_resource(request: ResourceRegistration) -> Dict[str, Any]:
    """Register resource for cost tracking."""
    try:
        resource_type = ResourceType(request.resource_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid resource type")
    
    return cost_analyzer.register_resource(
        resource_id=request.resource_id,
        resource_type=resource_type,
        cost_per_hour=request.cost_per_hour,
        metadata=request.metadata,
    )


@router.post("/costs/track")
async def track_usage(request: UsageTrackingRequest) -> Dict[str, Any]:
    """Track resource usage."""
    result = await cost_analyzer.track_usage(
        resource_id=request.resource_id,
        usage_hours=request.usage_hours,
    )
    return result


@router.get("/costs/realtime")
async def get_realtime_costs() -> Dict[str, Any]:
    """Get real-time cost analysis."""
    result = await cost_analyzer.get_realtime_costs()
    return result


@router.get("/costs/chart")
async def get_cost_chart(days: int = 30) -> Dict[str, Any]:
    """Get cost chart data."""
    return cost_analyzer.get_cost_chart_data(days)


@router.get("/costs/recommendations")
async def get_cost_recommendations() -> List[Dict[str, Any]]:
    """Get cost optimization recommendations."""
    return cost_analyzer.get_optimization_recommendations()
