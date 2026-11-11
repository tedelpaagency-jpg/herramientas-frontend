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
  country?: string;
  country_name?: string;
  country_code?: string;
  country_image?: string;
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
  show_topbar?: boolean;
  loader_duration?: number;
  filter_settings?: {
    booking?: {
      tabs?: boolean;
      location?: boolean;
      operation?: boolean;
      property_type?: boolean;
      price?: boolean;
    };
    properties_list?: {
      search?: boolean;
      city?: boolean;
      operation?: boolean;
      property_type?: boolean;
      bedrooms?: boolean;
      bathrooms?: boolean;
      parking?: boolean;
      price?: boolean;
      size?: boolean;
      sort?: boolean;
    };
    admin?: {
      search?: boolean;
      category?: boolean;
      status?: boolean;
      agent?: boolean;
      agency?: boolean;
    };
  };
  details?: Record<string, any>;
  agents?: Array<{
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    photo?: string | null;
    role?: string | null;
  }>;
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

export interface PublicPortalHomeData {
  config: PublicAgencyConfig;
  recommended: PublicEstateItem[];
  featured: PublicEstateItem[];
  recent: PublicEstateItem[];
  categories: PublicEstateCategory[];
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
  name?: string;
  search?: string;
  property_status?: string | number;
  property_type?: string | number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  parking?: string | number;
  price_min?: string | number;
  price_max?: string | number;
  size_min?: string | number;
  size_max?: string | number;
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

export const getCachedAgencyConfig = (domain?: string): PublicAgencyConfig | null => {
  if (typeof window === 'undefined') return null;
  try {
    const key = `inmo_cfg_${resolveEffectiveDomain(domain)}`;
    const saved = localStorage.getItem(key) || sessionStorage.getItem(key) || localStorage.getItem('inmo_cfg_generic');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return null;
};

export const getCachedBrandColor = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('inmo_cached_brand_color') || null;
  } catch {}
  return null;
};

export const getCachedLoaderImage = (domain?: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const domainKey = `inmo_cached_loader_img_${effectiveDomain}`;
    const specific = localStorage.getItem(domainKey);
    if (specific && !specific.includes('unsplash.com')) return specific;

    const generic = localStorage.getItem('inmo_cached_loader_img');
    if (generic && !generic.includes('unsplash.com')) return generic;

    const cfg = getCachedAgencyConfig(domain);
    const fromCfg = cfg?.details?.loader_image || (cfg as any)?.loader_image;
    if (fromCfg && !fromCfg.includes('unsplash.com')) return fromCfg;
  } catch {}
  return null;
};

export const clearCachedLoaderImage = (domain?: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const effectiveDomain = resolveEffectiveDomain(domain);
    localStorage.removeItem('inmo_cached_loader_img');
    if (effectiveDomain) {
      localStorage.removeItem(`inmo_cached_loader_img_${effectiveDomain}`);
    }
  } catch {}
};

export const setCachedLoaderImage = (url: string, domain?: string): void => {
  if (typeof window === 'undefined' || !url || url.includes('unsplash.com')) return;
  try {
    const effectiveDomain = resolveEffectiveDomain(domain);
    localStorage.setItem('inmo_cached_loader_img', url);
    if (effectiveDomain) {
      localStorage.setItem(`inmo_cached_loader_img_${effectiveDomain}`, url);
    }
    const pre = new Image();
    pre.src = url;
  } catch {}
};

interface ClientCacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, ClientCacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();
const CLIENT_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes TTL

export function getClientCache<T>(key: string): T | null {
  const mem = memoryCache.get(key);
  const now = Date.now();
  if (mem && (now - mem.timestamp) < CLIENT_CACHE_TTL_MS) {
    return mem.data;
  }
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const parsed: ClientCacheEntry<T> = JSON.parse(raw);
        if (now - parsed.timestamp < CLIENT_CACHE_TTL_MS) {
          memoryCache.set(key, parsed);
          return parsed.data;
        }
      }
    } catch {}
  }
  return null;
}

export function setClientCache<T>(key: string, data: T): void {
  const entry: ClientCacheEntry<T> = { data, timestamp: Date.now() };
  memoryCache.set(key, entry);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(key, JSON.stringify(entry));
    } catch {}
  }
}

export function clearClientCache(pattern?: string): void {
  if (pattern) {
    for (const k of Array.from(memoryCache.keys())) {
      if (k.includes(pattern)) memoryCache.delete(k);
    }
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i);
          if (k && k.includes(pattern)) keysToRemove.push(k);
        }
        keysToRemove.forEach((k) => sessionStorage.removeItem(k));
      } catch {}
    }
  } else {
    memoryCache.clear();
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.clear();
      } catch {}
    }
  }
}

