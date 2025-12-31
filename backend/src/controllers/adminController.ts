import { Request, Response } from 'express';
import { agentStore } from '../services/agentService';
import { systemService } from '../services/systemService';
import type { ApiResponse } from '../types';

export const adminController = {
  // Agent Management
  async getAgents(req: Request, res: Response) {
    try {
      const agents = agentStore.getAllAgents();
      res.json({
        success: true,
        data: agents,
      } as ApiResponse);
    } catch (error) {
      console.error('Get agents error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },

  async getAgent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const agent = agentStore.getAgent(id);

      if (!agent) {
        return res.status(404).json({
          success: false,
          error: 'Agent not found',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: agent,
      } as ApiResponse);
    } catch (error) {
      console.error('Get agent error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },

  async createAgent(req: Request, res: Response) {
    try {
      const { name, type, capabilities } = req.body;

      if (!name || !type || !capabilities) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, type, capabilities',
        } as ApiResponse);
      }

      const agent = agentStore.createAgent({ name, type, capabilities });

      res.status(201).json({
        success: true,
        data: agent,
      } as ApiResponse);
    } catch (error) {
      console.error('Create agent error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },

  async startAgent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const agent = agentStore.startAgent(id);

      if (!agent) {
        return res.status(404).json({
          success: false,
          error: 'Agent not found',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: agent,
      } as ApiResponse);
    } catch (error) {
      console.error('Start agent error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },

  async stopAgent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const agent = agentStore.stopAgent(id);

      if (!agent) {
        return res.status(404).json({
          success: false,
          error: 'Agent not found',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: agent,
      } as ApiResponse);
    } catch (error) {
      console.error('Stop agent error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },

  // System Status
  async getSystemStatus(req: Request, res: Response) {
    try {
      const status = systemService.getSystemStatus();
      res.json({
        success: true,
        data: status,
      } as ApiResponse);
    } catch (error) {
      console.error('Get system status error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },

  // Data Sources (placeholder)
  async getDataSources(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: [],
      } as ApiResponse);
    } catch (error) {
      console.error('Get data sources error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },
};
