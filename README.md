# Infinity Matrix - Intelligence Discovery System

An enterprise-grade, fully automated business intelligence and discovery platform that transforms client information into comprehensive intelligence reports, proposals, and strategic insights.

## Overview

The Intelligence Discovery System accepts minimal input (client name and business name) and automatically:
- Discovers and analyzes public business, financial, and competitive intelligence
- Generates comprehensive discovery packs with key findings and opportunities
- Creates tailored AI-generated proposals, investor decks, and MVP blueprints
- Provides simulations and projections with multiple timeline scenarios
- Delivers an interactive UI for both operators and clients

## Architecture

- **Backend**: Python FastAPI with async support
- **Frontend**: React with TypeScript and Vision Cortex integration
- **Intelligence Engine**: Multi-agent LLM orchestration
- **Data Layer**: PostgreSQL + Vector DB for embeddings
- **Deployment**: Docker containerized, cloud-ready

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose

### Installation

```bash
# Clone repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Backend setup
cd backend
pip install -r requirements.txt
python -m pytest

# Frontend setup
cd ../frontend
npm install
npm test

# Run with Docker
docker-compose up
```

## Features

### Intelligence Discovery
- Automated data crawling and discovery
- Business analysis and profiling
- Competitive intelligence gathering
- Market consensus analysis
- Gap detection and opportunity identification

### AI-Powered Generation
- Discovery pack creation
- Custom proposal generation
- Investor deck building
- MVP blueprint design
- Pricing and offering recommendations

### Simulation & Analytics
- Investment impact modeling
- Lead generation projections
- AI capability assessment
- Multi-timeline scenarios
- Baseline comparison analysis

### Interactive Interface
- Vision Cortex integration
- Real-time chat and Q&A
- Knowledge summaries
- Operator and client dashboards
- Narrative presentation mode

## Project Structure

```
infinity-matrix/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── api/         # REST API endpoints
│   │   ├── core/        # Core business logic
│   │   ├── models/      # Data models
│   │   ├── services/    # Business services
│   │   └── intelligence/ # Intelligence engines
│   ├── tests/           # Backend tests
│   └── requirements.txt
├── frontend/            # React TypeScript frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API clients
│   │   ├── features/    # Feature modules
│   │   └── vision-cortex/ # Vision Cortex integration
│   └── package.json
├── shared/              # Shared types and schemas
├── docs/                # Documentation
├── docker-compose.yml
└── README.md
```

## API Documentation

API documentation is available at `http://localhost:8000/docs` when running the backend.

## Security

- API key authentication
- Rate limiting
- Input validation and sanitization
- Secure data storage
- Audit logging

## Development

```bash
# Run backend tests
cd backend
pytest --cov=app tests/

# Run frontend tests
cd frontend
npm test

# Lint code
cd backend && ruff check .
cd frontend && npm run lint
```

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment instructions.

## License

Proprietary - All Rights Reserved

## Support

For support, contact: support@infinityxone.systems
