'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Film, Image as ImageIcon, Search, Filter, 
  ChevronRight, TrendingUp, Clock, Zap, Layers, RefreshCw, 
  Globe, Tag, X, RotateCcw, SlidersHorizontal
} from 'lucide-react';
import { MarketingTemplate, AspectRatioType, MarketingCreativeCategory } from '../../types/marketingB2B';
import marketingB2BService from '../../services/marketingB2BService';
import { normalizeFileUrl } from '../../services/apiClient';
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
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar categorías
  useEffect(() => {
    const loadCats = async () => {
      try {
        const cats = await marketingB2BService.getCategories({ is_active: true });
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories in catalog:', err);
      }
    };
    loadCats();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await marketingB2BService.getTemplates({
        aspect_ratio: aspectRatioFilter === 'all' ? undefined : aspectRatioFilter,
        type: typeFilter === 'all' ? undefined : typeFilter,
        category_id: categoryFilter === 'all' ? undefined : categoryFilter,
        country: countryFilter === 'all' ? undefined : countryFilter,
        search: searchTerm || undefined,
        status: 'published',
      });
      setTemplates(res.data);
    } catch (err) {
      console.error('Error fetching marketing templates:', err);
      toast.error('Error al cargar catálogo de creativos');
    } finally {
      setIsLoading(false);
    }
  };

  // Búsqueda en vivo con debounce de 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTemplates();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Recarga al cambiar filtros de selección
  useEffect(() => {
    fetchTemplates();
  }, [aspectRatioFilter, typeFilter, categoryFilter, countryFilter]);

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
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Buscador Principal Prominente */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white dark:bg-slate-900/90 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm dark:shadow-2xl relative overflow-hidden">
        {/* Glow de fondo decorativo */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Marketing B2B Automatizado</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Catálogo de Creativos & Videos Comerciales
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
            Personaliza imágenes y videos de alta conversión con el logo y precio de tu agencia en menos de 45 segundos.
          </p>
        </div>

        {/* Buscador Prominente y Botón de Historial */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Barra de Búsqueda Principal */}
          <div className="relative flex-1 sm:w-80 md:w-96">
            <Search className="w-4 h-4 text-purple-600 dark:text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar plantilla por título, país o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTemplates()}
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white text-xs font-semibold rounded-2xl pl-10 pr-9 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onOpenHistory}
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-black border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Mis Descargas & Historial</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros Notoria y Fácil de Usar para Agencias */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Filtros de Creativos
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-extrabold border border-purple-500/20">
              {templates.length} {templates.length === 1 ? 'plantilla disponible' : 'plantillas disponibles'}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Selector de Formato con Botones Claros y Notorios */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Formato:</span>
            <div className="flex flex-wrap bg-slate-100 dark:bg-slate-950 rounded-2xl p-1 border border-slate-200 dark:border-slate-800 text-xs font-bold">
              {[
                { key: 'all', label: 'Todos' },
                { key: '9:16', label: '9:16 (Stories)' },
                { key: '1:1', label: '1:1 (Feed)' },
                { key: '4:5', label: '4:5 (Vertical)' },
                { key: '16:9', label: '16:9 (Horizontal)' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setAspectRatioFilter(f.key)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    aspectRatioFilter === f.key
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/25 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Tipo (Imagen / Video) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tipo de Contenido:</span>
            <div className="flex bg-slate-100 dark:bg-slate-950 rounded-2xl p-1 border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  typeFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => setTypeFilter('image')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  typeFilter === 'image'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span>Imágenes</span>
              </button>
              <button
                onClick={() => setTypeFilter('video')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  typeFilter === 'video'
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-amber-500" />
                <span>Videos MP4</span>
              </button>
            </div>
          </div>

          {/* Selector de País */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">País de Destino:</span>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <Globe className="w-4 h-4 text-sky-500 shrink-0" />
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 text-xs font-bold outline-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
              >
                <option value="all">Todos los Países</option>
                {COUNTRIES_FILTER.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selector de Categoría */}
          {categories.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Categoría:</span>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <Tag className="w-4 h-4 text-purple-500 shrink-0" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 text-xs font-bold outline-none cursor-pointer max-w-[170px] [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
                >
                  <option value="all">Todas las Categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Plantillas: 5 por fila en resoluciones amplias */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Cargando plantillas de marketing...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-16 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">No hay plantillas publicitarias disponibles</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No se encontraron plantillas para los filtros seleccionados. Intenta restablecer los filtros o buscar con otro término.
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md shadow-purple-600/20 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Filtros</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
          {templates.map((tpl) => {
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

            const baseCostNum = Number(tpl.base_cost);
            const suggestedNum = Number(tpl.suggested_price);
            const suggestedProfit = Math.max(0, suggestedNum - baseCostNum);

            return (
              <div
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  {isVideo && videoUrl ? (
                    <div className="relative w-full h-full">
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                        }}
                        onMouseLeave={(e) => {
                          const v = e.currentTarget as HTMLVideoElement;
                          v.pause();
                          v.currentTime = 0;
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent pointer-events-none transition-colors" />
                    </div>
                  ) : thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={tpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Badges superiores */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[80%]">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-purple-300">
                      {tpl.aspect_ratio}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-slate-200 flex items-center gap-1">
                      {isVideo ? <Film className="w-2.5 h-2.5 text-amber-400" /> : <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />}
                      {isVideo ? 'video' : 'imagen'}
                    </span>
                    {tpl.country && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-sky-300 border border-sky-500/30 flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5 text-sky-400" />
                        <span className="truncate max-w-[70px]">{tpl.country}</span>
                      </span>
                    )}
                    {tpl.category && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tpl.category.color || '#8B5CF6' }} />
                        <span className="truncate max-w-[70px]">{tpl.category.name}</span>
                      </span>
                    )}
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
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {tpl.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Costo Base: <strong className="text-slate-800 dark:text-slate-200">${baseCostNum.toFixed(2)}</strong></span>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold group-hover:underline flex items-center gap-0.5">
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
