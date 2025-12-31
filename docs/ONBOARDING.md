# Onboarding Guide - Infinity Matrix

Welcome to Infinity Matrix! This guide will help you get started with the FAANG-level production AI system.

## 📚 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [First Steps](#first-steps)
5. [System Architecture](#system-architecture)
6. [Key Concepts](#key-concepts)
7. [Development Workflow](#development-workflow)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

## Prerequisites

Before you begin, ensure you have:

- **Python 3.9+** installed
- **pip** package manager
- **Git** for version control
- **Redis** (optional, for production features)
- **PostgreSQL** (optional, for production database)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
# Install in development mode
pip install -e .

# For development with extra tools
pip install -e ".[dev]"
```

### 4. Set Up Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your preferred editor
nano .env  # or vim, code, etc.
```

## Configuration

### Environment Variables

Key configuration settings in `.env`:

```env
# Development vs Production
ENVIRONMENT=development
DEBUG=true

# API Server
API_HOST=0.0.0.0
API_PORT=8000

# Logging
LOG_LEVEL=INFO

# Security (CHANGE IN PRODUCTION!)
SECRET_KEY=your-secure-secret-key-here
```

### Important Configuration Notes

⚠️ **Security**: Always change `SECRET_KEY` in production!

⚠️ **Database**: The default uses SQLite for development. Configure PostgreSQL for production.

⚠️ **Redis**: Optional but recommended for production caching and task queues.

## First Steps

### 1. Verify Installation

```bash
# Check if everything is installed correctly
python -c "import infinity_matrix; print(infinity_matrix.__version__)"
```

### 2. Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=infinity_matrix
```

### 3. Start the System

```bash
# Start in development mode (with auto-reload)
python -m infinity_matrix.main --dev

# Or start in production mode
python -m infinity_matrix.main
```

### 4. Verify It's Running

Open your browser and navigate to:

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Metrics**: http://localhost:9090/metrics (if Prometheus is enabled)

## System Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Infinity Matrix                         │
├─────────────────────────────────────────────────────────────┤
│  API Layer (FastAPI)                                        │
│  ├── REST Endpoints                                         │
│  ├── Authentication & Rate Limiting                         │
│  └── Request/Response Validation                            │
├─────────────────────────────────────────────────────────────┤
│  Core Services                                              │
│  ├── Vision Cortex      │ Image/Video Processing           │
│  ├── Agent Registry     │ Agent Management                  │
│  ├── Auto-Builder       │ Build & Deploy Automation        │
│  └── Proof Logs         │ Audit & Verification             │
├─────────────────────────────────────────────────────────────┤
│  Working Agents                                             │
│  ├── Code Agent         │ Code Analysis                     │
│  ├── Doc Agent          │ Documentation                     │
│  ├── Test Agent         │ Test Generation                   │
│  └── Review Agent       │ Code Review                       │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure                                             │
│  ├── Logging (Structlog)                                    │
│  ├── Metrics (Prometheus)                                   │
│  ├── Tracing (OpenTelemetry)                               │
│  └── Configuration Management                               │
└─────────────────────────────────────────────────────────────┘
```

## Key Concepts

### 1. Agents

**Agents** are autonomous components that perform specific tasks:

- **CodeAgent**: Analyzes code for quality and issues
- **DocAgent**: Generates and manages documentation
- **TestAgent**: Creates and runs tests
- **ReviewAgent**: Performs comprehensive reviews

**Creating a Custom Agent:**

```python
from infinity_matrix.agents import BaseAgent

class MyCustomAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="my-agent",
            agent_type="custom",
            description="My custom agent"
        )
    
    async def _execute(self, task):
        # Your logic here
        return {"result": "success"}
    
    async def validate(self, task):
        return "action" in task
```

### 2. Vision Cortex

The **Vision Cortex** handles all visual processing:

- OCR (Optical Character Recognition)
- Object Detection
- Image Analysis
- Face Detection

**Example Usage:**

```python
from infinity_matrix.vision import VisionProcessor
from infinity_matrix.core.base import Task

processor = VisionProcessor()
await processor.initialize()

task = Task(
    type="vision",
    input={
        "task_type": "ocr",
        "image": image_data
    }
)

result = await processor.process(task)
```

### 3. Auto-Builder

The **Auto-Builder** automates build and deployment:

```python
from infinity_matrix.builder import BuildPipeline, BuildConfig

pipeline = BuildPipeline()
await pipeline.initialize()

config = BuildConfig(
    project_path="/path/to/project",
    build_command="python -m build",
    test_command="pytest"
)

result = await pipeline.execute_build(config)
```

### 4. Proof Logs

**Proof Logs** provide comprehensive audit trails:

```python
from infinity_matrix.logs import get_audit_logger
from infinity_matrix.logs.audit import AuditEventType

logger = get_audit_logger()
await logger.initialize()

await logger.log_event(
    event_type=AuditEventType.SYSTEM_EVENT,
    actor="user123",
    action="deployed_service",
    status="success"
)
```

## Development Workflow

### 1. Making Changes

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make your changes
# Edit files...

# Run tests
pytest tests/

# Run linting
ruff check .
black --check .

# Format code
black .
```

### 2. Testing Your Changes

```bash
# Run specific test file
pytest tests/unit/test_agents.py

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=infinity_matrix --cov-report=html
```

### 3. Submitting Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add feature: description"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

## Common Tasks

### Task 1: Register a New Agent

```python
from infinity_matrix.agents import get_registry
from my_module import MyCustomAgent

# Get registry
registry = get_registry()
await registry.initialize()

# Create and register agent
agent = MyCustomAgent()
await registry.register(agent)

# Verify registration
agents = registry.list_agents()
print(f"Registered agents: {len(agents)}")
```

### Task 2: Process an Image

```bash
# Using the API
curl -X POST http://localhost:8000/api/v1/vision/process \
  -H "Content-Type: application/json" \
  -d '{
    "task_type": "ocr",
    "image_data": "<base64-encoded-image>"
  }'
```

### Task 3: Execute Build

```bash
# Using the API
curl -X POST http://localhost:8000/api/v1/build \
  -H "Content-Type: application/json" \
  -d '{
    "project_path": "/path/to/project",
    "build_command": "python -m build",
    "test_command": "pytest"
  }'
```

### Task 4: Query Audit Logs

```bash
# Get recent events
curl http://localhost:8000/api/v1/audit/events?limit=10

# Filter by event type
curl http://localhost:8000/api/v1/audit/events?event_type=agent_execution
```

## Troubleshooting

### Common Issues

#### Issue 1: Import Errors

**Problem**: `ModuleNotFoundError: No module named 'infinity_matrix'`

**Solution**:
```bash
# Reinstall in development mode
pip install -e .
```

#### Issue 2: Port Already in Use

**Problem**: `Error: Port 8000 is already in use`

**Solution**:
```bash
# Use a different port
python -m infinity_matrix.main --port 8001

# Or find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9  # On Linux/Mac
```

#### Issue 3: Redis Connection Error

**Problem**: `ConnectionError: Error connecting to Redis`

**Solution**:
```bash
# Start Redis
redis-server

# Or disable Redis features in development
# Set in .env:
REDIS_URL=
```

#### Issue 4: Test Failures

**Problem**: Tests fail with dependency issues

**Solution**:
```bash
# Update dependencies
pip install -e ".[dev]"

# Clear pytest cache
pytest --cache-clear
```

### Getting Help

- 📖 **Documentation**: Check the [full documentation](https://github.com/InfinityXOneSystems/infinity-matrix/wiki)
- 💬 **Discord**: Join our [community](https://discord.gg/infinityxone)
- 🐛 **Issues**: Report bugs on [GitHub Issues](https://github.com/InfinityXOneSystems/infinity-matrix/issues)
- 📧 **Email**: Contact support@infinityxone.com

## Next Steps

### For Users

1. ✅ Complete the onboarding guide (you're here!)
2. 📖 Read the [API Documentation](http://localhost:8000/docs)
3. 🎯 Try the [example projects](./examples/)
4. 🔧 Explore the [configuration options](./docs/CONFIGURATION.md)

### For Developers

1. ✅ Set up development environment
2. 📚 Read [Contributing Guidelines](./docs/CONTRIBUTING.md)
3. 🏗️ Study the [Architecture Guide](./docs/ARCHITECTURE.md)
4. 🧪 Write tests for new features
5. 📝 Update documentation for changes

### For Production Deployment

1. 🔒 Review [Security Best Practices](./docs/SECURITY.md)
2. 🚀 Read [Deployment Guide](./docs/DEPLOYMENT.md)
3. 📊 Set up [Monitoring and Alerts](./docs/MONITORING.md)
4. 🔄 Configure [CI/CD Pipeline](./docs/CICD.md)

## Quick Reference

### Useful Commands

```bash
# Development
python -m infinity_matrix.main --dev          # Start with auto-reload
pytest --cov                                   # Run tests with coverage
black .                                        # Format code
ruff check .                                   # Lint code

# Production
python -m infinity_matrix.main                # Start production server
python -m infinity_matrix.main --workers 8    # Start with 8 workers

# Utilities
pip install -e ".[dev]"                       # Install dev dependencies
pytest -v -k test_agents                      # Run specific tests
```

### Important URLs

- **API Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health
- **Metrics**: http://localhost:9090/metrics

---

🎉 **Congratulations!** You're now ready to work with Infinity Matrix!

Need help? Check our [FAQ](./docs/FAQ.md) or reach out to the community.
