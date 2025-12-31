/**
 * Custom React Hooks for Data Fetching
 * Production-ready hooks with proper error handling and real-time updates
 */

import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import { wsService } from '../services/websocket';
import type {
  Agent,
  Workflow,
  AuditLog,
  ProofLog,
  DashboardStats,
  OnboardingGuide,
  Runbook,
  DemoScenario,
  WebSocketMessageType,
  PaginatedResponse,
  AuditFilters,
} from '../types';

// ============================================================================
// Generic Hook Types
// ============================================================================

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UsePaginatedDataState<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refetch: () => Promise<void>;
}

// ============================================================================
// Dashboard Hooks
// ============================================================================

export const useDashboardStats = (): UseDataState<DashboardStats> => {
  const [state, setState] = useState<UseDataState<DashboardStats>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getDashboardStats();
      setState(prev => ({ ...prev, data: response.data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};

// ============================================================================
// Agent Hooks
// ============================================================================

export const useAgents = (filters?: { status?: string; type?: string }): UseDataState<Agent[]> => {
  const [state, setState] = useState<UseDataState<Agent[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getAgents(filters);
      setState(prev => ({ ...prev, data: response.data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, [filters]);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = wsService.subscribe<Agent>('agent_status' as WebSocketMessageType, (updatedAgent) => {
      setState(prev => ({
        ...prev,
        data: prev.data?.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent) || null,
      }));
    });

    return () => {
      unsubscribe();
    };
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};

export const useAgent = (id: string): UseDataState<Agent> => {
  const [state, setState] = useState<UseDataState<Agent>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getAgent(id);
      setState(prev => ({ ...prev, data: response.data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, [id]);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = wsService.subscribe<Agent>('agent_status' as WebSocketMessageType, (updatedAgent) => {
      if (updatedAgent.id === id) {
        setState(prev => ({ ...prev, data: updatedAgent }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchData, id]);

  return { ...state, refetch: fetchData };
};

// ============================================================================
// Workflow Hooks
// ============================================================================

export const useWorkflows = (filters?: { status?: string }): UsePaginatedDataState<Workflow> => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [state, setState] = useState<Omit<UsePaginatedDataState<Workflow>, 'setPage' | 'setPageSize'>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getWorkflows({ ...filters, page, pageSize });
      setState({
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        loading: false,
        error: null,
        refetch: async () => {},
      });
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = wsService.subscribe<Workflow>('workflow_update' as WebSocketMessageType, (updatedWorkflow) => {
      setState(prev => ({
        ...prev,
        data: prev.data.map(workflow => workflow.id === updatedWorkflow.id ? updatedWorkflow : workflow),
      }));
    });

    return () => {
      unsubscribe();
    };
  }, [fetchData]);

  return { ...state, setPage, setPageSize, refetch: fetchData };
};

export const useWorkflow = (id: string): UseDataState<Workflow> => {
  const [state, setState] = useState<UseDataState<Workflow>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getWorkflow(id);
      setState(prev => ({ ...prev, data: response.data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, [id]);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = wsService.subscribe<Workflow>('workflow_update' as WebSocketMessageType, (updatedWorkflow) => {
      if (updatedWorkflow.id === id) {
        setState(prev => ({ ...prev, data: updatedWorkflow }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchData, id]);

  return { ...state, refetch: fetchData };
};

// ============================================================================
// Audit Log Hooks
// ============================================================================

export const useAuditLogs = (filters: AuditFilters): UsePaginatedDataState<AuditLog> => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [state, setState] = useState<Omit<UsePaginatedDataState<AuditLog>, 'setPage' | 'setPageSize'>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 20,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getAuditLogs({ ...filters, page, pageSize });
      setState({
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        loading: false,
        error: null,
        refetch: async () => {},
      });
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time audit log updates
    const unsubscribe = wsService.subscribe<AuditLog>('audit_log' as WebSocketMessageType, (newLog) => {
      setState(prev => ({
        ...prev,
        data: [newLog, ...prev.data].slice(0, pageSize),
        total: prev.total + 1,
      }));
    });

    return () => {
      unsubscribe();
    };
  }, [fetchData, pageSize]);

  return { ...state, setPage, setPageSize, refetch: fetchData };
};

// ============================================================================
// Proof Log Hooks
// ============================================================================

export const useProofLogs = (params?: { workflowId?: string }): UsePaginatedDataState<ProofLog> => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [state, setState] = useState<Omit<UsePaginatedDataState<ProofLog>, 'setPage' | 'setPageSize'>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getProofLogs({ ...params, page, pageSize });
      setState({
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        loading: false,
        error: null,
        refetch: async () => {},
      });
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, [params, page, pageSize]);

  useEffect(() => {
    fetchData();

    // Subscribe to proof verification updates
    const unsubscribe = wsService.subscribe<ProofLog>('proof_verification' as WebSocketMessageType, (updatedProof) => {
      setState(prev => ({
        ...prev,
        data: prev.data.map(proof => proof.id === updatedProof.id ? updatedProof : proof),
      }));
    });

    return () => {
      unsubscribe();
    };
  }, [fetchData]);

  return { ...state, setPage, setPageSize, refetch: fetchData };
};

// ============================================================================
// Onboarding Hooks
// ============================================================================

export const useOnboardingGuides = (): UseDataState<OnboardingGuide[]> => {
  const [state, setState] = useState<UseDataState<OnboardingGuide[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getOnboardingGuides();
      setState(prev => ({ ...prev, data: response.data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};

// ============================================================================
// Demo & Runbook Hooks
// ============================================================================

export const useDemoScenarios = (): UseDataState<DemoScenario[]> => {
  const [state, setState] = useState<UseDataState<DemoScenario[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getDemoScenarios();
      setState(prev => ({ ...prev, data: response.data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};

export const useRunbooks = (): UseDataState<Runbook[]> => {
  const [state, setState] = useState<UseDataState<Runbook[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getRunbooks();
      setState(prev => ({ ...prev, data: response.data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};

export const useRunbook = (id: string): UseDataState<Runbook> => {
  const [state, setState] = useState<UseDataState<Runbook>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.getRunbook(id);
      setState(prev => ({ ...prev, data: response.data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }));
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};
