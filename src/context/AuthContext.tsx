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
  useBranding(currentWhiteLabel, user?.agency || currentAgency, user);

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

        const isSuperAdminUser = res.user.role === 'super_admin' || res.user.roles?.some((r: any) => r.name === 'super_admin');

        if (isSuperAdminUser) {
          // Super Admin manages all white labels globally; preserve active selected white label if present in state or localStorage
          const savedWl = localStorage.getItem('santun_white_label');
          if (savedWl) {
            try {
              const parsedWl = JSON.parse(savedWl);
              setCurrentWhiteLabel(parsedWl);
            } catch (e) {
              // fallback
            }
          }
        } else {
          if ((res.user as any).agency) {
            setCurrentAgency((res.user as any).agency);
          }
          if ((res.user as any).white_labels && (res.user as any).white_labels.length > 0) {
            const wl = (res.user as any).white_labels[0];
            setCurrentWhiteLabel(wl);
            localStorage.setItem('santun_white_label', JSON.stringify(wl));
          } else if ((res.user as any).agency?.white_label) {
            const wl = (res.user as any).agency.white_label;
            setCurrentWhiteLabel(wl);
            localStorage.setItem('santun_white_label', JSON.stringify(wl));
          }
        }
      }
    } catch (err) {
      console.error('Error al actualizar sesión de usuario:', err);
      setUser(null);
      setToken(null);
      localStorage.removeItem('santun_auth_token');
      localStorage.removeItem('santun_user');
      localStorage.removeItem('santun_impersonator');
      localStorage.removeItem('santun_original_token');
      localStorage.removeItem('santun_original_user');
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

          const isSuperAdminUser = parsedUser.role === 'super_admin' || parsedUser.roles?.some((r: any) => r.name === 'super_admin');

          if (isSuperAdminUser) {
            setCurrentWhiteLabel(null);
            setCurrentAgency(null);
          } else {
            if (parsedUser.agency) {
              setCurrentAgency(parsedUser.agency);
            }
            if (parsedUser.white_labels && parsedUser.white_labels.length > 0) {
              setCurrentWhiteLabel(parsedUser.white_labels[0]);
            } else if (parsedUser.agency?.white_label) {
              setCurrentWhiteLabel(parsedUser.agency.white_label);
            } else {
              const savedWl = localStorage.getItem('santun_white_label');
              if (savedWl) {
                try { setCurrentWhiteLabel(JSON.parse(savedWl)); } catch (e) {}
              }
            }
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

      const isSuperAdminUser = res.user.role === 'super_admin' || res.user.roles?.some((r: any) => r.name === 'super_admin');
      if (isSuperAdminUser) {
        setCurrentWhiteLabel(null);
        setCurrentAgency(null);
      } else {
        if ((res.user as any).agency) {
          setCurrentAgency((res.user as any).agency);
        }
        if ((res.user as any).white_labels && (res.user as any).white_labels.length > 0) {
          setCurrentWhiteLabel((res.user as any).white_labels[0]);
        }
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
      localStorage.removeItem('santun_original_token');
      localStorage.removeItem('santun_original_user');
      setIsLoading(false);
    }
  };

  const startImpersonation = (newToken: string, targetUser: any, fromUser: any) => {
    // Preserve original super_admin token and user before switching token
    if (token && !localStorage.getItem('santun_original_token')) {
      localStorage.setItem('santun_original_token', token);
    }
    if (user && !localStorage.getItem('santun_original_user')) {
      localStorage.setItem('santun_original_user', JSON.stringify(user));
    }

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

    const targetWl = targetUser.white_labels?.[0] || targetUser.whiteLabels?.[0] || targetUser.agency?.white_label;
    if (targetWl) {
      setCurrentWhiteLabel(targetWl);
      localStorage.setItem('santun_white_label', JSON.stringify(targetWl));
    } else {
      setCurrentWhiteLabel(null);
    }
  };

  const stopImpersonation = async () => {
    setIsLoading(true);
    try {
      await whiteLabelService.stopImpersonate();
    } catch (e) {
      console.error('Error stopping impersonation:', e);
    } finally {
      const originalToken = localStorage.getItem('santun_original_token');
      const originalUser = localStorage.getItem('santun_original_user');

      if (originalToken && originalUser) {
        const parsedOriginalUser = JSON.parse(originalUser);
        setToken(originalToken);
        setUser(parsedOriginalUser);
        localStorage.setItem('santun_auth_token', originalToken);
        localStorage.setItem('santun_user', originalUser);
      }

      localStorage.removeItem('santun_original_token');
      localStorage.removeItem('santun_original_user');
      localStorage.removeItem('santun_impersonator');
      localStorage.removeItem('santun_white_label');

      setIsImpersonating(false);
      setImpersonatingFrom(null);
      setCurrentWhiteLabel(null);
      setCurrentAgency(null);

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
