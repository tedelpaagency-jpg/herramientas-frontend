import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface AboutV4Props {
  agency?: any;
}

const AboutV4: React.FC<AboutV4Props> = ({ agency }) => {
  const aboutTitle = agency?.about_title || 'Somos Tu Aliado Inmobiliario de Confianza';
  const aboutText = agency?.about_text || 'Especialistas en la comercialización, compra, venta y arrendamiento de bienes raíces exclusivos. Acompañamos a nuestros clientes en cada etapa del proceso con transparencia, certeza jurídica y un servicio de excelencia personalizada.';

  return (
    <div className="home4-about-section mb-100" id="nosotros">
      <div className="container">
        <div className="about-wrapper">
          <div className="row justify-content-between align-items-center">
            <div className="col-xl-5 col-lg-6 wow animate fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="about-content">
                <div className="section-title">
                  <h2>{aboutTitle}</h2>
                  <p>{aboutText}</p>
                </div>
                <ul>
                  <li>
                    <svg width={18} height={18} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.24999 16.2334C6.18965 16.2334 6.13035 16.2177 6.07799 16.1877C6.02563 16.1577 5.98201 16.1146 5.95146 16.0625C4.65758 13.8582 1.20971 9.16675 1.17503 9.1196C1.12576 9.05264 1.10224 8.97019 1.10876 8.88731C1.11528 8.80444 1.15141 8.72668 1.21054 8.66825L2.2704 7.62096C2.32798 7.56406 2.40368 7.52914 2.48433 7.52227C2.56499 7.51541 2.64551 7.53702 2.71188 7.58337L6.17781 10.0035C8.48209 7.04337 10.6235 5.00047 12.0309 3.79676C13.6085 2.44735 14.6115 1.84099 14.6535 1.81572C14.7073 1.78342 14.7688 1.76636 14.8316 1.76636H16.5462C16.6163 1.76635 16.6849 1.78767 16.7426 1.82749C16.8004 1.86731 16.8447 1.92376 16.8697 1.98934C16.8947 2.05493 16.8991 2.12656 16.8825 2.19473C16.8658 2.2629 16.8288 2.32439 16.7764 2.37105C14.2345 4.6349 11.5919 8.23189 9.82257 10.8506C7.89924 13.6972 6.56405 16.0353 6.55079 16.0586C6.52074 16.1114 6.47733 16.1553 6.42494 16.186C6.37254 16.2167 6.31299 16.233 6.25227 16.2334L6.24999 16.2334Z" fill="#00a884" />
                    </svg>
                    Propiedades 100% Verificadas Jurídicamente
                  </li>
                  <li>
                    <svg width={18} height={18} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.24999 16.2334C6.18965 16.2334 6.13035 16.2177 6.07799 16.1877C6.02563 16.1577 5.98201 16.1146 5.95146 16.0625C4.65758 13.8582 1.20971 9.16675 1.17503 9.1196C1.12576 9.05264 1.10224 8.97019 1.10876 8.88731C1.11528 8.80444 1.15141 8.72668 1.21054 8.66825L2.2704 7.62096C2.32798 7.56406 2.40368 7.52914 2.48433 7.52227C2.56499 7.51541 2.64551 7.53702 2.71188 7.58337L6.17781 10.0035C8.48209 7.04337 10.6235 5.00047 12.0309 3.79676C13.6085 2.44735 14.6115 1.84099 14.6535 1.81572C14.7073 1.78342 14.7688 1.76636 14.8316 1.76636H16.5462C16.6163 1.76635 16.6849 1.78767 16.7426 1.82749C16.8004 1.86731 16.8447 1.92376 16.8697 1.98934C16.8947 2.05493 16.8991 2.12656 16.8825 2.19473C16.8658 2.2629 16.8288 2.32439 16.7764 2.37105C14.2345 4.6349 11.5919 8.23189 9.82257 10.8506C7.89924 13.6972 6.56405 16.0353 6.55079 16.0586C6.52074 16.1114 6.47733 16.1553 6.42494 16.186C6.37254 16.2167 6.31299 16.233 6.25227 16.2334L6.24999 16.2334Z" fill="#00a884" />
                    </svg>
                    Asesoría en Créditos Hipotecarios &amp; Notariales
                  </li>
                  <li>
                    <svg width={18} height={18} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.24999 16.2334C6.18965 16.2334 6.13035 16.2177 6.07799 16.1877C6.02563 16.1577 5.98201 16.1146 5.95146 16.0625C4.65758 13.8582 1.20971 9.16675 1.17503 9.1196C1.12576 9.05264 1.10224 8.97019 1.10876 8.88731C1.11528 8.80444 1.15141 8.72668 1.21054 8.66825L2.2704 7.62096C2.32798 7.56406 2.40368 7.52914 2.48433 7.52227C2.56499 7.51541 2.64551 7.53702 2.71188 7.58337L6.17781 10.0035C8.48209 7.04337 10.6235 5.00047 12.0309 3.79676C13.6085 2.44735 14.6115 1.84099 14.6535 1.81572C14.7073 1.78342 14.7688 1.76636 14.8316 1.76636H16.5462C16.6163 1.76635 16.6849 1.78767 16.7426 1.82749C16.8004 1.86731 16.8447 1.92376 16.8697 1.98934C16.8947 2.05493 16.8991 2.12656 16.8825 2.19473C16.8658 2.2629 16.8288 2.32439 16.7764 2.37105C14.2345 4.6349 11.5919 8.23189 9.82257 10.8506C7.89924 13.6972 6.56405 16.0353 6.55079 16.0586C6.52074 16.1114 6.47733 16.1553 6.42494 16.186C6.37254 16.2167 6.31299 16.233 6.25227 16.2334L6.24999 16.2334Z" fill="#00a884" />
                    </svg>
                    Acompañamiento Personalizado de Principio a Fin
                  </li>
                </ul>

                <div className="counter-wrapper">
                  <div className="single-counter">
                    <h2><strong className="counter">15</strong><sup>+</sup></h2>
                    <span>Años de <br /> Trayectoria</span>
                  </div>
                  <div className="counter-area">
                    <ul className="counter-img-grp">
                      <li><Image width={50} height={50} src="/assets/img/home3/counter-people-img1.png" alt="" /></li>
                      <li><Image width={50} height={50} src="/assets/img/home3/counter-people-img2.png" alt="" /></li>
                      <li><Image width={50} height={50} src="/assets/img/home3/counter-people-img3.png" alt="" /></li>
                      <li><Image width={50} height={50} src="/assets/img/home3/counter-people-img4.png" alt="" /></li>
                    </ul>
                    <h6> <strong><span className="counter">3,500</span>+</strong> Clientes <br /> Satisfechos</h6>
                  </div>
                </div>

                <svg className="divider" width={536} height={6} viewBox="0 0 536 6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM531 3.5L536 5.88675V0.113249L531 2.5V3.5ZM4.5 3.5H531.5V2.5H4.5V3.5Z" />
                </svg>

                <div className="btn-area">
                  <Link href="/contact" className="about-btn">
                    Contactar a un Asesor
                    <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6 d-lg-flex d-none justify-content-lg-end wow animate fadeInRight" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="about-img-grp">
                <div className="single-grp">
                  <div className="counter-wrapper">
                    <div className="counter-area">
                      <h2><strong>1,200</strong>+</h2>
                      <span>Inmuebles Vendidos</span>
                    </div>
                  </div>
                  <div className="single-img" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
                      alt="Cierre de compraventa"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>

                <div className="single-grp">
                  <div className="single-img two" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                      alt="Asesor inmobiliario"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="single-img three" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <img
                      src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
                      alt="Interior de lujo"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutV4;
