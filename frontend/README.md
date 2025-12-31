# InfinityX AI Admin Panel - Frontend

A comprehensive, enterprise-grade admin panel for managing the InfinityX AI platform. Built with React, TypeScript, and Vite.

## Features

### Core Capabilities
- **Real-time Agent Monitoring**: Live status updates, performance metrics, and health monitoring
- **Workflow Management**: Create, execute, and monitor complex workflows with step-by-step tracking
- **Audit Logging**: Complete audit trail with filtering, search, and export capabilities
- **Proof Verification**: Cryptographic proof logs with verification and export functionality
- **Onboarding Guides**: Interactive step-by-step guides for users and operators
- **Demo & Runbooks**: Comprehensive operational procedures and demonstrations

### Technical Features
- **TypeScript**: Full type safety and IntelliSense support
- **Real-time Updates**: WebSocket integration for live data synchronization
- **Responsive Design**: Mobile-first, fully responsive UI with Tailwind CSS
- **API Integration**: Production-ready API client with retry logic and error handling
- **Authentication**: Secure JWT-based authentication with protected routes
- **State Management**: React Context and custom hooks for efficient data management

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API server running (see backend documentation)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_BASE_URL=ws://localhost:3000/ws
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/      # Common components (buttons, cards, modals)
│   │   ├── layout/      # Layout components (header, sidebar)
│   │   ├── agents/      # Agent-specific components
│   │   ├── workflows/   # Workflow-specific components
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── AgentsPage.tsx
│   │   ├── WorkflowsPage.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   └── useData.ts   # Data fetching hooks
│   ├── services/        # External services
│   │   ├── api.ts       # API client
│   │   └── websocket.ts # WebSocket service
│   ├── contexts/        # React contexts
│   │   └── AuthContext.tsx
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Development

### Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Add JSDoc comments for complex functions
- Use Tailwind CSS utilities for styling

## API Integration

The admin panel integrates with the backend API through:

1. **REST API** (`services/api.ts`): For CRUD operations and data fetching
2. **WebSocket** (`services/websocket.ts`): For real-time updates

### API Client Features

- Automatic token refresh
- Request retry with exponential backoff
- Centralized error handling
- TypeScript type safety

### Real-time Updates

The WebSocket service provides live updates for:
- Agent status changes
- Workflow progress
- System alerts
- Audit logs
- Proof verifications

## Authentication

The admin panel uses JWT-based authentication:

1. Users log in via `/login` page
2. JWT token stored in localStorage
3. Token sent with all API requests
4. Protected routes redirect to login if unauthenticated
5. WebSocket connection authenticated with token

## Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Output will be in `dist/` directory
```

### Environment Configuration

For production deployments, set environment variables:

```bash
VITE_API_BASE_URL=https://api.infinityxai.com
VITE_WS_BASE_URL=wss://api.infinityxai.com/ws
```

## License

© 2025 InfinityX Systems. All rights reserved.
