'use client';

import React, { useEffect, useState } from 'react';
import BlogV4 from '@/components/blog/BlogV4';
import DestinationSectionV4 from '@/components/destination-section/DestinationSectionV4';
import HeroV4 from '@/components/hero-section/HeroV4';
import Footer from '@/components/layout/Footer';
import Header2Style3 from '@/components/layout/Header2Style3';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import TravelPackageV4 from '@/components/travel-package-section/TravelPackageV4';
import BrandingThemeInjector from '@/components/inmobiliaria/BrandingThemeInjector';
import PublicPortalLoader from '@/components/inmobiliaria/PublicPortalLoader';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateItem,
  PublicEstateCategory,
  getCachedAgencyConfig,
} from '@/services/publicInmobiliariaService';
import {
  DEFAULT_FALLBACK_AGENCY,
  DEFAULT_REAL_ESTATE_CATEGORIES,
  DEFAULT_REAL_ESTATE_PROPERTIES,
} from '@/constants/realEstateDefaults';

export interface PublicPortalHomeViewProps {
  initialAgency?: PublicAgencyConfig | null;
  initialFeaturedEstates?: PublicEstateItem[];
  initialRecentEstates?: PublicEstateItem[];
  initialCategories?: PublicEstateCategory[];
  domain?: string;
}

export default function PublicPortalHomeView({
  initialAgency,
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
  const [featuredEstates, setFeaturedEstates] = useState<PublicEstateItem[]>(
    initialFeaturedEstates || DEFAULT_REAL_ESTATE_PROPERTIES
  );
  const [recentEstates, setRecentEstates] = useState<PublicEstateItem[]>(
    initialRecentEstates || DEFAULT_REAL_ESTATE_PROPERTIES.slice(0, 3)
  );
  const [categories, setCategories] = useState<PublicEstateCategory[]>(
    initialCategories || DEFAULT_REAL_ESTATE_CATEGORIES
  );
  const [loading, setLoading] = useState<boolean>(!initialAgency);

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

        const [configRes, estatesRes, recentRes, catsRes] = await Promise.allSettled([
          publicInmobiliariaService.getConfig(hostname),
          publicInmobiliariaService.getFeaturedEstates(hostname, 6),
          publicInmobiliariaService.getRecentEstates(hostname, 3),
          publicInmobiliariaService.getCategories(hostname),
        ]);

        if (!isMounted) return;

        if (configRes.status === 'fulfilled' && configRes.value?.data) {
          setAgency(configRes.value.data);
        }

        if (estatesRes.status === 'fulfilled' && estatesRes.value?.data?.length) {
          setFeaturedEstates(estatesRes.value.data);
        }

        if (recentRes.status === 'fulfilled' && recentRes.value?.data?.length) {
          setRecentEstates(recentRes.value.data);
        }

        if (catsRes.status === 'fulfilled' && catsRes.value?.data?.length) {
          setCategories(catsRes.value.data);
        }
      } catch (err) {
        console.warn('Could not load dynamic real estate portal data, using defaults:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!initialAgency) {
      loadPortalData();
    }
    return () => {
      isMounted = false;
    };
  }, [initialAgency, domain]);

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
        countryImage={agency?.country_image}
        agency={agency}
        message="Un momento por favor, estamos buscando las mejores propiedades."
      />
      <TopbarSlider agency={agency} />
      <Header2Style3 agency={agency} />
      <HeroV4 agency={agency} />
      <DestinationSectionV4 categories={categories} agency={agency} />
      <TravelPackageV4 featuredEstates={featuredEstates} agency={agency} />
      <BlogV4 recentEstates={recentEstates} agency={agency} />
      <Footer agency={agency} />
    </div>
  );
}
