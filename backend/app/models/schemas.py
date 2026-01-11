"""
Pydantic Schemas for API Request/Response
"""
from datetime import datetime
from enum import Enum
from typing import Any, dict, list

from pydantic import BaseModel, Field, validator


class DiscoveryStatusEnum(str, Enum):
    """Discovery status"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class DiscoveryRequest(BaseModel):
    """Request to start a new discovery"""
    client_name: str = Field(..., min_length=1, max_length=255, description="Client name")
    business_name: str = Field(..., min_length=1, max_length=255, description="Business name")

    @validator('client_name', 'business_name')
    def validate_names(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty or whitespace')
        return v.strip()


class DiscoveryResponse(BaseModel):
    """Discovery response"""
    id: int
    client_name: str
    business_name: str
    status: DiscoveryStatusEnum
    created_at: datetime
    updated_at: datetime | None = None
    completed_at: datetime | None = None
    discovery_data: dict[str, Any] | None = None
    error_message: str | None = None

    class Config:
        from_attributes = True


class IntelligenceReportResponse(BaseModel):
    """Intelligence report response"""
    id: int
    discovery_id: int
    business_analysis: dict[str, Any] | None = None
    competitive_analysis: dict[str, Any] | None = None
    market_analysis: dict[str, Any] | None = None
    gap_analysis: dict[str, Any] | None = None
    opportunity_analysis: dict[str, Any] | None = None
    financial_intelligence: dict[str, Any] | None = None
    blind_spots: dict[str, Any] | None = None
    confidence_score: float | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class ProposalResponse(BaseModel):
    """Proposal response"""
    id: int
    discovery_id: int
    proposal_type: str
    title: str
    executive_summary: str | None = None
    problem_statement: str | None = None
    solution_overview: str | None = None
    technical_approach: dict[str, Any] | None = None
    timeline: dict[str, Any] | None = None
    pricing: dict[str, Any] | None = None
    roi_projection: dict[str, Any] | None = None
    narrative_style: str
    created_at: datetime

    class Config:
        from_attributes = True


class SimulationScenario(BaseModel):
    """Simulation scenario data"""
    revenue_projection: float
    cost_projection: float
    profit_margin: float
    market_share: float
    customer_acquisition: int
    timeline_months: int
    key_milestones: list[str]
    risk_factors: list[str]
    success_probability: float


class SimulationResponse(BaseModel):
    """Simulation response"""
    id: int
    discovery_id: int
    simulation_type: str
    baseline_scenario: dict[str, Any] | None = None
    optimistic_scenario: dict[str, Any] | None = None
    realistic_scenario: dict[str, Any] | None = None
    conservative_scenario: dict[str, Any] | None = None
    current_state: dict[str, Any] | None = None
    projected_state: dict[str, Any] | None = None
    transformation_metrics: dict[str, Any] | None = None
    confidence_score: float | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class VisionCortexMessage(BaseModel):
    """Vision Cortex chat message"""
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str = Field(..., min_length=1)
    timestamp: datetime | None = None


class VisionCortexChatRequest(BaseModel):
    """Vision Cortex chat request"""
    session_token: str
    message: str = Field(..., min_length=1)
    context_ids: list[int] | None = None  # Related discovery/report IDs


class VisionCortexChatResponse(BaseModel):
    """Vision Cortex chat response"""
    response: str
    session_token: str
    conversation_history: list[VisionCortexMessage]
    related_insights: list[dict[str, Any]] | None = None


class ComprehensiveDiscoveryPack(BaseModel):
    """Complete discovery package"""
    discovery: DiscoveryResponse
    intelligence_report: IntelligenceReportResponse | None = None
    proposals: list[ProposalResponse] = []
    simulations: list[SimulationResponse] = []

    # Summary sections
    executive_summary: str
    key_findings: list[str]
    opportunities: list[str]
    blind_spots: list[str]
    recommended_actions: list[str]

    # Narrative sections
    vision_statement: str
    transformation_story: str
    competitive_advantage: str


class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    version: str
