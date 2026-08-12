import apiClient from './apiClient';
import { Visa } from '../types';

export const visaService = {
  getVisas: async (params?: Record<string, any>): Promise<Visa[]> => {
    const response = await apiClient.get('/v1/visas', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getVisa: async (id: number): Promise<Visa> => {
    const response = await apiClient.get(`/v1/visas/${id}`);
    return response.data?.data || response.data;
  },

  createVisa: async (data: Partial<Visa>): Promise<Visa> => {
    const response = await apiClient.post('/v1/visas', data);
    return response.data?.data || response.data;
  },

  updateVisa: async (id: number, data: Partial<Visa>): Promise<Visa> => {
    const response = await apiClient.put(`/v1/visas/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteVisa: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/visas/${id}`);
  },
};

export default visaService;
