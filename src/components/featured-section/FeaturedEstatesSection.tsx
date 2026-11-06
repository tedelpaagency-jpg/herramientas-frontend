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

  // Garantizar exactamente 8 propiedades destacadas
  const displayEstates = useMemo(() => {
    const list = [...(featuredEstates || [])];

    // Si hay menos de 8 destacadas, complementar con el catálogo predeterminado
    if (list.length < 8) {
      const fallbackList = DEFAULT_REAL_ESTATE_PROPERTIES.map((item, idx) => ({
        ...item,
        id: 70000 + idx,
        highlight: 1,
      }));

      for (const fb of fallbackList) {
        if (list.length >= 8) break;
        if (!list.some(e => e.id === fb.id || e.title === fb.title)) {
          list.push(fb);
        }
      }
    }

    return list.slice(0, 8);
  }, [featuredEstates]);

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

        {/* Cuadrícula de 4 columnas y 2 filas (8 propiedades destacadas) con AirbnbPropertyCard */}
        <div className="row gy-3 gy-sm-4 gx-2 gx-sm-3">
          {displayEstates.map((estate, index) => {
            const fallbackImg =
              DEFAULT_REAL_ESTATE_PROPERTIES[index % DEFAULT_REAL_ESTATE_PROPERTIES.length].image;
            const estateWithFallback = {
              ...estate,
              image: estate.image || fallbackImg,
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
