'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import PublicPortalLoader from './PublicPortalLoader';
import { getCachedAgencyConfig } from '@/services/publicInmobiliariaService';

function PortalNavigationListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // Escuchar clics en enlaces para anticipar la transición de ruta
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignorar enlaces externos, hashes, anclas o target="_blank"
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        target.target === '_blank' ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return;
      }

      // Si es una ruta interna del portal inmobiliario
      const isPortalRoute =
        href === '/' ||
        href.startsWith('/properties') ||
        href.startsWith('/travel-agency-03') ||
        href.startsWith('/services') ||
        href.startsWith('/about') ||
        href.startsWith('/contact');

      if (isPortalRoute && href !== pathname) {
        setIsNavigating(true);
      }
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });
    return () => document.removeEventListener('click', handleAnchorClick, { capture: true });
  }, [pathname]);

  // Al finalizar la transición de ruta (pathname o searchParams cambian), desvanecer el loader
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, isNavigating]);

  if (!isNavigating) return null;

  const cachedAgency = typeof window !== 'undefined' ? getCachedAgencyConfig() : undefined;

  return (
    <PublicPortalLoader
      isOpen={true}
      duration={350}
      agency={cachedAgency}
      brandColor={cachedAgency?.primary_color}
    />
  );
}

export const PortalNavigationLoader: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <PortalNavigationListener />
    </Suspense>
  );
};

export default PortalNavigationLoader;
