# Infinity-Matrix Setup Instructions

## Overview

This comprehensive guide provides step-by-step instructions for setting up the Infinity-Matrix autonomous development system. It covers onboarding for both AI agents and human developers, including GitHub App/OAuth setup, Hostinger configuration, VS Code integration, credential management, cloud sync, and automated CI/CD.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [GitHub Setup](#github-setup)
4. [Hostinger Configuration](#hostinger-configuration)
5. [Google Cloud Setup](#google-cloud-setup)
6. [Supabase Configuration](#supabase-configuration)
7. [VS Code Extension Setup](#vs-code-extension-setup)
8. [Credential Management](#credential-management)
9. [CI/CD Configuration](#cicd-configuration)
10. [Agent Onboarding](#agent-onboarding)
11. [Human Developer Onboarding](#human-developer-onboarding)
12. [Verification & Testing](#verification--testing)
13. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Git**: Version 2.40+ ([Download](https://git-scm.com/downloads))
- **Node.js**: Version 18+ ([Download](https://nodejs.org/))
- **Docker**: Version 24+ ([Download](https://www.docker.com/products/docker-desktop))
- **VS Code**: Latest version ([Download](https://code.visualstudio.com/))

### Required Accounts

- **GitHub**: Organization or personal account with admin access
- **Hostinger**: Web hosting account with infinityxai.com domain
- **Google Cloud**: GCP account with billing enabled
- **Supabase**: Free or pro account

### Required Permissions

- GitHub: Repository admin, workflow permissions
- GCP: Project editor or owner
- Supabase: Project owner
- Hostinger: FTP/SFTP access, control panel access

---

## Quick Start

For experienced developers who want to get started quickly:

```bash
# 1. Clone repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Configure credentials (edit .env file)
nano .env

# 5. Initialize system
npm run init

# 6. Generate system manifest
npm run manifest

# 7. Run tests
npm test

# 8. Start development server
npm run dev
```

For detailed setup, continue with the sections below.

---

## GitHub Setup

### Step 1: Repository Setup

1. **Fork or Clone Repository**:
   ```bash
   git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
   cd infinity-matrix
   ```

2. **Configure Git**:
   ```bash
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   ```

3. **Create Development Branch**:
   ```bash
   git checkout -b setup/initial-configuration
   ```

### Step 2: GitHub App Creation

1. Navigate to **GitHub Settings** → **Developer settings** → **GitHub Apps**
2. Click **New GitHub App**
3. Configure the app:
   - **GitHub App name**: `Infinity-Matrix Automation`
   - **Homepage URL**: `https://infinityxai.com`
   - **Webhook URL**: `https://infinityxai.com/api/github/webhook`
   - **Webhook secret**: Generate a secure secret (save this!)

4. **Set Permissions**:
   - Repository permissions:
     - Contents: Read & Write
     - Issues: Read & Write
     - Pull requests: Read & Write
     - Actions: Read & Write
     - Workflows: Read & Write
   - Organization permissions:
     - Members: Read
     - Projects: Read & Write

5. **Subscribe to Events**:
   - [x] Push
   - [x] Pull request
   - [x] Issues
   - [x] Workflow run
   - [x] Workflow job

6. Click **Create GitHub App**
7. **Generate Private Key**:
   - Scroll down to "Private keys"
   - Click "Generate a private key"
   - Download the `.pem` file (save securely!)

8. **Install the App**:
   - Click "Install App"
   - Select your organization/repositories
   - Authorize the installation

### Step 3: GitHub OAuth App (for User Authentication)

1. Navigate to **Settings** → **Developer settings** → **OAuth Apps**
2. Click **New OAuth App**
3. Configure:
   - **Application name**: `Infinity-Matrix Auth`
   - **Homepage URL**: `https://infinityxai.com`
   - **Authorization callback URL**: `https://infinityxai.com/auth/github/callback`
4. Click **Register application**
5. **Save Client ID and Client Secret** (you'll need these later)

### Step 4: Configure GitHub Secrets

1. Navigate to repository **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:

   ```
   GITHUB_APP_ID: <your-app-id>
   GITHUB_APP_PRIVATE_KEY: <contents-of-pem-file>
   GITHUB_OAUTH_CLIENT_ID: <oauth-client-id>
   GITHUB_OAUTH_CLIENT_SECRET: <oauth-client-secret>
   GCP_PROJECT_ID: <your-gcp-project-id>
   GCP_SERVICE_ACCOUNT_KEY: <service-account-json>
   SUPABASE_URL: <your-supabase-url>
   SUPABASE_KEY: <your-supabase-anon-key>
   SUPABASE_SERVICE_KEY: <your-supabase-service-key>
   HOSTINGER_FTP_HOST: <ftp.yourdomain.com>
   HOSTINGER_FTP_USER: <your-ftp-username>
   HOSTINGER_FTP_PASS: <your-ftp-password>
   ```

### Step 5: Enable GitHub Actions

1. Navigate to **Settings** → **Actions** → **General**
2. Under "Actions permissions", select:
   - ✅ Allow all actions and reusable workflows
3. Under "Workflow permissions", select:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

---

## Hostinger Configuration

### Step 1: Access Hostinger Control Panel

1. Log in to [Hostinger Control Panel](https://hpanel.hostinger.com)
2. Select your hosting plan for `infinityxai.com`

### Step 2: Domain Configuration

1. Navigate to **Domains** → **infinityxai.com**
2. **DNS Configuration**:
   ```
   Type    Name    Value                       TTL
   A       @       <your-server-ip>            14400
   A       www     <your-server-ip>            14400
   CNAME   api     <cloud-run-url>             14400
   TXT     @       "v=spf1 include:_spf.google.com ~all"  14400
   ```

3. **SSL Certificate**:
   - Navigate to **SSL** section
   - Enable **Free SSL Certificate** (Let's Encrypt)
   - Wait for activation (5-15 minutes)

### Step 3: FTP/SFTP Setup

1. Navigate to **Files** → **FTP Accounts**
2. Create new FTP account:
   - **Username**: `infinity-matrix`
   - **Password**: Generate strong password
   - **Directory**: `/public_html`
   - **Protocol**: SFTP (if available) or FTP with TLS

3. **Test Connection**:
   ```bash
   sftp infinity-matrix@ftp.infinityxai.com
   # Enter password when prompted
   sftp> ls
   sftp> exit
   ```

### Step 4: Web Portal Setup

1. **Create Portal Directory**:
   ```bash
   ssh infinity-matrix@infinityxai.com
   mkdir -p /public_html/portal
   ```

2. **Upload Portal Files** (automated via CI/CD later):
   ```bash
   rsync -avz --delete ./portal/ infinity-matrix@infinityxai.com:/public_html/portal/
   ```

3. **Configure PHP** (if using PHP):
   - Navigate to **Advanced** → **PHP Configuration**
   - Set PHP version: 8.2+
   - Enable extensions: mysqli, pdo_mysql, curl, json

### Step 5: Database Setup (if needed)

1. Navigate to **Databases** → **MySQL Databases**
2. Create database:
   - **Database name**: `infinity_matrix`
   - **Username**: `infinity_user`
   - **Password**: Generate strong password
3. **Save credentials** to GitHub Secrets

---

## Google Cloud Setup

### Step 1: Create GCP Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project:
   - **Project name**: `infinity-matrix-prod`
   - **Project ID**: `infinity-matrix-prod` (or auto-generated)
3. **Enable Billing** for the project

### Step 2: Enable Required APIs

```bash
gcloud config set project infinity-matrix-prod

gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudscheduler.googleapis.com \
  cloudfunctions.googleapis.com \
  storage.googleapis.com \
  cloudlogging.googleapis.com \
  cloudmonitoring.googleapis.com \
  secretmanager.googleapis.com
```

### Step 3: Create Service Account

```bash
# Create service account
gcloud iam service-accounts create infinity-matrix-sa \
  --display-name="Infinity Matrix Service Account"

# Assign roles
PROJECT_ID="infinity-matrix-prod"
SA_EMAIL="infinity-matrix-sa@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/editor"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.admin"

# Create and download key
gcloud iam service-accounts keys create ./gcp-key.json \
  --iam-account=${SA_EMAIL}

# Add to GitHub Secrets (copy contents of gcp-key.json)
```

### Step 4: Configure Artifact Registry

```bash
# Create repository for Docker images
gcloud artifacts repositories create infinity-matrix \
  --repository-format=docker \
  --location=us-central1 \
  --description="Infinity Matrix container images"

# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### Step 5: Set Up Cloud Storage

```bash
# Create bucket for artifacts
gsutil mb -l us-central1 gs://infinity-matrix-artifacts

# Create bucket for system manifests
gsutil mb -l us-central1 gs://infinity-matrix-manifests

# Set lifecycle policy (delete old artifacts after 90 days)
cat > lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 90}
      }
    ]
  }
}
EOF

gsutil lifecycle set lifecycle.json gs://infinity-matrix-artifacts
```

### Step 6: Set Up Secret Manager

```bash
# Store secrets in Secret Manager
echo -n "your-github-token" | gcloud secrets create github-token --data-file=-
echo -n "your-supabase-key" | gcloud secrets create supabase-key --data-file=-
echo -n "your-hostinger-password" | gcloud secrets create hostinger-ftp-pass --data-file=-
```

---

## Supabase Configuration

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **New Project**
3. Configure:
   - **Name**: `infinity-matrix`
   - **Database Password**: Generate strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free tier
4. Wait for project to initialize (2-3 minutes)

### Step 2: Get API Credentials

1. Navigate to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGci...`
   - **service_role key**: `eyJhbGci...` (keep secret!)

3. Add to `.env`:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_KEY=eyJhbGci...
   ```

### Step 3: Set Up Database Schema

1. Navigate to **SQL Editor**
2. Create schema:

   ```sql
   -- Agent tasks table
   CREATE TABLE agent_tasks (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     prompt_id TEXT NOT NULL,
     context JSONB,
     status TEXT DEFAULT 'pending',
     priority INTEGER DEFAULT 5,
     assigned_to TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     started_at TIMESTAMP,
     completed_at TIMESTAMP,
     result JSONB,
     error TEXT
   );

   -- System manifests table
   CREATE TABLE system_manifests (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     manifest_id UUID UNIQUE NOT NULL,
     hostname TEXT NOT NULL,
     manifest_data JSONB NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Build history table
   CREATE TABLE builds (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     project_id UUID NOT NULL,
     branch TEXT NOT NULL,
     commit_sha TEXT NOT NULL,
     status TEXT DEFAULT 'pending',
     started_at TIMESTAMP DEFAULT NOW(),
     completed_at TIMESTAMP,
     duration_seconds INTEGER,
     artifacts JSONB,
     logs TEXT
   );

   -- Deployment history table
   CREATE TABLE deployments (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     build_id UUID REFERENCES builds(id),
     environment TEXT NOT NULL,
     status TEXT DEFAULT 'pending',
     deployed_at TIMESTAMP DEFAULT NOW(),
     deployed_by TEXT,
     rollback_id UUID,
     health_check_passed BOOLEAN
   );

   -- Metrics table
   CREATE TABLE metrics (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     metric_name TEXT NOT NULL,
     metric_value NUMERIC,
     labels JSONB,
     timestamp TIMESTAMP DEFAULT NOW()
   );

   -- Create indexes
   CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
   CREATE INDEX idx_agent_tasks_priority ON agent_tasks(priority DESC);
   CREATE INDEX idx_builds_status ON builds(status);
   CREATE INDEX idx_deployments_environment ON deployments(environment);
   CREATE INDEX idx_metrics_name_timestamp ON metrics(metric_name, timestamp DESC);

   -- Enable Row Level Security
   ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
   ALTER TABLE system_manifests ENABLE ROW LEVEL SECURITY;
   ALTER TABLE builds ENABLE ROW LEVEL SECURITY;
   ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
   ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

   -- Create policies (allow service role full access)
   CREATE POLICY "Service role can do anything" ON agent_tasks
     FOR ALL USING (auth.role() = 'service_role');
   
   CREATE POLICY "Service role can do anything" ON system_manifests
     FOR ALL USING (auth.role() = 'service_role');
   
   CREATE POLICY "Service role can do anything" ON builds
     FOR ALL USING (auth.role() = 'service_role');
   
   CREATE POLICY "Service role can do anything" ON deployments
     FOR ALL USING (auth.role() = 'service_role');
   
   CREATE POLICY "Service role can do anything" ON metrics
     FOR ALL USING (auth.role() = 'service_role');
   ```

### Step 4: Set Up Storage Buckets

1. Navigate to **Storage**
2. Create buckets:
   - `artifacts`: For build artifacts
   - `logs`: For log files
   - `manifests`: For system manifests

3. Configure bucket policies (make public or restrict as needed)

### Step 5: Set Up Authentication

1. Navigate to **Authentication** → **Providers**
2. Enable **GitHub OAuth**:
   - **Client ID**: From GitHub OAuth app
   - **Client Secret**: From GitHub OAuth app
   - **Redirect URL**: Copy and add to GitHub OAuth app settings

---

## VS Code Extension Setup

### Step 1: Install VS Code Extension

```bash
# Clone extension repository (if separate) or use local
cd vscode-extension

# Install dependencies
npm install

# Build extension
npm run build

# Package extension
npm run package
```

### Step 2: Install Extension Locally

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Install from VSIX"
4. Select the generated `.vsix` file

### Step 3: Configure Extension

1. Open VS Code Settings (`Ctrl+,`)
2. Search for "Infinity Matrix"
3. Configure:
   ```json
   {
     "infinityMatrix.apiUrl": "https://infinityxai.com/api",
     "infinityMatrix.supabaseUrl": "https://xxxxx.supabase.co",
     "infinityMatrix.supabaseKey": "your-anon-key",
     "infinityMatrix.autoSync": true,
     "infinityMatrix.promptSuitePath": "./docs/prompt_suite.md"
   }
   ```

### Step 4: Authenticate Extension

1. Press `Ctrl+Shift+P`
2. Type "Infinity Matrix: Authenticate"
3. Follow GitHub OAuth flow
4. Verify connection successful

---

## Credential Management

### Environment Variables

Create `.env` file in project root:

```env
# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_OAUTH_CLIENT_ID=Iv1.xxxxxxxxxxxxx
GITHUB_OAUTH_CLIENT_SECRET=xxxxxxxxxxxxx

# Google Cloud
GCP_PROJECT_ID=infinity-matrix-prod
GOOGLE_APPLICATION_CREDENTIALS=./gcp-key.json

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...

# Hostinger
HOSTINGER_FTP_HOST=ftp.infinityxai.com
HOSTINGER_FTP_USER=infinity-matrix
HOSTINGER_FTP_PASS=xxxxxxxxxxxxx

# Application
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

### Secure Storage

**Never commit `.env` to Git!** Add to `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
*.key
*.pem
gcp-key.json
```

### Credential Rotation

Set up automatic rotation:

```bash
# Add to crontab (monthly rotation)
0 0 1 * * /path/to/infinity-matrix/scripts/rotate-credentials.sh
```

---

## CI/CD Configuration

### Step 1: Create GitHub Actions Workflows

Create `.github/workflows/ci.yml`:

```yaml
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Build application
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: dist/
```

Create `.github/workflows/cd.yml`:

```yaml
name: Continuous Deployment

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
        with:
          service_account_key: ${{ secrets.GCP_SERVICE_ACCOUNT_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      
      - name: Build and push Docker image
        run: |
          gcloud builds submit --tag us-central1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/infinity-matrix/app:${{ github.sha }}
      
      - name: Deploy to Cloud Run (Staging)
        run: |
          gcloud run deploy infinity-matrix-staging \
            --image us-central1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/infinity-matrix/app:${{ github.sha }} \
            --region us-central1 \
            --platform managed
  
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Cloud Run (Production)
        run: |
          gcloud run deploy infinity-matrix \
            --image us-central1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/infinity-matrix/app:${{ github.sha }} \
            --region us-central1 \
            --platform managed
      
      - name: Deploy to Hostinger
        run: |
          echo "${{ secrets.HOSTINGER_FTP_PASS }}" | \
          lftp -u "${{ secrets.HOSTINGER_FTP_USER }}" \
               "${{ secrets.HOSTINGER_FTP_HOST }}" \
               -e "mirror -R dist/ /public_html/; quit"
```

---

## Agent Onboarding

### Step 1: Initialize Agent

```bash
# Run agent initialization
npm run agent:init

# This will:
# 1. Generate system manifest
# 2. Check credentials
# 3. Test connectivity to all services
# 4. Register agent with orchestrator
```

### Step 2: Configure Agent Parameters

Edit `agent-config.json`:

```json
{
  "agent_id": "auto-generated-uuid",
  "agent_type": "orchestrator",
  "capabilities": [
    "task_scheduling",
    "agent_coordination",
    "resource_allocation"
  ],
  "autonomy_level": "high",
  "escalation_rules": {
    "level_3_threshold": 3,
    "level_4_services": ["production_deployment", "security_incident"]
  },
  "resource_limits": {
    "max_concurrent_tasks": 10,
    "max_task_duration_minutes": 60
  },
  "learning_config": {
    "enabled": true,
    "feedback_weight": 0.3,
    "success_threshold": 0.9
  }
}
```

### Step 3: Start Agent

```bash
# Start agent in development mode
npm run agent:dev

# Start agent in production mode
npm run agent:start

# Check agent status
npm run agent:status
```

---

## Human Developer Onboarding

### Step 1: Repository Access

1. Request access from repository admin
2. Accept invitation to organization
3. Clone repository:
   ```bash
   git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
   ```

### Step 2: Environment Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Request credentials from team lead
# Edit .env with provided credentials

# Initialize local environment
npm run init
```

### Step 3: Install Development Tools

```bash
# Install recommended VS Code extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-azuretools.vscode-docker

# Install Infinity Matrix extension
code --install-extension infinity-matrix-agent.vsix
```

### Step 4: Read Documentation

Required reading:
1. [Blueprint](./docs/blueprint.md) - Understand architecture
2. [Roadmap](./docs/roadmap.md) - Know the plan
3. [Prompt Suite](./docs/prompt_suite.md) - Learn agent prompts
4. [Collaboration Guide](./COLLABORATION.md) - Understand workflows

### Step 5: First Task

```bash
# Create feature branch
git checkout -b feature/my-first-feature

# Make changes
# ...

# Run tests
npm test

# Commit and push
git add .
git commit -m "feat: my first feature"
git push origin feature/my-first-feature

# Create pull request on GitHub
```

---

## Verification & Testing

### System Health Check

```bash
# Run comprehensive health check
npm run health-check

# Expected output:
✓ GitHub API connection
✓ GCP connectivity
✓ Supabase connection
✓ Hostinger FTP access
✓ All credentials configured
✓ CI/CD pipelines active
✓ Agents operational
```

### Test Deployments

```bash
# Test staging deployment
npm run deploy:staging

# Test production deployment (requires approval)
npm run deploy:production
```

### Agent Testing

```bash
# Test agent execution
npm run agent:test

# Test specific prompt
npm run agent:execute -- --prompt=INIT-001
```

---

## Troubleshooting

### Common Issues

#### Issue: GitHub Actions not triggering

**Solution**:
1. Check workflow file syntax
2. Verify repository permissions
3. Check if Actions are enabled in repo settings

#### Issue: Cannot connect to Supabase

**Solution**:
1. Verify URL and keys in `.env`
2. Check network connectivity
3. Verify project is not paused (free tier)

#### Issue: GCP authentication failing

**Solution**:
1. Verify service account key file exists
2. Check key has correct permissions
3. Ensure `GOOGLE_APPLICATION_CREDENTIALS` is set

#### Issue: VS Code extension not working

**Solution**:
1. Reload VS Code window
2. Check extension logs: View → Output → Infinity Matrix
3. Verify authentication completed
4. Check API connectivity

### Getting Help

- **Documentation**: Check `/docs` folder
- **GitHub Issues**: Create issue with label `help wanted`
- **Slack**: #infinity-matrix-help channel
- **Email**: support@infinityxai.com

---

## Next Steps

After successful setup:

1. ✅ **Review Architecture**: Understand [blueprint](./docs/blueprint.md)
2. ✅ **Check Roadmap**: See [roadmap](./docs/roadmap.md) for upcoming work
3. ✅ **Learn Prompts**: Study [prompt suite](./docs/prompt_suite.md)
4. ✅ **Start Contributing**: Pick an issue and start coding!
5. ✅ **Join Team Meetings**: Weekly sync every Monday

---

## References

- [Blueprint](./docs/blueprint.md) - System architecture
- [Roadmap](./docs/roadmap.md) - Implementation plan
- [Prompt Suite](./docs/prompt_suite.md) - Agent prompts
- [System Manifest](./docs/system_manifest.md) - System inventory
- [Collaboration Guide](./COLLABORATION.md) - Team workflows

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-30  
**Maintained By**: Infinity-Matrix System

**Welcome to Infinity-Matrix! 🚀**
