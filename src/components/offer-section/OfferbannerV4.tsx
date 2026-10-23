"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";
const OfferbannerV4 = () => {
  const settings: SwiperOptions = useMemo(() => {
    return {
      slidesPerView: "auto",
      speed: 1500,
      spaceBetween: 24,
      autoplay: {
        delay: 2500, // Autoplay duration in milliseconds
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination2",
        clickable: true,
      },
    };
  }, []);
  return (
    <div className="home4-offer-slider-section mb-100">
      <div className="container">
        <div className="row mb-40">
          <div className="col-lg-12">
            <Swiper {...settings} modules={[Pagination, Autoplay]} className="swiper home4-offer-slider">
              <div className="swiper-wrapper">
                <SwiperSlide className="swiper-slide">
                  <Link href="/travel-package/details"><Image width={1320} height={220} src="/assets/img/home4/home4-offer-slider-img1.jpg" alt="" /></Link>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <Link href="/travel-package/details"><Image width={1320} height={220} src="/assets/img/home4/home4-offer-slider-img2.jpg" alt="" /></Link>
                </SwiperSlide>
              </div>
            </Swiper>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center">
            <div className="swiper-pagination2 paginations two" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfferbannerV4
