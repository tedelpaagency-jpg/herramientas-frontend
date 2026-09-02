'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { WhiteLabel } from '../types/whiteLabel';
import authService from '../services/authService';
import whiteLabelService from '../services/whiteLabelService';
import useBranding from '../hooks/useBranding';

interface AuthContextType {
  user: User | null;
  token: string | null;
  currentWhiteLabel: WhiteLabel | null;
  setCurrentWhiteLabel: (wl: WhiteLabel | null) => void;
  currentAgency: any | null;
  setCurrentAgency: (agency: any | null) => void;
  isImpersonating: boolean;
  impersonatingFrom: { id: number; name: string; email: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  startImpersonation: (token: string, user: any, impersonatingFrom: any) => void;
  stopImpersonation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentWhiteLabel, setCurrentWhiteLabel] = useState<WhiteLabel | null>(null);
  const [currentAgency, setCurrentAgency] = useState<any | null>(null);
  const [isImpersonating, setIsImpersonating] = useState<boolean>(false);
  const [impersonatingFrom, setImpersonatingFrom] = useState<{ id: number; name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Apply branding dynamically
  useBranding(currentWhiteLabel, user?.agency || currentAgency);

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

        if ((res.user as any).agency) {
          setCurrentAgency((res.user as any).agency);
        }
        if ((res.user as any).white_labels && (res.user as any).white_labels.length > 0) {
          setCurrentWhiteLabel((res.user as any).white_labels[0]);
        }
      }
    } catch (err) {
      console.error('Error al actualizar sesión de usuario:', err);
      setUser(null);
      setToken(null);
      localStorage.removeItem('santun_auth_token');
      localStorage.removeItem('santun_user');
      localStorage.removeItem('santun_impersonator');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let hasSavedSession = false;
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('santun_user');
      const savedToken = localStorage.getItem('santun_auth_token');
      const savedImpersonator = localStorage.getItem('santun_impersonator');

      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setToken(savedToken);
          if (parsedUser.agency) {
            setCurrentAgency(parsedUser.agency);
          }
          if (parsedUser.white_labels && parsedUser.white_labels.length > 0) {
            setCurrentWhiteLabel(parsedUser.white_labels[0]);
          }

          if (savedImpersonator) {
            setIsImpersonating(true);
            setImpersonatingFrom(JSON.parse(savedImpersonator));
          }

          setIsLoading(false);
          hasSavedSession = true;
        } catch (e) {
          console.error('Error al deserializar sesión:', e);
        }
      }
    }
    
    refreshUser().finally(() => {
      if (!hasSavedSession) {
        setIsLoading(false);
      }
    });
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('santun_auth_token', res.token);
      localStorage.setItem('santun_user', JSON.stringify(res.user));

      if ((res.user as any).agency) {
        setCurrentAgency((res.user as any).agency);
      }
      if ((res.user as any).white_labels && (res.user as any).white_labels.length > 0) {
        setCurrentWhiteLabel((res.user as any).white_labels[0]);
      }
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
      setCurrentWhiteLabel(null);
      setCurrentAgency(null);
      setIsImpersonating(false);
      setImpersonatingFrom(null);
      localStorage.removeItem('santun_auth_token');
      localStorage.removeItem('santun_user');
      localStorage.removeItem('santun_impersonator');
      setIsLoading(false);
    }
  };

  const startImpersonation = (newToken: string, targetUser: any, fromUser: any) => {
    setToken(newToken);
    setUser(targetUser);
    setIsImpersonating(true);
    setImpersonatingFrom(fromUser);

    localStorage.setItem('santun_auth_token', newToken);
    localStorage.setItem('santun_user', JSON.stringify(targetUser));
    localStorage.setItem('santun_impersonator', JSON.stringify(fromUser));

    if (targetUser.agency) {
      setCurrentAgency(targetUser.agency);
    }
    if (targetUser.white_labels && targetUser.white_labels.length > 0) {
      setCurrentWhiteLabel(targetUser.white_labels[0]);
    }
  };

  const stopImpersonation = async () => {
    setIsLoading(true);
    try {
      await whiteLabelService.stopImpersonate();
    } catch (e) {
      console.error('Error stopping impersonation:', e);
    } finally {
      setIsImpersonating(false);
      setImpersonatingFrom(null);
      localStorage.removeItem('santun_impersonator');
      await refreshUser();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        currentWhiteLabel,
        setCurrentWhiteLabel,
        currentAgency,
        setCurrentAgency,
        isImpersonating,
        impersonatingFrom,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshUser,
        startImpersonation,
        stopImpersonation,
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
