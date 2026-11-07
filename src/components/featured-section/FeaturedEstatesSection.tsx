"use client";
import React, { useMemo } from 'react';
import Link from 'next/link';
import { PublicEstateItem } from '@/services/publicInmobiliariaService';
import { DEFAULT_REAL_ESTATE_PROPERTIES } from '@/constants/realEstateDefaults';
import AirbnbPropertyCard from '@/components/inmobiliaria/AirbnbPropertyCard';

interface FeaturedEstatesSectionProps {
  featuredEstates?: PublicEstateItem[];
  agency?: any;
}

export const FeaturedEstatesSection: React.FC<FeaturedEstatesSectionProps> = ({
  featuredEstates,
  agency,
}) => {
  const agencyCurrency = agency?.currency || 'USD';
  const sectionTitle = agency?.details?.featured_title || 'Propiedades Destacadas';
  const sectionSubtitle =
    agency?.details?.featured_subtitle ||
    'Conoce nuestra colección más selecta de inmuebles destacados con acabados premium y alta plusvalía.';
  const btnText = agency?.details?.featured_btn_text || 'Ver Todas las Propiedades Destacadas';

  const rawColor = agency?.primary_color || agency?.details?.primary_color;
  const primaryColor = (!rawColor || rawColor.toLowerCase() === '#00a884') ? '#e2b728' : rawColor;
  const secondaryColor = agency?.secondary_color || agency?.details?.secondary_color || '#161a1b';
  const buttonColor = primaryColor;

  // Mostrar hasta 8 propiedades destacadas reales de la agencia
  const displayEstates = useMemo(() => {
    const list = [...(featuredEstates || [])];
    list.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    return list.slice(0, 8);
  }, [featuredEstates]);

  if (displayEstates.length === 0) {
    return null;
  }

  return (
    <div className="home4-featured-section mt-100 mb-100" id="destacadas">
      <div className="container">
        <div
          className="row justify-content-center mb-40 wow animate fadeInDown"
          data-wow-delay="200ms"
          data-wow-duration="1500ms"
        >
          <div className="col-xl-8 col-lg-10">
            <div className="section-title text-center">
              <h2>{sectionTitle}</h2>
              <p>{sectionSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Cuadrícula de 4 columnas y 2 filas (hasta 8 propiedades destacadas) con AirbnbPropertyCard */}
        <div className="row gy-3 gy-sm-4 gx-2 gx-sm-3">
          {displayEstates.map((estate, index) => {
            const firstImg = estate.images?.[0];
            const firstImgUrl = typeof firstImg === 'string' ? firstImg : (firstImg?.url || firstImg?.image_path);
            const rawImg = typeof estate.image === 'string' ? estate.image : firstImgUrl;
            const fallbackImg = rawImg || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80';
            const estateWithFallback: PublicEstateItem = {
              ...estate,
              image: fallbackImg,
              highlight: 1,
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
                    secondaryColor={secondaryColor}
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
              href="/properties?sort=featured"
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

export default FeaturedEstatesSection;

