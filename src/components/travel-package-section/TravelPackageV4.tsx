"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PublicEstateItem } from '@/services/publicInmobiliariaService';
import { DEFAULT_REAL_ESTATE_PROPERTIES } from '@/constants/realEstateDefaults';
import AirbnbPropertyCard from '@/components/inmobiliaria/AirbnbPropertyCard';

interface TravelPackageV4Props {
  recommendedEstates?: PublicEstateItem[];
  featuredEstates?: PublicEstateItem[]; // Retrocompatibilidad
  agency?: any;
}

const OPERATION_TABS = [
  { id: 'all', label: 'Todas las Operaciones' },
  { id: 'sale', label: 'En Venta' },
  { id: 'rent', label: 'En Alquiler / Renta' },
  { id: 'auction', label: 'Remates' },
];

const TravelPackageV4: React.FC<TravelPackageV4Props> = ({
  recommendedEstates,
  featuredEstates,
  agency,
}) => {
  const [selectedOperation, setSelectedOperation] = useState<string>('all');

  const incomingEstates = (recommendedEstates && recommendedEstates.length > 0)
    ? recommendedEstates
    : (featuredEstates && featuredEstates.length > 0)
    ? featuredEstates
    : [];

  const agencyCurrency = agency?.currency || 'USD';
  const sectionTitle = agency?.details?.recommended_title || 'Propiedades Recomendadas';
  const sectionSubtitle =
    agency?.details?.recommended_subtitle ||
    'Filtra y explora nuestra mejor selección de propiedades recomendadas en venta, alquiler y remate con alta plusvalía.';
  const btnText = agency?.details?.recommended_btn_text || 'Ver Todas las Propiedades Recomendadas';

  const rawColor = agency?.primary_color || agency?.details?.primary_color;
  const primaryColor = (!rawColor || rawColor.toLowerCase() === '#00a884') ? '#e2b728' : rawColor;
  const secondaryColor = agency?.secondary_color || agency?.details?.secondary_color || '#161a1b';
  const buttonColor = primaryColor;

  // Filtrar hasta 8 resultados reales de la agencia por cada pestaña
  const filteredEstates = useMemo(() => {
    let matches = incomingEstates.filter((e) => {
      if (selectedOperation === 'all') return true;
      const statusNum = Number(e.property_status ?? e.action ?? 0);
      const statusStr = String(e.status_name || e.operation_type || e.action || '').toLowerCase();
      if (selectedOperation === 'sale') {
        return statusNum === 2 || statusStr.includes('venta');
      }
      if (selectedOperation === 'rent') {
        return statusNum === 1 || statusStr.includes('alquiler') || statusStr.includes('renta');
      }
      if (selectedOperation === 'auction') {
        return statusNum === 3 || statusStr.includes('remate');
      }
      return true;
    });

    // Ordenar estrictamente por ID (de mayor a menor)
    matches.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));

    return matches.slice(0, 8);
  }, [incomingEstates, selectedOperation]);

  return (
    <div className="home4-travel-package-section mt-100 mb-100" id="recomendadas">
      <div className="container">
        <div className="row justify-content-center mb-40 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-8 col-lg-10">
            <div className="section-title text-center">
              <h2>{sectionTitle}</h2>
              <p>{sectionSubtitle}</p>
            </div>

            {/* Pestañas de Tipo de Operación */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {OPERATION_TABS.map((tab) => {
                const isActive = selectedOperation === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedOperation(tab.id)}
                    style={{
                      backgroundColor: isActive ? buttonColor : undefined,
                      color: isActive ? '#ffffff' : undefined,
                      borderColor: isActive ? buttonColor : undefined,
                    }}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs border ${
                      isActive
                        ? 'shadow-md scale-105'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cuadrícula de 4 columnas y 2 filas (hasta 8 propiedades por pestaña) con AirbnbPropertyCard */}
        {filteredEstates.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/60 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-500">
              No hay propiedades registradas en esta sección actualmente.
            </p>
          </div>
        ) : (
          <div className="row gy-3 gy-sm-4 gx-2 gx-sm-3">
            {filteredEstates.map((estate, index) => {
              const firstImg = estate.images?.[0];
              const firstImgUrl = typeof firstImg === 'string' ? firstImg : (firstImg?.url || firstImg?.image_path);
              const rawImg = typeof estate.image === 'string' ? estate.image : firstImgUrl;
              const fallbackImg = rawImg || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80';
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
                      secondaryColor={secondaryColor}
                      domainParam={agency?.domain}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
