/**
 * Event Bus
 * 
 * Centralized event management for system-wide communication
 */

import { EventEmitter } from 'events';
import { Logger } from './logger.js';

export class EventBus extends EventEmitter {
  private static instance: EventBus;
  private logger: Logger;

  private constructor() {
    super();
    this.logger = new Logger('EventBus');
    this.setMaxListeners(100); // Increase max listeners for large systems
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Emit an event with logging
   */
  override emit(event: string | symbol, ...args: any[]): boolean {
    this.logger.debug(`Event emitted: ${String(event)}`);
    return super.emit(event, ...args);
  }

  /**
   * Subscribe to an event
   */
  subscribe(event: string, handler: (...args: any[]) => void): () => void {
    this.on(event, handler);
    this.logger.debug(`Subscribed to event: ${event}`);
    
    // Return unsubscribe function
    return () => {
      this.off(event, handler);
      this.logger.debug(`Unsubscribed from event: ${event}`);
    };
  }

  /**
   * Subscribe to an event once
   */
  subscribeOnce(event: string, handler: (...args: any[]) => void): void {
    this.once(event, handler);
    this.logger.debug(`Subscribed once to event: ${event}`);
  }

  /**
   * Publish an event (alias for emit)
   */
  publish(event: string, data?: any): boolean {
    return this.emit(event, data);
  }

  /**
   * Get list of all event names
   */
  getEventNames(): string[] {
    return this.eventNames().map(name => String(name));
  }

  /**
   * Get listener count for an event
   */
  getListenerCount(event: string): number {
    return this.listenerCount(event);
  }
}
