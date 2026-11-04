"use client";
import React from 'react';
import Link from 'next/link';
import { PublicEstateItem } from '@/services/publicInmobiliariaService';
import { DEFAULT_REAL_ESTATE_PROPERTIES } from '@/constants/realEstateDefaults';
import AirbnbPropertyCard from '@/components/inmobiliaria/AirbnbPropertyCard';

interface TravelPackageV4Props {
  featuredEstates?: PublicEstateItem[];
  agency?: any;
}

const TravelPackageV4: React.FC<TravelPackageV4Props> = ({ featuredEstates, agency }) => {
  const displayEstates = (featuredEstates && featuredEstates.length > 0)
    ? featuredEstates
    : DEFAULT_REAL_ESTATE_PROPERTIES;

  const agencyCurrency = agency?.currency || 'USD';
  const sectionTitle = agency?.details?.featured_title || 'Propiedades Destacadas';
  const sectionSubtitle = agency?.details?.featured_subtitle || 'Selección curada de inmuebles residenciales y comerciales con alta plusvalía y respaldo legal.';
  const btnText = agency?.details?.featured_btn_text || 'Ver Todo el Catálogo de Propiedades';
  const rawColor = agency?.primary_color || agency?.details?.primary_color;
  const primaryColor = (!rawColor || rawColor.toLowerCase() === '#00a884') ? '#e2b728' : rawColor;
  const buttonColor = primaryColor;

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

        {/* Cuadrícula de 4 columnas y 2 filas (8 propiedades) con AirbnbPropertyCard */}
        <div className="row gy-3 gy-sm-4 gx-2 gx-sm-3">
          {displayEstates.slice(0, 8).map((estate, index) => {
            const fallbackImg = DEFAULT_REAL_ESTATE_PROPERTIES[index % DEFAULT_REAL_ESTATE_PROPERTIES.length].image;
            const estateWithFallback = {
              ...estate,
              image: estate.image || fallbackImg,
            };

            return (
              <div
                key={estate.id || index}
                className="col-6 col-sm-6 col-lg-3 px-1.5 px-sm-2 mb-3 mb-sm-4 wow animate fadeInDown flex"
                data-wow-delay={`${(index % 4) * 100 + 100}ms`}
                data-wow-duration="1200ms"
              >
                <div className="w-full h-full flex flex-col">
                  <AirbnbPropertyCard
                    estate={estateWithFallback}
                    currency={agencyCurrency}
                    primaryColor={primaryColor}
                    domainParam={agency?.domain}
                  />
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
