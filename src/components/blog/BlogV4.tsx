"use client";
import React from 'react';
import Link from 'next/link';
import { PublicEstateItem } from '@/services/publicInmobiliariaService';
import { DEFAULT_REAL_ESTATE_PROPERTIES } from '@/constants/realEstateDefaults';
import AirbnbPropertyCard from '@/components/inmobiliaria/AirbnbPropertyCard';

interface BlogV4Props {
  recentEstates?: PublicEstateItem[];
  agency?: any;
}

const BlogV4: React.FC<BlogV4Props> = ({ recentEstates, agency }) => {
  const displayEstates = recentEstates || [];

  if (displayEstates.length === 0) {
    return null;
  }

  const agencyCurrency = agency?.currency || 'USD';
  const sectionTitle = agency?.details?.recent_title || 'Últimas Propiedades Incorporadas';
  const sectionSubtitle = agency?.details?.recent_subtitle || 'Descubre los inmuebles recién listados en nuestro portafolio de venta y renta con alta plusvalía.';
  const btnText = agency?.details?.recent_btn_text || 'Ver Todas las Nuevas Propiedades';
  const rawColor = agency?.primary_color || agency?.details?.primary_color;
  const primaryColor = (!rawColor || rawColor.toLowerCase() === '#00a884') ? '#e2b728' : rawColor;
  const buttonColor = primaryColor;

  return (
    <div className="home4-blog-section mb-100" id="recientes">
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
            const firstImg = estate.images?.[0];
            const firstImgUrl = typeof firstImg === 'string' ? firstImg : (firstImg?.url || firstImg?.image_path);
            const rawImg = typeof estate.image === 'string' ? estate.image : firstImgUrl;
            const fallbackImg = rawImg || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80';
            const estateWithFallback: PublicEstateItem = {
              ...estate,
              image: fallbackImg,
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
              href="/properties?sort=recent"
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

export default BlogV4;
