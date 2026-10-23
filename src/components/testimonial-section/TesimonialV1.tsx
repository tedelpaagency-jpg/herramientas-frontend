"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";
import LightGallery from 'lightgallery/react';
// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
const TesimonialV1: React.FC = () => {
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
    <div className="home1-testimonial-section mb-100">
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
            <Swiper {...settings} modules={[Navigation, Pagination]} className="swiper home1-testimonial-slider">
              <div className="swiper-wrapper">
                <SwiperSlide className="swiper-slide">
                  <div className="testimonial-card">
                    <div className="author-area">
                      <LightGallery speed={500}
                        plugins={[lgZoom, lgVideo]}
                        elementClassNames="author-img" >
                        <Image width={550} height={220} src="/assets/img/home1/testimonial-author-img1.png" alt="" />
                        <a data-fancybox="video-player" className="gallery-item play-btn"
                          data-src="https://www.youtube.com/watch?v=u31qwQUeGuM&t=1s" style={{ cursor: "pointer" }}
                        >
                          <svg width={26} height={26} viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                            <circle cx={13} cy={13} r="12.5" fill="white" stroke="#110F0F" />
                            <g>
                              <path d="M8.4375 13V9.7519C8.4375 8.4062 9.89453 7.5644 11.0586 8.23823L13.873 9.86323L16.6875 11.4882C17.8535 12.1601 17.8535 13.8437 16.6875 14.5156L13.873 16.1406L11.0586 17.7656C9.89453 18.4355 8.4375 17.5957 8.4375 16.25V13Z" />
                            </g>
                          </svg>
                        </a>
                      </LightGallery>
                      <div className="author-info">
                        <h5>Robert Kcarery </h5>
                        <span>GoFly Traveler</span>
                      </div>
                    </div>
                    <ul className="rating-area">
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                    </ul>
                    <h5>Excellent Tourist Place!</h5>
                    <div className="content">
                      <p>Our honeymoon package to the Maldives was beyond amazing! The travel agency took care of every detail.</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="testimonial-card two">
                    <div className="author-area">
                      <div className="author-img">
                        <Image width={550} height={220} src="/assets/img/home1/testimonial-author-img2.png" alt="" />
                      </div>
                      <div className="author-info">
                        <h5>Selina Henry</h5>
                        <span>GoFly Traveler</span>
                      </div>
                    </div>
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
                    <div className="content">
                      <p>This was the best trip of my life! Everything was perfectly planned, from airport pickup to guided tours. The accommodations were fantastic, and the itinerary was well-balanced. Highly recommended!</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="testimonial-card">
                    <div className="author-area">
                      <LightGallery speed={500}
                        plugins={[lgZoom, lgVideo]}
                        elementClassNames="author-img" >
                        <Image width={550} height={220} src="/assets/img/home1/testimonial-author-img3.png" alt="" />
                        <a data-fancybox="video-player" className="gallery-item play-btn"
                        data-src="https://www.youtube.com/watch?v=u31qwQUeGuM&t=1s" style={{ cursor: "pointer" }}
                          >
                          <svg width={26} height={26} viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                            <circle cx={13} cy={13} r="12.5" fill="white" stroke="#110F0F" />
                            <g>
                              <path d="M8.4375 13V9.7519C8.4375 8.4062 9.89453 7.5644 11.0586 8.23823L13.873 9.86323L16.6875 11.4882C17.8535 12.1601 17.8535 13.8437 16.6875 14.5156L13.873 16.1406L11.0586 17.7656C9.89453 18.4355 8.4375 17.5957 8.4375 16.25V13Z" />
                            </g>
                          </svg>
                        </a>
                      </LightGallery>
                      <div className="author-info">
                        <h5>James Bonde</h5>
                        <span>GoFly Traveler</span>
                      </div>
                    </div>
                    <ul className="rating-area">
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-half" /></li>
                    </ul>
                    <h5>Average Experience</h5>
                    <div className="content">
                      <p>The tour was well-organized, and we enjoyed every bit of it. However, I wish we had more free time to explore on our own. Overall, a great experience!</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="testimonial-card">
                    <div className="author-area">
                      <LightGallery speed={500}
                        plugins={[lgZoom, lgVideo]}
                        elementClassNames="author-img" >
                        <Image width={550} height={220} src="/assets/img/home1/testimonial-author-img4.png" alt="" />
                        <a data-fancybox="video-player" className="gallery-item play-btn"
                        data-src="https://www.youtube.com/watch?v=u31qwQUeGuM&t=1s" style={{ cursor: "pointer" }}
                          >
                          <svg width={26} height={26} viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                            <circle cx={13} cy={13} r="12.5" fill="white" stroke="#110F0F" />
                            <g>
                              <path d="M8.4375 13V9.7519C8.4375 8.4062 9.89453 7.5644 11.0586 8.23823L13.873 9.86323L16.6875 11.4882C17.8535 12.1601 17.8535 13.8437 16.6875 14.5156L13.873 16.1406L11.0586 17.7656C9.89453 18.4355 8.4375 17.5957 8.4375 16.25V13Z" />
                            </g>
                          </svg>
                        </a>
                      </LightGallery>
                      <div className="author-info">
                        <h5>Michael D Linda</h5>
                        <span>GoFly Traveler</span>
                      </div>
                    </div>
                    <ul className="rating-area">
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-fill" /></li>
                      <li><i className="bi bi-circle-half" /></li>
                    </ul>
                    <h5>Great Visitors Venue!</h5>
                    <div className="content">
                      <p>Thank you so much for your work on our honeymoon. We really did have such a great time and it was everything we were hoping!</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="testimonial-card two">
                    <div className="author-area">
                      <div className="author-img">
                        <Image width={550} height={220} src="/assets/img/home1/testimonial-author-img5.png" alt="" />
                      </div>
                      <div className="author-info">
                        <h5>Amber Lashley</h5>
                        <span>GoFly Traveler</span>
                      </div>
                    </div>
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
                    <div className="content">
                      <p>We have returned from Greece and want to let you know how terrific the trip was! Everything was great. We highly recommend them. Thank you so much!</p>
                    </div>
                  </div>
                </SwiperSlide>
              </div>
            </Swiper>
          </div>
        </div>
        <div className="review-wrap wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="tripadvisor-rating-area">
            <a href="https://www.tripadvisor.com/" className="tripadvisor-rating">
              <Image width={135} height={28} src="/assets/img/home1/icon/tripadvisor-logo.svg" alt="" />
              <div className="rating-area">
                <span>Reviews</span>
                <Image width={65} height={12} src="/assets/img/home1/icon/tripadvisor-start.svg" alt="" />
              </div>
            </a>
            <svg className="divider" width={6} height={52} viewBox="0 0 6 52" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 5L5.88675 0H0.113249L2.5 5H3.5ZM2.5 47L0.113249 52H5.88675L3.5 47H2.5ZM2.5 4.5V47.5H3.5V4.5H2.5Z" />
            </svg>
          </div>
          <a href="http://trustpilot.com/" className="trustpilot-rating-area">
            <strong>4.5</strong>
            <div className="trustpilot-rating">
              <Image width={100} height={24} src="/assets/img/home1/icon/trustpilot-logo.svg" alt="" />
              <div className="rating-area">
                <Image width={80} height={16} src="/assets/img/home1/icon/trustpilot-star.svg" alt="" />
                <span>(2K reviews)</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default TesimonialV1
