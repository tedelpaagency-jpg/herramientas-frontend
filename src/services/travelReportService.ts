import apiClient from './apiClient';
import { TravelReport, Commission, CommissionBalance } from '../types/travelReport';

export interface TravelReportListParams {
  agency_id?: number;
  user_id?: number;
  agent_id?: number;
  start_date?: string;
  end_date?: string;
  status?: number | string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface TravelReportCreatePayload {
  name: string;
  product_type?: string;
  travel_date?: string;
  payment_method?: string;
  notes?: string;
  passengers: Array<{
    name: string;
    last_name?: string;
    ruc?: string;
    type?: string;
  }>;
  total_client?: number;
  total_supplier?: number;
  total_additional?: number;
  total_fee?: number;
  seller_code?: string;
  agency_id?: number;
}

export const travelReportService = {
  // Listar reportes de viaje
  getReports: async (params?: TravelReportListParams) => {
    const res = await apiClient.get('/v1/travel-reports', { params });
    return res.data;
  },

  // Detalle de reporte
  getReportDetail: async (id: number) => {
    const res = await apiClient.get(`/v1/travel-reports/${id}`);
    return res.data;
  },

  // Crear reporte
  createReport: async (payload: TravelReportCreatePayload) => {
    const res = await apiClient.post('/v1/travel-reports', payload);
    return res.data;
  },

  // Actualizar valores financieros del reporte (POST)
  updateReport: async (id: number, payload: {
    name?: string;
    total_client: number;
    total_supplier: number;
    total_additional?: number;
    total_fee?: number;
  }) => {
    const res = await apiClient.post(`/v1/travel-reports/${id}/update`, payload);
    return res.data;
  },

  // Cambiar estado (Autorizar, Preautorizar, Rechazar) (POST)
  updateStatus: async (id: number, status: number, action?: string) => {
    const res = await apiClient.post(`/v1/travel-reports/${id}/status`, { status, action });
    return res.data;
  },

  // Subir comprobante (POST multipart)
  uploadDocument: async (id: number, type: 'excel' | 'pay_document' | 'pay_document_2', file: File) => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);
    const res = await apiClient.post(`/v1/travel-reports/${id}/upload-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Eliminar reporte (POST)
  deleteReport: async (id: number) => {
    const res = await apiClient.post(`/v1/travel-reports/${id}/delete`);
    return res.data;
  },

  // Listar comisiones y balance
  getCommissions: async (params?: { user_id?: number; type?: number; status?: number; page?: number }) => {
    const res = await apiClient.get('/v1/commissions', { params });
    return res.data;
  },

  // Crear solicitud de retiro o comisión
  createCommission: async (payload: { amount: number; type: number; description?: string; user_id?: number }) => {
    const res = await apiClient.post('/v1/commissions', payload);
    return res.data;
  },

  // Aprobar/Rechazar retiro de comisión
  updateCommissionStatus: async (id: number, status: number) => {
    const res = await apiClient.post(`/v1/commissions/${id}/status`, { status });
    return res.data;
  },

  // Actualizar porcentajes de comisión de agencia
  updateAgencyCommissionSettings: async (agencyId: number, settings: {
    commition_percent: number;
    gerent_commition_percent?: number;
    taxes?: number;
    fact_value?: number;
  }) => {
    const res = await apiClient.post(`/v1/agencies/${agencyId}/commission-settings`, settings);
    return res.data;
  },
};

export default travelReportService;
