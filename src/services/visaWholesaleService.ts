import apiClient, { getApiBaseUrl } from './apiClient';

export interface VisaProcessType {
  id: number;
  slug: string;
  name: string;
  country: string;
  flag_icon?: string;
  description?: string;
  estimated_duration?: string;
  is_active: boolean;
  stages_schema: Array<{
    key: string;
    name: string;
    weight: number;
    order: number;
  }>;
  form_schema: {
    sections: Array<{
      id: string;
      title: string;
      description?: string;
      fields: Array<{
        name: string;
        label: string;
        type: string;
        options?: string[];
        required?: boolean;
        required_for_review?: boolean;
      }>;
    }>;
  };
  required_documents: Array<{
    type: string;
    name: string;
    description?: string;
    required: boolean;
  }>;
}

export interface VisaGroup {
  id: number;
  agency_id: number;
  code: string;
  name: string;
  group_type: 'familia' | 'pareja' | 'corporativo' | 'viaje' | 'otro';
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  status: string;
  agency?: any;
  dossiers_count?: number;
  dossiers?: VisaDossier[];
}

export interface VisaDocument {
  id: number;
  dossier_id: number;
  media_id?: number;
  document_type: string;
  name: string;
  file_url?: string;
  original_name?: string;
  status: 'pendiente' | 'recibido' | 'en_revision' | 'observado' | 'aprobado';
  observation?: string;
  observation_reason?: string;
  responsible_to_fix?: 'cliente' | 'agencia';
  version: number;
  previous_versions?: any[];
  uploaded_by_user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface VisaTimelineEvent {
  id: number;
  dossier_id: number;
  user_id?: number;
  actor_type: 'cliente' | 'agencia' | 'mayorista' | 'sistema';
  event_type: string;
  title: string;
  description: string;
  visibility: 'public' | 'internal';
  metadata?: any;
  created_at: string;
  user?: any;
}

export interface VisaMessage {
  id: number;
  dossier_id: number;
  user_id?: number;
  sender_type: 'cliente' | 'agencia' | 'mayorista';
  sender_name?: string;
  visibility: 'public' | 'internal';
  message: string;
  attachments?: any;
  created_at: string;
  user?: any;
}

export interface VisaDossier {
  id: number;
  agency_id: number;
  white_label_id?: number;
  client_id: number;
  group_id?: number;
  visa_process_type_id: number;
  responsible_user_id?: number;
  code: string;
  status: 
    | 'borrador'
    | 'link_enviado'
    | 'informacion_pendiente'
    | 'informacion_recibida'
    | 'en_revision'
    | 'correccion_solicitada'
    | 'en_gestion'
    | 'revision_final'
    | 'completado'
    | 'cerrado'
    | 'cancelado';
  external_result: 'pendiente' | 'aprobado' | 'rechazado' | 'otro';
  current_responsible: 'cliente' | 'agencia' | 'mayorista';
  priority: 'urgente' | 'requiere_atencion' | 'pendiente' | 'completado';
  progress: number;
  current_stage_key: string;
  action_required?: string;
  access_token: string;
  token_expires_at?: string;
  terms_accepted_at?: string;
  deadline?: string;
  form_data?: Record<string, any>;
  internal_notes?: string;
  deletion_request_status?: string;
  created_at: string;
  updated_at: string;
  client?: any;
  agency?: any;
  group?: VisaGroup;
  processType?: VisaProcessType;
  assignedUser?: any;
  documents?: VisaDocument[];
  messages?: VisaMessage[];
  timelineEvents?: VisaTimelineEvent[];
}

export interface AgencyVisaPolicy {
  id: number;
  agency_id: number;
  terms_and_conditions: string;
  data_treatment_policy: string;
  retention_policy: string;
  version: string;
  updated_at: string;
}

export interface VisaNotification {
  id: number;
  dossier_id?: number;
  agency_id?: number;
  white_label_id?: number;
  user_id?: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  dossier?: VisaDossier;
}

class VisaWholesaleService {
  // ===================== EXPEDIENTES (DOSSIERS) =====================

