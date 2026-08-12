import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Kanban, 
  Users, 
  ShoppingBag, 
  Calculator, 
  FileCheck, 
  FileText, 
  ShieldCheck, 
  Gift, 
  Plane, 
  LayoutDashboard,
  Layers,
  KeyRound,
  Building,
  CreditCard,
  Crown,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.roles?.some((r) => r.name === 'super_admin');

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Propiedades / Inmuebles', path: '/estates', icon: Building2, permission: 'view_estates' },
    { label: 'CRM & Pipeline', path: '/crm', icon: Kanban, permission: 'view_crm' },
    { label: 'Directorio de Clientes', path: '/clients', icon: Users, permission: 'view_clients' },
    { label: 'Productos & Inventario', path: '/products', icon: ShoppingBag, permission: 'view_products' },
    { label: 'Caja POS / Ventas', path: '/pos', icon: Calculator, permission: 'view_pos' },
    { label: 'Trámites de Visas', path: '/visas', icon: FileCheck, permission: 'view_visas' },
    { label: 'Formularios W-8', path: '/w8-forms', icon: FileText, permission: 'view_w8_forms' },
    { label: 'Bóveda Legal (LexVault)', path: '/lexvault', icon: ShieldCheck, permission: 'view_lexvault' },
    { label: 'Ruleta de Premios', path: '/spin-wheel', icon: Gift, permission: 'view_spin_wheel' },
    { label: 'Reportes de Viajes', path: '/travel-reports', icon: Plane, permission: 'view_travel_reports' },
  ];

  const adminNavItems = [
    { label: 'Planes', path: '/admin/plans', icon: Layers },
    { label: 'Permisos', path: '/admin/permissions', icon: KeyRound },
    { label: 'Agencias', path: '/admin/agencies', icon: Building },
    { label: 'Suscripciones', path: '/admin/subscriptions', icon: CreditCard },
  ];

  // Obtener la lista de permisos asignados al plan activo de la agencia del usuario
  const activePlanPermissions =
    user?.agency?.current_subscription?.plan?.plan_permissions?.map((p) => p.permission.toLowerCase()) ||
    user?.agency?.plan?.plan_permissions?.map((p) => p.permission.toLowerCase()) ||
    [];

  const userDirectPermissions = user?.permissions?.map((p) => p.name.toLowerCase()) || [];

  const visibleNavItems = navItems.filter((item) => {
    // Si no requiere permiso específico (ej. Dashboard) o es Super Admin, siempre mostrar
    if (!item.permission || isSuperAdmin) return true;

    // Si el plan no tiene permisos restringidos asignados aún, mostrar por defecto
    if (activePlanPermissions.length === 0 && userDirectPermissions.length === 0) return true;

    // Verificar si el permiso del módulo está presente en el plan o en el usuario
    return (
      activePlanPermissions.includes(item.permission.toLowerCase()) ||
      userDirectPermissions.includes(item.permission.toLowerCase())
    );
  });

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 shadow-sm flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="p-6 flex flex-col items-center border-b border-slate-100 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">
                SANTUN
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Provider Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-[14px] font-bold rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}

          {/* Super Admin Section */}
          {isSuperAdmin && (
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 px-4 mb-2 text-[11px] font-extrabold tracking-wider text-amber-600 uppercase">
                <Crown className="w-3.5 h-3.5" />
                <span>Administración Global</span>
              </div>

              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold rounded-lg transition-colors duration-150 ${
                        isActive
                          ? 'text-amber-700 bg-amber-50 border border-amber-200/60'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 text-amber-600" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-4 mt-auto border-t border-slate-100 bg-slate-50/50">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between shadow-xs">
            <div>
              <p className="font-bold text-slate-800">API Backend</p>
              <p className="text-[10px] text-blue-600 font-mono truncate">santun.tedelpa.com</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              Laravel 12
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
