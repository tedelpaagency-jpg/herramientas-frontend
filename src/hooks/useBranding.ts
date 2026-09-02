'use client';

import { useEffect } from 'react';
import { WhiteLabel } from '../types/whiteLabel';

export const useBranding = (whiteLabel?: WhiteLabel | null, agency?: any | null) => {
  useEffect(() => {
    if (!whiteLabel && !agency) return;

    // Apply custom colors as CSS variables
    const root = document.documentElement;

    if (whiteLabel?.primary_color) {
      root.style.setProperty('--brand-primary', whiteLabel.primary_color);
    }

    if (whiteLabel?.secondary_color) {
      root.style.setProperty('--brand-secondary', whiteLabel.secondary_color);
    }

    if (whiteLabel?.button_color) {
      root.style.setProperty('--brand-button', whiteLabel.button_color);
    }

    // Check custom_agency_branding permission
    const currentPlan = agency?.current_subscription?.plan || agency?.plan;
    const activePlanPermissions = currentPlan?.plan_permissions?.map((p: any) => p.permission.toLowerCase()) || [];
    const hasCustomBranding = activePlanPermissions.includes('custom_agency_branding');

    const effectiveFavicon = (hasCustomBranding && agency?.favicon) ? agency.favicon : whiteLabel?.favicon;
    const effectiveTitle = (hasCustomBranding && agency?.name) ? agency.name : (whiteLabel?.name || 'Plataforma SaaS');

    // Apply custom favicon if present
    if (effectiveFavicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = effectiveFavicon;
    }

    // Apply document title
    if (effectiveTitle) {
      document.title = `${effectiveTitle} - Plataforma SaaS`;
    }

    // Apply SEO Meta Description if present
    if (whiteLabel?.seo_description) {
      let meta: HTMLMetaElement | null = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
      meta.content = whiteLabel.seo_description;
    }

  }, [whiteLabel, agency]);
};

export default useBranding;
