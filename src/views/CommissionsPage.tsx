'use client';

import React, { useEffect, useState } from 'react';
import { 
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Plus, RefreshCw, AlertCircle, Loader2, Wallet, FileText
} from 'lucide-react';
import commissionService from '@/services/commissionService';
import { Commission, CommissionBalance } from '../types/travelReport';
import toast from 'react-hot-toast';

const formatMoney = (val: any): string => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export const CommissionsPage: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [balance, setBalance] = useState<CommissionBalance>({
    income: 0,
    withdrawals: 0,
    current_balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State para solicitud de retiro
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawDescription, setWithdrawDescription] = useState<string>('');

  const fetchCommissionsAndBalance = async () => {
    setLoading(true);
    try {
      const [listRes, balanceRes] = await Promise.all([
        commissionService.getCommissions(),
        commissionService.getBalance(),
      ]);

      if (listRes.status === 'success') {
        setCommissions(listRes.data || []);
      }

      if (balanceRes.status === 'success') {
        setBalance(balanceRes.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar comisiones y saldo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissionsAndBalance();
  }, []);

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      toast.error('Ingrese un monto válido a retirar');
      return;
    }

    if (amount > balance.current_balance) {
      toast.error('El monto supera el saldo disponible actual');
      return;
    }

    setSubmitting(true);
    try {
      const res = await commissionService.requestWithdrawal({
        amount,
        description: withdrawDescription,
      });

      toast.success(res.message || 'Solicitud de retiro enviada correctamente');
      setIsModalOpen(false);
      setWithdrawAmount('');
      setWithdrawDescription('');
      fetchCommissionsAndBalance();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al solicitar retiro de comisión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            <DollarSign className="w-4 h-4" />
            <span>Centro Financiero & Billetera de Comisiones</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Gestión de Comisiones
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Revisa tus comisiones generadas por ventas autorizadas y solicita retiros de saldo.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-95"
        >
          <Wallet className="w-4 h-4" />
          <span>Solicitar Retiro de Saldo</span>
        </button>
      </div>

      {/* Financial Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Generado */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Comisiones Ganadas</span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${formatMoney(balance.income)}
            </h3>
            <p className="text-[11px] text-slate-400">Ingresos por ventas de viajes autorizados</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Retirado */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Retirado</span>
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400">
              ${formatMoney(balance.withdrawals)}
            </h3>
            <p className="text-[11px] text-slate-400">Solicitudes de retiro aprobadas</p>
          </div>
          <div className="p-4 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded-2xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Saldo Disponible */}
        <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Saldo Actual Disponible</span>
            <h3 className="text-3xl font-black text-white">
              ${formatMoney(balance.current_balance)}
            </h3>
            <p className="text-[11px] text-slate-400">Disponible para solicitar pago/transferencia</p>
          </div>
          <div className="p-4 bg-emerald-600/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Commissions History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Historial de Movimientos de Comisión</span>
          </h3>

          <button
            onClick={fetchCommissionsAndBalance}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-3" />
            <p className="text-sm font-semibold">Cargando movimientos de comisión...</p>
          </div>
        ) : commissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No hay movimientos registrados</h3>
            <p className="text-xs">Las comisiones aparecerán automáticamente cuando tus reportes de viaje sean autorizados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">Tipo</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">Concepto / Reporte</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">Fecha</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">Monto ($)</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">
                      {comm.type === 1 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          <span>Ingreso</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-extrabold text-[11px]">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Retiro</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {comm.description || 'Movimiento de comisión'}
                      </div>
                      {comm.travel_report && (
                        <span className="text-[11px] text-slate-400 block mt-0.5 whitespace-nowrap">
                          Expediente: {comm.travel_report.code} - {comm.travel_report.name}
                        </span>
                      )}
                    </td>

                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-500 whitespace-nowrap">
                      {new Date(comm.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">
                      <span className={`font-black ${comm.type === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                        ${formatMoney(comm.amount)}
                      </span>
                    </td>

                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">
                      {comm.status === 1 ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">Aprobado</span>
                      ) : comm.status === 2 ? (
                        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[11px]">Rechazado</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px]">Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para solicitar retiro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Solicitar Retiro de Comisión
            </h3>

            <form onSubmit={handleRequestWithdrawal} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">Monto a Retirar ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={balance.current_balance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-sm font-extrabold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Saldo Máximo: ${formatMoney(balance.current_balance)}</span>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">Notas / Observación</label>
                <textarea
                  value={withdrawDescription}
                  onChange={(e) => setWithdrawDescription(e.target.value)}
                  placeholder="Detalles o datos bancarios para transferencia..."
                  className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xs font-semibold h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border font-extrabold text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Enviar Solicitud</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionsPage;
