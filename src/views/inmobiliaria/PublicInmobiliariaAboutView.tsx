'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Phone,
  Mail,
  MessageSquare,
  Target,
  Compass,
  Award,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Users,
  Sparkles,
  Building2,
  MapPin,
  ArrowRight,
  ChevronLeft,
  Handshake,
  BadgeCheck,
  ExternalLink,
  Code,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {
  publicInmobiliariaService,
  PublicAgencyConfig,
  getCachedAgencyConfig,
} from '@/services/publicInmobiliariaService';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import Header2Style3 from '@/components/layout/Header2Style3';
import Footer from '@/components/layout/Footer';
import BrandingThemeInjector from '@/components/inmobiliaria/BrandingThemeInjector';
import { DEFAULT_FALLBACK_AGENCY } from '@/constants/realEstateDefaults';

const DEFAULT_COMMERCIAL_ALLIES = [
  {
    id: 1,
    name: 'Banco Pichincha',
    category: 'Entidad Financiera',
    description: 'Créditos hipotecarios preferenciales y precalificación inmediata para compradores.',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    website: 'https://www.pichincha.com',
  },
  {
    id: 2,
    name: 'Notaría Primera del Cantón',
    category: 'Seguridad Notarial',
    description: 'Asesoría jurídica integral, revisión de títulos y solemnización de escrituras públicas.',
    logo: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    website: '#',
  },
  {
    id: 3,
    name: 'Seguros Equinoccial',
    category: 'Pólizas & Aseguradora',
    description: 'Pólizas de seguro contra incendios, sismos y protección patrimonial para su nuevo hogar.',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    website: 'https://www.segurosequinoccial.com',
  },
  {
    id: 4,
    name: 'Biess - Banco del IESS',
    category: 'Crédito Hipotecario Público',
    description: 'Canalización directa de préstamos hipotecarios para afiliados y jubilados.',
    logo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=600&q=80',
    website: 'https://www.biess.fin.ec',
  },
  {
    id: 5,
    name: 'Constructora Uribe & Schwarzkopf',
    category: 'Desarrollo Inmobiliario',
    description: 'Proyectos residenciales y corporativos de vanguardia con alta plusvalía garantizada.',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
    website: '#',
  },
  {
    id: 6,
    name: 'Produbanco Grupo Promerica',
    category: 'Banca Hipotecaria',
    description: 'Financiamiento ágil para proyectos en planos y propiedades de reventa.',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    website: 'https://www.produbanco.com.ec',
  },
];

const DEFAULT_CLIENTS = [
  {
    id: 1,
    name: 'Grupo Manobanda',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Banco Pichincha',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Tesalia cbc',
    logo: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: 'InmoConstrucción Expo Quevedo',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=300&q=80',
  },
];

const DEFAULT_CERTIFICATIONS = [
  {
    id: 1,
    title: 'Licencia Profesional de Corretaje Inmobiliario',
    entity: 'Ministerio de Desarrollo Urbano y Vivienda',
    code: 'MIDUVI-LIC-09412',
    year: 'Vigente 2025 - 2026',
    description: 'Acreditación oficial que certifica el ejercicio legal y ético de la intermediación de bienes raíces.',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Miembro Activo ACBIR',
    entity: 'Asociación de Corredores de Bienes Raíces',
    code: 'ACBIR-SOCIO-REG-884',
    year: 'Certificado Anual',
    description: 'Garantía de apego a las normas gremiales más exigentes de transparencia, honestidad y honorarios justos.',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Acreditación MLS Internacional',
    entity: 'Multiple Listing Service Real Estate Network',
    code: 'MLS-ID-EC-22910',
    year: 'Acreditado',
    description: 'Acceso a la mayor red internacional de propiedades compartidas y compradores calificados globales.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Certificación en Prevención de Lavado de Activos',
    entity: 'Unidad de Análisis Financiero y Económico (UAFE)',
    code: 'UAFE-CUMP-2025-019',
    year: 'Cumplimiento 100%',
    description: 'Protocolos rigurosos de debida diligencia y conocimiento del cliente para operaciones 100% blindadas.',
    image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
  },
];

