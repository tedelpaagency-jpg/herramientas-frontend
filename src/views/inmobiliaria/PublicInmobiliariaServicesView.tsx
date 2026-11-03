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
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  DollarSign,
  Scale,
  Camera,
  Home,
  MessageCircle,
} from 'lucide-react';
import {
  getCachedAgencyConfig,
  publicInmobiliariaService,
  PublicAgencyConfig,
} from '@/services/publicInmobiliariaService';
import Header2Style3 from '@/components/layout/Header2Style3';
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

export const DEFAULT_REAL_ESTATE_SERVICES: RealEstateServiceItem[] = [
  {
    id: 1,
    title: 'Compra y Venta de Inmuebles',
    description:
      'Asesoría integral y personalizada para vender al mejor precio de mercado o adquirir tu propiedad soñada con riguroso estudio de títulos y total seguridad jurídica.',
    image_url:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Consultar Compra / Venta',
  },
  {
    id: 2,
    title: 'Alquiler y Administración de Propiedades',
    description:
      'Selección y perfilamiento exhaustivo de inquilinos, contratos legalmente blindados, recaudación puntual de cánones de arrendamiento y gestión del mantenimiento preventivo.',
    image_url:
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Administrar mi Inmueble',
  },
  {
    id: 3,
    title: 'Asesoría Legal e Inmobiliaria',
    description:
      'Redacción y revisión de promesas de compraventa, levantamiento de hipotecas y gravámenes, regularización de linderos y acompañamiento presencial en notarías y municipios.',
    image_url:
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Solicitar Asesoría Legal',
  },
  {
    id: 4,
    title: 'Gestión de Créditos Hipotecarios',
    description:
      'Canalización directa de solicitudes de crédito con el Biess y las instituciones bancarias privadas más importantes del país con tasas preferenciales y respuesta ágil.',
    image_url:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Precalificar Crédito',
  },
  {
    id: 5,
    title: 'Avalúos Comerciales y Peritajes',
    description:
      'Determinación técnica, imparcial y documentada del valor comercial real de su propiedad basada en el mercado actual, ubicación, estado de conservación y plusvalía proyectada.',
    image_url:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Solicitar Avalúo Técnico',
  },
  {
    id: 6,
    title: 'Marketing Inmobiliario 360°',
    description:
      'Fotografía arquitectónica en alta definición, recorridos virtuales interactivos, tomas aéreas con drones profesionales y campañas digitales segmentadas de alto impacto.',
    image_url:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Promocionar mi Propiedad',
  },
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

  const primaryColor = effectiveAgency.primary_color || '#2067F5';
  const phoneDisplay = effectiveAgency.phone || effectiveAgency.whatsapp || '+593 0984113967';
  const cleanPhone = phoneDisplay.replace(/[^0-9]/g, '') || '593984113967';

  const details = (typeof effectiveAgency.details === 'object' && effectiveAgency.details !== null)
    ? effectiveAgency.details
    : {};

  const servicesList: RealEstateServiceItem[] = useMemo(() => {
    if (Array.isArray(details?.services) && details.services.length > 0) {
      return details.services;
    }
    return DEFAULT_REAL_ESTATE_SERVICES;
  }, [details?.services]);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header2Style3 />

      {/* Hero Header */}
      <section className="relative py-14 lg:py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-emerald-400 text-xs font-black uppercase tracking-wider backdrop-blur-md border border-white/10">
            <Sparkles className="w-4 h-4" />
            <span>Servicios Profesionales Especializados</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Nuestros Servicios Inmobiliarios
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            En <span className="text-white font-bold">{agencyName}</span> ofrecemos soluciones integrales para que compres, vendas, rentes o administres tu patrimonio con total tranquilidad y respaldo legal.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors no-underline">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-200 font-semibold">Servicios</span>
          </div>
        </div>
      </section>

      {/* Grid de Servicios */}
      <main className="flex-1 py-16 lg:py-24 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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
                  {/* Imagen del Servicio */}
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

                  {/* Contenido del Servicio: Título + Descripción + Botón WhatsApp */}
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

          {/* Banner Inferior: ¿Necesitas un servicio a la medida? */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
                Atención Personalizada
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white m-0 tracking-tight">
                ¿Necesitas una solución inmobiliaria a la medida?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 m-0">
                Nuestro equipo de asesores legales y comerciales está listo para orientarte sin ningún compromiso.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a
                href={`tel:${cleanPhone}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-xs text-center border border-white/15 transition-all no-underline flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar Ahora</span>
              </a>
              <a
                href={`https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(agencyName)},%20deseo%20asesoria%20personalizada%20en%20servicios%20inmobiliarios.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs text-center shadow-lg transition-all no-underline flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escribir por WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer agency={effectiveAgency} />
    </div>
  );
};

export default PublicInmobiliariaServicesView;
