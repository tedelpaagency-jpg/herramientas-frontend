'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  ArrowUpRight,
  X,
  ShieldCheck,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { PublicEstateItem } from '@/services/publicInmobiliariaService';

export const getEstateImages = (estate: PublicEstateItem): string[] => {
  const list: string[] = [];
  if (Array.isArray(estate.images) && estate.images.length > 0) {
    estate.images.forEach((img) => {
      if (typeof img === 'string') list.push(img);
      else if (img?.url) list.push(img.url);
      else if (img?.image_path) list.push(img.image_path);
    });
  }
  if (estate.image && typeof estate.image === 'string' && !list.includes(estate.image)) {
    list.unshift(estate.image);
  }
  if (list.length === 0) {
    list.push(
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'
    );
  }
  return list;
};

interface AirbnbPropertyCardProps {
  estate: PublicEstateItem;
  currency?: string;
  primaryColor?: string;
  domainParam?: string | null;
  isSelected?: boolean;
  onSelect?: (estate: PublicEstateItem) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const AirbnbPropertyCard: React.FC<AirbnbPropertyCardProps> = ({
  estate,
  currency = 'USD',
  primaryColor = '#00a884',
  domainParam,
  isSelected = false,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}) => {
  const images = getEstateImages(estate);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [heartPulsing, setHeartPulsing] = useState(false);

  const isRent = Number(estate.property_status) === 1;
  const priceNum = Number(estate.price || 0);
  const priceFormatted = priceNum.toLocaleString('en-US');

  const detailHref = `/properties/${encodeURIComponent((estate.slug || String(estate.id)).trim())}${
    domainParam ? `?domain=${encodeURIComponent(domainParam)}` : ''
  }`;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
    setHeartPulsing(true);
    setTimeout(() => setHeartPulsing(false), 300);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(estate);
    }
  };

  const locationSubtitle =
    estate.full_address ||
    [estate.address || estate.neighborhood, estate.city, estate.province]
      .filter(Boolean)
      .join(', ') ||
    estate.city ||
    'Quevedo, Ecuador';

  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const advisorName = estate.user?.name || estate.agent?.name || 'Asesor Inmobiliario';
  const advisorPhoto = estate.user?.photo || estate.user?.avatar || estate.agent?.photo;
  const advisorEmail = estate.user?.email || estate.agent?.email || estate.agency?.email || '';
  const advisorPhone = estate.user?.phone || estate.agent?.phone || estate.agency?.phone || estate.agency?.whatsapp || '';
  const advisorRole = estate.user?.role || estate.agent?.role || 'Asesor Inmobiliario';
  const cleanAdvisorPhone = (advisorPhone || '').replace(/[^0-9]/g, '');
  const agencyName = estate.agency?.name || 'Agencia Inmobiliaria';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative flex flex-col cursor-pointer rounded-2xl p-2 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isSelected
          ? 'ring-2 ring-slate-900 bg-slate-100/90 shadow-md scale-[1.01]'
          : 'bg-white hover:bg-slate-50/90 hover:shadow-md border border-slate-200/80 hover:border-slate-300'
      } active:scale-[0.99]`}
    >
      {/* Carrusel de fotos adaptado para 3 columnas estilo Airbnb */}
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 shadow-2xs border border-slate-200/60">
        <img
          src={images[currentIdx]}
          alt={estate.title}
          className="w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80';
          }}
        />

        {/* Badges superiores reducidos */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 pointer-events-none">
          {Boolean(estate.featured) ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/95 text-slate-900 shadow-2xs backdrop-blur-md border border-white/40">
              Favorito
            </span>
          ) : (
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-xs backdrop-blur-md"
              style={{ backgroundColor: primaryColor }}
            >
              {isRent ? 'Alquiler' : 'En Venta'}
            </span>
          )}
        </div>

        {/* Botón Favorito / Corazón compacto */}
        <button
          type="button"
          onClick={toggleFavorite}
          className={`absolute top-1.5 right-1.5 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-150 hover:scale-110 active:scale-90 ${
            heartPulsing ? 'scale-125' : ''
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart
            className={`w-4 h-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] transition-colors duration-150 ${
              isFavorite
                ? 'fill-rose-500 text-rose-500'
                : 'fill-black/30 text-white hover:fill-black/50'
            }`}
          />
        </button>

        {/* Flechas de navegación de fotos en la tarjeta */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/95 hover:bg-white active:scale-90 text-slate-800 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/95 hover:bg-white active:scale-90 text-slate-800 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
              aria-label="Siguiente foto"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Puntos de paginación */}
            <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-1 pointer-events-none">
              {images.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-full transition-all duration-200 ${
                    idx === currentIdx
                      ? 'w-3 h-1 bg-white shadow-xs'
                      : 'w-1 h-1 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Contenido descriptivo compacto */}
      <div className="mt-2 px-1 space-y-1">
        {/* Fila 1: Título */}
        <h3 className="font-extrabold text-xs sm:text-[13px] text-slate-900 leading-snug truncate" title={estate.title}>
          {estate.title}
        </h3>

        {/* Fila 2: Subtítulo / Ubicación */}
        <p className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{locationSubtitle}</span>
        </p>

        {/* Fila Asesor (Al hacer clic en el nombre o foto abre modal de información) */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsAdvisorModalOpen(true);
          }}
          title={`Ver información del asesor: ${advisorName}`}
          className="flex items-center gap-1.5 pt-0.5 text-[11px] group/advisor cursor-pointer select-none w-fit"
        >
          <div className="relative w-5 h-5 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-300 flex items-center justify-center shadow-2xs">
            {advisorPhoto && !imgError ? (
              <img
                src={advisorPhoto}
                alt={advisorName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-[9px] font-black text-slate-700">
                {advisorName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="truncate text-[10.5px] sm:text-[11px] font-bold text-slate-700 group-hover/advisor:text-blue-700 group-hover/advisor:underline transition-colors">
            {advisorName}
          </span>
        </div>

        {/* Fila 3: Especificaciones compactas */}
        <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold pt-0.5">
          {estate.bedrooms ? (
            <span className="flex items-center gap-0.5">
              <Bed className="w-3 h-3 text-slate-400" />
              <span>{estate.bedrooms} hab.</span>
            </span>
          ) : null}
          {estate.bathrooms ? (
            <span className="flex items-center gap-0.5">
              <Bath className="w-3 h-3 text-slate-400" />
              <span>{estate.bathrooms} ba.</span>
            </span>
          ) : null}
          {estate.covered_area || estate.size ? (
            <span className="flex items-center gap-0.5">
              <Maximize2 className="w-3 h-3 text-slate-400" />
              <span>{estate.covered_area || estate.size} m²</span>
            </span>
          ) : null}
        </div>

        {/* Fila 4: Precio destacado */}
        <div className="pt-1.5 flex items-baseline justify-between gap-1 border-t border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-[13px] sm:text-[14px] font-black text-slate-900 tracking-tight">
              ${priceFormatted} {currency}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
              {isRent ? '/mes' : ''}
            </span>
          </div>

          <span
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(estate);
            }}
            className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
            title="Centrar en el mapa"
          >
            <span>Mapa</span>
          </span>
        </div>

        {/* Fila 5: Botón Ver Propiedad */}
        <div className="pt-1">
          <Link
            href={detailHref}
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: primaryColor }}
            className="w-full py-1.5 sm:py-2 px-3 rounded-xl text-white font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 active:scale-95 transition-all text-center tracking-tight"
          >
            <span>Ver Propiedad</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* Modal con la Información Completa del Asesor */}
      {isAdvisorModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999999] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-150"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsAdvisorModalOpen(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-200"
          >
            {/* Botón cerrar X */}
            <button
              type="button"
              onClick={() => setIsAdvisorModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Avatar grande del Asesor */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md flex items-center justify-center mb-3">
              {advisorPhoto && !imgError ? (
                <img src={advisorPhoto} alt={advisorName} className="w-full h-full object-cover" />
              ) : (
                <div
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  className="w-full h-full flex items-center justify-center text-2xl font-black"
                >
                  {advisorName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Badge Asesor Verificado */}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Asesor Inmobiliario Verificado
            </span>

            {/* Nombre y Cargo */}
            <h3 className="text-base font-black text-slate-900 leading-tight">
              {advisorName}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {agencyName}
            </p>

            {/* Referencia de la propiedad */}
            <div className="w-full mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Propiedad Asignada
              </span>
              <span className="font-bold text-slate-800 line-clamp-1">
                Ref #{estate.id} · {estate.title}
              </span>
            </div>

            {/* Botones de Contacto Directo */}
            <div className="w-full space-y-2 mt-4">
              {cleanAdvisorPhone ? (
                <a
                  href={`https://wa.me/${cleanAdvisorPhone}?text=${encodeURIComponent(
                    `Hola ${advisorName}, vi la propiedad "${estate.title}" (Ref #${estate.id}) en la web y me gustaría recibir más información.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all no-underline"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Contactar por WhatsApp</span>
                </a>
              ) : null}

              {cleanAdvisorPhone ? (
                <a
                  href={`tel:${cleanAdvisorPhone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all no-underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>Llamar: {advisorPhone}</span>
                </a>
              ) : null}

              {advisorEmail ? (
                <a
                  href={`mailto:${advisorEmail}?subject=${encodeURIComponent(
                    `Consulta sobre propiedad #${estate.id}: ${estate.title}`
                  )}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all no-underline truncate"
                >
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">{advisorEmail}</span>
                </a>
              ) : null}
            </div>

            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setIsAdvisorModalOpen(false)}
              className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AirbnbPropertyCard;
