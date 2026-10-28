import apiClient from './apiClient';

export interface EstateCountryItem {
  id: number;
  white_label_id?: number | null;
  name: string;
  code?: string | null;
  image?: string | null;
  status: boolean;
  order: number;
  cities?: EstateCityItem[];
}

export interface EstateCityItem {
  id: number;
  white_label_id?: number | null;
  country_id?: number | null;
  name: string;
  province?: string | null;
  image?: string | null;
  status: boolean;
  order: number;
  country?: EstateCountryItem;
}

export interface EstateCategoryItem {
  id: number;
  white_label_id?: number | null;
  name: string;
  slug?: string | null;
  icon?: string | null;
  property_type?: number | null;
  image?: string | null;
  status: boolean;
  order: number;
}

export interface EstateCatalogData {
  white_label_id: number;
  countries: EstateCountryItem[];
  cities: EstateCityItem[];
  categories: EstateCategoryItem[];
}

export const estateCatalogService = {
  getCatalog: async (whiteLabelId?: number): Promise<EstateCatalogData> => {
    const res = await apiClient.get('/v1/estate-catalog/all', {
      params: whiteLabelId ? { white_label_id: whiteLabelId } : {},
    });
    return res.data?.data;
  },

  seedDefaults: async (whiteLabelId?: number): Promise<EstateCatalogData> => {
    const res = await apiClient.post('/v1/estate-catalog/seed-defaults', {
      white_label_id: whiteLabelId,
    });
    return res.data?.data;
  },

  // Países
  createCountry: async (data: FormData | Record<string, any>): Promise<EstateCountryItem> => {
    const res = await apiClient.post('/v1/estate-catalog/countries', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data?.data;
  },

  updateCountry: async (id: number, data: FormData | Record<string, any>): Promise<EstateCountryItem> => {
    const res = await apiClient.post(`/v1/estate-catalog/countries/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data?.data;
  },

  deleteCountry: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/estate-catalog/countries/${id}`);
  },

  toggleCountryStatus: async (id: number): Promise<EstateCountryItem> => {
    const res = await apiClient.patch(`/v1/estate-catalog/countries/${id}/toggle-status`);
    return res.data?.data;
  },

  // Ciudades
  createCity: async (data: FormData | Record<string, any>): Promise<EstateCityItem> => {
    const res = await apiClient.post('/v1/estate-catalog/cities', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data?.data;
  },

  updateCity: async (id: number, data: FormData | Record<string, any>): Promise<EstateCityItem> => {
    const res = await apiClient.post(`/v1/estate-catalog/cities/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data?.data;
  },

  deleteCity: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/estate-catalog/cities/${id}`);
  },

  toggleCityStatus: async (id: number): Promise<EstateCityItem> => {
    const res = await apiClient.patch(`/v1/estate-catalog/cities/${id}/toggle-status`);
    return res.data?.data;
  },

  // Categorías
  createCategory: async (data: FormData | Record<string, any>): Promise<EstateCategoryItem> => {
    const res = await apiClient.post('/v1/estate-catalog/categories', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data?.data;
  },

  updateCategory: async (id: number, data: FormData | Record<string, any>): Promise<EstateCategoryItem> => {
    const res = await apiClient.post(`/v1/estate-catalog/categories/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data?.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/estate-catalog/categories/${id}`);
  },

  toggleCategoryStatus: async (id: number): Promise<EstateCategoryItem> => {
    const res = await apiClient.patch(`/v1/estate-catalog/categories/${id}/toggle-status`);
    return res.data?.data;
  },
};

export default estateCatalogService;
