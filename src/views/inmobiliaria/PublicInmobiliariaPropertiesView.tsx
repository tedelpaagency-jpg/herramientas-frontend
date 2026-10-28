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
} from 'lucide-react';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateItem,
  getCachedAgencyConfig,
} from '@/services/publicInmobiliariaService';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import Header2Style3 from '@/components/layout/Header2Style3';
import { AirbnbPropertyCard } from '@/components/inmobiliaria/AirbnbPropertyCard';

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

        // Default selected estate on initial desktop load
        if (items.length > 0 && !selectedEstate) {
          setSelectedEstate(items[0]);
        }
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
    <div className="travel-agency-03-root min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      {/* 1. Mismo header de navegación que en la vista de inicio */}
      <TopbarSlider agency={fallbackAgency} />
      <Header2Style3 agency={fallbackAgency} />

      {/* 2. Barra de Filtros compacta */}
      <div className="border-b border-slate-200/90 bg-white shadow-2xs z-30">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5">
            {/* Buscador Rápido */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyFilters();
              }}
              className="flex items-center gap-2 w-full lg:w-auto"
            >
              <div className="relative flex-1 sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ciudad, sector, palabra clave..."
                  className="w-full pl-9 pr-8 py-2 rounded-full border border-slate-300 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-2xs"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      applyFilters({ search: '' });
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 active:scale-90 transition-all"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 min-h-[36px] rounded-full text-xs font-black text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                Buscar
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="p-2 min-h-[36px] rounded-full border border-slate-200 hover:bg-slate-100 active:scale-90 text-slate-600 transition-all cursor-pointer"
                  title="Restablecer filtros"
                  aria-label="Restablecer filtros"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Pills de filtros rápidos */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
              {FILTER_PILLS.map((pill) => {
                const isActive =
                  (pill.type === 'all' && !propertyStatus && !propertyType && !bedrooms) ||
                  (pill.type === 'property_status' && propertyStatus === pill.value) ||
                  (pill.type === 'property_type' && propertyType === pill.value) ||
                  (pill.type === 'bedrooms' && bedrooms === pill.value);

                return (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() => handlePillClick(pill)}
                    className={`px-3 py-1.5 min-h-[32px] rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Selector de ordenamiento y Modo de Vista */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              <span className="text-xs font-semibold text-slate-500">Ordenar:</span>
              <select
                value={sort}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSort(val);
                  applyFilters({ sort: val });
                }}
                className="px-3 py-1.5 min-h-[34px] rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all cursor-pointer"
              >
                <option value="recent">Más recientes</option>
                <option value="featured">Destacadas</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
              </select>

              {/* Selector de Modo de Visualización en Pantallas Grandes */}
              <div className="hidden lg:flex items-center p-1 rounded-full bg-slate-100 border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Dividir pantalla: listado y mapa interactivo"
                >
                  <Columns className="w-3.5 h-3.5 text-slate-600" />
                  <span>Dividido</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Ver sólo catálogo de propiedades a pantalla completa"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-slate-600" />
                  <span>Solo Lista</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Ocultar listado y ver sólo mapa interactivo a pantalla completa"
                >
                  <MapIcon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Solo Mapa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: 30% Propiedades (con contenedor scroll) + 70% Mapa (sin espacios en blanco) */}
      <main className="w-full flex-1 flex flex-col min-h-0 bg-slate-50">
        <div className="w-full h-[calc(100dvh-170px)] lg:h-[calc(100vh-140px)] min-h-[480px] lg:min-h-[580px] flex flex-col lg:flex-row overflow-hidden border-t border-slate-200">
          
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
    </div>
  );
};

export default PublicInmobiliariaPropertiesView;
