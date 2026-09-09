import apiClient from './apiClient';
import { LoginVideo, LoginLogo, PublicLoginConfiguration, LoginTexts } from '../types/loginMedia';

export const loginMediaService = {
  // === CONFIGURACIÓN PÚBLICA (Consumida por /login) ===
  getPublicConfiguration: async (): Promise<PublicLoginConfiguration> => {
    try {
      const res = await apiClient.get('/v1/login/configuration');
      return res.data || { videos: [], logos: [] };
    } catch {
      try {
        const res = await apiClient.get('/login/configuration');
        return res.data || { videos: [], logos: [] };
      } catch (err) {
        console.warn('No se pudo obtener la configuración pública del login desde el backend:', err);
        return { videos: [], logos: [] };
      }
    }
  },

  // === GESTIÓN DE VIDEOS (ADMIN) ===
  getVideos: async (): Promise<LoginVideo[]> => {
    try {
      const res = await apiClient.get('/v1/admin/login/videos');
      return res.data?.data || res.data || [];
    } catch {
      const res = await apiClient.get('/admin/login/videos');
      return res.data?.data || res.data || [];
    }
  },

  createVideo: async (formData: FormData, onUploadProgress?: (progressEvent: any) => void): Promise<LoginVideo> => {
    const res = await apiClient.post('/v1/admin/login/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 minutos para subidas de videos grandes
      onUploadProgress,
    });
    return res.data?.data || res.data;
  },

  updateVideo: async (id: number, formData: FormData, onUploadProgress?: (progressEvent: any) => void): Promise<LoginVideo> => {
    const res = await apiClient.post(`/v1/admin/login/videos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 minutos para subidas de videos grandes
      onUploadProgress,
    });
    return res.data?.data || res.data;
  },

  deleteVideo: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/admin/login/videos/${id}`);
  },

  reorderVideos: async (orderedIds: number[]): Promise<void> => {
    await apiClient.post('/v1/admin/login/videos/reorder', { ordered_ids: orderedIds });
  },

  // === GESTIÓN DE LOGOS (ADMIN) ===
  getLogos: async (): Promise<LoginLogo[]> => {
    try {
      const res = await apiClient.get('/v1/admin/login/logos');
      return res.data?.data || res.data || [];
    } catch {
      const res = await apiClient.get('/admin/login/logos');
      return res.data?.data || res.data || [];
    }
  },

  createLogo: async (formData: FormData): Promise<LoginLogo> => {
    const res = await apiClient.post('/v1/admin/login/logos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
  },

  updateLogo: async (id: number, formData: FormData): Promise<LoginLogo> => {
    const res = await apiClient.post(`/v1/admin/login/logos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
  },

  deleteLogo: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/admin/login/logos/${id}`);
  },

  reorderLogos: async (orderedIds: number[]): Promise<void> => {
    await apiClient.post('/v1/admin/login/logos/reorder', { ordered_ids: orderedIds });
  },

  // === CONFIGURACIÓN DE TEXTOS DEL LOGIN (ADMIN) ===
  getLoginTexts: async (): Promise<LoginTexts> => {
    try {
      const res = await apiClient.get('/v1/admin/login/texts');
      return res.data?.data || res.data;
    } catch {
      const res = await apiClient.get('/admin/login/texts');
      return res.data?.data || res.data;
    }
  },

  updateLoginTexts: async (texts: Partial<LoginTexts>): Promise<LoginTexts> => {
    try {
      const res = await apiClient.post('/v1/admin/login/texts', texts);
      return res.data?.data || res.data;
    } catch {
      const res = await apiClient.post('/admin/login/texts', texts);
      return res.data?.data || res.data;
    }
  },
};

export default loginMediaService;
