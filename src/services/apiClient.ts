import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Resolución dinámica del API Base URL según entorno y dominio actual
export const getApiBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (process.env.VITE_API_URL) return process.env.VITE_API_URL;
  }
  
  try {
    const metaEnv = (import.meta as any).env || {};
    if (metaEnv.NEXT_PUBLIC_API_URL) return metaEnv.NEXT_PUBLIC_API_URL;
    if (metaEnv.VITE_API_URL) return metaEnv.VITE_API_URL;
  } catch (e) {
    // Ignore error if import.meta is undefined in Next.js SSR
  }

  // Si estamos en un navegador, determinar la URL de la API dinámicamente
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, protocol } = window.location;
    
    // Si la aplicación se ejecuta localmente en localhost o 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:8000/api`;
    }

    return `${window.location.origin}/api`;
  }

  return 'http://127.0.0.1:8000/api';
};

export const normalizeFileUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  const apiBase = getApiBaseUrl().replace(/\/api$/, '');

  if (url.startsWith('/storage')) {
    return `${apiBase}${url}`;
  }

  if (url.includes('/storage/')) {
    const pathAfterStorage = url.substring(url.indexOf('/storage/'));
    return `${apiBase}${pathAfterStorage}`;
  }

  return url;
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Interceptor de Petición: Inyectar Bearer token y el Header dinámico X-Domain
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Inyectar Token de Autenticación Sanctum si existe en localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('santun_auth_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Inyectar dinámicamente el Dominio Actual del Navegador (X-Domain) para resolución de Agencia
    if (typeof window !== 'undefined' && window.location?.hostname && config.headers) {
      config.headers['X-Domain'] = window.location.hostname;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejo Centralizado de Errores HTTP
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('santun_auth_token');
          localStorage.removeItem('santun_user');
          if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/contract/show')) {
            window.location.href = '/login?expired=1';
          }
        }
      } else if (status === 403) {
        console.error('Acceso prohibido (403): No posee permisos para esta acción.');
      } else if (status === 404) {
        console.warn('Recurso no encontrado (404).');
      } else if (status === 422) {
        console.warn('Error de validación (422):', error.response.data);
      } else if (status >= 500) {
        console.error('Error interno del servidor (500).', error.response.data);
      }
    } else if (error.request) {
      console.error('Sin respuesta del servidor de Laravel. Verifique la conexión o la URL base:', getApiBaseUrl());
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
