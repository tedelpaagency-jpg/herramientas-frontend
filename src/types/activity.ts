export interface ActivityItemResource {
  id: number;
  activity_item_id: number;
  title: string;
  type: 'pdf' | 'image' | 'video' | 'file';
  source_type: 'local' | 'url';
  video_provider?: 'local' | 'youtube' | 'drive' | null;
  external_url?: string | null;
  file_path?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  file_size?: number | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityItemSubmission {
  id: number;
  activity_item_id: number;
  user_id: number;
  submission_type: 'none' | 'text' | 'pdf' | 'video' | 'image';
  content?: string | null;
  file_path?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  file_size?: number | null;
  status: 'pending' | 'submitted' | 'completed';
  submitted_at?: string | null;
  completed_at?: string | null;
}

export interface ActivityItem {
  id: number;
  activity_group_id: number;
  title: string;
  cover_image?: string | null;
  primary_type: 'image' | 'video' | 'none';
  media_provider?: 'local' | 'youtube' | 'drive' | null;
  media_url?: string | null;
  content?: string | null;
  submission_type: 'none' | 'text' | 'pdf' | 'video' | 'image';
  sort_order: number;
  resources?: ActivityItemResource[];
  submissions?: ActivityItemSubmission[];
  created_at?: string;
  updated_at?: string;
}

export interface ActivityGroupUserAssignment {
  id: number;
  activity_group_id: number;
  user_id: number;
  assigned_by?: number | null;
  assigned_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  status: 'assigned' | 'in_progress' | 'completed';
  user?: {
    id: number;
    name: string;
    email: string;
    role?: string;
    photo?: string;
  };
  assigner?: {
    id: number;
    name: string;
  };
}

export interface ActivityGroup {
  id: number;
  white_label_id?: number | null;
  agency_id?: number | null;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  main_image?: string | null;
  status: 'active' | 'inactive' | 'draft';
  created_by?: number | null;
  activities_count?: number;
  assignments_count?: number;
  activities?: ActivityItem[];
  assignments?: ActivityGroupUserAssignment[];
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  whiteLabel?: {
    id: number;
    name: string;
  };
  agency?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface MyActivityAssignment {
  assignment_id: number;
  group: ActivityGroup;
  assigned_at?: string;
  status: 'assigned' | 'in_progress' | 'completed';
  completed_activities: number;
  total_activities: number;
  progress_percentage: number;
}

export interface StudentActivityProgressItem {
  assignment_id: number;
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
    photo?: string;
  };
  assigned_at?: string;
  status: string;
  completed_activities: number;
  total_activities: number;
  progress_percentage: number;
}

export interface StudentActivityDetailProgressResponse {
  student: {
    id: number;
    name: string;
    email: string;
  };
  group: {
    id: number;
    title: string;
  };
  activities: {
    activity_id: number;
    title: string;
    submission_type: string;
    is_completed: boolean;
    submission?: ActivityItemSubmission | null;
  }[];
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
