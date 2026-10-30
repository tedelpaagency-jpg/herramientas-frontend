"use client";

import React, { useState, useEffect } from "react";
import { PublicAgencyConfig, getCachedAgencyConfig, getCachedBrandColor, getCachedLoaderImage } from "@/services/publicInmobiliariaService";

export interface PublicPortalLoaderProps {
  countryName?: string;
  countryImage?: string;
  agency?: PublicAgencyConfig | any;
  brandColor?: string;
  textColor?: string;
  duration?: number;
  logoUrl?: string | null;
  message?: string;
  messages?: string[];
  isOpen?: boolean;
}

const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || hex.toLowerCase() === '#00a884') return `rgba(226, 183, 40, ${alpha})`;
  let clean = hex.replace('#', '');
  if (clean.toLowerCase() === '00a884') clean = 'e2b728';
  let r = 0, g = 0, b = 0;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length >= 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const PublicPortalLoader: React.FC<PublicPortalLoaderProps> = ({
  countryName,
  countryImage,
  agency,
  brandColor,
  textColor,
  duration,
  logoUrl,
  message,
  messages,
  isOpen = true,
}) => {
  const defaultMessages = [
    message || "Un momento por favor, estamos buscando las mejores propiedades.",
    "Analizando el mercado y filtrando opciones para ti...",
    "Preparando el catálogo de tu próximo hogar...",
  ];

  const activeMessages = (messages && messages.length > 0) ? messages : defaultMessages;
  const [currentMessage, setCurrentMessage] = useState<string>('');

  // Resolver color de la agencia evitando destellos verdes (#00a884)
  const cachedBrand = typeof window !== 'undefined' ? (getCachedBrandColor() || getCachedAgencyConfig()?.primary_color) : null;
  const rawBrand = brandColor || agency?.primary_color || cachedBrand;
  const effectiveBrandColor = (!rawBrand || rawBrand.toLowerCase() === '#00a884') ? '#e2b728' : rawBrand;

  const effectiveTextColor =
    textColor ||
    agency?.details?.loader_text_color ||
    agency?.loader_text_color ||
    '#ffffff';

  // Duración en milisegundos: si el usuario configuró segundos (ej. 3 o 3.5), convertir a ms
  const rawDuration =
    duration ??
    agency?.details?.loader_duration ??
    agency?.loader_duration ??
    2500;
  const parsedDur = Number(rawDuration) || 2.5;
  const effectiveDuration = parsedDur <= 20 ? parsedDur * 1000 : parsedDur;

  const [minTimeElapsed, setMinTimeElapsed] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setMinTimeElapsed(true);
      return;
    }
    setMinTimeElapsed(false);
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, effectiveDuration);
    return () => clearTimeout(timer);
  }, [isOpen, effectiveDuration]);

  const effectiveLogoUrl =
    logoUrl ||
    agency?.logo_icon ||
    agency?.logo ||
    agency?.favicon ||
    agency?.logo_2 ||
    null;

  const displayCountry =
    countryName ||
    agency?.country_name ||
    agency?.country ||
    agency?.province ||
    "Ecuador";

  // Resolver imagen cacheada de inmediato para eliminar retraso visual en frame 0
  const cachedImg = typeof window !== 'undefined' ? (getCachedLoaderImage() || (getCachedAgencyConfig() as any)?.country_image || (getCachedAgencyConfig()?.details as any)?.country_image) : null;
  const displayImage =
    countryImage ||
    agency?.country_image ||
    (agency?.details as any)?.country_image ||
    cachedImg ||
    "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=85";

  useEffect(() => {
    if (typeof window !== 'undefined' && displayImage) {
      try {
        const pre = new Image();
        pre.src = displayImage;
      } catch {}
    }
  }, [displayImage]);

  useEffect(() => {
    if (!activeMessages || activeMessages.length === 0) return;

    const getRandomMessage = () =>
      activeMessages[Math.floor(Math.random() * activeMessages.length)];

    setCurrentMessage(getRandomMessage());

    if (activeMessages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessage(getRandomMessage());
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [activeMessages]);

  const shouldRender = isOpen || !minTimeElapsed;
  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-md flex items-center justify-center font-sans overflow-hidden selection:bg-white/30 transition-opacity duration-500 animate-in fade-in"
      role="status"
      aria-live="polite"
      aria-label="Cargando propiedades"
      style={{
        '--brand-color': effectiveBrandColor,
        '--loader-text-color': effectiveTextColor,
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}} />

      {/* Backdrop semi-transparente con desenfoque suave */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-black/20" />

      {/* Contenedor Principal (Modal) - Con degradados y bordes del color primario */}
      <div
        className="relative z-10 w-[90%] max-w-[500px] h-[500px] sm:h-[500px] rounded-[20px] overflow-hidden flex flex-col transition-all duration-500 select-none"
        style={{
          boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), inset 0 0 0 1.5px ${effectiveBrandColor}, inset 0 0 50px -15px ${effectiveBrandColor}`,
          backgroundColor: hexToRgba(effectiveBrandColor, 0.85),
        }}
      >
        {/* Imagen de Fondo Central */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={displayImage}
            alt={displayCountry}
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://inmobiliaria.inmosoft.pro/public/assets/images/locations/bcb83c8c9ddaff31bfa8a873df69e6a4ecu.jpg';
            }}
          />
        </div>

        {/* --- PIGMENTOS DE COLOR DE MARCA (Flares / Resplandores) --- */}
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full mix-blend-screen blur-[65px] opacity-60 pointer-events-none z-0 transition-colors duration-500"
          style={{ backgroundColor: effectiveBrandColor }}
        />
        <div
          className="absolute top-1/4 -right-24 w-80 h-80 rounded-full mix-blend-screen blur-[75px] opacity-40 pointer-events-none z-0 transition-colors duration-500"
          style={{ backgroundColor: effectiveBrandColor }}
        />

        {/* Gradiente superior con el color principal seleccionado */}
        <div
          className="absolute top-0 left-0 w-full h-32 pointer-events-none z-10 flex items-start p-6 sm:p-8 transition-colors duration-500"
          style={{
            background: `linear-gradient(to bottom, ${hexToRgba(effectiveBrandColor, 0.95)} 0%, ${hexToRgba(effectiveBrandColor, 0.72)} 42%, ${hexToRgba(effectiveBrandColor, 0.2)} 78%, transparent 100%)`,
          }}
        >
          <span
            className="text-[11px] font-bold tracking-[0.15em] uppercase drop-shadow-md"
            style={{ color: effectiveTextColor }}
          >
            {displayCountry}
          </span>
        </div>

        {/* Spinner Central con sombreado de la marca (Glow) */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ filter: `drop-shadow(0 0 10px ${effectiveBrandColor})` }}
        >
          <svg className="w-[56px] h-[56px] animate-spin" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="22" fill="none" strokeWidth="2.5" stroke="rgba(255,255,255,0.25)" />
            <circle
              cx="25"
              cy="25"
              r="22"
              fill="none"
              strokeWidth="2.5"
              stroke={effectiveTextColor}
              strokeDasharray="35 100"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Gradiente Inferior con el color principal seleccionado */}
        <div
          className="absolute bottom-0 left-0 w-full pt-28 pb-8 px-6 sm:px-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 sm:gap-0 z-10 transition-colors duration-500"
          style={{
            background: `linear-gradient(to top, ${hexToRgba(effectiveBrandColor, 0.97)} 0%, ${hexToRgba(effectiveBrandColor, 0.86)} 48%, ${hexToRgba(effectiveBrandColor, 0.28)} 82%, transparent 100%)`,
          }}
        >
          {/* Logo Dinámico de la Agencia */}
          <div className="flex-shrink-0 sm:mb-1">
            {effectiveLogoUrl ? (
              <img
                src={effectiveLogoUrl}
                alt={agency?.name || "Logo Agencia"}
                className="h-[34px] w-auto max-w-[140px] object-contain drop-shadow-md"
              />
            ) : (
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L4 13.5L20 23L36 13.5L20 4Z" fill={effectiveBrandColor} />
                <path d="M4 26.5L20 36L36 26.5L36 13.5L20 23L4 13.5L4 26.5Z" fill={effectiveBrandColor} fillOpacity="0.8" />
                <circle cx="20" cy="20" r="5" fill="#ffffff" />
                <circle cx="10" cy="15" r="2.5" fill="#ffffff" fillOpacity="0.9" />
                <circle cx="30" cy="15" r="2.5" fill="#ffffff" fillOpacity="0.9" />
              </svg>
            )}
          </div>

          {/* Texto de información dinámico con el color configurado */}
          <p
            key={currentMessage}
            className="font-medium text-[15px] sm:text-[15px] leading-[1.3] text-center sm:text-right drop-shadow-sm max-w-[250px] animate-fade-in"
            style={{ color: effectiveTextColor }}
          >
            {currentMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPortalLoader;
