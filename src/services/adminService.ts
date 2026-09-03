import apiClient from './apiClient';
import { Plan, Permission, Agency, Subscription, PlanPermission } from '../types';

export const adminService = {
  // === PLANES ===
  getPlans: async (): Promise<Plan[]> => {
    try {
      const res = await apiClient.get('/v1/plans');
      return res.data?.data || res.data || [];
    } catch {
      const res = await apiClient.get('/v1/admin/plans');
      return res.data?.data || res.data || [];
    }
  },

  getPlan: async (id: number): Promise<Plan> => {
    const res = await apiClient.get(`/v1/admin/plans/${id}`);
    return res.data?.data || res.data;
  },

  createPlan: async (data: Partial<Plan>): Promise<Plan> => {
    const res = await apiClient.post('/v1/admin/plans', data);
    return res.data?.data || res.data;
  },

  updatePlan: async (id: number, data: Partial<Plan>): Promise<Plan> => {
    const res = await apiClient.put(`/v1/admin/plans/${id}`, data);
    return res.data?.data || res.data;
  },

  togglePlanStatus: async (id: number): Promise<Plan> => {
    const res = await apiClient.patch(`/v1/admin/plans/${id}/toggle-status`);
    return res.data?.data || res.data;
  },

  deletePlan: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/admin/plans/${id}`);
  },

  // === PERMISOS DE PLAN ===
  getPlanPermissions: async (planId: number): Promise<PlanPermission[]> => {
    const res = await apiClient.get(`/v1/admin/plans/${planId}/permissions`);
    return res.data?.data || res.data || [];
  },

  addPlanPermission: async (planId: number, permission: string): Promise<PlanPermission> => {
    const res = await apiClient.post(`/v1/admin/plans/${planId}/permissions`, { permission });
    return res.data?.data || res.data;
  },

  deletePlanPermission: async (planId: number, permissionId: number): Promise<void> => {
    await apiClient.delete(`/v1/admin/plans/${planId}/permissions/${permissionId}`);
  },

  // === PERMISOS GLOBALES DEL SISTEMA ===
  getPermissions: async (): Promise<Permission[]> => {
    const res = await apiClient.get('/v1/admin/permissions');
    return res.data?.data || res.data || [];
  },

  createPermission: async (data: { name: string; guard_name?: string }): Promise<Permission> => {
    const res = await apiClient.post('/v1/admin/permissions', data);
    return res.data?.data || res.data;
  },

  updatePermission: async (id: number, data: { name: string; guard_name?: string }): Promise<Permission> => {
    const res = await apiClient.put(`/v1/admin/permissions/${id}`, data);
    return res.data?.data || res.data;
  },

  deletePermission: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/admin/permissions/${id}`);
  },

  // === AGENCIAS ===
  getAgencies: async (params?: { with_trashed?: boolean; gerente_id?: number; white_label_id?: number; search?: string }): Promise<Agency[]> => {
    try {
      const res = await apiClient.get('/v1/agencies', { params });
      return res.data?.data || res.data || [];
    } catch {
      const res = await apiClient.get('/v1/admin/agencies', { params });
      return res.data?.data || res.data || [];
    }
  },

  getAgency: async (id: number): Promise<Agency> => {
    try {
      const res = await apiClient.get(`/v1/agencies/${id}`);
      return res.data?.data || res.data;
    } catch {
      const res = await apiClient.get(`/v1/admin/agencies/${id}`);
      return res.data?.data || res.data;
    }
  },

  getAgencyUsers: async (id: number): Promise<any[]> => {
    try {
      const res = await apiClient.get(`/v1/agencies/${id}/users`);
      return res.data?.data || res.data || [];
    } catch {
      return [];
    }
  },

  getAgencyProperties: async (id: number): Promise<any[]> => {
    try {
      const res = await apiClient.get(`/v1/agencies/${id}/properties`);
      return res.data?.data || res.data || [];
    } catch {
      return [];
    }
  },

  createAgency: async (data: Partial<Agency>): Promise<Agency> => {
    const res = await apiClient.post('/v1/agencies', data);
    return res.data?.data || res.data;
  },

  updateAgency: async (id: number, data: Partial<Agency>): Promise<Agency> => {
    const res = await apiClient.post(`/v1/agencies/${id}/update`, data);
    return res.data?.data || res.data;
  },

  deleteAgency: async (id: number): Promise<void> => {
    await apiClient.post(`/v1/agencies/${id}/delete`);
  },

  restoreAgency: async (id: number): Promise<Agency> => {
    const res = await apiClient.post(`/v1/agencies/${id}/restore`);
    return res.data?.data || res.data;
  },

  // === SUSCRIPCIONES ===
  getSubscriptions: async (): Promise<Subscription[]> => {
    const res = await apiClient.get('/v1/admin/subscriptions');
    return res.data?.data || res.data || [];
  },

  createSubscription: async (data: {
    agency_id: number;
    plan_id: number;
    started_at: string;
    expires_at?: string | null;
    status?: string;
  }): Promise<Subscription> => {
    const res = await apiClient.post('/v1/admin/subscriptions', data);
    return res.data?.data || res.data;
  },

  updateSubscription: async (
    id: number,
    data: Partial<{
      plan_id: number;
      started_at: string;
      expires_at: string | null;
      status: string;
    }>
  ): Promise<Subscription> => {
    const res = await apiClient.put(`/v1/admin/subscriptions/${id}`, data);
    return res.data?.data || res.data;
  },

  cancelSubscription: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/admin/subscriptions/${id}`);
  },
};

export default adminService;
