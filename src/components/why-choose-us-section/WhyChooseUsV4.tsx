"use client";
import Image from 'next/image';
import React from 'react';
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';

interface WhyChooseUsV4Props {
  agency?: any;
}

const WhyChooseUsV4: React.FC<WhyChooseUsV4Props> = ({ agency }) => {
  const agencyPhone = agency?.phone || agency?.whatsapp || '+52 55 1234 5678';

  return (
    <>
      <div className="home4-why-choose-us-section">
        <div className="container">
          <div className="row g-4 justify-content-between align-items-end mb-60 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-xxl-5 col-xl-6 col-lg-7">
              <div className="section-title">
                <h2>¿Por Qué Elegirnos?</h2>
                <p>Protegemos tu patrimonio con los más altos estándares de calidad, certeza jurídica y conocimiento del mercado local.</p>
              </div>
            </div>
            <div className="col-lg-3 d-flex justify-content-lg-end">
              <div className="single-rating" style={{ cursor: 'default' }}>
                <strong>4.9</strong>
                <div className="tripadvisor-rating">
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#161a1b', display: 'block' }}>Calificación Clientes</span>
                  <div className="rating-area" style={{ display: 'flex', gap: '3px', color: '#f59e0b', fontSize: '12px' }}>
                    ★★★★★ (98% recomendación)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="single-feature">
                <div className="icon">
                  <Image width={60} height={60} src="/assets/img/home3/icon/destination-feature-icon1.svg" alt="" />
                </div>
                <h5>Portafolio Verificado</h5>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="400ms" data-wow-duration="1500ms">
              <div className="single-feature">
                <div className="icon">
                  <Image width={60} height={60} src="/assets/img/home3/icon/destination-feature-icon2.svg" alt="" />
                </div>
                <h5>Asistencia Continua 24/7</h5>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="600ms" data-wow-duration="1500ms">
              <div className="single-feature">
                <div className="icon">
                  <Image width={60} height={60} src="/assets/img/home3/icon/destination-feature-icon3.svg" alt="" />
                </div>
                <h5>Certeza Jurídica &amp; Notarial</h5>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="800ms" data-wow-duration="1500ms">
              <div className="single-feature">
                <div className="icon">
                  <Image width={60} height={60} src="/assets/img/home3/icon/destination-feature-icon4.svg" alt="" />
                </div>
                <h5>Experiencia en Mercado Local</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="why-choose-video-area mb-100">
        <div className="container">
          <LightGallery
            selector=".gallery-item"
            speed={500}
            plugins={[lgZoom, lgVideo]}
            elementClassNames="why-choose-video-wrap"
          >
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
              alt="Video Inmobiliario"
              style={{ width: '100%', height: '480px', objectFit: 'cover', borderRadius: '24px' }}
            />
            <a
              data-fancybox="video-player"
              data-src="https://www.youtube.com/watch?v=u31qwQUeGuM"
              style={{ cursor: "pointer" }}
              className="play-btn gallery-item"
            >
              <i className="bi bi-play-fill" />
              <div className="waves-block">
                <div className="waves wave-1" />
                <div className="waves wave-2" />
                <div className="waves wave-3" />
              </div>
            </a>
            <div className="contact-wrap">
              <div className="contact-area">
                <h6>¿Tienes dudas sobre una propiedad o deseas agendar una visita guiada?</h6>
                <div className="single-contact">
                  <div className="icon">
                    <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5646 11.7424L13.3317 9.50954C12.5343 8.7121 11.1786 9.03111 10.8596 10.0678C10.6204 10.7855 9.82296 11.1842 9.10526 11.0247C7.51037 10.626 5.35726 8.55261 4.95854 6.87797C4.71931 6.16024 5.19778 5.36279 5.91548 5.12359C6.95216 4.80461 7.27113 3.44895 6.47369 2.65151L4.24084 0.418659C3.60288 -0.139553 2.64595 -0.139553 2.08774 0.418659L0.572591 1.93381C-0.942555 3.5287 0.73208 7.75516 4.48007 11.5032C8.22807 15.2512 12.4545 17.0056 14.0494 15.4106L15.5646 13.8955C16.1228 13.2575 16.1228 12.3006 15.5646 11.7424Z" fill="white" />
                    </svg>
                  </div>
                  <div className="content">
                    <span>Línea Directa:</span>
                    <a href={`tel:${agencyPhone.replace(/\s+/g, '')}`}>{agencyPhone}</a>
                  </div>
                </div>
              </div>
            </div>
          </LightGallery>
        </div>
      </div>
    </>
  );
};

export default WhyChooseUsV4;
