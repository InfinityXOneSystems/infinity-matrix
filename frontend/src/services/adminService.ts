import { apiRequest } from './api';
import type { Agent, SystemStatus, DataSource } from '../types';

export const adminService = {
  // Agent Management
  async getAgents(): Promise<Agent[]> {
    return apiRequest<Agent[]>({
      method: 'GET',
      url: '/agents',
    });
  },

  async getAgent(id: string): Promise<Agent> {
    return apiRequest<Agent>({
      method: 'GET',
      url: `/agents/${id}`,
    });
  },

  async createAgent(data: Partial<Agent>): Promise<Agent> {
    return apiRequest<Agent>({
      method: 'POST',
      url: '/agents',
      data,
    });
  },

  async updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
    return apiRequest<Agent>({
      method: 'PUT',
      url: `/agents/${id}`,
      data,
    });
  },

  async deleteAgent(id: string): Promise<void> {
    return apiRequest({
      method: 'DELETE',
      url: `/agents/${id}`,
    });
  },

  async startAgent(id: string): Promise<void> {
    return apiRequest({
      method: 'POST',
      url: `/agents/${id}/start`,
    });
  },

  async stopAgent(id: string): Promise<void> {
    return apiRequest({
      method: 'POST',
      url: `/agents/${id}/stop`,
    });
  },

  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    return apiRequest<SystemStatus>({
      method: 'GET',
      url: '/system/status',
    });
  },

  // Data Sources
  async getDataSources(): Promise<DataSource[]> {
    return apiRequest<DataSource[]>({
      method: 'GET',
      url: '/data-sources',
    });
  },

  async createDataSource(data: Partial<DataSource>): Promise<DataSource> {
    return apiRequest<DataSource>({
      method: 'POST',
      url: '/data-sources',
      data,
    });
  },

  async updateDataSource(id: string, data: Partial<DataSource>): Promise<DataSource> {
    return apiRequest<DataSource>({
      method: 'PUT',
      url: `/data-sources/${id}`,
      data,
    });
  },

  async deleteDataSource(id: string): Promise<void> {
    return apiRequest({
      method: 'DELETE',
      url: `/data-sources/${id}`,
    });
  },
};
