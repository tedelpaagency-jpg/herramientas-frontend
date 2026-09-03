'use client';

import { useEffect } from 'react';
import { WhiteLabel } from '../types/whiteLabel';

export const useBranding = (whiteLabel?: WhiteLabel | null, agency?: any | null, user?: any | null) => {
  useEffect(() => {
    if (!whiteLabel && !agency && !user) return;

    const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
    const isWhiteLabelAdmin = user?.role === 'white_label_admin' || user?.roles?.some((r: any) => r.name === 'white_label_admin');

    const hostWhiteLabel = agency?.white_label || whiteLabel;

    let effectiveFavicon: string | null = null;
    let effectiveTitle: string = 'Plataforma SaaS';
    let primaryColor = hostWhiteLabel?.primary_color || whiteLabel?.primary_color;
    let secondaryColor = hostWhiteLabel?.secondary_color || whiteLabel?.secondary_color;
    let buttonColor = hostWhiteLabel?.button_color || whiteLabel?.button_color;

    if (isSuperAdmin || isWhiteLabelAdmin) {
      // Super Admin y Administrador de Marca Blanca SIEMPRE usan la información de su Marca Blanca
      effectiveFavicon = whiteLabel?.favicon || null;
      effectiveTitle = whiteLabel?.name || 'Plataforma SaaS';
      primaryColor = whiteLabel?.primary_color || primaryColor;
      secondaryColor = whiteLabel?.secondary_color || secondaryColor;
      buttonColor = whiteLabel?.button_color || buttonColor;
    } else {
      // Administradores de Agencia y Usuarios Estándar:
      // Verifican si su agencia posee el permiso de plan 'custom_agency_branding'
      const currentPlan = agency?.current_subscription?.plan || agency?.plan;
      const activePlanPermissions = currentPlan?.plan_permissions?.map((p: any) => p.permission.toLowerCase()) || [];
      const hasCustomBranding = activePlanPermissions.includes('custom_agency_branding');

      // Si tiene el permiso Y tiene favicon/nombre cargado se usa. Sino, cae en la Marca Blanca anfitriona.
      effectiveFavicon = (hasCustomBranding && agency?.favicon) ? agency.favicon : (hostWhiteLabel?.favicon || null);
      effectiveTitle = (hasCustomBranding && agency?.name) ? agency.name : (hostWhiteLabel?.name || 'Plataforma SaaS');
    }

    // Apply custom colors as CSS variables
    const root = document.documentElement;
    if (primaryColor) root.style.setProperty('--brand-primary', primaryColor);
    if (secondaryColor) root.style.setProperty('--brand-secondary', secondaryColor);
    if (buttonColor) root.style.setProperty('--brand-button', buttonColor);

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
    const seoDesc = hostWhiteLabel?.seo_description || whiteLabel?.seo_description;
    if (seoDesc) {
      let meta: HTMLMetaElement | null = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
      meta.content = seoDesc;
    }

  }, [whiteLabel, agency, user]);
};

export default useBranding;
