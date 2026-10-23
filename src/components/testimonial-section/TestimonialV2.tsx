"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const TestimonialV2 = () => {
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
        nextEl: ".testimonial-slider-next",
        prevEl: ".testimonial-slider-prev",
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
          spaceBetween: 15,
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
        },
      },
    };
  }, []);
  return (
    <div className="home2-testimonial-section">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2>Hear It from Travelers</h2>
              <p>We go beyond just booking trips—we create unforgettable travel experiences that match your dreams!</p>
            </div>
          </div>
        </div>
        <div className="row mb-40">
          <div className="col-lg-12">
            <Swiper {...settings} modules={[Navigation, Autoplay]} className="swiper home1-testimonial-slider">
              <div className="swiper-wrapper">
                <SwiperSlide className="swiper-slide">
                  <div className="testimonial-card three">
                    <ul className="rating-area">
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                    </ul>
                    <h5>Excellent Tourist Place!</h5>
                    <p>Our honeymoon package to the Maldives was beyond amazing! The travel agency took care of every detail.</p>
                    <div className="author-area">
                      <div className="author-img">
                        <Image width={550} height={220} src="/assets/img/home1/testimonial-author-img1.png" alt="" />
                      </div>
                      <div className="author-info">
                        <h5>Robert Kcarery </h5>
                        <span>GoFly Traveler</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="testimonial-card three">
                    <ul className="rating-area">
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-half" /></li>
                    </ul>
                    <h5>Average Experience</h5>
                    <p>The Thailand tour was flawless! Great hotels, smooth transfers — truly a stress-free and enjoyable experience.</p>
                    <div className="author-area">
                      <div className="author-img">
                        <Image width={550} height={220} src="/assets/img/home1/testimonial-author-img3.png" alt="" />
                      </div>
                      <div className="author-info">
                        <h5>James Bonde</h5>
                        <span>GoFly Traveler</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="testimonial-card three">
                    <ul className="rating-area trustpilot">
                      <li>
                        <svg width={11} height={10} viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 7.57409L7.53125 6.99627L8.48437 9.93221L5.25 7.57409ZM10.5 3.77924H6.48437L5.25 0L4.01562 3.77924H0L3.25 6.12174L2.01562 9.90097L5.26562 7.55847L7.26562 6.12174L10.5 3.77924Z" />
                        </svg>
                      </li>
                      <li>
                        <svg width={11} height={10} viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 7.57409L7.53125 6.99627L8.48437 9.93221L5.25 7.57409ZM10.5 3.77924H6.48437L5.25 0L4.01562 3.77924H0L3.25 6.12174L2.01562 9.90097L5.26562 7.55847L7.26562 6.12174L10.5 3.77924Z" />
                        </svg>
                      </li>
                      <li>
                        <svg width={11} height={10} viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 7.57409L7.53125 6.99627L8.48437 9.93221L5.25 7.57409ZM10.5 3.77924H6.48437L5.25 0L4.01562 3.77924H0L3.25 6.12174L2.01562 9.90097L5.26562 7.55847L7.26562 6.12174L10.5 3.77924Z" />
                        </svg>
                      </li>
                      <li>
                        <svg width={11} height={10} viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 7.57409L7.53125 6.99627L8.48437 9.93221L5.25 7.57409ZM10.5 3.77924H6.48437L5.25 0L4.01562 3.77924H0L3.25 6.12174L2.01562 9.90097L5.26562 7.55847L7.26562 6.12174L10.5 3.77924Z" />
                        </svg>
                      </li>
                      <li>
                        <svg width={11} height={10} viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 7.57409L7.53125 6.99627L8.48437 9.93221L5.25 7.57409ZM10.5 3.77924H6.48437L5.25 0L4.01562 3.77924H0L3.25 6.12174L2.01562 9.90097L5.26562 7.55847L7.26562 6.12174L10.5 3.77924Z" />
                        </svg>
                      </li>
                    </ul>
                    <h5>Great Experience!</h5>
                    <p>Thanks to their expert planning, our Dubai vacation was seamless. Every detail was handled with care.</p>
                    <div className="author-area">
                      <div className="author-img">
                        <Image width={550} height={220} src="/assets/img/home1/testimonial-author-img2.png" alt="" />
                      </div>
                      <div className="author-info">
                        <h5>Selina Henry</h5>
                        <span>GoFly Traveler</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="testimonial-card three">
                    <ul className="rating-area">
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                    </ul>
                    <h5>Great Visitors Venue!</h5>
                    <p>We had an incredible Europe tour! The itinerary, bookings, and support were all professionally managed.</p>
                    <div className="author-area">
                      <div className="author-img">
                        <Image width={550} height={220} src="/assets/img/home1/testimonial-author-img4.png" alt="" />
                      </div>
                      <div className="author-info">
                        <h5>Michael D Linda</h5>
                        <span>GoFly Traveler</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="testimonial-card three">
                    <ul className="rating-area trustpilot">
                      <li>
                        <svg width={11} height={10} viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 7.57409L7.53125 6.99627L8.48437 9.93221L5.25 7.57409ZM10.5 3.77924H6.48437L5.25 0L4.01562 3.77924H0L3.25 6.12174L2.01562 9.90097L5.26562 7.55847L7.26562 6.12174L10.5 3.77924Z" />
                        </svg>
                      </li>
                      <li>
                        <svg width={11} height={10} viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 7.57409L7.53125 6.99627L8.48437 9.93221L5.25 7.57409ZM10.5 3.77924H6.48437L5.25 0L4.01562 3.77924H0L3.25 6.12174L2.01562 9.90097L5.26562 7.55847L7.26562 6.12174L10.5 3.77924Z" />
                        </svg>
                      </li>
                      <li>
                        <svg width={11} height={10} viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 7.57409L7.53125 6.99627L8.48437 9.93221L5.25 7.57409ZM10.5 3.77924H6.48437L5.25 0L4.01562 3.77924H0L3.25 6.12174L2.01562 9.90097L5.26562 7.55847L7.26562 6.12174L10.5 3.77924Z" />
                        </svg>
                      </li>
                      <li>
                        <svg width={11} height={10} viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 7.57409L7.53125 6.99627L8.48437 9.93221L5.25 7.57409ZM10.5 3.77924H6.48437L5.25 0L4.01562 3.77924H0L3.25 6.12174L2.01562 9.90097L5.26562 7.55847L7.26562 6.12174L10.5 3.77924Z" />
                        </svg>
                      </li>
                      <li>
                        <svg width={11} height={10} viewBox="0 0 11 10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.25 7.57409L7.53125 6.99627L8.48437 9.93221L5.25 7.57409ZM10.5 3.77924H6.48437L5.25 0L4.01562 3.77924H0L3.25 6.12174L2.01562 9.90097L5.26562 7.55847L7.26562 6.12174L10.5 3.77924Z" />
                        </svg>
                      </li>
                    </ul>
                    <h5>Fantastic Service!</h5>
                    <p>Our trip to Bali was unforgettable! Everything was perfectly organized by the agency from start to finish.</p>
                    <div className="author-area">
                      <div className="author-img">
                        <Image width={550} height={220} src="/assets/img/home1/testimonial-author-img5.png" alt="" />
                      </div>
                      <div className="author-info">
                        <h5>Amber Lashley</h5>
                        <span>GoFly Traveler</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </div>
            </Swiper>
          </div>
        </div>
        <div className="review-and-slider-btn wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <a href="https://www.trustpilot.com/" className="single-rating">
            <strong>4.5</strong>
            <div className="trustpilot-rating">
              <Image width={100} height={24}  src="/assets/img/home1/icon/trustpilot-logo.svg" alt="" />
              <div className="rating-area">
                <Image width={80} height={16} src="/assets/img/home1/icon/trustpilot-star.svg" alt="" />
                <span>(2K reviews)</span>
              </div>
            </div>
          </a>
          <div className="slider-btn-grp">
            <div className="slider-btn testimonial-slider-prev">
              <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M11.002 13.0005C10.002 10.5005 5.00195 8.00049 2.00195 7.00049C5.00195 6.00049 9.50195 4.50049 11.002 1.00049" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </svg>
            </div>
            <div className="slider-btn testimonial-slider-next">
              <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M2.99805 13.0005C3.99805 10.5005 8.99805 8.00049 11.998 7.00049C8.99805 6.00049 4.49805 4.50049 2.99805 1.00049" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          </div>
          <a href="https://www.tripadvisor.com/" className="single-rating">
            <strong>4.5</strong>
            <div className="tripadvisor-rating">
              <Image width={135} height={28} src="/assets/img/home1/icon/tripadvisor-logo.svg" alt="" />
              <div className="rating-area">
                <span>Reviews</span>
                <Image width={65} height={12} src="/assets/img/home1/icon/tripadvisor-start.svg" alt="" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default TestimonialV2
