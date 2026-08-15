import apiClient from './apiClient';
import { EmailTemplate, EmailCampaign } from '../types';

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

  getCampaigns: async (): Promise<EmailCampaign[]> => {
    const response = await apiClient.get('/v1/marketing/campaigns');
    return response.data?.data || response.data || [];
  },

  sendCampaign: async (data: {
    name: string;
    subject: string;
    body_html: string;
    email_template_id?: number;
    stage_id?: number;
    client_ids?: number[];
  }): Promise<{ message: string; data: { campaign: EmailCampaign; sent_count: number; failed_count: number } }> => {
    const response = await apiClient.post('/v1/marketing/campaigns/send', data);
    return response.data;
  },
};

export default marketingService;
