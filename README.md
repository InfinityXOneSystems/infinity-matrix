# Infinity Matrix Admin System

> Enterprise-grade React/Vite admin system with comprehensive AI Vision Cortex, intelligent agent mesh, and 24/7 operational capabilities

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](docker-compose.yml)
[![Node](https://img.shields.io/badge/node-20%2B-green.svg)](package.json)

## 🚀 Features

### Frontend
- **Modern Stack**: React 19 + TypeScript + Vite + TailwindCSS v4
- **Responsive Dashboard**: Real-time monitoring and management interface
- **Agent Management**: Full CRUD operations for intelligent agents
- **System Monitoring**: Live metrics, alerts, and health status
- **Production-Ready**: Optimized builds, code splitting, lazy loading

### Vision Cortex AI Chat
- **Multi-Provider Support**: OpenAI (GPT-4, GPT-3.5), Anthropic (Claude 3), Ollama (Local)
- **Model Switching**: Seamless switching between AI models in real-time
- **Persistent Sessions**: Chat history saved and retrievable
- **Autonomous Features**:
  - Code execution capabilities
  - GitHub integration for repo operations
  - Page navigation and access
  - Context-aware responses
- **24/7 Availability**: Always-on AI assistance

### Backend Intelligence
- **Agent Orchestration**: Manage multiple intelligent agents simultaneously
- **Real-time Communication**: WebSocket-based updates for instant feedback
- **RESTful API**: Comprehensive API for all operations
- **Data Gathering**: Automated data collection from multiple sources
- **System Metrics**: CPU, memory, network, and service monitoring

### Deployment
- **Docker Support**: Fully containerized with Docker Compose
- **Hostinger Ready**: Optimized for Hostinger VPS/Cloud deployment
- **One-Command Launch**: Automated setup and deployment script
- **Health Checks**: Built-in health monitoring and auto-recovery
- **Production Grade**: Security, performance, and reliability built-in

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 20+ (for local development)
- Git

## 🎯 Quick Start

### Launch with One Command

```bash
# Clone the repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Launch the entire system
./launch.sh
```

The system will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### Manual Setup

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## ⚙️ Configuration

### Backend Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-secret-key-change-in-production

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_URL=http://localhost:11434

# GitHub Integration
GITHUB_TOKEN=ghp_...
GITHUB_APP_ID=123456

# CORS
CORS_ORIGIN=http://localhost:5173
```

### AI Provider Setup

#### OpenAI (GPT Models)
1. Get API key: https://platform.openai.com/api-keys
2. Add to `backend/.env`: `OPENAI_API_KEY=sk-...`
3. Restart backend

#### Anthropic (Claude Models)
1. Get API key: https://console.anthropic.com/
2. Add to `backend/.env`: `ANTHROPIC_API_KEY=sk-ant-...`
3. Restart backend

#### Ollama (Local LLM)
1. Install Ollama: https://ollama.ai/download
2. Pull models: `ollama pull llama2`, `ollama pull codellama`
3. Configure: `OLLAMA_URL=http://localhost:11434`
4. Restart backend

**Hybrid Mode**: Enable all providers simultaneously for maximum flexibility!

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  React 19 + TypeScript + Vite + TailwindCSS + Socket.IO     │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │ Agents   │  │ AI Chat  │  │ Monitor  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Nginx Layer                           │
│        Static Files + API Proxy + WebSocket Proxy           │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Backend Layer                          │
│       Node.js + Express + TypeScript + Socket.IO            │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   API    │  │WebSocket │  │  Agent   │  │  System  │   │
│  │  Server  │  │  Server  │  │ Manager  │  │ Monitor  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     AI Provider Layer                        │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  OpenAI  │  │Anthropic │  │  Ollama  │  │  GitHub  │   │
│  │   GPT    │  │  Claude  │  │  Local   │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Documentation

- **[Operator Runbook](OPERATOR_RUNBOOK.md)**: Comprehensive operations guide
- **API Documentation**: See `backend/README.md` (coming soon)
- **Frontend Guide**: See `frontend/README.md`

## 🔧 Development

### Project Structure

```
infinity-matrix/
├── frontend/                 # React/Vite frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── admin/       # Admin dashboard components
│   │   │   ├── ai-chat/     # AI chat components
│   │   │   ├── layout/      # Layout components
│   │   │   └── ui/          # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API and WebSocket services
│   │   ├── store/           # State management (Zustand)
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   │   ├── aiService.ts # AI provider integration
│   │   │   ├── agentService.ts # Agent management
│   │   │   └── systemService.ts # System monitoring
│   │   ├── types/           # TypeScript types
│   │   └── config/          # Configuration
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml       # Docker orchestration
├── launch.sh               # Automated launch script
├── OPERATOR_RUNBOOK.md     # Operations guide
└── README.md              # This file
```

### Building

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### Testing

```bash
# Run linters
cd frontend && npm run lint
cd backend && npm run lint

# Run tests (when implemented)
npm test
```

## 🚢 Deployment

### Docker Deployment (Recommended)

```bash
# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Launch
./launch.sh

# Or manually
docker-compose up -d
```

### Hostinger Deployment

See [OPERATOR_RUNBOOK.md](OPERATOR_RUNBOOK.md#deployment-to-hostinger) for detailed Hostinger deployment instructions.

### Production Checklist

- [ ] Set strong `JWT_SECRET` in backend/.env
- [ ] Configure AI provider API keys
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Enable HTTPS with SSL certificates
- [ ] Configure firewall rules
- [ ] Set up log rotation
- [ ] Configure backup strategy
- [ ] Test all features in production environment

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health

# System status
curl http://localhost:3000/api/system/status

# Agent list
curl http://localhost:3000/api/agents
```

### Logs

```bash
# View all logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

## 🛠️ Troubleshooting

See [OPERATOR_RUNBOOK.md](OPERATOR_RUNBOOK.md#troubleshooting) for comprehensive troubleshooting guide.

Common issues:
- Backend won't start → Check .env configuration
- Frontend won't load → Verify backend is running
- WebSocket fails → Check CORS settings
- AI chat errors → Verify API keys

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React and Vite teams for excellent tools
- TailwindCSS for beautiful styling
- OpenAI, Anthropic, and Ollama for AI capabilities
- Socket.IO for real-time communication

## 📧 Support

For issues, questions, or suggestions:
- Open an issue: https://github.com/InfinityXOneSystems/infinity-matrix/issues
- Email: support@infinityxonesystems.com

---

**Built with ❤️ for enterprise operations**

*Ready for production. Ready for scale. Ready for intelligence.*
