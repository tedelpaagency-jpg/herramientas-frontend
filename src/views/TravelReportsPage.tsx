'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plane, Plus, Search, Filter, RefreshCw, FileText, CheckCircle, XCircle, Clock, AlertCircle, Eye, Edit, Trash2, TrendingUp, DollarSign, Users, Award, ShieldCheck, Download
} from 'lucide-react';
import travelReportService from '../services/travelReportService';
import { TravelReport } from '../types/travelReport';
import { confirmDialog } from '../utils/alerts';
import toast from 'react-hot-toast';

export const TravelReportsPage: React.FC = () => {
  const [reports, setReports] = useState<TravelReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total_sales: 0,
    mgt: 0,
    gnt: 0,
    agent_commissions: 0,
    gerente_commissions: 0,
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await travelReportService.getReports(params);
      if (res.status === 'success') {
        setReports(res.data.data || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar los reportes de viajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  const handleStatusChange = async (reportId: number, status: number, action: string) => {
    try {
      const res = await travelReportService.updateStatus(reportId, status, action);
      toast.success(res.message || 'Estado actualizado');
      fetchReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al actualizar el estado');
    }
  };

  const handleDelete = async (reportId: number) => {
    const confirmed = await confirmDialog({
      title: '¿Eliminar reporte de viaje?',
      text: 'El expediente de viaje será marcado como eliminado.',
      confirmButtonText: 'Sí, eliminar',
    });
    if (!confirmed) return;
    try {
      await travelReportService.deleteReport(reportId);
      toast.success('Reporte eliminado exitosamente');
      fetchReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar reporte');
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-extrabold text-xs border border-emerald-300 dark:border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Autorizada</span>
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 font-extrabold text-xs border border-blue-300 dark:border-blue-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pre-autorizada</span>
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 font-extrabold text-xs border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rechazada</span>
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 font-extrabold text-xs">
            <span>Eliminada</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-extrabold text-xs border border-amber-300 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Pendiente</span>
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <Plane className="w-4 h-4" />
            <span>Módulo de Turismo & Ventas</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Reportes de Viajes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Gestión de expedientes de ventas de viajes, liquidación de comisiones y auditoría financiera.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/travel-reports/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Reporte de Viaje</span>
          </Link>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ventas Autorizadas</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ${stats.total_sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Margen Neto (GNT)</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ${stats.gnt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comisión Agentes</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ${stats.agent_commissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comisión Gerentes</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ${stats.gerente_commissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código (SLT...), nombre de venta, cliente o RUC..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Todos los Estados</option>
            <option value="0">Pendientes (0)</option>
            <option value="4">Pre-autorizados (4)</option>
            <option value="1">Autorizados (1)</option>
            <option value="2">Rechazados (2)</option>
          </select>

          <button
            onClick={fetchReports}
            className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-2xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-3" />
            <p className="text-sm font-semibold">Cargando reportes de viajes...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron reportes de viajes</h3>
            <p className="text-xs">No hay ventas registradas que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Código / Venta</th>
                  <th className="py-4 px-6">Vendedor / Equipo</th>
                  <th className="py-4 px-6">Cliente / Pasajeros</th>
                  <th className="py-4 px-6">Total Cliente</th>
                  <th className="py-4 px-6">Comisión Agente</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px]">
                          {report.code}
                        </span>
                        <span>{report.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(report.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <p className="text-slate-900 dark:text-slate-200 font-bold">{report.user?.name || 'N/A'}</p>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        {report.team && <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold">{report.team.name}</span>}
                        {report.seller_code && <span className="text-indigo-500 font-mono">Cod: {report.seller_code}</span>}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {report.passengers && report.passengers.length > 0 ? (
                        <div>
                          <p className="text-slate-900 dark:text-slate-200 font-bold">
                            {report.passengers[0].name} {report.passengers[0].last_name || ''}
                          </p>
                          {report.passengers.length > 1 && (
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold">
                              +{report.passengers.length - 1} pasajero(s) más
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal">Sin registro</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-black text-slate-900 dark:text-white">
                        ${(report.total_client || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        ${(report.commition_percent || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(report.status)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/travel-reports/${report.id}`}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
                          title="Ver Detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Botones de acción directa de estado para administradores / gerentes */}
                        {report.status !== 1 && (
                          <button
                            onClick={() => handleStatusChange(report.id, 1, 'auth')}
                            className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 transition-colors"
                            title="Autorizar Venta"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 transition-colors"
                          title="Eliminar Reporte"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelReportsPage;
