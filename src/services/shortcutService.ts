import apiClient from './apiClient';
import { Shortcut, ShortcutModuleDefinition } from '../types';

export const shortcutService = {
  getHeaderShortcuts: async (): Promise<Shortcut[]> => {
    const response = await apiClient.get('/v1/header-shortcuts');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getShortcuts: async (): Promise<Shortcut[]> => {
    const response = await apiClient.get('/v1/shortcuts');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getAvailableModules: async (): Promise<ShortcutModuleDefinition[]> => {
    const response = await apiClient.get('/v1/shortcuts/available-modules');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  createShortcut: async (data: Partial<Shortcut>): Promise<Shortcut> => {
    const response = await apiClient.post('/v1/shortcuts', data);
    return response.data?.data || response.data;
  },

  updateShortcut: async (id: number, data: Partial<Shortcut>): Promise<Shortcut> => {
    const response = await apiClient.put(`/v1/shortcuts/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteShortcut: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/shortcuts/${id}`);
  },

  toggleShortcutActive: async (id: number): Promise<Shortcut> => {
    const response = await apiClient.post(`/v1/shortcuts/${id}/toggle-active`);
    return response.data?.data || response.data;
  },

  reorderShortcuts: async (items: { id: number; orden: number }[]): Promise<void> => {
    await apiClient.post('/v1/shortcuts/reorder', { items });
  },
};

export default shortcutService;
