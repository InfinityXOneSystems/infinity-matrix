/**
 * Lifecycle Manager
 * 
 * Manages component lifecycle (initialization, start, stop, cleanup)
 */

import { EventBus } from './events.js';
import { Logger } from './logger.js';

export class LifecycleManager {
  private logger: Logger;
  private eventBus: EventBus;
  private components: Map<string, LifecycleComponent>;
  private startupOrder: string[];
  private shutdownOrder: string[];

  constructor(eventBus: EventBus) {
    this.logger = new Logger('LifecycleManager');
    this.eventBus = eventBus;
    this.components = new Map();
    this.startupOrder = [];
    this.shutdownOrder = [];
  }

  /**
   * Register a lifecycle component
   */
  register(name: string, component: LifecycleComponent, priority: number = 0): void {
    this.logger.info(`Registering component: ${name}`);
    this.components.set(name, component);
    
    // Add to startup order (sorted by priority)
    this.startupOrder.push(name);
    this.startupOrder.sort((a, b) => {
      const priorityA = this.components.get(a)?.priority || 0;
      const priorityB = this.components.get(b)?.priority || 0;
      return priorityB - priorityA;
    });
    
    // Shutdown is reverse of startup
    this.shutdownOrder = [...this.startupOrder].reverse();
  }

  /**
   * Unregister a component
   */
  unregister(name: string): void {
    this.logger.info(`Unregistering component: ${name}`);
    this.components.delete(name);
    this.startupOrder = this.startupOrder.filter(n => n !== name);
    this.shutdownOrder = this.shutdownOrder.filter(n => n !== name);
  }

  /**
   * Initialize all components
   */
  async initializeAll(): Promise<void> {
    this.logger.info('Initializing all components...');
    
    for (const name of this.startupOrder) {
      const component = this.components.get(name);
      if (component && component.initialize) {
        this.logger.info(`Initializing: ${name}`);
        await component.initialize();
        this.eventBus.emit('lifecycle:initialized', { component: name });
      }
    }
    
    this.logger.info('All components initialized');
  }

  /**
   * Start all components
   */
  async startAll(): Promise<void> {
    this.logger.info('Starting all components...');
    
    for (const name of this.startupOrder) {
      const component = this.components.get(name);
      if (component && component.start) {
        this.logger.info(`Starting: ${name}`);
        await component.start();
        this.eventBus.emit('lifecycle:started', { component: name });
      }
    }
    
    this.logger.info('All components started');
  }

  /**
   * Stop all components
   */
  async stopAll(): Promise<void> {
    this.logger.info('Stopping all components...');
    
    for (const name of this.shutdownOrder) {
      const component = this.components.get(name);
      if (component && component.stop) {
        this.logger.info(`Stopping: ${name}`);
        try {
          await component.stop();
          this.eventBus.emit('lifecycle:stopped', { component: name });
        } catch (error) {
          this.logger.error(`Error stopping ${name}:`, error);
        }
      }
    }
    
    this.logger.info('All components stopped');
  }

  /**
   * Cleanup all components
   */
  async cleanupAll(): Promise<void> {
    this.logger.info('Cleaning up all components...');
    
    for (const name of this.shutdownOrder) {
      const component = this.components.get(name);
      if (component && component.cleanup) {
        this.logger.info(`Cleaning up: ${name}`);
        try {
          await component.cleanup();
          this.eventBus.emit('lifecycle:cleaned', { component: name });
        } catch (error) {
          this.logger.error(`Error cleaning up ${name}:`, error);
        }
      }
    }
    
    this.logger.info('All components cleaned up');
  }

  /**
   * Get component status
   */
  getComponentStatus(name: string): ComponentStatus | undefined {
    const component = this.components.get(name);
    if (!component) return undefined;

    return {
      name,
      initialized: component.initialized || false,
      running: component.running || false,
      healthy: component.healthy !== false
    };
  }

  /**
   * Get all component statuses
   */
  getAllStatuses(): ComponentStatus[] {
    return Array.from(this.components.keys()).map(name => 
      this.getComponentStatus(name)!
    ).filter(Boolean);
  }
}

export interface LifecycleComponent {
  priority?: number;
  initialized?: boolean;
  running?: boolean;
  healthy?: boolean;
  initialize?(): Promise<void>;
  start?(): Promise<void>;
  stop?(): Promise<void>;
  cleanup?(): Promise<void>;
}

export interface ComponentStatus {
  name: string;
  initialized: boolean;
  running: boolean;
  healthy: boolean;
}