export const clearCachedAgencyConfig = (domain?: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const key = `inmo_cfg_${resolveEffectiveDomain(domain)}`;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    clearCachedLoaderImage(domain);
    clearClientCache(resolveEffectiveDomain(domain));
  } catch {}
};

export const publicInmobiliariaService = {
  getHomeData: async (domain?: string): Promise<{ status: string; data: PublicPortalHomeData }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const cacheKey = `inmo_client_home_${effectiveDomain}`;

    const cached = getClientCache<{ status: string; data: PublicPortalHomeData }>(cacheKey);
    if (cached) {
      return cached;
    }

    const dedupeKey = `req_home_${effectiveDomain}`;
    if (inFlightRequests.has(dedupeKey)) {
      return inFlightRequests.get(dedupeKey);
    }

    const requestPromise = (async () => {
      try {
        const res = await fetchPublicApi<{ status: string; data: PublicPortalHomeData }>(
          `/v1/public/portal/home-data?domain=${encodeURIComponent(effectiveDomain)}`,
          effectiveDomain
        );
        if (res?.data) {
          setClientCache(cacheKey, res);
          if (res.data.config) {
            setClientCache(`inmo_client_cfg_${effectiveDomain}`, { status: 'success', data: res.data.config });
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(`inmo_cfg_${effectiveDomain}`, JSON.stringify(res.data.config));
                localStorage.setItem('inmo_cfg_generic', JSON.stringify(res.data.config));
                if (res.data.config.primary_color) {
                  localStorage.setItem('inmo_cached_brand_color', res.data.config.primary_color);
                }
                const loaderImg = res.data.config.details?.loader_image || (res.data.config as any)?.loader_image;
                if (loaderImg && !loaderImg.includes('unsplash.com')) {
                  setCachedLoaderImage(loaderImg, effectiveDomain);
                } else {
                  clearCachedLoaderImage(effectiveDomain);
                }
              } catch {}
            }
          }
          if (res.data.recommended) {
            setClientCache(`inmo_client_rec_${effectiveDomain}_32`, { status: 'success', data: res.data.recommended });
          }
          if (res.data.featured) {
            setClientCache(`inmo_client_feat_${effectiveDomain}_8`, { status: 'success', data: res.data.featured });
          }
          if (res.data.recent) {
            setClientCache(`inmo_client_recent_${effectiveDomain}_8`, { status: 'success', data: res.data.recent });
          }
          if (res.data.categories) {
            setClientCache(`inmo_client_cats_${effectiveDomain}`, { status: 'success', data: res.data.categories });
          }
        }
        return res;
      } finally {
        inFlightRequests.delete(dedupeKey);
      }
    })();

    inFlightRequests.set(dedupeKey, requestPromise);
    return requestPromise;
  },

  getConfig: async (domain?: string): Promise<{ status: string; data: PublicAgencyConfig }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const cacheKey = `inmo_client_cfg_${effectiveDomain}`;

    const cached = getClientCache<{ status: string; data: PublicAgencyConfig }>(cacheKey);
    if (cached) {
      return cached;
    }

    const dedupeKey = `req_cfg_${effectiveDomain}`;
    if (inFlightRequests.has(dedupeKey)) {
      return inFlightRequests.get(dedupeKey);
    }

    const requestPromise = (async () => {
      try {
        const res = await fetchPublicApi<{ status: string; data: PublicAgencyConfig }>(
          `/v1/public/inmobiliaria/config?domain=${encodeURIComponent(effectiveDomain)}`,
          effectiveDomain
        );
        if (res?.data) {
          setClientCache(cacheKey, res);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(`inmo_cfg_${effectiveDomain}`, JSON.stringify(res.data));
              localStorage.setItem('inmo_cfg_generic', JSON.stringify(res.data));
              if (res.data.primary_color) {
                localStorage.setItem('inmo_cached_brand_color', res.data.primary_color);
              }
              const loaderImg = res.data.details?.loader_image || (res.data as any)?.loader_image;
              if (loaderImg && !loaderImg.includes('unsplash.com')) {
                setCachedLoaderImage(loaderImg, effectiveDomain);
              } else {
                clearCachedLoaderImage(effectiveDomain);
              }
            } catch {}
          }
        }
        return res;
      } finally {
        inFlightRequests.delete(dedupeKey);
      }
    })();

    inFlightRequests.set(dedupeKey, requestPromise);
    return requestPromise;
  },

  getFeaturedEstates: async (domain?: string, limit: number = 8): Promise<{ status: string; data: PublicEstateItem[] }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const cacheKey = `inmo_client_feat_${effectiveDomain}_${limit}`;

    const cached = getClientCache<{ status: string; data: PublicEstateItem[] }>(cacheKey);
    if (cached) {
      return cached;
    }

    const res = await fetchPublicApi<{ status: string; data: PublicEstateItem[] }>(
      `/v1/public/estates/featured?domain=${encodeURIComponent(effectiveDomain)}&limit=${limit}`,
      effectiveDomain
    );
    if (res?.data) {
      setClientCache(cacheKey, res);
    }
    return res;
  },

  getRecommendedEstates: async (domain?: string, limit: number = 32): Promise<{ status: string; data: PublicEstateItem[] }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const cacheKey = `inmo_client_rec_${effectiveDomain}_${limit}`;

    const cached = getClientCache<{ status: string; data: PublicEstateItem[] }>(cacheKey);
    if (cached) {
      return cached;
    }

    const res = await fetchPublicApi<{ status: string; data: PublicEstateItem[] }>(
      `/v1/public/estates/recommended?domain=${encodeURIComponent(effectiveDomain)}&limit=${limit}`,
      effectiveDomain
    );
    if (res?.data) {
      setClientCache(cacheKey, res);
    }
    return res;
  },

  getRecentEstates: async (domain?: string, limit: number = 8): Promise<{ status: string; data: PublicEstateItem[] }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const cacheKey = `inmo_client_recent_${effectiveDomain}_${limit}`;

    const cached = getClientCache<{ status: string; data: PublicEstateItem[] }>(cacheKey);
    if (cached) {
      return cached;
    }

    const res = await fetchPublicApi<{ status: string; data: PublicEstateItem[] }>(
      `/v1/public/estates/recent?domain=${encodeURIComponent(effectiveDomain)}&limit=${limit}`,
      effectiveDomain
    );
    if (res?.data) {
      setClientCache(cacheKey, res);
    }
    return res;
  },

  getCategories: async (domain?: string): Promise<{ status: string; data: PublicEstateCategory[] }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const cacheKey = `inmo_client_cats_${effectiveDomain}`;

    const cached = getClientCache<{ status: string; data: PublicEstateCategory[] }>(cacheKey);
    if (cached) {
      return cached;
    }

    const res = await fetchPublicApi<{ status: string; data: PublicEstateCategory[] }>(
      `/v1/public/categories?domain=${encodeURIComponent(effectiveDomain)}`,
      effectiveDomain
    );
    if (res?.data) {
      setClientCache(cacheKey, res);
    }
    return res;
  },

  getCities: async (domain?: string): Promise<{ status: string; data: PublicEstateCity[] }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const cacheKey = `inmo_client_cities_${effectiveDomain}`;

    const cached = getClientCache<{ status: string; data: PublicEstateCity[] }>(cacheKey);
    if (cached) {
      return cached;
    }

    const res = await fetchPublicApi<{ status: string; data: PublicEstateCity[] }>(
      `/v1/public/cities?domain=${encodeURIComponent(effectiveDomain)}`,
      effectiveDomain
    );
    if (res?.data) {
      setClientCache(cacheKey, res);
    }
    return res;
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

  sendContactMessage: async (
    data: { name: string; email?: string; phone?: string; subject?: string; message: string; estate_id?: number },
    domain?: string
  ): Promise<{ status: string; message: string }> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const apiBase = getApiBaseUrl();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (effectiveDomain) {
      headers['X-Domain'] = effectiveDomain;
    }
    const res = await fetch(`${apiBase}/v1/public/inmobiliaria/contact?domain=${encodeURIComponent(effectiveDomain)}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al enviar el mensaje de contacto');
    }
    return res.json();
  },

  getWhatsAppInfo: async (slugOrId: string | number, domain?: string): Promise<any> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const apiBase = getApiBaseUrl();
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (effectiveDomain) {
      headers['X-Domain'] = effectiveDomain;
    }
    const res = await fetch(`${apiBase}/v1/public/estates/${encodeURIComponent(slugOrId)}/whatsapp?domain=${encodeURIComponent(effectiveDomain)}`, {
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al obtener información de la propiedad');
    }
    const json = await res.json();
    return json?.data || json;
  },

  downloadPdf: async (slugOrId: string | number, domain?: string, fileNameSlug?: string): Promise<void> => {
    const effectiveDomain = resolveEffectiveDomain(domain);
    const apiBase = getApiBaseUrl();
    const headers: Record<string, string> = {
      Accept: 'application/pdf',
    };
    if (effectiveDomain) {
      headers['X-Domain'] = effectiveDomain;
    }
    const res = await fetch(`${apiBase}/v1/public/estates/${encodeURIComponent(slugOrId)}/pdf?domain=${encodeURIComponent(effectiveDomain)}`, {
      headers,
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || 'Error al generar el PDF de la propiedad');
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha-propiedad-${fileNameSlug || slugOrId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};

export default publicInmobiliariaService;

