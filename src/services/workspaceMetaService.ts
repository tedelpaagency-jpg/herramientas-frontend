import api from '../api/axiosConfig';
import { Workspace, WorkspaceMetaCustomField } from '../types';

export const workspaceMetaService = {
  /**
   * Get list of workspaces with Meta integration details.
   */
  async getWorkspaces(agencyId?: number): Promise<Workspace[]> {
    const params: Record<string, any> = {};
    if (agencyId) params.agency_id = agencyId;

    const response = await api.get('/v1/workspaces', { params });
    return response.data.data;
  },

  /**
   * Get single workspace by ID.
   */
  async getWorkspace(id: number): Promise<Workspace> {
    const response = await api.get(`/v1/workspaces/${id}`);
    return response.data.data;
  },

  /**
   * Save or update Meta configuration for workspace.
   */
  async updateWorkspaceMeta(id: number, data: Partial<Workspace>): Promise<Workspace> {
    const response = await api.post(`/v1/workspaces/${id}/meta`, data);
    return response.data.data;
  },

  /**
   * Disconnect Meta campaign from workspace.
   */
  async disconnectWorkspaceMeta(id: number): Promise<Workspace> {
    const response = await api.post(`/v1/workspaces/${id}/meta/disconnect`);
    return response.data.data;
  },

  /**
   * Get list of custom fields for workspace.
   */
  async getCustomFields(workspaceId: number): Promise<WorkspaceMetaCustomField[]> {
    const response = await api.get(`/v1/workspaces/${workspaceId}/custom-fields`);
    return response.data.data;
  },

  /**
   * Create custom field for workspace.
   */
  async createCustomField(
    workspaceId: number,
    data: Partial<WorkspaceMetaCustomField>
  ): Promise<WorkspaceMetaCustomField> {
    const response = await api.post(`/v1/workspaces/${workspaceId}/custom-fields`, data);
    return response.data.data;
  },

  /**
   * Update existing custom field.
   */
  async updateCustomField(
    fieldId: number,
    data: Partial<WorkspaceMetaCustomField>
  ): Promise<WorkspaceMetaCustomField> {
    const response = await api.post(`/v1/custom-fields/${fieldId}/update`, data);
    return response.data.data;
  },

  /**
   * Delete custom field.
   */
  async deleteCustomField(fieldId: number): Promise<void> {
    await api.post(`/v1/custom-fields/${fieldId}/delete`);
  },

  /**
   * Get webhook details (URL and verify token) for workspace.
   */
  async getWebhookInfo(workspaceId: number): Promise<{
    workspace_id: number;
    workspace_name: string;
    webhook_url: string;
    verify_token: string;
    meta_enabled: boolean;
    meta_webhook_enabled: boolean;
    meta_form_id?: string;
    meta_campaign_id?: string;
  }> {
    const response = await api.get(`/v1/workspaces/${workspaceId}/webhook`);
    return response.data.data;
  },
};

export default workspaceMetaService;
