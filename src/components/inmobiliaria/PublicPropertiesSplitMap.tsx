'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  MessageCircle,
  Maximize2,
  Bed,
  Bath,
} from 'lucide-react';
import {
  PublicAgencyConfig,
  PublicEstateItem,
} from '@/services/publicInmobiliariaService';
import { getEstateImages } from './AirbnbPropertyCard';

// Deterministic GPS coordinator so every property has a pin even if GPS is unpopulated in DB
export const resolveEstateGPS = (
  estate: PublicEstateItem,
  index: number = 0,
  baseCenter: [number, number] = [-0.9677, -80.7089] // Manta / Guayaquil default
): [number, number] => {
  const lat = parseFloat(String(estate?.latitude));
  const lng = parseFloat(String(estate?.longitude));
  if (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat !== 0 &&
    lng !== 0 &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  ) {
    return [lat, lng];
  }
  const safeBaseLat = Number.isFinite(baseCenter?.[0]) ? baseCenter[0] : -0.9677;
  const safeBaseLng = Number.isFinite(baseCenter?.[1]) ? baseCenter[1] : -80.7089;
  const safeIdx = Number(index) || 0;
  // Golden ratio spiral distribution around city center
  const angle = (safeIdx * 137.5 * Math.PI) / 180;
  const radius = 0.012 + ((safeIdx % 6) * 0.007);
  const resLat = Number((safeBaseLat + radius * Math.cos(angle)).toFixed(6));
  const resLng = Number((safeBaseLng + radius * Math.sin(angle) * 1.2).toFixed(6));
  return [
    Number.isFinite(resLat) ? resLat : -0.9677,
    Number.isFinite(resLng) ? resLng : -80.7089,
  ];
};

// Custom HTML price-pill icon matching Airbnb & Plusvalia with Emil Kowalski transitions
const createPricePillIcon = (
  estate: PublicEstateItem,
  isSelected: boolean,
  isHovered: boolean,
  agency?: PublicAgencyConfig | null
) => {
  const price = Number(estate.price || 0);
  const priceFormatted =
    price >= 1000000
      ? `$${(price / 1000000).toFixed(1)}M`
      : price >= 1000
      ? `$${Math.round(price / 1000)}k`
      : `$${price}`;

  const defaultBg = agency?.details?.map_pin_bg_color || '#ffffff';
  const defaultText = agency?.details?.map_pin_text_color || '#0f172a';
  const activeBg =
    agency?.details?.map_pin_active_bg_color || agency?.primary_color || '#0f172a';
  const activeText = agency?.details?.map_pin_active_text_color || '#ffffff';

  const isDark = isSelected;
  const bg = isDark ? activeBg : isHovered ? activeBg : defaultBg;
  const text = isDark ? activeText : isHovered ? activeText : defaultText;
  const border = isDark
    ? `2px solid ${activeText === '#ffffff' ? '#ffffff' : activeBg}`
    : isHovered
    ? `1.5px solid ${activeBg}`
    : '1px solid rgba(0, 0, 0, 0.12)';
  const shadow = isDark
    ? '0 8px 24px rgba(15, 23, 42, 0.50)'
    : isHovered
    ? '0 6px 18px rgba(0, 0, 0, 0.22)'
    : '0 2px 8px rgba(0, 0, 0, 0.10)';
  const scale = isSelected ? 'scale(1.15)' : isHovered ? 'scale(1.08)' : 'scale(1)';
  const zIndex = isSelected ? 9999 : isHovered ? 999 : 100;

  const html = `
    <div style="position: relative; display: inline-flex; align-items: center; justify-content: center; transform: ${scale}; z-index: ${zIndex}; transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;">
      <div style="background: ${bg}; color: ${text}; border: ${border}; box-shadow: ${shadow}; padding: 6px 12px; border-radius: 9999px; font-weight: 800; font-size: 11.5px; line-height: 1; letter-spacing: -0.01em; white-space: nowrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ${priceFormatted} USD
      </div>
      <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 4px solid ${bg}; position: absolute; bottom: -3px; left: 50%; transform: translateX(-50%);"></div>
    </div>
  `;

  return L.divIcon({
    className: 'leaflet-price-pill-wrapper',
    html: html,
    iconSize: [84, 30],
    iconAnchor: [42, 30],
  });
};

