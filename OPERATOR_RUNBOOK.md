# Infinity Matrix Admin System - Operator Runbook

## Table of Contents
1. [Quick Start](#quick-start)
2. [System Architecture](#system-architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Operations](#operations)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [AI Chat Configuration](#ai-chat-configuration)
9. [Agent Management](#agent-management)
10. [Backup and Recovery](#backup-and-recovery)

---

## Quick Start

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 20+ (for local development)
- Git

### Launch the System

```bash
# Clone the repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Launch with automated script
./launch.sh
```

The system will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

---

## System Architecture

### Components

#### Frontend (React/Vite)
- **Technology**: React 19 + TypeScript + Vite + TailwindCSS v4
- **Port**: 80 (nginx)
- **Features**:
  - Admin Dashboard
  - Agent Management Interface
  - AI Chat Interface (Vision Cortex)
  - System Monitoring
  - Real-time WebSocket updates

#### Backend (Node.js/Express)
- **Technology**: Node.js + Express + TypeScript + Socket.IO
- **Port**: 3000
- **Features**:
  - RESTful API
  - WebSocket server for real-time updates
  - AI provider integration (OpenAI, Anthropic, Ollama)
  - Agent orchestration
  - System metrics collection

### Data Flow
```
Client (Browser) <-> Nginx (Frontend) <-> Express (Backend) <-> AI Providers
                                      <-> WebSocket Server <-> Agents
```

---

## Installation

### Option 1: Docker (Recommended)

```bash
# 1. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Edit backend/.env with your API keys
nano backend/.env

# 3. Launch
./launch.sh
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

---

## Configuration

### Backend Configuration (.env)

#### Required Configuration
```env
# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=<generate-strong-secret-key>
```

#### AI Provider Configuration
```env
# OpenAI (Required for GPT models)
OPENAI_API_KEY=sk-...

# Anthropic (Required for Claude models)
ANTHROPIC_API_KEY=sk-ant-...

# Ollama (Local LLM)
OLLAMA_URL=http://localhost:11434
```

#### GitHub Integration (Optional)
```env
GITHUB_TOKEN=ghp_...
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY=<path-to-key>
```

### Frontend Configuration (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```

---

## Operations

### Starting the System

```bash
# Docker
docker-compose up -d

# Or use launch script
./launch.sh
```

### Stopping the System

```bash
# Docker
docker-compose down

# With volume cleanup
docker-compose down -v
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Restarting Services

```bash
# Restart all
docker-compose restart

# Restart backend
docker-compose restart backend

# Restart frontend
docker-compose restart frontend
```

---

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health

# System status
curl http://localhost:3000/api/system/status

# Agent status
curl http://localhost:3000/api/agents
```

### System Metrics

The dashboard provides real-time metrics:
- CPU Usage
- Memory Usage
- Network Activity
- Agent Status
- Active Connections

### Logs

#### Application Logs
```bash
# Follow logs in real-time
docker-compose logs -f

# Export logs to file
docker-compose logs > logs.txt
```

#### Error Logs
Errors are logged to console and can be viewed with:
```bash
docker-compose logs backend | grep -i error
```

---

## Troubleshooting

### Backend Won't Start

**Symptoms**: Backend container exits immediately

**Solutions**:
1. Check environment configuration:
   ```bash
   docker-compose logs backend
   ```

2. Verify .env file exists:
   ```bash
   ls -la backend/.env
   ```

3. Check port availability:
   ```bash
   lsof -i :3000
   ```

### Frontend Won't Load

**Symptoms**: Cannot access http://localhost

**Solutions**:
1. Check if frontend container is running:
   ```bash
   docker-compose ps
   ```

2. Verify backend is healthy:
   ```bash
   curl http://localhost:3000/health
   ```

3. Check nginx logs:
   ```bash
   docker-compose logs frontend
   ```

### WebSocket Connection Fails

**Symptoms**: Real-time updates not working

**Solutions**:
1. Check browser console for errors
2. Verify WebSocket endpoint:
   ```bash
   curl http://localhost:3000/socket.io/
   ```
3. Check CORS configuration in backend/.env

### AI Chat Not Working

**Symptoms**: "Error processing request" in chat

**Solutions**:
1. Verify API keys are set:
   ```bash
   docker-compose exec backend printenv | grep API_KEY
   ```

2. Check AI provider status:
   ```bash
   curl http://localhost:3000/api/ai/models
   ```

3. Test individual providers:
   - OpenAI: https://platform.openai.com/account/usage
   - Anthropic: https://console.anthropic.com/
   - Ollama: `curl http://localhost:11434/api/tags`

### Agent Not Starting

**Symptoms**: Agent status shows "error" or "offline"

**Solutions**:
1. Check agent logs in system logs
2. Restart the agent from the dashboard
3. Check system resources (CPU, memory)

---

## AI Chat Configuration

### OpenAI Setup

1. Get API key from https://platform.openai.com/api-keys
2. Add to backend/.env:
   ```env
   OPENAI_API_KEY=sk-...
   ```
3. Restart backend
4. Available models:
   - GPT-4
   - GPT-3.5 Turbo

### Anthropic (Claude) Setup

1. Get API key from https://console.anthropic.com/
2. Add to backend/.env:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Restart backend
4. Available models:
   - Claude 3 Opus
   - Claude 3 Sonnet

### Local Ollama Setup

1. Install Ollama: https://ollama.ai/download
2. Pull a model:
   ```bash
   ollama pull llama2
   ollama pull codellama
   ollama pull mistral
   ```
3. Configure backend/.env:
   ```env
   OLLAMA_URL=http://localhost:11434
   ```
4. Restart backend
5. Models will appear in the AI chat interface

### Hybrid Configuration

You can enable all providers simultaneously:
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_URL=http://localhost:11434
```

Users can switch between models in the chat interface.

---

## Agent Management

### Creating an Agent

1. Navigate to **Agents** page
2. Click **Add Agent**
3. Configure:
   - Name
   - Type (coding, data-gathering, monitoring, analysis)
   - Capabilities
4. Click **Create**

### Starting/Stopping Agents

#### Via Dashboard
1. Go to **Agents** page
2. Click **Start** or **Stop** button on agent card

#### Via API
```bash
# Start agent
curl -X POST http://localhost:3000/api/agents/{id}/start

# Stop agent
curl -X POST http://localhost:3000/api/agents/{id}/stop
```

### Monitoring Agent Performance

Each agent displays:
- **Status**: active, idle, error, offline
- **Current Task**: What the agent is working on
- **Metrics**:
  - Tasks Completed
  - Tasks In Progress
  - Tasks Failed
  - CPU Usage
  - Memory Usage

---

## Backup and Recovery

### Data Backup

Currently, the system uses in-memory storage. For production:

1. **Chat History**: Store in database or export periodically
2. **Agent Configuration**: Export via API
3. **System Configuration**: Backup .env files

#### Export Agent Configuration
```bash
curl http://localhost:3000/api/agents > agents-backup.json
```

### System Recovery

#### From Docker
```bash
# Stop system
docker-compose down

# Pull latest images
docker-compose pull

# Restart with fresh state
docker-compose up -d
```

#### From Backup
```bash
# Restore configuration files
cp backup/.env backend/.env
cp backup/agents.json data/agents.json

# Restart system
./launch.sh
```

---

## Deployment to Hostinger

### Prerequisites
- Hostinger VPS or Cloud Hosting
- SSH access
- Docker support enabled

### Deployment Steps

1. **Connect to Server**:
   ```bash
   ssh user@your-hostinger-server.com
   ```

2. **Install Dependencies**:
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Clone Repository**:
   ```bash
   git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
   cd infinity-matrix
   ```

4. **Configure**:
   ```bash
   # Backend configuration
   cp backend/.env.example backend/.env
   nano backend/.env
   # Update:
   # - API keys
   # - JWT secret
   # - CORS origin (your domain)
   
   # Frontend configuration
   cp frontend/.env.example frontend/.env
   nano frontend/.env
   # Update API URLs to your domain
   ```

5. **Launch**:
   ```bash
   ./launch.sh
   ```

6. **Configure Firewall**:
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 3000/tcp
   ```

7. **Set Up SSL (Optional but Recommended)**:
   ```bash
   # Install certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Get certificate
   sudo certbot --nginx -d your-domain.com
   ```

8. **Configure Auto-Start**:
   ```bash
   # Create systemd service
   sudo nano /etc/systemd/system/infinity-matrix.service
   ```
   
   Add:
   ```ini
   [Unit]
   Description=Infinity Matrix Admin System
   Requires=docker.service
   After=docker.service
   
   [Service]
   Type=oneshot
   RemainAfterExit=yes
   WorkingDirectory=/home/user/infinity-matrix
   ExecStart=/usr/local/bin/docker-compose up -d
   ExecStop=/usr/local/bin/docker-compose down
   
   [Install]
   WantedBy=multi-user.target
   ```
   
   Enable:
   ```bash
   sudo systemctl enable infinity-matrix
   sudo systemctl start infinity-matrix
   ```

---

## Maintenance

### Updating the System

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Database Maintenance

When database is integrated:
```bash
# Backup database
docker-compose exec backend npm run db:backup

# Restore database
docker-compose exec backend npm run db:restore backup.sql
```

### Log Rotation

```bash
# Clean old logs
docker-compose logs --tail=0 > /dev/null

# Or configure Docker log rotation
# Edit /etc/docker/daemon.json:
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

---

## Support

For issues or questions:
1. Check this runbook
2. Review logs: `docker-compose logs`
3. Check GitHub Issues: https://github.com/InfinityXOneSystems/infinity-matrix/issues
4. Contact support

---

**Last Updated**: December 2025
**Version**: 1.0.0
