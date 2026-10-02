'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import visaWholesaleService, { VisaNotification } from '@/services/visaWholesaleService';
import { 
  Bell, Check, RefreshCw, ArrowLeft, ShieldCheck, 
  ExternalLink, CheckCircle2, Clock, MailOpen, Trash2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export const VisaNotificationsPage: React.FC = () => {
  const { currentWhiteLabel } = useAuth();
  const [notifications, setNotifications] = useState<VisaNotification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await visaWholesaleService.getNotifications(page);
      if (res) {
        setNotifications(res.data || []);
        setTotalPages(res.last_page || 1);
      }
    } catch (err) {
      toast.error('Error al cargar notificaciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, currentWhiteLabel?.id]);

  useEffect(() => {
    const handleBrandingChange = () => {
      fetchNotifications();
    };
    window.addEventListener('branding-updated', handleBrandingChange);
    return () => {
      window.removeEventListener('branding-updated', handleBrandingChange);
    };
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await visaWholesaleService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      toast.error('Error al actualizar notificación');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await visaWholesaleService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('Todas las notificaciones marcadas como leídas.');
    } catch (err) {
      toast.error('Error al actualizar notificaciones');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-sky-50 dark:bg-sky-950/60 text-sky-600 rounded-xl">
              <Bell className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Centro de Notificaciones</h1>
          </div>
          <p className="text-sm text-slate-500">
            Avisos de formularios completados, observaciones de documentos, respuestas y cambios de etapa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {isLoading ? (
            <div className="p-16 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-500" />
              Cargando notificaciones...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-30 text-sky-500" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No hay notificaciones</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors ${
                  !notif.is_read ? 'bg-sky-50/40 dark:bg-sky-950/20' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!notif.is_read && <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />}
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400">• {new Date(notif.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{notif.message}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {notif.dossier_id && (
                    <Link
                      href={`/visas/expedientes/${notif.dossier_id}`}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Ver Expediente
                    </Link>
                  )}

                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Marcar como leída"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>Página {page} de {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
