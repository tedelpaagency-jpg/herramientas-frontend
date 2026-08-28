'use client';

import React, { useEffect, useState } from 'react';
import { EmailTemplate, EmailCampaign, WorkspaceStage, Workspace } from '../types';
import marketingService from '../services/marketingService';
import crmService from '../services/crmService';
import { workspaceMetaService } from '../services/workspaceMetaService';
import { 
  Mail, Send, Plus, FileText, CheckCircle2, Clock, 
  Users, Trash2, Edit3, Eye, Sparkles, Filter, Code, 
  AlertCircle, ChevronRight, X, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MarketingPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [stages, setStages] = useState<WorkspaceStage[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'launcher' | 'campaigns'>('templates');

  // Template Modal State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [previewHtmlModal, setPreviewHtmlModal] = useState<string | null>(null);

  // Campaign Launcher State
  const [campaignName, setCampaignName] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>('');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | ''>('');
  const [selectedStageId, setSelectedStageId] = useState<number | ''>('');
  const [isSending, setIsSending] = useState(false);

  // Campaign Detail Drawer
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tplData, cmpData, pipelineData, wsData] = await Promise.all([
        marketingService.getTemplates(),
        marketingService.getCampaigns(),
        crmService.getPipelines(),
        workspaceMetaService.getWorkspaces().catch(() => []),
      ]);
      setTemplates(tplData);
      setCampaigns(cmpData);
      setStages(pipelineData.stages || []);
      setWorkspaces(Array.isArray(wsData) ? wsData : []);
    } catch (err) {
      console.error('Error loading marketing data:', err);
      toast.error('Error al cargar datos de Marketing');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenTemplateModal = (tpl?: EmailTemplate) => {
    if (tpl) {
      setEditingTemplateId(tpl.id);
      setTemplateName(tpl.name);
      setTemplateSubject(tpl.subject || '');
      setTemplateBody(tpl.body_html);
    } else {
      setEditingTemplateId(null);
      setTemplateName('');
      setTemplateSubject('');
      setTemplateBody('<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">\n  <h2 style="color: #2563eb;">¡Hola {nombre}!</h2>\n  <p>Tenemos novedades exclusivas para ti.</p>\n  <p>Saludos,<br><strong>Equipo SANTUN</strong></p>\n</div>');
    }
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim() || !templateBody.trim()) return;

    try {
      if (editingTemplateId) {
        const updated = await marketingService.updateTemplate(editingTemplateId, {
          name: templateName,
          subject: templateSubject,
          body_html: templateBody,
        });
        setTemplates(prev => prev.map(t => t.id === editingTemplateId ? updated : t));
        toast.success('Plantilla actualizada');
      } else {
        const created = await marketingService.createTemplate({
          name: templateName,
          subject: templateSubject,
          body_html: templateBody,
        });
        setTemplates(prev => [created, ...prev]);
        toast.success('Plantilla creada con éxito');
      }
      setIsTemplateModalOpen(false);
    } catch (err) {
      console.error('Error saving template:', err);
      toast.error('Error al guardar la plantilla');
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta plantilla de correo?')) return;
    try {
      await marketingService.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Plantilla eliminada');
    } catch (err) {
      console.error('Error deleting template:', err);
      toast.error('Error al eliminar plantilla');
    }
  };

  const handleSelectTemplateForCampaign = (templateId: number) => {
    const tpl = templates.find(t => t.id === templateId);
    if (tpl) {
      setSelectedTemplateId(tpl.id);
      if (!campaignName) setCampaignName(`Campaña - ${tpl.name}`);
      setCampaignSubject(tpl.subject || '');
      setCampaignBody(tpl.body_html);
    } else {
      setSelectedTemplateId('');
    }
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || !campaignSubject.trim() || !campaignBody.trim()) return;

    setIsSending(true);
    const toastId = toast.loading('Enviando campaña de correos a los prospectos del CRM...');

    try {
      const res = await marketingService.sendCampaign({
        name: campaignName,
        subject: campaignSubject,
        body_html: campaignBody,
        email_template_id: selectedTemplateId || undefined,
        workspace_id: selectedWorkspaceId || undefined,
        stage_id: selectedStageId || undefined,
      });

      toast.success(res.message || 'Campaña enviada con éxito', { id: toastId });
      
      // Refresh campaign list
      const updatedCampaigns = await marketingService.getCampaigns();
      setCampaigns(updatedCampaigns);
      
      // Reset form
      setCampaignName('');
      setCampaignSubject('');
      setCampaignBody('');
      setSelectedTemplateId('');
      setSelectedWorkspaceId('');
      setSelectedStageId('');
      setActiveTab('campaigns');
    } catch (err: any) {
      console.error('Error sending campaign:', err);
      const errMsg = err?.response?.data?.message || 'Error al procesar el envío masivo de correos';
      toast.error(errMsg, { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  const insertPlaceholder = (tag: string) => {
    setTemplateBody(prev => prev + ` ${tag} `);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>CRM & Email Marketing Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Campañas de Marketing por Correo</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Diseña plantillas HTML, segmenta tus listas por Workspaces y Etapas del CRM y envía campañas masivas automatizadas.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleOpenTemplateModal()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Plantilla</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-extrabold">
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'templates' 
              ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Plantillas de Correo ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('launcher')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'launcher' 
              ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Lanzar Campaña</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'campaigns' 
              ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Historial de Campañas ({campaigns.length})</span>
        </button>
      </div>

      {/* Tab 1: Plantillas */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Cargando plantillas...</div>
          ) : templates.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">No tienes plantillas creadas</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Crea tu primera plantilla HTML para agilizar los envíos masivos a tus leads.
              </p>
              <button
                onClick={() => handleOpenTemplateModal()}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow-md"
              >
                <Plus className="w-4 h-4" /> Crear Plantilla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {templates.map((tpl) => (
                <div key={tpl.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all p-5 space-y-4 shadow-2xs hover:shadow-md flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base line-clamp-1">{tpl.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                        ID #{tpl.id}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold line-clamp-1">
                      <span className="text-slate-400">Asunto:</span> {tpl.subject || 'Sin asunto predeterminado'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 max-h-24 overflow-hidden text-[11px] text-slate-600 dark:text-slate-400 font-mono italic">
                    {tpl.body_html.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewHtmlModal(tpl.body_html)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg hover:bg-slate-200 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ver Vista Previa
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          handleSelectTemplateForCampaign(tpl.id);
                          setActiveTab('launcher');
                        }}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg"
                        title="Usar en Campaña"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenTemplateModal(tpl)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        title="Editar Plantilla"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(tpl.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        title="Eliminar Plantilla"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Lanzador de Campaña */}
      {activeTab === 'launcher' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Configurar Envío Masivo a Prospectos del CRM</h3>
            <p className="text-xs text-slate-500 font-medium">
              Selecciona la audiencia objetivo por Workspaces y Etapas del CRM y personaliza el asunto y contenido.
            </p>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Name & Template Choice */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre de la Campaña (Identificador Interno)</label>
                  <input
                    type="text"
                    required
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Ej: Lanzamiento Promoción Verano 2026"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cargar desde Plantilla Existente (Opcional)</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleSelectTemplateForCampaign(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                  >
                    <option value="">-- Redactar desde cero --</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Audience Filters (Workspace & Stage) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" /> Filtrar por Workspace
                  </label>
                  <select
                    value={selectedWorkspaceId}
                    onChange={(e) => setSelectedWorkspaceId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                  >
                    <option value="">🌐 Todos los Workspaces</option>
                    {workspaces.map(ws => (
                      <option key={ws.id} value={ws.id}>🏢 {ws.name} (ID: #{ws.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-purple-600" /> Filtrar por Etapa del CRM (Stage)
                  </label>
                  <select
                    value={selectedStageId}
                    onChange={(e) => setSelectedStageId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                  >
                    <option value="">⚡ Todas las Etapas del Pipeline</option>
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>Etapa: {s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Marcadores Dinámicos Disponibles:
                  </span>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300">
                    Inserta en el asunto o cuerpo: <code className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded font-bold">{'{nombre}'}</code>, <code className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded font-bold">{'{email}'}</code>, <code className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded font-bold">{'{empresa}'}</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Asunto del Correo Electrónico</label>
              <input
                type="text"
                required
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                placeholder="Ej: ¡Hola {nombre}! Descubre nuestras novedades especiales"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none font-medium"
              />
            </div>

            {/* HTML Editor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cuerpo del Correo (Formato HTML / Texto Enriquecido)</label>
              <textarea
                required
                rows={12}
                value={campaignBody}
                onChange={(e) => setCampaignBody(e.target.value)}
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono text-xs focus:outline-none"
              />
            </div>

            {/* Send Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-3 bg-purple-600 text-white font-extrabold text-xs rounded-xl shadow-lg hover:bg-purple-700 active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Enviando Campaña...' : 'Enviar Campaña Masiva'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Historial de Campañas */}
      {activeTab === 'campaigns' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Bitácora de Campañas Enviadas</h3>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-medium">No se han registrado campañas de marketing enviadas.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 font-extrabold uppercase">
                    <th className="p-4">Campaña</th>
                    <th className="p-4">Asunto</th>
                    <th className="p-4">Filtro / Etapa</th>
                    <th className="p-4 text-center">Destinatarios</th>
                    <th className="p-4">Fecha Envío</th>
                    <th className="p-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {campaigns.map((cmp) => (
                    <tr key={cmp.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{cmp.name}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{cmp.subject}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                          {cmp.stage?.name ? `Etapa: ${cmp.stage.name}` : 'Todos los Leads'}
                        </span>
                      </td>
                      <td className="p-4 text-center font-black text-purple-600 dark:text-purple-400">{cmp.recipient_count}</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400">{cmp.sent_at ? new Date(cmp.sent_at).toLocaleString() : ''}</td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase bg-emerald-100 text-emerald-800">
                          {cmp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Template Create / Edit Modal (Full screen backdrop fix) */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingTemplateId ? 'Editar Plantilla de Correo' : 'Nueva Plantilla HTML'}
              </h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre de la Plantilla</label>
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Ej: Plantilla Bienvenida Prospectos"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Asunto Predeterminado</label>
                <input
                  type="text"
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                  placeholder="Ej: ¡Bienvenido a SANTUN, {nombre}!"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Contenido HTML</label>
                  <div className="flex gap-1 text-[10px]">
                    <button type="button" onClick={() => insertPlaceholder('{nombre}')} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono rounded font-bold hover:bg-purple-100">+nombre</button>
                    <button type="button" onClick={() => insertPlaceholder('{email}')} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono rounded font-bold hover:bg-purple-100">+email</button>
                    <button type="button" onClick={() => insertPlaceholder('{empresa}')} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono rounded font-bold hover:bg-purple-100">+empresa</button>
                  </div>
                </div>
                <textarea
                  required
                  rows={8}
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md hover:bg-purple-700"
                >
                  Guardar Plantilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HTML Preview Modal (Full screen backdrop fix) */}
      {previewHtmlModal && (
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl h-[70vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Vista Previa de Correo HTML</h3>
              <button onClick={() => setPreviewHtmlModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <div dangerouslySetInnerHTML={{ __html: previewHtmlModal }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingPage;
