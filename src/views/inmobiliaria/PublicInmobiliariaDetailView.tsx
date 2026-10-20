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
} from 'lucide-react';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateItem,
} from '@/services/publicInmobiliariaService';
import {
  getEstatePrimaryImage,
  PROPERTY_TYPE_LABELS,
  PublicInmobiliariaFooter,
  PublicInmobiliariaHeader,
  PublicPropertyCard,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-600">Cargando información del inmueble...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !estate) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <PublicInmobiliariaHeader agency={fallbackAgency} domainParam={domainParam} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-extrabold text-slate-900">Propiedad No Encontrada</h2>
            <p className="text-xs text-slate-500">{errorMsg}</p>
            <Link
              href={withDomain('/properties')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Catálogo</span>
            </Link>
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
    `Hola ${fallbackAgency.name}, me interesa recibir información sobre la propiedad "${estate.title}" (Ref: #${estate.id}).`
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <PublicInmobiliariaHeader agency={fallbackAgency} domainParam={domainParam} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={withDomain('/properties')}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo de Propiedades</span>
          </Link>
          <span className="text-xs font-mono text-slate-400">Ref: #{estate.id}</span>
        </div>

        {/* Cabecera del Inmueble */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-extrabold text-white"
                  style={{ backgroundColor: isRent ? '#2563eb' : primaryColor }}
                >
                  {statusLabel}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {typeLabel}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{estate.title}</h1>
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <span>
                  {estate.full_address ||
                    estate.address ||
                    [estate.city, estate.province, estate.country].filter(Boolean).join(', ')}
                </span>
              </p>
            </div>

            <div className="lg:text-right shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {isRent ? 'Canon de Arrendamiento' : 'Precio de Venta'}
              </span>
              <span className="text-3xl font-extrabold text-slate-900" style={{ color: primaryColor }}>
                {currency === 'USD' ? '$' : currency} {priceFormatted}
                {isRent && <small className="text-sm font-medium text-slate-500"> /mes</small>}
              </span>
            </div>
          </div>

          {/* Galería de Imágenes */}
          <div className="mt-6 space-y-3">
            <div className="w-full h-[340px] sm:h-[480px] rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={activeImage || gallery[0]}
                alt={estate.title}
                className="w-full h-full object-cover"
              />
            </div>

            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative h-20 w-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImage === imgUrl ? 'border-emerald-500 scale-105' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detalles y Contacto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Características Principales */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-4">Características Principales</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <BedDouble className="w-5 h-5 mb-1.5" style={{ color: primaryColor }} />
                  <span className="text-lg font-extrabold text-slate-900 block">{estate.bedrooms ?? 0}</span>
                  <span className="text-xs text-slate-500 font-semibold">Habitaciones</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <Bath className="w-5 h-5 mb-1.5" style={{ color: primaryColor }} />
                  <span className="text-lg font-extrabold text-slate-900 block">{estate.bathrooms ?? 0}</span>
                  <span className="text-xs text-slate-500 font-semibold">Baños</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <Maximize2 className="w-5 h-5 mb-1.5" style={{ color: primaryColor }} />
                  <span className="text-lg font-extrabold text-slate-900 block">
                    {estate.size ? `${estate.size} m²` : 'N/A'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Superficie</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <Car className="w-5 h-5 mb-1.5" style={{ color: primaryColor }} />
                  <span className="text-lg font-extrabold text-slate-900 block">
                    {estate.garage ? 'Sí' : 'Opcional'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Parqueadero</span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-3">Descripción del Inmueble</h3>
              <div
                className="text-sm text-slate-600 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html:
                    estate.description ||
                    estate.short_description ||
                    'Propiedad verificada disponible para entrega inmediata. Contáctenos para agendar una visita guiada.',
                }}
              />
            </div>

            {/* Comodidades */}
            {amenityKeys.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h3 className="text-base font-extrabold text-slate-900 mb-4">Comodidades y Equipamiento</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenityKeys.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 text-xs font-bold text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tarjeta de Contacto Lateral */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md sticky top-24 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {(fallbackAgency.name || 'IN').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Comercializado por
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">{fallbackAgency.name}</h4>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                ¿Te interesa esta propiedad? Solicita información detallada, planos o agenda una visita personalizada con nuestro equipo.
              </p>

              <div className="space-y-3">
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#16a34a' }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                )}

                {(estate.agency?.phone || fallbackAgency.phone) && (
                  <a
                    href={`tel:${estate.agency?.phone || fallbackAgency.phone}`}
                    className="w-full py-3 px-4 rounded-xl text-xs font-extrabold border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                    <span>Llamar: {estate.agency?.phone || fallbackAgency.phone}</span>
                  </a>
                )}

                {(estate.agency?.email || fallbackAgency.email) && (
                  <a
                    href={`mailto:${estate.agency?.email || fallbackAgency.email}?subject=${encodeURIComponent(
                      `Consulta por propiedad: ${estate.title}`
                    )}`}
                    className="w-full py-3 px-4 rounded-xl text-xs font-extrabold border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                    <span>Enviar Correo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Propiedades Relacionadas */}
        {related.length > 0 && (
          <section className="mt-14 pt-10 border-t border-slate-200">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">Propiedades Similares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.slice(0, 3).map((rel) => (
                <PublicPropertyCard
                  key={rel.id}
                  estate={rel}
                  currency={currency}
                  primaryColor={primaryColor}
                  domainParam={domainParam}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <PublicInmobiliariaFooter agency={fallbackAgency} domainParam={domainParam} />
    </div>
  );
};

export default PublicInmobiliariaDetailView;

