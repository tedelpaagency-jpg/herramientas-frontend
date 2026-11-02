'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Trash2,
  Send,
  LogIn,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Webhook,
  Mail,
  Sliders,
  Sparkles,
  Info,
  Filter,
  SlidersHorizontal,
  MapPin,
  Tag,
  DollarSign,
  BedDouble,
  Bath,
  Car,
  Maximize2,
  ArrowUpDown,
  Layers,
  UserCheck,
  Check,
  RotateCcw,
  Search,
  LayoutGrid,
  CheckSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import estateService, {
  EstateApprovalSettings,
  FilterSettingsConfig,
  BookingFilterSettings,
  PropertiesListFilterSettings,
  AdminFilterSettings,
} from '@/services/estateService';
import { useAuth } from '@/context/AuthContext';

interface EstateApprovalSettingsPanelProps {
  agencyId?: number;
  onSaved?: () => void;
  isModal?: boolean;
}

const DEFAULT_FILTER_SETTINGS: Required<FilterSettingsConfig> = {
  booking: {
    tabs: true,
    location: true,
    operation: true,
    property_type: true,
    price: true,
  },
  properties_list: {
    search: true,
    city: true,
    operation: true,
    property_type: true,
    bedrooms: true,
    bathrooms: true,
    parking: true,
    price: true,
    size: true,
    sort: true,
  },
  admin: {
    search: true,
    category: true,
    status: true,
    agent: true,
    agency: true,
  },
};

