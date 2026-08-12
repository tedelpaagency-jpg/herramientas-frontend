'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, Search, Shield, Building, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  setMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 w-full h-16 border-b border-slate-200 flex justify-between items-center px-4 lg:px-6 gap-4">
      {/* Search Bar & Mobile Menu Toggle */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-full lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 w-full">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar propiedades, clientes, módulos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 w-full placeholder-slate-400"
          />
        </div>
      </div>

      {/* User Actions & Dropdown */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {user?.agency && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
            <Building className="w-3.5 h-3.5" />
            <span>Agencia: <strong>{user.agency.name}</strong></span>
          </div>
        )}

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-xs text-slate-900 truncate max-w-[140px]">{user?.name || 'Usuario SANTUN'}</p>
              <p className="text-[10px] font-semibold text-slate-500">{user?.email}</p>
            </div>
            
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center text-white font-bold text-sm hover:ring-2 hover:ring-blue-600/30 transition-all"
            >
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ST'}
            </button>
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setDropdownOpen(false)} 
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-slide-up-fade">
                <div className="p-3 border-b border-slate-100 bg-slate-50 sm:hidden">
                  <p className="font-bold text-xs text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>

                <div className="px-4 py-2.5 text-xs font-semibold text-slate-600 flex items-center gap-2 border-b border-slate-100">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Sesión Sanctum Activa</span>
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
