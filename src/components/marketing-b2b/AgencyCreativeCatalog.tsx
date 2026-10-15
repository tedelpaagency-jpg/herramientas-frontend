'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Film, Image as ImageIcon, Search, ChevronRight, 
  TrendingUp, Clock, Layers, RefreshCw, Globe, Tag, X, 
  RotateCcw, SlidersHorizontal, Lock, LayoutGrid, Check, 
  ChevronDown, Compass, FileText, ArrowRight, Eye
} from 'lucide-react';
import { MarketingTemplate, AspectRatioType, MarketingCreativeCategory } from '../../types/marketingB2B';
import marketingB2BService from '../../services/marketingB2BService';
import { normalizeFileUrl } from '../../services/apiClient';
import Portal from '../Portal';
import toast from 'react-hot-toast';

const COUNTRIES_FILTER = [
  'Estados Unidos',
  'España',
  'México',
  'Colombia',
  'República Dominicana',
  'Canadá',
  'Argentina',
  'Chile',
  'Perú',
  'Ecuador',
  'Panamá',
  'Costa Rica',
  'Guatemala',
  'Uruguay',
  'Brasil',
  'Reino Unido',
  'Francia',
  'Italia',
  'Alemania',
];

const ASPECT_RATIO_OPTIONS = [
  { value: 'all', label: 'Todos los formatos' },
  { value: '9:16', label: '9:16 Stories & Reels' },
  { value: '1:1', label: '1:1 Feed Cuadrado' },
  { value: '4:5', label: '4:5 Vertical' },
  { value: '16:9', label: '16:9 Horizontal' },
];

interface AgencyCreativeCatalogProps {
  onSelectTemplate: (template: MarketingTemplate) => void;
  onOpenHistory: () => void;
}

