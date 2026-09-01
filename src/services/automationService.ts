import apiClient from './apiClient';

export interface AutomationWorkspace {
  id: number;
  name: string;
  agency_id?: number;
  color?: string;
}

export interface AutomationAgency {
  id: number;
  name: string;
}

export interface PipelineAutomation {
  id: number;
  agency_id?: number;
  workspace_id?: number;
  stage_id?: number;
  name: string;
  trigger_type: string;
  condition_type: string;
  condition_value?: string;
  action_type: string;
  action_value?: string;
  notification_email?: string;
  delay_minutes?: number;
  status: boolean;
  stage?: {
    id: number;
    name: string;
    color?: string;
  };
  workspace?: {
    id: number;
    name: string;
    color?: string;
  };
  created_at?: string;
}

export interface AutomationMeta {
  triggers: { key: string; label: string; description: string }[];
  conditions: { key: string; label: string }[];
  actions: { key: string; label: string; description: string }[];
  stages: { id: number; name: string }[];
  users: { id: number; name: string; email: string }[];
  workspaces?: AutomationWorkspace[];
  agencies?: AutomationAgency[];
}

export const automationService = {
  getAutomations: async (): Promise<PipelineAutomation[]> => {
    const response = await apiClient.get('/v1/automations');
    return response.data;
  },

  getMeta: async (): Promise<AutomationMeta> => {
    const response = await apiClient.get('/v1/automations/meta');
    return response.data;
  },

  createAutomation: async (data: Partial<PipelineAutomation>): Promise<PipelineAutomation> => {
    const response = await apiClient.post('/v1/automations', data);
    return response.data;
  },

  updateAutomation: async (id: number, data: Partial<PipelineAutomation>): Promise<PipelineAutomation> => {
    const response = await apiClient.put(`/v1/automations/${id}`, data);
    return response.data;
  },

  deleteAutomation: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/automations/${id}`);
  },
};

export default automationService;
