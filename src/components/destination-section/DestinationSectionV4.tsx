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
}

const DestinationSectionV4: React.FC<DestinationSectionV4Props> = ({ categories }) => {
  const displayCategories = (categories && categories.length > 0)
    ? categories
    : DEFAULT_REAL_ESTATE_CATEGORIES;

  const settings: SwiperOptions = useMemo(() => {
    return {
      slidesPerView: "auto",
      speed: 1500,
      spaceBetween: 24,
      autoplay: {
        delay: 2500,
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
          slidesPerView: 1,
        },
        386: {
          slidesPerView: 1,
        },
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 15,
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 15,
        },
        1400: {
          slidesPerView: 4,
        },
      },
    };
  }, []);

  return (
    <div className="home4-destination-section mb-100" id="categorias">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2>Categorías Principales</h2>
              <p>Descubre opciones pensadas para cada estilo de vida e inversión patrimonial.</p>
            </div>
          </div>
        </div>

        <div className="destination-slider-area mb-40">
          <Swiper {...settings} modules={[Navigation, Pagination, Autoplay]} className="swiper home3-destination-slider">
            <div className="swiper-wrapper">
              {displayCategories.map((cat, index) => {
                const fallbackImg = DEFAULT_REAL_ESTATE_CATEGORIES[index % DEFAULT_REAL_ESTATE_CATEGORIES.length].image;
                const imgSrc = cat.image || fallbackImg;
                const categoryUrl = `/properties?property_type=${cat.id}`;

                return (
                  <SwiperSlide key={cat.id || index} className="swiper-slide">
                    <div className="destination-card2 three">
                      <div className="destination-img" style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                        <img
                          src={imgSrc}
                          alt={cat.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Link href={categoryUrl} className="arrow">
                          <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </Link>
                      </div>
                      <div className="destination-content">
                        <h5>
                          <Link href={categoryUrl}>{cat.name}</Link>
                        </h5>
                        <span>Disponibles ({cat.count || 0})</span>
                      </div>
                    </div>
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
