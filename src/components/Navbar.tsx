'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  leftSidebarOpen,
  setLeftSidebarOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  rightSidebarOpen,
  setRightSidebarOpen,
}) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.roles?.some((r) => r.name === 'super_admin');

  const isWhiteLabelAdmin =
    user?.role === 'white_label_admin' ||
    user?.roles?.some((r) => r.name === 'white_label_admin');

  const isAgencyAdmin =
    user?.role === 'admin' ||
    user?.role === 'gerente' ||
    user?.role === 'gerente_comercial' ||
    user?.roles?.some((r) => ['admin', 'gerente', 'gerente_comercial'].includes(r.name));

  let configHref: string | null = null;
  if (isSuperAdmin) {
    configHref = '/admin/permissions';
  } else if (isWhiteLabelAdmin) {
    configHref = '/white-label/dashboard';
  } else if (isAgencyAdmin) {
    configHref = '/admin/agencies';
  }

  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-30 w-full h-16 border-b border-outline-variant flex justify-between items-center px-2 lg:px-6 gap-2 print:hidden">
      {/* Menu Toggle & Search Bar */}
      <div className="flex items-center gap-1 lg:gap-4 flex-1 lg:flex-none min-w-0">
        <button 
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Abrir menú principal"
          aria-expanded={leftSidebarOpen}
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              setLeftSidebarOpen(!leftSidebarOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-3 lg:px-4 py-2 w-full lg:w-96 min-w-0">
          <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 outline-none text-body-md w-full min-w-0 truncate text-on-surface placeholder-on-surface-variant/60" 
            placeholder="Buscar propiedades, clientes, módulos..." 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Right Header Actions */}
      <div className="flex items-center gap-1 lg:gap-4 flex-shrink-0">
        {/* Right Sidebar Toggle Button */}
        <button 
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)} 
          className={`w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${rightSidebarOpen ? 'bg-primary text-white shadow-md' : 'hover:bg-surface-container-high text-on-surface'}`}
          title="Menú Lateral"
          aria-label="Abrir menú secundario"
          aria-expanded={rightSidebarOpen}
        >
          <span className={`material-symbols-outlined ${rightSidebarOpen ? 'text-white' : 'text-primary'}`}>menu_open</span>
        </button>

        {/* Notifications Dropdown Button & Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className={`hidden lg:flex w-11 h-11 items-center justify-center rounded-full transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${showNotifications ? 'bg-primary text-white shadow-md' : 'hover:bg-surface-container-high text-on-surface'}`}
            aria-label="Notificaciones"
            aria-expanded={showNotifications}
          >
            <span className={`material-symbols-outlined ${showNotifications ? 'text-white' : 'text-primary'}`}>notifications</span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setShowNotifications(false)} aria-hidden="true"></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-surface border border-outline-variant rounded-2xl shadow-xl z-[70] overflow-hidden"
                >
                  <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                    <h4 className="font-bold text-on-surface">Notificaciones</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-primary hover:underline">Marcar leídas</button>
                  </div>
                  <div className="p-8 flex flex-col items-center justify-center text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-3 opacity-50">notifications_paused</span>
                    <p className="text-sm font-medium">No tienes notificaciones recientes</p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu */}
        <div className="flex items-center gap-3 ml-1 lg:ml-4 relative">
          <div className="text-right hidden sm:block">
            <p className="font-label-md font-bold text-on-surface truncate max-w-[140px]">{user?.name || 'Usuario SANTUN'}</p>
            <p className="text-[10px] font-semibold text-on-surface-variant">{user?.role || user?.email || 'Specialist'}</p>
          </div>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`w-11 h-11 rounded-full border border-slate-200 dark:border-slate-800 ${user?.photo ? 'bg-transparent' : 'bg-primary text-white'} flex items-center justify-center font-bold hover:ring-2 hover:ring-primary/40 transition-all active:scale-95 focus:outline-none overflow-hidden flex-shrink-0`}
            aria-label="Menú de usuario"
            aria-expanded={showUserMenu}
          >
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : user?.name ? (
              user.name.substring(0, 2).toUpperCase()
            ) : (
              'ST'
            )}
          </button>
          
          <AnimatePresence>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} aria-hidden="true"></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-surface border border-outline-variant rounded-xl shadow-xl z-[70] overflow-hidden"
                >
                  <div className="p-3 border-b border-outline-variant sm:hidden">
                    <p className="font-bold text-on-surface">{user?.name || 'Usuario SANTUN'}</p>
                    <p className="text-xs text-on-surface-variant">{user?.role || user?.email || 'Specialist'}</p>
                  </div>
                  <div className="py-2">
                    <Link href="/estates/new" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-primary font-bold transition-colors">
                      <span className="material-symbols-outlined text-lg">add_circle</span>
                      Nueva Propiedad
                    </Link>
                    <div className="h-px bg-outline-variant my-1"></div>
                    <Link href="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                      Mi Perfil
                    </Link>
                    {configHref && (
                      <Link href={configHref} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        Configuración
                      </Link>
                    )}
                    <div className="h-px bg-outline-variant my-2"></div>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-error-container/20 text-sm text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Cerrar Sesión
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