const DEFAULT_ABOUT_SECTIONS_ORDER = [
  'presentation',
  'mission_vision',
  'team',
  'clients',
  'allies',
  'certifications',
  'custom_html',
];

interface AgentItem {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
  role?: string | null;
}

export const PublicInmobiliariaAboutView: React.FC = () => {
  const searchParams = useSearchParams();
  const domainParam = searchParams?.get('domain') || null;

  const [agency, setAgency] = useState<PublicAgencyConfig | null>(() => {
    if (typeof window !== 'undefined') {
      return getCachedAgencyConfig(domainParam || undefined);
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    publicInmobiliariaService
      .getConfig(domainParam || undefined)
      .then((res) => {
        if (active && res.data) {
          setAgency(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [domainParam]);

  const effectiveAgency: PublicAgencyConfig = agency || DEFAULT_FALLBACK_AGENCY;
  const details = effectiveAgency.details || {};
  const primaryColor = effectiveAgency.primary_color || '#00a884';

  // 1. Clientes
  const ourClients = useMemo(() => {
    if (Array.isArray(details?.our_clients) && details.our_clients.length > 0) {
      return details.our_clients.filter((c: any) => c && (c.logo || c.image || c.image_url || c.logo_url));
    }
    return DEFAULT_CLIENTS;
  }, [details?.our_clients]);

  const clientsTitle = details?.clients_title || 'Nuestros Clientes';
  const clientsSubtitle = typeof details?.clients_subtitle === 'string' ? details.clients_subtitle.trim() : '';

  // 2. Asociados Comerciales (Aliados)
  const commercialAllies = useMemo(() => {
    if (Array.isArray(details?.commercial_allies) && details.commercial_allies.length > 0) {
      return details.commercial_allies;
    }
    return DEFAULT_COMMERCIAL_ALLIES;
  }, [details?.commercial_allies]);

  const alliesTitle = details?.allies_title || 'Asociados Comerciales';
  const alliesSubtitle = typeof details?.allies_subtitle === 'string' ? details.allies_subtitle.trim() : '';

  // 3. Certificaciones
  const certifications = useMemo(() => {
    if (Array.isArray(details?.certifications) && details.certifications.length > 0) {
      return details.certifications;
    }
    return DEFAULT_CERTIFICATIONS;
  }, [details?.certifications]);

  const certificationsTitle = details?.certifications_title || 'Certificaciones & Acreditaciones';
  const certificationsSubtitle = typeof details?.certifications_subtitle === 'string' ? details.certifications_subtitle.trim() : '';

  // 4. Secciones HTML Puro
  const aboutHtmlSections = useMemo(() => {
    if (Array.isArray(details?.about_html_sections)) {
      return details.about_html_sections.filter((s: any) => s && s.enabled !== false && s.html && s.html.trim() !== '');
    }
    return [];
  }, [details?.about_html_sections]);

  // 5. Orden y visibilidad de secciones
  const sectionsOrder = useMemo(() => {
    const configuredOrder: string[] = Array.isArray(details?.about_sections_order) && details.about_sections_order.length > 0
      ? details.about_sections_order
      : DEFAULT_ABOUT_SECTIONS_ORDER;
    const hidden: string[] = Array.isArray(details?.about_sections_hidden)
      ? details.about_sections_hidden
      : [];

    const combined = [...configuredOrder];
    DEFAULT_ABOUT_SECTIONS_ORDER.forEach((key) => {
      if (!combined.includes(key)) {
        combined.push(key);
      }
    });

    return combined.filter((key) => !hidden.includes(key));
  }, [details?.about_sections_order, details?.about_sections_hidden]);

  // Agentes
  const rawAgents: AgentItem[] = effectiveAgency.agents || [];
  const agents: AgentItem[] = useMemo(() => {
    if (rawAgents.length > 0) return rawAgents;
    return [
      {
        id: 1,
        name: effectiveAgency.name || 'Asesor Inmobiliario',
        email: effectiveAgency.email || 'contacto@inmobiliaria.com',
        phone: effectiveAgency.phone || effectiveAgency.whatsapp || '+593 99 999 9999',
        photo: null,
        role: 'Director de Asesoría Inmobiliaria',
      },
    ];
  }, [rawAgents, effectiveAgency]);

  const rawAgencyName = effectiveAgency.name || 'Inmobiliaria';
  const agencyName =
    rawAgencyName === 'Portal Inmobiliario' && effectiveAgency.commercial_name
      ? effectiveAgency.commercial_name
      : rawAgencyName === 'Portal Inmobiliario'
      ? 'Inmobiliaria'
      : rawAgencyName;

  // Quiénes somos
  const aboutTitle = effectiveAgency.about_title || 'Somos Tu Aliado Inmobiliario de Confianza';
  const aboutText =
    effectiveAgency.about_text ||
    effectiveAgency.description ||
    'Nos dedicamos a conectar compradores y vendedores con las mejores oportunidades del mercado inmobiliario, ofreciendo transparencia, seguridad jurídica y el más alto estándar de servicio.';
  const aboutImage =
    details.about_image ||
    effectiveAgency.banner_image ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

  // Misión & Visión
  const missionTitle = details.mission_title || 'Nuestra Misión';
  const missionText =
    details.mission_text ||
    'Brindar asesoría inmobiliaria de excelencia basada en la honestidad, transparencia y acompañamiento constante, logrando que cada compra, venta o alquiler sea una experiencia segura y exitosa para nuestros clientes.';
  const missionImage = details.mission_image || null;

  const visionTitle = details.vision_title || 'Nuestra Visión';
  const visionText =
    details.vision_text ||
    'Ser la agencia inmobiliaria de referencia en el mercado, reconocida por la innovación tecnológica, el compromiso ético y la calidad humana de nuestro equipo de asesores profesionales.';
  const visionImage = details.vision_image || null;

  const missionVisionSectionTitle = details.mission_vision_title || 'Misión y Visión';
  const missionVisionSubtitle = typeof details.mission_vision_subtitle === 'string' ? details.mission_vision_subtitle.trim() : '';

  // Team
  const teamTitle = details.team_title || 'Conoce a Nuestro Equipo de Asesores';
  const teamSubtitle = typeof details.team_subtitle === 'string' ? details.team_subtitle.trim() : '';

  // Puntos clave
  const items = [
    details.about_item1 || 'Propiedades 100% Verificadas Jurídicamente',
    details.about_item2 || 'Asesoría en Créditos Hipotecarios & Notariales',
    details.about_item3 || 'Acompañamiento Personalizado de Principio a Fin',
  ];

  const stat1Num = details.about_stat1_num || '15';
  const stat1Label = details.about_stat1_label || 'Años de Trayectoria';
  const stat2Num = details.about_stat2_num || '3,500';
  const stat2Label = details.about_stat2_label || 'Clientes Satisfechos';

  // ==========================================
  // RENDERIZADORES DE SECCIONES INDIVIDUALES
  // ==========================================

  // 1. Quiénes Somos / Historia
  const renderPresentationSection = () => (
    <section key="presentation" className="py-16 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-black tracking-wide uppercase border border-slate-200">
              <Building2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>Quiénes Somos</span>
            </div>

            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight"
              style={{ color: primaryColor }}
            >
              {aboutTitle}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {aboutText}
            </p>

            {/* Puntos de valor */}
            <div className="space-y-3 pt-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Métricas destacadas */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="block text-2xl sm:text-3xl font-black" style={{ color: primaryColor }}>
                  +{stat1Num}
                </span>
                <span className="text-xs font-bold text-slate-600 mt-0.5 block">
                  {stat1Label}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="block text-2xl sm:text-3xl font-black" style={{ color: primaryColor }}>
                  +{stat2Num}
                </span>
                <span className="text-xs font-bold text-slate-600 mt-0.5 block">
                  {stat2Label}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/5] max-h-[540px] w-full">
              <img
                src={aboutImage}
                alt={agencyName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/20 flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {agencyName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">
                    {agencyName}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Asesoría profesional garantizada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // 2. Misión y Visión
  const renderMissionVisionSection = () => (
    <section key="mission_vision" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-black uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            <span>Nuestros Pilares</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: primaryColor }}>
            {missionVisionSectionTitle}
          </h2>
          {missionVisionSubtitle && (
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              {missionVisionSubtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Misión */}
          <div className="group rounded-3xl bg-white p-7 sm:p-9 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
            <div className="space-y-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-colors duration-200 shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {missionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {missionText}
              </p>
            </div>

            {missionImage && (
              <div className="mt-6 rounded-2xl overflow-hidden aspect-[16/9] border border-slate-100 bg-slate-50">
                <img
                  src={missionImage}
                  alt={missionTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
          </div>

          {/* Card Visión */}
          <div className="group rounded-3xl bg-white p-7 sm:p-9 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white transition-colors duration-200 shadow-xs">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {visionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {visionText}
              </p>
            </div>

            {visionImage && (
              <div className="mt-6 rounded-2xl overflow-hidden aspect-[16/9] border border-slate-100 bg-slate-50">
                <img
                  src={visionImage}
                  alt={visionTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  // 3. Equipo de Asesores
  const renderTeamSection = () => (
    <section key="team" className="py-16 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-black tracking-wide uppercase mb-2 border border-slate-200">
              <Users className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>Equipo Inmobiliario</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: primaryColor }}>
              {teamTitle}
            </h2>
            {teamSubtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-normal">
                {teamSubtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="team-slider-prev w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-700 transition-all cursor-pointer active:scale-95 shadow-2xs"
              aria-label="Agente anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="team-slider-next w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-700 transition-all cursor-pointer active:scale-95 shadow-2xs"
              aria-label="Agente siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          navigation={{
            prevEl: '.team-slider-prev',
            nextEl: '.team-slider-next',
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-10"
        >
          {agents.map((agent) => {
            const cleanPhone = (agent.phone || effectiveAgency.phone || effectiveAgency.whatsapp || '')
              .replace(/\s+/g, '')
              .replace(/[^0-9+]/g, '');
            const waPhone = cleanPhone.replace('+', '');
            const email = agent.email || effectiveAgency.email || 'contacto@inmobiliaria.com';

            return (
              <SwiperSlide key={agent.id}>
                <div className="group rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
                  <div className="relative aspect-[4/3] bg-gradient-to-tr from-slate-800 to-slate-700 overflow-hidden">
                    {agent.photo ? (
                      <img
                        src={agent.photo}
                        alt={agent.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950 p-4">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/20 mb-2"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-slate-300">Asesor Verificado</span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                      {agent.role || 'Asesor Inmobiliario'}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <h4 className="text-base font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                        {agent.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {agent.role || 'Asesor Inmobiliario Profesional'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {cleanPhone ? (
                        <a
                          href={`tel:${cleanPhone}`}
                          className="flex-1 py-2 px-2 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200/80 shadow-2xs active:scale-95 cursor-pointer"
                          title={`Llamar a ${agent.name}`}
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-600 group-hover:text-white" />
                          <span className="hidden sm:inline">Llamar</span>
                        </a>
                      ) : null}

                      {waPhone ? (
                        <a
                          href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                            `Hola ${agent.name}, vi su perfil en el portal de ${agencyName} y me gustaría recibir asesoría inmobiliaria.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-emerald-200/60 shadow-2xs active:scale-95 cursor-pointer"
                          title={`Escribir por WhatsApp a ${agent.name}`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                          <span>WhatsApp</span>
                        </a>
                      ) : null}

                      {email ? (
                        <a
                          href={`mailto:${email}?subject=${encodeURIComponent(
                            `Consulta Inmobiliaria — ${agencyName}`
                          )}`}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center border border-slate-200/80 shadow-2xs active:scale-95 cursor-pointer"
                          title={`Enviar correo a ${email}`}
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );

  // 4. Nuestros Clientes (Carrusel de logos horizontal exacto como Imagen 1)
  const renderClientsSection = () => {
    if (ourClients.length === 0) return null;

    return (
      <section key="clients" className="py-14 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
              style={{ color: primaryColor }}
            >
              {clientsTitle}
            </h2>
            {clientsSubtitle && (
              <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium max-w-2xl mx-auto">
                {clientsSubtitle}
              </p>
            )}
          </div>

          <div className="relative">
            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              loop={ourClients.length > 3}
              spaceBetween={32}
              slidesPerView={2}
              breakpoints={{
                480: { slidesPerView: 2, spaceBetween: 24 },
                640: { slidesPerView: 3, spaceBetween: 32 },
                1024: { slidesPerView: 4, spaceBetween: 40 },
                1280: { slidesPerView: 5, spaceBetween: 48 },
              }}
              className="py-2 items-center"
            >
              {ourClients.map((client: any, idx: number) => {
                const logoUrl = client.logo || client.image || client.logo_url || client.image_url;
                if (!logoUrl) return null;
                return (
                  <SwiperSlide key={client.id || idx} className="flex items-center justify-center">
                    <div className="h-24 sm:h-28 w-full flex items-center justify-center p-2">
                      <img
                        src={logoUrl}
                        alt={client.name || `Cliente ${idx + 1}`}
                        loading="lazy"
                        className="max-h-16 sm:max-h-20 max-w-[180px] sm:max-w-[220px] w-auto h-auto object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </section>
    );
  };

  // 5. Asociados Comerciales (Tarjetas limpias con imagen redondeada arriba exacto como Imagen 2)
  const renderAlliesSection = () => {
    if (commercialAllies.length === 0) return null;

    return (
      <section key="allies" className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
              style={{ color: primaryColor }}
            >
              {alliesTitle}
            </h2>
            {alliesSubtitle && (
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium max-w-2xl mx-auto">
                {alliesSubtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {commercialAllies.map((ally: any, idx: number) => {
              const allyImage = ally.logo || ally.image_url || ally.image || ally.logo_url;
              return (
                <div
                  key={ally.id || idx}
                  className="flex flex-col justify-between group transition-all duration-300"
                >
                  <div>
                    {/* Imagen superior estilo Imagen 2 con bordes redondeados destacados sin borde ni fondo blanco */}
                    {allyImage ? (
                      <div className="w-full aspect-[4/4] sm:aspect-[4/3.8] rounded-3xl overflow-hidden relative flex items-center justify-center">
                        <img
                          src={allyImage}
                          alt={ally.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-3xl"
                        />
                      </div>
                    ) : null}

                    {/* Título en negrita abajo de la imagen */}
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-4 m-0 group-hover:text-emerald-700 transition-colors">
                      {ally.name}
                    </h3>

                    {/* Descripción debajo del título */}
                    {ally.description ? (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mt-2.5 m-0">
                        {ally.description}
                      </p>
                    ) : null}
                  </div>

                  {ally.website && ally.website !== '#' && (
                    <div className="pt-3 mt-4 flex items-center justify-between">
                      <a
                        href={ally.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <span>Visitar sitio oficial</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  // 6. Certificaciones & Acreditaciones
  const renderCertificationsSection = () => {
    if (certifications.length === 0) return null;

    return (
      <section key="certifications" className="py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider border border-emerald-200/60">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Garantía &amp; Legalidad</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: primaryColor }}>
              {certificationsTitle}
            </h2>
            {certificationsSubtitle && (
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {certificationsSubtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert: any, idx: number) => {
              const certImage = cert.image_url || cert.image || cert.badge_url || cert.logo;
              return (
                <div
                  key={cert.id || idx}
                  className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {certImage ? (
                      <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 relative flex items-center justify-center">
                        <img
                          src={certImage}
                          alt={cert.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug m-0">
                        {cert.title}
                      </h3>
                      {cert.entity && (
                        <p className="text-[11px] font-bold text-slate-500 mt-1 m-0">
                          {cert.entity}
                        </p>
                      )}
                    </div>
                    {cert.description && (
                      <p className="text-xs text-slate-600 leading-relaxed m-0">
                        {cert.description}
                      </p>
                    )}
                  </div>
                  {(cert.code || cert.year) && (
                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono font-bold text-slate-700">
                      <span className="truncate max-w-[130px]">{cert.code || ''}</span>
                      <span className="text-emerald-700 font-sans font-bold text-[10px] bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        {cert.year || 'Verificado'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  // 7. Secciones con HTML Puro
  const renderCustomHtmlSection = () => {
    if (aboutHtmlSections.length === 0) return null;

    return (
      <div key="custom_html" className="space-y-0">
        {aboutHtmlSections.map((sec: any, idx: number) => {
          const bgClass =
            sec.bg === 'dark'
              ? 'bg-slate-950 text-white'
              : sec.bg === 'slate'
              ? 'bg-slate-50 text-slate-900'
              : 'bg-white text-slate-900';
          const containerClass = sec.container === 'full' ? 'w-full px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

          return (
            <section key={sec.id || idx} className={`py-16 lg:py-20 border-b border-slate-200/80 ${bgClass}`}>
              <div className={containerClass}>
                {sec.title && sec.title.trim() !== '' && (
                  <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: primaryColor }}>
                      {sec.title}
                    </h2>
                    {sec.subtitle && sec.subtitle.trim() !== '' && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {sec.subtitle}
                      </p>
                    )}
                  </div>
                )}
                <div
                  className="w-full overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: sec.html }}
                />
              </div>
            </section>
          );
        })}
      </div>
    );
  };

  return (
    <div className="travel-agency-03-root min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      <BrandingThemeInjector agency={effectiveAgency} />
      {/* 1. Header con Topbar slider */}
      <TopbarSlider agency={effectiveAgency} />
      <Header2Style3 agency={effectiveAgency} />

      {/* 2. Hero Breadcrumb Header */}
      <section className="relative py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00a884_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <nav className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-slate-300 mb-4 border border-white/10">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold" style={{ color: primaryColor }}>Conócenos</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
            Pasión, Certeza y Excelencia Inmobiliaria
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            Conoce la historia, los principios y el equipo humano que hacen de{' '}
            <strong className="text-white">{agencyName}</strong> tu mejor aliado en bienes raíces.
          </p>
        </div>
      </section>

      {/* 3. Render dinámico de secciones según el orden configurado */}
      {sectionsOrder.map((sectionKey) => {
        switch (sectionKey) {
          case 'presentation':
            return renderPresentationSection();
          case 'mission_vision':
            return renderMissionVisionSection();
          case 'team':
            return renderTeamSection();
          case 'clients':
            return renderClientsSection();
          case 'allies':
            return renderAlliesSection();
          case 'certifications':
            return renderCertificationsSection();
          case 'custom_html':
            return renderCustomHtmlSection();
          default:
            return null;
        }
      })}

      {/* 4. Banner CTA de Consignación */}
      <section className="py-14 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {effectiveAgency.cta_text || '¿Deseas vender o rentar tu propiedad con nosotros?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Pon tu inmueble en manos de asesores certificados con alcance en los portales más importantes.
            </p>
          </div>
          <Link
            href="/properties"
            className="px-6 py-3 rounded-full text-xs font-black text-slate-900 bg-white hover:bg-slate-100 active:scale-95 transition-all shadow-xl whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <span>Explorar Propiedades</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. Footer */}
      <Footer agency={effectiveAgency} />
    </div>
  );
};

export default PublicInmobiliariaAboutView;
