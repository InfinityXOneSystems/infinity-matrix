# Configuration Guide

## Overview

This guide provides detailed instructions for configuring the Infinity-Matrix Autonomous System for various environments.

## Prerequisites

Before configuration, ensure you have:
- Python 3.9 or higher
- Git 2.40 or higher
- Docker 24.0 or higher (optional, for containerized deployment)
- Google Cloud SDK (for GCP integration)
- A Google Cloud Platform project (for cloud features)

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
```

### 2. Create Virtual Environment

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
pip install -e .
```

### 4. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your specific configuration.

## Configuration Sections

### System Configuration

```bash
# Basic system settings
ENVIRONMENT=development  # Options: development, staging, production
LOG_LEVEL=INFO          # Options: DEBUG, INFO, WARNING, ERROR, CRITICAL
DEBUG=False
```

**Development**: Local development with hot-reload and detailed logging
**Staging**: Pre-production testing environment
**Production**: Production deployment with optimized settings

### Google Cloud Platform

#### Required Setup

1. **Create GCP Project**:
   ```bash
   gcloud projects create infinity-matrix-[unique-id]
   gcloud config set project infinity-matrix-[unique-id]
   ```

2. **Enable Required APIs**:
   ```bash
   gcloud services enable aiplatform.googleapis.com
   gcloud services enable secretmanager.googleapis.com
   gcloud services enable firestore.googleapis.com
   gcloud services enable storage.googleapis.com
   gcloud services enable pubsub.googleapis.com
   ```

3. **Create Service Account**:
   ```bash
   gcloud iam service-accounts create vision-cortex \
       --display-name="Vision Cortex Service Account"
   
   gcloud projects add-iam-policy-binding infinity-matrix-[unique-id] \
       --member="serviceAccount:vision-cortex@infinity-matrix-[unique-id].iam.gserviceaccount.com" \
       --role="roles/aiplatform.user"
   
   # Add other required roles...
   ```

4. **Create and Download Key**:
   ```bash
   gcloud iam service-accounts keys create ~/gcp-credentials.json \
       --iam-account=vision-cortex@infinity-matrix-[unique-id].iam.gserviceaccount.com
   ```

#### Configuration

```bash
# Google Cloud Platform
GCP_PROJECT_ID=infinity-matrix-[unique-id]
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/gcp-credentials.json

# Google Secret Manager
USE_SECRET_MANAGER=True
SECRET_PROJECT_ID=infinity-matrix-[unique-id]
```

### AI Services

#### OpenAI Configuration

1. **Get API Key**: Visit https://platform.openai.com/api-keys
2. **Configure**:
   ```bash
   OPENAI_API_KEY=sk-...your-key...
   OPENAI_MODEL=gpt-4-turbo-preview
   ```

#### Anthropic Configuration

1. **Get API Key**: Visit https://console.anthropic.com/
2. **Configure**:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-...your-key...
   ```

#### Google Vertex AI

```bash
VERTEX_AI_PROJECT=infinity-matrix-[unique-id]
VERTEX_AI_LOCATION=us-central1
```

### GitHub Integration

#### Setup OAuth App

1. **Create OAuth App**: 
   - Go to https://github.com/settings/apps/new
   - Set Homepage URL: `https://infinityxai.com`
   - Set Callback URL: `https://infinityxai.com/auth/callback`
   - Set Webhook URL: `https://infinityxai.com/webhooks/github`

2. **Get Token**:
   - Go to https://github.com/settings/tokens
   - Generate new token with repo, workflow, admin:org permissions

3. **Configure**:
   ```bash
   GITHUB_TOKEN=ghp_...your-token...
   GITHUB_ORG=InfinityXOneSystems
   GITHUB_REPO=infinity-matrix
   ```

### Communication Services

#### Twilio

1. **Sign up**: https://www.twilio.com/
2. **Get credentials** from console
3. **Configure**:
   ```bash
   TWILIO_ACCOUNT_SID=AC...your-sid...
   TWILIO_AUTH_TOKEN=...your-token...
   TWILIO_PHONE_NUMBER=+1234567890
   ```

#### SendGrid

1. **Sign up**: https://sendgrid.com/
2. **Create API key**
3. **Configure**:
   ```bash
   SENDGRID_API_KEY=SG...your-key...
   SENDGRID_FROM_EMAIL=noreply@infinityxai.com
   ```

### Google Workspace

#### Setup

1. **Enable APIs** in Google Cloud Console:
   - Google Calendar API
   - Google Drive API
   - Gmail API

2. **Create OAuth credentials**

3. **Configure**:
   ```bash
   GOOGLE_CALENDAR_ID=primary
   GOOGLE_DRIVE_FOLDER_ID=...folder-id...
   ```

