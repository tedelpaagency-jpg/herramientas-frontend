import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { automationService, PipelineAutomation, AutomationMeta } from '../services/automationService';
import Portal from '../components/Portal';

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<PipelineAutomation[]>([]);
  const [meta, setMeta] = useState<AutomationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAutomation, setEditingAutomation] = useState<PipelineAutomation | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [triggerType, setTriggerType] = useState<string>('lead_created');
  const [conditionType, setConditionType] = useState<string>('always');
  const [conditionValue, setConditionValue] = useState<string>('');
  const [actionType, setActionType] = useState<string>('send_lead_email');
  const [actionValue, setActionValue] = useState<string>('');
  const [notificationEmail, setNotificationEmail] = useState<string>('');
  const [stageId, setStageId] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

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
    setTriggerType('lead_created');
    setConditionType('always');
    setConditionValue('');
    setActionType('send_lead_email');
    setActionValue('');
    setNotificationEmail('');
    setStageId('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (auto: PipelineAutomation) => {
    setEditingAutomation(auto);
    setName(auto.name);
    setTriggerType(auto.trigger_type);
    setConditionType(auto.condition_type || 'always');
    setConditionValue(auto.condition_value || '');
    setActionType(auto.action_type);
    setActionValue(auto.action_value || '');
    setNotificationEmail(auto.notification_email || '');
    setStageId(auto.stage_id || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre de la automatización es obligatorio');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<PipelineAutomation> = {
        name: name.trim(),
        trigger_type: triggerType,
        condition_type: conditionType,
        condition_value: conditionValue || undefined,
        action_type: actionType,
        action_value: actionValue || undefined,
        notification_email: notificationEmail || undefined,
        stage_id: stageId ? Number(stageId) : undefined,
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

  const filteredAutomations = automations.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.trigger_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.action_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Configura acciones automáticas al registrar prospectos, cambiar etapas o vencer compromisos.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Automatización</span>
        </button>
      </div>

      {/* Search & Stats Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar automatizaciones por nombre..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
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
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:bg-blue-700"
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
                  <th className="py-4 px-6">Regla / Automatización</th>
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
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
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

                    {/* Name & Stage */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {auto.name}
                        </div>
                        {auto.stage && (
                          <div className="text-[10px] font-bold text-slate-400">
                            Etapa vinculada: <span className="text-slate-600 dark:text-slate-300">{auto.stage.name}</span>
                          </div>
                        )}
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
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {auto.action_value}
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
                          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Editar Automatización"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(auto.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
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
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  {editingAutomation ? 'Editar Automatización' : 'Nueva Regla de Automatización'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
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
                    placeholder="Ej: Notificar a administración sobre nuevos prospectos"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
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

                {/* Condition Type */}
                <div className="grid grid-cols-2 gap-3">
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

                {/* Action Value / Email Input according to Action */}
                {(actionType === 'send_lead_email' || actionType === 'send_email') && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Correo Electrónico de Notificación *</label>
                    <input
                      type="email"
                      required
                      value={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.value)}
                      placeholder="ejemplo@agencia.com"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                )}

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

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
                  >
                    {submitting ? 'Guardando...' : editingAutomation ? 'Guardar Cambios' : 'Crear Automatización'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
