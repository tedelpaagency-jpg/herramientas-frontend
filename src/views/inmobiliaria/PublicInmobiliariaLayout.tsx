'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { getEstateCategoryName } from '@/utils/estateCategories';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  ArrowUpRight,
  Menu,
  X,
  Search,
  ChevronDown,
  Send,
  ArrowUp,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { PublicAgencyConfig, PublicEstateItem } from '@/services/publicInmobiliariaService';
import MobileBottomNavigation from '@/components/layout/MobileBottomNavigation';
import CookieConsentBanner from '@/components/inmobiliaria/CookieConsentBanner';

export const NAVIGATION_PROPERTY_TYPES = [
  { id: '2', label: 'Casas & Residencias' },
  { id: '4', label: 'Departamentos & Lofts' },
  { id: '22', label: 'Terrenos & Lotes' },
  { id: '21', label: 'Suites' },
  { id: '15', label: 'Oficinas' },
  { id: '16', label: 'Oficinas amobladas' },
  { id: '12', label: 'Locales comerciales' },
  { id: '18', label: 'Propiedades Comerciales' },
  { id: '5', label: 'Edificios' },
  { id: '1', label: 'Bodegas & Almacenes' },
  { id: '8', label: 'Galpones' },
  { id: '7', label: 'Fincas' },
  { id: '10', label: 'Haciendas' },
  { id: '19', label: 'Quintas' },
  { id: '11', label: 'Hoteles' },
  { id: '3', label: 'Complejos turísticos' },
  { id: '6', label: 'Empresas' },
  { id: '9', label: 'Gasolineras' },
  { id: '13', label: 'Lotes' },
  { id: '14', label: 'Lotizaciones' },
  { id: '17', label: 'Plantas industriales' },
  { id: '20', label: 'Solares' },
];

export const PROPERTY_TYPE_LABELS: Record<number, string> = {
  1: 'Casa Residencial',
  2: 'Departamento',
  3: 'Terreno / Lote',
  4: 'Local Comercial',
  5: 'Oficina Corporativa',
};

/**
 * Nombre del tipo de propiedad según la BD (estate_type).
 * Usa property_type_name del backend; si falta, el catálogo espejo de estate_type.
 */
export const getPublicEstateTypeLabel = (estate: PublicEstateItem, fallback = 'Propiedad'): string => {
  if (estate.property_type_name && estate.property_type_name.trim() !== '') {
    return estate.property_type_name;
  }
  const name = getEstateCategoryName(estate.property_type);
  return name && name !== 'Inmueble' ? name : fallback;
};

export const getEstatePrimaryImage = (estate: PublicEstateItem): string => {
  if (estate.image && typeof estate.image === 'string') {
    return estate.image;
  }
  if (Array.isArray(estate.images) && estate.images.length > 0) {
    const first = estate.images[0];
    if (typeof first === 'string') return first;
    if (first?.image_path) return first.image_path;
    if (first?.url) return first.url;
  }
  return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80';
};

