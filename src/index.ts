/**
 * Infinity Matrix - Universal Enterprise Operating System
 * 
 * Main entry point that initializes and orchestrates all system components
 * 
 * @module infinity-matrix
 * @version 1.0.0
 */

import { SystemController } from './core/controller.js';
import { ConfigManager } from './core/config.js';
import { LifecycleManager } from './core/lifecycle.js';
import { EventBus } from './core/events.js';
import { Logger } from './core/logger.js';

const logger = new Logger('Main');

/**
 * Main application initialization and startup
 */
async function main() {
  try {
    logger.info('Starting Infinity Matrix...');
    logger.info('Version: 1.0.0');
    logger.info('Environment: ' + (process.env.NODE_ENV || 'development'));

    // Initialize core components
    logger.info('Initializing core components...');
    
    const eventBus = EventBus.getInstance();
    const configManager = ConfigManager.getInstance();
    const lifecycleManager = new LifecycleManager(eventBus);
    
    // Load configuration
    logger.info('Loading configuration...');
    await configManager.load();
    
    // Initialize system controller
    logger.info('Initializing system controller...');
    const systemController = new SystemController(
      configManager,
      lifecycleManager,
      eventBus
    );
    
    // Start the system
    logger.info('Starting system...');
    await systemController.start();
    
    logger.info('Infinity Matrix started successfully');
    logger.info(`API Gateway: http://localhost:${configManager.get('PORT', 3000)}`);
    logger.info(`WebSocket Gateway: ws://localhost:${configManager.get('WEBSOCKET_PORT', 3100)}`);
    logger.info(`Health Check: http://localhost:${configManager.get('MONITORING_HEALTH_CHECK_PORT', 8080)}/health`);
    logger.info(`Metrics: http://localhost:${configManager.get('MONITORING_METRICS_PORT', 9090)}/metrics`);
    
    // Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);
      
      try {
        await systemController.stop();
        logger.info('System stopped successfully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };
    
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
      shutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    });
    
  } catch (error) {
    logger.error('Failed to start Infinity Matrix:', error);
    process.exit(1);
  }
}

// Start the application
main();

export { SystemController, ConfigManager, LifecycleManager, EventBus, Logger };
