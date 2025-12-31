import type { Agent, AgentMetrics } from '../types';

class AgentStore {
  private agents: Map<string, Agent> = new Map();
  private nextId = 1;

  constructor() {
    // Initialize with some demo agents
    this.createAgent({
      name: 'Data Collector Alpha',
      type: 'data-gathering',
      capabilities: ['web-scraping', 'api-integration', 'data-validation'],
    });

    this.createAgent({
      name: 'Code Generator Beta',
      type: 'coding',
      capabilities: ['code-generation', 'refactoring', 'testing'],
    });

    this.createAgent({
      name: 'System Monitor Gamma',
      type: 'monitoring',
      capabilities: ['health-checks', 'log-analysis', 'alerting'],
    });
  }

  createAgent(data: Omit<Agent, 'id' | 'status' | 'metrics' | 'createdAt' | 'updatedAt'>): Agent {
    const agent: Agent = {
      id: `agent-${this.nextId++}`,
      ...data,
      status: 'idle',
      metrics: {
        tasksCompleted: 0,
        tasksInProgress: 0,
        tasksFailed: 0,
        uptime: 0,
        lastActivity: new Date(),
        cpuUsage: Math.random() * 50,
        memoryUsage: Math.random() * 60 + 20,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.agents.set(agent.id, agent);
    return agent;
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  updateAgent(id: string, updates: Partial<Agent>): Agent | undefined {
    const agent = this.agents.get(id);
    if (!agent) return undefined;

    const updated = {
      ...agent,
      ...updates,
      updatedAt: new Date(),
    };

    this.agents.set(id, updated);
    return updated;
  }

  deleteAgent(id: string): boolean {
    return this.agents.delete(id);
  }

  updateMetrics(id: string, metrics: Partial<AgentMetrics>): void {
    const agent = this.agents.get(id);
    if (agent) {
      agent.metrics = {
        ...agent.metrics,
        ...metrics,
        lastActivity: new Date(),
      };
      agent.updatedAt = new Date();
    }
  }

  startAgent(id: string): Agent | undefined {
    const agent = this.agents.get(id);
    if (!agent) return undefined;

    return this.updateAgent(id, { status: 'active' });
  }

  stopAgent(id: string): Agent | undefined {
    const agent = this.agents.get(id);
    if (!agent) return undefined;

    return this.updateAgent(id, { status: 'idle', currentTask: undefined });
  }
}

export const agentStore = new AgentStore();
