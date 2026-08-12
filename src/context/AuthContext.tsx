'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    if (typeof window === 'undefined' || !localStorage.getItem('santun_auth_token')) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await authService.me();
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('santun_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error('Error al actualizar sesión de usuario:', err);
      setUser(null);
      setToken(null);
      localStorage.removeItem('santun_auth_token');
      localStorage.removeItem('santun_user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('santun_user');
      const savedToken = localStorage.getItem('santun_auth_token');
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
    }
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('santun_auth_token', res.token);
      localStorage.setItem('santun_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Error durante logout:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('santun_auth_token');
      localStorage.removeItem('santun_user');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