### Database Configuration

#### PostgreSQL (Optional)

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/infinity_matrix
```

#### Redis

```bash
REDIS_URL=redis://localhost:6379/0
```

#### Firestore

```bash
FIRESTORE_COLLECTION=infinity_matrix
```

### API & Web Configuration

```bash
# API Server
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4

# Web Interface
WEB_HOST=0.0.0.0
WEB_PORT=3000
DOMAIN=infinityxai.com
```

### Monitoring

```bash
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
ENABLE_MONITORING=True
```

### Feature Flags

```bash
# Enable/disable features
ENABLE_AUTO_PR=True
ENABLE_AUTO_DEPLOY=False
ENABLE_SELF_UPGRADE=False
ENABLE_COST_OPTIMIZATION=True
```

### Agent Configuration

```bash
AGENT_EXECUTION_TIMEOUT=300
AGENT_MAX_RETRIES=3
AGENT_DEBATE_ROUNDS=3
```

### SOP Configuration

```bash
AUTO_GENERATE_SOP=True
SOP_OUTPUT_PATH=docs/tracking/sops
```

## Secret Management

### Using Google Secret Manager (Recommended for Production)

1. **Store secrets**:
   ```bash
   echo -n "your-secret-value" | gcloud secrets create secret-name --data-file=-
   ```

2. **Grant access**:
   ```bash
   gcloud secrets add-iam-policy-binding secret-name \
       --member="serviceAccount:vision-cortex@project.iam.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"
   ```

3. **Enable in config**:
   ```bash
   USE_SECRET_MANAGER=True
   ```

### Using Environment Variables (Development)

For development, store secrets in `.env` file (never commit this file!).

## Validation

### Run System Audit

```bash
python scripts/setup/system_auditor.py
```

This will:
- Check system requirements
- Validate configuration
- Identify missing components
- Provide recommendations

### Test Configuration

```bash
# Test basic functionality
python -c "from ai_stack.vision_cortex.config import Config; c = Config(); print(c.validate())"

# Run tests
pytest tests/test_config.py -v
```

## Environment-Specific Configurations

### Development

```bash
ENVIRONMENT=development
DEBUG=True
LOG_LEVEL=DEBUG
ENABLE_AUTO_DEPLOY=False
ENABLE_SELF_UPGRADE=False
```

### Staging

```bash
ENVIRONMENT=staging
DEBUG=False
LOG_LEVEL=INFO
ENABLE_AUTO_DEPLOY=True
ENABLE_SELF_UPGRADE=False
```

### Production

```bash
ENVIRONMENT=production
DEBUG=False
LOG_LEVEL=WARNING
ENABLE_AUTO_DEPLOY=True
ENABLE_SELF_UPGRADE=True
USE_SECRET_MANAGER=True
```

## Docker Configuration

### Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Custom Docker Configuration

Edit `docker-compose.yml` to customize:
- Port mappings
- Environment variables
- Volume mounts
- Resource limits

## Troubleshooting

### Common Issues

#### 1. Import Errors
```bash
# Ensure package is installed
pip install -e .

# Check PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

#### 2. Permission Errors
```bash
# Fix permissions on data directories
chmod -R 755 data/
```

#### 3. GCP Authentication Errors
```bash
# Re-authenticate
gcloud auth login
gcloud auth application-default login

# Verify credentials
gcloud auth list
```

#### 4. Port Already in Use
```bash
# Change port in .env or docker-compose.yml
API_PORT=8001
```

### Getting Help

- Check logs: `tail -f data/logs/vision_cortex_*.log`
- Run audit: `python scripts/setup/system_auditor.py`
- Check documentation: See `docs/` directory
- GitHub Issues: Report problems or ask questions

## Security Best Practices

1. **Never commit secrets**: Always use `.env` (gitignored)
2. **Rotate credentials**: Regular rotation (90 days recommended)
3. **Use Secret Manager**: For production deployments
4. **Limit permissions**: Principle of least privilege
5. **Enable audit logging**: Track all access and changes
6. **Use HTTPS**: For all external communications
7. **Regular updates**: Keep dependencies up to date

## Next Steps

After configuration:

1. **Run system audit**: `python scripts/setup/system_auditor.py`
2. **Run tests**: `make test`
3. **Start system**: `make run` or `docker-compose up`
4. **Access API**: http://localhost:8000/docs
5. **Monitor logs**: `tail -f data/logs/vision_cortex_*.log`

## Additional Resources

- [Architecture Blueprint](blueprint.md)
- [Development Roadmap](roadmap.md)
- [Collaboration Guide](../COLLABORATION.md)
- [API Documentation](api.md)
- [Deployment Guide](deployment.md)

---

Last Updated: December 30, 2024
