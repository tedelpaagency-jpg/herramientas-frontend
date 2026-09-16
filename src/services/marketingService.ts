import apiClient from './apiClient';
import { EmailTemplate, EmailCampaign, CredentialTemplate } from '../types';

export const marketingService = {
  getTemplates: async (): Promise<EmailTemplate[]> => {
    const response = await apiClient.get('/v1/marketing/templates');
    return response.data?.data || response.data || [];
  },

  createTemplate: async (data: { name: string; subject?: string; body_html: string }): Promise<EmailTemplate> => {
    const response = await apiClient.post('/v1/marketing/templates', data);
    return response.data?.data || response.data;
  },

  updateTemplate: async (id: number, data: { name?: string; subject?: string; body_html?: string }): Promise<EmailTemplate> => {
    const response = await apiClient.put(`/v1/marketing/templates/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteTemplate: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/marketing/templates/${id}`);
  },

  // Credential Templates API
  getCredentialTemplates: async (params?: { status?: number; agency_id?: number }): Promise<CredentialTemplate[]> => {
    const response = await apiClient.get('/v1/marketing/credential-templates', { params });
    return response.data?.data || response.data || [];
  },

  createCredentialTemplate: async (data: { name: string; subject?: string; body_html: string; status?: number }): Promise<CredentialTemplate> => {
    const response = await apiClient.post('/v1/marketing/credential-templates', data);
    return response.data?.data || response.data;
  },

  updateCredentialTemplate: async (id: number, data: { name?: string; subject?: string; body_html?: string; status?: number }): Promise<CredentialTemplate> => {
    const response = await apiClient.post(`/v1/marketing/credential-templates/${id}/update`, data);
    return response.data?.data || response.data;
  },

  toggleCredentialTemplateStatus: async (id: number, status?: number): Promise<CredentialTemplate> => {
    const response = await apiClient.post(`/v1/marketing/credential-templates/${id}/toggle-status`, { status });
    return response.data?.data || response.data;
  },

  deleteCredentialTemplate: async (id: number): Promise<void> => {
    await apiClient.post(`/v1/marketing/credential-templates/${id}/delete`);
  },

  getCampaigns: async (): Promise<EmailCampaign[]> => {
    const response = await apiClient.get('/v1/marketing/campaigns');
    return response.data?.data || response.data || [];
  },

  sendCampaign: async (data: {
    name: string;
    subject: string;
    body_html: string;
    email_template_id?: number;
    workspace_id?: number;
    stage_id?: number;
    client_ids?: number[];
  }): Promise<{ message: string; data: { campaign: EmailCampaign; sent_count: number; failed_count: number } }> => {
    const response = await apiClient.post('/v1/marketing/campaigns/send', data);
    return response.data;
  },
};

export default marketingService;
