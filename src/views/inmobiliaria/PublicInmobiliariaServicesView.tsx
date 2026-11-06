'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Briefcase,
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Building2,
  Scale,
  Camera,
  MessageCircle,
  Compass,
  Layers,
  FileText,
} from 'lucide-react';

import {
  getCachedAgencyConfig,
  publicInmobiliariaService,
  PublicAgencyConfig,
} from '@/services/publicInmobiliariaService';
import Header2Style3 from '@/components/layout/Header2Style3';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import BrandingThemeInjector from '@/components/inmobiliaria/BrandingThemeInjector';
import Footer from '@/components/layout/Footer';
import { DEFAULT_FALLBACK_AGENCY } from '@/constants/realEstateDefaults';

export interface RealEstateServiceItem {
  id?: string | number;
  title: string;
  description: string;
  image_url?: string;
  photo?: string;
  cta_text?: string;
  icon?: string;
}

export interface AdvisoryAccordionItem {
  id: string | number;
  title: string;
  image_url?: string;
  description: string;
}

// Valores por defecto específicos para Immobillis (https://old.immobillis.com/services)
const IMMOBILLIS_PROFESSIONAL_ITEMS: AdvisoryAccordionItem[] = [
  {
    id: 1,
    title: 'Levantamiento topográfico',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/pngwing.com-5.png.avif',
    description:
      'Estudio técnico y descriptivo de un terreno, examinando la superficie terrestre en la cual se tienen en cuenta las características físicas, geográficas y geológicas del terreno, pero también sus variaciones y alteraciones, se denomina a este acopio de datos o plano que refleja al detalle y sirve como instrumento de planificación para edificaciones y construcciones.',
  },
  {
    id: 2,
    title: 'Diseño de proyectos arquitectónicos y urbanos',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/pngwing.com-4.png.avif',
    description:
      'Buscamos identificar la forma en que las personas usan las edificaciones y los espacios urbanos, y cómo se relacionan con los lugares donde viven, trabajan y pasean. Analiza básicamente una serie de consideraciones espaciales: diseño, escala, densidad, apariencia y paisaje.',
  },
  {
    id: 3,
    title: 'Representaciones, visualización en 3D y Renders.',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/pngwing.com-6-768x576.png.avif',
    description:
      'La representación en 3D es el proceso de crear una imagen fotorrealista en 2D a partir de modelos 3D. La representación en 3D es el paso final en el proceso de visualización en 3D, lo que conlleva la creación de modelos de objetos, la texturización de dichos objetos y la inclusión de luz en la escena.',
  },
];

const IMMOBILLIS_LEGAL_ITEMS: AdvisoryAccordionItem[] = [
  {
    id: 1,
    title: 'Servicios notariales',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/enrollment.png.avif',
    description:
      'Si estás buscando el hogar de tus sueños o si quieres vender algún inmueble, estos trámites ya no tendrán que pausarse. En inmobilis te contamos cuales son los trámites notariales o servicios inmobiliarios que puedes hacer.',
  },
  {
    id: 2,
    title: 'Escrituras, promesas de compra y venta.',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/icono_documentos_estudiantes.png.avif',
    description:
      'Una promesa de contrato que funciona como garantía, donde las partes se obligan recíprocamente a celebrar, en el futuro y con todos los requisitos que la Ley exige',
  },
  {
    id: 3,
    title: 'Poderes y Cartas-Permiso.',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/documentos-1-274x300.png.avif',
    description:
      'Se trata de un escrito mediante el cual una persona otorga o concede autorización a otra en su representación para que esta ejecute actos administrativos, mercantiles, judiciales o de dominio.',
  },
];

export const DEFAULT_SERVICES_SECTIONS_ORDER = [
  'commercial_marketing',
  'professional_advisory',
  'legal_advisory',
  'services_catalog',
];

