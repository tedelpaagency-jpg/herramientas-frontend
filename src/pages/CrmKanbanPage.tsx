import React, { useEffect, useState } from 'react';
import { WorkspaceStage, CrmPipelineItem } from '../types';
import crmService from '../services/crmService';
import { Kanban, MessageSquare, DollarSign } from 'lucide-react';

export const CrmKanbanPage: React.FC = () => {
  const [stages, setStages] = useState<WorkspaceStage[]>([]);
  const [pipelines, setPipelines] = useState<CrmPipelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeActivityModal, setActiveActivityModal] = useState<number | null>(null);
  const [activityNote, setActivityNote] = useState('');
  const [activityType, setActivityType] = useState('llamada');

  const fetchKanban = async () => {
    setIsLoading(true);
    try {
      const data = await crmService.getPipelines();
      setStages(data.stages.length > 0 ? data.stages : [
        { id: 1, name: 'Lead Inicial', order: 1 },
        { id: 2, name: 'Contacto Establecido', order: 2 },
        { id: 3, name: 'Propuesta Enviada', order: 3 },
        { id: 4, name: 'Negociación', order: 4 },
        { id: 5, name: 'Cierre Ganado', order: 5 },
      ]);
      setPipelines(data.pipelines);
    } catch (err) {
      console.error('Error loading CRM Kanban:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKanban();
  }, []);

  const handleMoveStage = async (pipelineId: number, newStageId: number) => {
    try {
      await crmService.moveStage(pipelineId, newStageId);
      setPipelines(pipelines.map(p => p.id === pipelineId ? { ...p, stage_id: newStageId } : p));
    } catch (err) {
      console.error('Error moving stage:', err);
    }
  };

  const handleLogActivity = async (e: React.FormEvent, clientId: number) => {
    e.preventDefault();
    if (!activityNote) return;

    try {
      await crmService.logActivity(clientId, activityType, activityNote);
      alert('Actividad registrada con éxito.');
      setActiveActivityModal(null);
      setActivityNote('');
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Kanban className="w-7 h-7 text-blue-600" />
            CRM & Embudo de Ventas SANTUN
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Gestión de oportunidades comerciales vía `/v1/crm/move-stage`.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
          {stages.map((stage) => {
            const itemsInStage = pipelines.filter(p => p.stage_id === stage.id);
            return (
              <div
                key={stage.id}
                className="w-72 flex-shrink-0 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col max-h-[75vh]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-800">{stage.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    {itemsInStage.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {itemsInStage.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl font-medium">
                      Sin oportunidades
                    </div>
                  ) : (
                    itemsInStage.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-600 transition-all shadow-2xs hover:shadow-sm"
                      >
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h4>
                        {item.client && (
                          <p className="text-xs text-slate-500 mt-1 font-medium">
                            {item.client.first_name} {item.client.last_name}
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-600 flex items-center">
                            <DollarSign className="w-3.5 h-3.5" />
                            {Number(item.deal_value || 0).toLocaleString()}
                          </span>

                          <button
                            onClick={() => setActiveActivityModal(item.client_id || item.id)}
                            className="p-1 text-slate-400 hover:text-blue-600"
                            title="Registrar Actividad"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Mover a:</span>
                          <select
                            value={item.stage_id}
                            onChange={(e) => handleMoveStage(item.id, Number(e.target.value))}
                            className="bg-white border border-slate-200 text-slate-700 rounded px-2 py-0.5 text-[10px] focus:outline-none"
                          >
                            {stages.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log Activity Modal */}
      {activeActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Registrar Actividad Comercial</h3>
            <form onSubmit={(e) => handleLogActivity(e, activeActivityModal)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Actividad</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F5F7] border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none"
                >
                  <option value="llamada">Llamada Telefónica</option>
                  <option value="reunion">Reunión / Cita</option>
                  <option value="correo">Envío de Correo</option>
                  <option value="visita">Visita a Inmueble</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Detalle</label>
                <textarea
                  required
                  rows={3}
                  value={activityNote}
                  onChange={(e) => setActivityNote(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F5F7] border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none"
                  placeholder="Detalles sobre el contacto realizado..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveActivityModal(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmKanbanPage;
