'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Maximize2, 
  Image as ImageIcon, 
  LayoutTemplate,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Estate } from '../types';
import toast from 'react-hot-toast';

interface EstateCanvaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  estate: Estate | null;
  onDownloadPdf?: () => void;
  onCopyWhatsApp?: () => void;
}

export const EstateCanvaGalleryModal: React.FC<EstateCanvaGalleryModalProps> = ({
  isOpen,
  onClose,
  estate,
  onDownloadPdf,
  onCopyWhatsApp,
}) => {
  if (!isOpen || !estate) return null;

  // Extract all property images into formatted gallery list
  const extractImages = (): { id: number; url: string; title: string; category: string }[] => {
    const list: { id: number; url: string; title: string; category: string }[] = [];
    
    if (estate.images && estate.images.length > 0) {
      estate.images.forEach((img: any, index: number) => {
        const url = typeof img === 'string' ? img : (img.image_path || img.url || '');
        if (url) {
          list.push({
            id: index + 1,
            url,
            title: `${estate.title} - Imagen ${index + 1}`,
            category: estate.type || 'Inmueble',
          });
        }
      });
    }

    if (list.length === 0) {
      const fallbackUrl = (estate as any).image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
      list.push({
        id: 1,
        url: fallbackUrl,
        title: estate.title,
        category: estate.type || 'Inmueble',
      });
    }

    return list;
  };

  const imagesList = extractImages();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = imagesList[activeIndex] || imagesList[0];
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Drag and Drop state
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    const initScroll = () => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = 0;
        setTimeout(() => {
          container.style.scrollBehavior = 'smooth';
          setIsLoaded(true);
        }, 50);
      }
    };
    const timer = setTimeout(initScroll, 100);
    return () => clearTimeout(timer);
  }, [estate]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (maxScrollLeft <= 0) return;

    let progress = container.scrollLeft / maxScrollLeft;
    progress = Math.max(0, Math.min(1, progress));
    
    const newIdx = Math.round(progress * (imagesList.length - 1));
    if (imagesList[newIdx] && newIdx !== activeIndex) {
      setActiveIndex(newIdx);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
    carouselRef.current.style.scrollBehavior = 'auto';
  };

  const handleMouseLeaveOrUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'smooth';
      const activeElement = carouselRef.current.querySelector(`[data-id="${activeImage.id}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;
      const itemWidth = 200;
      const scrollTo = direction === 'left' ? scrollLeft - itemWidth * 2 : scrollLeft + itemWidth * 2;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleCopyLink = () => {
    const slug = (estate as any).slug || estate.id;
    const publicUrl = `${window.location.origin}/estate/${slug}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success('¡Enlace copiado al portapapeles!');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-[#F8FAFC] dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl relative z-10 border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Header */}
          <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Galería Canva 3D del Inmueble
                </h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {estate.title} • {imagesList.length} Fotografías
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                title="Copiar Enlace Público"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copiar Enlace</span>
              </button>

              {onCopyWhatsApp && (
                <button
                  onClick={onCopyWhatsApp}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Compartir en WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              )}

              {onDownloadPdf && (
                <button
                  onClick={onDownloadPdf}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  title="Descargar PDF de la propiedad"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors ml-1"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            {/* Showcase Main Image Frame */}
            <div className={`relative flex flex-col items-center justify-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative w-full max-w-[460px] aspect-square rounded-3xl bg-slate-900 shadow-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ring-1 ring-slate-900/10 group">
                <img
                  key={activeImage.id}
                  src={activeImage.url}
                  alt={activeImage.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75" />

                <div className="relative z-10 flex flex-col items-center mt-auto mb-8 w-full px-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md line-clamp-2">
                    {estate.title}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-sm">
                      {estate.type || 'Inmueble'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-xs font-black shadow-sm">
                      ${Number(estate.price || 0).toLocaleString()} USD
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-white/90 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {estate.user?.name || 'Asesor Inmobiliario'}
                    </span>
                  </div>
                </div>

                <a
                  href={activeImage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20 shadow-md"
                  title="Ver imagen en tamaño completo"
                >
                  <Maximize2 className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 3D Cover Flow Carousel Bar */}
            <div className={`relative transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Seleccionar Fotografía ({activeIndex + 1} de {imagesList.length})
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => scroll('left')}
                    className="p-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-100 shadow-sm transition-all active:scale-90"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    className="p-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-100 shadow-sm transition-all active:scale-90"
                    title="Siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                ref={carouselRef}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                className={`flex pb-10 pt-4 overflow-x-auto items-center justify-start min-h-[220px] relative ${
                  isDragging ? 'snap-none cursor-grabbing' : 'snap-x snap-mandatory cursor-grab'
                }`}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  perspective: '1200px',
                  perspectiveOrigin: '50% 50%',
                }}
              >
                <div className="min-w-[30vw] shrink-0 pointer-events-none" />

                {imagesList.map((item, index) => {
                  const offset = index - activeIndex;
                  const isActive = offset === 0;
                  const absOffset = Math.abs(offset);
                  const direction = offset === 0 ? 0 : offset / absOffset;

                  const rotateY = isActive ? 0 : direction * -25;
                  const scale = isActive ? 1.12 : Math.max(0.75, 1 - absOffset * 0.15);
                  const translateX = isActive ? 0 : direction * -20;
                  const translateZ = isActive ? 30 : absOffset * -50;
                  const zIndex = 50 - absOffset;

                  return (
                    <div
                      key={item.id}
                      data-id={item.id}
                      onClick={() => {
                        if (!isDragging) {
                          setActiveIndex(index);
                        }
                      }}
                      className="relative flex-shrink-0 rounded-2xl transition-all duration-500 snap-center group"
                      style={{
                        width: '150px',
                        height: '150px',
                        transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        zIndex,
                        boxShadow: isActive
                          ? '0 20px 40px -10px rgba(0,0,0,0.3)'
                          : '0 8px 15px -3px rgba(0,0,0,0.15)',
                        transformStyle: 'preserve-3d',
                        margin: '0 -8px',
                      }}
                    >
                      <div className={`absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${isActive ? 'p-1 ring-2 ring-indigo-500' : 'p-0'}`}>
                        <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-900">
                          <img
                            src={item.url}
                            alt={item.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 pointer-events-none select-none ${
                              isActive ? 'brightness-105 saturate-110' : 'brightness-[0.75] group-hover:brightness-95'
                            }`}
                            draggable="false"
                          />
                        </div>
                      </div>

                      {/* Active Label under card */}
                      {isActive && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[140%] flex flex-col items-center text-center">
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate w-full">
                            Foto #{item.id}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="min-w-[30vw] shrink-0 pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EstateCanvaGalleryModal;
