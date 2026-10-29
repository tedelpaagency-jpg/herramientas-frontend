"use client";
import React, { useRef, useState, useEffect } from 'react';
import {
  MapPin,
  Building2,
  DollarSign,
  Tag,
  KeyRound,
  Search,
  Trees,
  Home,
  ArrowLeftRight,
  ChevronDown,
} from 'lucide-react';

interface CustomBookingSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  icon: React.ReactNode;
  brandColor?: string;
}

const CustomBookingSelect: React.FC<CustomBookingSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  icon,
  brandColor = '#00a884',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) || options[0];

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

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="single-search-box" ref={dropdownRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', color: brandColor }}>
        {icon}
      </div>
      <div
        className="custom-select-dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ cursor: 'pointer', width: '100%' }}
      >
        <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '2px' }}>
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selected.label}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        </div>
      </div>
      <input type="hidden" name={name} value={value} />

      {isOpen && (
        <div
          className="custom-select-wrap two active"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: 0,
            minWidth: '220px',
            background: '#ffffff',
            boxShadow: '0 16px 36px rgba(0,0,0,0.16)',
            borderRadius: '16px',
            zIndex: 9999,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <ul className="option-list" style={{ padding: '6px 0', margin: 0, listStyle: 'none', maxHeight: '250px', overflowY: 'auto' }}>
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`single-item ${value === opt.value ? 'selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
                style={{
                  padding: '9px 16px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  backgroundColor: value === opt.value ? '#f0fdf4' : 'transparent',
                }}
              >
                <span
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: value === opt.value ? 800 : 600,
                    color: value === opt.value ? brandColor : '#1e293b',
                    display: 'block',
                  }}
                >
                  {opt.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface HeroV4Props {
  agency?: any;
}

const HeroV4: React.FC<HeroV4Props> = ({ agency }) => {
  // Tab selector: sale | rent | land | commercial
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'land' | 'commercial'>('sale');

  // Form field states
  const [search, setSearch] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('2'); // '2' = Venta, '1' = Alquiler, '' = Todas
  const [propertyType, setPropertyType] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const heroTitle = agency?.hero_title || agency?.details?.hero_title || 'Encuentra la Propiedad de tus Sueños';
  const heroSubtitle = agency?.hero_subtitle || agency?.details?.hero_subtitle || 'Las mejores opciones en venta y renta con asesoría jurídica, notarial y crediticia garantizada.';

  // Media (image / video) background
  const bannerImage = agency?.banner_image || agency?.details?.banner_image;
  const bannerVideo = agency?.banner_video || agency?.details?.banner_video;
  const rawMediaType = agency?.details?.hero_media_type;

  const isVideo =
    rawMediaType === 'video' ||
    (!rawMediaType && Boolean(bannerVideo)) ||
    (Boolean(bannerImage) && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(bannerImage)) ||
    (!rawMediaType && !bannerImage);

  const videoSrc =
    bannerVideo ||
    (bannerImage && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(bannerImage)
      ? bannerImage
      : '/assets/video/home4-banner-video.mp4');

  const tab1 = agency?.details?.hero_tab1 || 'En Venta';
  const tab2 = agency?.details?.hero_tab2 || 'En Renta';
  const tab3 = agency?.details?.hero_tab3 || 'Terrenos & Lotes';
  const tab4 = agency?.details?.hero_tab4 || 'Comercial';
  const searchBtnText = agency?.details?.hero_search_btn || 'Buscar Propiedades';
  const primaryColor = agency?.primary_color || '#00a884';
  const buttonColor = agency?.button_color || primaryColor;
  const domain = agency?.domain || '';

  // Synchronize Tab clicks with fields
  const handleTabClick = (tab: 'sale' | 'rent' | 'land' | 'commercial') => {
    setActiveTab(tab);
    if (tab === 'sale') {
      setPropertyStatus('2');
      if (propertyType === '3' || propertyType === '4') setPropertyType('');
    } else if (tab === 'rent') {
      setPropertyStatus('1');
      if (propertyType === '3' || propertyType === '4') setPropertyType('');
    } else if (tab === 'land') {
      setPropertyType('3');
    } else if (tab === 'commercial') {
      setPropertyType('4');
    }
  };

  // Synchronize mobile Operation selector with tabs
  const handleOperationChange = (val: string) => {
    setPropertyStatus(val);
    if (val === '2') setActiveTab('sale');
    else if (val === '1') setActiveTab('rent');
  };

  // Synchronize mobile Property selector with tabs
  const handlePropertyTypeChange = (val: string) => {
    setPropertyType(val);
    if (val === '3') setActiveTab('land');
    else if (val === '4') setActiveTab('commercial');
  };

  // Mobile labels
  const operationLabel = propertyStatus === '1' ? 'Alquiler' : propertyStatus === '2' ? 'Venta' : 'Todas';
  const propertyTypeOptions = [
    { label: 'Todas las propiedades', shortLabel: 'Todas', value: '' },
    { label: 'Casas & Residencias', shortLabel: 'Casas', value: '1' },
    { label: 'Departamentos & Lofts', shortLabel: 'Depto.', value: '2' },
    { label: 'Terrenos & Lotes', shortLabel: 'Terrenos', value: '3' },
    { label: 'Oficinas & Locales', shortLabel: 'Comercial', value: '4' },
    { label: 'Villas & Quintas', shortLabel: 'Villas', value: '5' },
  ];
  const typeLabel = propertyTypeOptions.find((p) => p.value === propertyType)?.shortLabel || 'Todas';

  const priceOptions = [
    { label: 'Cualquier precio', value: '' },
    { label: 'Hasta $100,000 USD', value: '100000' },
    { label: 'Hasta $200,000 USD', value: '200000' },
    { label: 'Hasta $300,000 USD', value: '300000' },
    { label: 'Hasta $500,000 USD', value: '500000' },
    { label: 'Hasta $1,000,000 USD', value: '1000000' },
  ];
  const priceLabel = priceOptions.find((p) => p.value === priceMax)?.label || 'Cualquier precio';

  return (
    <div className="home4-banner-section mb-100">
      {/* Background: Video or High-Res Image */}
      <div
        className="banner-video-area"
        style={
          !isVideo && bannerImage
            ? {
                backgroundImage: `linear-gradient(rgba(10, 15, 29, 0.55), rgba(10, 15, 29, 0.72)), url(${bannerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { position: 'relative', overflow: 'hidden' }
        }
      >
        {isVideo && (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              src={videoSrc}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(10, 15, 29, 0.52), rgba(10, 15, 29, 0.70))',
                pointerEvents: 'none',
              }}
            />
          </>
        )}
      </div>

      <div className="banner-content-wrap">
        <div className="container">
          <div className="banner-content">
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>

            {/* BOOKING CONTAINER */}
            <div className="filter-wrapper" style={{ marginTop: '30px' }}>
              <style jsx global>{`
                /* Desktop Tab Pills */
                .hero-booking-desktop-tabs {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: -18px;
                  margin-left: 24px;
                  position: relative;
                  z-index: 10;
                }
                .hero-desktop-tab-pill {
                  display: inline-flex;
                  align-items: center;
                  gap: 8px;
                  padding: 10px 22px;
                  border-radius: 9999px;
                  font-size: 13.5px;
                  font-weight: 700;
                  white-space: nowrap;
                  cursor: pointer;
                  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                  border: 1px solid rgba(226, 232, 240, 0.9);
                  background: #ffffff;
                  color: #334155;
                  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
                }
                .hero-desktop-tab-pill:hover {
                  transform: translateY(-2px);
                  background: #ffffff;
                  color: #0f172a;
                  border-color: #cbd5e1;
                  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
                }
                .hero-desktop-tab-pill.active {
                  background: ${primaryColor} !important;
                  color: #ffffff !important;
                  border-color: ${primaryColor} !important;
                  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22) !important;
                }
                .hero-desktop-tab-pill.active svg {
                  stroke: #ffffff !important;
                }

                /* Desktop Card Layout */
                .desktop-booking-box {
                  display: flex;
                  align-items: center;
                  background: #ffffff;
                  border-radius: 28px;
                  padding: 16px 20px;
                  box-shadow: 0 20px 45px -12px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.04);
                  gap: 12px;
                }
                .desktop-booking-box .booking-field-cell {
                  flex: 1;
                  min-width: 0;
                  padding: 6px 14px;
                  border-right: 1px solid #f1f5f9;
                }
                .desktop-booking-box .booking-field-cell:last-of-type {
                  border-right: none;
                }
                .desktop-booking-box .booking-search-btn {
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                  height: 52px;
                  padding: 0 28px;
                  border-radius: 9999px;
                  background-color: ${buttonColor};
                  color: #ffffff;
                  font-size: 13.5px;
                  font-weight: 800;
                  white-space: nowrap;
                  border: none;
                  cursor: pointer;
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
                  transition: all 0.2s ease;
                  flex-shrink: 0;
                }
                .desktop-booking-box .booking-search-btn:hover {
                  transform: translateY(-1px);
                  filter: brightness(1.05);
                  box-shadow: 0 14px 28px -5px rgba(0, 0, 0, 0.25);
                }
                .desktop-booking-box .booking-search-btn:active {
                  transform: scale(0.98);
                }

                /* Responsive switcher */
                @media (max-width: 767px) {
                  .desktop-booking-section {
                    display: none !important;
                  }
                  .mobile-booking-section {
                    display: block !important;
                  }
                }
                @media (min-width: 768px) {
                  .desktop-booking-section {
                    display: block !important;
                  }
                  .mobile-booking-section {
                    display: none !important;
                  }
                }
              `}</style>

              {/* ======================================================== */}
              {/* 1. DESKTOP BOOKING (Exact match to inmobiliaria.inmosoft.pro) */}
              {/* ======================================================== */}
              <div className="desktop-booking-section">
                {/* 4 Tabs right on top of card */}
                <div className="hero-booking-desktop-tabs">
                  <div
                    className={`hero-desktop-tab-pill ${activeTab === 'sale' ? 'active' : ''}`}
                    onClick={() => handleTabClick('sale')}
                  >
                    <Home className="w-4 h-4" />
                    <span>{tab1}</span>
                  </div>

                  <div
                    className={`hero-desktop-tab-pill ${activeTab === 'rent' ? 'active' : ''}`}
                    onClick={() => handleTabClick('rent')}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{tab2}</span>
                  </div>

                  <div
                    className={`hero-desktop-tab-pill ${activeTab === 'land' ? 'active' : ''}`}
                    onClick={() => handleTabClick('land')}
                  >
                    <Trees className="w-4 h-4" />
                    <span>{tab3}</span>
                  </div>

                  <div
                    className={`hero-desktop-tab-pill ${activeTab === 'commercial' ? 'active' : ''}`}
                    onClick={() => handleTabClick('commercial')}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{tab4}</span>
                  </div>
                </div>

                {/* Desktop Form Card */}
                <form action="/properties" method="GET" className="desktop-booking-box">
                  {domain && <input type="hidden" name="domain" value={domain} />}
                  <input type="hidden" name="property_status" value={propertyStatus} />

                  {/* 1. Ubicación */}
                  <div className="booking-field-cell">
                    <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>
                      UBICACIÓN
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                      <input
                        type="text"
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ciudad, colonia o zona..."
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          fontWeight: 700,
                          color: '#0f172a',
                          fontSize: '13.5px',
                          padding: 0,
                          lineHeight: 1.2,
                        }}
                      />
                    </div>
                  </div>

                  {/* 2. Tipo de Inmueble */}
                  <div className="booking-field-cell">
                    <CustomBookingSelect
                      label="TIPO DE INMUEBLE"
                      name="property_type"
                      value={propertyType}
                      onChange={setPropertyType}
                      brandColor={primaryColor}
                      icon={<Building2 className="w-4 h-4" />}
                      options={propertyTypeOptions.map((o) => ({ label: o.label, value: o.value }))}
                    />
                  </div>

                  {/* 3. Presupuesto Máximo */}
                  <div className="booking-field-cell">
                    <CustomBookingSelect
                      label="PRESUPUESTO MÁXIMO"
                      name="price_max"
                      value={priceMax}
                      onChange={setPriceMax}
                      brandColor={primaryColor}
                      icon={<DollarSign className="w-4 h-4" />}
                      options={priceOptions}
                    />
                  </div>

                  {/* 4. Botón Buscar */}
                  <button type="submit" className="booking-search-btn">
                    <Search className="w-4 h-4" />
                    <span>{searchBtnText}</span>
                  </button>
                </form>
              </div>

              {/* ======================================================== */}
              {/* 2. MOBILE BOOKING (Pixel-perfect match to user's screenshot) */}
              {/* ======================================================== */}
              <div className="mobile-booking-section">
                <form
                  action="/properties"
                  method="GET"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '28px',
                    padding: '20px 18px 22px 18px',
                    boxShadow: '0 20px 45px -10px rgba(0,0,0,0.18)',
                    textAlign: 'left',
                  }}
                >
                  {domain && <input type="hidden" name="domain" value={domain} />}

                  {/* Top Mobile Tabs Row: Icon on top, Text underneath, Active indicator bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-around',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    {/* VENTA */}
                    <div
                      onClick={() => handleTabClick('sale')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        flex: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Tag
                        className="w-5 h-5 mb-1"
                        style={{
                          color: activeTab === 'sale' ? '#0f172a' : '#94a3b8',
                          transition: 'color 0.2s',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          color: activeTab === 'sale' ? '#0f172a' : '#94a3b8',
                          transition: 'color 0.2s',
                        }}
                      >
                        VENTA
                      </span>
                      {activeTab === 'sale' ? (
                        <div
                          style={{
                            width: '42px',
                            height: '3.5px',
                            backgroundColor: '#1e293b',
                            borderRadius: '9999px',
                            marginTop: '6px',
                          }}
                        />
                      ) : (
                        <div style={{ height: '3.5px', marginTop: '6px' }} />
                      )}
                    </div>

                    {/* ALQUILER */}
                    <div
                      onClick={() => handleTabClick('rent')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        flex: 1,
                        textAlign: 'center',
                      }}
                    >
                      <KeyRound
                        className="w-5 h-5 mb-1"
                        style={{
                          color: activeTab === 'rent' ? '#0f172a' : '#94a3b8',
                          transition: 'color 0.2s',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          color: activeTab === 'rent' ? '#0f172a' : '#94a3b8',
                          transition: 'color 0.2s',
                        }}
                      >
                        ALQUILER
                      </span>
                      {activeTab === 'rent' ? (
                        <div
                          style={{
                            width: '42px',
                            height: '3.5px',
                            backgroundColor: '#1e293b',
                            borderRadius: '9999px',
                            marginTop: '6px',
                          }}
                        />
                      ) : (
                        <div style={{ height: '3.5px', marginTop: '6px' }} />
                      )}
                    </div>

                    {/* TERRENOS */}
                    <div
                      onClick={() => handleTabClick('land')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        flex: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Trees
                        className="w-5 h-5 mb-1"
                        style={{
                          color: activeTab === 'land' ? '#0f172a' : '#94a3b8',
                          transition: 'color 0.2s',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          color: activeTab === 'land' ? '#0f172a' : '#94a3b8',
                          transition: 'color 0.2s',
                        }}
                      >
                        TERRENOS
                      </span>
                      {activeTab === 'land' ? (
                        <div
                          style={{
                            width: '42px',
                            height: '3.5px',
                            backgroundColor: '#1e293b',
                            borderRadius: '9999px',
                            marginTop: '6px',
                          }}
                        />
                      ) : (
                        <div style={{ height: '3.5px', marginTop: '6px' }} />
                      )}
                    </div>

                    {/* COMERCIAL */}
                    <div
                      onClick={() => handleTabClick('commercial')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        flex: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Building2
                        className="w-5 h-5 mb-1"
                        style={{
                          color: activeTab === 'commercial' ? '#0f172a' : '#94a3b8',
                          transition: 'color 0.2s',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          color: activeTab === 'commercial' ? '#0f172a' : '#94a3b8',
                          transition: 'color 0.2s',
                        }}
                      >
                        COMERCIAL
                      </span>
                      {activeTab === 'commercial' ? (
                        <div
                          style={{
                            width: '42px',
                            height: '3.5px',
                            backgroundColor: '#1e293b',
                            borderRadius: '9999px',
                            marginTop: '6px',
                          }}
                        />
                      ) : (
                        <div style={{ height: '3.5px', marginTop: '6px' }} />
                      )}
                    </div>
                  </div>

                  {/* DESTINO */}
                  <div style={{ marginBottom: '14px' }}>
                    <label
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#94a3b8',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      DESTINO
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '12px 14px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <input
                        type="text"
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="¿En donde estas buscando?"
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          padding: 0,
                        }}
                      />
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    </div>
                  </div>

                  {/* 2 COLUMNS: OPERACIÓN & PROPIEDAD */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    {/* OPERACIÓN */}
                    <div>
                      <label
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#94a3b8',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        OPERACIÓN
                      </label>
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '16px',
                          padding: '12px 12px',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <ArrowLeftRight className="w-4 h-4 text-slate-700 shrink-0" />
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                            {operationLabel}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                        <select
                          name="property_status"
                          value={propertyStatus}
                          onChange={(e) => handleOperationChange(e.target.value)}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                            zIndex: 10,
                          }}
                        >
                          <option value="2">Venta</option>
                          <option value="1">Alquiler</option>
                          <option value="">Todas</option>
                        </select>
                      </div>
                    </div>

                    {/* PROPIEDAD */}
                    <div>
                      <label
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#94a3b8',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        PROPIEDAD
                      </label>
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '16px',
                          padding: '12px 12px',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <Building2 className="w-4 h-4 text-slate-700 shrink-0" />
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                            {typeLabel}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                        <select
                          name="property_type"
                          value={propertyType}
                          onChange={(e) => handlePropertyTypeChange(e.target.value)}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                            zIndex: 10,
                          }}
                        >
                          {propertyTypeOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* PRESUPUESTO */}
                  <div style={{ marginBottom: '18px' }}>
                    <label
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#94a3b8',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      PRESUPUESTO
                    </label>
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '12px 14px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <DollarSign className="w-4 h-4 text-slate-700 shrink-0" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                          {priceLabel}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                      <select
                        name="price_max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: 0,
                          width: '100%',
                          height: '100%',
                          cursor: 'pointer',
                          zIndex: 10,
                        }}
                      >
                        {priceOptions.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* BOTÓN BUSCAR PROPIEDADES (Dark capsule button like in mobile screenshot) */}
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: '#2b2e35',
                      color: '#ffffff',
                      borderRadius: '16px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.22)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>BUSCAR PROPIEDADES</span>
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
