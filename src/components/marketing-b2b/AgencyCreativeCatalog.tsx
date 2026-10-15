'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Film, Image as ImageIcon, Search, Filter, 
  ChevronRight, TrendingUp, Clock, Zap, Layers, RefreshCw, 
  Globe, Tag, X, RotateCcw, SlidersHorizontal, Lock, Home, 
  LayoutGrid, Presentation, Heart, Video, Printer, FileText, 
  PenTool, Table2, MousePointerClick, Mail, Wand2, UploadCloud, 
  MoreHorizontal, HelpCircle, Compass, Download, Eye, CheckCircle2, 
  ExternalLink, FileSpreadsheet, Plus, ArrowRight
} from 'lucide-react';
import { MarketingTemplate, AspectRatioType, MarketingCreativeCategory, MarketingGeneration } from '../../types/marketingB2B';
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

interface AgencyCreativeCatalogProps {
  onSelectTemplate: (template: MarketingTemplate) => void;
  onOpenHistory: () => void;
}

// Sample recent designs data modeled directly from the Canva interface screenshot
interface RecentDesignItem {
  id: string | number;
  title: string;
  badge: string;
  format: string;
  formatType: 'a4' | 'doc' | 'sheet' | 'video' | 'social' | 'poster';
  editedTime: string;
  themeColor: string;
  docType: 'quote' | 'itinerary' | 'tour' | 'letter' | 'poster' | 'receipt';
  headerText?: string;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  isRealGeneration?: boolean;
  generation?: MarketingGeneration;
  template?: MarketingTemplate;
}

const STATIC_RECENT_DESIGNS: RecentDesignItem[] = [
  {
    id: 'static-1',
    title: 'DOC-20260920-WA0130.pdf',
    badge: 'Privado',
    format: 'A4',
    formatType: 'a4',
    editedTime: 'hace 1 hora',
    themeColor: '#0ea5e9',
    docType: 'quote',
    headerText: 'COTIZACIÓN',
  },
  {
    id: 'static-2',
    title: 'DOC-20261014-WA0265.pdf',
    badge: 'Privado',
    format: 'A4',
    formatType: 'a4',
    editedTime: 'hace 14 horas',
    themeColor: '#059669',
    docType: 'itinerary',
    headerText: 'ITINERARIO',
  },
  {
    id: 'static-3',
    title: 'SANTA CRUZ GALAPAGOS - ...',
    badge: 'Privado',
    format: 'Doc',
    formatType: 'doc',
    editedTime: 'hace 14 horas',
    themeColor: '#8b5cf6',
    docType: 'tour',
    headerText: 'SANTA CRUZ GALÁPAGOS',
  },
  {
    id: 'static-4',
    title: 'PERLAS DE TURQUIA 10D9...',
    badge: 'Privado',
    format: 'Doc',
    formatType: 'doc',
    editedTime: 'hace 14 horas',
    themeColor: '#dc2626',
    docType: 'tour',
    headerText: 'PERLAS DE TURQUÍA 10D9N',
  },
  {
    id: 'static-5',
    title: 'Cotizacion_Trivali_Olas_del_...',
    badge: 'Privado',
    format: 'Carta format...',
    formatType: 'doc',
    editedTime: 'hace 18 horas',
    themeColor: '#0284c7',
    docType: 'letter',
    headerText: 'PROPUESTA DE VIAJE',
  },
  {
    id: 'static-6',
    title: 'DOC-20260924-WA0327.pdf',
    badge: 'Privado',
    format: 'A4',
    formatType: 'a4',
    editedTime: 'hace 19 horas',
    themeColor: '#0ea5e9',
    docType: 'quote',
    headerText: 'COTIZACIÓN',
  },
  {
    id: 'static-7',
    title: 'DOC-20260915-WA0294.pdf',
    badge: 'Privado',
    format: 'A4',
    formatType: 'a4',
    editedTime: 'hace 20 horas',
    themeColor: '#0284c7',
    docType: 'receipt',
    headerText: 'RESUMEN DE VUELOS',
  },
  {
    id: 'static-8',
    title: 'DOC-20260810-WA0112.pdf',
    badge: 'Privado',
    format: 'A4',
    formatType: 'a4',
    editedTime: 'hace 1 día',
    themeColor: '#16a34a',
    docType: 'itinerary',
    headerText: 'CIRCUITO CARIBE',
  },
  {
    id: 'static-9',
    title: 'Viajes Mágicos en Familia',
    badge: 'Privado',
    format: '1:1',
    formatType: 'social',
    editedTime: 'hace 1 día',
    themeColor: '#f59e0b',
    docType: 'poster',
    headerText: 'VIAJES MÁGICOS EN FAMILIA',
  },
  {
    id: 'static-10',
    title: 'Inauguración Nueva Ruta',
    badge: 'Privado',
    format: '9:16',
    formatType: 'social',
    editedTime: 'hace 2 días',
    themeColor: '#3b82f6',
    docType: 'poster',
    headerText: 'INAUGURACIÓN',
  },
  {
    id: 'static-11',
    title: 'SANTA CRUZ ESPECIAL.doc',
    badge: 'Privado',
    format: 'Doc',
    formatType: 'doc',
    editedTime: 'hace 2 días',
    themeColor: '#8b5cf6',
    docType: 'tour',
    headerText: 'GALÁPAGOS CRUCERO',
  },
  {
    id: 'static-12',
    title: 'Potter Magic Experience',
    badge: 'Privado',
    format: '4:5',
    formatType: 'poster',
    editedTime: 'hace 3 días',
    themeColor: '#6366f1',
    docType: 'poster',
    headerText: 'POTTER MAGIC EXPERIENCE',
  },
  {
    id: 'static-13',
    title: 'Contrato_Agencia_Servicios.pdf',
    badge: 'Privado',
    format: 'Carta format...',
    formatType: 'doc',
    editedTime: 'hace 4 días',
    themeColor: '#475569',
    docType: 'letter',
    headerText: 'CONTRATO DE SERVICIOS',
  },
  {
    id: 'static-14',
    title: 'Voucher_Emision_Aerea.pdf',
    badge: 'Privado',
    format: 'A4',
    formatType: 'a4',
    editedTime: 'hace 5 días',
    themeColor: '#334155',
    docType: 'receipt',
    headerText: 'VOUCHER DE EMISIÓN',
  },
];

