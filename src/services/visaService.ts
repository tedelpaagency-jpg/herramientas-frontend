import apiClient from './apiClient';
import { Visa, VisaRef } from '../types';

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

  saveVisaField: async (id: number, field: string, value: any): Promise<any> => {
    const response = await apiClient.post(`/v1/visas/${id}/save-field`, { field, value });
    return response.data?.data || response.data;
  },

  uploadVisaFile: async (id: number, field: string, file: File): Promise<{ field: string; file_url: string }> => {
    const formData = new FormData();
    formData.append('field', field);
    formData.append('file', file);

    const response = await apiClient.post(`/v1/visas/${id}/upload-file`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data || response.data;
  },

  updateVisaStatus: async (id: number, status: string | number): Promise<Visa> => {
    const response = await apiClient.post(`/v1/visas/${id}/status`, { status });
    return response.data?.data || response.data;
  },

  getVisaPublic: async (encodedId: string): Promise<any> => {
    const response = await apiClient.get(`/v1/visas/public/${encodedId}`);
    return response.data?.data || response.data;
  },

  // Visa References (Group/Folder Management)
  getVisaRefs: async (params?: Record<string, any>): Promise<VisaRef[]> => {
    const response = await apiClient.get('/v1/visa-refs', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  createVisaRef: async (data: Partial<VisaRef>): Promise<VisaRef> => {
    const response = await apiClient.post('/v1/visa-refs', data);
    return response.data?.data || response.data;
  },

  updateVisaRef: async (id: number, data: Partial<VisaRef>): Promise<VisaRef> => {
    const response = await apiClient.put(`/v1/visa-refs/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteVisaRef: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/visa-refs/${id}`);
  },
};

export default visaService;
