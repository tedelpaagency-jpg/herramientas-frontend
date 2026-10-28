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
    "/assets/img/ecuador-quilotoa.jpg";

  const logoSrc =
    agency?.logo_icon ||
    agency?.logo ||
    agency?.favicon ||
    agency?.logo_2 ||
    "";

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      role="status"
      aria-live="polite"
      aria-label="Cargando propiedades"
    >
      <div className="relative w-[90%] max-w-[430px] sm:max-w-[460px] bg-[#2e3036] text-white rounded-[26px] overflow-hidden shadow-2xl border border-white/10 transform transition-transform duration-300 scale-100 select-none">
        
        {/* Cabecera con Nombre del País / Destino en mayúsculas espaciadas */}
        <div className="px-5 pt-3.5 pb-2.5 flex items-center justify-between">
          <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.2em] text-white/90 drop-shadow-xs">
            {displayCountry}
          </span>
        </div>

        {/* Tarjeta Visual de Destino con Foto y Spinner Central */}
        <div className="relative mx-3.5 mb-3.5 aspect-[16/11] rounded-2xl overflow-hidden shadow-inner bg-slate-900 group">
          {/* Imagen de fondo */}
          <img
            src={displayImage}
            alt={displayCountry}
            className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
            loading="eager"
          />

          {/* Viñeta degradada para realzar el texto y spinner */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

          {/* Spinner circular en el centro exacto de la fotografía */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Anillo de fondo translúcido */}
              <div className="w-12 h-12 rounded-full border-[2.5px] border-white/20" />
              {/* Anillo giratorio blanco brillante */}
              <div className="absolute inset-0 w-12 h-12 rounded-full border-[2.5px] border-transparent border-t-white animate-spin" />
            </div>
          </div>

          {/* Pie inferior interno con Logo de marca y mensaje en 3 líneas */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-3 pointer-events-none">
            {/* Logo de la agencia / marca */}
            <div className="shrink-0 flex items-center">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={agency?.name || "Logo"}
                  className="h-7 sm:h-8 max-w-[110px] object-contain filter drop-shadow-md"
                />
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-bold">{displayCountry.slice(0, 3)}</span>
                </div>
              )}
            </div>

            {/* Texto descriptivo a la derecha alineado en 3 líneas exactas */}
            <div className="text-left">
              <p className="text-[11px] sm:text-[12px] font-medium leading-[1.3] text-white/95 drop-shadow-md">
                Un momento por favor,<br />
                estamos buscando las<br />
                mejores propiedades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPortalLoader;
