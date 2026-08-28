import apiClient from './apiClient';
import { HunterStore, HunterProfileData, HunterRequest } from '../types/hunter';

export const hunterService = {
  getStores: async (params?: { search?: string; status?: string; agency_id?: number; page?: number }): Promise<{ data: HunterStore[]; meta?: any }> => {
    const res = await apiClient.get('/v1/hunters', { params });
    return res.data;
  },

  getStoreProfile: async (id: number): Promise<HunterProfileData> => {
    const res = await apiClient.get(`/v1/hunters/${id}`);
    return res.data;
  },

  createStore: async (data: Partial<HunterStore>): Promise<HunterStore> => {
    const res = await apiClient.post('/v1/hunters', data);
    return res.data.data;
  },

  updateStore: async (id: number, data: Partial<HunterStore>): Promise<HunterStore> => {
    const res = await apiClient.put(`/v1/hunters/${id}`, data);
    return res.data.data;
  },

  deleteStore: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/hunters/${id}`);
  },

  approveRequest: async (requestId: number, commission_percentage: number): Promise<HunterRequest> => {
    const res = await apiClient.post(`/v1/hunters/requests/${requestId}/approve`, { commission_percentage });
    return res.data.data;
  },

  rejectRequest: async (requestId: number, rejection_reason: string): Promise<HunterRequest> => {
    const res = await apiClient.post(`/v1/hunters/requests/${requestId}/reject`, { rejection_reason });
    return res.data.data;
  },
};

export default hunterService;
