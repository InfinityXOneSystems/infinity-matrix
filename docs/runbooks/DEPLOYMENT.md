# Deployment Runbook

## Overview

This runbook covers the complete deployment process for Infinity Matrix, from preparation through verification.

## Prerequisites

### Required Access
- [ ] GitHub repository access
- [ ] Kubernetes cluster access (production)
- [ ] AWS/Cloud provider credentials
- [ ] CI/CD pipeline access
- [ ] Monitoring dashboard access

### Required Tools
```bash
kubectl version    # 1.28+
helm version       # 3.12+
docker --version   # 20.10+
git --version      # 2.30+
```

### Pre-Deployment Checklist
- [ ] All tests passing in CI/CD
- [ ] Code review completed and approved
- [ ] Security scan completed (no critical issues)
- [ ] Change ticket approved
- [ ] Deployment window scheduled
- [ ] Stakeholders notified
- [ ] Rollback plan ready

## Deployment Types

### 1. Development Deployment
**Frequency**: On every commit  
**Automation**: Fully automated  
**Approval**: None required

### 2. Staging Deployment
**Frequency**: On PR merge to develop  
**Automation**: Automated with manual approval  
**Approval**: Team lead

### 3. Production Deployment
**Frequency**: Scheduled releases  
**Automation**: Semi-automated  
**Approval**: Engineering lead + Product manager

## Production Deployment Procedure

### Phase 1: Preparation (T-60 minutes)

#### 1.1 Verify Pre-requisites

```bash
# Check GitHub Actions status
gh workflow view deployment --web

# Verify all tests passed
gh run list --workflow=tests --limit 1

# Check current production status
kubectl get pods -n infinity-matrix-prod
```

#### 1.2 Create Deployment Branch

```bash
# Create release branch
git checkout main
git pull origin main
git checkout -b release/v1.0.1

# Tag the release
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1
```

#### 1.3 Notify Stakeholders

```bash
# Send deployment notification
# Subject: [DEPLOYMENT] Infinity Matrix v1.0.1 - Starting at [TIME]
# Include: Version, Changes, Duration, Impact
```

### Phase 2: Pre-Deployment (T-30 minutes)

#### 2.1 Backup Current State

```bash
# Backup database
kubectl exec -n infinity-matrix-prod deployment/postgres -- \
  pg_dump -U infinity_user infinity_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup configurations
kubectl get configmap -n infinity-matrix-prod -o yaml > configs_backup.yaml
kubectl get secret -n infinity-matrix-prod -o yaml > secrets_backup.yaml
```

#### 2.2 Scale Up Resources

```bash
# Scale up for zero-downtime deployment
kubectl scale deployment api-gateway -n infinity-matrix-prod --replicas=6
kubectl scale deployment agent-orchestrator -n infinity-matrix-prod --replicas=4
```

#### 2.3 Enable Maintenance Mode (if needed)

```bash
# Enable read-only mode
kubectl set env deployment/api-gateway -n infinity-matrix-prod \
  MAINTENANCE_MODE=true
```

### Phase 3: Deployment (T-0)

#### 3.1 Deploy Backend Services

```bash
# Update Helm values
helm upgrade infinity-matrix ./helm/infinity-matrix \
  --namespace infinity-matrix-prod \
  --values values-production.yaml \
  --set image.tag=v1.0.1 \
  --wait \
  --timeout 10m

# Verify deployment
kubectl rollout status deployment/api-gateway -n infinity-matrix-prod
kubectl rollout status deployment/agent-orchestrator -n infinity-matrix-prod
```

#### 3.2 Run Database Migrations

```bash
# Apply migrations
kubectl exec -n infinity-matrix-prod deployment/api-gateway -- \
  python -m alembic upgrade head

# Verify migration
kubectl exec -n infinity-matrix-prod deployment/api-gateway -- \
  python -m alembic current
```

#### 3.3 Deploy Frontend

```bash
# Build and push frontend
cd frontend
npm run build
docker build -t infinity-matrix-frontend:v1.0.1 .
docker push registry.example.com/infinity-matrix-frontend:v1.0.1

# Update deployment
kubectl set image deployment/frontend -n infinity-matrix-prod \
  frontend=registry.example.com/infinity-matrix-frontend:v1.0.1

# Wait for rollout
kubectl rollout status deployment/frontend -n infinity-matrix-prod
```

### Phase 4: Verification (T+10 minutes)

#### 4.1 Health Checks

```bash
# API health
curl https://api.infinity-matrix.io/health

# Expected: {"status":"healthy"}

# Run smoke tests
python .prooftest/demos/health_check_demo.py --export
```

#### 4.2 Verify Services

