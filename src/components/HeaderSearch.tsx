'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import searchService, { SearchClientResult, SearchWorkspaceResult } from '../services/searchService';
import {
  Search,
  X,
  Briefcase,
  Users,
  Home,
  CheckSquare,
  Calendar,
  Calculator,
  Building2,
  Plane,
  FileText,
  ShoppingCart,
  CreditCard,
  Store,
  Package,
  Globe,
  Zap,
  Wrench,
  GraduationCap,
  BookOpen,
  Trophy,
  ShieldCheck,
  Palette,
  Image as ImageIcon,
  Layers,
  Key,
  FileCheck,
  ArrowRight,
  Loader2,
  Kanban,
  Phone,
  Mail,
  UserCheck,
  Sparkles,
  ChevronRight,
  CornerDownLeft,
} from 'lucide-react';

interface ModuleItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  permission?: string | string[];
  keywords: string[];
  roleRestriction?: 'super_admin' | 'white_label_admin' | 'super_or_white_label';
}

const SYSTEM_MODULES: ModuleItem[] = [
  // PRINCIPAL & CRM
  {
    id: 'mod-home',
    label: 'Inicio / Dashboard',
    path: '/',
    icon: Home,
    category: 'PRINCIPAL & CRM',
    keywords: ['inicio', 'dashboard', 'resumen', 'métricas', 'estadísticas', 'home'],
  },
  {
    id: 'mod-workspaces',
    label: 'CRMs y Embudos (Workspaces)',
    path: '/workspaces',
    icon: Briefcase,
    category: 'PRINCIPAL & CRM',
    permission: ['view_crm', 'manage_crm', 'workspaces.view', 'workspaces', 'crm.view'],
    keywords: ['crm', 'workspaces', 'embudos', 'kanban', 'leads', 'prospectos', 'ventas', 'oportunidades'],
  },
  {
    id: 'mod-clients',
    label: 'Directorio de Clientes',
    path: '/clients',
    icon: Users,
    category: 'PRINCIPAL & CRM',
    permission: ['view_clients', 'clients.view', 'view_crm', 'manage_crm'],
    keywords: ['clientes', 'contactos', 'directorio', 'personas', 'empresas', 'leads'],
  },
  {
    id: 'mod-tasks',
    label: 'Gestión de Tareas',
    path: '/tasks',
    icon: CheckSquare,
    category: 'PRINCIPAL & CRM',
    permission: ['tasks.view', 'view_tasks', 'tasks.manage'],
    keywords: ['tareas', 'pendientes', 'kanban tareas', 'actividades pendientes', 'to do'],
  },
  {
    id: 'mod-calendar',
    label: 'Calendario y Citas',
    path: '/calendar',
    icon: Calendar,
    category: 'PRINCIPAL & CRM',
    permission: ['view_crm', 'manage_crm', 'tasks.view', 'calendar.view'],
    keywords: ['calendario', 'agenda', 'citas', 'reuniones', 'eventos', 'google calendar'],
  },

  // MODULO INMOBILIARIO
  {
    id: 'mod-acm',
    label: 'ACM (Avalúo Comercial)',
    path: '/acm',
    icon: Calculator,
    category: 'MODULO INMOBILIARIO',
    permission: ['view_estates', 'manage_estates', 'estates.view', 'estates.create', 'estates.manage', 'acm.view'],
    keywords: ['acm', 'avaluo', 'estimacion', 'valoracion', 'inmobiliario', 'comercial'],
  },
  {
    id: 'mod-estates',
    label: 'Propiedades e Inmuebles',
    path: '/estates',
    icon: Building2,
    category: 'MODULO INMOBILIARIO',
    permission: ['view_estates', 'manage_estates', 'estates.view', 'estates.create', 'estates.manage'],
    keywords: ['propiedades', 'inmuebles', 'casas', 'departamentos', 'terrenos', 'bienes raices', 'lotes'],
  },

  // VISAS MINORISTAS & MAYORISTAS
  {
    id: 'mod-visas',
    label: 'Visas Minoristas (Formularios)',
    path: '/visas',
    icon: FileCheck,
    category: 'VISAS',
    permission: ['view_visas', 'visas.view', 'manage_visas'],
    keywords: ['visas', 'formularios', 'citas consulares', 'ds160', 'consular', 'tramites'],
  },
  {
    id: 'mod-visas-mayorista',
    label: 'Operaciones Mayorista B2B (Visas)',
    path: '/visas/mayorista',
    icon: Building2,
    category: 'VISAS',
    permission: ['view_visas', 'visas.view', 'manage_visas'],
    keywords: ['mayorista', 'visas b2b', 'expedientes', 'operaciones', 'dossier'],
  },
  {
    id: 'mod-visas-agencias',
    label: 'Agencias Afiliadas B2B',
    path: '/visas/mayorista/agencias',
    icon: Building2,
    category: 'VISAS',
    permission: ['view_visas', 'visas.view', 'manage_visas'],
    keywords: ['agencias afiliadas', 'b2b agencias', 'mayorista agencias'],
  },
  {
    id: 'mod-visas-tipos',
    label: 'Configurar Tipos de Visas B2B',
    path: '/visas/tipos',
    icon: Layers,
    category: 'VISAS',
    permission: ['view_visas', 'visas.view', 'visas.processes.manage', 'manage_visas'],
    keywords: ['tipos de visa', 'procesos', 'requisitos', 'documentos requeridos'],
  },
  {
    id: 'mod-visas-politicas',
    label: 'Políticas de Visados B2B',
    path: '/visas/politicas',
    icon: FileText,
    category: 'VISAS',
    permission: ['view_visas', 'visas.view', 'visas.settings.manage', 'manage_visas'],
    keywords: ['politicas visados', 'términos', 'condiciones'],
  },

  // MODULO VIAJES & PAQUETES
  {
    id: 'mod-travel-packages',
    label: 'Paquetes Turísticos',
    path: '/travel-packages',
    icon: Plane,
    category: 'VIAJES & PAQUETES',
    permission: ['packages.view', 'packages.catalog', 'packages.manage'],
    keywords: ['paquetes', 'viajes', 'turismo', 'vuelos', 'hoteles', 'tours', 'destinos'],
  },
  {
    id: 'mod-travel-reports',
    label: 'Reportes de Viaje',
    path: '/travel-reports',
    icon: FileText,
    category: 'VIAJES & PAQUETES',
    permission: ['view_travel_reports', 'travel_reports.view', 'approve_travel_reports'],
    keywords: ['reportes de viaje', 'liquidaciones', 'pasajeros', 'itinerarios'],
  },
  {
    id: 'mod-pos',
    label: 'Punto de Venta POS',
    path: '/pos',
    icon: ShoppingCart,
    category: 'VIAJES & PAQUETES',
    permission: ['view_pos', 'manage_pos', 'pos.view'],
    keywords: ['pos', 'punto de venta', 'caja', 'ventas', 'cobros', 'facturación'],
  },
  {
    id: 'mod-commissions',
    label: 'Gestión de Comisiones',
    path: '/commissions',
    icon: CreditCard,
    category: 'VIAJES & PAQUETES',
    permission: ['commissions.view', 'commissions.manage'],
    keywords: ['comisiones', 'asesores', 'liquidación', 'pagos', 'balances'],
  },
  {
    id: 'mod-suppliers',
    label: 'Directorio de Proveedores',
    path: '/supplier',
    icon: Store,
    category: 'VIAJES & PAQUETES',
    permission: ['view_products', 'packages.view', 'suppliers.view'],
    keywords: ['proveedores', 'operadores', 'hoteles', 'aerolineas', 'mayoristas'],
  },
  {
    id: 'mod-products',
    label: 'Productos e Insumos',
    path: '/products',
    icon: Package,
    category: 'VIAJES & PAQUETES',
    permission: ['view_products', 'products.view'],
    keywords: ['productos', 'inventario', 'insumos', 'stock', 'catalogo'],
  },

  // MARKETING & LEGAL
  {
    id: 'mod-lexvault',
    label: 'LexVault (Contratos Legales)',
    path: '/lexvault',
    icon: FileText,
    category: 'MARKETING & LEGAL',
    permission: ['view_lexvault', 'manage_lexvault', 'lexvault.view', 'lexvault', 'view_contracts', 'contracts.view'],
    keywords: ['lexvault', 'contratos', 'legal', 'firmas', 'plantillas legales', 'documentos', 'acuerdos'],
  },
  {
    id: 'mod-hunter',
    label: 'Tiendas Hunter (QR & Comercios)',
    path: '/hunter',
    icon: Store,
    category: 'MARKETING & LEGAL',
    permission: ['view_hunter', 'hunter.view', 'hunter'],
    keywords: ['hunter', 'tiendas', 'comercios', 'qr', 'afiliados'],
  },
  {
    id: 'mod-landings',
    label: 'Plantillas y Páginas Landing',
    path: '/landings',
    icon: Globe,
    category: 'MARKETING & LEGAL',
    permission: ['landings.view', 'view_landings', 'landings', 'landings.create', 'manage_landings'],
    keywords: ['landings', 'paginas web', 'captura', 'plantillas', 'formularios web', 'leads web'],
  },
  {
    id: 'mod-marketing',
    label: 'Marketing & Campañas de Correo',
    path: '/marketing',
    icon: Zap,
    category: 'MARKETING & LEGAL',
    permission: ['email_marketing', 'view_email_marketing', 'campaigns.view', 'marketing.view', 'marketing'],
    keywords: ['marketing', 'campañas', 'email', 'correos masivos', 'newsletters'],
  },
  {
    id: 'mod-automations',
    label: 'Automatizaciones & Webhooks',
    path: '/automations',
    icon: Wrench,
    category: 'MARKETING & LEGAL',
    permission: ['automations', 'view_automations', 'automations.view'],
    keywords: ['automatizaciones', 'flujos', 'bots', 'webhooks', 'triggers', 'eventos'],
  },

  // CURSOS & ACTIVIDADES
  {
    id: 'mod-courses',
    label: 'Cursos & Capacitación',
    path: '/courses',
    icon: GraduationCap,
    category: 'CURSOS & CAPACITACIÓN',
    permission: ['courses.view', 'courses.create', 'courses.manage'],
    keywords: ['cursos', 'capacitacion', 'academia', 'lecciones', 'estudiantes', 'clases'],
  },
  {
    id: 'mod-my-courses',
    label: 'Mis Cursos',
    path: '/my-courses',
    icon: BookOpen,
    category: 'CURSOS & CAPACITACIÓN',
    permission: ['courses.view'],
    keywords: ['mis cursos', 'mis clases', 'mis capacitaciones'],
  },
  {
    id: 'mod-gamification',
    label: 'Gamificación & Ruleta de Premios',
    path: '/gamification',
    icon: Trophy,
    category: 'CURSOS & CAPACITACIÓN',
    permission: ['view_spin_wheel', 'view_gamification', 'spin_wheel.view', 'gamification.view'],
    keywords: ['gamificacion', 'ruleta', 'puntos', 'recompensas', 'premios'],
  },
  {
    id: 'mod-activities',
    label: 'Grupos de Actividades',
    path: '/activities',
    icon: CheckSquare,
    category: 'ACTIVIDADES',
    permission: ['activities.view', 'activities.create', 'activities.update'],
    keywords: ['actividades', 'grupos', 'tareas equipo', 'evaluaciones'],
  },
  {
    id: 'mod-my-activities',
    label: 'Mis Actividades',
    path: '/my-activities',
    icon: FileText,
    category: 'ACTIVIDADES',
    permission: ['activities.view'],
    keywords: ['mis actividades', 'mis tareas'],
  },

  // ADMINISTRACIÓN
  {
    id: 'mod-white-labels',
    label: 'Marcas Blancas (Tenants)',
    path: '/admin/white-labels',
    icon: Globe,
    category: 'ADMINISTRACIÓN SISTEMA',
    permission: ['manage_agencies', 'view_agencies', 'agencies.view'],
    roleRestriction: 'super_or_white_label',
    keywords: ['marcas blancas', 'white labels', 'tenants', 'franquicias', 'empresas'],
  },
  {
    id: 'mod-agencies',
    label: 'Gestión de Agencias',
    path: '/agencies',
    icon: Building2,
    category: 'ADMINISTRACIÓN SISTEMA',
    permission: ['manage_agencies', 'view_agencies', 'agencies.view'],
    keywords: ['agencias', 'sucursales', 'oficinas'],
  },
  {
    id: 'mod-users',
    label: 'Usuarios & Equipo',
    path: '/users',
    icon: UserCheck,
    category: 'ADMINISTRACIÓN SISTEMA',
    permission: ['manage_users', 'view_users', 'users.view'],
    keywords: ['usuarios', 'equipo', 'colaboradores', 'asesores', 'empleados'],
  },
  {
    id: 'mod-roles',
    label: 'Roles & Permisos',
    path: '/roles',
    icon: ShieldCheck,
    category: 'ADMINISTRACIÓN SISTEMA',
    permission: ['roles.manage', 'manage_roles', 'roles.view', 'view_roles', 'roles'],
    keywords: ['roles', 'permisos', 'seguridad', 'accesos', 'grupos de permisos'],
  },
  {
    id: 'mod-branding',
    label: 'Personalizar Marca (Branding)',
    path: '/branding',
    icon: Palette,
    category: 'ADMINISTRACIÓN SISTEMA',
    permission: ['custom_agency_branding', 'branding.view', 'branding.manage'],
    keywords: ['branding', 'personalizar marca', 'logo', 'colores', 'diseño'],
  },
  {
    id: 'mod-media',
    label: 'Biblioteca de Medios',
    path: '/media',
    icon: ImageIcon,
    category: 'ADMINISTRACIÓN SISTEMA',
    permission: ['courses.view', 'activities.view', 'agencies.view', 'media.view'],
    keywords: ['medios', 'archivos', 'imagenes', 'fotos', 'galeria', 'videos'],
  },
  {
    id: 'mod-plans',
    label: 'Administrar Planes',
    path: '/admin/plans',
    icon: Layers,
    category: 'ADMINISTRACIÓN SISTEMA',
    permission: ['manage_plans', 'manage_agencies'],
    roleRestriction: 'super_or_white_label',
    keywords: ['planes', 'precios', 'paquetes suscripcion', 'niveles'],
  },
  {
    id: 'mod-subscriptions',
    label: 'Suscripciones',
    path: '/admin/subscriptions',
    icon: Key,
    category: 'ADMINISTRACIÓN SISTEMA',
    permission: ['manage_subscriptions', 'manage_agencies'],
    roleRestriction: 'super_or_white_label',
    keywords: ['suscripciones', 'pagos', 'membresias', 'facturacion planes'],
  },
];

