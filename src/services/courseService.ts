import apiClient from './apiClient';
import { Course, CourseResource, CourseUserAssignment, MyCourseAssignment, PaginatedResponse } from '../types/course';

export const courseService = {
  // Admin: Listar cursos
  getCourses: async (params?: { search?: string; status?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get<{ status: string; data: PaginatedResponse<Course> }>('/v1/courses', { params });
    return response.data;
  },

  // Admin: Obtener detalle de curso
  getCourse: async (id: number | string) => {
    const response = await apiClient.get<{ status: string; data: Course }>(`/v1/courses/${id}`);
    return response.data;
  },

  // Admin: Crear curso (POST)
  createCourse: async (data: Partial<Course>) => {
    const response = await apiClient.post<{ status: string; message: string; data: Course }>('/v1/courses', data);
    return response.data;
  },

  // Admin: Actualizar curso (POST)
  updateCourse: async (id: number | string, data: Partial<Course>) => {
    const response = await apiClient.post<{ status: string; message: string; data: Course }>(`/v1/courses/${id}/update`, data);
    return response.data;
  },

  // Admin: Eliminar curso (Soft Delete POST)
  deleteCourse: async (id: number | string) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/courses/${id}/delete`);
    return response.data;
  },

  // Admin: Subir imagen principal
  uploadMainImage: async (file: File, courseId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (courseId) formData.append('course_id', courseId.toString());

    const response = await apiClient.post<{ status: string; message: string; url: string; path: string }>('/v1/courses/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Admin: Subir recurso de curso (video / pdf)
  uploadResource: async (courseId: number | string, data: { title: string; type: 'video' | 'pdf'; file: File; sort_order?: number }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('file', data.file);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());

    const response = await apiClient.post<{ status: string; message: string; data: CourseResource }>(`/v1/courses/${courseId}/resources`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Admin: Actualizar recurso (POST)
  updateResource: async (resourceId: number, data: { title: string; type: 'video' | 'pdf'; file?: File; sort_order?: number }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    if (data.file) formData.append('file', data.file);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());

    const response = await apiClient.post<{ status: string; message: string; data: CourseResource }>(`/v1/courses/resources/${resourceId}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Admin: Eliminar recurso (POST)
  deleteResource: async (resourceId: number) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/courses/resources/${resourceId}/delete`);
    return response.data;
  },

  // Admin: Reordenar recursos (POST)
  reorderResources: async (courseId: number | string, resources: { id: number; sort_order: number }[]) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/courses/${courseId}/resources/reorder`, { resources });
    return response.data;
  },

  // Admin: Asignar usuarios a curso (POST)
  assignUsers: async (courseId: number | string, userIds: number[]) => {
    const response = await apiClient.post<{ status: string; message: string; data: Course }>(`/v1/courses/${courseId}/assign`, { user_ids: userIds });
    return response.data;
  },

  // Admin: Quitar asignación de usuario (POST)
  unassignUser: async (courseId: number | string, userId: number, assignmentId?: number) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/courses/${courseId}/unassign`, {
      user_id: userId,
      assignment_id: assignmentId,
    });
    return response.data;
  },

  // Admin: Obtener asignaciones de un curso
  getAssignments: async (courseId: number | string, params?: { search?: string; status?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get<{ status: string; data: PaginatedResponse<CourseUserAssignment> }>(`/v1/courses/${courseId}/assignments`, { params });
    return response.data;
  },

  // Estudiante: Listar "Mis Cursos"
  getMyCourses: async (params?: { search?: string; status?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get<{ status: string; data: PaginatedResponse<MyCourseAssignment> }>('/v1/my-courses', { params });
    return response.data;
  },

  // Estudiante: Ver detalle de mi curso asignado
  getMyCourseDetail: async (courseId: number | string) => {
    const response = await apiClient.get<{ status: string; data: { course: Course; assignment: CourseUserAssignment | null } }>(`/v1/my-courses/${courseId}`);
    return response.data;
  },

  // Estudiante: Iniciar curso (POST)
  startCourse: async (courseId: number | string) => {
    const response = await apiClient.post<{ status: string; message: string; data: CourseUserAssignment }>(`/v1/my-courses/${courseId}/start`);
    return response.data;
  },

  // Estudiante: Completar curso (POST)
  completeCourse: async (courseId: number | string) => {
    const response = await apiClient.post<{ status: string; message: string; data: CourseUserAssignment }>(`/v1/my-courses/${courseId}/complete`);
    return response.data;
  },

  // Obtener URL de streaming/descarga protegida de recurso
  getResourceStreamUrl: (resourceId: number, download = false) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('santun_auth_token') : null;
    const baseUrl = apiClient.defaults.baseURL || '';
    const queryParams = new URLSearchParams();
    if (download) queryParams.set('download', '1');
    if (token) queryParams.set('token', token);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return `${baseUrl}/v1/courses/resources/${resourceId}/stream${queryString}`;
  }
};

export default courseService;
