import apiClient from './apiClient';

export interface SearchClientResult {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  document_number?: string | null;
  city?: string | null;
  classification?: string | null;
  agency_name?: string | null;
  workspace_id?: number | null;
  workspace_name?: string | null;
  workspace_color?: string | null;
  stage_name?: string | null;
  assigned_user_name?: string | null;
}

export interface SearchWorkspaceResult {
  id: number;
  name: string;
  description?: string | null;
  color?: string | null;
  agency_name?: string | null;
  clients_count?: number;
  meta_enabled?: boolean;
}

export interface GlobalSearchResponse {
  query: string;
  clients: SearchClientResult[];
  workspaces: SearchWorkspaceResult[];
}

export const searchService = {
  async globalSearch(query: string, signal?: AbortSignal): Promise<GlobalSearchResponse> {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return { query: trimmed, clients: [], workspaces: [] };
    }

    try {
      const response = await apiClient.get('/v1/search/global', {
        params: { q: trimmed },
        signal,
      });

      return response.data?.data || { query: trimmed, clients: [], workspaces: [] };
    } catch (err: any) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') {
        throw err;
      }
      console.error('Error fetching global search:', err);
      return { query: trimmed, clients: [], workspaces: [] };
    }
  },
};

export default searchService;
