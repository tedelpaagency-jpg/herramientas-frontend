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
  content?: string | null;
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

export interface MyCourseAssignment {
  id: number;
  course_id: number;
  user_id: number;
  assigned_by?: number;
  assigned_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  status: 'assigned' | 'in_progress' | 'completed';
  course: Course;
  assigner?: {
    id: number;
    name: string;
  };
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
