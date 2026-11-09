'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import DashboardPage from '@/views/DashboardPage';
import { useAuth } from '@/context/AuthContext';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  getCachedAgencyConfig,
  getCachedLoaderImage,
} from '@/services/publicInmobiliariaService';
import PublicInmobiliariaHomeView from '@/views/inmobiliaria/PublicInmobiliariaHomeView';
import PublicPortalLoader from '@/components/inmobiliaria/PublicPortalLoader';

export default function HomeClientView() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [portalConfig, setPortalConfig] = useState<PublicAgencyConfig | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = getCachedAgencyConfig();
      if (cached && cached.frontend_enabled) return cached;
    }
    return null;
  });

  const [portalStatus, setPortalStatus] = useState<'checking' | 'enabled' | 'disabled'>(() => {
    if (typeof window !== 'undefined') {
      const cached = getCachedAgencyConfig();
      if (cached && cached.frontend_enabled && !cached.redirect_to_login) {
        return 'enabled';
      }
      const hostname = window.location.hostname.toLowerCase();
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('inmosoft') || hostname.includes('immobillis')) {
        return 'enabled';
      }
    }
    return 'enabled';
  });

  const [resolvedDomain, setResolvedDomain] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      const cached = getCachedAgencyConfig();
      if (cached?.domain) return cached.domain;
    }
    return undefined;
  });

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
    if (portalStatus === 'enabled' && portalConfig) {
      const cfg = portalConfig as any;
      const rawName =
        cfg?.name ||
        cfg?.agency_name ||
        cfg?.commercial_name ||
        cfg?.trade_name;
      if (rawName && typeof document !== 'undefined') {
        document.title = `${rawName} - Inicio`;
      }
    }
  }, [portalStatus, portalConfig]);

  useEffect(() => {
    if (portalStatus === 'disabled' && isHunter) {
      router.replace('/hunter');
    }
  }, [portalStatus, isHunter, router]);

  if (portalStatus === 'checking') {
    const cachedLoaderImg = typeof window !== 'undefined' ? getCachedLoaderImage() : undefined;
    const cachedAgency = typeof window !== 'undefined' ? getCachedAgencyConfig() : undefined;
    return (
      <div className="min-h-screen relative bg-slate-100 flex items-center justify-center">
        <PublicPortalLoader
          isOpen={true}
          countryName={cachedAgency?.country_name || "ECUADOR"}
          countryImage={cachedLoaderImg || cachedAgency?.details?.loader_image || undefined}
          brandColor={cachedAgency?.primary_color}
          duration={cachedAgency?.details?.loader_duration ?? (cachedAgency as any)?.loader_duration}
          agency={cachedAgency}
        />
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

