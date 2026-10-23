"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";
const DestinationSectionV3 = () => {
  const settings: SwiperOptions = useMemo(() => {
    return {
      slidesPerView: "auto",
      speed: 1500,
      spaceBetween: 24,
      autoplay: {
        delay: 2500, // Autoplay duration in milliseconds
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
    <div className="home3-destination-section mb-100">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-8">
            <div className="section-title text-center">
              <span>Best Agency Ever!</span>
              <h2>We’re Locked Top Destination</h2>
              <p>A curated list of the most popular travel packages based on different destinations.</p>
            </div>
          </div>
        </div>
        <div className="feature-and-rating-area mb-60">
          <div className="row g-4">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="single-feature">
                <div className="icon">
                  <Image width={550} height={220} src="/assets/img/home3/icon/destination-feature-icon1.svg" alt="" />
                </div>
                <h5>Customizable Package.</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="single-feature">
                <div className="icon">
                  <Image width={550} height={220} src="/assets/img/home3/icon/destination-feature-icon2.svg" alt="" />
                </div>
                <h5>24/7 Support</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="single-feature">
                <div className="icon">
                  <Image width={550} height={220} src="/assets/img/home3/icon/destination-feature-icon3.svg" alt="" />
                </div>
                <h5>Trusted by Thousands</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="single-feature">
                <div className="icon">
                  <Image width={550} height={220} src="/assets/img/home3/icon/destination-feature-icon4.svg" alt="" />
                </div>
                <h5>Local Experties</h5>
              </div>
            </div>
          </div>
          <div className="rating-area wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
            <Image width={80} height={16} src="/assets/img/home2/icon/trustpilot-star.svg" alt="" />
            <div className="text-and-logo">
              <p>5.0 Rating out of 5.0 based on 24,000 reviews</p>
              <a href="http://trustpilot.com/"><Image width={100} height={24}  src="/assets/img/home2/icon/trustpilot-logo.svg" alt="" /></a>
            </div>
          </div>
        </div>
        <div className="destination-slider-area">
          <Swiper {...settings} modules={[Navigation, Autoplay, EffectFade]} className="swiper home3-destination-slider">
            <div className="swiper-wrapper">
              <SwiperSlide className="swiper-slide">
                <div className="destination-card2 two">
                  <div className="destination-img">
                    <Image width={550} height={220} src="/assets/img/home3/destination-img1.jpg" alt="" />
                    <Link href="/destination/details" className="arrow">
                      <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Link>
                  </div>
                  <div className="destination-content">
                    <h5><Link href="/destination/details">Great Wall of China</Link></h5>
                    <span>Tours (12)</span>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="destination-card2 two">
                  <div className="destination-img">
                    <Image width={550} height={220} src="/assets/img/home3/destination-img2.jpg" alt="" />
                    <Link href="/destination/details" className="arrow">
                      <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Link>
                  </div>
                  <div className="destination-content">
                    <h5><Link href="/destination/details">Rome, Itlay</Link></h5>
                    <span>Tours (06)</span>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="destination-card2 two">
                  <div className="destination-img">
                    <Image width={550} height={220} src="/assets/img/home3/destination-img3.jpg" alt="" />
                    <Link href="/destination/details" className="arrow">
                      <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Link>
                  </div>
                  <div className="destination-content">
                    <h5><Link href="/destination/details">Machu Picchu of Peru</Link></h5>
                    <span>Tours (16)</span>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="destination-card2 two">
                  <div className="destination-img">
                    <Image width={550} height={220} src="/assets/img/home3/destination-img4.jpg" alt="" />
                    <Link href="/destination/details" className="arrow">
                      <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Link>
                  </div>
                  <div className="destination-content">
                    <h5><Link href="/destination/details">Great Temple Jordan</Link></h5>
                    <span>Tours (10)</span>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="destination-card2 two">
                  <div className="destination-img">
                    <Image width={550} height={220} src="/assets/img/home3/destination-img5.jpg" alt="" />
                    <Link href="/destination/details" className="arrow">
                      <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Link>
                  </div>
                  <div className="destination-content">
                    <h5><Link href="/destination/details">Athens Greece</Link></h5>
                    <span>Tours (12)</span>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="destination-card2 two">
                  <div className="destination-img">
                    <Image width={550} height={220} src="/assets/img/home3/destination-img6.jpg" alt="" />
                    <Link href="/destination/details" className="arrow">
                      <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Link>
                  </div>
                  <div className="destination-content">
                    <h5><Link href="/destination/details">Switzerland</Link></h5>
                    <span>Tours (26)</span>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <div className="destination-card2 two">
                  <div className="destination-img">
                    <Image width={550} height={220} src="/assets/img/home3/destination-img7.jpg" alt="" />
                    <Link href="/destination/details" className="arrow">
                      <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13C5.94664 8.05336 13 1 13 1M13 1C10.1852 1.52778 6.69444 2.58333 3 1M13 1C12.4722 3.63889 11.4167 6.77778 13 11" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Link>
                  </div>
                  <div className="destination-content">
                    <h5><Link href="/destination/details">Fatima, Portugal</Link></h5>
                    <span>Tours (16)</span>
                  </div>
                </div>
              </SwiperSlide>
            </div>
          </Swiper>
          <div className="slider-btn-grp two">
            <div className="slider-btn destination-slider-prev">
              <svg width={16} height={12} viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 5.31421H16V6.68564H0V5.31421Z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M0.685714 6.68569C3.9104 6.68569 6.54629 3.84958 6.54629 0.825119V0.139404H5.17486V0.825119C5.17486 3.12181 3.12412 5.31426 0.685714 5.31426H0V6.68569H0.685714Z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M0.685714 5.31421C3.9104 5.31421 6.54629 8.15032 6.54629 11.1748V11.8605H5.17486V11.1748C5.17486 8.87901 3.12412 6.68564 0.685714 6.68564H0V5.31421H0.685714Z" />
              </svg>
            </div>
            <div className="slider-btn destination-slider-next">
              <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path fillRule="evenodd" clipRule="evenodd" d="M16 7.31421H-3.8147e-06V8.68564H16V7.31421Z" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.3143 8.68569C12.0896 8.68569 9.45371 5.84958 9.45371 2.82512V2.1394H10.8251V2.82512C10.8251 5.12181 12.8759 7.31426 15.3143 7.31426H16V8.68569H15.3143Z" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.3143 7.31421C12.0896 7.31421 9.45371 10.1503 9.45371 13.1748V13.8605H10.8251V13.1748C10.8251 10.879 12.8759 8.68564 15.3143 8.68564H16V7.31421H15.3143Z" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationSectionV3
