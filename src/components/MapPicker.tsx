'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapPickerProps {
  location: string;
  onLocationChange: (val: string) => void;
}

export default function MapPicker({ location, onLocationChange }: MapPickerProps) {
  const defaultPosition = location && location.includes(',') && !location.includes('http')
    ? (location.split(',').map(coord => parseFloat(coord.trim())) as [number, number])
    : [-1.025452, -79.461677] as [number, number];

  const [position, setPosition] = useState<[number, number]>(defaultPosition);

  const markerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationChange(`${lat.toFixed(6)},${lng.toFixed(6)}`);
      },
    });
    return null;
  };

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-200 z-10 relative">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon} />
        <MapEvents />
      </MapContainer>
    </div>
  );
}
