"""
Database Models
"""
import enum

from app.core.database import Base
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class DiscoveryStatus(str, enum.Enum):
    """Discovery status enumeration"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class Discovery(Base):
    """Discovery session model"""
    __tablename__ = "discoveries"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(255), nullable=False, index=True)
    business_name = Column(String(255), nullable=False, index=True)
    status = Column(Enum(DiscoveryStatus), default=DiscoveryStatus.PENDING, nullable=False)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Results
    discovery_data = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)

    # Relationships
    intelligence_reports = relationship("IntelligenceReport", back_populates="discovery", cascade="all, delete-orphan")
    proposals = relationship("Proposal", back_populates="discovery", cascade="all, delete-orphan")
    simulations = relationship("Simulation", back_populates="discovery", cascade="all, delete-orphan")


class IntelligenceReport(Base):
    """Intelligence report model"""
    __tablename__ = "intelligence_reports"

    id = Column(Integer, primary_key=True, index=True)
    discovery_id = Column(Integer, ForeignKey("discoveries.id"), nullable=False, index=True)

    # Report sections
    business_analysis = Column(JSON, nullable=True)
    competitive_analysis = Column(JSON, nullable=True)
    market_analysis = Column(JSON, nullable=True)
    gap_analysis = Column(JSON, nullable=True)
    opportunity_analysis = Column(JSON, nullable=True)
    financial_intelligence = Column(JSON, nullable=True)
    blind_spots = Column(JSON, nullable=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    confidence_score = Column(Float, nullable=True)

    # Relationships
    discovery = relationship("Discovery", back_populates="intelligence_reports")


class Proposal(Base):
    """AI-generated proposal model"""
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    discovery_id = Column(Integer, ForeignKey("discoveries.id"), nullable=False, index=True)

    proposal_type = Column(String(100), nullable=False)  # agent, system, app, rebrand, automation, etc.
    title = Column(String(500), nullable=False)

    # Proposal content
    executive_summary = Column(Text, nullable=True)
    problem_statement = Column(Text, nullable=True)
    solution_overview = Column(Text, nullable=True)
    technical_approach = Column(JSON, nullable=True)
    timeline = Column(JSON, nullable=True)
    pricing = Column(JSON, nullable=True)
    roi_projection = Column(JSON, nullable=True)

    # Strategic withholding (competitive advantage)
    withheld_details = Column(JSON, nullable=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    narrative_style = Column(String(100), default="excitement")

    # Relationships
    discovery = relationship("Discovery", back_populates="proposals")


class Simulation(Base):
    """Business simulation model"""
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    discovery_id = Column(Integer, ForeignKey("discoveries.id"), nullable=False, index=True)

    simulation_type = Column(String(100), nullable=False)  # investment, lead, ai_capability, business

    # Baseline (without hire)
    baseline_scenario = Column(JSON, nullable=True)

    # Three timeline scenarios
    optimistic_scenario = Column(JSON, nullable=True)
    realistic_scenario = Column(JSON, nullable=True)
    conservative_scenario = Column(JSON, nullable=True)

    # Before/after analysis
    current_state = Column(JSON, nullable=True)
    projected_state = Column(JSON, nullable=True)
    transformation_metrics = Column(JSON, nullable=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    confidence_score = Column(Float, nullable=True)

    # Relationships
    discovery = relationship("Discovery", back_populates="simulations")


class VisionCortexSession(Base):
    """Vision Cortex interactive session model"""
    __tablename__ = "vision_cortex_sessions"

    id = Column(Integer, primary_key=True, index=True)
    discovery_id = Column(Integer, ForeignKey("discoveries.id"), nullable=True, index=True)

    session_token = Column(String(255), unique=True, index=True, nullable=False)
    user_type = Column(String(50), nullable=False)  # operator, client

    # Session data
    conversation_history = Column(JSON, default=list)
    context_summary = Column(Text, nullable=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_activity = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    is_active = Column(Boolean, default=True)


class CrawledData(Base):
    """Crawled data storage"""
    __tablename__ = "crawled_data"

    id = Column(Integer, primary_key=True, index=True)
    discovery_id = Column(Integer, ForeignKey("discoveries.id"), nullable=False, index=True)

    source_url = Column(Text, nullable=False)
    source_type = Column(String(100), nullable=False)  # website, social, news, financial, etc.
    content = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)

    # Analysis results
    embeddings = Column(JSON, nullable=True)  # Vector embeddings for semantic search
    extracted_entities = Column(JSON, nullable=True)
    sentiment_score = Column(Float, nullable=True)

    # Metadata
    crawled_at = Column(DateTime(timezone=True), server_default=func.now())
    is_processed = Column(Boolean, default=False)