```bash
# Check all pods running
kubectl get pods -n infinity-matrix-prod

# Check logs for errors
kubectl logs -n infinity-matrix-prod deployment/api-gateway --tail=100 | grep ERROR

# Verify database connectivity
kubectl exec -n infinity-matrix-prod deployment/api-gateway -- \
  python -c "from app.db import check_connection; check_connection()"
```

#### 4.3 Monitor Metrics

```bash
# Check Prometheus metrics
curl http://prometheus:9090/api/v1/query?query=up

# View Grafana dashboard
open http://grafana.infinity-matrix.io/dashboards
```

#### 4.4 Run Integration Tests

```bash
# Execute integration test suite
kubectl exec -n infinity-matrix-prod deployment/api-gateway -- \
  pytest tests/integration/ -v
```

### Phase 5: Post-Deployment (T+30 minutes)

#### 5.1 Disable Maintenance Mode

```bash
# Disable maintenance mode
kubectl set env deployment/api-gateway -n infinity-matrix-prod \
  MAINTENANCE_MODE=false
```

#### 5.2 Scale Down Resources

```bash
# Return to normal capacity
kubectl scale deployment api-gateway -n infinity-matrix-prod --replicas=3
kubectl scale deployment agent-orchestrator -n infinity-matrix-prod --replicas=2
```

#### 5.3 Monitor for Issues

Monitor for 30 minutes:
- Error rates in logs
- Response times
- User reports
- System metrics

#### 5.4 Update Documentation

```bash
# Update changelog
echo "## v1.0.1 - $(date +%Y-%m-%d)" >> docs/reports/CHANGELOG.md
echo "- Feature: ..." >> docs/reports/CHANGELOG.md
echo "- Fix: ..." >> docs/reports/CHANGELOG.md

# Commit changes
git add docs/reports/CHANGELOG.md
git commit -m "docs: update changelog for v1.0.1"
git push origin main
```

#### 5.5 Notify Completion

```bash
# Send completion notification
# Subject: [COMPLETE] Infinity Matrix v1.0.1 Deployment
# Include: Status, Issues (if any), Next steps
```

## Rollback Procedure

If issues are detected, rollback immediately:

### Quick Rollback

```bash
# Rollback Helm deployment
helm rollback infinity-matrix -n infinity-matrix-prod

# Verify rollback
kubectl rollout status deployment/api-gateway -n infinity-matrix-prod

# Run health checks
python .prooftest/demos/health_check_demo.py
```

### Database Rollback

```bash
# Rollback database if needed
kubectl exec -n infinity-matrix-prod deployment/postgres -- \
  psql -U infinity_user infinity_db < backup_20251231_100000.sql

# Verify database
kubectl exec -n infinity-matrix-prod deployment/api-gateway -- \
  python -m scripts.verify_database
```

### Complete Rollback

```bash
# Restore previous version completely
helm upgrade infinity-matrix ./helm/infinity-matrix \
  --namespace infinity-matrix-prod \
  --values values-production.yaml \
  --set image.tag=v1.0.0 \
  --wait

# Verify
kubectl get pods -n infinity-matrix-prod
python .prooftest/demos/health_check_demo.py
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n infinity-matrix-prod

# Check logs
kubectl logs <pod-name> -n infinity-matrix-prod

# Common fixes:
# - Check resource limits
# - Verify ConfigMap/Secrets
# - Check image pull
```

### Database Migration Errors

```bash
# Check migration status
kubectl exec deployment/api-gateway -n infinity-matrix-prod -- \
  python -m alembic current

# View migration history
kubectl exec deployment/api-gateway -n infinity-matrix-prod -- \
  python -m alembic history

# Rollback one migration
kubectl exec deployment/api-gateway -n infinity-matrix-prod -- \
  python -m alembic downgrade -1
```

### Service Unavailable

```bash
# Check ingress
kubectl get ingress -n infinity-matrix-prod

# Check service
kubectl get svc -n infinity-matrix-prod

# Test internal connectivity
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl http://api-gateway.infinity-matrix-prod.svc.cluster.local:8000/health
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review approved
- [ ] Security scan complete
- [ ] Change ticket approved
- [ ] Backup completed
- [ ] Stakeholders notified

### During Deployment
- [ ] Backend deployed
- [ ] Migrations applied
- [ ] Frontend deployed
- [ ] Health checks passing

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Integration tests passed
- [ ] Monitoring confirmed
- [ ] Documentation updated
- [ ] Stakeholders notified

## Related Documentation

- [Incident Response](INCIDENT_RESPONSE.md)
- [Backup & Recovery](BACKUP_RECOVERY.md)
- [Monitoring Guide](MONITORING.md)

---

**Owner**: DevOps Team  
**Last Updated**: 2025-12-31  
**Review Cycle**: Quarterly
