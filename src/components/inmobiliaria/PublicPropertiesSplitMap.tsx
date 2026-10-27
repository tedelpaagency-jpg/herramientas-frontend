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
  const lat = Number(estate.latitude);
  const lng = Number(estate.longitude);
  if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
    return [lat, lng];
  }
  // Golden ratio spiral distribution around city center
  const angle = (index * 137.5 * Math.PI) / 180;
  const radius = 0.012 + ((index % 6) * 0.007);
  return [
    baseCenter[0] + radius * Math.cos(angle),
    baseCenter[1] + radius * Math.sin(angle) * 1.2,
  ];
};

// Custom HTML price-pill icon matching Image 1 (Airbnb) and Image 2 (Plusvalia) with Emil Kowalski transitions
const createPricePillIcon = (
  estate: PublicEstateItem,
  isSelected: boolean,
  isHovered: boolean
) => {
  const price = Number(estate.price || 0);
  const priceFormatted =
    price >= 1000000
      ? `$${(price / 1000000).toFixed(1)}M`
      : price >= 1000
      ? `$${Math.round(price / 1000)}k`
      : `$${price}`;

  const isDark = isSelected;
  const bg = isDark ? '#0f172a' : isHovered ? '#1e293b' : '#ffffff';
  const text = isDark || isHovered ? '#ffffff' : '#0f172a';
  const border = isDark
    ? '2px solid #ffffff'
    : isHovered
    ? '1.5px solid #0f172a'
    : '1px solid rgba(0, 0, 0, 0.12)';
  const shadow = isDark
    ? '0 8px 24px rgba(15, 23, 42, 0.65)'
    : isHovered
    ? '0 6px 18px rgba(0, 0, 0, 0.25)'
    : '0 2px 8px rgba(0, 0, 0, 0.10)';
  const scale = isSelected ? 'scale(1.2)' : isHovered ? 'scale(1.12)' : 'scale(1)';
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

// Component to fly to selected property coordinates
function MapFlyTo({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, Math.max(map.getZoom(), 14), {
        animate: true,
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }, [coords, map]);
  return null;
}

// Component to auto fit map bounds
function MapBoundsFitter({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      try {
        const bounds = L.latLngBounds(points);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      } catch {
        // Fallback silently
      }
    }
  }, [points, map]);
  return null;
}

export interface PublicPropertiesSplitMapProps {
  estates: PublicEstateItem[];
  agency?: PublicAgencyConfig | null;
  selectedEstate: PublicEstateItem | null;
  hoveredEstateId: number | null;
  onSelectEstate: (estate: PublicEstateItem | null) => void;
  domainParam?: string | null;
}

