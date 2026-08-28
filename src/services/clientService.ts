import apiClient from './apiClient';
import { Client } from '../types';

export const clientService = {
  getClients: async (params?: Record<string, any>): Promise<Client[]> => {
    const response = await apiClient.get('/v1/clients', { params });
    const raw = response.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data?.data)) return raw.data.data;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  },
};

export default clientService;
