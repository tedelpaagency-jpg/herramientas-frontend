import apiClient, { getApiBaseUrl } from './apiClient';
import { AcmEstimation, AcmZone } from '../types/acm';

export const acmService = {
  // Estimations
  async getEstimations(params?: { search?: string; status?: string; property_type?: string; page?: number }) {
    const response = await apiClient.get('/v1/acm/estimations', { params });
    return response.data;
  },

  async getEstimation(id: number) {
    const response = await apiClient.get(`/v1/acm/estimations/${id}`);
    return response.data;
  },

  async createEstimation(data: Partial<AcmEstimation>) {
    const response = await apiClient.post('/v1/acm/estimations', data);
    return response.data;
  },

  async updateEstimation(id: number, data: Partial<AcmEstimation>) {
    const response = await apiClient.post(`/v1/acm/estimations/${id}/update`, data);
    return response.data;
  },

  async deleteEstimation(id: number) {
    const response = await apiClient.delete(`/v1/acm/estimations/${id}`);
    return response.data;
  },

  async getPdfReport(id: number) {
    const response = await apiClient.get(`/v1/acm/estimations/${id}/pdf`);
    return response.data;
  },

  downloadPdf(id: number) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('santun_auth_token') : '';
    const baseUrl = apiClient.defaults.baseURL || getApiBaseUrl();
    const url = `${baseUrl}/v1/acm/estimations/${id}/pdf-stream?token=${token}`;
    window.open(url, '_blank');
  },

  // Zones (Polygons)
  async getZones(params?: { search?: string; transaction_type?: string }) {
    const response = await apiClient.get('/v1/acm/zones', { params });
    return response.data;
  },

  async createZone(data: {
    name: string;
    code?: string;
    transaction_type?: 'venta' | 'alquiler';
    color?: string;
    suggested_suelo: number;
    suggested_construccion: number;
    coordinates: Array<{ lat: number; lng: number }>;
    description?: string;
  }) {
    const response = await apiClient.post('/v1/acm/zones', data);
    return response.data;
  },

  async updateZone(id: number, data: Partial<AcmZone>) {
    const response = await apiClient.post(`/v1/acm/zones/${id}/update`, data);
    return response.data;
  },

  async deleteZone(id: number) {
    const response = await apiClient.delete(`/v1/acm/zones/${id}`);
    return response.data;
  },

  async detectZone(lat: number, lng: number, transaction_type?: string) {
    const response = await apiClient.post('/v1/acm/zones/detect', { lat, lng, transaction_type });
    return response.data;
  }
};

export default acmService;
