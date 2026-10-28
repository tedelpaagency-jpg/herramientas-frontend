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
  Trees,
  Map,
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
        <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>{label}</span>
        <input
          type="text"
          readOnly
          value={selected.label}
          style={{ cursor: 'pointer', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, color: '#0f172a', fontSize: '13.5px', width: '100%', padding: 0, marginTop: '2px', lineHeight: 1.2 }}
        />
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
  const primaryColor = agency?.primary_color || '#00a884';
  const buttonColor = agency?.button_color || primaryColor;

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
              <style jsx global>{`
                .hero-booking-tabs {
                  display: flex !important;
                  flex-wrap: nowrap !important;
                  overflow-x: auto !important;
                  overflow-y: hidden !important;
                  -webkit-overflow-scrolling: touch !important;
                  gap: 8px !important;
                  padding: 4px 4px 10px 4px !important;
                  margin-bottom: -18px !important;
                  margin-left: 20px !important;
                  margin-right: 20px !important;
                  scrollbar-width: none !important;
                  position: relative !important;
                  z-index: 10 !important;
                }
                .hero-booking-tabs::-webkit-scrollbar {
                  display: none !important;
                }
                .hero-tab-pill {
                  display: inline-flex !important;
                  flex-direction: row !important;
                  align-items: center !important;
                  justify-content: center !important;
                  gap: 8px !important;
                  padding: 8px 18px !important;
                  border-radius: 9999px !important;
                  font-size: 13.5px !important;
                  font-weight: 700 !important;
                  white-space: nowrap !important;
                  flex-shrink: 0 !important;
                  cursor: pointer !important;
                  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
                  border: 1px solid rgba(226, 232, 240, 0.9) !important;
                  background: rgba(255, 255, 255, 0.96) !important;
                  color: #334155 !important;
                  backdrop-filter: blur(8px) !important;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
                }
                .hero-tab-pill svg {
                  fill: none !important;
                  stroke: currentColor !important;
                  stroke-width: 2.2 !important;
                  transition: transform 0.2s ease !important;
                }
                .hero-tab-pill:hover {
                  transform: translateY(-2px) !important;
                  background: #ffffff !important;
                  color: #0f172a !important;
                  border-color: #cbd5e1 !important;
                  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.09) !important;
                }
                .hero-tab-pill.active {
                  background: ${primaryColor} !important;
                  color: #ffffff !important;
                  border-color: ${primaryColor} !important;
                  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22) !important;
                }
                .hero-tab-pill.active svg {
                  fill: none !important;
                  stroke: #ffffff !important;
                  stroke-width: 2.4 !important;
                }
                @media (max-width: 576px) {
                  .hero-booking-tabs {
                    margin-left: 10px !important;
                    margin-right: 10px !important;
                    gap: 6px !important;
                    padding-bottom: 8px !important;
                    margin-bottom: -16px !important;
                  }
                  .hero-tab-pill {
                    padding: 7px 13px !important;
                    font-size: 12px !important;
                    border-radius: 9999px !important;
                  }
                  .hero-tab-pill svg {
                    width: 15px !important;
                    height: 15px !important;
                  }
                }

                /* Rediseño compacto de los inputs del booking */
                .filter-wrapper .filter-input-wrap {
                  padding: 24px 28px !important;
                  border-radius: 24px !important;
                  background-color: #ffffff !important;
                  box-shadow: 0 20px 45px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04) !important;
                }
                @media (max-width: 767px) {
                  .filter-wrapper .filter-input-wrap {
                    padding: 16px 14px !important;
                    border-radius: 18px !important;
                  }
                }
                .filter-wrapper .filter-input-wrap .filter-input .single-search-box {
                  min-height: 48px !important;
                  height: 48px !important;
                  padding: 4px 14px !important;
                  border-radius: 12px !important;
                  border: 1.5px solid #e2e8f0 !important;
                  background-color: #f8fafc !important;
                  display: flex !important;
                  align-items: center !important;
                  gap: 10px !important;
                  transition: all 0.2s ease !important;
                }
                .filter-wrapper .filter-input-wrap .filter-input .single-search-box:hover,
                .filter-wrapper .filter-input-wrap .filter-input .single-search-box:focus-within {
                  border-color: ${primaryColor} !important;
                  background-color: #ffffff !important;
                  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05) !important;
                }
                .filter-wrapper .filter-input-wrap .filter-input .single-search-box input {
                  font-size: 13.5px !important;
                  font-weight: 700 !important;
                  color: #0f172a !important;
                  padding: 0 !important;
                  line-height: 1.2 !important;
                }
                .filter-wrapper .filter-input-wrap .filter-input .single-search-box span {
                  font-size: 9.5px !important;
                  font-weight: 800 !important;
                  letter-spacing: 0.05em !important;
                  text-transform: uppercase !important;
                  color: #94a3b8 !important;
                  margin-bottom: 1px !important;
                  line-height: 1 !important;
                }
                .filter-wrapper .filter-input-wrap .filter-input .primary-btn1 {
                  min-height: 48px !important;
                  height: 48px !important;
                  padding: 0 24px !important;
                  border-radius: 12px !important;
                  background-color: ${buttonColor} !important;
                  border-color: ${buttonColor} !important;
                  color: #ffffff !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  font-size: 12.5px !important;
                  font-weight: 800 !important;
                  letter-spacing: 0.05em !important;
                }
              `}</style>

              <div className="hero-booking-tabs">
                <div
                  className={`hero-tab-pill ${activeTab === 'sale' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sale')}
                >
                  <Home className="w-4 h-4" />
                  <span>{tab1}</span>
                </div>

                <div
                  className={`hero-tab-pill ${activeTab === 'rent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rent')}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{tab2}</span>
                </div>

                <div
                  className={`hero-tab-pill ${activeTab === 'land' ? 'active' : ''}`}
                  onClick={() => setActiveTab('land')}
                >
                  <Trees className="w-4 h-4" />
                  <span>{tab3}</span>
                </div>

                <div
                  className={`hero-tab-pill ${activeTab === 'commercial' ? 'active' : ''}`}
                  onClick={() => setActiveTab('commercial')}
                >
                  <Building2 className="w-4 h-4" />
                  <span>{tab4}</span>
                </div>
              </div>

              <div className="filter-input-wrap">
                {/* 1. Formulario En Venta */}
                <form action="/properties" method="GET" className={`filter-input ${activeTab === 'sale' ? 'show' : ''}`}>
                  <input type="hidden" name="property_status" value="2" />

                  {/* Ubicación */}
                  <div className="single-search-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', color: '#00a884' }}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>Ubicación</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Ciudad, colonia o zona..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, color: '#0f172a', fontSize: '13.5px', padding: 0, marginTop: '2px', lineHeight: 1.2 }}
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
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>Ubicación para Renta</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Ciudad o zona de interés..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, color: '#0f172a', fontSize: '13.5px', padding: 0, marginTop: '2px', lineHeight: 1.2 }}
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
                      <Trees className="w-4 h-4" />
                    </div>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>Zona o Municipio</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Ubicación del terreno..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, color: '#0f172a', fontSize: '13.5px', padding: 0, marginTop: '2px', lineHeight: 1.2 }}
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
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>Zona Comercial</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Corredor o plaza comercial..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, color: '#0f172a', fontSize: '13.5px', padding: 0, marginTop: '2px', lineHeight: 1.2 }}
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
