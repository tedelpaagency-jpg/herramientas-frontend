'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Building2,
  MapPin,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
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

  // Filter Tabs & Search Form
  const [activeTab, setActiveTab] = useState<'all' | 'sale' | 'rent' | 'lots'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceMax, setPriceMax] = useState('');
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

  const handleTabClick = (tab: 'all' | 'sale' | 'rent' | 'lots') => {
    setActiveTab(tab);
    if (tab === 'all') {
      setPropertyStatus('');
    } else if (tab === 'sale') {
      setPropertyStatus('2');
    } else if (tab === 'rent') {
      setPropertyStatus('1');
    } else if (tab === 'lots') {
      setPropertyStatus('');
      setPropertyType('3');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (domainParam) params.set('domain', domainParam);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (propertyStatus) params.set('property_status', propertyStatus);
    if (propertyType) params.set('property_type', propertyType);
    if (priceMax) params.set('price_max', priceMax);
    router.push(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  if (loading && !agency) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#2067F5] border-t-transparent rounded-full animate-spin" />
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
              className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-bold hover:bg-[#2067F5] transition-colors"
            >
              Acceder al Panel de Control
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
      a: 'Puedes seleccionar cualquier propiedad de nuestro catálogo y contactarnos directamente por WhatsApp o llamada para coordinar una visita presencial o virtual con uno de nuestros asesores.',
    },
    {
      q: '¿Brindan asesoría legal y financiera durante la compra?',
      a: 'Sí, acompañamos todo el proceso desde la promesa de compraventa, revisión notarial de escrituras y gestión de crédito hipotecario hasta la entrega de llaves.',
    },
    {
      q: '¿Cómo puedo consignar mi inmueble para venta o alquiler?',
      a: 'Contáctanos mediante el botón de contacto o WhatsApp. Realizamos el avalúo comercial, reportaje fotográfico y promoción en nuestros canales digitales.',
    },
  ];

  const partners = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=200&q=80',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <PublicInmobiliariaHeader agency={agency} domainParam={domainParam} />

      {/* 1. Hero Principal Redondeado (Estilo Home4 / Travel-Agency-03) */}
      <section className="pt-6 sm:pt-8 px-4 sm:px-8 max-w-[1440px] mx-auto w-full">
        <div className="relative rounded-[32px] sm:rounded-[48px] overflow-hidden min-h-[640px] sm:min-h-[720px] flex items-center justify-center p-6 sm:p-12 shadow-2xl">
          {/* Fondo de Imagen o Video */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

          <div className="relative z-10 w-full max-w-5xl text-center py-10">
            <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-md">
              {agency.hero_title || 'Encuentra el Inmueble Ideal.'}
            </h1>
            <p className="text-base sm:text-xl text-white font-medium max-w-2xl mx-auto mb-10 drop-shadow-sm">
              {agency.hero_subtitle || 'La mejor agencia inmobiliaria con propiedades verificadas y '}{' '}
              <span className="italic font-serif text-white/95">“Respaldo Legal Garantizado”</span>
            </p>

            {/* Filter Wrapper Flotante con 4 Píldoras en el tope */}
            <div className="w-full max-w-4xl mx-auto text-left">
              {/* Píldoras de categoría superior */}
              <div className="flex items-center gap-2.5 sm:gap-3 pl-3 sm:pl-6 -mb-4 relative z-20 overflow-x-auto scrollbar-none pb-1">
                <button
                  type="button"
                  onClick={() => handleTabClick('all')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-[#2067F5] text-white'
                      : 'bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-amber-500 font-black">★</span>
                  <span>Todas</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('sale')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                    activeTab === 'sale'
                      ? 'bg-[#2067F5] text-white'
                      : 'bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-amber-700 font-black">🏷</span>
                  <span>En Venta</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('rent')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                    activeTab === 'rent'
                      ? 'bg-[#2067F5] text-white'
                      : 'bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-blue-500 font-black">🔑</span>
                  <span>En Alquiler</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('lots')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                    activeTab === 'lots'
                      ? 'bg-[#2067F5] text-white'
                      : 'bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-emerald-500 font-black">📐</span>
                  <span>Terrenos &amp; Lotes</span>
                </button>
              </div>

              {/* Caja Blanca de Búsqueda con 3 Inputs y Botón BUSCAR */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative z-10">
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
                  {/* Caja 1: Ubicación / Ciudad */}
                  <div className="sm:col-span-4 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 bg-white">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={agency.city || 'Quito, Guayaquil, Cumbayá...'}
                        className="w-full text-xs sm:text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                      />
                      <span className="text-[11px] text-slate-400 block font-medium truncate">
                        {agency.province || agency.city || 'Ciudad o Sector'}
                      </span>
                    </div>
                  </div>

                  {/* Caja 2: Tipo de Propiedad */}
                  <div className="sm:col-span-3 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 bg-white">
                    <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full text-xs sm:text-sm font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                      >
                        <option value="">Todos los Tipos</option>
                        <option value="1">Casas Residenciales</option>
                        <option value="2">Departamentos</option>
                        <option value="3">Terrenos / Lotes</option>
                        <option value="4">Locales Comerciales</option>
                        <option value="5">Oficinas Corporativas</option>
                      </select>
                      <span className="text-[11px] text-slate-400 block font-medium">Categoría</span>
                    </div>
                  </div>

                  {/* Caja 3: Rango de Precio */}
                  <div className="sm:col-span-3 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 bg-white">
                    <Layers className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <select
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-full text-xs sm:text-sm font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                      >
                        <option value="">Cualquier Precio</option>
                        <option value="50000">Hasta $50,000</option>
                        <option value="100000">Hasta $100,000</option>
                        <option value="150000">Hasta $150,000</option>
                        <option value="250000">Hasta $250,000</option>
                        <option value="500000">Hasta $500,000</option>
                        <option value="1000000">Hasta $1,000,000</option>
                      </select>
                      <span className="text-[11px] text-slate-400 block font-medium">Rango de Precio</span>
                    </div>
                  </div>

                  {/* Botón BUSCAR */}
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-[#2067F5] text-white text-xs sm:text-sm font-extrabold shadow-lg hover:bg-[#1554cf] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>BUSCAR</span>
                    </button>
                  </div>
                </form>

                {/* Texto inferior de ayuda */}
                <p className="text-xs text-slate-500 font-medium mt-4 text-center sm:text-left">
                  ¿No encuentras lo que buscas? Solicita una{' '}
                  <a
                    href={
                      whatsappClean
                        ? `https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                            `Hola ${agency.name}, solicito asesoría personalizada para buscar una propiedad.`
                          )}`
                        : '#contacto'
                    }
                    className="text-[#2067F5] font-bold hover:underline"
                  >
                    Búsqueda Personalizada
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Marquee de Aliados y Empresas de Confianza (Partner.tsx) */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h5 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-6">
            Empresas y Aliados que Confían en Nuestra Gestión Inmobiliaria
          </h5>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="text-lg font-black tracking-wider text-slate-700">BANCO GUAYAQUIL</span>
            <span className="text-lg font-black tracking-wider text-slate-700">PRODUBANCO</span>
            <span className="text-lg font-black tracking-wider text-slate-700">BIESS HIPOTECARIO</span>
            <span className="text-lg font-black tracking-wider text-slate-700">CONSTRUCTORA PRO</span>
            <span className="text-lg font-black tracking-wider text-slate-700">NOTARÍA PRIMERA</span>
          </div>
        </div>
      </section>

      {/* 3. 3 Pastel Feature Cards (#BDEBCE, #E2E2FF, #E6F5A9) como en /travel-agency-03 */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Mint Green */}
          <div className="p-8 rounded-3xl bg-[#BDEBCE] text-slate-900 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center text-xl mb-4 font-black">
                🏡
              </div>
              <h3 className="text-xl font-extrabold mb-2">Compra y Alquiler Directo.</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Gestiona tu próxima propiedad de manera ágil, segura y sin intermediarios dudosos.
              </p>
            </div>
          </div>

          {/* Card 2: Soft Lavender */}
          <div className="p-8 rounded-3xl bg-[#E2E2FF] text-slate-900 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center text-xl mb-4 font-black">
                💎
              </div>
              <h3 className="text-xl font-extrabold mb-2">Precios &amp; Oportunidades.</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Accede a inmuebles exclusivos con valores negociados y alta plusvalía comprobada.
              </p>
            </div>
          </div>

          {/* Card 3: Soft Lime */}
          <div className="p-8 rounded-3xl bg-[#E6F5A9] text-slate-900 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center text-xl mb-4 font-black">
                ⚖️
              </div>
              <h3 className="text-xl font-extrabold mb-2">Asesoría Legal y Local.</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Revisión exhaustiva de escrituras, títulos y acompañamiento notarial en cada paso.
              </p>
            </div>
          </div>
        </div>

        {/* Barra inferior tipo cápsula */}
        <div className="bg-slate-100 rounded-full p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left px-6">
          <span className="text-xs sm:text-sm font-bold text-slate-700">
            Personaliza la búsqueda de tu propiedad o consígnanos tu inmueble en un clic.
          </span>
          <a
            href={
              whatsappClean
                ? `https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                    `Hola ${agency.name}, deseo contactar a un asesor inmobiliario.`
                  )}`
                : '#contacto'
            }
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#111111] text-white text-xs font-extrabold hover:bg-[#2067F5] transition-colors shrink-0"
          >
            <span>Contactar Asesor</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 4. Categorías de Propiedades */}
      {categories.length > 0 && (
        <section className="py-14 bg-slate-50/60 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                Categorías de Propiedades
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Encuentra el inmueble ideal según tus necesidades de espacio, inversión o estilo de vida.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={withDomain(`/properties?property_type=${cat.id}`)}
                  className="group bg-white p-5 rounded-3xl border border-slate-200/80 hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2067F5] flex items-center justify-center font-black mb-4 group-hover:bg-[#2067F5] group-hover:text-white transition-colors">
                    🏛
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#2067F5] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      {cat.count > 0 ? `${cat.count} Propiedades` : 'Explorar'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Propiedades Destacadas */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Propiedades Destacadas</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Las mejores opciones del mercado seleccionadas por nuestro equipo de expertos.
            </p>
          </div>
          <Link
            href={withDomain('/properties')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md hover:bg-[#1554cf] transition-colors bg-[#2067F5] self-start sm:self-auto"
          >
            <span>Ver Todo el Catálogo ({agency.properties_count || displayEstates.length})</span>
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
                primaryColor="#2067F5"
                domainParam={domainParam}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-12 text-center">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Catálogo en actualización</h3>
            <p className="text-xs text-slate-500 mt-1">
              Pronto publicaremos nuevas propiedades disponibles para esta agencia.
            </p>
          </div>
        )}
      </section>

      {/* 6. Sección Conócenos (AboutV4 con Contadores 10+ y 2,500+) */}
      <section id="conocenos" className="py-16 bg-slate-50/70 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-50 text-[#2067F5]">
                <ShieldCheck className="w-4 h-4" />
                Sobre Nuestra Agencia
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {agency.about_title || `Conócenos — ${agency.name}`}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {agency.about_text ||
                  agency.description ||
                  'Nos dedicamos a conectar compradores, propietarios e inversionistas con las mejores oportunidades del mercado inmobiliario, ofreciendo transparencia, seguridad jurídica y acompañamiento integral en cada paso.'}
              </p>

              <div className="space-y-2.5 pt-1 text-xs sm:text-sm font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2067F5]" />
                  <span>Asesoría Jurídica y Notarial Personalizada</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2067F5]" />
                  <span>Cartera de Inmuebles 100% Verificados y Libres de Gravamen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2067F5]" />
                  <span>Gestión Eficiente de Créditos Hipotecarios y Financiamiento</span>
                </div>
              </div>

              {/* Contadores */}
              <div className="flex items-center gap-8 pt-4 border-t border-slate-200">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 block">10+</span>
                  <span className="text-xs text-slate-500 font-semibold">Años de Trayectoria</span>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#2067F5] block">2,500+</span>
                  <span className="text-xs text-slate-500 font-semibold">Clientes Felices Asesorados</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl h-80 sm:h-96 relative">
                <img
                  src={heroBg}
                  alt={agency.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-lg font-extrabold">{agency.commercial_name || agency.name}</p>
                    <p className="text-xs text-slate-300">
                      {agency.address || [agency.city, agency.province].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Por Qué Elegirnos (4 Feature Cards con Rating 4.9) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">¿Por Qué Elegirnos?</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tu patrimonio merece el mejor respaldo con ventajas comprobadas en cada operación.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 self-start sm:self-auto">
            <span className="text-2xl font-black text-[#2067F5]">4.9</span>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">Valoración de Clientes</span>
              <span className="text-amber-500 text-xs">★★★★★</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2067F5] flex items-center justify-center font-bold mx-auto mb-3">
              🛡
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-1">Propiedades Verificadas</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inspeccionamos cada inmueble técnica y legalmente para asegurar títulos limpios.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2067F5] flex items-center justify-center font-bold mx-auto mb-3">
              ⚖️
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-1">Seguridad Jurídica</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Redacción y revisión notarial de contratos de promesa y compraventa.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2067F5] flex items-center justify-center font-bold mx-auto mb-3">
              📍
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-1">Conocimiento Local</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Te guiamos hacia las mejores zonas de plusvalía, colegios y transporte.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2067F5] flex items-center justify-center font-bold mx-auto mb-3">
              💬
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-1">Atención Inmediata</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Respuesta ágil por WhatsApp, agendamiento de visitas y créditos hipotecarios.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Banner CTA de Consignación */}
      <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-[36px] p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-slate-950 via-slate-900 to-[#2067F5]">
          <div className="space-y-2 max-w-2xl text-center lg:text-left">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider">
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
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-950 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition-colors"
              >
                <span>Hablar con un Especialista</span>
              </a>
            ) : (
              <Link
                href={withDomain('/properties')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-950 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition-colors"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 9. Preguntas Frecuentes */}
      <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold uppercase tracking-wider block mb-1 text-[#2067F5]">
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
                  <HelpCircle className="w-4 h-4 shrink-0 text-[#2067F5]" />
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
