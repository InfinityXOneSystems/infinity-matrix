// Agent Types
export interface Agent {
  id: string;
  name: string;
  type: 'coding' | 'data-gathering' | 'monitoring' | 'analysis';
  status: 'active' | 'idle' | 'error' | 'offline';
  capabilities: string[];
  currentTask?: string;
  metrics: AgentMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentMetrics {
  tasksCompleted: number;
  tasksInProgress: number;
  tasksFailed: number;
  uptime: number;
  lastActivity: Date;
  cpuUsage?: number;
  memoryUsage?: number;
}

// AI Chat Types
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  userId?: string;
  title: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
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
  timestamp: Date;
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
  lastCheck: Date;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  timestamp: Date;
  resolved: boolean;
}

// Data Collection Types
export interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  lastSync: Date;
  recordsCollected: number;
  config: Record<string, any>;
}

export interface DataRecord {
  id: string;
  sourceId: string;
  data: Record<string, any>;
  timestamp: Date;
  tags: string[];
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'operator' | 'viewer';
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
}

// Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: Date;
}