type FilterTab = 'all' | 'modules' | 'clients' | 'workspaces';

interface FlatSearchItem {
  type: 'module' | 'client' | 'workspace';
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const HeaderSearch: React.FC = () => {
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Backend search results
  const [apiClients, setApiClients] = useState<SearchClientResult[]>([]);
  const [apiWorkspaces, setApiWorkspaces] = useState<SearchWorkspaceResult[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsListRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.roles?.some((r) => r.name === 'super_admin');

  const isWhiteLabelAdmin =
    user?.role === 'white_label_admin' ||
    user?.roles?.some((r) => r.name === 'white_label_admin');

  // Filter accessible modules based on permissions and role restrictions
  const accessibleModules = useMemo(() => {
    return SYSTEM_MODULES.filter((mod) => {
      if (mod.roleRestriction === 'super_admin' && !isSuperAdmin) return false;
      if (mod.roleRestriction === 'white_label_admin' && !isWhiteLabelAdmin) return false;
      if (mod.roleRestriction === 'super_or_white_label' && !isSuperAdmin && !isWhiteLabelAdmin) {
        return false;
      }
      if (!mod.permission) return true;
      return hasPermission(mod.permission);
    });
  }, [hasPermission, isSuperAdmin, isWhiteLabelAdmin]);

  // Client-side module search results (instant 0ms)
  const matchedModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return accessibleModules.filter((mod) => {
      const matchLabel = mod.label.toLowerCase().includes(q);
      const matchCategory = mod.category.toLowerCase().includes(q);
      const matchKeywords = mod.keywords.some((k) => k.toLowerCase().includes(q));
      return matchLabel || matchCategory || matchKeywords;
    });
  }, [query, accessibleModules]);

