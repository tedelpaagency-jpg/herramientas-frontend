import apiClient from './apiClient';
import { TravelReport } from '../types';

export const travelReportService = {
  getTravelReports: async (): Promise<TravelReport[]> => {
    const response = await apiClient.get('/v1/travel-reports');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  createTravelReport: async (data: Partial<TravelReport>): Promise<TravelReport> => {
    const response = await apiClient.post('/v1/travel-reports', data);
    return response.data?.data || response.data;
  },
};

export default travelReportService;
