# InfinityX Matrix - Enterprise Admin Panel

> **Comprehensive, production-ready admin panel for the infinityxai.com/admin platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-cyan)](https://tailwindcss.com/)

## 🚀 Overview

The InfinityX Matrix admin panel is an enterprise-grade, highly advanced React application designed for managing the InfinityX AI platform. Built with modern web technologies and best practices, it provides operators and administrators with comprehensive tools for monitoring agents, managing workflows, viewing audit trails, and more.

### ✨ Key Features

- **🤖 Real-Time Agent Monitoring** - Live status updates, performance metrics, and health tracking
- **⚙️ Workflow Management** - Create, execute, and monitor complex workflows with visual progress tracking
- **📋 Audit Logging** - Complete audit trail with advanced filtering, search, and export capabilities
- **🔒 Proof Verification** - Cryptographic proof logs with verification and compliance export
- **📚 Interactive Onboarding** - Step-by-step guides for users and operators
- **🎬 Demos & Runbooks** - Operational procedures with code examples and documentation
- **🔐 Secure Authentication** - JWT-based auth with protected routes and session management
- **🌐 Real-Time Sync** - WebSocket integration for live data updates across all features

## 📁 Project Structure

```
infinity-matrix/
├── frontend/                    # React + TypeScript admin panel
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/        # Common components (Card, Table, Modal, etc.)
│   │   │   ├── layout/        # Layout components (Sidebar, Header, MainLayout)
│   │   │   ├── agents/        # Agent-specific components
│   │   │   ├── workflows/     # Workflow-specific components
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── DashboardPage.tsx    # Main dashboard
│   │   │   ├── AgentsPage.tsx       # Agent management
│   │   │   ├── WorkflowsPage.tsx    # Workflow management
│   │   │   ├── AuditLogsPage.tsx    # Audit logs
│   │   │   ├── ProofLogsPage.tsx    # Proof verification
│   │   │   ├── OnboardingPage.tsx   # Onboarding guides
│   │   │   ├── DemosPage.tsx        # Demos & Runbooks
│   │   │   └── LoginPage.tsx        # Authentication
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── useData.ts     # Data fetching with real-time sync
│   │   ├── services/          # External services
│   │   │   ├── api.ts         # REST API client
│   │   │   └── websocket.ts   # WebSocket service
│   │   ├── contexts/          # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── types/             # TypeScript definitions
│   │   │   └── index.ts       # Complete type definitions
│   │   ├── App.tsx            # Main app with routing
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── README.md              # Frontend documentation
├── OPERATOR_GUIDE.md          # Comprehensive operator documentation
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- Backend API server (configure endpoint in `.env`)

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# VITE_API_BASE_URL=http://localhost:3000/api
# VITE_WS_BASE_URL=ws://localhost:3000/ws

# Start development server
npm run dev

# Access at http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Features & Capabilities

### Dashboard
- Real-time system statistics and health metrics
- Agent status overview with online/offline indicators
- Active workflow monitoring with progress tracking
- Recent alerts and notifications
- Quick action shortcuts

### Agent Management
- Complete CRUD operations for agents
- Real-time status monitoring (online, busy, offline, error)
- Performance metrics (CPU, memory, task count)
- Agent restart and control capabilities
- Filtering by status and type

### Workflow Management
- Visual workflow progress tracking
- Start, pause, resume, and cancel operations
- Step-by-step execution monitoring
- Template-based workflow creation
- Status filtering and search

### Audit Logs
- Complete audit trail of all system activities
- Advanced filtering (action, severity, outcome, date range)
- Export to JSON and CSV formats
- Full-text search capabilities
- Real-time log streaming

### Proof Logs
- Cryptographic proof verification
- Proof log export for compliance
- Verification status tracking
- Hash and signature display
- Workflow and agent association

### Onboarding Guides
- Interactive step-by-step guides
- Progress tracking and completion status
- Category-based organization
- Estimated time for each guide
- Required vs. optional guides

### Demos & Runbooks
- Operational procedure documentation
- Code examples with syntax highlighting
- Difficulty levels (beginner, intermediate, advanced)
- Step-by-step demonstrations
- Tag-based organization

## 🛠️ Technology Stack

### Core Technologies
- **React 19.2** - UI framework with latest features
- **TypeScript 5.9** - Type-safe development
- **Vite 7.3** - Fast build tool and dev server
- **Tailwind CSS 3.x** - Utility-first CSS framework

### Key Libraries
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **date-fns** - Date formatting and manipulation
- **lucide-react** - Icon library
- **recharts** - Charts and visualizations

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📚 Documentation

- **[Frontend README](frontend/README.md)** - Detailed frontend documentation
- **[Operator Guide](OPERATOR_GUIDE.md)** - Comprehensive operator manual
- **Inline Documentation** - JSDoc comments throughout codebase
- **Type Definitions** - Complete TypeScript types for all data models

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_BASE_URL=ws://localhost:3000/ws

# Optional Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

### API Integration

The admin panel expects a backend API with the following endpoints:

- **Authentication**: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Dashboard**: `/api/dashboard/stats`, `/api/dashboard/health`
- **Agents**: `/api/agents`, `/api/agents/:id`, `/api/agents/:id/restart`
- **Workflows**: `/api/workflows`, `/api/workflows/:id`, `/api/workflows/:id/start`
- **Audit Logs**: `/api/audit`, `/api/audit/export`
- **Proof Logs**: `/api/proofs`, `/api/proofs/:id/verify`
- **Onboarding**: `/api/onboarding/guides`
- **Demos**: `/api/demos`, `/api/runbooks`

WebSocket endpoint for real-time updates:
- **WebSocket**: `ws://localhost:3000/ws`

## 🎨 Customization

### Branding

Update branding elements:

1. **Colors** - Edit `frontend/tailwind.config.js`
2. **Logo** - Replace logo in `frontend/src/components/layout/Sidebar.tsx`
3. **Company Name** - Update throughout components

### Features

Enable/disable features by:
- Setting environment variables
- Modifying route configuration in `App.tsx`
- Adjusting sidebar navigation in `Sidebar.tsx`

## 🚢 Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Cloud Deployment

The build output (`frontend/dist/`) can be deployed to:
- **AWS S3 + CloudFront**
- **Vercel**
- **Netlify**
- **Azure Static Web Apps**
- **Google Cloud Storage**

Set environment variables in your deployment platform:
```bash
VITE_API_BASE_URL=https://api.infinityxai.com
VITE_WS_BASE_URL=wss://api.infinityxai.com/ws
```

## 🔒 Security

- JWT-based authentication with token refresh
- Protected routes requiring authentication
- Automatic token validation
- Secure WebSocket connections
- XSS protection via React
- CSRF protection (configure in backend)

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Prettier formatting (configure if needed)
- Component-based architecture
- Custom hooks for reusability

## 📖 Usage Examples

### For Operators

See the **[Operator Guide](OPERATOR_GUIDE.md)** for:
- Getting started
- Daily operations
- Troubleshooting
- Best practices

### For Developers

See the **[Frontend README](frontend/README.md)** for:
- Component architecture
- API integration
- Custom hooks
- Adding new features

## 🤝 Support

- **Documentation**: In-app onboarding and runbooks
- **Technical Issues**: Check the Operator Guide troubleshooting section
- **Feature Requests**: Contact the development team

## 📝 License

© 2025 InfinityX Systems. All rights reserved.

## 🎯 Project Status

**✅ PRODUCTION READY**

- All features fully implemented
- No placeholders or scaffolds
- Production build successful
- Comprehensive documentation
- Type-safe codebase
- Real-time synchronization
- Responsive design
- Error handling throughout

---

**Built with ❤️ by InfinityX Systems**
