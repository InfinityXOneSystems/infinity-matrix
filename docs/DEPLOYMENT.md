# Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Production Deployment](#production-deployment)
5. [Configuration](#configuration)
6. [Monitoring](#monitoring)

## Prerequisites

### Required

- Python 3.9+
- pip or poetry for dependency management
- Git

### Optional (for full functionality)

- PostgreSQL 15+ (or use file-based storage)
- Redis 7+ (for task queue)
- Docker & Docker Compose (for containerized deployment)
- Kubernetes cluster (for production scale)

### API Keys

Obtain API keys for LLM providers you plan to use:

- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/
- **Google Vertex AI**: https://cloud.google.com/vertex-ai
- **GitHub** (optional, for higher rate limits): https://github.com/settings/tokens

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
pip install -e .
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys and settings
```

### 5. Configure System

```bash
cp config/config.example.yaml config/config.yaml
# Edit config/config.yaml as needed
```

### 6. Initialize Data Directories

```bash
mkdir -p data/{raw,normalized,analyzed,tasks}
```

### 7. Verify Installation

```bash
infinity-matrix list-industries
```

## Docker Deployment

### Using Docker Compose (Recommended)

Docker Compose sets up the entire stack including PostgreSQL and Redis.

#### 1. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

#### 2. Build and Start Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Redis cache
- Infinity Matrix application
- Celery worker (if configured)

#### 3. Check Status

```bash
docker-compose ps
docker-compose logs -f infinity-matrix
```

#### 4. Run Commands

```bash
docker-compose exec infinity-matrix infinity-matrix list-industries
docker-compose exec infinity-matrix infinity-matrix ingest --industry technology
```

#### 5. Stop Services

```bash
docker-compose down
# Keep data: docker-compose down (volumes persist)
# Remove data: docker-compose down -v
```

### Using Docker Only

#### 1. Build Image

```bash
docker build -t infinity-matrix:latest .
```

#### 2. Run Container

```bash
docker run -d \
  --name infinity-matrix \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/config:/app/config \
  -e OPENAI_API_KEY=your-key \
  infinity-matrix:latest
```

## Production Deployment

### Architecture Overview

```
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│ API  │  │ API  │  (Multiple instances)
└───┬──┘  └──┬───┘
    │        │
    └────┬───┘
         │
    ┌────▼─────┐
    │  Redis   │  (Task Queue)
    └────┬─────┘
         │
    ┌────▼─────────┐
    │   Workers    │  (Celery workers)
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │  PostgreSQL  │  (State management)
    └──────────────┘
```

### Kubernetes Deployment

#### 1. Create Namespace

```bash
kubectl create namespace infinity-matrix
```

#### 2. Create Secrets

```bash
kubectl create secret generic infinity-matrix-secrets \
  --from-literal=openai-api-key=your-key \
  --from-literal=db-password=your-password \
  -n infinity-matrix
```

#### 3. Deploy PostgreSQL

```yaml
# postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: infinity-matrix
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_DB
          value: infinity_matrix
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: infinity-matrix-secrets
              key: db-password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
```

#### 4. Deploy Application

```yaml
# app-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: infinity-matrix
  namespace: infinity-matrix
spec:
  replicas: 3
  selector:
    matchLabels:
      app: infinity-matrix
  template:
    metadata:
      labels:
        app: infinity-matrix
    spec:
      containers:
      - name: infinity-matrix
        image: infinity-matrix:latest
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: infinity-matrix-secrets
              key: openai-api-key
        - name: DB_HOST
          value: postgres
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: infinity-matrix-secrets
              key: db-password
        volumeMounts:
        - name: data-storage
          mountPath: /app/data
      volumes:
      - name: data-storage
        persistentVolumeClaim:
          claimName: data-pvc
```

#### 5. Apply Deployments

```bash
kubectl apply -f postgres-deployment.yaml
kubectl apply -f app-deployment.yaml
```

### AWS Deployment

#### Using ECS/Fargate

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name infinity-matrix
```

2. **Build and Push Image**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker build -t infinity-matrix .
docker tag infinity-matrix:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/infinity-matrix:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/infinity-matrix:latest
```

3. **Create Task Definition**
4. **Create ECS Service**
5. **Configure RDS PostgreSQL**
6. **Configure ElastiCache Redis**

## Configuration

### Environment Variables

See `.env.example` for all available environment variables.

### Config File Structure

```yaml
# config/config.yaml
database:
  host: ${DB_HOST}
  port: ${DB_PORT}
  
crawler:
  max_concurrent_requests: 20  # Increase for production
  
llm:
  providers:
    openai:
      api_key: ${OPENAI_API_KEY}
```

### Industry Configuration

Add new industries in `config/industries/`:

```yaml
# config/industries/my_industry.yaml
id: my_industry
name: My Industry
type: technology
description: Custom industry
seeds:
  - url: https://example.com
    source_id: my_source
    priority: 5
```

## Monitoring

### Health Checks

```bash
# Check system status
infinity-matrix status

# Check specific industry
infinity-matrix status --industry technology
```

### Logging

Logs are written to stdout by default. Configure log aggregation:

- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **CloudWatch**: AWS CloudWatch Logs
- **Datadog**: Application monitoring

### Metrics

The system exposes metrics for:
- Task completion rates
- Data collection volume
- API response times
- LLM token usage
- Error rates

Configure Prometheus scraping:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'infinity-matrix'
    static_configs:
      - targets: ['localhost:8000']
```

### Alerts

Set up alerts for:
- High failure rates (>10%)
- API rate limit approaching
- Storage capacity warnings
- Database connection issues

## Backup & Recovery

### Data Backup

```bash
# Backup data directory
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Backup database
pg_dump infinity_matrix > backup-$(date +%Y%m%d).sql
```

### Recovery

```bash
# Restore data
tar -xzf backup-20240101.tar.gz

# Restore database
psql infinity_matrix < backup-20240101.sql
```

## Scaling

### Horizontal Scaling

- Deploy multiple worker instances
- Use load balancer for API endpoints
- Configure shared Redis for task queue
- Use distributed storage (S3, GCS)

### Vertical Scaling

- Increase worker memory/CPU
- Optimize database queries
- Use connection pooling
- Enable caching

## Security

### Best Practices

1. **Secrets Management**
   - Use environment variables
   - Never commit secrets to Git
   - Use secret management tools (Vault, AWS Secrets Manager)

2. **Network Security**
   - Use VPC/private networks
   - Enable SSL/TLS
   - Restrict database access
   - Use security groups/firewalls

3. **Access Control**
   - Implement authentication
   - Use least privilege principle
   - Regular key rotation
   - Audit logging

4. **Data Protection**
   - Encrypt data at rest
   - Encrypt data in transit
   - Regular backups
   - Data retention policies

## Troubleshooting

### Common Issues

1. **Import errors**
   ```bash
   pip install -e .
   ```

2. **API rate limits**
   - Add GitHub token
   - Reduce concurrent requests
   - Implement backoff

3. **Database connection**
   - Check credentials
   - Verify network connectivity
   - Check PostgreSQL status

4. **LLM errors**
   - Verify API keys
   - Check quotas
   - Review error logs

### Getting Help

- GitHub Issues: https://github.com/InfinityXOneSystems/infinity-matrix/issues
- Documentation: See `docs/` directory
- Examples: See examples in README.md
