import apiClient from './apiClient';
import { SpinWheel, SpinResult } from '../types';

export const spinWheelService = {
  getSpinWheels: async (): Promise<SpinWheel[]> => {
    const response = await apiClient.get('/v1/spin-wheels');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  spin: async (rouletteId: number): Promise<SpinResult> => {
    const response = await apiClient.post(`/v1/spin-wheels/${rouletteId}/spin`);
    return response.data;
  },
};

export default spinWheelService;
