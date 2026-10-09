'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, Users, Calendar, Mail, FileText, ShoppingCart, Globe, ShieldCheck, 
  Building2, Plane, Package, Trophy, GraduationCap, BookOpen, UserCheck, 
  Store, Briefcase, CreditCard, Layers, Key, Settings, Wrench, HelpCircle, 
  LayoutDashboard, Compass, CheckSquare, Zap, FileSpreadsheet, MapPin, Calculator, Palette, X, Film, Image as ImageIcon, LayoutGrid, FileCheck
} from 'lucide-react';


interface SidebarProps {
  isSidebarCollapsed: boolean;
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarCollapsed,
  leftSidebarOpen,
  setLeftSidebarOpen,
}) => {
  const pathname = usePathname();
  const { user, currentWhiteLabel, currentAgency, hasPermission } = useAuth();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    // If opening in a new tab via middle-click, Ctrl+click, Cmd+click, or Shift+click, allow native browser handling
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      return;
    }

    setLeftSidebarOpen(false);

    if (pathname === path) {
      e.preventDefault();
      return;
    }

    // Prevent Next.js client router from firing broken RSC flight request that silently freezes
    e.preventDefault();
    setPendingPath(path);

    if (typeof window !== 'undefined') {
      window.location.assign(path);
    }
  };
  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.roles?.some((r) => r.name === 'super_admin');

  const isWhiteLabelAdmin =
    user?.role === 'white_label_admin' ||
    user?.roles?.some((r) => r.name === 'white_label_admin');

  const isGerenteComercial =
    user?.role === 'gerente_comercial' ||
    user?.roles?.some((r) => r.name === 'gerente_comercial');

  const isAdmin =
    user?.role === 'admin' ||
    user?.roles?.some((r) => r.name === 'admin');

  const isProveedor =
    user?.role === 'proveedor' ||
    user?.role === 'supplier' ||
    user?.roles?.some((r) => r.name === 'proveedor' || r.name === 'supplier');

  const isCloser =
    user?.role === 'closer' ||
    user?.role === 'closers' ||
    user?.roles?.some((r) => r.name === 'closer' || r.name === 'closers');

  const isHunter =
    user?.role === 'hunter' ||
    user?.role === 'comercio' ||
    user?.role === 'store' ||
    user?.roles?.some((r) => ['hunter', 'comercio', 'store'].includes(r.name));

  const agency = user?.agency || (user as any)?.agency_data || currentAgency;
  const hasAgency = Boolean(user?.agency_id || agency?.id || user?.agency);
  const isAgencyUser = hasAgency && !isSuperAdmin && !isWhiteLabelAdmin;

  const isAgencyAdmin =
    isAgencyUser &&
    (user?.role === 'admin' ||
      user?.role === 'gerente' ||
      user?.role === 'gerente_comercial' ||
      user?.roles?.some((r) => ['admin', 'gerente', 'gerente_comercial'].includes(r.name)));

  let configHref: string | null = null;
  if (isSuperAdmin) {
    configHref = '/admin/permissions';
  } else if (isWhiteLabelAdmin) {
    configHref = '/white-label/dashboard';
  } else if (isAgencyAdmin) {
    configHref = user?.agency_id ? `/agencies/${user.agency_id}` : '/admin/agencies';
  }

  let brandLogo: string | null = null;
  let brandLogoDark: string | null = null;
  let brandLogoIcon: string | null = null;
  let brandName = 'SANTUN';

  // Cached WhiteLabel and Menu Background fallbacks from localStorage
  const [cachedWl, setCachedWl] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('santun_white_label');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return null;
  });

  const [cachedMenuBg, setCachedMenuBg] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('santun_menu_background');
    }
    return null;
  });

  const activeWl = currentWhiteLabel || (user as any)?.white_label || (user as any)?.white_labels?.[0] || cachedWl;
  const activeAgency = currentAgency || agency || (user as any)?.agency;
  const brandMenuBg = activeWl?.menu_background || activeAgency?.menu_background || cachedMenuBg;
  const brandPrimaryColor = activeWl?.primary_color || activeAgency?.primary_color;

  if (isSuperAdmin || isWhiteLabelAdmin) {
    brandLogo = activeWl?.logo || null;
    brandLogoDark = activeWl?.logo_2 || null;
    brandLogoIcon = activeWl?.logo_icon || null;
    brandName = activeWl?.name || 'SANTUN';
  } else {
    const currentPlan = activeAgency?.current_subscription?.plan || activeAgency?.currentSubscription?.plan || activeAgency?.plan;
    const activePlanPermissions = (
      (currentPlan as any)?.plan_permissions ||
      (currentPlan as any)?.planPermissions ||
      (currentPlan as any)?.permissions ||
      []
    ).map((p: any) => (typeof p === 'string' ? p : p?.permission || p?.name || '').toLowerCase().trim());
    const hasCustomBranding = activePlanPermissions.includes('custom_agency_branding');
    const hostWhiteLabel = activeWl || (activeAgency as any)?.white_label;

    brandLogo = (hasCustomBranding && activeAgency?.logo) ? activeAgency.logo : (hostWhiteLabel?.logo || null);
    brandLogoDark = (hasCustomBranding && activeAgency?.logo_2) ? activeAgency.logo_2 : (hostWhiteLabel?.logo_2 || null);
    brandLogoIcon = (hasCustomBranding && activeAgency?.logo_icon) ? activeAgency.logo_icon : (hostWhiteLabel?.logo_icon || null);
    brandName = (hasCustomBranding && activeAgency?.name) ? activeAgency.name : (hostWhiteLabel?.name || 'SANTUN');
  }

  const { isDark } = useTheme();

  useEffect(() => {
    const handleBrandingChange = () => {
      if (typeof window !== 'undefined') {
        const savedWl = localStorage.getItem('santun_white_label');
        if (savedWl) {
          try { setCachedWl(JSON.parse(savedWl)); } catch (e) {}
        }
        const savedMenuBg = localStorage.getItem('santun_menu_background');
        if (savedMenuBg) setCachedMenuBg(savedMenuBg);
      }
    };
    window.addEventListener('branding-updated', handleBrandingChange);
    return () => {
      window.removeEventListener('branding-updated', handleBrandingChange);
    };
  }, []);

  // Local storage instant caching for 0ms logo render on page refresh
  const [cachedLogo, setCachedLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('santun_sidebar_logo');
    return null;
  });
  const [cachedLogoDark, setCachedLogoDark] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('santun_sidebar_logo_dark');
    return null;
  });
  const [cachedLogoIcon, setCachedLogoIcon] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('santun_sidebar_logo_icon');
    return null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (brandLogo) {
        setCachedLogo(brandLogo);
        localStorage.setItem('santun_sidebar_logo', brandLogo);
      }
      if (brandLogoDark) {
        setCachedLogoDark(brandLogoDark);
        localStorage.setItem('santun_sidebar_logo_dark', brandLogoDark);
      }
      if (brandLogoIcon) {
        setCachedLogoIcon(brandLogoIcon);
        localStorage.setItem('santun_sidebar_logo_icon', brandLogoIcon);
      }
    }
  }, [brandLogo, brandLogoDark, brandLogoIcon]);

  const effectiveLogo = brandLogo || cachedLogo;
  const effectiveLogoDark = brandLogoDark || cachedLogoDark;
  const effectiveLogoIcon = brandLogoIcon || cachedLogoIcon;
  const firstWordOfName = brandName.trim().split(' ')[0];

  const isColorDark = (hex?: string | null): boolean => {
    if (!hex) return false;
    let color = hex.replace('#', '');
    if (color.length === 3) color = color.split('').map(c => c + c).join('');
    if (color.length !== 6) return false;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 160;
  };

  const resolvedMenuBg = brandMenuBg === '#0f172a' ? '#161a1b' : brandMenuBg;
  const effectiveMenuBg = isDark
    ? (resolvedMenuBg && isColorDark(resolvedMenuBg) ? resolvedMenuBg : '#161a1b')
    : (resolvedMenuBg && !isColorDark(resolvedMenuBg) ? resolvedMenuBg : '#ffffff');

  const isDarkBg = isColorDark(effectiveMenuBg);

  let activeLogoToRender: string | null = null;
  if (isSidebarCollapsed) {
    activeLogoToRender = effectiveLogoIcon || (isDarkBg ? (effectiveLogoDark || effectiveLogo) : (effectiveLogo || effectiveLogoDark));
  } else {
    activeLogoToRender = isDarkBg ? (effectiveLogoDark || effectiveLogo) : (effectiveLogo || effectiveLogoDark);
  }


  const isItemVisible = (item: { permission?: string | string[] }) => {
    if (isSuperAdmin) return true;
    if (!item.permission) return true;
    return hasPermission(item.permission);
  };

  const categories = [
    {
      title: 'PRINCIPAL & CRM',
      items: [
        { label: 'Inicio', path: '/', icon: Home },
        { label: 'Workspaces', path: '/workspaces', icon: Briefcase, permission: ['view_crm', 'manage_crm', 'workspaces.view', 'workspaces', 'crm.view'] },
        { label: 'Directorio de Clientes', path: '/clients', icon: Users, permission: ['view_clients', 'clients.view', 'view_crm', 'manage_crm'] },
        { label: 'Tareas', path: '/tasks', icon: CheckSquare, permission: ['tasks.view', 'view_tasks', 'tasks.manage'] },
        { label: 'Calendario', path: '/calendar', icon: Calendar, permission: ['view_crm', 'manage_crm', 'tasks.view', 'calendar.view'] },
      ],
    },
    {
      title: 'MODULO INMOBILIARIO',
      items: [
        { label: 'ACM (Avalúo Comercial)', path: '/acm', icon: Calculator, permission: ['view_estates', 'manage_estates', 'estates.view', 'estates.create', 'estates.manage', 'acm.view'] },
        { label: 'Propiedades e Inmuebles', path: '/estates', icon: Building2, permission: ['view_estates', 'manage_estates', 'estates.view', 'estates.create', 'estates.manage'] },
      ],
    },
    {
      title: 'VISAS MINORISTAS',
      items: [
        { label: 'Visas Minoristas (Formularios)', path: '/visas', icon: FileCheck, permission: ['view_visas', 'visas.view', 'manage_visas'] },
      ],
    },
    {
      title: 'VISAS MAYORISTAS & B2B',
      items: [
        ...(isWhiteLabelAdmin || isSuperAdmin
          ? [
              { label: 'Operaciones Mayorista B2B', path: '/visas/mayorista', icon: Building2, permission: ['view_visas', 'visas.view', 'manage_visas'] },
              { label: 'Agencias Afiliadas B2B', path: '/visas/mayorista/agencias', icon: Building2, permission: ['view_visas', 'visas.view', 'manage_visas'] },
              { label: 'Configurar Visas B2B', path: '/visas/tipos', icon: Layers, permission: ['view_visas', 'visas.view', 'visas.processes.manage', 'manage_visas'] },
            ]
          : [
              { label: 'Portal Mayorista (B2B)', path: '/visas/mayorista', icon: Building2, permission: ['view_visas', 'visas.view', 'manage_visas'] },
              { label: 'Políticas de Visados B2B', path: '/visas/politicas', icon: FileText, permission: ['view_visas', 'visas.view', 'visas.settings.manage', 'manage_visas'] },
            ]),
      ],
    },
    {
      title: 'MODULO VIAJES & PAQUETES',
      items: [
        { label: 'Paquetes Turísticos', path: '/travel-packages', icon: Plane, permission: ['packages.view', 'packages.catalog', 'packages.manage'] },
        { label: 'Reportes de Viaje', path: '/travel-reports', icon: FileText, permission: ['view_travel_reports', 'travel_reports.view', 'approve_travel_reports'] },
        { label: 'Punto de Venta POS', path: '/pos', icon: ShoppingCart, permission: ['view_pos', 'manage_pos', 'pos.view'] },
        { label: 'Gestión de Comisiones', path: '/commissions', icon: CreditCard, permission: ['commissions.view', 'commissions.manage'] },
        { label: 'Directorio de Proveedores', path: '/supplier', icon: Store, permission: ['view_products', 'packages.view', 'suppliers.view'] },
        { label: 'Productos e Insumos', path: '/products', icon: Package, permission: ['view_products', 'products.view'] },
      ],
    },
    {
      title: 'MARKETING & LEGAL',
      items: [
        { label: 'LexVault (Contratos)', path: '/lexvault', icon: FileText, permission: ['view_lexvault', 'manage_lexvault', 'lexvault.view', 'lexvault', 'view_contracts', 'contracts.view'] },
        { label: 'Hunter Stores', path: '/hunter', icon: Store, permission: ['view_hunter', 'hunter.view', 'hunter'] },
        { label: 'Landings', path: '/landings', icon: Globe, permission: ['landings.view', 'view_landings', 'landings', 'landings.create', 'landings.edit', 'landings.delete', 'manage_landings'] },
        { label: 'Marketing & Campañas', path: '/marketing', icon: Zap, permission: ['email_marketing', 'view_email_marketing', 'campaigns.view', 'marketing.view', 'marketing'] },
        { label: 'Automatizaciones', path: '/automations', icon: Wrench, permission: ['automations', 'view_automations', 'automations.view'] },
      ],
    },
    {
      title: 'CURSOS & CAPACITACIÓN',
      items: [
        { label: 'Cursos & Capacitación', path: '/courses', icon: GraduationCap, permission: ['courses.view', 'courses.create', 'courses.manage'] },
        { label: 'Mis Cursos', path: '/my-courses', icon: BookOpen, permission: ['courses.view'] },
        { label: 'Gamificación & Puntos', path: '/gamification', icon: Trophy, permission: ['view_spin_wheel', 'view_gamification', 'spin_wheel.view', 'gamification.view'] },
      ],
    },
    {
      title: 'MÓDULO DE ACTIVIDADES',
      items: [
        { label: 'Grupos de Actividades', path: '/activities', icon: CheckSquare, permission: ['activities.view', 'activities.create', 'activities.update'] },
        { label: 'Mis Actividades', path: '/my-activities', icon: FileText, permission: ['activities.view'] },
      ],
    },
    {
      title: 'ADMINISTRACIÓN SISTEMA',
      items: [
        ...(isSuperAdmin || isWhiteLabelAdmin
          ? [
              { label: 'Marcas Blancas', path: '/admin/white-labels', icon: Globe, permission: ['manage_agencies', 'view_agencies', 'agencies.view'] },
              { label: 'Gestión de Agencias', path: '/agencies', icon: Building2, permission: ['manage_agencies', 'view_agencies', 'agencies.view'] },
            ]
          : []),
        { label: 'Usuarios & Equipo', path: '/users', icon: UserCheck, permission: ['manage_users', 'view_users', 'users.view'] },
        { label: 'Roles & Permisos', path: '/roles', icon: ShieldCheck, permission: ['roles.manage', 'manage_roles', 'roles.view', 'view_roles', 'roles', 'permission_groups.view', 'permission_groups.manage'] },
        { label: 'Personalizar Marca', path: '/branding', icon: Palette, permission: ['custom_agency_branding', 'branding.view', 'branding.manage'] },
        { label: 'Biblioteca de Medios', path: '/media', icon: ImageIcon, permission: ['courses.view', 'activities.view', 'agencies.view', 'media.view'] },
        ...(isSuperAdmin || isWhiteLabelAdmin
          ? [
              { label: 'Administrar Planes', path: '/admin/plans', icon: Layers, permission: ['manage_plans', 'manage_agencies'] },
              { label: 'Suscripciones', path: '/admin/subscriptions', icon: Key, permission: ['manage_subscriptions', 'manage_agencies'] },
            ]
          : []),
      ],
    },
    ...((isWhiteLabelAdmin && !isSuperAdmin)
      ? [
          {
            title: 'ADMINISTRACIÓN MARCA BLANCA',
            items: [
              { label: 'Mi White Label', path: '/white-label/dashboard', icon: Globe },
              { label: 'Personalizar Marca', path: '/admin/branding', icon: Palette },
              { label: 'Accesos Directos Header', path: '/admin/shortcuts', icon: LayoutGrid },
              { label: 'Configuración del Login', path: '/admin/login-settings', icon: Film },
              { label: 'Roles & Permisos', path: '/roles', icon: ShieldCheck },
              { label: 'Importar Estudiantes', path: '/white-label/import-students', icon: FileSpreadsheet },
              { label: 'Planes de mi Marca', path: '/admin/plans', icon: Layers },
              { label: 'Suscripciones', path: '/admin/subscriptions', icon: Key },
            ],
          },
        ]
      : []),
  ];

  return (
    <>
      {leftSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setLeftSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside 
        style={{ backgroundColor: effectiveMenuBg }}
        className={`flex flex-col h-full z-50 transition-all duration-300 ease-in-out overflow-x-hidden print:hidden fixed left-0 top-0 border-r border-slate-200/80 dark:border-slate-800/80 ${
          isDarkBg ? 'text-white' : 'text-slate-800'
        } ${leftSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} lg:translate-x-0 w-[85vw] max-w-[280px] sm:w-64 ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {pendingPath && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 z-50 animate-pulse shadow-sm" />
        )}
        
        <div className={`py-5 flex items-center transition-all duration-300 ${isSidebarCollapsed ? 'px-3 lg:justify-center' : 'px-5'} justify-between`}>
          <Link 
            href="/" 
            prefetch={false}
            onClick={(e) => handleNavClick('/', e)}
            className="flex items-center gap-3 min-w-0"
          >
            {activeLogoToRender ? (
              <img
                src={activeLogoToRender}
                alt={brandName}
                loading="eager"
                decoding="sync"
                className={isSidebarCollapsed ? "w-9 h-9 object-contain shrink-0 rounded-lg" : "h-9 max-w-[160px] object-contain shrink-0"}
              />
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 shrink-0">
                {firstWordOfName}
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setLeftSidebarOpen(false)}
            aria-label="Cerrar menú lateral"
            className={`lg:hidden p-1.5 rounded-lg transition-colors shrink-0 ${
              isDarkBg
                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {(isHunter
            ? [
                {
                  title: 'MIS FORMULARIOS',
                  items: [
                    { label: 'Mis Formularios', path: '/hunter', icon: Store },
                  ],
                },
              ]
            : (isAgencyUser
                ? categories.filter(c => c.title !== 'ADMINISTRACIÓN MARCA BLANCA')
                : categories)
          ).map((category) => {
            const visibleCategoryItems = category.items.filter(isItemVisible);
            if (visibleCategoryItems.length === 0) return null;

            return (
              <div key={category.title} className="space-y-1">
                <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:px-0 lg:text-center' : 'px-3 py-0.5'}`}>
                  <span className={`text-[10px] font-extrabold tracking-widest uppercase transition-all duration-300 ${
                    isDarkBg ? 'text-slate-400' : 'text-slate-500'
                  } ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100 block'}`}>
                    {category.title}
                  </span>
                </div>

                {visibleCategoryItems.map((item) => {
                  const isActive = pathname === item.path;
                  const isPending = pendingPath === item.path;
                  const Icon = item.icon;
                  const activeColor = activeWl?.primary_color || (agency as any)?.primary_color;

                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      prefetch={false}
                      onClick={(e) => handleNavClick(item.path, e)}
                      style={isActive && activeColor ? { color: activeColor } : undefined}
                      className={`flex items-center gap-3 py-1.5 rounded-xl transition-all duration-150 ${
                        isSidebarCollapsed ? 'px-2 lg:justify-center' : 'px-3'
                      } ${
                        isActive 
                          ? (isDarkBg 
                              ? 'bg-slate-800/90 text-white font-extrabold border border-slate-700/80 shadow-xs' 
                              : 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200/80 shadow-xs')
                          : (isDarkBg 
                              ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white font-medium' 
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium')
                      } ${isPending ? 'opacity-80 ring-1 ring-sky-500/60 bg-sky-50/50 dark:bg-sky-950/40 animate-pulse' : ''}`}
                    >
                      {isPending ? (
                        <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : (
                        <Icon 
                          style={isActive && activeColor ? { color: activeColor } : undefined}
                          className={`w-4 h-4 flex-shrink-0 stroke-[2] transition-colors ${
                            isActive 
                              ? (activeColor ? '' : (isDarkBg ? 'text-white' : 'text-blue-600')) 
                              : (isDarkBg ? 'text-slate-400' : 'text-slate-600')
                          }`} 
                        />
                      )}
                      
                      <span className={`text-[13px] leading-snug whitespace-nowrap tracking-tight transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="px-3 py-2.5 mt-auto space-y-1 border-t border-slate-200/60 dark:border-slate-800/60">
          <Link 
            href="/roles" 
            prefetch={false}
            onClick={(e) => handleNavClick('/roles', e)}
            className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-colors ${
              pathname === '/roles' || pathname === '/admin/roles'
                ? (isDarkBg
                    ? 'bg-slate-800/90 text-white font-extrabold border border-slate-700/80 shadow-xs'
                    : 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200/80 shadow-xs')
                : (isDarkBg
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100')
            } ${pendingPath === '/roles' ? 'opacity-80 ring-1 ring-sky-500/60 bg-sky-50/50 dark:bg-sky-950/40 animate-pulse' : ''}`}
          >
            {pendingPath === '/roles' ? (
              <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <ShieldCheck className={`w-4 h-4 stroke-[2] ${
                pathname === '/roles' || pathname === '/admin/roles'
                  ? (isDarkBg ? 'text-white' : 'text-blue-600')
                  : (isDarkBg ? 'text-slate-400' : 'text-slate-600')
              }`} />
            )}
            <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Mis Roles & Permisos</span>
          </Link>

          {configHref && (
            <Link 
              href={configHref} 
              prefetch={false}
              onClick={(e) => handleNavClick(configHref, e)}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-colors ${
                pathname === configHref
                  ? (isDarkBg
                      ? 'bg-slate-800/90 text-white font-extrabold border border-slate-700/80 shadow-xs'
                      : 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200/80 shadow-xs')
                  : (isDarkBg
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100')
              } ${pendingPath === configHref ? 'opacity-80 ring-1 ring-sky-500/60 bg-sky-50/50 dark:bg-sky-950/40 animate-pulse' : ''}`}
            >
              {pendingPath === configHref ? (
                <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <Settings className={`w-4 h-4 stroke-[2] ${
                  pathname === configHref
                    ? (isDarkBg ? 'text-white' : 'text-blue-600')
                    : (isDarkBg ? 'text-slate-400' : 'text-slate-600')
                }`} />
              )}
              <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Configuración</span>
            </Link>
          )}
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
