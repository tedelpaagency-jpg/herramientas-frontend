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
  const buttonColor = agency?.button_color || agency?.primary_color || agency?.details?.button_color || agency?.details?.primary_color || '#00a884';

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

        <div className="row gy-3 gy-sm-4 gx-2 gx-sm-4">
          {displayEstates.map((estate, index) => {
            const fallbackImg = DEFAULT_REAL_ESTATE_PROPERTIES[index % DEFAULT_REAL_ESTATE_PROPERTIES.length].image;
            const imgSrc: string = estate.image || fallbackImg || '';
            const isRent = Number(estate.property_status) === 2;
            const propertyUrl = `/properties/${estate.slug || estate.id}`;

            return (
              <div
                key={estate.id || index}
                className="col-6 col-md-6 col-lg-4 px-1.5 px-sm-3 mb-2 mb-sm-4 wow animate fadeInDown"
                data-wow-delay={`${(index + 1) * 150}ms`}
                data-wow-duration="1500ms"
              >
                <div
                  className="package-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    className="package-img-wrap"
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '4/3',
                      minHeight: '120px',
                      maxHeight: '230px',
                      overflow: 'hidden',
                    }}
                  >
                    <Link href={propertyUrl} className="package-img" style={{ width: '100%', height: '100%', display: 'block' }}>
                      <img
                        src={imgSrc}
                        alt={estate.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                    <div
                      className="batch"
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: isRent ? '#f97316' : '#2563eb',
                        color: '#ffffff',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      }}
                    >
                      <span>{isRent ? 'En Renta' : 'En Venta'}</span>
                    </div>
                  </div>

                  <div
                    className="package-content"
                    style={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '10px 10px 12px',
                    }}
                  >
                    <div>
                      <h5 style={{ margin: '0 0 4px', fontSize: '13px', lineHeight: '1.25', fontWeight: 700 }}>
                        <Link
                          href={propertyUrl}
                          title={estate.title}
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color: '#0f172a',
                            textDecoration: 'none',
                          }}
                        >
                          {estate.title}
                        </Link>
                      </h5>

                      <div
                        className="location"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          marginBottom: '8px',
                        }}
                      >
                        <svg width={12} height={12} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, fill: '#94a3b8' }}>
                          <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                        </svg>
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#64748b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                        >
                          {estate.city || estate.address || 'Ubicación Exclusiva'}
                        </span>
                      </div>
                    </div>

                    <div>
                      {/* Precio & Botón adaptativo para 2 columnas */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          marginBottom: '8px',
                          paddingTop: '6px',
                          borderTop: '1px solid #f1f5f9',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2px' }}>
                          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                            {isRent ? 'Renta Mensual' : 'Precio de Venta'}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: agency?.primary_color || '#00a884', letterSpacing: '-0.02em' }}>
                            {formatPrice(estate.price, agencyCurrency)}
                          </span>
                        </div>

                        <Link
                          href={propertyUrl}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: '7px 10px',
                            background: agency?.primary_color || '#00a884',
                            color: '#ffffff',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 800,
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                          }}
                        >
                          Ver Propiedad ↗
                        </Link>
                      </div>

                      <div
                        className="bottom-area"
                        style={{
                          borderTop: '1px dashed #e2e8f0',
                          paddingTop: '6px',
                          marginTop: '2px',
                        }}
                      >
                        <ul
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            fontSize: '10px',
                            color: '#64748b',
                            padding: 0,
                            margin: 0,
                            listStyle: 'none',
                            fontWeight: 600,
                          }}
                        >
                          <li style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title="Recámaras">
                            <span>🛏️</span> {estate.bedrooms || 3} Rec.
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title="Baños">
                            <span>🛁</span> {estate.bathrooms || 2} Baños
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title="Metros cuadrados">
                            <span>📐</span> {estate.size || 220} m²
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="row mt-50">
          <div className="col-12 text-center">
            <Link
              href="/properties"
              className="primary-btn1"
              style={{
                display: 'inline-flex',
                backgroundColor: buttonColor,
                borderColor: buttonColor,
                boxShadow: `0 8px 24px ${buttonColor}40`,
              }}
            >
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
