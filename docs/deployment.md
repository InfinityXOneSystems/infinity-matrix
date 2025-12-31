# Deployment Guide

## Prerequisites

- Docker 24+
- Kubernetes 1.28+ (for production)
- PostgreSQL 15+
- Redis 7+
- 4+ GB RAM
- 2+ CPU cores

## Local Development

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access points:
- Backend API: http://localhost:8000
- Frontend Dashboard: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn infinity_matrix.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Production Deployment

### Kubernetes

```bash
# Apply configurations
kubectl apply -f kubernetes/

# Check deployment status
kubectl get pods -n infinity-matrix

# View logs
kubectl logs -f deployment/backend -n infinity-matrix
```

### Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
REDIS_URL=redis://host:6379/0

# Security
SECRET_KEY=your-secret-key-here
API_KEY=your-api-key-here

# CORS
CORS_ORIGINS=https://yourdomain.com

# Monitoring
DRIFT_CHECK_INTERVAL=86400
COST_CHECK_INTERVAL=3600

# Compliance
ENABLE_PII_REDACTION=true
COMPLIANCE_FRAMEWORKS=HIPAA,SOC2,GDPR

# Backup
BACKUP_RETENTION_DAYS=30
BACKUP_LOCATION=/backups
```

### SSL/TLS Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring & Logging

### Prometheus Metrics
- API request rates
- Response times
- Error rates
- Cost metrics
- Drift detection metrics

### Log Aggregation
- Centralized logging with ELK stack
- Structured JSON logs
- Searchable audit trails

## Backup & Recovery

### Automated Backups
```bash
# Run backup
./scripts/dr/backup.sh

# Restore from backup
./scripts/dr/restore.sh BKP-20250101-120000
```

### Backup Schedule
- Full backups: Daily at 2 AM
- Incremental backups: Every 6 hours
- Retention: 30 days

## Scaling

### Horizontal Scaling
```bash
# Scale backend
kubectl scale deployment/backend --replicas=5

# Scale workers
kubectl scale deployment/celery-worker --replicas=3
```

### Auto-scaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Health Checks

### Liveness Probe
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
```

### Readiness Probe
```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Security Hardening

1. **Network Policies**: Restrict pod-to-pod communication
2. **RBAC**: Minimal permissions for service accounts
3. **Secrets**: Use Kubernetes secrets or vault
4. **Image Scanning**: Scan images before deployment
5. **Pod Security**: Use security contexts and policies

## Troubleshooting

### Common Issues

#### Database Connection
```bash
# Test connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Check logs
kubectl logs deployment/backend | grep database
```

#### High Memory Usage
```bash
# Check resource usage
kubectl top pods

# Increase memory limits
kubectl set resources deployment/backend --limits=memory=2Gi
```

#### Failed Deployments
```bash
# Describe pod
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'
```

---

**Last Updated**: 2025-12-31
