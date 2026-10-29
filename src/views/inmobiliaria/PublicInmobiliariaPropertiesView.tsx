'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  RotateCcw,
  Building2,
  ChevronLeft,
  ChevronRight,
  Map as MapIcon,
  List as ListIcon,
  Columns,
  LayoutGrid,
  X,
  ChevronDown,
  SlidersHorizontal,
  Bell,
  Check,
  Sparkles,
} from 'lucide-react';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateItem,
  getCachedAgencyConfig,
} from '@/services/publicInmobiliariaService';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import Header2Style3 from '@/components/layout/Header2Style3';
import { AirbnbPropertyCard } from '@/components/inmobiliaria/AirbnbPropertyCard';
import BrandingThemeInjector from '@/components/inmobiliaria/BrandingThemeInjector';
import PublicPortalLoader from '@/components/inmobiliaria/PublicPortalLoader';

// Dynamically import Leaflet Map to avoid SSR issues
const PublicPropertiesSplitMap = dynamic(
  () => import('@/components/inmobiliaria/PublicPropertiesSplitMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] bg-slate-100 flex flex-col items-center justify-center animate-pulse border border-slate-200">
        <MapIcon className="w-10 h-10 text-slate-300 animate-bounce mb-2" />
        <span className="text-xs font-bold text-slate-400">Cargando mapa interactivo...</span>
      </div>
    ),
  }
);

// Quick filter pills matching Airbnb style
const FILTER_PILLS = [
  { label: 'Todos', type: 'all', value: '' },
  { label: 'En Alquiler', type: 'property_status', value: '1' },
  { label: 'En Venta', type: 'property_status', value: '2' },
  { label: 'Departamentos', type: 'property_type', value: '2' },
  { label: 'Casas', type: 'property_type', value: '1' },
  { label: 'Suites / Lofts', type: 'property_type', value: '2' },
  { label: 'Terrenos', type: 'property_type', value: '3' },
  { label: 'Comercial', type: 'property_type', value: '4' },
  { label: '1+ Hab.', type: 'bedrooms', value: '1' },
  { label: '2+ Hab.', type: 'bedrooms', value: '2' },
  { label: '3+ Hab.', type: 'bedrooms', value: '3' },
];

