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
  LayoutDashboard, Compass, CheckSquare, Zap, FileSpreadsheet, MapPin, Calculator, Palette, X, Film, Image as ImageIcon, LayoutGrid
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

  const currentPlan =
    agency?.current_subscription?.plan ||
    agency?.currentSubscription?.plan ||
    agency?.plan ||
    (user as any)?.agency_plan;

  const activePlanPermissions: string[] = (
    Array.isArray(currentPlan?.plan_permissions || currentPlan?.planPermissions || currentPlan?.permissions)
      ? (currentPlan?.plan_permissions || currentPlan?.planPermissions || currentPlan?.permissions)
      : []
  )
    .map((p: any) => (typeof p === 'string' ? p : p?.permission || p?.name || '').toLowerCase().trim())
    .filter(Boolean);

  const userDirectPermissions: string[] = (user?.permissions || [])
    .map((p: any) => (typeof p === 'string' ? p : p?.name || '').toLowerCase().trim())
    .filter(Boolean);

  const hostWhiteLabel =
    currentWhiteLabel ||
    (user as any)?.white_labels?.[0] ||
    (user as any)?.whiteLabels?.[0] ||
    (user as any)?.white_label ||
    (agency as any)?.white_label;

  const whiteLabelPlan = hostWhiteLabel?.plan;
  const activeWhiteLabelPlanPermissions: string[] = (
    Array.isArray(whiteLabelPlan?.plan_permissions || whiteLabelPlan?.planPermissions || whiteLabelPlan?.permissions)
      ? (whiteLabelPlan?.plan_permissions || whiteLabelPlan?.planPermissions || whiteLabelPlan?.permissions)
      : []
  )
    .map((p: any) => (typeof p === 'string' ? p : p?.permission || p?.name || '').toLowerCase().trim())
    .filter(Boolean);

  const hasWhiteLabelPlan = Boolean(whiteLabelPlan || hostWhiteLabel?.plan_id);

  const isTravelAllowedByPlan = (plan: any) => {
    if (!plan) return false;
    const perms = Array.isArray(plan.plan_permissions || plan.planPermissions || plan.permissions)
      ? (plan.plan_permissions || plan.planPermissions || plan.permissions)
      : [];
    return perms.some((p: any) => {
      const name = (typeof p === 'string' ? p : p?.permission || p?.name || '').toLowerCase();
      return name.startsWith('packages.') || name.startsWith('requests.') || name.includes('travel') || name.includes('visa');
    });
  };

  const isTravelPlan = isTravelAllowedByPlan(currentPlan);
  const isWhiteLabelTravelPlan = isTravelAllowedByPlan(whiteLabelPlan);

  const isRealEstateAgency =
    !isTravelPlan &&
    (currentPlan?.name?.toLowerCase().includes('inmobiliaria') ||
      (Array.isArray(currentPlan?.allowed_agency_types) &&
        (currentPlan?.allowed_agency_types.includes('inmobiliaria') || currentPlan?.allowed_agency_types.includes('real_estate'))) ||
      (Array.isArray((agency as any)?.allowed_agency_types) &&
        ((agency as any)?.allowed_agency_types.includes('inmobiliaria') || (agency as any)?.allowed_agency_types.includes('real_estate'))));

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
        { label: 'Workspaces', path: '/workspaces', icon: Briefcase, permission: ['view_crm', 'manage_crm'] },
        { label: 'Directorio de Clientes', path: '/clients', icon: Users, permission: ['view_clients', 'view_crm'] },
        { label: 'Gestión de Tareas', path: '/tasks', icon: CheckSquare, permission: ['tasks.view', 'view_tasks'] },
        { label: 'Calendario', path: '/calendar', icon: Calendar, permission: ['view_crm', 'tasks.view'] },
      ],
    },
    {
      title: 'MODULO INMOBILIARIO',
      items: [
        { label: 'ACM (Avalúo Comercial)', path: '/acm', icon: Calculator, permission: ['view_acm', 'acm.view'] },
        { label: 'Propiedades e Inmuebles', path: '/estates', icon: Building2, permission: ['view_properties', 'properties.view', 'view_estates'] },
      ],
    },
    {
      title: 'MÓDULO DE VISADOS',
      items: [
        { label: 'Gestión de Visados', path: '/visas', icon: ShieldCheck, permission: ['view_visas', 'manage_visas'] },
      ],
    },
    {
      title: 'MODULO VIAJES & PAQUETES',
      items: [
        { label: 'Paquetes Turísticos', path: '/travel-packages', icon: Plane, permission: 'packages.view' },
        { label: 'Reportes de Viaje', path: '/travel-reports', icon: FileText, permission: ['view_travel_reports', 'travel_reports.view'] },
        { label: 'Punto de Venta POS', path: '/pos', icon: ShoppingCart, permission: ['view_pos', 'manage_pos'] },
        { label: 'Gestión de Comisiones', path: '/commissions', icon: CreditCard, permission: 'commissions.view' },
        { label: 'Directorio de Proveedores', path: '/supplier', icon: Store, permission: ['view_products', 'packages.view'] },
        { label: 'Productos e Insumos', path: '/products', icon: Package, permission: ['view_products', 'packages.view'] },
      ],
    },
    {
      title: 'MARKETING & LEGAL',
      items: [
        { label: 'LexVault (Contratos)', path: '/lexvault', icon: FileText, permission: ['view_lexvault', 'manage_lexvault', 'view_contracts', 'contracts.view'] },
        { label: 'Hunter Stores', path: '/hunter', icon: Store, permission: ['view_products', 'packages.view', 'view_crm'] },
        { label: 'Landings', path: '/landings', icon: Globe, permission: ['view_crm', 'view_estates'] },
        { label: 'Marketing & Campañas', path: '/marketing', icon: Zap, permission: ['view_crm', 'campaigns.view'] },
        { label: 'Automatizaciones', path: '/automations', icon: Wrench, permission: ['view_crm', 'manage_crm'] },
      ],
    },
    {
      title: 'ACADEMIA & RECURSOS',
      items: [
        { label: 'Cursos & Capacitación', path: '/courses', icon: GraduationCap, permission: 'courses.view' },
        { label: 'Mis Cursos', path: '/my-courses', icon: BookOpen, permission: 'courses.view' },
        { label: 'Biblioteca de Medios', path: '/media', icon: ImageIcon, permission: ['courses.view', 'activities.view', 'agencies.view'] },
        { label: 'Grupos de Actividades', path: '/activities', icon: CheckSquare, permission: ['activities.view', 'activities.create', 'activities.update', 'courses.view'] },

        { label: 'Mis Actividades', path: '/my-activities', icon: FileText, permission: ['activities.view', 'courses.view'] },
        { label: 'Gamificación & Puntos', path: '/gamification', icon: Trophy, permission: ['view_spin_wheel', 'view_gamification'] },
      ],
    },
    {
      title: 'ADMINISTRACIÓN SISTEMA',
      items: [
        { label: 'Marcas Blancas', path: '/admin/white-labels', icon: Globe, permission: ['manage_agencies', 'view_agencies', 'agencies.view'] },
        { label: 'Gestión de Agencias', path: '/agencies', icon: Building2, permission: ['manage_agencies', 'view_agencies', 'agencies.view'] },
        { label: 'Usuarios & Equipo', path: '/users', icon: UserCheck, permission: ['manage_users', 'view_users', 'users.view'] },
        { label: 'Administrar Planes', path: '/admin/plans', icon: Layers, permission: ['manage_agencies', 'manage_users'] },
        { label: 'Suscripciones', path: '/admin/subscriptions', icon: Key, permission: ['manage_agencies', 'manage_users'] },
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
        
        <div className={`py-5 flex items-center transition-all duration-300 ${isSidebarCollapsed ? 'px-3 lg:justify-center' : 'px-5'} justify-between`}>
          <Link href="/" className="flex items-center gap-3 min-w-0">
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
                  title: 'MIS FORMULARIOS & LEADS',
                  items: [
                    { label: 'Inicio', path: '/', icon: Home },
                    { label: 'Mis Formularios & Leads', path: '/hunter', icon: Store },
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
                  const Icon = item.icon;
                  const activeColor = activeWl?.primary_color || (agency as any)?.primary_color;

                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      onClick={() => setLeftSidebarOpen(false)}
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
                      }`}
                    >
                      <Icon 
                        style={isActive && activeColor ? { color: activeColor } : undefined}
                        className={`w-4 h-4 flex-shrink-0 stroke-[2] transition-colors ${
                          isActive 
                            ? (activeColor ? '' : (isDarkBg ? 'text-white' : 'text-blue-600')) 
                            : (isDarkBg ? 'text-slate-400' : 'text-slate-600')
                        }`} 
                      />
                      
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

        {configHref && (
          <div className="px-3 py-2.5 mt-auto space-y-1">
            <Link 
              href={configHref} 
              onClick={() => setLeftSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-colors ${
                pathname === configHref
                  ? (isDarkBg
                      ? 'bg-slate-800/90 text-white font-extrabold border border-slate-700/80 shadow-xs'
                      : 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200/80 shadow-xs')
                  : (isDarkBg
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100')
              }`}
            >
              <Settings className={`w-4 h-4 stroke-[2] ${
                pathname === configHref
                  ? (isDarkBg ? 'text-white' : 'text-blue-600')
                  : (isDarkBg ? 'text-slate-400' : 'text-slate-600')
              }`} />
              <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Configuración</span>
            </Link>
          </div>
        )}

      </aside>
    </>
  );
};

export default Sidebar;
