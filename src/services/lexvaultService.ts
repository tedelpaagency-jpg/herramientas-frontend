import apiClient, { getApiBaseUrl } from './apiClient';
import { LexvaultTemplate, LexvaultDocument } from '../types';

export const lexvaultService = {
  // --- TEMPLATES ---
  getTemplates: async (): Promise<LexvaultTemplate[]> => {
    const response = await apiClient.get('/v1/lexvault/templates');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  createTemplate: async (data: Partial<LexvaultTemplate>): Promise<LexvaultTemplate> => {
    const payload = {
      ...data,
      html_content: data.html_content || data.template_body,
    };
    const response = await apiClient.post('/v1/lexvault/templates', payload);
    return response.data?.data || response.data;
  },

  updateTemplate: async (id: number, data: Partial<LexvaultTemplate>): Promise<LexvaultTemplate> => {
    const payload = {
      ...data,
      html_content: data.html_content || data.template_body,
    };
    const response = await apiClient.put(`/v1/lexvault/templates/${id}`, payload);
    return response.data?.data || response.data;
  },

  deleteTemplate: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/lexvault/templates/${id}`);
  },

  // --- DOCUMENTS / CONTRACTS ---
  getDocuments: async (params?: Record<string, any>): Promise<LexvaultDocument[]> => {
    const response = await apiClient.get('/v1/lexvault/documents', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getDocument: async (id: number): Promise<LexvaultDocument> => {
    const response = await apiClient.get(`/v1/lexvault/documents/${id}`);
    return response.data?.data || response.data;
  },

  generateDocument: async (data: {
    template_id: number;
    client_id?: number | null;
    title?: string;
    replacements: Record<string, string>;
  }): Promise<LexvaultDocument> => {
    const response = await apiClient.post('/v1/lexvault/generate-document', data);
    return response.data?.data || response.data;
  },

  downloadDocumentPdf: async (documentId: number, fileName?: string): Promise<void> => {
    const response = await apiClient.get(`/v1/lexvault/documents/${documentId}/pdf`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName ? `Contrato_${fileName}.pdf` : `Contrato_${documentId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },

  signDocument: async (documentId: number, signature: File | string): Promise<LexvaultDocument> => {
    let payload: any;
    let headers: any = {};

    if (signature instanceof File) {
      const formData = new FormData();
      formData.append('signature', signature);
      payload = formData;
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = { signature };
    }

    const response = await apiClient.post(`/v1/lexvault/documents/${documentId}/sign`, payload, { headers });
    return response.data?.data || response.data;
  },

  declineDocument: async (documentId: number, reason: string): Promise<LexvaultDocument> => {
    const response = await apiClient.post(`/v1/lexvault/documents/${documentId}/decline`, {
      decline_reason: reason,
    });
    return response.data?.data || response.data;
  },

  deleteDocument: async (documentId: number): Promise<void> => {
    await apiClient.delete(`/v1/lexvault/documents/${documentId}`);
  },

  getDocumentPdfUrl: (documentId: number): string => {
    return `${getApiBaseUrl()}/v1/lexvault/documents/${documentId}/pdf`;
  },
};

export default lexvaultService;
