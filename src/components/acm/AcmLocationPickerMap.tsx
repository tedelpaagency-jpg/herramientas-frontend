'use client';

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AcmZone } from '../../types/acm';

interface AcmLocationPickerMapProps {
  lat: number | null;
  lng: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  zones?: AcmZone[];
}

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function AcmLocationPickerMap({
  lat,
  lng,
  onLocationChange,
  zones = [],
}: AcmLocationPickerMapProps) {
  const currentPosition: [number, number] = useMemo(() => {
    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
    return [-1.0227, -79.4623]; // Default Quevedo/Ecuador center
  }, [lat, lng]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const newLat = parseFloat(e.latlng.lat.toFixed(6));
        const newLng = parseFloat(e.latlng.lng.toFixed(6));
        onLocationChange(newLat, newLng);
      },
    });
    return null;
  };

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-10">
      <MapContainer
        center={currentPosition}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Existing Valuation Zones for Visual Context */}
        {zones.map((zone) => {
          if (!zone.coordinates || zone.coordinates.length < 3) return null;
          const positions: [number, number][] = zone.coordinates.map((c) => [c.lat, c.lng]);
          const color = zone.color || '#3b82f6';

          return (
            <Polygon
              key={zone.id}
              positions={positions}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.15,
                weight: 1.5,
              }}
            >
              <Tooltip permanent={false} direction="top">
                <div className="text-xs font-bold p-1">
                  <p className="text-slate-800">{zone.name}</p>
                </div>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* Interactive Pin Marker */}
        {lat !== null && lng !== null && (
          <Marker
            position={[lat, lng]}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{
              dragend(e) {
                const marker = e.target;
                const position = marker.getLatLng();
                const newLat = parseFloat(position.lat.toFixed(6));
                const newLng = parseFloat(position.lng.toFixed(6));
                onLocationChange(newLat, newLng);
              },
            }}
          />
        )}

        <MapClickHandler />
      </MapContainer>

      {/* Helper Banner */}
      <div className="absolute top-2 left-2 z-[1000] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200 shadow-sm text-[11px] font-medium text-slate-700">
        📌 Haz clic o arrastra el pin para ubicar la propiedad manualmente
      </div>
    </div>
  );
}
