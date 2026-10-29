"use client";
import React, { useRef, useState, useEffect } from 'react';
import {
  Tag,
  KeyRound,
  Search,
  ChevronDown,
} from 'lucide-react';

interface HeroV4Props {
  agency?: any;
}

const HeroV4: React.FC<HeroV4Props> = ({ agency }) => {
  // Tabs: 'sale' | 'rent' (Exact match to Image 1 & Image 2)
  const [activeTab, setActiveTab] = useState<'sale' | 'rent'>('sale');
  const [isTabLoading, setIsTabLoading] = useState(false);

  // Form field states
  const [search, setSearch] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('2'); // '2' = Venta, '1' = Alquiler
  const [propertyType, setPropertyType] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const heroTitle = agency?.hero_title || agency?.details?.hero_title || 'Tu Proximo';
  const heroSubtitle = agency?.hero_subtitle || agency?.details?.hero_subtitle || 'Exito Inmobiliario Inicia Con Nosotros';

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

  const domain = agency?.domain || '';

  // Handle Tab Switch with Spinner Loader (Exact match to Image 2)
  const handleTabClick = (tab: 'sale' | 'rent') => {
    if (tab === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(tab);
    if (tab === 'sale') {
      setPropertyStatus('2');
    } else {
      setPropertyStatus('1');
    }
    // Simulate natural fetch transition matching inmosoft
    setTimeout(() => {
      setIsTabLoading(false);
    }, 450);
  };

  const propertyTypeOptions = [
    { label: 'Cualquiera', value: '' },
    { label: 'Casa', value: '1' },
    { label: 'Departamento', value: '2' },
    { label: 'Terreno', value: '3' },
    { label: 'Local comercial', value: '4' },
    { label: 'Oficinas', value: '15' },
    { label: 'Suites', value: '21' },
    { label: 'Edificio', value: '5' },
    { label: 'Quinta', value: '19' },
  ];
  const typeDisplayLabel = propertyTypeOptions.find((p) => p.value === propertyType)?.label || 'Cualquiera';

  const priceOptions = [
    { label: 'Cualquiera', value: '' },
    { label: 'Hasta $50k', value: '50000' },
    { label: 'Hasta $100k', value: '100000' },
    { label: 'Hasta $200k', value: '200000' },
    { label: 'Hasta $300k', value: '300000' },
    { label: 'Hasta $500k', value: '500000' },
    { label: 'Hasta $1M+', value: '1000000' },
  ];
  const priceDisplayLabel = priceOptions.find((p) => p.value === priceMax)?.label || 'Cualquiera';

  return (
    <div className="inmo-hero-wrapper px-3 sm:px-6 lg:px-12 py-3 lg:py-5">
      <style jsx global>{`
        @keyframes inmoSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Hero Frame Canvas */
        .inmo-hero-canvas {
          position: relative;
          border-radius: 36px;
          overflow: hidden;
          background-color: #111827;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 520px;
          padding: 60px 20px 70px 20px;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.35);
        }

        @media (max-width: 767px) {
          .inmo-hero-canvas {
            border-radius: 24px;
            padding: 40px 14px 40px 14px;
            min-height: auto;
          }
        }

        /* White Booking Card (Exact Match to Image 1) */
        .inmo-main-booking-card {
          position: relative;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.28);
          width: 100%;
          max-width: 1040px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.9);
          z-index: 10;
        }

        /* Top Tabs Row */
        .inmo-card-tabs-bar {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          padding: 16px 28px 0 28px;
          background: #ffffff;
          gap: 36px;
        }

        .inmo-card-tab-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0 0 10px 0;
          position: relative;
          outline: none;
          color: #94a3b8;
          transition: color 0.2s ease;
          user-select: none;
        }

        .inmo-card-tab-btn.active {
          color: #0f172a;
        }

        .inmo-card-tab-btn span {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Active underline bar touching the divider line */
        .inmo-tab-active-bar {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 58px;
          height: 3px;
          background-color: #0f172a;
          border-radius: 3px 3px 0 0;
        }

        /* Form Row Desktop */
        .inmo-card-form-grid {
          display: grid;
          grid-template-columns: 2fr 1.1fr 1.2fr 1.1fr auto;
          gap: 16px;
          padding: 24px 28px 28px 28px;
          align-items: flex-end;
          background: #ffffff;
          position: relative;
        }

        @media (max-width: 991px) {
          .inmo-card-form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .inmo-card-form-grid {
            grid-template-columns: 1fr;
            padding: 20px 16px 24px 16px;
            gap: 14px;
          }
          .inmo-card-tabs-bar {
            padding: 14px 16px 0 16px;
            justify-content: space-around;
            gap: 0;
          }
        }

        /* Field Labels */
        .inmo-field-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
        }

        /* Field Control */
        .inmo-field-control {
          position: relative;
          height: 48px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0 14px;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .inmo-field-control:hover,
        .inmo-field-control:focus-within {
          border-color: #cbd5e1;
        }

        /* Search Button */
        .inmo-btn-search {
          height: 48px;
          padding: 0 28px;
          background-color: #2b2e35;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .inmo-btn-search:hover {
          background-color: #1a1c22;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
        }

        .inmo-btn-search:active {
          transform: scale(0.98);
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
              background: 'linear-gradient(rgba(15, 23, 42, 0.52), rgba(15, 23, 42, 0.70))',
            }}
          />
        </div>

        {/* Hero Headings */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            marginBottom: '32px',
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
              margin: '0 0 8px 0',
              textShadow: '0 4px 12px rgba(0,0,0,0.35)',
            }}
          >
            {heroTitle}
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: 'clamp(15px, 2vw, 19px)',
              fontWeight: 600,
              margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {heroSubtitle}
          </p>
        </div>

        {/* ======================================================== */}
        {/* BOOKING CARD (Exact Pixel-Perfect Match to Image 1 & 2) */}
        {/* ======================================================== */}
        <div className="inmo-main-booking-card">
          {/* Top Tabs: VENTA and ALQUILER with active underline bar */}
          <div className="inmo-card-tabs-bar">
            {/* VENTA */}
            <button
              type="button"
              className={`inmo-card-tab-btn ${activeTab === 'sale' ? 'active' : ''}`}
              onClick={() => handleTabClick('sale')}
            >
              <Tag className="w-5 h-5 mb-1" strokeWidth={2} />
              <span>VENTA</span>
              {activeTab === 'sale' && <div className="inmo-tab-active-bar" />}
            </button>

            {/* ALQUILER */}
            <button
              type="button"
              className={`inmo-card-tab-btn ${activeTab === 'rent' ? 'active' : ''}`}
              onClick={() => handleTabClick('rent')}
            >
              <KeyRound className="w-5 h-5 mb-1" strokeWidth={2} />
              <span>ALQUILER</span>
              {activeTab === 'rent' && <div className="inmo-tab-active-bar" />}
            </button>
          </div>

          {/* Form Body with Loading Spinner Overlay (Exact match to Image 2) */}
          <form action="/properties" method="GET" className="inmo-card-form-grid">
            {domain && <input type="hidden" name="domain" value={domain} />}
            <input type="hidden" name="property_status" value={propertyStatus} />

            {/* Loader Overlay (Matches Image 2) */}
            {isTabLoading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.82)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 50,
                  borderRadius: '0 0 24px 24px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    border: '3px solid rgba(0, 0, 0, 0.08)',
                    borderTop: '3px solid #1e293b',
                    borderRadius: '50%',
                    animation: 'inmoSpin 0.7s linear infinite',
                  }}
                />
              </div>
            )}

            {/* 1. Ubicación */}
            <div>
              <label className="inmo-field-label">Ubicación</label>
              <div className="inmo-field-control">
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
                    fontWeight: 500,
                    color: '#0f172a',
                    padding: 0,
                  }}
                />
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              </div>
            </div>

            {/* 2. Operación */}
            <div>
              <label className="inmo-field-label">Operación</label>
              <div className="inmo-field-control">
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>
                  {activeTab === 'sale' ? 'Venta' : 'Alquiler'}
                </span>
                <select
                  name="property_status"
                  value={propertyStatus}
                  onChange={(e) => handleTabClick(e.target.value === '1' ? 'rent' : 'sale')}
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
                </select>
              </div>
            </div>

            {/* 3. Propiedad */}
            <div>
              <label className="inmo-field-label">Propiedad</label>
              <div className="inmo-field-control">
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {typeDisplayLabel}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                <select
                  name="property_type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
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
                  {propertyTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Precio */}
            <div>
              <label className="inmo-field-label">Precio</label>
              <div className="inmo-field-control">
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {priceDisplayLabel}
                </span>
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

            {/* 5. Botón Buscar */}
            <div>
              <button type="submit" className="inmo-btn-search w-full sm:w-auto">
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Buscar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroV4;
