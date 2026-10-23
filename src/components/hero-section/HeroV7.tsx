"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const HeroV7 = () => {
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
        <>
            <div className="home7-banner-section">
                <Swiper {...settings} modules={[Navigation, Pagination, EffectFade, Autoplay]} className="swiper home6-banner-slider">
                    <div className="swiper-wrapper">
                        <SwiperSlide className="swiper-slide">
                            <div className="banner-wrapper">
                                <div className="banner-img-area">
                                    <Image width={1950} height={220} src="/assets/img/home7/banner-img1.jpg" alt="" />
                                </div>
                                <div className="banner-content-wrap">
                                    <div className="container">
                                        <div className="banner-content">
                                            <span>Adventure Awaits</span>
                                            <h1>Discover. Explore. Experience</h1>
                                            <Link href="/experience-grid" className="primary-btn1 four two white-bg">
                                                <span>
                                                    View All Activities
                                                    <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                                                    </svg>
                                                </span>
                                                <span>
                                                    View All Activities
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
                                    <Image width={1950} height={220} src="/assets/img/home7/banner-img2.jpg" alt="" />
                                </div>
                                <div className="banner-content-wrap">
                                    <div className="container">
                                        <div className="banner-content">
                                            <span>Your Journey Begins</span>
                                            <h2>Wander. Dream. Travel</h2>
                                            <Link href="/experience-grid" className="primary-btn1 four two white-bg">
                                                <span>
                                                    View All Activities
                                                    <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                                                    </svg>
                                                </span>
                                                <span>
                                                    View All Activities
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
                                    <Image width={1950} height={220} src="/assets/img/home7/banner-img3.jpg" alt="" />
                                </div>
                                <div className="banner-content-wrap">
                                    <div className="container">
                                        <div className="banner-content">
                                            <span>Moments That Matter</span>
                                            <h2>Relax. Discover. Repeat</h2>
                                            <Link href="/experience-grid" className="primary-btn1 four two white-bg">
                                                <span>
                                                    View All Activities
                                                    <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                                                    </svg>
                                                </span>
                                                <span>
                                                    View All Activities
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
                        <svg width={22} height={22} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path fillRule="evenodd" clipRule="evenodd" d="M0 10.0571H22V11.9428H0V10.0571Z" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M0.942857 11.9429C5.3768 11.9429 9.00115 8.0432 9.00115 3.88457V2.94171H7.11543V3.88457C7.11543 7.04251 4.29566 10.0571 0.942857 10.0571H0V11.9429H0.942857Z" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M0.942857 10.0571C5.3768 10.0571 9.00115 13.9568 9.00115 18.1154V19.0583H7.11543V18.1154C7.11543 14.9587 4.29566 11.9428 0.942857 11.9428H0V10.0571H0.942857Z" />
                            </g>
                        </svg>
                    </div>
                    <div className="slider-btn banner-slider-next">
                        <svg width={22} height={22} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_1151_27911)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M22 10.0571H-5.72205e-06V11.9428H22V10.0571Z" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M21.0571 11.9429C16.6232 11.9429 12.9989 8.0432 12.9989 3.88457V2.94171H14.8846V3.88457C14.8846 7.04251 17.7043 10.0571 21.0571 10.0571H22V11.9429H21.0571Z" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M21.0571 10.0571C16.6232 10.0571 12.9989 13.9568 12.9989 18.1154V19.0583H14.8846V18.1154C14.8846 14.9587 17.7043 11.9428 21.0571 11.9428H22V10.0571H21.0571Z" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="home7-banner-bottom">
                <div className="container">
                    <div className="row gy-md-5 gy-4 align-items-center">
                        <div className="col-lg-4 col-md-6 divider order-lg-1 order-2 d-flex justify-content-md-start justify-content-center">
                            <div className="single-contact">
                                <div className="icon">
                                    <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path d="M15.5645 11.7424L13.3317 9.50954C12.5342 8.7121 11.1786 9.03111 10.8596 10.0678C10.6203 10.7855 9.8229 11.1842 9.1052 11.0247C7.51031 10.626 5.3572 8.55261 4.95848 6.87797C4.71925 6.16024 5.19771 5.36279 5.91542 5.12359C6.9521 4.80461 7.27107 3.44895 6.47363 2.65151L4.24078 0.418659C3.60282 -0.139553 2.64589 -0.139553 2.08768 0.418659L0.57253 1.93381C-0.942617 3.5287 0.732019 7.75516 4.48001 11.5032C8.22801 15.2512 12.4545 17.0056 14.0494 15.4106L15.5645 13.8955C16.1228 13.2575 16.1228 12.3006 15.5645 11.7424Z" />
                                        </g>
                                    </svg>
                                </div>
                                <div className="content">
                                    <span>Need Help?</span>
                                    <a href="tel:91345533865">+91 345 533 865</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 divider order-lg-2">
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
                        </div>
                        <div className="col-lg-4 col-md-6 d-flex justify-content-lg-end justify-content-center order-lg-3">
                            <div className="single-contact">
                                <div className="icon">
                                    <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M1.96372 3.07415L6.28622 7.39852C7.22897 8.33946 8.77003 8.34027 9.71356 7.39852L14.0361 3.07415C14.0463 3.06399 14.0541 3.0517 14.0591 3.03816C14.064 3.02462 14.0659 3.01016 14.0647 2.99581C14.0634 2.98145 14.059 2.96755 14.0517 2.95509C14.0445 2.94263 14.0346 2.93192 14.0227 2.92371C13.5819 2.61624 13.0455 2.43396 12.4677 2.43396H3.53216C2.95431 2.43396 2.41791 2.61627 1.97703 2.92371C1.96519 2.93192 1.95529 2.94263 1.94805 2.95509C1.9408 2.96755 1.93639 2.98145 1.93512 2.99581C1.93385 3.01016 1.93575 3.02462 1.9407 3.03816C1.94564 3.0517 1.9535 3.06399 1.96372 3.07415ZM0.808595 5.15749C0.808243 4.71811 0.915024 4.28527 1.11969 3.89646C1.12683 3.88275 1.13711 3.87093 1.14969 3.86194C1.16226 3.85295 1.17678 3.84706 1.19207 3.84474C1.20735 3.84242 1.22296 3.84373 1.23764 3.84858C1.25232 3.85343 1.26564 3.86168 1.27653 3.87265L5.54431 8.14043C6.89578 9.49387 9.10322 9.49465 10.4555 8.14043L14.7233 3.87265C14.7342 3.86168 14.7475 3.85343 14.7622 3.84858C14.7769 3.84373 14.7925 3.84242 14.8077 3.84474C14.823 3.84706 14.8376 3.85295 14.8501 3.86194C14.8627 3.87093 14.873 3.88275 14.8801 3.89646C15.0848 4.28527 15.1916 4.71811 15.1912 5.15749V10.843C15.1912 12.3459 13.9687 13.5666 12.4677 13.5666H3.53216C2.03116 13.5666 0.808595 12.3459 0.808595 10.843V5.15749Z" />
                                    </svg>
                                </div>
                                <div className="content">
                                    <span>Email Now</span>
                                    <a href="mailto:info@example.com">info@example.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Image width={170} height={220} src="/assets/img/home7/vector/home7-banner-bottom-vector1.svg" alt="" className="vector1" />
                <Image width={110} height={220} src="/assets/img/home7/vector/home7-banner-bottom-vector2.svg" alt="" className="vector2" />
            </div>
        </>
    )
}

export default HeroV7
