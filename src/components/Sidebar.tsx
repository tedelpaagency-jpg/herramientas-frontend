'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  Home, Users, Calendar, Mail, FileText, ShoppingCart, Globe, ShieldCheck, 
  Building2, Plane, Package, Trophy, GraduationCap, BookOpen, UserCheck, 
  Store, Briefcase, CreditCard, Layers, Key, Settings, Wrench, HelpCircle, 
  LayoutDashboard, Compass, CheckSquare, Zap, FileSpreadsheet, MapPin
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
  const { user, currentWhiteLabel, currentAgency } = useAuth();
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
    user?.roles?.some((r) => r.name === 'hunter');

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
  let brandName = 'SANTUN';

  if (isSuperAdmin || isWhiteLabelAdmin) {
    const userWl = (user as any)?.white_labels?.[0] || (user as any)?.white_label || currentWhiteLabel;
    brandLogo = userWl?.logo || currentWhiteLabel?.logo || null;
    brandName = userWl?.name || currentWhiteLabel?.name || 'SANTUN';
  } else {
    const currentPlan = agency?.current_subscription?.plan || agency?.currentSubscription?.plan || agency?.plan;
    const activePlanPermissions = (
      (currentPlan as any)?.plan_permissions ||
      (currentPlan as any)?.planPermissions ||
      (currentPlan as any)?.permissions ||
      []
    ).map((p: any) => (typeof p === 'string' ? p : p?.permission || p?.name || '').toLowerCase().trim());
    const hasCustomBranding = activePlanPermissions.includes('custom_agency_branding');
    const hostWhiteLabel = (agency as any)?.white_label || (user as any)?.white_labels?.[0] || currentWhiteLabel;

    brandLogo = (hasCustomBranding && agency?.logo) ? agency.logo : (hostWhiteLabel?.logo || null);
    brandName = (hasCustomBranding && agency?.name) ? agency.name : (hostWhiteLabel?.name || 'SANTUN');
  }

  // Local storage instant caching for 0ms logo render on page refresh
  const [cachedLogo, setCachedLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('santun_sidebar_logo');
    }
    return null;
  });

  useEffect(() => {
    if (brandLogo) {
      setCachedLogo(brandLogo);
      if (typeof window !== 'undefined') {
        localStorage.setItem('santun_sidebar_logo', brandLogo);
      }
    }
  }, [brandLogo]);

  const effectiveLogo = brandLogo || cachedLogo;
  const firstWordOfName = brandName.trim().split(' ')[0];

  const currentPlan =
    agency?.current_subscription?.plan ||
    agency?.currentSubscription?.plan ||
    agency?.plan ||
    (user as any)?.agency_plan;

  const rawPlanPermissions =
    currentPlan?.plan_permissions ||
    currentPlan?.planPermissions ||
    currentPlan?.permissions ||
    [];

  const activePlanPermissions: string[] = (
    Array.isArray(rawPlanPermissions) ? rawPlanPermissions : []
  )
    .map((p: any) => {
      if (typeof p === 'string') return p.toLowerCase().trim();
      if (p && typeof p === 'object') {
        return (p.permission || p.name || p.slug || '').toLowerCase().trim();
      }
      return '';
    })
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
  const rawWhiteLabelPlanPermissions =
    whiteLabelPlan?.plan_permissions ||
    whiteLabelPlan?.planPermissions ||
    whiteLabelPlan?.permissions ||
    [];

  const activeWhiteLabelPlanPermissions: string[] = (
    Array.isArray(rawWhiteLabelPlanPermissions) ? rawWhiteLabelPlanPermissions : []
  )
    .map((p: any) => {
      if (typeof p === 'string') return p.toLowerCase().trim();
      if (p && typeof p === 'object') {
        return (typeof p.permission === 'string' ? p.permission : p.permission?.name || p.name || p.slug || '').toLowerCase().trim();
      }
      return '';
    })
    .filter(Boolean);

  const hasWhiteLabelPlan = Boolean(whiteLabelPlan || hostWhiteLabel?.plan_id);

  const isTravelAllowedByPlan = (plan: any) => {
    if (!plan) return false;
    if (plan.billing_type === 'commission') return true;
    if (Array.isArray(plan.allowed_agency_types) && plan.allowed_agency_types.includes('travel')) return true;
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
    // 1. Super Admin posee acceso global a nivel de plataforma
    if (isSuperAdmin) return true;

    // 2. Si el elemento no requiere permisos específicos (ej. Inicio), es visible
    if (!item.permission) return true;

    const requiredPermissions = (
      Array.isArray(item.permission) ? item.permission : [item.permission]
    ).map((p) => p.toLowerCase().trim());

    const isTravelPermission = requiredPermissions.some((p) =>
      p.startsWith('packages.') || p.startsWith('requests.') || p.includes('travel') || p.includes('visa') || p === 'commissions.view'
    );

    // 3. Regla Inmobiliaria: bloqueo estricto si la agencia es exclusivamente inmobiliaria (sin módulo de viajes)
    if (isRealEstateAgency) {
      const blockedForRealEstate = [
        'view_visas',
        'manage_visas',
        'view_pos',
        'manage_pos',
        'view_products',
        'packages.view',
        'requests.view',
        'view_travel_reports',
        'view_w8_forms',
      ];
      if (requiredPermissions.some((p) => blockedForRealEstate.includes(p))) {
        return false;
      }
    }

    // 4. Verificación Estricta del Plan de la Agencia:
    if (isAgencyUser) {
      const isAllowedByPlan =
        requiredPermissions.some((p) => activePlanPermissions.includes(p)) ||
        (isTravelPermission && isTravelPlan);

      if (!isAllowedByPlan) {
        return false;
      }

      if (isAgencyAdmin) {
        return true;
      }

      return (
        requiredPermissions.some((p) => userDirectPermissions.includes(p)) ||
        (isTravelPermission && isTravelPlan)
      );
    }

    // 5. Para Administradores de Marca Blanca (white_label_admin):
    if (isWhiteLabelAdmin) {
      if (hasWhiteLabelPlan && activeWhiteLabelPlanPermissions.length > 0) {
        const isAllowedByWLPlan =
          requiredPermissions.some((p) => activeWhiteLabelPlanPermissions.includes(p)) ||
          (isTravelPermission && isWhiteLabelTravelPlan);

        if (!isAllowedByWLPlan) {
          return false;
        }
      }
      return true;
    }

    // 6. Otros usuarios de plataforma:
    return (
      requiredPermissions.some((p) => userDirectPermissions.includes(p)) ||
      (isTravelPermission && isTravelPlan)
    );
  };

  interface NavCategory {
    title: string;
    items: {
      label: string;
      path: string;
      icon: React.ElementType;
      permission?: string | string[];
    }[];
  }

  const categories: NavCategory[] = [
    {
      title: 'MENÚ PRINCIPAL',
      items: [
        { label: 'Inicio', path: '/', icon: Home },
      ],
    },
    {
      title: 'CLIENTES & CRM',
      items: [
        { label: 'Workspaces', path: '/workspaces', icon: LayoutDashboard, permission: ['view_crm', 'workspaces.view'] },
        { label: 'Tareas', path: '/tasks', icon: CheckSquare, permission: ['tasks.view', 'view_crm'] },
        { label: 'Calendario', path: '/calendar', icon: Calendar, permission: ['view_crm', 'calendar.view'] },
        { label: 'Clientes', path: '/clients', icon: Users, permission: ['view_clients', 'clients.view'] },
        { label: 'Landings', path: '/landings', icon: Globe, permission: ['landings.view', 'view_landings', 'view_crm'] },
        { label: 'Marketing', path: '/marketing', icon: Mail, permission: ['email_marketing', 'view_email_marketing', 'marketing.view'] },
        { label: 'Automatizaciones', path: '/automations', icon: Zap, permission: ['automations', 'view_automations', 'view_crm'] },
        { label: 'Contratos', path: '/lexvault', icon: ShieldCheck, permission: ['view_lexvault', 'lexvault.view'] },
        { label: 'Tiendas Hunter', path: '/hunter', icon: Store, permission: ['view_hunter', 'hunter.view'] },
      ],
    },
    {
      title: 'ACTIVIDAD INMOBILIARIA',
      items: [
        { label: 'Propiedades', path: '/estates', icon: Building2, permission: ['view_estates', 'estates.view', 'manage_estates'] },
        { label: 'Mapa de Inmuebles', path: '/estates?view=map', icon: MapPin, permission: ['view_estates', 'estates.view', 'manage_estates'] },
      ],
    },
    {
      title: 'TURISMO & VIAJES',
      items: [
        { label: 'Visas', path: '/visas', icon: FileText, permission: ['view_visas', 'manage_visas'] },
        { label: 'Reportes', path: '/travel-reports', icon: Plane, permission: ['view_travel_reports'] },
        { label: 'Comisiones', path: '/commissions', icon: CreditCard, permission: ['view_travel_reports', 'commissions.view', 'packages.view'] },
        ...(!isProveedor
          ? [
              { label: 'Trip Builder B2B', path: '/travel-packages/pos', icon: ShoppingCart, permission: ['packages.view', 'packages.catalog'] },
              { label: 'Solicitudes', path: '/travel-packages/my-requests', icon: FileText, permission: ['requests.view', 'requests.manage'] },
            ]
          : []),
        ...(isProveedor || isSuperAdmin
          ? [
              { label: 'Paquetes', path: '/supplier/packages', icon: Package, permission: ['packages.view', 'packages.manage'] },
              { label: 'Solicitudes', path: '/supplier/requests', icon: FileText, permission: ['requests.view', 'requests.manage'] },
            ]
          : []),
        ...(isSuperAdmin || (isGerenteComercial && !isAgencyUser)
          ? [
              { label: 'Clearing B2B', path: '/admin/clearing', icon: CreditCard },
              { label: 'Reglas Pricing', path: '/admin/pricing-rules', icon: Layers },
              { label: 'Paquetes Admin', path: '/admin/travel-packages', icon: Package },
              { label: 'Solicitudes Viaje', path: '/admin/travel-requests', icon: FileText },
            ]
          : []),
      ],
    },
    {
      title: 'COMERCIO & VENTAS',
      items: [
        { label: 'Productos', path: '/products', icon: Package, permission: ['view_products', 'products.view'] },
        { label: 'POS', path: '/pos', icon: ShoppingCart, permission: ['view_pos', 'manage_pos', 'pos.view'] },
        { label: 'Ruleta & Premios', path: '/gamification', icon: Trophy, permission: ['view_spin_wheel', 'view_gamification'] },
      ],
    },
    {
      title: 'CAPACITACIÓN',
      items: [
        ...(isSuperAdmin || isWhiteLabelAdmin || (isGerenteComercial && !isAgencyUser)
          ? [
              { label: 'Cursos', path: '/courses', icon: GraduationCap, permission: ['courses.view', 'courses.create'] },
            ]
          : []),
        { label: 'Mis Cursos', path: '/my-courses', icon: BookOpen, permission: ['courses.view'] },
      ],
    },
    {
      title: 'GESTIÓN & AGENCIA',
      items: [
        { label: 'Usuarios', path: '/users', icon: UserCheck, permission: 'manage_users' },
        ...(isSuperAdmin
          ? [{ label: 'Agencias', path: '/admin/agencies', icon: Store }]
          : []),
        { label: 'Equipos', path: '/admin/teams', icon: Briefcase, permission: 'manage_users' },
      ],
    },
    ...(isWhiteLabelAdmin && !isSuperAdmin
      ? [
          {
            title: 'ORGANIZACIÓN & WHITE LABEL',
            items: [
              { label: 'Mi White Label', path: '/white-label/dashboard', icon: Globe },
              { label: 'Importar Estudiantes', path: '/white-label/import-students', icon: FileSpreadsheet },
              { label: 'Planes de mi Marca', path: '/admin/plans', icon: Layers },
              { label: 'Agencias y Equipos', path: '/admin/agencies', icon: Building2 },
              { label: 'Directorio de Usuarios', path: '/users', icon: Users },
            ],
          },
        ]
      : []),
  ];

  const adminNavItems = [
    { label: 'White Labels', path: '/admin/white-labels', icon: Globe },
    { label: 'Planes', path: '/admin/plans', icon: Layers },
    { label: 'Permisos', path: '/admin/permissions', icon: Key },
    { label: 'Agencias', path: '/admin/agencies', icon: Building2 },
    { label: 'Suscripciones', path: '/admin/subscriptions', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Overlay - Left Sidebar */}
      {leftSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setLeftSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Minimalist Left Sidebar */}
      <aside className={`flex flex-col h-full bg-white dark:bg-slate-900 z-50 transition-all duration-300 ease-in-out overflow-x-hidden print:hidden fixed left-0 top-0 ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isSidebarCollapsed ? 'w-64 lg:w-20' : 'w-64'}`}>
        
        {/* Logo Branding Dinámico */}
        <div className="px-5 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {effectiveLogo ? (
              <img
                src={effectiveLogo}
                alt={brandName}
                loading="eager"
                decoding="sync"
                className="h-9 max-w-[160px] object-contain shrink-0"
              />
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 shrink-0">
                {firstWordOfName}
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Categories & Links (Espacio Confortable entre Accesos) */}
        <nav className="flex-1 px-3 py-2 space-y-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {(isHunter
            ? categories.filter(c => c.title === 'CLIENTES & CRM').map(c => ({
                ...c,
                items: c.items.filter(i => i.path === '/hunter')
              }))
            : isCloser
            ? categories.filter(c => c.title === 'CLIENTES & CRM').map(c => ({
                ...c,
                items: c.items.filter(i => ['/workspaces', '/clients'].includes(i.path))
              }))
            : categories
          ).map((category) => {
            const visibleCategoryItems = category.items.filter(isItemVisible);
            if (visibleCategoryItems.length === 0) return null;

            return (
              <div key={category.title} className="space-y-1">
                {/* Header de Sección Minimalista */}
                <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:px-0 lg:text-center' : 'px-3 py-0.5'}`}>
                  <span className={`text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase transition-all duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100 block'}`}>
                    {category.title}
                  </span>
                </div>

                {/* Items / Accesos de Navegación */}
                {visibleCategoryItems.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      onClick={() => setLeftSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all duration-150 ${
                        isActive 
                          ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-black' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white font-medium'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 stroke-[2] transition-colors ${
                        isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'
                      }`} />
                      
                      <span className={`text-[13px] leading-snug whitespace-nowrap tracking-tight transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            );
          })}

          {/* Super Admin System Section Minimalista */}
          {isSuperAdmin && (
            <div className="space-y-1 pt-1">
              <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:px-0 lg:text-center' : 'px-3 py-0.5'}`}>
                <span className={`text-[10px] font-extrabold tracking-widest text-rose-500/80 uppercase transition-all duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100 block'}`}>
                  ADMINISTRACIÓN
                </span>
              </div>

              {adminNavItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setLeftSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 stroke-[2] transition-colors ${
                      isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
                    }`} />
                    <span className={`text-[13px] leading-snug whitespace-nowrap tracking-tight transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Links de Utilidad Inferiores Minimalistas */}
        {configHref && (
          <div className="px-3 py-2.5 mt-auto space-y-1">
            <Link 
              href={configHref} 
              onClick={() => setLeftSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl text-[12px] font-medium text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <Settings className="w-4 h-4 stroke-[2]" />
              <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Configuración</span>
            </Link>
          </div>
        )}

      </aside>
    </>
  );
};

export default Sidebar;
