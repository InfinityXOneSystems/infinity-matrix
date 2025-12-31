/**
 * System Controller
 * 
 * Main orchestrator that manages all system components and their lifecycle
 */

import { ConfigManager } from './config.js';
import { LifecycleManager } from './lifecycle.js';
import { EventBus } from './events.js';
import { Logger } from './logger.js';
import { AgentRegistry } from '../agents/registry.js';
import { GatewayManager } from '../gateways/manager.js';
import { OrchestrationEngine } from '../orchestration/engine.js';
import { MonitoringService } from '../monitoring/service.js';
import { IntelligenceService } from '../agents/intelligence/service.js';

export class SystemController {
  private logger: Logger;
  private configManager: ConfigManager;
  private lifecycleManager: LifecycleManager;
  private eventBus: EventBus;
  private agentRegistry: AgentRegistry;
  private gatewayManager: GatewayManager;
  private orchestrationEngine: OrchestrationEngine;
  private monitoringService: MonitoringService;
  private intelligenceService: IntelligenceService;
  private isRunning: boolean = false;

  constructor(
    configManager: ConfigManager,
    lifecycleManager: LifecycleManager,
    eventBus: EventBus
  ) {
    this.logger = new Logger('SystemController');
    this.configManager = configManager;
    this.lifecycleManager = lifecycleManager;
    this.eventBus = eventBus;
    
    // Initialize subsystems
    this.agentRegistry = new AgentRegistry(configManager, eventBus);
    this.gatewayManager = new GatewayManager(configManager, eventBus);
    this.orchestrationEngine = new OrchestrationEngine(
      configManager,
      eventBus,
      this.agentRegistry
    );
    this.monitoringService = new MonitoringService(configManager, eventBus);
    this.intelligenceService = new IntelligenceService(configManager, eventBus);
  }

  /**
   * Start the entire system
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('System is already running');
      return;
    }

    this.logger.info('Starting Infinity Matrix system...');

    try {
      // Phase 1: Core Infrastructure
      this.logger.info('Phase 1: Starting core infrastructure...');
      await this.startCoreInfrastructure();

      // Phase 2: Monitoring and Observability
      this.logger.info('Phase 2: Starting monitoring services...');
      await this.monitoringService.start();

      // Phase 3: Agent Registry
      this.logger.info('Phase 3: Initializing agent registry...');
      await this.agentRegistry.initialize();
      await this.agentRegistry.discover();

      // Phase 4: Gateways
      this.logger.info('Phase 4: Starting gateways...');
      await this.gatewayManager.start();

      // Phase 5: Orchestration Engine
      this.logger.info('Phase 5: Starting orchestration engine...');
      await this.orchestrationEngine.start();

      // Phase 6: Intelligence Services
      this.logger.info('Phase 6: Starting intelligence services...');
      await this.intelligenceService.start();

      // Phase 7: Start All Registered Agents
      this.logger.info('Phase 7: Starting registered agents...');
      await this.agentRegistry.startAll();

      this.isRunning = true;
      this.eventBus.emit('system:started', { timestamp: new Date() });
      this.logger.info('All systems operational');

    } catch (error) {
      this.logger.error('Failed to start system:', error);
      await this.stop();
      throw error;
    }
  }

  /**
   * Stop the entire system gracefully
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('System is not running');
      return;
    }

    this.logger.info('Stopping Infinity Matrix system...');

    try {
      // Reverse order of startup
      this.logger.info('Stopping agents...');
      await this.agentRegistry.stopAll();

      this.logger.info('Stopping intelligence services...');
      await this.intelligenceService.stop();

      this.logger.info('Stopping orchestration engine...');
      await this.orchestrationEngine.stop();

      this.logger.info('Stopping gateways...');
      await this.gatewayManager.stop();

      this.logger.info('Stopping monitoring services...');
      await this.monitoringService.stop();

      this.logger.info('Stopping core infrastructure...');
      await this.stopCoreInfrastructure();

      this.isRunning = false;
      this.eventBus.emit('system:stopped', { timestamp: new Date() });
      this.logger.info('System stopped successfully');

    } catch (error) {
      this.logger.error('Error during system shutdown:', error);
      throw error;
    }
  }

  /**
   * Get system status
   */
  async getStatus(): Promise<SystemStatus> {
    return {
      running: this.isRunning,
      uptime: process.uptime(),
      agents: await this.agentRegistry.getStatus(),
      gateways: await this.gatewayManager.getStatus(),
      orchestration: await this.orchestrationEngine.getStatus(),
      monitoring: await this.monitoringService.getStatus(),
      intelligence: await this.intelligenceService.getStatus(),
      timestamp: new Date()
    };
  }

  /**
   * Perform health check
   */
  async healthCheck(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.agentRegistry.healthCheck(),
      this.gatewayManager.healthCheck(),
      this.orchestrationEngine.healthCheck(),
      this.monitoringService.healthCheck(),
      this.intelligenceService.healthCheck()
    ]);

    const healthy = checks.every(result => 
      result.status === 'fulfilled' && result.value.healthy
    );

    return {
      healthy,
      checks: checks.map((result, index) => ({
        component: ['agents', 'gateways', 'orchestration', 'monitoring', 'intelligence'][index],
        status: result.status === 'fulfilled' ? result.value : { healthy: false, error: (result as PromiseRejectedResult).reason }
      })),
      timestamp: new Date()
    };
  }

  /**
   * Start core infrastructure services
   */
  private async startCoreInfrastructure(): Promise<void> {
    // Initialize database connections, message queues, etc.
    this.logger.info('Connecting to databases...');
    // Database initialization would go here
    
    this.logger.info('Initializing cache...');
    // Cache initialization would go here
    
    this.logger.info('Core infrastructure ready');
  }

  /**
   * Stop core infrastructure services
   */
  private async stopCoreInfrastructure(): Promise<void> {
    this.logger.info('Disconnecting from databases...');
    // Database cleanup would go here
    
    this.logger.info('Clearing cache...');
    // Cache cleanup would go here
    
    this.logger.info('Core infrastructure stopped');
  }
}

export interface SystemStatus {
  running: boolean;
  uptime: number;
  agents: any;
  gateways: any;
  orchestration: any;
  monitoring: any;
  intelligence: any;
  timestamp: Date;
}

export interface HealthStatus {
  healthy: boolean;
  checks: Array<{
    component: string;
    status: any;
  }>;
  timestamp: Date;
}
