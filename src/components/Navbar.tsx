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

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('santun_theme') === 'dark';
    }
    return false;
  });

  const toggleDarkMode = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    if (typeof window !== 'undefined') {
      if (newDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        localStorage.setItem('santun_theme', 'dark');
        localStorage.setItem('santun_dark_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        localStorage.setItem('santun_theme', 'light');
        localStorage.setItem('santun_dark_theme', 'light');
      }
      window.dispatchEvent(new Event('theme-changed'));
      window.dispatchEvent(new Event('branding-updated'));
    }
  };

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
    <header className="bg-white/80 dark:bg-[#161a1b]/90 backdrop-blur-md sticky top-0 z-30 w-full h-16 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 flex justify-between items-center px-2 sm:px-4 lg:px-6 gap-1.5 sm:gap-4 print:hidden transition-colors duration-200">
      {/* Menu Toggle & Search Bar */}
      <div className="flex items-center gap-1 sm:gap-3 lg:gap-4 flex-1 lg:flex-none min-w-0">
        <button 
          className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
          <span className="material-symbols-outlined text-[20px] sm:text-[24px]">menu</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 w-full max-w-[180px] xs:max-w-[220px] sm:max-w-xs lg:w-96 min-w-0">
          <span className="material-symbols-outlined text-slate-400 dark:text-slate-400 flex-shrink-0 text-[18px] sm:text-[22px]">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 outline-none text-xs sm:text-body-md w-full min-w-0 truncate text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500" 
            placeholder="Buscar en el portal..." 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Right Header Actions */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
        {/* Dark / Light Mode Toggle Button */}
        <button 
          onClick={toggleDarkMode}
          className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full transition-all active:scale-95 focus:outline-none hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
          title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          aria-label="Cambiar tema de color"
        >
          <span className="material-symbols-outlined text-primary text-[20px] sm:text-[24px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        {/* Right Sidebar Toggle Button */}
        <button 
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)} 
          className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${rightSidebarOpen ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
          title="Menú Lateral"
          aria-label="Abrir menú secundario"
          aria-expanded={rightSidebarOpen}
        >
          <span className={`material-symbols-outlined text-[20px] sm:text-[24px] ${rightSidebarOpen ? 'text-white' : 'text-primary'}`}>menu_open</span>
        </button>

        {/* Notifications Dropdown Button & Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className={`hidden lg:flex w-11 h-11 items-center justify-center rounded-full transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${showNotifications ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
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
                  className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-[70] overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Notificaciones</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-primary hover:underline">Marcar leídas</button>
                  </div>
                  <div className="p-8 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-3 opacity-50">notifications_paused</span>
                    <p className="text-sm font-medium">No tienes notificaciones recientes</p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 ml-0.5 sm:ml-2 lg:ml-4 relative">
          <div className="text-right hidden sm:block">
            <p className="font-label-md font-bold text-slate-800 dark:text-slate-100 truncate max-w-[140px]">{user?.name || 'Usuario SANTUN'}</p>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{user?.role || user?.email || 'Specialist'}</p>
          </div>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-slate-200 dark:border-slate-800 ${user?.photo ? 'bg-transparent' : 'bg-primary text-white'} flex items-center justify-center font-bold hover:ring-2 hover:ring-primary/40 transition-all active:scale-95 focus:outline-none overflow-hidden flex-shrink-0 text-xs sm:text-sm`}
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
                  exit={{ opacity: 0, y: 10, scale: 1 }}
                  className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-[70] overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 sm:hidden">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{user?.name || 'Usuario SANTUN'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || user?.email || 'Specialist'}</p>
                  </div>
                  <div className="py-2">
                    <Link href="/estates/new" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm text-primary font-bold transition-colors">
                      <span className="material-symbols-outlined text-lg">add_circle</span>
                      Nueva Propiedad
                    </Link>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                    <Link href="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                      Mi Perfil
                    </Link>
                    {configHref && (
                      <Link href={configHref} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        Configuración
                      </Link>
                    )}
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-sm text-rose-600 dark:text-rose-400 transition-colors"
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
