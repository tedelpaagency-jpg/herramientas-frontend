'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import DashboardPage from '@/views/DashboardPage';
import { useAuth } from '@/context/AuthContext';
import publicInmobiliariaService, { PublicAgencyConfig } from '@/services/publicInmobiliariaService';
import PublicInmobiliariaHomeView from '@/views/inmobiliaria/PublicInmobiliariaHomeView';

export default function HomeClientView() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [portalStatus, setPortalStatus] = useState<'checking' | 'enabled' | 'disabled'>('checking');
  const [portalConfig, setPortalConfig] = useState<PublicAgencyConfig | null>(null);
  const [resolvedDomain, setResolvedDomain] = useState<string | undefined>(undefined);

  const isHunter =
    user?.role === 'hunter' ||
    user?.role === 'comercio' ||
    user?.role === 'store' ||
    user?.roles?.some((r: any) => ['hunter', 'comercio', 'store'].includes(r.name));

  useEffect(() => {
    let active = true;

    const checkDomainRouting = async () => {
      if (typeof window === 'undefined') return;

      const hostname = window.location.hostname.toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const forceDashboard = searchParams.get('dashboard') === '1';
      const forcePortal = searchParams.get('portal') === '1';
      const queryDomain = searchParams.get('domain');

      if (forceDashboard) {
        if (active) setPortalStatus('disabled');
        return;
      }

      const isCrmOnlyHost =
        !forcePortal &&
        !queryDomain &&
        (hostname.includes('tedelpa.com') || hostname.startsWith('portal.'));

      if (isCrmOnlyHost) {
        if (active) setPortalStatus('disabled');
        return;
      }

      // On localhost without ?portal=1 or ?domain=, if user is already logged into CRM, show CRM dashboard
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
      if (isLocal && !forcePortal && !queryDomain && isAuthenticated) {
        if (active) setPortalStatus('disabled');
        return;
      }

      const targetDomain = queryDomain || (isLocal ? 'inmosoft.pro' : hostname);

      // 1. Check if this domain has the Public Real Estate Portal enabled
      try {
        const res = await publicInmobiliariaService.getConfig(targetDomain);
        if (!active) return;

        if (res?.data && res.data.frontend_enabled && !res.data.redirect_to_login) {
          setPortalConfig(res.data);
          setResolvedDomain(targetDomain);
          setPortalStatus('enabled');
          return;
        }
      } catch {
        // Not an active inmobiliaria domain or frontend_enabled is false
      }

      // 2. Check if this domain is a custom landing page domain
      if (!isLocal && hostname) {
        try {
          const { default: landingService } = await import('@/services/landingService');
          const data = await landingService.lookupDomain(hostname);
          if (data && data.redirect_url) {
            const currentSearch = window.location.search;
            let target = data.redirect_url;
            if (currentSearch) {
              target += (target.includes('?') ? '&' : '?') + currentSearch.replace(/^\?/, '');
            }
            window.location.replace(target);
            return;
          }
        } catch {
          // Not a custom landing domain, ignore
        }
      }

      if (active) {
        setPortalStatus('disabled');
      }
    };

    if (!authLoading) {
      checkDomainRouting();
    }

    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (portalStatus === 'disabled' && isHunter) {
      router.replace('/hunter');
    }
  }, [portalStatus, isHunter, router]);

  if (portalStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse">
            Cargando sitio...
          </p>
        </div>
      </div>
    );
  }

  if (portalStatus === 'enabled') {
    return (
      <Suspense fallback={null}>
        <PublicInmobiliariaHomeView
          initialConfig={portalConfig}
          domainOverride={resolvedDomain}
        />
      </Suspense>
    );
  }

  if (isHunter) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <DashboardPage />
      </Layout>
    </ProtectedRoute>
  );
}

