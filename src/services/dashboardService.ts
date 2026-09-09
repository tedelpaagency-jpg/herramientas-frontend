import apiClient from './apiClient';

export interface DashboardMetric {
  [key: string]: any;
}

export interface DashboardWidget {
  key: string;
  title: string;
  permission: string;
  data: Record<string, any>;
}

export interface DashboardSummaryResponse {
  dashboard_type: 'super_admin' | 'white_label_admin' | 'agency_admin' | 'agent';
  plan?: {
    id: number;
    name: string;
    description?: string;
    billing_type?: string;
  } | null;
  white_label?: {
    id: number;
    name: string;
    slug?: string;
  } | null;
  agency?: {
    id: number;
    name: string;
    email?: string;
  } | null;
  effective_permissions: string[];
  metrics: Record<string, any>;
  widgets: DashboardWidget[];
  recent_agencies?: any[];
  recent_activity?: any[];
  recent?: Record<string, any[]>;
  message?: string;
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const response = await apiClient.get<DashboardSummaryResponse>('/v1/dashboard/summary');
    return response.data;
  },
};

export default dashboardService;
