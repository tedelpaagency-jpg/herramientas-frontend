import apiClient from './apiClient';
import {
  Client,
  CrmPipelineItem,
  WorkspaceStage,
  PipelineActivity,
  PipelineTask,
  PipelineProposal,
  PipelinePayment,
  PaginatedResult,
} from '../types';

export const crmService = {
  // Clients CRUD
  getClients: async (params?: Record<string, any>): Promise<PaginatedResult<Client>> => {
    const response = await apiClient.get('/v1/clients', { params });
    const raw = response.data;
    const payload = raw?.data || raw;

    if (Array.isArray(payload)) {
      return {
        data: payload,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: payload.length || 15,
          total: payload.length,
          from: payload.length ? 1 : 0,
          to: payload.length,
        },
      };
    }

    if (payload && Array.isArray(payload.data)) {
      return {
        data: payload.data,
        pagination: {
          current_page: payload.current_page || 1,
          last_page: payload.last_page || 1,
          per_page: payload.per_page || 15,
          total: payload.total || payload.data.length,
          from: payload.from || 0,
          to: payload.to || 0,
        },
      };
    }

    return {
      data: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
      },
    };
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
    classification?: string;
    notes?: string;
    custom_fields?: Record<string, any>;
  }): Promise<CrmPipelineItem> => {
    const response = await apiClient.post('/v1/crm/leads', data);
    return response.data?.data || response.data;
  },

  // Update Lead Details & Client Info
  updateLeadDetails: async (
    pipelineId: number,
    data: {
      name?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      city?: string;
      country?: string;
      classification?: string;
      notes?: string;
      estimated_value?: number;
      priority?: number;
      assigned_user_id?: number | null;
      stage_id?: number;
      custom_fields?: Record<string, any>;
    }
  ): Promise<CrmPipelineItem> => {
    const response = await apiClient.put(`/v1/crm/leads/${pipelineId}`, data);
    return response.data?.data || response.data;
  },

  // Update Client Classification
  updateClientClassification: async (clientId: number, classification?: string | null): Promise<Client> => {
    const response = await apiClient.post(`/v1/crm/clients/${clientId}/classification`, {
      classification: classification || 'sin_clasificacion',
    });
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

  // Assign Agent to Leads
  assignAgent: async (pipelineIds: number[], assignedUserId: number | null): Promise<CrmPipelineItem[]> => {
    const response = await apiClient.post('/v1/crm/assign-agent', {
      pipeline_ids: pipelineIds,
      assigned_user_id: assignedUserId,
    });
    return response.data?.data || response.data;
  },

  // Download Import Template
  downloadImportTemplate: async (): Promise<void> => {
    const response = await apiClient.get('/v1/crm/import-template', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PLANTILLA_CLIENTES.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Import Leads
  importLeads: async (formData: FormData): Promise<{ imported_count: number; errors: string[] }> => {
    const response = await apiClient.post('/v1/crm/import-leads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default crmService;