export const PublicInmobiliariaServicesView: React.FC = () => {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get('domain');

  const [agency, setAgency] = useState<PublicAgencyConfig | null>(() => {
    if (typeof window !== 'undefined') {
      return getCachedAgencyConfig(domainParam || undefined);
    }
    return null;
  });

  useEffect(() => {
    const currentDomain =
      domainParam || (typeof window !== 'undefined' ? window.location.hostname : undefined);

    publicInmobiliariaService.getConfig(currentDomain).then((res) => {
      if (res?.data) setAgency(res.data);
    });
  }, [domainParam]);

  const effectiveAgency: PublicAgencyConfig = agency || DEFAULT_FALLBACK_AGENCY;
  const rawAgencyName = effectiveAgency.name || 'Inmobiliaria';
  const agencyName =
    rawAgencyName === 'Portal Inmobiliario' && effectiveAgency.commercial_name
      ? effectiveAgency.commercial_name
      : rawAgencyName;

  const isImmobillis =
    effectiveAgency.id === 394 ||
    (typeof effectiveAgency.domain === 'string' &&
      effectiveAgency.domain.toLowerCase().includes('immobillis')) ||
    (typeof effectiveAgency.name === 'string' &&
      effectiveAgency.name.toLowerCase().includes('immobillis'));

  const primaryColor = effectiveAgency.primary_color || (isImmobillis ? '#E8BB00' : '#2067F5');
  const phoneDisplay = effectiveAgency.phone || effectiveAgency.whatsapp || '+593 0984113967';
  const cleanPhone = phoneDisplay.replace(/[^0-9]/g, '') || '593984113967';

  const details =
    typeof effectiveAgency.details === 'object' && effectiveAgency.details !== null
      ? effectiveAgency.details
      : {};

  // Estado interactivo de acordeones
  const [openProfItem, setOpenProfItem] = useState<string | number>(1);
  const [openLegalItem, setOpenLegalItem] = useState<string | number>(1);

  // 1. Asesoría Comercial y Marketing
  const commMktTitle =
    details?.services_comm_mkt_title ||
    (isImmobillis ? 'Aseroría comercial y marketing' : 'Asesoría Comercial y Marketing');
  const commMktSubtitle =
    typeof details?.services_comm_mkt_subtitle === 'string'
      ? details.services_comm_mkt_subtitle.trim()
      : isImmobillis
      ? 'Explora nuestros servicios'
      : '';
  const commMktDesc =
    details?.services_comm_mkt_desc ||
    (isImmobillis
      ? 'En Immobillis desarrollamos estrategias integrales para vender o alquilar tu propiedad en el menor tiempo y al mejor precio.'
      : 'Estrategias integrales y multidisciplinarias para comercializar o gestionar tus inmuebles con la mayor rentabilidad.');

  const commBox1Title = details?.services_comm_box1_title || 'Asesoría Comercial';
  const commBox1Items: string[] =
    Array.isArray(details?.services_comm_box1_items) && details.services_comm_box1_items.length > 0
      ? details.services_comm_box1_items
      : [
          'Análisis de mercado (ACM) y avalúo profesional.',
          'Fijación de precio óptimo según oferta y demanda.',
          'Definición del cliente objetivo.',
          'Gestión de prospectos, visitas y negociación.',
          'Acompañamiento hasta el cierre.',
        ];

  const commBox2Title = details?.services_comm_box2_title || 'Marketing Inmobiliario';
  const commBox2Items: string[] =
    Array.isArray(details?.services_comm_box2_items) && details.services_comm_box2_items.length > 0
      ? details.services_comm_box2_items
      : [
          'Fotografía y video profesional.',
          'Publicación en portales y redes sociales.',
          'Campañas digitales segmentadas.',
          'Difusión en nuestra red de clientes e inversionistas.',
        ];

  // 2. Asesoría Profesional (Acordeón)
  const profTitle =
    details?.services_prof_title || (isImmobillis ? 'Asesoria Profesional' : 'Asesoría Profesional');
  const profSubtitle =
    typeof details?.services_prof_subtitle === 'string'
      ? details.services_prof_subtitle.trim()
      : isImmobillis
      ? 'Asesoria'
      : '';
  const profItems: AdvisoryAccordionItem[] = useMemo(() => {
    if (Array.isArray(details?.services_prof_items) && details.services_prof_items.length > 0) {
      return details.services_prof_items;
    }
    return IMMOBILLIS_PROFESSIONAL_ITEMS;
  }, [details?.services_prof_items]);

  // 3. Asesoría Jurídica (Acordeón)
  const legalTitle =
    details?.services_legal_title || (isImmobillis ? 'Asesoria Juridica' : 'Asesoría Jurídica');
  const legalSubtitle =
    typeof details?.services_legal_subtitle === 'string'
      ? details.services_legal_subtitle.trim()
      : isImmobillis
      ? 'Asesoria'
      : '';
  const legalItems: AdvisoryAccordionItem[] = useMemo(() => {
    if (Array.isArray(details?.services_legal_items) && details.services_legal_items.length > 0) {
      return details.services_legal_items;
    }
    return IMMOBILLIS_LEGAL_ITEMS;
  }, [details?.services_legal_items]);

  // 4. Catálogo de Servicios Generales
  const servicesCatalogTitle = details?.services_catalog_title || 'Catálogo de Soluciones Integrales';
  const servicesCatalogSubtitle =
    typeof details?.services_catalog_subtitle === 'string'
      ? details.services_catalog_subtitle.trim()
      : '';
  const servicesList: RealEstateServiceItem[] = useMemo(() => {
    if (Array.isArray(details?.services) && details.services.length > 0) {
      return details.services;
    }
    return [];
  }, [details?.services]);

  // 5. Secciones HTML Puro para Servicios
  const servicesHtmlSections = useMemo(() => {
    if (Array.isArray(details?.services_html_sections)) {
      return details.services_html_sections.filter(
        (s: any) => s && s.enabled !== false && s.html && s.html.trim() !== ''
      );
    }
    return [];
  }, [details?.services_html_sections]);

  // 6. Orden y visibilidad de secciones (Excluyendo explícitamente clientes y aliados)
  const sectionsOrder = useMemo(() => {
    const rawOrder: string[] =
      Array.isArray(details?.services_sections_order) && details.services_sections_order.length > 0
        ? details.services_sections_order
        : DEFAULT_SERVICES_SECTIONS_ORDER;
    const hidden: string[] = Array.isArray(details?.services_sections_hidden)
      ? details.services_sections_hidden
      : [];

    // Filtrar estrictamente claves eliminadas: 'clients', 'allies', 'custom_html'
    const filteredOrder = rawOrder.filter(
      (key) => key !== 'custom_html' && key !== 'clients' && key !== 'allies'
    );

    const combined: string[] = [];
    filteredOrder.forEach((key) => {
      if (key && !combined.includes(key)) {
        combined.push(key);
      }
    });

    DEFAULT_SERVICES_SECTIONS_ORDER.forEach((key) => {
      if (!combined.includes(key)) {
        combined.push(key);
      }
    });

    // Agregar secciones HTML independientes
    if (Array.isArray(details?.services_html_sections)) {
      details.services_html_sections.forEach((sec: any) => {
        if (!sec || !sec.id) return;
        const secKey = `html_${sec.id}`;
        if (!combined.includes(secKey) && !combined.includes(String(sec.id))) {
          combined.push(secKey);
        }
      });
    }

    return combined.filter((key) => !hidden.includes(key));
  }, [details?.services_sections_order, details?.services_sections_hidden, details?.services_html_sections]);

  // Set en memoria para asegurar 0 duplicados de HTML durante el render
  const renderedHtmlIds = new Set<string | number>();

  // Helper para renderizar sección HTML individual
  const renderSingleHtmlSection = (sec: any) => {
    if (!sec || !sec.html) return null;
    const secIdStr = String(sec.id);
    if (renderedHtmlIds.has(secIdStr)) return null;
    renderedHtmlIds.add(secIdStr);

    const customBgStyle = sec.bg_color ? { backgroundColor: sec.bg_color } : undefined;
    const bgClass = !sec.bg_color
      ? sec.bg === 'dark'
        ? 'bg-slate-950 text-white'
        : sec.bg === 'slate'
        ? 'bg-slate-50 text-slate-900'
        : 'bg-white text-slate-900'
      : '';
    const containerClass = sec.container === 'full' ? 'w-full px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

    return (
      <section
        key={`services_html_${sec.id}`}
        style={customBgStyle}
        className={`py-16 lg:py-20 border-b border-slate-200/80 ${bgClass}`}
      >
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
  };

  // 1. Render Asesoría Comercial y Marketing
  const renderCommercialMarketingSection = () => {
    return (
      <section key="commercial_marketing" className="py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            {commMktSubtitle && (
              <div
                className="text-xs sm:text-sm font-bold uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                {commMktSubtitle}
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: primaryColor }}>
              {commMktTitle}
            </h2>
            {commMktDesc && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {commMktDesc}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Caja 1: Asesoría Comercial */}
            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 m-0">
                  {commBox1Title}
                </h3>
              </div>
              <ul className="space-y-3.5 pl-0 list-none m-0">
                {commBox1Items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: primaryColor }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Caja 2: Marketing Inmobiliario */}
            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 m-0">
                  {commBox2Title}
                </h3>
              </div>
              <ul className="space-y-3.5 pl-0 list-none m-0">
                {commBox2Items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: primaryColor }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // 2. Render Asesoría Profesional (Acordeón interactivo)
  const renderProfessionalAdvisorySection = () => {
    if (profItems.length === 0) return null;
    return (
      <section key="professional_advisory" className="py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            {profSubtitle && (
              <div
                className="text-xs sm:text-sm font-bold uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                {profSubtitle}
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: primaryColor }}>
              {profTitle}
            </h2>
          </div>

          <div className="space-y-4">
            {profItems.map((item, idx) => {
              const isOpen = openProfItem === item.id;
              const imageOnRight = idx % 2 === 1;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenProfItem(isOpen ? '' : item.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer select-none"
                  >
                    <span className="text-base sm:text-lg font-black tracking-tight">
                      {item.title}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 ml-4 text-slate-600">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-in fade-in-50 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {!imageOnRight && item.image_url && (
                          <div className="md:col-span-3 flex justify-center">
                            <div className="w-full max-w-[200px] aspect-square flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="max-h-36 max-w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )}
                        <div className={item.image_url ? 'md:col-span-9' : 'md:col-span-12'}>
                          <p className="text-sm sm:text-base text-slate-600 leading-relaxed m-0 text-justify">
                            {item.description}
                          </p>
                        </div>
                        {imageOnRight && item.image_url && (
                          <div className="md:col-span-3 flex justify-center order-first md:order-last">
                            <div className="w-full max-w-[200px] aspect-square flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="max-h-36 max-w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )}
                      </div>
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

  // 3. Render Asesoría Jurídica (Acordeón interactivo)
  const renderLegalAdvisorySection = () => {
    if (legalItems.length === 0) return null;
    return (
      <section key="legal_advisory" className="py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            {legalSubtitle && (
              <div
                className="text-xs sm:text-sm font-bold uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                {legalSubtitle}
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: primaryColor }}>
              {legalTitle}
            </h2>
          </div>

          <div className="space-y-4">
            {legalItems.map((item, idx) => {
              const isOpen = openLegalItem === item.id;
              const imageOnRight = idx % 2 === 1;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenLegalItem(isOpen ? '' : item.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer select-none"
                  >
                    <span className="text-base sm:text-lg font-black tracking-tight">
                      {item.title}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 ml-4 text-slate-600">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-in fade-in-50 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {!imageOnRight && item.image_url && (
                          <div className="md:col-span-3 flex justify-center">
                            <div className="w-full max-w-[200px] aspect-square flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="max-h-36 max-w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )}
                        <div className={item.image_url ? 'md:col-span-9' : 'md:col-span-12'}>
                          <p className="text-sm sm:text-base text-slate-600 leading-relaxed m-0 text-justify">
                            {item.description}
                          </p>
                        </div>
                        {imageOnRight && item.image_url && (
                          <div className="md:col-span-3 flex justify-center order-first md:order-last">
                            <div className="w-full max-w-[200px] aspect-square flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="max-h-36 max-w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )}
                      </div>
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

  // 4. Render Catálogo de Servicios Generales
  const renderServicesCatalogSection = () => {
    if (servicesList.length === 0) return null;
    return (
      <section key="services_catalog" className="py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: primaryColor }}>
              {servicesCatalogTitle}
            </h2>
            {servicesCatalogSubtitle && (
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {servicesCatalogSubtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, idx) => {
              const photoUrl =
                service.image_url ||
                service.photo ||
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

              const whatsappMessage = encodeURIComponent(
                `Hola ${agencyName}, me interesa solicitar información sobre el servicio de "${service.title}".`
              );
              const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

              return (
                <div
                  key={service.id || idx}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={photoUrl}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider border border-white/20">
                        Servicio #{idx + 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug m-0">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs text-white transition-all duration-200 hover:opacity-95 active:scale-98 shadow-sm no-underline"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{service.cta_text || 'Solicitar Asesoría'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="travel-agency-03-root min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      <BrandingThemeInjector agency={effectiveAgency} />
      <TopbarSlider agency={effectiveAgency} />
      <Header2Style3 agency={effectiveAgency} />

      {/* Hero Breadcrumb Header con fondo oscuro original */}
      <section className="relative py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00a884_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <nav className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-slate-300 mb-4 border border-white/10">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold" style={{ color: primaryColor }}>
              Servicios
            </span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
            {details?.services_hero_title || 'Nuestros Servicios Inmobiliarios'}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            {details?.services_hero_subtitle || (
              <>
                En <strong className="text-white">{agencyName}</strong> ofrecemos soluciones integrales para que compres, vendas, rentes o desarrolles tus proyectos con total certeza técnica y respaldo jurídico.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Render Dinámico de Secciones según el Orden Configurado */}
      {sectionsOrder.map((sectionKey) => {
        switch (sectionKey) {
          case 'commercial_marketing':
            return renderCommercialMarketingSection();
          case 'professional_advisory':
            return renderProfessionalAdvisorySection();
          case 'legal_advisory':
            return renderLegalAdvisorySection();
          case 'services_catalog':
            return renderServicesCatalogSection();
          default: {
            const foundHtml = servicesHtmlSections.find(
              (s: any) => `html_${s.id}` === sectionKey || String(s.id) === String(sectionKey)
            );
            if (foundHtml) {
              return renderSingleHtmlSection(foundHtml);
            }
            return null;
          }
        }
      })}

      {/* Banner CTA Inferior */}
      <section className="py-14 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-left space-y-1">
            <span
              className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 border border-white/10 inline-block mb-1"
              style={{ color: primaryColor }}
            >
              Atención Personalizada
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight m-0">
              {details?.services_cta_title || '¿Necesitas una solución inmobiliaria a la medida?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 m-0">
              {details?.services_cta_subtitle ||
                'Nuestro equipo de asesores legales, técnicos y comerciales está listo para orientarte.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-xs text-center border border-white/15 transition-all no-underline flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Llamar Ahora</span>
            </a>
            <a
              href={`https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(agencyName)},%20deseo%20asesoria%20en%20servicios%20inmobiliarios.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-950 font-black text-xs text-center shadow-lg transition-all no-underline flex items-center justify-center gap-2 hover:opacity-95"
              style={{ backgroundColor: primaryColor }}
            >
              <MessageCircle className="w-4 h-4 text-slate-950" />
              <span>Escribir por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      <Footer agency={effectiveAgency} />
    </div>
  );
};

export default PublicInmobiliariaServicesView;
