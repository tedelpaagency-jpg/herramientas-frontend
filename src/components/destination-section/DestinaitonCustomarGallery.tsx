"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const DestinaitonCustomarGallery = () => {
    const settings: SwiperOptions = useMemo(() => {
        return {
            slidesPerView: "auto",
            speed: 1500,
            spaceBetween: 30,
            autoplay: {
                delay: 2500, // Autoplay duration in milliseconds
                pauseOnMouseEnter: true,
                disableOnInteraction: false,
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
                    spaceBetween: 15,
                },
                768: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 4,
                    spaceBetween: 15,
                },
                1200: {
                    slidesPerView: 5,
                    spaceBetween: 15,
                },
                1400: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                1600: {
                    slidesPerView: 5,
                    spaceBetween: 24,
                },
            },
        };
    }, []);
    return (
        <div className="destionation-dt-customer-gallery-section mb-100">
            <div className="container-fluid">
                <div className="section-title text-center mb-60 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
                    <h2>Recent Customer Experience</h2>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <Swiper  {...settings} modules={[Navigation,Autoplay]} className="swiper destionation-dt-customer-gallery-slider">
                            <div className="swiper-wrapper">
                                <SwiperSlide className="swiper-slide">
                                    <Image width={340} height={380} src="/assets/img/innerpages/customer-gallery-img1.png" alt="" />
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <Image width={340} height={380} src="/assets/img/innerpages/customer-gallery-img2.png" alt="" />
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <Image width={340} height={380} src="/assets/img/innerpages/customer-gallery-img3.png" alt="" />
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <Image width={340} height={380} src="/assets/img/innerpages/customer-gallery-img4.png" alt="" />
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="video-area">
                                        <video autoPlay loop muted playsInline src="/assets/video/destination-details-video.mp4" />
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <Image width={340} height={380} src="/assets/img/innerpages/customer-gallery-img6.png" alt="" />
                                </SwiperSlide>
                                <div className="swiper-slide">
                                    <Image width={340} height={380} src="/assets/img/innerpages/customer-gallery-img7.png" alt="" />
                                </div>
                            </div>
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DestinaitonCustomarGallery
