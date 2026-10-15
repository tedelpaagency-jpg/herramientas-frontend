import apiClient from './apiClient';
import { 
  MarketingMediaResource, 
  MarketingTemplate, 
  MarketingGeneration, 
  MarketingB2BMetrics,
  MarketingCreativeCategory,
} from '../types/marketingB2B';

export const marketingB2BService = {
  // ==========================================
  // CATEGORÍAS DE CREATIVOS (EXCLUSIVAS MARCA BLANCA)
  // ==========================================
  getCategories: async (params?: { is_active?: boolean; search?: string }): Promise<MarketingCreativeCategory[]> => {
    const response = await apiClient.get('/v1/marketing-b2b/categories', { params });
    return response.data?.data || response.data || [];
  },

  createCategory: async (data: Partial<MarketingCreativeCategory>): Promise<MarketingCreativeCategory> => {
    const response = await apiClient.post('/v1/marketing-b2b/categories', data);
    return response.data?.data || response.data;
  },

  updateCategory: async (id: number, data: Partial<MarketingCreativeCategory>): Promise<MarketingCreativeCategory> => {
    const response = await apiClient.post(`/v1/marketing-b2b/categories/${id}/update`, data);
    return response.data?.data || response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.post(`/v1/marketing-b2b/categories/${id}/delete`);
  },

  // ==========================================
  // RECURSOS MAESTROS MULTIMEDIA (LEGACY)
  // ==========================================
  getResources: async (params?: {
    type?: string;
    aspect_ratio?: string;
    country?: string;
    category?: string;
    status?: string;
    search?: string;
    per_page?: number;
    page?: number;
    white_label_id?: number;
  }): Promise<{ data: MarketingMediaResource[]; total: number; last_page: number; current_page: number }> => {
    const response = await apiClient.get('/v1/marketing-b2b/resources', { params });
    return {
      data: response.data?.data || [],
      total: response.data?.total || 0,
      last_page: response.data?.last_page || 1,
      current_page: response.data?.current_page || 1,
    };
  },

  getResource: async (id: number): Promise<MarketingMediaResource> => {
    const response = await apiClient.get(`/v1/marketing-b2b/resources/${id}`);
    return response.data?.data || response.data;
  },

  uploadResource: async (formData: FormData): Promise<MarketingMediaResource> => {
    const response = await apiClient.post('/v1/marketing-b2b/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data || response.data;
  },

  updateResource: async (id: number, data: Partial<MarketingMediaResource>): Promise<MarketingMediaResource> => {
    const response = await apiClient.post(`/v1/marketing-b2b/resources/${id}/update`, data);
    return response.data?.data || response.data;
  },

  deleteResource: async (id: number): Promise<void> => {
    await apiClient.post(`/v1/marketing-b2b/resources/${id}/delete`);
  },

  // ==========================================
  // PLANTILLAS PUBLICITARIAS
  // ==========================================
  getTemplates: async (params?: {
    aspect_ratio?: string;
    type?: string;
    status?: string;
    country?: string;
    category_id?: number | string;
    search?: string;
    per_page?: number;
    page?: number;
    white_label_id?: number;
  }): Promise<{ data: MarketingTemplate[]; total: number; last_page: number; current_page: number }> => {
    const response = await apiClient.get('/v1/marketing-b2b/templates', { params });
    return {
      data: response.data?.data || [],
      total: response.data?.total || 0,
      last_page: response.data?.last_page || 1,
      current_page: response.data?.current_page || 1,
    };
  },

  getTemplate: async (id: number): Promise<MarketingTemplate> => {
    const response = await apiClient.get(`/v1/marketing-b2b/templates/${id}`);
    return response.data?.data || response.data;
  },

  createTemplate: async (data: any): Promise<MarketingTemplate> => {
    const response = await apiClient.post('/v1/marketing-b2b/templates', data);
    return response.data?.data || response.data;
  },

  updateTemplate: async (id: number, data: any): Promise<MarketingTemplate> => {
    const response = await apiClient.post(`/v1/marketing-b2b/templates/${id}/update`, data);
    return response.data?.data || response.data;
  },

  duplicateTemplate: async (id: number): Promise<MarketingTemplate> => {
    const response = await apiClient.post(`/v1/marketing-b2b/templates/${id}/duplicate`);
    return response.data?.data || response.data;
  },

  togglePublishTemplate: async (id: number): Promise<MarketingTemplate> => {
    const response = await apiClient.post(`/v1/marketing-b2b/templates/${id}/toggle-publish`);
    return response.data?.data || response.data;
  },

  deleteTemplate: async (id: number): Promise<void> => {
    await apiClient.post(`/v1/marketing-b2b/templates/${id}/delete`);
  },

  // ==========================================
  // GENERACIONES & RENDERIZADO ASÍNCRONO
  // ==========================================
  requestGeneration: async (data: {
    template_id: number;
    sale_price: number;
    format?: string;
    customization_payload?: Record<string, any>;
    agency_id?: number;
  }): Promise<{ id: number; uuid: string; status: string; progress: number; projected_profit: number; currency: string }> => {
    const response = await apiClient.post('/v1/marketing-b2b/generations/create', data);
    return response.data?.data || response.data;
  },

  getGenerationStatus: async (uuid: string): Promise<{
    uuid: string;
    state: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    output_url?: string | null;
    type: string;
    format: string;
    sale_price: number;
    base_cost: number;
    projected_profit: number;
    currency: string;
    processing_time_ms?: number;
    file_size?: number;
    expires_at?: string;
    error_message?: string;
  }> => {
    const response = await apiClient.get(`/v1/marketing-b2b/generations/${uuid}/status`);
    return response.data?.data || response.data;
  },

  getGenerationHistory: async (params?: {
    agency_id?: number;
    type?: string;
    status?: string;
    per_page?: number;
    page?: number;
  }): Promise<{ data: MarketingGeneration[]; total: number; last_page: number; current_page: number }> => {
    const response = await apiClient.get('/v1/marketing-b2b/generations/history', { params });
    return {
      data: response.data?.data || [],
      total: response.data?.total || 0,
      last_page: response.data?.last_page || 1,
      current_page: response.data?.current_page || 1,
    };
  },

  getDownloadUrl: (uuid: string): string => {
    const baseURL = (apiClient.defaults.baseURL || '').replace(/\/api\/?$/, '');
    const token = typeof window !== 'undefined' ? localStorage.getItem('santun_auth_token') : null;
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    return `${baseURL}/api/v1/marketing-b2b/generations/${uuid}/download${query}`;
  },

  downloadGeneration: async (uuid: string, filename?: string): Promise<void> => {
    const response = await apiClient.get(`/v1/marketing-b2b/generations/${uuid}/download`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || `creativo-${uuid}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 1000);
  },

  getMetrics: async (params?: { date_from?: string; date_to?: string; white_label_id?: number }): Promise<MarketingB2BMetrics> => {
    const response = await apiClient.get('/v1/marketing-b2b/metrics', { params });
    return response.data?.data || response.data;
  },
};

export default marketingB2BService;