  async getDossiers(params?: Record<string, any>) {
    const res = await apiClient.get('/v1/visas/dossiers', { params });
    return res.data;
  }

  async getDossier(id: number) {
    const res = await apiClient.get(`/v1/visas/dossiers/${id}`);
    return res.data?.data;
  }

  async createDossier(data: Record<string, any>) {
    const res = await apiClient.post('/v1/visas/dossiers', data);
    return res.data;
  }

  async updateDossier(id: number, data: Record<string, any>) {
    const res = await apiClient.put(`/v1/visas/dossiers/${id}`, data);
    return res.data;
  }

  async getClientLink(id: number, regenerate = false) {
    const res = await apiClient.post(`/v1/visas/dossiers/${id}/client-link`, { regenerate });
    return res.data?.data;
  }

  async deleteDossier(id: number) {
    const res = await apiClient.delete(`/v1/visas/dossiers/${id}`);
    return res.data;
  }

  async requestDeleteDossier(id: number, reason: string) {
    const res = await apiClient.post(`/v1/visas/dossiers/${id}/request-delete`, { reason });
    return res.data;
  }

  async approveDeletionRequest(requestId: number, notes?: string) {
    const res = await apiClient.post(`/v1/visas/deletion-requests/${requestId}/approve`, { notes });
    return res.data;
  }

  async rejectDeletionRequest(requestId: number, notes?: string) {
    const res = await apiClient.post(`/v1/visas/deletion-requests/${requestId}/reject`, { notes });
    return res.data;
  }

