/**
 * API Client for Infinity Matrix Admin Panel
 * Production-ready HTTP client with proper error handling, retries, and interceptors
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  Agent,
  Workflow,
  AuditLog,
  ProofLog,
  User,
  LoginCredentials,
  LoginResponse,
  DashboardStats,
  AgentMetrics,
  OnboardingGuide,
  Runbook,
  DemoScenario,
  WorkflowTemplate,
  AuditFilters,
  ProofExportOptions,
} from '../types';

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000;
const MAX_RETRIES = 3;

// ============================================================================
// Axios Instance Configuration
// ============================================================================

class ApiClient {
  private client: AxiosInstance;
  private retryCount: Map<string, number>;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.retryCount = new Map();
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config;
        
        if (!config) {
          return Promise.reject(error);
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Retry logic for failed requests
        const retryKey = `${config.method}-${config.url}`;
        const currentRetry = this.retryCount.get(retryKey) || 0;

        if (currentRetry < MAX_RETRIES && this.shouldRetry(error)) {
          this.retryCount.set(retryKey, currentRetry + 1);
          await this.delay(Math.pow(2, currentRetry) * 1000);
          return this.client(config);
        }

        this.retryCount.delete(retryKey);
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: AxiosError): boolean {
    if (!error.response) return true; // Network error
    const status = error.response.status;
    return status >= 500 || status === 429; // Server error or rate limit
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Format error for consistent error handling
   */
  private formatError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        error: error.response.statusText,
        message: (error.response.data as any)?.message || error.message,
        statusCode: error.response.status,
        details: error.response.data as any,
        timestamp: new Date().toISOString(),
      };
    }
    return {
      error: 'Network Error',
      message: error.message,
      statusCode: 0,
      timestamp: new Date().toISOString(),
    };
  }

  // ==========================================================================
  // Authentication APIs
  // ==========================================================================

  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const response = await this.client.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.client.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }

  // ==========================================================================
  // Dashboard APIs
  // ==========================================================================

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await this.client.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  }

  async getSystemHealth(): Promise<ApiResponse<{ status: string; uptime: number; components: any[] }>> {
    const response = await this.client.get('/dashboard/health');
    return response.data;
  }

  // ==========================================================================
  // Agent APIs
  // ==========================================================================

  async getAgents(params?: { status?: string; type?: string }): Promise<ApiResponse<Agent[]>> {
    const response = await this.client.get<ApiResponse<Agent[]>>('/agents', { params });
    return response.data;
  }

  async getAgent(id: string): Promise<ApiResponse<Agent>> {
    const response = await this.client.get<ApiResponse<Agent>>(`/agents/${id}`);
    return response.data;
  }

  async createAgent(data: Partial<Agent>): Promise<ApiResponse<Agent>> {
    const response = await this.client.post<ApiResponse<Agent>>('/agents', data);
    return response.data;
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<ApiResponse<Agent>> {
    const response = await this.client.patch<ApiResponse<Agent>>(`/agents/${id}`, data);
    return response.data;
  }

  async deleteAgent(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/agents/${id}`);
    return response.data;
  }

  async getAgentMetrics(id: string, params?: { from?: string; to?: string }): Promise<ApiResponse<AgentMetrics[]>> {
    const response = await this.client.get<ApiResponse<AgentMetrics[]>>(`/agents/${id}/metrics`, { params });
    return response.data;
  }

  async restartAgent(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>(`/agents/${id}/restart`);
    return response.data;
  }

  // ==========================================================================
  // Workflow APIs
  // ==========================================================================

  async getWorkflows(params?: { status?: string; page?: number; pageSize?: number }): Promise<ApiResponse<PaginatedResponse<Workflow>>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Workflow>>>('/workflows', { params });
    return response.data;
  }

  async getWorkflow(id: string): Promise<ApiResponse<Workflow>> {
    const response = await this.client.get<ApiResponse<Workflow>>(`/workflows/${id}`);
    return response.data;
  }

  async createWorkflow(data: Partial<Workflow>): Promise<ApiResponse<Workflow>> {
    const response = await this.client.post<ApiResponse<Workflow>>('/workflows', data);
    return response.data;
  }

  async updateWorkflow(id: string, data: Partial<Workflow>): Promise<ApiResponse<Workflow>> {
    const response = await this.client.patch<ApiResponse<Workflow>>(`/workflows/${id}`, data);
    return response.data;
  }

  async deleteWorkflow(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/workflows/${id}`);
    return response.data;
  }

  async startWorkflow(id: string): Promise<ApiResponse<Workflow>> {
    const response = await this.client.post<ApiResponse<Workflow>>(`/workflows/${id}/start`);
    return response.data;
  }

  async pauseWorkflow(id: string): Promise<ApiResponse<Workflow>> {
    const response = await this.client.post<ApiResponse<Workflow>>(`/workflows/${id}/pause`);
    return response.data;
  }

  async resumeWorkflow(id: string): Promise<ApiResponse<Workflow>> {
    const response = await this.client.post<ApiResponse<Workflow>>(`/workflows/${id}/resume`);
    return response.data;
  }

  async cancelWorkflow(id: string): Promise<ApiResponse<Workflow>> {
    const response = await this.client.post<ApiResponse<Workflow>>(`/workflows/${id}/cancel`);
    return response.data;
  }

  async getWorkflowTemplates(): Promise<ApiResponse<WorkflowTemplate[]>> {
    const response = await this.client.get<ApiResponse<WorkflowTemplate[]>>('/workflows/templates');
    return response.data;
  }

  // ==========================================================================
  // Audit Log APIs
  // ==========================================================================

  async getAuditLogs(params: AuditFilters & { page?: number; pageSize?: number }): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<AuditLog>>>('/audit', { params });
    return response.data;
  }

  async exportAuditLogs(filters: AuditFilters, format: 'json' | 'csv'): Promise<Blob> {
    const response = await this.client.post('/audit/export', { filters, format }, {
      responseType: 'blob',
    });
    return response.data;
  }

  // ==========================================================================
  // Proof Log APIs
  // ==========================================================================

  async getProofLogs(params?: { page?: number; pageSize?: number; workflowId?: string }): Promise<ApiResponse<PaginatedResponse<ProofLog>>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<ProofLog>>>('/proofs', { params });
    return response.data;
  }

  async getProofLog(id: string): Promise<ApiResponse<ProofLog>> {
    const response = await this.client.get<ApiResponse<ProofLog>>(`/proofs/${id}`);
    return response.data;
  }

  async verifyProof(id: string): Promise<ApiResponse<ProofLog>> {
    const response = await this.client.post<ApiResponse<ProofLog>>(`/proofs/${id}/verify`);
    return response.data;
  }

  async exportProofs(options: ProofExportOptions): Promise<Blob> {
    const response = await this.client.post('/proofs/export', options, {
      responseType: 'blob',
    });
    return response.data;
  }

  // ==========================================================================
  // Onboarding APIs
  // ==========================================================================

  async getOnboardingGuides(): Promise<ApiResponse<OnboardingGuide[]>> {
    const response = await this.client.get<ApiResponse<OnboardingGuide[]>>('/onboarding/guides');
    return response.data;
  }

  async getOnboardingGuide(id: string): Promise<ApiResponse<OnboardingGuide>> {
    const response = await this.client.get<ApiResponse<OnboardingGuide>>(`/onboarding/guides/${id}`);
    return response.data;
  }

  async updateOnboardingProgress(guideId: string, stepId: string, status: string): Promise<ApiResponse<OnboardingGuide>> {
    const response = await this.client.patch<ApiResponse<OnboardingGuide>>(`/onboarding/guides/${guideId}/steps/${stepId}`, { status });
    return response.data;
  }

  // ==========================================================================
  // Demo & Runbook APIs
  // ==========================================================================

  async getDemoScenarios(): Promise<ApiResponse<DemoScenario[]>> {
    const response = await this.client.get<ApiResponse<DemoScenario[]>>('/demos');
    return response.data;
  }

  async getRunbooks(): Promise<ApiResponse<Runbook[]>> {
    const response = await this.client.get<ApiResponse<Runbook[]>>('/runbooks');
    return response.data;
  }

  async getRunbook(id: string): Promise<ApiResponse<Runbook>> {
    const response = await this.client.get<ApiResponse<Runbook>>(`/runbooks/${id}`);
    return response.data;
  }

  // ==========================================================================
  // User Management APIs
  // ==========================================================================

  async getUsers(params?: { page?: number; pageSize?: number; role?: string }): Promise<ApiResponse<PaginatedResponse<User>>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<User>>>('/users', { params });
    return response.data;
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    const response = await this.client.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  }

  async createUser(data: Partial<User> & { password: string }): Promise<ApiResponse<User>> {
    const response = await this.client.post<ApiResponse<User>>('/users', data);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.client.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
