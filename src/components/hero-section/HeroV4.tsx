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
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: brandColor, flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              color: '#94a3b8',
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              lineHeight: 1,
            }}
          >
            {label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '3px' }}>
            <span
              style={{
                fontWeight: 700,
                color: '#0f172a',
                fontSize: '13.5px',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {selected.label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </div>
        </div>
      </div>
      <input type="hidden" name={name} value={value} />

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            left: 0,
            minWidth: '220px',
            background: '#ffffff',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            borderRadius: '16px',
            zIndex: 9999,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <ul style={{ padding: '6px 0', margin: 0, listStyle: 'none', maxHeight: '250px', overflowY: 'auto' }}>
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                style={{
                  padding: '10px 16px',
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
  // Desktop Tab selector: sale | rent | land | commercial
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'land' | 'commercial'>('sale');

  // Form field states
  const [search, setSearch] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('2'); // '2' = Venta, '1' = Alquiler, '' = Todas
  const [propertyType, setPropertyType] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const heroTitle = agency?.hero_title || agency?.details?.hero_title || 'Propiedades Immobillis';
  const heroSubtitle = agency?.hero_subtitle || agency?.details?.hero_subtitle || 'Encuentra tu Hogar SoñadoPropied';

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
    { label: 'Departamentos & Lofts', shortLabel: 'Depto.', value: '2' },
    { label: 'Casas & Residencias', shortLabel: 'Casas', value: '1' },
    { label: 'Terrenos & Lotes', shortLabel: 'Terrenos', value: '3' },
    { label: 'Oficinas & Locales', shortLabel: 'Comercial', value: '4' },
    { label: 'Villas & Quintas', shortLabel: 'Villas', value: '5' },
  ];
  const typeLabel = propertyTypeOptions.find((p) => p.value === propertyType)?.shortLabel || 'Depto.';

  const priceOptions = [
    { label: 'Cualquier precio', value: '' },
    { label: 'Hasta $50,000 USD', value: '50000' },
    { label: 'Hasta $100,000 USD', value: '100000' },
    { label: 'Hasta $200,000 USD', value: '200000' },
    { label: 'Hasta $300,000 USD', value: '300000' },
    { label: 'Hasta $500,000 USD', value: '500000' },
    { label: 'Hasta $1,000,000 USD', value: '1000000' },
  ];
  const priceLabel = priceOptions.find((p) => p.value === priceMax)?.label || 'Cualquier precio';

  return (
    <div className="inmo-hero-wrapper px-3 sm:px-6 lg:px-12 py-3 lg:py-5">
      <style jsx global>{`
        /* Reset any template margin conflicts */
        .home4-banner-section .banner-content-wrap .banner-content .filter-wrapper {
          margin-top: 0 !important;
        }
        @media (max-width: 576px) {
          .home4-banner-section {
            margin-bottom: 40px !important;
          }
        }

        /* Desktop Canvas Frame */
        .inmo-hero-canvas {
          position: relative;
          border-radius: 36px;
          overflow: hidden;
          background-color: #111827;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 540px;
          padding: 60px 24px 80px 24px;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 767px) {
          .inmo-hero-canvas {
            border-radius: 28px;
            min-height: auto;
            padding: 40px 16px 0 16px;
          }
        }

        /* Desktop Tabs */
        .inmo-desktop-tab-list {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: -16px;
          margin-left: 20px;
          position: relative;
          z-index: 20;
        }
        .inmo-desktop-tab-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: #ffffff;
          color: #334155;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          user-select: none;
        }
        .inmo-desktop-tab-pill:hover {
          transform: translateY(-2px);
          color: #0f172a;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
        }
        .inmo-desktop-tab-pill.active {
          background: #eab308 !important; /* Yellow like in screenshot or primaryColor */
          color: #ffffff !important;
          border-color: #eab308 !important;
          box-shadow: 0 8px 24px rgba(234, 179, 8, 0.4) !important;
        }
        .inmo-desktop-tab-pill.active svg {
          stroke: #ffffff !important;
        }

        /* Desktop Booking Card */
        .inmo-desktop-card {
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: 9999px;
          padding: 12px 16px 12px 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          gap: 16px;
          width: 100%;
          max-width: 1080px;
        }
        .inmo-desktop-field {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .inmo-desktop-divider {
          width: 1px;
          height: 36px;
          background-color: #f1f5f9;
          flex-shrink: 0;
        }
        .inmo-desktop-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 52px;
          padding: 0 32px;
          border-radius: 9999px;
          background-color: ${primaryColor};
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 24px -5px ${primaryColor}66;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .inmo-desktop-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.06);
          box-shadow: 0 14px 28px -5px ${primaryColor}88;
        }
        .inmo-desktop-btn:active {
          transform: scale(0.98);
        }

        /* Responsive Visibility */
        @media (max-width: 767px) {
          .inmo-desktop-wrapper {
            display: none !important;
          }
          .inmo-mobile-wrapper {
            display: block !important;
            width: 100% !important;
          }
        }
        @media (min-width: 768px) {
          .inmo-desktop-wrapper {
            display: block !important;
          }
          .inmo-mobile-wrapper {
            display: none !important;
          }
        }
      `}</style>

      {/* Hero Canvas Frame */}
      <div className="inmo-hero-canvas">
        {/* Background Media */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {isVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              src={videoSrc}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${bannerImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          {/* Contrast Gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.72))',
            }}
          />
        </div>

        {/* Hero Headings */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            marginBottom: '36px',
            maxWidth: '850px',
          }}
        >
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              margin: '0 0 10px 0',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {heroTitle}
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.92)',
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              fontWeight: 500,
              margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.25)',
            }}
          >
            {heroSubtitle}
          </p>
        </div>

        {/* ======================================================== */}
        {/* 1. DESKTOP VIEW (Exact match to inmobiliaria.inmosoft.pro) */}
        {/* ======================================================== */}
        <div className="inmo-desktop-wrapper" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1080px' }}>
          {/* 4 Tabs on top of the card */}
          <div className="inmo-desktop-tab-list">
            <div
              className={`inmo-desktop-tab-pill ${activeTab === 'sale' ? 'active' : ''}`}
              onClick={() => handleTabClick('sale')}
            >
              <Home className="w-4 h-4" />
              <span>{tab1}</span>
            </div>

            <div
              className={`inmo-desktop-tab-pill ${activeTab === 'rent' ? 'active' : ''}`}
              onClick={() => handleTabClick('rent')}
            >
              <KeyRound className="w-4 h-4" />
              <span>{tab2}</span>
            </div>

            <div
              className={`inmo-desktop-tab-pill ${activeTab === 'land' ? 'active' : ''}`}
              onClick={() => handleTabClick('land')}
            >
              <Tag className="w-4 h-4" />
              <span>{tab3}</span>
            </div>

            <div
              className={`inmo-desktop-tab-pill ${activeTab === 'commercial' ? 'active' : ''}`}
              onClick={() => handleTabClick('commercial')}
            >
              <Building2 className="w-4 h-4" />
              <span>{tab4}</span>
            </div>
          </div>

          {/* Horizontal Search Bar Card */}
          <form action="/properties" method="GET" className="inmo-desktop-card">
            {domain && <input type="hidden" name="domain" value={domain} />}
            <input type="hidden" name="property_status" value={propertyStatus} />

            {/* Field 1: UBICACIÓN */}
            <div className="inmo-desktop-field" style={{ flex: '1.2' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  width: '100%',
                  backgroundColor: '#ffffff',
                }}
              >
                <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      color: '#94a3b8',
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      lineHeight: 1,
                    }}
                  >
                    UBICACIÓN
                  </span>
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
                      marginTop: '2px',
                      lineHeight: 1.2,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="inmo-desktop-divider" />

            {/* Field 2: TIPO DE INMUEBLE */}
            <div className="inmo-desktop-field">
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

            <div className="inmo-desktop-divider" />

            {/* Field 3: PRESUPUESTO MÁXIMO */}
            <div className="inmo-desktop-field">
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

            {/* Field 4: Search Button */}
            <button type="submit" className="inmo-desktop-btn">
              <Search className="w-4 h-4" />
              <span>{searchBtnText}</span>
            </button>
          </form>
        </div>

        {/* ======================================================== */}
        {/* 2. MOBILE VIEW (Pixel-perfect match to user's screenshot) */}
        {/* ======================================================== */}
        <div className="inmo-mobile-wrapper" style={{ position: 'relative', zIndex: 10 }}>
          <form
            action="/properties"
            method="GET"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '32px 32px 28px 28px',
              padding: '24px 20px 24px 20px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              textAlign: 'left',
              width: '100%',
              maxWidth: '440px',
              margin: '0 auto',
            }}
          >
            {domain && <input type="hidden" name="domain" value={domain} />}

            {/* Top 2 Tabs: VENTA & ALQUILER (Exact match to screenshot) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '8px',
                marginBottom: '18px',
              }}
            >
              {/* VENTA TAB */}
              <div
                onClick={() => handleTabClick('sale')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px 16px',
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
                    letterSpacing: '0.06em',
                    color: activeTab === 'sale' ? '#0f172a' : '#94a3b8',
                    transition: 'color 0.2s',
                  }}
                >
                  VENTA
                </span>
                {activeTab === 'sale' ? (
                  <div
                    style={{
                      width: '64px',
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

              {/* ALQUILER TAB */}
              <div
                onClick={() => handleTabClick('rent')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px 16px',
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
                    letterSpacing: '0.06em',
                    color: activeTab === 'rent' ? '#0f172a' : '#94a3b8',
                    transition: 'color 0.2s',
                  }}
                >
                  ALQUILER
                </span>
                {activeTab === 'rent' ? (
                  <div
                    style={{
                      width: '64px',
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
                  fontSize: '10.5px',
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
                  padding: '13px 16px',
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
                    fontSize: '14px',
                    fontWeight: 500,
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
                    fontSize: '10.5px',
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
                    padding: '13px 14px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <ArrowLeftRight className="w-4 h-4 text-slate-700 shrink-0" />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
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
                    fontSize: '10.5px',
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
                    padding: '13px 14px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <Building2 className="w-4 h-4 text-slate-700 shrink-0" />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
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
                  fontSize: '10.5px',
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
                  padding: '13px 16px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <DollarSign className="w-4 h-4 text-slate-700 shrink-0" />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
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

            {/* BUSCAR PROPIEDADES (Dark button matching screenshot) */}
            <button
              type="submit"
              style={{
                width: '100%',
                height: '52px',
                backgroundColor: '#2b2e35',
                color: '#ffffff',
                borderRadius: '18px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '13.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(0,0,0,0.22)',
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
  );
};

export default HeroV4;
