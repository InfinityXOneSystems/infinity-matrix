# Quick Start Guide

Welcome to Infinity Matrix! This guide will get you up and running in under 15 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Docker** (version 20.10+) and **Docker Compose** (version 2.0+)
- **Git** (version 2.30+)
- **Python** 3.11+ (for local development)
- **Node.js** 18+ (for frontend development)
- At least **8GB RAM** and **20GB free disk space**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
```

### 2. Quick Start with Docker Compose

The fastest way to get started is using our pre-configured Docker Compose setup:

```bash
# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps
```

This will start:
- API Gateway (http://localhost:8000)
- Frontend (http://localhost:3000)
- PostgreSQL Database (localhost:5432)
- Redis Cache (localhost:6379)
- Monitoring Dashboard (http://localhost:9090)

### 3. Initialize the System

```bash
# Run database migrations
docker-compose exec api python -m alembic upgrade head

# Create initial admin user
docker-compose exec api python -m scripts.create_admin

# Load sample data (optional)
docker-compose exec api python -m scripts.load_sample_data
```

### 4. Access the Application

Open your browser and navigate to:

- **Main Application**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Admin Dashboard**: http://localhost:3000/admin
- **Monitoring**: http://localhost:9090

**Default Credentials**:
- Username: `admin@infinity-matrix.io`
- Password: `Admin123!` (change immediately!)

## First Steps

### 1. Change Default Password

Upon first login, you'll be prompted to change the default password. This is required for security.

### 2. Explore the Dashboard

The main dashboard provides an overview of:
- System status and health
- Active workflows
- Recent activities
- Key metrics

### 3. Create Your First Workflow

```bash
# Using the CLI
infinity-matrix workflow create --name "My First Workflow" --type basic

# Or use the Web UI
# Navigate to Workflows > Create New
```

### 4. Run a Demo Workflow

Try one of our pre-built demo workflows:

```bash
# List available demos
infinity-matrix demo list

# Run the "Hello World" demo
infinity-matrix demo run hello-world

# Check the results
infinity-matrix demo results hello-world
```

## Common Tasks

### Starting and Stopping Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart api

# View logs
docker-compose logs -f api
```

### Accessing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api

# Recent logs
docker-compose logs --tail=100 api
```

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U infinity_user -d infinity_db

# Backup database
docker-compose exec postgres pg_dump -U infinity_user infinity_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U infinity_user infinity_db < backup.sql
```

### Running Tests

```bash
# Run all tests
docker-compose exec api pytest

# Run specific test suite
docker-compose exec api pytest tests/unit

# Run with coverage
docker-compose exec api pytest --cov=app tests/
```

## Development Setup

For active development, you may want to run services locally:

### Backend Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Configuration

### Environment Variables

Key configuration is managed through environment variables. Copy the example file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL=postgresql://infinity_user:password@localhost:5432/infinity_db

# Redis
REDIS_URL=redis://localhost:6379/0

# API
API_SECRET_KEY=your-secret-key-here
API_CORS_ORIGINS=http://localhost:3000

# Logging
LOG_LEVEL=INFO
```

### Advanced Configuration

For production deployments, see:
- [Setup Guide](SETUP.md) - Detailed configuration options
- [Deployment Runbook](../runbooks/DEPLOYMENT.md) - Production deployment
- [Admin Manual](ADMIN_MANUAL.md) - System administration

## Troubleshooting

### Services Won't Start

```bash
# Check Docker is running
docker info

# Check port conflicts
netstat -an | grep -E '(8000|3000|5432|6379)'

# Clean start
docker-compose down -v
docker-compose up -d
```

### Database Connection Errors

```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
docker-compose exec api python -m alembic upgrade head
```

### Frontend Not Loading

```bash
# Check API connectivity
curl http://localhost:8000/api/health

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend

# Check browser console for errors
```

### Permission Errors

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
newgrp docker
```

## Getting Help

### Documentation
- [User Manual](USER_MANUAL.md) - Complete user guide
- [Admin Manual](ADMIN_MANUAL.md) - Administration guide
- [API Documentation](http://localhost:8000/docs) - Interactive API docs

### Support Channels
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check the `/docs` directory
- **Community**: Join our discussion forum

### Health Check

Verify system health:

```bash
# API health
curl http://localhost:8000/api/health

# Expected response:
# {"status":"healthy","version":"1.0.0","timestamp":"2025-12-31T..."}

# Run system diagnostics
docker-compose exec api python -m scripts.diagnostics
```

## Next Steps

Now that you have Infinity Matrix running:

1. **Read the [User Manual](USER_MANUAL.md)** - Learn about all features
2. **Explore [Agent Workflows](../agents/WORKFLOWS.md)** - Understand agent capabilities
3. **Review [Best Practices](../runbooks/SOPS.md)** - Operational guidelines
4. **Join the Community** - Connect with other users

## Security Notes

⚠️ **Important Security Reminders**:

- Change default passwords immediately
- Use strong, unique passwords
- Enable MFA for production environments
- Keep your system updated
- Review [Security Standards](../compliance/SECURITY.md)

## Resources

- **Main Documentation**: [README.md](../../README.md)
- **Architecture**: [Architecture Overview](../architecture/README.md)
- **API Reference**: [API Documentation](../api/README.md)
- **Runbooks**: [Operations Guide](../runbooks/README.md)

---

**Need Help?** Check our [Troubleshooting Guide](ERROR_HANDLING.md) or [file an issue](https://github.com/InfinityXOneSystems/infinity-matrix/issues).

**Ready for Production?** See our [Deployment Guide](../runbooks/DEPLOYMENT.md).