  async downloadDossierPdf(id: number, code: string) {
    const res = await apiClient.get(`/v1/visas/dossiers/${id}/pdf`, {
      responseType: 'blob',
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Expediente-${code}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // ===================== DASHBOARDS =====================

  async getAgencyDashboard() {
    const res = await apiClient.get('/v1/visas/dashboard/agency');
    return res.data?.data;
  }

  async getMayoristaDashboard(agencyId?: number) {
    const res = await apiClient.get('/v1/visas/dashboard/mayorista', {
      params: agencyId ? { agency_id: agencyId } : undefined,
    });
    return res.data?.data;
  }

  async getMayoristaAgencies(params?: Record<string, any>) {
    const res = await apiClient.get('/v1/visas/mayorista/agencies', { params });
    return res.data?.data;
  }

  // ===================== TIPOS DE PROCESO =====================

  async getProcessTypes(params?: Record<string, any>) {
    const res = await apiClient.get('/v1/visas/process-types', { params });
    return res.data?.data || [];
  }

  async getProcessType(id: number) {
    const res = await apiClient.get(`/v1/visas/process-types/${id}`);
    return res.data?.data;
  }

  async createProcessType(data: Record<string, any>) {
    const res = await apiClient.post('/v1/visas/process-types', data);
    return res.data;
  }

  async updateProcessType(id: number, data: Record<string, any>) {
    const res = await apiClient.put(`/v1/visas/process-types/${id}`, data);
    return res.data;
  }

  async deleteProcessType(id: number) {
    const res = await apiClient.delete(`/v1/visas/process-types/${id}`);
    return res.data;
  }

  // ===================== GRUPOS =====================

  async getGroups(params?: Record<string, any>) {
    const res = await apiClient.get('/v1/visas/groups', { params });
    return res.data?.data;
  }

  async getGroup(id: number) {
    const res = await apiClient.get(`/v1/visas/groups/${id}`);
    return res.data?.data;
  }

  async createGroup(data: Record<string, any>) {
    const res = await apiClient.post('/v1/visas/groups', data);
    return res.data;
  }

  async updateGroup(id: number, data: Record<string, any>) {
    const res = await apiClient.put(`/v1/visas/groups/${id}`, data);
    return res.data;
  }

  async deleteGroup(id: number) {
    const res = await apiClient.delete(`/v1/visas/groups/${id}`);
    return res.data;
  }

  // ===================== DOCUMENTOS =====================

  async uploadDocument(dossierId: number, formData: FormData) {
    const res = await apiClient.post(`/v1/visas/dossiers/${dossierId}/documents/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async observeDocument(documentId: number, data: { observation: string; observation_reason?: string; responsible_to_fix: 'cliente' | 'agencia' }) {
    const res = await apiClient.post(`/v1/visas/documents/${documentId}/observe`, data);
    return res.data;
  }

  async approveDocument(documentId: number) {
    const res = await apiClient.post(`/v1/visas/documents/${documentId}/approve`);
    return res.data;
  }

  async downloadDocument(documentId: number) {
    const res = await apiClient.get(`/v1/visas/documents/${documentId}/download`);
    return res.data;
  }

  // ===================== MENSAJES =====================

  async getMessages(dossierId: number) {
    const res = await apiClient.get(`/v1/visas/dossiers/${dossierId}/messages`);
    return res.data?.data || [];
  }

  async sendMessage(dossierId: number, message: string, visibility: 'public' | 'internal' = 'public') {
    const res = await apiClient.post(`/v1/visas/dossiers/${dossierId}/messages`, { message, visibility });
    return res.data;
  }

  // ===================== POLÍTICAS =====================

  async getAgencyPolicies(agencyId?: number) {
    const url = agencyId ? `/v1/visas/policies/${agencyId}` : '/v1/visas/policies';
    const res = await apiClient.get(url);
    return res.data?.data;
  }

  async updateAgencyPolicies(data: { terms_and_conditions: string; data_treatment_policy: string; retention_policy: string; version?: string }, agencyId?: number) {
    const url = agencyId ? `/v1/visas/policies/${agencyId}` : '/v1/visas/policies';
    const res = await apiClient.put(url, data);
    return res.data;
  }

  // ===================== NOTIFICACIONES =====================

  async getRecentNotifications() {
    const res = await apiClient.get('/v1/visas/notifications/recent');
    return res.data;
  }

  async getNotifications(page = 1) {
    const res = await apiClient.get(`/v1/visas/notifications?page=${page}`);
    return res.data?.data;
  }

  async markNotificationAsRead(id: number) {
    const res = await apiClient.post(`/v1/visas/notifications/${id}/read`);
    return res.data;
  }

  async markAllNotificationsAsRead() {
    const res = await apiClient.post('/v1/visas/notifications/read-all');
    return res.data;
  }

  // ===================== PORTAL PÚBLICO DEL CLIENTE =====================

  async getPublicPortalData(token: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/v1/visas/public/${token}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al cargar el portal de visado.');
    }
    return await res.json();
  }

  async acceptPublicPolicies(token: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/v1/visas/public/${token}/accept-policies`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
    return await res.json();
  }

  async savePublicProgress(token: string, formData: Record<string, any>) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/v1/visas/public/${token}/save-progress`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ form_data: formData }),
    });
    return await res.json();
  }

  async uploadPublicDocument(token: string, formData: FormData) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/v1/visas/public/${token}/upload-document`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData,
    });
    return await res.json();
  }

  async sendPublicMessage(token: string, message: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/v1/visas/public/${token}/messages`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return await res.json();
  }

  async submitPublicForm(token: string, formData: Record<string, any>) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/v1/visas/public/${token}/submit`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ form_data: formData }),
    });
    return await res.json();
  }

  // ===================== ROLES DEL TENANT =====================

  async getRoles(params?: Record<string, any>) {
    const res = await apiClient.get('/v1/roles', { params });
    return res.data?.data || [];
  }

  async getAvailablePermissions() {
    const res = await apiClient.get('/v1/roles/available-permissions');
    return res.data?.data || [];
  }

  async createRole(data: { name: string; display_name: string; description?: string; permissions?: string[]; agency_id?: number }) {
    const res = await apiClient.post('/v1/roles', data);
    return res.data;
  }

  async updateRole(id: number, data: { display_name?: string; description?: string; permissions?: string[] }) {
    const res = await apiClient.put(`/v1/roles/${id}`, data);
    return res.data;
  }

  async deleteRole(id: number) {
    const res = await apiClient.delete(`/v1/roles/${id}`);
    return res.data;
  }
}

export default new VisaWholesaleService();
