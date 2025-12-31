import { agentStore } from '../services/agentService';

describe('Agent Service', () => {
  beforeEach(() => {
    // Reset to initial state before each test
    const agents = agentStore.getAllAgents();
    agents.forEach(agent => {
      if (!agent.id.startsWith('agent-')) {
        agentStore.deleteAgent(agent.id);
      }
    });
  });

  describe('createAgent', () => {
    it('should create a new agent', () => {
      const agent = agentStore.createAgent({
        name: 'Test Agent',
        type: 'coding',
        capabilities: ['test-capability'],
      });

      expect(agent.id).toBeDefined();
      expect(agent.name).toBe('Test Agent');
      expect(agent.type).toBe('coding');
      expect(agent.status).toBe('idle');
    });

    it('should initialize agent metrics', () => {
      const agent = agentStore.createAgent({
        name: 'Test Agent',
        type: 'monitoring',
        capabilities: ['monitoring'],
      });

      expect(agent.metrics).toBeDefined();
      expect(agent.metrics.tasksCompleted).toBe(0);
      expect(agent.metrics.tasksInProgress).toBe(0);
      expect(agent.metrics.tasksFailed).toBe(0);
    });
  });

  describe('getAgent', () => {
    it('should retrieve an existing agent', () => {
      const agent = agentStore.getAgent('agent-1');
      expect(agent).toBeDefined();
      expect(agent?.id).toBe('agent-1');
    });

    it('should return undefined for non-existent agent', () => {
      const agent = agentStore.getAgent('non-existent');
      expect(agent).toBeUndefined();
    });
  });

  describe('updateAgent', () => {
    it('should update agent properties', () => {
      const updated = agentStore.updateAgent('agent-1', {
        name: 'Updated Name',
      });

      expect(updated?.name).toBe('Updated Name');
    });

    it('should return undefined for non-existent agent', () => {
      const result = agentStore.updateAgent('non-existent', {
        name: 'Test',
      });

      expect(result).toBeUndefined();
    });
  });

  describe('startAgent', () => {
    it('should set agent status to active', () => {
      const agent = agentStore.startAgent('agent-1');
      expect(agent?.status).toBe('active');
    });
  });

  describe('stopAgent', () => {
    it('should set agent status to idle', () => {
      agentStore.startAgent('agent-1');
      const agent = agentStore.stopAgent('agent-1');
      expect(agent?.status).toBe('idle');
    });

    it('should clear current task', () => {
      agentStore.updateAgent('agent-1', { currentTask: 'Some task' });
      const agent = agentStore.stopAgent('agent-1');
      expect(agent?.currentTask).toBeUndefined();
    });
  });

  describe('getAllAgents', () => {
    it('should return array of all agents', () => {
      const agents = agentStore.getAllAgents();
      expect(Array.isArray(agents)).toBe(true);
      expect(agents.length).toBeGreaterThan(0);
    });
  });

  describe('deleteAgent', () => {
    it('should delete an agent', () => {
      const agent = agentStore.createAgent({
        name: 'To Delete',
        type: 'coding',
        capabilities: [],
      });

      const result = agentStore.deleteAgent(agent.id);
      expect(result).toBe(true);

      const deleted = agentStore.getAgent(agent.id);
      expect(deleted).toBeUndefined();
    });

    it('should return false for non-existent agent', () => {
      const result = agentStore.deleteAgent('non-existent');
      expect(result).toBe(false);
    });
  });
});
