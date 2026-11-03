"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, Briefcase, Users, Menu } from 'lucide-react';
import { getCachedAgencyConfig } from '@/services/publicInmobiliariaService';

interface MobileBottomNavigationProps {
  agency?: any;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({ agency: initialAgency }) => {
  const pathname = usePathname();
  const [agency, setAgency] = useState<any>(initialAgency);

  useEffect(() => {
    if (!agency) {
      const cached = getCachedAgencyConfig();
      if (cached) setAgency(cached);
    }
  }, [agency]);

  const primaryColor = agency?.primary_color || '#2067F5';

  const handleOpenMenu = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-mobile-menu'));
    }
  };

  const isHome = pathname === '/' || pathname === '/travel-agency-03';
  const isProperties = pathname.startsWith('/properties');
  const isServices = pathname.startsWith('/services') || pathname.startsWith('/servicios');
  const isAbout = pathname.startsWith('/about') || pathname.startsWith('/conocenos');

  return (
    <nav
      aria-label="Navegación inferior móvil"
      className="d-xl-none fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 flex items-center justify-around"
      style={{
        paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
      }}
    >
      {/* 1. Inicio */}
      <Link
        href="/"
        className="flex-1 flex flex-col items-center justify-center py-1 gap-1 no-underline transition-all active:scale-90"
        style={{ color: isHome ? primaryColor : '#64748b' }}
      >
        <Home className="w-5 h-5" strokeWidth={isHome ? 2.5 : 1.8} />
        <span className={`text-[10px] ${isHome ? 'font-black' : 'font-semibold'}`}>
          Inicio
        </span>
      </Link>

      {/* 2. Propiedades */}
      <Link
        href="/properties"
        className="flex-1 flex flex-col items-center justify-center py-1 gap-1 no-underline transition-all active:scale-90"
        style={{ color: isProperties ? primaryColor : '#64748b' }}
      >
        <Building2 className="w-5 h-5" strokeWidth={isProperties ? 2.5 : 1.8} />
        <span className={`text-[10px] ${isProperties ? 'font-black' : 'font-semibold'}`}>
          Propiedades
        </span>
      </Link>

      {/* 3. Servicios */}
      <Link
        href="/services"
        className="flex-1 flex flex-col items-center justify-center py-1 gap-1 no-underline transition-all active:scale-90"
        style={{ color: isServices ? primaryColor : '#64748b' }}
      >
        <Briefcase className="w-5 h-5" strokeWidth={isServices ? 2.5 : 1.8} />
        <span className={`text-[10px] ${isServices ? 'font-black' : 'font-semibold'}`}>
          Servicios
        </span>
      </Link>

      {/* 4. Nosotros */}
      <Link
        href="/about"
        className="flex-1 flex flex-col items-center justify-center py-1 gap-1 no-underline transition-all active:scale-90"
        style={{ color: isAbout ? primaryColor : '#64748b' }}
      >
        <Users className="w-5 h-5" strokeWidth={isAbout ? 2.5 : 1.8} />
        <span className={`text-[10px] ${isAbout ? 'font-black' : 'font-semibold'}`}>
          Nosotros
        </span>
      </Link>

      {/* 5. Menú / Más */}
      <button
        type="button"
        onClick={handleOpenMenu}
        aria-label="Abrir menú"
        className="flex-1 flex flex-col items-center justify-center py-1 gap-1 bg-transparent border-none cursor-pointer transition-all active:scale-90"
        style={{ color: '#64748b' }}
      >
        <Menu className="w-5 h-5" strokeWidth={1.8} />
        <span className="text-[10px] font-semibold text-slate-500">
          Menú
        </span>
      </button>
    </nav>
  );
};

export default MobileBottomNavigation;

