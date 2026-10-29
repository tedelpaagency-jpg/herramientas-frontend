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
  Loader2,
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
  const [alertName, setAlertName] = useState<string>('');
  const [alertContact, setAlertContact] = useState<string>('');
  const [alertSubmitting, setAlertSubmitting] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [tempPriceMin, setTempPriceMin] = useState<string>(priceMin);
  const [tempPriceMax, setTempPriceMax] = useState<string>(priceMax);
  const [searchInputVal, setSearchInputVal] = useState<string>('');

  // Sync state with URL searchParams (e.g. browser back/forward, links)
  useEffect(() => {
    const s = searchParams?.get('search') || '';
    setSearch(s);
    setSearchInputVal(s);
    setPropertyStatus(searchParams?.get('property_status') || '');
    setPropertyType(searchParams?.get('property_type') || '');
    setBedrooms(searchParams?.get('bedrooms') || '');
    setBathrooms(searchParams?.get('bathrooms') || '');
    const pMin = searchParams?.get('price_min') || '';
    const pMax = searchParams?.get('price_max') || '';
    setPriceMin(pMin);
    setPriceMax(pMax);
    setTempPriceMin(pMin);
    setTempPriceMax(pMax);
    setSort((searchParams?.get('sort') as any) || 'recent');
    setCurrentPage(Number(searchParams?.get('page')) || 1);
  }, [searchParams]);

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
    const ba = customParams?.bathrooms !== undefined ? customParams.bathrooms : bathrooms;
    const pMin = customParams?.price_min !== undefined ? customParams.price_min : priceMin;
    const pMax = customParams?.price_max !== undefined ? customParams.price_max : priceMax;
    const srt = customParams?.sort !== undefined ? customParams.sort : sort;

    if (s.trim()) params.set('search', s.trim());
    if (stat) params.set('property_status', stat);
    if (pt) params.set('property_type', pt);
    if (b) params.set('bedrooms', b);
    if (ba) params.set('bathrooms', ba);
    if (pMin) params.set('price_min', pMin);
    if (pMax) params.set('price_max', pMax);
    if (srt) params.set('sort', srt);
    params.set('page', '1');
    setCurrentPage(1);
    router.push(`/properties?${params.toString()}`);
  };

  const handleCreateAlert = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const contactVal = alertContact.trim();
    if (!contactVal) {
      setAlertError('Por favor ingresa tu correo electrónico o número de WhatsApp.');
      return;
    }
    setAlertSubmitting(true);
    setAlertError(null);

    try {
      const isEmail = contactVal.includes('@');
      const criteriaLines = [
        `Operación: ${propertyStatus === '1' ? 'Alquiler' : propertyStatus === '2' ? 'Venta' : 'Todas'}`,
        propertyType ? `Tipo de Inmueble: ${propertyType === '1' ? 'Casas' : propertyType === '2' ? 'Departamentos' : propertyType === '3' ? 'Terrenos' : 'Comercial'}` : null,
        search ? `Ubicación / Sector: ${search}` : null,
        (priceMin || priceMax) ? `Rango de Precio: ${priceMin || '0'} - ${priceMax || 'Max'} USD` : null,
        bedrooms ? `Habitaciones: ${bedrooms}+` : null,
        bathrooms ? `Baños: ${bathrooms}+` : null,
      ].filter(Boolean).join('\n• ');

      await publicInmobiliariaService.sendContactMessage({
        name: alertName.trim() || (isEmail ? contactVal.split('@')[0] : 'Cliente Interesado'),
        email: isEmail ? contactVal : undefined,
        phone: !isEmail ? contactVal : undefined,
        subject: 'Alerta de Búsqueda de Inmuebles',
        message: `El cliente ha activado una alerta para nuevas propiedades con estos criterios:\n• ${criteriaLines}\n\nContacto registrado: ${contactVal}`,
      }, domainParam || undefined);

      setAlertSuccess(true);
    } catch (err: any) {
      setAlertError(err.message || 'No se pudo activar la alerta. Inténtalo nuevamente.');
    } finally {
      setAlertSubmitting(false);
    }
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
  const filterBorderColor = agency?.details?.filter_border_color || primaryColor || '#eab308';
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

        {/* Barra de Filtros estilo Plusvalia / Airbnb (con bordes de branding personalizados y micro-interacciones) */}
        <div className="border-b border-slate-200/90 bg-white shadow-2xs relative">
          {/* Backdrop para cerrar popovers al hacer clic afuera */}
          {(isPricePopoverOpen || isMoreFiltersOpen) && (
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => {
                setIsPricePopoverOpen(false);
                setIsMoreFiltersOpen(false);
              }}
            />
          )}

          <div className="max-w-[1920px] mx-auto px-3 sm:px-6 py-2.5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap">
              
              {/* 1. Buscador con Chip de Tag y Borde de Branding */}
              <div
                style={{
                  borderColor: filterBorderColor,
                  borderWidth: '1.5px',
                }}
                className="relative flex items-center h-[42px] rounded-2xl bg-white px-3 py-1 shadow-2xs transition-all shrink-0 w-56 sm:w-64 focus-within:ring-2 focus-within:ring-slate-900/10"
              >
                {search ? (
                  <span
                    style={{
                      backgroundColor: `${filterBorderColor}18`,
                      color: '#0f172a',
                    }}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-black mr-1.5 shrink-0"
                  >
                    <span className="truncate max-w-[90px]">{search}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setSearchInputVal('');
                        applyFilters({ search: '' });
                      }}
                      className="text-white bg-slate-500 hover:bg-slate-700 rounded-full w-3.5 h-3.5 flex items-center justify-center p-0.5 cursor-pointer"
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
                  className="flex-grow bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none min-w-[60px]"
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
                  <Search className="w-4 h-4" />
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
                  style={{
                    borderColor: filterBorderColor,
                    borderWidth: '1.5px',
                    backgroundColor: propertyStatus ? `${filterBorderColor}14` : '#ffffff',
                    color: propertyStatus ? '#0f172a' : '#1e293b',
                  }}
                  className="appearance-none h-[42px] pl-3.5 pr-8 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">Operación</option>
                  <option value="1">Alquilar</option>
                  <option value="2">Comprar</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  style={{
                    borderColor: filterBorderColor,
                    borderWidth: '1.5px',
                    backgroundColor: propertyType ? `${filterBorderColor}14` : '#ffffff',
                    color: propertyType ? '#0f172a' : '#1e293b',
                  }}
                  className="appearance-none h-[42px] pl-3.5 pr-8 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">Inmueble</option>
                  <option value="1">Casas</option>
                  <option value="2">Departamentos</option>
                  <option value="3">Terrenos / Lotes</option>
                  <option value="4">Comercial / Oficinas</option>
                  <option value="5">Suites / Lofts</option>
                  <option value="6">Villas / Quintas</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  style={{
                    borderColor: filterBorderColor,
                    borderWidth: '1.5px',
                    backgroundColor: bedrooms ? `${filterBorderColor}14` : '#ffffff',
                    color: bedrooms ? '#0f172a' : '#1e293b',
                  }}
                  className="appearance-none h-[42px] pl-3.5 pr-8 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">Habitaciones</option>
                  <option value="1">1+ hab.</option>
                  <option value="2">2+ hab.</option>
                  <option value="3">3+ hab.</option>
                  <option value="4">4+ hab.</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 5. Filtro Precio (con Popover desplegable y botón de limpieza rápida) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreFiltersOpen(false);
                    setIsPricePopoverOpen(!isPricePopoverOpen);
                    setTempPriceMin(priceMin);
                    setTempPriceMax(priceMax);
                  }}
                  style={{
                    borderColor: (priceMin || priceMax || isPricePopoverOpen) ? filterBorderColor : 'rgba(0,0,0,0.15)',
                    borderWidth: '1.5px',
                    backgroundColor: (priceMin || priceMax) ? `${filterBorderColor}14` : '#ffffff',
                    color: (priceMin || priceMax) ? '#0f172a' : '#1e293b',
                  }}
                  className="h-[42px] px-3.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:border-slate-400"
                >
                  <span>
                    {priceMin && priceMax
                      ? `$${Number(priceMin).toLocaleString()} - $${Number(priceMax).toLocaleString()}`
                      : priceMin
                      ? `Desde $${Number(priceMin).toLocaleString()}`
                      : priceMax
                      ? `Hasta $${Number(priceMax).toLocaleString()}`
                      : 'Precio'}
                  </span>
                  {(priceMin || priceMax) ? (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setPriceMin('');
                        setPriceMax('');
                        setTempPriceMin('');
                        setTempPriceMax('');
                        applyFilters({ price_min: '', price_max: '' });
                      }}
                      className="w-4 h-4 rounded-full bg-slate-200/90 hover:bg-slate-300 text-slate-800 flex items-center justify-center p-0.5 ml-0.5 cursor-pointer"
                      title="Quitar filtro de precio"
                    >
                      <X className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isPricePopoverOpen ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {isPricePopoverOpen && (
                  <div className="absolute left-0 sm:left-auto top-full mt-2 w-72 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Rango de Precios (USD)</span>
                      <button
                        type="button"
                        onClick={() => setIsPricePopoverOpen(false)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">Mínimo:</span>
                        <input
                          type="number"
                          placeholder="$0"
                          value={tempPriceMin}
                          onChange={(e) => setTempPriceMin(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">Máximo:</span>
                        <input
                          type="number"
                          placeholder="Sin límite"
                          value={tempPriceMax}
                          onChange={(e) => setTempPriceMax(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                        />
                      </div>
                    </div>

                    {/* Presets rápidos de precios */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      {[
                        { label: '< $50k', min: '', max: '50000' },
                        { label: '$50k - $150k', min: '50000', max: '150000' },
                        { label: '$150k - $300k', min: '150000', max: '300000' },
                        { label: '> $300k', min: '300000', max: '' },
                      ].map((preset) => {
                        const isSelected = tempPriceMin === preset.min && tempPriceMax === preset.max;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setTempPriceMin(preset.min);
                              setTempPriceMax(preset.max);
                            }}
                            style={isSelected ? { backgroundColor: `${filterBorderColor}20`, borderColor: filterBorderColor, color: '#0f172a' } : {}}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer border ${
                              isSelected ? 'font-black' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
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
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
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
                        style={{ backgroundColor: primaryColor }}
                        className="px-4 py-2 rounded-xl text-xs font-black text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Botón Más filtros (Baños, Ordenamiento, Limpieza) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsPricePopoverOpen(false);
                    setIsMoreFiltersOpen(!isMoreFiltersOpen);
                  }}
                  style={{
                    borderColor: (bathrooms || sort !== 'recent' || isMoreFiltersOpen) ? filterBorderColor : 'rgba(0,0,0,0.15)',
                    borderWidth: '1.5px',
                    backgroundColor: (bathrooms || sort !== 'recent') ? `${filterBorderColor}14` : '#ffffff',
                    color: (bathrooms || sort !== 'recent') ? '#0f172a' : '#1e293b',
                  }}
                  className="h-[42px] px-3.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:border-slate-400"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 opacity-70" />
                  <span>Más filtros</span>
                  {(bathrooms || sort !== 'recent') && (
                    <span
                      style={{ backgroundColor: filterBorderColor }}
                      className="w-2 h-2 rounded-full"
                    />
                  )}
                </button>

                {isMoreFiltersOpen && (
                  <div className="absolute left-0 sm:left-auto right-0 top-full mt-2 w-80 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Filtros Adicionales</h4>
                      <button
                        type="button"
                        onClick={() => setIsMoreFiltersOpen(false)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Baños */}
                    <div className="mb-3.5">
                      <span className="text-xs font-bold text-slate-700 block mb-1.5">Baños:</span>
                      <div className="flex items-center gap-1.5">
                        {['', '1', '2', '3', '4'].map((b) => {
                          const isSelected = bathrooms === b;
                          return (
                            <button
                              key={b}
                              type="button"
                              onClick={() => {
                                setBathrooms(b);
                                applyFilters({ bathrooms: b });
                              }}
                              style={isSelected ? { backgroundColor: primaryColor, color: '#ffffff' } : {}}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'shadow-xs font-black'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {b ? `${b}+` : 'Todos'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ordenamiento */}
                    <div className="mb-3.5">
                      <span className="text-xs font-bold text-slate-700 block mb-1.5">Ordenar por:</span>
                      <select
                        value={sort}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setSort(val);
                          applyFilters({ sort: val });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                      >
                        <option value="recent">Más recientes</option>
                        <option value="featured">Destacadas</option>
                        <option value="price_asc">Menor precio</option>
                        <option value="price_desc">Mayor precio</option>
                      </select>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          resetFilters();
                          setIsMoreFiltersOpen(false);
                        }}
                        className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                      >
                        Restablecer todos
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsMoreFiltersOpen(false)}
                        style={{ backgroundColor: primaryColor }}
                        className="px-4 py-1.5 rounded-xl text-xs font-black text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        Listo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Botón Crear alerta */}
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAlertModalOpen(true);
                    setAlertSuccess(false);
                    setAlertError(null);
                  }}
                  style={{
                    borderColor: 'rgba(0, 0, 0, 0.15)',
                    borderWidth: '1.5px',
                  }}
                  className="h-[42px] px-3.5 rounded-2xl text-slate-800 bg-white hover:border-slate-400 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
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
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                >
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">Crear Alerta Inmobiliaria</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAlertModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {alertSuccess ? (
              <div className="text-center py-6">
                <div
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3"
                >
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="text-base font-black text-slate-900 mb-1">¡Alerta Creada con Éxito!</h4>
                <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                  Hemos registrado tus preferencias y enviado la confirmación a <strong>{alertContact}</strong>.
                </p>
                <p className="text-[11px] text-slate-400 mb-5 leading-normal">
                  Te notificaremos de inmediato por correo y WhatsApp apenas ingrese una propiedad con estos criterios al catálogo de <strong>{fallbackAgency.name}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(false)}
                  style={{ backgroundColor: primaryColor }}
                  className="px-6 py-2.5 rounded-xl text-xs font-black text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  Entendido, volver al catálogo
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateAlert}>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Recibe notificaciones inmediatas cada vez que se publique una propiedad con estas características:
                </p>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 space-y-1.5 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Operación:</span>
                    <strong className="text-slate-900">{propertyStatus === '1' ? 'Alquiler' : propertyStatus === '2' ? 'Venta' : 'Todas'}</strong>
                  </div>
                  {propertyType && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Inmueble:</span>
                      <strong className="text-slate-900">{propertyType === '1' ? 'Casas' : propertyType === '2' ? 'Departamentos' : propertyType === '3' ? 'Terrenos' : 'Comercial'}</strong>
                    </div>
                  )}
                  {search && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Ubicación / Sector:</span>
                      <strong className="text-slate-900">{search}</strong>
                    </div>
                  )}
                  {(priceMin || priceMax) && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Rango Precio:</span>
                      <strong className="text-slate-900">{priceMin || '0'} - {priceMax || 'Max'} USD</strong>
                    </div>
                  )}
                  {bedrooms && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Habitaciones:</span>
                      <strong className="text-slate-900">{bedrooms}+ hab.</strong>
                    </div>
                  )}
                  {bathrooms && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Baños:</span>
                      <strong className="text-slate-900">{bathrooms}+ ba.</strong>
                    </div>
                  )}
                </div>

                {alertError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold mb-3">
                    {alertError}
                  </div>
                )}

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre Completo (Opcional):
                    </label>
                    <input
                      type="text"
                      value={alertName}
                      onChange={(e) => setAlertName(e.target.value)}
                      placeholder="Ej: Carlos Andrade"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tu WhatsApp o Correo Electrónico <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={alertContact}
                      onChange={(e) => {
                        setAlertContact(e.target.value);
                        if (alertError) setAlertError(null);
                      }}
                      placeholder="Ej: +593 99 999 9999 o cliente@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Enviaremos la plantilla de confirmación y nuevas propiedades a este contacto.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAlertModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={alertSubmitting}
                    style={{ backgroundColor: primaryColor }}
                    className="px-6 py-2.5 rounded-xl text-xs font-black text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {alertSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Activando...</span>
                      </>
                    ) : (
                      <span>Activar Alerta</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicInmobiliariaPropertiesView;
