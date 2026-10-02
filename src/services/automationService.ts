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

export interface AutomationEmailTemplate {
  id: number;
  name: string;
  category?: string;
  subject: string;
  body_html: string;
}

export interface WebhookTestPayload {
  url: string;
  method?: string;
  headers?: { key: string; value: string }[] | Record<string, string>;
  custom_data?: { key: string; value: string }[] | Record<string, any>;
  customData?: { key: string; value: string }[] | Record<string, any>;
}

export interface WebhookTestResult {
  status: 'success' | 'error';
  http_status: number;
  duration_ms: number;
  url: string;
  method: string;
  response_data?: any;
  sent_payload?: any;
  message: string;
  error?: string;
}

export interface PipelineAutomation {
  id: number;
  agency_id?: number;
  workspace_id?: number;
  stage_id?: number;
  email_template_id?: number | null;
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
  stages: { id: number; name: string; workspace_id?: number; color?: string }[];
  users: { id: number; name: string; email: string; agency_id?: number }[];
  workspaces?: AutomationWorkspace[];
  agencies?: AutomationAgency[];
  email_templates?: AutomationEmailTemplate[];
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

  sendTestEmail: async (data: { recipient_email: string; subject: string; body: string }): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post('/v1/automations/test-email', data);
    return response.data;
  },

  testWebhook: async (data: WebhookTestPayload): Promise<WebhookTestResult> => {
    const response = await apiClient.post('/v1/automations/test-webhook', data);
    return response.data;
  },
};

export default automationService;

