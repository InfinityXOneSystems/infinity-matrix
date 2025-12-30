#!/usr/bin/env node

/**
 * Infinity-Matrix Main Entry Point
 * 
 * This is the main entry point for the Infinity-Matrix autonomous system.
 * In development mode, it starts a simple server for testing.
 * 
 * @see docs/blueprint.md for system architecture
 * @see setup_instructions.md for setup guide
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Simple development server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  
  const response = {
    status: 'ok',
    message: 'Infinity-Matrix System',
    version: '1.0.0-alpha',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      docs: '/docs',
      manifest: '/manifest'
    }
  };
  
  res.end(JSON.stringify(response, null, 2));
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('🚀 Infinity-Matrix Development Server');
  console.log('=====================================');
  console.log(`   Server running at http://${HOST}:${PORT}/`);
  console.log('   Press Ctrl+C to stop');
  console.log('');
  console.log('   Documentation: docs/blueprint.md');
  console.log('   Setup Guide: setup_instructions.md');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
