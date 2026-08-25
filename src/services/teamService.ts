import apiClient from './apiClient';
import { AgencyTeam } from '../types/travelReport';

export interface TeamPayload {
  name: string;
  description?: string;
  leader_id?: number | null;
  admin_id?: number | null;
  commition_percent?: number;
  gerent_commition_percent?: number;
  director_commition_percent?: number;
  empresa_commition_percent?: number;
  member_ids?: number[];
  agency_id?: number;
}

export const teamService = {
  // Listar equipos de la agencia
  getTeams: async (agencyId?: number, search?: string) => {
    const params: any = {};
    if (agencyId) params.agency_id = agencyId;
    if (search) params.search = search;
    const res = await apiClient.get('/v1/agency-teams', { params });
    return res.data;
  },

  // Detalle de equipo
  getTeamDetail: async (id: number) => {
    const res = await apiClient.get(`/v1/agency-teams/${id}`);
    return res.data;
  },

  // Crear equipo
  createTeam: async (payload: TeamPayload) => {
    const res = await apiClient.post('/v1/agency-teams', payload);
    return res.data;
  },

  // Actualizar equipo (POST)
  updateTeam: async (id: number, payload: TeamPayload) => {
    const res = await apiClient.post(`/v1/agency-teams/${id}/update`, payload);
    return res.data;
  },

  // Eliminar equipo (POST)
  deleteTeam: async (id: number) => {
    const res = await apiClient.post(`/v1/agency-teams/${id}/delete`);
    return res.data;
  },

  // Asignar usuario a un equipo (POST)
  assignUserToTeam: async (userId: number, teamId: number | null, sellerCode?: string) => {
    const res = await apiClient.post(`/v1/users/${userId}/assign-team`, {
      user_id: userId,
      team_id: teamId,
      seller_code: sellerCode,
    });
    return res.data;
  },
};

export default teamService;
