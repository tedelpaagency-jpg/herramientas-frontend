import apiClient from './apiClient';
import { User } from '../types';

export interface UserFilterParams {
  agency_id?: number;
  role?: string;
  status?: number;
  search?: string;
  with_trashed?: boolean;
  page?: number;
  per_page?: number;
}

export const userService = {
  getUsers: async (params?: UserFilterParams) => {
    try {
      const res = await apiClient.get('/v1/users', { params });
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        try {
          const res = await apiClient.get('/v1/admin/users', { params });
          return res.data;
        } catch {
          throw err;
        }
      }
      throw err;
    }
  },

  getUser: async (id: number) => {
    const res = await apiClient.get(`/v1/users/${id}`);
    return res.data;
  },

  createUser: async (data: Partial<User> & { password?: string }) => {
    const res = await apiClient.post('/v1/users', data);
    return res.data;
  },

  updateUser: async (id: number, data: Partial<User> & { password?: string }) => {
    const res = await apiClient.post(`/v1/users/${id}/update`, data);
    return res.data;
  },

  toggleStatus: async (id: number, status?: number) => {
    const res = await apiClient.post(`/v1/users/${id}/toggle-status`, { status });
    return res.data;
  },

  deleteUser: async (id: number) => {
    const res = await apiClient.post(`/v1/users/${id}/delete`);
    return res.data;
  },

  restoreUser: async (id: number) => {
    const res = await apiClient.post(`/v1/users/${id}/restore`);
    return res.data;
  },

  assignRole: async (id: number, role: string) => {
    const res = await apiClient.post(`/v1/users/${id}/assign-role`, { role });
    return res.data;
  },

  assignAgency: async (id: number, agency_id: number) => {
    const res = await apiClient.post(`/v1/users/${id}/assign-agency`, { agency_id });
    return res.data;
  },

  getPermissionCatalog: async () => {
    const res = await apiClient.get('/v1/permissions/catalog');
    return res.data?.data || res.data;
  },

  getUserPermissions: async (id: number) => {
    const res = await apiClient.get(`/v1/users/${id}/permissions`);
    return res.data;
  },

  syncUserPermissions: async (id: number, permissions: string[]) => {
    const res = await apiClient.post(`/v1/users/${id}/permissions`, { permissions });
    return res.data;
  },
};

export default userService;
