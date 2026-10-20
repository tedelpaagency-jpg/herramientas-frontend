'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Building2,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Home,
  Key,
  MapPin,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateCategory,
  PublicEstateItem,
} from '@/services/publicInmobiliariaService';
import {
  PublicInmobiliariaFooter,
  PublicInmobiliariaHeader,
  PublicPropertyCard,
} from './PublicInmobiliariaLayout';

interface PublicInmobiliariaHomeViewProps {
  initialConfig?: PublicAgencyConfig | null;
  domainOverride?: string;
}

export const PublicInmobiliariaHomeView: React.FC<PublicInmobiliariaHomeViewProps> = ({
  initialConfig = null,
  domainOverride,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domainParam = domainOverride || searchParams?.get('domain') || null;

  const [agency, setAgency] = useState<PublicAgencyConfig | null>(initialConfig);
  const [featuredEstates, setFeaturedEstates] = useState<PublicEstateItem[]>([]);
  const [recentEstates, setRecentEstates] = useState<PublicEstateItem[]>([]);
  const [categories, setCategories] = useState<PublicEstateCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(!initialConfig);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search form state
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    let active = true;
    const loadPortalData = async () => {
      try {
        setLoading(true);
        const targetDomain = domainParam || undefined;

        let currentConfig = initialConfig;
        if (!currentConfig) {
          const cfgRes = await publicInmobiliariaService.getConfig(targetDomain);
          currentConfig = cfgRes.data;
        }

        if (!active) return;

        if (currentConfig?.redirect_to_login) {
          router.replace('/login');
          return;
        }

        setAgency(currentConfig);

        const [featRes, recRes, catRes] = await Promise.all([
          publicInmobiliariaService.getFeaturedEstates(targetDomain, 6).catch(() => ({ data: [] })),
          publicInmobiliariaService.getRecentEstates(targetDomain, 6).catch(() => ({ data: [] })),
          publicInmobiliariaService.getCategories(targetDomain).catch(() => ({ data: [] })),
        ]);

        if (!active) return;
        setFeaturedEstates(featRes.data || []);
        setRecentEstates(recRes.data || []);
        setCategories(catRes.data || []);
      } catch (err: any) {
        if (!active) return;
        setErrorMsg(
          err?.message || 'Este dominio no tiene un portal inmobiliario público activo en este momento.'
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPortalData();
    return () => {
      active = false;
    };
  }, [domainParam, initialConfig, router]);

  useEffect(() => {
    if (agency?.seo_title && typeof document !== 'undefined') {
      document.title = agency.seo_title;
    }
  }, [agency?.seo_title]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (domainParam) params.set('domain', domainParam);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (propertyStatus) params.set('property_status', propertyStatus);
    if (propertyType) params.set('property_type', propertyType);
    router.push(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  if (loading && !agency) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-600">Cargando Portal Inmobiliario...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !agency) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Portal Inmobiliario No Disponible</h2>
          <p className="text-sm text-slate-500 leading-relaxed">{errorMsg}</p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Acceder al Panel de Control
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const primaryColor = agency.primary_color || '#00a884';
  const heroBg =
    agency.banner_image ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80';
  const whatsappClean = (agency.whatsapp || agency.phone || '').replace(/[^0-9]/g, '');
  const withDomain = (path: string) => {
    if (!domainParam) return path;
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}domain=${encodeURIComponent(domainParam)}`;
  };

  const displayEstates = featuredEstates.length > 0 ? featuredEstates : recentEstates;

  const faqs = [
    {
      q: '¿Cómo puedo agendar una visita a una propiedad?',
      a: 'Puedes seleccionar cualquier propiedad de nuestro catálogo y hacer clic en el botón de WhatsApp o Contacto Directo para coordinar una visita presencial o virtual con uno de nuestros asesores.',
    },
    {
      q: '¿Brindan asesoría legal y financiera durante la compra?',
      a: 'Sí, acompañamos todo el proceso desde la reserva, revisión jurídica de escrituras y gestión de crédito hipotecario hasta la firma definitiva.',
    },
    {
      q: '¿Cómo puedo consignar mi inmueble para venta o alquiler?',
      a: 'Contáctanos mediante el botón de consignación o WhatsApp. Realizamos el avalúo comercial, reportaje fotográfico y promoción en nuestros canales digitales.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <PublicInmobiliariaHeader agency={agency} domainParam={domainParam} />

      {/* 1. Hero Principal */}
      <section className="relative min-h-[540px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/60 to-slate-950/85" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center w-full">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-white mb-5 shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {agency.commercial_name || agency.name}
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight mb-4">
            {agency.hero_title || 'Encuentra el Inmueble de tus Sueños'}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto mb-8 font-medium">
            {agency.hero_subtitle ||
              'Explora propiedades exclusivas en venta y alquiler con asesoría comercial y jurídica garantizada.'}
          </p>

          {/* Buscador Principal */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-white/20 grid grid-cols-1 sm:grid-cols-12 gap-3 text-left"
          >
            <div className="sm:col-span-5">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 px-2 mb-1">
                Ubicación o Palabra Clave
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ciudad, sector, título..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 px-2 mb-1">
                Operación
              </label>
              <select
                value={propertyStatus}
                onChange={(e) => setPropertyStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
              >
                <option value="">Venta y Alquiler</option>
                <option value="2">En Venta</option>
                <option value="1">En Alquiler</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 px-2 mb-1">
                Tipo Inmueble
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
              >
                <option value="">Todos</option>
                <option value="1">Casas</option>
                <option value="2">Departamentos</option>
                <option value="3">Terrenos</option>
                <option value="4">Locales</option>
                <option value="5">Oficinas</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Categorías Rápidas */}
      {categories.length > 0 && (
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span
                  className="text-xs font-extrabold uppercase tracking-wider block mb-1"
                  style={{ color: primaryColor }}
                >
                  Explora por Categoría
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">Tipos de Propiedades Disponibles</h2>
              </div>
              <Link
                href={withDomain('/properties')}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold hover:underline"
                style={{ color: primaryColor }}
              >
                <span>Ver todo el inventario</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={withDomain(`/properties?property_type=${cat.id}`)}
                  className="group p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      {cat.count} {cat.count === 1 ? 'propiedad' : 'propiedades'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Propiedades Destacadas */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span
              className="text-xs font-extrabold uppercase tracking-wider block mb-1"
              style={{ color: primaryColor }}
            >
              Selección Exclusiva
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Propiedades Destacadas</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Las mejores opciones del mercado seleccionadas por nuestro equipo de expertos.
            </p>
          </div>
          <Link
            href={withDomain('/properties')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-sm hover:opacity-90 transition-opacity self-start sm:self-auto"
            style={{ backgroundColor: primaryColor }}
          >
            <span>Explorar Catálogo Completo ({agency.properties_count || displayEstates.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {displayEstates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEstates.map((estate) => (
              <PublicPropertyCard
                key={estate.id}
                estate={estate}
                currency={agency.currency}
                primaryColor={primaryColor}
                domainParam={domainParam}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Catálogo en actualización</h3>
            <p className="text-xs text-slate-500 mt-1">
              Pronto publicaremos nuevas propiedades disponibles para esta agencia.
            </p>
          </div>
        )}
      </section>

      {/* 4. Sección Conócenos */}
      <section id="conocenos" className="py-16 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-50"
                style={{ color: primaryColor }}
              >
                <ShieldCheck className="w-4 h-4" />
                Sobre Nuestra Agencia
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {agency.about_title || `Conócenos — ${agency.name}`}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {agency.about_text ||
                  agency.description ||
                  'Nos dedicamos a conectar compradores, inversionistas y familias con las mejores oportunidades del mercado inmobiliario, ofreciendo transparencia, seguridad jurídica y acompañamiento integral.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Inmuebles Verificados</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Revisión documental y legal previa de cada propiedad.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Award className="w-5 h-5 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Asesoría Personalizada</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Acompañamiento comercial y financiero de principio a fin.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col justify-between">
                  <Building2 className="w-8 h-8 mb-4" style={{ color: primaryColor }} />
                  <div>
                    <span className="text-3xl font-extrabold block">{agency.properties_count || displayEstates.length}+</span>
                    <span className="text-xs text-slate-400 font-semibold">Propiedades Verificadas</span>
                  </div>
                </div>
                <div
                  className="p-6 rounded-2xl text-white flex flex-col justify-between"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Users className="w-8 h-8 mb-4 text-white/90" />
                  <div>
                    <span className="text-3xl font-extrabold block">100%</span>
                    <span className="text-xs text-white/90 font-semibold">Respaldo y Garantía Legal</span>
                  </div>
                </div>
                <div className="col-span-2 rounded-2xl overflow-hidden h-56 relative">
                  <img
                    src={heroBg}
                    alt={agency.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-5">
                    <div className="text-white">
                      <p className="text-sm font-extrabold">{agency.commercial_name || agency.name}</p>
                      <p className="text-xs text-slate-300">
                        {agency.address || [agency.city, agency.province].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Últimas Propiedades Añadidas */}
      {recentEstates.length > 0 && featuredEstates.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span
                className="text-xs font-extrabold uppercase tracking-wider block mb-1"
                style={{ color: primaryColor }}
              >
                Recién Incorporadas
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Últimas Propiedades Añadidas</h2>
            </div>
            <Link
              href={withDomain('/properties?sort=recent')}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold hover:underline"
              style={{ color: primaryColor }}
            >
              <span>Ver más recientes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEstates.map((estate) => (
              <PublicPropertyCard
                key={estate.id}
                estate={estate}
                currency={agency.currency}
                primaryColor={primaryColor}
                domainParam={domainParam}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Banner CTA de Consignación */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-7xl mx-auto rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{
            background: `linear-gradient(135deg, ${agency.secondary_color || '#0f172a'} 0%, ${primaryColor} 100%)`,
          }}
        >
          <div className="space-y-2 max-w-2xl text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider">
              Consignación de Inmuebles
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {agency.cta_text || '¿Deseas vender o alquilar tu propiedad? Contáctanos hoy mismo.'}
            </h3>
            <p className="text-xs sm:text-sm text-white/85">
              Gestionamos la comercialización de tu inmueble con máxima visibilidad, filtro de clientes y respaldo legal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {whatsappClean ? (
              <a
                href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                  `Hola ${agency.name}, deseo información para vender/alquilar mi propiedad.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Hablar con un Especialista</span>
              </a>
            ) : (
              <Link
                href={withDomain('/properties')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition-colors"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 7. Preguntas Frecuentes */}
      <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <span
            className="text-xs font-extrabold uppercase tracking-wider block mb-1"
            style={{ color: primaryColor }}
          >
            Resolvemos tus dudas
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <PublicInmobiliariaFooter agency={agency} domainParam={domainParam} />
    </div>
  );
};

export default PublicInmobiliariaHomeView;

