'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogOut, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const ImpersonationBanner: React.FC = () => {
  const router = useRouter();
  const { isImpersonating, impersonatingFrom, user, stopImpersonation } = useAuth();

  if (!isImpersonating) return null;

  const handleReturn = async () => {
    try {
      await stopImpersonation();
      toast.success('Regresado a cuenta de Super Admin');
      router.push('/admin/white-labels');
    } catch (e) {
      toast.error('Error al salir de impersonación');
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between shadow-lg sticky top-0 z-[9999] animate-in slide-in-from-top">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
        <span>
          MODO IMPERSONACIÓN ACTIVO: Estás navegando como <strong className="underline">{user?.name || user?.email}</strong> ({user?.role})
        </span>
        {impersonatingFrom && (
          <span className="opacity-80 hidden sm:inline font-mono">
            • Sesión original: {impersonatingFrom.name}
          </span>
        )}
      </div>

      <button
        onClick={handleReturn}
        className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer text-[11px]"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Volver a Super Admin</span>
      </button>
    </div>
  );
};

export default ImpersonationBanner;
