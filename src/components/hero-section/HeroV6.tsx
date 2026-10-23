"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const HeroV6 = () => {
  const settings: SwiperOptions = useMemo(() => {
    return {
      slidesPerView: "auto",
      speed: 1500,
      spaceBetween: 24,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: ".banner-slider-next",
        prevEl: ".banner-slider-prev",
      },
      pagination: {
        el: ".franctional-pagi1",
        type: "fraction",
      },
    };
  }, []);
  return (
    <div className="home6-banner-section">
      <Swiper {...settings} modules={[Navigation, Autoplay, EffectFade, Pagination]} className="swiper home6-banner-slider">
        <div className="swiper-wrapper">
          <SwiperSlide className="swiper-slide">
            <div className="banner-wrapper">
              <div className="banner-img-area">
                <Image width={1920} height={680} src="/assets/img/home6/banner-img1.jpg" alt="" />
              </div>
              <div className="banner-content-wrap">
                <div className="container">
                  <div className="banner-content two">
                    <h1>Adventure</h1>
                    <h2 className="slider1">Awaits
                      <span>
                        <svg width={60} height={37} viewBox="0 0 60 37" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 18H59M59 18C53 17.6667 41 13.6 41 0M59 18C53 18.3333 41 22.5 41 36.5" />
                        </svg>
                        Let's Go!
                      </span>
                    </h2>
                    <Link href="/travel-package" className="primary-btn1 two">
                      <span>
                        View All Tour
                        <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                        </svg>
                      </span>
                      <span>
                        View All Tour
                        <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="swiper-slide">
            <div className="banner-wrapper">
              <div className="banner-img-area">
                <Image width={1920} height={680} src="/assets/img/home6/banner-img2.jpg" alt="" />
              </div>
              <div className="banner-content-wrap">
                <div className="container">
                  <div className="banner-content">
                    <h2>Unforgettable Travel Experiences</h2>
                    <Link href="/travel-package" className="primary-btn1 two">
                      <span>
                        View All Tour
                        <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                        </svg>
                      </span>
                      <span>
                        View All Tour
                        <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="swiper-slide">
            <div className="banner-wrapper">
              <div className="banner-img-area">
                <Image width={1920} height={680} src="/assets/img/home6/banner-img3.jpg" alt="" />
              </div>
              <div className="banner-content-wrap">
                <div className="container">
                  <div className="banner-content">
                    <h2>The Ultimate Guide to Travel Experinecs</h2>
                    <Link href="/travel-package" className="primary-btn1 two">
                      <span>
                        View All Tour
                        <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                        </svg>
                      </span>
                      <span>
                        View All Tour
                        <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </div>
      </Swiper>
      <div className="slider-btn-grp">
        <div className="slider-btn banner-slider-prev">
          <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1151_22708)">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.68555 0L8.68555 16H7.31412L7.31412 0L8.68555 0Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M7.31406 0.685714C7.31406 3.9104 10.1502 6.54629 13.1746 6.54629H13.8604V5.17486H13.1746C10.878 5.17486 8.68549 3.12412 8.68549 0.685714V0L7.31406 0V0.685714Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M8.68555 0.685714C8.68555 3.9104 5.84943 6.54629 2.82497 6.54629H2.13926V5.17486H2.82497C5.12075 5.17486 7.31412 3.12412 7.31412 0.685714V0L8.68555 0V0.685714Z" />
            </g>
          </svg>
        </div>
        <div className="franctional-pagi1" />
        <div className="slider-btn banner-slider-next">
          <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1151_22699)">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.68579 16L8.68579 -3.8147e-06H7.31436L7.31436 16H8.68579Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M7.31431 15.3143C7.31431 12.0896 10.1504 9.45371 13.1749 9.45371H13.8606V10.8251H13.1749C10.8782 10.8251 8.68574 12.8759 8.68574 15.3143V16H7.31431V15.3143Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M8.68579 15.3143C8.68579 12.0896 5.84968 9.45371 2.82522 9.45371H2.1395V10.8251H2.82522C5.12099 10.8251 7.31436 12.8759 7.31436 15.3143V16H8.68579V15.3143Z" />
            </g>
          </svg>
        </div>
      </div>
      <ul className="social-list">
        <li><a href="https://www.facebook.com/"><i className="bx bxl-facebook" /></a></li>
        <li><a href="https://www.linkedin.com/"><i className="bx bxl-linkedin" /></a></li>
        <li><a href="https://www.youtube.com/"><i className="bx bxl-youtube" /></a></li>
      </ul>
    </div>
  )
}

export default HeroV6
