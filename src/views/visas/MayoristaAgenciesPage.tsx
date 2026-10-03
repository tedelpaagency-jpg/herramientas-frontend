'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import visaWholesaleService from '@/services/visaWholesaleService';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, Users, Search, RefreshCw, Eye, ArrowRight, 
  ShieldCheck, FileText, CheckCircle2, Clock, Phone, Mail, MapPin, ExternalLink,
  UserCheck, AlertCircle, ChevronLeft, ChevronRight, Check, UserPlus, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MayoristaAgenciesPage: React.FC = () => {
  const { user } = useAuth();
  const [agencies, setAgencies] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [operatorFilter, setOperatorFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingAgencyId, setUpdatingAgencyId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAgenciesCount, setTotalAgenciesCount] = useState(0);

  // Agency Detail Context Modal
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);

  const isWhiteLabelAdmin = user?.role === 'super_admin' || 
    user?.role === 'white_label_admin' || 
    user?.roles?.some((r: any) => ['super_admin', 'white_label_admin'].includes(r.name));

  const fetchAgencies = async () => {
    setIsLoading(true);
    try {
      const res = await visaWholesaleService.getMayoristaAgencies({
        page,
        search: search || undefined,
      });
      if (res?.data) {
        setAgencies(res.data || []);
        setTotalPages(res.last_page || 1);
        setTotalAgenciesCount(res.total || res.data.length || 0);
      }
    } catch (err) {
      console.error('Error al cargar agencias:', err);
      toast.error('Error al cargar agencias');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOperators = async () => {
    try {
      const list = await visaWholesaleService.getMayoristaOperators();
      setOperators(list || []);
    } catch (err) {
      console.error('Error al cargar operadores:', err);
    }
  };

  useEffect(() => {
    fetchAgencies();
    fetchOperators();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAgencies();
  };

  const handleAssignOperator = async (agencyId: number, operatorId: number | null) => {
    setUpdatingAgencyId(agencyId);
    try {
      const res = await visaWholesaleService.assignAgencyOperator(agencyId, operatorId);
      toast.success(res?.message || 'Operador asignado correctamente');
      
      const matchedOp = operators.find((op) => op.id === operatorId) || null;
      setAgencies((prev) =>
        prev.map((a) => {
          if (a.id === agencyId) {
            return {
              ...a,
              assigned_operator_id: operatorId,
              assigned_operator: matchedOp,
              assignedOperator: matchedOp,
            };
          }
          return a;
        })
      );

      if (selectedAgency && selectedAgency.id === agencyId) {
        setSelectedAgency((prev: any) => ({
          ...prev,
          assigned_operator_id: operatorId,
          assigned_operator: matchedOp,
          assignedOperator: matchedOp,
        }));
      }
    } catch (err: any) {
      console.error('Error al asignar operador:', err);
      toast.error(err.response?.data?.message || 'Error al asignar operador');
    } finally {
      setUpdatingAgencyId(null);
    }
  };

  // Filter local agencies if operatorFilter is applied
  const filteredAgencies = agencies.filter((agency) => {
    const hasOp = !!(agency.assigned_operator_id || agency.assigned_operator || agency.assignedOperator);
    if (operatorFilter === 'assigned') return hasOp;
    if (operatorFilter === 'unassigned') return !hasOp;
    return true;
  });

  // Calculate high level metrics
  const assignedCount = agencies.filter((a) => !!(a.assigned_operator_id || a.assigned_operator || a.assignedOperator)).length;
  const unassignedCount = agencies.length - assignedCount;
  const totalProcesosSum = agencies.reduce((acc, a) => acc + (Number(a.total_procesos) || 0), 0);
  const activosProcesosSum = agencies.reduce((acc, a) => acc + (Number(a.procesos_activos) || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Agencias Afiliadas</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gestión centralizada de agencias de viajes, asignación de operadores mayoristas y supervisión de expedientes.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action / Reload */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchAgencies();
              fetchOperators();
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all"
            title="Recargar datos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-500' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Agencias</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalAgenciesCount || agencies.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Con Operador Asignado</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{assignedCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sin Operador Asignado</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{unassignedCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expedientes Activos</p>
            <p className="text-xl font-bold text-sky-600 dark:text-sky-400">{activosProcesosSum}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por agencia, RUC, email o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shrink-0"
          >
            Buscar
          </button>
        </form>

        {/* Status / Operator Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>
          <select
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todas las agencias ({agencies.length})</option>
            <option value="assigned">Con Operador ({assignedCount})</option>
            <option value="unassigned">Sin Operador Asignado ({unassignedCount})</option>
          </select>
        </div>
      </div>

      {/* TABLE VIEW OF AGENCIES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Agencia Afiliada</th>
                <th className="py-3.5 px-4">Contacto & Ubicación</th>
                <th className="py-3.5 px-4 min-w-[220px]">Operador Mayorista Asignado</th>
                <th className="py-3.5 px-4 text-center">Expedientes Migratorios</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Cargando listado de agencias...
                  </td>
                </tr>
              ) : filteredAgencies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-500" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No se encontraron agencias</p>
                    <p className="text-[11px] text-slate-400 mt-1">Pruebe ajustando los filtros de búsqueda o el estado de asignación.</p>
                  </td>
                </tr>
              ) : (
                filteredAgencies.map((agency) => {
                  const currentOperator = agency.assigned_operator || agency.assignedOperator || 
                    operators.find(op => op.id === agency.assigned_operator_id);
                  const isUpdating = updatingAgencyId === agency.id;

                  return (
                    <tr
                      key={agency.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Agencia Info */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                            {agency.name ? agency.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                {agency.name}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  agency.status == 1
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                }`}
                              >
                                {agency.status == 1 ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>
                            <div className="text-slate-400 text-[11px] mt-0.5">
                              {agency.business_name || 'Agencia de Viajes'}
                              {agency.ruc && <span className="ml-2 font-mono text-slate-500">RUC: {agency.ruc}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contacto & Ubicación */}
                      <td className="py-4 px-4 align-middle text-slate-600 dark:text-slate-300">
                        <div className="space-y-1">
                          {agency.email ? (
                            <div className="flex items-center gap-1.5 truncate max-w-[200px]" title={agency.email}>
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{agency.email}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Sin correo</span>
                          )}

                          {agency.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{agency.phone}</span>
                            </div>
                          )}

                          {(agency.city || agency.country) && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{[agency.city, agency.country].filter(Boolean).join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Operador Mayorista Asignado */}
                      <td className="py-4 px-4 align-middle">
                        {isWhiteLabelAdmin ? (
                          <div className="space-y-1.5">
                            <div className="relative">
                              <select
                                value={agency.assigned_operator_id || ''}
                                onChange={(e) => {
                                  const val = e.target.value ? Number(e.target.value) : null;
                                  handleAssignOperator(agency.id, val);
                                }}
                                disabled={isUpdating}
                                className={`w-full py-1.5 pl-2.5 pr-8 text-xs font-semibold rounded-xl border transition-all ${
                                  currentOperator
                                    ? 'bg-sky-50/60 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                                    : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                                } focus:ring-2 focus:ring-indigo-500 disabled:opacity-50`}
                              >
                                <option value="">-- Sin Operador Asignado --</option>
                                {operators.map((op) => (
                                  <option key={op.id} value={op.id}>
                                    {op.name} ({op.role === 'white_label_admin' ? 'Admin' : op.role === 'mayorista_supervisor' ? 'Supervisor' : 'Operador'})
                                  </option>
                                ))}
                              </select>
                              {isUpdating && (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-600" />
                              )}
                            </div>

                            {currentOperator && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                <span>{currentOperator.email}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {currentOperator ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-lg text-sky-800 dark:text-sky-200 font-semibold text-xs">
                                <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                <span>{currentOperator.name}</span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-medium border border-amber-200 dark:border-amber-800">
                                <AlertCircle className="w-3 h-3" /> Sin asignar
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Métricas de Expedientes */}
                      <td className="py-4 px-4 align-middle text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                          <span
                            className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg font-bold text-slate-800 dark:text-slate-200 text-xs shadow-xs"
                            title="Total Expedientes"
                          >
                            {agency.total_procesos || 0} Total
                          </span>
                          <span
                            className="px-2 py-1 bg-sky-100 dark:bg-sky-950/80 rounded-lg font-bold text-sky-700 dark:text-sky-300 text-xs"
                            title="Expedientes Activos"
                          >
                            {agency.procesos_activos || 0} Activos
                          </span>
                          <span
                            className="px-2 py-1 bg-amber-100 dark:bg-amber-950/80 rounded-lg font-bold text-amber-700 dark:text-amber-300 text-xs"
                            title="Expedientes Pendientes"
                          >
                            {agency.procesos_pendientes || 0} Pend.
                          </span>
                          <span
                            className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/80 rounded-lg font-bold text-emerald-700 dark:text-emerald-300 text-xs"
                            title="Expedientes Completados"
                          >
                            {agency.procesos_completados || 0} Listos
                          </span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/visas/mayorista?agency_id=${agency.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-xl transition-all"
                            title="Ver expedientes de esta agencia"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Expedientes</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => setSelectedAgency(agency)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all"
                            title="Ver contexto operativo de la agencia"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Contexto</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Página <strong className="text-slate-700 dark:text-slate-200">{page}</strong> de{' '}
              <strong className="text-slate-700 dark:text-slate-200">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                Siguiente <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Vista Contextual de Agencia */}
      {selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                  {selectedAgency.name ? selectedAgency.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedAgency.name}</h3>
                  <p className="text-xs text-slate-500">{selectedAgency.business_name || 'Agencia de Viajes Afiliada'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgency(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Operator Assignment inside Modal */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-sky-600" />
                Operador Mayorista Asignado para esta Agencia
              </span>
              {isWhiteLabelAdmin ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <select
                    value={selectedAgency.assigned_operator_id || ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : null;
                      handleAssignOperator(selectedAgency.id, val);
                    }}
                    disabled={updatingAgencyId === selectedAgency.id}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Sin Operador Asignado --</option>
                    {operators.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.name} ({op.email})
                      </option>
                    ))}
                  </select>
                  {updatingAgencyId === selectedAgency.id && (
                    <span className="text-xs text-indigo-500 flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Guardando...
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedAgency.assigned_operator?.name || selectedAgency.assignedOperator?.name || 'Sin operador asignado'}
                </p>
              )}
            </div>

            {/* Estadísticas de Expedientes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-xs text-slate-500 block">Total Procesos</span>
                <strong className="text-lg text-slate-800 dark:text-slate-100">{selectedAgency.total_procesos || 0}</strong>
              </div>
              <div className="p-3 bg-sky-50 dark:bg-sky-950/50 rounded-xl">
                <span className="text-xs text-sky-600 dark:text-sky-400 block">En Proceso</span>
                <strong className="text-lg text-sky-600 dark:text-sky-400">{selectedAgency.procesos_activos || 0}</strong>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl">
                <span className="text-xs text-amber-600 dark:text-amber-400 block">Pendientes</span>
                <strong className="text-lg text-amber-600 dark:text-amber-400">{selectedAgency.procesos_pendientes || 0}</strong>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 block">Completados</span>
                <strong className="text-lg text-emerald-600 dark:text-emerald-400">{selectedAgency.procesos_completados || 0}</strong>
              </div>
            </div>

            {/* Navegación Contextual */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Navegación Contextual</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link
                  href={`/visas/mayorista?agency_id=${selectedAgency.id}`}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 flex items-center justify-between group transition-all"
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600">
                    Expedientes de esta Agencia
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </Link>

                <Link
                  href={`/visas/grupos?agency_id=${selectedAgency.id}`}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 flex items-center justify-between group transition-all"
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600">
                    Grupos y Familias
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </Link>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedAgency(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
