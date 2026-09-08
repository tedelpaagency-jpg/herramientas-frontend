'use client';

import { useEffect } from 'react';
import { WhiteLabel } from '../types/whiteLabel';

export const useBranding = (whiteLabel?: WhiteLabel | null, agency?: any | null, user?: any | null) => {
  useEffect(() => {
    if (!whiteLabel && !agency && !user) return;

    const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
    const isWhiteLabelAdmin = user?.role === 'white_label_admin' || user?.roles?.some((r: any) => r.name === 'white_label_admin');

    const hostWhiteLabel = whiteLabel || agency?.white_label || (user as any)?.white_labels?.[0];

    let effectiveFavicon: string | null = null;
    let effectiveTitle: string = 'Plataforma SaaS';
    let primaryColor = agency?.primary_color || hostWhiteLabel?.primary_color || whiteLabel?.primary_color || '#00a884';
    let secondaryColor = agency?.secondary_color || hostWhiteLabel?.secondary_color || whiteLabel?.secondary_color || '#161a1b';
    let buttonColor = agency?.button_color || hostWhiteLabel?.button_color || whiteLabel?.button_color || '#00a884';
    let menuBackground = agency?.menu_background || hostWhiteLabel?.menu_background || whiteLabel?.menu_background || '#161a1b';
    let fontFamily = agency?.font_family || hostWhiteLabel?.font_family || whiteLabel?.font_family || 'Inter, sans-serif';
    let customCss = agency?.custom_css || hostWhiteLabel?.custom_css || whiteLabel?.custom_css || '';

    let borderRadius = agency?.border_radius || (hostWhiteLabel as any)?.border_radius || (whiteLabel as any)?.border_radius || 'rounded-xl';

    if (isSuperAdmin || isWhiteLabelAdmin) {
      // Super Admin & White Label Admin use White Label identity directly
      effectiveFavicon = whiteLabel?.favicon || hostWhiteLabel?.favicon || null;
      effectiveTitle = whiteLabel?.name || hostWhiteLabel?.name || 'Plataforma SaaS';
      primaryColor = whiteLabel?.primary_color || primaryColor;
      secondaryColor = whiteLabel?.secondary_color || secondaryColor;
      buttonColor = whiteLabel?.button_color || buttonColor;
      menuBackground = whiteLabel?.menu_background || menuBackground;
      fontFamily = whiteLabel?.font_family || fontFamily;
      customCss = whiteLabel?.custom_css || customCss;
      borderRadius = (whiteLabel as any)?.border_radius || (hostWhiteLabel as any)?.border_radius || borderRadius;
    } else {
      // Agency Admins & Standard Users:
      // Check if agency has 'custom_agency_branding' plan permission
      const currentPlan = agency?.current_subscription?.plan || agency?.plan;
      const activePlanPermissions = (currentPlan?.plan_permissions || currentPlan?.permissions || [])
        .map((p: any) => (typeof p === 'string' ? p : p?.permission || p?.name || '').toLowerCase());
      const hasCustomBranding = activePlanPermissions.includes('custom_agency_branding');

      // If agency has permission AND custom fields, use them. Otherwise INHERIT from White Label!
      effectiveFavicon = (hasCustomBranding && agency?.favicon) ? agency.favicon : (hostWhiteLabel?.favicon || null);
      effectiveTitle = (hasCustomBranding && agency?.name) ? agency.name : (hostWhiteLabel?.name || 'Plataforma SaaS');

      if (hasCustomBranding) {
        primaryColor = agency?.primary_color || hostWhiteLabel?.primary_color || primaryColor;
        secondaryColor = agency?.secondary_color || hostWhiteLabel?.secondary_color || secondaryColor;
        buttonColor = agency?.button_color || hostWhiteLabel?.button_color || buttonColor;
        menuBackground = agency?.menu_background || hostWhiteLabel?.menu_background || menuBackground;
        fontFamily = agency?.font_family || hostWhiteLabel?.font_family || fontFamily;
        customCss = agency?.custom_css || hostWhiteLabel?.custom_css || customCss;
        borderRadius = agency?.border_radius || hostWhiteLabel?.border_radius || borderRadius;
      }
    }

    // Map Tailwind rounded class to CSS pixel radius
    let pixelRadius = '12px';
    if (borderRadius === 'rounded-none' || borderRadius === '0' || borderRadius === '0px') pixelRadius = '0px';
    else if (borderRadius === 'rounded-sm') pixelRadius = '4px';
    else if (borderRadius === 'rounded' || borderRadius === 'rounded-md') pixelRadius = '8px';
    else if (borderRadius === 'rounded-lg') pixelRadius = '8px';
    else if (borderRadius === 'rounded-xl') pixelRadius = '12px';
    else if (borderRadius === 'rounded-2xl') pixelRadius = '16px';
    else if (borderRadius === 'rounded-3xl') pixelRadius = '24px';
    else if (borderRadius === 'rounded-full') pixelRadius = '9999px';
    else if (borderRadius.includes('px') || borderRadius.includes('rem')) pixelRadius = borderRadius;

    // 1. Apply custom CSS variables to document root
    const root = document.documentElement;
    if (primaryColor) {
      root.style.setProperty('--brand-primary', primaryColor);
      root.style.setProperty('--color-primary', primaryColor);
    }
    if (secondaryColor) root.style.setProperty('--brand-secondary', secondaryColor);
    if (buttonColor) {
      root.style.setProperty('--brand-button', buttonColor);
      root.style.setProperty('--color-button', buttonColor);
    }
    if (menuBackground) root.style.setProperty('--brand-menu-bg', menuBackground);
    if (pixelRadius) {
      root.style.setProperty('--brand-radius', pixelRadius);
      root.style.setProperty('--border-radius', pixelRadius);
    }

    // Inject dynamic CSS style rule for colors and button border radius
    let colorsStyleTag = document.getElementById('tenant-branding-colors');
    if (!colorsStyleTag) {
      colorsStyleTag = document.createElement('style');
      colorsStyleTag.id = 'tenant-branding-colors';
      document.head.appendChild(colorsStyleTag);
    }
    colorsStyleTag.textContent = `
      :root {
        --color-primary: ${primaryColor} !important;
        --color-button: ${buttonColor} !important;
        --border-radius: ${pixelRadius} !important;
      }
      .bg-primary {
        background-color: ${primaryColor} !important;
      }
      .text-primary {
        color: ${primaryColor} !important;
      }
      .border-primary {
        border-color: ${primaryColor} !important;
      }
    `;
    
    // 2. Load Google Fonts dynamically and inject global font family rule
    if (fontFamily) {
      root.style.setProperty('--brand-font', fontFamily);
      document.documentElement.style.fontFamily = fontFamily;
      document.body.style.fontFamily = fontFamily;

      const fontName = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      if (fontName && !fontName.includes('Inter')) {
        const fontId = `google-font-${fontName.toLowerCase().replace(/\s+/g, '-')}`;
        if (!document.getElementById(fontId)) {
          const link = document.createElement('link');
          link.id = fontId;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700;800;900&display=swap`;
          document.head.appendChild(link);
        }
      }

      let fontStyleTag = document.getElementById('tenant-branding-font');
      if (!fontStyleTag) {
        fontStyleTag = document.createElement('style');
        fontStyleTag.id = 'tenant-branding-font';
        document.head.appendChild(fontStyleTag);
      }
      fontStyleTag.textContent = `
        body, button, input, select, textarea, p, h1, h2, h3, h4, h5, h6, span:not(.material-symbols-outlined):not([class*="material-symbols"]), a, label, td, th {
          font-family: ${fontFamily} !important;
        }
        .material-symbols-outlined, [class*="material-symbols"] {
          font-family: 'Material Symbols Outlined' !important;
        }
      `;
    }

    // 3. Inject custom CSS rules if provided
    let styleTag = document.getElementById('tenant-custom-css');
    if (customCss) {
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'tenant-custom-css';
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = customCss;
    } else if (styleTag) {
      styleTag.remove();
    }

    // 4. Apply favicon
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

    // 5. Apply document title
    if (effectiveTitle) {
      document.title = `${effectiveTitle} - Plataforma SaaS`;
    }

    // 6. Apply SEO Meta Description
    const seoDesc = (agency?.seo_description) || hostWhiteLabel?.seo_description || whiteLabel?.seo_description;
    if (seoDesc) {
      let meta: HTMLMetaElement | null = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
      meta.content = seoDesc;
    }

    // 7. Sync logos, menu background, dark theme and navigation mode in localStorage
    if (typeof window !== 'undefined') {
      const mainLogo = whiteLabel?.logo || agency?.logo || hostWhiteLabel?.logo;
      const darkLogo = whiteLabel?.logo_2 || agency?.logo_2 || hostWhiteLabel?.logo_2;
      const iconLogo = whiteLabel?.logo_icon || agency?.logo_icon || hostWhiteLabel?.logo_icon;
      const targetDarkTheme = whiteLabel?.dark_theme || agency?.dark_theme || hostWhiteLabel?.dark_theme;
      const targetNavMode = whiteLabel?.navigation_mode || agency?.navigation_mode || hostWhiteLabel?.navigation_mode;

      if (mainLogo) localStorage.setItem('santun_sidebar_logo', mainLogo);
      if (darkLogo) localStorage.setItem('santun_sidebar_logo_dark', darkLogo);
      if (iconLogo) localStorage.setItem('santun_sidebar_logo_icon', iconLogo);
      if (menuBackground) localStorage.setItem('santun_menu_background', menuBackground);
      if (targetDarkTheme) {
        localStorage.setItem('santun_dark_theme', targetDarkTheme);
        if (!localStorage.getItem('santun_theme')) {
          localStorage.setItem('santun_theme', targetDarkTheme);
        }
      }

      const activeTheme = localStorage.getItem('santun_theme') || targetDarkTheme;
      if (activeTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else if (activeTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }

      if (targetNavMode) {
        const isCompact = targetNavMode === 'compact';
        localStorage.setItem('santun_sidebar_collapsed', String(isCompact));
        window.dispatchEvent(new Event('sidebar-state-changed'));
      }

      const targetWl = whiteLabel || hostWhiteLabel;
      if (targetWl) {
        localStorage.setItem('santun_white_label', JSON.stringify(targetWl));
      }

      window.dispatchEvent(new Event('branding-updated'));
    }

  }, [whiteLabel, agency, user]);
};

export default useBranding;
