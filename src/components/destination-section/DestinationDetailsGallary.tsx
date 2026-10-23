"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";
const DestinationDetailsGallary = () => {
    const settings: SwiperOptions = useMemo(() => {
        return {
            slidesPerView: "auto",
            speed: 1500,
            spaceBetween: 10,
            autoplay: {
                delay: 2500, // Autoplay duration in milliseconds
                pauseOnMouseEnter: true,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".destination-dt-gallery-slider-next",
                prevEl: ".destination-dt-gallery-slider-prev",
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
                },
                992: {
                    slidesPerView: 3,
                },
                1200: {
                    slidesPerView: 3,
                },
                1400: {
                    slidesPerView: 3,
                },
            },
        };
    }, []);
    return (
        <div className="destination-details-gallery-section mb-50">
            <Swiper {...settings} modules={[Navigation,Autoplay]} className="swiper destination-details-gallery-slider">
                <div className="swiper-wrapper">
                    <SwiperSlide className="swiper-slide">
                        <Image width={630} height={550} src="/assets/img/innerpages/destination-details-gallery-img1.jpg" alt="" />
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <Image width={630} height={550} src="/assets/img/innerpages/destination-details-gallery-img2.jpg" alt="" />
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <Image width={630} height={550} src="/assets/img/innerpages/destination-details-gallery-img3.jpg" alt="" />
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <Image width={630} height={550} src="/assets/img/innerpages/destination-details-gallery-img4.jpg" alt="" />
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <Image width={630} height={550} src="/assets/img/innerpages/destination-details-gallery-img5.jpg" alt="" />
                    </SwiperSlide>
                </div>
            </Swiper>
            <div className="slider-btn-grp two">
                <div className="slider-btn destination-dt-gallery-slider-prev">
                    <svg width={22} height={22} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 10.0571H22V11.9428H0V10.0571Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.942857 11.9429C5.3768 11.9429 9.00115 8.0432 9.00115 3.88457V2.94171H7.11543V3.88457C7.11543 7.04251 4.29566 10.0571 0.942857 10.0571H0V11.9429H0.942857Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.942857 10.0571C5.3768 10.0571 9.00115 13.9568 9.00115 18.1154V19.0583H7.11543V18.1154C7.11543 14.9587 4.29566 11.9428 0.942857 11.9428H0V10.0571H0.942857Z" />
                        </g>
                    </svg>
                </div>
                <div className="slider-btn destination-dt-gallery-slider-next">
                    <svg width={22} height={22} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path fillRule="evenodd" clipRule="evenodd" d="M22 10.0571H-5.72205e-06V11.9428H22V10.0571Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M21.0571 11.9429C16.6232 11.9429 12.9989 8.0432 12.9989 3.88457V2.94171H14.8846V3.88457C14.8846 7.04251 17.7043 10.0571 21.0571 10.0571H22V11.9429H21.0571Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M21.0571 10.0571C16.6232 10.0571 12.9989 13.9568 12.9989 18.1154V19.0583H14.8846V18.1154C14.8846 14.9587 17.7043 11.9428 21.0571 11.9428H22V10.0571H21.0571Z" />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default DestinationDetailsGallary
