"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";

const DestinationLocationSlide = () => {
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
                nextEl: ".location-slider-next",
                prevEl: ".location-slider-prev",
            },
            breakpoints: {
                280: {
                    slidesPerView: 1,
                },
                386: {
                    slidesPerView: 1,
                },
                576: {
                    slidesPerView: 3,
                    spaceBetween: 15,
                },
                768: {
                    slidesPerView: 4,
                },
                992: {
                    slidesPerView: 5,
                    spaceBetween: 15,
                },
                1200: {
                    slidesPerView: 6,
                    spaceBetween: 15,
                },
                1400: {
                    slidesPerView: 6,
                },
            },
        };
    }, []);
    return (
        <div className="destination-details-section mb-100">
            <div className="container">
                <div className="row justify-content-center mb-60 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
                    <div className="col-lg-10">
                        <div className="destination-details-content">
                            <h2>Paris, France</h2>
                            <ul className="destination-info">
                                <li>
                                    <div className="content">
                                        <span>Capital -</span> Paris
                                    </div>
                                </li>
                                <li>
                                    <div className="content">
                                        <span>Currency -</span> Euro
                                    </div>
                                    <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path d="M12.1104 11.0844C11.2834 11.9542 10.2246 12.4334 9.12899 12.4334C7.33326 12.4334 5.77841 11.1723 5.04665 9.34944H10.0346C10.4671 9.34944 10.8178 8.99876 10.8178 8.56624C10.8178 8.13371 10.4671 7.78304 10.0346 7.78304H4.64864C4.61714 7.52315 4.60124 7.2616 4.60102 6.99981C4.60102 6.69979 4.62215 6.40569 4.66155 6.11868H10.0346C10.4671 6.11868 10.8178 5.768 10.8178 5.33548C10.8178 4.90296 10.4671 4.55225 10.0346 4.55225H5.08831C5.83577 2.78275 7.36577 1.56625 9.12899 1.56625C10.2246 1.56625 11.2834 2.04543 12.1104 2.9152C12.4081 3.22851 12.9036 3.24138 13.2175 2.9434C13.5311 2.6453 13.5435 2.14956 13.2459 1.83609C12.1204 0.652067 10.6583 1.52588e-05 9.12918 1.52588e-05C6.51813 1.52588e-05 4.28619 1.89639 3.42007 4.55247H1.32129C0.888763 4.55247 0.538086 4.90315 0.538086 5.33568C0.538086 5.7682 0.888763 6.11888 1.32129 6.11888H3.08447C3.05274 6.40789 3.03459 6.70141 3.03459 7C3.03459 7.26501 3.04843 7.52585 3.07376 7.78323H1.32129C0.888763 7.78323 0.538086 8.13391 0.538086 8.56643C0.538086 8.99895 0.888763 9.34963 1.32129 9.34963H3.38899C4.23148 12.0571 6.48597 14 9.12899 14C10.6583 14 12.12 13.3478 13.2455 12.1639C13.5433 11.8504 13.5311 11.3547 13.2174 11.0566C12.904 10.7585 12.4081 10.771 12.1104 11.0844Z" />
                                        </g>
                                    </svg>
                                </li>
                                <li>
                                    <div className="content">
                                        <span>Language -</span> française
                                    </div>
                                    <div className="info">
                                        <svg width={12} height={12} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                            <g>
                                                <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                            </g>
                                        </svg>
                                        <div className="tooltip-text">English is widely spoken in tourist areas.</div>
                                    </div>
                                </li>
                            </ul>
                            <p>Paris, known as the <span>"City of Light"</span> (La Ville Lumière), is the capital of France and one of the most romantic and iconic cities in the world. Known for its timeless architecture, world-class museums, charming streets, rich history, and exquisite cuisine, Paris is a must-visit destination for travelers from around the globe. Globally recognized as a fashion capital, Paris is the birthplace of haute couture and luxury brands like Chanel, Louis Vuitton, and Dior.</p>
                            <a href="#" className="primary-btn1 two transparent" id="scroll-btn">
                                <span>
                                    Best Time to Visit
                                    <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                                    </svg>
                                </span>
                                <span>
                                    Best Time to Visit
                                    <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="location-slider-wrap">
                    <h4>Popular Tourist Place</h4>
                    <div className="location-slider-area">
                        <Swiper {...settings} modules={[Navigation,Autoplay]} className="swiper destination-dt-location-slider">
                            <div className="swiper-wrapper">
                                <SwiperSlide className="swiper-slide">
                                    <div className="location-card">
                                        <div className="location-img">
                                            <Image width={550} height={220} src="/assets/img/innerpages/destination-dt-location-img1.jpg" alt="" />
                                            <button className="img-album-btn">
                                                <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                                    <g>
                                                        <path d="M3.93766 8.00088C4.2858 8.00088 4.61969 7.86258 4.86586 7.61641C5.11203 7.37023 5.25033 7.03635 5.25033 6.68821C5.25033 6.34007 5.11203 6.00619 4.86586 5.76002C4.61969 5.51385 4.2858 5.37555 3.93766 5.37555C3.58952 5.37555 3.25564 5.51385 3.00947 5.76002C2.7633 6.00619 2.625 6.34007 2.625 6.68821C2.625 7.03635 2.7633 7.37023 3.00947 7.61641C3.25564 7.86258 3.58952 8.00088 3.93766 8.00088Z" />
                                                        <path d="M12.2515 11.5013C12.2515 11.9655 12.0671 12.4107 11.7389 12.7389C11.4107 13.0671 10.9655 13.2515 10.5013 13.2515H1.75022C1.28603 13.2515 0.840857 13.0671 0.512627 12.7389C0.184398 12.4107 0 11.9655 0 11.5013V4.50044C-2.31942e-07 4.03655 0.184157 3.59164 0.512008 3.26346C0.83986 2.93528 1.28458 2.75068 1.74847 2.75022C1.74847 2.28603 1.93287 1.84086 2.2611 1.51263C2.58933 1.1844 3.0345 1 3.49869 1H12.2498C12.714 1 13.1591 1.1844 13.4874 1.51263C13.8156 1.84086 14 2.28603 14 2.75022V9.75109C14 10.215 13.8158 10.6599 13.488 10.9881C13.1601 11.3162 12.7154 11.5008 12.2515 11.5013ZM12.2498 1.87511H3.49869C3.26659 1.87511 3.04401 1.96731 2.87989 2.13142C2.71578 2.29554 2.62358 2.51813 2.62358 2.75022H10.5013C10.9655 2.75022 11.4107 2.93462 11.7389 3.26285C12.0671 3.59108 12.2515 4.03625 12.2515 4.50044V10.6262C12.4833 10.6257 12.7055 10.5333 12.8692 10.3693C13.0329 10.2052 13.1249 9.98288 13.1249 9.75109V2.75022C13.1249 2.51813 13.0327 2.29554 12.8686 2.13142C12.7045 1.96731 12.4819 1.87511 12.2498 1.87511ZM1.75022 3.62533C1.51813 3.62533 1.29554 3.71753 1.13142 3.88164C0.967308 4.04576 0.875109 4.26834 0.875109 4.50044V11.5013L3.19065 9.44131C3.26217 9.37004 3.35615 9.3257 3.45663 9.31581C3.55711 9.30593 3.65792 9.33109 3.74197 9.38705L6.06976 10.9386L9.31641 7.69196C9.38131 7.62701 9.46499 7.58411 9.55561 7.56935C9.64623 7.55458 9.7392 7.5687 9.82135 7.6097L11.3764 9.31354V4.50044C11.3764 4.26834 11.2842 4.04576 11.1201 3.88164C10.956 3.71753 10.7334 3.62533 10.5013 3.62533H1.75022Z" />
                                                    </g>
                                                </svg>
                                                3
                                            </button>
                                            <div className="image-album-wrap d-none">
                                                <a href="assets/img/innerpages/destination-dt-location-img1.jpg" data-fancybox="images" />
                                                <a href="assets/img/innerpages/destination-dt-location-img2.jpg" data-fancybox="images" />
                                                <a href="assets/img/innerpages/destination-dt-location-img3.jpg" data-fancybox="images" />
                                            </div>
                                        </div>
                                        <div className="location-content">
                                            <h6><a href="https://www.google.com/maps">Eiffel Tower</a></h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="location-card">
                                        <div className="location-img">
                                            <Image width={550} height={220} src="/assets/img/innerpages/destination-dt-location-img2.jpg" alt="" />
                                        </div>
                                        <div className="location-content">
                                            <h6><a href="https://www.google.com/maps">Loire Valley</a></h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="location-card">
                                        <div className="location-img">
                                            <Image width={550} height={220} src="/assets/img/innerpages/destination-dt-location-img3.jpg" alt="" />
                                            <button className="img-album-btn">
                                                <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                                    <g>
                                                        <path d="M3.93766 8.00088C4.2858 8.00088 4.61969 7.86258 4.86586 7.61641C5.11203 7.37023 5.25033 7.03635 5.25033 6.68821C5.25033 6.34007 5.11203 6.00619 4.86586 5.76002C4.61969 5.51385 4.2858 5.37555 3.93766 5.37555C3.58952 5.37555 3.25564 5.51385 3.00947 5.76002C2.7633 6.00619 2.625 6.34007 2.625 6.68821C2.625 7.03635 2.7633 7.37023 3.00947 7.61641C3.25564 7.86258 3.58952 8.00088 3.93766 8.00088Z" />
                                                        <path d="M12.2515 11.5013C12.2515 11.9655 12.0671 12.4107 11.7389 12.7389C11.4107 13.0671 10.9655 13.2515 10.5013 13.2515H1.75022C1.28603 13.2515 0.840857 13.0671 0.512627 12.7389C0.184398 12.4107 0 11.9655 0 11.5013V4.50044C-2.31942e-07 4.03655 0.184157 3.59164 0.512008 3.26346C0.83986 2.93528 1.28458 2.75068 1.74847 2.75022C1.74847 2.28603 1.93287 1.84086 2.2611 1.51263C2.58933 1.1844 3.0345 1 3.49869 1H12.2498C12.714 1 13.1591 1.1844 13.4874 1.51263C13.8156 1.84086 14 2.28603 14 2.75022V9.75109C14 10.215 13.8158 10.6599 13.488 10.9881C13.1601 11.3162 12.7154 11.5008 12.2515 11.5013ZM12.2498 1.87511H3.49869C3.26659 1.87511 3.04401 1.96731 2.87989 2.13142C2.71578 2.29554 2.62358 2.51813 2.62358 2.75022H10.5013C10.9655 2.75022 11.4107 2.93462 11.7389 3.26285C12.0671 3.59108 12.2515 4.03625 12.2515 4.50044V10.6262C12.4833 10.6257 12.7055 10.5333 12.8692 10.3693C13.0329 10.2052 13.1249 9.98288 13.1249 9.75109V2.75022C13.1249 2.51813 13.0327 2.29554 12.8686 2.13142C12.7045 1.96731 12.4819 1.87511 12.2498 1.87511ZM1.75022 3.62533C1.51813 3.62533 1.29554 3.71753 1.13142 3.88164C0.967308 4.04576 0.875109 4.26834 0.875109 4.50044V11.5013L3.19065 9.44131C3.26217 9.37004 3.35615 9.3257 3.45663 9.31581C3.55711 9.30593 3.65792 9.33109 3.74197 9.38705L6.06976 10.9386L9.31641 7.69196C9.38131 7.62701 9.46499 7.58411 9.55561 7.56935C9.64623 7.55458 9.7392 7.5687 9.82135 7.6097L11.3764 9.31354V4.50044C11.3764 4.26834 11.2842 4.04576 11.1201 3.88164C10.956 3.71753 10.7334 3.62533 10.5013 3.62533H1.75022Z" />
                                                    </g>
                                                </svg>
                                                3
                                            </button>
                                            <div className="image-album-wrap d-none">
                                                <a href="assets/img/innerpages/destination-dt-location-img3.jpg" data-fancybox="images" />
                                                <a href="assets/img/innerpages/destination-dt-location-img2.jpg" data-fancybox="images" />
                                                <a href="assets/img/innerpages/destination-dt-location-img5.jpg" data-fancybox="images" />
                                            </div>
                                        </div>
                                        <div className="location-content">
                                            <h6><a href="https://www.google.com/maps">Southern France</a></h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="location-card">
                                        <div className="location-img">
                                            <Image width={550} height={220} src="/assets/img/innerpages/destination-dt-location-img4.jpg" alt="" />
                                        </div>
                                        <div className="location-content">
                                            <h6><a href="https://www.google.com/maps"> Louvre Museum</a></h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="location-card">
                                        <div className="location-img">
                                            <Image width={550} height={220} src="/assets/img/innerpages/destination-dt-location-img5.jpg" alt="" />
                                        </div>
                                        <div className="location-content">
                                            <h6><a href="https://www.google.com/maps">Notre-Dame Cathedral</a></h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="location-card">
                                        <div className="location-img">
                                            <Image width={550} height={220} src="/assets/img/innerpages/destination-dt-location-img6.jpg" alt="" />
                                            <button className="img-album-btn">
                                                <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                                    <g>
                                                        <path d="M3.93766 8.00088C4.2858 8.00088 4.61969 7.86258 4.86586 7.61641C5.11203 7.37023 5.25033 7.03635 5.25033 6.68821C5.25033 6.34007 5.11203 6.00619 4.86586 5.76002C4.61969 5.51385 4.2858 5.37555 3.93766 5.37555C3.58952 5.37555 3.25564 5.51385 3.00947 5.76002C2.7633 6.00619 2.625 6.34007 2.625 6.68821C2.625 7.03635 2.7633 7.37023 3.00947 7.61641C3.25564 7.86258 3.58952 8.00088 3.93766 8.00088Z" />
                                                        <path d="M12.2515 11.5013C12.2515 11.9655 12.0671 12.4107 11.7389 12.7389C11.4107 13.0671 10.9655 13.2515 10.5013 13.2515H1.75022C1.28603 13.2515 0.840857 13.0671 0.512627 12.7389C0.184398 12.4107 0 11.9655 0 11.5013V4.50044C-2.31942e-07 4.03655 0.184157 3.59164 0.512008 3.26346C0.83986 2.93528 1.28458 2.75068 1.74847 2.75022C1.74847 2.28603 1.93287 1.84086 2.2611 1.51263C2.58933 1.1844 3.0345 1 3.49869 1H12.2498C12.714 1 13.1591 1.1844 13.4874 1.51263C13.8156 1.84086 14 2.28603 14 2.75022V9.75109C14 10.215 13.8158 10.6599 13.488 10.9881C13.1601 11.3162 12.7154 11.5008 12.2515 11.5013ZM12.2498 1.87511H3.49869C3.26659 1.87511 3.04401 1.96731 2.87989 2.13142C2.71578 2.29554 2.62358 2.51813 2.62358 2.75022H10.5013C10.9655 2.75022 11.4107 2.93462 11.7389 3.26285C12.0671 3.59108 12.2515 4.03625 12.2515 4.50044V10.6262C12.4833 10.6257 12.7055 10.5333 12.8692 10.3693C13.0329 10.2052 13.1249 9.98288 13.1249 9.75109V2.75022C13.1249 2.51813 13.0327 2.29554 12.8686 2.13142C12.7045 1.96731 12.4819 1.87511 12.2498 1.87511ZM1.75022 3.62533C1.51813 3.62533 1.29554 3.71753 1.13142 3.88164C0.967308 4.04576 0.875109 4.26834 0.875109 4.50044V11.5013L3.19065 9.44131C3.26217 9.37004 3.35615 9.3257 3.45663 9.31581C3.55711 9.30593 3.65792 9.33109 3.74197 9.38705L6.06976 10.9386L9.31641 7.69196C9.38131 7.62701 9.46499 7.58411 9.55561 7.56935C9.64623 7.55458 9.7392 7.5687 9.82135 7.6097L11.3764 9.31354V4.50044C11.3764 4.26834 11.2842 4.04576 11.1201 3.88164C10.956 3.71753 10.7334 3.62533 10.5013 3.62533H1.75022Z" />
                                                    </g>
                                                </svg>
                                                3
                                            </button>
                                            <div className="image-album-wrap d-none">
                                                <a href="assets/img/innerpages/destination-dt-location-img6.jpg" data-fancybox="images" />
                                                <a href="assets/img/innerpages/destination-dt-location-img1.jpg" data-fancybox="images" />
                                                <a href="assets/img/innerpages/destination-dt-location-img4.jpg" data-fancybox="images" />
                                            </div>
                                        </div>
                                        <div className="location-content">
                                            <h6><a href="https://www.google.com/maps">Palace of Versailles</a></h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className="swiper-slide">
                                    <div className="location-card">
                                        <div className="location-img">
                                            <Image width={550} height={220} src="/assets/img/innerpages/destination-dt-location-img7.jpg" alt="" />
                                        </div>
                                        <div className="location-content">
                                            <h6><a href="https://www.google.com/maps">Carcassonne</a></h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </div>
                        </Swiper>
                        <div className="slider-btn-grp two">
                            <div className="slider-btn location-slider-prev">
                                <svg width={12} height={14} viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3125 0.704152C10.4758 0.323658 10.9172 0.147472 11.2979 0.310597C11.6784 0.473872 11.8545 0.915329 11.6914 1.29595C10.8482 3.26297 9.18494 4.61712 7.42871 5.59282C6.36908 6.1815 5.24241 6.64833 4.18848 7.03618C5.31592 7.51881 6.52685 8.12012 7.6416 8.79693C8.54322 9.34436 9.39912 9.95095 10.1025 10.5958C10.7986 11.2338 11.3891 11.9489 11.6982 12.7217C11.852 13.1063 11.6648 13.5425 11.2803 13.6963C10.8957 13.85 10.4595 13.6629 10.3057 13.2784C10.1148 12.8013 9.70522 12.2662 9.08887 11.7012C8.47993 11.1431 7.71047 10.5931 6.8623 10.0782C5.16463 9.04752 3.21635 8.19586 1.76465 7.71196L-0.370117 7.00005L1.76465 6.28814C3.27361 5.78515 5.08312 5.18062 6.7002 4.28228C8.31881 3.38305 9.6556 2.23687 10.3125 0.704152Z" />
                                </svg>
                            </div>
                            <div className="slider-btn location-slider-next">
                                <svg width={12} height={14} viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.719771 13.6962C1.10432 13.85 1.54057 13.6628 1.69438 13.2783C1.88527 12.8012 2.29482 12.2661 2.91118 11.7011C3.52012 11.1429 4.28957 10.593 5.13774 10.0781C6.83541 9.04741 8.78369 8.19576 10.2354 7.71186L12.3702 6.99995L10.2354 6.28803C8.72643 5.78505 6.91691 5.18052 5.29985 4.28218C3.68124 3.38295 2.34442 2.23677 1.68754 0.70405C1.52426 0.323573 1.0828 0.147379 0.702193 0.310495C0.321714 0.473783 0.145522 0.915242 0.308638 1.29585C1.15178 3.26288 2.81511 4.61702 4.57133 5.59272C5.63078 6.1813 6.75681 6.64924 7.81059 7.03706C6.68348 7.5196 5.4728 8.12025 4.35844 8.79682C3.45684 9.34426 2.60092 9.95086 1.89751 10.5957C1.20147 11.2337 0.610934 11.9488 0.301802 12.7216C0.148089 13.1062 0.33524 13.5424 0.719771 13.6962Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DestinationLocationSlide
