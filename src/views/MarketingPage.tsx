'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { EmailTemplate, EmailCampaign, WorkspaceStage, Workspace } from '../types';
import marketingService from '../services/marketingService';
import crmService from '../services/crmService';
import { workspaceMetaService } from '../services/workspaceMetaService';
import Portal from '../components/Portal';
import { 
  Mail, Send, Plus, FileText, CheckCircle2, Clock, 
  Users, Trash2, Edit3, Eye, Sparkles, Filter, Code, 
  AlertCircle, ChevronRight, X, Layers, Smartphone, Monitor, RefreshCw, User, Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export const MarketingPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [stages, setStages] = useState<WorkspaceStage[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'launcher' | 'campaigns'>('templates');

  // Editor Modes State
  const [templateEditMode, setTemplateEditMode] = useState<'wysiwyg' | 'html'>('wysiwyg');
  const [campaignEditMode, setCampaignEditMode] = useState<'wysiwyg' | 'html'>('wysiwyg');

  // Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewSubject, setPreviewSubject] = useState('');
  const [previewHtmlContent, setPreviewHtmlContent] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [testVars, setTestVars] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@ejemplo.com',
    empresa: 'Inmobiliaria Demo',
    agencia: 'Agencia SANTUN',
  });

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

  const handleOpenPreviewModal = (subject: string, bodyHtml: string) => {
    setPreviewSubject(subject || 'Asunto del correo electrónico');
    setPreviewHtmlContent(bodyHtml || '<p style="color: #94a3b8; font-style: italic;">Sin contenido...</p>');
    setIsPreviewModalOpen(true);
  };

  const getSubstitutedContent = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\{nombre\}/g, testVars.nombre)
      .replace(/\{email\}/g, testVars.email)
      .replace(/\{empresa\}/g, testVars.empresa)
      .replace(/\{agencia\}/g, testVars.agencia);
  };

  const insertPlaceholderToTarget = (tag: string, target: 'template' | 'campaign') => {
    if (target === 'template') {
      setTemplateBody((prev) => prev + ` ${tag} `);
    } else {
      setCampaignBody((prev) => prev + ` ${tag} `);
    }
  };

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
                      onClick={() => handleOpenPreviewModal(tpl.subject || '', tpl.body_html)}
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

            {/* Dual Editor Component (Visual WYSIWYG vs HTML Directo) */}
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Cuerpo del Correo
                </label>

                {/* Mode Selector & Placeholder Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setCampaignEditMode('wysiwyg')}
                      className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 ${
                        campaignEditMode === 'wysiwyg'
                          ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editor Visual (WYSIWYG)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCampaignEditMode('html')}
                      className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 ${
                        campaignEditMode === 'html'
                          ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Código HTML Directo</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => insertPlaceholderToTarget('{nombre}', 'campaign')}
                      className="px-2 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-mono rounded-lg font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100"
                    >
                      +nombre
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaceholderToTarget('{email}', 'campaign')}
                      className="px-2 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-mono rounded-lg font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100"
                    >
                      +email
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaceholderToTarget('{empresa}', 'campaign')}
                      className="px-2 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-mono rounded-lg font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100"
                    >
                      +empresa
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaceholderToTarget('{agencia}', 'campaign')}
                      className="px-2 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-mono rounded-lg font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100"
                    >
                      +agencia
                    </button>
                  </div>
                </div>
              </div>

              {campaignEditMode === 'wysiwyg' ? (
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-slate-900 dark:text-white">
                  <ReactQuill
                    theme="snow"
                    value={campaignBody}
                    onChange={setCampaignBody}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ align: [] }],
                        ['link', 'clean'],
                      ],
                    }}
                    className="h-64 mb-12"
                  />
                </div>
              ) : (
                <textarea
                  required
                  rows={12}
                  value={campaignBody}
                  onChange={(e) => setCampaignBody(e.target.value)}
                  className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 rounded-xl focus:outline-none"
                />
              )}
            </div>

            {/* Action Buttons: Preview & Send */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleOpenPreviewModal(campaignSubject, campaignBody)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all active:scale-95"
              >
                <Eye className="w-4 h-4 text-purple-600" />
                <span>Previsualizar Correo Realista</span>
              </button>

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

      {/* Template Create / Edit Modal (Full screen backdrop fix with Portal) */}
      {isTemplateModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl p-4 sm:p-6 shadow-2xl space-y-4">
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

                {/* Dual Editor Component (Visual WYSIWYG vs HTML Directo) */}
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Contenido del Correo</label>
                    
                    {/* Mode Selector & Placeholder Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setTemplateEditMode('wysiwyg')}
                          className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 ${
                            templateEditMode === 'wysiwyg'
                              ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editor Visual (WYSIWYG)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTemplateEditMode('html')}
                          className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 ${
                            templateEditMode === 'html'
                              ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>Código HTML Directo</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-[11px]">
                        <button type="button" onClick={() => insertPlaceholderToTarget('{nombre}', 'template')} className="px-2 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-mono rounded-lg font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100">+nombre</button>
                        <button type="button" onClick={() => insertPlaceholderToTarget('{email}', 'template')} className="px-2 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-mono rounded-lg font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100">+email</button>
                        <button type="button" onClick={() => insertPlaceholderToTarget('{empresa}', 'template')} className="px-2 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-mono rounded-lg font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100">+empresa</button>
                        <button type="button" onClick={() => insertPlaceholderToTarget('{agencia}', 'template')} className="px-2 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-mono rounded-lg font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100">+agencia</button>
                      </div>
                    </div>
                  </div>

                  {templateEditMode === 'wysiwyg' ? (
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-slate-900 dark:text-white">
                      <ReactQuill
                        theme="snow"
                        value={templateBody}
                        onChange={setTemplateBody}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ color: [] }, { background: [] }],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            [{ align: [] }],
                            ['link', 'clean'],
                          ],
                        }}
                        className="h-56 mb-12"
                      />
                    </div>
                  ) : (
                    <textarea
                      required
                      rows={10}
                      value={templateBody}
                      onChange={(e) => setTemplateBody(e.target.value)}
                      className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 rounded-xl focus:outline-none"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleOpenPreviewModal(templateSubject, templateBody)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Eye className="w-4 h-4 text-purple-600" />
                    <span>Previsualizar Correo Realista</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTemplateModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md hover:bg-purple-700 active:scale-95"
                    >
                      Guardar Plantilla
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* REALISTIC INBOX EMAIL PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-white">
              {/* Top Header Bar */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <h3 className="font-extrabold text-sm text-white">Vista Previa Realista de Correo Electrónico</h3>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                      previewDevice === 'desktop'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Escritorio (640px)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                      previewDevice === 'mobile'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Móvil (375px)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Live Variable Tester Bar */}
              <div className="px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Probador de Marcadores Dinámicos:
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] font-mono">{'{nombre}'}:</span>
                    <input
                      type="text"
                      value={testVars.nombre}
                      onChange={(e) => setTestVars({ ...testVars, nombre: e.target.value })}
                      className="w-24 bg-transparent text-white font-bold text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] font-mono">{'{email}'}:</span>
                    <input
                      type="text"
                      value={testVars.email}
                      onChange={(e) => setTestVars({ ...testVars, email: e.target.value })}
                      className="w-36 bg-transparent text-white font-bold text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] font-mono">{'{empresa}'}:</span>
                    <input
                      type="text"
                      value={testVars.empresa}
                      onChange={(e) => setTestVars({ ...testVars, empresa: e.target.value })}
                      className="w-28 bg-transparent text-white font-bold text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Main Email Inbox Body Area */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-950 flex justify-center items-start">
                <div
                  className={`transition-all duration-300 ${
                    previewDevice === 'desktop'
                      ? 'w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden'
                      : 'w-[375px] bg-white text-slate-900 rounded-[36px] shadow-2xl border-8 border-slate-800 overflow-hidden relative'
                  }`}
                >
                  {/* Mobile Phone Top Bar Mockup */}
                  {previewDevice === 'mobile' && (
                    <div className="bg-slate-900 text-white text-[10px] px-6 py-1.5 flex justify-between items-center font-bold">
                      <span>9:41</span>
                      <div className="w-16 h-3 bg-black rounded-full mx-auto"></div>
                      <span>100% 🔋</span>
                    </div>
                  )}

                  {/* Email Inbox Header (Gmail / Outlook style) */}
                  <div className="p-5 bg-slate-50 border-b border-slate-200 space-y-3">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-black text-slate-900 leading-snug">
                        {getSubstitutedContent(previewSubject)}
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                        Bandeja de Entrada
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 border-t border-slate-200/60 pt-2">
                      <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                        S
                      </div>
                      <div className="flex-1 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">SANTUN Email Marketing</span>
                          <span className="text-[10px] text-slate-400">Hoy, 14:35</span>
                        </div>
                        <p className="text-slate-500">
                          De: <span className="font-semibold text-slate-700">no-reply@santun.tedelpa.com</span>
                        </p>
                        <p className="text-slate-500">
                          Para: <span className="font-semibold text-slate-700">{testVars.nombre} &lt;{testVars.email}&gt;</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rendered Email HTML Content */}
                  <div className="p-6 bg-white min-h-[250px] overflow-x-auto text-slate-900 leading-relaxed text-sm">
                    <div dangerouslySetInnerHTML={{ __html: getSubstitutedContent(previewHtmlContent) }} />
                  </div>

                  {/* Email Footer Mockup */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-1">
                    <p>Este es un correo automático enviado a través del CRM SANTUN Marketing.</p>
                    <p>© 2026 SANTUN. Todos los derechos reservados.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default MarketingPage;
