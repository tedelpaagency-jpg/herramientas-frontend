'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { resolveEstateCoordinates } from '@/utils/coordinateParser';

interface PublicPropertyMapViewProps {
  estate: any;
  primaryColor?: string;
}

// Helper to center the map when coords change
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

export function parseCoordinates(estate: any): [number, number] | null {
  return resolveEstateCoordinates(estate);
}

export const PublicPropertyMapView: React.FC<PublicPropertyMapViewProps> = ({
  estate,
  primaryColor = '#00a884',
}) => {
  const coords = parseCoordinates(estate);
  const defaultFallbackCoords: [number, number] = [-1.025452, -79.461677];
  const centerCoords = coords || defaultFallbackCoords;

  const address =
    estate?.full_address ||
    estate?.address ||
    [estate?.neighborhood, estate?.province, estate?.country].filter(Boolean).join(', ') ||
    'Ubicación disponible para visitas';

  const priceFormatted = Number(estate?.price || 0).toLocaleString('en-US');
  const googleMapsUrl = coords
    ? `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  // Custom Styled DivIcon
  const customIcon = L.divIcon({
    className: 'public-property-map-pin',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
        <div style="background: ${primaryColor}; color: white; padding: 6px 12px; border-radius: 9999px; font-weight: 800; font-size: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.25); border: 2px solid white; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #ffffff; display: inline-block;"></span>
          <span>$ ${priceFormatted}</span>
        </div>
        <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 8px solid ${primaryColor}; margin-top: -1px;"></div>
      </div>
    `,
    iconSize: [0, 0],
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Ubicación del Inmueble</h3>
            <p className="text-xs text-slate-500 font-medium">{address}</p>
          </div>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[38px] rounded-xl text-xs font-black text-white shadow-xs hover:opacity-95 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Cómo llegar</span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </a>
      </div>

      {/* Mapa Interactivo a Ancho Completo */}
      <div className="w-full h-[380px] sm:h-[450px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
        <MapContainer
          center={centerCoords}
          zoom={coords ? 15 : 12}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeView center={centerCoords} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {coords && (
            <Marker position={coords} icon={customIcon}>
              <Popup className="rounded-xl overflow-hidden">
                <div className="p-1 max-w-[220px]">
                  <p className="font-extrabold text-xs text-slate-900 mb-1">{estate.title}</p>
                  <p className="text-[11px] font-bold text-slate-600 mb-1">$ {priceFormatted}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{address}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default PublicPropertyMapView;
