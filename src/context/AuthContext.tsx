'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  effectivePermissions: string[];
  dashboardType: 'super_admin' | 'white_label_admin' | 'agency_admin' | 'agent';
  hasPermission: (permission?: string | string[]) => boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserSession: (userData: Partial<User>) => void;
  startImpersonation: (token: string, user: any, impersonatingFrom: any) => void;
  stopImpersonation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const checkHasActivePortal = (user?: any, agency?: any): boolean => {
  if (typeof window === 'undefined') return false;

  // 1. Flag de la agencia en sesión o parámetro
  const effectiveAgency = agency || user?.agency;
  if (
    effectiveAgency?.frontend_enabled === true ||
    effectiveAgency?.frontend_enabled === 1 ||
    effectiveAgency?.frontend_enabled === 'true' ||
    effectiveAgency?.frontend_enabled === '1'
  ) {
    return true;
  }

  // 2. Revisar el usuario guardado en localStorage
  try {
    const savedUserStr = localStorage.getItem('santun_user');
    if (savedUserStr) {
      const parsed = JSON.parse(savedUserStr);
      const savedAg = parsed?.agency;
      if (
        savedAg?.frontend_enabled === true ||
        savedAg?.frontend_enabled === 1 ||
        savedAg?.frontend_enabled === 'true' ||
        savedAg?.frontend_enabled === '1'
      ) {
        return true;
      }
    }
  } catch {}

  // 3. Revisar configuraciones cacheadas del portal inmobiliario
  try {
    const hostname = window.location.hostname.toLowerCase();
    const keysToCheck = [
      `inmo_cfg_${hostname}`,
      'inmo_cfg_generic',
      'inmo_cfg_inmosoft.pro',
      'inmo_cfg_default',
    ];
    for (const key of keysToCheck) {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (raw) {
        const cfg = JSON.parse(raw);
        if (cfg?.frontend_enabled && !cfg?.redirect_to_login) {
          return true;
        }
      }
    }
  } catch {}

  // 4. Si es un dominio personalizado de agencia (no es tedelpa.com ni subdominio portal.)
  const hostname = window.location.hostname.toLowerCase();
  const isCrmOnly = hostname.includes('tedelpa.com') || hostname.startsWith('portal.');
  if (!isCrmOnly && hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return true;
  }

  return false;
};

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

  const updateUserSession = useCallback((userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('santun_user', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  }, []);

  useEffect(() => {
    let hasSavedSession = false;
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('santun_user');
      const savedToken = localStorage.getItem('santun_auth_token');
      const savedImpersonator = localStorage.getItem('santun_impersonator');

      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if ((parsedUser as any)?.permission_version !== 4) {
            delete (parsedUser as any).effective_permissions;
          }
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

  const login = async (email: string, password: string, remember?: boolean) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password, remember);
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
          const wl = (res.user as any).white_labels[0];
          setCurrentWhiteLabel(wl);
          localStorage.setItem('santun_white_label', JSON.stringify(wl));
        } else if ((res.user as any).agency?.white_label) {
          const wl = (res.user as any).agency.white_label;
          setCurrentWhiteLabel(wl);
          localStorage.setItem('santun_white_label', JSON.stringify(wl));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    // Detectar si el usuario o dominio actual tiene un portal público activo antes de limpiar el estado
    const hasActivePortal = checkHasActivePortal(user, currentAgency);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('santun_logging_out', '1');
      if (hasActivePortal) {
        sessionStorage.setItem('santun_logout_to_frontend', '1');
      }
    }

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
      localStorage.removeItem('santun_white_label');
      localStorage.removeItem('santun_impersonator');
      localStorage.removeItem('santun_original_token');
      localStorage.removeItem('santun_original_user');
      setIsLoading(false);

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('santun_logging_out');
        sessionStorage.removeItem('santun_logout_to_frontend');

        // Si tiene portal activo, redirigir al frontend (/), sino al login
        if (hasActivePortal) {
          window.location.href = '/';
        } else {
          window.location.href = '/login';
        }
      }
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

  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
  const isWhiteLabelAdmin = !isSuperAdmin && (user?.role === 'white_label_admin' || (user as any)?.dashboard_type === 'white_label_admin' || user?.roles?.some((r: any) => r.name === 'white_label_admin'));

  const dashboardType: 'super_admin' | 'white_label_admin' | 'agency_admin' | 'agent' = (() => {
    if (isSuperAdmin) return 'super_admin';
    if ((user as any)?.dashboard_type) return (user as any).dashboard_type;
    if (user?.role === 'white_label_admin') return 'white_label_admin';
    if (['admin', 'agency_admin', 'gerente_comercial', 'gerente'].includes(user?.role || '')) return 'agency_admin';
    return 'agent';
  })();

  const effectivePermissions: string[] = useMemo(() => {
    if (isSuperAdmin) return ['*'];

    // Lockout: If subscription is expired, no operational permissions are available
    if ((user as any)?.subscription?.is_expired) {
      return [];
    }

    let basePerms: string[] = [];
    if (Array.isArray((user as any)?.effective_permissions)) {
      basePerms = [...(user as any).effective_permissions];
    } else {
      // Fallback only if effective_permissions was not provided
      const wl = (user as any)?.white_label || (user as any)?.white_labels?.[0] || currentWhiteLabel;
      const wlSub = wl?.current_subscription || wl?.currentSubscription;
      const wlPlan = wlSub?.status === 'active' ? wlSub?.plan : (wl?.plan || null);

      const agency = (user as any)?.agency || (user as any)?.agency_data || currentAgency;
      const sub = agency?.current_subscription || agency?.currentSubscription;
      const plan = sub?.status === 'active' ? sub?.plan : (agency?.plan || wlPlan || null);
      const planPerms = Array.isArray(plan?.plan_permissions || plan?.planPermissions || plan?.permissions)
        ? (plan?.plan_permissions || plan?.planPermissions || plan?.permissions)
        : [];
      const extractedPlanPerms = planPerms.map((p: any) => (typeof p === 'string' ? p : p?.permission || p?.name || '').toLowerCase().trim()).filter(Boolean);

      if (dashboardType === 'agency_admin' || dashboardType === 'white_label_admin') {
        basePerms = extractedPlanPerms;
      } else {
        const directPerms = (user?.permissions || []).map((p: any) => (typeof p === 'string' ? p : p?.name || '').toLowerCase().trim());
        basePerms = directPerms.filter((p: string) => extractedPlanPerms.includes(p));
      }
    }

    // Macro expansions for fast client-side rendering
    const macroExpanded = [...basePerms];
    if (basePerms.some((p) => p.startsWith('landings') || p === 'view_landings' || p === 'manage_landings')) {
      macroExpanded.push('landings.view', 'landings.create', 'landings.edit', 'landings.delete', 'landings', 'view_landings', 'manage_landings');
    }
    if (basePerms.some((p) => p.startsWith('workspaces') || p === 'view_crm' || p === 'manage_crm')) {
      macroExpanded.push('workspaces.view', 'workspaces.create', 'workspaces.edit', 'workspaces.delete', 'workspaces', 'crm.view', 'view_crm', 'manage_crm');
    }
    if (basePerms.some((p) => p.startsWith('estates') || p === 'view_estates' || p === 'manage_estates')) {
      macroExpanded.push('estates.view', 'estates.create', 'estates.edit', 'estates.delete', 'view_estates', 'manage_estates');
    }
    if (basePerms.some((p) => p.startsWith('portal_inmobiliario'))) {
      macroExpanded.push('portal_inmobiliario', 'portal_inmobiliario.view', 'portal_inmobiliario.manage');
    }
    if (basePerms.some((p) => p.startsWith('lexvault') || p === 'view_lexvault' || p === 'manage_lexvault' || p.startsWith('contracts'))) {
      macroExpanded.push('lexvault.view', 'lexvault.create', 'lexvault.edit', 'lexvault.delete', 'view_lexvault', 'manage_lexvault', 'view_contracts', 'contracts.view');
    }
    if (basePerms.some((p) => p === 'custom_agency_branding' || p.startsWith('branding.'))) {
      macroExpanded.push('custom_agency_branding', 'branding.view', 'branding.manage');
    }
    if (basePerms.some((p) => p.startsWith('visas') || p === 'view_visas' || p === 'manage_visas')) {
      macroExpanded.push(
        'view_visas',
        'manage_visas',
        'visas.view',
        'visas.create',
        'visas.edit',
        'visas.delete',
        'visas.processes.manage',
        'visas.stages.manage',
        'visas.settings.manage',
        'visas.forms.view',
        'visas.forms.edit',
        'visas.documents.view',
        'visas.documents.download',
        'visas.timeline.view',
        'visas.requests.manage',
        'visas.groups.manage'
      );
    }
    if (basePerms.some((p) => p.startsWith('campaigns') || p.startsWith('marketing') || p === 'email_marketing' || p === 'view_email_marketing')) {
      macroExpanded.push(
        'email_marketing',
        'view_email_marketing',
        'campaigns.view',
        'campaigns.create',
        'campaigns.edit',
        'campaigns.delete',
        'marketing.view',
        'marketing.create',
        'marketing.edit',
        'marketing.delete',
        'marketing_b2b',
        'marketing_b2b.manage',
        'marketing_b2b.view',
        'marketing_b2b.generate',
        'marketing_b2b.download'
      );
    }
    if (basePerms.some((p) => p.startsWith('pos') || p === 'view_pos' || p === 'manage_pos')) {
      macroExpanded.push('view_pos', 'manage_pos', 'pos.view', 'view_products');
    }
    if (basePerms.some((p) => p.startsWith('hunter') || p === 'view_hunter')) {
      macroExpanded.push('view_hunter', 'hunter.view', 'hunter');
    }
    if (basePerms.some((p) => (p.startsWith('activities') && p !== 'activities.my_view') || p === 'manage_activities' || p === 'view_activities')) {
      macroExpanded.push('activities.view', 'activities.create', 'activities.update', 'activities.delete', 'activities.assign', 'activities.resources', 'activities.progress');
    }
    if (basePerms.some((p) => (p.startsWith('courses') && p !== 'courses.my_view') || p === 'manage_courses' || p === 'view_courses')) {
      macroExpanded.push('courses.view', 'courses.create', 'courses.edit', 'courses.update', 'courses.delete', 'courses.assign', 'courses.resources');
    }
    if (basePerms.some((p) => p.startsWith('roles') || p === 'manage_roles' || p.startsWith('permission_groups'))) {
      macroExpanded.push('roles.manage', 'manage_roles', 'roles.view', 'view_roles', 'roles', 'permission_groups.view', 'permission_groups.create', 'permission_groups.edit', 'permission_groups.delete', 'permission_groups.manage');
    }
    basePerms = Array.from(new Set(macroExpanded));

    if (isWhiteLabelAdmin) {
      const wlAdminDefaults = [
        'manage_plans',
        'manage_agencies',
        'manage_users',
        'custom_agency_branding',
        'manage_subscriptions',
        'plans.view',
        'plans.create',
        'plans.edit',
        'activities.view',
        'activities.create',
        'activities.update',
        'marketing_b2b',
        'marketing_b2b.manage',
        'marketing_b2b.view',
        'marketing_b2b.generate',
        'marketing_b2b.download',
        'marketing',
        'marketing.view',
        'email_marketing',
        'view_email_marketing',
      ];
      basePerms = Array.from(new Set([...basePerms, ...wlAdminDefaults]));
    } else {
      // Security: Strip White Label administrative permissions from agency users
      const disallowed = [
        'manage_agencies',
        'manage_plans',
        'manage_subscriptions',
        'plans.view',
        'plans.create',
        'plans.edit',
        'plans.delete',
      ];
      basePerms = basePerms.filter((p) => !disallowed.includes(p));
    }

    return basePerms;
  }, [isSuperAdmin, user, currentAgency, isWhiteLabelAdmin, dashboardType]);

  // Pre-compiled Set for instant O(1) lookup performance
  const permissionsSet = useMemo(() => {
    const set = new Set<string>();
    effectivePermissions.forEach((p) => {
      if (p) set.add(p.toLowerCase().trim());
    });
    return set;
  }, [effectivePermissions]);

  const hasPermission = useCallback((permission?: string | string[]): boolean => {
    if (!permission) return true;
    if (isSuperAdmin || permissionsSet.has('*')) return true;

    if (isWhiteLabelAdmin) {
      const wlAdminPerms = [
        'manage_plans',
        'manage_agencies',
        'manage_users',
        'custom_agency_branding',
        'manage_subscriptions',
        'plans.view',
        'plans.create',
        'plans.edit',
        'activities.view',
        'activities.create',
        'activities.update',
        'marketing_b2b',
        'marketing_b2b.manage',
        'marketing_b2b.view',
        'marketing_b2b.generate',
        'marketing_b2b.download',
        'marketing',
        'marketing.view',
        'email_marketing',
        'view_email_marketing',
      ];
      const reqList = Array.isArray(permission) ? permission : [permission];
      if (reqList.some((r) => wlAdminPerms.includes(r.toLowerCase().trim()))) {
        return true;
      }
    }

    const reqList = Array.isArray(permission) ? permission : [permission];
    return reqList.some((req) => permissionsSet.has(req.toLowerCase().trim()));
  }, [isSuperAdmin, isWhiteLabelAdmin, permissionsSet]);

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
        effectivePermissions,
        dashboardType,
        hasPermission,
        login,
        logout,
        refreshUser,
        updateUserSession,
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