export const PublicPropertyCard: React.FC<{
  estate: PublicEstateItem;
  currency?: string;
  primaryColor?: string;
  domainParam?: string | null;
}> = ({ estate, currency = 'USD', primaryColor = '#2067F5', domainParam }) => {
  const isRent = Number(estate.property_status) === 1;
  const statusLabel = isRent ? 'En Alquiler' : 'En Venta';
  const typeLabel = getPublicEstateTypeLabel(estate, 'Propiedad');
  const imageUrl = getEstatePrimaryImage(estate);
  const priceFormatted = Number(estate.price || 0).toLocaleString('en-US');
  const detailHref = `/properties/${encodeURIComponent(estate.slug || String(estate.id))}${
    domainParam ? `?domain=${encodeURIComponent(domainParam)}` : ''
  }`;

  const locationText =
    estate.full_address ||
    [estate.address || estate.neighborhood, estate.city, estate.province]
      .filter(Boolean)
      .join(', ') ||
    estate.city ||
    'Quevedo, Ecuador';

  const advisorName = estate.user?.name || estate.agent?.name || 'Asesor Inmobiliario';
  const advisorPhoto = estate.user?.photo || estate.user?.avatar || estate.agent?.photo;
  const advisorEmail = estate.user?.email || estate.agent?.email || estate.agency?.email || '';
  const advisorPhone = estate.user?.phone || estate.agent?.phone || estate.agency?.phone || estate.agency?.whatsapp || '';
  const cleanAdvisorPhone = (advisorPhone || '').replace(/[^0-9]/g, '');
  const agencyName = estate.agency?.name || 'Inmobiliaria';

  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        <Link href={detailHref} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={estate.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80';
            }}
          />
        </Link>
        <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
          <span
            className="px-3.5 py-1 rounded-full text-xs font-extrabold text-white shadow-md uppercase tracking-wider"
            style={{ backgroundColor: isRent ? '#1565FF' : '#2067F5' }}
          >
            {statusLabel}
          </span>
          {Boolean(estate.featured) && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-white shadow-md">
              Destacada
            </span>
          )}
        </div>
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className="px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold">
            {typeLabel}
          </span>
          {Array.isArray(estate.images) && estate.images.length > 1 && (
            <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
              📷 {estate.images.length} fotos
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
            <MapPin className="w-4 h-4 shrink-0 text-[#2067F5]" />
            <span className="truncate">{locationText}</span>
          </div>
          <Link href={detailHref}>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#2067F5] transition-colors line-clamp-2 mb-4 leading-snug">
              {estate.title}
            </h3>
          </Link>

          <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-slate-100 text-xs text-slate-600 font-bold">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-slate-400" />
              <span>{estate.bedrooms ?? 0} Hab.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{estate.bathrooms ?? 0} Baños</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>{estate.size ? `${estate.size} m²` : 'N/A'}</span>
            </div>
          </div>

          {/* Asesor comercial con modal (anti-desbordamiento de nombres) */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsAdvisorModalOpen(true);
            }}
            title={`Ver información de ${advisorName}`}
            className="pt-3 flex items-center gap-2 cursor-pointer group/advisor w-full max-w-full min-w-0 select-none hover:opacity-90 transition-opacity"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-2xs">
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
            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
              <span className="text-[9.5px] text-slate-400 font-semibold leading-none">Asesor</span>
              <span className="text-xs font-bold text-slate-800 truncate leading-tight group-hover/advisor:text-blue-600 group-hover/advisor:underline transition-colors block max-w-full min-w-0">
                {advisorName}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-2 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              {isRent ? 'Canon Mensual' : 'Precio de Venta'}
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              {currency === 'USD' ? '$' : currency} {priceFormatted}
              {isRent && <small className="text-xs font-medium text-slate-500"> /mes</small>}
            </span>
          </div>
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:opacity-90 transition-opacity bg-[#2067F5]"
          >
            <span>Ver Inmueble</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Modal Asesor */}
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
            <button
              type="button"
              onClick={() => setIsAdvisorModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md flex items-center justify-center mb-3">
              {advisorPhoto && !imgError ? (
                <img src={advisorPhoto} alt={advisorName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-black">
                  {advisorName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Asesor Inmobiliario Verificado
            </span>

            <h3 className="text-base font-black text-slate-900 leading-tight">
              {advisorName}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {agencyName}
            </p>

            <div className="w-full mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Propiedad Asignada
              </span>
              <span className="font-bold text-slate-800 line-clamp-1">
                Ref #{estate.id} · {estate.title}
              </span>
            </div>

            <div className="w-full space-y-2 mt-4">
              {cleanAdvisorPhone ? (
                <a
                  href={`https://wa.me/${cleanAdvisorPhone}?text=${encodeURIComponent(
                    `Hola ${advisorName}, vi la propiedad "${estate.title}" (Ref #${estate.id}) y deseo más información.`
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

export const PublicInmobiliariaHeader: React.FC<{
  agency: PublicAgencyConfig;
  domainParam?: string | null;
}> = ({ agency, domainParam }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [offerIndex, setOfferIndex] = useState(0);

  const phoneDisplay = agency.phone || agency.whatsapp || '+593 99 999 9999';
  const phoneHref = (agency.phone || agency.whatsapp || '').replace(/[^0-9+]/g, '') || '593999999999';
  const logoUrl = agency.logo_2 || agency.logo;
  const loginUrl = agency.portal_url || '/login';

  const withDomain = (path: string) => {
    if (!domainParam) return path;
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}domain=${encodeURIComponent(domainParam)}`;
  };

  const offerSlides = [
    'Encuentra tu Inmueble Ideal en Venta y Alquiler con Respaldo Legal Garantizado.',
    'Asesoría Jurídica y Financiera Exclusiva para la Compra de tu Próximo Hogar.',
    'Consigna tu Propiedad con Nosotros y Obtén Máxima Visibilidad y Clientes Verificados.',
  ];

  const handlePrevOffer = () => {
    setOfferIndex((prev) => (prev === 0 ? offerSlides.length - 1 : prev - 1));
  };
  const handleNextOffer = () => {
    setOfferIndex((prev) => (prev === offerSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* 1. Barra de Ofertas Superior Azul (#2067F5) como en /travel-agency-03 */}
      <div className="bg-[#2067F5] text-white text-xs sm:text-sm py-2 px-4 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevOffer}
            className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-[#2067F5] transition-colors shrink-0"
            aria-label="Anterior"
          >
            ‹
          </button>
          <div className="text-center font-medium truncate px-2 flex-1">
            <span>{offerSlides[offerIndex]}</span>
          </div>
          <button
            type="button"
            onClick={handleNextOffer}
            className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-[#2067F5] transition-colors shrink-0"
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>

      {/* 2. Cabecera Principal Blanca (Header Style 2 Travel Agency 3) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Logo a la izquierda */}
          <Link href={withDomain('/')} className="flex items-center gap-3 shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={agency.name}
                className="h-10 sm:h-11 w-auto max-w-[220px] object-contain"
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md bg-[#2067F5]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-none">
                    {agency.name || 'Inmobiliaria'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Bienes Raíces
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* Menú de navegación en el centro */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-800">
            <Link href={withDomain('/')} className="hover:text-[#2067F5] transition-colors">
              Inicio
            </Link>

            {/* Dropdown Propiedades con todos los campos y operaciones */}
            <div className="relative group">
              <Link
                href={withDomain('/properties')}
                className="flex items-center gap-1 hover:text-[#2067F5] transition-colors py-2"
              >
                <span>Propiedades</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </Link>
              <div className="absolute top-full left-0 hidden group-hover:block w-72 max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-100 py-3 text-xs font-semibold z-50">
                <div className="px-4 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Operaciones
                </div>
                <Link
                  href={withDomain('/properties')}
                  className="block px-4 py-1.5 hover:bg-slate-50 hover:text-[#2067F5]"
                >
                  Todas las Propiedades
                </Link>
                <Link
                  href={withDomain('/properties?property_status=2')}
                  className="block px-4 py-1.5 hover:bg-slate-50 hover:text-[#2067F5]"
                >
                  En Venta
                </Link>
                <Link
                  href={withDomain('/properties?property_status=1')}
                  className="block px-4 py-1.5 hover:bg-slate-50 hover:text-[#2067F5]"
                >
                  En Alquiler
                </Link>
                <Link
                  href={withDomain('/properties?property_status=3')}
                  className="block px-4 py-1.5 hover:bg-slate-50 hover:text-[#2067F5]"
                >
                  En Remate
                </Link>

                <div className="px-4 pt-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-t border-slate-100 mt-2">
                  Tipos de Inmueble
                </div>
                {NAVIGATION_PROPERTY_TYPES.map((type) => (
                  <Link
                    key={type.id}
                    href={withDomain(`/properties?property_type=${type.id}`)}
                    className="block px-4 py-1.5 hover:bg-slate-50 hover:text-[#2067F5] truncate"
                  >
                    {type.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href={withDomain('/services')} className="hover:text-[#2067F5] transition-colors">
              Servicios
            </Link>
            <Link href={withDomain('/about')} className="hover:text-[#2067F5] transition-colors">
              Nosotros
            </Link>
            <Link href={withDomain('/contact')} className="hover:text-[#2067F5] transition-colors">
              Contacto
            </Link>
            <Link href={withDomain('/privacy')} className="hover:text-[#2067F5] transition-colors">
              Privacidad
            </Link>
          </nav>

          {/* Área derecha: ¿Necesitas Ayuda? + Buscador Circular + Botón Login Píldora Negra */}
          <div className="hidden sm:flex items-center gap-5 shrink-0">
            {/* Teléfono de ayuda */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-800">
                <Phone className="w-4 h-4" />
              </div>
              <div className="leading-tight text-left">
                <span className="text-[11px] font-semibold text-slate-500 block">¿Necesitas Ayuda?</span>
                <a
                  href={`tel:${phoneHref}`}
                  className="text-sm font-extrabold text-slate-900 hover:text-[#2067F5] transition-colors"
                >
                  {phoneDisplay}
                </a>
              </div>
            </div>

            {/* Botón circular de búsqueda */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-[#2067F5] hover:border-[#2067F5] hover:text-white transition-colors cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSearchOpen(false);
                      window.location.href = withDomain(
                        `/properties${searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : ''}`
                      );
                    }}
                    className="flex items-center gap-2 border-b border-slate-200 pb-2"
                  >
                    <input
                      type="text"
                      placeholder="Buscar por ciudad o sector..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs text-slate-800 outline-none"
                      autoFocus
                    />
                    <button type="submit" className="text-slate-600 hover:text-[#2067F5]">
                      <Search className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Botón Píldora Negra Login */}
            <a
              href={loginUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-bold hover:bg-[#2067F5] transition-colors shadow-sm"
            >
              <svg width={14} height={14} viewBox="0 0 15 15" fill="currentColor">
                <path d="M7.50105 7.78913C9.64392 7.78913 11.3956 6.03744 11.3956 3.89456C11.3956 1.75169 9.64392 0 7.50105 0C5.35818 0 3.60652 1.75169 3.60652 3.89456C3.60652 6.03744 5.35821 7.78913 7.50105 7.78913ZM14.1847 10.9014C14.0827 10.6463 13.9467 10.4082 13.7936 10.1871C13.0113 9.0306 11.8038 8.2653 10.4433 8.07822C10.2732 8.06123 10.0861 8.09522 9.95007 8.19727C9.23578 8.72448 8.38546 8.99658 7.50108 8.99658C6.61671 8.99658 5.76638 8.72448 5.05209 8.19727C4.91603 8.09522 4.72895 8.04421 4.5589 8.07822C3.19835 8.2653 1.97387 9.0306 1.20857 10.1871C1.05551 10.4082 0.919443 10.6633 0.817424 10.9014C0.766415 11.0034 0.783407 11.1225 0.834416 11.2245C0.970484 11.4626 1.14054 11.7007 1.2936 11.9048C1.53168 12.2279 1.78679 12.517 2.07592 12.7891C2.31401 13.0272 2.58611 13.2483 2.85824 13.4694C4.20177 14.4728 5.81742 15 7.48409 15C9.15076 15 10.7664 14.4728 12.1099 13.4694C12.382 13.2653 12.6541 13.0272 12.8923 12.7891C13.1644 12.517 13.4365 12.2279 13.6746 11.9048C13.8446 11.6837 13.9977 11.4626 14.1338 11.2245C14.2188 11.1225 14.2358 11.0034 14.1847 10.9014Z" />
              </svg>
              <span>Login</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-100 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            aria-label="Abrir navegación móvil"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-slate-600" /> : <Menu className="w-4 h-4 text-slate-600" />}
            <span style={{ fontSize: '12px', fontWeight: 800 }}>{mobileMenuOpen ? 'Cerrar' : 'Navegación'}</span>
          </button>
        </div>

        {/* Menú Móvil */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-5 py-4 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-bold text-slate-800">
              <Link href={withDomain('/')} onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                Inicio
              </Link>
              <Link href={withDomain('/properties')} onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                Catálogo de Propiedades
              </Link>
              <Link
                href={withDomain('/properties?property_status=2')}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Propiedades en Venta
              </Link>
              <Link
                href={withDomain('/properties?property_status=1')}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Propiedades en Alquiler
              </Link>
              <Link
                href={withDomain('/properties?property_status=3')}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Propiedades en Remate
              </Link>
              <Link
                href={withDomain('/services')}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Servicios
              </Link>
              <Link
                href={withDomain('/about')}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Nosotros
              </Link>
              <Link
                href={withDomain('/contact')}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Contacto
              </Link>
              <Link
                href={withDomain('/privacy')}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Privacidad
              </Link>
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={loginUrl}
                className="w-full py-2.5 rounded-full bg-[#111111] text-white text-xs font-bold text-center flex items-center justify-center gap-2"
              >
                <span>Acceder (Login)</span>
              </a>
            </div>
          </div>
        )}

        {/* Barra de Navegación Inferior Móvil */}
        <MobileBottomNavigation agency={agency} />
      </header>
    </>
  );
};

export const PublicInmobiliariaFooter: React.FC<{
  agency: PublicAgencyConfig;
  domainParam?: string | null;
}> = ({ agency, domainParam }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(typeof window !== 'undefined' && window.scrollY > 220);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const withDomain = (path: string) => {
    if (!domainParam) return path;
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}domain=${encodeURIComponent(domainParam)}`;
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSent(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSent(false);
    }, 3000);
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const phoneDisplay = agency.phone || agency.whatsapp || '+593 0984113967';
  const cleanPhone = phoneDisplay.replace(/[^0-9]/g, '') || '593984113967';
  const emailDisplay = agency.email || 'informacion@immobillis.com';
  const locationDisplay = [agency.city || 'Quevedo', agency.country || 'Ecuador'].filter(Boolean).join(' - ');

  return (
    <>
      <footer id="contacto" className="bg-[#0b1120] text-slate-300 pt-14 pb-8 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
            {/* Columna 1: Información */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">Información</h4>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{locationDisplay}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                  <a href={`tel:${phoneDisplay}`} className="hover:text-white transition-colors">
                    {phoneDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                  <a href={`mailto:${emailDisplay}`} className="hover:text-white transition-colors">
                    {emailDisplay}
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 2: Menu */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">Menu</h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <Link href={withDomain('/')} className="hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href={withDomain('/properties')} className="hover:text-white transition-colors">
                    Propiedades
                  </Link>
                </li>
                <li>
                  <Link href={withDomain('/about')} className="hover:text-white transition-colors">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href={withDomain('/services')} className="hover:text-white transition-colors">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href={withDomain('/contact')} className="hover:text-white transition-colors">
                    Contactanos
                  </Link>
                </li>
                <li>
                  <a
                    href="#unsubscribe"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Tu solicitud para cancelar la suscripción ha sido procesada.');
                    }}
                    className="hover:text-white transition-colors text-slate-400"
                  >
                    Cancelar subscripción
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Horario de atencion */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">Horario de atencion</h4>
              <p className="text-xs text-slate-300">08:00 am a 06:00 pm</p>
            </div>

            {/* Columna 4: Boletines */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">Boletines</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Se parte de {agency.commercial_name || agency.name || 'immobillis'} , ingresa tu correo electronico para obtener oferta de propiedades
              </p>
              <form onSubmit={handleNewsletterSubmit} className="relative flex items-center">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Tu correo electronico"
                  className="w-full bg-[#131b2e] border border-slate-700/80 rounded-full py-2.5 pl-4 pr-11 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Enviar correo"
                  className="absolute right-3 text-[#2563eb] hover:text-[#3b82f6] transition-colors"
                >
                  <Send className="w-4 h-4 -rotate-45" />
                </button>
              </form>
              {newsletterSent && (
                <span className="text-[11px] text-emerald-400 mt-2 block font-semibold">
                  ¡Gracias por suscribirte!
                </span>
              )}
            </div>
          </div>

          {/* Sub-footer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p className="m-0">
              ©{new Date().getFullYear()} {agency.commercial_name || agency.name || 'Immobillis'}. Todos los derechos reservados.
            </p>
            <div>
              <Link href={withDomain('/privacy')} className="hover:text-white transition-colors">
                Politica de privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Botones Flotantes (WhatsApp + Subir arriba) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-3 pointer-events-none">
        {/* Boton WhatsApp */}
        <a
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="pointer-events-auto w-[52px] h-[52px] rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 no-underline border-2 border-white ring-2 ring-[#25D366]/20"
          title="Contactar por WhatsApp"
        >
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>

        {/* Boton Subir arriba */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Subir arriba"
            className="pointer-events-auto w-11 h-11 rounded-full bg-[#EAB308] hover:bg-[#ca8a04] text-slate-900 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 font-black border-2 border-white cursor-pointer animate-in fade-in zoom-in-75 duration-200"
            title="Volver al inicio"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Banner de Aviso de Cookies */}
      <CookieConsentBanner agency={agency} domainParam={domainParam} />
    </>
  );
};
