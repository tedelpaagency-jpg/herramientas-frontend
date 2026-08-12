import apiClient from './apiClient';
import { Client } from '../types';

export const clientService = {
  getClients: async (): Promise<Client[]> => {
    const response = await apiClient.get('/v1/clients');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },
};

export default clientService;
