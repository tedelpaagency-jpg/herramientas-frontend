'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Estate } from '../types';
import { 
  Building2, 
  MapPin, 
  Eye, 
  Edit3, 
  DollarSign, 
  Maximize2, 
  Bed, 
  Bath, 
  Compass, 
  List, 
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom price pin marker for map
const createPriceMarkerIcon = (estate: Estate, isSelected: boolean) => {
  const price = Number(estate.price || 0);
  const priceLabel = price >= 1000000 
    ? `$${(price / 1000000).toFixed(1)}M` 
    : price >= 1000 
    ? `$${(price / 1000).toFixed(0)}k` 
    : `$${price}`;

  const isAvailable = String(estate.status) === '1' || estate.status === 'available';
  const isReserved = String(estate.status) === '2' || estate.status === 'reserved';
  
  let bgGradient = 'background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);';
  let dotColor = '#10b981'; // green

  if (isSelected) {
    bgGradient = 'background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); border: 2px solid #ffffff; box-shadow: 0 0 15px rgba(79, 70, 229, 0.6);';
  } else if (isReserved) {
    bgGradient = 'background: linear-gradient(135deg, #d97706 0%, #b45309 100%);';
    dotColor = '#fbbf24';
  } else if (!isAvailable) {
    bgGradient = 'background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);';
    dotColor = '#fecdd3';
  }

  const html = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; font-family: system-ui, -apple-system, sans-serif; cursor: pointer; ${isSelected ? 'transform: scale(1.15); z-index: 999;' : ''}">
      <div style="padding: 5px 10px; border-radius: 20px; ${bgGradient} color: white; font-weight: 800; font-size: 11px; white-space: nowrap; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
        <span style="width: 7px; height: 7px; border-radius: 50%; background-color: ${dotColor}; display: inline-block;"></span>
        <span>${priceLabel}</span>
      </div>
      <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid ${isSelected ? '#3b82f6' : isReserved ? '#b45309' : !isAvailable ? '#be123c' : '#1e293b'}; margin-top: -1px;"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-property-marker-icon',
    html: html,
    iconSize: [70, 36],
    iconAnchor: [35, 36],
    popupAnchor: [0, -36],
  });
};

// Helper component to center map on selected estate
function MapCenterer({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { animate: true, duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

interface EstatesMapViewProps {
  estates: Estate[];
  loading?: boolean;
  onSelectCanvaGallery?: (estate: Estate) => void;
}

export const EstatesMapView: React.FC<EstatesMapViewProps> = ({ estates, loading = false, onSelectCanvaGallery }) => {
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filter estates with valid coordinates
  const validEstates = estates.filter(e => e.latitude != null && e.longitude != null);

  // Default center (Guayaquil / Ecuador default if no items)
  const defaultCenter: [number, number] = validEstates.length > 0 && validEstates[0].latitude && validEstates[0].longitude
    ? [validEstates[0].latitude, validEstates[0].longitude]
    : [-1.025452, -79.461677];

  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);

  useEffect(() => {
    if (validEstates.length > 0 && validEstates[0].latitude && validEstates[0].longitude) {
      setMapCenter([validEstates[0].latitude, validEstates[0].longitude]);
    }
  }, [estates]);

  const handleSelectEstate = (estate: Estate) => {
    setSelectedEstate(estate);
    if (estate.latitude && estate.longitude) {
      setMapCenter([estate.latitude, estate.longitude]);
    }
  };

  const getStatusBadge = (status: any) => {
    switch (String(status)) {
      case '1':
      case 'available':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Disponible</span>;
      case '2':
      case 'reserved':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Reservada</span>;
      case '3':
      case 'sold':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">Vendida</span>;
      case '4':
      case 'rented':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Alquilada</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Activo</span>;
    }
  };

  const getImageUrl = (estate: Estate): string => {
    if (estate.image) return estate.image;
    if (Array.isArray(estate.images) && estate.images.length > 0) {
      const first = estate.images[0];
      return typeof first === 'string' ? first : (first as any).image_path || '';
    }
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';
  };

  return (
    <div className="relative w-full h-[650px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-900 flex">
      <style>{`
        .custom-property-marker-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      {/* Sidebar List of Mapped Estates */}
      <div 
        className={`absolute sm:relative z-20 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full sm:translate-x-0 sm:w-12'
        }`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Propiedades en Mapa</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {validEstates.length} ubicaciones registradas
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title={sidebarOpen ? "Ocultar lista" : "Mostrar lista"}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                Cargando ubicaciones...
              </div>
            ) : validEstates.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs font-semibold space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p>No hay propiedades con coordenadas válidas para mostrar en el mapa.</p>
              </div>
            ) : (
              validEstates.map((estate) => {
                const isSelected = selectedEstate?.id === estate.id;
                return (
                  <div
                    key={estate.id}
                    onClick={() => handleSelectEstate(estate)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-xs'
                        : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                      <img
                        src={getImageUrl(estate)}
                        alt={estate.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          {estate.type || 'Inmueble'}
                        </span>
                        {getStatusBadge(estate.status)}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {estate.title}
                      </h4>

                      <p className="text-xs font-black text-slate-900 dark:text-white mt-1">
                        ${(estate.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Main Leaflet Map View */}
      <div className="flex-1 h-full w-full relative z-10">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenterer center={mapCenter} />

          {validEstates.map((estate) => {
            if (!estate.latitude || !estate.longitude) return null;
            const isSelected = selectedEstate?.id === estate.id;
            return (
              <Marker
                key={estate.id}
                position={[estate.latitude, estate.longitude]}
                icon={createPriceMarkerIcon(estate, isSelected)}
                eventHandlers={{
                  click: () => handleSelectEstate(estate),
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="w-64 p-1 space-y-2">
                    <div className="h-32 w-full rounded-xl overflow-hidden relative bg-slate-100">
                      <img
                        src={getImageUrl(estate)}
                        alt={estate.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(estate.status)}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-600">
                        {estate.type || 'Propiedad'}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                        {estate.title}
                      </h4>
                      <p className="text-xs font-black text-slate-900 mt-0.5">
                        ${(estate.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {estate.full_address && (
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{estate.full_address}</span>
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      {onSelectCanvaGallery && (
                        <button
                          type="button"
                          onClick={() => onSelectCanvaGallery(estate)}
                          className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors border border-purple-200 flex items-center justify-center shrink-0"
                          title="Ver Galería Canva 3D"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                        </button>
                      )}
                      <Link
                        href={`/estates/${estate.id}/edit`}
                        className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar Inmueble</span>
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default EstatesMapView;
