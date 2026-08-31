import apiClient from './apiClient';

export interface AgencyCustomField {
  id: number;
  agency_id: number;
  field_key: string;
  internal_name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean' | 'textarea';
  options?: string[] | null;
  is_required: boolean;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const agencyCustomFieldService = {
  getFields: async (agencyId?: number, activeOnly = true): Promise<AgencyCustomField[]> => {
    const params: Record<string, any> = { active_only: activeOnly ? 1 : 0 };
    if (agencyId) params.agency_id = agencyId;

    const res = await apiClient.get('/v1/agency-custom-fields', { params });
    return res.data.data;
  },

  createField: async (data: {
    label: string;
    internal_name?: string;
    field_key?: string;
    type: string;
    options?: string[] | null;
    is_required?: boolean;
    sort_order?: number;
    is_active?: boolean;
    agency_id?: number;
  }): Promise<AgencyCustomField> => {
    const res = await apiClient.post('/v1/agency-custom-fields', data);
    return res.data.data;
  },

  updateField: async (
    id: number,
    data: {
      label?: string;
      internal_name?: string;
      type?: string;
      options?: string[] | null;
      is_required?: boolean;
      sort_order?: number;
      is_active?: boolean;
    }
  ): Promise<AgencyCustomField> => {
    const res = await apiClient.put(`/v1/agency-custom-fields/${id}`, data);
    return res.data.data;
  },

  deleteField: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/agency-custom-fields/${id}`);
  },
};
