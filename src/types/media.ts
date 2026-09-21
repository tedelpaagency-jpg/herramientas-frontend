export interface Media {
  id: number;
  white_label_id?: number | null;
  agency_id?: number | null;
  uploaded_by?: number | null;
  original_name: string;
  file_name: string;
  disk: string;
  path: string;
  url: string;
  full_url?: string;
  mime_type?: string | null;
  extension?: string | null;
  size: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  title?: string | null;
  alt_text?: string | null;
  description?: string | null;
  file_type?: 'image' | 'video' | 'document' | 'other';
  created_at?: string;
  updated_at?: string;
  uploader?: { id: number; name: string; email: string } | null;
  white_label?: { id: number; name: string } | null;
  agency?: { id: number; name: string } | null;
}

export interface MediaTenantContext {
  white_label_id?: number | null;
  agency_id?: number | null;
  is_global: boolean;
  authorized_wl_ids?: number[] | null;
  authorized_agency_ids?: number[] | null;
}

export interface MediaContextResponse {
  tenant_context: MediaTenantContext;
  white_labels: Array<{ id: number; name: string }>;
  agencies: Array<{ id: number; white_label_id?: number; name: string }>;
}
