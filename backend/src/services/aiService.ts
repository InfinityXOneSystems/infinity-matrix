import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import { config } from '../config';
import type { AIModel, ChatMessage } from '../types';

class AIService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;

  constructor() {
    if (config.openaiApiKey) {
      this.openai = new OpenAI({ apiKey: config.openaiApiKey });
    }
    if (config.anthropicApiKey) {
      this.anthropic = new Anthropic({ apiKey: config.anthropicApiKey });
    }
  }

  async sendMessage(
    message: string,
    model: string,
    history: ChatMessage[] = []
  ): Promise<{ content: string; model: string }> {
    if (model.startsWith('gpt')) {
      return this.sendOpenAIMessage(message, model, history);
    } else if (model.startsWith('claude')) {
      return this.sendAnthropicMessage(message, model, history);
    } else if (model.startsWith('ollama-')) {
      return this.sendOllamaMessage(message, model.replace('ollama-', ''), history);
    } else {
      throw new Error(`Unsupported model: ${model}`);
    }
  }

  private async sendOpenAIMessage(
    message: string,
    model: string,
    history: ChatMessage[]
  ): Promise<{ content: string; model: string }> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const completion = await this.openai.chat.completions.create({
      model: model,
      messages: messages,
    });

    return {
      content: completion.choices[0]?.message?.content || 'No response',
      model: model,
    };
  }

  private async sendAnthropicMessage(
    message: string,
    model: string,
    history: ChatMessage[]
  ): Promise<{ content: string; model: string }> {
    if (!this.anthropic) {
      throw new Error('Anthropic API key not configured');
    }

    const messages = [
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const response = await this.anthropic.messages.create({
      model: model,
      max_tokens: 4096,
      messages: messages,
    });

    const content = response.content[0];
    return {
      content: content.type === 'text' ? content.text : 'No response',
      model: model,
    };
  }

  private async sendOllamaMessage(
    message: string,
    model: string,
    history: ChatMessage[]
  ): Promise<{ content: string; model: string }> {
    try {
      const messages = [
        ...history.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: message },
      ];

      const response = await axios.post(`${config.ollamaUrl}/api/chat`, {
        model: model,
        messages: messages,
        stream: false,
      });

      return {
        content: response.data.message.content,
        model: `ollama-${model}`,
      };
    } catch (error) {
      throw new Error(`Ollama error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAvailableModels(): Promise<AIModel[]> {
    const models: AIModel[] = [];

    // OpenAI models
    if (this.openai) {
      models.push(
        {
          id: 'gpt-4',
          name: 'GPT-4',
          provider: 'openai',
          capabilities: ['chat', 'coding', 'analysis'],
          isAvailable: true,
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          provider: 'openai',
          capabilities: ['chat', 'coding'],
          isAvailable: true,
        }
      );
    }

    // Anthropic models
    if (this.anthropic) {
      models.push(
        {
          id: 'claude-3-opus-20240229',
          name: 'Claude 3 Opus',
          provider: 'anthropic',
          capabilities: ['chat', 'coding', 'analysis'],
          isAvailable: true,
        },
        {
          id: 'claude-3-sonnet-20240229',
          name: 'Claude 3 Sonnet',
          provider: 'anthropic',
          capabilities: ['chat', 'coding'],
          isAvailable: true,
        }
      );
    }

    // Try to get Ollama models
    try {
      const response = await axios.get(`${config.ollamaUrl}/api/tags`);
      if (response.data.models) {
        response.data.models.forEach((model: any) => {
          models.push({
            id: `ollama-${model.name}`,
            name: `Ollama: ${model.name}`,
            provider: 'ollama',
            capabilities: ['chat'],
            isAvailable: true,
          });
        });
      }
    } catch (error) {
      // Ollama not available
      console.log('Ollama not available');
    }

    return models;
  }

  async executeCode(code: string, language: string): Promise<any> {
    // This is a placeholder for code execution
    // In production, this would use a sandboxed environment
    return {
      success: true,
      output: 'Code execution not implemented yet',
      language,
    };
  }
}

export const aiService = new AIService();
