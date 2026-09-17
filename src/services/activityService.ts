import apiClient from './apiClient';
import {
  ActivityGroup,
  ActivityItem,
  ActivityItemResource,
  ActivityItemSubmission,
  ActivityGroupUserAssignment,
  MyActivityAssignment,
  StudentActivityProgressItem,
  StudentActivityDetailProgressResponse,
  PaginatedResponse,
} from '../types/activity';

export const activityService = {
  // Admin: Listar grupos de actividades
  getActivityGroups: async (params?: { search?: string; status?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get<{ status: string; data: PaginatedResponse<ActivityGroup> }>('/v1/activities', { params });
    return response.data;
  },

  // Admin: Obtener detalle de grupo
  getActivityGroup: async (id: number | string) => {
    const response = await apiClient.get<{ status: string; data: ActivityGroup }>(`/v1/activities/${id}`);
    return response.data;
  },

  // Admin: Crear grupo de actividades (POST)
  createActivityGroup: async (data: Partial<ActivityGroup>) => {
    const response = await apiClient.post<{ status: string; message: string; data: ActivityGroup }>('/v1/activities', data);
    return response.data;
  },

  // Admin: Actualizar grupo (POST)
  updateActivityGroup: async (id: number | string, data: Partial<ActivityGroup>) => {
    const response = await apiClient.post<{ status: string; message: string; data: ActivityGroup }>(`/v1/activities/${id}/update`, data);
    return response.data;
  },

  // Admin: Eliminar grupo (Soft Delete POST)
  deleteActivityGroup: async (id: number | string) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/activities/${id}/delete`);
    return response.data;
  },

  // Admin: Subir imagen portada del grupo
  uploadGroupImage: async (file: File, groupId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (groupId) formData.append('group_id', groupId.toString());

    const response = await apiClient.post<{ status: string; message: string; url: string; path: string }>('/v1/activities/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Crear actividad dentro de un grupo (POST)
  createActivity: async (groupId: number | string, data: {
    title: string;
    primary_type: 'image' | 'video' | 'none';
    submission_type: 'none' | 'text' | 'pdf' | 'video' | 'image';
    media_provider?: 'local' | 'youtube' | 'drive';
    media_url?: string;
    content?: string;
    sort_order?: number;
    cover_image_file?: File | null;
    media_file?: File | null;
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('primary_type', data.primary_type);
    formData.append('submission_type', data.submission_type);
    if (data.media_provider) formData.append('media_provider', data.media_provider);
    if (data.media_url) formData.append('media_url', data.media_url);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());
    if (data.cover_image_file) formData.append('cover_image_file', data.cover_image_file);
    if (data.media_file) formData.append('media_file', data.media_file);

    const response = await apiClient.post<{ status: string; message: string; data: ActivityItem }>(`/v1/activities/${groupId}/items`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Actualizar actividad (POST)
  updateActivity: async (activityId: number, data: {
    title: string;
    primary_type: 'image' | 'video' | 'none';
    submission_type: 'none' | 'text' | 'pdf' | 'video' | 'image';
    media_provider?: 'local' | 'youtube' | 'drive';
    media_url?: string;
    content?: string;
    sort_order?: number;
    cover_image_file?: File | null;
    media_file?: File | null;
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('primary_type', data.primary_type);
    formData.append('submission_type', data.submission_type);
    if (data.media_provider) formData.append('media_provider', data.media_provider);
    if (data.media_url) formData.append('media_url', data.media_url);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());
    if (data.cover_image_file) formData.append('cover_image_file', data.cover_image_file);
    if (data.media_file) formData.append('media_file', data.media_file);

    const response = await apiClient.post<{ status: string; message: string; data: ActivityItem }>(`/v1/activities/items/${activityId}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Eliminar actividad (POST)
  deleteActivity: async (activityId: number) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/activities/items/${activityId}/delete`);
    return response.data;
  },

  // Admin: Subir recurso de actividad (POST)
  uploadResource: async (activityId: number | string, data: {
    title: string;
    type: 'pdf' | 'image' | 'video' | 'file';
    source_type: 'local' | 'url';
    video_provider?: 'local' | 'youtube' | 'drive';
    external_url?: string;
    file?: File | null;
    sort_order?: number;
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('source_type', data.source_type);
    if (data.video_provider) formData.append('video_provider', data.video_provider);
    if (data.external_url) formData.append('external_url', data.external_url);
    if (data.file) formData.append('file', data.file);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());

    const response = await apiClient.post<{ status: string; message: string; data: ActivityItemResource }>(`/v1/activities/items/${activityId}/resources`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Eliminar recurso de actividad (POST)
  deleteResource: async (resourceId: number) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/activities/resources/${resourceId}/delete`);
    return response.data;
  },

  // Admin: Asignar usuarios al grupo
  assignUsers: async (groupId: number | string, userIds: number[]) => {
    const response = await apiClient.post<{ status: string; message: string; data: ActivityGroup }>(`/v1/activities/${groupId}/assign`, { user_ids: userIds });
    return response.data;
  },

  // Admin: Desasignar usuario
  unassignUser: async (groupId: number | string, userId: number) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/activities/${groupId}/unassign`, { user_id: userId });
    return response.data;
  },

  // Instructor/Admin: Obtener tabla de avance de alumnos del grupo
  getStudentsProgress: async (groupId: number | string, params?: { search?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get<{ status: string; group: { id: number; title: string }; data: PaginatedResponse<StudentActivityProgressItem> }>(`/v1/activities/${groupId}/students-progress`, { params });
    return response.data;
  },

  // Instructor/Admin: Obtener desglose de progreso de un alumno en específico
  getStudentDetailProgress: async (groupId: number | string, userId: number | string) => {
    const response = await apiClient.get<{ status: string; data: StudentActivityDetailProgressResponse }>(`/v1/activities/${groupId}/students/${userId}/progress`);
    return response.data;
  },

  // Estudiante: Listar "Mis Actividades"
  getMyActivities: async (params?: { search?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get<{ status: string; data: PaginatedResponse<MyActivityAssignment> }>('/v1/my-activities', { params });
    return response.data;
  },

  // Estudiante: Ver detalle de mi grupo de actividades asignado
  getMyActivityDetail: async (groupId: number | string) => {
    const response = await apiClient.get<{ status: string; data: { group: ActivityGroup; assignment: ActivityGroupUserAssignment | null; completed_activity_ids: number[]; submissions: Record<number, ActivityItemSubmission> } }>(`/v1/my-activities/${groupId}`);
    return response.data;
  },

  // Estudiante: Realizar entrega o marcar como completada (POST)
  submitActivity: async (activityId: number | string, data: { content?: string; file?: File | null }) => {
    const formData = new FormData();
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.file) formData.append('file', data.file);

    const response = await apiClient.post<{ status: string; message: string; data: { submission: ActivityItemSubmission; completed_count: number; total_count: number; progress_percentage: number } }>(`/v1/my-activities/items/${activityId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Obtener URL de streaming/descarga protegida de recurso de actividad
  getResourceStreamUrl: (resourceId: number, download = false) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('santun_auth_token') : null;
    const baseUrl = apiClient.defaults.baseURL || '';
    const queryParams = new URLSearchParams();
    if (download) queryParams.set('download', '1');
    if (token) queryParams.set('token', token);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return `${baseUrl}/v1/activities/resources/${resourceId}/stream${queryString}`;
  }
};

export default activityService;
