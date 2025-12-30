# Deployment Guide

## Overview

This guide covers deploying the Infinity-Matrix Autonomous System to various environments.

## Deployment Options

1. **Local Development** - Docker Compose
2. **Google Cloud Platform** - Cloud Run, GKE
3. **Kubernetes** - Any K8s cluster
4. **Traditional VPS** - Direct installation

## Prerequisites

- Configured environment (see [Configuration Guide](configuration.md))
- Access to deployment target
- CI/CD pipeline configured (for automated deployments)

## Local Development Deployment

### Using Docker Compose

1. **Build and start**:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

2. **Verify**:
   ```bash
   docker-compose ps
   docker-compose logs -f vision-cortex
   ```

3. **Access services**:
   - API: http://localhost:8000/docs
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3001

4. **Stop**:
   ```bash
   docker-compose down
   ```

### Direct Python Execution

```bash
# Run Vision Cortex
python ai_stack/vision_cortex/vision_cortex.py

# Run API Server (separate terminal)
uvicorn gateway_stack.api.main:app --reload
```

## Google Cloud Platform Deployment

### Cloud Run Deployment

#### Prerequisites

```bash
# Install Google Cloud SDK
# Authenticate
gcloud auth login
gcloud auth application-default login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

#### Deploy Vision Cortex

```bash
# Build and push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/infinity-matrix

# Deploy to Cloud Run
gcloud run deploy infinity-matrix \
  --image gcr.io/YOUR_PROJECT_ID/infinity-matrix \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ENVIRONMENT=production \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600 \
  --max-instances 10 \
  --min-instances 1
```

#### Deploy API Server

```bash
# Build separate API image if needed
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/infinity-matrix-api -f Dockerfile.api

# Deploy API
gcloud run deploy infinity-matrix-api \
  --image gcr.io/YOUR_PROJECT_ID/infinity-matrix-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1
```

#### Configure Custom Domain

```bash
# Map domain
gcloud run domain-mappings create \
  --service infinity-matrix-api \
  --domain api.infinityxai.com \
  --region us-central1
```

### Google Kubernetes Engine (GKE)

#### Create Cluster

```bash
# Create GKE cluster
gcloud container clusters create infinity-matrix \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type n1-standard-2 \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 10
```

#### Deploy to GKE

1. **Create Kubernetes manifests** in `k8s/` directory

2. **Apply configurations**:
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/configmap.yaml
   kubectl apply -f k8s/secrets.yaml
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   kubectl apply -f k8s/ingress.yaml
   ```

3. **Verify deployment**:
   ```bash
   kubectl get pods -n infinity-matrix
   kubectl get services -n infinity-matrix
   kubectl logs -f deployment/vision-cortex -n infinity-matrix
   ```

## CI/CD Pipeline Deployment

### GitHub Actions

The included `.github/workflows/ci-cd.yml` provides:
- Automated testing
- Security scanning
- Docker image building
- Deployment to staging/production

#### Configure Secrets

In GitHub repository settings, add secrets:
- `GCP_PROJECT_ID`
- `GCP_SERVICE_ACCOUNT_KEY`

#### Trigger Deployment

```bash
# Deploy to staging (push to develop branch)
git push origin develop

# Deploy to production (push to main branch)
git push origin main
```

## Environment-Specific Deployments

### Staging Environment

```bash
# Set staging configuration
export ENVIRONMENT=staging
export LOG_LEVEL=INFO
export ENABLE_AUTO_DEPLOY=true

# Deploy
./scripts/deploy/deploy_staging.sh
```

### Production Environment

```bash
# Set production configuration
export ENVIRONMENT=production
export LOG_LEVEL=WARNING
export ENABLE_AUTO_DEPLOY=true
export USE_SECRET_MANAGER=true

# Deploy
./scripts/deploy/deploy_production.sh
```

## Database Setup

### Firestore

```bash
# Create Firestore database
gcloud firestore databases create --region=us-central1

# Create indexes (if needed)
gcloud firestore indexes composite create \
  --collection-group=agents \
  --field-config field-path=status,order=ASCENDING \
  --field-config field-path=created_at,order=DESCENDING
```

### PostgreSQL (Optional)

```bash
# Create Cloud SQL instance
gcloud sql instances create infinity-matrix-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create infinity_matrix \
  --instance=infinity-matrix-db

# Create user
gcloud sql users create infinity_user \
  --instance=infinity-matrix-db \
  --password=SECURE_PASSWORD
```

## Monitoring Setup

### Prometheus & Grafana

#### Cloud-based

```bash
# Deploy Prometheus on GKE
kubectl apply -f k8s/monitoring/prometheus.yaml

# Deploy Grafana
kubectl apply -f k8s/monitoring/grafana.yaml

# Access Grafana
kubectl port-forward svc/grafana 3000:3000 -n monitoring
```

#### Google Cloud Monitoring

