import apiClient from './apiClient';
import { Product } from '../types';

export const productService = {
  getPublicCatalog: async (): Promise<Product[]> => {
    const response = await apiClient.get('/v1/products/public');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getProducts: async (params?: Record<string, any>): Promise<Product[]> => {
    const response = await apiClient.get('/v1/products', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/v1/products/${id}`);
    return response.data?.data || response.data;
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post('/v1/products', data);
    return response.data?.data || response.data;
  },

  updateProduct: async (id: number, data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put(`/v1/products/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/products/${id}`);
  },
};

export default productService;
