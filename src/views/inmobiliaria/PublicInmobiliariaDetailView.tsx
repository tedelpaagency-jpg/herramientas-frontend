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
  X,
  Send,
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

  // Initialize pre-filled contact message matching Plusvalia / Inmobiliaria standard (Image uploaded by user)
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
        <TopbarSlider agency={fallbackAgency} />
        <Header2Style3 agency={fallbackAgency} />
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
    <div className="travel-agency-03-root min-h-screen flex flex-col bg-[#fcfcfd] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <TopbarSlider agency={fallbackAgency} />
      <Header2Style3 agency={fallbackAgency} />

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

          {/* Tarjeta de Contacto Lateral Sticky (Formulario idéntico a la imagen subida por el usuario) */}
          <div className="lg:col-span-4">
            <div id="anunciante-form" className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xl sticky top-24 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Contacta al anunciante
              </h3>

              {contactSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-center space-y-2 animate-in fade-in-50 zoom-in-95">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-black text-emerald-950">¡Solicitud recibida!</h4>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Un asesor de <strong>{fallbackAgency.name}</strong> se comunicará contigo al teléfono o email proporcionado.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSuccess(false)}
                    className="mt-2 text-xs font-bold text-emerald-700 underline cursor-pointer"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
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

                  {/* Botón 1: Contactar (Naranja con icono de correo) */}
                  <button
                    type="submit"
                    disabled={submittingContact}
                    className="w-full min-h-[46px] py-3 px-4 rounded-xl text-xs font-black text-white bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.98] shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{submittingContact ? 'Enviando...' : 'Contactar'}</span>
                  </button>
                </form>
              )}

              {/* Botón 2: Contactar por WhatsApp (Verde con icono de WhatsApp) */}
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[46px] py-3 px-4 rounded-xl text-xs font-black text-white bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.98] shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-decoration-none"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Contactar por WhatsApp</span>
                </a>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Atención inmediata y contacto legal verificado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Términos y Condiciones / Política de Privacidad */}
        {activeLegalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
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
          </div>
        )}
      </main>

      <PublicInmobiliariaFooter agency={fallbackAgency} domainParam={domainParam} />
    </div>
  );
};

export default PublicInmobiliariaDetailView;
