'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import DashboardPage from '@/views/DashboardPage';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const isHunter =
    user?.role === 'hunter' ||
    user?.role === 'comercio' ||
    user?.role === 'store' ||
    user?.roles?.some((r: any) => ['hunter', 'comercio', 'store'].includes(r.name));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.toLowerCase();
      const isPlatformHost =
        ['localhost', '127.0.0.1'].includes(hostname) ||
        hostname.includes('tedelpa.com') ||
        hostname.startsWith('portal.');

      if (!isPlatformHost && hostname) {
        import('@/services/landingService').then(({ default: landingService }) => {
          landingService
            .lookupDomain(hostname)
            .then((data) => {
              if (data && data.redirect_url) {
                const currentSearch = window.location.search;
                let target = data.redirect_url;
                if (currentSearch) {
                  target += (target.includes('?') ? '&' : '?') + currentSearch.replace(/^\?/, '');
                }
                window.location.replace(target);
              }
            })
            .catch(() => {
              // Not a custom landing domain, ignore
            });
        });
      }
    }

    if (isHunter) {
      router.replace('/hunter');
    }
  }, [isHunter, router]);

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
