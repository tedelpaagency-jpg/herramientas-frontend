'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Zap,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Clock,
  Mail,
  UserCheck,
  ArrowRight,
  Layers,
  ShieldCheck,
  X,
  AlertCircle,
  Sparkles,
  Sliders,
  Send,
  Eye,
  Code,
  FileText,
  Building,
  Smartphone,
  Monitor,
  User,
  Users,
  Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { automationService, PipelineAutomation, AutomationMeta } from '../services/automationService';
import Portal from '../components/Portal';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Shortcodes available for email automations
const AVAILABLE_SHORTCODES = [
  { tag: '{lead_name}', label: 'Nombre del Lead', example: 'Juan Pérez' },
  { tag: '{lead_email}', label: 'Correo del Lead', example: 'juan.perez@ejemplo.com' },
  { tag: '{lead_phone}', label: 'Teléfono', example: '+52 55 1234 5678' },
  { tag: '{lead_company}', label: 'Empresa', example: 'Corporativo SANTUN' },
  { tag: '{agent_name}', label: 'Asesor Asignado', example: 'Carlos Rodríguez' },
  { tag: '{agency_name}', label: 'Nombre de Agencia', example: 'Agencia Central' },
  { tag: '{stage_name}', label: 'Etapa Comercial', example: 'Negociación / Cotización' },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<PipelineAutomation[]>([]);
  const [meta, setMeta] = useState<AutomationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterWorkspaceId, setFilterWorkspaceId] = useState<number | ''>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAutomation, setEditingAutomation] = useState<PipelineAutomation | null>(null);

  // Form State - Core
  const [name, setName] = useState<string>('');
  const [agencyId, setAgencyId] = useState<number | ''>('');
  const [workspaceId, setWorkspaceId] = useState<number | ''>('');
  const [stageId, setStageId] = useState<number | ''>('');
  const [triggerType, setTriggerType] = useState<string>('lead_created');
  const [conditionType, setConditionType] = useState<string>('always');
  const [conditionValue, setConditionValue] = useState<string>('');
  const [actionType, setActionType] = useState<string>('send_lead_email');
  const [actionValue, setActionValue] = useState<string>('');
  const [notificationEmail, setNotificationEmail] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State - Email Actions
  const [recipientType, setRecipientType] = useState<'lead' | 'assigned_agent' | 'user' | 'custom'>('lead');
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [customRecipientEmail, setCustomRecipientEmail] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [emailEditorMode, setEmailEditorMode] = useState<'wysiwyg' | 'html'>('wysiwyg');

  // Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [testLead, setTestLead] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@ejemplo.com',
    phone: '+52 55 1234 5678',
    company: 'Inmobiliaria SANTUN',
    agent: 'Carlos Rodríguez',
    agency: 'Agencia Central',
    stage: 'Prospecto Calificado',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [list, metaData] = await Promise.all([
        automationService.getAutomations(),
        automationService.getMeta(),
      ]);
      setAutomations(list);
      setMeta(metaData);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar automatizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingAutomation(null);
    setName('');
    setAgencyId('');
    setWorkspaceId('');
    setStageId('');
    setTriggerType('lead_created');
    setConditionType('always');
    setConditionValue('');
    setActionType('send_lead_email');
    setActionValue('');
    setNotificationEmail('');
    
    // Reset Email Specific
    setRecipientType('lead');
    setSelectedUserId('');
    setCustomRecipientEmail('');
    setEmailSubject('¡Hola {lead_name}, gracias por contactarnos!');
    setEmailBody('<div style="font-family: Arial, sans-serif; color: #1e293b; padding: 20px; line-height: 1.6;">\n  <h2 style="color: #2563eb; margin-bottom: 12px;">¡Hola {lead_name}!</h2>\n  <p>Hemos recibido tu solicitud en nuestra plataforma y un asesor te atenderá pronto.</p>\n  <p><strong>Detalles del registro:</strong></p>\n  <ul>\n    <li>Etapa: {stage_name}</li>\n    <li>Asesor Asignado: {agent_name}</li>\n    <li>Agencia: {agency_name}</li>\n  </ul>\n  <p>Saludos cordiales,<br><strong>Equipo de {agency_name}</strong></p>\n</div>');
    setEmailEditorMode('wysiwyg');

    setIsModalOpen(true);
  };

  const handleOpenEditModal = (auto: PipelineAutomation) => {
    setEditingAutomation(auto);
    setName(auto.name);
    setAgencyId(auto.agency_id || '');
    setWorkspaceId(auto.workspace_id || '');
    setStageId(auto.stage_id || '');
    setTriggerType(auto.trigger_type);
    setConditionType(auto.condition_type || 'always');
    setConditionValue(auto.condition_value || '');
    setActionType(auto.action_type);
    setNotificationEmail(auto.notification_email || '');

    // Parse action_value for email actions if it contains JSON config
    if (auto.action_type === 'send_lead_email' || auto.action_type === 'send_email') {
      try {
        if (auto.action_value && auto.action_value.startsWith('{')) {
          const parsed = JSON.parse(auto.action_value);
          setEmailSubject(parsed.subject || '');
          setEmailBody(parsed.body || '');
          setEmailEditorMode(parsed.editor_mode || 'wysiwyg');
          setRecipientType(parsed.recipient_type || (auto.action_type === 'send_lead_email' ? 'lead' : 'custom'));
          setCustomRecipientEmail(parsed.custom_email || auto.notification_email || '');
          setSelectedUserId(parsed.user_id || '');
        } else {
          setEmailSubject('Notificación de Automatización');
          setEmailBody(auto.action_value || '');
          setEmailEditorMode('wysiwyg');
          setRecipientType(auto.action_type === 'send_lead_email' ? 'lead' : auto.notification_email ? 'custom' : 'lead');
          setCustomRecipientEmail(auto.notification_email || '');
          setSelectedUserId('');
        }
      } catch {
        setEmailSubject('Notificación de Automatización');
        setEmailBody(auto.action_value || '');
        setEmailEditorMode('wysiwyg');
        setRecipientType('lead');
        setCustomRecipientEmail('');
        setSelectedUserId('');
      }
    } else {
      setActionValue(auto.action_value || '');
    }

    setIsModalOpen(true);
  };

  const handleInsertShortcode = (tag: string, field: 'subject' | 'body') => {
    if (field === 'subject') {
      setEmailSubject((prev) => prev + ` ${tag}`);
    } else {
      setEmailBody((prev) => prev + ` ${tag} `);
    }
  };

  const getSubstitutedContent = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\{lead_name\}/g, testLead.name)
      .replace(/\{lead_email\}/g, testLead.email)
      .replace(/\{lead_phone\}/g, testLead.phone)
      .replace(/\{lead_company\}/g, testLead.company)
      .replace(/\{agent_name\}/g, testLead.agent)
      .replace(/\{agency_name\}/g, testLead.agency)
      .replace(/\{stage_name\}/g, testLead.stage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre de la automatización es obligatorio');
      return;
    }

    setSubmitting(true);
    try {
      let finalActionValue = actionValue;
      let finalNotificationEmail = notificationEmail;

      if (actionType === 'send_lead_email' || actionType === 'send_email') {
        const emailConfig = {
          subject: emailSubject,
          body: emailBody,
          editor_mode: emailEditorMode,
          recipient_type: recipientType,
          custom_email: customRecipientEmail,
          user_id: selectedUserId,
        };
        finalActionValue = JSON.stringify(emailConfig);

        if (recipientType === 'lead') {
          finalNotificationEmail = '{lead_email}';
        } else if (recipientType === 'assigned_agent') {
          finalNotificationEmail = '{agent_email}';
        } else if (recipientType === 'user') {
          const u = meta?.users.find((user) => user.id === Number(selectedUserId));
          finalNotificationEmail = u ? u.email : '';
        } else {
          finalNotificationEmail = customRecipientEmail;
        }
      }

      const payload: Partial<PipelineAutomation> = {
        name: name.trim(),
        agency_id: agencyId ? Number(agencyId) : undefined,
        workspace_id: workspaceId ? Number(workspaceId) : undefined,
        stage_id: stageId ? Number(stageId) : undefined,
        trigger_type: triggerType,
        condition_type: conditionType,
        condition_value: conditionValue || undefined,
        action_type: actionType,
        action_value: finalActionValue || undefined,
        notification_email: finalNotificationEmail || undefined,
      };

      if (editingAutomation) {
        const updated = await automationService.updateAutomation(editingAutomation.id, payload);
        setAutomations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        toast.success('Automatización actualizada');
      } else {
        const created = await automationService.createAutomation(payload);
        setAutomations((prev) => [created, ...prev]);
        toast.success('Automatización creada exitosamente');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar la automatización');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (auto: PipelineAutomation) => {
    try {
      const updated = await automationService.updateAutomation(auto.id, {
        status: !auto.status,
      });
      setAutomations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      toast.success(updated.status ? 'Automatización activada' : 'Automatización desactivada');
    } catch (err) {
      console.error(err);
      toast.error('Error al cambiar estado');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Deseas eliminar esta regla de automatización?')) return;
    try {
      await automationService.deleteAutomation(id);
      setAutomations((prev) => prev.filter((a) => a.id !== id));
      toast.success('Automatización eliminada');
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar automatización');
    }
  };

  // Filtered Workspaces based on chosen agency in modal
  const availableWorkspacesModal = meta?.workspaces
    ? agencyId
      ? meta.workspaces.filter((w) => !w.agency_id || w.agency_id === Number(agencyId))
      : meta.workspaces
    : [];

  const filteredAutomations = automations.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.trigger_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.action_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWorkspace = filterWorkspaceId ? a.workspace_id === Number(filterWorkspaceId) : true;

    return matchesSearch && matchesWorkspace;
  });

  const getTriggerBadge = (trigger: string) => {
    switch (trigger) {
      case 'lead_created':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">Nuevo Lead</span>;
      case 'stage_changed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">Cambio Etapa</span>;
      case 'due_date_reached':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">Fecha Límite</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800">Tarea Lista</span>;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'send_lead_email':
      case 'send_email':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 flex items-center gap-1"><Mail className="w-3 h-3" /> Enviar Email</span>;
      case 'change_stage':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800 flex items-center gap-1"><Layers className="w-3 h-3" /> Cambiar Etapa</span>;
      case 'assign_user':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-violet-50 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800 flex items-center gap-1"><UserCheck className="w-3 h-3" /> Reasignar Asesor</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 flex items-center gap-1"><Send className="w-3 h-3" /> Crear Tarea</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black border border-amber-200 dark:border-amber-800">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Motor de Automatizaciones & Reglas
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Configura acciones automáticas, envíos de correo en Texto Enriquecido/HTML y asignaciones por Workspace.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Automatización</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar automatizaciones..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Workspace Filter */}
          {meta?.workspaces && meta.workspaces.length > 0 && (
            <div className="w-full sm:w-60">
              <select
                value={filterWorkspaceId}
                onChange={(e) => setFilterWorkspaceId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="">-- Todos los Workspaces --</option>
                {meta.workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    Workspace: {ws.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>Reglas Activas: {automations.filter((a) => a.status).length} / {automations.length}</span>
        </div>
      </div>

      {/* Automations Data Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium text-sm flex justify-center items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <Clock className="w-5 h-5 animate-spin text-blue-600" />
          <span>Cargando motor de automatizaciones...</span>
        </div>
      ) : filteredAutomations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No hay automatizaciones configuradas</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Crea tu primera automatización para optimizar los flujos de trabajo de tu agencia.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:bg-blue-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Automatización</span>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-4 px-6 text-center">Estado</th>
                  <th className="py-4 px-6">Regla / Workspace</th>
                  <th className="py-4 px-6 text-center">Detonador (Trigger)</th>
                  <th className="py-4 px-6 text-center">Acción Ejecutada</th>
                  <th className="py-4 px-6">Detalles de la Acción</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredAutomations.map((auto) => (
                  <tr
                    key={auto.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Status Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleStatus(auto)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          auto.status
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}
                      >
                        {auto.status ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Activo</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Inactivo</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Name & Workspace / Stage */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {auto.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          {auto.workspace ? (
                            <span className="px-2 py-0.5 rounded-md font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {auto.workspace.name}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              Todos los Workspaces
                            </span>
                          )}

                          {auto.stage && (
                            <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              Etapa: {auto.stage.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Trigger Badge */}
                    <td className="py-4 px-6 text-center">
                      {getTriggerBadge(auto.trigger_type)}
                    </td>

                    {/* Action Badge */}
                    <td className="py-4 px-6 text-center">
                      {getActionBadge(auto.action_type)}
                    </td>

                    {/* Action Detail */}
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      {auto.notification_email ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{auto.notification_email}</span>
                        </div>
                      ) : auto.action_value ? (
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs block">
                          {auto.action_value.startsWith('{') ? 'Plantilla de Correo Configurada' : auto.action_value}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Ejecución automática</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(auto)}
                          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Editar Automatización"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(auto.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Eliminar Automatización"
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
        </div>
      )}

      {/* CREATE / EDIT AUTOMATION MODAL */}
      {isModalOpen && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  {editingAutomation ? 'Editar Automatización' : 'Nueva Regla de Automatización'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Rule Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Nombre de la Automatización *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Bienvenida automática a nuevos prospectos"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Agency & Workspace Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {meta?.agencies && meta.agencies.length > 0 && (
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-blue-500" /> Agencia
                      </label>
                      <select
                        value={agencyId}
                        onChange={(e) => {
                          const val = e.target.value ? Number(e.target.value) : '';
                          setAgencyId(val);
                          setWorkspaceId('');
                        }}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="">-- Todas las Agencias --</option>
                        {meta.agencies.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-purple-500" /> Workspace Asignado
                    </label>
                    <select
                      value={workspaceId}
                      onChange={(e) => setWorkspaceId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="">-- Todos los Workspaces --</option>
                      {availableWorkspacesModal.map((ws) => (
                        <option key={ws.id} value={ws.id}>
                          {ws.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Trigger Type */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">¿Cuándo se ejecuta? (Detonador) *</label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    {meta?.triggers.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label} ({t.description})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Type & Stage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Condición de Ejecución</label>
                    <select
                      value={conditionType}
                      onChange={(e) => setConditionType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none"
                    >
                      {meta?.conditions.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Etapa Relacionada (Opcional)</label>
                    <select
                      value={stageId}
                      onChange={(e) => setStageId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="">-- Cualquier Etapa --</option>
                      {meta?.stages.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Type */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">¿Qué acción debe realizar el sistema? *</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    {meta?.actions.map((act) => (
                      <option key={act.key} value={act.key}>
                        {act.label} ({act.description})
                      </option>
                    ))}
                  </select>
                </div>

                {/* EMAIL ACTIONS SECTION */}
                {(actionType === 'send_lead_email' || actionType === 'send_email') && (
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>Configuración del Correo Electrónico</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Previsualizar Correo</span>
                      </button>
                    </div>

                    {/* Recipient Selection Options */}
                    <div className="space-y-2">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Destinatario del Correo *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setRecipientType('lead')}
                          className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            recipientType === 'lead'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <User className="w-4 h-4" />
                          <span>Correo del Lead</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRecipientType('assigned_agent')}
                          className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            recipientType === 'assigned_agent'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Asesor Asignado</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRecipientType('user')}
                          className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            recipientType === 'user'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          <span>Usuario Agencia</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRecipientType('custom')}
                          className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            recipientType === 'custom'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <Mail className="w-4 h-4" />
                          <span>Correo Manual</span>
                        </button>
                      </div>

                      {/* Sub-inputs for recipient */}
                      {recipientType === 'user' && (
                        <div className="pt-1">
                          <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : '')}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white"
                          >
                            <option value="">-- Seleccionar Usuario de la Agencia --</option>
                            {meta?.users.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name} ({u.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {recipientType === 'custom' && (
                        <div className="pt-1">
                          <input
                            type="email"
                            required
                            value={customRecipientEmail}
                            onChange={(e) => setCustomRecipientEmail(e.target.value)}
                            placeholder="ejemplo@agencia.com"
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>

                    {/* Email Subject */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Asunto del Correo *</label>
                        <span className="text-[10px] text-slate-400">Puedes usar shortcodes</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Ej: Notificación para {lead_name}"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    {/* Shortcodes Selector Bar */}
                    <div className="space-y-1.5 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1 font-bold text-[11px] text-slate-600 dark:text-slate-400">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Insertar Shortcodes Dinámicos del Lead:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {AVAILABLE_SHORTCODES.map((sc) => (
                          <button
                            key={sc.tag}
                            type="button"
                            onClick={() => handleInsertShortcode(sc.tag, 'body')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-mono font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                            title={`Ejemplo: ${sc.example}`}
                          >
                            + {sc.tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Editor Mode Switcher (Texto Enriquecido vs HTML) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Cuerpo del Mensaje *</label>
                        <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl text-[11px]">
                          <button
                            type="button"
                            onClick={() => setEmailEditorMode('wysiwyg')}
                            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              emailEditorMode === 'wysiwyg'
                                ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Texto Enriquecido</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEmailEditorMode('html')}
                            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              emailEditorMode === 'html'
                                ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <Code className="w-3.5 h-3.5" />
                            <span>HTML Puro</span>
                          </button>
                        </div>
                      </div>

                      {emailEditorMode === 'wysiwyg' ? (
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                          <ReactQuill
                            theme="snow"
                            value={emailBody}
                            onChange={setEmailBody}
                            className="h-44 mb-12"
                          />
                        </div>
                      ) : (
                        <textarea
                          rows={8}
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          placeholder="<div style='font-family: Arial...'>Contenido HTML Puro aquí</div>"
                          className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Task Creation Action Value */}
                {actionType === 'create_task' && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Título de la Tarea Automática *</label>
                    <input
                      type="text"
                      required
                      value={actionValue}
                      onChange={(e) => setActionValue(e.target.value)}
                      placeholder="Ej: Llamar al cliente en las primeras 24h"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                )}

                {/* Assign User Action Value */}
                {actionType === 'assign_user' && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Asesor a Asignar *</label>
                    <select
                      value={actionValue}
                      onChange={(e) => setActionValue(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none font-bold"
                    >
                      <option value="">-- Seleccionar Asesor --</option>
                      {meta?.users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Modal Footer Buttons */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                  >
                    {submitting ? 'Guardando...' : editingAutomation ? 'Guardar Cambios' : 'Crear Automatización'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* LIVE EMAIL PREVIEW MODAL */}
      {isPreviewOpen && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[10000] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>Previsualización en Tiempo Real del Correo</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Device Selector */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        previewDevice === 'desktop'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Escritorio</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        previewDevice === 'mobile'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Móvil</span>
                    </button>
                  </div>

                  <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sample Data Controls */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Prospecto Prueba:</span>
                  <input
                    type="text"
                    value={testLead.name}
                    onChange={(e) => setTestLead({ ...testLead, name: e.target.value })}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Email Prueba:</span>
                  <input
                    type="text"
                    value={testLead.email}
                    onChange={(e) => setTestLead({ ...testLead, email: e.target.value })}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Asesor Prueba:</span>
                  <input
                    type="text"
                    value={testLead.agent}
                    onChange={(e) => setTestLead({ ...testLead, agent: e.target.value })}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Agencia Prueba:</span>
                  <input
                    type="text"
                    value={testLead.agency}
                    onChange={(e) => setTestLead({ ...testLead, agency: e.target.value })}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* Email Render Container */}
              <div className="flex-1 overflow-y-auto flex justify-center bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div
                  className={`bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${
                    previewDevice === 'mobile' ? 'w-full max-w-sm min-h-[500px]' : 'w-full max-w-2xl min-h-[400px]'
                  }`}
                >
                  {/* Email Mockup Bar */}
                  <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 space-y-1">
                    <div className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                      <span>De: {testLead.agency} &lt;noreply@agencia.com&gt;</span>
                      <span>Para: {getSubstitutedContent(recipientType === 'custom' ? customRecipientEmail : recipientType === 'assigned_agent' ? '{agent_email}' : testLead.email)}</span>
                    </div>
                    <div className="text-sm font-extrabold text-white">
                      {getSubstitutedContent(emailSubject) || 'Sin asunto'}
                    </div>
                  </div>

                  {/* Email Body Rendered */}
                  <div
                    className="p-6 text-slate-800 text-sm leading-relaxed overflow-y-auto flex-1 prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: getSubstitutedContent(emailBody) || '<p style="color: #94a3b8; font-style: italic;">Sin contenido de mensaje...</p>',
                    }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end border-t border-slate-200 dark:border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-xs hover:opacity-90 cursor-pointer"
                >
                  Cerrar Previsualización
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