export const PublicInmobiliariaPropertiesView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domainParam = searchParams?.get('domain') || null;

  const [agency, setAgency] = useState<PublicAgencyConfig | null>(null);
  const [estates, setEstates] = useState<PublicEstateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 18,
  });

  // Filter states
  const [search, setSearch] = useState<string>(searchParams?.get('search') || '');
  const [propertyStatus, setPropertyStatus] = useState<string>(searchParams?.get('property_status') || '');
  const [propertyType, setPropertyType] = useState<string>(searchParams?.get('property_type') || '');
  const [bedrooms, setBedrooms] = useState<string>(searchParams?.get('bedrooms') || '');
  const [bathrooms, setBathrooms] = useState<string>(searchParams?.get('bathrooms') || '');
  const [priceMin, setPriceMin] = useState<string>(searchParams?.get('price_min') || '');
  const [priceMax, setPriceMax] = useState<string>(searchParams?.get('price_max') || '');
  const [sort, setSort] = useState<'recent' | 'price_asc' | 'price_desc' | 'featured'>(
    (searchParams?.get('sort') as any) || 'recent'
  );
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams?.get('page')) || 1);

  // Split view interactions: selected card/pin & hovered card
  const [selectedEstate, setSelectedEstate] = useState<PublicEstateItem | null>(null);
  const [hoveredEstateId, setHoveredEstateId] = useState<number | null>(null);

  // Popovers & Dialogs
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState<boolean>(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertContact, setAlertContact] = useState<string>('');
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [tempPriceMin, setTempPriceMin] = useState<string>(priceMin);
  const [tempPriceMax, setTempPriceMax] = useState<string>(priceMax);
  const [searchInputVal, setSearchInputVal] = useState<string>('');

  // Mobile view toggle (list vs map)
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  // Desktop view mode toggle (split vs full list vs full map)
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');

  // Track screen size to avoid rendering Leaflet inside hidden mobile container
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load agency config (use fast cached config on client mount, then refresh)
  useEffect(() => {
    const cached = getCachedAgencyConfig(domainParam || undefined);
    if (cached) setAgency(cached);

    publicInmobiliariaService
      .getConfig(domainParam || undefined)
      .then((res) => {
        if (res.data) setAgency(res.data);
      })
      .catch(() => {});
  }, [domainParam]);

  // Load estates
  useEffect(() => {
    let active = true;
    const loadEstates = async () => {
      setLoading(true);
      try {
        const res = await publicInmobiliariaService.getEstates({
          domain: domainParam || undefined,
          search: searchParams?.get('search') || undefined,
          property_status: searchParams?.get('property_status') || undefined,
          property_type: searchParams?.get('property_type') || undefined,
          bedrooms: searchParams?.get('bedrooms') || undefined,
          bathrooms: searchParams?.get('bathrooms') || undefined,
          price_min: searchParams?.get('price_min') || undefined,
          price_max: searchParams?.get('price_max') || undefined,
          sort: (searchParams?.get('sort') as any) || sort,
          page: currentPage,
          per_page: 18,
        });

        if (!active) return;
        const p = res.data;
        const items = p?.data || [];
        setEstates(items);
        setPagination({
          currentPage: p?.current_page || 1,
          lastPage: p?.last_page || 1,
          total: p?.total || 0,
          perPage: p?.per_page || 18,
        });
      } catch {
        if (active) setEstates([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEstates();
    return () => {
      active = false;
    };
  }, [searchParams, currentPage, sort, domainParam]);

  const applyFilters = (customParams?: Record<string, string>) => {
    const params = new URLSearchParams();
    if (domainParam) params.set('domain', domainParam);

    const s = customParams?.search !== undefined ? customParams.search : search;
    const stat = customParams?.property_status !== undefined ? customParams.property_status : propertyStatus;
    const pt = customParams?.property_type !== undefined ? customParams.property_type : propertyType;
    const b = customParams?.bedrooms !== undefined ? customParams.bedrooms : bedrooms;
    const pMin = customParams?.price_min !== undefined ? customParams.price_min : priceMin;
    const pMax = customParams?.price_max !== undefined ? customParams.price_max : priceMax;
    const srt = customParams?.sort !== undefined ? customParams.sort : sort;

    if (s.trim()) params.set('search', s.trim());
    if (stat) params.set('property_status', stat);
    if (pt) params.set('property_type', pt);
    if (b) params.set('bedrooms', b);
    if (bathrooms) params.set('bathrooms', bathrooms);
    if (pMin) params.set('price_min', pMin);
    if (pMax) params.set('price_max', pMax);
    if (srt) params.set('sort', srt);
    params.set('page', '1');
    setCurrentPage(1);
    router.push(`/properties?${params.toString()}`);
  };

  const handlePillClick = (pill: typeof FILTER_PILLS[0]) => {
    if (pill.type === 'all') {
      setPropertyStatus('');
      setPropertyType('');
      setBedrooms('');
      applyFilters({ property_status: '', property_type: '', bedrooms: '' });
    } else if (pill.type === 'property_status') {
      const nextVal = propertyStatus === pill.value ? '' : pill.value;
      setPropertyStatus(nextVal);
      applyFilters({ property_status: nextVal });
    } else if (pill.type === 'property_type') {
      const nextVal = propertyType === pill.value ? '' : pill.value;
      setPropertyType(nextVal);
      applyFilters({ property_type: nextVal });
    } else if (pill.type === 'bedrooms') {
      const nextVal = bedrooms === pill.value ? '' : pill.value;
      setBedrooms(nextVal);
      applyFilters({ bedrooms: nextVal });
    }
  };

  const resetFilters = () => {
    setSearch('');
    setPropertyStatus('');
    setPropertyType('');
    setBedrooms('');
    setBathrooms('');
    setPriceMin('');
    setPriceMax('');
    setSort('recent');
    setCurrentPage(1);
    setSelectedEstate(null);
    router.push(domainParam ? `/properties?domain=${encodeURIComponent(domainParam)}` : '/properties');
  };

  const hasActiveFilters = Boolean(
    search.trim() || propertyStatus || propertyType || bedrooms || priceMin || priceMax
  );

  const primaryColor = agency?.primary_color || '#00a884';
  const fallbackAgency: PublicAgencyConfig = agency || {
    id: 0,
    name: 'Portal Inmobiliario',
    frontend_enabled: true,
    primary_color: '#00a884',
  };

  return (
    <div className="travel-agency-03-root h-[100dvh] max-h-[100dvh] flex flex-col bg-white text-slate-900 font-sans overflow-hidden">
      <BrandingThemeInjector agency={fallbackAgency} />
      <PublicPortalLoader
        isOpen={loading}
        countryName={fallbackAgency.country_name || fallbackAgency.country}
        countryImage={fallbackAgency.country_image}
        brandColor={fallbackAgency.primary_color}
        textColor={fallbackAgency.details?.loader_text_color}
        duration={fallbackAgency.details?.loader_duration}
        agency={fallbackAgency}
        message="Un momento por favor, estamos buscando las mejores propiedades."
      />
      {/* Header y barra de filtros fijos que calculan su propia altura */}
      <div className="shrink-0 z-30 bg-white">
        <TopbarSlider agency={fallbackAgency} />
        <Header2Style3 agency={fallbackAgency} />

        {/* Barra de Filtros estilo Plusvalia (Reemplazo moderno de tabs por filtros avanzados) */}
        <div className="border-b border-slate-200/90 bg-white shadow-2xs">
          <div className="max-w-[1920px] mx-auto px-3 sm:px-6 py-2.5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap">
              
              {/* 1. Buscador con Chip de Tag (como [Manabí ⨉] 🔍 de Plusvalia) */}
              <div className="relative flex items-center min-h-[40px] rounded-xl border border-slate-300 bg-white px-2.5 py-1 shadow-2xs hover:border-slate-400 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all shrink-0 w-52 sm:w-64">
                {search ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-xs font-bold text-slate-800 mr-1.5 shrink-0">
                    <span className="truncate max-w-[90px]">{search}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setSearchInputVal('');
                        applyFilters({ search: '' });
                      }}
                      className="text-white bg-slate-400 hover:bg-slate-600 rounded-full w-3.5 h-3.5 flex items-center justify-center p-0.5 cursor-pointer"
                      title="Quitar filtro de ubicación"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ) : null}
                <input
                  type="text"
                  value={searchInputVal}
                  onChange={(e) => setSearchInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = searchInputVal.trim();
                      setSearch(val);
                      applyFilters({ search: val });
                    }
                  }}
                  placeholder={search ? '' : 'Ciudad, zona, sector...'}
                  className="flex-grow bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none min-w-[60px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = searchInputVal.trim();
                    setSearch(val);
                    applyFilters({ search: val });
                  }}
                  className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer shrink-0"
                  title="Buscar"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. Filtro Operación (Alquilar / Comprar) */}
              <div className="relative shrink-0">
                <select
                  value={propertyStatus}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPropertyStatus(val);
                    applyFilters({ property_status: val });
                  }}
                  className={`appearance-none h-[40px] pl-3.5 pr-8 rounded-xl border text-xs font-bold bg-white transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                    propertyStatus
                      ? 'border-slate-900 text-slate-900 bg-slate-50'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <option value="">Operación</option>
                  <option value="1">Alquilar</option>
                  <option value="2">Comprar</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 3. Filtro Tipo de Inmueble */}
              <div className="relative shrink-0">
                <select
                  value={propertyType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPropertyType(val);
                    applyFilters({ property_type: val });
                  }}
                  className={`appearance-none h-[40px] pl-3.5 pr-8 rounded-xl border text-xs font-bold bg-white transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                    propertyType
                      ? 'border-slate-900 text-slate-900 bg-slate-50'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <option value="">Inmueble</option>
                  <option value="1">Casas</option>
                  <option value="2">Departamentos</option>
                  <option value="3">Terrenos / Lotes</option>
                  <option value="4">Comercial / Oficinas</option>
                  <option value="5">Suites / Lofts</option>
                  <option value="6">Villas / Quintas</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 4. Filtro Habitaciones */}
              <div className="relative shrink-0">
                <select
                  value={bedrooms}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBedrooms(val);
                    applyFilters({ bedrooms: val });
                  }}
                  className={`appearance-none h-[40px] pl-3.5 pr-8 rounded-xl border text-xs font-bold bg-white transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                    bedrooms
                      ? 'border-slate-900 text-slate-900 bg-slate-50'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <option value="">Habitaciones</option>
                  <option value="1">1+ hab.</option>
                  <option value="2">2+ hab.</option>
                  <option value="3">3+ hab.</option>
                  <option value="4">4+ hab.</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 5. Filtro Precio (con Popover desplegable y borde resaltado con el color de marca cuando está activo, igual a la captura) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPricePopoverOpen(!isPricePopoverOpen)}
                  className={`h-[40px] px-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                    priceMin || priceMax
                      ? 'border-amber-500 text-amber-700 bg-amber-50/50 ring-1 ring-amber-500/30 font-black'
                      : 'border-slate-300 text-slate-700 bg-white hover:border-slate-400'
                  }`}
                  style={
                    (priceMin || priceMax)
                      ? {
                          borderColor: primaryColor || '#ea580c',
                          color: primaryColor || '#ea580c',
                          boxShadow: `0 0 0 1px ${primaryColor || '#ea580c'}`,
                        }
                      : {}
                  }
                >
                  <span>
                    {priceMin || priceMax
                      ? `${priceMin ? `$${Number(priceMin).toLocaleString()}` : '$0'} - ${priceMax ? `$${Number(priceMax).toLocaleString()}` : 'Max'}`
                      : 'Precio'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {isPricePopoverOpen && (
                  <div className="absolute left-0 sm:left-auto top-full mt-2 w-72 p-3.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="text-xs font-bold text-slate-800 mb-2">Rango de Precios (USD)</div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Desde:</span>
                        <input
                          type="number"
                          placeholder="Mínimo"
                          value={tempPriceMin}
                          onChange={(e) => setTempPriceMin(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Hasta:</span>
                        <input
                          type="number"
                          placeholder="Máximo"
                          value={tempPriceMax}
                          onChange={(e) => setTempPriceMax(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>

                    {/* Presets de precios */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      {[
                        { label: '< $50k', min: '', max: '50000' },
                        { label: '$50k - $150k', min: '50000', max: '150000' },
                        { label: '$150k - $300k', min: '150000', max: '300000' },
                        { label: '> $300k', min: '300000', max: '' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setTempPriceMin(preset.min);
                            setTempPriceMax(preset.max);
                          }}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition-all cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setTempPriceMin('');
                          setTempPriceMax('');
                          setPriceMin('');
                          setPriceMax('');
                          setIsPricePopoverOpen(false);
                          applyFilters({ price_min: '', price_max: '' });
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Limpiar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPriceMin(tempPriceMin);
                          setPriceMax(tempPriceMax);
                          setIsPricePopoverOpen(false);
                          applyFilters({ price_min: tempPriceMin, price_max: tempPriceMax });
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Botón Más filtros */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)}
                  className={`h-[40px] px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 bg-white transition-all cursor-pointer shadow-2xs ${
                    bathrooms || sort !== 'recent'
                      ? 'border-slate-900 text-slate-900 bg-slate-50'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                  <span>Más filtros</span>
                </button>

                {isMoreFiltersOpen && (
                  <div className="absolute left-0 sm:left-auto right-0 top-full mt-2 w-80 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Filtros Adicionales</h4>
                      <button
                        type="button"
                        onClick={() => setIsMoreFiltersOpen(false)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Baños */}
                    <div className="mb-3">
                      <span className="text-xs font-bold text-slate-700 block mb-1.5">Baños:</span>
                      <div className="flex items-center gap-1.5">
                        {['', '1', '2', '3', '4'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => {
                              setBathrooms(b);
                              applyFilters({ bathrooms: b });
                            }}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              bathrooms === b
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {b ? `${b}+` : 'Todos'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ordenamiento */}
                    <div className="mb-3">
                      <span className="text-xs font-bold text-slate-700 block mb-1.5">Ordenar por:</span>
                      <select
                        value={sort}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setSort(val);
                          applyFilters({ sort: val });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                      >
                        <option value="recent">Más recientes</option>
                        <option value="featured">Destacadas</option>
                        <option value="price_asc">Menor precio</option>
                        <option value="price_desc">Mayor precio</option>
                      </select>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          resetFilters();
                          setIsMoreFiltersOpen(false);
                        }}
                        className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
                      >
                        Restablecer todos
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsMoreFiltersOpen(false)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        Listo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Botón Crear alerta (Exactamente como en la referencia Plusvalia) */}
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAlertModalOpen(true);
                    setAlertSuccess(false);
                  }}
                  className="h-[40px] px-3.5 rounded-xl border border-slate-300 text-slate-800 bg-white hover:border-slate-400 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Crear alerta</span>
                  <Bell className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>

              {/* Reset rápido si hay filtros activos */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-[40px] w-[40px] rounded-xl border border-slate-200 hover:bg-slate-100 active:scale-90 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                  title="Restablecer todos los filtros"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Selector de Modo de Visualización en Pantallas Grandes */}
              <div className="hidden xl:flex items-center ml-auto p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Dividir pantalla: listado y mapa interactivo"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Dividido</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Solo catálogo"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Solo Lista</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Solo mapa"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Solo Mapa</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Ocupa el 100% de la altura restante exacta sin desbordar ni cortarse */}
      <main className="w-full flex-1 min-h-0 flex flex-col bg-slate-50 relative overflow-hidden">
        <div className="w-full h-full flex flex-col lg:flex-row min-h-0 overflow-hidden border-t border-slate-200">
          
          {/* Contenedor Izquierdo: Catálogo de propiedades */}
          <div
            className={`${
              viewMode === 'map'
                ? 'hidden'
                : viewMode === 'list'
                ? 'w-full h-full overflow-y-auto px-4 sm:px-8 pt-4 pb-44 sm:pb-20 flex flex-col justify-between bg-white overscroll-contain'
                : `w-full lg:w-[58%] xl:w-[56%] 2xl:w-[54%] h-full overflow-y-auto px-3.5 sm:px-4 pt-3 pb-44 sm:pb-16 flex flex-col justify-between bg-white border-r border-slate-200/90 shadow-2xs overscroll-contain ${
                    mobileView === 'map' ? 'hidden lg:flex' : 'flex'
                  }`
            }`}
          >
            <div className="space-y-3">
              {/* Encabezado del contenedor de tarjetas */}
              <div className="flex items-center justify-between px-1 pt-0.5 pb-2 border-b border-slate-100">
                <span className="text-xs font-black text-slate-800">
                  {pagination.total || estates.length} propiedades encontradas
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Haz clic para ver en mapa
                </span>
              </div>

              {loading ? (
                /* Shimmer Skeletons compactos */
                <div
                  className={
                    viewMode === 'list'
                      ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5 sm:gap-4'
                      : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-3'
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="p-2 rounded-2xl border border-slate-100 space-y-2">
                      <div className="aspect-[4/3] rounded-xl bg-slate-100 animate-pulse" />
                      <div className="h-3.5 bg-slate-100 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
                      <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : estates.length > 0 ? (
                /* Listado de propiedades */
                <div
                  className={
                    viewMode === 'list'
                      ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5 sm:gap-4'
                      : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-3'
                  }
                >
                  {estates.map((estate) => (
                    <AirbnbPropertyCard
                      key={estate.id}
                      estate={estate}
                      currency={fallbackAgency.currency || 'USD'}
                      primaryColor={primaryColor}
                      domainParam={domainParam}
                      isSelected={selectedEstate?.id === estate.id}
                      onSelect={(est) => {
                        setSelectedEstate(est);
                        if (viewMode === 'list') {
                          setViewMode('split');
                        }
                      }}
                      onMouseEnter={() => setHoveredEstateId(estate.id)}
                      onMouseLeave={() => setHoveredEstateId(null)}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State compacto */
                <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 text-center space-y-2 my-8">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center mx-auto text-slate-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800">
                    No encontramos propiedades
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Prueba ajustando el tipo de inmueble o limpiando los filtros.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-bold text-blue-600 hover:underline pt-1"
                  >
                    Ver todas las propiedades
                  </button>
                </div>
              )}
            </div>

            {/* Paginación fijada en el fondo del contenedor scrollable con margen inferior amplio para mobile */}
            {pagination.lastPage > 1 && (
              <div className="mt-8 pt-5 pb-6 mb-24 lg:mb-4 border-t border-slate-200/80 flex items-center justify-between shrink-0 bg-white">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    const prev = Math.max(1, currentPage - 1);
                    setCurrentPage(prev);
                    const params = new URLSearchParams(searchParams?.toString() || '');
                    params.set('page', String(prev));
                    router.push(`/properties?${params.toString()}`);
                  }}
                  className="px-4 py-2 min-h-[38px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 disabled:opacity-30 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-black text-slate-700">
                  Página {pagination.currentPage} de {pagination.lastPage}
                </div>
                <button
                  type="button"
                  disabled={currentPage >= pagination.lastPage}
                  onClick={() => {
                    const next = Math.min(pagination.lastPage, currentPage + 1);
                    setCurrentPage(next);
                    const params = new URLSearchParams(searchParams?.toString() || '');
                    params.set('page', String(next));
                    router.push(`/properties?${params.toString()}`);
                  }}
                  className="px-4 py-2 min-h-[38px] rounded-xl border border-slate-200 text-xs font-bold text-slate-800 disabled:opacity-30 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                  aria-label="Página siguiente"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Contenedor Derecho: Mapa interactivo (pantalla completa o split según modo) */}
          <div
            className={`${
              viewMode === 'list'
                ? 'hidden'
                : viewMode === 'map'
                ? 'w-full h-full relative overflow-hidden bg-slate-100 flex-1 block'
                : `w-full lg:w-[42%] xl:w-[44%] 2xl:w-[46%] h-full relative overflow-hidden bg-slate-100 flex-1 ${
                    mobileView === 'list' ? 'hidden lg:block' : 'block'
                  }`
            }`}
          >
            {/* Botón flotante para regresar a vista dividida cuando está en modo Solo Mapa */}
            {viewMode === 'map' && (
              <div className="absolute top-4 left-4 z-[1000] hidden lg:block">
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 text-white font-black text-xs shadow-xl hover:bg-slate-800 active:scale-95 transition-all cursor-pointer backdrop-blur-xs border border-white/10"
                >
                  <Columns className="w-4 h-4 text-emerald-400" />
                  <span>Mostrar Lista y Mapa</span>
                </button>
              </div>
            )}

            {/* Render Leaflet map only when visible on desktop or active in mobile view to prevent 0x0 size / NaN LatLng errors */}
            {(viewMode === 'map' || isDesktop || mobileView === 'map') && (
              <PublicPropertiesSplitMap
                estates={estates}
                agency={agency}
                selectedEstate={selectedEstate}
                hoveredEstateId={hoveredEstateId}
                onSelectEstate={(est) => setSelectedEstate(est)}
                domainParam={domainParam}
                viewMode={viewMode}
              />
            )}
          </div>
        </div>

        {/* Botón flotante móvil para alternar Lista vs Mapa */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            type="button"
            onClick={() => setMobileView((prev) => (prev === 'list' ? 'map' : 'list'))}
            className="flex items-center gap-2 px-5 py-3 min-h-[46px] rounded-full bg-slate-900 text-white font-black text-xs shadow-2xl active:scale-95 transition-all cursor-pointer border border-white/10"
          >
            {mobileView === 'list' ? (
              <>
                <MapIcon className="w-4 h-4" />
                <span>Ver Mapa</span>
              </>
            ) : (
              <>
                <ListIcon className="w-4 h-4" />
                <span>Ver Lista</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* Modal Crear Alerta (Estilo Plusvalia) */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">Crear Alerta Inmobiliaria</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAlertModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {alertSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900 mb-1">¡Alerta Creada con Éxito!</h4>
                <p className="text-xs text-slate-500 mb-4">
                  Te avisaremos directamente por WhatsApp o Email apenas ingrese una propiedad que coincida con tus criterios de búsqueda.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-600 mb-3">
                  Recibe notificaciones inmediatas cada vez que se publique una propiedad con estas características:
                </p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 space-y-1 mb-4">
                  <div>• Operación: <strong>{propertyStatus === '1' ? 'Alquiler' : propertyStatus === '2' ? 'Venta' : 'Todas'}</strong></div>
                  {propertyType && <div>• Inmueble: <strong>{propertyType === '1' ? 'Casas' : propertyType === '2' ? 'Departamentos' : propertyType}</strong></div>}
                  {search && <div>• Ubicación / Sector: <strong>{search}</strong></div>}
                  {(priceMin || priceMax) && <div>• Rango Precio: <strong>{priceMin || '0'} - {priceMax || 'Max'} USD</strong></div>}
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tu WhatsApp o Correo Electrónico:
                  </label>
                  <input
                    type="text"
                    value={alertContact}
                    onChange={(e) => setAlertContact(e.target.value)}
                    placeholder="Ej: +593 99 999 9999 o cliente@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAlertModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!alertContact.trim()) return;
                      setAlertSuccess(true);
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                  >
                    Activar Alerta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicInmobiliariaPropertiesView;
