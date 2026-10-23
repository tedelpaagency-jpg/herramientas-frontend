"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";
const DestinationSectionV7 = () => {
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
        <div className="home7-destination-section mb-100">
            <div className="container">
                <div className="destination-wrapper mb-60">
                    <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
                        <div className="col-xl-6 col-lg-8">
                            <div className="section-title text-center">
                                <h2>Featured Destination</h2>
                                <p>A curated list of the most popular travel packages based on different destinations.</p>
                            </div>
                        </div>
                    </div>
                    <div className="destination-slider-area">
                        <Swiper {...settings} modules={[Navigation, Pagination, EffectFade, Autoplay]} className="swiper home3-destination-slider">
                            <div className="swiper-wrapper">
                                <SwiperSlide className="swiper-slide">
                                    <div className="destination-card2 two">
                                        <Link href="/destination/details" className="destination-img">
                                            <Image width={550} height={220} src="/assets/img/home7/destination-img1.jpg" alt="" />
                                        </Link>
                                        <div className="destination-content">
                                            <h5><Link href="/destination/details">Nepal</Link></h5>
                                            <span>Activities (08)</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="destination-card2 two">
                                        <Link href="/destination/details" className="destination-img">
                                            <Image width={550} height={220} src="/assets/img/home7/destination-img2.jpg" alt="" />
                                        </Link>
                                        <div className="destination-content">
                                            <h5><Link href="/destination/details">Patagonia</Link></h5>
                                            <span>Activities (34)</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="destination-card2 two">
                                        <Link href="/destination/details" className="destination-img">
                                            <Image width={550} height={220} src="/assets/img/home7/destination-img3.jpg" alt="" />
                                        </Link>
                                        <div className="destination-content">
                                            <h5><Link href="/destination/details">Hawaii, USA</Link></h5>
                                            <span>Activities (10)</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="destination-card2 two">
                                        <Link href="/destination/details" className="destination-img">
                                            <Image width={550} height={220} src="/assets/img/home7/destination-img4.jpg" alt="" />
                                        </Link>
                                        <div className="destination-content">
                                            <h5><Link href="/destination/details">Swiss Alps</Link></h5>
                                            <span>Activities (13)</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="destination-card2 two">
                                        <Link href="/destination/details" className="destination-img">
                                            <Image width={550} height={220} src="/assets/img/home7/destination-img5.jpg" alt="" />
                                        </Link>
                                        <div className="destination-content">
                                            <h5><Link href="/destination/details">Rome</Link></h5>
                                            <span>Activities (15)</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="destination-card2 two">
                                        <Link href="/destination/details" className="destination-img">
                                            <Image width={550} height={220} src="/assets/img/home7/destination-img6.jpg" alt="" />
                                        </Link>
                                        <div className="destination-content">
                                            <h5><Link href="/travel-package">Maldives</Link></h5>
                                            <span>Activities (21)</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="destination-card2 two">
                                        <Link href="/travel-package" className="destination-img">
                                            <Image width={550} height={220} src="/assets/img/home7/destination-img7.jpg" alt="" />
                                        </Link>
                                        <div className="destination-content">
                                            <h5><Link href="/travel-package">Indonesia</Link></h5>
                                            <span>Activities (12)</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </div>
                        </Swiper>
                        <div className="slider-btn-grp three">
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
                <div className="feature-wrapper wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                    <div className="section-title text-center mb-50">
                        <h2>Ensure Trust &amp; Reliability.</h2>
                    </div>
                    <ul className="feature-list">
                        <li className="single-feature">
                            <div className="icon">
                                <Image width={550} height={220} src="/assets/img/home7/icon/feature-icon1.svg" alt="" />
                            </div>
                            <div className="content">
                                <h5>100% Verified &amp; <br /> Safe Adventures</h5>
                                <p>We prioritize your safety and ensure that every adventure meets the highest standards.</p>
                            </div>
                        </li>
                        <li className="single-feature">
                            <div className="icon">
                                <Image width={550} height={220} src="/assets/img/home7/icon/feature-icon2.svg" alt="" />
                            </div>
                            <div className="content">
                                <h5>Certified &amp; <br /> Experienced Guides</h5>
                                <p>Our team of expert guides ensures you have a safe, enriching, &amp; unforgettable adventure!</p>
                            </div>
                        </li>
                        <li className="single-feature">
                            <div className="icon">
                                <Image width={550} height={220} src="/assets/img/home7/icon/feature-icon3.svg" alt="" />
                            </div>
                            <div className="content">
                                <h5>24/7 Customer <br /> Support</h5>
                                <p>No matter where your adventure takes you, our dedicated support team is available 24/7 to assist you.</p>
                            </div>
                        </li>
                    </ul>
                    <svg className="line" height={6} viewBox="0 0 1220 6" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM1215 3.5L1220 5.88675V0.113249L1215 2.5V3.5ZM4.5 3.5H1215.5V2.5H4.5V3.5Z" />
                    </svg>
                    <div className="rating-and-btn-area">
                        <div className="rating-area">
                            <Image width={80} height={16} src="/assets/img/home2/icon/trustpilot-star.svg" alt="" />
                            <div className="text-and-logo">
                                <p>5.0 Rating out of 5.0 based on 24,000 reviews</p>
                                <a href="https://www.trustpilot.com/">
                                    <Image width={100} height={24}  src="/assets/img/home2/icon/trustpilot-logo.svg" alt="" />
                                </a>
                            </div>
                        </div>
                        <Link href="/contact">Customize Package
                            <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
            <Image width={111} height={220} src="/assets/img/home7/vector/home7-destination-section-vector1.svg" alt="" className="vector1" />
            <Image width={111} height={220} src="/assets/img/home7/vector/home7-destination-section-vector2.svg" alt="" className="vector2" />
        </div>
    )
}

export default DestinationSectionV7
