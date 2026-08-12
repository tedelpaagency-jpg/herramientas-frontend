import apiClient, { getApiBaseUrl } from './apiClient';
import { W8Form } from '../types';

export const w8Service = {
  getW8Forms: async (params?: Record<string, any>): Promise<W8Form[]> => {
    const response = await apiClient.get('/v1/w8-forms', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getW8Form: async (id: number): Promise<W8Form> => {
    const response = await apiClient.get(`/v1/w8-forms/${id}`);
    return response.data?.data || response.data;
  },

  createW8Form: async (data: Partial<W8Form>): Promise<W8Form> => {
    const response = await apiClient.post('/v1/w8-forms', data);
    return response.data?.data || response.data;
  },

  updateW8Form: async (id: number, data: Partial<W8Form>): Promise<W8Form> => {
    const response = await apiClient.put(`/v1/w8-forms/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteW8Form: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/w8-forms/${id}`);
  },

  getPdfUrl: (id: number): string => {
    return `${getApiBaseUrl()}/v1/w8-forms/${id}/pdf`;
  },
};

export default w8Service;
