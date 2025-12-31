# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Web UI     │  │   Tablet     │  │    Phone     │     │
│  │  (Browser)   │  │   Interface  │  │   Interface  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    WebSocket + REST API                      │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                     Backend Layer                            │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────────┐ │
│  │              FastAPI Application Server                 │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   REST API   │  │  WebSocket   │  │    TwiML     │ │ │
│  │  │   Endpoints  │  │    Manager   │  │   Handlers   │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            │                                 │
│  ┌────────────────────────┼─────────────────────────────┐   │
│  │         Service Layer  │                              │   │
│  │  ┌─────────────────────▼────────┐  ┌──────────────┐  │   │
│  │  │    AI Voice Agent Service    │  │ Enrichment   │  │   │
│  │  │   (OpenAI + Twilio)          │  │   Service    │  │   │
│  │  └──────────────────────────────┘  └──────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                    Data Layer                                │
│  ┌─────────────────────────▼──────────────────────────────┐ │
│  │              SQLAlchemy ORM                              │ │
│  └──────────────────────────┬───────────────────────────────┘ │
│                             │                                 │
│  ┌──────────────────────────▼───────────────────────────┐   │
│  │          SQLite / PostgreSQL Database                 │   │
│  │                                                        │   │
│  │  ┌───────┐ ┌────────────┐ ┌──────────┐ ┌──────────┐ │   │
│  │  │ Leads │ │ Call       │ │ Calendar │ │  Sales   │ │   │
│  │  │       │ │ Sessions   │ │ Events   │ │  Reps    │ │   │
│  │  └───────┘ └────────────┘ └──────────┘ └──────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│              External Services                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Twilio      │  │   OpenAI     │  │  Web Scraping│      │
│  │  Voice API   │  │   GPT-4      │  │  Services    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Layer

#### Web UI
- **Technology**: Vanilla JavaScript, HTML5, CSS3
- **Features**:
  - Real-time WebSocket connection
  - Interactive lead management
  - Calendar visualization
  - CRM sheet view
  - Activity feed
  - Responsive design

#### Key Components:
1. **Connection Manager**: WebSocket handler with auto-reconnect
2. **Lead Manager**: CRUD operations for leads
3. **Activity Feed**: Real-time event display
4. **Calendar Widget**: Visual callback scheduling
5. **CRM Table**: Structured lead data view

### Backend Layer

#### FastAPI Application
- **Framework**: FastAPI 0.109+
- **Python**: 3.8+
- **Features**:
  - Async/await support
  - Auto-generated OpenAPI docs
  - WebSocket support
  - CORS middleware
  - Request validation (Pydantic)

#### Core Modules:

1. **main.py**: Application entry point and route definitions
2. **models.py**: Database models (SQLAlchemy)
3. **schemas.py**: Pydantic models for validation
4. **database.py**: Database connection and session management
5. **voice_agent.py**: AI voice integration
6. **enrichment.py**: Data enrichment pipeline
7. **websocket_manager.py**: Real-time communication

### Service Layer

#### AI Voice Agent
- **AI Model**: OpenAI GPT-4 Turbo
- **Voice Provider**: Twilio Voice API
- **Features**:
  - Natural conversation flow
  - Information extraction
  - Sentiment analysis
  - Lead scoring
  - Call recording

**Workflow**:
1. Initiate outbound call via Twilio
2. Generate greeting TwiML
3. Process speech input
4. Generate AI responses
5. Extract structured data
6. Summarize conversation
7. Score lead quality

#### Data Enrichment Service
- **Purpose**: Augment lead data with public information
- **Sources**:
  - Web scraping
  - Social media APIs
  - Company databases
  - Phone verification

**Enrichment Pipeline**:
1. Receive lead data
2. Validate phone number
3. Search social profiles
4. Scrape company info
5. Aggregate results
6. Store enriched data
7. Broadcast update

### Data Layer

#### Database Models

