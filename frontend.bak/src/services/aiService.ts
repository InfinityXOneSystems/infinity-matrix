import { apiRequest } from './api';
import type { ChatMessage, AIModel } from '../types';

export interface SendMessageRequest {
  message: string;
  sessionId: string;
  model: string;
  context?: any;
}

export interface SendMessageResponse {
  message: ChatMessage;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export const aiService = {
  // Send a message to the AI
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    return apiRequest<SendMessageResponse>({
      method: 'POST',
      url: '/ai/chat',
      data: request,
    });
  },

  // Get available AI models
  async getModels(): Promise<AIModel[]> {
    return apiRequest<AIModel[]>({
      method: 'GET',
      url: '/ai/models',
    });
  },

  // Execute code via AI
  async executeCode(code: string, language: string): Promise<any> {
    return apiRequest({
      method: 'POST',
      url: '/ai/execute',
      data: { code, language },
    });
  },

  // GitHub operations via AI
  async githubOperation(operation: string, params: any): Promise<any> {
    return apiRequest({
      method: 'POST',
      url: '/ai/github',
      data: { operation, params },
    });
  },

  // Navigate to a page
  async navigateToPage(path: string): Promise<void> {
    return apiRequest({
      method: 'POST',
      url: '/ai/navigate',
      data: { path },
    });
  },
};