export const EstateApprovalSettingsPanel: React.FC<EstateApprovalSettingsPanelProps> = ({
  agencyId,
  onSaved,
  isModal = false,
}) => {
  const { user, hasPermission } = useAuth();

  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
  const hasEstateAccess =
    isSuperAdmin ||
    hasPermission([
      'view_estates',
      'manage_estates',
      'estates.view',
      'estates.manage',
      'estates.create',
      'portal_inmobiliario.manage',
      'portal_inmobiliario',
    ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [agencyName, setAgencyName] = useState<string>('');
  const [activeMainTab, setActiveMainTab] = useState<'filters' | 'policies' | 'notifications'>('filters');
  const [filterScopeTab, setFilterScopeTab] = useState<'booking' | 'properties_list' | 'admin'>('booking');

  const [settings, setSettings] = useState<EstateApprovalSettings>({
    require_admin_approval_to_publish: false,
    require_admin_approval_to_delete: false,
    notify_on_property_upload: false,
    notify_property_upload_emails: '',
    notify_on_property_delete: false,
    notify_property_delete_emails: '',
    notify_on_user_login: false,
    notify_user_login_emails: '',
    webhook_url: '',
    filter_settings: DEFAULT_FILTER_SETTINGS,
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await estateService.getSettings(agencyId);
      if (data) {
        const loadedFilters = data.filter_settings || {};
        const mergedFilters: FilterSettingsConfig = {
          booking: { ...DEFAULT_FILTER_SETTINGS.booking, ...(loadedFilters.booking || {}) },
          properties_list: { ...DEFAULT_FILTER_SETTINGS.properties_list, ...(loadedFilters.properties_list || {}) },
          admin: { ...DEFAULT_FILTER_SETTINGS.admin, ...(loadedFilters.admin || {}) },
        };

        setSettings({
          require_admin_approval_to_publish: !!data.require_admin_approval_to_publish,
          require_admin_approval_to_delete: !!data.require_admin_approval_to_delete,
          notify_on_property_upload: !!data.notify_on_property_upload,
          notify_property_upload_emails: data.notify_property_upload_emails || '',
          notify_on_property_delete: !!data.notify_on_property_delete,
          notify_property_delete_emails: data.notify_property_delete_emails || '',
          notify_on_user_login: !!data.notify_on_user_login,
          notify_user_login_emails: data.notify_user_login_emails || '',
          webhook_url: data.webhook_url || '',
          filter_settings: mergedFilters,
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al cargar configuración de propiedades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [agencyId]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const updated = await estateService.updateSettings(settings, agencyId);
      if (updated) {
        const loadedFilters = updated.filter_settings || {};
        const mergedFilters: FilterSettingsConfig = {
          booking: { ...DEFAULT_FILTER_SETTINGS.booking, ...(loadedFilters.booking || {}) },
          properties_list: { ...DEFAULT_FILTER_SETTINGS.properties_list, ...(loadedFilters.properties_list || {}) },
          admin: { ...DEFAULT_FILTER_SETTINGS.admin, ...(loadedFilters.admin || {}) },
        };

        setSettings({
          require_admin_approval_to_publish: !!updated.require_admin_approval_to_publish,
          require_admin_approval_to_delete: !!updated.require_admin_approval_to_delete,
          notify_on_property_upload: !!updated.notify_on_property_upload,
          notify_property_upload_emails: updated.notify_property_upload_emails || '',
          notify_on_property_delete: !!updated.notify_on_property_delete,
          notify_property_delete_emails: updated.notify_property_delete_emails || '',
          notify_on_user_login: !!updated.notify_on_user_login,
          notify_user_login_emails: updated.notify_user_login_emails || '',
          webhook_url: updated.webhook_url || '',
          filter_settings: mergedFilters,
        });
      }
      toast.success('¡Configuración de filtros y políticas guardada exitosamente!');
      if (onSaved) onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  // Helper toggle para cada sección de filtros
  const toggleFilter = (section: 'booking' | 'properties_list' | 'admin', key: string) => {
    setSettings((prev) => {
      const curSection = (prev.filter_settings?.[section] as any) || {};
      const currentVal = curSection[key] !== false; // defaults to true
      return {
        ...prev,
        filter_settings: {
          ...prev.filter_settings,
          [section]: {
            ...curSection,
            [key]: !currentVal,
          },
        },
      };
    });
  };

  // Activar o desactivar todos los campos de una sección
  const setAllFilters = (section: 'booking' | 'properties_list' | 'admin', value: boolean) => {
    setSettings((prev) => {
      const defaultKeys = Object.keys(DEFAULT_FILTER_SETTINGS[section]);
      const updatedSection = defaultKeys.reduce((acc, k) => {
        acc[k] = value;
        return acc;
      }, {} as any);

      return {
        ...prev,
        filter_settings: {
          ...prev.filter_settings,
          [section]: updatedSection,
        },
      };
    });
  };

  // Restablecer valores por defecto de una sección
  const resetFilters = (section: 'booking' | 'properties_list' | 'admin') => {
    setSettings((prev) => ({
      ...prev,
      filter_settings: {
        ...prev.filter_settings,
        [section]: { ...DEFAULT_FILTER_SETTINGS[section] },
      },
    }));
  };

  if (!hasEstateAccess) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-black text-slate-800 dark:text-white">Acceso Restringido</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Su cuenta no cuenta con los permisos de gestión inmobiliaria necesarios para configurar las aprobaciones y filtros de propiedades.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500">Cargando configuración de propiedades...</p>
      </div>
    );
  }

  const currentBooking = settings.filter_settings?.booking || DEFAULT_FILTER_SETTINGS.booking;
  const currentList = settings.filter_settings?.properties_list || DEFAULT_FILTER_SETTINGS.properties_list;
  const currentAdmin = settings.filter_settings?.admin || DEFAULT_FILTER_SETTINGS.admin;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Módulo Inmobiliario &bull; Filtros, Políticas &amp; Automatizaciones
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Personalización de Filtros &amp; Políticas de Inmuebles
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Selecciona qué campos de búsqueda se mostrarán en el Booking de portada, en el Catálogo de propiedades y en el Panel administrativo de tu agencia.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-xs font-black text-white flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Guardando...' : 'Guardar Ajustes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setActiveMainTab('filters')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMainTab === 'filters'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Filtros de Búsqueda</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
            Personalizable
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('policies')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMainTab === 'policies'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Políticas de Aprobación</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('notifications')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMainTab === 'notifications'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Notificaciones &amp; Webhooks</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================================= */}
        {/* PESTAÑA 1: PERSONALIZACIÓN DE FILTROS (Booking, Listado, Admin)          */}
        {/* ========================================================================= */}
        {activeMainTab === 'filters' && (
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            {/* Sub-selector de ámbito de filtros (3 pestañas intuitivas) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                    Selecciona el Componente a Personalizar
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Activa o desactiva qué filtros e inputs estarán visibles para cada vista.
                  </p>
                </div>
                {/* Botones de acción masiva para la pestaña activa */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setAllFilters(filterScopeTab, true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Mostrar todos los campos en esta sección"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Marcar Todos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllFilters(filterScopeTab, false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Desmarcar todos los campos en esta sección"
                  >
                    <span>Desmarcar Todos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => resetFilters(filterScopeTab)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Restablecer valores por defecto"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                    <span>Por Defecto</span>
                  </button>
                </div>
              </div>

              {/* Botones de cambio de sección: Booking, Listado, Admin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFilterScopeTab('booking')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                    filterScopeTab === 'booking'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      filterScopeTab === 'booking'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      1. Booking (Hero / Portada)
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Widget de búsqueda en la cabecera principal
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterScopeTab('properties_list')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                    filterScopeTab === 'properties_list'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      filterScopeTab === 'properties_list'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      2. Listado de Propiedades
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Barra de filtros del catálogo público (/properties)
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterScopeTab('admin')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                    filterScopeTab === 'admin'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      filterScopeTab === 'admin'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      3. Sitio Administrativo
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Filtros del panel de control de inmuebles (/estates)
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* SECCIÓN A: FILTROS DEL BOOKING (HERO) */}
            {filterScopeTab === 'booking' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-emerald-600" />
                      Campos Visibles en el Booking (Hero Banner)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Personaliza los campos que verán los usuarios en la tarjeta blanca de búsqueda en la portada de tu portal web.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* 1. Tabs de Operación */}
                  <FilterToggleCard
                    title="Pestañas Superiores de Operación"
                    description="Muestra las 4 pestañas superiores: En Venta, En Renta, Terrenos y Lotes, Comercial."
                    icon={<Layers className="w-4 h-4 text-indigo-500" />}
                    enabled={currentBooking.tabs !== false}
                    onToggle={() => toggleFilter('booking', 'tabs')}
                  />

                  {/* 2. Ubicación / Ciudad */}
                  <FilterToggleCard
                    title="Selector de Ubicación / Ciudad"
                    description="Buscador desplegable de ciudades con debounce de 2s y fotos referenciales."
                    icon={<MapPin className="w-4 h-4 text-emerald-500" />}
                    enabled={currentBooking.location !== false}
                    onToggle={() => toggleFilter('booking', 'location')}
                  />

                  {/* 3. Operación */}
                  <FilterToggleCard
                    title="Selector de Operación"
                    description="Menú desplegable de operación (Venta, Alquiler, Remate, etc.)."
                    icon={<Tag className="w-4 h-4 text-amber-500" />}
                    enabled={currentBooking.operation !== false}
                    onToggle={() => toggleFilter('booking', 'operation')}
                  />

                  {/* 4. Tipo de Propiedad */}
                  <FilterToggleCard
                    title="Tipo de Propiedad / Inmueble"
                    description="Menú desplegable con los tipos de propiedades (Casas, Departamentos, Suites, etc.)."
                    icon={<Building2 className="w-4 h-4 text-blue-500" />}
                    enabled={currentBooking.property_type !== false}
                    onToggle={() => toggleFilter('booking', 'property_type')}
                  />

                  {/* 5. Rango de Precio */}
                  <FilterToggleCard
                    title="Selector de Rango de Precio"
                    description="Menú desplegable con rangos de precio preconfigurados (Hasta $50k, $100k, $200k, etc.)."
                    icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
                    enabled={currentBooking.price !== false}
                    onToggle={() => toggleFilter('booking', 'price')}
                  />
                </div>
              </div>
            )}

            {/* SECCIÓN B: FILTROS DEL LISTADO DE PROPIEDADES (CATÁLOGO FRONTEND) */}
            {filterScopeTab === 'properties_list' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      Campos Visibles en el Catálogo de Propiedades (/properties)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Controla qué filtros aparecen en la barra superior y en el modal de búsqueda avanzada del catálogo público.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* 1. Búsqueda por texto libre */}
                  <FilterToggleCard
                    title="Búsqueda por Texto Libre"
                    description="Permite a los usuarios buscar inmuebles escribiendo palabras clave o títulos."
                    icon={<Search className="w-4 h-4 text-indigo-500" />}
                    enabled={currentList.search !== false}
                    onToggle={() => toggleFilter('properties_list', 'search')}
                  />

                  {/* 2. Ubicación / Ciudad */}
                  <FilterToggleCard
                    title="Selector de Ciudad / Ubicación"
                    description="Selector de ciudades con galería de imágenes y buscador interactivo."
                    icon={<MapPin className="w-4 h-4 text-emerald-500" />}
                    enabled={currentList.city !== false}
                    onToggle={() => toggleFilter('properties_list', 'city')}
                  />

                  {/* 3. Operación */}
                  <FilterToggleCard
                    title="Tipo de Operación"
                    description="Filtro rápido para alternar entre En Venta, En Renta, etc."
                    icon={<Tag className="w-4 h-4 text-amber-500" />}
                    enabled={currentList.operation !== false}
                    onToggle={() => toggleFilter('properties_list', 'operation')}
                  />

                  {/* 4. Tipo de Inmueble */}
                  <FilterToggleCard
                    title="Tipo de Inmueble / Categoría"
                    description="Selector de tipos de propiedades disponibles (Casas, Terrenos, etc.)."
                    icon={<Building2 className="w-4 h-4 text-blue-500" />}
                    enabled={currentList.property_type !== false}
                    onToggle={() => toggleFilter('properties_list', 'property_type')}
                  />

                  {/* 5. Habitaciones */}
                  <FilterToggleCard
                    title="Habitaciones / Recámaras"
                    description="Filtro para seleccionar número mínimo de dormitorios (1+, 2+, 3+, etc.)."
                    icon={<BedDouble className="w-4 h-4 text-purple-500" />}
                    enabled={currentList.bedrooms !== false}
                    onToggle={() => toggleFilter('properties_list', 'bedrooms')}
                  />

                  {/* 6. Baños */}
                  <FilterToggleCard
                    title="Baños"
                    description="Filtro para seleccionar número mínimo de baños (1+, 2+, 3+, etc.)."
                    icon={<Bath className="w-4 h-4 text-cyan-500" />}
                    enabled={currentList.bathrooms !== false}
                    onToggle={() => toggleFilter('properties_list', 'bathrooms')}
                  />

                  {/* 7. Estacionamientos */}
                  <FilterToggleCard
                    title="Estacionamientos / Parqueaderos"
                    description="Filtro para seleccionar número mínimo de plazas de parqueo."
                    icon={<Car className="w-4 h-4 text-emerald-600" />}
                    enabled={currentList.parking !== false}
                    onToggle={() => toggleFilter('properties_list', 'parking')}
                  />

                  {/* 8. Rango de Precios */}
                  <FilterToggleCard
                    title="Rango de Precios (Mín / Máx)"
                    description="Popover desplegable con presets rápidos de precio e inputs personalizados."
                    icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                    enabled={currentList.price !== false}
                    onToggle={() => toggleFilter('properties_list', 'price')}
                  />

                  {/* 9. Superficie / Área */}
                  <FilterToggleCard
                    title="Superficie / Área Construida (m²)"
                    description="Inputs de rango para filtrar por metros cuadrados mínimos y máximos."
                    icon={<Maximize2 className="w-4 h-4 text-orange-500" />}
                    enabled={currentList.size !== false}
                    onToggle={() => toggleFilter('properties_list', 'size')}
                  />

                  {/* 10. Ordenamiento */}
                  <FilterToggleCard
                    title="Selector de Ordenamiento"
                    description="Opciones de orden: Más recientes, Menor precio, Mayor precio, Destacados."
                    icon={<ArrowUpDown className="w-4 h-4 text-sky-500" />}
                    enabled={currentList.sort !== false}
                    onToggle={() => toggleFilter('properties_list', 'sort')}
                  />
                </div>
              </div>
            )}

            {/* SECCIÓN C: FILTROS DEL SITIO ADMINISTRATIVO (CRM / INMUEBLES) */}
            {filterScopeTab === 'admin' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-600" />
                      Filtros del Panel Administrativo de Propiedades (/estates)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configura qué herramientas de filtrado estarán presentes en la barra superior del listado interno del CRM.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* 1. Búsqueda General */}
                  <FilterToggleCard
                    title="Búsqueda General (Título, ID, Ubicación)"
                    description="Input de búsqueda en tiempo real por nombre del inmueble, código o dirección."
                    icon={<Search className="w-4 h-4 text-indigo-500" />}
                    enabled={currentAdmin.search !== false}
                    onToggle={() => toggleFilter('admin', 'search')}
                  />

                  {/* 2. Selector de Categorías */}
                  <FilterToggleCard
                    title="Selector de Categorías / Tipo de Inmueble"
                    description="Desplegable con búsqueda interactiva de las categorías y tipos de inmuebles registrados."
                    icon={<Layers className="w-4 h-4 text-blue-500" />}
                    enabled={currentAdmin.category !== false}
                    onToggle={() => toggleFilter('admin', 'category')}
                  />

                  {/* 3. Estado / Operación */}
                  <FilterToggleCard
                    title="Selector de Estado / Operación"
                    description="Filtro por Disponible, Reservado, Vendido, Alquilado, En Venta, etc."
                    icon={<Tag className="w-4 h-4 text-amber-500" />}
                    enabled={currentAdmin.status !== false}
                    onToggle={() => toggleFilter('admin', 'status')}
                  />

                  {/* 4. Asesor Inmobiliario */}
                  <FilterToggleCard
                    title="Filtro por Asesor Inmobiliario"
                    description="Selector para filtrar el inventario asignado a cada agente o asesor de la agencia."
                    icon={<UserCheck className="w-4 h-4 text-purple-500" />}
                    enabled={currentAdmin.agent !== false}
                    onToggle={() => toggleFilter('admin', 'agent')}
                  />

                  {/* 5. Filtro por Agencia */}
                  <FilterToggleCard
                    title="Filtro por Agencia (SuperAdmin / Marca Blanca)"
                    description="Selector para alternar entre agencias (aplica cuando se gestionan múltiples agencias)."
                    icon={<Building2 className="w-4 h-4 text-emerald-600" />}
                    enabled={currentAdmin.agency !== false}
                    onToggle={() => toggleFilter('admin', 'agency')}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: POLÍTICAS DE APROBACIÓN (Publicar & Eliminar)                  */}
        {/* ========================================================================= */}
        {activeMainTab === 'policies' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Políticas de Aprobación de Inmuebles
                </h3>
                <p className="text-xs text-slate-500">
                  Reglas aplicadas a los agentes y asesores comerciales cuando crean o eliminan propiedades.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opción 1: Aprobación para mostrar */}
              <div
                onClick={() =>
                  setSettings({
                    ...settings,
                    require_admin_approval_to_publish: !settings.require_admin_approval_to_publish,
                  })
                }
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  settings.require_admin_approval_to_publish
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        settings.require_admin_approval_to_publish
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Aprobar para Mostrar Publicación
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {settings.require_admin_approval_to_publish
                          ? 'Modo estricto activado'
                          : 'Publicación automática libre'}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      settings.require_admin_approval_to_publish
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {settings.require_admin_approval_to_publish && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Cuando está <strong>habilitado</strong>, las propiedades cargadas por los asesores se crean con estado pendiente y{' '}
                  <strong>no se publicarán en el frontend</strong> hasta que un administrador las apruebe. En la lista administrativa aparecerán las opciones y botones de aprobación masiva.
                </p>
              </div>

              {/* Opción 2: Aprobación para eliminar */}
              <div
                onClick={() =>
                  setSettings({
                    ...settings,
                    require_admin_approval_to_delete: !settings.require_admin_approval_to_delete,
                  })
                }
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  settings.require_admin_approval_to_delete
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        settings.require_admin_approval_to_delete
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Aprobación Previa para Eliminar
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {settings.require_admin_approval_to_delete
                          ? 'Protección contra borrado activada'
                          : 'Borrado directo permitido'}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      settings.require_admin_approval_to_delete
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {settings.require_admin_approval_to_delete && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Si un asesor intenta suprimir un inmueble, el sistema generará una <strong>solicitud de eliminación</strong>{' '}
                  que un administrador deberá validar antes de mover la propiedad a la papelera.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 3: NOTIFICACIONES & WEBHOOKS                                     */}
        {/* ========================================================================= */}
        {activeMainTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Alertas Inmediatas por Email &amp; Webhooks
                </h3>
                <p className="text-xs text-slate-500">
                  Recibe correos automáticos cuando ocurran eventos críticos en la plataforma inmobiliaria.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Evento 1: Subida de propiedad */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Notificar cuando un usuario o asesor suba una nueva propiedad
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notify_on_property_upload}
                    onChange={(e) =>
                      setSettings({ ...settings, notify_on_property_upload: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded-md cursor-pointer"
                  />
                </div>

                {settings.notify_on_property_upload && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Destinatarios de correo (separados por coma):
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="gerencia@tuagencia.com, ventas@tuagencia.com"
                        value={settings.notify_property_upload_emails}
                        onChange={(e) =>
                          setSettings({ ...settings, notify_property_upload_emails: e.target.value })
                        }
                        className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Evento 2: Eliminación de propiedad */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Notificar cuando se elimine o solicite eliminar una propiedad
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notify_on_property_delete}
                    onChange={(e) =>
                      setSettings({ ...settings, notify_on_property_delete: e.target.checked })
                    }
                    className="w-4 h-4 text-rose-600 rounded-md cursor-pointer"
                  />
                </div>

                {settings.notify_on_property_delete && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Destinatarios de correo para alertas de borrado:
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="auditoria@tuagencia.com, director@tuagencia.com"
                        value={settings.notify_property_delete_emails}
                        onChange={(e) =>
                          setSettings({ ...settings, notify_property_delete_emails: e.target.value })
                        }
                        className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Evento 3: Inicio de sesión de agentes */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-sky-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Notificar cuando un usuario o asesor inicie sesión en el sistema
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notify_on_user_login}
                    onChange={(e) =>
                      setSettings({ ...settings, notify_on_user_login: e.target.checked })
                    }
                    className="w-4 h-4 text-sky-600 rounded-md cursor-pointer"
                  />
                </div>

                {settings.notify_on_user_login && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Correos de supervisión para alertas de login:
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="seguridad@tuagencia.com, admin@tuagencia.com"
                        value={settings.notify_user_login_emails}
                        onChange={(e) =>
                          setSettings({ ...settings, notify_user_login_emails: e.target.value })
                        }
                        className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Opcional: Webhook general */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 space-y-2">
                <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Webhook className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Webhook HTTP (POST) para Eventos de Propiedades</span>
                </label>
                <input
                  type="url"
                  placeholder="https://n8n.tuempresa.com/webhook/propiedades (opcional)"
                  value={settings.webhook_url}
                  onChange={(e) => setSettings({ ...settings, webhook_url: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                <p className="text-[10px] text-slate-500">
                  Se enviarán los payloads en formato JSON cada vez que ocurra la subida o eliminación de un inmueble.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs font-black text-white flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Guardando...' : 'Guardar Ajustes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// Sub-componente para cada Switch de filtro individual
interface FilterToggleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: () => void;
}

const FilterToggleCard: React.FC<FilterToggleCardProps> = ({
  title,
  description,
  icon,
  enabled,
  onToggle,
}) => {
  return (
    <div
      onClick={onToggle}
      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
        enabled
          ? 'border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/20 opacity-75'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            enabled
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">{title}</h5>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0 ${
                enabled
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              {enabled ? 'Visible' : 'Oculto'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{description}</p>
        </div>
      </div>

      {/* Switch estilo iOS */}
      <div
        className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 mt-0.5 cursor-pointer ${
          enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};

export default EstateApprovalSettingsPanel;
