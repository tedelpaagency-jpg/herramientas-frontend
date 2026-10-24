'use client';

import React, { useEffect, useState } from 'react';
import AboutV4 from '@/components/about-page-component/AboutV4';
import BlogV4 from '@/components/blog/BlogV4';
import CounterV4 from '@/components/counter-section/CounterV4';
import DestinationSectionV4 from '@/components/destination-section/DestinationSectionV4';
import FaqV4 from '@/components/faq-section/FaqV4';
import FeatureSectionV4 from '@/components/feature-section/FeatureSectionV4';
import HeroV4 from '@/components/hero-section/HeroV4';
import Footer from '@/components/layout/Footer';
import Header2Style3 from '@/components/layout/Header2Style3';
import OfferbannerV4 from '@/components/offer-section/OfferbannerV4';
import Partner from '@/components/Partner';
import TestimonialV4 from '@/components/testimonial-section/TestimonialV4';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import TravelPackageV4 from '@/components/travel-package-section/TravelPackageV4';
import WhyChooseUsV4 from '@/components/why-choose-us-section/WhyChooseUsV4';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateItem,
  PublicEstateCategory,
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
  const [agency, setAgency] = useState<PublicAgencyConfig>(initialAgency || DEFAULT_FALLBACK_AGENCY);
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
          setAgency((prev) => ({
            ...DEFAULT_FALLBACK_AGENCY,
            ...prev,
            ...configRes.value.data,
          }));
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
      <TopbarSlider />
      <Header2Style3 agency={agency} />
      <HeroV4 agency={agency} />
      <DestinationSectionV4 categories={categories} agency={agency} />
      <TravelPackageV4 featuredEstates={featuredEstates} agency={agency} />
      <AboutV4 agency={agency} />
      <FeatureSectionV4 agency={agency} />
      <WhyChooseUsV4 agency={agency} />
      <CounterV4 agency={agency} />
      <Partner />
      <OfferbannerV4 agency={agency} />
      <TestimonialV4 />
      <BlogV4 recentEstates={recentEstates} agency={agency} />
      <FaqV4 agency={agency} />
      <Footer agency={agency} />
    </div>
  );
}
