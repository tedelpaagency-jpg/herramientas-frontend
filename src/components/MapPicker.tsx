'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { parseCoordinatePair } from '@/utils/coordinateParser';
import { LocateFixed, MapPin } from 'lucide-react';

interface MapPickerProps {
  location: string;
  onLocationChange: (val: string) => void;
}

// Map controller to reposition the viewport whenever coordinates change
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center && isFinite(center[0]) && isFinite(center[1])) {
      map.setView(center, Math.max(map.getZoom(), 15));
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ location, onLocationChange }: MapPickerProps) {
  const defaultCoords: [number, number] = [-1.025452, -79.461677]; // Quevedo default
  const parsed = parseCoordinatePair(location);
  const [position, setPosition] = useState<[number, number]>(parsed || defaultCoords);
  const [locating, setLocating] = useState(false);

  // Sync position whenever external `location` changes
  useEffect(() => {
    const coords = parseCoordinatePair(location);
    if (coords) {
      setPosition(prev => {
        if (Math.abs(prev[0] - coords[0]) > 0.00001 || Math.abs(prev[1] - coords[1]) > 0.00001) {
          return coords;
        }
        return prev;
      });
    }
  }, [location]);

  const markerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const newCoords: [number, number] = [lat, lng];
        setPosition(newCoords);
        onLocationChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      },
    });
    return null;
  };

  const handleGetCurrentLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('La geolocalización no está disponible en este dispositivo.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const newCoords: [number, number] = [lat, lng];
        setPosition(newCoords);
        onLocationChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      },
      (err) => {
        setLocating(false);
        console.warn('Error al obtener ubicación:', err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onLocationChange]);

  const detectedCoords = parseCoordinatePair(location);

  return (
    <div className="relative w-full">
      <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 z-10 relative shadow-sm">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={markerIcon} />
          <MapEvents />
          <MapController center={position} />
        </MapContainer>

        {/* GPS Button */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={locating}
          title="Detectar mi ubicación actual"
          className="absolute top-3 right-3 z-[1000] p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50"
        >
          <LocateFixed className={`w-4 h-4 ${locating ? 'animate-spin text-blue-500' : ''}`} />
        </button>
      </div>

      {detectedCoords && (
        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span className="flex items-center gap-1 font-mono">
            <MapPin className="w-3.5 h-3.5 text-blue-500 inline shrink-0" />
            Detectado: {detectedCoords[0].toFixed(6)}, {detectedCoords[1].toFixed(6)}
          </span>
          <button
            type="button"
            onClick={() => onLocationChange(`${detectedCoords[0].toFixed(6)}, ${detectedCoords[1].toFixed(6)}`)}
            className="text-blue-600 hover:underline font-medium ml-2"
          >
            Formatear a coordenadas
          </button>
        </div>
      )}
    </div>
  );
}