export const PublicPropertiesSplitMap: React.FC<PublicPropertiesSplitMapProps> = ({
  estates,
  agency,
  selectedEstate,
  hoveredEstateId,
  onSelectEstate,
  domainParam,
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
    return Array.from(estateCoords.values());
  }, [estateCoords]);

  const initialCenter: [number, number] = allPoints[0] || [-0.9677, -80.7089];

  // Carousel index for floating card
  const [floatingCardImgIdx, setFloatingCardImgIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Close floating card on Escape key (a11y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEstate) {
        onSelectEstate(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEstate, onSelectEstate]);

  // Reset image index when selected estate changes
  useEffect(() => {
    setFloatingCardImgIdx(0);
    setIsFavorite(false);
  }, [selectedEstate?.id]);

  const selectedImages = selectedEstate ? getEstateImages(selectedEstate) : [];
  const selectedCoords = selectedEstate ? estateCoords.get(selectedEstate.id) || null : null;

  // Contact info for WhatsApp
  const whatsappNumber =
    selectedEstate?.agency?.whatsapp ||
    selectedEstate?.agency?.phone ||
    agency?.whatsapp ||
    agency?.phone ||
    '';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappMsg = selectedEstate
    ? encodeURIComponent(
        `Hola, me interesa la propiedad "${selectedEstate.title}" (Ref: #${selectedEstate.id}) que vi en el catálogo.`
      )
    : '';
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${whatsappMsg}`
    : '#';

  const detailHref = selectedEstate
    ? `/properties/${encodeURIComponent(selectedEstate.slug || String(selectedEstate.id))}${
        domainParam ? `?domain=${encodeURIComponent(domainParam)}` : ''
      }`
    : '#';

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg">
      <MapContainer
        center={initialCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
      >
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
          const icon = createPricePillIcon(estate, isSelected, isHovered);

          return (
            <Marker
              key={estate.id}
              position={coords}
              icon={icon}
              eventHandlers={{
                click: () => {
                  onSelectEstate(estate);
                },
              }}
            />
          );
        })}
      </MapContainer>

      {/* Floating Preview Card estilo Plusvalia (Imagen 2) con Emil Kowalski Craft */}
      {selectedEstate && (
        <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:w-[360px] z-[1000] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.22)] border border-slate-200/90 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-3 duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {/* Header con agencia y botones superiores */}
          <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 truncate">
              Publicado por{' '}
              <strong className="text-slate-900 font-extrabold">
                {selectedEstate.agency?.name || agency?.name || 'Inmobiliaria Verificada'}
              </strong>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsFavorite((prev) => !prev)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 active:scale-90 transition-all duration-150 cursor-pointer"
                aria-label="Favorito"
              >
                <Heart
                  className={`w-4 h-4 transition-transform duration-150 ${
                    isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => onSelectEstate(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 active:scale-90 text-slate-700 flex items-center justify-center transition-all duration-150 cursor-pointer"
                aria-label="Cerrar vista previa (Esc)"
                title="Cerrar (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carrusel de fotos de la tarjeta flotante */}
          <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
            <Link href={detailHref} className="block w-full h-full">
              <img
                src={selectedImages[floatingCardImgIdx]}
                alt={selectedEstate.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </Link>

            {selectedImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFloatingCardImgIdx((prev) =>
                      (prev - 1 + selectedImages.length) % selectedImages.length
                    );
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 active:scale-90 text-white flex items-center justify-center backdrop-blur-xs transition-all duration-150"
                  aria-label="Foto previa"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFloatingCardImgIdx((prev) => (prev + 1) % selectedImages.length);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 active:scale-90 text-white flex items-center justify-center backdrop-blur-xs transition-all duration-150"
                  aria-label="Siguiente foto"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Puntos de fotos expansibles tipo cápsula */}
                <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
                  {selectedImages.slice(0, 5).map((_, idx) => (
                    <span
                      key={idx}
                      className={`rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        idx === floatingCardImgIdx
                          ? 'w-4 h-1.5 bg-white shadow-sm'
                          : 'w-1.5 h-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Información y detalles de la propiedad (Estilo Imagen 2) */}
          <div className="p-4 space-y-3">
            {/* Precio grande destacado: USD 850 */}
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                USD {Number(selectedEstate.price || 0).toLocaleString('en-US')}
              </span>
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-full">
                {Number(selectedEstate.property_status) === 1 ? 'Alquiler' : 'Venta'}
              </span>
            </div>

            {/* Especificaciones con Iconografía */}
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedEstate.covered_area || selectedEstate.size || 78} m² tot.</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedEstate.bathrooms || 1} ba.</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedEstate.bedrooms || 3} hab.</span>
              </span>
            </div>

            {/* Título o sector */}
            <Link
              href={detailHref}
              className="block text-sm font-extrabold text-slate-900 hover:text-blue-600 truncate transition-colors"
            >
              {selectedEstate.title || selectedEstate.address || 'Gran Albocentro'}
            </Link>

            {/* Botones de acción con respuesta táctil active:scale-[0.98] */}
            <div className="pt-1 grid grid-cols-2 gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] hover:scale-[1.01] text-white text-xs font-black shadow-md hover:shadow-emerald-500/25 transition-all duration-150"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>

              <Link
                href={detailHref}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#FF5A00] hover:bg-[#e04f00] active:scale-[0.98] hover:scale-[1.01] text-white text-xs font-black shadow-md hover:shadow-orange-500/25 transition-all duration-150"
              >
                <Mail className="w-4 h-4" />
                <span>Contactar</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicPropertiesSplitMap;
