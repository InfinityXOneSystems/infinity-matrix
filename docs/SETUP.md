# Setup Guide

This guide will help you set up Infinity Matrix for development and production use.

## Prerequisites

### Required Software
- **Node.js** 20.x or later
- **npm** 10.x or later
- **Python** 3.11 or later
- **Docker** 24.x or later
- **Docker Compose** 2.x or later
- **Git** 2.x or later

### Optional (for production)
- **Google Cloud SDK** (for GCP deployment)
- **GitHub CLI** (for GitHub integration)
- **Terraform** (for infrastructure as code)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd packages/server
pip install -r requirements.txt
cd ../..
```

### 3. Configure Environment

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-key-here
OPENAI_ORG_ID=org-your-org-here

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# GitHub Configuration
GITHUB_TOKEN=ghp_your-token-here

# Database (defaults for local development)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=infinity_matrix
POSTGRES_USER=infinity_matrix
POSTGRES_PASSWORD=changeme

# Redis (defaults for local development)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Start Infrastructure

Start PostgreSQL, Redis, and other services:

```bash
docker-compose up -d
```

Verify services are running:

```bash
docker-compose ps
```

### 5. Initialize Database

```bash
cd packages/server
# Run migrations (if using Alembic)
# alembic upgrade head
cd ../..
```

### 6. Start Development Server

```bash
# Start all services in development mode
npm run dev
```

The MCP server will be available at `http://localhost:3000`

### 7. Verify Installation

Check the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

## VS Code Extension Setup

### 1. Build the Extension

```bash
cd packages/vscode-extension
npm install
npm run compile
```

### 2. Install Locally

```bash
# Package the extension
npm run package

# Install in VS Code
code --install-extension infinity-matrix-1.0.0.vsix
```

### 3. Configure Extension

In VS Code:
1. Open Settings (Ctrl/Cmd + ,)
2. Search for "Infinity Matrix"
3. Configure:
   - Server URL: `http://localhost:3000`
   - Enabled Providers: Select your AI providers
   - Auto Sync: Enable if desired

## Google Cloud Setup

### 1. Create GCP Project

```bash
gcloud projects create infinity-matrix-prod
gcloud config set project infinity-matrix-prod
```

### 2. Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  aiplatform.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

### 3. Create Service Account

```bash
gcloud iam service-accounts create infinity-matrix-sa \
  --display-name="Infinity Matrix Service Account"

gcloud projects add-iam-policy-binding infinity-matrix-prod \
  --member="serviceAccount:infinity-matrix-sa@infinity-matrix-prod.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### 4. Create Secrets

```bash
# OpenAI API Key
echo -n "sk-your-key" | gcloud secrets create openai-api-key --data-file=-

# GitHub Token
echo -n "ghp-your-token" | gcloud secrets create github-token --data-file=-
```

### 5. Deploy to Cloud Run

```bash
export GOOGLE_CLOUD_PROJECT=infinity-matrix-prod
./scripts/deploy-gcp.sh
```

## GitHub Integration Setup

### 1. Create GitHub App

1. Go to GitHub Settings → Developer settings → GitHub Apps
2. Click "New GitHub App"
3. Fill in details:
   - Name: Infinity Matrix
   - Homepage URL: https://infinity-matrix.manus.im
   - Webhook URL: https://api.infinity-matrix.manus.im/api/v1/github/webhooks/github
   - Permissions:
     - Repository: Pull requests (Read & Write)
     - Repository: Contents (Read & Write)
     - Repository: Issues (Read & Write)

4. Generate and download private key
5. Note the App ID and Installation ID

### 2. Configure GitHub Secrets

In your repository settings, add these secrets:
- `GCP_SA_KEY`: Service account key JSON
- `GCP_PROJECT_ID`: Your GCP project ID
- `SNYK_TOKEN`: Snyk security scan token (optional)

## Hostinger Deployment

### 1. Prepare Hostinger Account

1. Log in to Hostinger control panel
2. Create FTP account or use existing
3. Note FTP credentials

### 2. Configure Environment

Add to `.env`:

```env
HOSTINGER_FTP_HOST=ftp.your-domain.com
HOSTINGER_FTP_USER=your-ftp-user
HOSTINGER_FTP_PASSWORD=your-ftp-password
```

### 3. Deploy

```bash
./scripts/deploy-hostinger.sh
```

## Production Deployment Checklist

Before deploying to production:

- [ ] Update all API keys and secrets
- [ ] Configure production database
- [ ] Set up monitoring and alerting
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up backups
- [ ] Test disaster recovery procedures
- [ ] Configure rate limiting
- [ ] Set up logging aggregation
- [ ] Review security settings
- [ ] Load test the application
- [ ] Document deployment procedures

## Monitoring Setup

### Prometheus

Metrics are exposed at `/metrics` endpoint.

Add to Prometheus config:

```yaml
scrape_configs:
  - job_name: 'infinity-matrix'
    static_configs:
      - targets: ['api.infinity-matrix.manus.im']
```

### Grafana

Import the provided dashboard:

```bash
# Dashboard JSON in infrastructure/grafana/dashboards/
```

### Logging

Configure log aggregation:

```env
SENTRY_DSN=https://your-sentry-dsn
DATADOG_API_KEY=your-datadog-key
```

## Troubleshooting

### Server won't start

Check logs:
```bash
docker-compose logs mcp-server
```

Common issues:
- Database connection failed: Check PostgreSQL is running
- Redis connection failed: Check Redis is running
- Port already in use: Change MCP_SERVER_PORT

### VS Code Extension not connecting

1. Check server is running: `curl http://localhost:3000/health`
2. Check extension settings: Server URL must match
3. Check browser console in VS Code: Help → Toggle Developer Tools

### Database migrations fail

Reset database (development only):
```bash
docker-compose down -v
docker-compose up -d
```

## Getting Help

- **Documentation**: Check `/docs` directory
- **Issues**: GitHub Issues for bugs
- **Discord**: Community chat (link in README)
- **Email**: support@infinityxone.systems

## Next Steps

- Read the [Architecture Documentation](docs/ARCHITECTURE.md)
- Explore the [API Documentation](docs/API.md)
- Review [Contributing Guidelines](CONTRIBUTING.md)
- Join our community on Discord
