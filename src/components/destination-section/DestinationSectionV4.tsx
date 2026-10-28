"use client";
import Link from "next/link";
import React, { useMemo } from "react";
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

  const sectionTitle = agency?.details?.categories_title || 'Categorías Principales';
  const sectionSubtitle = agency?.details?.categories_subtitle || 'Descubre opciones pensadas para cada estilo de vida e inversión patrimonial.';

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
      <div className="container">
        <div className="row justify-content-center mb-6 sm:mb-8 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">{sectionTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{sectionSubtitle}</p>
            </div>
          </div>
        </div>

        <div className="destination-slider-area mb-4">
          <Swiper {...settings} modules={[Navigation, Pagination, Autoplay]} className="swiper home3-destination-slider !pb-4">
            <div className="swiper-wrapper">
              {displayCategories.map((cat, index) => {
                const fallbackImg = DEFAULT_REAL_ESTATE_CATEGORIES[index % DEFAULT_REAL_ESTATE_CATEGORIES.length].image;
                const imgSrc = cat.image || fallbackImg;
                const categoryUrl = `/properties?property_type=${cat.id}`;

                return (
                  <SwiperSlide key={cat.id || index} className="swiper-slide !h-auto">
                    <Link
                      href={categoryUrl}
                      className="group relative block h-[155px] sm:h-[165px] md:h-[175px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 ease-out transform hover:-translate-y-1.5 cursor-pointer text-decoration-none"
                    >
                      {/* Imagen con zoom animado al hover */}
                      <img
                        src={imgSrc}
                        alt={cat.name}
                        className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                      />

                      {/* Viñeta degradada sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

                      {/* Badge superior con cantidad disponible */}
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 group-hover:bg-emerald-600/90 group-hover:border-emerald-400/50 transition-all duration-300 shadow-xs">
                        {cat.count || 0} disponibles
                      </div>

                      {/* Botón flecha animado con rotación suave */}
                      <div className="absolute top-2.5 right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-45 shadow-md">
                        <svg width={10} height={10} viewBox="0 0 14 14" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>

                      {/* Contenido inferior: Título de Categoría */}
                      <div className="absolute bottom-2.5 left-3 right-3 text-left pointer-events-none">
                        <h5 className="text-xs sm:text-[13px] font-extrabold text-white group-hover:text-emerald-300 transition-colors duration-200 truncate leading-snug drop-shadow-sm mb-0">
                          {cat.name}
                        </h5>
                        <span className="text-[10px] font-medium text-slate-300/90 group-hover:text-white transition-colors">
                          Explorar inmuebles
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
  );
};

export default DestinationSectionV4;
