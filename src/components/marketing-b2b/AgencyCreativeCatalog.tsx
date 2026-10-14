'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Film, Image as ImageIcon, Search, Filter, 
  ChevronRight, ChevronLeft, Download, Eye, TrendingUp, 
  Clock, Play, Maximize2, Zap, Layers, RefreshCw
} from 'lucide-react';
import { MarketingTemplate, AspectRatioType } from '../../types/marketingB2B';
import marketingB2BService from '../../services/marketingB2BService';
import toast from 'react-hot-toast';

interface AgencyCreativeCatalogProps {
  onSelectTemplate: (template: MarketingTemplate) => void;
  onOpenHistory: () => void;
}

export const AgencyCreativeCatalog: React.FC<AgencyCreativeCatalogProps> = ({
  onSelectTemplate,
  onOpenHistory,
}) => {
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<MarketingTemplate | null>(null);
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 3D Carousel state (inspired by Canva Gallery)
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await marketingB2BService.getTemplates({
        aspect_ratio: aspectRatioFilter === 'all' ? undefined : aspectRatioFilter,
        type: typeFilter === 'all' ? undefined : typeFilter,
        search: searchTerm || undefined,
        status: 'published',
      });
      setTemplates(res.data);
      if (res.data.length > 0 && !activeTemplate) {
        setActiveTemplate(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching marketing templates:', err);
      toast.error('Error al cargar catálogo de creativos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [aspectRatioFilter, typeFilter]);

  // Carousel Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const itemWidth = 240;
      const scrollTo = direction === 'left' 
        ? carouselRef.current.scrollLeft - itemWidth * 2 
        : carouselRef.current.scrollLeft + itemWidth * 2;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner / Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl border border-slate-800 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Marketing B2B Automatizado</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Catálogo de Creativos & Videos Comerciales
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
            Personaliza imágenes y videos de alta conversión con el logo y datos de tu agencia en menos de 45 segundos.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenHistory}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-black border border-slate-700/60 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Mis Descargas & Historial</span>
          </button>
        </div>
      </div>

      {/* 3D Showcase Spotlight (Canva Style) */}
      {activeTemplate && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
            {/* Left Info & CTA */}
            <div className="space-y-5 max-w-md w-full">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-extrabold uppercase tracking-wider">
                    {activeTemplate.aspect_ratio} Formato
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    {activeTemplate.resource?.type === 'video' ? <Film className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                    {activeTemplate.resource?.type}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  {activeTemplate.name}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {activeTemplate.description || 'Plantilla de alta conversión diseñada por tu Marca Blanca. Lista para incorporar tu logo y precio de venta.'}
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Costo Base</span>
                  <div className="text-base font-black text-slate-200">
                    ${Number(activeTemplate.base_cost).toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Ganancia Sugerida</span>
                  <div className="text-base font-black text-emerald-400">
                    +${Math.max(0, Number(activeTemplate.suggested_price) - Number(activeTemplate.base_cost)).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Botón Principal */}
              <button
                onClick={() => onSelectTemplate(activeTemplate)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Personalizar & Generar Creativo</span>
              </button>
            </div>

            {/* Right: Featured Frame Preview */}
            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group">
              {activeTemplate.resource?.type === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    src={activeTemplate.resource.file_url}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase text-white flex items-center gap-1.5">
                      <Play className="w-3 h-3 fill-white" /> Video MP4 (H.264)
                    </span>
                  </div>
                </div>
              ) : (
                <img
                  src={activeTemplate.preview_image_url || activeTemplate.resource?.file_url}
                  alt={activeTemplate.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Format Tabs */}
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs font-bold text-slate-400">
            <button
              onClick={() => setAspectRatioFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${aspectRatioFilter === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-200'}`}
            >
              Todos los Formatos
            </button>
            <button
              onClick={() => setAspectRatioFilter('9:16')}
              className={`px-3 py-1.5 rounded-lg transition-all ${aspectRatioFilter === '9:16' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-200'}`}
            >
              9:16 (Stories)
            </button>
            <button
              onClick={() => setAspectRatioFilter('1:1')}
              className={`px-3 py-1.5 rounded-lg transition-all ${aspectRatioFilter === '1:1' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-200'}`}
            >
              1:1 (Feed)
            </button>
            <button
              onClick={() => setAspectRatioFilter('4:5')}
              className={`px-3 py-1.5 rounded-lg transition-all ${aspectRatioFilter === '4:5' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-200'}`}
            >
              4:5 (Vertical)
            </button>
          </div>

          {/* Media Type Filter */}
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs font-bold text-slate-400">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${typeFilter === 'all' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'}`}
            >
              Todo
            </button>
            <button
              onClick={() => setTypeFilter('image')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${typeFilter === 'image' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'}`}
            >
              <ImageIcon className="w-3 h-3" /> Imágenes
            </button>
            <button
              onClick={() => setTypeFilter('video')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${typeFilter === 'video' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'}`}
            >
              <Film className="w-3 h-3" /> Videos
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar plantillas publicitarias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTemplates()}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl pl-9 pr-3 py-2 w-full sm:w-64 outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Grid of Templates */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Cargando plantillas de marketing...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-white">No hay plantillas publicitarias disponibles</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tu Marca Blanca aún no ha publicado plantillas para este filtro. Intenta cambiando el formato o los términos de búsqueda.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map((tpl) => {
            const isVideo = tpl.resource?.type === 'video';
            const baseCostNum = Number(tpl.base_cost);
            const suggestedNum = Number(tpl.suggested_price);
            const suggestedProfit = Math.max(0, suggestedNum - baseCostNum);

            return (
              <div
                key={tpl.id}
                onClick={() => {
                  setActiveTemplate(tpl);
                  onSelectTemplate(tpl);
                }}
                className="group bg-slate-900 border border-slate-800 hover:border-purple-500 rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-square bg-slate-950 overflow-hidden">
                  <img
                    src={tpl.preview_image_url || tpl.resource?.thumbnail_url || tpl.resource?.file_url}
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Badges superiores */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-purple-300">
                      {tpl.aspect_ratio}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-slate-200 flex items-center gap-1">
                      {isVideo ? <Film className="w-2.5 h-2.5 text-amber-400" /> : <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />}
                      {tpl.resource?.type}
                    </span>
                  </div>

                  {/* Insignia de Ganancia proyectada sugerida */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-[11px] font-black text-emerald-400 backdrop-blur-md flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      Ganancia: +${suggestedProfit.toFixed(2)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(tpl);
                      }}
                      className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-transform active:scale-90"
                      title="Usar plantilla"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4 space-y-2">
                  <h4 className="font-extrabold text-sm text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {tpl.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Costo Base: <strong className="text-slate-200">${baseCostNum.toFixed(2)}</strong></span>
                    <span className="text-[11px] text-purple-400 font-bold group-hover:underline flex items-center gap-0.5">
                      Personalizar <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgencyCreativeCatalog;
