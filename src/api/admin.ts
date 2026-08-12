import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// Plans
export const getPlans = () => api.get('/admin/plans');
export const createPlan = (data: any) => api.post('/admin/plans', data);
export const updatePlan = (id: number, data: any) => api.put(`/admin/plans/${id}`, data);
export const deletePlan = (id: number) => api.delete(`/admin/plans/${id}`);

// Agency Plan Assignment
export const assignPlanToAgency = (
  agencyId: number,
  payload: { plan_id: number; started_at: string; expires_at?: string }
) => api.post(`/admin/agencies/${agencyId}/assign-plan`, payload);

export const revokePlanFromAgency = (agencyId: number, planId: number) =>
  api.delete(`/admin/agencies/${agencyId}/revoke-plan/${planId}`);

// Plan Permissions
export const addPlanPermission = (planId: number, permission: string) =>
  api.post(`/admin/plans/${planId}/permissions`, { permission });

export const removePlanPermission = (planId: number, permissionId: number) =>
  api.delete(`/admin/plans/${planId}/permissions/${permissionId}`);

export const listPlanPermissions = (planId: number) =>
  api.get(`/admin/plans/${planId}/permissions`);
