# Setup Guide

Complete setup and configuration guide for Infinity Matrix.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Methods](#installation-methods)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Security Configuration](#security-configuration)
6. [Monitoring Setup](#monitoring-setup)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

## System Requirements

### Hardware Requirements

#### Development Environment
- **CPU**: 2+ cores
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 20GB free space
- **Network**: Broadband internet

#### Production Environment
- **CPU**: 8+ cores
- **RAM**: 32GB minimum, 64GB recommended
- **Storage**: 100GB+ SSD
- **Network**: High-speed, low-latency

### Software Requirements

#### Operating System
- Linux (Ubuntu 20.04+, Debian 11+, RHEL 8+)
- macOS 12+ (for development)
- Windows 10+ with WSL2 (for development)

#### Core Dependencies
```bash
Docker 20.10+
Docker Compose 2.0+
Python 3.11+
Node.js 18+
Git 2.30+
```

#### Optional Tools
```bash
kubectl 1.28+        # For Kubernetes deployments
helm 3.12+           # For Helm charts
terraform 1.5+       # For infrastructure as code
make                 # For build automation
```

## Installation Methods

### Method 1: Docker Compose (Recommended for Development)

```bash
# Clone repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Copy environment configuration
cp .env.example .env

# Start services
docker-compose up -d

# Initialize database
docker-compose exec api python -m alembic upgrade head

# Create admin user
docker-compose exec api python -m scripts.create_admin
```

### Method 2: Local Installation

#### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Run migrations
alembic upgrade head

# Start API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start development server
npm run dev
```

### Method 3: Kubernetes Deployment

```bash
# Add Helm repository
helm repo add infinity-matrix https://charts.infinityxonesystems.com
helm repo update

# Install with Helm
helm install infinity-matrix infinity-matrix/infinity-matrix \
  --namespace infinity-matrix \
  --create-namespace \
  --values production-values.yaml

# Verify deployment
kubectl get pods -n infinity-matrix
```

See [Deployment Runbook](../runbooks/DEPLOYMENT.md) for details.

## Configuration

### Environment Variables

Create and configure `.env` file:

```env
# ============================================
# Application Configuration
# ============================================
APP_NAME=Infinity Matrix
APP_VERSION=1.0.0
ENVIRONMENT=development  # development, staging, production
DEBUG=true  # Set to false in production

# ============================================
# Database Configuration
# ============================================
DATABASE_URL=postgresql://infinity_user:secure_password@localhost:5432/infinity_db
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10
DATABASE_ECHO=false  # SQL query logging

# ============================================
# Redis Configuration
# ============================================
REDIS_URL=redis://localhost:6379/0
REDIS_PASSWORD=
REDIS_MAX_CONNECTIONS=50

# ============================================
# Security Configuration
# ============================================
SECRET_KEY=your-secret-key-here-change-in-production
JWT_SECRET_KEY=your-jwt-secret-here-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
CORS_CREDENTIALS=true

# ============================================
# API Configuration
# ============================================
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4
API_RELOAD=true  # Development only
API_PREFIX=/api/v1

# ============================================
# Frontend Configuration
# ============================================
FRONTEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:8000/api/v1

# ============================================
# Logging Configuration
# ============================================
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_FORMAT=json  # json or text
LOG_FILE_PATH=/var/log/infinity-matrix/app.log
LOG_MAX_SIZE=100  # MB
LOG_BACKUP_COUNT=10

# ============================================
# Monitoring Configuration
# ============================================
ENABLE_METRICS=true
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001

# ============================================
# Email Configuration
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@infinity-matrix.io
SMTP_TLS=true

# ============================================
# Storage Configuration
# ============================================
STORAGE_TYPE=local  # local, s3, azure, gcs
STORAGE_PATH=/var/lib/infinity-matrix/storage

# S3 Configuration (if STORAGE_TYPE=s3)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=infinity-matrix-storage

# ============================================
# Agent Configuration
# ============================================
AGENT_MAX_WORKERS=10
AGENT_TIMEOUT=300  # seconds
AGENT_RETRY_ATTEMPTS=3
AGENT_RETRY_DELAY=5  # seconds

# ============================================
# Feature Flags
# ============================================
ENABLE_REGISTRATION=true
ENABLE_MFA=true
ENABLE_WEBHOOKS=true
ENABLE_API_DOCUMENTATION=true
```

### Security Configuration

#### Generate Secret Keys

```bash
# Generate secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate JWT secret
python -c "import secrets; print(secrets.token_hex(32))"
```

#### SSL/TLS Configuration

For production, enable HTTPS:

```nginx
server {
    listen 443 ssl http2;
    server_name infinity-matrix.io;

    ssl_certificate /etc/ssl/certs/infinity-matrix.crt;
    ssl_certificate_key /etc/ssl/private/infinity-matrix.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Database Setup

### PostgreSQL Configuration

#### Create Database and User

```sql
-- Connect as postgres user
psql -U postgres

-- Create user
CREATE USER infinity_user WITH PASSWORD 'secure_password';

-- Create database
CREATE DATABASE infinity_db OWNER infinity_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE infinity_db TO infinity_user;

-- Enable extensions
\c infinity_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

#### Run Migrations

```bash
# Check current version
alembic current

# Upgrade to latest
alembic upgrade head

# Rollback if needed
alembic downgrade -1

# Generate new migration
alembic revision --autogenerate -m "description"
```

#### Backup and Restore

```bash
# Backup
pg_dump -U infinity_user -d infinity_db -F c -f backup_$(date +%Y%m%d).dump

# Restore
pg_restore -U infinity_user -d infinity_db -c backup_20251231.dump
```

### Redis Configuration

Edit `redis.conf`:

```conf
# Network
bind 127.0.0.1
port 6379

# Security
requirepass your-redis-password

# Persistence
save 900 1
save 300 10
save 60 10000

# Memory
maxmemory 2gb
maxmemory-policy allkeys-lru
```

## Monitoring Setup

### Prometheus Configuration

Create `prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'infinity-matrix-api'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'

  - job_name: 'infinity-matrix-agents'
    static_configs:
      - targets: ['localhost:8001']
```

### Grafana Setup

```bash
# Start Grafana
docker-compose up -d grafana

# Access at http://localhost:3001
# Default credentials: admin/admin

# Import dashboards from /monitoring/dashboards
```

## Verification

### System Health Check

```bash
# API health
curl http://localhost:8000/api/health

# Expected response:
# {
#   "status": "healthy",
#   "version": "1.0.0",
#   "database": "connected",
#   "redis": "connected",
#   "timestamp": "2025-12-31T..."
# }
```

### Run Diagnostics

```bash
# Full system diagnostics
docker-compose exec api python -m scripts.diagnostics

# Check services
docker-compose ps

# View logs
docker-compose logs --tail=100 api
```

### Automated Tests

```bash
# Run test suite
docker-compose exec api pytest

# Run with coverage
docker-compose exec api pytest --cov=app --cov-report=html

# Integration tests
docker-compose exec api pytest tests/integration/
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>
```

#### Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection
psql -U infinity_user -h localhost -d infinity_db

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

#### Permission Denied

```bash
# Fix ownership
sudo chown -R $USER:$USER .

# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker
```

#### Out of Memory

```bash
# Increase Docker memory limit
# Docker Desktop: Settings > Resources > Memory

# Check memory usage
docker stats

# Clean up
docker system prune -a
```

### Getting Help

See [Error Handling Guide](ERROR_HANDLING.md) for more troubleshooting.

---

**Next Steps**:
- Review [User Manual](USER_MANUAL.md)
- Read [Admin Manual](ADMIN_MANUAL.md)
- Explore [API Documentation](../api/README.md)
