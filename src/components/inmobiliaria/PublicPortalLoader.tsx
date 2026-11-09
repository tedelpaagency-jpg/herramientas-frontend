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
    (typeof window !== 'undefined' ? (
      (getCachedAgencyConfig(agency?.domain)?.details as any)?.loader_duration ??
      (getCachedAgencyConfig(agency?.domain) as any)?.loader_duration
    ) : null) ??
    2.5;
  const parsedDur = Number(rawDuration) || 2.5;
  const effectiveDuration = parsedDur <= 20 ? parsedDur * 1000 : parsedDur;

  const [minTimeElapsed, setMinTimeElapsed] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isFullyClosed, setIsFullyClosed] = useState<boolean>(false);
  const [imgFailed, setImgFailed] = useState<boolean>(false);
  const [useRemoteFallback, setUseRemoteFallback] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(15);

  useEffect(() => {
    // Si isOpen es explícitamente false desde el inicio y ya pasó el tiempo mínimo, no hacer nada
    if (!isOpen && minTimeElapsed) return;

    setMinTimeElapsed(false);
    setIsFadingOut(false);
    setIsFullyClosed(false);
    setProgress(15);

    const step1 = setTimeout(() => setProgress(45), Math.max(120, effectiveDuration * 0.20));
    const step2 = setTimeout(() => setProgress(72), Math.max(250, effectiveDuration * 0.50));
    const step3 = setTimeout(() => setProgress(90), Math.max(400, effectiveDuration * 0.80));
    const step4 = setTimeout(() => setProgress(100), Math.max(500, effectiveDuration * 0.95));

    const doneTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, effectiveDuration);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
      clearTimeout(doneTimer);
    };
  }, [effectiveDuration]);

  // El loader solo se desvanece cuando terminó el tiempo mínimo Y la carga real ya finalizó (isOpen=false).
  // Mientras isOpen siga en true, se mantiene visible cubriendo la página.
  useEffect(() => {
    if (isOpen) {
      setIsFadingOut(false);
      setIsFullyClosed(false);
      return;
    }
    if (!minTimeElapsed) return;
    setIsFadingOut(true);
    const closeTimer = setTimeout(() => setIsFullyClosed(true), 550);
    return () => clearTimeout(closeTimer);
  }, [isOpen, minTimeElapsed]);

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
    (typeof window !== 'undefined' && (
      window.location.hostname.includes('immobillis') ||
      window.location.hostname.includes('localhost') ||
      window.location.hostname.includes('127.0.0.1')
    )) ||
    (agency?.domain && agency.domain.includes('immobillis')) ||
    (agency?.commercial_name && String(agency.commercial_name).toLowerCase().includes('immobillis')) ||
    (agency?.name && String(agency.name).toLowerCase().includes('immobillis')) ||
    (!agency?.name && !agency?.id);

  // Para Immobillis usamos directamente el logotipo local transparente y optimizado sin marcos ni recuadros
  const rawLogo = isImmobillis
    ? IMMOBILLIS_LOGO_URL
    : (validCandidate || IMMOBILLIS_LOGO_URL);

  const logoToDisplay = !imgFailed ? rawLogo : IMMOBILLIS_LOGO_URL;

  const shouldRender = isOpen || !isFullyClosed;
  if (!shouldRender) return null;

  const displayMessage = message || "Un momento por favor, estamos buscando las mejores propiedades.";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center font-sans overflow-hidden select-none"
      role="status"
      aria-live="polite"
      aria-label="Cargando propiedades"
      style={{
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.02)' : 'scale(1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s ease-out',
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
        @keyframes auroraFloat1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(50px, 35px) scale(1.10); }
        }
        @keyframes auroraFloat2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-45px, -30px) scale(1.08); }
        }
        .animate-aurora-1 {
          animation: auroraFloat1 9s ease-in-out infinite;
        }
        .animate-aurora-2 {
          animation: auroraFloat2 11s ease-in-out infinite;
        }
      `}} />

      {/* 1. Cristal líquido translúcido: deja ver la aplicación real detrás, suavizada (estilo Apple) */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.22)',
          backdropFilter: 'blur(26px) saturate(185%) brightness(1.05)',
          WebkitBackdropFilter: 'blur(26px) saturate(185%) brightness(1.05)',
        }}
      />

      {/* 2. Reflejo especular sutil de cristal líquido */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.06) 40%, rgba(255, 255, 255, 0) 70%)',
        }}
      />

      {/* 4. Tarjeta central limpia estilo Apple: logo + barra dorada, espaciado equilibrado */}
      <div
        className="relative z-10 w-[88%] max-w-[330px] bg-white flex flex-col items-center justify-center px-8 py-9"
        style={{
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 30px 70px -18px rgba(15, 23, 42, 0.22), 0 6px 20px -8px rgba(15, 23, 42, 0.08)',
        }}
      >
        {/* Logotipo de Immobillis centrado y nítido */}
        {logoToDisplay && (
          <div className="w-full flex items-center justify-center mb-7">
            <img
              src={logoToDisplay}
              alt={agency?.name || "Logo"}
              className="w-auto h-[140px] sm:h-[150px] max-w-[240px] sm:max-w-[250px] object-contain select-none pointer-events-none drop-shadow-none"
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

        {/* Barra de progreso dorada fina y elegante */}
        <div className="w-44 h-[5px] bg-slate-100 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, #d97706 0%, ${effectiveBrandColor} 55%, #fbbf24 100%)`,
              boxShadow: `0 0 10px ${effectiveBrandColor}55`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-bar" />
          </div>
        </div>

        {/* Mensaje solo para lectores de pantalla (sin texto visible en el diseño) */}
        <span className="sr-only">{displayMessage}</span>
      </div>
    </div>
  );
};

export default PublicPortalLoader;
