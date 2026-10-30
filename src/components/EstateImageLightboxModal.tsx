'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ExternalLink, 
  Download,
  Building2,
  MapPin,
  Tag,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import { Estate } from '../types';
import Portal from './Portal';

interface EstateImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  estate: Estate | null;
  initialImageIndex?: number;
}

interface ImageItem {
  id: number | string;
  url: string;
  title?: string;
}

export const EstateImageLightboxModal: React.FC<EstateImageLightboxModalProps> = ({
  isOpen,
  onClose,
  estate,
  initialImageIndex = 0,
}) => {
  // Extract all images from the estate
  const images: ImageItem[] = React.useMemo(() => {
    if (!estate) return [];
    const list: ImageItem[] = [];
    const seen = new Set<string>();

    // 1. Check estate.images array
    if (Array.isArray(estate.images) && estate.images.length > 0) {
      estate.images.forEach((img: any, idx: number) => {
        const url = typeof img === 'string' ? img : (img.image_path || img.url || '');
        if (url && !seen.has(url)) {
          seen.add(url);
          list.push({
            id: typeof img === 'object' && img.id ? img.id : `img-${idx}`,
            url,
            title: typeof img === 'object' && img.title ? img.title : `${estate.title} - Foto ${idx + 1}`,
          });
        }
      });
    }

    // 2. Check main estate.image
    if ((estate as any).image && !seen.has((estate as any).image)) {
      seen.add((estate as any).image);
      list.unshift({
        id: 'main-image',
        url: (estate as any).image,
        title: `${estate.title} - Foto Principal`,
      });
    }

    return list;
  }, [estate]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Sync index when modal opens or initial index changes
  useEffect(() => {
    if (isOpen) {
      const validIndex = initialImageIndex >= 0 && initialImageIndex < images.length ? initialImageIndex : 0;
      setCurrentIndex(validIndex);
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialImageIndex, images.length]);

  // Reset zoom on slide change
  const handleIndexChange = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((prev) => Math.min(prev + 0.25, 3));
      } else if (e.key === '-') {
        setZoomLevel((prev) => {
          const next = Math.max(prev - 0.25, 1);
          if (next === 1) setPanPosition({ x: 0, y: 0 });
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.25, 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const activeImage = images[currentIndex];

  if (!isOpen || !estate) return null;

  return (
    <Portal>
      <AnimatePresence>
        <div className="fixed inset-0 z-[120] w-screen h-screen flex flex-col justify-between select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl"
          aria-hidden="true"
        />

        {/* Top Header Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="relative z-20 w-full px-4 sm:px-6 py-3.5 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between gap-4"
        >
          {/* Property Info Badges */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-lg">
              <Building2 className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate max-w-md">
                  {estate.title}
                </h3>
                {estate.type && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {estate.type}
                  </span>
                )}
                {estate.price != null && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ${Number(estate.price).toLocaleString()} {estate.currency || 'USD'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 truncate">
                {estate.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{estate.city}{estate.state ? `, ${estate.state}` : ''}</span>
                  </span>
                )}
                {images.length > 0 && (
                  <span className="text-slate-500">
                    • Fotografía {currentIndex + 1} de {images.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800/80 backdrop-blur-md rounded-xl p-1 border border-slate-700/60 shadow-md">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/60 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors"
                title="Reducir zoom (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-2 py-1 text-xs font-mono font-bold text-slate-300 hover:text-white transition-colors"
                title="Restablecer zoom (100%)"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/60 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors"
                title="Aumentar zoom (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Open Image in New Tab */}
            {activeImage?.url && (
              <a
                href={activeImage.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Abrir imagen original en nueva pestaña"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden md:inline">Ver Original</span>
              </a>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-100 border border-rose-500/30 flex items-center justify-center transition-colors shadow-md"
              title="Cerrar (Esc)"
              aria-label="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Central Image Viewer Area */}
        <div 
          className="relative z-10 flex-1 flex items-center justify-center overflow-hidden px-4 sm:px-16 py-2"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
        >
          {/* Previous Arrow Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-6 z-30 p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md border border-white/10 hover:border-blue-400 shadow-2xl transition-all duration-200 active:scale-90"
              title="Foto anterior (←)"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Active Image Canvas */}
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            {activeImage?.url ? (
              <motion.img
                key={activeImage.url}
                src={activeImage.url}
                alt={activeImage.title || estate.title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ 
                  opacity: 1, 
                  scale: zoomLevel,
                  x: panPosition.x,
                  y: panPosition.y
                }}
                transition={{ duration: 0.2 }}
                className="max-h-[72vh] sm:max-h-[76vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl transition-transform"
                style={{
                  willChange: 'transform',
                  userSelect: 'none',
                }}
                draggable={false}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 p-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                <ImageIcon className="w-16 h-16 mb-2 stroke-1" />
                <span className="text-sm font-semibold">Sin imagen disponible</span>
              </div>
            )}
          </div>

          {/* Next Arrow Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-6 z-30 p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md border border-white/10 hover:border-blue-400 shadow-2xl transition-all duration-200 active:scale-90"
              title="Foto siguiente (→)"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* Bottom Thumbnail Strip Bar */}
        {images.length > 1 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative z-20 w-full px-4 py-3 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent flex items-center justify-center"
          >
            <div className="flex items-center gap-2 max-w-full overflow-x-auto py-1 px-2 custom-scrollbar">
              {images.map((img, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => handleIndexChange(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                      isActive 
                        ? 'border-blue-500 ring-2 ring-blue-500/40 scale-105 shadow-lg' 
                        : 'border-slate-800/80 hover:border-slate-600 opacity-60 hover:opacity-100'
                    }`}
                    title={img.title || `Foto ${idx + 1}`}
                  >
                    <img
                      src={img.url}
                      alt={img.title || ''}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-[9px] font-black text-white text-center py-0.5 uppercase tracking-wider">
                        {idx + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
    </Portal>
  );
};

export default EstateImageLightboxModal;
