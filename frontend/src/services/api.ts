import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Discovery API
export const discoveryService = {
  startDiscovery: async (clientName: string, businessName: string) => {
    const response = await apiClient.post('/api/discovery/start', {
      client_name: clientName,
      business_name: businessName,
    });
    return response.data;
  },

  getDiscovery: async (id: number) => {
    const response = await apiClient.get(`/api/discovery/${id}`);
    return response.data;
  },

  listDiscoveries: async () => {
    const response = await apiClient.get('/api/discovery/');
    return response.data;
  },

  getCompletePack: async (id: number) => {
    const response = await apiClient.get(`/api/discovery/${id}/complete-pack`);
    return response.data;
  },
};

// Intelligence API
export const intelligenceService = {
  getReport: async (discoveryId: number) => {
    const response = await apiClient.get(`/api/intelligence/${discoveryId}/report`);
    return response.data;
  },

  listReports: async (discoveryId: number) => {
    const response = await apiClient.get(`/api/intelligence/${discoveryId}/reports`);
    return response.data;
  },
};

// Proposals API
export const proposalsService = {
  getProposals: async (discoveryId: number) => {
    const response = await apiClient.get(`/api/proposals/${discoveryId}/proposals`);
    return response.data;
  },

  getProposal: async (proposalId: number) => {
    const response = await apiClient.get(`/api/proposals/proposal/${proposalId}`);
    return response.data;
  },
};

// Simulations API
export const simulationsService = {
  getSimulations: async (discoveryId: number) => {
    const response = await apiClient.get(`/api/simulations/${discoveryId}/simulations`);
    return response.data;
  },

  getSimulation: async (simulationId: number) => {
    const response = await apiClient.get(`/api/simulations/simulation/${simulationId}`);
    return response.data;
  },
};

// Vision Cortex API
export const visionCortexService = {
  createSession: async (discoveryId?: number, userType: string = 'client') => {
    const response = await apiClient.post('/api/vision-cortex/session/create', {
      discovery_id: discoveryId,
      user_type: userType,
    });
    return response.data;
  },

  sendMessage: async (sessionToken: string, message: string, contextIds?: number[]) => {
    const response = await apiClient.post('/api/vision-cortex/chat', {
      session_token: sessionToken,
      message,
      context_ids: contextIds,
    });
    return response.data;
  },

  getHistory: async (sessionToken: string) => {
    const response = await apiClient.get(`/api/vision-cortex/session/${sessionToken}/history`);
    return response.data;
  },

  closeSession: async (sessionToken: string) => {
    const response = await apiClient.post(`/api/vision-cortex/session/${sessionToken}/close`);
    return response.data;
  },
};

export default apiClient;
