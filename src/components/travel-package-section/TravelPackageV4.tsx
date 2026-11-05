"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PublicEstateItem } from '@/services/publicInmobiliariaService';
import { DEFAULT_REAL_ESTATE_PROPERTIES } from '@/constants/realEstateDefaults';
import AirbnbPropertyCard from '@/components/inmobiliaria/AirbnbPropertyCard';

interface TravelPackageV4Props {
  featuredEstates?: PublicEstateItem[];
  agency?: any;
}

const OPERATION_TABS = [
  { id: 'all', label: 'Todas las Operaciones' },
  { id: 'sale', label: 'En Venta' },
  { id: 'rent', label: 'En Alquiler / Renta' },
  { id: 'auction', label: 'Remates' },
];

const TravelPackageV4: React.FC<TravelPackageV4Props> = ({ featuredEstates, agency }) => {
  const [selectedOperation, setSelectedOperation] = useState<string>('all');

  const displayEstates = (featuredEstates && featuredEstates.length > 0)
    ? featuredEstates
    : DEFAULT_REAL_ESTATE_PROPERTIES;

  const agencyCurrency = agency?.currency || 'USD';
  const sectionTitle = agency?.details?.featured_title || 'Propiedades por Tipo de Operación';
  const sectionSubtitle = agency?.details?.featured_subtitle || 'Filtra y explora las mejores opciones inmobiliarias en venta, alquiler y remate con total respaldo legal.';
  const btnText = agency?.details?.featured_btn_text || 'Ver Todo el Catálogo de Propiedades';
  const rawColor = agency?.primary_color || agency?.details?.primary_color;
  const primaryColor = (!rawColor || rawColor.toLowerCase() === '#00a884') ? '#e2b728' : rawColor;
  const secondaryColor = agency?.secondary_color || agency?.details?.secondary_color || '#161a1b';
  const buttonColor = primaryColor;

  const filteredEstates = useMemo(() => {
    if (selectedOperation === 'all') return displayEstates;
    return displayEstates.filter((e) => {
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
  }, [displayEstates, selectedOperation]);

  return (
    <div className="home4-travel-package-section mt-100 mb-100" id="destacadas">
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

        {/* Cuadrícula de 4 columnas y 2 filas (8 propiedades) con AirbnbPropertyCard */}
        <div className="row gy-3 gy-sm-4 gx-2 gx-sm-3">
          {filteredEstates.length === 0 ? (
            <div className="col-12 py-12 text-center">
              <div className="max-w-md mx-auto p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-500 mb-3">
                  No hay propiedades registradas en este tipo de operación en este momento.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedOperation('all')}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white"
                  style={{ backgroundColor: buttonColor }}
                >
                  Ver todas las propiedades
                </button>
              </div>
            </div>
          ) : (
            filteredEstates.slice(0, 8).map((estate, index) => {
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
                      secondaryColor={secondaryColor}
                      domainParam={agency?.domain}
                    />
                  </div>
                </div>
              );
            })
          )}
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
