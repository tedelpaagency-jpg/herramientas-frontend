import apiClient from './apiClient';

export interface EstateTemplateItem {
  id: number;
  white_label_id?: number | null;
  name: string;
  description?: string | null;
  html_content: string;
  width: number;
  height: number;
  aspect_ratio: string;
  preview_image?: string | null;
  is_active: boolean;
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export type EstateTemplate = EstateTemplateItem;

export interface EstateTemplatesResponse {
  templates: EstateTemplateItem[];
  can_manage: boolean;
}

export const estateTemplateService = {
  getTemplates: async (whiteLabelId?: number): Promise<EstateTemplatesResponse> => {
    const res = await apiClient.get('/v1/estate-templates', {
      params: whiteLabelId ? { white_label_id: whiteLabelId } : {},
    });
    return {
      templates: res.data?.data || [],
      can_manage: Boolean(res.data?.can_manage),
    };
  },

  createTemplate: async (data: Partial<EstateTemplateItem>): Promise<EstateTemplateItem> => {
    const res = await apiClient.post('/v1/estate-templates', data);
    return res.data?.data;
  },

  updateTemplate: async (id: number, data: Partial<EstateTemplateItem>): Promise<EstateTemplateItem> => {
    const res = await apiClient.post(`/v1/estate-templates/${id}`, data);
    return res.data?.data;
  },

  deleteTemplate: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/estate-templates/${id}`);
  },
};

export default estateTemplateService;
