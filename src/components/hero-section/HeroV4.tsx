"use client";
import React, { useRef, useState, useEffect } from 'react';
import {
  Tag,
  KeyRound,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import publicInmobiliariaService, { PublicEstateCity } from '@/services/publicInmobiliariaService';

// Default cities with images (matching screenshot: QUITO, PUERTO QUITO, etc.)
const INITIAL_CITIES: { id: number; name: string; province: string; image: string }[] = [
  {
    id: 1,
    name: 'Quito',
    province: 'Pichincha',
    image: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Puerto Quito',
    province: 'Pichincha',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Guayaquil',
    province: 'Guayas',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Cuenca',
    province: 'Azuay',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    name: 'Manta',
    province: 'Manabí',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6,
    name: 'Salinas',
    province: 'Santa Elena',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 7,
    name: 'Quevedo',
    province: 'Los Ríos',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 8,
    name: 'Ambato',
    province: 'Tungurahua',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
  },
];

interface LocationCitySelectProps {
  value: string;
  onChange: (val: string) => void;
  domain?: string;
  accentColor?: string;
}

const LocationCitySelect: React.FC<LocationCitySelectProps> = ({ value, onChange, domain, accentColor = '#00a884' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [citiesList, setCitiesList] = useState(INITIAL_CITIES);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load cities from backend if available
  useEffect(() => {
    let isMounted = true;
    publicInmobiliariaService
      .getCities(domain)
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          const formatted = res.data.map((c: any, idx: number) => ({
            id: c.id || idx + 10,
            name: c.name || c.city || 'Ciudad',
            province: c.province || c.name || '',
            image: c.image || 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=400&q=80',
          }));
          setCitiesList((prev) => {
            const combined = [...prev];
            formatted.forEach((item) => {
              if (!combined.some((x) => x.name.toLowerCase() === item.name.toLowerCase())) {
                combined.push(item);
              }
            });
            return combined;
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [domain]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchInput('');
      setDebouncedQuery('');
      setIsDebouncing(false);
    }
  }, [isOpen]);

  // Handle typing with 2-second debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!val.trim()) {
      setIsDebouncing(false);
      setDebouncedQuery('');
      return;
    }

    setIsDebouncing(true);

    // Exact 2-second wait after last keystroke
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(val.trim());
      setIsDebouncing(false);
    }, 2000);
  };

  // Filter cities based on debounced query
  const filteredCities = citiesList.filter((item) => {
    if (!debouncedQuery) return true;
    const q = debouncedQuery.toLowerCase();
    const cityMatch = item.name.toLowerCase().includes(q);
    const provMatch = item.province.toLowerCase().includes(q);
    return cityMatch || provMatch;
  });

  const handleSelectCity = (city: { name: string; province: string }) => {
    onChange(city.name);
    setIsOpen(false);
  };

  const displayText = value ? value : '¿En donde estas buscando?';

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Field Control Box (Trigger) */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          height: '48px',
          border: '1px solid #e2e8f0',
          borderRadius: isOpen ? '12px 12px 0 0' : '12px',
          padding: '0 14px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.15s ease',
        }}
      >
        <span
          style={{
            fontSize: '13.5px',
            fontWeight: value ? 600 : 400,
            color: value ? '#0f172a' : '#94a3b8',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {displayText}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        )}
      </div>

      <input type="hidden" name="search" value={value} />

      {/* Dropdown Menu (Exact match to uploaded image) */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.18)',
            zIndex: 9999,
            padding: '8px 8px 6px 8px',
            minWidth: '260px',
          }}
        >
          {/* Inner Search Box */}
          <div style={{ marginBottom: '8px' }}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="Buscar ciudad o provincia..."
              style={{
                width: '100%',
                height: '36px',
                border: '1.5px solid #94a3b8',
                borderRadius: '6px',
                padding: '0 10px',
                fontSize: '13px',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 2-Second Debounce Indicator */}
          {isDebouncing && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                fontSize: '11px',
                color: '#64748b',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                marginBottom: '6px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #cbd5e1',
                  borderTop: `2px solid ${accentColor}`,
                  borderRadius: '50%',
                  animation: 'inmoSpin 0.6s linear infinite',
                }}
              />
              <span>Buscando en 2 seg...</span>
            </div>
          )}

          {/* Results List */}
          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {filteredCities.length > 0 ? (
              filteredCities.map((city, idx) => {
                const isSelected = highlightedIndex === idx;
                const formattedName = `${city.name.toUpperCase()} (${city.province.toUpperCase()})`;

                return (
                  <div
                    key={city.id}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelectCity(city)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? accentColor : idx === 0 && !isSelected ? accentColor : '#ffffff',
                      color: isSelected || (idx === 0 && !isSelected) ? '#ffffff' : accentColor,
                      transition: 'background-color 0.1s ease',
                      marginBottom: '2px',
                    }}
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={city.image}
                      alt={city.name}
                      style={{
                        width: '26px',
                        height: '20px',
                        objectFit: 'cover',
                        borderRadius: '3px',
                        flexShrink: 0,
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {/* City & Province Label */}
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {formattedName}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '12px 10px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                No se encontraron ciudades
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Professional Popover Select Component for Operación, Propiedad, Precio
interface ProfessionalBookingSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  name: string;
  hasCaret?: boolean;
  accentColor?: string;
}

const ProfessionalBookingSelect: React.FC<ProfessionalBookingSelectProps> = ({
  label,
  value,
  onChange,
  options,
  name,
  hasCaret = true,
  accentColor = '#00a884',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <label className="inmo-field-label">{label}</label>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          height: '48px',
          border: '1px solid #e2e8f0',
          borderRadius: isOpen ? '12px 12px 0 0' : '12px',
          padding: '0 14px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.15s ease',
        }}
      >
        <span
          style={{
            fontSize: '13.5px',
            fontWeight: 600,
            color: '#0f172a',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedOpt?.label}
        </span>
        {hasCaret && (
          <ChevronDown
            className="w-4 h-4 text-slate-400 shrink-0 ml-1 transition-transform"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        )}
      </div>

      <input type="hidden" name={name} value={value} />

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderTop: 'none',
            borderRadius: '0 0 14px 14px',
            boxShadow: '0 16px 36px -4px rgba(0, 0, 0, 0.16)',
            zIndex: 9999,
            padding: '6px',
            maxHeight: '240px',
            overflowY: 'auto',
            minWidth: '170px',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: isSelected ? `${accentColor}15` : 'transparent',
                  color: isSelected ? accentColor : '#1e293b',
                  transition: 'background-color 0.15s ease',
                  marginBottom: '2px',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4" style={{ color: accentColor }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

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

  const primaryColor = agency?.primary_color || agency?.details?.primary_color || '#00a884';
  const buttonColor = agency?.button_color || agency?.details?.button_color || primaryColor;

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

  const operationOptions = [
    { label: 'Venta', value: '2' },
    { label: 'Alquiler', value: '1' },
  ];

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

  const priceOptions = [
    { label: 'Cualquiera', value: '' },
    { label: 'Hasta $50k', value: '50000' },
    { label: 'Hasta $100k', value: '100000' },
    { label: 'Hasta $200k', value: '200000' },
    { label: 'Hasta $300k', value: '300000' },
    { label: 'Hasta $500k', value: '500000' },
    { label: 'Hasta $1M+', value: '1000000' },
  ];

  return (
    <div className="inmo-hero-wrapper px-3 sm:px-6 py-4 lg:py-6" style={{ maxWidth: '1160px', margin: '0 auto', width: '100%' }}>
      <style jsx global>{`
        @keyframes inmoSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Hero Frame Canvas (Narrower horizontally, 600px tall, fully responsive) */
        .inmo-hero-canvas {
          position: relative;
          border-radius: 36px;
          overflow: hidden;
          background-color: #111827;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 600px;
          padding: 70px 24px 80px 24px;
          box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.4);
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        @media (max-width: 991px) {
          .inmo-hero-canvas {
            min-height: 560px;
            padding: 50px 20px 60px 20px;
          }
        }

        @media (max-width: 767px) {
          .inmo-hero-canvas {
            border-radius: 26px;
            min-height: 520px;
            padding: 40px 14px 40px 14px;
          }
        }

        /* White Booking Card (Exact Match to Image 1) */
        .inmo-main-booking-card {
          position: relative;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.32);
          width: 100%;
          max-width: 1020px;
          overflow: visible;
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
          border-radius: 24px 24px 0 0;
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
          border-radius: 0 0 24px 24px;
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

        /* Search Button */
        .inmo-btn-search {
          height: 48px;
          padding: 0 28px;
          background-color: ${buttonColor} !important;
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
          box-shadow: 0 6px 18px ${buttonColor}40;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .inmo-btn-search:hover {
          filter: brightness(0.92);
          transform: translateY(-1px);
          box-shadow: 0 8px 22px ${buttonColor}60;
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
            marginBottom: '34px',
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

            {/* 1. Ubicación (Select2-style Search with 2s Debounce matching Screenshot) */}
            <div style={{ position: 'relative' }}>
              <label className="inmo-field-label">Ubicación</label>
              <LocationCitySelect
                value={search}
                onChange={(val) => setSearch(val)}
                domain={domain}
                accentColor={buttonColor}
              />
            </div>

            {/* 2. Operación (Professional Popover Select) */}
            <div>
              <ProfessionalBookingSelect
                label="Operación"
                name="property_status"
                value={propertyStatus}
                onChange={(val) => handleTabClick(val === '1' ? 'rent' : 'sale')}
                options={operationOptions}
                hasCaret={false}
                accentColor={buttonColor}
              />
            </div>

            {/* 3. Propiedad (Professional Popover Select) */}
            <div>
              <ProfessionalBookingSelect
                label="Propiedad"
                name="property_type"
                value={propertyType}
                onChange={setPropertyType}
                options={propertyTypeOptions}
                hasCaret={true}
                accentColor={buttonColor}
              />
            </div>

            {/* 4. Precio (Professional Popover Select) */}
            <div>
              <ProfessionalBookingSelect
                label="Precio"
                name="price_max"
                value={priceMax}
                onChange={setPriceMax}
                options={priceOptions}
                hasCaret={false}
                accentColor={buttonColor}
              />
            </div>

            {/* 5. Botón Buscar */}
            <div>
              <button
                type="submit"
                className="inmo-btn-search w-full sm:w-auto"
                style={{ backgroundColor: buttonColor }}
              >
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
