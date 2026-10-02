import apiClient from './apiClient';
import { User } from '../types';

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string, remember?: boolean): Promise<LoginResponse> => {
    const payload: { email: string; password: string; remember?: boolean } = { email, password };
    if (typeof remember === 'boolean') {
      payload.remember = remember;
    }
    const response = await apiClient.post('/v1/login', payload);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post('/v1/logout');
      return response.data;
    } finally {
      localStorage.removeItem('santun_auth_token');
      localStorage.removeItem('santun_user');
    }
  },

  me: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/v1/me');
    return response.data;
  },
};

export default authService;
