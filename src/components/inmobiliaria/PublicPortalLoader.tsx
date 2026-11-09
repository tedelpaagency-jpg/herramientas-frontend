"use client";

import React, { useState, useEffect } from "react";
import {
  PublicAgencyConfig,
  getCachedAgencyConfig,
  getCachedBrandColor,
  getCachedLoaderImage,
} from "@/services/publicInmobiliariaService";
import { IMMOBILLIS_LOGO_URL } from "./immobillisLoaderLogo";

export interface PublicPortalLoaderProps {
  countryName?: string;
  countryImage?: string;
  loaderImage?: string | null;
  agency?: PublicAgencyConfig | any;
  brandColor?: string;
  textColor?: string;
  bgColor?: string;
  gradientColor?: string;
  showGradients?: boolean;
  imageFit?: 'contain' | 'cover';
  duration?: number;
  logoUrl?: string | null;
  message?: string;
  messages?: string[];
  isOpen?: boolean;
}

export const PublicPortalLoader: React.FC<PublicPortalLoaderProps> = ({
  agency,
  brandColor,
  duration,
  logoUrl,
  loaderImage,
  message,
  isOpen = true,
}) => {
  // Brand color resolution (avoid default unstyled teal #00a884)
  const cachedBrand = typeof window !== 'undefined' ? (getCachedBrandColor() || getCachedAgencyConfig()?.primary_color) : null;
  const rawBrand = brandColor || agency?.primary_color || cachedBrand;
  const effectiveBrandColor = (!rawBrand || rawBrand.toLowerCase() === '#00a884') ? '#e2b728' : rawBrand;

  // Duration in ms
  const rawDuration =
    duration ??
    agency?.details?.loader_duration ??
    agency?.loader_duration ??
    2500;
  const parsedDur = Number(rawDuration) || 2.5;
  const effectiveDuration = parsedDur <= 20 ? parsedDur * 1000 : parsedDur;

  const [minTimeElapsed, setMinTimeElapsed] = useState<boolean>(false);
  const [imgFailed, setImgFailed] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(25);

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      setMinTimeElapsed(true);
      return;
    }
    setMinTimeElapsed(false);
    setImgFailed(false);
    setProgress(20);

    const step1 = setTimeout(() => setProgress(48), 250);
    const step2 = setTimeout(() => setProgress(72), Math.min(1000, effectiveDuration * 0.45));
    const step3 = setTimeout(() => setProgress(90), Math.min(1800, effectiveDuration * 0.8));

    const doneTimer = setTimeout(() => {
      setProgress(100);
      setMinTimeElapsed(true);
    }, effectiveDuration);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(doneTimer);
    };
  }, [isOpen, effectiveDuration]);

  // Determine potential logo / image candidate
  const cachedImg = typeof window !== 'undefined' ? getCachedLoaderImage(agency?.domain) : null;
  const candidate =
    logoUrl ||
    loaderImage ||
    agency?.details?.loader_image ||
    agency?.loader_image ||
    cachedImg ||
    agency?.logo_icon ||
    agency?.logo ||
    agency?.favicon ||
    agency?.logo_2 ||
    null;

  // Filter out any unsplash generic photos
  const validCandidate = (candidate && typeof candidate === 'string' && !candidate.includes('unsplash.com'))
    ? candidate
    : null;

  // Fallback to official Immobillis logo if on Immobillis domain or agency 394
  const isImmobillis =
    agency?.id === 394 ||
    (typeof window !== 'undefined' && window.location.hostname.includes('immobillis')) ||
    (agency?.domain && agency.domain.includes('immobillis'));

  const rawLogo = validCandidate || (isImmobillis ? IMMOBILLIS_LOGO_URL : null);
  const logoToDisplay = !imgFailed ? rawLogo : null;

  const shouldRender = isOpen || !minTimeElapsed;
  if (!shouldRender) return null;

  const displayMessage = message || "Un momento por favor, estamos buscando las mejores propiedades.";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center font-sans overflow-hidden select-none transition-opacity duration-300 animate-in fade-in"
      role="status"
      aria-live="polite"
      aria-label="Cargando propiedades"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.40)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmerSlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .animate-shimmer-slow {
          animation: shimmerSlow 2s infinite ease-in-out;
        }
      `}} />

      {/* Tarjeta Central Sólida Blanca */}
      <div
        className="relative z-10 w-[90%] max-w-[340px] rounded-[24px] bg-[#ffffff] flex flex-col items-center justify-center p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100/90 animate-in fade-in zoom-in-95 duration-300"
        style={{
          borderRadius: '24px',
        }}
      >
        {/* Logotipo de la agencia / Immobillis (Solo si existe y es válido) */}
        {logoToDisplay && (
          <div className="w-full flex items-center justify-center mb-6">
            <img
              src={logoToDisplay}
              alt={agency?.name || "Logo"}
              className="max-w-[190px] max-h-[85px] w-auto h-auto object-contain drop-shadow-sm select-none"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              onError={() => setImgFailed(true)}
            />
          </div>
        )}

        {/* Barra de progreso */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, #d97706 0%, ${effectiveBrandColor} 50%, #fbbf24 100%)`,
              boxShadow: `0 0 8px ${effectiveBrandColor}60`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-slow" />
          </div>
        </div>

        {/* Mensaje informativo */}
        <p className="mt-3.5 text-[12px] sm:text-[12.5px] font-bold text-slate-800 leading-snug text-center max-w-[270px] tracking-tight">
          {displayMessage}
        </p>
      </div>
    </div>
  );
};

export default PublicPortalLoader;
