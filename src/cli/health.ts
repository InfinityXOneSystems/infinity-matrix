#!/usr/bin/env node
/**
 * Health Check CLI
 */

import { ConfigManager } from '../core/config.js';
import { EventBus } from '../core/events.js';
import { SystemController } from '../core/controller.js';
import { LifecycleManager } from '../core/lifecycle.js';
import { Logger } from '../core/logger.js';

const logger = new Logger('HealthCheck');

async function main() {
  try {
    const config = ConfigManager.getInstance();
    await config.load();
    
    const eventBus = EventBus.getInstance();
    const lifecycle = new LifecycleManager(eventBus);
    const controller = new SystemController(config, lifecycle, eventBus);
    
    logger.info('Running health check...');
    const health = await controller.healthCheck();
    
    console.log(JSON.stringify(health, null, 2));
    
    if (health.healthy) {
      logger.info('✓ System is healthy');
      process.exit(0);
    } else {
      logger.error('✗ System is unhealthy');
      process.exit(1);
    }
  } catch (error) {
    logger.error('Health check failed:', error);
    process.exit(1);
  }
}

main();