1. **Lead**: Core lead information
2. **Interaction**: Communication history
3. **Note**: Annotations and notes
4. **CallSession**: Active call tracking
5. **CalendarEvent**: Scheduled callbacks
6. **SalesRepresentative**: Team members

#### Relationships:
- Lead → Interactions (one-to-many)
- Lead → Notes (one-to-many)
- Lead → CalendarEvents (one-to-many)
- SalesRepresentative → CalendarEvents (one-to-many)

### External Services

#### Twilio Voice API
- Outbound calling
- TwiML webhooks
- Call recording
- Status callbacks

#### OpenAI API
- GPT-4 conversation
- Information extraction
- Sentiment analysis
- Summary generation

#### Web Scraping
- BeautifulSoup for HTML parsing
- Selenium for dynamic content
- Playwright for modern sites

## Data Flow

### Lead Creation Flow
```
User Input → POST /api/leads → Create Lead → Broadcast WebSocket
    ↓
Background Task → Enrich Data → Update Lead → Broadcast Update
```

### Voice Call Flow
```
POST /api/voice/initiate-call → Twilio API → Call Initiated
    ↓
Twilio Webhook → /api/voice/twiml → Return Greeting
    ↓
User Speaks → /api/voice/process → AI Processing → Generate Response
    ↓
Extract Info → Update Lead → Broadcast Update
    ↓
Call Ends → Status Webhook → Generate Summary → Update Lead
```

### Real-Time Update Flow
```
Backend Event → WebSocket Manager → Broadcast → All Connected Clients
    ↓
Frontend Receives → Update UI → Trigger Animation
```

## Security Considerations

### API Security
- Environment variables for secrets
- CORS configuration
- Input validation (Pydantic)
- SQL injection prevention (SQLAlchemy ORM)
- Rate limiting (production)

### Data Privacy
- Secure storage of phone numbers
- Call recording consent
- GDPR compliance ready
- Data retention policies

### Production Recommendations
1. HTTPS/WSS only
2. JWT authentication
3. Role-based access control
4. API key rotation
5. Audit logging
6. Encryption at rest

## Scalability

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- Redis for WebSocket pub/sub
- Celery for background tasks
- Load balancer ready

### Performance Optimization
- Database indexing
- Query optimization
- Caching (Redis)
- Async operations
- Connection reuse

### Monitoring
- Health check endpoint
- Logging (structured)
- Error tracking (Sentry)
- Performance metrics
- WebSocket connection tracking

## Deployment

### Development
- SQLite database
- Local file storage
- Debug mode enabled
- Auto-reload

### Staging
- PostgreSQL database
- Cloud storage
- Error tracking
- Performance monitoring

### Production
- Managed database (RDS/Cloud SQL)
- CDN for static assets
- Auto-scaling
- Backup automation
- High availability

## Technology Stack Summary

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **Database**: SQLAlchemy ORM (SQLite/PostgreSQL)
- **Async**: asyncio, aiohttp
- **Validation**: Pydantic

### Frontend
- **Core**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with animations
- **Communication**: WebSocket, Fetch API
- **UI**: Responsive, device-ready

### Infrastructure
- **Web Server**: Uvicorn
- **Reverse Proxy**: Nginx (production)
- **Process Manager**: systemd/supervisord
- **Container**: Docker (optional)

### External Services
- **AI**: OpenAI GPT-4
- **Voice**: Twilio
- **Storage**: Local/S3
- **Cache**: Redis (optional)
- **Queue**: Celery (optional)

## Development Workflow

1. **Local Development**
   - Install dependencies
   - Configure environment
   - Run backend server
   - Open frontend in browser

2. **Testing**
   - Unit tests (pytest)
   - Integration tests
   - E2E tests (Playwright)
   - Load testing

3. **Deployment**
   - Build artifacts
   - Run migrations
   - Deploy backend
   - Serve frontend
   - Configure webhooks

4. **Monitoring**
   - Check health endpoint
   - Monitor logs
   - Track metrics
   - Alert on errors
