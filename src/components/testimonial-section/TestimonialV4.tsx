"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";

const TestimonialV4 = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  return (
    <div className="home4-testimonial-section mb-100">
      <div className="container">
        <div className="testimonial-wrap">
          <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-xl-6 col-lg-8">
              <div className="section-title text-center">
                <h2>Hear It from Travelers</h2>
                <p>We go beyond just booking trips—we create unforgettable travel experiences that match your dreams!</p>
              </div>
            </div>
          </div>
          <div className="testimonial-slider-area mb-40">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <Swiper slidesPerView={1}
                  speed={1500}
                  spaceBetween={24}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  navigation={{
                    nextEl: ".testimonial-slider-next",
                    prevEl: ".testimonial-slider-prev",
                  }}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Autoplay, EffectFade, Navigation, Thumbs]}
                  className="swiper home4-testimonial-slider">
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
                        <h5>¡Excelente Asesoría y Seguridad Legal!</h5>
                        <p>«Encontramos nuestra casa soñada en tiempo récord. El equipo nos brindó asesoría notarial y fiscal impecable en todo momento. Proceso transparente y sin sorpresas.»</p>
                        <div className="author-area">
                          <div className="author-info">
                            <h5>Familia Mendoza R.</h5>
                            <span>Compradores Residenciales</span>
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
                        <h5>Venta Rápida al Mejor Precio</h5>
                        <p>«Consigné mi departamento con ellos y lo promovieron de forma extraordinaria. Se vendió en menos de 45 días a un valor muy favorable. Gran profesionalismo.»</p>
                        <div className="author-area">
                          <div className="author-info">
                            <h5>Ing. Carlos Valenzuela</h5>
                            <span>Propietario Inversionista</span>
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
                        <h5>Atención Impecable en Renta</h5>
                        <p>«Buscábamos oficinas corporativas para nuestra empresa y nos presentaron alternativas perfectas. Negociaron un excelente contrato de arrendamiento.»</p>
                        <div className="author-area">
                          <div className="author-info">
                            <h5>Lic. Sofía Arteaga</h5>
                            <span>Directora Comercial</span>
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
                          <li><i className="bi bi-circle-half" /></li>
                        </ul>
                        <h5>Gestión Notarial y Crédito Ágil</h5>
                        <p>«Nos apoyaron con todo el trámite del crédito hipotecario bancario y la notaría. Hicieron que un proceso complejo fuera sumamente sencillo y seguro.»</p>
                        <div className="author-area">
                          <div className="author-info">
                            <h5>Arq. Roberto Garza</h5>
                            <span>Cliente Patrimonial</span>
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
                          <div className="author-info">
                            <h5>Selina Henry</h5>
                            <span>GoFly Traveler</span>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  </div>
                </Swiper>
              </div>
            </div>
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
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Swiper onSwiper={setThumbsSwiper}
                spaceBetween={15}
                slidesPerView={5}
                watchSlidesProgress={true}
                modules={[Thumbs]}
                className="swiper home4-testimonial-img-slider">
                <div className="swiper-wrapper">
                  <SwiperSlide className="swiper-slide">
                    <div className="testimonial-author-img">
                      <Image width={550} height={220} src="/assets/img/home4/testimonial-author-img1.png" alt="" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="testimonial-author-img">
                      <Image width={550} height={220} src="/assets/img/home4/testimonial-author-img2.png" alt="" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="testimonial-author-img">
                      <Image width={550} height={220} src="/assets/img/home4/testimonial-author-img3.png" alt="" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="testimonial-author-img">
                      <Image width={550} height={220} src="/assets/img/home4/testimonial-author-img4.png" alt="" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="testimonial-author-img">
                      <Image width={550} height={220} src="/assets/img/home4/testimonial-author-img5.png" alt="" />
                    </div>
                  </SwiperSlide>
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      <Image width={300} height={600} src="/assets/img/home4/vector/home4-testimonial-vector.png" alt="" className="vector" />
    </div>
  )
}

export default TestimonialV4
