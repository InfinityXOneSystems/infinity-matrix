"""Pydantic schemas for API request/response models"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr, field_validator
import phonenumbers


class LeadBase(BaseModel):
    """Base lead schema"""
    phone_number: str
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None

    @field_validator('phone_number')
    def validate_phone(cls, v):
        try:
            parsed = phonenumbers.parse(v, "US")
            if not phonenumbers.is_valid_number(parsed):
                raise ValueError("Invalid phone number")
            return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
        except Exception as e:
            raise ValueError(f"Invalid phone number format: {str(e)}")


class LeadCreate(LeadBase):
    """Schema for creating a new lead"""
    pass


class LeadUpdate(BaseModel):
    """Schema for updating a lead"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    status: Optional[str] = None
    callback_scheduled: Optional[datetime] = None
    assigned_to: Optional[str] = None
    priority: Optional[str] = None


class LeadResponse(LeadBase):
    """Schema for lead response"""
    id: int
    status: str
    call_sid: Optional[str] = None
    call_duration: Optional[int] = None
    conversation_summary: Optional[str] = None
    ai_sentiment: Optional[str] = None
    ai_score: Optional[float] = None
    enrichment_data: Optional[Dict[str, Any]] = None
    social_profiles: Optional[Dict[str, Any]] = None
    callback_scheduled: Optional[datetime] = None
    assigned_to: Optional[str] = None
    priority: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InitiateCallRequest(BaseModel):
    """Request to initiate a phone call"""
    phone_number: str

    @field_validator('phone_number')
    def validate_phone(cls, v):
        try:
            parsed = phonenumbers.parse(v, "US")
            if not phonenumbers.is_valid_number(parsed):
                raise ValueError("Invalid phone number")
            return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
        except Exception as e:
            raise ValueError(f"Invalid phone number format: {str(e)}")


class CallStatusResponse(BaseModel):
    """Call status response"""
    call_sid: str
    status: str
    phone_number: str
    duration: Optional[int] = None
    started_at: datetime


class InteractionCreate(BaseModel):
    """Schema for creating an interaction"""
    lead_id: int
    interaction_type: str
    content: str
    duration: Optional[int] = None
    outcome: Optional[str] = None
    created_by: Optional[str] = None


class InteractionResponse(BaseModel):
    """Schema for interaction response"""
    id: int
    lead_id: int
    interaction_type: str
    content: str
    duration: Optional[int] = None
    outcome: Optional[str] = None
    created_at: datetime
    created_by: Optional[str] = None

    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    """Schema for creating a note"""
    lead_id: int
    content: str
    created_by: Optional[str] = None


class NoteResponse(BaseModel):
    """Schema for note response"""
    id: int
    lead_id: int
    content: str
    created_at: datetime
    created_by: Optional[str] = None

    class Config:
        from_attributes = True


class CalendarEventCreate(BaseModel):
    """Schema for creating a calendar event"""
    lead_id: int
    sales_rep_id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    event_type: str = "callback"


class CalendarEventUpdate(BaseModel):
    """Schema for updating a calendar event"""
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None


class CalendarEventResponse(BaseModel):
    """Schema for calendar event response"""
    id: int
    lead_id: int
    sales_rep_id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    event_type: str
    status: str
    position_x: Optional[float] = None
    position_y: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class WebSocketMessage(BaseModel):
    """WebSocket message schema"""
    type: str  # lead_created, call_started, call_updated, data_enriched, calendar_updated
    data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class EnrichmentResult(BaseModel):
    """Data enrichment result"""
    lead_id: int
    enrichment_data: Dict[str, Any]
    social_profiles: Dict[str, Any]
    company_info: Dict[str, Any]
    success: bool
    error: Optional[str] = None
