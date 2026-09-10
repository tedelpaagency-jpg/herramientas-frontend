export interface CourseSectionMaterial {
  id: number;
  course_section_id: number;
  title: string;
  type: 'video' | 'pdf' | 'file';
  video_provider?: 'local' | 'drive' | 'youtube' | null;
  external_url?: string | null;
  duration?: string | null;
  file_path?: string | null;
  file_name?: string | null;
  mime_type?: string;
  file_size?: number;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CourseModule {
  id: number;
  course_id: number;
  title: string;
  description?: string | null;
  sort_order: number;
  sections?: CourseSection[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CourseSection {
  id: number;
  course_id: number;
  course_module_id?: number | null;
  group_name?: string | null;
  title: string;
  cover_image?: string | null;
  certificate_image?: string | null;
  content?: string | null;
  description?: string | null;
  duration?: string | null;
  sort_order: number;
  materials?: CourseSectionMaterial[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CourseResource {
  id: number;
  course_id: number;
  title: string;
  type: 'video' | 'pdf' | 'text';
  video_provider?: 'local' | 'drive' | 'youtube' | null;
  external_url?: string | null;
  content?: string | null;
  file_path?: string | null;
  file_name?: string | null;
  mime_type?: string;
  file_size?: number;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CourseUserAssignment {
  id: number;
  course_id: number;
  user_id: number;
  assigned_by?: number;
  assigned_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  status: 'assigned' | 'in_progress' | 'completed';
  progress_percentage?: number;
  completed_count?: number;
  total_count?: number;
  completed_materials_count?: number;
  total_materials_count?: number;
  completed_materials?: any[];
  user?: {
    id: number;
    name: string;
    email: string;
    role?: string;
    phone?: string;
  };
  assigner?: {
    id: number;
    name: string;
  };
}

export interface Course {
  id: number;
  white_label_id?: number | null;
  agency_id?: number | null;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  main_image?: string | null;
  banner_image?: string | null;
  thumb_image?: string | null;
  detail_media_type?: 'image' | 'video' | null;
  detail_media_provider?: 'local' | 'youtube' | 'drive' | null;
  detail_media_url?: string | null;
  category?: string | null;
  status: 'active' | 'inactive' | 'draft';
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  white_label?: {
    id: number;
    name: string;
  };
  agency?: {
    id: number;
    name: string;
  };
  modules?: CourseModule[];
  sections?: CourseSection[];
  resources?: CourseResource[];
  resources_count?: number;
  assignments?: CourseUserAssignment[];
  assignments_count?: number;
}

export interface CourseProgressMetrics {
  progress_percentage: number;
  completed_count: number;
  total_count: number;
  status: 'assigned' | 'in_progress' | 'completed';
  completed_material_ids: number[];
  completed_resource_ids: number[];
  last_completed_material_id?: number | null;
  last_completed_at?: string | null;
}

export interface MyCourseAssignment {
  id: number;
  course_id: number;
  user_id: number;
  assigned_by?: number;
  assigned_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  status: 'assigned' | 'in_progress' | 'completed';
  computed_status?: 'assigned' | 'in_progress' | 'completed';
  progress_percentage?: number;
  completed_count?: number;
  total_count?: number;
  completed_materials_count?: number;
  total_materials_count?: number;
  completed_materials?: any[];
  course: Course;
  assigner?: {
    id: number;
    name: string;
  };
}

export interface StudentProgressItem {
  assignment_id: number;
  user_id: number;
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
    phone?: string;
  };
  assigned_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  status: 'assigned' | 'in_progress' | 'completed';
  status_label: string;
  progress_percentage: number;
  completed_count: number;
  total_count: number;
  completed_materials_count?: number;
  total_materials_count?: number;
  completed_sections_count?: number;
  total_sections_count?: number;
}

export interface StudentMaterialProgressDetail {
  id: number;
  title: string;
  type: string;
  section_title?: string;
  is_completed: boolean;
  completed_at?: string | null;
}

export interface StudentSectionProgressDetail {
  id: number;
  title: string;
  group_name?: string | null;
  completed_count: number;
  total_count: number;
  is_completed: boolean;
  materials: StudentMaterialProgressDetail[];
}

export interface StudentDetailProgressResponse {
  course: {
    id: number;
    title: string;
  };
  student: {
    id: number;
    name: string;
    email: string;
  };
  metrics: CourseProgressMetrics;
  sections: StudentSectionProgressDetail[];
  materials?: StudentMaterialProgressDetail[];
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
