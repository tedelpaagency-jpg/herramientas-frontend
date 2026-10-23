"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const AboutJurney = () => {
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
      breakpoints: {
        280: {
          slidesPerView: 1,
        },
        350: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        576: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        992: {
          slidesPerView: 5,
          spaceBetween: 15,
        },
        1200: {
          slidesPerView: 6,
          spaceBetween: 10,
        },
        1400: {
          slidesPerView: 6,
        },
      },
    };
  }, []);
  return (
    <div className="about-page-journey-section mb-100">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-8">
            <div className="section-title text-center">
              <h2>Behind The Journey</h2>
              <p>With years of experience in the travel industry, we specialize in crafting personalized journeys.</p>
            </div>
          </div>
        </div>
        <div className="jouney-content-wrapper">
          <div className="nav-area mb-50">
            <div className="nav nav-pills" id="pills-tab" role="tablist">
              <Swiper {...settings} className="swiper about-page-journey-slider">
                <div className="swiper-wrapper">
                  <SwiperSlide className="swiper-slide">
                    <div className="nav-item" role="presentation">
                      <div className="nav-link active" id="pills-one-tab" data-bs-toggle="pill" data-bs-target="#pills-one" role="tab" aria-controls="pills-one" aria-selected="true">
                        <Image width={195} height={195} src="/assets/img/innerpages/about-page-journey-img1.jpg" alt="" />
                        <h4>1986</h4>
                      </div>
                      <span className="dot" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="nav-item" role="presentation">
                      <div className="nav-link" id="pills-two-tab" data-bs-toggle="pill" data-bs-target="#pills-two" role="tab" aria-controls="pills-two" aria-selected="true">
                        <Image width={195} height={195} src="/assets/img/innerpages/about-page-journey-img2.jpg" alt="" />
                        <h4>1996</h4>
                      </div>
                      <span className="dot" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="nav-item" role="presentation">
                      <div className="nav-link" id="pills-three-tab" data-bs-toggle="pill" data-bs-target="#pills-three" role="tab" aria-controls="pills-three" aria-selected="true">
                        <Image width={195} height={195} src="/assets/img/innerpages/about-page-journey-img3.jpg" alt="" />
                        <h4>2006</h4>
                      </div>
                      <span className="dot" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="nav-item" role="presentation">
                      <div className="nav-link" id="pills-four-tab" data-bs-toggle="pill" data-bs-target="#pills-four" role="tab" aria-controls="pills-four" aria-selected="true">
                        <Image width={195} height={195} src="/assets/img/innerpages/about-page-journey-img4.jpg" alt="" />
                        <h4>2016</h4>
                      </div>
                      <span className="dot" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="nav-item" role="presentation">
                      <div className="nav-link" id="pills-five-tab" data-bs-toggle="pill" data-bs-target="#pills-five" role="tab" aria-controls="pills-five" aria-selected="true">
                        <Image width={195} height={195} src="/assets/img/innerpages/about-page-journey-img5.jpg" alt="" />
                        <h4>2022</h4>
                      </div>
                      <span className="dot" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="nav-item" role="presentation">
                      <div className="nav-link" id="pills-six-tab" data-bs-toggle="pill" data-bs-target="#pills-six" role="tab" aria-controls="pills-six" aria-selected="true">
                        <Image width={195} height={195} src="/assets/img/innerpages/about-page-journey-img6.jpg" alt="" />
                        <h4>2023</h4>
                      </div>
                      <span className="dot" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="nav-item" role="presentation">
                      <div className="nav-link" id="pills-seven-tab" data-bs-toggle="pill" data-bs-target="#pills-seven" role="tab" aria-controls="pills-seven" aria-selected="true">
                        <Image width={195} height={195} src="/assets/img/innerpages/about-page-journey-img7.jpg" alt="" />
                        <h4>2025</h4>
                      </div>
                      <span className="dot" />
                    </div>
                  </SwiperSlide>
                </div>
              </Swiper>
            </div>
            <svg className="line" height={6} viewBox="0 0 1320 6" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM1315 3.5L1320 5.88675V0.113249L1315 2.5V3.5ZM4.5 3.5H1315.5V2.5H4.5V3.5Z" />
            </svg>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-one" role="tabpanel" aria-labelledby="pills-one-tab">
                  <h4>1986 – The Birth of Travel Agencies</h4>
                  <p>The first-ever travel agency was founded by <span>Thomas Cook</span> in England. He organized group trips, starting with a railway excursion for <span>500 people </span>. Thomas Cook expanded his services internationally, arranging trips to Paris and beyond. He introduced the <span>first-ever travel brochure, guiding travelers on destinations &amp; routes.</span>  Luxury cruises and organized tours gained popularity, especially among the elite.</p>
                </div>
                <div className="tab-pane fade" id="pills-two" role="tabpanel" aria-labelledby="pills-two-tab">
                  <h4>1996 – A New Era of Exploration</h4>
                  <p>The first-ever travel agency was founded by <span>Thomas Cook</span> in England. He organized group trips, starting with a railway excursion for <span>500 people </span>. Thomas Cook expanded his services internationally, arranging trips to Paris and beyond. He introduced the <span>first-ever travel brochure, guiding travelers on destinations &amp; routes.</span>  Luxury cruises and organized tours gained popularity, especially among the elite.</p>
                </div>
                <div className="tab-pane fade" id="pills-three" role="tabpanel" aria-labelledby="pills-three-tab">
                  <h4>2006 – We Took Travel Beyond Borders</h4>
                  <p>The first-ever travel agency was founded by <span>Thomas Cook</span> in England. He organized group trips, starting with a railway excursion for <span>500 people </span>. Thomas Cook expanded his services internationally, arranging trips to Paris and beyond. He introduced the <span>first-ever travel brochure, guiding travelers on destinations &amp; routes.</span>  Luxury cruises and organized tours gained popularity, especially among the elite.</p>
                </div>
                <div className="tab-pane fade" id="pills-four" role="tabpanel" aria-labelledby="pills-four-tab">
                  <h4>2016 – Embracing Technology to Transform Travel</h4>
                  <p>The first-ever travel agency was founded by <span>Thomas Cook</span> in England. He organized group trips, starting with a railway excursion for <span>500 people </span>. Thomas Cook expanded his services internationally, arranging trips to Paris and beyond. He introduced the <span>first-ever travel brochure, guiding travelers on destinations &amp; routes.</span>  Luxury cruises and organized tours gained popularity, especially among the elite.</p>
                </div>
                <div className="tab-pane fade" id="pills-five" role="tabpanel" aria-labelledby="pills-five-tab">
                  <h4>2022 – A New Era of Personalized Journeys</h4>
                  <p>The first-ever travel agency was founded by <span>Thomas Cook</span> in England. He organized group trips, starting with a railway excursion for <span>500 people </span>. Thomas Cook expanded his services internationally, arranging trips to Paris and beyond. He introduced the <span>first-ever travel brochure, guiding travelers on destinations &amp; routes.</span>  Luxury cruises and organized tours gained popularity, especially among the elite.</p>
                </div>
                <div className="tab-pane fade" id="pills-six" role="tabpanel" aria-labelledby="pills-six-tab">
                  <h4>2023 – Expanding Our Global Footprint</h4>
                  <p>The first-ever travel agency was founded by <span>Thomas Cook</span> in England. He organized group trips, starting with a railway excursion for <span>500 people </span>. Thomas Cook expanded his services internationally, arranging trips to Paris and beyond. He introduced the <span>first-ever travel brochure, guiding travelers on destinations &amp; routes.</span>  Luxury cruises and organized tours gained popularity, especially among the elite.</p>
                </div>
                <div className="tab-pane fade" id="pills-seven" role="tabpanel" aria-labelledby="pills-seven-tab">
                  <h4>2025 – Pioneering Next-Gen Travel Solutions</h4>
                  <p>The first-ever travel agency was founded by <span>Thomas Cook</span> in England. He organized group trips, starting with a railway excursion for <span>500 people </span>. Thomas Cook expanded his services internationally, arranging trips to Paris and beyond. He introduced the <span>first-ever travel brochure, guiding travelers on destinations &amp; routes.</span>  Luxury cruises and organized tours gained popularity, especially among the elite.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutJurney
