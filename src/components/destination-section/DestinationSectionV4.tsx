"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import { PublicEstateCategory } from "@/services/publicInmobiliariaService";
import { DEFAULT_REAL_ESTATE_CATEGORIES } from "@/constants/realEstateDefaults";

interface DestinationSectionV4Props {
  categories?: PublicEstateCategory[];
  agency?: any;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'casas-residencias': 'Residencias familiares, urbanizaciones privadas y villas de descanso.',
  'departamentos-condos': 'Suites modernas, condominios céntricos y departamentos familiares.',
  'terrenos-lotes': 'Solares de alta plusvalía y macro-lotes listos para desarrollo inmobiliario.',
  'oficinas-corporativos': 'Espacios empresariales, consultorios y edificios comerciales.',
  'villas-quintas': 'Propiedades campestres, quintas vacacionales y casas de campo exclusivas.',
  'penthouses-lujo': 'Exclusivas propiedades de alta gama con acabados premium y vistas panorámicas.',
  'comercial': 'Locales comerciales y puntos estratégicos de alta afluencia vehicular y peatonal.',
  'bodegas': 'Almacenes y bodegas industriales con patio de maniobras y acceso a vías principales.',
  'edificio': 'Edificios residenciales, corporativos y comerciales de alta rentabilidad.',
  'fincas-haciendas': 'Fincas agrícolas, haciendas ganaderas y terrenos productivos.',
  'galpon': 'Galpones de almacenaje con estructura reforzada e infraestructura logística.',
  'hotel': 'Propiedades hoteleras, complejos turísticos y proyectos de hospitalidad.',
  'suites': 'Suites amobladas y apartamentos tipo estudio para ejecutivos y profesionales.',
  'plaza-comercial': 'Locales en plazas y centros comerciales de alto tráfico.',
  'solar': 'Solares urbanizados con servicios básicos listos para construir.',
  'parqueadero': 'Plazas de parqueadero y garajes en zonas céntricas y residenciales.',
};

