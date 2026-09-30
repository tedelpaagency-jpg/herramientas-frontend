'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import visaWholesaleService from '@/services/visaWholesaleService';
import { 
  Building2, Users, Search, RefreshCw, Eye, ArrowRight, 
  ShieldCheck, FileText, CheckCircle2, Clock, Phone, Mail, MapPin, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MayoristaAgenciesPage: React.FC = () => {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Agency Detail Context Modal
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);

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
      }
    } catch (err) {
      console.error('Error al cargar agencias:', err);
      toast.error('Error al cargar agencias');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAgencies();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Building2 className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Agencias Afiliadas</h1>
          </div>
          <p className="text-sm text-slate-500">
            Supervise el rendimiento de cada agencia de viajes y acceda a su contexto operativo migratorio.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar agencia por nombre, RUC o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Grid of Agencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
            Cargando agencias...
          </div>
        ) : agencies.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-30 text-indigo-500" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No se encontraron agencias</p>
          </div>
        ) : (
          agencies.map((agency) => (
            <div
              key={agency.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{agency.name}</h3>
                    <p className="text-xs text-slate-400">{agency.business_name || 'Agencia de Viajes'}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${agency.status == 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'}`}>
                    {agency.status == 1 ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  {agency.ruc && <div>RUC: <strong className="text-slate-700 dark:text-slate-300">{agency.ruc}</strong></div>}
                  {agency.email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{agency.email}</span>
                    </div>
                  )}
                  {agency.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{agency.phone}</span>
                    </div>
                  )}
                  {(agency.city || agency.country) && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{[agency.city, agency.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Estadísticas de Expedientes */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-4 gap-1 text-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl mb-3">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Total</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{agency.total_procesos || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-sky-500 font-semibold uppercase">Activos</p>
                    <p className="text-sm font-bold text-sky-600 dark:text-sky-400">{agency.procesos_activos || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-amber-500 font-semibold uppercase">Pend.</p>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{agency.procesos_pendientes || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-500 font-semibold uppercase">Listos</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{agency.procesos_completados || 0}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAgency(agency)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-xl transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Entrar al Contexto de la Agencia
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Vista Contextual de Agencia */}
      {selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedAgency.name}</h3>
                <p className="text-xs text-slate-500">Panel Operacional Asignado a la Mayorista</p>
              </div>
              <button
                onClick={() => setSelectedAgency(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

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
