'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Search,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  User,
  Tag,
  KeyRound,
  Trees,
  Building2,
  DollarSign,
  ArrowLeftRight,
  ChevronDown,
  Home,
} from 'lucide-react';
import { DEFAULT_REAL_ESTATE_CATEGORIES, DEFAULT_REAL_ESTATE_PROPERTIES } from '@/constants/realEstateDefaults';

interface PortalLivePreviewProps {
  agencyName: string;
  logoUrl?: string;
  bannerImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  categoriesTitle?: string;
  categoriesSubtitle?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
  aboutTitle?: string;
  aboutText?: string;
  ctaText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  phone?: string;
  whatsapp?: string;
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
  details?: any;
}

export const PortalLivePreview: React.FC<PortalLivePreviewProps> = ({
  agencyName = 'Inmobiliaria Premier',
  logoUrl,
  bannerImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
  heroTitle,
  heroSubtitle,
  categoriesTitle,
  categoriesSubtitle,
  featuredTitle,
  featuredSubtitle,
  aboutTitle,
  aboutText,
  ctaText,
  primaryColor = '#00a884',
  secondaryColor = '#161a1b',
  phone = '+52 55 1234 5678',
  whatsapp = '+52 55 1234 5678',
  deviceMode = 'desktop',
  details = {},
}) => {
  const displayHeroTitle = heroTitle || details?.hero_title || 'Encuentra la Propiedad de tus Sueños';
  const displayHeroSubtitle = heroSubtitle || details?.hero_subtitle || 'Las mejores opciones en venta y renta con asesoría jurídica y crediticia garantizada.';
  const displayCatTitle = categoriesTitle || details?.categories_title || 'Categorías Principales';
  const displayCatSubtitle = categoriesSubtitle || details?.categories_subtitle || 'Explora inmuebles por tipo de propiedad';
  const displayFeatTitle = featuredTitle || details?.featured_title || 'Propiedades Destacadas';
  const displayFeatSubtitle = featuredSubtitle || details?.featured_subtitle || 'Inmuebles exclusivos listos para habitar';
  const displayAboutTitle = aboutTitle || details?.about_title || 'Tu Aliado Inmobiliario de Confianza';
  const displayAboutText = aboutText || details?.about_text || 'Acompañamos a familias e inversionistas a tomar la mejor decisión patrimonial con total transparencia y seguridad notarial.';
  const displayCtaText = ctaText || details?.cta_title || '¿Deseas vender o consignar tu inmueble? Lo comercializamos al mejor precio de mercado.';

  const containerWidth = deviceMode === 'mobile' ? 'max-w-[375px]' : deviceMode === 'tablet' ? 'max-w-[768px]' : 'w-full';

  return (
    <div className={`mx-auto transition-all duration-300 font-sans text-slate-800 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden ${containerWidth}`}>
      {/* 1. Topbar */}
      <div
        className="px-4 py-1.5 text-[11px] font-semibold text-white flex justify-between items-center"
        style={{ backgroundColor: secondaryColor }}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
          <span className="truncate">{agencyName}: Propiedades Exclusivas con Asesoría Notarial</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 shrink-0 text-slate-300">
          <span>Tel: {phone}</span>
        </div>
      </div>

      {/* 2. Header / Nav */}
      <div className="px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={agencyName} className="h-11 sm:h-12 max-w-[200px] object-contain transition-all" />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm" style={{ backgroundColor: primaryColor }}>
                {agencyName.charAt(0)}
              </div>
              <span className="font-black text-base tracking-tight text-slate-900">{agencyName}</span>
            </div>
          )}
        </div>

        {/* Navigation Items (Desktop Centered) */}
        <div className="hidden md:flex items-center justify-center gap-6 text-xs font-semibold text-slate-700 flex-grow">
          <span className="cursor-pointer" style={{ color: primaryColor }}>Inicio</span>
          <span className="cursor-pointer hover:text-slate-900">Propiedades</span>
          <span className="cursor-pointer hover:text-slate-900">Conócenos</span>
          <span className="cursor-pointer hover:text-slate-900">Contacto</span>
        </div>

        {/* Action Button: Acceso Agentes */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Acceso Agentes</span>
          </span>
        </div>
      </div>

      {/* 3. Hero Section (Dynamic Banner + Real Estate Search) */}
      {(() => {
        const rawMediaType = details?.hero_media_type;
        const bannerVideo = details?.banner_video;
        const isVideo =
          rawMediaType === 'video' ||
          (!rawMediaType && Boolean(bannerVideo)) ||
          (Boolean(bannerImage) && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(bannerImage)) ||
          (!rawMediaType && !bannerImage);

        const videoSrc =
          bannerVideo ||
          (bannerImage && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(bannerImage)
            ? bannerImage
            : '/assets/video/home4-banner-video.mp4');

        return (
          <div
            className="relative px-6 py-14 sm:py-20 text-white text-center flex flex-col items-center justify-center overflow-hidden"
            style={
              !isVideo && bannerImage
                ? {
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)), url(${bannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '340px',
                  }
                : { minHeight: '340px', position: 'relative' }
            }
          >
            {isVideo && (
              <>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={videoSrc}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/50 to-slate-950/70 pointer-events-none" />
              </>
            )}

            <div className="relative z-10 flex flex-col items-center w-full">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-3 shadow-sm text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Portal Oficial • Bienes Raíces
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold max-w-xl leading-tight mb-2 text-white drop-shadow-md">
                {displayHeroTitle}
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 max-w-lg mb-6 leading-relaxed drop-shadow-xs">
                {displayHeroSubtitle}
              </p>

              {/* Real Estate Search Widget Mockup */}
              {deviceMode === 'mobile' ? (
                /* Mobile Booking Mockup (matches screenshot) */
                <div className="w-full bg-white rounded-3xl p-4 shadow-2xl text-slate-800 text-left">
                  {/* Top Mobile Tabs */}
                  <div className="flex items-center justify-around border-b border-slate-100 pb-2 mb-3">
                    <div className="flex flex-col items-center">
                      <Tag className="w-4 h-4 text-slate-800 mb-0.5" />
                      <span className="text-[10px] font-extrabold text-slate-800 tracking-wider">VENTA</span>
                      <div className="w-8 h-[2.5px] bg-slate-800 rounded-full mt-1" />
                    </div>
                    <div className="flex flex-col items-center opacity-50">
                      <KeyRound className="w-4 h-4 text-slate-400 mb-0.5" />
                      <span className="text-[10px] font-extrabold text-slate-500 tracking-wider">ALQUILER</span>
                      <div className="h-[2.5px] mt-1" />
                    </div>
                    <div className="flex flex-col items-center opacity-50">
                      <Trees className="w-4 h-4 text-slate-400 mb-0.5" />
                      <span className="text-[10px] font-extrabold text-slate-500 tracking-wider">TERRENOS</span>
                      <div className="h-[2.5px] mt-1" />
                    </div>
                  </div>

                  {/* DESTINO */}
                  <div className="mb-2.5">
                    <span className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">DESTINO</span>
                    <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50">
                      <span className="text-xs font-semibold text-slate-400">¿En donde estas buscando?</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* OPERACIÓN & PROPIEDAD */}
                  <div className="grid grid-cols-2 gap-2 mb-2.5">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">OPERACIÓN</span>
                      <div className="flex items-center justify-between border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50/50">
                        <div className="flex items-center gap-1.5 truncate">
                          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                          <span className="text-xs font-bold text-slate-800">Venta</span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">PROPIEDAD</span>
                      <div className="flex items-center justify-between border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50/50">
                        <div className="flex items-center gap-1.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                          <span className="text-xs font-bold text-slate-800">Depto.</span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* PRESUPUESTO */}
                  <div className="mb-3">
                    <span className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">PRESUPUESTO</span>
                    <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50">
                      <div className="flex items-center gap-1.5 truncate">
                        <DollarSign className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span className="text-xs font-bold text-slate-800">Cualquier precio</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                  </div>

                  {/* Dark capsule button */}
                  <button
                    type="button"
                    className="w-full h-11 bg-[#2b2e35] text-white rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>BUSCAR PROPIEDADES</span>
                  </button>
                </div>
              ) : (
                /* Desktop Booking Mockup (matches inmobiliaria.inmosoft.pro) */
                <div className="w-full max-w-2xl text-slate-800">
                  {/* Top Tabs */}
                  <div className="flex items-center gap-2 mb-[-12px] ml-4 relative z-10">
                    <span
                      className="px-4 py-2 rounded-full text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>En Venta</span>
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white text-slate-700 text-xs font-bold shadow-sm border border-slate-200 flex items-center gap-1.5 cursor-pointer">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>En Renta</span>
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white text-slate-700 text-xs font-bold shadow-sm border border-slate-200 flex items-center gap-1.5 cursor-pointer hidden sm:flex">
                      <Trees className="w-3.5 h-3.5" />
                      <span>Terrenos & Lotes</span>
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white text-slate-700 text-xs font-bold shadow-sm border border-slate-200 flex items-center gap-1.5 cursor-pointer hidden sm:flex">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Comercial</span>
                    </span>
                  </div>

                  {/* Card container */}
                  <div className="bg-white rounded-3xl p-3 shadow-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-2 text-left">
                    {/* Ubicación */}
                    <div className="flex-1 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-slate-100 w-full">
                      <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">UBICACIÓN</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                        <span className="text-xs font-bold text-slate-700 truncate">Ciudad, colonia o zona...</span>
                      </div>
                    </div>

                    {/* Tipo de Inmueble */}
                    <div className="flex-1 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-slate-100 w-full hidden sm:block">
                      <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">TIPO DE INMUEBLE</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                        <span className="text-xs font-bold text-slate-700 truncate">Todas las propiedades</span>
                      </div>
                    </div>

                    {/* Presupuesto */}
                    <div className="flex-1 px-3 py-1.5 w-full hidden sm:block">
                      <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">PRESUPUESTO MÁXIMO</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <DollarSign className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                        <span className="text-xs font-bold text-slate-700 truncate">Cualquier precio</span>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      className="w-full sm:w-auto px-6 py-3 rounded-full text-white font-black text-xs shrink-0 flex items-center justify-center gap-2 shadow-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Buscar Propiedades</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 4. Value Propositions Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border-b border-slate-100 text-slate-700">
        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
          <span className="text-xs font-bold">Propiedades 100% Verificadas</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
          <span className="text-xs font-bold">Certeza Jurídica Notarial</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <Phone className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
          <span className="text-xs font-bold">Asesoría de Crédito Gratis</span>
        </div>
      </div>

      {/* 5. Categorías Destacadas Preview */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">{displayCatTitle}</h3>
            <span className="text-[11px] text-slate-500">{displayCatSubtitle}</span>
          </div>
          <span className="text-xs font-bold cursor-pointer" style={{ color: primaryColor }}>
            Ver todas &rarr;
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {DEFAULT_REAL_ESTATE_CATEGORIES.slice(0, 4).map((cat) => (
            <div key={cat.id} className="relative rounded-xl overflow-hidden h-20 shadow-xs group cursor-pointer">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-2">
                <span className="text-white text-[11px] font-bold truncate leading-tight">{cat.name}</span>
                <span className="text-[9px] text-slate-300">{cat.count} Disponibles</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Featured Property Card Preview */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">{displayFeatTitle}</h3>
            <span className="text-[11px] text-slate-500">{displayFeatSubtitle}</span>
          </div>
          <span className="text-xs font-bold cursor-pointer" style={{ color: primaryColor }}>
            Catálogo completo &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEFAULT_REAL_ESTATE_PROPERTIES.slice(0, 2).map((prop) => (
            <div key={prop.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="relative h-36 overflow-hidden">
                <img src={prop.image || ''} alt={prop.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase text-white shadow-xs" style={{ backgroundColor: primaryColor }}>
                  {prop.property_status === 2 ? 'En Renta' : 'En Venta'}
                </span>
                <button type="button" className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-slate-600 flex items-center justify-center hover:text-red-500">
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                  <span className="truncate">{prop.city}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                  {prop.title}
                </h4>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Precio:</span>
                    <span className="text-xs font-extrabold" style={{ color: primaryColor }}>
                      ${prop.price.toLocaleString()} USD
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" /> {prop.bedrooms}</span>
                    <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" /> {prop.bathrooms}</span>
                    <span className="flex items-center gap-0.5"><Maximize2 className="w-3 h-3" /> {prop.size}m²</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. About Us Section Preview */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-1/3 h-28 rounded-xl overflow-hidden shrink-0 shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80"
            alt="Conócenos"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Sobre Nosotros</span>
          <h4 className="text-xs font-bold text-slate-900">{displayAboutTitle}</h4>
          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{displayAboutText}</p>
          <div className="flex items-center gap-4 pt-1 text-[11px] font-bold text-slate-800">
            <span>● 15+ Años de Experiencia</span>
            <span>● 3,500+ Clientes</span>
          </div>
        </div>
      </div>

      {/* 8. Call To Action (Consignación) */}
      <div className="p-5 text-center text-white" style={{ backgroundColor: secondaryColor }}>
        <h4 className="text-xs sm:text-sm font-bold mb-1 text-white">{displayCtaText}</h4>
        <p className="text-[10px] text-slate-300 mb-3">Atención inmediata por WhatsApp y llamada telefónica</p>
        <div className="flex justify-center gap-2">
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
            style={{ backgroundColor: primaryColor }}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contactar Asesor</span>
          </a>
        </div>
      </div>

      {/* 9. Footer Preview */}
      <div className="px-5 py-3 bg-slate-950 text-slate-400 text-[10px] flex justify-between items-center">
        <span>© {new Date().getFullYear()} {agencyName}. Todos los derechos reservados.</span>
        <span className="font-mono text-slate-500">Travel Agency 03 Style</span>
      </div>
    </div>
  );
};

export default PortalLivePreview;
