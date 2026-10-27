'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Car,
  CheckCircle2,
  Phone,
  Mail,
  MessageCircle,
  ArrowLeft,
  Building2,
  Share2,
  Check,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateItem,
} from '@/services/publicInmobiliariaService';
import { AirbnbHeader } from '@/components/inmobiliaria/AirbnbHeader';
import {
  getEstatePrimaryImage,
  PROPERTY_TYPE_LABELS,
  PublicPropertyCard,
  PublicInmobiliariaFooter,
} from './PublicInmobiliariaLayout';

interface PublicInmobiliariaDetailViewProps {
  slug: string;
}

export const PublicInmobiliariaDetailView: React.FC<PublicInmobiliariaDetailViewProps> = ({ slug }) => {
  const searchParams = useSearchParams();
  const domainParam = searchParams?.get('domain') || null;

  const [agency, setAgency] = useState<PublicAgencyConfig | null>(null);
  const [estate, setEstate] = useState<PublicEstateItem | null>(null);
  const [related, setRelated] = useState<PublicEstateItem[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let active = true;
    const loadDetail = async () => {
      setLoading(true);
      try {
        const [detailRes, configRes] = await Promise.all([
          publicInmobiliariaService.getEstateBySlug(slug, domainParam || undefined),
          publicInmobiliariaService.getConfig(domainParam || undefined).catch(() => null),
        ]);

        if (!active) return;

        const foundEstate = detailRes.data?.estate || null;
        setEstate(foundEstate);
        setRelated(detailRes.data?.related || []);
        if (configRes?.data) {
          setAgency(configRes.data);
        }
        if (foundEstate) {
          setActiveImage(getEstatePrimaryImage(foundEstate));
        }
      } catch (err: any) {
        if (active) {
          setErrorMsg(err?.message || 'No se encontró la propiedad solicitada.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDetail();
    return () => {
      active = false;
    };
  }, [slug, domainParam]);

  const fallbackAgency: PublicAgencyConfig = agency || {
    id: estate?.agency?.id || 0,
    name: estate?.agency?.name || 'Inmobiliaria',
    phone: estate?.agency?.phone || '',
    whatsapp: estate?.agency?.whatsapp || estate?.agency?.phone || '',
    email: estate?.agency?.email || '',
    logo: estate?.agency?.logo || null,
    frontend_enabled: true,
    primary_color: '#00a884',
  };

  const primaryColor = fallbackAgency.primary_color || '#00a884';
  const withDomain = (path: string) => {
    if (!domainParam) return path;
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}domain=${encodeURIComponent(domainParam)}`;
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success('¡Enlace de la propiedad copiado al portapapeles!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Skeleton Loader adaptado a la pantalla (UX Law: Zero Blank Screens)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcfcfd]">
        <AirbnbHeader agency={fallbackAgency} domainParam={domainParam} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
          <div className="h-5 bg-slate-200/60 rounded-md w-1/4 animate-pulse" />
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 space-y-6">
            <div className="h-8 bg-slate-200/60 rounded-md w-2/3 animate-pulse" />
            <div className="h-4 bg-slate-200/60 rounded-md w-1/3 animate-pulse" />
            <div className="w-full h-[420px] rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200/50 to-slate-100 animate-pulse" />
          </div>
        </main>
        <PublicInmobiliariaFooter agency={fallbackAgency} domainParam={domainParam} />
      </div>
    );
  }

  if (errorMsg || !estate) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <AirbnbHeader agency={fallbackAgency} domainParam={domainParam} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 max-w-md w-full text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Inmueble No Encontrado</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              La propiedad que buscas no está disponible o el enlace ha cambiado. Explora nuestro catálogo actualizado.
            </p>
            <div className="pt-2">
              <Link
                href={withDomain('/properties')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full text-xs font-black text-white shadow-md active:scale-95 transition-transform"
                style={{ backgroundColor: primaryColor }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Catálogo</span>
              </Link>
            </div>
          </div>
        </div>
        <PublicInmobiliariaFooter agency={fallbackAgency} domainParam={domainParam} />
      </div>
    );
  }

  const isRent = Number(estate.property_status) === 1;
  const statusLabel = isRent ? 'En Alquiler' : 'En Venta';
  const typeLabel = PROPERTY_TYPE_LABELS[Number(estate.property_type)] || 'Inmueble';
  const currency = fallbackAgency.currency || 'USD';
  const priceFormatted = Number(estate.price || 0).toLocaleString('en-US');

  // Collect all images
  const gallery: string[] = [];
  if (estate.image) gallery.push(estate.image);
  if (Array.isArray(estate.images)) {
    estate.images.forEach((img: any) => {
      const src = typeof img === 'string' ? img : img?.image_path || img?.url;
      if (src && !gallery.includes(src)) gallery.push(src);
    });
  }
  if (gallery.length === 0) {
    gallery.push(getEstatePrimaryImage(estate));
  }

  const whatsappNumber = (
    estate.agency?.whatsapp ||
    fallbackAgency.whatsapp ||
    estate.agency?.phone ||
    fallbackAgency.phone ||
    ''
  ).replace(/[^0-9]/g, '');

  const whatsappText = encodeURIComponent(
    `Hola ${fallbackAgency.name}, me interesa recibir información detallada sobre la propiedad "${estate.title}" (Ref: #${estate.id}).`
  );

  const amenityKeys: Array<{ key: string; label: string }> = [
    { key: 'air_condition', label: 'Aire Acondicionado' },
    { key: 'swimming_Pool', label: 'Piscina' },
    { key: 'garden', label: 'Jardín Privado' },
    { key: 'garage', label: 'Garaje Techado' },
    { key: 'security', label: 'Seguridad 24/7' },
    { key: 'wifi', label: 'Internet / WiFi' },
    { key: 'elevator', label: 'Ascensor' },
    { key: 'heating', label: 'Calefacción' },
    { key: 'intercom', label: 'Intercomunicador' },
    { key: 'parking', label: 'Parqueadero de Visitas' },
    { key: 'BBQ', label: 'Área BBQ / Parrilla' },
    { key: 'terraza', label: 'Terraza Panorámica' },
    { key: 'pet_friendly', label: 'Pet Friendly' },
    { key: 'disabled_access', label: 'Acceso Inclusivo' },
    { key: 'cameras', label: 'Cámaras de Vigilancia' },
  ].filter((a) => Boolean(estate[a.key]));

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <AirbnbHeader agency={fallbackAgency} domainParam={domainParam} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Breadcrumb Navigation con botón de compartir */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href={withDomain('/properties')} className="hover:text-slate-900 transition-colors">Propiedades</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-md">{estate.title}</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-full bg-white border border-slate-200/90 hover:bg-slate-50 active:scale-95 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              aria-label="Compartir propiedad"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-extrabold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Compartir</span>
                </>
              )}
            </button>

            <Link
              href={withDomain('/properties')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </Link>
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-full font-bold">Ref: #{estate.id}</span>
          </div>
        </div>

        {/* Cabecera del Inmueble con Glassmorphism y Tipografía Emil Kowalski */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-black text-white shadow-xs"
                  style={{ backgroundColor: isRent ? '#2563eb' : primaryColor }}
                >
                  {statusLabel}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {typeLabel}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{estate.title}</h1>
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-semibold">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <span>
                  {estate.full_address ||
                    estate.address ||
                    [estate.city, estate.province, estate.country].filter(Boolean).join(', ')}
                </span>
              </p>
            </div>

            <div className="lg:text-right shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {isRent ? 'Canon de Arrendamiento' : 'Precio de Venta'}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight" style={{ color: primaryColor }}>
                {currency === 'USD' ? '$' : currency} {priceFormatted}
                {isRent && <small className="text-sm font-semibold text-slate-500"> /mes</small>}
              </span>
            </div>
          </div>

          {/* Galería de Imágenes Interactiva con Emil Kowalski Zoom & Thumbnails */}
          <div className="mt-6 space-y-3">
            <div className="group relative w-full h-[360px] sm:h-[500px] rounded-2xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200/60">
              <img
                src={activeImage || gallery[0]}
                alt={estate.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-103 will-change-transform"
              />
            </div>

            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative h-20 w-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-95 ${
                      activeImage === imgUrl
                        ? 'border-slate-900 ring-2 ring-slate-900/20 scale-102 shadow-md'
                        : 'border-transparent opacity-75 hover:opacity-100 hover:scale-102'
                    }`}
                    aria-label={`Ver foto ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detalles y Contacto con Jerarquía UX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Características Principales */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-5">Características Principales</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/90 transition-all hover:bg-slate-100/60">
                  <BedDouble className="w-5 h-5 mb-2" style={{ color: primaryColor }} />
                  <span className="text-xl font-black text-slate-900 block">{estate.bedrooms ?? 0}</span>
                  <span className="text-xs text-slate-500 font-bold">Habitaciones</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/90 transition-all hover:bg-slate-100/60">
                  <Bath className="w-5 h-5 mb-2" style={{ color: primaryColor }} />
                  <span className="text-xl font-black text-slate-900 block">{estate.bathrooms ?? 0}</span>
                  <span className="text-xs text-slate-500 font-bold">Baños</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/90 transition-all hover:bg-slate-100/60">
                  <Maximize2 className="w-5 h-5 mb-2" style={{ color: primaryColor }} />
                  <span className="text-xl font-black text-slate-900 block">
                    {estate.size ? `${estate.size} m²` : 'N/A'}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">Superficie Total</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/90 transition-all hover:bg-slate-100/60">
                  <Car className="w-5 h-5 mb-2" style={{ color: primaryColor }} />
                  <span className="text-xl font-black text-slate-900 block">
                    {estate.garage ? 'Sí' : 'Opcional'}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">Parqueadero</span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-4">Descripción del Inmueble</h3>
              <div
                className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium"
                dangerouslySetInnerHTML={{
                  __html:
                    estate.description ||
                    estate.short_description ||
                    'Propiedad verificada disponible para entrega inmediata. Contáctenos para agendar una visita guiada.',
                }}
              />
            </div>

            {/* Comodidades con Badges Refinados */}
            {amenityKeys.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
                <h3 className="text-base font-black text-slate-900 mb-5">Comodidades y Equipamiento</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenityKeys.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-100/80 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tarjeta de Contacto Lateral Sticky (UX Conversion Card) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl sticky top-24 space-y-5">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  {(fallbackAgency.name || 'IN').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Comercializado por
                  </span>
                  <h4 className="text-sm font-black text-slate-900">{fallbackAgency.name}</h4>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                ¿Te interesa este inmueble? Solicita asesoría personalizada, planos o agenda una visita guiada con nuestro equipo comercial.
              </p>

              {/* Botones de acción con respuesta táctil y jerarquía UX */}
              <div className="space-y-3 pt-1">
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[48px] py-3.5 px-4 rounded-2xl text-xs font-black text-white shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                )}

                {(estate.agency?.phone || fallbackAgency.phone) && (
                  <a
                    href={`tel:${estate.agency?.phone || fallbackAgency.phone}`}
                    className="w-full min-h-[44px] py-3 px-4 rounded-2xl text-xs font-extrabold border border-slate-200 text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                    <span>Llamar: {estate.agency?.phone || fallbackAgency.phone}</span>
                  </a>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Atención inmediata y contacto verificado</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicInmobiliariaFooter agency={fallbackAgency} domainParam={domainParam} />
    </div>
  );
};

export default PublicInmobiliariaDetailView;