```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# Metrics are automatically collected from Cloud Run
```

## SSL/TLS Configuration

### Let's Encrypt (Free)

```bash
# Install cert-manager on GKE
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f k8s/cert-issuer.yaml

# Update Ingress with TLS
kubectl apply -f k8s/ingress-tls.yaml
```

### Google-managed Certificates

```bash
# Create managed certificate
gcloud compute ssl-certificates create infinity-matrix-cert \
  --domains=infinityxai.com,api.infinityxai.com

# Use in load balancer configuration
```

## Backup and Recovery

### Automated Backups

```bash
# Schedule Firestore backups
gcloud firestore backups schedules create \
  --database=infinity-matrix \
  --recurrence=daily \
  --retention=7d

# Schedule Cloud SQL backups
gcloud sql backups create \
  --instance=infinity-matrix-db \
  --description="Manual backup"
```

### Restore from Backup

```bash
# Restore Firestore
gcloud firestore import gs://YOUR_BUCKET/backups/BACKUP_NAME

# Restore Cloud SQL
gcloud sql backups restore BACKUP_ID \
  --backup-instance=infinity-matrix-db \
  --backup-id=BACKUP_ID
```

## Scaling

### Horizontal Scaling

```bash
# Cloud Run (automatic)
gcloud run services update infinity-matrix \
  --max-instances=20 \
  --min-instances=2

# GKE
kubectl scale deployment vision-cortex --replicas=5 -n infinity-matrix
```

### Vertical Scaling

```bash
# Cloud Run
gcloud run services update infinity-matrix \
  --memory=4Gi \
  --cpu=4

# GKE - update deployment resource limits
kubectl edit deployment vision-cortex -n infinity-matrix
```

## Health Checks

### Configure Health Checks

```bash
# Cloud Run (automatic from Dockerfile HEALTHCHECK)

# GKE
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: vision-cortex
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
      initialDelaySeconds: 5
      periodSeconds: 5
EOF
```

## Rollback Procedures

### Cloud Run Rollback

```bash
# List revisions
gcloud run revisions list --service=infinity-matrix

# Rollback to previous revision
gcloud run services update-traffic infinity-matrix \
  --to-revisions=REVISION_NAME=100
```

### GKE Rollback

```bash
# Check rollout history
kubectl rollout history deployment/vision-cortex -n infinity-matrix

# Rollback
kubectl rollout undo deployment/vision-cortex -n infinity-matrix

# Rollback to specific revision
kubectl rollout undo deployment/vision-cortex \
  --to-revision=2 -n infinity-matrix
```

## Troubleshooting

### Common Issues

#### 1. Container won't start

```bash
# Check logs
gcloud run services logs read infinity-matrix --limit=50

# Or for GKE
kubectl logs deployment/vision-cortex -n infinity-matrix
```

#### 2. Out of memory

```bash
# Increase memory allocation
gcloud run services update infinity-matrix --memory=4Gi
```

#### 3. Slow cold starts

```bash
# Set minimum instances
gcloud run services update infinity-matrix --min-instances=1
```

#### 4. Database connection issues

```bash
# Check firewall rules
gcloud compute firewall-rules list

# Test connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -- sh
wget -O- http://vision-cortex:8000/health
```

## Security Checklist

- [ ] Enable VPC Service Controls
- [ ] Configure Binary Authorization
- [ ] Set up Cloud Armor (DDoS protection)
- [ ] Enable audit logging
- [ ] Rotate service account keys regularly
- [ ] Use least privilege IAM roles
- [ ] Enable vulnerability scanning
- [ ] Configure network policies
- [ ] Use Secret Manager for secrets
- [ ] Enable Cloud KMS for encryption

## Cost Optimization

### Tips

1. **Use autoscaling** - Scale to zero when not in use
2. **Right-size resources** - Don't over-provision
3. **Use committed use discounts** - For predictable workloads
4. **Enable Cloud CDN** - For static assets
5. **Monitor costs** - Set up budget alerts
6. **Use preemptible VMs** - For non-critical workloads

### Cost Monitoring

```bash
# Set budget alert
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Infinity Matrix Budget" \
  --budget-amount=500USD \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90
```

## Post-Deployment

### Verification

1. **Health checks**:
   ```bash
   curl https://api.infinityxai.com/health
   ```

2. **Run smoke tests**:
   ```bash
   ./scripts/tests/smoke_tests.sh
   ```

3. **Monitor metrics**:
   - Check Grafana dashboards
   - Review Cloud Monitoring
   - Check error rates

### Documentation

1. Update deployment documentation
2. Record deployment date and version
3. Document any issues encountered
4. Update runbooks if needed

## Support

For deployment issues:
- **Email**: ops@infinityxai.com
- **Slack**: #infinity-matrix-ops
- **On-call**: Check PagerDuty schedule

---

Last Updated: December 30, 2024
