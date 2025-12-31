/**
 * Gateway Manager - Stub Implementation
 */
import { ConfigManager } from '../core/config.js';
import { EventBus } from '../core/events.js';
import { Logger } from '../core/logger.js';

export class GatewayManager {
  private logger: Logger;
  constructor(configManager: ConfigManager, eventBus: EventBus) {
    this.logger = new Logger('GatewayManager');
  }
  async start(): Promise<void> {
    this.logger.info('Starting gateways...');
  }
  async stop(): Promise<void> {
    this.logger.info('Stopping gateways...');
  }
  async getStatus(): Promise<any> {
    return { gateways: [], running: 0 };
  }
  async healthCheck(): Promise<any> {
    return { healthy: true };
  }
}
