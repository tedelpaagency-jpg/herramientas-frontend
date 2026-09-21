import apiClient from './apiClient';
import { Media, MediaContextResponse } from '../types/media';
import { PaginatedResponse } from '../types/course';

export const mediaService = {
  // Obtener contexto de Marca Blanca / Agencia y listas para super_admin
  getContext: async () => {
    const response = await apiClient.get<{ status: string; data: MediaContextResponse }>('/v1/media/context');
    return response.data;
  },

  // Listar archivos de la biblioteca de medios con filtros y paginación
  getMedia: async (params?: {
    search?: string;
    type?: 'image' | 'video' | 'document' | 'other' | 'all';
    white_label_id?: number;
    agency_id?: number;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
  }) => {
    const response = await apiClient.get<{
      status: string;
      tenant_context: any;
      data: PaginatedResponse<Media>;
    }>('/v1/media', { params });
    return response.data;
  },

  // Subir un nuevo archivo a la Media Library
  uploadMedia: async (file: File, extraData?: { title?: string; alt_text?: string; description?: string; white_label_id?: number; agency_id?: number }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (extraData?.title) formData.append('title', extraData.title);
    if (extraData?.alt_text) formData.append('alt_text', extraData.alt_text);
    if (extraData?.description) formData.append('description', extraData.description);
    if (extraData?.white_label_id) formData.append('white_label_id', extraData.white_label_id.toString());
    if (extraData?.agency_id) formData.append('agency_id', extraData.agency_id.toString());

    const response = await apiClient.post<{ status: string; message: string; data: Media }>('/v1/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 minutos para archivos grandes
    });
    return response.data;
  },

  // Obtener detalle de un archivo por ID
  getMediaItem: async (id: number | string) => {
    const response = await apiClient.get<{ status: string; data: Media; usages?: string[]; is_in_use?: boolean }>(`/v1/media/${id}`);
    return response.data;
  },

  // Actualizar metadata de un archivo (título, alt, descripción)
  updateMedia: async (id: number, data: { title?: string; alt_text?: string; description?: string }) => {
    const response = await apiClient.post<{ status: string; message: string; data: Media }>(`/v1/media/${id}/update`, data);
    return response.data;
  },

  // Eliminar un archivo
  deleteMedia: async (id: number, force = false) => {
    const response = await apiClient.post<{ status: string; message: string; in_use?: boolean; usages?: string[] }>(`/v1/media/${id}/delete`, { force });
    return response.data;
  },

  // Formatear URL de descarga protegida
  getDownloadUrl: (id: number) => {
    const baseUrl = apiClient.defaults.baseURL || '';
    const token = typeof window !== 'undefined' ? localStorage.getItem('santun_auth_token') : null;
    const tokenParam = token ? `?token=${encodeURIComponent(token)}` : '';
    return `${baseUrl}/v1/media/${id}/download${tokenParam}`;
  },
};

export default mediaService;
