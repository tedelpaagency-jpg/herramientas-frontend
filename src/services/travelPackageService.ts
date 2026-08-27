import apiClient from './apiClient';
import { 
  AgentPackage, 
  SupplierPackage, 
  AdminPackage, 
  AgentTravelRequest, 
  SupplierTravelRequest, 
  AdminTravelRequest 
} from '../types/travelPackage';

export const travelPackageService = {
  // --- AGENT POS ENDPOINTS ---
  getCatalog: async (params?: { search?: string; destination?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get('/v1/travel-packages/catalog', { params });
    return response.data;
  },

  submitCheckoutRequest: async (data: {
    items: Array<{
      travel_package_id: number;
      travelers_count: number;
      travel_date_start?: string;
      travel_date_end?: string;
    }>;
    payment_proof: File;
  }) => {
    const formData = new FormData();
    data.items.forEach((item, index) => {
      formData.append(`items[${index}][travel_package_id]`, item.travel_package_id.toString());
      formData.append(`items[${index}][travelers_count]`, item.travelers_count.toString());
      if (item.travel_date_start) {
        formData.append(`items[${index}][travel_date_start]`, item.travel_date_start);
      }
      if (item.travel_date_end) {
        formData.append(`items[${index}][travel_date_end]`, item.travel_date_end);
      }
    });
    formData.append('payment_proof', data.payment_proof);

    const response = await apiClient.post('/v1/travel-package-requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAgentRequests: async (params?: { status?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get('/v1/agent/travel-package-requests', { params });
    return response.data;
  },

  // --- SUPPLIER ENDPOINTS ---
  getSupplierPackages: async (params?: { search?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get('/v1/supplier/travel-packages', { params });
    return response.data;
  },

  createSupplierPackage: async (data: {
    title: string;
    description?: string;
    destination: string;
    duration: string;
    available_dates_start?: string;
    available_dates_end?: string;
    supplier_price: number;
    main_image?: File | null;
    status?: 'active' | 'inactive';
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('destination', data.destination);
    formData.append('duration', data.duration);
    if (data.available_dates_start) formData.append('available_dates_start', data.available_dates_start);
    if (data.available_dates_end) formData.append('available_dates_end', data.available_dates_end);
    formData.append('supplier_price', data.supplier_price.toString());
    if (data.status) formData.append('status', data.status);
    if (data.main_image) formData.append('main_image', data.main_image);

    const response = await apiClient.post('/v1/supplier/travel-packages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateSupplierPackage: async (id: number, data: {
    title: string;
    description?: string;
    destination: string;
    duration: string;
    available_dates_start?: string;
    available_dates_end?: string;
    supplier_price: number;
    main_image?: File | null;
    status?: 'active' | 'inactive';
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('destination', data.destination);
    formData.append('duration', data.duration);
    if (data.available_dates_start) formData.append('available_dates_start', data.available_dates_start);
    if (data.available_dates_end) formData.append('available_dates_end', data.available_dates_end);
    formData.append('supplier_price', data.supplier_price.toString());
    if (data.status) formData.append('status', data.status);
    if (data.main_image) formData.append('main_image', data.main_image);

    const response = await apiClient.post(`/v1/supplier/travel-packages/${id}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  togglePackageStatus: async (id: number) => {
    const response = await apiClient.post(`/v1/supplier/travel-packages/${id}/status`);
    return response.data;
  },

  getSupplierRequests: async (params?: { status?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get('/v1/supplier/travel-package-requests', { params });
    return response.data;
  },

  approveSupplierRequest: async (id: number, comment?: string) => {
    const response = await apiClient.post(`/v1/supplier/travel-package-requests/${id}/approve`, { comment });
    return response.data;
  },

  rejectSupplierRequest: async (id: number, rejection_reason: string) => {
    const response = await apiClient.post(`/v1/supplier/travel-package-requests/${id}/reject`, { rejection_reason });
    return response.data;
  },

  // --- SUPER ADMIN ENDPOINTS ---
  getAdminPackages: async (params?: { search?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get('/v1/admin/travel-packages', { params });
    return response.data;
  },

  setAdminPackagePricing: async (id: number, additional_price: number) => {
    const response = await apiClient.post(`/v1/admin/travel-packages/${id}/pricing`, { additional_price });
    return response.data;
  },

  getAdminRequests: async (params?: { status?: string; page?: number; per_page?: number }) => {
    const response = await apiClient.get('/v1/admin/travel-package-requests', { params });
    return response.data;
  },

  uploadSupplierPaymentProof: async (id: number, file: File, comment?: string) => {
    const formData = new FormData();
    formData.append('supplier_payment_proof', file);
    if (comment) formData.append('comment', comment);

    const response = await apiClient.post(`/v1/admin/travel-package-requests/${id}/upload-supplier-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default travelPackageService;
