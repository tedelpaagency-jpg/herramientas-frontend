"use client";

import React, { useState, useEffect } from "react";
import {
  PublicAgencyConfig,
  getCachedAgencyConfig,
  getCachedBrandColor,
  getCachedLoaderImage,
} from "@/services/publicInmobiliariaService";
import { IMMOBILLIS_LOGO_URL, IMMOBILLIS_REMOTE_LOGO_URL } from "./immobillisLoaderLogo";

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
  const [useRemoteFallback, setUseRemoteFallback] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(25);

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      setMinTimeElapsed(true);
      return;
    }
    setMinTimeElapsed(false);
    setProgress(25);

    const step1 = setTimeout(() => setProgress(50), 200);
    const step2 = setTimeout(() => setProgress(75), Math.min(900, effectiveDuration * 0.45));
    const step3 = setTimeout(() => setProgress(92), Math.min(1700, effectiveDuration * 0.8));

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

  // Check if Immobillis
  const isImmobillis =
    agency?.id === 394 ||
    (typeof window !== 'undefined' && window.location.hostname.includes('immobillis')) ||
    (agency?.domain && agency.domain.includes('immobillis'));

  const defaultImmobillisLogo = useRemoteFallback ? IMMOBILLIS_REMOTE_LOGO_URL : IMMOBILLIS_LOGO_URL;
  const rawLogo = validCandidate || (isImmobillis ? defaultImmobillisLogo : null);
  const logoToDisplay = !imgFailed ? rawLogo : null;

  const shouldRender = isOpen || !minTimeElapsed;
  if (!shouldRender) return null;

  const displayMessage = message || "Un momento por favor, estamos buscando las mejores propiedades.";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center font-sans overflow-hidden select-none"
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
        @keyframes shimmerBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .animate-shimmer-bar {
          animation: shimmerBar 1.8s infinite ease-in-out;
        }
      `}} />

      {/* Tarjeta Central Sólida Blanca (Apple Clean Style) */}
      <div
        className="relative z-10 w-[90%] max-w-[370px] rounded-[28px] bg-[#ffffff] flex flex-col items-center justify-center p-8 sm:p-9 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100/90"
        style={{
          borderRadius: '28px',
        }}
      >
        {/* Logotipo Grande de Immobillis / Agencia (Sin animaciones para evitar efectos indeseados) */}
        {logoToDisplay && (
          <div className="w-full flex items-center justify-center mb-7">
            <img
              src={logoToDisplay}
              alt={agency?.name || "Logo"}
              className="w-auto h-[120px] max-w-[230px] object-contain select-none pointer-events-none drop-shadow-none"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              onError={() => {
                if (!useRemoteFallback && logoToDisplay === IMMOBILLIS_LOGO_URL) {
                  setUseRemoteFallback(true);
                } else {
                  setImgFailed(true);
                }
              }}
            />
          </div>
        )}

        {/* Barra de progreso dorada */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, #d97706 0%, ${effectiveBrandColor} 50%, #fbbf24 100%)`,
              boxShadow: `0 0 8px ${effectiveBrandColor}50`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-bar" />
          </div>
        </div>

        {/* Mensaje informativo idéntico al diseño */}
        <p className="mt-3.5 text-[12px] sm:text-[12.5px] font-bold text-slate-800 leading-snug text-center max-w-[260px] tracking-tight">
          {displayMessage}
        </p>
      </div>
    </div>
  );
};

export default PublicPortalLoader;
