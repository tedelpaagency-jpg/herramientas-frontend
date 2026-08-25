import apiClient from './apiClient';
import { Product } from '../types';

const extractArrayData = (response: any): Product[] => {
  const resData = response.data?.data || response.data;
  if (Array.isArray(resData)) {
    return resData;
  }
  if (resData && Array.isArray(resData.data)) {
    return resData.data;
  }
  return [];
};

export const productService = {
  getPublicCatalog: async (): Promise<Product[]> => {
    const response = await apiClient.get('/v1/products/public');
    return extractArrayData(response);
  },

  getProducts: async (params?: Record<string, any>): Promise<Product[]> => {
    const response = await apiClient.get('/v1/products', { params });
    return extractArrayData(response);
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

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/v1/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.url || response.data?.data?.url || response.data?.data?.path || '';
  },

  uploadMultipleImages: async (files: FileList | File[]): Promise<string[]> => {
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('files[]', f));
    const response = await apiClient.post('/v1/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (Array.isArray(response.data?.urls) && response.data.urls.length > 0) {
      return response.data.urls;
    }
    if (Array.isArray(response.data?.data)) {
      return response.data.data.map((d: any) => d.url || d.path || d);
    }
    const singleUrl = response.data?.url || response.data?.data?.url;
    return singleUrl ? [singleUrl] : [];
  },
};

export default productService;
