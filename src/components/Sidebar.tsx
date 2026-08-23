'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  leftSidebarOpen,
  setLeftSidebarOpen,
  isSidebarCollapsed,
}) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.roles?.some((r) => r.name === 'super_admin');

  const isGerenteComercial =
    user?.role === 'gerente_comercial' ||
    user?.roles?.some((r) => r.name === 'gerente_comercial');

  const isAdmin =
    user?.role === 'admin' ||
    user?.roles?.some((r) => r.name === 'admin');

  const activePlanPermissions =
    user?.agency?.current_subscription?.plan?.plan_permissions?.map((p) => p.permission.toLowerCase()) ||
    user?.agency?.plan?.plan_permissions?.map((p) => p.permission.toLowerCase()) ||
    [];

  const userDirectPermissions = user?.permissions?.map((p) => p.name.toLowerCase()) || [];

  const isItemVisible = (item: { permission?: string }) => {
    if (!item.permission || isSuperAdmin) return true;
    if (activePlanPermissions.length === 0 && userDirectPermissions.length === 0) return true;
    return (
      activePlanPermissions.includes(item.permission.toLowerCase()) ||
      userDirectPermissions.includes(item.permission.toLowerCase())
    );
  };

  interface NavCategory {
    title: string;
    icon: string;
    color: string;
    items: {
      label: string;
      path: string;
      icon: string;
      permission?: string;
    }[];
  }

  const categories: NavCategory[] = [
    {
      title: 'Principal & Control',
      icon: 'space_dashboard',
      color: 'text-blue-600 dark:text-blue-400',
      items: [
        { label: 'Dashboard', path: '/', icon: 'dashboard' },
      ],
    },
    {
      title: 'Clientes, CRM & Contratos',
      icon: 'contacts',
      color: 'text-teal-600 dark:text-teal-400',
      items: [
        { label: 'Workspaces & CRM', path: '/workspaces', icon: 'view_kanban' },
        { label: 'Google Calendar', path: '/calendar', icon: 'calendar_month' },
        { label: 'Directorio de Clientes', path: '/clients', icon: 'groups' },
        { label: 'Landing Pages & Eventos', path: '/landings', icon: 'web' },
        { label: 'Marketing & Correos', path: '/marketing', icon: 'mail' },
        { label: 'Contratos & Bóveda (LexVault)', path: '/lexvault', icon: 'gavel' },
      ],

    },
    {
      title: 'Actividad Inmobiliaria',
      icon: 'domain',
      color: 'text-emerald-600 dark:text-emerald-400',
      items: [
        { label: 'Propiedades / Inmuebles', path: '/estates', icon: 'real_estate_agent', permission: 'view_estates' },
      ],
    },
    {
      title: 'Turismo & Viajes',
      icon: 'flight_takeoff',
      color: 'text-indigo-600 dark:text-indigo-400',
      items: [
        { label: 'Trámites de Visas', path: '/visas', icon: 'assignment_ind', permission: 'view_visas' },
        { label: 'Formularios W-8', path: '/w8-forms', icon: 'description', permission: 'view_w8_forms' },
        { label: 'Reportes de Viajes', path: '/travel-reports', icon: 'connecting_airports', permission: 'view_travel_reports' },
      ],
    },
    {
      title: 'Comercio & Ventas',
      icon: 'shopping_bag',
      color: 'text-amber-600 dark:text-amber-400',
      items: [
        { label: 'Productos & Inventario', path: '/products', icon: 'inventory_2', permission: 'view_products' },
        { label: 'Caja POS / Ventas', path: '/pos', icon: 'point_of_sale', permission: 'view_pos' },
        { label: 'Ruleta de Premios', path: '/spin-wheel', icon: 'military_tech', permission: 'view_spin_wheel' },
      ],
    },
    {
      title: 'Gestión & Agencia',
      icon: 'badge',
      color: 'text-purple-600 dark:text-purple-400',
      items: [
        ...(isSuperAdmin || isGerenteComercial || isAdmin
          ? [{ label: 'Gestión de Usuarios', path: '/users', icon: 'group', permission: 'manage_users' }]
          : []),
        ...(isGerenteComercial || isAdmin
          ? [{ label: isGerenteComercial ? 'Mis Agencias' : 'Mi Agencia', path: '/admin/agencies', icon: 'store' }]
          : []),
      ],
    },
  ];

  const adminNavItems = [
    { label: 'Planes', path: '/admin/plans', icon: 'layers' },
    { label: 'Permisos', path: '/admin/permissions', icon: 'key' },
    { label: 'Agencias', path: '/admin/agencies', icon: 'corporate_fare' },
    { label: 'Suscripciones', path: '/admin/subscriptions', icon: 'credit_card' },
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

      {/* Left Sidebar */}
      <aside className={`flex flex-col h-full bg-surface dark:bg-inverse-surface fixed left-0 top-0 border-r border-outline-variant shadow-sm z-50 transition-all duration-300 ease-in-out overflow-x-hidden print:hidden ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isSidebarCollapsed ? 'w-64 lg:w-20' : 'w-64'}`}>
        {/* Logo Branding */}
        <div className="p-5 flex flex-col items-center border-b border-outline-variant/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black shadow-md shadow-primary/20 text-lg flex-shrink-0">
              S
            </div>
            <div className={`transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[180px]'}`}>
              <span className="text-xl font-extrabold text-on-surface tracking-tight uppercase whitespace-nowrap">SANTUN</span>
              <p className="font-label-md text-label-md text-on-surface-variant opacity-70 whitespace-nowrap">Provider Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Categories & Links */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {categories.map((category, index) => {
            const visibleCategoryItems = category.items.filter(isItemVisible);
            if (visibleCategoryItems.length === 0) return null;

            return (
              <div key={category.title} className="space-y-1">
                {/* Divider Line & Colored Title + Icon (No Background) */}
                <div className={`transition-all duration-300 ${index > 0 ? 'pt-3 mt-3 border-t border-outline-variant/50' : 'pt-1'} ${isSidebarCollapsed ? 'lg:px-0' : 'px-1'}`}>
                  <div className={`flex items-center gap-2 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase ${category.color} ${isSidebarCollapsed ? 'lg:justify-center' : ''}`}>
                    <span className="material-symbols-outlined text-[16px] flex-shrink-0">{category.icon}</span>
                    <span className={`transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100 block'}`}>{category.title}</span>
                  </div>
                </div>

                {/* Category Items */}
                {visibleCategoryItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      onClick={() => setLeftSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 font-bold text-xs rounded-xl transition-all duration-150 active:scale-95 ${
                        isActive 
                          ? 'text-primary bg-primary/10 border border-primary/20 shadow-2xs' 
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined flex-shrink-0 text-[20px]">{item.icon}</span>
                      <span className={`font-body-md whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}

          {/* Super Admin System Section */}
          {isSuperAdmin && (
            <div className="space-y-1">
              <div className={`pt-3 mt-3 border-t border-outline-variant/50 transition-all duration-300 ${isSidebarCollapsed ? 'lg:px-0' : 'px-1'}`}>
                <div className={`flex items-center gap-2 px-2.5 py-1 text-rose-600 dark:text-rose-400 text-[10px] font-black tracking-wider uppercase ${isSidebarCollapsed ? 'lg:justify-center' : ''}`}>
                  <span className="material-symbols-outlined text-[16px] flex-shrink-0">workspace_premium</span>
                  <span className={`transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100 block'}`}>Administración</span>
                </div>
              </div>

              {adminNavItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setLeftSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 font-bold text-xs rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'text-rose-700 bg-rose-50 border border-rose-200/60 shadow-2xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-rose-600 flex-shrink-0 text-[20px]">{item.icon}</span>
                    <span className={`font-body-md whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Bottom Utility Links */}
        <div className="px-3 py-4 mt-auto border-t border-outline-variant/60 overflow-x-hidden space-y-0.5">
          <Link href="/admin/permissions" className="flex items-center gap-3 px-3.5 py-2.5 text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-xl transition-colors font-semibold">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px]">settings</span>
            <span className={`font-body-md whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Configuración</span>
          </Link>
          <Link href="/products" className="flex items-center gap-3 px-3.5 py-2.5 text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-xl transition-colors font-semibold">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px]">medical_services</span>
            <span className={`font-body-md whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Herramientas</span>
          </Link>
          <Link href="/" onClick={() => setLeftSidebarOpen(false)} className="flex items-center w-full gap-3 px-3.5 py-2.5 text-xs text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface rounded-xl transition-colors font-semibold">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px]">help</span>
            <span className={`font-body-md whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Ayuda</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
