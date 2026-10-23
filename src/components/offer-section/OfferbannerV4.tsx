"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { SwiperOptions } from "swiper/types";

interface OfferbannerV4Props {
  agency?: any;
}

const OfferbannerV4: React.FC<OfferbannerV4Props> = ({ agency }) => {
  const settings: SwiperOptions = useMemo(() => {
    return {
      slidesPerView: "auto",
      speed: 1500,
      spaceBetween: 24,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination2",
        clickable: true,
      },
    };
  }, []);

  return (
    <div className="home4-offer-slider-section mb-100">
      <div className="container">
        <div className="row mb-40">
          <div className="col-lg-12">
            <Swiper {...settings} modules={[Pagination, Autoplay]} className="swiper home4-offer-slider">
              <div className="swiper-wrapper">
                <SwiperSlide className="swiper-slide">
                  <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '240px' }}>
                    <img
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
                      alt="Promoción Inmobiliaria"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, rgba(16, 24, 40, 0.92) 0%, rgba(16, 24, 40, 0.4) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '0 40px',
                    }}>
                      <span style={{ color: '#00a884', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                        Servicio Exclusivo a Propietarios
                      </span>
                      <h3 style={{ color: '#ffffff', fontSize: '26px', fontWeight: 800, margin: '0 0 12px 0' }}>
                        ¿Quieres Vender o Rentar tu Inmueble Rápido y Seguro?
                      </h3>
                      <div>
                        <Link href="/contact" className="primary-btn1" style={{ display: 'inline-flex', padding: '10px 22px' }}>
                          <span>Consignar mi Inmueble</span>
                          <span>Consignar mi Inmueble</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide className="swiper-slide">
                  <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '240px' }}>
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                      alt="Crédito Hipotecario"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, rgba(16, 24, 40, 0.92) 0%, rgba(16, 24, 40, 0.4) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '0 40px',
                    }}>
                      <span style={{ color: '#00a884', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                        Asesoría Crediticia sin Costo
                      </span>
                      <h3 style={{ color: '#ffffff', fontSize: '26px', fontWeight: 800, margin: '0 0 12px 0' }}>
                        Te Ayudamos a Tramitar tu Crédito Hipotecario con las Mejores Tasas
                      </h3>
                      <div>
                        <Link href="/contact" className="primary-btn1" style={{ display: 'inline-flex', padding: '10px 22px' }}>
                          <span>Calcular Mi Crédito</span>
                          <span>Calcular Mi Crédito</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </div>
            </Swiper>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center">
            <div className="swiper-pagination2 paginations two" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferbannerV4;
