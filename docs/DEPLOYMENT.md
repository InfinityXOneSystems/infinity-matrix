# Deployment Guide - Infinity Matrix

## Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+), macOS, Windows 10+ with WSL2
- **CPU**: 4+ cores recommended
- **RAM**: 8GB minimum, 16GB recommended
- **Disk**: 50GB available space
- **Network**: Stable internet connection

### Software Requirements
- **Node.js**: 20.0.0 or higher
- **npm**: 10.0.0 or higher
- **Docker**: 20.10.0 or higher
- **Docker Compose**: 2.0.0 or higher
- **Git**: 2.30.0 or higher

## Installation Methods

### Method 1: Docker Compose (Recommended)

**Step 1: Clone Repository**
```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
```

**Step 2: Configure Environment**
```bash
cp .env.example .env
# Edit .env with your settings
nano .env
```

**Step 3: Start Services**
```bash
docker-compose up -d
```

**Step 4: Verify Deployment**
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Check health
curl http://localhost:8080/health
```

### Method 2: Native Installation

**Step 1: Clone and Install**
```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
npm install
```

**Step 2: Setup Databases**
```bash
# Start PostgreSQL
# Start Redis
# Start Elasticsearch
# Update .env with connection strings
```

**Step 3: Build and Start**
```bash
npm run build
npm start
```

### Method 3: Kubernetes (Production)

**Step 1: Prepare Cluster**
```bash
# Ensure kubectl is configured
kubectl get nodes
```

**Step 2: Deploy**
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

**Step 3: Verify**
```bash
kubectl get pods -n infinity-matrix
kubectl get services -n infinity-matrix
```

## Configuration

### Environment Variables

Critical variables in `.env`:

```env
# Core
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=<strong-secret>
API_KEY=<api-key>
ENCRYPTION_KEY=<encryption-key>

# Features
AGENT_AUTO_DISCOVERY=true
MONITORING_ENABLED=true
BACKUP_ENABLED=true
```

### System Manifest

Edit `manifests/system-manifest.yaml` to configure:
- Enabled components
- Gateway settings
- Agent policies
- Monitoring configuration
- Industry verticals

### Agent Registry

Edit `manifests/agent-registry.yaml` to:
- Enable/disable agents
- Configure agent capabilities
- Set deployment strategies

## Post-Deployment

### Initial Setup

**1. Create Admin User**
```bash
npm run cli -- user:create --role=admin
```

**2. Configure Integrations**
```bash
# OpenAI
npm run cli -- integration:configure --name=openai --key=<api-key>

# Anthropic
npm run cli -- integration:configure --name=anthropic --key=<api-key>
```

**3. Deploy Agents**
```bash
# Deploy all active agents
npm run cli -- agent:deploy-all

# Or deploy specific agents
npm run agent:deploy -- --agent=intelligence-crawler
```

**4. Verify System**
```bash
# Run health check
npm run health

# Check agent status
npm run agent:list

# View system status
npm run status
```

### Bootstrap Industry Vertical

**Real Estate**
```bash
npm run bootstrap -- --vertical=real-estate
```

**Healthcare**
```bash
npm run bootstrap -- --vertical=healthcare
```

**Custom Vertical**
```bash
npm run bootstrap -- --vertical=custom --config=./config/custom.yaml
```

## Monitoring Setup

### Access Dashboards

- **Grafana**: http://localhost:3001
  - Username: admin
  - Password: admin (change on first login)

- **Prometheus**: http://localhost:9091
  - No authentication by default

### Configure Alerts

Edit `config/alerts.yml`:
```yaml
alerts:
  - name: high-cpu
    condition: cpu_usage > 80
    action: notify
  - name: agent-failure
    condition: agent_status == failed
    action: restart
```

## Security Hardening

### 1. Change Default Credentials
```bash
# Update .env
JWT_SECRET=<new-secret>
API_KEY=<new-key>

# Restart services
docker-compose restart
```

### 2. Enable TLS/SSL
```bash
# Add certificates to config/certs/
# Update docker-compose.yml
# Restart gateways
```

### 3. Configure Firewall
```bash
# Allow only necessary ports
ufw allow 3000/tcp  # API Gateway
ufw allow 3100/tcp  # WebSocket
ufw enable
```

### 4. Enable Audit Logging
```env
# In .env
AUDIT_ENABLED=true
AUDIT_LOG_PATH=./logs/audit
```

## Backup Strategy

### Automated Backups

Configured in `.env`:
```env
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 0 * * *  # Daily at midnight
BACKUP_RETENTION_DAYS=30
BACKUP_PATH=./backups
```

### Manual Backup
```bash
npm run backup
```

### Restore
```bash
npm run restore -- --backup=backups/2025-01-01-backup.tar.gz
```

## Scaling

### Horizontal Scaling

**Docker Compose**
```bash
docker-compose up -d --scale infinity-matrix=3
```

**Kubernetes**
```bash
kubectl scale deployment infinity-matrix --replicas=3 -n infinity-matrix
```

### Vertical Scaling

Edit `docker-compose.yml`:
```yaml
services:
  infinity-matrix:
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G
        reservations:
          cpus: '2'
          memory: 4G
```

## Troubleshooting

### Common Issues

**Services Won't Start**
```bash
# Check logs
docker-compose logs infinity-matrix

# Check ports
netstat -tulpn | grep LISTEN

# Restart services
docker-compose restart
```

**Database Connection Failed**
```bash
# Verify database is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U infinity -d infinity_matrix -c "\l"

# Check credentials in .env
```

**Agent Deployment Failed**
```bash
# Check agent logs
npm run agent:logs -- --agent=<agent-id>

# Verify manifest
cat manifests/agents/<agent>.yaml

# Redeploy
npm run agent:deploy -- --agent=<agent-id> --force
```

## Updating

### Update System
```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Rebuild
npm run build

# Restart services
docker-compose down
docker-compose up -d
```

### Update Agents
```bash
# Update agent definitions
git pull origin main

# Redeploy agents
npm run agent:deploy-all --force
```

## Rollback

### Rollback System
```bash
# Stop current version
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and start
docker-compose up -d
```

### Rollback Agent
```bash
npm run agent:deploy -- --agent=<agent-id> --version=<previous-version>
```

## Performance Optimization

### Database Tuning
```sql
-- Increase connection pool
ALTER SYSTEM SET max_connections = 200;

-- Enable query cache
ALTER SYSTEM SET shared_buffers = '2GB';

-- Reload configuration
SELECT pg_reload_conf();
```

### Cache Optimization
```env
# In .env
CACHE_TTL_SECONDS=600
REDIS_MAX_MEMORY=2GB
```

### Agent Optimization
```yaml
# In agent manifest
resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi
```

## Production Checklist

Pre-deployment:
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Backup strategy configured
- [ ] Monitoring dashboards setup
- [ ] Documentation updated
- [ ] Disaster recovery plan in place

Post-deployment:
- [ ] Health checks passing
- [ ] All agents running
- [ ] Monitoring alerts configured
- [ ] Logs accessible
- [ ] Backup verified
- [ ] Performance baseline established

## Support

- **Documentation**: https://docs.infinityxone.systems
- **Issues**: https://github.com/InfinityXOneSystems/infinity-matrix/issues
- **Community**: https://community.infinityxone.systems
- **Email**: support@infinityxone.systems
