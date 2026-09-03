import apiClient from './apiClient';

export interface ImportPreviewRow {
  index: number;
  moodle_id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  agency_name: string;
  is_suspended: boolean;
  is_deleted: boolean;
  status: 'NUEVO' | 'EXISTENTE' | 'NO_IMPORTABLE' | 'ERROR';
  status_label: string;
  reason: string | null;
  can_import: boolean;
}

export interface ImportSummary {
  total_records: number;
  new_agencies: number;
  existing_users: number;
  deleted_moodle: number;
  error_records: number;
}

export interface ImportValidateResponse {
  status: string;
  white_label: {
    id: number;
    name: string;
  };
  summary: ImportSummary;
  rows: ImportPreviewRow[];
}

export interface ImportExecuteResult {
  status: string;
  message: string;
  import_id: number;
  summary: {
    total_processed: number;
    created_agencies: number;
    created_users: number;
    existing_records: number;
    error_records: number;
  };
  errors: {
    moodle_id: string;
    name: string;
    email: string;
    reason: string;
  }[];
}

export interface ImportHistoryRecord {
  id: number;
  white_label_id: number;
  imported_by: number;
  filename: string;
  total_records: number;
  created_agencies: number;
  created_users: number;
  existing_records: number;
  error_records: number;
  errors_detail?: any[];
  created_at: string;
  imported_by_user?: {
    id: number;
    name: string;
    email: string;
  };
}

export const studentImportService = {
  validateCsv: async (file: File): Promise<ImportValidateResponse> => {
    const formData = new FormData();
    formData.append('csv_file', file);

    const res = await apiClient.post('/v1/white-labels/students/import/validate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  executeImport: async (file: File): Promise<ImportExecuteResult> => {
    const formData = new FormData();
    formData.append('csv_file', file);

    const res = await apiClient.post('/v1/white-labels/students/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getHistory: async (): Promise<{ data: ImportHistoryRecord[] }> => {
    const res = await apiClient.get('/v1/white-labels/students/import/history');
    return res.data?.data || res.data;
  },
};

export default studentImportService;
