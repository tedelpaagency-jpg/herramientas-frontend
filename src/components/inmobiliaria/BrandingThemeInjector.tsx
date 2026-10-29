'use client';

import React, { useMemo } from 'react';

interface BrandingThemeInjectorProps {
  agency?: any;
}

const hexToRgb = (hex: string): string => {
  if (!hex) return '0, 168, 132';
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return '0, 168, 132';
  const num = parseInt(clean, 16);
  if (isNaN(num)) return '0, 168, 132';
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
};

export const BrandingThemeInjector: React.FC<BrandingThemeInjectorProps> = ({ agency }) => {
  const primaryColor = agency?.primary_color || agency?.details?.primary_color || '#00a884';
  const secondaryColor = agency?.secondary_color || agency?.details?.secondary_color || '#0f172a';
  // Los botones deben ser del mismo color primario configurado por la agencia
  const buttonColor = primaryColor;
  const primaryRgb = useMemo(() => hexToRgb(primaryColor), [primaryColor]);
  const secondaryRgb = useMemo(() => hexToRgb(secondaryColor), [secondaryColor]);

  const css = `
    :root, .travel-agency-03-root, .public-portal-isolated-scope {
      --primary-color1: ${primaryColor} !important;
      --primary-color2: ${primaryColor} !important;
      --primary-color3: ${secondaryColor} !important;
      --primary-color1-opc: ${primaryRgb} !important;
      --primary-color2-opc: ${primaryRgb} !important;
      --primary-color: ${primaryColor} !important;
      --secondary-color: ${secondaryColor} !important;
      --button-color: ${buttonColor} !important;
    }

    /* Botones primarios del portal */
    .primary-btn1, .primary-btn2, .primary-btn3 {
      background-color: ${buttonColor} !important;
      border-color: ${buttonColor} !important;
      color: #ffffff !important;
    }
    .primary-btn1::before, .primary-btn2::before {
      background-color: ${secondaryColor} !important;
    }
    .primary-btn1:hover, .primary-btn2:hover, .primary-btn3:hover {
      border-color: ${secondaryColor} !important;
    }

    /* Badges de estado de inmuebles: un solo fondo limpio con color primario */
    .package-card .package-img-wrap .batch,
    .property-status-badge {
      background: ${primaryColor} !important;
      background-color: ${primaryColor} !important;
      border: none !important;
    }
    .package-card .package-img-wrap .batch span,
    .property-status-badge span {
      background: transparent !important;
      background-color: transparent !important;
      color: #ffffff !important;
    }

    /* Pestañas activas del hero booking */
    .hero-tab-pill.active {
      background: ${primaryColor} !important;
      color: #ffffff !important;
      border-color: ${primaryColor} !important;
      box-shadow: 0 8px 24px rgba(${primaryRgb}, 0.35) !important;
    }

    /* Enlaces y navegación activa */
    .header-area .main-menu .menu-list > li.active > a,
    .header-area .main-menu .menu-list > li > a:hover {
      color: ${primaryColor} !important;
    }
    .header-area .main-menu .menu-list > li .sub-menu li a:hover {
      color: ${primaryColor} !important;
    }

    /* Swiper / Sliders flechas y paginación */
    .swiper-pagination-bullet-active {
      background: ${primaryColor} !important;
    }
    .slider-btn-grp .slider-btn:hover {
      background: ${primaryColor} !important;
      border-color: ${primaryColor} !important;
      color: #ffffff !important;
    }
    .slider-btn-grp .slider-btn:hover svg {
      stroke: #ffffff !important;
    }

    /* Badges y chips de estado */
    .brand-accent-text {
      color: ${primaryColor} !important;
    }
    .brand-accent-bg {
      background-color: ${primaryColor} !important;
    }
    .brand-accent-border {
      border-color: ${primaryColor} !important;
    }
  `;

  return (
    <style
      id="portal-dynamic-branding"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
};

export default BrandingThemeInjector;

