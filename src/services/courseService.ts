import apiClient from './apiClient';
import { Course, CourseResource, CourseUserAssignment, MyCourseAssignment, PaginatedResponse, StudentProgressItem, StudentDetailProgressResponse } from '../types/course';

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

  // Admin: Obtener vista previa del curso (Preview)
  getCoursePreview: async (id: number | string) => {
    const response = await apiClient.get<{ status: string; data: Course }>(`/v1/courses/${id}/preview`);
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
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Subir imagen de certificado del curso
  uploadCertificateImage: async (file: File, courseId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (courseId) formData.append('course_id', courseId.toString());

    const response = await apiClient.post<{ status: string; message: string; url: string; path: string }>('/v1/courses/upload-certificate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Eliminar imagen de certificado del curso
  deleteCertificateImage: async (courseId: number | string) => {
    const response = await apiClient.post<{ status: string; message: string; data: any }>('/v1/courses/delete-certificate', { course_id: courseId });
    return response.data;
  },

  // Admin: Subir recurso de detalle de curso (imagen o video)
  uploadDetailMedia: async (courseId: number | string, data: { media_type: 'image' | 'video'; video_provider?: 'local' | 'youtube' | 'drive'; file?: File | null; external_url?: string }) => {
    const formData = new FormData();
    formData.append('course_id', courseId.toString());
    formData.append('media_type', data.media_type);
    if (data.video_provider) formData.append('video_provider', data.video_provider);
    if (data.file) formData.append('file', data.file);
    if (data.external_url) formData.append('external_url', data.external_url);

    const response = await apiClient.post<{ status: string; message: string; data: Course }>('/v1/courses/upload-detail-media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Eliminar recurso de detalle de curso (POST)
  deleteDetailMedia: async (courseId: number | string) => {
    const response = await apiClient.post<{ status: string; message: string; data: Course }>('/v1/courses/delete-detail-media', { course_id: courseId });
    return response.data;
  },

  // Admin: Subir recurso de curso (video / pdf / text)
  uploadResource: async (courseId: number | string, data: { title: string; type: 'video' | 'pdf' | 'text'; content?: string; file?: File | null; sort_order?: number }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.file) formData.append('file', data.file);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());

    const response = await apiClient.post<{ status: string; message: string; data: CourseResource }>(`/v1/courses/${courseId}/resources`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Actualizar recurso (POST)
  updateResource: async (resourceId: number, data: { title: string; type: 'video' | 'pdf' | 'text'; content?: string; file?: File | null; sort_order?: number }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.file) formData.append('file', data.file);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());

    const response = await apiClient.post<{ status: string; message: string; data: CourseResource }>(`/v1/courses/resources/${resourceId}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
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

  // Instructor/Admin: Obtener tabla de avance de alumnos de un curso
  getStudentsProgress: async (courseId: number | string, params?: { search?: string; status?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get<{ status: string; course: { id: number; title: string }; data: PaginatedResponse<StudentProgressItem> }>(`/v1/courses/${courseId}/students-progress`, { params });
    return response.data;
  },

  // Instructor/Admin: Obtener desglose de progreso de un alumno específico
  getStudentDetailProgress: async (courseId: number | string, userId: number | string) => {
    const response = await apiClient.get<{ status: string; data: StudentDetailProgressResponse }>(`/v1/courses/${courseId}/students/${userId}/progress`);
    return response.data;
  },

  // Estudiante: Listar "Mis Cursos"
  getMyCourses: async (params?: { search?: string; status?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get<{ status: string; data: PaginatedResponse<MyCourseAssignment> }>('/v1/my-courses', { params });
    return response.data;
  },

  // Estudiante: Ver detalle de mi curso asignado
  getMyCourseDetail: async (courseId: number | string) => {
    const response = await apiClient.get<{ status: string; data: { course: Course; assignment: CourseUserAssignment | null; progress?: any } }>(`/v1/my-courses/${courseId}`);
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

  // Estudiante: Marcar recurso/material como COMPLETADO (POST)
  completeMaterial: async (materialIdOrCourseId: number | string, materialId?: number, resourceId?: number) => {
    let payload: any = {};
    if (typeof materialIdOrCourseId === 'number' && materialId === undefined && resourceId === undefined) {
      payload = { material_id: materialIdOrCourseId };
    } else {
      payload = {
        course_id: materialIdOrCourseId,
        material_id: materialId,
        resource_id: resourceId,
      };
    }
    const response = await apiClient.post<{ status: string; message: string; data: any }>('/v1/my-courses/complete-material', payload);
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
  },

  // Admin: Crear Módulo del Curso (POST)
  createModule: async (courseId: number | string, data: { title: string; description?: string; sort_order?: number }) => {
    const response = await apiClient.post<{ status: string; message: string; data: any }>(`/v1/courses/${courseId}/modules`, data);
    return response.data;
  },

  // Admin: Actualizar Módulo (POST)
  updateModule: async (moduleId: number, data: { title: string; description?: string; sort_order?: number }) => {
    const response = await apiClient.post<{ status: string; message: string; data: any }>(`/v1/courses/modules/${moduleId}/update`, data);
    return response.data;
  },

  // Admin: Eliminar Módulo (POST)
  deleteModule: async (moduleId: number) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/courses/modules/${moduleId}/delete`);
    return response.data;
  },

  // Admin: Reordenar Módulos (POST)
  reorderModules: async (courseId: number | string, modules: { id: number; sort_order: number }[]) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/courses/${courseId}/modules/reorder`, { modules });
    return response.data;
  },

  // Admin: Crear sección de curso asociada a un módulo o curso (POST)
  createSection: async (courseId: number | string, data: { title: string; course_module_id?: number; group_name?: string; duration?: string; content?: string; sort_order?: number; primary_type?: 'video' | 'pdf' | 'image' | 'file' | 'none'; file?: File; cover_image_file?: File }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.course_module_id) formData.append('course_module_id', data.course_module_id.toString());
    if (data.group_name) formData.append('group_name', data.group_name);
    if (data.duration) formData.append('duration', data.duration);
    if (data.content) formData.append('content', data.content);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());
    if (data.primary_type) formData.append('primary_type', data.primary_type);
    if (data.file) formData.append('file', data.file);
    if (data.cover_image_file) formData.append('cover_image_file', data.cover_image_file);

    const response = await apiClient.post<{ status: string; message: string; data: any }>(`/v1/courses/${courseId}/sections`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Actualizar sección (POST)
  updateSection: async (sectionId: number, data: { title: string; course_module_id?: number; group_name?: string; duration?: string; content?: string; sort_order?: number; primary_type?: 'video' | 'pdf' | 'image' | 'file' | 'none'; file?: File; cover_image_file?: File }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.course_module_id !== undefined) formData.append('course_module_id', data.course_module_id ? data.course_module_id.toString() : '');
    if (data.group_name !== undefined) formData.append('group_name', data.group_name || '');
    if (data.duration !== undefined) formData.append('duration', data.duration || '');
    if (data.content !== undefined) formData.append('content', data.content || '');
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());
    if (data.primary_type) formData.append('primary_type', data.primary_type);
    if (data.file) formData.append('file', data.file);
    if (data.cover_image_file) formData.append('cover_image_file', data.cover_image_file);

    const response = await apiClient.post<{ status: string; message: string; data: any }>(`/v1/courses/sections/${sectionId}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Eliminar sección (POST)
  deleteSection: async (sectionId: number) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/courses/sections/${sectionId}/delete`);
    return response.data;
  },

  // Admin: Reordenar secciones (POST)
  reorderSections: async (courseId: number | string, sections: { id: number; sort_order: number }[]) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/courses/${courseId}/sections/reorder`, { sections });
    return response.data;
  },

  // Admin: Subir material a una sección (video / pdf / image / file)
  uploadMaterial: async (sectionId: number, data: { title: string; type: 'video' | 'pdf' | 'image' | 'file'; video_provider?: 'local' | 'drive' | 'youtube'; external_url?: string; file?: File | null; sort_order?: number }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    if (data.video_provider) formData.append('video_provider', data.video_provider);
    if (data.external_url) formData.append('external_url', data.external_url);
    if (data.file) formData.append('file', data.file);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());

    const response = await apiClient.post<{ status: string; message: string; data: any }>(`/v1/courses/sections/${sectionId}/materials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Actualizar material de sección (POST)
  updateMaterial: async (materialId: number, data: { title: string; type: 'video' | 'pdf' | 'image' | 'file'; video_provider?: 'local' | 'drive' | 'youtube'; external_url?: string; file?: File | null; sort_order?: number }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    if (data.video_provider) formData.append('video_provider', data.video_provider);
    if (data.external_url) formData.append('external_url', data.external_url);
    if (data.file) formData.append('file', data.file);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());

    const response = await apiClient.post<{ status: string; message: string; data: any }>(`/v1/courses/sections/materials/${materialId}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  },

  // Admin: Eliminar material de sección (POST)
  deleteMaterial: async (materialId: number) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/courses/sections/materials/${materialId}/delete`);
    return response.data;
  },

  // Admin: Reordenar materiales dentro de una sección (POST)
  reorderMaterials: async (sectionId: number, materials: { id: number; sort_order: number }[]) => {
    const response = await apiClient.post<{ status: string; message: string }>(`/v1/courses/sections/${sectionId}/materials/reorder`, { materials });
    return response.data;
  },

  // Obtener URL de streaming/descarga protegida de material de sección
  getMaterialStreamUrl: (materialId: number, download = false) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('santun_auth_token') : null;
    const baseUrl = apiClient.defaults.baseURL || '';
    const queryParams = new URLSearchParams();
    if (download) queryParams.set('download', '1');
    if (token) queryParams.set('token', token);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return `${baseUrl}/v1/courses/materials/${materialId}/stream${queryString}`;
  }
};

export default courseService;
