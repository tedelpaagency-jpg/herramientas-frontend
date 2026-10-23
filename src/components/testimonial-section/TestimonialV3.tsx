"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const TestimonialV3 = () => {
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
        <div className="home3-testimonial-section mb-100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 d-lg-block d-none">
                        <div className="testimonial-img-area wow animate zoomIn" data-wow-delay="200ms" data-wow-duration="1500ms">
                            <div className="testimonial-img-grp">
                                <Image width={550} height={220} src="/assets/img/home3/testimonial-grp-img1.png" alt="" />
                                <ul className="img-list">
                                    <li><Image width={550} height={220} src="/assets/img/home3/testimonial-grp-img2.png" alt="" /></li>
                                    <li><Image width={550} height={220} src="/assets/img/home3/testimonial-grp-img3.png" alt="" /></li>
                                    <li><Image width={550} height={220} src="/assets/img/home3/testimonial-grp-img4.png" alt="" /></li>
                                    <li><Image width={550} height={220} src="/assets/img/home3/testimonial-grp-img5.png" alt="" /></li>
                                    <li><Image width={550} height={220} src="/assets/img/home3/testimonial-grp-img6.png" alt="" /></li>
                                </ul>
                                <div className="counter-area">
                                    <ul className="counter-img-grp">
                                        <li><Image width={550} height={220} src="/assets/img/home3/counter-people-img1.png" alt="" /></li>
                                        <li><Image width={550} height={220} src="/assets/img/home3/counter-people-img2.png" alt="" /></li>
                                        <li><Image width={550} height={220} src="/assets/img/home3/counter-people-img3.png" alt="" /></li>
                                        <li><Image width={550} height={220} src="/assets/img/home3/counter-people-img4.png" alt="" /></li>
                                    </ul>
                                    <h6> <strong><span className="counter">25</span>k+</strong> Customer in Worldwide.</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="testimonial-content">
                            <div className="section-title wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
                                <h2>Hear It from Travelers</h2>
                                <p>We go beyond just booking trips—we create unforgettable travel experiences that match your dreams!</p>
                            </div>
                            <div className="testimonial-slider-area">
                                <Swiper {...settings} modules={[Navigation, Autoplay, EffectFade]} className="swiper home3-testimonial-slider">
                                    <div className="swiper-wrapper">
                                        <SwiperSlide className="swiper-slide">
                                            <div className="testimonial-card four">
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
                                            <div className="testimonial-card four">
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
                                            <div className="testimonial-card four">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestimonialV3
