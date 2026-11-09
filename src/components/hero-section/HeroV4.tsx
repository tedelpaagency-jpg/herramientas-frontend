"use client";
import React, { useRef, useState, useEffect } from 'react';
import {
  Tag,
  KeyRound,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
  Trees,
  Building2,
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
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const LocationCitySelect: React.FC<LocationCitySelectProps> = ({
  value,
  onChange,
  domain,
  accentColor = '#e2b728',
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(isOpen) : val;
    if (isControlled && onToggle) {
      onToggle(nextVal);
    } else {
      setInternalIsOpen(nextVal);
    }
  };

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
          setCitiesList(formatted);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [domain]);

  // Click & Touch outside to close
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen, isControlled, onToggle]);

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
    setOpen(false);
  };

  const displayText = value ? value : '¿En donde estas buscando?';

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', zIndex: isOpen ? 99999 : undefined }}>
      {/* Field Control Box (Trigger) */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{
          height: '52px',
          border: '1px solid #e2e8f0',
          borderRadius: isOpen ? '14px 14px 0 0' : '14px',
          padding: '0 16px',
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
            fontSize: '16.5px',
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
          <ChevronUp className="w-5 h-5 text-slate-500 shrink-0 ml-1.5" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-1.5" />
        )}
      </div>

      <input type="hidden" name="search" value={value} />
      <input type="hidden" name="city" value={value} />

      {/* Dropdown Menu (Exact match to uploaded image) */}
      {isOpen && (
        <div
          className="inmo-booking-popover"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '16px',
            boxShadow: '0 20px 45px -4px rgba(0, 0, 0, 0.28), 0 4px 16px rgba(0,0,0,0.08)',
            zIndex: 99999,
            padding: '10px 10px 8px 10px',
            width: '100%',
            minWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Inner Search Box */}
          <div style={{ marginBottom: '10px' }}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="Buscar ciudad o provincia..."
              style={{
                width: '100%',
                height: '40px',
                border: '1.5px solid #94a3b8',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '15px',
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
                fontSize: '12px',
                color: '#64748b',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                marginBottom: '6px',
              }}
            >
              <div
                style={{
                  width: '13px',
                  height: '13px',
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
          <div style={{ maxHeight: '230px', overflowY: 'auto' }}>
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
                      padding: '9px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? accentColor : '#ffffff',
                      color: isSelected ? '#ffffff' : '#0f172a',
                      transition: 'background-color 0.1s ease',
                      marginBottom: '3px',
                    }}
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={city.image}
                      alt={city.name}
                      style={{
                        width: '28px',
                        height: '22px',
                        objectFit: 'cover',
                        borderRadius: '4px',
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
                        fontSize: '14.5px',
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
              <div style={{ padding: '14px 10px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
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
  alignRight?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const ProfessionalBookingSelect: React.FC<ProfessionalBookingSelectProps> = ({
  label,
  value,
  onChange,
  options,
  name,
  hasCaret = true,
  accentColor = '#e2b728',
  alignRight = false,
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(isOpen) : val;
    if (isControlled && onToggle) {
      onToggle(nextVal);
    } else {
      setInternalIsOpen(nextVal);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen, isControlled, onToggle]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', zIndex: isOpen ? 99999 : undefined }}>
      <label className="inmo-field-label">{label}</label>
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{
          height: '52px',
          border: `1px solid ${isOpen ? accentColor : '#e2e8f0'}`,
          borderRadius: '14px',
          padding: '0 16px',
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
            fontSize: '16.5px',
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
            className="w-5 h-5 text-slate-400 shrink-0 ml-1.5 transition-transform"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        )}
      </div>

      <input type="hidden" name={name} value={value} />

      {isOpen && (
        <div
          className="inmo-booking-popover"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: alignRight ? 'auto' : 0,
            right: alignRight ? 0 : 'auto',
            minWidth: '100%',
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '16px',
            boxShadow: '0 20px 45px -4px rgba(0, 0, 0, 0.28), 0 4px 16px rgba(0,0,0,0.08)',
            zIndex: 99999,
            padding: '8px',
            maxHeight: '280px',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  fontSize: '16px',
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

type BookingTab = 'sale' | 'rent';

const HeroV4: React.FC<HeroV4Props> = ({ agency }) => {
  // Tabs: 'sale' (En Venta) | 'rent' (En Renta)
  const [activeTab, setActiveTab] = useState<BookingTab>('sale');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  // Active open dropdown tracker (Ubicación, Operación, Propiedad, Precio)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Form field states
  const [search, setSearch] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('2'); // '2' = Venta, '1' = Alquiler
  const [propertyType, setPropertyType] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const rawColor = agency?.primary_color || agency?.details?.primary_color;
  const primaryColor = (!rawColor || rawColor.toLowerCase() === '#00a884') ? '#e2b728' : rawColor;
  // Los botones deben ser del mismo color del color primario
  const buttonColor = primaryColor;

  // Filter visibility configuration from Agency Settings
  const bookingFilters =
    agency?.filter_settings?.booking ??
    agency?.details?.estate_settings?.filter_settings?.booking ?? {
      tabs: true,
      location: true,
      operation: true,
      property_type: true,
      price: true,
    };

  const showTabs = bookingFilters.tabs !== false;
  const showLocation = bookingFilters.location !== false;
  const showOperation = bookingFilters.operation !== false;
  const showPropertyType = bookingFilters.property_type !== false;
  const showPrice = bookingFilters.price !== false;

  const gridColsList = [
    showLocation ? '2.1fr' : null,
    showOperation ? '1.15fr' : null,
    showPropertyType ? '1.25fr' : null,
    showPrice ? '1.15fr' : null,
    'auto',
  ].filter(Boolean);

  const desktopGridColumns = gridColsList.length > 1 ? gridColsList.join(' ') : '1fr auto';

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

  // Handle Tab Switch (Solo En Venta y En Renta, con micro-loader brandeado de 450ms)
  const handleTabClick = (tab: BookingTab) => {
    if (tab === activeTab) return;
    setActiveDropdown(null);
    setIsTabTransitioning(true);
    setActiveTab(tab);
    if (tab === 'sale') {
      setPropertyStatus('2'); // Venta
      setPropertyType('');
    } else if (tab === 'rent') {
      setPropertyStatus('1'); // Renta / Alquiler
      setPropertyType('');
    }
    setTimeout(() => {
      setIsTabTransitioning(false);
    }, 450);
  };

  const operationOptions = [
    { label: 'Venta', value: '2' },
    { label: 'Alquiler', value: '1' },
    { label: 'Remate', value: '3' },
  ];

  const propertyTypeOptions = [
    { label: 'Cualquiera', value: '' },
    { label: 'Bodegas', value: '1' },
    { label: 'Casa', value: '2' },
    { label: 'Complejo turístico', value: '3' },
    { label: 'Departamento', value: '4' },
    { label: 'Edificio', value: '5' },
    { label: 'Empresa', value: '6' },
    { label: 'Finca', value: '7' },
    { label: 'Galpón', value: '8' },
    { label: 'Gasolinera', value: '9' },
    { label: 'Hacienda', value: '10' },
    { label: 'Hotel', value: '11' },
    { label: 'Local comercial', value: '12' },
    { label: 'Lotes', value: '13' },
    { label: 'Lotización', value: '14' },
    { label: 'Oficinas', value: '15' },
    { label: 'Oficinas amobladas', value: '16' },
    { label: 'Planta', value: '17' },
    { label: 'Propiedad Comercial', value: '18' },
    { label: 'Quinta', value: '19' },
    { label: 'Solar', value: '20' },
    { label: 'Suites', value: '21' },
    { label: 'Terreno', value: '22' },
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

  const heroBannerMode = agency?.details?.hero_banner_mode || agency?.details?.hero_layout_mode || 'boxed';
  const isFullWidth = heroBannerMode === 'full_width';

  return (
    <div
      className={`inmo-hero-wrapper ${isFullWidth ? 'p-0 m-0 w-full' : 'px-3 sm:px-6 py-4 lg:py-6'}`}
      style={{
        maxWidth: isFullWidth ? '100%' : '1540px',
        margin: isFullWidth ? '0' : '0 auto',
        width: '100%',
      }}
    >
      <style jsx global>{`
        @keyframes inmoSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Hero Frame Canvas (Grande, espacioso y centrado) */
        .inmo-hero-canvas {
          position: relative;
          border-radius: ${isFullWidth ? '0px !important' : '36px'};
          overflow: visible !important;
          background-color: transparent !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          min-height: clamp(680px, 78vh, 800px);
          padding: 70px 24px 44px 24px;
          box-shadow: ${isFullWidth ? 'none !important' : '0 20px 45px -15px rgba(0, 0, 0, 0.35)'};
          width: 100%;
          max-width: ${isFullWidth ? '100% !important' : '1480px'};
          margin: ${isFullWidth ? '0 !important' : '0 auto'};
        }

        @media (max-width: 991px) {
          .inmo-hero-canvas {
            min-height: 640px;
            padding: 50px 20px 36px 20px;
          }
        }

        @media (max-width: 767px) {
          .inmo-hero-canvas {
            border-radius: ${isFullWidth ? '0px !important' : '24px'};
            min-height: 560px;
            padding: 36px 14px 28px 14px;
            box-shadow: ${isFullWidth ? 'none !important' : '0 10px 25px -10px rgba(0, 0, 0, 0.15)'};
            background-color: transparent !important;
          }
        }

        /* White Booking Card (Centrado en la parte inferior, aumentado con mayor presencia) */
        .inmo-main-booking-card {
          position: relative;
          background: #ffffff;
          border-radius: 26px;
          box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.32);
          width: 100%;
          max-width: 1050px;
          margin: auto auto 0 auto;
          flex-shrink: 0;
          overflow: visible !important;
          border: 1px solid rgba(255, 255, 255, 0.9);
          z-index: 20;
        }

        /* Top Tabs Row */
        .inmo-card-tabs-bar {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          padding: 18px 32px 0 32px;
          background: #ffffff;
          gap: 32px;
          border-radius: 26px 26px 0 0;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .inmo-card-tabs-bar::-webkit-scrollbar {
          display: none;
        }

        .inmo-card-tab-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0 6px 14px 6px;
          position: relative;
          outline: none;
          color: #94a3b8;
          transition: color 0.2s ease;
          user-select: none;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .inmo-card-tab-btn.active {
          color: ${primaryColor};
        }

        .inmo-card-tab-btn span {
          font-size: 14.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Active underline bar touching the divider line */
        .inmo-tab-active-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3.5px;
          background-color: ${primaryColor};
          border-radius: 3px 3px 0 0;
        }

        /* Form Row Desktop */
        .inmo-card-form-grid {
          display: grid;
          grid-template-columns: ${desktopGridColumns};
          gap: 16px;
          padding: 26px 32px 30px 32px;
          align-items: flex-end;
          background: #ffffff;
          position: relative;
          border-radius: ${showTabs ? '0 0 26px 26px' : '26px'};
          overflow: visible !important;
        }

        /* Stacking Context Hierarchy (Desktop) */
        .inmo-order-ubicacion { position: relative; z-index: 50; }
        .inmo-order-operacion { position: relative; z-index: 40; }
        .inmo-order-propiedad { position: relative; z-index: 30; }
        .inmo-order-precio    { position: relative; z-index: 20; }
        .inmo-order-boton     { position: relative; z-index: 10; }

        @media (max-width: 991px) {
          .inmo-card-form-grid {
            grid-template-columns: 1fr 1fr;
            align-items: stretch !important;
          }
          .inmo-order-operacion,
          .inmo-order-propiedad,
          .inmo-order-ubicacion,
          .inmo-order-precio,
          .inmo-order-boton {
            width: 100% !important;
          }
          .inmo-order-boton {
            grid-column: 1 / -1;
          }
          .inmo-btn-search {
            width: 100% !important;
          }
        }

        @media (max-width: 768px) {
          .inmo-hero-canvas {
            min-height: auto !important;
            padding: 32px 14px 24px 14px !important;
          }

          .inmo-main-booking-card {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            border-radius: 22px !important;
          }

          .inmo-card-tabs-bar {
            padding: 14px 16px 0 16px;
            gap: 24px;
            justify-content: flex-start;
            border-radius: 22px 22px 0 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .inmo-card-form-grid {
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
            width: 100% !important;
            padding: 20px 16px 24px 16px;
            gap: 16px;
            border-radius: ${showTabs ? '0 0 22px 22px' : '22px'} !important;
            box-sizing: border-box !important;
          }

          /* Reordenamiento móvil con Stacking Context garantizado: 
             1. Operación (z-index: 50)
             2. Propiedad (z-index: 40)
             3. Ubicación (z-index: 30)
             4. Precio    (z-index: 20)
             5. Buscar    (z-index: 10)
          */
          .inmo-order-operacion { order: 1 !important; z-index: 50 !important; width: 100% !important; max-width: 100% !important; position: relative !important; }
          .inmo-order-propiedad { order: 2 !important; z-index: 40 !important; width: 100% !important; max-width: 100% !important; position: relative !important; }
          .inmo-order-ubicacion { order: 3 !important; z-index: 30 !important; width: 100% !important; max-width: 100% !important; position: relative !important; }
          .inmo-order-precio    { order: 4 !important; z-index: 20 !important; width: 100% !important; max-width: 100% !important; position: relative !important; }
          .inmo-order-boton     { order: 5 !important; z-index: 10 !important; width: 100% !important; max-width: 100% !important; position: relative !important; }

          .inmo-order-operacion > div,
          .inmo-order-propiedad > div,
          .inmo-order-ubicacion > div,
          .inmo-order-precio > div,
          .inmo-order-boton > div {
            width: 100% !important;
            max-width: 100% !important;
          }

          .inmo-btn-search {
            width: 100% !important;
            max-width: 100% !important;
            justify-content: center !important;
          }

          .inmo-booking-popover {
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }

        /* Elevación absoluta garantizada cuando un selector se encuentra desplegado */
        .inmo-field-active-open {
          z-index: 99999 !important;
          position: relative !important;
        }

        /* Popover animation */
        .inmo-booking-popover {
          animation: inmoDropdownSlide 0.16s ease-out;
        }

        @keyframes inmoDropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Field Labels (+3px) */
        .inmo-field-label {
          display: block;
          font-size: 16px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 8px;
        }

        /* Search Button (+3px de texto y elementos) */
        .inmo-btn-search {
          height: 52px;
          padding: 0 32px;
          background-color: ${buttonColor} !important;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          font-size: 17.5px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          cursor: pointer;
          box-shadow: 0 6px 20px ${buttonColor}40;
          transition: all 0.2s ease;
          white-space: nowrap;
          width: 100%;
        }

        @media (min-width: 992px) {
          .inmo-btn-search {
            width: auto;
          }
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
            borderRadius: 'inherit',
            backgroundColor: 'transparent',
          }}
        >
          {isVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              src={videoSrc}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${bannerImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 'inherit',
              }}
            />
          )}
          {/* Contrast Gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
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
            marginTop: 'auto',
            marginBottom: '44px',
            maxWidth: '920px',
          }}
        >
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              margin: '0 0 10px 0',
              textShadow: '0 4px 14px rgba(0,0,0,0.4)',
            }}
          >
            {heroTitle}
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: 'clamp(16px, 2.2vw, 20px)',
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
          {/* Top Tabs: Solo En Venta y En Renta */}
          {showTabs && (
            <div className="inmo-card-tabs-bar">
              {/* EN VENTA */}
              <button
                type="button"
                className={`inmo-card-tab-btn ${activeTab === 'sale' ? 'active' : ''}`}
                onClick={() => handleTabClick('sale')}
              >
                <Tag className="w-5 h-5 mb-1.5" strokeWidth={2.2} />
                <span>En Venta</span>
                {activeTab === 'sale' && <div className="inmo-tab-active-bar" />}
              </button>

              {/* EN RENTA */}
              <button
                type="button"
                className={`inmo-card-tab-btn ${activeTab === 'rent' ? 'active' : ''}`}
                onClick={() => handleTabClick('rent')}
              >
                <KeyRound className="w-5 h-5 mb-1.5" strokeWidth={2.2} />
                <span>En Renta</span>
                {activeTab === 'rent' && <div className="inmo-tab-active-bar" />}
              </button>
            </div>
          )}

          {/* Form Body con micro-loader brandeado y reordenamiento móvil */}
          <form action="/properties" method="GET" className="inmo-card-form-grid relative">
            {domain && <input type="hidden" name="domain" value={domain} />}

            {/* Micro-Loader brandeado al cambiar pestañas de operación */}
            {isTabTransitioning && (
              <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-[24px] transition-all duration-300 animate-in fade-in">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full border-3 border-t-transparent animate-spin"
                    style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}
                  />
                  <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
                    Actualizando catálogo...
                  </span>
                </div>
              </div>
            )}

            {/* 1. Ubicación (Select2-style Search with 2s Debounce matching Screenshot) */}
            {showLocation && (
              <div
                className={`inmo-order-ubicacion ${activeDropdown === 'ubicacion' ? 'inmo-field-active-open' : ''}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  zIndex: activeDropdown === 'ubicacion' ? 99999 : undefined,
                  overflow: 'visible',
                }}
              >
                <label className="inmo-field-label">Ubicación</label>
                <LocationCitySelect
                  value={search}
                  onChange={(val) => setSearch(val)}
                  domain={domain}
                  accentColor={primaryColor}
                  isOpen={activeDropdown === 'ubicacion'}
                  onToggle={(open) => setActiveDropdown(open ? 'ubicacion' : null)}
                />
              </div>
            )}

            {/* 2. Operación (Professional Popover Select) */}
            {showOperation && (
              <div
                className={`inmo-order-operacion ${activeDropdown === 'operacion' ? 'inmo-field-active-open' : ''}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  zIndex: activeDropdown === 'operacion' ? 99999 : undefined,
                  overflow: 'visible',
                }}
              >
                <ProfessionalBookingSelect
                  label="Operación"
                  name="property_status"
                  value={propertyStatus}
                  onChange={setPropertyStatus}
                  options={operationOptions}
                  hasCaret={false}
                  accentColor={primaryColor}
                  isOpen={activeDropdown === 'operacion'}
                  onToggle={(open) => setActiveDropdown(open ? 'operacion' : null)}
                />
              </div>
            )}

            {/* 3. Propiedad (Professional Popover Select) */}
            {showPropertyType && (
              <div
                className={`inmo-order-propiedad ${activeDropdown === 'propiedad' ? 'inmo-field-active-open' : ''}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  zIndex: activeDropdown === 'propiedad' ? 99999 : undefined,
                  overflow: 'visible',
                }}
              >
                <ProfessionalBookingSelect
                  label="Propiedad"
                  name="property_type"
                  value={propertyType}
                  onChange={setPropertyType}
                  options={propertyTypeOptions}
                  hasCaret={true}
                  accentColor={primaryColor}
                  isOpen={activeDropdown === 'propiedad'}
                  onToggle={(open) => setActiveDropdown(open ? 'propiedad' : null)}
                />
              </div>
            )}

            {/* 4. Precio (Professional Popover Select con alineación a la derecha para no cortarse) */}
            {showPrice && (
              <div
                className={`inmo-order-precio ${activeDropdown === 'precio' ? 'inmo-field-active-open' : ''}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  zIndex: activeDropdown === 'precio' ? 99999 : undefined,
                  overflow: 'visible',
                }}
              >
                <ProfessionalBookingSelect
                  label="Precio"
                  name="price_max"
                  value={priceMax}
                  onChange={setPriceMax}
                  options={priceOptions}
                  hasCaret={false}
                  accentColor={primaryColor}
                  alignRight={true}
                  isOpen={activeDropdown === 'precio'}
                  onToggle={(open) => setActiveDropdown(open ? 'precio' : null)}
                />
              </div>
            )}

            {/* 5. Botón Buscar */}
            <div className="inmo-order-boton" style={{ position: 'relative', width: '100%' }}>
              <button
                type="submit"
                className="inmo-btn-search"
                style={{ backgroundColor: primaryColor }}
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
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
