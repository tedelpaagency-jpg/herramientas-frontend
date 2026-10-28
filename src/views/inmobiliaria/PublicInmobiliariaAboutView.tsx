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
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import publicInmobiliariaService, {
  PublicAgencyConfig,
} from '@/services/publicInmobiliariaService';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import Header2Style3 from '@/components/layout/Header2Style3';
import Footer from '@/components/layout/Footer';
import BrandingThemeInjector from '@/components/inmobiliaria/BrandingThemeInjector';
import { DEFAULT_FALLBACK_AGENCY } from '@/constants/realEstateDefaults';

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

  const [agency, setAgency] = useState<PublicAgencyConfig | null>(null);
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

  // Registered agents from backend config
  const rawAgents: AgentItem[] = effectiveAgency.agents || [];
  // If no agents registered yet, provide a graceful fallback showcase card
  const agents: AgentItem[] = useMemo(() => {
    if (rawAgents.length > 0) return rawAgents;
    return [
      {
        id: 1,
        name: effectiveAgency.name || 'Asesor Inmobiliario',
        email: effectiveAgency.email || 'contacto@inmobiliaria.com',
        phone: effectiveAgency.phone || effectiveAgency.whatsapp || '+52 55 1234 5678',
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

  // Quiénes somos details
  const aboutTitle = effectiveAgency.about_title || 'Somos Tu Aliado Inmobiliario de Confianza';
  const aboutText =
    effectiveAgency.about_text ||
    effectiveAgency.description ||
    'Nos dedicamos a conectar compradores y vendedores con las mejores oportunidades del mercado inmobiliario, ofreciendo transparencia, seguridad jurídica y el más alto estándar de servicio.';
  const aboutImage =
    details.about_image ||
    effectiveAgency.banner_image ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

  // Misión & Visión details
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

  // Team details
  const teamTitle = details.team_title || 'Conoce a Nuestro Equipo de Asesores';
  const teamSubtitle =
    details.team_subtitle ||
    'Profesionales apasionados y certificados listos para acompañarte en cada paso de tu inversión o búsqueda de hogar.';

  // Points of certainty
  const items = [
    details.about_item1 || 'Propiedades 100% Verificadas Jurídicamente',
    details.about_item2 || 'Asesoría en Créditos Hipotecarios & Notariales',
    details.about_item3 || 'Acompañamiento Personalizado de Principio a Fin',
  ];

  const stat1Num = details.about_stat1_num || '15';
  const stat1Label = details.about_stat1_label || 'Años de Trayectoria';
  const stat2Num = details.about_stat2_num || '3,500';
  const stat2Label = details.about_stat2_label || 'Clientes Satisfechos';

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
            <span className="text-emerald-400 font-bold">Conócenos</span>
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

      {/* 3. Sección Quiénes Somos (2 Columnas: Historia y Foto) */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Columna Izquierda: Historia y Valores */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black tracking-wide uppercase border border-emerald-200/60">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quiénes Somos</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
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
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white"
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
                  <span className="block text-2xl sm:text-3xl font-black text-slate-900" style={{ color: primaryColor }}>
                    +{stat1Num}
                  </span>
                  <span className="text-xs font-bold text-slate-600 mt-0.5 block">
                    {stat1Label}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-2xl sm:text-3xl font-black text-slate-900" style={{ color: primaryColor }}>
                    +{stat2Num}
                  </span>
                  <span className="text-xs font-bold text-slate-600 mt-0.5 block">
                    {stat2Label}
                  </span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Imagen de presentación */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/5] max-h-[540px] w-full">
                <img
                  src={aboutImage}
                  alt={agencyName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Badge flotante inferior */}
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

      {/* 4. Sección Misión & Visión (Tarjetas estilizadas) */}
      <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-black uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-slate-600" />
              <span>Nuestros Pilares</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Misión y Visión
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Los principios que guían nuestras acciones diarias y el compromiso con cada cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Misión */}
            <div className="group rounded-3xl bg-white p-7 sm:p-9 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
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
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
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

      {/* 5. Carrusel de Agentes / Asesores Registrados */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-black tracking-wide uppercase mb-2">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Equipo Inmobiliario</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {teamTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-normal">
                {teamSubtitle}
              </p>
            </div>

            {/* Controles de navegación del carrusel */}
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

          {/* Swiper Carrusel de Agentes */}
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
                    {/* Foto o Avatar del Agente */}
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

                      {/* Badge de Rol */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                        {agent.role || 'Asesor Inmobiliario'}
                      </div>
                    </div>

                    {/* Información del Agente */}
                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      <div>
                        <h4 className="text-base font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                          {agent.name}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          {agent.role || 'Asesor Inmobiliario Profesional'}
                        </p>
                      </div>

                      {/* Botones de Contacto con Iconos (Teléfono, WhatsApp, Email) */}
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

      {/* 6. Banner CTA de Consignación */}
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

      {/* 7. Footer */}
      <Footer agency={effectiveAgency} />
    </div>
  );
};

export default PublicInmobiliariaAboutView;

