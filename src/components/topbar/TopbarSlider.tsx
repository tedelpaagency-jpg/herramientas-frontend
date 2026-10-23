"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from "swiper/modules";

import { SwiperOptions } from "swiper/types";

const TopbarSlider = () => {
     const settings: SwiperOptions = useMemo(() => {
    return {
      slidesPerView: "auto",
    speed: 1500,
    spaceBetween: 24,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: ".top-offer-text-slider-next",
      prevEl: ".top-offer-text-slider-prev",
    },
    };
  }, []);
  return (
    <div className="top-offer-text-slider-section">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="top-offer-text-slider-wrap">
            <div className="slider-btn top-offer-text-slider-prev">
              <svg width={11} height={12} viewBox="0 0 11 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.42865 10.4085C8.69396 8.57179 5.02049 6.73505 2.81641 6.00036C5.02049 5.26567 8.32661 4.16363 9.42865 1.5922" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </div>
            <Swiper {...settings} modules={[Navigation, EffectFade]} className="swiper top-offer-text-slider">
              <div className="swiper-wrapper">
                <SwiperSlide className="swiper-slide">
                  <Link href="/travel-package">One-Click Booking, Upto <strong>FLAT 30%</strong> Discount of Haneymoon Tours</Link>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <Link href="/travel-package">Customize Your Trip Plan and Get <strong>Special Discounts</strong> Instantly</Link>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <Link href="/travel-package">Enjoy Family Holiday Packages with <strong>Flexible Payment Options</strong></Link>
                </SwiperSlide>
              </div>
            </Swiper>
            <div className="slider-btn top-offer-text-slider-next">
              <svg width={11} height={12} viewBox="0 0 11 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.57141 10.4085C2.3061 8.57179 5.97957 6.73505 8.18366 6.00036C5.97957 5.26567 2.67345 4.16363 1.57141 1.5922" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default TopbarSlider
