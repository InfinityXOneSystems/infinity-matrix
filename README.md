# Lead Generation Pipeline - Interactive Demo System

## Overview

A full-featured, production-ready lead generation pipeline with AI voice agent integration, real-time CRM updates, calendar management, and data enrichment capabilities. Built for demo presentations on phones, tablets, and laptops with engaging real-time animations and interactions.

## 🚀 Features

### Core Capabilities
- **AI Voice Agent**: OpenAI-powered conversational AI that calls leads and qualifies them
- **Real-Time Updates**: WebSocket-based live updates across all connected devices
- **Data Enrichment**: Automated web scraping and social profile discovery
- **CRM Integration**: Full customer relationship management with visual pipeline
- **Calendar System**: Drag-and-drop callback scheduling with visual placement
- **Interactive UI**: Engaging animations, smooth transitions, and device-ready design
- **Call Recording**: Automatic transcription and sentiment analysis
- **Lead Scoring**: AI-powered qualification scoring (0-100)

### Technology Stack
- **Backend**: FastAPI (Python 3.8+)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **AI**: OpenAI GPT-4 Turbo
- **Voice**: Twilio Voice API
- **Frontend**: Vanilla JavaScript, WebSocket, CSS3 animations
- **Data Enrichment**: BeautifulSoup, Selenium, Playwright

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 14+ (for optional frontend dev server)
- Twilio account with phone number
- OpenAI API key
- PostgreSQL (for production) or SQLite (for development)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
```

### 2. Set Up Python Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your credentials
# Required variables:
# - OPENAI_API_KEY
# - TWILIO_ACCOUNT_SID
# - TWILIO_AUTH_TOKEN
# - TWILIO_PHONE_NUMBER
```

### 4. Initialize Database

```bash
# The database will be automatically initialized on first run
python -m backend.main
```

## 🚀 Quick Start

### Running the Backend

```bash
# Development mode with auto-reload
python -m backend.main

# Or using uvicorn directly
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Documentation: http://localhost:8000/docs
- WebSocket: ws://localhost:8000/ws

### Running the Frontend

#### Option 1: Using Python HTTP Server
```bash
cd frontend
python -m http.server 3000
```

#### Option 2: Using Node.js http-server
```bash
cd frontend
npx http-server -p 3000
```

#### Option 3: Open directly in browser
```bash
open frontend/index.html
```

Access the demo at: http://localhost:3000

## 📱 Usage

### 1. Starting a Lead Call

1. Enter a phone number in the format: `+1 (555) 123-4567`
2. Click "Start Call"
3. Watch real-time updates as:
   - AI agent initiates the call
   - Conversation progresses
   - Lead information is collected
   - Data enrichment occurs
   - CRM is updated
   - Calendar event is scheduled

### 2. Monitoring Activity

The live activity feed shows:
- Call initiations
- AI conversation stages
- Data enrichment progress
- Calendar updates
- CRM changes

### 3. Managing Leads

- View all leads in the Active Leads panel
- See real-time status updates
- Monitor lead quality scores
- Track enrichment status

### 4. Calendar Management

- View scheduled callbacks
- Drag and drop events (visual representation)
- See callback assignments to sales reps

## 🔌 API Endpoints

### Lead Management
- `POST /api/leads` - Create a new lead
- `GET /api/leads` - List all leads
- `GET /api/leads/{id}` - Get specific lead
- `PATCH /api/leads/{id}` - Update lead
- `DELETE /api/leads/{id}` - Delete lead

### Voice & Calls
- `POST /api/voice/initiate-call` - Start AI voice call
- `POST /api/voice/twiml` - Twilio TwiML endpoint
- `POST /api/voice/process` - Process voice input
- `POST /api/voice/status` - Call status callback

### Calendar
- `POST /api/calendar/events` - Create calendar event
- `GET /api/calendar/events` - List events
- `PATCH /api/calendar/events/{id}` - Update event (drag-drop)
- `DELETE /api/calendar/events/{id}` - Delete event

### CRM
- `POST /api/interactions` - Log interaction
- `GET /api/leads/{id}/interactions` - Get lead interactions
- `POST /api/notes` - Add note
- `GET /api/leads/{id}/notes` - Get lead notes

## 🎨 Demo Features

### Visual Animations
- Smooth slide-in animations for new leads
- Pulse effects for live status indicators
- Hover effects on interactive elements
- Real-time activity feed updates

### Device Responsiveness
- Optimized for phones (portrait/landscape)
- Tablet-friendly interface
- Desktop full-screen experience
- Touch and mouse interactions

### Real-Time Updates
- WebSocket connection with auto-reconnect
- Live activity feed
- Dynamic statistics updates
- Instant CRM synchronization

## 🔒 Security Considerations

### Production Deployment
1. Change `SECRET_KEY` in `.env`
2. Use PostgreSQL instead of SQLite
3. Enable HTTPS/WSS
4. Set proper CORS origins
5. Implement authentication
6. Use environment-specific API keys
7. Enable rate limiting

### API Key Management
- Never commit `.env` file
- Rotate keys regularly
- Use separate keys for dev/prod
- Monitor API usage

## 🧪 Testing

### Manual Testing
```bash
# Test API endpoints
curl http://localhost:8000/health

# Test lead creation
curl -X POST http://localhost:8000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+15551234567"}'
```

### WebSocket Testing
Open browser console and run:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (e) => console.log('Received:', JSON.parse(e.data));
```

## 📊 Data Enrichment

The system automatically enriches lead data with:
- Phone verification and carrier info
- Geographic location
- Social media profiles (LinkedIn, Twitter)
- Company information
- Revenue estimates
- Employee count

### Mock Data for Demo
When `ENABLE_DATA_ENRICHMENT=true`, the system uses mock data for reliable demos.
For production, integrate real APIs:
- Clearbit
- FullContact
- Hunter.io
- LinkedIn API

## 🎯 AI Voice Agent

### Conversation Flow
1. Greeting and name collection
2. Company and role inquiry
3. Needs assessment
4. Interest level evaluation
5. Callback scheduling
6. Professional close

### Customization
Edit `backend/voice_agent.py` to modify:
- System prompt
- Conversation stages
- Information extraction
- Response generation
- Sentiment analysis

## 📈 Scalability

### Horizontal Scaling
- Stateless API design
- WebSocket with Redis Pub/Sub
- Celery for background tasks
- Load balancer compatible

### Database Optimization
- Indexed phone numbers
- Efficient queries
- Connection pooling
- Read replicas support

## 🛠️ Troubleshooting

### WebSocket Connection Issues
```bash
# Check if backend is running
curl http://localhost:8000/health

# Verify CORS settings in .env
ALLOWED_ORIGINS=http://localhost:3000
```

### Twilio Integration Issues
```bash
# Test Twilio credentials
python -c "from twilio.rest import Client; c = Client('SID', 'TOKEN'); print(c.api.accounts.list())"

# Check webhook URL is accessible
ngrok http 8000
```

### Database Issues
```bash
# Reset database
rm lead_generation.db
python -m backend.main
```

## 📝 License

This project is proprietary software owned by InfinityXOneSystems.

## 🤝 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: support@infinityxonesystems.com

## 🎓 Training & Documentation

See `/docs` directory for:
- Architecture diagrams
- API documentation
- Deployment guides
- Training materials
- Video tutorials

## 🚀 Deployment

### Heroku
```bash
# See docs/deployment/heroku.md
```

### AWS
```bash
# See docs/deployment/aws.md
```

### Docker
```bash
# See docs/deployment/docker.md
```

---

Built with ❤️ by InfinityXOneSystems
