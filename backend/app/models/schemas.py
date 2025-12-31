"""
Pydantic Schemas for API Request/Response
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


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
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    discovery_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    
    class Config:
        from_attributes = True


class IntelligenceReportResponse(BaseModel):
    """Intelligence report response"""
    id: int
    discovery_id: int
    business_analysis: Optional[Dict[str, Any]] = None
    competitive_analysis: Optional[Dict[str, Any]] = None
    market_analysis: Optional[Dict[str, Any]] = None
    gap_analysis: Optional[Dict[str, Any]] = None
    opportunity_analysis: Optional[Dict[str, Any]] = None
    financial_intelligence: Optional[Dict[str, Any]] = None
    blind_spots: Optional[Dict[str, Any]] = None
    confidence_score: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProposalResponse(BaseModel):
    """Proposal response"""
    id: int
    discovery_id: int
    proposal_type: str
    title: str
    executive_summary: Optional[str] = None
    problem_statement: Optional[str] = None
    solution_overview: Optional[str] = None
    technical_approach: Optional[Dict[str, Any]] = None
    timeline: Optional[Dict[str, Any]] = None
    pricing: Optional[Dict[str, Any]] = None
    roi_projection: Optional[Dict[str, Any]] = None
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
    key_milestones: List[str]
    risk_factors: List[str]
    success_probability: float


class SimulationResponse(BaseModel):
    """Simulation response"""
    id: int
    discovery_id: int
    simulation_type: str
    baseline_scenario: Optional[Dict[str, Any]] = None
    optimistic_scenario: Optional[Dict[str, Any]] = None
    realistic_scenario: Optional[Dict[str, Any]] = None
    conservative_scenario: Optional[Dict[str, Any]] = None
    current_state: Optional[Dict[str, Any]] = None
    projected_state: Optional[Dict[str, Any]] = None
    transformation_metrics: Optional[Dict[str, Any]] = None
    confidence_score: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class VisionCortexMessage(BaseModel):
    """Vision Cortex chat message"""
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str = Field(..., min_length=1)
    timestamp: Optional[datetime] = None


class VisionCortexChatRequest(BaseModel):
    """Vision Cortex chat request"""
    session_token: str
    message: str = Field(..., min_length=1)
    context_ids: Optional[List[int]] = None  # Related discovery/report IDs


class VisionCortexChatResponse(BaseModel):
    """Vision Cortex chat response"""
    response: str
    session_token: str
    conversation_history: List[VisionCortexMessage]
    related_insights: Optional[List[Dict[str, Any]]] = None


class ComprehensiveDiscoveryPack(BaseModel):
    """Complete discovery package"""
    discovery: DiscoveryResponse
    intelligence_report: Optional[IntelligenceReportResponse] = None
    proposals: List[ProposalResponse] = []
    simulations: List[SimulationResponse] = []
    
    # Summary sections
    executive_summary: str
    key_findings: List[str]
    opportunities: List[str]
    blind_spots: List[str]
    recommended_actions: List[str]
    
    # Narrative sections
    vision_statement: str
    transformation_story: str
    competitive_advantage: str


class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    version: str
