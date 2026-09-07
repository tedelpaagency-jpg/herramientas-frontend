'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AcmZone } from '../../types/acm';

interface AcmZoneDrawerMapProps {
  zones: AcmZone[];
  currentVertices: Array<{ lat: number; lng: number }>;
  onVerticesChange: (vertices: Array<{ lat: number; lng: number }>) => void;
  selectedColor?: string;
  isDrawing?: boolean;
}

const pointIcon = L.divIcon({
  className: 'custom-vertex-icon',
  html: `<div style="background-color: #00a884; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

export default function AcmZoneDrawerMap({
  zones,
  currentVertices,
  onVerticesChange,
  selectedColor = '#00a884',
  isDrawing = true,
}: AcmZoneDrawerMapProps) {
  const defaultCenter: [number, number] = currentVertices.length > 0
    ? [currentVertices[0].lat, currentVertices[0].lng]
    : zones.length > 0 && zones[0].coordinates?.length > 0
    ? [zones[0].coordinates[0].lat, zones[0].coordinates[0].lng]
    : [-1.0227, -79.4623]; // Quevedo / Ecuador Default Center

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!isDrawing) return;
        const { lat, lng } = e.latlng;
        onVerticesChange([...currentVertices, { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) }]);
      },
    });
    return null;
  };

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-10">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Existing Saved Zones Polygons */}
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
                fillOpacity: 0.25,
                weight: 2,
              }}
            >
              <Tooltip permanent={false} direction="top">
                <div className="text-xs font-bold p-1">
                  <p className="text-slate-800">{zone.name}</p>
                  <p className="text-[#00a884]">${zone.suggested_suelo}/m² (Suelo)</p>
                  <p className="text-blue-600">${zone.suggested_construccion}/m² (Const.)</p>
                </div>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* Current Active Polygon being Drawn */}
        {currentVertices.length > 0 && (
          <>
            {currentVertices.length >= 3 && (
              <Polygon
                positions={currentVertices.map((v) => [v.lat, v.lng])}
                pathOptions={{
                  color: selectedColor,
                  fillColor: selectedColor,
                  fillOpacity: 0.4,
                  weight: 3,
                  dashArray: '5, 5',
                }}
              />
            )}
            {currentVertices.map((v, idx) => (
              <Marker key={idx} position={[v.lat, v.lng]} icon={pointIcon} />
            ))}
          </>
        )}

        <MapClickHandler />
      </MapContainer>

      {/* Floating Instructions Banner */}
      {isDrawing && (
        <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-md text-xs font-medium text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {currentVertices.length < 3
            ? `Haz clic en el mapa para marcar los vértices (${currentVertices.length}/3 puntos mín.)`
            : `Polígono activo con ${currentVertices.length} vértices. Haz clic para añadir más.`}
        </div>
      )}
    </div>
  );
}
