"""Main FastAPI application for Lead Generation Pipeline"""

import os
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import asyncio

from backend.database import init_db, get_db
from backend.models import Lead, Interaction, Note, CalendarEvent, CallSession, SalesRepresentative
from backend.schemas import (
    LeadCreate, LeadUpdate, LeadResponse,
    InitiateCallRequest, CallStatusResponse,
    InteractionCreate, InteractionResponse,
    NoteCreate, NoteResponse,
    CalendarEventCreate, CalendarEventUpdate, CalendarEventResponse,
    EnrichmentResult
)
from backend.voice_agent import voice_agent
from backend.enrichment import enrichment_service
from backend.websocket_manager import manager

load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Lead Generation Pipeline API",
    description="Full-featured lead generation system with AI voice agent, CRM, and calendar integration",
    version="1.0.0"
)

# CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins != [""] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("Database initialized successfully")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Lead Generation Pipeline API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "docs": "/docs",
            "websocket": "/ws",
            "leads": "/api/leads",
            "voice": "/api/voice"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "connected_clients": manager.get_connected_clients()
    }


# ==================== WebSocket Endpoint ====================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, client_id: str = None):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            # Echo back for heartbeat
            await manager.send_personal_message(
                {"type": "heartbeat", "timestamp": datetime.utcnow().isoformat()},
                websocket
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)


# ==================== Lead Endpoints ====================

