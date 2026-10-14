'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Film, Image as ImageIcon, Layers, Plus, 
  Sparkles, TrendingUp, Download, CheckCircle2, Clock, 
  RefreshCw, Copy, Trash2, Edit3, Eye, ArrowUpRight,
  Shield, Check, X, AlertCircle, Building2, User
} from 'lucide-react';
import { 
  MarketingTemplate, 
  MarketingMediaResource, 
  MarketingB2BMetrics, 
  MarketingGeneration 
} from '../../types/marketingB2B';
import marketingB2BService from '../../services/marketingB2BService';
import { MasterMediaLibrary } from './MasterMediaLibrary';
import { TemplateVisualEditor } from './TemplateVisualEditor';
import toast from 'react-hot-toast';

export const WhiteLabelDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'templates' | 'library' | 'generations'>('metrics');
  const [metrics, setMetrics] = useState<MarketingB2BMetrics | null>(null);
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [generations, setGenerations] = useState<MarketingGeneration[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLoadingGenerations, setIsLoadingGenerations] = useState(false);

  // Editor states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MarketingTemplate | null>(null);
  const [selectedResourceForNewTemplate, setSelectedResourceForNewTemplate] = useState<MarketingMediaResource | null>(null);

  // Load metrics
  const fetchMetrics = async () => {
    setIsLoadingMetrics(true);
    try {
      const data = await marketingB2BService.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching marketing metrics:', err);
      toast.error('Error al cargar métricas de marketing');
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  // Load templates
  const fetchTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const res = await marketingB2BService.getTemplates({ per_page: 50 });
      setTemplates(res.data);
    } catch (err) {
      console.error('Error fetching marketing templates:', err);
      toast.error('Error al cargar plantillas');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  // Load generations
  const fetchGenerations = async () => {
    setIsLoadingGenerations(true);
    try {
      const res = await marketingB2BService.getGenerationHistory({ per_page: 50 });
      setGenerations(res.data);
    } catch (err) {
      console.error('Error fetching generations:', err);
      toast.error('Error al cargar historial de generaciones');
    } finally {
      setIsLoadingGenerations(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'metrics') fetchMetrics();
    if (activeTab === 'templates') fetchTemplates();
    if (activeTab === 'generations') fetchGenerations();
  }, [activeTab]);

  const handleDuplicateTemplate = async (templateId: number) => {
    try {
      await marketingB2BService.duplicateTemplate(templateId);
      toast.success('Plantilla duplicada con éxito');
      fetchTemplates();
    } catch (err) {
      console.error('Error duplicating template:', err);
      toast.error('Error al duplicar plantilla');
    }
  };

  const handleTogglePublish = async (templateId: number) => {
    try {
      const updated = await marketingB2BService.togglePublishTemplate(templateId);
      toast.success(updated.is_published ? 'Plantilla publicada en el catálogo' : 'Plantilla archivada');
      fetchTemplates();
    } catch (err) {
      console.error('Error toggling template publish:', err);
      toast.error('Error al cambiar estado de publicación');
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) return;
    try {
      await marketingB2BService.deleteTemplate(templateId);
      toast.success('Plantilla eliminada correctamente');
      fetchTemplates();
    } catch (err) {
      console.error('Error deleting template:', err);
      toast.error('Error al eliminar plantilla');
    }
  };

  const handleCreateFromResource = (res: MarketingMediaResource) => {
    setSelectedResourceForNewTemplate(res);
    setEditingTemplate(null);
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Visual Editor Modal */}
      {isEditorOpen && (
        <TemplateVisualEditor
          template={editingTemplate}
          initialResource={selectedResourceForNewTemplate}
          onSaved={() => {
            setIsEditorOpen(false);
            setEditingTemplate(null);
            setSelectedResourceForNewTemplate(null);
            fetchTemplates();
            if (activeTab === 'metrics') fetchMetrics();
          }}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingTemplate(null);
            setSelectedResourceForNewTemplate(null);
          }}
        />
      )}

      {/* Top Banner with Navigation Tabs */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl border border-slate-800 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" /> Administración Marca Blanca
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Módulo de Marketing B2B Automatizado
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl">
            Gestiona recursos maestros 1080p, diseña plantillas comerciales con zonas seguras y monitorea el volumen publicitario de tus agencias.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => {
              setEditingTemplate(null);
              setSelectedResourceForNewTemplate(null);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Crear Nueva Plantilla
          </button>
        </div>

        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl max-w-2xl">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${activeTab === 'metrics' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Métricas & KPIs
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${activeTab === 'templates' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          <Layers className="w-3.5 h-3.5" /> Mis Plantillas ({templates.length})
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${activeTab === 'library' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          <Film className="w-3.5 h-3.5" /> Medios Maestros
        </button>
        <button
          onClick={() => setActiveTab('generations')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${activeTab === 'generations' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          <Clock className="w-3.5 h-3.5" /> Historial Agencias
        </button>
      </div>

      {/* TAB 1: METRICS & KPIS */}
      {activeTab === 'metrics' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Generaciones Totales</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-white">
                {metrics?.total_generations ?? 0}
              </div>
              <p className="text-[11px] text-slate-400">
                {metrics?.completed_generations ?? 0} completadas con éxito
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Tasa de Efectividad</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-400">
                {metrics?.success_rate_percent ?? 100}%
              </div>
              <p className="text-[11px] text-slate-400">
                {metrics?.failed_generations ?? 0} fallos en cola
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Descargas Realizadas</span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Download className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-white">
                {metrics?.total_downloads ?? 0}
              </div>
              <p className="text-[11px] text-slate-400">Creativos en manos de agencias</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Ganancia Proyectada Agencias</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-400">
                +${(metrics?.total_projected_profit ?? 0).toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400">Valor comercial generado</p>
            </div>
          </div>

          {/* Top Rankings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Agencies */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" /> Agencias Más Activas
                </h3>
                <span className="text-[11px] text-slate-400">Por número de creativos</span>
              </div>

              <div className="space-y-3">
                {metrics?.top_agencies && metrics.top_agencies.length > 0 ? (
                  metrics.top_agencies.map((agencyItem, idx) => (
                    <div
                      key={agencyItem.agency_id || idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-400 text-xs font-black flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            {agencyItem.agency?.name || `Agencia #${agencyItem.agency_id}`}
                          </h4>
                          <span className="text-[10px] text-slate-400">Agencia Registrada</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-black text-purple-300">
                        {agencyItem.count} creativos
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-6">
                    Aún no hay generaciones registradas por agencias.
                  </p>
                )}
              </div>
            </div>

            {/* Top Templates */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Plantillas Más Populares
                </h3>
                <span className="text-[11px] text-slate-400">Por volumen de pauta</span>
              </div>

              <div className="space-y-3">
                {metrics?.top_templates && metrics.top_templates.length > 0 ? (
                  metrics.top_templates.map((tplItem, idx) => (
                    <div
                      key={tplItem.template_id || idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs font-black flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            {tplItem.template?.name || `Plantilla #${tplItem.template_id}`}
                          </h4>
                          <span className="text-[10px] font-mono text-purple-300">
                            {tplItem.template?.aspect_ratio}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-black text-emerald-300">
                        {tplItem.count} usos
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-6">
                    Aún no hay datos de uso para las plantillas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATES MANAGER */}
      {activeTab === 'templates' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Plantillas Publicitarias Configurate</h3>
              <p className="text-xs text-slate-400">
                Diseña elementos interactivos para que las agencias incorporen sus datos comerciales.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingTemplate(null);
                setSelectedResourceForNewTemplate(null);
                setIsEditorOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Nueva Plantilla
            </button>
          </div>

          {isLoadingTemplates ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-400">Cargando plantillas...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">No tienes plantillas creadas</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Sube un recurso multimedia a la biblioteca y crea tu primera plantilla interactiva con capas personalizables.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {templates.map((tpl) => {
                const isVideo = tpl.resource?.type === 'video';
                return (
                  <div
                    key={tpl.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-purple-500 transition-all duration-300"
                  >
                    {/* Media Thumbnail */}
                    <div className="relative aspect-square bg-slate-950 overflow-hidden">
                      <img
                        src={tpl.preview_image_url || tpl.resource?.thumbnail_url || tpl.resource?.file_url}
                        alt={tpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-white/10 uppercase">
                          {tpl.aspect_ratio}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                          {isVideo ? <Film className="w-2.5 h-2.5 text-amber-400" /> : <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />}
                          {tpl.resource?.type}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase backdrop-blur-md border ${tpl.is_published ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' : 'bg-amber-950/80 border-amber-500/30 text-amber-400'}`}>
                          {tpl.is_published ? 'Publicada' : 'Borrador'}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-2 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Costo: <strong className="text-white">${Number(tpl.base_cost).toFixed(2)}</strong></span>
                        <span className="text-purple-400 font-bold">Sugerido: ${Number(tpl.suggested_price).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Info & Actions */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{tpl.name}</h4>
                        <p className="text-[11px] text-slate-400">{tpl.elements?.length || 0} capas configuradas</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingTemplate(tpl);
                              setSelectedResourceForNewTemplate(null);
                              setIsEditorOpen(true);
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                            title="Editar en Visual Builder"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicateTemplate(tpl.id)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                            title="Duplicar Plantilla"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(tpl.id)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Eliminar Plantilla"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleTogglePublish(tpl.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${tpl.is_published ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                        >
                          {tpl.is_published ? 'Archivar' : 'Publicar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MASTER MEDIA LIBRARY */}
      {activeTab === 'library' && (
        <div className="animate-fade-in">
          <MasterMediaLibrary onSelectResourceForTemplate={handleCreateFromResource} />
        </div>
      )}

      {/* TAB 4: GLOBAL GENERATIONS HISTORY */}
      {activeTab === 'generations' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Historial de Creativos Generados por Agencias</h3>
              <p className="text-xs text-slate-400">
                Monitorea cada exportación comercial realizada en tu plataforma.
              </p>
            </div>
            <button
              onClick={fetchGenerations}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingGenerations ? 'animate-spin text-purple-400' : ''}`} />
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Creativo</th>
                    <th className="px-6 py-4">Agencia / Usuario</th>
                    <th className="px-6 py-4">Costo Base</th>
                    <th className="px-6 py-4">Precio Venta</th>
                    <th className="px-6 py-4">Ganancia Proyectada</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {isLoadingGenerations ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <RefreshCw className="w-6 h-6 text-purple-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : generations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-500">
                        No hay creativos generados aún.
                      </td>
                    </tr>
                  ) : (
                    generations.map((gen) => (
                      <tr key={gen.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                              {gen.output_url ? (
                                <img src={gen.output_url} alt="Out" className="w-full h-full object-cover" />
                              ) : (
                                <Sparkles className="w-4 h-4 text-purple-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white line-clamp-1">
                                {gen.template?.name || `Creativo #${gen.id}`}
                              </div>
                              <div className="text-[10px] text-slate-400 uppercase">{gen.format} • {gen.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{gen.agency?.name || 'Agencia Directa'}</div>
                          <div className="text-[10px] text-slate-400">{gen.user?.name}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-300">
                          ${Number(gen.base_cost_snapshot).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-mono text-white font-bold">
                          ${Number(gen.sale_price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-mono text-emerald-400 font-extrabold">
                          +${Number(gen.projected_profit).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${gen.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : gen.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {gen.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {gen.status === 'completed' && (
                            <a
                              href={marketingB2BService.getDownloadUrl(gen.uuid)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
                            >
                              <Download className="w-3.5 h-3.5" /> Descargar
                            </a>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhiteLabelDashboard;
