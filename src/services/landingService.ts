import apiClient from './apiClient';
import { LandingTemplate, LandingEvent, LandingRequest } from '../types';

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
    requests: LandingRequest[];
  }> => {
    const response = await apiClient.get(`/v1/landings/${id}`);
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

  getRequests: async (landingId: number): Promise<LandingRequest[]> => {
    const response = await apiClient.get(`/v1/landings/${landingId}/requests`);
    return response.data?.data || response.data || [];
  },

  toggleStatus: async (id: number, status?: number): Promise<{ id: number; status: number }> => {
    const response = await apiClient.post(`/v1/landings/${id}/toggle-status`, { status });
    return response.data?.data || response.data;
  },
};

export default landingService;
