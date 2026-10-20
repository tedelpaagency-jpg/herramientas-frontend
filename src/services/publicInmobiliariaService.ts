export interface PublicAgencyConfig {
  id: number;
  name: string;
  commercial_name?: string;
  description?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string | null;
  logo?: string | null;
  logo_2?: string | null;
  logo_icon?: string | null;
  favicon?: string | null;
  banner_image?: string | null;
  hero_title?: string;
  hero_subtitle?: string;
  about_title?: string;
  about_text?: string;
  cta_text?: string;
  primary_color?: string;
  secondary_color?: string;
  button_color?: string;
  font_family?: string;
  seo_title?: string;
  seo_description?: string;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  domain?: string;
  frontend_theme?: string;
  frontend_enabled: boolean;
  currency?: string;
  properties_count?: number;
  is_inmosoft?: boolean;
  redirect_to_login?: boolean;
  portal_url?: string;
}

export interface PublicEstateItem {
  id: number;
  agency_id: number;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  address?: string;
  full_address?: string;
  city?: string;
  province?: string;
  country?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  price: number;
  property_type: number;
  property_status: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  garage?: number;
  featured?: number | boolean;
  image?: string | null;
  images?: Array<string | { id?: number; image_path?: string; url?: string }>;
  agency?: {
    id: number;
    name: string;
    logo?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
  };
  [key: string]: any;
}

export interface PublicEstateCategory {
  id: number;
  name: string;
  slug?: string;
  count: number;
  image?: string;
}

export interface PublicEstateCity {
  city: string;
  province?: string;
  count: number;
  image?: string;
}

export interface PublicPaginatedEstates {
  current_page: number;
  data: PublicEstateItem[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface PublicEstateFilterParams {
  domain?: string;
  search?: string;
  property_status?: string | number;
  property_type?: string | number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  price_min?: string | number;
  price_max?: string | number;
  size_min?: string | number;
  city?: string;
  sort?: 'recent' | 'price_asc' | 'price_desc' | 'featured';
  page?: number;
  per_page?: number;
}

const getApiBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  return 'https://santun.tedelpa.com/api';
};

export const resolveEffectiveDomain = (explicitDomain?: string): string => {
  if (explicitDomain && explicitDomain.trim()) {
    return explicitDomain
      .trim()
      .replace(/^https?:\/\//i, '')
      .split('/')[0]
      .split(':')[0]
      .toLowerCase();
  }
  if (typeof window !== 'undefined' && window.location) {
    const params = new URLSearchParams(window.location.search);
    const queryDomain = params.get('domain');
    if (queryDomain && queryDomain.trim()) {
      return queryDomain
        .trim()
        .replace(/^https?:\/\//i, '')
        .split('/')[0]
        .split(':')[0]
        .toLowerCase();
    }
    const host = window.location.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'inmosoft.pro';
    }
    return host;
  }
  return 'inmosoft.pro';
};

async function fetchPublicApi<T>(endpoint: string, domain?: string): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const effectiveDomain = resolveEffectiveDomain(domain);
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Domain': effectiveDomain,
    },
    cache: 'no-store',
  });

  const json = await res.json();
  if (!res.ok) {
    const error: any = new Error(json?.message || `Error HTTP ${res.status}`);
    error.status = res.status;
    error.code = json?.code;
    error.data = json?.data;
    throw error;
  }
  return json;
}

export const publicInmobiliariaService = {
  getConfig: async (domain?: string): Promise<{ status: string; data: PublicAgencyConfig }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    return fetchPublicApi<{ status: string; data: PublicAgencyConfig }>(
      `/v1/public/inmobiliaria/config?domain=${encodeURIComponent(effectiveDomain)}`,
      effectiveDomain
    );
  },

  getFeaturedEstates: async (domain?: string, limit: number = 6): Promise<{ status: string; data: PublicEstateItem[] }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    return fetchPublicApi<{ status: string; data: PublicEstateItem[] }>(
      `/v1/public/estates/featured?domain=${encodeURIComponent(effectiveDomain)}&limit=${limit}`,
      effectiveDomain
    );
  },

  getRecentEstates: async (domain?: string, limit: number = 6): Promise<{ status: string; data: PublicEstateItem[] }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    return fetchPublicApi<{ status: string; data: PublicEstateItem[] }>(
      `/v1/public/estates/recent?domain=${encodeURIComponent(effectiveDomain)}&limit=${limit}`,
      effectiveDomain
    );
  },

  getCategories: async (domain?: string): Promise<{ status: string; data: PublicEstateCategory[] }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    return fetchPublicApi<{ status: string; data: PublicEstateCategory[] }>(
      `/v1/public/categories?domain=${encodeURIComponent(effectiveDomain)}`,
      effectiveDomain
    );
  },

  getCities: async (domain?: string): Promise<{ status: string; data: PublicEstateCity[] }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    return fetchPublicApi<{ status: string; data: PublicEstateCity[] }>(
      `/v1/public/cities?domain=${encodeURIComponent(effectiveDomain)}`,
      effectiveDomain
    );
  },

  getEstates: async (params: PublicEstateFilterParams = {}): Promise<{ status: string; data: PublicPaginatedEstates }> => {
    const effectiveDomain = resolveEffectiveDomain(params.domain);
    const searchParams = new URLSearchParams();
    searchParams.set('domain', effectiveDomain);

    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'domain' && value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });

    return fetchPublicApi<{ status: string; data: PublicPaginatedEstates }>(
      `/v1/public/estates?${searchParams.toString()}`,
      effectiveDomain
    );
  },

  getEstateBySlug: async (
    slug: string,
    domain?: string
  ): Promise<{ status: string; data: { estate: PublicEstateItem; related: PublicEstateItem[] } }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    return fetchPublicApi<{ status: string; data: { estate: PublicEstateItem; related: PublicEstateItem[] } }>(
      `/v1/public/estates/${encodeURIComponent(slug)}?domain=${encodeURIComponent(effectiveDomain)}`,
      effectiveDomain
    );
  },
};

export default publicInmobiliariaService;

