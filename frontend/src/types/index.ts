/**
 * Core data types for the Infinity Matrix Admin Panel
 * All types are production-ready and match backend API contracts
 */

// ============================================================================
// Agent Types
// ============================================================================

export enum AgentStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
}

export enum AgentType {
  ORCHESTRATOR = 'orchestrator',
  WORKER = 'worker',
  MONITOR = 'monitor',
  COORDINATOR = 'coordinator',
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  version: string;
  lastHeartbeat: string;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  tasksCompleted: number;
  tasksActive: number;
  errorCount: number;
  metadata: Record<string, any>;
  capabilities: string[];
  config: AgentConfig;
  createdAt: string;
  updatedAt: string;
}

export interface AgentConfig {
  maxConcurrentTasks: number;
  timeout: number;
  retryAttempts: number;
  priority: number;
  tags: string[];
}

export interface AgentMetrics {
  agentId: string;
  timestamp: string;
  cpu: number;
  memory: number;
  activeTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageResponseTime: number;
}

// ============================================================================
// Workflow Types
// ============================================================================

export enum WorkflowStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

export enum WorkflowStepStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: WorkflowStepStatus;
  agentId?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  retryCount: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  currentStepIndex: number;
  progress: number;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  createdBy: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: Omit<WorkflowStep, 'id' | 'status' | 'startedAt' | 'completedAt'>[];
  category: string;
  tags: string[];
  isPublic: boolean;
}

// ============================================================================
// Audit Types
// ============================================================================

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  ACCESS = 'access',
  EXECUTE = 'execute',
  EXPORT = 'export',
  IMPORT = 'import',
}

export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  severity: AuditSeverity;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  outcome: 'success' | 'failure';
  errorMessage?: string;
}

export interface AuditFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: AuditAction;
  severity?: AuditSeverity;
  resource?: string;
  outcome?: 'success' | 'failure';
  searchTerm?: string;
}

// ============================================================================
// Proof Log Types
// ============================================================================

export enum ProofStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export interface ProofLog {
  id: string;
  timestamp: string;
  workflowId: string;
  workflowName: string;
  agentId: string;
  agentName: string;
  status: ProofStatus;
  proofType: string;
  hash: string;
  signature: string;
  data: Record<string, any>;
  verificationDetails: {
    verifiedAt?: string;
    verifiedBy?: string;
    verificationMethod: string;
    isValid: boolean;
  };
  metadata: Record<string, any>;
}

export interface ProofExportOptions {
  format: 'json' | 'csv' | 'pdf';
  includeMetadata: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: {
    workflowIds?: string[];
    agentIds?: string[];
    status?: ProofStatus[];
  };
}

// ============================================================================
// User & Authentication Types
// ============================================================================

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  permissions: string[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

// ============================================================================
// Dashboard & Analytics Types
// ============================================================================

export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalWorkflows: number;
  runningWorkflows: number;
  completedWorkflows: number;
  failedWorkflows: number;
  totalProofs: number;
  verifiedProofs: number;
  systemHealth: number;
  averageResponseTime: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

// ============================================================================
// Onboarding Types
// ============================================================================

export enum OnboardingStepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: string;
  status: OnboardingStepStatus;
  order: number;
  duration?: number;
  actions?: {
    label: string;
    action: string;
    isPrimary: boolean;
  }[];
  resources?: {
    title: string;
    url: string;
    type: 'video' | 'document' | 'link';
  }[];
}

export interface OnboardingGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: OnboardingStep[];
  progress: number;
  estimatedTime: number;
  targetRole: UserRole;
  isRequired: boolean;
}

// ============================================================================
// Demo & Runbook Types
// ============================================================================

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: {
    id: string;
    title: string;
    instruction: string;
    expectedOutcome: string;
    automatable: boolean;
  }[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  resources: {
    title: string;
    url: string;
  }[];
}

export interface Runbook {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  steps: {
    id: string;
    title: string;
    content: string;
    code?: string;
    language?: string;
  }[];
  tags: string[];
  lastUpdated: string;
  author: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp: string;
}

// ============================================================================
// WebSocket/Real-time Types
// ============================================================================

export enum WebSocketMessageType {
  AGENT_STATUS = 'agent_status',
  WORKFLOW_UPDATE = 'workflow_update',
  SYSTEM_ALERT = 'system_alert',
  METRICS_UPDATE = 'metrics_update',
  AUDIT_LOG = 'audit_log',
  PROOF_VERIFICATION = 'proof_verification',
}

export interface WebSocketMessage<T = any> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: string;
  id: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface SystemConfig {
  apiBaseUrl: string;
  wsBaseUrl: string;
  refreshInterval: number;
  maxRetries: number;
  timeout: number;
  features: {
    realTimeUpdates: boolean;
    auditLogging: boolean;
    proofVerification: boolean;
    analytics: boolean;
  };
}

export interface NotificationConfig {
  enabled: boolean;
  types: ('info' | 'warning' | 'error' | 'success')[];
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  autoClose: number;
}
