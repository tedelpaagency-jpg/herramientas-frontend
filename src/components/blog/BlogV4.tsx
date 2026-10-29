"use client";
import React from 'react';
import Link from 'next/link';
import { PublicEstateItem } from '@/services/publicInmobiliariaService';

interface BlogV4Props {
  recentEstates?: PublicEstateItem[];
  agency?: any;
}

const DEFAULT_ARTICLES = [
  {
    id: 1,
    title: '5 Claves Fundamentales antes de Adquirir tu Primera Vivienda',
    summary: 'Aprende a evaluar plusvalía, créditos hipotecarios y certeza legal para una inversión segura.',
    date: '24 Octubre, 2026',
    category: 'Guía del Comprador',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=80',
    link: '/properties',
  },
  {
    id: 2,
    title: 'Tendencias Inmobiliarias: Por qué los Desarrollos Verticales son el Futuro',
    summary: 'La vida en condominios con amenidades integradas maximiza el tiempo y calidad de vida.',
    date: '18 Octubre, 2026',
    category: 'Inversión & Plusvalía',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80',
    link: '/properties',
  },
  {
    id: 3,
    title: 'Cómo Preparar tu Propiedad para Venderla al Máximo Valor de Mercado',
    summary: 'Home staging, reparaciones clave y estrategia digital para un cierre rápido y rentable.',
    date: '12 Octubre, 2026',
    category: 'Consejos para Propietarios',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80',
    link: '/properties',
  },
];

const BlogV4: React.FC<BlogV4Props> = ({ recentEstates, agency }) => {
  const rawColor = agency?.primary_color || agency?.details?.primary_color;
  const primaryColor = (!rawColor || rawColor.toLowerCase() === '#00a884') ? '#e2b728' : rawColor;
  const hasRecentEstates = recentEstates && recentEstates.length > 0;

  return (
    <div className="home4-blog-section mb-100">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2>{hasRecentEstates ? 'Nuevas Propiedades en el Mercado' : 'Guías & Artículos Inmobiliarios'}</h2>
              <p>
                {hasRecentEstates
                  ? 'Inmuebles recién incorporados a nuestro portafolio de venta y renta.'
                  : 'Consejos de expertos, análisis de mercado y tendencias para tomar las mejores decisiones patrimoniales.'}
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-40">
          {hasRecentEstates ? (
            recentEstates.slice(0, 3).map((estate, index) => (
              <div key={estate.id || index} className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay={`${(index + 1) * 200}ms`} data-wow-duration="1500ms">
                <div className="blog-card2 two" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="blog-img-wrap" style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <Link href={`/properties/${estate.slug || estate.id}`} className="blog-img" style={{ width: '100%', height: '100%' }}>
                      <img
                        src={estate.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                        alt={estate.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                    <span className="location" style={{ fontSize: '11px', fontWeight: 600 }}>
                      {estate.city || 'Ubicación Premium'}
                    </span>
                  </div>
                  <div className="blog-content" style={{ flexGrow: 1 }}>
                    <span className="blog-date" style={{ color: primaryColor, fontWeight: 700 }}>
                      {estate.property_status === 2 ? 'En Renta' : 'En Venta'}
                    </span>
                    <h4>
                      <Link href={`/properties/${estate.slug || estate.id}`}>
                        {estate.title}
                      </Link>
                    </h4>
                    <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {estate.short_description || estate.description || 'Excelente oportunidad patrimonial con alta plusvalía y ubicación estratégica.'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            DEFAULT_ARTICLES.map((article, index) => (
              <div key={article.id} className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay={`${(index + 1) * 200}ms`} data-wow-duration="1500ms">
                <div className="blog-card2 two" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="blog-img-wrap" style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <Link href={article.link} className="blog-img" style={{ width: '100%', height: '100%' }}>
                      <img
                        src={article.image}
                        alt={article.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                    <span className="location" style={{ fontSize: '11px', fontWeight: 600 }}>
                      {article.category}
                    </span>
                  </div>
                  <div className="blog-content" style={{ flexGrow: 1 }}>
                    <span className="blog-date">
                      {article.date}
                    </span>
                    <h4>
                      <Link href={article.link}>
                        {article.title}
                      </Link>
                    </h4>
                    <p>
                      {article.summary}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogV4;


