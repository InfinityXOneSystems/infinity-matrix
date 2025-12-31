# Lead Generation Pipeline

## Project Structure

```
infinity-matrix/
├── backend/                 # Backend application
│   ├── __init__.py
│   ├── main.py             # FastAPI application
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database configuration
│   ├── voice_agent.py      # AI voice integration
│   ├── enrichment.py       # Data enrichment service
│   └── websocket_manager.py # Real-time WebSocket manager
├── frontend/               # Frontend application
│   └── index.html          # Single-page application
├── tests/                  # Test suite
│   ├── __init__.py
│   └── test_basic.py       # Basic API tests
├── scripts/                # Utility scripts
│   ├── setup.sh            # Setup script (Linux/Mac)
│   ├── setup.bat           # Setup script (Windows)
│   └── start-dev.sh        # Development server launcher
├── docs/                   # Documentation
│   ├── API.md              # API documentation
│   └── ARCHITECTURE.md     # Architecture overview
├── database/               # Database files (created at runtime)
├── logs/                   # Log files (created at runtime)
├── config/                 # Configuration files
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
├── pytest.ini             # Pytest configuration
└── README.md              # Main documentation
```

## Quick Start

See [README.md](README.md) for detailed setup instructions.

### Basic Commands

```bash
# Setup
bash scripts/setup.sh

# Run backend
python -m backend.main

# Run tests
pytest tests/test_basic.py -v
```

## Key Features

- ✅ AI-powered voice agent
- ✅ Real-time WebSocket updates
- ✅ Automatic data enrichment
- ✅ Visual CRM pipeline
- ✅ Interactive calendar
- ✅ Lead scoring system
- ✅ Call recording & transcription
- ✅ Responsive UI (phone/tablet/desktop)
- ✅ Production-ready architecture

## Technology

- **Backend**: Python/FastAPI
- **Frontend**: JavaScript/HTML/CSS
- **Database**: SQLite/PostgreSQL
- **AI**: OpenAI GPT-4
- **Voice**: Twilio
- **Real-time**: WebSocket

## Documentation

- [README.md](README.md) - Main documentation
- [docs/API.md](docs/API.md) - API reference
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture

## Support

For questions or issues:
- GitHub Issues
- Email: support@infinityxonesystems.com