// Error Boundary to prevent Leaflet runtime quirks from crashing the Next.js page
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('[MapErrorBoundary] Suppressed map render issue:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 p-6 text-center">
          <span className="text-xs font-bold text-slate-700">Mapa temporalmente no disponible</span>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-xs text-blue-600 font-semibold underline cursor-pointer"
          >
            Reintentar cargar mapa
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Component to invalidate size when container size changes
function MapResizer({ viewMode }: { viewMode?: string }) {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    const invalidate = () => {
      try {
        const size = map.getSize();
        if (size && size.x > 20 && size.y > 20) {
          map.invalidateSize({ pan: false, debounceMoveend: true });
        }
      } catch {}
    };

    const timer1 = setTimeout(invalidate, 50);
    const timer2 = setTimeout(invalidate, 200);
    const timer3 = setTimeout(invalidate, 500);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        invalidate();
      });
      ro.observe(container);
      if (container.parentElement) {
        ro.observe(container.parentElement);
      }
    }

    window.addEventListener('resize', invalidate);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      ro?.disconnect();
      window.removeEventListener('resize', invalidate);
    };
  }, [map, viewMode]);
  return null;
}

// Component to fly to selected property coordinates
function MapFlyTo({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!coords) return;
    try {
      const size = map.getSize();
      if (!size || size.x <= 20 || size.y <= 20) return;

      if (
        Array.isArray(coords) &&
        coords.length === 2 &&
        Number.isFinite(coords[0]) &&
        Number.isFinite(coords[1]) &&
        Math.abs(coords[0]) <= 90 &&
        Math.abs(coords[1]) <= 180
      ) {
        map.flyTo(coords, Math.max(map.getZoom(), 14), {
          animate: true,
          duration: 0.8,
          easeLinearity: 0.25,
        });
      }
    } catch (err) {
      console.warn('MapFlyTo error ignored:', err);
    }
  }, [coords, map]);
  return null;
}

// Component to auto fit map bounds
function MapBoundsFitter({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    try {
      const size = map.getSize();
      if (!size || size.x <= 20 || size.y <= 20) return;

      const validPoints = (points || []).filter(
        (p) =>
          Array.isArray(p) &&
          p.length === 2 &&
          Number.isFinite(p[0]) &&
          Number.isFinite(p[1]) &&
          Math.abs(p[0]) <= 90 &&
          Math.abs(p[1]) <= 180
      );
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      }
    } catch (err) {
      console.warn('MapBoundsFitter error ignored:', err);
    }
  }, [points, map]);
  return null;
}

// Controller to safely manage scroll wheel zoom without hijacking page/catalog scrolling
function MapInteractionController() {
  const map = useMap();
  useEffect(() => {
    // Disable scroll wheel zoom by default so user can scroll page/cards freely
    map.scrollWheelZoom.disable();

    const container = map.getContainer();
    const handleFocus = () => {
      map.scrollWheelZoom.enable();
    };
    const handleBlur = () => {
      map.scrollWheelZoom.disable();
    };

    container.addEventListener('click', handleFocus);
    container.addEventListener('mouseleave', handleBlur);

    return () => {
      container.removeEventListener('click', handleFocus);
      container.removeEventListener('mouseleave', handleBlur);
    };
  }, [map]);
  return null;
}

// Custom Zoom Controls with Emil Kowalski Micro-interactions
function MapZoomButtons() {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto', margin: '14px', zIndex: 1000 }}>
      <div className="flex flex-col rounded-xl shadow-md overflow-hidden bg-white/95 backdrop-blur-xs border border-slate-200">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            map.zoomIn();
          }}
          aria-label="Acercar mapa"
          className="w-9 h-9 flex items-center justify-center font-bold text-lg text-slate-800 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer border-b border-slate-100"
        >
          +
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            map.zoomOut();
          }}
          aria-label="Alejar mapa"
          className="w-9 h-9 flex items-center justify-center font-bold text-lg text-slate-800 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
        >
          &minus;
        </button>
      </div>
    </div>
  );
}

// Handler to close card when tapping map background
function MapBackgroundClickHandler({ onMapClick }: { onMapClick: () => void }) {
  const map = useMap();
  useEffect(() => {
    const handleMapClick = () => {
      onMapClick();
    };
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onMapClick]);
  return null;
}

