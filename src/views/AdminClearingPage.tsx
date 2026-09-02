'use client';

import React, { useState, useEffect } from 'react';
import { wholesaleService } from '../services/wholesaleService';
import { DollarSign, CheckCircle2, RefreshCw, Layers, Send, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminClearingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summaryList, setSummaryList] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [paymentRefMap, setPaymentRefMap] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchClearingSummary();
  }, []);

  const fetchClearingSummary = async () => {
    setLoading(true);
    try {
      const res = await wholesaleService.getClearingSummary();
      setSummaryList(res.data || []);
    } catch (err: any) {
      toast.error('Error al cargar resumen de Clearing.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessClearing = async (providerId: number) => {
    const ref = paymentRefMap[providerId];
    if (!ref || !ref.trim()) {
      toast.error('Por favor ingresa un número de referencia bancaria para procesar la liquidación.');
      return;
    }

    setProcessingId(providerId);
    try {
      await wholesaleService.processClearing(providerId, ref);
      toast.success('Clearing procesado exitosamente. Cuentas marcadas como pagadas.');
      fetchClearingSummary();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al procesar Clearing.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black text-xs uppercase tracking-widest">
            SUPER ADMIN — CONSOLA DE LIQUIDACIÓN
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Clearing B2B — Cuentas por Pagar Consolidadas
          </h1>
        </div>

        <button
          onClick={fetchClearingSummary}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar Resumen
        </button>
      </div>

      {/* Lista de Liquidaciones Pendientes por Proveedor */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
          Cargando resumen de obligaciones pendientes...
        </div>
      ) : summaryList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ¡No hay cuentas pendientes por liquidar!
          </h3>
          <p className="text-xs text-slate-400">
            Todas las reservas ticketadas de proveedores han sido liquidadas en el Clearing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryList.map((row) => {
            const refVal = paymentRefMap[row.provider_id] || '';

            return (
              <div
                key={row.provider_id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {row.provider_name}
                      </h3>
                      <span className="text-xs text-slate-400 block">{row.provider_email}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Reservas distintas acumuladas:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{row.bookings_count}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Ítems totales:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{row.items_count}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">Monto Total Pendiente:</span>
                      <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">
                        ${row.total_pending.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Referencia Bancaria de Transferencia
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. TRF-982314-BANK..."
                      value={refVal}
                      onChange={(e) => setPaymentRefMap({ ...paymentRefMap, [row.provider_id]: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <button
                    disabled={processingId === row.provider_id}
                    onClick={() => handleProcessClearing(row.provider_id)}
                    className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {processingId === row.provider_id ? 'Procesando Clearing...' : 'Procesar Liquidación Única'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default AdminClearingPage;
