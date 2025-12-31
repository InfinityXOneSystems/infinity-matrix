/**
 * Agent Registry
 * 
 * Centralized registry for agent discovery, registration, and management
 */

import { ConfigManager } from '../core/config.js';
import { EventBus } from '../core/events.js';
import { Logger } from '../core/logger.js';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export class AgentRegistry {
  private logger: Logger;
  private configManager: ConfigManager;
  private eventBus: EventBus;
  private agents: Map<string, Agent>;
  private runningAgents: Set<string>;

  constructor(configManager: ConfigManager, eventBus: EventBus) {
    this.logger = new Logger('AgentRegistry');
    this.configManager = configManager;
    this.eventBus = eventBus;
    this.agents = new Map();
    this.runningAgents = new Set();
  }

  /**
   * Initialize the agent registry
   */
  async initialize(): Promise<void> {
    this.logger.info('Initializing agent registry...');
    await this.loadAgentManifests();
    this.logger.info(`Loaded ${this.agents.size} agent definitions`);
  }

  /**
   * Discover available agents
   */
  async discover(): Promise<void> {
    this.logger.info('Discovering agents...');
    const agentRegistryPath = path.join(process.cwd(), 'manifests', 'agent-registry.yaml');
    
    if (fs.existsSync(agentRegistryPath)) {
      const content = fs.readFileSync(agentRegistryPath, 'utf-8');
      const registry = yaml.load(content) as any;
      
      if (registry.spec?.agents) {
        for (const agentDef of registry.spec.agents) {
          if (agentDef.status === 'active') {
            this.registerAgent(agentDef);
          }
        }
      }
    }
    
    this.logger.info(`Discovered ${this.agents.size} active agents`);
  }

  /**
   * Register an agent
   */
  registerAgent(agentDef: any): void {
    const agent: Agent = {
      id: agentDef.id,
      name: agentDef.name,
      type: agentDef.type,
      version: agentDef.version,
      category: agentDef.category,
      description: agentDef.description,
      capabilities: agentDef.capabilities || [],
      manifest: agentDef.manifest,
      source: agentDef.source,
      status: agentDef.status || 'inactive',
      healthy: false
    };
    
    this.agents.set(agent.id, agent);
    this.eventBus.emit('agent:registered', { agent: agent.id });
    this.logger.info(`Registered agent: ${agent.name} (${agent.id})`);
  }

  /**
   * Start all agents
   */
  async startAll(): Promise<void> {
    this.logger.info('Starting all agents...');
    
    for (const [id, agent] of this.agents) {
      if (agent.status === 'active') {
        await this.startAgent(id);
      }
    }
    
    this.logger.info(`Started ${this.runningAgents.size} agents`);
  }

  /**
   * Start a specific agent
   */
  async startAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    this.logger.info(`Starting agent: ${agent.name}`);
    
    // Agent startup logic would go here
    this.runningAgents.add(agentId);
    agent.healthy = true;
    
    this.eventBus.emit('agent:started', { agent: agentId });
  }

  /**
   * Stop all agents
   */
  async stopAll(): Promise<void> {
    this.logger.info('Stopping all agents...');
    
    for (const agentId of this.runningAgents) {
      await this.stopAgent(agentId);
    }
    
    this.logger.info('All agents stopped');
  }

  /**
   * Stop a specific agent
   */
  async stopAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    this.logger.info(`Stopping agent: ${agent.name}`);
    
    // Agent shutdown logic would go here
    this.runningAgents.delete(agentId);
    agent.healthy = false;
    
    this.eventBus.emit('agent:stopped', { agent: agentId });
  }

  /**
   * Get agent status
   */
  async getStatus(): Promise<any> {
    return {
      total: this.agents.size,
      running: this.runningAgents.size,
      agents: Array.from(this.agents.values()).map(agent => ({
        id: agent.id,
        name: agent.name,
        status: agent.status,
        running: this.runningAgents.has(agent.id),
        healthy: agent.healthy
      }))
    };
  }

  /**
   * Health check for all agents
   */
  async healthCheck(): Promise<any> {
    const unhealthyAgents = Array.from(this.agents.values())
      .filter(agent => this.runningAgents.has(agent.id) && !agent.healthy);
    
    return {
      healthy: unhealthyAgents.length === 0,
      runningAgents: this.runningAgents.size,
      unhealthyAgents: unhealthyAgents.length
    };
  }

  /**
   * Load agent manifests
   */
  private async loadAgentManifests(): Promise<void> {
    const manifestPath = path.join(process.cwd(), 'manifests', 'agents');
    
    if (!fs.existsSync(manifestPath)) {
      this.logger.warn('Agent manifests directory not found');
      return;
    }

    const files = fs.readdirSync(manifestPath);
    
    for (const file of files) {
      if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        try {
          const filePath = path.join(manifestPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const manifest = yaml.load(content) as any;
          
          if (manifest.spec) {
            this.registerAgent(manifest.spec);
          }
        } catch (error) {
          this.logger.error(`Error loading manifest ${file}:`, error);
        }
      }
    }
  }
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  version: string;
  category: string;
  description: string;
  capabilities: string[];
  manifest: string;
  source: string;
  status: string;
  healthy: boolean;
}
