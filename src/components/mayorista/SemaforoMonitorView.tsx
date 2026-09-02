'use client';

import React, { useState, useEffect } from 'react';
import { wholesaleService } from '../../services/wholesaleService';
import { SwapAlternativeModal } from './SwapAlternativeModal';
import { 
  Clock, CheckCircle2, AlertOctagon, Wallet, FileText, 
  RefreshCw, ArrowRight, ShieldCheck, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SemaforoMonitorViewProps {
  bookingId: number;
  onBackToLienzo: () => void;
}

export const SemaforoMonitorView: React.FC<SemaforoMonitorViewProps> = ({
  bookingId,
  onBackToLienzo,
}) => {
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [paying, setPaying] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedRejectedItem, setSelectedRejectedItem] = useState<any>(null);

  useEffect(() => {
    fetchStatus();
    fetchWallet();
  }, [bookingId]);

  const fetchStatus = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await wholesaleService.getBookingStatus(bookingId);
      setBookingData(res.data);
    } catch (err: any) {
      toast.error('Error al actualizar estado del semáforo.');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await wholesaleService.getWallet();
      setWalletBalance(res.data.balance || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePay = async () => {
    if (!bookingData) return;
    setPaying(true);
    try {
      await wholesaleService.payWithWallet(bookingId);
      toast.success('¡Reserva pagada y emitida exitosamente con tu Billetera B2B!');
      fetchStatus(false);
      fetchWallet();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al procesar el pago.');
    } finally {
      setPaying(false);
    }
  };

  const openSwap = (item: any) => {
    setSelectedRejectedItem({
      id: item.id,
      resource_title: item.resource_title,
      itemable_type: item.itemable_type,
      start_date: item.start_date,
      end_date: item.end_date,
    });
    setSwapModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-10 h-10 text-cyan-500 animate-spin" />
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
          Iniciando Monitor de Semáforo de Trazabilidad...
        </span>
      </div>
    );
  }

  if (!bookingData) return null;

  const globalStatus = bookingData.global_status;
  const items = bookingData.items || [];
  const isAllApproved = globalStatus === 'confirmed_hold';
  const isTicketed = globalStatus === 'ticketed';
  const hasRejections = globalStatus === 'requires_modification' || items.some((i: any) => i.status === 'rejected');

  return (
    <div className="space-y-6">
      
      {/* Banner de Estado Global */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-xl ${
        isTicketed
          ? 'bg-emerald-500 text-white border-emerald-400'
          : isAllApproved
          ? 'bg-cyan-500 text-white border-cyan-400'
          : hasRejections
          ? 'bg-rose-500 text-white border-rose-400'
          : 'bg-amber-500 text-white border-amber-400'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
            {isTicketed ? (
              <ShieldCheck className="w-7 h-7" />
            ) : isAllApproved ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : hasRejections ? (
              <AlertOctagon className="w-7 h-7 animate-bounce" />
            ) : (
              <Clock className="w-7 h-7 animate-spin-slow" />
            )}
          </div>
          <div>
            <span className="text-xs uppercase font-black tracking-widest text-white/80 block">
              RESERVA {bookingData.booking_number}
            </span>
            <h2 className="text-xl font-black tracking-tight">
              {isTicketed
                ? '¡Reserva Emitida & Confirmada (Ticketed)!'
                : isAllApproved
                ? '¡Inventario Bloqueado! Listo para Pago'
                : hasRejections
                ? 'Requiere Modificación — Rescate de Venta Disponible'
                : 'Esperando Aprobación de Proveedores Manuales...'}
            </h2>
          </div>
        </div>

        {/* Acciones del Banner */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchStatus(true);
              fetchWallet();
            }}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            title="Actualizar Estado Manualmente"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar Estado</span>
          </button>

          {isAllApproved && (
            <button
              disabled={paying}
              onClick={handlePay}
              className="px-6 py-3 rounded-2xl bg-white text-cyan-600 font-extrabold hover:bg-slate-100 shadow-lg shadow-black/10 transition-all flex items-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              {paying ? 'Procesando Pago...' : 'Pagar con Billetera B2B'}
            </button>
          )}

          <button
            onClick={onBackToLienzo}
            className="px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-bold transition-all"
          >
            Volver al Lienzo
          </button>
        </div>
      </div>

      {/* Saldo de Billetera B2B */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-medium text-slate-300">Billetera B2B Disponible:</span>
          <span className="text-sm font-black text-cyan-400">${walletBalance.toFixed(2)}</span>
        </div>
        <span className="text-[11px] text-slate-400">Merchant of Record: Trivali Multi-Tenant</span>
      </div>

      {/* Lista de Ítems del Lienzo con Colores Semánticos */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
          Trazabilidad de Ítems en Itinerario
        </h3>

        {items.map((item: any) => {
          const isPending = item.status === 'pending_approval' || item.status === 'draft';
          const isApproved = item.status === 'approved' || isTicketed;
          const isRejected = item.status === 'rejected';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                isApproved
                  ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                  : isRejected
                  ? 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-950/20 shadow-sm'
                  : 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Badge Semáforo */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isApproved
                    ? 'bg-emerald-500 text-white'
                    : isRejected
                    ? 'bg-rose-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  {isApproved ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : isRejected ? (
                    <AlertOctagon className="w-6 h-6" />
                  ) : (
                    <Clock className="w-6 h-6 animate-spin-slow" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.resource_title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fechas: {item.start_date} al {item.end_date}
                  </p>
                  {isRejected && (
                    <p className="text-xs font-semibold text-rose-500 mt-1">
                      Motivo de rechazo: {item.rejection_reason || 'Sin disponibilidad'}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Action / Label */}
              <div>
                {isApproved && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    CONFIRMADO
                  </span>
                )}

                {isPending && (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-extrabold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 animate-spin-slow" />
                    PENDING APPROVAL
                  </span>
                )}

                {isRejected && (
                  <button
                    onClick={() => openSwap(item)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    BUSCAR ALTERNATIVA
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Swap Silencioso */}
      <SwapAlternativeModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        rejectedItem={selectedRejectedItem}
        destination={bookingData.destination}
        onSwapSuccess={() => fetchStatus(false)}
      />

    </div>
  );
};
