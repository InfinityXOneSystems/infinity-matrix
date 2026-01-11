"""Database models for the Lead Generation Pipeline"""

from sqlalchemy import JSON, Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()


class Lead(Base):
    """Lead model representing a potential customer"""
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100))
    email = Column(String(100))
    company = Column(String(200))
    status = Column(String(50), default="new")  # new, contacted, qualified, converted

    # Call information
    call_sid = Column(String(100))
    call_duration = Column(Integer)  # in seconds
    call_recording_url = Column(String(500))

    # AI conversation data
    conversation_transcript = Column(Text)
    conversation_summary = Column(Text)
    ai_sentiment = Column(String(50))
    ai_score = Column(Float)  # 0-100 lead quality score

    # Enrichment data
    enrichment_data = Column(JSON)
    social_profiles = Column(JSON)
    company_info = Column(JSON)

    # Calendar & CRM
    callback_scheduled = Column(DateTime)
    assigned_to = Column(String(100))
    priority = Column(String(20), default="medium")  # low, medium, high

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    interactions = relationship("Interaction", back_populates="lead", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="lead", cascade="all, delete-orphan")


class Interaction(Base):
    """Interaction history with leads"""
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)

    interaction_type = Column(String(50))  # call, email, meeting, note
    content = Column(Text)
    duration = Column(Integer)
    outcome = Column(String(100))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(String(100))

    # Relationships
    lead = relationship("Lead", back_populates="interactions")


class Note(Base):
    """Notes and annotations for leads"""
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)

    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(String(100))

    # Relationships
    lead = relationship("Lead", back_populates="notes")


class CallSession(Base):
    """Active call sessions"""
    __tablename__ = "call_sessions"

    id = Column(Integer, primary_key=True, index=True)
    call_sid = Column(String(100), unique=True, index=True)
    phone_number = Column(String(20), nullable=False)

    status = Column(String(50))  # initiated, ringing, in-progress, completed, failed
    direction = Column(String(20))  # inbound, outbound

    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True))
    duration = Column(Integer)

    # AI conversation state
    conversation_state = Column(JSON)
    collected_info = Column(JSON)


class SalesRepresentative(Base):
    """Sales representatives managing leads"""
    __tablename__ = "sales_representatives"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))

    # Calendar settings
    calendar_id = Column(String(100))
    availability = Column(JSON)

    # Performance metrics
    leads_assigned = Column(Integer, default=0)
    leads_converted = Column(Integer, default=0)

    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CalendarEvent(Base):
    """Calendar events for callbacks and meetings"""
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    sales_rep_id = Column(Integer, ForeignKey("sales_representatives.id"))

    title = Column(String(200), nullable=False)
    description = Column(Text)

    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)

    event_type = Column(String(50))  # callback, meeting, follow-up
    status = Column(String(50), default="scheduled")  # scheduled, completed, cancelled

    # Visual positioning for UI
    position_x = Column(Float)
    position_y = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
