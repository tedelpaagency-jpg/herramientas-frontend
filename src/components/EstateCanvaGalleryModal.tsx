'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  LayoutTemplate,
  Share2,
  Copy,
  Loader2,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { Estate } from '../types';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import estateTemplateService, { EstateTemplate } from '@/services/estateTemplateService';
import {
  buildEstatePayload,
  substituteTemplateShortcuts,
  downloadHtmlAsPng,
} from '@/utils/estateTemplateRenderer';

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
  const { currentAgency, user } = useAuth();
  const agency = (user as any)?.agency || (user as any)?.agency_data || currentAgency;

  const [templates, setTemplates] = useState<EstateTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(true);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [downloading, setDownloading] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageWidthCap, setStageWidthCap] = useState<number>(600);

  useEffect(() => {
    const updateSize = () => {
      if (stageRef.current) {
        setStageWidthCap(stageRef.current.clientWidth || 600);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    const timer = setTimeout(updateSize, 120);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timer);
    };
  }, [isOpen, activeTemplateIndex]);

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Extract property images list for selective inclusion
  const imagesList = useMemo(() => {
    if (!estate) return [];
    const list: string[] = [];
    if (estate.images && estate.images.length > 0) {
      estate.images.forEach((img: any) => {
        const url = typeof img === 'string' ? img : (img.image_path || img.url || '');
        if (url) list.push(url);
      });
    }
    if (list.length === 0) {
      const fallbackUrl = (estate as any).image || (estate as any).featured_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
      list.push(fallbackUrl);
    }
    return list;
  }, [estate]);

  // Load templates on open
  useEffect(() => {
    if (!isOpen || !estate) return;
    let isMounted = true;
    setLoadingTemplates(true);

    estateTemplateService.getTemplates()
      .then((res) => {
        if (!isMounted) return;
        const list = res?.templates || [];
        const active = list.filter((t) => t.is_active);
        setTemplates(active.length > 0 ? active : list);
        setActiveTemplateIndex(0);
      })
      .catch((err) => {
        console.error('Error al cargar plantillas:', err);
        toast.error('No se pudieron cargar las plantillas creativas.');
      })
      .finally(() => {
        if (isMounted) setLoadingTemplates(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, estate]);

  // Build payload and substituted HTML for the active template
  const activeTemplate: EstateTemplate | null = templates[activeTemplateIndex] || templates[0] || null;

  const estatePayload = useMemo(() => {
    if (!estate) return null;
    return buildEstatePayload(estate, agency, selectedImageIndex);
  }, [estate, agency, selectedImageIndex]);

  const substitutedHtml = useMemo(() => {
    if (!activeTemplate || !estatePayload) return '';
    return substituteTemplateShortcuts(activeTemplate.html_content, estatePayload);
  }, [activeTemplate, estatePayload]);

  if (!isOpen || !estate) return null;

  const handleDownload = async () => {
    if (!activeTemplate || !substitutedHtml) {
      toast.error('No hay plantilla disponible para descargar');
      return;
    }
    setDownloading(true);
    const toastId = toast.loading('Generando imagen de alta resolución...');
    try {
      const cleanEstateTitle = (estate.title || 'propiedad').replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanTplName = (activeTemplate.name || 'plantilla').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${cleanEstateTitle}_${cleanTplName}.png`;

      await downloadHtmlAsPng(
        substitutedHtml,
        activeTemplate.width || 1080,
        activeTemplate.height || 1080,
        filename
      );
      toast.success('¡Imagen descargada exitosamente!', { id: toastId });
    } catch (err: any) {
      console.error('Download error:', err);
      toast.error('Error al procesar la descarga de imagen.', { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const slug = (estate as any).slug || estate.id;
    const publicUrl = `${window.location.origin}/estate/${slug}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success('¡Enlace copiado al portapapeles!');
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;
      const itemWidth = 180;
      const scrollTo = direction === 'left' ? scrollLeft - itemWidth * 2 : scrollLeft + itemWidth * 2;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
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
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
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
          className="bg-[#0F172A] text-white w-full max-w-5xl rounded-3xl shadow-2xl relative z-10 border border-slate-800 overflow-hidden my-auto max-h-[94vh] flex flex-col"
        >
          {/* Top Header */}
          <div className="bg-slate-900/90 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight flex items-center gap-2">
                  <span>Plantillas Creativas del Inmueble</span>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    PNG HD
                  </span>
                </h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate max-w-xs sm:max-w-md">
                  {estate.title} {activeTemplate ? `• ${activeTemplate.name} (${activeTemplate.aspect_ratio})` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading || !activeTemplate}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                title="Descargar esta plantilla como imagen PNG sustituyendo los datos"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{downloading ? 'Generando...' : 'Descargar PNG'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                title="Copiar Enlace Público"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden md:inline">Copiar Link</span>
              </button>

              {onCopyWhatsApp && (
                <button
                  type="button"
                  onClick={onCopyWhatsApp}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Compartir en WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden md:inline">WhatsApp</span>
                </button>
              )}

              {onDownloadPdf && (
                <button
                  type="button"
                  onClick={onDownloadPdf}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Descargar PDF de la propiedad"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden md:inline">PDF</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors ml-1 cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
            {/* Multi-image selector bar if estate has > 1 image */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 px-2 rounded-2xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Foto para el diseño:
                </span>
                {imagesList.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-500/20'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    title={`Usar foto #${idx + 1}`}
                  >
                    <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    {selectedImageIndex === idx && (
                      <span className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[8px] font-black px-1 rounded-tl">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Central Live Preview */}
            <div
              ref={stageRef}
              className="relative flex flex-col items-center justify-center min-h-[360px] sm:min-h-[460px] rounded-3xl bg-slate-950/80 border border-slate-800/80 p-3 sm:p-5"
            >
              {loadingTemplates ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  <p className="text-xs font-bold text-slate-400">Cargando plantillas creativas...</p>
                </div>
              ) : !activeTemplate ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  <LayoutTemplate className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  No hay plantillas activas disponibles.
                </div>
              ) : (() => {
                const tplW = activeTemplate.width || 1080;
                const tplH = activeTemplate.height || 1080;
                const maxStageW = Math.min(
                  Math.max(260, stageWidthCap - 32),
                  activeTemplate.aspect_ratio === '9:16' ? 280 : activeTemplate.aspect_ratio === '16:9' ? 680 : 440
                );
                const maxStageH = activeTemplate.aspect_ratio === '9:16' ? 500 : activeTemplate.aspect_ratio === '16:9' ? 390 : 440;
                const scale = Math.min(maxStageW / tplW, maxStageH / tplH);
                const stageW = Math.round(tplW * scale);
                const stageH = Math.round(tplH * scale);

                return (
                  <div className="w-full flex flex-col items-center justify-center">
                    {/* Template Meta Info */}
                    <div
                      className="flex items-center justify-between text-xs text-slate-400 mb-2.5 px-1"
                      style={{ width: `${stageW}px`, maxWidth: '100%' }}
                    >
                      <span className="font-extrabold text-white flex items-center gap-1.5 truncate">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{activeTemplate.name}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-black uppercase text-indigo-300 border border-slate-700 shrink-0">
                        {activeTemplate.aspect_ratio || '1:1'} • {activeTemplate.width}x{activeTemplate.height}px
                      </span>
                    </div>

                    {/* Scaled Render Box */}
                    <div
                      className="relative overflow-hidden rounded-2xl shadow-2xl border border-slate-700/60 bg-black transition-all duration-300"
                      style={{
                        width: `${stageW}px`,
                        height: `${stageH}px`,
                      }}
                    >
                      <div
                        style={{
                          width: `${tplW}px`,
                          height: `${tplH}px`,
                          transform: `scale(${scale})`,
                          transformOrigin: 'top left',
                          pointerEvents: 'none',
                          userSelect: 'none',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                        dangerouslySetInnerHTML={{ __html: substitutedHtml }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Carousel of HTML Templates */}
            <div className="relative">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Catálogo de Plantillas ({templates.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Elige el formato y diseño deseado para exportar con los datos de esta propiedad.
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => scroll('left')}
                    className="p-1.5 text-slate-300 bg-slate-800 border border-slate-700 rounded-full hover:bg-slate-700 shadow-sm transition-all active:scale-90 cursor-pointer"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scroll('right')}
                    className="p-1.5 text-slate-300 bg-slate-800 border border-slate-700 rounded-full hover:bg-slate-700 shadow-sm transition-all active:scale-90 cursor-pointer"
                    title="Siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Templates Cards */}
              <div
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                className={`flex gap-3 overflow-x-auto pb-3 pt-1 items-stretch ${
                  isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
                }`}
                style={{ scrollbarWidth: 'thin' }}
              >
                {templates.map((tpl, index) => {
                  const isActive = index === activeTemplateIndex;
                  const miniW = tpl.width || 1080;
                  const miniH = tpl.height || 1080;
                  const miniScale = Math.min(148 / miniW, 95 / miniH);
                  const miniStageW = Math.round(miniW * miniScale);
                  const miniStageH = Math.round(miniH * miniScale);

                  return (
                    <div
                      key={tpl.id}
                      onClick={() => {
                        if (!isDragging) setActiveTemplateIndex(index);
                      }}
                      className={`relative flex-shrink-0 w-44 rounded-2xl p-2.5 transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                        isActive
                          ? 'bg-gradient-to-b from-indigo-950/70 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Mini preview thumbnail */}
                      <div className="relative w-full h-26 rounded-xl bg-slate-950 overflow-hidden border border-slate-800/80 mb-2 flex items-center justify-center">
                        <div
                          style={{
                            width: `${miniStageW}px`,
                            height: `${miniStageH}px`,
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '6px',
                          }}
                        >
                          <div
                            style={{
                              width: `${miniW}px`,
                              height: `${miniH}px`,
                              transform: `scale(${miniScale})`,
                              transformOrigin: 'top left',
                              pointerEvents: 'none',
                              userSelect: 'none',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                            }}
                            dangerouslySetInnerHTML={{
                              __html: substituteTemplateShortcuts(tpl.html_content, estatePayload || {}),
                            }}
                          />
                        </div>
                        <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-black uppercase text-indigo-300 border border-white/10 z-10">
                          {tpl.aspect_ratio || '1:1'}
                        </span>
                      </div>

                      {/* Card meta */}
                      <div>
                        <h4 className="text-xs font-black text-white truncate" title={tpl.name}>
                          {tpl.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {tpl.width}x{tpl.height}px
                        </p>
                      </div>

                      {isActive && (
                        <div className="mt-2 text-center py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider">
                          Seleccionada
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EstateCanvaGalleryModal;
