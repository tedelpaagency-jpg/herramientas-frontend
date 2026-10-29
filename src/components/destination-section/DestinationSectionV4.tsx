"use client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
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
};

const DestinationSectionV4: React.FC<DestinationSectionV4Props> = ({ categories, agency }) => {
  const displayCategories = useMemo(() => {
    const list = (categories && categories.length > 0)
      ? [...categories]
      : [...DEFAULT_REAL_ESTATE_CATEGORIES];

    // Garantizar que siempre existan exactamente 6 categorías distintas
    if (list.length < 6) {
      for (const def of DEFAULT_REAL_ESTATE_CATEGORIES) {
        if (list.length >= 6) break;
        if (!list.some(c => c.name?.toLowerCase() === def.name?.toLowerCase() || c.id === def.id)) {
          list.push(def);
        }
      }
    }
    return list.slice(0, 6);
  }, [categories]);

  // Estado para la tarjeta activa en cuadrícula móvil (por defecto la 6ta, idéntico a la referencia)
  const [activeCategoryId, setActiveCategoryId] = useState<number | string | null>(() => {
    return displayCategories[5]?.id ?? 6;
  });

  const sectionTitle = agency?.details?.categories_title || 'Categorías Principales';
  const sectionSubtitle = agency?.details?.categories_subtitle || 'Descubre opciones pensadas para cada estilo de vida e inversión patrimonial.';
  const rawColor = agency?.primary_color || agency?.details?.primary_color;
  const primaryColor = rawColor || '#00a884';
  const buttonColor = primaryColor;

  const settings: SwiperOptions = useMemo(() => {
    return {
      slidesPerView: "auto",
      speed: 800,
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
        280: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 2.3,
          spaceBetween: 12,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 12,
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

        {/* VISTA MÓVIL: Cuadrícula interactiva de 2 columnas (Tarjetas más largas con texto siempre visible) */}
        <div className="md:hidden grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          {displayCategories.map((cat, index) => {
            const fallbackImg = DEFAULT_REAL_ESTATE_CATEGORIES[index % DEFAULT_REAL_ESTATE_CATEGORIES.length].image;
            const imgSrc = cat.image || fallbackImg;
            const categoryUrl = `/properties?property_type=${cat.id}`;
            const slug = (cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '') as string;
            const description = (cat as any).description || CATEGORY_DESCRIPTIONS[slug] || 'Propiedades seleccionadas con los más altos estándares de calidad.';

            return (
              <Link
                key={cat.id || index}
                href={categoryUrl}
                className="group inmo-cat-card-item relative block min-h-[220px] aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md transition-all duration-300 ease-out text-decoration-none select-none border border-white/10 active:scale-[0.98]"
              >
                {/* Imagen de fondo con zoom fluido */}
                <img
                  src={imgSrc}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Viñeta degradada oscura permanente para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

                {/* Badge superior con cantidad disponible */}
                <div className="inmo-cat-badge absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9.5px] font-bold text-white border border-white/15 shadow-xs transition-colors duration-300">
                  {cat.count || 0} inmuebles
                </div>

                {/* Botón flecha móvil animado con hover en color primario */}
                <div className="inmo-cat-card-arrow absolute top-2.5 right-2.5 w-6 h-6 rounded-full backdrop-blur-md flex items-center justify-center shadow-md">
                  <svg width={10} height={10} viewBox="0 0 14 14" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Contenido inferior: Siempre visible con subtextos blancos */}
                <div className="absolute bottom-3 left-3 right-3 text-left pointer-events-none">
                  <h5 className="text-[14px] font-black text-white leading-tight drop-shadow-md mb-1">
                    {cat.name}
                  </h5>
                  <p className="text-[10px] text-white leading-tight font-medium line-clamp-2 drop-shadow-sm mb-1.5" style={{ color: '#ffffff' }}>
                    {description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white drop-shadow-sm" style={{ color: '#ffffff' }}>
                    <span>Ver inmuebles</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* VISTA ESCRITORIO Y TABLET: Carrusel con tarjetas más largas y texto siempre visible */}
        <div className="hidden md:block">
          <div className="destination-slider-area mb-4">
            <Swiper {...settings} modules={[Navigation, Pagination, Autoplay]} className="swiper home3-destination-slider !pb-4">
              <div className="swiper-wrapper">
                {displayCategories.map((cat, index) => {
                  const fallbackImg = DEFAULT_REAL_ESTATE_CATEGORIES[index % DEFAULT_REAL_ESTATE_CATEGORIES.length].image;
                  const imgSrc = cat.image || fallbackImg;
                  const categoryUrl = `/properties?property_type=${cat.id}`;
                  const slug = (cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '') as string;
                  const description = (cat as any).description || CATEGORY_DESCRIPTIONS[slug] || 'Propiedades exclusivas con alta plusvalía y asesoría notarial.';

                  return (
                    <SwiperSlide key={cat.id || index} className="swiper-slide !h-auto">
                      <Link
                        href={categoryUrl}
                        className="group inmo-cat-card-item relative block h-[280px] sm:h-[300px] md:h-[320px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-md transition-all duration-300 ease-out transform hover:-translate-y-1.5 cursor-pointer text-decoration-none"
                      >
                        {/* Imagen con zoom animado al hover */}
                        <img
                          src={imgSrc}
                          alt={cat.name}
                          className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-110"
                          loading="lazy"
                        />

                        {/* Viñeta degradada oscura permanente de alto contraste */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Badge superior con cantidad disponible */}
                        <div className="inmo-cat-badge absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10.5px] font-bold text-white border border-white/15 transition-all duration-300 shadow-xs">
                          {cat.count || 0} disponibles
                        </div>

                        {/* Botón flecha animado con rotación suave y hover con color primario */}
                        <div className="inmo-cat-card-arrow absolute top-3 right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-md">
                          <svg width={11} height={11} viewBox="0 0 14 14" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>

                        {/* Contenido inferior: Título, Descripción y enlace SIEMPRE VISIBLES con subtextos blancos */}
                        <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none z-10">
                          <h5 className="text-[15px] sm:text-[16px] font-black text-white leading-snug drop-shadow-md mb-1">
                            {cat.name}
                          </h5>
                          <p className="text-[11px] sm:text-[11.5px] leading-tight font-medium line-clamp-2 drop-shadow-sm mb-2 text-white" style={{ color: '#ffffff' }}>
                            {description}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold transition-colors text-white drop-shadow-sm" style={{ color: '#ffffff' }}>
                            <span>Explorar inmuebles</span>
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
            <div className="col-lg-12 d-flex justify-content-between align-items-center">
              <div className="slider-btn-grp">
                <div className="slider-btn destination-slider-prev">
                  <svg width={9} height={15} viewBox="0 0 9 15" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.7478 1.48828L1.7478 7.48828L7.7478 13.4883" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="slider-btn destination-slider-next">
                  <svg width={9} height={15} viewBox="0 0 9 15" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.2478 1.48828L7.2478 7.48828L1.2478 13.4883" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="swiper-pagination1 paginations" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationSectionV4;
