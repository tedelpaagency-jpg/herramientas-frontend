"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const OfferSectionV5 = () => {
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
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 3,
        },
        1400: {
          slidesPerView: 3,
        },
      },
    };
  }, []);
  return (
    <div className="home5-offer-section mb-100">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-6">
            <div className="section-title text-center">
              <h2>Special Offer</h2>
              <p>A curated list of the most popular travel packages based on different destinations.</p>
            </div>
          </div>
        </div>
        <Swiper {...settings} modules={[Autoplay, Pagination,]} className="swiper home1-offer-slider mb-40">
          <div className="swiper-wrapper">
            <SwiperSlide className="swiper-slide">
              <Link href="/travel-package/details"><Image width={550} height={220} src="/assets/img/home1/home1-offer-img4.jpg" alt="" /></Link>
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <Link href="/travel-package/details"><Image width={550} height={220} src="/assets/img/home1/home1-offer-img5.jpg" alt="" /></Link>
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <Link href="/visa/details"><Image width={550} height={220} src="/assets/img/home1/home1-offer-img6.jpg" alt="" /></Link>
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <Link href="/travel-package/details"><Image width={550} height={220} src="/assets/img/home1/home1-offer-img2.jpg" alt="" /></Link>
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <Link href="/travel-package"><Image width={550} height={220} src="/assets/img/home1/home1-offer-img3.jpg" alt="" /></Link>
            </SwiperSlide>
          </div>
        </Swiper>
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center">
            <div className="swiper-pagination1 paginations two" />
          </div>
        </div>
      </div>
      <Image width={57} height={60} src="/assets/img/home4/vector/feature-section-vector2.svg" alt="" className="section-vector" />
    </div>
  )
}

export default OfferSectionV5
