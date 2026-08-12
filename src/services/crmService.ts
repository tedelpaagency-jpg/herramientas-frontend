import apiClient from './apiClient';
import { Client, CrmPipelineItem, WorkspaceStage, PipelineActivity } from '../types';

export const crmService = {
  // Clients CRUD
  getClients: async (params?: Record<string, any>): Promise<Client[]> => {
    const response = await apiClient.get('/v1/clients', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getClient: async (id: number): Promise<Client> => {
    const response = await apiClient.get(`/v1/clients/${id}`);
    return response.data?.data || response.data;
  },

  createClient: async (data: Partial<Client>): Promise<Client> => {
    const response = await apiClient.post('/v1/clients', data);
    return response.data?.data || response.data;
  },

  updateClient: async (id: number, data: Partial<Client>): Promise<Client> => {
    const response = await apiClient.put(`/v1/clients/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteClient: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/clients/${id}`);
  },

  // CRM Pipeline & Kanban
  getPipelines: async (): Promise<{ stages: WorkspaceStage[]; pipelines: CrmPipelineItem[] }> => {
    const response = await apiClient.get('/v1/crm/pipelines');
    return {
      stages: response.data?.stages || response.data?.data?.stages || [],
      pipelines: response.data?.pipelines || response.data?.data?.pipelines || [],
    };
  },

  moveStage: async (pipelineId: number, stageId: number): Promise<{ message: string; pipeline: CrmPipelineItem }> => {
    const response = await apiClient.post('/v1/crm/move-stage', {
      pipeline_id: pipelineId,
      stage_id: stageId,
    });
    return response.data;
  },

  logActivity: async (clientId: number, activityType: string, note: string): Promise<PipelineActivity> => {
    const response = await apiClient.post('/v1/crm/log-activity', {
      client_id: clientId,
      activity_type: activityType,
      note,
    });
    return response.data?.activity || response.data;
  },
};

export default crmService;
