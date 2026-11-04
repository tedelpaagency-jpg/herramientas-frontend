import apiClient from './apiClient';

export interface GoogleSheetsGlobalSettings {
  is_enabled: boolean;
  service_account_email: string | null;
  has_credentials: boolean;
  connection_status: 'connected' | 'error' | 'disconnected';
  last_validated_at: string | null;
  last_error: string | null;
}

export interface AgencyGoogleSheetsConfigData {
  id?: number;
  agency_id: number;
  is_enabled: boolean;
  sheet_url: string | null;
  spreadsheet_id: string | null;
  sheet_name: string;
  connection_status: 'valid' | 'error' | 'pending' | 'unauthorized';
  last_synced_at: string | null;
  last_updated_at: string | null;
  last_result: string | null;
  last_error: string | null;
}

export interface GoogleSheetsSyncLogItem {
  id: number;
  agency_id: number;
  estate_id: number | null;
  operation: string;
  status: 'success' | 'error' | 'warning';
  attempts: number;
  message: string;
  details?: any;
  created_at: string;
  estate?: {
    id: number;
    title: string;
    slug?: string;
  };
}

export interface AgencyGoogleSheetsResponse {
  config: AgencyGoogleSheetsConfigData;
  global: {
    is_enabled: boolean;
    has_credentials: boolean;
    service_account_email: string | null;
  };
  stats: {
    total_estates: number;
    synced_estates: number;
    error_estates: number;
  };
}

export const googleSheetsService = {
  // Super Admin Global Settings
  getGlobalSettings: async (): Promise<GoogleSheetsGlobalSettings> => {
    const response = await apiClient.get('/v1/admin/google-sheets/settings');
    return response.data?.data || response.data;
  },

  updateGlobalSettings: async (data: {
    is_enabled?: boolean;
    service_account_email?: string;
    service_account_json?: string;
  }): Promise<{ message: string; data: GoogleSheetsGlobalSettings }> => {
    const response = await apiClient.post('/v1/admin/google-sheets/settings', data);
    return response.data;
  },

  testGlobalConnection: async (data?: { service_account_json?: string }): Promise<{
    status: string;
    message: string;
    connection_status: 'connected' | 'error';
    last_validated_at: string;
  }> => {
    const response = await apiClient.post('/v1/admin/google-sheets/test-connection', data || {});
    return response.data;
  },

  // Per Agency Multi-tenant Management
  getAgencyConfig: async (agencyId: number): Promise<AgencyGoogleSheetsResponse> => {
    const response = await apiClient.get(`/v1/agencies/${agencyId}/google-sheets`);
    return response.data?.data || response.data;
  },

  updateAgencyConfig: async (
    agencyId: number,
    data: {
      is_enabled?: boolean;
      sheet_url?: string;
      sheet_name?: string;
    }
  ): Promise<any> => {
    const response = await apiClient.post(`/v1/agencies/${agencyId}/google-sheets`, data);
    return response.data;
  },

  validateAgencyDocument: async (agencyId: number): Promise<{
    status: string;
    message: string;
    data?: {
      spreadsheet_title: string;
      sheet_name: string;
      connection_status: string;
    };
  }> => {
    const response = await apiClient.post(`/v1/agencies/${agencyId}/google-sheets/validate`);
    return response.data;
  },

  syncAllAgencyEstates: async (agencyId: number): Promise<{
    status: string;
    message: string;
    count: number;
  }> => {
    const response = await apiClient.post(`/v1/agencies/${agencyId}/google-sheets/sync-all`);
    return response.data;
  },

  getAgencyLogs: async (agencyId: number): Promise<GoogleSheetsSyncLogItem[]> => {
    const response = await apiClient.get(`/v1/agencies/${agencyId}/google-sheets/logs`);
    return response.data?.data || [];
  },
};

export default googleSheetsService;

