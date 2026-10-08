import apiClient from './apiClient';
import { 
  PermissionGroup, 
  PermissionGroupUsage, 
  CreatePermissionGroupPayload, 
  UpdatePermissionGroupPayload 
} from '../types';

export const permissionGroupService = {
  /**
   * Listar todos los grupos de permisos con filtros opcionales.
   */
  getGroups: async (params?: {
    search?: string;
    status?: 'active' | 'inactive' | 'all';
    type?: 'system' | 'custom' | 'all';
    white_label_id?: number;
    agency_id?: number;
  }): Promise<PermissionGroup[]> => {
    try {
      const res = await apiClient.get('/v1/permission-groups', { params });
      return res.data?.data || res.data || [];
    } catch {
      const res = await apiClient.get('/permission-groups', { params });
      return res.data?.data || res.data || [];
    }
  },

  /**
   * Obtener detalle de un grupo específico.
   */
  getGroup: async (id: number): Promise<{ group: PermissionGroup; usage: PermissionGroupUsage }> => {
    try {
      const res = await apiClient.get(`/v1/permission-groups/${id}`);
      return {
        group: res.data?.data || res.data,
        usage: res.data?.usage || { is_used: false, roles_count: 0, users_count: 0, roles: [] },
      };
    } catch {
      const res = await apiClient.get(`/permission-groups/${id}`);
      return {
        group: res.data?.data || res.data,
        usage: res.data?.usage || { is_used: false, roles_count: 0, users_count: 0, roles: [] },
      };
    }
  },

  /**
   * Crear un nuevo grupo de permisos personalizable.
   */
  createGroup: async (data: CreatePermissionGroupPayload): Promise<PermissionGroup> => {
    try {
      const res = await apiClient.post('/v1/permission-groups', data);
      return res.data?.data || res.data;
    } catch {
      const res = await apiClient.post('/permission-groups', data);
      return res.data?.data || res.data;
    }
  },

  /**
   * Actualizar un grupo de permisos existente.
   */
  updateGroup: async (id: number, data: UpdatePermissionGroupPayload): Promise<PermissionGroup> => {
    try {
      const res = await apiClient.put(`/v1/permission-groups/${id}`, data);
      return res.data?.data || res.data;
    } catch {
      const res = await apiClient.put(`/permission-groups/${id}`, data);
      return res.data?.data || res.data;
    }
  },

  /**
   * Eliminar un grupo de permisos (Soft Delete protegido contra dependencias).
   */
  deleteGroup: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/v1/permission-groups/${id}`);
    } catch {
      await apiClient.delete(`/permission-groups/${id}`);
    }
  },

  /**
   * Activar o desactivar un grupo de permisos.
   */
  toggleStatus: async (id: number): Promise<PermissionGroup> => {
    try {
      const res = await apiClient.post(`/v1/permission-groups/${id}/toggle-status`);
      return res.data?.data || res.data;
    } catch {
      const res = await apiClient.post(`/permission-groups/${id}/toggle-status`);
      return res.data?.data || res.data;
    }
  },

  /**
   * Consultar en detalle qué entidades utilizan este grupo.
   */
  getGroupUsage: async (id: number): Promise<PermissionGroupUsage> => {
    try {
      const res = await apiClient.get(`/v1/permission-groups/${id}/usage`);
      return res.data?.data || res.data;
    } catch {
      const res = await apiClient.get(`/permission-groups/${id}/usage`);
      return res.data?.data || res.data;
    }
  },
};

export default permissionGroupService;
