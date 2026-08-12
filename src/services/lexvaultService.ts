import apiClient, { getApiBaseUrl } from './apiClient';
import { LexvaultTemplate, LexvaultDocument } from '../types';

export const lexvaultService = {
  getTemplates: async (): Promise<LexvaultTemplate[]> => {
    const response = await apiClient.get('/v1/lexvault/templates');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  createTemplate: async (data: Partial<LexvaultTemplate>): Promise<LexvaultTemplate> => {
    const response = await apiClient.post('/v1/lexvault/templates', data);
    return response.data?.data || response.data;
  },

  generateDocument: async (
    templateId: number,
    title: string,
    filledData: Record<string, string>
  ): Promise<LexvaultDocument> => {
    const response = await apiClient.post('/v1/lexvault/generate-document', {
      template_id: templateId,
      title,
      filled_data: filledData,
    });
    return response.data?.document || response.data?.data || response.data;
  },

  getDocumentPdfUrl: (documentId: number): string => {
    return `${getApiBaseUrl()}/v1/lexvault/documents/${documentId}/pdf`;
  },
};

export default lexvaultService;
