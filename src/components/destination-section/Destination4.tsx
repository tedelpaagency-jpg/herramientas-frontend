"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const Destination4 = () => {
      const settings: SwiperOptions = useMemo(() => {
        return {
            slidesPerView: "auto",
            speed: 1500,
    spaceBetween: 30,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      pauseOnMouseEnter: true,
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
        slidesPerView: 2,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      1400: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
        };
    }, []);
  return (
    <div className="destination4-page pt-100 mb-100">
  <div className="container">
    <Swiper {...settings} className="swiper destionation4-slider mb-40">
      <div className="swiper-wrapper">
        <SwiperSlide className="swiper-slide">
          <div className="destination-card3">
            <Image width={500} height={500} src="/assets/img/home6/destination-img1.jpg" alt="" />
            <div className="destination-content">
              <h2><Link href="/destination/details">Rome</Link></h2>
              <span>15 Activities</span>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <div className="destination-card3 sm-card mb-20">
            <Image width={500} height={500} src="/assets/img/home6/destination-img2.jpg" alt="" />
            <div className="destination-content">
              <h2><Link href="/destination/details">Thailand</Link></h2>
              <span>12 Activities</span>
            </div>
          </div>
          <div className="destination-card3 sm-card">
            <Image width={500} height={500} src="/assets/img/home6/destination-img3.jpg" alt="" />
            <div className="destination-content">
              <h2><Link href="/destination/details">Maldives</Link></h2>
              <span>20 Activities</span>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <div className="destination-card3">
            <Image width={500} height={500} src="/assets/img/home6/destination-img4.jpg" alt="" />
            <div className="destination-content">
              <h2><Link href="/destination/details">Indonesia</Link></h2>
              <span>18 Activities</span>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <div className="destination-card3 sm-card mb-20">
            <Image width={500} height={500} src="/assets/img/innerpages/destination4-img1.jpg" alt="" />
            <div className="destination-content">
              <h2><Link href="/destination/details">Switzerland</Link></h2>
              <span>15 Activities</span>
            </div>
          </div>
          <div className="destination-card3 sm-card">
            <Image width={500} height={500} src="/assets/img/innerpages/destination4-img2.jpg" alt="" />
            <div className="destination-content">
              <h2><Link href="/destination/details">Turkey</Link></h2>
              <span>20 Activities</span>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <div className="destination-card3">
            <Image width={500} height={500} src="/assets/img/innerpages/destination4-img3.jpg" alt="" />
            <div className="destination-content">
              <h2><Link href="/destination/details">Romania</Link></h2>
              <span>16 Activities</span>
            </div>
          </div>
        </SwiperSlide>
      </div>
    </Swiper>
    <div className="row">
      <div className="col-lg-12 d-flex justify-content-center">
        <div className="swiper-pagination1 paginations" />
      </div>
    </div>
  </div>
</div>
  )
}

export default Destination4
