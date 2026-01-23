import { io, Socket } from 'socket.io-client';
import { useSystemStore } from '../store/systemStore';
import type { AgentEvent, SystemEvent, SystemStatus } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token?: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      useSystemStore.getState().setConnected(true);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      useSystemStore.getState().setConnected(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    // Agent events
    this.socket.on('agent:status', (event: AgentEvent) => {
      const { agentId, status } = event.data;
      useSystemStore.getState().updateAgent(agentId, { status });
    });

    this.socket.on('agent:task', (event: AgentEvent) => {
      const { agentId, task } = event.data;
      useSystemStore.getState().updateAgent(agentId, { currentTask: task });
    });

    // System events
    this.socket.on('system:status', (event: SystemEvent) => {
      if ('status' in event.data && 'services' in event.data) {
        useSystemStore.getState().setSystemStatus(event.data as SystemStatus);
      }
    });

    this.socket.on('system:alert', (event: SystemEvent) => {
      console.log('System alert:', event.data);
      // Handle alerts
    });
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      useSystemStore.getState().setConnected(false);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();