const DestinationSectionV4: React.FC<DestinationSectionV4Props> = ({ categories, agency }) => {
  const displayCategories = useMemo(() => {
    const list = (categories && categories.length > 0)
      ? [...categories]
      : [...DEFAULT_REAL_ESTATE_CATEGORIES];

    // Combinar con las categorías por defecto para incluir todos los tipos de inmuebles de la app
    for (const def of DEFAULT_REAL_ESTATE_CATEGORIES) {
      if (!list.some(c => c.name?.toLowerCase() === def.name?.toLowerCase() || c.id === def.id || (c.slug && def.slug && c.slug === def.slug))) {
        list.push(def);
      }
    }
    return list;
  }, [categories]);

  // Agrupar categorías en páginas de 3x3 (9 categorías por slide) para el carrusel móvil
  const mobilePages = useMemo(() => {
    const pages: PublicEstateCategory[][] = [];
    for (let i = 0; i < displayCategories.length; i += 9) {
      pages.push(displayCategories.slice(i, i + 9));
    }
    return pages;
  }, [displayCategories]);

  const sectionTitle = agency?.details?.categories_title || 'Categorías Principales';
  const sectionSubtitle = agency?.details?.categories_subtitle || 'Descubre opciones pensadas para cada estilo de vida e inversión patrimonial.';
  const rawColor = agency?.primary_color || agency?.details?.primary_color;
  const primaryColor = rawColor || '#00a884';

  const settings: SwiperOptions = useMemo(() => {
    return {
      slidesPerView: 2,
      speed: 700,
      spaceBetween: 14,
      autoplay: {
        delay: 3500,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".destination-slider-next",
        prevEl: ".destination-slider-prev",
      },
      pagination: {
        el: ".swiper-pagination1",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 3,
          spaceBetween: 14,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 14,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 14,
        },
        1280: {
          slidesPerView: 6,
          spaceBetween: 14,
        },
        1536: {
          slidesPerView: 6,
          spaceBetween: 16,
        },
      },
    };
  }, []);

  return (
    <div className="home4-destination-section mb-14 sm:mb-20 pt-4" id="categorias">
      <style jsx global>{`
        .inmo-cat-card-arrow {
          background-color: rgba(255, 255, 255, 0.22);
          color: #ffffff;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .group:hover .inmo-cat-card-arrow {
          background-color: ${primaryColor} !important;
          color: #ffffff !important;
          transform: scale(1.12) rotate(45deg);
          box-shadow: 0 4px 16px ${primaryColor}66 !important;
        }
        .inmo-cat-card-item:hover {
          border-color: ${primaryColor}80 !important;
          box-shadow: 0 20px 40px -10px ${primaryColor}30 !important;
        }
        .group:hover .inmo-cat-badge {
          background-color: ${primaryColor}e6 !important;
          border-color: ${primaryColor} !important;
        }
        /* Garantizar que todos los títulos, subtextos y enlaces dentro de las tarjetas sean siempre blanco puro */
        .inmo-cat-card-item h5,
        .inmo-cat-card-item h6,
        .inmo-cat-card-item p,
        .inmo-cat-card-item span {
          color: #ffffff !important;
        }

        .mobile-cat-pagination .swiper-pagination-bullet {
          background: #94a3b8;
          opacity: 0.5;
          width: 7px;
          height: 7px;
          margin: 0 4px;
          transition: all 0.3s ease;
        }
        .mobile-cat-pagination .swiper-pagination-bullet-active {
          background: ${primaryColor} !important;
          opacity: 1;
          width: 20px;
          border-radius: 4px;
        }
        .swiper-pagination1 .swiper-pagination-bullet-active {
          background: ${primaryColor} !important;
        }
      `}</style>

      <div className="container">
        <div className="row justify-content-center mb-6 sm:mb-8 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">{sectionTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{sectionSubtitle}</p>
            </div>
          </div>
        </div>

        {/* 1. VISTA MÓVIL: TABLA VISIBLE DE 3x3 SIEMPRE EN CARRUSEL */}
        <div className="md:hidden mb-6">
          <Swiper
            modules={[Pagination, Autoplay]}
            speed={600}
            autoplay={{
              delay: 4500,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            pagination={{
              el: ".mobile-cat-pagination",
              clickable: true,
            }}
            className="mobile-categories-swiper !pb-4"
          >
            {mobilePages.map((pageCategories, pageIdx) => (
              <SwiperSlide key={pageIdx}>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 px-0.5">
                  {pageCategories.map((cat, idx) => {
                    const fallbackImg = DEFAULT_REAL_ESTATE_CATEGORIES[(pageIdx * 9 + idx) % DEFAULT_REAL_ESTATE_CATEGORIES.length].image;
                    const imgSrc = cat.image || fallbackImg;
                    const categoryUrl = `/properties?property_type=${cat.id}`;

                    return (
                      <Link
                        key={cat.id || idx}
                        href={categoryUrl}
                        className="group inmo-cat-card-item relative flex flex-col justify-between aspect-[1/1] sm:aspect-[3/3.6] min-h-[105px] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-sm border border-white/10 active:scale-[0.96] transition-all no-underline p-2 text-decoration-none select-none"
                      >
                        {/* Imagen de fondo */}
                        <img
                          src={imgSrc}
                          alt={cat.name}
                          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
                          loading="lazy"
                        />
                        {/* Viñeta degradada oscura para contraste del texto */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                        {/* Top: contador de inmuebles y flecha */}
                        <div className="relative z-10 flex items-center justify-between w-full">
                          <span className="px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white border border-white/15 leading-none">
                            {cat.count || 0}
                          </span>
                          <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                            <svg width={9} height={9} viewBox="0 0 14 14" fill="none" stroke="currentColor">
                              <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                        </div>

                        {/* Bottom: nombre del tipo de inmueble */}
                        <div className="relative z-10 text-left">
                          <h6 className="text-[11px] sm:text-[12px] font-black leading-tight text-white m-0 drop-shadow-md line-clamp-2">
                            {cat.name}
                          </h6>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Paginación de puntos del carrusel móvil */}
          <div className="flex justify-center mt-2">
            <div className="mobile-cat-pagination flex items-center justify-center" />
          </div>
        </div>

        {/* 2. VISTA ESCRITORIO Y TABLET: Carrusel como estaba antes con todas las categorías */}
        <div className="hidden md:block">
          <div className="destination-slider-area mb-4">
            <Swiper {...settings} modules={[Navigation, Pagination, Autoplay]} className="swiper home3-destination-slider !pb-4">
              <div className="swiper-wrapper">
                {displayCategories.map((cat, index) => {
                  const fallbackImg = DEFAULT_REAL_ESTATE_CATEGORIES[index % DEFAULT_REAL_ESTATE_CATEGORIES.length].image;
                  const imgSrc = cat.image || fallbackImg;
                  const categoryUrl = `/properties?property_type=${cat.id}`;
                  const slug = (cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '') as string;
                  const description = (cat as any).description || CATEGORY_DESCRIPTIONS[slug] || 'Propiedades seleccionadas con los más altos estándares de calidad.';

                  return (
                    <SwiperSlide key={cat.id || index} className="swiper-slide">
                      <Link
                        href={categoryUrl}
                        className="group inmo-cat-card-item relative block min-h-[300px] aspect-[3/4.2] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md transition-all duration-300 ease-out text-decoration-none select-none border border-white/10"
                      >
                        {/* Imagen de fondo con zoom fluido al hover */}
                        <img
                          src={imgSrc}
                          alt={cat.name}
                          className="w-full h-full object-cover object-center filter brightness-[0.80] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-108"
                          loading="lazy"
                        />

                        {/* Viñeta degradada oscura permanente para legibilidad óptima */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

                        {/* Badge superior con cantidad disponible */}
                        <div className="inmo-cat-badge absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10.5px] font-bold text-white border border-white/15 shadow-xs transition-colors duration-300">
                          {cat.count || 0} inmuebles
                        </div>

                        {/* Botón flecha animado con color corporativo */}
                        <div className="inmo-cat-card-arrow absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-md">
                          <svg width={12} height={12} viewBox="0 0 14 14" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>

                        {/* Contenido inferior */}
                        <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                          <h5 className="text-[16px] font-black leading-tight drop-shadow-md mb-1.5" style={{ color: '#ffffff' }}>
                            {cat.name}
                          </h5>
                          <p className="text-[11px] leading-tight font-medium line-clamp-2 drop-shadow-sm mb-2" style={{ color: '#ffffff' }}>
                            {description}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold drop-shadow-sm" style={{ color: '#ffffff' }}>
                            <span>Ver inmuebles</span>
                            <span>→</span>
                          </span>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </div>
            </Swiper>
          </div>
          <div className="row">
            <div className="col-12 d-flex justify-content-center">
              <div className="swiper-pagination1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationSectionV4;