export const AgencyCreativeCatalog: React.FC<AgencyCreativeCatalogProps> = ({
  onSelectTemplate,
  onOpenHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'plantillas'>('inicio');
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [categories, setCategories] = useState<MarketingCreativeCategory[]>([]);
  const [generations, setGenerations] = useState<MarketingGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtros
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interacción
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<RecentDesignItem | null>(null);

  // Cargar categorías y generaciones pasadas
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cats, gens] = await Promise.allSettled([
          marketingB2BService.getCategories({ is_active: true }),
          marketingB2BService.getGenerationHistory({ per_page: 20 }),
        ]);

        if (cats.status === 'fulfilled') {
          setCategories(cats.value);
        }
        if (gens.status === 'fulfilled') {
          setGenerations(gens.value?.data || []);
        }
      } catch (err) {
        console.error('Error fetching initial marketing catalog data:', err);
      }
    };
    loadInitialData();
  }, []);

  // Cargar plantillas
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
      toast.error('Error al cargar catálogo de plantillas');
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

  // Recarga al cambiar filtros
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

  // Combinar generaciones reales del usuario con los diseños del estilo Canva
  const recentDesigns: RecentDesignItem[] = useMemo(() => {
    const list: RecentDesignItem[] = [];

    // 1. Agregar generaciones reales si existen
    if (generations && generations.length > 0) {
      generations.forEach((gen) => {
        const tpl = gen.template;
        const isVideo = gen.type === 'video' || gen.format === 'mp4';
        const fileUrl = gen.output_url ? normalizeFileUrl(gen.output_url) : null;
        
        list.push({
          id: `gen-${gen.id}`,
          title: tpl?.name ? `${tpl.name}.pdf` : `DISEÑO-${gen.uuid.slice(0, 8)}.pdf`,
          badge: 'Privado',
          format: isVideo ? 'Video MP4' : (tpl?.aspect_ratio || 'A4'),
          formatType: isVideo ? 'video' : 'a4',
          editedTime: 'Reciente',
          themeColor: isVideo ? '#ec4899' : '#8b5cf6',
          docType: isVideo ? 'poster' : 'quote',
          headerText: tpl?.name?.toUpperCase() || 'DOCUMENTO COMERCIAL',
          thumbnailUrl: fileUrl,
          videoUrl: isVideo ? fileUrl : null,
          isRealGeneration: true,
          generation: gen,
          template: tpl,
        });
      });
    }

    // 2. Agregar los diseños de muestra para tener la experiencia idéntica a Canva
    STATIC_RECENT_DESIGNS.forEach((item) => {
      // Si ya hay suficientes de generaciones reales, solo dejamos los que quepan hasta 14
      if (list.length < 14) {
        // Enlazar con una plantilla real del sistema si coincide para permitir personalización directa
        const matchingTpl = templates.find(t => 
          t.name.toLowerCase().includes(item.title.toLowerCase().slice(0, 10))
        ) || templates[list.length % Math.max(1, templates.length)];

        list.push({
          ...item,
          template: matchingTpl,
        });
      }
    });

    // 3. Filtrar por término de búsqueda si el usuario escribe en "Busca lo que quieras"
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return list.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.headerText?.toLowerCase().includes(q) ||
        item.format.toLowerCase().includes(q)
      );
    }

    return list;
  }, [generations, templates, searchTerm]);

  // Manejador al hacer clic en un diseño de "Seguir diseñando"
  const handleRecentDesignClick = (item: RecentDesignItem) => {
    if (item.template) {
      onSelectTemplate(item.template);
    } else if (templates.length > 0) {
      onSelectTemplate(templates[0]);
    } else {
      toast('Abriendo diseño...', { icon: '✨' });
    }
  };

  // Manejo de clicks en los iconos temáticos estilo Canva
  const handleCategoryIconClick = (categoryKey: string) => {
    switch (categoryKey) {
      case 'plantillas':
        setActiveTab('plantillas');
        handleResetFilters();
        break;
      case 'redes':
        setActiveTab('plantillas');
        setAspectRatioFilter('9:16');
        toast.success('Filtrando creativos para Redes Sociales (Stories / Reels / Feed)', { icon: '📱' });
        break;
      case 'video':
        setActiveTab('plantillas');
        setTypeFilter('video');
        toast.success('Filtrando Videos Comerciales MP4', { icon: '🎬' });
        break;
      case 'imprimir':
      case 'doc':
        setActiveTab('plantillas');
        setAspectRatioFilter('all');
        setTypeFilter('image');
        toast.success('Filtrando Documentos & Cotizaciones A4', { icon: '📄' });
        break;
      case 'presentacion':
        setActiveTab('plantillas');
        setAspectRatioFilter('16:9');
        toast.success('Filtrando Presentaciones y Dossiers Comerciales', { icon: '📊' });
        break;
      case 'fotos':
        setActiveTab('plantillas');
        setTypeFilter('image');
        break;
      case 'capas_magicas':
        toast.success('Marca Blanca Inteligente: Tu logo y precios se insertan automáticamente', { icon: '🪄' });
        if (templates.length > 0) {
          onSelectTemplate(templates[0]);
        }
        break;
      case 'personalizar':
        if (templates.length > 0) {
          onSelectTemplate(templates[0]);
        } else {
          setActiveTab('plantillas');
        }
        break;
      case 'subir':
        onOpenHistory();
        break;
      case 'mas':
        setShowAdvancedFilters(!showAdvancedFilters);
        break;
      default:
        setActiveTab('plantillas');
        break;
    }
  };

  // Componente que renderiza el mini-documento o imagen del thumbnail
  const renderCardThumbnail = (item: RecentDesignItem) => {
    if (item.thumbnailUrl && !item.videoUrl) {
      return (
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
      );
    }

    if (item.videoUrl) {
      return (
        <video
          src={item.videoUrl}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          muted
          playsInline
          loop
          onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
          onMouseLeave={(e) => {
            const v = e.currentTarget as HTMLVideoElement;
            v.pause();
            v.currentTime = 0;
          }}
        />
      );
    }

    // Mini-documentos renderizados en CSS idénticos al screenshot de Canva
    if (item.docType === 'poster') {
      return (
        <div className="w-full h-full rounded-lg relative overflow-hidden flex flex-col justify-end p-2.5 bg-gradient-to-b from-sky-400 via-indigo-600 to-purple-900 text-white shadow-inner">
          <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" />
          <div className="relative z-10 space-y-1">
            <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-sm">
              OFERTA EXCLUSIVA
            </span>
            <p className="text-[10px] font-black leading-tight line-clamp-2 drop-shadow-md">
              {item.headerText}
            </p>
            <div className="flex items-center gap-1 text-[8px] opacity-80">
              <span>★ Vuelo + Hotel</span>
            </div>
          </div>
        </div>
      );
    }

    if (item.docType === 'letter') {
      return (
        <div className="w-full h-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2 flex flex-col justify-between shadow-xs">
          <div className="space-y-1.5">
            {/* Header band */}
            <div className="h-6 w-full rounded bg-gradient-to-r from-sky-500 to-indigo-600 flex items-center px-1.5">
              <span className="text-[8px] font-black text-white truncate">{item.headerText}</span>
            </div>
            {/* Mock text lines */}
            <div className="space-y-1 pt-1">
              <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
              <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
              <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
            </div>
          </div>
          {/* Sign block */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-1 flex items-center justify-between">
            <span className="text-[7px] font-bold text-slate-400">trivali.</span>
            <div className="h-0.5 w-8 bg-slate-300 dark:bg-slate-600" />
          </div>
        </div>
      );
    }

    // Default: Professional Quote / Tour Document
    return (
      <div className="w-full h-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2 flex flex-col justify-between shadow-xs">
        <div className="space-y-1.5">
          {/* Document Header Bar */}
          <div 
            className="w-full py-0.5 px-1.5 rounded flex items-center justify-between"
            style={{ backgroundColor: `${item.themeColor}18`, borderLeft: `3px solid ${item.themeColor}` }}
          >
            <span className="text-[7.5px] font-black truncate" style={{ color: item.themeColor }}>
              {item.headerText}
            </span>
            <span className="text-[6.5px] font-mono font-bold text-slate-400">#2026</span>
          </div>

          {/* Table / Line Mockup */}
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

        {/* Footer Brand */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-1 flex items-center justify-between">
          <span className="text-[7px] font-extrabold text-amber-500 flex items-center gap-0.5">
            trivali<span className="w-1 h-1 rounded-full bg-amber-500 inline-block" />
          </span>
          <span className="text-[6.5px] font-bold text-slate-400">PDF A4</span>
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

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          {/* TÍTULO PRINCIPAL: ¿Qué vamos a diseñar hoy? */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-600 dark:from-indigo-300 dark:via-purple-300 dark:to-indigo-200">
            ¿Qué vamos a diseñar hoy?
          </h1>

          {/* SELECTOR DE PESTAÑAS (Inicio / Plantillas) */}
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex bg-white/90 dark:bg-slate-950/80 backdrop-blur-md p-1 rounded-full border border-purple-200 dark:border-purple-800/80 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('inicio')}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'inicio'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Inicio</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('plantillas')}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'plantillas'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Plantillas</span>
              </button>
            </div>
          </div>

          {/* BARRA DE BÚSQUEDA PRINCIPAL: Busca lo que quieras */}
          <div className="max-w-2xl mx-auto relative pt-1">
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
          {/* CAROUSEL DE ACCIONES / FORMATOS ESTILO CANVA (16 ICONOS) */}
          {/* ============================================================ */}
          <div className="pt-4 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex items-start justify-start sm:justify-center gap-3 sm:gap-4.5 px-2 min-w-max pb-2">
              {/* 1. Plantillas */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('plantillas')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-all">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Plantillas
                </span>
              </button>

              {/* 2. Presentación */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('presentacion')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-all">
                  <Presentation className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-orange-500">
                  Presentación
                </span>
              </button>

              {/* 3. Redes */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('redes')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-all">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-rose-500">
                  Redes
                </span>
              </button>

              {/* 4. Video */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('video')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-fuchsia-600 text-white flex items-center justify-center shadow-md shadow-fuchsia-600/20 group-hover:scale-105 transition-all">
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-fuchsia-600">
                  Video
                </span>
              </button>

              {/* 5. Imprimir */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('imprimir')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-700/20 group-hover:scale-105 transition-all">
                  <Printer className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-purple-700">
                  Imprimir
                </span>
              </button>

              {/* 6. Doc */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('doc')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-all">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-cyan-600">
                  Doc
                </span>
              </button>

              {/* 7. Pizarra */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('pizarra')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-all">
                  <PenTool className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600">
                  Pizarra
                </span>
              </button>

              {/* 8. Hoja de cálculo */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('hoja_calculo')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-all">
                  <Table2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600">
                  Hoja de cálculo
                </span>
              </button>

              {/* 9. Diseño interactivo */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('diseno_interactivo')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-all">
                  <MousePointerClick className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600">
                  Diseño interactivo
                </span>
              </button>

              {/* 10. Sitio web */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('sitio_web')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-all">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-sky-500">
                  Sitio web
                </span>
              </button>

              {/* 11. Correo */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('correo')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500">
                  Correo
                </span>
              </button>

              {/* 12. Fotos */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('fotos')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-md shadow-slate-700/20 group-hover:scale-105 transition-all">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  Fotos
                </span>
              </button>

              {/* 13. Capas Mágicas */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('capas_magicas')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-600/30 group-hover:scale-105 transition-all">
                  <Wand2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-purple-600">
                  Capas Mágicas
                </span>
              </button>

              {/* 14. Personalizar */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('personalizar')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-slate-600 text-white flex items-center justify-center shadow-md shadow-slate-600/20 group-hover:scale-105 transition-all">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  Personalizar
                </span>
              </button>

              {/* 15. Subir */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('subir')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-slate-600 text-white flex items-center justify-center shadow-md shadow-slate-600/20 group-hover:scale-105 transition-all">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  Subir
                </span>
              </button>

              {/* 16. Más */}
              <button
                type="button"
                onClick={() => handleCategoryIconClick('mas')}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-slate-400 dark:bg-slate-700 text-white flex items-center justify-center shadow-md shadow-slate-400/20 group-hover:scale-105 transition-all">
                  <MoreHorizontal className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  Más
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BARRA DE FILTROS AVANZADOS (Desplegable con botón 'Más' o activo) */}
      {/* ============================================================ */}
      {showAdvancedFilters && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Filtros Especiales para Agencias
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-extrabold border border-purple-500/20">
                {templates.length} plantillas disponibles
              </span>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Formato */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Formato:</span>
              <div className="flex flex-wrap bg-slate-100 dark:bg-slate-950 rounded-2xl p-1 border border-slate-200 dark:border-slate-800 text-xs font-bold">
                {[
                  { key: 'all', label: 'Todos' },
                  { key: '9:16', label: '9:16 Stories' },
                  { key: '1:1', label: '1:1 Feed' },
                  { key: '4:5', label: '4:5 Vertical' },
                  { key: '16:9', label: '16:9 Horizontal' },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setAspectRatioFilter(f.key)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      aspectRatioFilter === f.key
                        ? 'bg-purple-600 text-white shadow-sm font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contenido:</span>
              <div className="flex bg-slate-100 dark:bg-slate-950 rounded-2xl p-1 border border-slate-200 dark:border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    typeFilter === 'all'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter('image')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    typeFilter === 'image'
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Imágenes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter('video')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    typeFilter === 'video'
                      ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-amber-500" />
                  <span>Videos MP4</span>
                </button>
              </div>
            </div>

            {/* País */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">País Destino:</span>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <Globe className="w-4 h-4 text-sky-500 shrink-0" />
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 text-xs font-bold outline-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
                >
                  <option value="all">Todos los Países</option>
                  {COUNTRIES_FILTER.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categoría */}
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
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 1: TAB INICIO -> "Seguir diseñando" EXACTO AL SCREENSHOT */}
      {/* ============================================================ */}
      {activeTab === 'inicio' && (
        <div className="space-y-6">
          {/* Header de la sección: Seguir diseñando / Ver todo */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Seguir diseñando
            </h2>
            <button
              type="button"
              onClick={onOpenHistory}
              className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Ver todo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grid de diseños recientes idéntico al screenshot */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 gap-3 sm:gap-4">
            {recentDesigns.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRecentDesignClick(item)}
                className="group bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                {/* Contenedor del Thumbnail */}
                <div className="aspect-[3/4] rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 relative overflow-hidden flex items-center justify-center p-1.5">
                  {/* Badge top-left: 🔒 Privado */}
                  <span className="absolute top-2 left-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-sm text-white text-[9px] font-bold shadow-xs">
                    <Lock className="w-2.5 h-2.5" />
                    <span>{item.badge}</span>
                  </span>

                  {/* Renderizado del thumbnail (imagen o mini-documento) */}
                  {renderCardThumbnail(item)}

                  {/* Overlay de hover con acciones rápidas */}
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecentDesignClick(item);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black flex items-center gap-1 shadow-md shadow-purple-600/30 transition-transform active:scale-95"
                      title="Editar o personalizar"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  </div>
                </div>

                {/* Info inferior: Título del documento y tiempo de edición */}
                <div className="pt-2 space-y-1">
                  <h4 
                    className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors"
                    title={item.title}
                  >
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {item.formatType === 'video' ? (
                      <Video className="w-3 h-3 text-fuchsia-500 shrink-0" />
                    ) : item.formatType === 'doc' ? (
                      <FileText className="w-3 h-3 text-cyan-500 shrink-0" />
                    ) : item.formatType === 'social' ? (
                      <Heart className="w-3 h-3 text-rose-500 shrink-0" />
                    ) : (
                      <Compass className="w-3 h-3 text-purple-600 shrink-0" />
                    )}
                    <span className="truncate">
                      {item.format} • Editado {item.editedTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sección adicional en Inicio: Plantillas Populares para tu Agencia */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Plantillas populares para tu Agencia
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Selecciona una plantilla para insertar tu margen de ganancia y logotipo automáticamente.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('plantillas')}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1 cursor-pointer"
              >
                <span>Explorar todo el catálogo ({templates.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid resumido de 4 o 5 plantillas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {templates.slice(0, 5).map((tpl) => {
                const isVideo =
                  tpl.media_type === 'video' ||
                  tpl.resource?.type === 'video' ||
                  tpl.media?.file_type === 'video';

                const thumbUrl = normalizeFileUrl(
                  tpl.preview_image_url ||
                  tpl.preview_full_url ||
                  tpl.resource?.thumbnail_url ||
                  tpl.media?.full_url ||
                  tpl.media?.url
                );

                const baseCostNum = Number(tpl.base_cost) || 0;
                const suggestedNum = Number(tpl.suggested_price) || 0;
                const profitNum = Math.max(0, suggestedNum - baseCostNum);

                return (
                  <div
                    key={tpl.id}
                    onClick={() => onSelectTemplate(tpl)}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 rounded-2xl overflow-hidden transition-all duration-200 shadow-xs hover:shadow-lg cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-square bg-slate-100 dark:bg-slate-950 overflow-hidden">
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={tpl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          {isVideo ? <Film className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                        </div>
                      )}

                      {/* Aspect Ratio Badge */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-black uppercase text-purple-300 border border-white/10">
                        {tpl.aspect_ratio}
                      </span>

                      {/* Insignia de Ganancia proyectada */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-[10px] font-black text-emerald-400 backdrop-blur-md flex items-center gap-1">
                          <TrendingUp className="w-2.5 h-2.5" />
                          +${profitNum.toFixed(2)}
                        </span>
                        <div className="p-1.5 rounded-lg bg-purple-600 text-white shadow-md">
                          <Sparkles className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 space-y-1">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-purple-600 transition-colors">
                        {tpl.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Costo base: <strong className="text-slate-700 dark:text-slate-200">${baseCostNum.toFixed(2)}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 2: TAB PLANTILLAS -> CATÁLOGO COMPLETO CON FILTROS */}
      {/* ============================================================ */}
      {activeTab === 'plantillas' && (
        <div className="space-y-6">
          {/* Header del Catálogo */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Catálogo de Plantillas Publicitarias
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona una plantilla para personalizar y generar con el logo y precio de tu agencia.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  showAdvancedFilters || hasActiveFilters
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filtros</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={onOpenHistory}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Mis Descargas</span>
              </button>
            </div>
          </div>

          {/* Grid de Plantillas */}
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Cargando plantillas de marketing...
              </p>
            </div>
          ) : templates.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  No se encontraron plantillas publicitarias
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Prueba cambiando los términos de búsqueda o restableciendo los filtros seleccionados.
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

                const baseCostNum = Number(tpl.base_cost) || 0;
                const suggestedNum = Number(tpl.suggested_price) || 0;
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
                          type="button"
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
      )}

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
                      Crea y personaliza en menos de 45 segundos
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
                      Elige cualquier diseño o plantilla
                    </h5>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Haz clic en cualquier tarjeta en "Seguir diseñando" o explora la pestaña "Plantillas" para ver Stories 9:16, Feed 1:1 o Documentos A4.
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
                      Tu logotipo de agencia, contacto comercial y redes sociales se aplican de forma instantánea sin necesidad de software de diseño.
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
