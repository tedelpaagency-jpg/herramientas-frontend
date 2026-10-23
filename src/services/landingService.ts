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
    const response = await apiClient.post(`/v1/landings/${id}/builder`, data);
    return response.data?.data || response.data;
  },

  uploadCustomHtml: async (id: number, customHtml: string): Promise<LandingTemplate> => {
    const response = await apiClient.post(`/v1/landings/${id}/upload-html`, { custom_html: customHtml });
    return response.data?.data || response.data;
  },

  getAvailableResources: async (): Promise<LandingAvailableResources> => {
    const response = await apiClient.get('/v1/landings/available-resources');
    const data = response.data?.data || response.data || {};
    if (!Array.isArray(data.workspaces) || data.workspaces.length === 0) {
      try {
        const wsResp = await apiClient.get('/v1/workspaces-meta');
        const wsList = wsResp.data?.data || wsResp.data || [];
        if (Array.isArray(wsList) && wsList.length > 0) {
          data.workspaces = wsList;
          const extractedStages: Array<{ id: number; name: string; workspace_id: number }> = [];
          wsList.forEach((ws: any) => {
            if (Array.isArray(ws.stages)) {
              ws.stages.forEach((st: any) => {
                extractedStages.push({
                  id: Number(st.id),
                  workspace_id: Number(st.workspace_id || ws.id),
                  name: st.name,
                });
              });
            }
          });
          if (extractedStages.length > 0 && (!Array.isArray(data.stages) || data.stages.length === 0)) {
            data.stages = extractedStages;
          }
        }
      } catch {
        // Ignore fallback error
      }
    }
    return {
      courses: Array.isArray(data.courses) ? data.courses : [],
      workspaces: Array.isArray(data.workspaces) ? data.workspaces : [],
      stages: Array.isArray(data.stages) ? data.stages : [],
      workflows: Array.isArray(data.workflows) ? data.workflows : [],
      white_labels: Array.isArray(data.white_labels) ? data.white_labels : [],
      agencies: Array.isArray(data.agencies) ? data.agencies : [],
      plans: Array.isArray(data.plans) ? data.plans : [],
      credential_templates: Array.isArray(data.credential_templates) ? data.credential_templates : [],
    };
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

  getPublicLanding: async (idOrEncodedId: string): Promise<any> => {
    const response = await apiClient.get(`/v1/public/landings/${idOrEncodedId}`);
    return response.data?.data || response.data;
  },

  submitPublicLead: async (payload: any): Promise<any> => {
    const response = await apiClient.post('/v1/public/landings/lead', payload);
    return response.data;
  },

  createPaymentIntent: async (
    idOrEncodedId: string | number,
    data?: { name?: string; email?: string; amount?: number }
  ): Promise<{
    client_secret: string;
    payment_intent_id: string;
    publishable_key: string;
    amount: number;
    currency: string;
  }> => {
    const response = await apiClient.post(`/v1/public/landings/${idOrEncodedId}/payment-intent`, data || {});
    return response.data?.data || response.data;
  },

  lookupDomain: async (domain: string): Promise<any> => {
    const response = await apiClient.get(`/v1/public/landing-domain-lookup?domain=${encodeURIComponent(domain)}`);
    return response.data?.data || response.data;
  },
};

export default landingService;
