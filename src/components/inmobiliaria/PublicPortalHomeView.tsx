'use client';

import React, { useEffect, useState, useMemo } from 'react';
import BlogV4 from '@/components/blog/BlogV4';
import DestinationSectionV4 from '@/components/destination-section/DestinationSectionV4';
import TravelPackageV4 from '@/components/travel-package-section/TravelPackageV4';
import FeaturedEstatesSection from '@/components/featured-section/FeaturedEstatesSection';
import HeroV4 from '@/components/hero-section/HeroV4';
import Footer from '@/components/layout/Footer';
import Header2Style3 from '@/components/layout/Header2Style3';
import CookieConsentBanner from '@/components/inmobiliaria/CookieConsentBanner';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import BrandingThemeInjector from '@/components/inmobiliaria/BrandingThemeInjector';
import PublicPortalLoader from '@/components/inmobiliaria/PublicPortalLoader';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateItem,
  PublicEstateCategory,
  getCachedAgencyConfig,
  getCachedLoaderImage,
} from '@/services/publicInmobiliariaService';
import {
  DEFAULT_FALLBACK_AGENCY,
  DEFAULT_REAL_ESTATE_CATEGORIES,
  DEFAULT_REAL_ESTATE_PROPERTIES,
} from '@/constants/realEstateDefaults';

export interface PublicPortalHomeViewProps {
  initialAgency?: PublicAgencyConfig | null;
  initialRecommendedEstates?: PublicEstateItem[];
  initialFeaturedEstates?: PublicEstateItem[];
  initialRecentEstates?: PublicEstateItem[];
  initialCategories?: PublicEstateCategory[];
  domain?: string;
}

const DEFAULT_SECTIONS_ORDER = ['categories', 'recommended', 'featured', 'recent'];

export default function PublicPortalHomeView({
  initialAgency,
  initialRecommendedEstates,
  initialFeaturedEstates,
  initialRecentEstates,
  initialCategories,
  domain,
}: PublicPortalHomeViewProps) {
  const [agency, setAgency] = useState<PublicAgencyConfig>(() => {
    if (initialAgency) return initialAgency;
    if (typeof window !== 'undefined') {
      const cached = getCachedAgencyConfig(domain);
      if (cached) return cached;
    }
    return DEFAULT_FALLBACK_AGENCY;
  });

  const [recommendedEstates, setRecommendedEstates] = useState<PublicEstateItem[]>(
    initialRecommendedEstates || []
  );
  const [featuredEstates, setFeaturedEstates] = useState<PublicEstateItem[]>(
    initialFeaturedEstates || []
  );
  const [recentEstates, setRecentEstates] = useState<PublicEstateItem[]>(
    initialRecentEstates || []
  );
  const [categories, setCategories] = useState<PublicEstateCategory[]>(
    initialCategories || DEFAULT_REAL_ESTATE_CATEGORIES
  );
  const [loading, setLoading] = useState<boolean>(
    !initialAgency || !initialCategories || initialCategories.length === 0
  );

  useEffect(() => {
    const rawAgency = agency as any;
    const rawName = rawAgency?.name || rawAgency?.agency_name || rawAgency?.commercial_name || rawAgency?.trade_name;
    if (rawName && typeof document !== 'undefined') {
      document.title = `${rawName} - Inicio`;
    }
  }, [agency]);

  useEffect(() => {
    let isMounted = true;

    // Load instantly from local storage cache if not already loaded
    if (typeof window !== 'undefined' && !agency?.name) {
      const cached = getCachedAgencyConfig(domain);
      if (cached && isMounted) {
        setAgency(cached);
      }
    }

    async function loadPortalData() {
      try {
        const hostname =
          domain ||
          (typeof window !== 'undefined' ? window.location.hostname : '');

        const [configRes, recRes, featRes, recentRes, catsRes] = await Promise.allSettled([
          publicInmobiliariaService.getConfig(hostname),
          publicInmobiliariaService.getRecommendedEstates(hostname, 32),
          publicInmobiliariaService.getFeaturedEstates(hostname, 8),
          publicInmobiliariaService.getRecentEstates(hostname, 8),
          publicInmobiliariaService.getCategories(hostname),
        ]);

        if (!isMounted) return;

        if (configRes.status === 'fulfilled' && configRes.value?.data) {
          setAgency(configRes.value.data);
        }

        if (recRes.status === 'fulfilled' && Array.isArray(recRes.value?.data)) {
          setRecommendedEstates(recRes.value.data);
        }

        if (featRes.status === 'fulfilled' && Array.isArray(featRes.value?.data)) {
          setFeaturedEstates(featRes.value.data);
        }

        if (recentRes.status === 'fulfilled' && Array.isArray(recentRes.value?.data)) {
          setRecentEstates(recentRes.value.data);
        }

        if (catsRes.status === 'fulfilled' && catsRes.value?.data?.length) {
          const backendCats = catsRes.value.data;
          const combined = [...backendCats];
          for (const def of DEFAULT_REAL_ESTATE_CATEGORIES) {
            if (!combined.some((c: any) => c.name?.toLowerCase() === def.name?.toLowerCase() || c.id === def.id || (c.slug && def.slug && c.slug === def.slug))) {
              combined.push(def);
            }
          }
          setCategories(combined);
        } else {
          setCategories(DEFAULT_REAL_ESTATE_CATEGORIES);
        }
      } catch (err) {
        console.warn('Could not load dynamic real estate portal data, using defaults:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPortalData();
    return () => {
      isMounted = false;
    };
  }, [domain]);

  // Orden configurable de las secciones abajo del banner
  const sectionsOrder = useMemo<string[]>(() => {
    const rawOrder = agency?.details?.sections_order;
    if (Array.isArray(rawOrder) && rawOrder.length > 0) {
      const merged = [...rawOrder];
      for (const s of DEFAULT_SECTIONS_ORDER) {
        if (!merged.includes(s)) merged.push(s);
      }
      return merged;
    }
    return DEFAULT_SECTIONS_ORDER;
  }, [agency?.details?.sections_order]);

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'categories':
        return <DestinationSectionV4 key="categories" categories={categories} agency={agency} />;
      case 'recommended':
        return <TravelPackageV4 key="recommended" recommendedEstates={recommendedEstates} agency={agency} />;
      case 'featured':
        return <FeaturedEstatesSection key="featured" featuredEstates={featuredEstates} agency={agency} />;
      case 'recent':
        return <BlogV4 key="recent" recentEstates={recentEstates} agency={agency} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="public-portal-isolated-scope"
      style={{
        backgroundColor: '#ffffff',
        color: '#161a1b',
        minHeight: '100vh',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <BrandingThemeInjector agency={agency} />
      <PublicPortalLoader
        isOpen={loading}
        countryName={agency?.country_name || agency?.country}
        countryImage={agency?.details?.loader_image || (typeof window !== 'undefined' ? getCachedLoaderImage(domain) : null) || agency?.country_image}
        brandColor={agency?.primary_color}
        textColor={agency?.details?.loader_text_color}
        duration={agency?.details?.loader_duration}
        agency={agency}
        message="Un momento por favor, estamos buscando las mejores propiedades."
      />
      <TopbarSlider agency={agency} />
      <Header2Style3 agency={agency} />
      <HeroV4 agency={agency} />

      {/* Secciones Abajo del Banner ordenadas dinámicamente según configuración */}
      {sectionsOrder.map((sectionKey) => renderSection(sectionKey))}

      <Footer agency={agency} />
      <CookieConsentBanner agency={agency} domainParam={domain} />
    </div>
  );
}
