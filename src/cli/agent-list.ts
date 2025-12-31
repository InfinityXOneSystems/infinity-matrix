#!/usr/bin/env node
/**
 * Agent Management CLI
 */

import { Command } from 'commander';
import { ConfigManager } from '../core/config.js';
import { EventBus } from '../core/events.js';
import { AgentRegistry } from '../agents/registry.js';
import { Logger } from '../core/logger.js';

const logger = new Logger('AgentCLI');
const program = new Command();

program
  .name('agent-list')
  .description('List all registered agents')
  .option('--status <status>', 'Filter by status (active, inactive)')
  .option('--category <category>', 'Filter by category')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const config = ConfigManager.getInstance();
      await config.load();
      
      const eventBus = EventBus.getInstance();
      const registry = new AgentRegistry(config, eventBus);
      
      await registry.initialize();
      await registry.discover();
      
      const status = await registry.getStatus();
      
      if (options.json) {
        console.log(JSON.stringify(status, null, 2));
      } else {
        console.log('\n=== Agent Registry ===\n');
        console.log(`Total Agents: ${status.total}`);
        console.log(`Running: ${status.running}\n`);
        
        console.log('Agents:');
        for (const agent of status.agents) {
          const statusIcon = agent.running ? '●' : '○';
          const healthIcon = agent.healthy ? '✓' : '✗';
          console.log(`  ${statusIcon} ${agent.name} (${agent.id})`);
          console.log(`    Status: ${agent.status}`);
          console.log(`    Health: ${healthIcon}`);
        }
        console.log('');
      }
      
    } catch (error) {
      logger.error('Failed to list agents:', error);
      process.exit(1);
    }
  });

program.parse();