@app.post("/api/leads", response_model=LeadResponse, status_code=201)
async def create_lead(
    lead: LeadCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new lead and initiate the pipeline"""
    
    # Check if lead already exists
    existing_lead = db.query(Lead).filter(Lead.phone_number == lead.phone_number).first()
    if existing_lead:
        raise HTTPException(status_code=400, detail="Lead with this phone number already exists")
    
    # Create new lead
    db_lead = Lead(
        phone_number=lead.phone_number,
        name=lead.name,
        email=lead.email,
        company=lead.company,
        status="new"
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    
    # Broadcast lead creation
    lead_data = LeadResponse.model_validate(db_lead)
    await manager.broadcast_lead_created(lead_data.model_dump())
    
    # Schedule data enrichment in background
    background_tasks.add_task(
        enrich_lead_background,
        db_lead.id,
        lead.phone_number,
        lead.name,
        lead.company,
        lead.email
    )
    
    return lead_data


@app.get("/api/leads", response_model=List[LeadResponse])
async def list_leads(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all leads with optional filtering"""
    query = db.query(Lead)
    
    if status:
        query = query.filter(Lead.status == status)
    
    leads = query.offset(skip).limit(limit).all()
    return [LeadResponse.model_validate(lead) for lead in leads]


@app.get("/api/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """Get a specific lead by ID"""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return LeadResponse.model_validate(lead)


@app.patch("/api/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: int,
    lead_update: LeadUpdate,
    db: Session = Depends(get_db)
):
    """Update a lead"""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Update fields
    update_data = lead_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lead, field, value)
    
    db.commit()
    db.refresh(lead)
    
    # Broadcast update
    await manager.broadcast_crm_updated({
        "lead_id": lead_id,
        "updates": update_data
    })
    
    return LeadResponse.model_validate(lead)


@app.delete("/api/leads/{lead_id}", status_code=204)
async def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    """Delete a lead"""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    db.delete(lead)
    db.commit()
    return Response(status_code=204)


# ==================== Voice/Call Endpoints ====================

@app.post("/api/voice/initiate-call", response_model=CallStatusResponse)
async def initiate_call(
    request: InitiateCallRequest,
    db: Session = Depends(get_db)
):
    """Initiate an AI voice call to a lead"""
    
    # Find or create lead
    lead = db.query(Lead).filter(Lead.phone_number == request.phone_number).first()
    if not lead:
        lead = Lead(phone_number=request.phone_number, status="new")
        db.add(lead)
        db.commit()
        db.refresh(lead)
    
    # Get callback URL for Twilio
    callback_url = f"{os.getenv('HOST', 'http://localhost:8000')}/api/voice/twiml"
    
    try:
        # Initiate call
        call_data = await voice_agent.initiate_call(request.phone_number, callback_url)
        
        # Create call session
        call_session = CallSession(
            call_sid=call_data["call_sid"],
            phone_number=request.phone_number,
            status="initiated",
            direction="outbound"
        )
        db.add(call_session)
        
        # Update lead
        lead.call_sid = call_data["call_sid"]
        lead.status = "contacted"
        db.commit()
        
        # Broadcast call started
        await manager.broadcast_call_started({
            "call_sid": call_data["call_sid"],
            "phone_number": request.phone_number,
            "lead_id": lead.id
        })
        
        return CallStatusResponse(**call_data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/voice/twiml")
async def voice_twiml(request: Request):
    """Generate TwiML for voice call"""
    # Initial greeting
    twiml = voice_agent.generate_greeting_twiml()
    return Response(content=twiml, media_type="application/xml")


@app.post("/api/voice/process")
async def process_voice(
    request: Request,
    db: Session = Depends(get_db)
):
    """Process voice input from Twilio"""
    form_data = await request.form()
    
    call_sid = form_data.get("CallSid")
    speech_result = form_data.get("SpeechResult", "")
    
    # Process speech with AI
    result = await voice_agent.process_speech(call_sid, speech_result)
    
    # Update call session with extracted info
    call_session = db.query(CallSession).filter(CallSession.call_sid == call_sid).first()
    if call_session:
        if not call_session.collected_info:
            call_session.collected_info = {}
        call_session.collected_info.update(result["extracted_info"])
        db.commit()
        
        # Update lead if exists
        lead = db.query(Lead).filter(Lead.call_sid == call_sid).first()
        if lead and result["extracted_info"]:
            if result["extracted_info"].get("name"):
                lead.name = result["extracted_info"]["name"]
            if result["extracted_info"].get("company"):
                lead.company = result["extracted_info"]["company"]
            if result["extracted_info"].get("email"):
                lead.email = result["extracted_info"]["email"]
            db.commit()
    
    # Broadcast call update
    await manager.broadcast_call_updated({
        "call_sid": call_sid,
        "extracted_info": result["extracted_info"],
        "is_complete": result["conversation_complete"]
    })
    
    # Generate response TwiML
    twiml = voice_agent.generate_response_twiml(
        result["response"],
        result["conversation_complete"]
    )
    
    return Response(content=twiml, media_type="application/xml")


@app.post("/api/voice/status")
async def voice_status_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """Handle Twilio status callbacks"""
    form_data = await request.form()
    
    call_sid = form_data.get("CallSid")
    call_status = form_data.get("CallStatus")
    call_duration = form_data.get("CallDuration", 0)
    
    # Update call session
    call_session = db.query(CallSession).filter(CallSession.call_sid == call_sid).first()
    if call_session:
        call_session.status = call_status
        if call_status in ["completed", "failed", "busy", "no-answer"]:
            call_session.ended_at = datetime.utcnow()
            call_session.duration = int(call_duration)
        db.commit()
        
        # Update lead
        lead = db.query(Lead).filter(Lead.call_sid == call_sid).first()
        if lead:
            lead.call_duration = int(call_duration)
            
            # If call completed, generate summary
            if call_status == "completed":
                summary = await voice_agent.generate_conversation_summary(call_sid)
                lead.conversation_summary = summary.get("summary")
                lead.ai_sentiment = summary.get("sentiment")
                lead.ai_score = summary.get("score")
                lead.status = "qualified"
                
                # Get recording URL
                recording_url = voice_agent.get_call_recording_url(call_sid)
                if recording_url:
                    lead.call_recording_url = recording_url
                
                # Cleanup conversation history
                voice_agent.cleanup_conversation(call_sid)
            
            db.commit()
    
    return {"status": "received"}


# ==================== Interaction Endpoints ====================

@app.post("/api/interactions", response_model=InteractionResponse, status_code=201)
async def create_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_db)
):
    """Create a new interaction"""
    db_interaction = Interaction(**interaction.model_dump())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return InteractionResponse.model_validate(db_interaction)


@app.get("/api/leads/{lead_id}/interactions", response_model=List[InteractionResponse])
async def get_lead_interactions(lead_id: int, db: Session = Depends(get_db)):
    """Get all interactions for a lead"""
    interactions = db.query(Interaction).filter(Interaction.lead_id == lead_id).all()
    return [InteractionResponse.model_validate(i) for i in interactions]


# ==================== Note Endpoints ====================

@app.post("/api/notes", response_model=NoteResponse, status_code=201)
async def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    """Create a new note"""
    db_note = Note(**note.model_dump())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return NoteResponse.model_validate(db_note)


@app.get("/api/leads/{lead_id}/notes", response_model=List[NoteResponse])
async def get_lead_notes(lead_id: int, db: Session = Depends(get_db)):
    """Get all notes for a lead"""
    notes = db.query(Note).filter(Note.lead_id == lead_id).all()
    return [NoteResponse.model_validate(n) for n in notes]


# ==================== Calendar Endpoints ====================

@app.post("/api/calendar/events", response_model=CalendarEventResponse, status_code=201)
async def create_calendar_event(
    event: CalendarEventCreate,
    db: Session = Depends(get_db)
):
    """Create a calendar event"""
    db_event = CalendarEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Broadcast calendar update
    await manager.broadcast_calendar_updated(
        CalendarEventResponse.model_validate(db_event).model_dump()
    )
    
    return CalendarEventResponse.model_validate(db_event)


@app.get("/api/calendar/events", response_model=List[CalendarEventResponse])
async def list_calendar_events(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """List calendar events"""
    query = db.query(CalendarEvent)
    
    if start_date:
        query = query.filter(CalendarEvent.start_time >= start_date)
    if end_date:
        query = query.filter(CalendarEvent.end_time <= end_date)
    
    events = query.all()
    return [CalendarEventResponse.model_validate(e) for e in events]


@app.patch("/api/calendar/events/{event_id}", response_model=CalendarEventResponse)
async def update_calendar_event(
    event_id: int,
    event_update: CalendarEventUpdate,
    db: Session = Depends(get_db)
):
    """Update a calendar event (including drag-drop position)"""
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    
    # Broadcast calendar update
    await manager.broadcast_calendar_updated(
        CalendarEventResponse.model_validate(event).model_dump()
    )
    
    return CalendarEventResponse.model_validate(event)


@app.delete("/api/calendar/events/{event_id}", status_code=204)
async def delete_calendar_event(event_id: int, db: Session = Depends(get_db)):
    """Delete a calendar event"""
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    return Response(status_code=204)


# ==================== Sales Representative Endpoints ====================

@app.get("/api/sales-reps")
async def list_sales_reps(db: Session = Depends(get_db)):
    """List all sales representatives"""
    reps = db.query(SalesRepresentative).filter(SalesRepresentative.active == True).all()
    return reps


# ==================== Data Enrichment ====================

async def enrich_lead_background(
    lead_id: int,
    phone_number: str,
    name: Optional[str],
    company: Optional[str],
    email: Optional[str]
):
    """Background task for lead data enrichment"""
    
    # Use mock data for demo purposes
    enrichment_result = await enrichment_service.enrich_with_mock_data(
        phone_number, name, company
    )
    
    # Update lead in database
    from backend.database import SessionLocal
    db = SessionLocal()
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if lead:
            lead.enrichment_data = enrichment_result["enrichment_data"]
            lead.social_profiles = enrichment_result["social_profiles"]
            lead.company_info = enrichment_result["company_info"]
            db.commit()
            
            # Broadcast enrichment completion
            await manager.broadcast_data_enriched({
                "lead_id": lead_id,
                "enrichment_data": enrichment_result["enrichment_data"],
                "social_profiles": enrichment_result["social_profiles"],
                "company_info": enrichment_result["company_info"]
            })
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "False").lower() == "true"
    )
