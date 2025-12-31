# Infinity Matrix

A comprehensive AI-powered system for orchestrating agents, managing memory, and processing information across multiple domains.

## System Architecture

The Infinity Matrix is a modular system consisting of:

### Core Components

1. **Vision Cortex** (`/cortex/vision_cortex.py`)
   - Main orchestrator for the entire system
   - Manages in-memory and persistent storage
   - Coordinates between agents, gateway, and registry
   - Document evolution engine with indexing and taxonomy
   - RAG (Retrieval-Augmented Generation) support

2. **Omni Router** (`/gateway/omni_router.py`)
   - Smart routing gateway with load balancing
   - Agent and API registration
   - RBAC-based policy enforcement
   - Credential and secret management
   - Pub/Sub event layer

3. **Agent Registry** (`/agent_registry.py`)
   - Central registry for all agents
   - Health monitoring and heartbeat tracking
   - Context, roles, and permissions management
   - Always-on communication with cortex

### Integrations

4. **Firestore Integration** (`/cortex/firestore_integration.py`)
   - Vector memory storage
   - Relational data management
   - Document ingestion
   - RAG query support

5. **Pub/Sub Integration** (`/cortex/pubsub_integration.py`)
   - Event-driven messaging
   - Topic-based subscriptions
   - Event propagation between components

### Agents

6. **Specialized Agents** (`/agents/`)
   - **Financial Agent**: Market analysis, portfolio management, risk assessment
   - **Real Estate Agent**: Property valuation, market analysis, investment analysis
   - **Loan Agent**: Application processing, credit assessment, rate calculation
   - **Analytics Agent**: Data analysis, report generation, trend detection
   - **NLP Agent**: Text processing, sentiment analysis, entity extraction

### API & Monitoring

7. **API Server** (`/api_server.py`)
   - REST API endpoints for system control
   - Agent status and health monitoring
   - Dashboard audit capabilities
   - Route management

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Install dependencies
pip install -r requirements.txt
```

### Running the System

```bash
# Start the entire system
python main.py
```

The system will:
1. Initialize Firestore and Pub/Sub infrastructure
2. Start Vision Cortex, Omni Router, and Agent Registry
3. Register and start all specialized agents
4. Load documentation from `/docs/` directory
5. Start the API server on http://localhost:8080

### API Endpoints

Once running, access these endpoints:

- `GET /api/status` - Overall system status
- `GET /api/agents` - List all registered agents
- `GET /api/agents/{agent_id}` - Get specific agent details
- `GET /api/agents/{agent_id}/health` - Agent health status
- `GET /api/routes` - List all configured routes
- `GET /api/dashboard` - Dashboard audit view

## Documentation

System documentation is automatically loaded on startup from the `/docs/` directory. The document evolution engine:
- Indexes all documentation
- Builds taxonomy by category
- Enables full-text search
- Supports RAG queries

## Security

The system implements comprehensive security:

- **RBAC**: Role-Based Access Control for all operations
- **Policy Enforcement**: Configurable security policies
- **Secret Management**: Secure credential storage
- **Authentication**: Required for sensitive operations
- **Rate Limiting**: Configurable per route

### Default Roles

- `admin`: Full system access
- `agent`: Agent operations (read/write/execute)
- `viewer`: Read-only access

## GitHub Workflow

The system includes automated deployment via GitHub Actions:

```yaml
.github/workflows/cortex_bootstrap.yml
```

This workflow:
- Validates system structure
- Syncs documentation
- Initializes all components
- Auto-ingests documents
- Generates system reports
- Runs on push, PR, schedule, or manual trigger

## Project Structure

```
infinity-matrix/
├── cortex/
│   ├── vision_cortex.py          # Main orchestrator
│   ├── firestore_integration.py  # Vector/relational memory
│   └── pubsub_integration.py     # Event propagation
├── gateway/
│   └── omni_router.py             # Smart routing gateway
├── agents/
│   ├── base_agent.py              # Abstract agent base
│   ├── financial_agent.py         # Financial operations
│   ├── real_estate_agent.py       # Real estate operations
│   ├── loan_agent.py              # Loan processing
│   ├── analytics_agent.py         # Data analytics
│   └── nlp_agent.py               # NLP processing
├── agent_registry.py              # Agent registry
├── api_server.py                  # REST API server
├── main.py                        # System launcher
├── requirements.txt               # Python dependencies
├── docs/                          # System documentation
└── .github/
    └── workflows/
        └── cortex_bootstrap.yml   # Deployment workflow
```

## Development

### Adding New Agents

1. Create a new agent class inheriting from `BaseAgent`
2. Implement required methods: `process_request()`, `on_start()`, `on_stop()`
3. Register agent in `main.py`
4. Configure routes in the Omni Router

### Extending Functionality

- Add new routes in `gateway/omni_router.py`
- Create custom policies for RBAC
- Extend document processing in `vision_cortex.py`
- Add new API endpoints in `api_server.py`

## Monitoring

Monitor system health through:
- API dashboard endpoint: `/api/dashboard`
- Agent health checks: `/api/agents/{agent_id}/health`
- System logs (INFO level by default)
- GitHub Actions workflow runs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Submit a pull request

## License

Copyright © 2024 InfinityXOne Systems. All rights reserved.

## Support

For issues and questions:
- GitHub Issues: https://github.com/InfinityXOneSystems/infinity-matrix/issues
- Documentation: https://github.com/InfinityXOneSystems/infinity-matrix/tree/main/docs
