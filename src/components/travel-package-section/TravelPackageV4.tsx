"use client";
import React from 'react';
import Link from 'next/link';
import { PublicEstateItem } from '@/services/publicInmobiliariaService';
import { DEFAULT_REAL_ESTATE_PROPERTIES } from '@/constants/realEstateDefaults';

interface TravelPackageV4Props {
  featuredEstates?: PublicEstateItem[];
  agency?: any;
}

const formatPrice = (price: number, currency: string = 'USD'): string => {
  if (!price && price !== 0) return '$0 USD';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};

const TravelPackageV4: React.FC<TravelPackageV4Props> = ({ featuredEstates, agency }) => {
  const displayEstates = (featuredEstates && featuredEstates.length > 0)
    ? featuredEstates
    : DEFAULT_REAL_ESTATE_PROPERTIES;

  const agencyCurrency = agency?.currency || 'USD';
  const sectionTitle = agency?.details?.featured_title || 'Propiedades Destacadas';
  const sectionSubtitle = agency?.details?.featured_subtitle || 'Selección curada de inmuebles residenciales y comerciales con alta plusvalía y respaldo legal.';
  const btnText = agency?.details?.featured_btn_text || 'Ver Todo el Catálogo de Propiedades';

  return (
    <div className="home4-travel-package-section mt-100 mb-100" id="destacadas">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2>{sectionTitle}</h2>
              <p>{sectionSubtitle}</p>
            </div>
          </div>
        </div>

        <div className="row gy-lg-5 gy-4">
          {displayEstates.map((estate, index) => {
            const fallbackImg = DEFAULT_REAL_ESTATE_PROPERTIES[index % DEFAULT_REAL_ESTATE_PROPERTIES.length].image;
            const imgSrc: string = estate.image || fallbackImg || '';
            const isRent = Number(estate.property_status) === 2;
            const propertyUrl = `/properties/${estate.slug || estate.id}`;

            return (
              <div key={estate.id || index} className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay={`${(index + 1) * 150}ms`} data-wow-duration="1500ms">
                <div className="package-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="package-img-wrap" style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                    <Link href={propertyUrl} className="package-img" style={{ width: '100%', height: '100%' }}>
                      <img
                        src={imgSrc}
                        alt={estate.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                    <div className="batch">
                      <span>{isRent ? 'En Renta' : 'En Venta'}</span>
                    </div>
                  </div>

                  <div className="package-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
                    <h5>
                      <Link href={propertyUrl} title={estate.title} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {estate.title}
                      </Link>
                    </h5>

                    <div className="location-and-time">
                      <div className="location">
                        <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                        </svg>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                          {estate.city || estate.address || 'Ubicación Exclusiva'}
                        </span>
                      </div>
                    </div>

                    <div className="btn-and-price-area">
                      <Link href={propertyUrl} className="primary-btn1">
                        <span>
                          Ver Detalles
                          <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </span>
                        <span>
                          Ver Detalles
                          <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </span>
                      </Link>

                      <div className="price-area">
                        <h6>{isRent ? 'Renta Mensual' : 'Precio de Venta'}</h6>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#00a884' }}>
                          {formatPrice(estate.price, agencyCurrency)}
                        </span>
                      </div>
                    </div>

                    <svg className="divider" height={6} viewBox="0 0 374 6" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', margin: '14px 0' }}>
                      <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM369 3.5L374 5.88675V0.113249L369 2.5V3.5ZM4.5 3.5H369.5V2.5H4.5V3.5Z" />
                    </svg>

                    <div className="bottom-area" style={{ marginTop: 'auto' }}>
                      <ul style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '13px', color: '#64748b' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <strong>🛏️</strong> {estate.bedrooms || 3} Rec.
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <strong>🛁</strong> {estate.bathrooms || 2} Baños
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <strong>📐</strong> {estate.size || 220} m²
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="row mt-50">
          <div className="col-12 text-center">
            <Link href="/properties" className="primary-btn1 black-bg" style={{ display: 'inline-flex' }}>
              <span>{btnText}</span>
              <span>{btnText}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPackageV4;
