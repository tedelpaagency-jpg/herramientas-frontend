'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Globe, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Plane, 
  FileText, 
  Package, 
  ShoppingCart, 
  Trophy, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  Store, 
  Briefcase, 
  CreditCard, 
  Layers, 
  Key, 
  Settings, 
  Wrench, 
  HelpCircle,
  Compass
} from 'lucide-react';

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

  const isProveedor =
    user?.role === 'proveedor' ||
    user?.role === 'supplier' ||
    user?.roles?.some((r) => r.name === 'proveedor' || r.name === 'supplier');

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
    items: {
      label: string;
      path: string;
      icon: React.ElementType;
      permission?: string;
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
        { label: 'Workspaces & CRM', path: '/workspaces', icon: LayoutDashboard },
        { label: 'Google Calendar', path: '/calendar', icon: Calendar },
        { label: 'Directorio de Clientes', path: '/clients', icon: Users },
        { label: 'Landing Pages & Eventos', path: '/landings', icon: Globe },
        { label: 'Marketing & Correos', path: '/marketing', icon: Mail },
        { label: 'LexVault (Contratos)', path: '/lexvault', icon: ShieldCheck },
      ],
    },
    {
      title: 'ACTIVIDAD INMOBILIARIA',
      items: [
        { label: 'Propiedades / Inmuebles', path: '/estates', icon: Building2, permission: 'view_estates' },
      ],
    },
    {
      title: 'TURISMO & VIAJES',
      items: [
        { label: 'Trámites de Visas', path: '/visas', icon: FileText, permission: 'view_visas' },
        { label: 'Reportes de Viajes', path: '/travel-reports', icon: Plane },
        ...(!isProveedor
          ? [
              { label: 'Catálogo POS Paquetes', path: '/travel-packages/pos', icon: ShoppingCart },
              { label: 'Mis Solicitudes Paquetes', path: '/travel-packages/my-requests', icon: FileText },
            ]
          : []),
        ...(isProveedor || isSuperAdmin
          ? [
              { label: 'Mis Paquetes (Proveedor)', path: '/supplier/packages', icon: Package },
              { label: 'Solicitudes Recibidas', path: '/supplier/requests', icon: FileText },
            ]
          : []),
        ...(isSuperAdmin || isGerenteComercial
          ? [
              { label: 'Gestión Paquetes Admin', path: '/admin/travel-packages', icon: Package },
              { label: 'Gestión Solicitudes Viaje', path: '/admin/travel-requests', icon: FileText },
            ]
          : []),
      ],
    },
    {
      title: 'COMERCIO & VENTAS',
      items: [
        { label: 'Productos & Inventario', path: '/products', icon: Package, permission: 'view_products' },
        { label: 'Caja POS / Ventas', path: '/pos', icon: ShoppingCart, permission: 'view_pos' },
        { label: 'Ruleta de Premios', path: '/spin-wheel', icon: Trophy, permission: 'view_spin_wheel' },
      ],
    },
    {
      title: 'CAPACITACIÓN',
      items: [
        ...(isSuperAdmin || isGerenteComercial
          ? [
              { label: 'Gestión de Cursos', path: '/courses', icon: GraduationCap },
            ]
          : []),
        { label: 'Mis Cursos', path: '/my-courses', icon: BookOpen },
      ],
    },
    {
      title: 'GESTIÓN & AGENCIA',
      items: [
        ...(isSuperAdmin || isGerenteComercial || isAdmin
          ? [{ label: 'Gestión de Usuarios', path: '/users', icon: UserCheck, permission: 'manage_users' }]
          : []),
        ...(isGerenteComercial || isAdmin
          ? [{ label: isGerenteComercial ? 'Mis Agencias' : 'Mi Agencia', path: '/admin/agencies', icon: Store }]
          : []),
        { label: 'Equipos de Trabajo', path: '/admin/teams', icon: Briefcase },
        { label: 'Comisiones & Balances', path: '/commissions', icon: CreditCard },
      ],
    },
  ];

  const adminNavItems = [
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

      {/* Left Sidebar */}
      <aside className={`flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm z-50 transition-all duration-300 ease-in-out overflow-x-hidden print:hidden fixed left-0 top-0 ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isSidebarCollapsed ? 'w-64 lg:w-20' : 'w-64'}`}>
        
        {/* Logo Branding - Estilo Platzi */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          <Link href="/" className="flex items-center gap-3">
            {/* Logo de diamante de Platzi */}
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20 transform -rotate-12">
              <Compass className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[180px]'}`}>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                SANTUN
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Categories & Links */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {categories.map((category, index) => {
            const visibleCategoryItems = category.items.filter(isItemVisible);
            if (visibleCategoryItems.length === 0) return null;

            return (
              <div key={category.title} className="space-y-1">
                {/* Header de Sección - Estilo Platzi */}
                <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:px-0 lg:text-center' : 'px-3'}`}>
                  <span className={`text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase transition-all duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100 block'}`}>
                    {category.title}
                  </span>
                </div>

                {/* Items de Navegación */}
                {visibleCategoryItems.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      onClick={() => setLeftSidebarOpen(false)}
                      className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400 font-black shadow-xs border border-emerald-500/20' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-bold'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 stroke-[2.2] transition-colors ${
                        isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-400'
                      }`} />
                      <span className={`text-[14px] leading-tight whitespace-nowrap tracking-tight transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            );
          })}

          {/* Super Admin System Section */}
          {isSuperAdmin && (
            <div className="space-y-1 pt-2">
              <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:px-0 lg:text-center' : 'px-3'}`}>
                <span className={`text-[10px] font-black tracking-widest text-rose-500 uppercase transition-all duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100 block'}`}>
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
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-black border border-rose-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-bold'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 stroke-[2.2] ${
                      isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-400'
                    }`} />
                    <span className={`text-[14px] leading-tight whitespace-nowrap tracking-tight transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Links de Utilidad Inferiores */}
        <div className="px-3 py-4 mt-auto border-t border-slate-100 dark:border-slate-800/80 space-y-1">
          <Link href="/admin/permissions" className="flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            <Settings className="w-4 h-4 stroke-[2]" />
            <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Configuración</span>
          </Link>
          <Link href="/products" className="flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            <Wrench className="w-4 h-4 stroke-[2]" />
            <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Herramientas</span>
          </Link>
          <Link href="/" onClick={() => setLeftSidebarOpen(false)} className="flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            <HelpCircle className="w-4 h-4 stroke-[2]" />
            <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>Ayuda</span>
          </Link>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
