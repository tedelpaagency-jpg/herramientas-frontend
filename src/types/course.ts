export interface CourseResource {
  id: number;
  course_id: number;
  title: string;
  type: 'video' | 'pdf';
  file_path: string;
  file_name: string;
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
  agency_id?: number | null;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  main_image?: string | null;
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
  agency?: {
    id: number;
    name: string;
  };
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
