'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  Building2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import publicInmobiliariaService, {
  PublicAgencyConfig,
  PublicEstateItem,
} from '@/services/publicInmobiliariaService';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import Header2Style3 from '@/components/layout/Header2Style3';
import Footer from '@/components/layout/Footer';
import {
  PublicPropertyCard,
} from './PublicInmobiliariaLayout';

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

  useEffect(() => {
    publicInmobiliariaService
      .getConfig(domainParam || undefined)
      .then((res) => {
        if (res.data) setAgency(res.data);
      })
      .catch(() => {});
  }, [domainParam]);

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
        setEstates(p?.data || []);
        setPagination({
          currentPage: p?.current_page || 1,
          lastPage: p?.last_page || 1,
          total: p?.total || 0,
          perPage: p?.per_page || 12,
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

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (domainParam) params.set('domain', domainParam);
    if (search.trim()) params.set('search', search.trim());
    if (propertyStatus) params.set('property_status', propertyStatus);
    if (propertyType) params.set('property_type', propertyType);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (bathrooms) params.set('bathrooms', bathrooms);
    if (priceMin) params.set('price_min', priceMin);
    if (priceMax) params.set('price_max', priceMax);
    if (sort) params.set('sort', sort);
    params.set('page', '1');
    setCurrentPage(1);
    router.push(`/properties?${params.toString()}`);
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
    router.push(domainParam ? `/properties?domain=${encodeURIComponent(domainParam)}` : '/properties');
  };

  const primaryColor = agency?.primary_color || '#00a884';
  const fallbackAgency: PublicAgencyConfig = agency || {
    id: 0,
    name: 'Portal Inmobiliario',
    frontend_enabled: true,
    primary_color: '#00a884',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] text-slate-900 font-sans">
      <TopbarSlider />
      <Header2Style3 agency={fallbackAgency} />

      <div className="bg-slate-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Catálogo de Propiedades</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Explora nuestro inventario verificado de inmuebles en venta y alquiler.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Filtros */}
        <form
          onSubmit={applyFilters}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-8 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
              <SlidersHorizontal className="w-4 h-4" style={{ color: primaryColor }} />
              <span>Filtros de Búsqueda</span>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Búsqueda Libre
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ciudad, sector, palabra clave..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Operación
              </label>
              <select
                value={propertyStatus}
                onChange={(e) => setPropertyStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
              >
                <option value="">Todas</option>
                <option value="2">En Venta</option>
                <option value="1">En Alquiler</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Tipo de Inmueble
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
              >
                <option value="">Todos</option>
                <option value="1">Casas</option>
                <option value="2">Departamentos</option>
                <option value="3">Terrenos / Lotes</option>
                <option value="4">Locales Comerciales</option>
                <option value="5">Oficinas</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Habitaciones
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+ Hab.</option>
                <option value="2">2+ Hab.</option>
                <option value="3">3+ Hab.</option>
                <option value="4">4+ Hab.</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </form>

        {/* Barra de resultados y ordenamiento */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <p className="text-xs font-bold text-slate-600">
            Mostrando <span className="text-slate-900 font-extrabold">{estates.length}</span> de{' '}
            <span className="text-slate-900 font-extrabold">{pagination.total}</span> propiedades encontradas
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Ordenar por:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
            >
              <option value="recent">Más recientes</option>
              <option value="featured">Destacadas primero</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Listado */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-white border border-slate-200 animate-pulse p-4" />
            ))}
          </div>
        ) : estates.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {estates.map((estate) => (
                <PublicPropertyCard
                  key={estate.id}
                  estate={estate}
                  currency={fallbackAgency.currency}
                  primaryColor={primaryColor}
                  domainParam={domainParam}
                />
              ))}
            </div>

            {/* Paginación */}
            {pagination.lastPage > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-xs font-extrabold text-slate-700">
                  Página {pagination.currentPage} de {pagination.lastPage}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= pagination.lastPage}
                  onClick={() => setCurrentPage((p) => Math.min(pagination.lastPage, p + 1))}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">
              No se encontraron propiedades con esos filtros
            </h3>
            <p className="text-xs text-slate-500">
              Intenta ampliar tu búsqueda o restablecer los filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Ver todas las propiedades
            </button>
          </div>
        )}
      </main>

      <Footer agency={fallbackAgency} />
    </div>
  );
};

export default PublicInmobiliariaPropertiesView;

