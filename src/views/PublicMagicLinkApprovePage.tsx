'use client';

import React, { useState, useEffect } from 'react';
import { wholesaleService } from '../services/wholesaleService';
import { CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface PublicMagicLinkApprovePageProps {
  token: string;
}

export const PublicMagicLinkApprovePage: React.FC<PublicMagicLinkApprovePageProps> = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processedState, setProcessedState] = useState<'approved' | 'rejected' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    fetchTokenData();
  }, [token]);

  const fetchTokenData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await wholesaleService.getMagicLinkData(token);
      setData(res.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Token inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await wholesaleService.approveMagicLink(token);
      setProcessedState('approved');
      toast.success('Solicitud aprobada e inventario bloqueado exitosamente.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al aprobar la solicitud.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Por favor ingresa un motivo para el rechazo.');
      return;
    }
    setProcessing(true);
    try {
      await wholesaleService.rejectMagicLink(token, rejectionReason);
      setProcessedState('rejected');
      toast.success('Solicitud rechazada.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al rechazar la solicitud.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <Clock className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
          Verificando firma criptográfica de Magic Link...
        </p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Enlace Inválido o Expirado
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }

  if (processedState === 'approved') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/25">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Inventario bloqueado exitosamente.
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Te notificaremos cuando el broker procese el pago de tu ganancia neta (${data?.net_earnings.toFixed(2)}).
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (processedState === 'rejected') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-rose-500 text-white mx-auto flex items-center justify-center shadow-xl shadow-rose-500/25">
            <XCircle className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Solicitud Rechazada
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Has notificado que no dispones de cupo/inventario para estas fechas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-6 p-6 md:p-8">
        
        {/* Header */}
        <div className="text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase tracking-widest">
            TRIVALI B2B — SOLICITUD DE RESERVA
          </span>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Hola, {data.provider_name}
          </h1>
          <p className="text-xs text-slate-500">
            Tienes una nueva solicitud de bloqueo para tu inventario.
          </p>
        </div>

        {/* Informacion comercial del proveedor */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recurso / Inmueble</span>
            <span className="text-base font-black text-slate-900 dark:text-white">{data.resource_title}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Destino</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{data.destination}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fechas</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{data.start_date} al {data.end_date}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase">Tu Ganancia Neta:</span>
            <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">${data.net_earnings.toFixed(2)}</span>
          </div>
        </div>

        {/* Alerta TTL */}
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800/40">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>Tienes hasta 4 horas para responder antes de que caduque el enlace.</span>
        </div>

        {/* Input de motivo de rechazo si aplica */}
        {showRejectInput && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-rose-500 block">
              MOTIVO DE RECHAZO (REQUERIDO)
            </label>
            <textarea
              rows={2}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ej. No disponible en esas fechas..."
              className="w-full p-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        )}

        {/* Botones */}
        <div className="space-y-3 pt-2">
          {!showRejectInput ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={processing}
                onClick={handleApprove}
                className="py-3.5 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-black text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                APROBAR
              </button>

              <button
                disabled={processing}
                onClick={() => setShowRejectInput(true)}
                className="py-3.5 px-4 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-sm transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                RECHAZAR
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                disabled={processing}
                onClick={handleReject}
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm shadow-lg shadow-rose-500/25 transition-all"
              >
                CONFIRMAR RECHAZO
              </button>
              <button
                onClick={() => setShowRejectInput(false)}
                className="w-full text-center text-xs font-bold text-slate-400 py-1"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
