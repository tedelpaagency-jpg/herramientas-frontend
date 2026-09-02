import apiClient from './apiClient';
import { WhiteLabel } from '../types/whiteLabel';

export const whiteLabelService = {
  getWhiteLabels: async (params?: { search?: string }) => {
    const response = await apiClient.get('/v1/white-labels', { params });
    return response.data;
  },

  getWhiteLabel: async (id: number) => {
    const response = await apiClient.get(`/v1/white-labels/${id}`);
    return response.data;
  },

  createWhiteLabel: async (data: any) => {
    if (data.logo_file || data.favicon_file || data.admin_photo_file) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      const response = await apiClient.post('/v1/white-labels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }
    const response = await apiClient.post('/v1/white-labels', data);
    return response.data;
  },

  updateWhiteLabel: async (id: number, data: any) => {
    if (data.logo_file || data.favicon_file) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      const response = await apiClient.post(`/v1/white-labels/${id}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }
    const response = await apiClient.post(`/v1/white-labels/${id}/update`, data);
    return response.data;
  },

  deleteWhiteLabel: async (id: number) => {
    const response = await apiClient.delete(`/v1/white-labels/${id}`);
    return response.data;
  },

  addAdmin: async (whiteLabelId: number, data: { name: string; email: string; password?: string }) => {
    const response = await apiClient.post(`/v1/white-labels/${whiteLabelId}/admins`, data);
    return response.data;
  },

  createAgency: async (whiteLabelId: number, data: any) => {
    const response = await apiClient.post(`/v1/white-labels/${whiteLabelId}/agencies`, data);
    return response.data;
  },

  impersonate: async (params: { user_id?: number; agency_id?: number; white_label_id?: number }) => {
    const response = await apiClient.post('/v1/admin/impersonate', params);
    return response.data;
  },

  stopImpersonate: async () => {
    const response = await apiClient.post('/v1/admin/stop-impersonate');
    return response.data;
  },
};

export default whiteLabelService;
