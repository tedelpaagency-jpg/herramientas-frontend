import apiClient from './apiClient';
import {
  Client,
  CrmPipelineItem,
  WorkspaceStage,
  PipelineActivity,
  PipelineTask,
  PipelineProposal,
  PipelinePayment,
} from '../types';

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
  getPipelines: async (params?: Record<string, any>): Promise<{ workspace?: any; stages: WorkspaceStage[]; pipelines: CrmPipelineItem[] }> => {
    const response = await apiClient.get('/v1/crm/pipelines', { params });
    const data = response.data?.data || response.data || {};
    return {
      workspace: data.workspace || response.data?.workspace || null,
      stages: data.stages || response.data?.stages || [],
      pipelines: data.pipelines || response.data?.pipelines || [],
    };
  },


  moveStage: async (pipelineId: number, stageId: number, notes?: string): Promise<{ message: string; pipeline: CrmPipelineItem }> => {
    const response = await apiClient.post('/v1/crm/move-stage', {
      pipeline_id: pipelineId,
      stage_id: stageId,
      notes,
    });
    return response.data;
  },

  logActivity: async (pipelineId: number, type: string, content: string): Promise<PipelineActivity> => {
    const response = await apiClient.post('/v1/crm/log-activity', {
      client_pipeline_id: pipelineId,
      type,
      content,
    });
    return response.data?.activity || response.data?.data || response.data;
  },

  // Stage CRUD
  createStage: async (data: { name: string; color?: string }): Promise<WorkspaceStage> => {
    const response = await apiClient.post('/v1/crm/stages', data);
    return response.data?.data || response.data;
  },

  updateStage: async (id: number, data: { name?: string; color?: string; sort_order?: number }): Promise<WorkspaceStage> => {
    const response = await apiClient.put(`/v1/crm/stages/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteStage: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/crm/stages/${id}`);
  },

  // Tasks
  addTask: async (data: { client_pipeline_id: number; title: string; due_at?: string }): Promise<PipelineTask> => {
    const response = await apiClient.post('/v1/crm/tasks', data);
    return response.data?.data || response.data;
  },

  toggleTask: async (taskId: number): Promise<PipelineTask> => {
    const response = await apiClient.patch(`/v1/crm/tasks/${taskId}/toggle`);
    return response.data?.data || response.data;
  },

  // Proposals
  addProposal: async (data: { client_pipeline_id: number; item: string; qty: number; price: number }): Promise<PipelineProposal> => {
    const response = await apiClient.post('/v1/crm/proposals', data);
    return response.data?.data || response.data;
  },

  deleteProposal: async (proposalId: number): Promise<void> => {
    await apiClient.delete(`/v1/crm/proposals/${proposalId}`);
  },

  // Create Lead
  createLead: async (data: {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
    stage_id: number;
    estimated_value?: number;
    priority?: number;
    source?: string;
    notes?: string;
  }): Promise<CrmPipelineItem> => {
    const response = await apiClient.post('/v1/crm/leads', data);
    return response.data?.data || response.data;
  },

  // Reorder Stages Horizontally
  reorderStages: async (stages: { id: number; sort_order: number }[]): Promise<void> => {
    await apiClient.post('/v1/crm/stages/reorder', { stages });
  },

  // Payment Links
  generatePaymentLink: async (data: { client_pipeline_id: number; name: string; total_amount: number }): Promise<PipelinePayment & { payment_url: string }> => {
    const response = await apiClient.post('/v1/crm/payment-links', data);
    return response.data;
  },
};

export default crmService;
