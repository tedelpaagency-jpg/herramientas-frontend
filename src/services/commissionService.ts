import apiClient from './apiClient';

export interface CommissionWithdrawPayload {
  amount: number;
  description?: string;
  agency_id?: number;
}

export const commissionService = {
  // Listar comisiones
  getCommissions: async (agencyId?: number, userId?: number) => {
    const params: any = {};
    if (agencyId) params.agency_id = agencyId;
    if (userId) params.user_id = userId;
    const res = await apiClient.get('/v1/commissions', { params });
    return res.data;
  },

  // Obtener saldo de comisiones (ingresos, retiros, saldo actual)
  getBalance: async (userId?: number) => {
    const params: any = {};
    if (userId) params.user_id = userId;
    const res = await apiClient.get('/v1/commissions/balance', { params });
    return res.data;
  },

  // Solicitar retiro de comisión
  requestWithdrawal: async (payload: CommissionWithdrawPayload) => {
    const res = await apiClient.post('/v1/commissions/withdraw', payload);
    return res.data;
  },

  // Actualizar estado de comisión (1=Aprobado, 2=Rechazado)
  updateStatus: async (id: number, status: number) => {
    const res = await apiClient.post(`/v1/commissions/${id}/status`, { status });
    return res.data;
  },
};

export default commissionService;
