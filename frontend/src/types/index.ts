// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Agent Types
export interface Agent {
  id: string;
  name: string;
  type: 'coding' | 'data-gathering' | 'monitoring' | 'analysis';
  status: 'active' | 'idle' | 'error' | 'offline';
  capabilities: string[];
  currentTask?: string;
  metrics: AgentMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface AgentMetrics {
  tasksCompleted: number;
  tasksInProgress: number;
  tasksFailed: number;
  uptime: number;
  lastActivity: string;
  cpuUsage?: number;
  memoryUsage?: number;
}

// AI Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'ollama' | 'custom';
  capabilities: string[];
  isAvailable: boolean;
  config?: Record<string, any>;
}

// System Types
export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  activeConnections: number;
  timestamp: string;
}

export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'down';
  services: ServiceStatus[];
  metrics: SystemMetrics;
  alerts: Alert[];
}

export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: number;
  lastCheck: string;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  timestamp: string;
  resolved: boolean;
}

// Data Collection Types
export interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  lastSync: string;
  recordsCollected: number;
}

export interface DataRecord {
  id: string;
  sourceId: string;
  data: Record<string, any>;
  timestamp: string;
  tags: string[];
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
}

export interface AgentEvent extends WebSocketEvent {
  type: 'agent:status' | 'agent:task' | 'agent:metric';
  data: {
    agentId: string;
    status?: Agent['status'];
    task?: string;
    metrics?: Partial<AgentMetrics>;
  };
}

export interface SystemEvent extends WebSocketEvent {
  type: 'system:metrics' | 'system:alert' | 'system:status';
  data: SystemMetrics | Alert | SystemStatus;
}

// GitHub Integration Types
export interface GitHubRepository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  url: string;
}

export interface GitHubPullRequest {
  id: string;
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubIssue {
  id: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
  author: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

// Configuration Types
export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  features: {
    aiChat: boolean;
    agentManagement: boolean;
    dataCollection: boolean;
    githubIntegration: boolean;
  };
  ai: {
    defaultModel: string;
    availableModels: AIModel[];
  };
}
