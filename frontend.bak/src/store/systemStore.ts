import { create } from 'zustand';
import type { Agent, SystemStatus } from '../types';

interface SystemState {
  agents: Agent[];
  systemStatus: SystemStatus | null;
  isConnected: boolean;
  
  // Actions
  setAgents: (agents: Agent[]) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  setSystemStatus: (status: SystemStatus) => void;
  setConnected: (isConnected: boolean) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  agents: [],
  systemStatus: null,
  isConnected: false,

  setAgents: (agents) => set({ agents }),

  updateAgent: (agentId, updates) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, ...updates } : agent
      ),
    })),

  setSystemStatus: (status) => set({ systemStatus: status }),

  setConnected: (isConnected) => set({ isConnected }),
}));
