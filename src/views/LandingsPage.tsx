'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { LandingTemplate, LandingEvent, LandingRequest } from '../types';
import landingService from '../services/landingService';
import { 
  Globe, Calendar, QrCode, ExternalLink, Users, Copy, 
  Check, Plus, Clock, FileText, CheckCircle2, ShieldCheck, X,
  Search, Eye, LayoutList, LayoutGrid, AlertTriangle, Power, PowerOff,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '@/components/Skeleton';

// Helper base64 function
function base64Encode(str: number | string): string {
  try {
    return btoa(String(str));
  } catch {
    return String(str);
  }
}

export const LandingsPage: React.FC = () => {
  const [landings, setLandings] = useState<LandingTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Detail Modal State
  const [selectedLanding, setSelectedLanding] = useState<LandingTemplate | null>(null);
  const [landingRequests, setLandingRequests] = useState<LandingRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'events' | 'requests'>('info');

  // New Event Form State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const fetchLandings = async () => {
    setIsLoading(true);
    try {
      const data = await landingService.getLandings();
      setLandings(data);
    } catch (err) {
      console.error('Error fetching landings:', err);
      toast.error('Error al cargar catálogo de Landing Pages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLandings();
  }, []);

  const getPublicUrl = (landing: LandingTemplate) => {
    if (landing.public_url) return landing.public_url;
    const enc = landing.encoded_id || base64Encode(landing.id);
    if (typeof window !== 'undefined') {
      const origin = window.location.origin.includes(':3000')
        ? window.location.origin.replace(':3000', ':8000')
        : window.location.origin;
      return `${origin}/landing?id=${enc}`;
    }
    return `/landing?id=${enc}`;
  };

  const handleCopyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Enlace copiado al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (landing: LandingTemplate) => {
    const currentStatus = landing.status ?? 1;
    const nextStatus = currentStatus === 1 ? 0 : 1;
    const actionName = nextStatus === 1 ? 'habilitar' : 'suspender';

    if (!confirm(`¿Está seguro que desea ${actionName} esta Landing Page?`)) return;

    setTogglingId(landing.id);
    try {
      const res = await landingService.toggleStatus(landing.id, nextStatus);
      const updatedStatus = res.status ?? nextStatus;

      setLandings((prev) =>
        prev.map((item) => (item.id === landing.id ? { ...item, status: updatedStatus } : item))
      );

      if (selectedLanding?.id === landing.id) {
        setSelectedLanding((prev) => (prev ? { ...prev, status: updatedStatus } : null));
      }

      toast.success(
        updatedStatus === 1
          ? 'Landing Page habilitada con éxito'
          : 'Landing Page suspendida. Se mostrará la pantalla de aviso a los visitantes.'
      );
    } catch (err: any) {
      console.error('Error toggling landing status:', err);
      const serverMsg = err.response?.data?.message || err.message;
      toast.error(serverMsg || 'Ocurrió un error al cambiar el estado de la landing.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenDetail = async (landing: LandingTemplate) => {
    setSelectedLanding(landing);
    setActiveTab('info');
    try {
      const detail = await landingService.getLandingDetail(landing.id);
      if (detail && detail.template) {
        setSelectedLanding({
          ...landing,
          ...detail.template,
          public_url: detail.public_url || detail.template.public_url || landing.public_url,
          encoded_id: detail.encoded_id || detail.template.encoded_id || landing.encoded_id,
        });
      }
      setLandingRequests(detail.requests || []);
    } catch (err) {
      console.error('Error getting landing detail:', err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLanding || !eventName || !dateStart || !dateEnd) return;

    try {
      const newEv = await landingService.createEvent({
        landing_id: selectedLanding.id,
        name: eventName,
        date_start: dateStart,
        date_end: dateEnd,
      });

      setSelectedLanding((prev) =>
        prev
          ? {
              ...prev,
              events: [newEv, ...(prev.events || [])],
            }
          : null
      );

      setEventName('');
      setDateStart('');
      setDateEnd('');
      setIsEventModalOpen(false);
      toast.success('Evento programado con éxito');
      fetchLandings();
    } catch (err) {
      console.error('Error creating landing event:', err);
      toast.error('No se pudo guardar el evento');
    }
  };

  const filteredLandings = useMemo(() => {
    if (!search.trim()) return landings;
    const term = search.toLowerCase();
    return landings.filter(
      (l) =>
        l.name?.toLowerCase().includes(term) ||
        l.plantilla?.toLowerCase().includes(term) ||
        l.agency_name?.toLowerCase().includes(term)
    );
  }, [landings, search]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <Globe className="w-5 h-5" />
            </div>
            Catálogo de Landing Pages & Eventos
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Visualización, estado y gestión de páginas de captación renderizadas desde Laravel.
          </p>
        </div>
      </div>

      {/* Controls Bar: Search & View Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre de landing, plantilla o agencia..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-600"
          />
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold gap-1">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span>Vista Tabla</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Vista Tarjetas</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : filteredLandings.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Globe className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No hay Landing Pages registradas</h3>
          <p className="text-xs text-slate-400">No se encontraron plantillas asociadas a tu búsqueda o cuenta.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW FORMAT */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">ID / Encoded</th>
                  <th className="p-4">Landing Page & Plantilla</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Agencia</th>
                  <th className="p-4 text-center">Prospectos</th>
                  <th className="p-4">Evento / Promoción Activa</th>
                  <th className="p-4">Enlace Público de Laravel</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {filteredLandings.map((landing) => {
                  const publicUrl = getPublicUrl(landing);
                  const activeEvent = landing.events?.find((e) => e.status === 1);
                  const isSuspended = landing.status === 0;

                  return (
                    <tr key={landing.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors ${isSuspended ? 'bg-slate-50/50' : ''}`}>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs font-black text-slate-900 dark:text-slate-100">#{landing.id}</span>
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-teal-50 text-teal-700 border border-teal-200/80 w-max">
                            {landing.encoded_id || base64Encode(landing.id)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Globe className={`w-4 h-4 shrink-0 ${isSuspended ? 'text-amber-500' : 'text-teal-600'}`} />
                            <span className={isSuspended ? 'line-through text-slate-500' : ''}>{landing.name}</span>
                          </div>
                          <p className="text-[11px] font-mono text-slate-400 pl-5.5">{landing.plantilla}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            Suspendida
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Habilitada
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-700">{landing.agency_name || 'Agencia Principal'}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-black border border-teal-200">
                          <Users className="w-3.5 h-3.5" />
                          {landing.requests_count || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        {activeEvent ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 text-xs block">{activeEvent.name}</span>
                            <span className="text-[10px] text-teal-600 font-mono">Hasta: {activeEvent.date_end}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Sin evento programado</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200 max-w-xs">
                          <input
                            type="text"
                            readOnly
                            value={publicUrl}
                            className="flex-1 bg-transparent font-mono text-[10px] text-slate-600 outline-none px-1 truncate"
                          />
                          <button
                            onClick={() => handleCopyUrl(publicUrl, landing.id)}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-teal-600 transition-colors"
                            title="Copiar Enlace"
                          >
                            {copiedId === landing.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Status Button */}
                          <button
                            onClick={() => handleToggleStatus(landing)}
                            disabled={togglingId === landing.id}
                            className={`px-3 py-1.5 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                              isSuspended
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            }`}
                            title={isSuspended ? 'Habilitar Landing' : 'Suspender Landing'}
                          >
                            {togglingId === landing.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : isSuspended ? (
                              <Power className="w-3.5 h-3.5" />
                            ) : (
                              <PowerOff className="w-3.5 h-3.5" />
                            )}
                            <span>{isSuspended ? 'Habilitar' : 'Suspender'}</span>
                          </button>

                          <button
                            onClick={() => handleOpenDetail(landing)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detalles</span>
                          </button>
                          <a
                            href={publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition-all inline-flex items-center gap-1 shadow-2xs"
                          >
                            <span>Ver</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW FORMAT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLandings.map((landing) => {
            const publicUrl = getPublicUrl(landing);
            const activeEvent = landing.events?.find((e) => e.status === 1);
            const isSuspended = landing.status === 0;

            return (
              <div
                key={landing.id}
                className={`bg-white rounded-2xl border transition-all shadow-2xs hover:shadow-md flex flex-col overflow-hidden group ${
                  isSuspended ? 'border-amber-300/80 bg-slate-50/40' : 'border-slate-200/90 hover:border-teal-500'
                }`}
              >
                {/* Card Header */}
                <div className={`p-5 text-white flex justify-between items-start ${isSuspended ? 'bg-slate-800' : 'bg-slate-900'}`}>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        ID: {landing.id} ({landing.encoded_id || base64Encode(landing.id)})
                      </span>
                      {isSuspended && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> Suspendida
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-black mt-2 text-white line-clamp-1 ${isSuspended ? 'line-through opacity-80' : ''}`}>
                      {landing.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{landing.plantilla}</p>
                  </div>
                  <div className="p-2 bg-slate-800 rounded-xl text-teal-400">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 space-y-4 text-xs">
                  <div className="flex justify-between items-center pt-1 border-b border-slate-100 pb-3">
                    <span className="text-slate-500 font-medium">Agencia:</span>
                    <span className="font-extrabold text-slate-800">{landing.agency_name || 'Agencia Principal'}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-slate-500 font-medium">Prospectos Capturados:</span>
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-black border border-teal-100 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {landing.requests_count || 0}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Evento / Promoción Activa</span>
                    {activeEvent ? (
                      <div className="flex items-center justify-between text-slate-800 font-bold">
                        <span>{activeEvent.name}</span>
                        <span className="text-[10px] text-teal-600 font-mono">Hasta: {activeEvent.date_end}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Sin evento programado</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Enlace Público de Laravel</label>
                    <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        readOnly
                        value={publicUrl}
                        className="flex-1 bg-transparent font-mono text-[10px] text-slate-600 outline-none px-1"
                      />
                      <button
                        onClick={() => handleCopyUrl(publicUrl, landing.id)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-teal-600 transition-colors"
                        title="Copiar Enlace"
                      >
                        {copiedId === landing.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStatus(landing)}
                    disabled={togglingId === landing.id}
                    className={`px-3 py-2 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                      isSuspended
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    {togglingId === landing.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isSuspended ? (
                      <Power className="w-3.5 h-3.5" />
                    ) : (
                      <PowerOff className="w-3.5 h-3.5" />
                    )}
                    <span>{isSuspended ? 'Habilitar' : 'Suspender'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenDetail(landing)}
                    className="flex-1 py-2 bg-white text-slate-800 font-extrabold text-xs rounded-xl border border-slate-200 hover:bg-slate-100 text-center transition-all"
                  >
                    Detalles
                  </button>

                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 flex items-center gap-1 shadow-2xs"
                  >
                    Ver <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Landing Detail & Events Modal */}
      {selectedLanding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-3xl h-[80vh] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Landing ID #{selectedLanding.id}
                  </span>
                  {selectedLanding.status === 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" /> Suspendida
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Habilitada
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black mt-1 text-white">{selectedLanding.name}</h3>
                <p className="text-xs text-slate-400 font-mono">Plantilla: {selectedLanding.plantilla}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(selectedLanding)}
                  disabled={togglingId === selectedLanding.id}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
                    selectedLanding.status === 0
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  {togglingId === selectedLanding.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : selectedLanding.status === 0 ? (
                    <Power className="w-3.5 h-3.5" />
                  ) : (
                    <PowerOff className="w-3.5 h-3.5" />
                  )}
                  <span>{selectedLanding.status === 0 ? 'Habilitar Landing' : 'Suspender Landing'}</span>
                </button>
                <button
                  onClick={() => setSelectedLanding(null)}
                  className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-b-2 ${
                  activeTab === 'info'
                    ? 'bg-white text-teal-600 border-teal-600 shadow-2xs'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                Enlace & QR
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'events'
                    ? 'bg-white text-teal-600 border-teal-600 shadow-2xs'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Eventos ({selectedLanding.events?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'requests'
                    ? 'bg-white text-teal-600 border-teal-600 shadow-2xs'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Leads Capturados ({landingRequests.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white">
              {/* TAB: Info & QR */}
              {activeTab === 'info' && (
                <div className="space-y-6 text-xs">
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
                    <span className="font-extrabold text-teal-900 block text-sm">Enlace Directo en Laravel:</span>
                    <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-teal-200">
                      <input
                        type="text"
                        readOnly
                        value={getPublicUrl(selectedLanding)}
                        className="flex-1 bg-transparent font-mono text-xs text-slate-800 outline-none"
                      />
                      <button
                        onClick={() => handleCopyUrl(getPublicUrl(selectedLanding), selectedLanding.id)}
                        className="px-3.5 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 flex items-center gap-1 shadow-xs"
                      >
                        {copiedId === selectedLanding.id ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                        <span>Copiar</span>
                      </button>
                      <a
                        href={getPublicUrl(selectedLanding)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 flex items-center gap-1 shadow-xs"
                      >
                        <span>Abrir</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-extrabold text-slate-800">Código QR Generado</h4>
                    <p className="text-slate-500">Este QR redirige directamente a la Landing Page desplegada en Laravel.</p>
                    <div className="w-36 h-36 bg-white p-3 rounded-2xl border border-slate-300 flex items-center justify-center shadow-xs">
                      <QrCode className="w-28 h-28 text-slate-800" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Events */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Historial de Eventos</h4>
                    <button
                      onClick={() => setIsEventModalOpen(true)}
                      className="px-3 py-1.5 bg-teal-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-teal-700"
                    >
                      <Plus className="w-3.5 h-3.5" /> Programar Evento
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(selectedLanding.events || []).length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400 font-medium">No se han registrado eventos para esta landing</p>
                    ) : (
                      selectedLanding.events?.map((ev) => (
                        <div key={ev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">{ev.name}</span>
                            <span className="text-slate-500 font-mono text-[11px]">
                              Desde: {ev.date_start} — Hasta: {ev.date_end}
                            </span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                            ev.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {ev.status === 1 ? 'Activo' : 'Finalizado'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB: Requests / Leads */}
              {activeTab === 'requests' && (
                <div className="space-y-4">
                  {landingRequests.length === 0 ? (
                    <p className="text-center py-8 text-xs text-slate-400 font-medium">Aún no se han capturado prospectos desde esta landing</p>
                  ) : (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Correo</th>
                            <th className="p-3">Teléfono</th>
                            <th className="p-3">Motivo / Mensaje</th>
                            <th className="p-3">Fecha</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                          {landingRequests.map((req) => (
                            <tr key={req.id}>
                              <td className="p-3 font-bold">{req.name} {req.last_name || ''}</td>
                              <td className="p-3 font-mono text-slate-600">{req.email}</td>
                              <td className="p-3">{req.phone || 'N/A'}</td>
                              <td className="p-3 text-slate-600 max-w-xs truncate">{req.motivo || 'General'}</td>
                              <td className="p-3 text-slate-400 text-[11px]">{req.created_at ? new Date(req.created_at).toLocaleDateString() : ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Programar Evento / Promoción</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Evento</label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Ej: Oferta de Verano 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-teal-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    required
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md hover:bg-teal-700"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingsPage;
