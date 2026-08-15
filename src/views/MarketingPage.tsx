'use client';

import React, { useEffect, useState } from 'react';
import { EmailTemplate, EmailCampaign, WorkspaceStage, Client } from '../types';
import marketingService from '../services/marketingService';
import crmService from '../services/crmService';
import { 
  Mail, Send, Plus, FileText, CheckCircle2, Clock, 
  Users, Trash2, Edit3, Eye, Sparkles, Filter, Code, 
  AlertCircle, ChevronRight, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MarketingPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [stages, setStages] = useState<WorkspaceStage[]>([]);
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
  const [selectedStageId, setSelectedStageId] = useState<number | ''>('');
  const [isSending, setIsSending] = useState(false);

  // Campaign Detail Drawer
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tplData, cmpData, pipelineData] = await Promise.all([
        marketingService.getTemplates(),
        marketingService.getCampaigns(),
        crmService.getPipelines(),
      ]);
      setTemplates(tplData);
      setCampaigns(cmpData);
      setStages(pipelineData.stages || []);
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
    const toastId = toast.loading('Enviando campaña de correos a los leads del CRM...');

    try {
      const res = await marketingService.sendCampaign({
        name: campaignName,
        subject: campaignSubject,
        body_html: campaignBody,
        email_template_id: selectedTemplateId || undefined,
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
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
              <Mail className="w-5 h-5" />
            </div>
            Email Marketing & Envíos CRM
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Diseña plantillas HTML y envía campañas de correo masivo personalizadas a tus prospectos del CRM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('launcher');
              if (templates.length > 0 && !selectedTemplateId) {
                handleSelectTemplateForCampaign(templates[0].id);
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-purple-700 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            Lanzar Nueva Campaña
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 gap-3 rounded-2xl border shadow-2xs">
        <button
          onClick={() => setActiveTab('templates')}
          className={`py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'templates'
              ? 'text-purple-600 border-purple-600'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Plantillas de Correo ({templates.length})
        </button>

        <button
          onClick={() => setActiveTab('launcher')}
          className={`py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'launcher'
              ? 'text-purple-600 border-purple-600'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          Diseñador & Lanzador de Campaña
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'campaigns'
              ? 'text-purple-600 border-purple-600'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Historial de Campañas ({campaigns.length})
        </button>
      </div>

      {/* Tab 1: Plantillas de Correo */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Plantillas HTML Disponibles
            </h3>
            <button
              onClick={() => handleOpenTemplateModal()}
              className="px-4 py-2 bg-purple-50 text-purple-600 font-extrabold text-xs rounded-xl border border-purple-200/60 hover:bg-purple-100 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nueva Plantilla
            </button>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col justify-center items-center gap-3">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-slate-400">Cargando plantillas...</span>
            </div>
          ) : templates.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700">No hay plantillas creadas</h3>
              <p className="text-xs text-slate-400">Crea tu primera plantilla de correo para reutilizarla en tus campañas del CRM.</p>
              <button
                onClick={() => handleOpenTemplateModal()}
                className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700"
              >
                Crear Plantilla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <div key={tpl.id} className="bg-white rounded-2xl border border-slate-200/80 hover:border-purple-500 transition-all p-5 space-y-4 shadow-2xs hover:shadow-md flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-slate-900 text-base line-clamp-1">{tpl.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-50 text-purple-600 border border-purple-100">
                        ID #{tpl.id}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold line-clamp-1">
                      <span className="text-slate-400">Asunto:</span> {tpl.subject || 'Sin asunto predeterminado'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 max-h-24 overflow-hidden text-[11px] text-slate-600 font-mono italic">
                    {tpl.body_html.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewHtmlModal(tpl.body_html)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-200 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ver Vista Previa
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          handleSelectTemplateForCampaign(tpl.id);
                          setActiveTab('launcher');
                        }}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Usar en Campaña"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenTemplateModal(tpl)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                        title="Editar Plantilla"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(tpl.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">Configurar Envío Masivo a Prospectos del CRM</h3>
            <p className="text-xs text-slate-500 font-medium">
              Selecciona la audiencia objetivo y personaliza el asunto y contenido con marcadores dinámicos.
            </p>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Name & Template Choice */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Campaña (Identificador Interno)</label>
                  <input
                    type="text"
                    required
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Ej: Lanzamiento Promoción Verano 2026"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cargar desde Plantilla Existente (Opcional)</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleSelectTemplateForCampaign(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:bg-white"
                  >
                    <option value="">-- Redactar desde cero --</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Audience Filter */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-purple-600" /> Audiencia Objetivo (Segmento del CRM)
                  </label>
                  <select
                    value={selectedStageId}
                    onChange={(e) => setSelectedStageId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:bg-white"
                  >
                    <option value="">Todos los prospectos y clientes registrados</option>
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>Filtrar solo Etapa: {s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Marcadores Dinámicos Disponibles:
                  </span>
                  <p className="text-[11px] text-purple-700">
                    Inserta en el asunto o cuerpo: <code className="font-mono bg-white px-1.5 py-0.5 rounded font-bold">{'{nombre}'}</code>, <code className="font-mono bg-white px-1.5 py-0.5 rounded font-bold">{'{email}'}</code>, <code className="font-mono bg-white px-1.5 py-0.5 rounded font-bold">{'{empresa}'}</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Asunto del Correo Electrónico</label>
              <input
                type="text"
                required
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                placeholder="Ej: ¡Hola {nombre}! Descubre nuestras novedades especiales"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-purple-600 font-medium"
              />
            </div>

            {/* HTML Editor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cuerpo del Correo (Formato HTML / Texto Enriquecido)</label>
              <textarea
                required
                rows={12}
                value={campaignBody}
                onChange={(e) => setCampaignBody(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:bg-white focus:border-purple-600"
              />
            </div>

            {/* Send Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-3 bg-purple-600 text-white font-extrabold text-xs rounded-xl shadow-lg hover:bg-purple-700 active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Procesando Envío...' : 'Ejecutar Envío Masivo a Prospectos'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Historial de Campañas */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Historial de Campañas Despachadas
          </h3>

          {campaigns.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Clock className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700">Sin campañas registradas</h3>
              <p className="text-xs text-slate-400">Aún no se han ejecutado envíos masivos a los prospectos del CRM.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Campaña</th>
                    <th className="p-4">Asunto</th>
                    <th className="p-4">Audiencia / Etapa</th>
                    <th className="p-4 text-center">Destinatarios</th>
                    <th className="p-4">Fecha de Envío</th>
                    <th className="p-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {campaigns.map((cmp) => (
                    <tr key={cmp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{cmp.name}</td>
                      <td className="p-4 text-slate-600">{cmp.subject}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                          {cmp.stage?.name ? `Etapa: ${cmp.stage.name}` : 'Todos los Leads'}
                        </span>
                      </td>
                      <td className="p-4 text-center font-black text-purple-600">{cmp.recipient_count}</td>
                      <td className="p-4 text-slate-500">{cmp.sent_at ? new Date(cmp.sent_at).toLocaleString() : ''}</td>
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

      {/* Template Create / Edit Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                {editingTemplateId ? 'Editar Plantilla de Correo' : 'Nueva Plantilla HTML'}
              </h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Plantilla</label>
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Ej: Plantilla Bienvenida Prospectos"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Asunto Predeterminado</label>
                <input
                  type="text"
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                  placeholder="Ej: ¡Bienvenido a SANTUN, {nombre}!"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">Contenido HTML</label>
                  <div className="flex gap-1 text-[10px]">
                    <button type="button" onClick={() => insertPlaceholder('{nombre}')} className="px-2 py-0.5 bg-slate-100 font-mono rounded font-bold hover:bg-purple-100">+nombre</button>
                    <button type="button" onClick={() => insertPlaceholder('{email}')} className="px-2 py-0.5 bg-slate-100 font-mono rounded font-bold hover:bg-purple-100">+email</button>
                    <button type="button" onClick={() => insertPlaceholder('{empresa}')} className="px-2 py-0.5 bg-slate-100 font-mono rounded font-bold hover:bg-purple-100">+empresa</button>
                  </div>
                </div>
                <textarea
                  required
                  rows={8}
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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

      {/* HTML Preview Modal */}
      {previewHtmlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl h-[70vh] shadow-2xl flex flex-col overflow-hidden">
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
