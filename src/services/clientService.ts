import apiClient from './apiClient';
import { Client, PaginatedResult } from '../types';

export const clientService = {
  getClients: async (params?: Record<string, any>): Promise<PaginatedResult<Client>> => {
    const response = await apiClient.get('/v1/clients', { params });
    const raw = response.data;
    const payload = raw?.data || raw;

    if (Array.isArray(payload)) {
      return {
        data: payload,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: payload.length || 15,
          total: payload.length,
          from: payload.length ? 1 : 0,
          to: payload.length,
        },
      };
    }

    if (payload && Array.isArray(payload.data)) {
      return {
        data: payload.data,
        pagination: {
          current_page: payload.current_page || 1,
          last_page: payload.last_page || 1,
          per_page: payload.per_page || 15,
          total: payload.total || payload.data.length,
          from: payload.from || 0,
          to: payload.to || 0,
        },
      };
    }

    return {
      data: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
      },
    };
  },
};

export default clientService;

