import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { config } from './config';
import aiRoutes from './routes/aiRoutes';
import adminRoutes from './routes/adminRoutes';
import { agentStore } from './services/agentService';
import { systemService } from './services/systemService';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.corsOrigin,
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial data
  socket.emit('agents:list', agentStore.getAllAgents());
  socket.emit('system:status', systemService.getSystemStatus());

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Broadcast system metrics periodically
setInterval(() => {
  const metrics = systemService.getSystemMetrics();
  io.emit('system:metrics', metrics);
}, 5000);

// Broadcast agent updates periodically
setInterval(() => {
  const agents = agentStore.getAllAgents();
  
  // Update agent metrics randomly for demonstration
  agents.forEach((agent) => {
    if (agent.status === 'active') {
      agentStore.updateMetrics(agent.id, {
        cpuUsage: Math.random() * 70 + 10,
        memoryUsage: Math.random() * 60 + 20,
      });
    }
  });

  io.emit('agents:update', agentStore.getAllAgents());
}, 3000);

// Start server
httpServer.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   Infinity Matrix Admin System Backend        ║
║   Server running on port ${config.port}               ║
║   Environment: ${config.nodeEnv}                  ║
║   CORS Origin: ${config.corsOrigin}   ║
╚════════════════════════════════════════════════╝
  `);

  console.log('\nAvailable Features:');
  console.log(`- AI Chat: ${config.features.aiChat ? '✓' : '✗'}`);
  console.log(`- Agent Management: ${config.features.agentManagement ? '✓' : '✗'}`);
  console.log(`- Data Collection: ${config.features.dataCollection ? '✓' : '✗'}`);
  console.log(`- GitHub Integration: ${config.features.githubIntegration ? '✓' : '✗'}`);
  console.log(`\nHealth Check: http://localhost:${config.port}/health`);
  console.log(`API Base URL: http://localhost:${config.port}/api\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