  // Fetch backend results (Clients & Workspaces) with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setApiClients([]);
      setApiWorkspaces([]);
      setIsLoadingApi(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingApi(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchService.globalSearch(trimmed, controller.signal);
        setApiClients(res.clients || []);
        setApiWorkspaces(res.workspaces || []);
      } catch (err: any) {
        if (err?.name !== 'CanceledError' && err?.code !== 'ERR_CANCELED') {
          setApiClients([]);
          setApiWorkspaces([]);
        }
      } finally {
        setIsLoadingApi(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered items based on activeTab
  const visibleModules = activeTab === 'all' || activeTab === 'modules' ? matchedModules : [];
  const visibleClients = activeTab === 'all' || activeTab === 'clients' ? apiClients : [];
  const visibleWorkspaces = activeTab === 'all' || activeTab === 'workspaces' ? apiWorkspaces : [];

  // Flattened list for keyboard navigation
  const flatItems: FlatSearchItem[] = useMemo(() => {
    const list: FlatSearchItem[] = [];

    visibleModules.forEach((mod) => {
      list.push({
        type: 'module',
        id: mod.id,
        title: mod.label,
        subtitle: mod.category,
        badge: 'Módulo',
        badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300',
        path: mod.path,
        icon: mod.icon,
      });
    });

    visibleClients.forEach((c) => {
      const details = [c.company, c.phone, c.email].filter(Boolean).join(' • ');
      list.push({
        type: 'client',
        id: `client-${c.id}`,
        title: c.name,
        subtitle: details || (c.agency_name ? `Agencia: ${c.agency_name}` : 'Cliente'),
        badge: c.workspace_name ? `CRM: ${c.workspace_name}` : 'Cliente',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300',
        path: `/clients?search=${encodeURIComponent(c.name)}`,
      });
    });

    visibleWorkspaces.forEach((w) => {
      const subtitle = w.description || (w.agency_name ? `Agencia: ${w.agency_name}` : 'Embudo de Ventas');
      list.push({
        type: 'workspace',
        id: `workspace-${w.id}`,
        title: w.name,
        subtitle,
        badge: `${w.clients_count || 0} Prospectos`,
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
        path: `/crm?workspace_id=${w.id}`,
      });
    });

    return list;
  }, [visibleModules, visibleClients, visibleWorkspaces]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  // Navigate safely to path
  const handleSelect = (item: FlatSearchItem) => {
    setIsOpen(false);
    setQuery('');
    if (typeof window !== 'undefined') {
      window.location.assign(item.path);
    }
  };

  // Keyboard navigation inside input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        handleSelect(flatItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const totalResultsCount = matchedModules.length + apiClients.length + apiWorkspaces.length;
  const hasSearched = query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-[180px] xs:max-w-[220px] sm:max-w-xs lg:w-96 min-w-0">
      {/* Search Input Box */}
      <div
        className={`flex items-center gap-1.5 sm:gap-2 bg-slate-100/90 dark:bg-slate-800/80 border transition-all duration-200 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 w-full ${
          isOpen
            ? 'border-blue-500 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
            : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        {isLoadingApi ? (
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
        ) : (
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 flex-shrink-0" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar módulo, cliente o CRM..."
          className="bg-transparent border-none focus:ring-0 outline-none text-xs sm:text-sm w-full min-w-0 truncate text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setApiClients([]);
              setApiWorkspaces([]);
              inputRef.current?.focus();
            }}
            className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
            title="Borrar búsqueda"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Shortcut Badge (Desktop Only) */}
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs select-none">
          <span className="text-[9px]">⌘</span>K
        </kbd>
      </div>

      {/* Dropdown Results Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white/95 dark:bg-[#181d20]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] sm:max-h-[500px] flex flex-col w-[92vw] xs:w-[320px] sm:w-[420px] md:w-[460px] max-w-[95vw] -left-8 sm:left-0 transition-all duration-200 animate-in fade-in zoom-in-95">
          {/* Filter Tabs Header */}
          <div className="flex items-center gap-1 p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 overflow-x-auto custom-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              Todos {hasSearched ? `(${totalResultsCount})` : ''}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('modules')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'modules'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              🧭 Módulos {matchedModules.length > 0 ? `(${matchedModules.length})` : ''}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('clients')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'clients'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              👥 Clientes {apiClients.length > 0 ? `(${apiClients.length})` : ''}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('workspaces')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'workspaces'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              💼 CRMs {apiWorkspaces.length > 0 ? `(${apiWorkspaces.length})` : ''}
            </button>
          </div>

          {/* Results List */}
          <div ref={resultsListRef} className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {!hasSearched ? (
              <div className="py-6 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Buscador Inteligente del Portal
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
                  Escribe al menos 2 letras para buscar módulos permitidos, clientes asignados o tus embudos CRM.
                </p>
              </div>
            ) : flatItems.length === 0 ? (
              <div className="py-8 px-4 text-center">
                {isLoadingApi ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <p className="text-xs text-slate-500">Buscando en base a tus permisos...</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      No se encontraron resultados para &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Solo se muestran elementos a los que tienes permisos de acceso en tu agencia o marca.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              flatItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const IconComponent = item.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-950 dark:text-blue-100'
                        : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.type === 'module'
                            ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                            : item.type === 'client'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {IconComponent ? (
                          <IconComponent className="w-4 h-4" />
                        ) : item.type === 'client' ? (
                          <Users className="w-4 h-4" />
                        ) : (
                          <Kanban className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                                item.badgeColor || 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 pl-2 flex-shrink-0">
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 shadow-2xs">
                          <span>Ir</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </div>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className="py-2 px-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <span>Navega con</span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">↑</kbd>
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">↓</kbd>
              <span>o</span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">↵ Enter</kbd>
            </span>
            <span>Esc para cerrar</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;
