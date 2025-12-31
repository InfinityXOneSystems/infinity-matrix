# Quick Start Guide

Get the Infinity-Matrix Autonomous System up and running in minutes!

## Prerequisites

- Python 3.9+
- Git
- Docker (optional, but recommended)

## 5-Minute Setup

### 1. Clone and Setup

```bash
# Clone repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -e .
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings (optional for basic testing)
nano .env
```

### 3. Run System Audit

```bash
# Check system configuration
python scripts/setup/system_auditor.py
```

### 4. Start the System

Choose one of the following methods:

#### Method A: Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Method B: Direct Python

```bash
# Start Vision Cortex
python ai_stack/vision_cortex/vision_cortex.py
```

#### Method C: Using Makefile

```bash
# Run Vision Cortex
make run

# Or run API server
make api
```

## Access the System

Once running, access:

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Dashboard** (future): http://localhost:3000
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001

## Quick Commands

```bash
# Run tests
make test

# Format code
make format

# Lint code
make lint

# Clean artifacts
make clean

# View all commands
make help
```

## Example Usage

### Check System Status

```bash
curl http://localhost:8000/api/v1/system/status
```

### List Agents

```bash
curl http://localhost:8000/api/v1/agents
```

### Get Agent Details

```bash
curl http://localhost:8000/api/v1/agents/crawler
```

## Troubleshooting

### Issue: Import Errors

```bash
# Ensure package is installed
pip install -e .
```

### Issue: Port Already in Use

```bash
# Change port in .env
API_PORT=8001
```

### Issue: Permission Denied

```bash
# Fix permissions
chmod -R 755 data/
```

## Next Steps

1. **Read the Documentation**
   - [Architecture Blueprint](docs/blueprint.md)
   - [Configuration Guide](docs/configuration.md)
   - [Deployment Guide](docs/deployment.md)

2. **Configure Cloud Services**
   - Set up Google Cloud Platform
   - Configure AI service keys
   - Enable monitoring

3. **Customize Agents**
   - Review agent implementations in `ai_stack/agents/`
   - Add custom logic as needed
   - Create new agents

4. **Deploy to Production**
   - Follow [Deployment Guide](docs/deployment.md)
   - Set up CI/CD pipeline
   - Configure monitoring

## Getting Help

- **Documentation**: See `docs/` directory
- **Issues**: Open a GitHub issue
- **Email**: support@infinityxai.com

## Project Structure

```
infinity-matrix/
├── ai_stack/              # AI agents and Vision Cortex
│   ├── agents/           # Individual agent implementations
│   └── vision_cortex/    # Core orchestration system
├── gateway_stack/        # API and web interfaces
│   ├── api/             # FastAPI backend
│   └── web/             # Web dashboard
├── monitoring/          # Prometheus & Grafana configs
├── data/                # Logs and state data
├── scripts/             # Setup and deployment scripts
├── docs/                # Documentation
└── tests/               # Test suite
```

## Key Files

- `README.md` - Main project documentation
- `COLLABORATION.md` - Agent roles and collaboration
- `CONTRIBUTING.md` - How to contribute
- `requirements.txt` - Python dependencies
- `docker-compose.yml` - Docker services
- `Makefile` - Common commands
- `.env.example` - Configuration template

## Support

For questions or issues:
- Check documentation in `docs/`
- Search existing GitHub issues
- Create a new issue with details
- Email: support@infinityxai.com

---

Happy coding! 🚀
