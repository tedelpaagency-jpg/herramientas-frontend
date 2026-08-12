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

  const navItems = [
    { label: 'Dashboard', path: '/', icon: 'dashboard' },
    { label: 'Propiedades / Inmuebles', path: '/estates', icon: 'apartment', permission: 'view_estates' },
    ...(isSuperAdmin || isGerenteComercial || isAdmin ? [
      { label: 'Gestión de Usuarios', path: '/users', icon: 'group', permission: 'manage_users' }
    ] : []),
    ...(isGerenteComercial || isAdmin ? [
      { label: isGerenteComercial ? 'Mis Agencias' : 'Mi Agencia', path: '/admin/agencies', icon: 'store' }
    ] : []),
    { label: 'CRM & Pipeline', path: '/crm', icon: 'view_kanban', permission: 'view_crm' },
    { label: 'Directorio de Clientes', path: '/clients', icon: 'contacts', permission: 'view_clients' },
    { label: 'Productos & Inventario', path: '/products', icon: 'inventory_2', permission: 'view_products' },
    { label: 'Caja POS / Ventas', path: '/pos', icon: 'point_of_sale', permission: 'view_pos' },
    { label: 'Trámites de Visas', path: '/visas', icon: 'assignment_ind', permission: 'view_visas' },
    { label: 'Formularios W-8', path: '/w8-forms', icon: 'description', permission: 'view_w8_forms' },
    { label: 'Bóveda Legal (LexVault)', path: '/lexvault', icon: 'gavel', permission: 'view_lexvault' },
    { label: 'Ruleta de Premios', path: '/spin-wheel', icon: 'military_tech', permission: 'view_spin_wheel' },
    { label: 'Reportes de Viajes', path: '/travel-reports', icon: 'flight_takeoff', permission: 'view_travel_reports' },
  ];

  const adminNavItems = [
    { label: 'Planes', path: '/admin/plans', icon: 'layers' },
    { label: 'Permisos', path: '/admin/permissions', icon: 'key' },
    { label: 'Agencias', path: '/admin/agencies', icon: 'corporate_fare' },
    { label: 'Suscripciones', path: '/admin/subscriptions', icon: 'credit_card' },
  ];

  const activePlanPermissions =
    user?.agency?.current_subscription?.plan?.plan_permissions?.map((p) => p.permission.toLowerCase()) ||
    user?.agency?.plan?.plan_permissions?.map((p) => p.permission.toLowerCase()) ||
    [];

  const userDirectPermissions = user?.permissions?.map((p) => p.name.toLowerCase()) || [];

  const visibleNavItems = navItems.filter((item) => {
    if (!item.permission || isSuperAdmin) return true;
    if (activePlanPermissions.length === 0 && userDirectPermissions.length === 0) return true;
    return (
      activePlanPermissions.includes(item.permission.toLowerCase()) ||
      userDirectPermissions.includes(item.permission.toLowerCase())
    );
  });

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
        <div className="p-6 flex flex-col items-center">
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

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {visibleNavItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setLeftSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors active:scale-95 duration-150 ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined flex-shrink-0">{item.icon}</span>
                <span className={`font-body-md whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>{item.label}</span>
              </Link>
            );
          })}

          {/* Super Admin Section */}
          {isSuperAdmin && (
            <div className="pt-4 mt-4 border-t border-outline-variant">
              <div className={`flex items-center gap-2 px-4 mb-2 text-[11px] font-extrabold tracking-wider text-amber-600 uppercase transition-all duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100 block'}`}>
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                <span>Administración</span>
              </div>

              {adminNavItems.map(item => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setLeftSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 font-bold rounded-lg transition-colors duration-150 ${
                      isActive
                        ? 'text-amber-700 bg-amber-50 border border-amber-200/60'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-amber-600 flex-shrink-0">{item.icon}</span>
                    <span className={`font-body-md whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Bottom utility links */}
        <div className="px-4 py-6 mt-auto border-t border-outline-variant overflow-x-hidden">
          <Link href="/admin/permissions" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-colors">
            <span className="material-symbols-outlined flex-shrink-0">settings</span>
            <span className={`font-body-md whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Configuración</span>
          </Link>
          <Link href="/products" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-colors">
            <span className="material-symbols-outlined flex-shrink-0">medical_services</span>
            <span className={`font-body-md whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Herramientas</span>
          </Link>
          <Link href="/" onClick={() => setLeftSidebarOpen(false)} className="flex items-center w-full gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface rounded-lg transition-colors">
            <span className="material-symbols-outlined flex-shrink-0">help</span>
            <span className={`font-body-md whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Ayuda</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
