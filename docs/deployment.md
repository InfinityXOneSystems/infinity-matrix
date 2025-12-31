# Deployment Guide

This guide covers deploying the Infinity Matrix Auto-Builder in various environments.

## Prerequisites

- Python 3.9 or higher
- Git
- Docker (for containerized deployment)
- Kubernetes (for production deployment)

## Local Development

### 1. Clone and Install

```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

### 3. Run the API Server

```bash
# Development mode (with auto-reload)
infinity-builder serve --reload

# Production mode
infinity-builder serve --host 0.0.0.0 --port 8000
```

### 4. Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=infinity_matrix
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY pyproject.toml README.md ./
COPY infinity_matrix ./infinity_matrix

# Install Python dependencies
RUN pip install --no-cache-dir -e .

# Create required directories
RUN mkdir -p /app/builds /app/templates /app/blueprints

# Expose API port
EXPOSE 8000

# Run the server
CMD ["uvicorn", "infinity_matrix.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Build and Run

```bash
# Build image
docker build -t infinity-matrix:latest .

# Run container
docker run -d \
  -p 8000:8000 \
  -e INFINITY_SECRET_KEY="your-secret-key" \
  -e INFINITY_GITHUB_TOKEN="your-github-token" \
  -v $(pwd)/builds:/app/builds \
  --name infinity-builder \
  infinity-matrix:latest
```

### 3. Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - INFINITY_SECRET_KEY=${INFINITY_SECRET_KEY}
      - INFINITY_GITHUB_TOKEN=${INFINITY_GITHUB_TOKEN}
      - INFINITY_DATABASE_URL=postgresql://user:pass@db:5432/infinity
    volumes:
      - ./builds:/app/builds
      - ./templates:/app/templates
      - ./blueprints:/app/blueprints
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=infinity
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose up -d
```

## Kubernetes Deployment

### 1. Create Namespace

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: infinity-matrix
```

### 2. Create ConfigMap

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: infinity-config
  namespace: infinity-matrix
data:
  INFINITY_API_HOST: "0.0.0.0"
  INFINITY_API_PORT: "8000"
  INFINITY_LOG_LEVEL: "INFO"
```

### 3. Create Secret

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: infinity-secrets
  namespace: infinity-matrix
type: Opaque
stringData:
  INFINITY_SECRET_KEY: "your-secret-key-here"
  INFINITY_GITHUB_TOKEN: "your-github-token-here"
```

### 4. Create Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: infinity-builder
  namespace: infinity-matrix
spec:
  replicas: 3
  selector:
    matchLabels:
      app: infinity-builder
  template:
    metadata:
      labels:
        app: infinity-builder
    spec:
      containers:
      - name: api
        image: infinity-matrix:latest
        ports:
        - containerPort: 8000
          name: http
        envFrom:
        - configMapRef:
            name: infinity-config
        - secretRef:
            name: infinity-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
        volumeMounts:
        - name: builds
          mountPath: /app/builds
      volumes:
      - name: builds
        persistentVolumeClaim:
          claimName: builds-pvc
```

### 5. Create Service

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: infinity-builder
  namespace: infinity-matrix
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8000
    protocol: TCP
    name: http
  selector:
    app: infinity-builder
```

### 6. Create Ingress (Optional)

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: infinity-builder
  namespace: infinity-matrix
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  rules:
  - host: builder.infinityxai.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: infinity-builder
            port:
              number: 80
  tls:
  - hosts:
    - builder.infinityxai.com
    secretName: infinity-tls
```

### 7. Deploy to Kubernetes

```bash
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

## Cloud Platform Deployment

### AWS (ECS/Fargate)

```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag infinity-matrix:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/infinity-matrix:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/infinity-matrix:latest

# Create ECS task definition and service (use AWS Console or CLI)
```

### Google Cloud (GKE)

```bash
# Push to GCR
gcloud auth configure-docker
docker tag infinity-matrix:latest gcr.io/<project-id>/infinity-matrix:latest
docker push gcr.io/<project-id>/infinity-matrix:latest

# Deploy to GKE
gcloud container clusters create infinity-cluster --num-nodes=3
kubectl apply -f k8s/
```

### Azure (AKS)

```bash
# Push to ACR
az acr login --name <registry-name>
docker tag infinity-matrix:latest <registry-name>.azurecr.io/infinity-matrix:latest
docker push <registry-name>.azurecr.io/infinity-matrix:latest

# Deploy to AKS
az aks get-credentials --resource-group <resource-group> --name <cluster-name>
kubectl apply -f k8s/
```

## Environment Variables

### Required

- `INFINITY_SECRET_KEY`: JWT secret key (generate with `openssl rand -hex 32`)

### Optional

- `INFINITY_API_HOST`: API host (default: 0.0.0.0)
- `INFINITY_API_PORT`: API port (default: 8000)
- `INFINITY_GITHUB_TOKEN`: GitHub personal access token
- `INFINITY_DATABASE_URL`: Database connection string
- `INFINITY_LOG_LEVEL`: Logging level (DEBUG, INFO, WARNING, ERROR)

## Monitoring

### Health Checks

```bash
# Check API health
curl http://localhost:8000/health

# Check API status
curl http://localhost:8000/
```

### Prometheus Metrics (Future)

```yaml
# Add to deployment
- name: metrics
  port: 9090
  targetPort: 9090
```

### Logging

Logs are written to stdout/stderr and can be collected by:
- Docker logs: `docker logs infinity-builder`
- Kubernetes logs: `kubectl logs -f deployment/infinity-builder -n infinity-matrix`
- Cloud logging services (CloudWatch, Stackdriver, etc.)

## Backup and Recovery

### Backup Builds

```bash
# Create backup
tar -czf builds-backup-$(date +%Y%m%d).tar.gz builds/

# Restore from backup
tar -xzf builds-backup-20250115.tar.gz
```

### Database Backup (if using)

```bash
# PostgreSQL backup
pg_dump -h localhost -U user infinity > backup.sql

# Restore
psql -h localhost -U user infinity < backup.sql
```

## Security Considerations

1. **Use strong secrets**: Generate secure random keys for production
2. **Enable HTTPS**: Use TLS certificates (Let's Encrypt recommended)
3. **Restrict network access**: Use firewalls and security groups
4. **Update dependencies**: Regularly update Python packages
5. **Monitor logs**: Set up log aggregation and alerting
6. **Use least privilege**: Run containers with minimal permissions
7. **Scan images**: Use Docker image scanning tools

## Scaling

### Horizontal Scaling

Increase replicas in Kubernetes:

```bash
kubectl scale deployment infinity-builder --replicas=5 -n infinity-matrix
```

### Autoscaling

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: infinity-builder
  namespace: infinity-matrix
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: infinity-builder
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change port with `--port` flag
2. **Permission denied**: Check file/directory permissions
3. **Module not found**: Ensure package is installed: `pip install -e .`
4. **Database connection failed**: Verify DATABASE_URL is correct

### Debug Mode

Enable debug mode:

```bash
INFINITY_DEBUG=true infinity-builder serve
```

### View Logs

```bash
# Docker
docker logs -f infinity-builder

# Kubernetes
kubectl logs -f deployment/infinity-builder -n infinity-matrix
```

## Support

For deployment assistance:
- GitHub Issues: https://github.com/InfinityXOneSystems/infinity-matrix/issues
- Documentation: https://github.com/InfinityXOneSystems/infinity-matrix/wiki
- Email: support@infinityxai.com
