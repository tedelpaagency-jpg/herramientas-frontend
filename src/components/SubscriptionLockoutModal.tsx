'use client';

import React from 'react';
import Portal from './Portal';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogOut, Key, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const SubscriptionLockoutModal: React.FC = () => {
  const { user, logout, dashboardType } = useAuth();

  const sub = user?.subscription;
  if (!sub || !sub.is_expired) {
    return null;
  }

  const isWhiteLabelScope = sub.expired_scope === 'white_label';
  const isAdmin = dashboardType === 'super_admin' || dashboardType === 'white_label_admin';

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 text-center text-slate-900 dark:text-white">
          
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/10 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Suscripción Vencida
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              {isWhiteLabelScope ? (
                <span>
                  La suscripción de tu <strong>Marca Blanca</strong> ha finalizado. El acceso a la plataforma se encuentra temporalmente suspendido. Contacta al <strong>Super Admin</strong> para proceder con la renovación.
                </span>
              ) : (
                <span>
                  La suscripción de tu <strong>Agencia</strong> ha finalizado. El acceso a los módulos se encuentra suspendido. Contacta al <strong>administrador de tu Marca Blanca</strong> para renovar el servicio.
                </span>
              )}
            </p>
          </div>

          {/* Details Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Estado de Cuenta:</span>
              <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Suscripción Expirada
              </span>
            </div>

            {sub.end_date && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Fecha de Vencimiento:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {new Date(sub.end_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {isAdmin && (
              <Link
                href="/admin/subscriptions"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Key className="w-4 h-4" />
                <span>Gestionar Suscripciones</span>
              </Link>
            )}

            <button
              onClick={logout}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

        </div>
      </div>
    </Portal>
  );
};

export default SubscriptionLockoutModal;
