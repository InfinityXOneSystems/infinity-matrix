# API Documentation

## Base URL
- Development: `http://localhost:8000`
- Production: `https://your-domain.com`

## Authentication
Currently, the API does not require authentication. For production, implement JWT or OAuth2.

## WebSocket Connection

### Connect to WebSocket
```javascript
const ws = new WebSocket('ws://localhost:8000/ws?client_id=demo-client');

ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received:', message);
};
```

### Message Types
All WebSocket messages follow this structure:
```json
{
  "type": "message_type",
  "data": {},
  "timestamp": "2025-12-31T12:00:00Z"
}
```

#### Message Types:
- `connection_established` - Initial connection confirmation
- `lead_created` - New lead added
- `call_started` - Voice call initiated
- `call_updated` - Call status or information updated
- `data_enriched` - Lead data enrichment completed
- `calendar_updated` - Calendar event modified
- `crm_updated` - CRM data changed

## REST API Endpoints

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-31T12:00:00Z",
  "connected_clients": 3
}
```

---

### Lead Management

#### POST /api/leads
Create a new lead.

**Request Body:**
```json
{
  "phone_number": "+15551234567",
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "phone_number": "+15551234567",
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "status": "new",
  "priority": "medium",
  "created_at": "2025-12-31T12:00:00Z"
}
```

#### GET /api/leads
List all leads with optional filtering.

**Query Parameters:**
- `skip` (int): Number of records to skip (default: 0)
- `limit` (int): Maximum records to return (default: 100)
- `status` (string): Filter by status (new, contacted, qualified, converted)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "phone_number": "+15551234567",
    "name": "John Doe",
    "status": "qualified",
    "ai_score": 85.5,
    "enrichment_data": {...},
    "created_at": "2025-12-31T12:00:00Z"
  }
]
```

#### GET /api/leads/{lead_id}
Get a specific lead by ID.

**Response:** `200 OK`

#### PATCH /api/leads/{lead_id}
Update a lead.

**Request Body:**
```json
{
  "status": "qualified",
  "priority": "high",
  "callback_scheduled": "2025-12-31T14:00:00Z"
}
```

**Response:** `200 OK`

#### DELETE /api/leads/{lead_id}
Delete a lead.

**Response:** `204 No Content`

---

### Voice & Call Management

#### POST /api/voice/initiate-call
Initiate an AI voice call to a lead.

**Request Body:**
```json
{
  "phone_number": "+15551234567"
}
```

**Response:** `200 OK`
```json
{
  "call_sid": "CA1234567890abcdef",
  "status": "initiated",
  "phone_number": "+15551234567",
  "started_at": "2025-12-31T12:00:00Z"
}
```

**Possible Errors:**
- `400 Bad Request` - Invalid phone number
- `500 Internal Server Error` - Twilio API error

#### POST /api/voice/twiml
Twilio webhook endpoint for call initiation. Returns TwiML.

#### POST /api/voice/process
Twilio webhook endpoint for processing voice input. Returns TwiML.

#### POST /api/voice/status
Twilio webhook endpoint for call status updates.

---

### Calendar Management

#### POST /api/calendar/events
Create a new calendar event.

**Request Body:**
```json
{
  "lead_id": 1,
  "sales_rep_id": 1,
  "title": "Follow-up Call",
  "description": "Discuss pricing and implementation",
  "start_time": "2025-12-31T14:00:00Z",
  "end_time": "2025-12-31T14:30:00Z",
  "event_type": "callback"
}
```

**Response:** `201 Created`

#### GET /api/calendar/events
List calendar events.

**Query Parameters:**
- `start_date` (datetime): Filter events after this date
- `end_date` (datetime): Filter events before this date

**Response:** `200 OK`

#### PATCH /api/calendar/events/{event_id}
Update a calendar event (including drag-drop position).

**Request Body:**
```json
{
  "start_time": "2025-12-31T15:00:00Z",
  "end_time": "2025-12-31T15:30:00Z",
  "position_x": 150.5,
  "position_y": 200.0
}
```

**Response:** `200 OK`

#### DELETE /api/calendar/events/{event_id}
Delete a calendar event.

**Response:** `204 No Content`

---

### Interactions & Notes

#### POST /api/interactions
Log an interaction with a lead.

**Request Body:**
```json
{
  "lead_id": 1,
  "interaction_type": "call",
  "content": "Discussed product features",
  "duration": 300,
  "outcome": "Interested",
  "created_by": "sales_rep_1"
}
```

**Response:** `201 Created`

#### GET /api/leads/{lead_id}/interactions
Get all interactions for a specific lead.

**Response:** `200 OK`

#### POST /api/notes
Add a note to a lead.

**Request Body:**
```json
{
  "lead_id": 1,
  "content": "Very interested in enterprise plan",
  "created_by": "sales_rep_1"
}
```

**Response:** `201 Created`

#### GET /api/leads/{lead_id}/notes
Get all notes for a specific lead.

**Response:** `200 OK`

---

### Sales Representatives

#### GET /api/sales-reps
List all active sales representatives.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@company.com",
    "leads_assigned": 15,
    "leads_converted": 8,
    "active": true
  }
]
```

---

## Error Responses

All error responses follow this structure:

```json
{
  "detail": "Error message description"
}
```

### HTTP Status Codes
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `204 No Content` - Successful deletion
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Currently not implemented. For production:
- Implement rate limiting per IP/user
- Recommended: 100 requests per minute per IP
- Use Redis for distributed rate limiting

---

## CORS

Configure allowed origins in `.env`:
```
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

---

## Data Models

### Lead
```typescript
interface Lead {
  id: number;
  phone_number: string;
  name?: string;
  email?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  call_sid?: string;
  call_duration?: number;
  conversation_summary?: string;
  ai_sentiment?: string;
  ai_score?: number;
  enrichment_data?: object;
  social_profiles?: object;
  company_info?: object;
  callback_scheduled?: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at?: string;
}
```

### CalendarEvent
```typescript
interface CalendarEvent {
  id: number;
  lead_id: number;
  sales_rep_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: 'callback' | 'meeting' | 'follow-up';
  status: 'scheduled' | 'completed' | 'cancelled';
  position_x?: number;
  position_y?: number;
  created_at: string;
  updated_at?: string;
}
```

---

## Example Usage

### Complete Lead Flow

```javascript
// 1. Create a lead and initiate call
const lead = await fetch('http://localhost:8000/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone_number: '+15551234567',
    name: 'John Doe',
    company: 'Acme Corp'
  })
}).then(r => r.json());

// 2. Initiate AI call
const call = await fetch('http://localhost:8000/api/voice/initiate-call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone_number: lead.phone_number
  })
}).then(r => r.json());

// 3. Listen for real-time updates
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'data_enriched') {
    console.log('Lead enriched:', message.data);
  }
};

// 4. Schedule callback
const event = await fetch('http://localhost:8000/api/calendar/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lead_id: lead.id,
    sales_rep_id: 1,
    title: 'Follow-up Call',
    start_time: '2025-12-31T14:00:00Z',
    end_time: '2025-12-31T14:30:00Z',
    event_type: 'callback'
  })
}).then(r => r.json());
```
