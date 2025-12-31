import { Request, Response } from 'express';
import { aiService } from '../services/aiService';
import { chatStore } from '../services/chatService';
import type { ApiResponse } from '../types';

export const aiController = {
  async chat(req: Request, res: Response) {
    try {
      const { message, sessionId, model } = req.body;

      if (!message || !sessionId || !model) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: message, sessionId, model',
        } as ApiResponse);
      }

      // Get chat history
      const history = chatStore.getMessages(sessionId);

      // Add user message
      const userMessage = chatStore.addMessage(sessionId, 'user', message);

      // Get AI response
      const response = await aiService.sendMessage(message, model, history);

      // Add assistant message
      const assistantMessage = chatStore.addMessage(
        sessionId,
        'assistant',
        response.content,
        response.model
      );

      res.json({
        success: true,
        data: {
          message: assistantMessage,
        },
      } as ApiResponse);
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },

  async getModels(req: Request, res: Response) {
    try {
      const models = await aiService.getAvailableModels();
      res.json({
        success: true,
        data: models,
      } as ApiResponse);
    } catch (error) {
      console.error('Get models error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },

  async executeCode(req: Request, res: Response) {
    try {
      const { code, language } = req.body;

      if (!code || !language) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: code, language',
        } as ApiResponse);
      }

      const result = await aiService.executeCode(code, language);
      
      res.json({
        success: true,
        data: result,
      } as ApiResponse);
    } catch (error) {
      console.error('Code execution error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },

  async githubOperation(req: Request, res: Response) {
    try {
      const { operation, params } = req.body;

      // Placeholder for GitHub operations
      res.json({
        success: true,
        data: {
          operation,
          params,
          message: 'GitHub operation not yet implemented',
        },
      } as ApiResponse);
    } catch (error) {
      console.error('GitHub operation error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse);
    }
  },
};
