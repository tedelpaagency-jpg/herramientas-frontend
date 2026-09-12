import apiClient from './apiClient';
import { LandingTemplate, LandingAvailableResources } from '../types/landing';

export interface LandingEvent {
  id: number;
  landing_id: number;
  name: string;
  date_start: string;
  date_end: string;
  status: number;
}

export interface LandingRequestItem {
  id: number;
  landing_id: number;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  answers?: Record<string, any>;
}

export const landingService = {
  getLandings: async (): Promise<LandingTemplate[]> => {
    const response = await apiClient.get('/v1/landings');
    return response.data?.data || response.data || [];
  },

  getLandingDetail: async (id: number): Promise<{
    template: LandingTemplate;
    encoded_id: string;
    public_url: string;
    events: LandingEvent[];
    requests: LandingRequestItem[];
  }> => {
    const response = await apiClient.get(`/v1/landings/${id}`);
    return response.data?.data || response.data;
  },

  createLanding: async (data: Partial<LandingTemplate>): Promise<LandingTemplate> => {
    const response = await apiClient.post('/v1/landings', data);
    return response.data?.data || response.data;
  },

  updateLandingBuilder: async (id: number, data: Partial<LandingTemplate>): Promise<LandingTemplate> => {
    const response = await apiClient.put(`/v1/landings/${id}/builder`, data);
    return response.data?.data || response.data;
  },

  uploadCustomHtml: async (id: number, customHtml: string): Promise<LandingTemplate> => {
    const response = await apiClient.post(`/v1/landings/${id}/upload-html`, { custom_html: customHtml });
    return response.data?.data || response.data;
  },

  getAvailableResources: async (): Promise<LandingAvailableResources> => {
    const response = await apiClient.get('/v1/landings/available-resources');
    return response.data?.data || response.data;
  },

  createEvent: async (data: {
    landing_id: number;
    name: string;
    date_start: string;
    date_end: string;
    email_remembers?: number;
    link?: string;
  }): Promise<LandingEvent> => {
    const response = await apiClient.post('/v1/landings/events', data);
    return response.data?.data || response.data;
  },

  getRequests: async (landingId: number): Promise<LandingRequestItem[]> => {
    const response = await apiClient.get(`/v1/landings/${landingId}/requests`);
    return response.data?.data || response.data || [];
  },

  toggleStatus: async (id: number, status?: number): Promise<{ id: number; status: number }> => {
    const response = await apiClient.post(`/v1/landings/${id}/toggle-status`, { status });
    return response.data?.data || response.data;
  },

  deleteLanding: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/landings/${id}`);
  },
};

export default landingService;
