"""Pydantic schemas for API request/response models"""

from datetime import datetime
from typing import Any, dict

import phonenumbers
from pydantic import BaseModel, EmailStr, Field, field_validator


class LeadBase(BaseModel):
    """Base lead schema"""
    phone_number: str
    name: str | None = None
    email: EmailStr | None = None
    company: str | None = None

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


class LeadUpdate(BaseModel):
    """Schema for updating a lead"""
    name: str | None = None
    email: EmailStr | None = None
    company: str | None = None
    status: str | None = None
    callback_scheduled: datetime | None = None
    assigned_to: str | None = None
    priority: str | None = None


class LeadResponse(LeadBase):
    """Schema for lead response"""
    id: int
    status: str
    call_sid: str | None = None
    call_duration: int | None = None
    conversation_summary: str | None = None
    ai_sentiment: str | None = None
    ai_score: float | None = None
    enrichment_data: dict[str, Any] | None = None
    social_profiles: dict[str, Any] | None = None
    callback_scheduled: datetime | None = None
    assigned_to: str | None = None
    priority: str
    created_at: datetime
    updated_at: datetime | None = None

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
    duration: int | None = None
    started_at: datetime


class InteractionCreate(BaseModel):
    """Schema for creating an interaction"""
    lead_id: int
    interaction_type: str
    content: str
    duration: int | None = None
    outcome: str | None = None
    created_by: str | None = None


class InteractionResponse(BaseModel):
    """Schema for interaction response"""
    id: int
    lead_id: int
    interaction_type: str
    content: str
    duration: int | None = None
    outcome: str | None = None
    created_at: datetime
    created_by: str | None = None

    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    """Schema for creating a note"""
    lead_id: int
    content: str
    created_by: str | None = None


class NoteResponse(BaseModel):
    """Schema for note response"""
    id: int
    lead_id: int
    content: str
    created_at: datetime
    created_by: str | None = None

    class Config:
        from_attributes = True


class CalendarEventCreate(BaseModel):
    """Schema for creating a calendar event"""
    lead_id: int
    sales_rep_id: int
    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime
    event_type: str = "callback"


class CalendarEventUpdate(BaseModel):
    """Schema for updating a calendar event"""
    title: str | None = None
    description: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    status: str | None = None
    position_x: float | None = None
    position_y: float | None = None


class CalendarEventResponse(BaseModel):
    """Schema for calendar event response"""
    id: int
    lead_id: int
    sales_rep_id: int
    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime
    event_type: str
    status: str
    position_x: float | None = None
    position_y: float | None = None
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class WebSocketMessage(BaseModel):
    """WebSocket message schema"""
    type: str  # lead_created, call_started, call_updated, data_enriched, calendar_updated
    data: dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class EnrichmentResult(BaseModel):
    """Data enrichment result"""
    lead_id: int
    enrichment_data: dict[str, Any]
    social_profiles: dict[str, Any]
    company_info: dict[str, Any]
    success: bool
    error: str | None = None
