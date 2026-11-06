'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Link2,
  ArrowLeft,
  Building2,
  Share2,
  Check,
  ShieldCheck,
  Calendar,
  X,
  Send,
  Copy,
  FileDown,
  Heart,
  MoreVertical,
  Camera,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
} from 'lucide-react';
import toast from 'react-hot-toast';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateItem,
  getCachedAgencyConfig,
} from '@/services/publicInmobiliariaService';
import {
  DEFAULT_REAL_ESTATE_TERMS,
  DEFAULT_REAL_ESTATE_PRIVACY,
} from '@/constants/realEstateDefaults';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import Header2Style3 from '@/components/layout/Header2Style3';
import BrandingThemeInjector from '@/components/inmobiliaria/BrandingThemeInjector';
import PublicPortalLoader from '@/components/inmobiliaria/PublicPortalLoader';
import { EstateImageLightboxModal } from '@/components/EstateImageLightboxModal';
import {
  getEstatePrimaryImage,
  PROPERTY_TYPE_LABELS,
  PublicPropertyCard,
  PublicInmobiliariaFooter,
} from './PublicInmobiliariaLayout';

const PublicPropertyMapView = dynamic(
  () => import('@/components/inmobiliaria/PublicPropertyMapView'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] sm:h-[420px] rounded-3xl bg-slate-100 animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

interface PublicInmobiliariaDetailViewProps {
  slug: string;
}

export const PublicInmobiliariaDetailView: React.FC<PublicInmobiliariaDetailViewProps> = ({ slug }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domainParam = searchParams?.get('domain') || null;

  const [agency, setAgency] = useState<PublicAgencyConfig | null>(null);
  const [estate, setEstate] = useState<PublicEstateItem | null>(null);
  const [related, setRelated] = useState<PublicEstateItem[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [mobileImgIndex, setMobileImgIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isMobileOptionsOpen, setIsMobileOptionsOpen] = useState<boolean>(false);
  const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInfo, setCopiedInfo] = useState(false);
  const [copyingInfo, setCopyingInfo] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Lightbox Modal State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Form State matching "Contacta al anunciante"
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [acceptPrivacy, setAcceptPrivacy] = useState(true);
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Legal Modal ('terms' | 'privacy' | null)
  const [activeLegalModal, setActiveLegalModal] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    let active = true;
    const cached = getCachedAgencyConfig(domainParam || undefined);
    if (cached) setAgency(cached);
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
  const isRent = Number(estate?.property_status) === 1;

  // Initialize pre-filled contact message matching Plusvalia / Inmobiliaria standard
  useEffect(() => {
    if (estate && !contactMessage) {
      const agencyDisplayName = fallbackAgency.name || fallbackAgency.commercial_name || 'el portal inmobiliario';
      const op = isRent ? 'alquiler' : 'venta';
      setContactMessage(`¡Hola! Quiero que se comuniquen conmigo por este inmueble en ${op} que vi en ${agencyDisplayName}.`);
    }
  }, [estate, isRent, fallbackAgency.name, contactMessage]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      toast.error('Por favor escribe tu nombre');
      return;
    }
    if (!contactEmail.trim() && !contactPhone.trim()) {
      toast.error('Por favor escribe tu email o teléfono');
      return;
    }
    if (!acceptTerms || !acceptPrivacy) {
      toast.error('Debes aceptar los Términos y la Política de Privacidad');
      return;
    }

    setSubmittingContact(true);
    try {
      await publicInmobiliariaService.sendContactMessage(
        {
          name: contactName.trim(),
          email: contactEmail.trim() || undefined,
          phone: contactPhone.trim() || undefined,
          subject: `Interés en: ${estate?.title || 'Inmueble'} (Ref: #${estate?.id})`,
          message: contactMessage.trim(),
          estate_id: estate?.id,
        },
        domainParam || undefined
      );
      setContactSuccess(true);
      toast.success('¡Consulta enviada con éxito! Un asesor se comunicará contigo.');
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar la consulta. Intenta nuevamente.');
    } finally {
      setSubmittingContact(false);
    }
  };

  const whatsappNumber = (
    estate?.agency?.whatsapp ||
    fallbackAgency.whatsapp ||
    estate?.agency?.phone ||
    fallbackAgency.phone ||
    ''
  ).replace(/[^0-9]/g, '');

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!whatsappNumber) {
      toast.error('Número de WhatsApp no configurado para este inmueble');
      return;
    }
    const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
    const textMsg = encodeURIComponent(
      contactMessage.trim() || `¡Hola! Me interesa la propiedad "${estate?.title}" (Ref: #${estate?.id}).`
    );
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanNum}&text=${textMsg}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

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

  // Handler: Copiar Información de la Propiedad (Formato listo para WhatsApp con enlace a la web)
  const handleCopyPropertyInfo = async () => {
    if (!estate) return;
    const toastId = toast.loading('Copiando información del inmueble...');
    setCopyingInfo(true);
    try {
      const cleanSlug = encodeURIComponent(String(estate.slug || estate.id).trim().replace(/\s+/g, '-'));
      const pageUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/properties/${cleanSlug}`
        : `https://${domainParam || 'immobillis.com'}/properties/${cleanSlug}`;

      let textToCopy = '';
      try {
        const res = await publicInmobiliariaService.getWhatsAppInfo(
          estate.slug || estate.id,
          domainParam || undefined
        );
        textToCopy = res?.formatted_text || res?.whatsapp_text || res?.copy_text || '';
      } catch {
        // Fallback al formato client-side
      }

      const mainImg = getEstatePrimaryImage(estate);

      if (textToCopy) {
        // 1. Reemplazar enlaces del backend con la URL limpia de la propiedad
        textToCopy = textToCopy.replace(
          /https?:\/\/[^\s\n]*\/(?:estates|propiedad|properties)\/[^\s\n]*/gi,
          pageUrl
        );
        // 2. Asegurar que el enlace esté en su propia línea sin espacios para la previsualización en WhatsApp
        textToCopy = textToCopy.replace(
          /(🔗\s*\*Ver propiedad[^*]*\*:?)\s*https?:\/\/[^\s\n]+/gi,
          `$1\n${pageUrl}`
        );
      } else {
        const cityName = (estate as any).city || estate.neighborhood || '';
        const parroquiaName = (estate as any).parroquia || '';
        const lines = [
          `🏠 *${estate.title}*`,
          mainImg ? `📸 *Foto:* ${mainImg}` : null,
          `💰 *Precio:* $ ${Number(estate.price || 0).toLocaleString('en-US')} ${isRent ? '/mes' : ''}`,
          cityName ? `🏙️ *Ciudad:* ${cityName}` : null,
          parroquiaName ? `📍 *Parroquia / Sector:* ${parroquiaName}` : null,
          estate.full_address ? `📍 *Ubicación:* ${estate.full_address}` : null,
          estate.bedrooms ? `🛏 *Habitaciones:* ${estate.bedrooms}` : null,
          estate.bathrooms ? `🛁 *Baños:* ${estate.bathrooms}` : null,
          estate.size ? `📐 *Superficie:* ${estate.size} m²` : null,
          estate.garage ? `🚗 *Parqueadero:* Sí` : null,
          `🔗 *Ver propiedad:*\n${pageUrl}`,
        ].filter(Boolean);
        textToCopy = lines.join('\n');
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopiedInfo(true);
      toast.success('¡Información de la propiedad copiada al portapapeles!', { id: toastId });
      setTimeout(() => setCopiedInfo(false), 2500);
    } catch (err: any) {
      toast.error('No se pudo copiar la información de la propiedad', { id: toastId });
    } finally {
      setCopyingInfo(false);
    }
  };

  // Handler: Descargar PDF del Inmueble
  const handleDownloadPdf = async () => {
    if (!estate) return;
    const toastId = toast.loading('Generando PDF del inmueble...');
    setDownloadingPdf(true);
    try {
      await publicInmobiliariaService.downloadPdf(
        estate.slug || estate.id,
        domainParam || undefined,
        estate.slug
      );
      toast.success('¡PDF descargado exitosamente!', { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || 'Error al descargar el PDF de la propiedad', { id: toastId });
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Abrir Lightbox en un índice específico
  const openLightbox = (index: number = 0) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Skeleton Loader adaptado a la pantalla (UX Law: Zero Blank Screens)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcfcfd]">
        <TopbarSlider agency={fallbackAgency} />
        <Header2Style3 agency={fallbackAgency} />
        <PublicPortalLoader
          isOpen={loading}
          countryName={fallbackAgency.country_name || fallbackAgency.country}
          countryImage={fallbackAgency.details?.loader_image || fallbackAgency.country_image}
          agency={fallbackAgency}
          message="Un momento por favor, estamos preparando los detalles del inmueble."
        />
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
        <TopbarSlider agency={fallbackAgency} />
        <Header2Style3 agency={fallbackAgency} />
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

  const phoneDisplay = (
    estate?.agency?.phone ||
    fallbackAgency.phone ||
    estate?.agency?.whatsapp ||
    fallbackAgency.whatsapp ||
    '+593 0984113967'
  );
  const cleanPhone = phoneDisplay.replace(/[^0-9]/g, '') || '593984113967';

  const mobileSpecs = [
    typeLabel,
    estate.size ? `${estate.size}m²` : null,
    estate.bedrooms ? `${estate.bedrooms} ${Number(estate.bedrooms) === 1 ? 'habitación' : 'habitaciones'}` : null,
    estate.garage ? '2 estacionamientos' : (estate.bathrooms ? `${estate.bathrooms} ${Number(estate.bathrooms) === 1 ? 'baño' : 'baños'}` : null),
  ].filter(Boolean).join(' · ');

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40 && gallery.length > 1) {
      setMobileImgIndex((prev) => (prev + 1) % gallery.length);
    } else if (diff < -40 && gallery.length > 1) {
      setMobileImgIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    }
    setTouchStartX(null);
  };

  return (
    <div className="travel-agency-03-root min-h-screen flex flex-col bg-[#fcfcfd] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <BrandingThemeInjector agency={fallbackAgency} />
      <TopbarSlider agency={fallbackAgency} />
      <Header2Style3 agency={fallbackAgency} />

      <main className="max-w-7xl mx-auto px-0 lg:px-8 py-0 lg:py-8 pb-28 lg:pb-8 flex-1 w-full">
        {/* ======================================================== */}
        {/* 1. SECCIÓN MOBILE EXCLUSIVA (ESTILO PLUSVALIA EXACTO)    */}
        {/* ======================================================== */}
        <div className="lg:hidden">
          {/* Sub-header de Navegación Móvil */}
          <div className="bg-white border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  window.history.back();
                } else {
                  router.push(withDomain('/properties'));
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-800 active:scale-95 transition-transform border-none bg-transparent cursor-pointer p-0"
              aria-label="Volver atrás"
            >
              <ArrowLeft className="w-4 h-4 text-slate-800" />
              <span>Atrás</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  toast.success(!isFavorite ? '¡Guardado en tus favoritos!' : 'Eliminado de favoritos');
                }}
                className="p-1 text-slate-700 hover:text-rose-500 active:scale-90 transition-all border-none bg-transparent cursor-pointer"
                title="Favorito"
                aria-label="Marcar como favorito"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-1 text-slate-700 hover:text-slate-950 active:scale-90 transition-all border-none bg-transparent cursor-pointer"
                title="Compartir"
                aria-label="Compartir propiedad"
              >
                <Share2 className="w-5 h-5 text-slate-700" />
              </button>

              <button
                type="button"
                onClick={() => setIsMobileOptionsOpen(true)}
                className="p-1 text-slate-700 hover:text-slate-950 active:scale-90 transition-all border-none bg-transparent cursor-pointer"
                title="Más opciones"
                aria-label="Más opciones"
              >
                <MoreVertical className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Carrusel de Imágenes Full-Width con Contador de Fotos y Flechas */}
          <div
            className="relative w-full h-[290px] sm:h-[380px] bg-slate-950 overflow-hidden select-none cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => openLightbox(mobileImgIndex)}
          >
            <img
              src={gallery[mobileImgIndex] || gallery[0]}
              alt={estate.title}
              className="w-full h-full object-cover"
            />

            {/* Badge Contador de Fotos en esquina inferior izquierda (estilo Plusvalia) */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/65 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 shadow-md">
              <span>{mobileImgIndex + 1}/{gallery.length}</span>
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>

            {/* Flecha Derecha */}
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileImgIndex((prev) => (prev + 1) % gallery.length);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center active:scale-90 transition-all border-none cursor-pointer"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="w-6 h-6 text-white stroke-[2.5]" />
              </button>
            )}

            {/* Flecha Izquierda */}
            {gallery.length > 1 && mobileImgIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileImgIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center active:scale-90 transition-all border-none cursor-pointer"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6 text-white stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Ficha básica estilo Plusvalia */}
          <div className="px-4 pt-3.5 pb-4 bg-white border-b border-slate-100 space-y-2.5">
            {/* Línea 1: Metadata de la propiedad (Departamento · 160m² · 3 habitaciones · 2 estacionamientos) */}
            <div className="text-xs text-slate-500 font-semibold tracking-wide">
              {mobileSpecs || `${typeLabel} · ${estate.title}`}
            </div>

            {/* Línea 2: Operación y Precio grande en negrita */}
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {isRent ? 'Alquiler' : 'Venta'} {currency} {priceFormatted}
              {isRent && <span className="text-sm font-semibold text-slate-500 font-normal"> /mes</span>}
            </div>

            {/* Línea 3: Botón Avisarme si baja de precio */}
            <button
              type="button"
              onClick={() => toast.success('¡Te avisaremos cuando esta propiedad baje de precio!')}
              className="w-full py-2.5 px-4 rounded-xl border border-orange-500 text-orange-600 font-extrabold text-xs text-center bg-white hover:bg-orange-50 active:scale-98 transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-orange-600" />
              <span>Avisarme si baja de precio</span>
            </button>

            {/* Título & Ubicación */}
            <div className="pt-1">
              <h1 className="text-base font-black text-slate-900 leading-snug">{estate.title}</h1>
              <p className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                <span>
                  {estate.full_address ||
                    estate.address ||
                    [estate.city, estate.province, estate.country].filter(Boolean).join(', ')}
                </span>
              </p>
            </div>

            {/* Acciones directas: Copiar Ficha (Verde) y Descargar PDF (Rojo) */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCopyPropertyInfo}
                disabled={copyingInfo}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer border-none"
              >
                <Link2 className="w-4 h-4 text-white" />
                <span>{copiedInfo ? '¡Copiado!' : 'Copiar Info'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer border-none"
              >
                <FileDown className="w-4 h-4 text-white" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. SECCIÓN DESKTOP TRADICIONAL (CONSERVADA INTACTA)      */}
        {/* ======================================================== */}
        <div className="hidden lg:block">
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

          {/* Cabecera del Inmueble con Glassmorphism */}
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

            {/* Galería de Imágenes Interactiva con Expansión Lightbox al hacer Clic */}
            <div className="mt-6 space-y-3">
              <div
                onClick={() => openLightbox(gallery.indexOf(activeImage) >= 0 ? gallery.indexOf(activeImage) : 0)}
                className="group relative w-full h-[360px] sm:h-[500px] rounded-2xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200/60 cursor-pointer"
                title="Haz clic para ver las fotos en pantalla completa"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openLightbox(gallery.indexOf(activeImage) >= 0 ? gallery.indexOf(activeImage) : 0);
                  }
                }}
              >
                <img
                  src={activeImage || gallery[0]}
                  alt={estate.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-103 will-change-transform"
                />

                {/* Botón Flotante para Expandir Imágenes */}
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/25 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-extrabold shadow-xl border border-white/20 transform scale-95 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-4 h-4 text-emerald-400" />
                    <span>Ver fotos en pantalla completa ({gallery.length})</span>
                  </span>
                </div>

                {/* Badge Contador de Fotos en Esquina Inferior */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 border border-white/10 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>{gallery.indexOf(activeImage) >= 0 ? gallery.indexOf(activeImage) + 1 : 1} / {gallery.length}</span>
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveImage(imgUrl);
                      }}
                      onDoubleClick={() => openLightbox(idx)}
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
        </div>

        {/* ======================================================== */}
        {/* 3. DETALLES, MAPA Y FORMULARIO (RESPONSIVE EN AMBOS)     */}
        {/* ======================================================== */}
        <div className="px-4 lg:px-0 mt-6 lg:mt-0">
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

            {/* Descripción estilo Plusvalia con Leer más */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-4">Descripción del Inmueble</h3>
              <div
                className={`text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium transition-all ${
                  isDescExpanded ? '' : 'line-clamp-4'
                }`}
                dangerouslySetInnerHTML={{
                  __html:
                    estate.description ||
                    estate.short_description ||
                    'Propiedad verificada disponible para entrega inmediata. Contáctenos para agendar una visita guiada.',
                }}
              />
              <button
                type="button"
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-black text-orange-600 hover:text-orange-700 cursor-pointer bg-transparent border-0 p-0 active:scale-95 transition-transform"
              >
                <span>{isDescExpanded ? 'Ver menos' : 'Leer más'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDescExpanded ? 'rotate-180' : ''}`} />
              </button>
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

            {/* MAPA INTERACTIVO Y CARD DE UBICACIÓN */}
            <PublicPropertyMapView estate={estate} primaryColor={primaryColor} />
          </div>

          {/* Tarjeta de Contacto Lateral Sticky */}
          <div className="lg:col-span-4">
            <div id="anunciante-form" className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xl sticky top-24 space-y-4">
              
              {/* BOTONES DE ACCIÓN CENTRADOS Y RESALTADOS: LINK COPIAR (VERDE) & PDF (ROJO) CON LÍNEA SEPARADORA */}
              <div className="flex items-center justify-center gap-6 pt-1 pb-5 border-b border-slate-100">
                {/* Botón 1: Link / Copiar Información (Verde) */}
                <button
                  type="button"
                  onClick={handleCopyPropertyInfo}
                  disabled={copyingInfo}
                  title="Copiar enlace e información de la propiedad"
                  className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white shadow-lg shadow-emerald-500/35 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/40"
                  aria-label="Copiar ficha de la propiedad"
                >
                  {copiedInfo ? (
                    <Check className="w-7 h-7 text-white stroke-[2.5]" />
                  ) : (
                    <Link2 className="w-7 h-7 text-white stroke-[2.2]" />
                  )}
                  {/* Indicador de pulso para resaltar */}
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                  </span>
                </button>

                {/* Línea divisoria entre botones */}
                <div className="h-9 w-[1.5px] bg-slate-200/90 rounded-full" />

                {/* Botón 2: Descargar PDF (Rojo) */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  title="Descargar dossier de la propiedad en PDF"
                  className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white shadow-lg shadow-red-500/35 hover:shadow-xl hover:shadow-red-500/50 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/40"
                  aria-label="Descargar ficha en PDF"
                >
                  {downloadingPdf ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FileDown className="w-7 h-7 text-white stroke-[2.2]" />
                  )}
                  {/* Badge PDF para resaltar */}
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-slate-900 text-white border border-white/40 shadow-xs">
                    PDF
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between pb-1">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Contacta al anunciante
                </h3>
              </div>

              {/* Ficha del Anunciante estilo Plusvalía */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                {fallbackAgency.logo ? (
                  <img
                    src={fallbackAgency.logo}
                    alt={fallbackAgency.name}
                    className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200 shrink-0 shadow-2xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm shrink-0">
                    {(fallbackAgency.name || 'IN').substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">Inmobiliaria</span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Verificado
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 truncate">
                    {fallbackAgency.name || fallbackAgency.commercial_name || 'Agencia Inmobiliaria'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate m-0">
                    {phoneDisplay}
                  </p>
                </div>
              </div>

              {contactSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 animate-in fade-in-50 zoom-in-95">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-emerald-950">¡Solicitud recibida con éxito!</h4>
                    <p className="text-[11px] text-emerald-800 font-medium leading-tight mt-0.5">
                      Un asesor se comunicará contigo al teléfono o email proporcionado.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-3">
                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                    aria-label="Correo electrónico"
                  />
                </div>

                {/* Nombre & Teléfono en 2 columnas */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                    aria-label="Nombre"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                    aria-label="Teléfono"
                  />
                </div>

                {/* Mensaje con recuadro interior */}
                <div className="border border-slate-300 rounded-xl p-2.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all bg-white">
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Mensaje</label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    className="w-full bg-transparent border-none outline-none text-xs font-semibold text-slate-800 resize-none leading-relaxed placeholder-slate-400"
                    aria-label="Mensaje"
                  />
                </div>

                {/* Checkbox Términos */}
                <div className="pt-1 space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-700 font-semibold leading-tight">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
                    />
                    <span>
                      Acepto los{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveLegalModal('terms');
                        }}
                        className="font-bold underline text-slate-900 hover:text-orange-600 transition-colors"
                      >
                        Términos y Condiciones de Uso
                      </button>
                      .
                    </span>
                  </label>

                  {/* Checkbox Política de Privacidad */}
                  <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-700 font-semibold leading-tight">
                    <input
                      type="checkbox"
                      checked={acceptPrivacy}
                      onChange={(e) => setAcceptPrivacy(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
                    />
                    <span>
                      Acepto la{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveLegalModal('privacy');
                        }}
                        className="font-bold underline text-slate-900 hover:text-orange-600 transition-colors"
                      >
                        Política de Privacidad
                      </button>
                      .
                    </span>
                  </label>
                </div>

                {/* Botón 1: Contactar */}
                <button
                  type="submit"
                  disabled={submittingContact}
                  className="w-full min-h-[46px] py-3 px-4 rounded-xl text-xs font-black text-white bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.98] shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  <span>{submittingContact ? 'Enviando...' : 'Contactar'}</span>
                </button>

                {/* Botón 2: Contactar por WhatsApp */}
                {whatsappNumber && (
                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    className="w-full min-h-[46px] py-3 px-4 rounded-xl text-xs font-black text-white bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.98] shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Contactar por WhatsApp</span>
                  </button>
                )}
              </form>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Atención inmediata y contacto legal verificado</span>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* ======================================================== */}
        {/* 4. BARRA INFERIOR FIJA EN MÓVIL (ESTILO PLUSVALIA EXACTO) */}
        {/* ======================================================== */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white/98 backdrop-blur-md border-t border-slate-200/90 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center gap-2 shadow-[0_-4px_25px_rgba(0,0,0,0.15)]">
          {/* Botón Llamar (icono teléfono en recuadro) */}
          <a
            href={`tel:${cleanPhone}`}
            className="w-12 h-11 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-800 active:scale-95 transition-all shrink-0 no-underline shadow-2xs"
            title="Llamar al anunciante"
            aria-label="Llamar al anunciante"
          >
            <Phone className="w-5 h-5 text-slate-800" />
          </a>

          {/* Botón WhatsApp (Verde con icono y texto) */}
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="flex-1 h-11 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border-none"
          >
            <span>WhatsApp</span>
            <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </button>

          {/* Botón Contactar (Naranja con icono sobre y texto) */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('anunciante-form');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const input = el.querySelector('input');
                if (input) input.focus();
              }
            }}
            className="flex-1 h-11 rounded-xl bg-[#ff5a00] hover:bg-[#e04f00] active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border-none"
          >
            <span>Contactar</span>
            <Mail className="w-4 h-4 text-white shrink-0" />
          </button>
        </div>

        {/* Modal de Opciones Móvil (3 puntos) via Portal */}
        {isMounted && isMobileOptionsOpen && createPortal(
          <div
            className="lg:hidden fixed inset-0 z-[99999999] flex items-end justify-center bg-black/70 backdrop-blur-xs p-3 animate-in fade-in-0 duration-150"
            onClick={() => setIsMobileOptionsOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-sm p-4 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
            >
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-2 shrink-0" />
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Opciones del Inmueble</span>
                <button
                  type="button"
                  onClick={() => setIsMobileOptionsOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileOptionsOpen(false);
                  handleCopyPropertyInfo();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 active:scale-98 transition-all border-none text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="m-0 font-black">Copiar información para WhatsApp</p>
                  <p className="m-0 text-[11px] text-emerald-700 font-normal">Ficha completa lista para enviar</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileOptionsOpen(false);
                  handleDownloadPdf();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-red-50 text-red-800 font-bold text-xs hover:bg-red-100 active:scale-98 transition-all border-none text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
                  <FileDown className="w-4 h-4" />
                </div>
                <div>
                  <p className="m-0 font-black">Descargar ficha en PDF</p>
                  <p className="m-0 text-[11px] text-red-700 font-normal">Dossier oficial con fotos y detalles</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileOptionsOpen(false);
                  handleShare();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 text-slate-800 font-bold text-xs hover:bg-slate-100 active:scale-98 transition-all border-none text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="m-0 font-black">Copiar enlace de la propiedad</p>
                  <p className="m-0 text-[11px] text-slate-500 font-normal">Compartir link directo</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileOptionsOpen(false);
                  openLightbox(mobileImgIndex);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 text-slate-800 font-bold text-xs hover:bg-slate-100 active:scale-98 transition-all border-none text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="m-0 font-black">Ver fotos en pantalla completa</p>
                  <p className="m-0 text-[11px] text-slate-500 font-normal">{gallery.length} fotos en alta resolución</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsMobileOptionsOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-all border-none cursor-pointer mt-2"
              >
                Cerrar
              </button>
            </div>
          </div>,
          document.body
        )}

        {/* Modal de Lightbox para Fotos en Pantalla Completa */}
        {isLightboxOpen && (
          <EstateImageLightboxModal
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            estate={estate as any}
            initialImageIndex={lightboxIndex}
          />
        )}

        {/* Modal de Términos y Condiciones / Política de Privacidad via Portal */}
        {isMounted && activeLegalModal && createPortal(
          <div
            className="fixed inset-0 z-[99999999] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150"
            onClick={() => setActiveLegalModal(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {activeLegalModal === 'terms'
                      ? 'Términos y Condiciones de Uso'
                      : 'Política de Privacidad y Tratamiento de Datos'}
                  </span>
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveLegalModal(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
                  aria-label="Cerrar ventana"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
                <div className="whitespace-pre-line">
                  {activeLegalModal === 'terms'
                    ? fallbackAgency.details?.terms_and_conditions || DEFAULT_REAL_ESTATE_TERMS
                    : fallbackAgency.details?.privacy_policy || DEFAULT_REAL_ESTATE_PRIVACY}
                </div>
              </div>

              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveLegalModal(null)}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </main>

      <PublicInmobiliariaFooter agency={fallbackAgency} domainParam={domainParam} />
    </div>
  );
};

export default PublicInmobiliariaDetailView;
