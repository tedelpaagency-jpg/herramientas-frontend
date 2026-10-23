"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const HeroV3 = () => {
    const settings: SwiperOptions = useMemo(() => {
        return {
            slidesPerView: "auto",
            speed: 1500,
            spaceBetween: 24,
            autoplay: {
                delay: 3000,
                pauseOnMouseEnter: true,
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
                el: ".banner-pagination",
                clickable: true,
            },
        };
    }, []);
    return (
        <div className="home3-banner-section">
            <Swiper {...settings} modules={[Navigation, Pagination, Autoplay, EffectFade]} className="swiper home2-banner-slider">
                <div className="swiper-wrapper">
                    <SwiperSlide className="swiper-slide">
                        <div className="banner-wrapper">
                            <div className="banner-img-area">
                                <Image width={550} height={220} src="/assets/img/home3/banner-img2.jpg" alt="" />
                            </div>
                            <div className="banner-content-wrap">
                                <div className="container">
                                    <div className="banner-content">
                                        <div className="award-rating-area">
                                            <Image width={70} height={60} src="/assets/img/home3/travel-award.png" alt="" />
                                            <h4>The World Travel Award</h4>
                                            <div className="rating">
                                                <span>(</span>
                                                <ul>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                </ul>
                                                <span>)</span>
                                            </div>
                                        </div>
                                        <h1>We’re ALL-in-one Travel Agency</h1>
                                        <p>A world-famous geothermal spa with milky blue waters rich in minerals.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <div className="banner-wrapper">
                            <div className="banner-img-area">
                                <Image width={550} height={220} src="/assets/img/home3/banner-img1.jpg" alt="" />
                            </div>
                            <div className="banner-content-wrap">
                                <div className="container">
                                    <div className="banner-content">
                                        <div className="award-rating-area">
                                            <Image width={70} height={60} src="/assets/img/home3/travel-award.png" alt="" />
                                            <h4>The World Travel Award</h4>
                                            <div className="rating">
                                                <span>(</span>
                                                <ul>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                </ul>
                                                <span>)</span>
                                            </div>
                                        </div>
                                        <h2>Fly First Class, Land Refreshed</h2>
                                        <p>Every destination is backed by care, culture, and confidence.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <div className="banner-wrapper">
                            <div className="banner-img-area">
                                <Image width={550} height={220} src="/assets/img/home3/banner-img2.jpg" alt="" />
                            </div>
                            <div className="banner-content-wrap">
                                <div className="container">
                                    <div className="banner-content">
                                        <div className="award-rating-area">
                                            <Image width={70} height={60} src="/assets/img/home3/travel-award.png" alt="" />
                                            <h4>The World Travel Award</h4>
                                            <div className="rating">
                                                <span>(</span>
                                                <ul>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                    <li><i className="bi bi-star-fill" /></li>
                                                </ul>
                                                <span>)</span>
                                            </div>
                                        </div>
                                        <h2>Luxury Travel, Tailored for You</h2>
                                        <p>Explore the world with care, enriched by culture and confidence.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </div>
            </Swiper>
            <div className="banner-pagination paginations" />
        </div>
    )
}

export default HeroV3
