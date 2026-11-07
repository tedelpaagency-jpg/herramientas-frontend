"use client";

import React, { useState, useEffect } from "react";
import {
  PublicAgencyConfig,
  getCachedAgencyConfig,
  getCachedBrandColor,
  getCachedLoaderImage,
  setCachedLoaderImage,
} from "@/services/publicInmobiliariaService";

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
  loaderImage,
  agency,
  brandColor,
  textColor,
  bgColor,
  gradientColor,
  showGradients,
  imageFit,
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

  // Color de fondo del área central (modal)
  const effectiveBgColor =
    bgColor ||
    agency?.details?.loader_bg_color ||
    '#0f172a';

  // Color del degradado y acento
  const rawGradientColor =
    gradientColor ||
    agency?.details?.loader_gradient_color ||
    effectiveBrandColor;
  const effectiveGradientColor = (!rawGradientColor || rawGradientColor.toLowerCase() === '#00a884')
    ? effectiveBrandColor
    : rawGradientColor;

  // Si los degradados luminosos sutiles están activados
  const effectiveShowGradients =
    showGradients ??
    (agency?.details?.loader_gradient_enabled !== false);

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

  const displayTitle =
    agency?.commercial_name ||
    agency?.name ||
    countryName ||
    "Portal Inmobiliario";

  // Resolver imagen personalizada de loader ÚNICAMENTE si fue configurada por el usuario (NUNCA fotos turísticas ni país)
  const cachedImg = typeof window !== 'undefined'
    ? getCachedLoaderImage(agency?.domain)
    : null;

  const rawCandidate =
    loaderImage ||
    agency?.details?.loader_image ||
    agency?.loader_image ||
    cachedImg ||
    null;

  // Filtrar estrictamente cualquier residuo de unsplash o fotos de países genéricas
  const displayImage = (rawCandidate && typeof rawCandidate === 'string' && !rawCandidate.includes('unsplash.com'))
    ? rawCandidate
    : null;

  // Mantenerla sincronizada en caché y pre-cargada si es válida
  useEffect(() => {
    if (typeof window !== 'undefined' && displayImage) {
      setCachedLoaderImage(displayImage, agency?.domain);
    }
  }, [displayImage, agency?.domain]);

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
      className="fixed inset-0 z-[99999] bg-[#070b14]/95 backdrop-blur-2xl flex items-center justify-center font-sans overflow-hidden select-none transition-opacity duration-500 animate-in fade-in"
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
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.05); } }
        .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
      `}} />

      {/* Pre-cargar la imagen si existe */}
      {displayImage && (
        <link rel="preload" as="image" href={displayImage} fetchPriority="high" />
      )}

      {/* Contenedor Principal (Modal) - Limpio, sin imágenes de fondo que contaminen */}
      <div
        className="relative z-10 w-[90%] max-w-[460px] min-h-[380px] rounded-[24px] overflow-hidden flex flex-col justify-between p-7 sm:p-9 transition-all duration-500 border shadow-2xl"
        style={{
          backgroundColor: effectiveBgColor,
          borderColor: hexToRgba(effectiveGradientColor, 0.3),
          boxShadow: `0 25px 60px -15px rgba(0,0,0,0.85), 0 0 40px -10px ${hexToRgba(effectiveGradientColor, 0.2)}`,
        }}
      >
        {/* Resplandor sutil de fondo (solo si está activado y muy difuminado, sin manchas sólidas) */}
        {effectiveShowGradients && (
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[90px] pointer-events-none z-0 animate-pulse-glow"
            style={{ backgroundColor: effectiveGradientColor }}
          />
        )}

        {/* Encabezado: Nombre de la agencia / Portal y status dot */}
        <div className="flex items-center justify-between w-full z-10 relative">
          <span
            className="text-[11px] font-bold tracking-[0.16em] uppercase drop-shadow-sm opacity-80 truncate pr-3"
            style={{ color: effectiveTextColor }}
          >
            {displayTitle}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: effectiveBrandColor }}
            />
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: effectiveBrandColor }}
            />
          </div>
        </div>

        {/* Área Central: Imagen personalizada del loader O Logo de la agencia */}
        <div className="flex-1 flex flex-col items-center justify-center py-6 px-2 z-10 text-center my-auto">
          {displayImage ? (
            <div className="relative max-w-full flex items-center justify-center animate-fade-in">
              <img
                src={displayImage}
                alt={agency?.name || "Loader"}
                className="max-w-[85%] max-h-[190px] object-contain drop-shadow-2xl"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
              />
            </div>
          ) : effectiveLogoUrl ? (
            <div className="relative flex flex-col items-center justify-center p-4 animate-fade-in">
              <div
                className="absolute w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none transition-colors duration-500"
                style={{ backgroundColor: effectiveBrandColor }}
              />
              <img
                src={effectiveLogoUrl}
                alt={agency?.name || "Logo"}
                className="max-w-[240px] max-h-[85px] object-contain drop-shadow-2xl relative z-10"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
              />
            </div>
          ) : (
            <div className="relative flex items-center justify-center p-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: hexToRgba(effectiveBrandColor, 0.15) }}
              >
                <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                  <path d="M20 4L4 13.5L20 23L36 13.5L20 4Z" fill={effectiveBrandColor} />
                  <path d="M4 26.5L20 36L36 26.5L36 13.5L20 23L4 13.5L4 26.5Z" fill={effectiveBrandColor} fillOpacity="0.8" />
                  <circle cx="20" cy="20" r="5" fill="#ffffff" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Pie: Barra de carga y mensaje dinámico */}
        <div className="w-full flex flex-col items-center gap-3.5 z-10 relative pt-2">
          {/* Línea indicadora de progreso elegante */}
          <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full animate-pulse"
              style={{
                backgroundColor: effectiveBrandColor,
                boxShadow: `0 0 8px ${effectiveBrandColor}`,
                width: '70%',
              }}
            />
          </div>

          {/* Mensaje informativo */}
          <p
            key={currentMessage}
            className="font-medium text-[13.5px] leading-relaxed text-center drop-shadow-sm max-w-[340px] animate-fade-in"
            style={{ color: effectiveTextColor }}
          >
            {currentMessage}
          </p>

          {/* Si hay una imagen personalizada arriba, mostrar el logo pequeño abajo */}
          {displayImage && effectiveLogoUrl && (
            <div className="mt-1 opacity-75 hover:opacity-100 transition-opacity">
              <img
                src={effectiveLogoUrl}
                alt={agency?.name || "Logo"}
                className="h-[26px] w-auto max-w-[120px] object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicPortalLoader;
