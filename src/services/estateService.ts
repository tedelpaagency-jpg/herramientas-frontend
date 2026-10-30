import apiClient from './apiClient';
import { Estate } from '../types';

export interface EstateApprovalSettings {
  require_admin_approval_to_publish: boolean;
  require_admin_approval_to_delete: boolean;
  notify_on_property_upload: boolean;
  notify_property_upload_emails: string;
  notify_on_property_delete: boolean;
  notify_property_delete_emails: string;
  notify_on_user_login: boolean;
  notify_user_login_emails: string;
  webhook_url?: string;
}

export const estateService = {
  getEstates: async (params?: Record<string, any>): Promise<{ data: Estate[]; pagination?: any }> => {
    const response = await apiClient.get('/v1/estates', { params });
    const raw = response.data;

    // 1. Direct pagination field in response: { status: 'success', data: [...], pagination: {...} }
    if (raw && raw.pagination && Array.isArray(raw.data)) {
      return {
        data: raw.data,
        pagination: {
          current_page: Number(raw.pagination.current_page) || 1,
          last_page: Number(raw.pagination.last_page) || 1,
          per_page: Number(raw.pagination.per_page) || 10,
          total: Number(raw.pagination.total) || raw.data.length,
          from: raw.pagination.from ?? (((Number(raw.pagination.current_page) || 1) - 1) * (Number(raw.pagination.per_page) || 10) + (raw.data.length > 0 ? 1 : 0)),
          to: raw.pagination.to ?? Math.min((Number(raw.pagination.current_page) || 1) * (Number(raw.pagination.per_page) || 10), Number(raw.pagination.total) || raw.data.length)
        }
      };
    }

    // 2. Standard Laravel LengthAwarePaginator: { data: [...], current_page, last_page, total, per_page }
    if (raw && Array.isArray(raw.data) && (raw.current_page !== undefined || raw.last_page !== undefined || raw.total !== undefined)) {
      return {
        data: raw.data,
        pagination: {
          current_page: Number(raw.current_page) || 1,
          last_page: Number(raw.last_page) || 1,
          per_page: Number(raw.per_page) || 10,
          total: Number(raw.total) || raw.data.length,
          from: raw.from,
          to: raw.to
        }
      };
    }

    // 3. Laravel API Resource with meta: { data: [...], meta: { current_page, last_page, total, per_page } }
    if (raw && Array.isArray(raw.data) && raw.meta) {
      return {
        data: raw.data,
        pagination: {
          current_page: Number(raw.meta.current_page) || 1,
          last_page: Number(raw.meta.last_page) || 1,
          per_page: Number(raw.meta.per_page) || 10,
          total: Number(raw.meta.total) || raw.data.length,
          from: raw.meta.from,
          to: raw.meta.to
        }
      };
    }

    // 4. Nested in raw.data: { data: { data: [...], current_page, last_page, total } }
    if (raw && raw.data && Array.isArray(raw.data.data)) {
      const p = raw.data;
      return {
        data: p.data,
        pagination: {
          current_page: Number(p.current_page) || 1,
          last_page: Number(p.last_page) || 1,
          per_page: Number(p.per_page) || 10,
          total: Number(p.total) || p.data.length,
          from: p.from,
          to: p.to
        }
      };
    }

    const payload = raw?.data || raw;
    if (Array.isArray(payload)) {
      return {
        data: payload,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: payload.length || 10,
          total: payload.length,
          from: payload.length > 0 ? 1 : 0,
          to: payload.length
        }
      };
    }

    return { 
      data: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0
      }
    };
  },

  getEstatesMap: async (params?: Record<string, any>): Promise<Estate[]> => {
    const response = await apiClient.get('/v1/estates/map', { params });
    return response.data?.data || response.data || [];
  },

  getEstate: async (id: number): Promise<Estate> => {
    const response = await apiClient.get(`/v1/estates/${id}`);
    return response.data?.data || response.data;
  },

  getEstateById: async (id: number): Promise<Estate> => {
    return estateService.getEstate(id);
  },

  createEstate: async (estateData: Partial<Estate>): Promise<Estate> => {
    const response = await apiClient.post('/v1/estates', estateData);
    return response.data?.data || response.data;
  },

  updateEstate: async (id: number, estateData: Partial<Estate>): Promise<Estate> => {
    const response = await apiClient.put(`/v1/estates/${id}`, estateData);
    return response.data?.data || response.data;
  },

  deleteEstate: async (id: number): Promise<any> => {
    const res = await apiClient.delete(`/v1/estates/${id}`);
    return res.data;
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

    if (response.data && response.data.type === 'application/json') {
      const text = await response.data.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.message || 'Error al generar el PDF del inmueble');
      } catch (e: any) {
        throw new Error(e.message || 'Error al generar el PDF del inmueble');
      }
    }

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

  getEstateReports: async (params?: { agency_id?: number; agent_id?: number }): Promise<any> => {
    const response = await apiClient.get('/v1/estates/reports', { params });
    return response.data?.data || response.data;
  },

  getCategoriesCatalog: async (params?: { agency_id?: number }): Promise<any[]> => {
    const response = await apiClient.get('/v1/estates/categories-catalog', { params });
    return response.data?.data || response.data || [];
  },

  uploadImages: async (files: File[], agencyId?: number): Promise<{ filename: string; path: string; url: string }[]> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files[]', f));
    if (agencyId) {
      formData.append('agency_id', agencyId.toString());
    }
    const response = await apiClient.post('/v1/estates/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [data];
  },

  getSettings: async (agencyId?: number): Promise<EstateApprovalSettings> => {
    const response = await apiClient.get('/v1/estates/settings', {
      params: agencyId ? { agency_id: agencyId } : {},
    });
    return response.data?.data;
  },

  updateSettings: async (settings: Partial<EstateApprovalSettings>, agencyId?: number): Promise<EstateApprovalSettings> => {
    const response = await apiClient.put('/v1/estates/settings', settings, {
      params: agencyId ? { agency_id: agencyId } : {},
    });
    return response.data?.data;
  },

  approveDeletion: async (estateId: number): Promise<void> => {
    await apiClient.patch(`/v1/estates/${estateId}/approve-deletion`);
  },

  rejectDeletion: async (estateId: number): Promise<void> => {
    await apiClient.patch(`/v1/estates/${estateId}/reject-deletion`);
  },
};

export default estateService;
