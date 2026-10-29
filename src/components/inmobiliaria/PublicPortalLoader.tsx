"use client";

import React, { useState, useEffect } from "react";
import { PublicAgencyConfig } from "@/services/publicInmobiliariaService";

export interface PublicPortalLoaderProps {
  countryName?: string;
  countryImage?: string;
  agency?: PublicAgencyConfig | any;
  brandColor?: string;
  logoUrl?: string | null;
  message?: string;
  messages?: string[];
  isOpen?: boolean;
}

export const PublicPortalLoader: React.FC<PublicPortalLoaderProps> = ({
  countryName,
  countryImage,
  agency,
  brandColor,
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

  const effectiveBrandColor =
    brandColor ||
    agency?.primary_color ||
    agency?.button_color ||
    '#e2b728';

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

  const displayImage =
    countryImage ||
    agency?.country_image ||
    "/assets/img/inmosoft-loader-ecuador.jpg";

  useEffect(() => {
    if (!activeMessages || activeMessages.length === 0) return;

    // Función para obtener un mensaje aleatorio del array
    const getRandomMessage = () =>
      activeMessages[Math.floor(Math.random() * activeMessages.length)];

    // Asignar el primer mensaje aleatorio al montar el componente
    setCurrentMessage(getRandomMessage());

    // Cambiar el mensaje aleatoriamente cada 3.5 segundos
    if (activeMessages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessage(getRandomMessage());
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [activeMessages]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-[#111]/90 backdrop-blur-md flex items-center justify-center font-sans overflow-hidden selection:bg-white/30 animate-in fade-in duration-300"
      role="status"
      aria-live="polite"
      aria-label="Cargando propiedades"
      // Inyectamos el color de la marca como variable CSS para usarlo en todo el componente
      style={{
        '--brand-color': effectiveBrandColor,
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}} />

      {/* Fondo desenfocado simulando la página web detrás (como en la captura) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-lg scale-110"
          style={{ backgroundImage: `url(${displayImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Contenedor Principal (Modal) - Estructura fiel a la imagen y sombras de marca */}
      <div
        className="relative z-10 w-[90%] max-w-[500px] h-[500px] sm:h-[500px] rounded-[20px] overflow-hidden flex flex-col bg-[#2a2a2a] transition-shadow duration-500 select-none"
        style={{
          // 1. Sombra exterior oscura para la profundidad de la tarjeta
          // 2. Borde interior (inset 1.5px) usando la variable del color de marca
          // 3. Sombreado degradado interior (inset 50px) usando la misma variable para un efecto premium
          boxShadow:
            '0 25px 60px -15px rgba(0,0,0,0.9), inset 0 0 0 1.5px var(--brand-color), inset 0 0 50px -15px var(--brand-color)',
        }}
      >
        {/* Imagen de Fondo Central */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={displayImage}
            alt={displayCountry}
            className="w-full h-full object-cover object-center"
            loading="eager"
            onError={(e) => {
              // Fallback a URL remota directa si la imagen local falla
              (e.currentTarget as HTMLImageElement).src =
                'https://inmobiliaria.inmosoft.pro/public/assets/images/locations/bcb83c8c9ddaff31bfa8a873df69e6a4ecu.jpg';
            }}
          />
        </div>

        {/* --- PIGMENTOS DE COLOR DE MARCA (Flares / Resplandores) --- */}
        {/* Pigmento inferior izquierdo */}
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full mix-blend-screen blur-[65px] opacity-60 bg-[var(--brand-color)] pointer-events-none z-0 transition-colors duration-500" />
        {/* Pigmento central/superior derecho */}
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full mix-blend-screen blur-[75px] opacity-40 bg-[var(--brand-color)] pointer-events-none z-0 transition-colors duration-500" />

        {/* Gradiente superior oscuro (Fondo sólido para la palabra "ECUADOR") */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#333333] via-[#333333]/80 to-transparent pointer-events-none z-10 flex items-start p-6 sm:p-8">
          <span className="text-white text-[11px] font-bold tracking-[0.15em] uppercase opacity-90 drop-shadow-md">
            {displayCountry}
          </span>
        </div>

        {/* Spinner Central con sombreado de la marca (Glow) */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ filter: 'drop-shadow(0 0 8px var(--brand-color))' }}
        >
          <svg className="w-[56px] h-[56px] animate-spin text-white" viewBox="0 0 50 50">
            {/* Pista gris semi-transparente de fondo */}
            <circle cx="25" cy="25" r="22" fill="none" strokeWidth="2.5" stroke="rgba(255,255,255,0.2)" />
            {/* Segmento blanco principal en movimiento */}
            <circle
              cx="25"
              cy="25"
              r="22"
              fill="none"
              strokeWidth="2.5"
              stroke="#ffffff"
              strokeDasharray="35 100"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Gradiente Inferior Oscuro */}
        <div className="absolute bottom-0 left-0 w-full pt-28 pb-8 px-6 sm:px-8 bg-gradient-to-t from-[#2a2a2a] via-[#2a2a2a]/95 to-transparent flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 sm:gap-0 z-10">
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
                {/* Ahora el logo hereda el color de la marca automáticamente */}
                <path d="M20 4L4 13.5L20 23L36 13.5L20 4Z" fill="var(--brand-color)" />
                <path d="M4 26.5L20 36L36 26.5L36 13.5L20 23L4 13.5L4 26.5Z" fill="var(--brand-color)" fillOpacity="0.8" />
                <circle cx="20" cy="20" r="5" fill="#ffffff" />
                <circle cx="10" cy="15" r="2.5" fill="#ffffff" fillOpacity="0.9" />
                <circle cx="30" cy="15" r="2.5" fill="#ffffff" fillOpacity="0.9" />
              </svg>
            )}
          </div>

          {/* Texto de información dinámico y aleatorio */}
          <p
            key={currentMessage} // Esto fuerza que la animación se reinicie cada vez que el texto cambie
            className="text-[#f4f4f5] font-medium text-[15px] sm:text-[15px] leading-[1.3] text-center sm:text-right drop-shadow-sm max-w-[250px] animate-fade-in"
          >
            {currentMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPortalLoader;
