"""
Tests for Lead Generation Pipeline

To run tests:
    pytest tests/test_basic.py -v
"""

import pytest
from fastapi.testclient import TestClient

from backend.database import Base, engine
from backend.main import app

# Create test client
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    """Create test database before each test"""
    Base.metadata.create_all(bind=engine)
    yield
    # Teardown would go here if needed


def test_root_endpoint():
    """Test root endpoint returns expected response"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Lead Generation Pipeline API"
    assert data["version"] == "1.0.0"
    assert "endpoints" in data


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "connected_clients" in data


def test_create_lead():
    """Test creating a new lead"""
    lead_data = {
        "phone_number": "+15551234567",
        "name": "Test User",
        "email": "test@example.com",
        "company": "Test Corp"
    }

    response = client.post("/api/leads", json=lead_data)
    assert response.status_code == 201
    data = response.json()
    assert data["phone_number"] == lead_data["phone_number"]
    assert data["name"] == lead_data["name"]
    assert data["status"] == "new"
    assert data["priority"] == "medium"
    assert "id" in data


def test_list_leads():
    """Test listing leads"""
    # Create a lead first
    client.post("/api/leads", json={
        "phone_number": "+15551234568",
        "name": "Test User 2"
    })

    # list leads
    response = client.get("/api/leads")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_lead():
    """Test getting a specific lead"""
    # Create a lead
    create_response = client.post("/api/leads", json={
        "phone_number": "+15551234569",
        "name": "Test User 3"
    })
    lead_id = create_response.json()["id"]

    # Get the lead
    response = client.get(f"/api/leads/{lead_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == lead_id
    assert data["phone_number"] == "+15551234569"


def test_update_lead():
    """Test updating a lead"""
    # Create a lead
    create_response = client.post("/api/leads", json={
        "phone_number": "+15551234570",
        "name": "Test User 4"
    })
    lead_id = create_response.json()["id"]

    # Update the lead
    update_data = {
        "status": "qualified",
        "priority": "high"
    }
    response = client.patch(f"/api/leads/{lead_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "qualified"
    assert data["priority"] == "high"


def test_delete_lead():
    """Test deleting a lead"""
    # Create a lead
    create_response = client.post("/api/leads", json={
        "phone_number": "+15551234571",
        "name": "Test User 5"
    })
    lead_id = create_response.json()["id"]

    # Delete the lead
    response = client.delete(f"/api/leads/{lead_id}")
    assert response.status_code == 204

    # Verify it's deleted
    get_response = client.get(f"/api/leads/{lead_id}")
    assert get_response.status_code == 404


def test_invalid_phone_number():
    """Test that invalid phone numbers are rejected"""
    lead_data = {
        "phone_number": "invalid",
        "name": "Test User"
    }

    response = client.post("/api/leads", json=lead_data)
    assert response.status_code == 422  # Validation error


def test_duplicate_phone_number():
    """Test that duplicate phone numbers are rejected"""
    lead_data = {
        "phone_number": "+15551234572",
        "name": "Test User"
    }

    # Create first lead
    client.post("/api/leads", json=lead_data)

    # Try to create duplicate
    response = client.post("/api/leads", json=lead_data)
    assert response.status_code == 400


def test_create_calendar_event():
    """Test creating a calendar event"""
    # Create a lead first
    lead_response = client.post("/api/leads", json={
        "phone_number": "+15551234573",
        "name": "Test User 6"
    })
    lead_id = lead_response.json()["id"]

    # Create calendar event
    event_data = {
        "lead_id": lead_id,
        "sales_rep_id": 1,
        "title": "Follow-up Call",
        "start_time": "2025-12-31T14:00:00Z",
        "end_time": "2025-12-31T14:30:00Z",
        "event_type": "callback"
    }

    response = client.post("/api/calendar/events", json=event_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == event_data["title"]
    assert data["lead_id"] == lead_id


def test_list_calendar_events():
    """Test listing calendar events"""
    response = client.get("/api/calendar/events")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_create_interaction():
    """Test creating an interaction"""
    # Create a lead first
    lead_response = client.post("/api/leads", json={
        "phone_number": "+15551234574",
        "name": "Test User 7"
    })
    lead_id = lead_response.json()["id"]

    # Create interaction
    interaction_data = {
        "lead_id": lead_id,
        "interaction_type": "call",
        "content": "Test call interaction",
        "duration": 300
    }

    response = client.post("/api/interactions", json=interaction_data)
    assert response.status_code == 201
    data = response.json()
    assert data["lead_id"] == lead_id
    assert data["interaction_type"] == "call"


def test_create_note():
    """Test creating a note"""
    # Create a lead first
    lead_response = client.post("/api/leads", json={
        "phone_number": "+15551234575",
        "name": "Test User 8"
    })
    lead_id = lead_response.json()["id"]

    # Create note
    note_data = {
        "lead_id": lead_id,
        "content": "Test note content"
    }

    response = client.post("/api/notes", json=note_data)
    assert response.status_code == 201
    data = response.json()
    assert data["lead_id"] == lead_id
    assert data["content"] == note_data["content"]
