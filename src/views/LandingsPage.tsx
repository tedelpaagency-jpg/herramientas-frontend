'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { LandingTemplate, LandingEvent, LandingRequest } from '../types';
import landingService from '../services/landingService';
import LandingBuilderModal from '../components/landings/LandingBuilderModal';
import { 
  Globe, Calendar, QrCode, ExternalLink, Users, Copy, 
  Check, Plus, Clock, FileText, CheckCircle2, ShieldCheck, X,
  Search, Eye, LayoutList, LayoutGrid, AlertTriangle, Power, PowerOff,
  Loader2, Edit3, Trash2, Code, Layout, Shield
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

  // Builder Modal State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingLanding, setEditingLanding] = useState<LandingTemplate | null>(null);

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
    const enc = landing.encoded_id || base64Encode(landing.id);
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/landing?id=${enc}`;
    }
    return `/landing?id=${enc}`;
  };

  const handleCopyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Enlace copiado al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenBuilder = (landing?: LandingTemplate) => {
    setEditingLanding(landing || null);
    setIsBuilderOpen(true);
  };

  const handleDeleteLanding = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta Landing Page? Esta acción no se puede deshacer.')) return;
    try {
      await landingService.deleteLanding(id);
      toast.success('Landing Page eliminada con éxito');
      fetchLandings();
    } catch (err) {
      console.error('Error deleting landing:', err);
      toast.error('No se pudo eliminar la Landing Page');
    }
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
        l.agency_name?.toLowerCase().includes(term) ||
        (l as any).white_label?.name?.toLowerCase().includes(term)
    );
  }, [landings, search]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <Globe className="w-5 h-5" />
            </div>
            Catálogo de Landing Pages & Web Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Gestión multitenant, constructor visual, HTML personalizado y formularios dinámicos.
          </p>
        </div>

        <button
          onClick={() => handleOpenBuilder()}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Landing Page (Builder)</span>
        </button>
      </div>

      {/* Controls Bar: Search & View Toggle */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, plantilla, marca blanca o agencia..."
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
          <p className="text-xs text-slate-400">Crea una nueva landing usando el Web Builder.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW FORMAT */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Landing Page & Modo</th>
                  <th className="p-4">Marca Blanca / Agencia</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Prospectos</th>
                  <th className="p-4">Enlace Público</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {filteredLandings.map((landing) => {
                  const publicUrl = getPublicUrl(landing);
                  const isSuspended = landing.status === 0;
                  const isCustomHtml = landing.mode === 'custom_html';
                  const whiteLabelName = (landing as any).white_label?.name;

                  return (
                    <tr key={landing.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors ${isSuspended ? 'bg-slate-50/50' : ''}`}>
                      <td className="p-4 font-mono font-black text-xs">
                        #{landing.id}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Globe className={`w-4 h-4 shrink-0 ${isSuspended ? 'text-amber-500' : 'text-teal-600'}`} />
                            <span className={isSuspended ? 'line-through text-slate-500' : ''}>{landing.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCustomHtml ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <Code className="w-3 h-3 text-amber-500" /> HTML Personalizado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                <Layout className="w-3 h-3 text-indigo-500" /> Builder Visual
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {whiteLabelName && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 block w-max">
                              <Shield className="w-3 h-3 text-purple-500" /> {whiteLabelName}
                            </span>
                          )}
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {landing.agency_name || 'Global'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-500" /> Suspendida
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Habilitada
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-black border border-teal-200">
                          <Users className="w-3.5 h-3.5" />
                          {landing.requests_count || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 max-w-xs">
                          <input
                            type="text"
                            readOnly
                            value={publicUrl}
                            className="flex-1 bg-transparent font-mono text-[10px] text-slate-600 dark:text-slate-300 outline-none px-1 truncate"
                          />
                          <button
                            onClick={() => handleCopyUrl(publicUrl, landing.id)}
                            className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-teal-600 transition-colors"
                            title="Copiar Enlace"
                          >
                            {copiedId === landing.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenBuilder(landing)}
                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1"
                            title="Editar en Web Builder"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Builder</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(landing)}
                            disabled={togglingId === landing.id}
                            className={`px-2.5 py-1.5 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1 ${
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
                          </button>

                          <button
                            onClick={() => handleOpenDetail(landing)}
                            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl transition-all"
                            title="Detalles"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteLanding(landing.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar Landing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition-all inline-flex items-center gap-1 shadow-2xs"
                          >
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
            const isSuspended = landing.status === 0;
            const isCustomHtml = landing.mode === 'custom_html';

            return (
              <div
                key={landing.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all shadow-2xs hover:shadow-md flex flex-col overflow-hidden group ${
                  isSuspended ? 'border-amber-300/80 bg-slate-50/40' : 'border-slate-200/90 dark:border-slate-800 hover:border-teal-500'
                }`}
              >
                {/* Card Header */}
                <div className={`p-5 text-white flex justify-between items-start ${isSuspended ? 'bg-slate-800' : 'bg-slate-900'}`}>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        ID: {landing.id}
                      </span>
                      {isCustomHtml ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          HTML
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          Builder
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-black mt-2 text-white line-clamp-1 ${isSuspended ? 'line-through opacity-80' : ''}`}>
                      {landing.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleOpenBuilder(landing)}
                    className="p-2 bg-indigo-600/80 hover:bg-indigo-600 rounded-xl text-white transition"
                    title="Editar en Builder"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 space-y-4 text-xs">
                  <div className="flex justify-between items-center pt-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-500 font-medium">Agencia / Tenant:</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{landing.agency_name || 'Global'}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-500 font-medium">Prospectos Capturados:</span>
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-black border border-teal-100 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {landing.requests_count || 0}
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenBuilder(landing)}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl text-center transition-all flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Builder
                  </button>

                  <button
                    onClick={() => handleOpenDetail(landing)}
                    className="px-3 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  >
                    Detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Web Builder Modal */}
      <LandingBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        landing={editingLanding}
        onSaved={fetchLandings}
      />

      {/* Landing Detail & Events Modal */}
      {selectedLanding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl h-[80vh] shadow-2xl flex flex-col overflow-hidden">
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
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedLanding(null)}
                  className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 gap-2 pt-2">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-b-2 ${
                  activeTab === 'info'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 border-teal-600 shadow-2xs'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                Enlace & QR
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'events'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 border-teal-600 shadow-2xs'
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
                    ? 'bg-white dark:bg-slate-900 text-teal-600 border-teal-600 shadow-2xs'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Leads Capturados ({landingRequests.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
              {/* TAB: Info & QR */}
              {activeTab === 'info' && (
                <div className="space-y-6 text-xs">
                  <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl space-y-2">
                    <span className="font-extrabold text-teal-900 dark:text-teal-200 block text-sm">Enlace Directo en Laravel:</span>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-teal-200 dark:border-teal-800">
                      <input
                        type="text"
                        readOnly
                        value={getPublicUrl(selectedLanding)}
                        className="flex-1 bg-transparent font-mono text-xs text-slate-800 dark:text-slate-200 outline-none"
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

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200">Código QR Generado</h4>
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
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">Historial de Eventos</h4>
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
                        <div key={ev.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block text-sm">{ev.name}</span>
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
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Correo</th>
                            <th className="p-3">Teléfono</th>
                            <th className="p-3">Motivo / Mensaje</th>
                            <th className="p-3">Fecha</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                          {landingRequests.map((req) => (
                            <tr key={req.id}>
                              <td className="p-3 font-bold">{req.name} {req.last_name || ''}</td>
                              <td className="p-3 font-mono text-slate-600 dark:text-slate-300">{req.email}</td>
                              <td className="p-3">{req.phone || 'N/A'}</td>
                              <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{req.motivo || 'General'}</td>
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Programar Evento / Promoción</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Evento</label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Ej: Oferta de Verano 2026"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:bg-white focus:border-teal-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    required
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
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