export const AgencyCreativeCatalog: React.FC<AgencyCreativeCatalogProps> = ({
  onSelectTemplate,
  onOpenHistory,
}) => {
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [categories, setCategories] = useState<MarketingCreativeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros activos
  const [searchTerm, setSearchTerm] = useState('');
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Control de dropdowns flotantes
  const [activeDropdown, setActiveDropdown] = useState<'format' | 'country' | 'category' | null>(null);

  // Modal de ayuda flotante (?)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const filterContainerRef = useRef<HTMLDivElement | null>(null);

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await marketingB2BService.getCategories({ is_active: true });
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching marketing categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Cargar plantillas desde el backend según los filtros
  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await marketingB2BService.getTemplates({
        aspect_ratio: aspectRatioFilter === 'all' ? undefined : aspectRatioFilter,
        type: typeFilter === 'all' ? undefined : typeFilter,
        category_id: categoryFilter === 'all' ? undefined : categoryFilter,
        country: countryFilter === 'all' ? undefined : countryFilter,
        search: searchTerm.trim() || undefined,
        status: 'published',
      });
      setTemplates(res.data || []);
    } catch (err) {
      console.error('Error fetching marketing templates:', err);
      toast.error('Error al cargar plantillas publicitarias');
    } finally {
      setIsLoading(false);
    }
  };

  // Búsqueda en vivo con debounce de 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTemplates();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Recarga al cambiar cualquier filtro de selección
  useEffect(() => {
    fetchTemplates();
  }, [aspectRatioFilter, typeFilter, categoryFilter, countryFilter]);

  // Cierre de dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterContainerRef.current &&
        !filterContainerRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const hasActiveFilters = 
    aspectRatioFilter !== 'all' || 
    typeFilter !== 'all' || 
    categoryFilter !== 'all' || 
    countryFilter !== 'all' || 
    searchTerm.trim() !== '';

  const handleResetFilters = () => {
    setAspectRatioFilter('all');
    setTypeFilter('all');
    setCategoryFilter('all');
    setCountryFilter('all');
    setSearchTerm('');
    setActiveDropdown(null);
  };

  // Helper para renderizar mini-documento o imagen estilo Canva
  const renderTemplatePreview = (tpl: MarketingTemplate) => {
    const isVideo =
      tpl.media_type === 'video' ||
      tpl.resource?.type === 'video' ||
      tpl.media?.file_type === 'video' ||
      Boolean(tpl.resource?.mime_type && tpl.resource.mime_type.startsWith('video/')) ||
      Boolean(tpl.media?.mime_type && tpl.media.mime_type.startsWith('video/')) ||
      /\.(mp4|webm|mov)(\?.*)?$/i.test(tpl.media_url || tpl.media?.url || tpl.preview_image_url || tpl.resource?.file_url || '');

    const videoUrl = normalizeFileUrl(
      tpl.media?.full_url ||
      tpl.media?.url ||
      tpl.media_url ||
      tpl.resource?.file_url ||
      (tpl.preview_image_url && /\.(mp4|webm|mov)(\?.*)?$/i.test(tpl.preview_image_url) ? tpl.preview_image_url : null)
    );

    const thumbUrl = normalizeFileUrl(
      (!/\.(mp4|webm|mov)(\?.*)?$/i.test(tpl.preview_image_url || '') ? tpl.preview_image_url : null) ||
      tpl.preview_full_url ||
      tpl.resource?.thumbnail_url ||
      (!isVideo ? (tpl.media?.full_url || tpl.media?.url || tpl.media_url || tpl.resource?.file_url) : null)
    );

    if (isVideo && videoUrl) {
      return (
        <div className="relative w-full h-full">
          <video
            src={videoUrl}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            muted
            playsInline
            loop
            preload="metadata"
            onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
            onMouseLeave={(e) => {
              const v = e.currentTarget as HTMLVideoElement;
              v.pause();
              v.currentTime = 0;
            }}
          />
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent pointer-events-none transition-colors" />
        </div>
      );
    }

    if (thumbUrl) {
      return (
        <img
          src={thumbUrl}
          alt={tpl.name}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
      );
    }

    // Si la plantilla no tiene imagen, renderiza el documento Canva simulado
    const categoryColor = tpl.category?.color || '#8b5cf6';
    return (
      <div className="w-full h-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2 flex flex-col justify-between shadow-xs">
        <div className="space-y-1.5">
          <div 
            className="w-full py-0.5 px-1.5 rounded flex items-center justify-between"
            style={{ backgroundColor: `${categoryColor}18`, borderLeft: `3px solid ${categoryColor}` }}
          >
            <span className="text-[7.5px] font-black truncate" style={{ color: categoryColor }}>
              {tpl.name.toUpperCase()}
            </span>
            <span className="text-[6.5px] font-mono font-bold text-slate-400">
              {tpl.aspect_ratio}
            </span>
          </div>

          <div className="space-y-1 pt-0.5">
            <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded">
              <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded col-span-2" />
              <div className="h-1 bg-slate-300 dark:bg-slate-600 rounded col-span-1" />
            </div>
            <div className="h-0.5 bg-slate-100 dark:bg-slate-800 rounded w-full" />
            <div className="h-0.5 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
            <div className="h-0.5 bg-slate-100 dark:bg-slate-800 rounded w-4/6" />
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-1 flex items-center justify-between">
          <span className="text-[7px] font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-0.5">
            trivali<span className="w-1 h-1 rounded-full bg-purple-600 inline-block" />
          </span>
          <span className="text-[6.5px] font-bold text-slate-400">
            {tpl.media_type === 'video' ? 'MP4' : 'A4'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20 text-slate-900 dark:text-slate-100 relative">
      {/* ============================================================ */}
      {/* HERO SECTION ESTILO CANVA CON DEGRADADO LAVANDA SUAVE */}
      {/* ============================================================ */}
      <div className="relative rounded-3xl p-6 sm:p-8 md:p-12 overflow-hidden bg-gradient-to-b from-purple-100/90 via-indigo-50/50 to-white/80 dark:from-purple-950/40 dark:via-slate-900/40 dark:to-slate-900 border border-purple-100 dark:border-purple-950/60 shadow-xs">
        {/* Glows de ambientación suaves */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-400/15 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-300/10 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* TÍTULO PRINCIPAL: ¿Qué vamos a diseñar hoy? */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-600 dark:from-indigo-300 dark:via-purple-300 dark:to-indigo-200">
            ¿Qué vamos a diseñar hoy?
          </h1>

          {/* BARRA DE BÚSQUEDA PRINCIPAL: Busca lo que quieras */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-purple-600/70 dark:text-purple-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Busca lo que quieras"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-950/90 border border-purple-200 dark:border-purple-700/80 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold rounded-full pl-11 pr-10 py-3.5 outline-none shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-300/30 dark:focus:ring-purple-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title="Borrar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* FILTROS DE PLANTILLAS ESTILO ICONOS CANVA DEBAJO DEL BUSCADOR */}
          {/* ============================================================ */}
          <div 
            ref={filterContainerRef}
            className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 relative"
          >
            {/* 1. ICONO: TODOS */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              title="Mostrar todas las plantillas"
            >
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  !hasActiveFilters
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105 ring-2 ring-purple-400/40'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-400 shadow-xs'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </div>
              <span 
                className={`text-[11px] font-bold ${
                  !hasActiveFilters
                    ? 'text-purple-600 dark:text-purple-400 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 group-hover:text-purple-600'
                }`}
              >
                Todos
              </span>
            </button>

            {/* 2. DROPDOWN: FORMATO */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'format' ? null : 'format')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
                title="Filtrar por formato o relación de aspecto"
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${
                    aspectRatioFilter !== 'all'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105 ring-2 ring-indigo-400/40'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 shadow-xs'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 border border-slate-200 dark:border-slate-700 shadow-xs">
                    <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
                  </span>
                </div>
                <span 
                  className={`text-[11px] font-bold max-w-[85px] truncate ${
                    aspectRatioFilter !== 'all'
                      ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 group-hover:text-indigo-600'
                  }`}
                >
                  {aspectRatioFilter !== 'all' ? aspectRatioFilter : 'Formato'}
                </span>
              </button>

              {/* Menú flotante de Formatos */}
              {activeDropdown === 'format' && (
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 min-w-[210px] animate-scale-up">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 tracking-wider">
                    Seleccionar Formato
                  </div>
                  {ASPECT_RATIO_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setAspectRatioFilter(opt.value);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer ${
                        aspectRatioFilter === opt.value
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 font-bold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {aspectRatioFilter === opt.value && (
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. ICONO: IMÁGENES */}
            <button
              type="button"
              onClick={() => {
                setTypeFilter(typeFilter === 'image' ? 'all' : 'image');
                setActiveDropdown(null);
              }}
              className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              title="Filtrar imágenes y flyers comerciales"
            >
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  typeFilter === 'image'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105 ring-2 ring-emerald-400/40'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 shadow-xs'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
              </div>
              <span 
                className={`text-[11px] font-bold ${
                  typeFilter === 'image'
                    ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 group-hover:text-emerald-600'
                }`}
              >
                Imágenes
              </span>
            </button>

            {/* 4. ICONO: VIDEOS */}
            <button
              type="button"
              onClick={() => {
                setTypeFilter(typeFilter === 'video' ? 'all' : 'video');
                setActiveDropdown(null);
              }}
              className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              title="Filtrar videos comerciales MP4"
            >
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  typeFilter === 'video'
                    ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30 scale-105 ring-2 ring-fuchsia-400/40'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-fuchsia-400 shadow-xs'
                }`}
              >
                <Film className="w-5 h-5" />
              </div>
              <span 
                className={`text-[11px] font-bold ${
                  typeFilter === 'video'
                    ? 'text-fuchsia-600 dark:text-fuchsia-400 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 group-hover:text-fuchsia-600'
                }`}
              >
                Videos
              </span>
            </button>

            {/* 5. DROPDOWN: PAÍSES */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'country' ? null : 'country')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
                title="Filtrar por país destino"
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${
                    countryFilter !== 'all'
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 scale-105 ring-2 ring-sky-400/40'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-400 shadow-xs'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 border border-slate-200 dark:border-slate-700 shadow-xs">
                    <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
                  </span>
                </div>
                <span 
                  className={`text-[11px] font-bold max-w-[85px] truncate ${
                    countryFilter !== 'all'
                      ? 'text-sky-600 dark:text-sky-400 font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 group-hover:text-sky-600'
                  }`}
                >
                  {countryFilter !== 'all' ? countryFilter : 'Países'}
                </span>
              </button>

              {/* Menú flotante de Países */}
              {activeDropdown === 'country' && (
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 min-w-[210px] max-h-64 overflow-y-auto animate-scale-up">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 tracking-wider">
                    País de Destino
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCountryFilter('all');
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer ${
                      countryFilter === 'all'
                        ? 'text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30 font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Todos los Países</span>
                    {countryFilter === 'all' && (
                      <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    )}
                  </button>
                  {COUNTRIES_FILTER.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCountryFilter(c);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer ${
                        countryFilter === c
                          ? 'text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30 font-bold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">{c}</span>
                      {countryFilter === c && (
                        <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 6. DROPDOWN: CATEGORÍAS */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
                title="Filtrar por categoría comercial"
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${
                    categoryFilter !== 'all'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-105 ring-2 ring-amber-400/40'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400 shadow-xs'
                  }`}
                >
                  <Tag className="w-5 h-5" />
                  <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 border border-slate-200 dark:border-slate-700 shadow-xs">
                    <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
                  </span>
                </div>
                <span 
                  className={`text-[11px] font-bold max-w-[85px] truncate ${
                    categoryFilter !== 'all'
                      ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 group-hover:text-amber-600'
                  }`}
                >
                  {categoryFilter !== 'all'
                    ? (categories.find(c => String(c.id) === String(categoryFilter))?.name || 'Categoría')
                    : 'Categorías'}
                </span>
              </button>

              {/* Menú flotante de Categorías */}
              {activeDropdown === 'category' && (
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 min-w-[210px] max-h-64 overflow-y-auto animate-scale-up">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 tracking-wider">
                    Categorías de Creativos
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('all');
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer ${
                      categoryFilter === 'all'
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30 font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Todas las Categorías</span>
                    {categoryFilter === 'all' && (
                      <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    )}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(String(cat.id));
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer ${
                        String(categoryFilter) === String(cat.id)
                          ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30 font-bold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span 
                          className="w-2 h-2 rounded-full shrink-0" 
                          style={{ backgroundColor: cat.color || '#F59E0B' }} 
                        />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      {String(categoryFilter) === String(cat.id) && (
                        <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* BOTÓN LIMPIAR FILTROS ACTIVO */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20 transition-all cursor-pointer self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CUADRÍCULA ESTILO "SEGUIR DISEÑANDO" CON EL TÍTULO DEL CATÁLOGO */}
      {/* ============================================================ */}
      <div className="space-y-6">
        {/* Cabecera renombrada: Catálogo de Plantillas Publicitarias */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Catálogo de Plantillas Publicitarias
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold border border-purple-500/20">
              {templates.length} {templates.length === 1 ? 'plantilla disponible' : 'plantillas disponibles'}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Mis Descargas & Historial</span>
          </button>
        </div>

        {/* Estado de Carga */}
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Cargando catálogo publicitario...
            </p>
          </div>
        ) : templates.length === 0 ? (
          /* Estado Vacío */
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
              <Layers className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                No se encontraron plantillas publicitarias
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No hay resultados con los filtros seleccionados. Intenta restablecer los filtros o buscar con otro término.
              </p>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md shadow-purple-600/20 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Filtros</span>
              </button>
            )}
          </div>
        ) : (
          /* Cuadrícula de tarjetas con el formato visual de "Seguir Diseñando" */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 gap-3 sm:gap-4">
            {templates.map((tpl) => {
              const isVideo =
                tpl.media_type === 'video' ||
                tpl.resource?.type === 'video' ||
                tpl.media?.file_type === 'video' ||
                Boolean(tpl.resource?.mime_type && tpl.resource.mime_type.startsWith('video/')) ||
                Boolean(tpl.media?.mime_type && tpl.media.mime_type.startsWith('video/')) ||
                /\.(mp4|webm|mov)(\?.*)?$/i.test(tpl.media_url || tpl.media?.url || tpl.preview_image_url || tpl.resource?.file_url || '');

              const baseCostNum = Number(tpl.base_cost) || 0;
              const suggestedNum = Number(tpl.suggested_price) || 0;
              const suggestedProfit = Math.max(0, suggestedNum - baseCostNum);

              return (
                <div
                  key={tpl.id}
                  onClick={() => onSelectTemplate(tpl)}
                  className="group bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  {/* Contenedor del Thumbnail tipo Documento / Diseño Canva */}
                  <div className="aspect-[3/4] rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 relative overflow-hidden flex items-center justify-center p-1.5">
                    {/* Badge superior izquierdo: 🔒 Privado */}
                    <span className="absolute top-2 left-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-sm text-white text-[9px] font-bold shadow-xs">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Privado</span>
                    </span>

                    {/* Insignia superior derecha de país o tipo si existe */}
                    {tpl.country && (
                      <span className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-sm text-sky-300 text-[8px] font-bold max-w-[65px] truncate">
                        {tpl.country}
                      </span>
                    )}

                    {/* Renderizado de la previsualización */}
                    {renderTemplatePreview(tpl)}

                    {/* Overlay de hover con acción de Personalización y Ganancia */}
                    <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTemplate(tpl);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-transform active:scale-95"
                        title="Personalizar plantilla con tu logo y precio"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Personalizar</span>
                      </button>

                      {suggestedProfit > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/40 text-[10px] font-black text-emerald-400">
                          +${suggestedProfit.toFixed(2)} ganancia
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info inferior: Título del documento y formato/costo */}
                  <div className="pt-2 space-y-1">
                    <h4 
                      className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors"
                      title={tpl.name}
                    >
                      {tpl.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {isVideo ? (
                        <Film className="w-3 h-3 text-fuchsia-500 shrink-0" />
                      ) : (
                        <Compass className="w-3 h-3 text-purple-600 shrink-0" />
                      )}
                      <span className="truncate">
                        {tpl.aspect_ratio || 'A4'} • Base: ${baseCostNum.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* BOTÓN FLOTANTE PÚRPURA DE AYUDA '?' (IDÉNTICO AL SCREENSHOT) */}
      {/* ============================================================ */}
      <button
        type="button"
        onClick={() => setIsHelpModalOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xl shadow-xl shadow-purple-600/35 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 z-40"
        title="Centro de Ayuda y Consejos de Diseño para Agencias"
        aria-label="Ayuda"
      >
        ?
      </button>

      {/* ============================================================ */}
      {/* MODAL DE AYUDA Y TUTORIAL ESTILO CANVA */}
      {/* ============================================================ */}
      {isHelpModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 animate-scale-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xl">
                    ?
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Estudio Creativo para Agencias
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Personaliza plantillas y genera creativos en menos de 45 segundos
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHelpModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      Explora y filtra las plantillas publicitarias
                    </h5>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Usa los botones circulares superiores para filtrar por formato (9:16, 1:1, 4:5), imágenes, videos MP4, países y categorías.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      Marca Blanca Automática
                    </h5>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Tu logotipo de agencia, contacto comercial y redes sociales se aplican de forma instantánea al abrir cualquier plantilla.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      Define tu precio de venta y margen
                    </h5>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      El sistema calcula tu beneficio neto en tiempo real. Exporta en MP4 HD o JPG de alta definición listo para publicar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsHelpModalOpen(false);
                    onOpenHistory();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Ver mis descargas
                </button>
                <button
                  type="button"
                  onClick={() => setIsHelpModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md shadow-purple-600/25 transition-all cursor-pointer"
                >
                  ¡Entendido, a diseñar!
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default AgencyCreativeCatalog;
