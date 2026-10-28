"use client";

import React from "react";
import Image from "next/image";
import { PublicAgencyConfig } from "@/services/publicInmobiliariaService";

interface PublicPortalLoaderProps {
  countryName?: string;
  countryImage?: string;
  agency?: PublicAgencyConfig | any;
  message?: string;
  isOpen?: boolean;
}

export const PublicPortalLoader: React.FC<PublicPortalLoaderProps> = ({
  countryName,
  countryImage,
  agency,
  message = "Un momento por favor, estamos buscando las mejores propiedades.",
  isOpen = true,
}) => {
  if (!isOpen) return null;

  const displayCountry =
    countryName ||
    agency?.country_name ||
    agency?.country ||
    agency?.province ||
    "ECUADOR";

  // Foto escénica del país (por defecto hermosa vista de Ecuador / Quilotoa)
  const displayImage =
    countryImage ||
    agency?.country_image ||
    "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=85";

  const logoSrc =
    agency?.logo_icon ||
    agency?.logo ||
    agency?.favicon ||
    "/assets/img/logo/logo.png";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      role="status"
      aria-live="polite"
      aria-label="Cargando propiedades"
    >
      <div className="relative w-[92%] max-w-[460px] bg-[#1e2329]/95 text-white rounded-[28px] p-5 sm:p-6 shadow-2xl border border-white/10 overflow-hidden transform transition-transform duration-300 scale-100">
        
        {/* Cabecera con Nombre del País / Destino en mayúsculas espaciadas */}
        <div className="mb-3 px-1">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300/90 drop-shadow-xs">
            {displayCountry}
          </span>
        </div>

        {/* Tarjeta Visual de Destino con Foto y Spinner Central */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-inner bg-slate-900 group">
          {/* Imagen de fondo */}
          <img
            src={displayImage}
            alt={displayCountry}
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
            loading="eager"
          />

          {/* Viñeta degradada sutil para realzar el texto y spinner */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

          {/* Spinner circular en el centro exacto de la fotografía */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Anillo de fondo translúcido */}
              <div className="w-12 h-12 rounded-full border-[3px] border-white/20" />
              {/* Anillo giratorio blanco brillante */}
              <div className="absolute inset-0 w-12 h-12 rounded-full border-[3px] border-transparent border-t-white animate-spin" />
            </div>
          </div>

          {/* Pie inferior interno con Logo de marca y mensaje */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 pointer-events-none">
            {/* Logo de la agencia / marca */}
            <div className="shrink-0 flex items-center">
              {logoSrc ? (
                <div className="w-9 h-9 rounded-xl bg-black/40 backdrop-blur-md p-1.5 border border-white/10 flex items-center justify-center shadow-lg">
                  <img
                    src={logoSrc}
                    alt={agency?.name || "Logo"}
                    className="max-h-full max-w-full object-contain filter drop-shadow"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-emerald-500/80 backdrop-blur-md flex items-center justify-center text-white font-black text-xs shadow-lg">
                  {displayCountry.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Texto descriptivo a la derecha */}
            <div className="text-right">
              <p className="text-[12px] sm:text-[13px] font-semibold text-white/95 leading-snug drop-shadow-md max-w-[240px]">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPortalLoader;
