import apiClient from './apiClient';
import { Product, PosSaleRequest } from '../types';

export const posService = {
  getCatalog: async (): Promise<Product[]> => {
    const response = await apiClient.get('/v1/pos/catalog');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  processSale: async (saleData: PosSaleRequest): Promise<{ message: string; sale_id?: number }> => {
    const response = await apiClient.post('/v1/pos/sales', saleData);
    return response.data;
  },
};

export default posService;
