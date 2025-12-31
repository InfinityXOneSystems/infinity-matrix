/**
 * MCP Client for VS Code extension
 */
import axios, { AxiosInstance } from 'axios';
import WebSocket from 'ws';

export interface MCPClientConfig {
  serverUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface IntelligenceShareRequest {
  source_provider: string;
  intelligence_type: string;
  content: Record<string, unknown>;
  confidence_score: number;
  tags: string[];
  target_providers: string[];
}

export interface ContextSyncRequest {
  provider: string;
  conversation_id?: string;
  user_id?: string;
  workspace_id?: string;
  code_context: Record<string, unknown>;
  conversation_history: Record<string, unknown>[];
  file_references: string[];
  preferences: Record<string, unknown>;
  target_providers: string[];
}

export class MCPClient {
  private httpClient: AxiosInstance;
  private ws: WebSocket | null = null;
  private serverUrl: string;
  private apiKey?: string;
  private connected = false;

  constructor(serverUrl: string, apiKey?: string) {
    this.serverUrl = serverUrl;
    this.apiKey = apiKey;

    this.httpClient = axios.create({
      baseURL: serverUrl,
      timeout: 10000,
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    });
  }

  async connect(): Promise<void> {
    try {
      // Test HTTP connection
      await this.httpClient.get('/health');

      // Establish WebSocket connection for real-time updates
      const wsUrl = this.serverUrl.replace('http', 'ws') + '/ws';
      this.ws = new WebSocket(wsUrl);

      await new Promise<void>((resolve, reject) => {
        if (!this.ws) {
          reject(new Error('WebSocket not initialized'));
          return;
        }

        this.ws.on('open', () => {
          this.connected = true;
          resolve();
        });

        this.ws.on('error', (error) => {
          reject(error);
        });

        this.ws.on('message', (data) => {
          this.handleWebSocketMessage(data.toString());
        });

        this.ws.on('close', () => {
          this.connected = false;
        });
      });
    } catch (error) {
      throw new Error(`Failed to connect to MCP server: ${error}`);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async syncContext(request: ContextSyncRequest): Promise<{ context_id: string }> {
    try {
      const response = await this.httpClient.post('/api/v1/context/sync', request);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to sync context: ${error}`);
    }
  }

  async shareIntelligence(request: IntelligenceShareRequest): Promise<{ intelligence_id: string }> {
    try {
      const response = await this.httpClient.post('/api/v1/intelligence/share', request);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to share intelligence: ${error}`);
    }
  }

  async getProviders(): Promise<{ providers: Array<{ id: string; name: string; enabled: boolean }> }> {
    try {
      const response = await this.httpClient.get('/api/v1/providers/');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get providers: ${error}`);
    }
  }

  async getStatus(): Promise<{
    connected: boolean;
    activeProviders: number;
    lastSync: string | null;
  }> {
    try {
      if (!this.connected) {
        return {
          connected: false,
          activeProviders: 0,
          lastSync: null,
        };
      }

      const response = await this.httpClient.get('/api/v1/mcp/stats');
      return {
        connected: true,
        activeProviders: response.data.active_providers,
        lastSync: new Date().toISOString(),
      };
    } catch (error) {
      return {
        connected: false,
        activeProviders: 0,
        lastSync: null,
      };
    }
  }

  private handleWebSocketMessage(message: string): void {
    try {
      const data = JSON.parse(message);
      // Handle different message types
      console.log('Received WebSocket message:', data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }
}
