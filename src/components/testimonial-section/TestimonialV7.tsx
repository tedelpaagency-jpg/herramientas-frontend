"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const TestimonialV7 = () => {
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
        nextEl: ".testimonial-slider-next",
        prevEl: ".testimonial-slider-prev",
      },
    };
  }, []);
  return (
    <>
      <div className="home7-testimonial-bg" style={{ backgroundImage: 'url(assets/img/home7/home7-testimonial-bg.jpg)' }} />
      <div className="home7-testimonial-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="testimonial-wrapper">
                <Swiper {...settings} modules={[Navigation, Pagination, EffectFade, Autoplay]} className="swiper home3-testimonial-slider">
                  <div className="swiper-wrapper">
                    <SwiperSlide className="swiper-slide">
                      <div className="testimonial-card five">
                        <ul className="rating-area">
                          <li><i className="bi bi-circle-fill" /></li>
                          <li><i className="bi bi-circle-fill" /></li>
                          <li><i className="bi bi-circle-fill" /></li>
                          <li><i className="bi bi-circle-fill" /></li>
                          <li><i className="bi bi-circle-half" /></li>
                        </ul>
                        <h5>Average Experience</h5>
                        <p>This was the best trip of my life! Everything was perfectly planned, from airport pickup to guided tours. The accommodations were fantastic, and the itinerary was well-balanced. Highly recommended!</p>
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
                      <div className="testimonial-card five">
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
                        <p>My life's greatest journey was this one! Everything was meticulously organized, including the guided tours and airport pickup. The schedule was well-balanced, and the lodging was excellent. I heartily suggest it!</p>
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
                      <div className="testimonial-card five">
                        <ul className="rating-area">
                          <li><i className="bi bi-circle-fill" /></li>
                          <li><i className="bi bi-circle-fill" /></li>
                          <li><i className="bi bi-circle-fill" /></li>
                          <li><i className="bi bi-circle-fill" /></li>
                          <li><i className="bi bi-circle-fill" /></li>
                        </ul>
                        <h5>Excellent Tourist Place!</h5>
                        <p>I had the most amazing trip of my life! Everything, including the guided excursions and the airport pickup, was meticulously organized. The itinerary was well-balanced, and the accommodations were excellent.</p>
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
                  </div>
                </Swiper>
                <div className="slider-btn-grp three">
                  <div className="slider-btn testimonial-slider-prev">
                    <svg width={16} height={12} viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0 5.31421H16V6.68564H0V5.31421Z" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M0.685714 6.68569C3.9104 6.68569 6.54629 3.84958 6.54629 0.825119V0.139404H5.17486V0.825119C5.17486 3.12181 3.12412 5.31426 0.685714 5.31426H0V6.68569H0.685714Z" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M0.685714 5.31421C3.9104 5.31421 6.54629 8.15032 6.54629 11.1748V11.8605H5.17486V11.1748C5.17486 8.87901 3.12412 6.68564 0.685714 6.68564H0V5.31421H0.685714Z" />
                    </svg>
                  </div>
                  <div className="slider-btn testimonial-slider-next">
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
        </div>
      </div>
    </>
  )
}

export default TestimonialV7
