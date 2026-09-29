import apiClient from './apiClient';
import { Role, Permission } from '../types';

export interface CreateRolePayload {
  name: string;
  display_name: string;
  description?: string;
  permissions?: string[];
  agency_id?: number;
  white_label_id?: number;
}

export interface UpdateRolePayload {
  display_name?: string;
  description?: string;
  permissions?: string[];
}

export const roleService = {
  getRoles: async (params?: Record<string, any>): Promise<Role[]> => {
    try {
      const res = await apiClient.get('/v1/roles', { params });
      return res.data?.data || res.data || [];
    } catch {
      const res = await apiClient.get('/roles', { params });
      return res.data?.data || res.data || [];
    }
  },

  getAvailablePermissions: async (): Promise<Permission[]> => {
    try {
      const res = await apiClient.get('/v1/roles/available-permissions');
      return res.data?.data || res.data || [];
    } catch {
      const res = await apiClient.get('/roles/available-permissions');
      return res.data?.data || res.data || [];
    }
  },

  createRole: async (data: CreateRolePayload): Promise<Role> => {
    try {
      const res = await apiClient.post('/v1/roles', data);
      return res.data?.data || res.data;
    } catch (e) {
      const res = await apiClient.post('/roles', data);
      return res.data?.data || res.data;
    }
  },

  updateRole: async (id: number, data: UpdateRolePayload): Promise<Role> => {
    try {
      const res = await apiClient.put(`/v1/roles/${id}`, data);
      return res.data?.data || res.data;
    } catch (e) {
      const res = await apiClient.put(`/roles/${id}`, data);
      return res.data?.data || res.data;
    }
  },

  deleteRole: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/v1/roles/${id}`);
    } catch (e) {
      await apiClient.delete(`/roles/${id}`);
    }
  },
};

export default roleService;
