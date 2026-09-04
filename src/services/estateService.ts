import apiClient from './apiClient';
import { Estate } from '../types';

export const estateService = {
  getEstates: async (params?: Record<string, any>): Promise<{ data: Estate[]; pagination?: any }> => {
    const response = await apiClient.get('/v1/estates', { params });
    const payload = response.data?.data || response.data;

    if (Array.isArray(payload)) {
      return { data: payload };
    }

    if (payload && Array.isArray(payload.data)) {
      return {
        data: payload.data,
        pagination: {
          current_page: payload.current_page || 1,
          total: payload.total || payload.data.length,
          per_page: payload.per_page || 10,
          last_page: payload.last_page || 1
        }
      };
    }

    return { data: [] };
  },

  getEstatesMap: async (params?: Record<string, any>): Promise<Estate[]> => {
    const response = await apiClient.get('/v1/estates/map', { params });
    return response.data?.data || response.data || [];
  },

  getEstate: async (id: number): Promise<Estate> => {
    const response = await apiClient.get(`/v1/estates/${id}`);
    return response.data?.data || response.data;
  },

  createEstate: async (estateData: Partial<Estate>): Promise<Estate> => {
    const response = await apiClient.post('/v1/estates', estateData);
    return response.data?.data || response.data;
  },

  updateEstate: async (id: number, estateData: Partial<Estate>): Promise<Estate> => {
    const response = await apiClient.put(`/v1/estates/${id}`, estateData);
    return response.data?.data || response.data;
  },

  deleteEstate: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/estates/${id}`);
  },

  uploadImage: async (file: File, estateId?: number): Promise<{ image_url: string; id?: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (estateId) {
      formData.append('estate_id', estateId.toString());
    }
    const response = await apiClient.post('/v1/estates/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data || response.data;
  },

  updateImages: async (estateId: number, images: string[]): Promise<any> => {
    const response = await apiClient.put(`/v1/estates/${estateId}/images`, { images });
    return response.data;
  },

  deleteImage: async (estateId: number, imagePath: string): Promise<any> => {
    const response = await apiClient.delete(`/v1/estates/${estateId}/images`, {
      data: { image: imagePath },
    });
    return response.data;
  },

  verifyEstate: async (estateId: number, isVerified: boolean): Promise<Estate> => {
    const response = await apiClient.patch(`/v1/estates/${estateId}/verify`, {
      verify: isVerified ? 1 : 0,
    });
    return response.data?.data || response.data;
  },

  updateStatus: async (estateId: number, status: number): Promise<Estate> => {
    const response = await apiClient.patch(`/v1/estates/${estateId}/status`, { status });
    return response.data?.data || response.data;
  },

  getWhatsAppInfo: async (estateId: number): Promise<any> => {
    const response = await apiClient.get(`/v1/estates/${estateId}/whatsapp`);
    return response.data?.data || response.data;
  },

  getCanvasInfo: async (estateId: number): Promise<any> => {
    const response = await apiClient.get(`/v1/estates/${estateId}/canvas`);
    return response.data?.data || response.data;
  },

  downloadPdf: async (estateId: number, fileNameSlug?: string): Promise<void> => {
    const response = await apiClient.get(`/v1/estates/${estateId}/pdf`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileNameSlug ? `propiedad-${estateId}-${fileNameSlug}.pdf` : `propiedad-${estateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};

export default estateService;
