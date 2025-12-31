#!/usr/bin/env node
/**
 * Status CLI - Shows system status
 */

import { ConfigManager } from '../core/config.js';
import { EventBus } from '../core/events.js';
import { SystemController } from '../core/controller.js';
import { LifecycleManager } from '../core/lifecycle.js';
import { Logger } from '../core/logger.js';

const logger = new Logger('Status');

async function main() {
  try {
    const config = ConfigManager.getInstance();
    await config.load();
    
    const eventBus = EventBus.getInstance();
    const lifecycle = new LifecycleManager(eventBus);
    const controller = new SystemController(config, lifecycle, eventBus);
    
    logger.info('Fetching system status...');
    const status = await controller.getStatus();
    
    console.log('\n=== Infinity Matrix Status ===\n');
    console.log(`Running: ${status.running ? '✓' : '✗'}`);
    console.log(`Uptime: ${Math.floor(status.uptime / 60)} minutes`);
    console.log(`\nAgents:`);
    console.log(`  Total: ${status.agents.total}`);
    console.log(`  Running: ${status.agents.running}`);
    console.log(`\nGateways:`);
    console.log(`  Running: ${status.gateways.running || 0}`);
    console.log(`\nOrchestration:`);
    console.log(`  Active Workflows: ${status.orchestration.active || 0}`);
    console.log(`\nMonitoring:`);
    console.log(`  Active Alerts: ${status.monitoring.alerts?.length || 0}`);
    console.log(`\nIntelligence:`);
    console.log(`  Active Pipelines: ${status.intelligence.active || 0}`);
    console.log(`\nTimestamp: ${status.timestamp}\n`);
    
  } catch (error) {
    logger.error('Status check failed:', error);
    process.exit(1);
  }
}

main();
