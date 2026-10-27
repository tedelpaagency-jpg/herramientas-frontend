'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Building2,
  ChevronLeft,
  ChevronRight,
  Map as MapIcon,
  List as ListIcon,
  X,
  Sparkles,
} from 'lucide-react';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateItem,
} from '@/services/publicInmobiliariaService';
import { AirbnbHeader } from '@/components/inmobiliaria/AirbnbHeader';
import { PublicInmobiliariaFooter } from '@/views/inmobiliaria/PublicInmobiliariaLayout';
import { AirbnbPropertyCard } from '@/components/inmobiliaria/AirbnbPropertyCard';

// Dynamically import Leaflet Map to avoid SSR issues
const PublicPropertiesSplitMap = dynamic(
  () => import('@/components/inmobiliaria/PublicPropertiesSplitMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] rounded-3xl bg-slate-100 flex flex-col items-center justify-center animate-pulse border border-slate-200/80">
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
    perPage: 12,
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

  // Load agency config
  useEffect(() => {
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
          per_page: 12,
        });

        if (!active) return;
        const p = res.data;
        const items = p?.data || [];
        setEstates(items);
        setPagination({
          currentPage: p?.current_page || 1,
          lastPage: p?.last_page || 1,
          total: p?.total || 0,
          perPage: p?.per_page || 12,
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
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <AirbnbHeader agency={fallbackAgency} domainParam={domainParam} />

      {/* Barra de Filtros con Craft Emil Kowalski & Accesibilidad UX */}
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            {/* Buscador Rápido con feedback visual y botón de limpieza de campo */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyFilters();
              }}
              className="flex items-center gap-2 w-full lg:w-auto"
            >
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ciudad, sector, palabra clave..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all duration-200 shadow-2xs"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      applyFilters({ search: '' });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 active:scale-90 transition-all"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 min-h-[40px] rounded-full text-xs font-black text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all duration-150 shadow-sm cursor-pointer"
              >
                Buscar
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="p-2.5 min-h-[40px] rounded-full border border-slate-200 hover:bg-slate-100 active:scale-90 text-slate-600 transition-all duration-150 cursor-pointer"
                  title="Restablecer filtros"
                  aria-label="Restablecer filtros"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Pills de filtros rápidos con micro-interacciones suaves */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
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
                    className={`px-4 py-2 min-h-[38px] rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white text-slate-700 border border-slate-200/90 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Selector de ordenamiento accesible */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500">Ordenar:</span>
              <select
                value={sort}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSort(val);
                  applyFilters({ sort: val });
                }}
                className="px-3.5 py-2 min-h-[38px] rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all cursor-pointer"
              >
                <option value="recent">Más recientes</option>
                <option value="featured">Destacadas</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split View: Left Cards List + Right Sticky Leaflet Map (Imagen 1) */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Encabezado de Resultados estilo Airbnb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900">
              Más de {pagination.total || estates.length} propiedades disponibles en la zona
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Precios con tarifas y comisiones transparentes</span>
          </div>
        </div>

        {/* Contenedor Split: Lista a la izquierda, Mapa a la derecha */}
        <div className="lg:grid lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Grid de Tarjetas (Visible en mobile cuando viewMode === 'list') */}
          <div
            className={`lg:col-span-7 xl:col-span-7 ${
              mobileView === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            {loading ? (
              /* Shimmer Skeletons de alta fidelidad adaptados a la tarjeta */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="flex flex-col p-2.5 rounded-3xl space-y-3">
                    <div className="aspect-[20/19] rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200/60 to-slate-100 animate-pulse" />
                    <div className="h-4 bg-slate-100 rounded-md w-3/4 animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded-md w-1/2 animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded-md w-2/3 animate-pulse" />
                    <div className="h-5 bg-slate-100 rounded-md w-1/3 animate-pulse pt-1" />
                  </div>
                ))}
              </div>
            ) : estates.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      }}
                      onMouseEnter={() => setHoveredEstateId(estate.id)}
                      onMouseLeave={() => setHoveredEstateId(null)}
                    />
                  ))}
                </div>

                {/* Paginación con botones táctiles accesibles */}
                {pagination.lastPage > 1 && (
                  <div className="mt-10 mb-6 flex items-center justify-center gap-2">
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
                      className="p-3 min-w-[44px] min-h-[44px] rounded-full border border-slate-200 bg-white text-slate-700 disabled:opacity-30 hover:bg-slate-50 active:scale-90 transition-all duration-150 cursor-pointer shadow-2xs flex items-center justify-center"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-5 py-2.5 text-xs font-black text-slate-800">
                      Página {pagination.currentPage} de {pagination.lastPage}
                    </span>
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
                      className="p-3 min-w-[44px] min-h-[44px] rounded-full border border-slate-200 bg-white text-slate-700 disabled:opacity-30 hover:bg-slate-50 active:scale-90 transition-all duration-150 cursor-pointer shadow-2xs flex items-center justify-center"
                      aria-label="Página siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State enriquecido según leyes de UX */
              <div className="bg-slate-50/80 rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 max-w-lg mx-auto my-12">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mx-auto text-slate-400">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  No encontramos propiedades con los filtros seleccionados
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Prueba cambiando el tipo de inmueble o limpiando los filtros para ver todo nuestro catálogo disponible.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-6 py-3 min-h-[44px] rounded-full text-xs font-black text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all duration-150 cursor-pointer shadow-md"
                  >
                    Ver todas las propiedades
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha: Sticky Interactive Map (Visible en mobile cuando viewMode === 'map') */}
          <div
            className={`lg:col-span-5 xl:col-span-5 ${
              mobileView === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="sticky top-20 h-[calc(100vh-100px)] min-h-[500px] w-full">
              <PublicPropertiesSplitMap
                estates={estates}
                agency={agency}
                selectedEstate={selectedEstate}
                hoveredEstateId={hoveredEstateId}
                onSelectEstate={(est) => setSelectedEstate(est)}
                domainParam={domainParam}
              />
            </div>
          </div>
        </div>

        {/* Botón flotante para alternar entre Mapa y Lista en Móvil (Emil Kowalski Physics) */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            type="button"
            onClick={() => setMobileView((prev) => (prev === 'list' ? 'map' : 'list'))}
            className="flex items-center gap-2 px-6 py-3.5 min-h-[48px] rounded-full bg-slate-900/95 backdrop-blur-md text-white font-black text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer border border-white/10"
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

      <PublicInmobiliariaFooter agency={fallbackAgency} domainParam={domainParam} />
    </div>
  );
};

export default PublicInmobiliariaPropertiesView;
