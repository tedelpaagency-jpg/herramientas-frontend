import apiClient from './apiClient';
import { Subscription } from '../types';

export const subscriptionService = {
  getSubscriptions: async (params?: { type?: string; status?: string; plan_id?: number; white_label_id?: number }) => {
    const res = await apiClient.get('/v1/subscriptions', { params });
    return res.data;
  },

  createSubscription: async (data: {
    entity_type: 'white_label' | 'agency';
    entity_id: number;
    plan_id: number;
    start_date?: string;
    notes?: string;
  }) => {
    const res = await apiClient.post('/v1/subscriptions', data);
    return res.data;
  },

  getSubscription: async (id: number) => {
    const res = await apiClient.get(`/v1/subscriptions/${id}`);
    return res.data;
  },

  renewSubscription: async (id: number, data?: { plan_id?: number; notes?: string }) => {
    const res = await apiClient.post(`/v1/subscriptions/${id}/renew`, data || {});
    return res.data;
  },

  changePlan: async (id: number, data: { plan_id: number; notes?: string }) => {
    const res = await apiClient.post(`/v1/subscriptions/${id}/change-plan`, data);
    return res.data;
  },

  cancelSubscription: async (id: number, notes?: string) => {
    const res = await apiClient.post(`/v1/subscriptions/${id}/cancel`, { notes });
    return res.data;
  },

  getHistory: async (type: 'white_label' | 'agency', id: number) => {
    const res = await apiClient.get(`/v1/subscriptions/history/${type}/${id}`);
    return res.data;
  },

  getStatus: async () => {
    const res = await apiClient.get('/v1/subscription/status');
    return res.data;
  },
};

export default subscriptionService;