// Compact card anchored directly BELOW the tapped price bubble (Airbnb style)
function AnchoredMapPropertyCard({
  estate,
  coords,
  onClose,
  agency,
  domainParam,
}: {
  estate: PublicEstateItem;
  coords: [number, number];
  onClose: () => void;
  agency?: PublicAgencyConfig | null;
  domainParam?: string | null;
}) {
  const map = useMap();
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 400,
    height: 500,
  });
  const [imgIdx, setImgIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Sync pixel coordinates with map moves/zooms/resizes
  useEffect(() => {
    const update = () => {
      try {
        const pt = map.latLngToContainerPoint(coords);
        setPoint({ x: pt.x, y: pt.y });
        const container = map.getContainer();
        if (container) {
          setContainerSize({
            width: container.clientWidth,
            height: container.clientHeight,
          });
        }
      } catch {}
    };

    update();
    map.on('move', update);
    map.on('zoom', update);
    map.on('viewreset', update);
    map.on('resize', update);

    return () => {
      map.off('move', update);
      map.off('zoom', update);
      map.off('viewreset', update);
      map.off('resize', update);
    };
  }, [map, coords]);

  // Prevent clicks or drags inside the card from propagating to the Leaflet map
  useEffect(() => {
    if (cardRef.current) {
      L.DomEvent.disableClickPropagation(cardRef.current);
      L.DomEvent.disableScrollPropagation(cardRef.current);
    }
  }, []);

  // When card appears, ensure it is comfortably in view without hiding below viewport edge
  useEffect(() => {
    try {
      const container = map.getContainer();
      if (!container) return;
      const h = container.clientHeight;
      const pt = map.latLngToContainerPoint(coords);
      // Card is ~240px tall and sits below the pin (at pt.y + 6)
      if (pt.y + 250 > h) {
        map.panBy([0, pt.y + 250 - h + 24], { animate: true, duration: 0.3 });
      } else if (pt.y < 40) {
        map.panBy([0, pt.y - 60], { animate: true, duration: 0.3 });
      }
    } catch {}
  }, [map, coords]);

  // Reset img index when estate changes
  useEffect(() => {
    setImgIdx(0);
    setIsFavorite(false);
  }, [estate.id]);

  const images = useMemo(() => getEstateImages(estate), [estate]);

  if (!point) return null;

  const cardWidth = containerSize.width < 340 ? 220 : 250;
  const halfCard = cardWidth / 2;
  const padding = 10;

  // Clamp horizontal position so the card never overflows map boundaries
  let left = point.x - halfCard;
  if (left < padding) {
    left = padding;
  } else if (left + cardWidth > containerSize.width - padding) {
    left = containerSize.width - cardWidth - padding;
  }

  // Calculate arrow pointer position relative to card left so it always points to the pin above
  const arrowLeft = Math.max(16, Math.min(cardWidth - 16, point.x - left));

  const detailHref = `/properties/${encodeURIComponent(estate.slug || String(estate.id))}${
    domainParam ? `?domain=${encodeURIComponent(domainParam)}` : ''
  }`;

  const bedrooms = estate.bedrooms || 1;
  const bathrooms = estate.bathrooms || 1;
  const area = estate.covered_area || estate.size || 80;
  const isRental = Number(estate.property_status) === 1;

  return (
    <div
      ref={cardRef}
      style={{
        position: 'absolute',
        top: `${point.y + 6}px`,
        left: `${left}px`,
        width: `${cardWidth}px`,
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
      className="flex flex-col bg-white rounded-2xl shadow-[0_12px_36px_rgba(15,23,42,0.22)] border border-slate-200/90 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-180 ease-out select-none"
    >
      {/* Little arrow at the top pointing up to the price bubble */}
      <div
        style={{ left: `${arrowLeft}px` }}
        className="absolute -top-1.5 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 z-20 pointer-events-none"
      />

      {/* Photo with mini carousel & close button */}
      <div className="relative h-28 sm:h-32 w-full bg-slate-100 overflow-hidden shrink-0 group/cardimg">
        <Link href={detailHref} className="block w-full h-full">
          <img
            src={images[imgIdx]}
            alt={estate.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover/cardimg:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Top bar over photo: Status / Heart / Close button */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          <span
            className="pointer-events-auto px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-white shadow-xs"
            style={{ backgroundColor: agency?.primary_color || '#00a884' }}
          >
            {isRental ? 'Alquiler' : 'Venta'}
          </span>

          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite((prev) => !prev);
              }}
              className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 active:scale-90 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
              aria-label="Favorito"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 active:scale-90 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
              aria-label="Cerrar vista previa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Carousel arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx((prev) => (prev - 1 + images.length) % images.length);
              }}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/55 hover:bg-black/80 active:scale-90 text-white flex items-center justify-center backdrop-blur-xs transition-all z-10 cursor-pointer"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx((prev) => (prev + 1) % images.length);
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/55 hover:bg-black/80 active:scale-90 text-white flex items-center justify-center backdrop-blur-xs transition-all z-10 cursor-pointer"
              aria-label="Siguiente foto"
            >
              <ChevronRight className="w-3 h-3" />
            </button>

            {/* Carousel dots */}
            <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-1 pointer-events-none z-10">
              {images.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-full transition-all duration-200 ${
                    idx === imgIdx ? 'w-3 h-1 bg-white shadow-xs' : 'w-1 h-1 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Info (Foto, Titulo, 1 linea de detalle, Precio) */}
      <Link href={detailHref} className="p-2.5 block hover:bg-slate-50/60 transition-colors">
        {/* Titulo (1 linea) */}
        <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">
          {estate.title || estate.address || 'Propiedad'}
        </h4>

        {/* 1 linea de detalle */}
        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
          {bedrooms} hab · {bathrooms} ba · {area} m²{estate.city ? ` · ${estate.city}` : ''}
        </p>

        {/* Precio */}
        <div className="mt-1.5 flex items-baseline justify-between gap-1">
          <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            USD {Number(estate.price || 0).toLocaleString('en-US')}
            {isRental && <span className="text-[10px] font-semibold text-slate-500 ml-0.5">/ mes</span>}
          </span>
          <span
            style={{ color: agency?.primary_color || '#FF5A00' }}
            className="text-[10px] font-black hover:underline inline-flex items-center gap-0.5"
          >
            Ver &rarr;
          </span>
        </div>
      </Link>
    </div>
  );
}

export interface PublicPropertiesSplitMapProps {
  estates: PublicEstateItem[];
  agency?: PublicAgencyConfig | null;
  selectedEstate: PublicEstateItem | null;
  hoveredEstateId: number | null;
  onSelectEstate: (estate: PublicEstateItem | null) => void;
  domainParam?: string | null;
  viewMode?: string;
}

export const PublicPropertiesSplitMap: React.FC<PublicPropertiesSplitMapProps> = ({
  estates,
  agency,
  selectedEstate,
  hoveredEstateId,
  onSelectEstate,
  domainParam,
  viewMode,
}) => {
  // Map of estateId to GPS coords
  const estateCoords = useMemo(() => {
    const map = new Map<number, [number, number]>();
    const baseCenter: [number, number] = [-0.9677, -80.7089]; // Default Ecuador (Manta / Guayas)
    estates.forEach((estate, idx) => {
      map.set(estate.id, resolveEstateGPS(estate, idx, baseCenter));
    });
    return map;
  }, [estates]);

  const allPoints = useMemo(() => {
    return Array.from(estateCoords.values()).filter(
      (p) =>
        Array.isArray(p) &&
        p.length === 2 &&
        Number.isFinite(p[0]) &&
        Number.isFinite(p[1]) &&
        Math.abs(p[0]) <= 90 &&
        Math.abs(p[1]) <= 180
    );
  }, [estateCoords]);

  const initialCenter: [number, number] = allPoints[0] || [-0.9677, -80.7089];

  // Close card on Escape key (a11y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEstate) {
        onSelectEstate(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEstate, onSelectEstate]);

  const selectedCoords = selectedEstate ? estateCoords.get(selectedEstate.id) || null : null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100">
      <MapErrorBoundary>
        <MapContainer
          center={initialCenter}
          zoom={13}
          scrollWheelZoom={false}
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
          className="w-full h-full"
        >
          <MapResizer viewMode={viewMode} />
          <MapInteractionController />
          <MapZoomButtons />
          <MapBackgroundClickHandler onMapClick={() => onSelectEstate(null)} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBoundsFitter points={allPoints} />
          <MapFlyTo coords={selectedCoords} />

          {estates.map((estate) => {
            const coords = estateCoords.get(estate.id);
            if (!coords) return null;
            const isSelected = selectedEstate?.id === estate.id;
            const isHovered = hoveredEstateId === estate.id;
            const icon = createPricePillIcon(estate, isSelected, isHovered, agency);

            return (
              <Marker
                key={estate.id}
                position={coords}
                icon={icon}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    onSelectEstate(estate);
                  },
                }}
              />
            );
          })}

          {/* Compact Card anchored directly BELOW the tapped price bubble (Airbnb style) */}
          {selectedEstate && selectedCoords && (
            <AnchoredMapPropertyCard
              estate={selectedEstate}
              coords={selectedCoords}
              onClose={() => onSelectEstate(null)}
              agency={agency}
              domainParam={domainParam}
            />
          )}
        </MapContainer>
      </MapErrorBoundary>
    </div>
  );
};

export default PublicPropertiesSplitMap;
