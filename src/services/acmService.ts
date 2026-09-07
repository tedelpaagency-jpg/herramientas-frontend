import apiClient from './apiClient';
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

  // Zones (Polygons)
  async getZones(params?: { search?: string }) {
    const response = await apiClient.get('/v1/acm/zones', { params });
    return response.data;
  },

  async createZone(data: {
    name: string;
    code?: string;
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

  async detectZone(lat: number, lng: number) {
    const response = await apiClient.post('/v1/acm/zones/detect', { lat, lng });
    return response.data;
  }
};

export default acmService;
