"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Building2,
  Home,
  DollarSign,
  Bed,
  Maximize2,
  Store,
  Tag,
  KeyRound,
  Landmark,
  Search,
  Briefcase,
} from 'lucide-react';

interface CustomBookingSelectProps {
  label: string;
  name: string;
  defaultValue?: string;
  options: { label: string; value: string }[];
  icon: React.ReactNode;
}

const CustomBookingSelect: React.FC<CustomBookingSelectProps> = ({
  label,
  name,
  defaultValue = '',
  options,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(
    options.find((o) => o.value === defaultValue) || options[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt: { label: string; value: string }) => {
    setSelected(opt);
    setIsOpen(false);
  };

  return (
    <div className="single-search-box" ref={dropdownRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', color: '#00a884' }}>
        {icon}
      </div>
      <div
        className="custom-select-dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ cursor: 'pointer', width: '100%' }}
      >
        <input
          type="text"
          readOnly
          value={selected.label}
          style={{ cursor: 'pointer', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px', width: '100%' }}
        />
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>{label}</span>
      </div>
      <input type="hidden" name={name} value={selected.value} />

      <div
        className={`custom-select-wrap two ${isOpen ? 'active' : ''}`}
        style={{
          position: 'absolute',
          top: isOpen ? 'calc(100% + 12px)' : '100%',
          left: 0,
          minWidth: '220px',
          background: '#ffffff',
          boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
          borderRadius: '14px',
          zIndex: 9999,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'all 0.25s ease',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <ul className="option-list" style={{ padding: '6px 0', margin: 0, listStyle: 'none', maxHeight: '240px', overflowY: 'auto' }}>
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`single-item ${selected.value === opt.value ? 'selected' : ''}`}
              onClick={() => handleSelect(opt)}
              style={{
                padding: '9px 16px',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                backgroundColor: selected.value === opt.value ? '#f0fdf4' : 'transparent',
              }}
            >
              <h6 style={{ margin: 0, fontSize: '13px', fontWeight: selected.value === opt.value ? 800 : 600, color: selected.value === opt.value ? '#00a884' : '#1e293b' }}>
                {opt.label}
              </h6>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface HeroV4Props {
  agency?: any;
}

const HeroV4: React.FC<HeroV4Props> = ({ agency }) => {
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'land' | 'commercial'>('sale');

  const heroTitle = agency?.hero_title || agency?.details?.hero_title || 'Encuentra la Propiedad de tus Sueños';
  const heroSubtitle = agency?.hero_subtitle || agency?.details?.hero_subtitle || 'Las mejores opciones en venta y renta con asesoría jurídica, notarial y crediticia garantizada.';
  const bannerImage = agency?.banner_image;

  const tab1 = agency?.details?.hero_tab1 || 'En Venta';
  const tab2 = agency?.details?.hero_tab2 || 'En Renta';
  const tab3 = agency?.details?.hero_tab3 || 'Terrenos & Lotes';
  const tab4 = agency?.details?.hero_tab4 || 'Comercial';
  const searchBtnText = agency?.details?.hero_search_btn || 'BUSCAR';

  return (
    <div className="home4-banner-section mb-100">
      <div className="banner-video-area" style={bannerImage ? {
        backgroundImage: `linear-gradient(rgba(10, 15, 29, 0.55), rgba(10, 15, 29, 0.7)), url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}>
        {!bannerImage && (
          <video autoPlay loop muted playsInline src="/assets/video/home4-banner-video.mp4" />
        )}
      </div>

      <div className="banner-content-wrap">
        <div className="container">
          <div className="banner-content">
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>

            <div className="filter-wrapper">
              <style jsx>{`
                .hero-booking-tabs::-webkit-scrollbar {
                  display: none;
                }
                @media (max-width: 576px) {
                  .hero-booking-tabs {
                    margin-left: 10px !important;
                    margin-right: 10px !important;
                    padding-left: 4px;
                    padding-right: 4px;
                  }
                  .hero-booking-tabs .single-item {
                    padding: 8px 14px !important;
                    font-size: 13px !important;
                  }
                }
              `}</style>
              <ul
                className="filter-item-list hero-booking-tabs"
                style={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  gap: '8px',
                  paddingBottom: '8px',
                  marginBottom: '-16px',
                  position: 'relative',
                  zIndex: 10,
                  maxWidth: '100%',
                }}
              >
                <li
                  className={`single-item ${activeTab === 'sale' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sale')}
                  style={{ flexShrink: 0, whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab1}</span>
                </li>

                <li
                  className={`single-item ${activeTab === 'rent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rent')}
                  style={{ flexShrink: 0, whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab2}</span>
                </li>

                <li
                  className={`single-item ${activeTab === 'land' ? 'active' : ''}`}
                  onClick={() => setActiveTab('land')}
                  style={{ flexShrink: 0, whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab3}</span>
                </li>

                <li
                  className={`single-item ${activeTab === 'commercial' ? 'active' : ''}`}
                  onClick={() => setActiveTab('commercial')}
                  style={{ flexShrink: 0, whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab4}</span>
                </li>
              </ul>

              <div className="filter-input-wrap">
                {/* 1. Formulario En Venta */}
                <form action="/properties" method="GET" className={`filter-input ${activeTab === 'sale' ? 'show' : ''}`}>
                  <input type="hidden" name="property_status" value="2" />

                  {/* Ubicación */}
                  <div className="single-search-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', color: '#00a884' }}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Ubicación</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Ciudad, colonia o zona..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px' }}
                      />
                    </div>
                  </div>

                  {/* Tipo de Inmueble Select */}
                  <CustomBookingSelect
                    label="Tipo de Inmueble"
                    name="property_type"
                    icon={<Building2 className="w-5 h-5" />}
                    options={[
                      { label: 'Todas las propiedades', value: '' },
                      { label: 'Casas & Residencias', value: '1' },
                      { label: 'Departamentos & Lofts', value: '2' },
                      { label: 'Terrenos & Lotes', value: '3' },
                      { label: 'Oficinas & Locales', value: '4' },
                      { label: 'Villas & Quintas', value: '5' },
                    ]}
                  />

                  {/* Presupuesto Máximo Select */}
                  <CustomBookingSelect
                    label="Presupuesto Máximo"
                    name="price_max"
                    icon={<DollarSign className="w-5 h-5" />}
                    options={[
                      { label: 'Cualquier precio', value: '' },
                      { label: 'Hasta $150,000 USD', value: '150000' },
                      { label: 'Hasta $300,000 USD', value: '300000' },
                      { label: 'Hasta $500,000 USD', value: '500000' },
                      { label: 'Hasta $1,000,000 USD', value: '1000000' },
                      { label: 'Más de $1,000,000 USD', value: '2000000' },
                    ]}
                  />

                  <button type="submit" className="primary-btn1">
                    <span>
                      <Search className="w-4 h-4 inline mr-1" />
                      {searchBtnText}
                    </span>
                    <span>
                      <Search className="w-4 h-4 inline mr-1" />
                      {searchBtnText}
                    </span>
                  </button>
                </form>

                {/* 2. Formulario En Renta */}
                <form action="/properties" method="GET" className={`filter-input ${activeTab === 'rent' ? 'show' : ''}`}>
                  <input type="hidden" name="property_status" value="1" />

                  {/* Ubicación para Renta */}
                  <div className="single-search-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', color: '#00a884' }}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Ubicación para Renta</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Ciudad o zona de interés..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px' }}
                      />
                    </div>
                  </div>

                  {/* Inmueble en Renta Select */}
                  <CustomBookingSelect
                    label="Inmueble en Renta"
                    name="property_type"
                    icon={<Building2 className="w-5 h-5" />}
                    options={[
                      { label: 'Departamentos y Casas', value: '' },
                      { label: 'Departamentos Amueblados', value: '2' },
                      { label: 'Casas en Privada', value: '1' },
                      { label: 'Oficinas / Locales', value: '4' },
                    ]}
                  />

                  {/* Recámaras Select */}
                  <CustomBookingSelect
                    label="Recámaras"
                    name="bedrooms"
                    icon={<Bed className="w-5 h-5" />}
                    options={[
                      { label: 'Cualquier número', value: '' },
                      { label: '1+ Recámara', value: '1' },
                      { label: '2+ Recámaras', value: '2' },
                      { label: '3+ Recámaras', value: '3' },
                      { label: '4+ Recámaras', value: '4' },
                    ]}
                  />

                  <button type="submit" className="primary-btn1">
                    <span>
                      <Search className="w-4 h-4 inline mr-1" />
                      BUSCAR RENTAS
                    </span>
                    <span>
                      <Search className="w-4 h-4 inline mr-1" />
                      BUSCAR RENTAS
                    </span>
                  </button>
                </form>

                {/* 3. Formulario Terrenos */}
                <form action="/properties" method="GET" className={`filter-input ${activeTab === 'land' ? 'show' : ''}`}>
                  <input type="hidden" name="property_type" value="3" />

                  {/* Ubicación Terreno */}
                  <div className="single-search-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', color: '#00a884' }}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Zona o Municipio</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Ubicación del terreno..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px' }}
                      />
                    </div>
                  </div>

                  {/* Superficie Mínima Select */}
                  <CustomBookingSelect
                    label="Superficie Mínima"
                    name="size_min"
                    icon={<Maximize2 className="w-5 h-5" />}
                    options={[
                      { label: 'Cualquier superficie', value: '' },
                      { label: 'Desde 200 m²', value: '200' },
                      { label: 'Desde 500 m²', value: '500' },
                      { label: 'Desde 1,000 m² (1 Hectárea)', value: '1000' },
                      { label: 'Macro lotes (5,000+ m²)', value: '5000' },
                    ]}
                  />

                  <button type="submit" className="primary-btn1">
                    <span>
                      <Search className="w-4 h-4 inline mr-1" />
                      BUSCAR TERRENOS
                    </span>
                    <span>
                      <Search className="w-4 h-4 inline mr-1" />
                      BUSCAR TERRENOS
                    </span>
                  </button>
                </form>

                {/* 4. Formulario Comercial */}
                <form action="/properties" method="GET" className={`filter-input ${activeTab === 'commercial' ? 'show' : ''}`}>
                  <input type="hidden" name="property_type" value="4" />

                  {/* Ubicación Comercial */}
                  <div className="single-search-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', color: '#00a884' }}>
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Zona Comercial</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Corredor o plaza comercial..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px' }}
                      />
                    </div>
                  </div>

                  {/* Modalidad Select */}
                  <CustomBookingSelect
                    label="Modalidad"
                    name="property_status"
                    icon={<Tag className="w-5 h-5" />}
                    options={[
                      { label: 'En Venta o Renta', value: '' },
                      { label: 'En Venta', value: '2' },
                      { label: 'En Renta', value: '1' },
                    ]}
                  />

                  <button type="submit" className="primary-btn1">
                    <span>
                      <Search className="w-4 h-4 inline mr-1" />
                      BUSCAR LOCALES
                    </span>
                    <span>
                      <Search className="w-4 h-4 inline mr-1" />
                      BUSCAR LOCALES
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroV4;
