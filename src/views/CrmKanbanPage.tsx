'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Workspace, WorkspaceStage, CrmPipelineItem, PipelineActivity, PipelineTask, PipelineProposal, PipelinePayment, Client } from '../types';

import crmService from '../services/crmService';
import userService from '../services/userService';
import workspaceMetaService from '../services/workspaceMetaService';
import { WorkspaceMetaModal } from '../components/WorkspaceMetaModal';
import { WorkspaceCustomFieldsModal } from '../components/WorkspaceCustomFieldsModal';
import { LeadCampaignDetailsModal } from '../components/LeadCampaignDetailsModal';
import Portal from '../components/Portal';
import { 
  Kanban, MessageSquare, DollarSign, Plus, CheckSquare, 
  FileText, Link2, Calendar, Phone, Mail, Clock, Trash2, 
  Check, Layers, Settings, X, ExternalLink, ArrowLeft, ArrowRight,
  UserPlus, MoreVertical, Edit3, FileSpreadsheet, Share2, Sliders, Info, GripVertical,
  ChevronLeft, ChevronRight, AlertCircle, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const CrmKanbanPage: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.role === 'superadmin' ||
    user?.roles?.some((r) => r.name === 'super_admin' || r.name === 'superadmin');
  const isAdmin = user?.role === 'admin' || user?.roles?.some((r) => r.name === 'admin');
  const userPermNamesLower = user?.permissions?.map((p: any) => typeof p === 'string' ? p.toLowerCase() : (p?.name || '').toLowerCase()) || [];

  const canCreateLeads = isSuperAdmin || userPermNamesLower.includes('leads.create') || userPermNamesLower.includes('leads.create_leads');
  const canEditLeads = isSuperAdmin || userPermNamesLower.includes('leads.edit') || userPermNamesLower.includes('leads.edit_leads');
  const canDeleteLeads = isSuperAdmin || userPermNamesLower.includes('leads.delete') || userPermNamesLower.includes('leads.delete_leads');
  const canAssignLeads = isSuperAdmin || userPermNamesLower.includes('leads.assign') || userPermNamesLower.includes('leads.assign_agent') || userPermNamesLower.includes('leads.edit');

  const canCreateStages = isSuperAdmin || userPermNamesLower.includes('stages.create') || userPermNamesLower.includes('stages.create_stages');
  const canEditStages = isSuperAdmin || userPermNamesLower.includes('stages.edit') || userPermNamesLower.includes('stages.edit_stages');
  const canDeleteStages = isSuperAdmin || userPermNamesLower.includes('stages.delete') || userPermNamesLower.includes('stages.delete_stages');
  const canReorderStages = isSuperAdmin || userPermNamesLower.includes('stages.reorder') || userPermNamesLower.includes('stages.reorder_stages') || userPermNamesLower.includes('stages.edit');
  const searchParams = useSearchParams();
  const workspaceIdFromUrl = searchParams?.get('workspace_id');

  const boardRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const [stages, setStages] = useState<WorkspaceStage[]>([]);
  const [pipelines, setPipelines] = useState<CrmPipelineItem[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Drag and Drop State
  const [draggedCardId, setDraggedCardId] = useState<number | null>(null);
  const [draggedStageIndex, setDraggedStageIndex] = useState<number | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<number | null>(null);

  // Scroll Helpers
  const scrollBoardLeft = () => {
    if (boardRef.current) {
      boardRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollBoardRight = () => {
    if (boardRef.current) {
      boardRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const scrollToStage = (stageId: number) => {
    const stageEl = stageRefs.current[stageId];
    if (stageEl) {
      stageEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };


  // Meta Integration Modals State

  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [isCustomFieldsModalOpen, setIsCustomFieldsModalOpen] = useState(false);
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);
  const [isLeadCampaignModalOpen, setIsLeadCampaignModalOpen] = useState(false);


  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<CrmPipelineItem | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'activities' | 'tasks' | 'proposals' | 'payments'>('details');

  // Stage Menu & Edit Stage State
  const [openStageMenuId, setOpenStageMenuId] = useState<number | null>(null);
  const [isEditStageOpen, setIsEditStageOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<WorkspaceStage | null>(null);
  const [editStageName, setEditStageName] = useState('');
  const [editStageColor, setEditStageColor] = useState('#3B82F6');

  // Create Lead Modal State
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [leadFirstName, setLeadFirstName] = useState('');
  const [leadLastName, setLeadLastName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadValue, setLeadValue] = useState<number>(0);
  const [leadStageId, setLeadStageId] = useState<number | ''>('');
  const [leadPriority, setLeadPriority] = useState<number>(1);
  const [leadSource, setLeadSource] = useState<string>('Manual CRM');
  const [leadClassification, setLeadClassification] = useState<string>('');

  // Activity Form State
  const [activityType, setActivityType] = useState('call');
  const [activityContent, setActivityContent] = useState('');

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueAt, setTaskDueAt] = useState('');

  // Proposal Form State
  const [proposalItem, setProposalItem] = useState('');
  const [proposalQty, setProposalQty] = useState(1);
  const [proposalPrice, setProposalPrice] = useState(0);

  // Payment Form State
  const [paymentName, setPaymentName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [generatedUrl, setGeneratedUrl] = useState('');

  // New Stage Modal State
  const [isAddStageOpen, setIsAddStageOpen] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('#3B82F6');

  // Import Leads Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStageId, setImportStageId] = useState<number | ''>('');
  const [isImporting, setIsImporting] = useState(false);

  const fetchKanban = async () => {
    setIsLoading(true);
    try {
      const data: any = await crmService.getPipelines(
        workspaceIdFromUrl ? { workspace_id: workspaceIdFromUrl } : undefined
      );
      const rawWorkspace = data?.workspace || data?.data?.workspace || null;
      const rawStages = Array.isArray(data?.stages) 
        ? data.stages 
        : (Array.isArray(data?.data?.stages) ? data.data.stages : []);
      const rawPipelines = Array.isArray(data?.pipelines) 
        ? data.pipelines 
        : (Array.isArray(data?.data?.pipelines) ? data.data.pipelines : []);

      // Ensure stages are sorted by sort_order
      const sortedStages = [...rawStages].sort((a, b) => (a.sort_order || a.order || 0) - (b.sort_order || b.order || 0));
      setCurrentWorkspace(rawWorkspace);
      setStages(sortedStages);
      setPipelines(rawPipelines);
    } catch (err: any) {
      console.error('Error loading CRM Kanban:', err);
      const errMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Error al cargar el CRM Kanban';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Agent Assignment & Check Selection State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [assignStageTarget, setAssignStageTarget] = useState<WorkspaceStage | null>(null);
  const [assignAgentUserId, setAssignAgentUserId] = useState<string>('');
  const [stageModalLeadIds, setStageModalLeadIds] = useState<number[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);
  const [bulkAgentUserId, setBulkAgentUserId] = useState<string>('');
  const [isBulkAssigning, setIsBulkAssigning] = useState<boolean>(false);

  const toggleSelectLead = (id: number) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectStageLeads = (stageId: number) => {
    const stageLeadIds = pipelines.filter((p) => p.stage_id === stageId).map((p) => p.id);
    const allSelected = stageLeadIds.length > 0 && stageLeadIds.every((id) => selectedLeadIds.includes(id));

    if (allSelected) {
      setSelectedLeadIds((prev) => prev.filter((id) => !stageLeadIds.includes(id)));
    } else {
      setSelectedLeadIds((prev) => Array.from(new Set([...prev, ...stageLeadIds])));
    }
  };

  const handleBulkAssignAgent = async () => {
    if (selectedLeadIds.length === 0) return;
    setIsBulkAssigning(true);
    try {
      const newUserId = bulkAgentUserId ? Number(bulkAgentUserId) : null;
      await crmService.assignAgent(selectedLeadIds, newUserId);
      toast.success(`${selectedLeadIds.length} prospectos asignados correctamente`);
      setSelectedLeadIds([]);
      fetchKanban();
    } catch (err) {
      toast.error('Error al realizar la asignación masiva');
    } finally {
      setIsBulkAssigning(false);
    }
  };

  const fetchSystemUsers = async () => {
    try {
      const res: any = await userService.getUsers({ per_page: 200 });
      const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.data) ? res.data.data : []));
      setUsersList(list);
    } catch (err) {
      console.error('Error fetching users list for agent assignment:', err);
    }
  };

  useEffect(() => {
    fetchKanban();
    fetchSystemUsers();

    const handleGlobalClick = () => setOpenStageMenuId(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [workspaceIdFromUrl]);


  const handleExportStageLeads = (stage: WorkspaceStage) => {
    const itemsInStage = pipelines.filter(p => p.stage_id === stage.id);
    if (itemsInStage.length === 0) {
      toast.error(`No hay prospectos en la etapa "${stage.name}" para exportar`);
      return;
    }

    const headers = ['ID', 'Nombre', 'Correo', 'Teléfono', 'Valor Estimado ($)', 'Etapa', 'Prioridad', 'Origen', 'Fecha de Registro'];
    const rows = itemsInStage.map(item => [
      item.id,
      `"${(item.client?.name || item.title || '').replace(/"/g, '""')}"`,
      `"${(item.client?.email || '').replace(/"/g, '""')}"`,
      `"${(item.client?.phone || '').replace(/"/g, '""')}"`,
      item.estimated_value || item.deal_value || 0,
      `"${(stage.name || '').replace(/"/g, '""')}"`,
      item.priority === 3 ? 'Alta' : item.priority === 2 ? 'Media' : 'Baja',
      `"${(item.client?.source || 'CRM').replace(/"/g, '""')}"`,
      `"${(item.created_at || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = stage.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.href = url;
    link.setAttribute('download', `leads_${safeName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Leads de "${stage.name}" exportados exitosamente`);
  };

  const handleOpenEditStageModal = (stage: WorkspaceStage) => {
    setEditingStage(stage);
    setEditStageName(stage.name);
    setEditStageColor(stage.color || '#3B82F6');
    setOpenStageMenuId(null);
    setIsEditStageOpen(true);
  };

  const handleUpdateStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage || !editStageName.trim()) return;

    try {
      await crmService.updateStage(editingStage.id, {
        name: editStageName.trim(),
        color: editStageColor,
      });

      setStages(prev => prev.map(s => s.id === editingStage.id ? { ...s, name: editStageName.trim(), color: editStageColor } : s));
      setIsEditStageOpen(false);
      setEditingStage(null);
      toast.success('Etapa actualizada exitosamente');
    } catch (err) {
      console.error('Error updating stage:', err);
      toast.error('Error al actualizar la etapa');
    }
  };

  const handleDeleteStage = async (stageId?: number) => {
    const targetId = stageId || editingStage?.id;
    if (!targetId) return;

    const targetStage = stages.find(s => s.id === targetId) || editingStage;
    const stageName = targetStage?.name || 'la etapa';

    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar la etapa "${stageName}"?\n\nEsta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await crmService.deleteStage(targetId);
      setStages(prev => prev.filter(s => s.id !== targetId));
      if (editingStage?.id === targetId) {
        setIsEditStageOpen(false);
        setEditingStage(null);
      }
      toast.success(`Etapa "${stageName}" eliminada exitosamente`);
    } catch (err: any) {
      console.error('Error deleting stage:', err);
      toast.error(err.response?.data?.message || 'Error al eliminar la etapa');
    }
  };

  const handleMoveStage = async (pipelineId: number, newStageId: number) => {
    try {
      await crmService.moveStage(pipelineId, newStageId);
      setPipelines(prev => prev.map(p => p.id === pipelineId ? { ...p, stage_id: newStageId } : p));
      if (selectedItem && selectedItem.id === pipelineId) {
        setSelectedItem(prev => prev ? { ...prev, stage_id: newStageId } : null);
      }
      toast.success('Prospecto movido de etapa');
    } catch (err) {
      console.error('Error moving stage:', err);
      toast.error('No se pudo mover el prospecto');
    }
  };

  const handleOpenAddLeadModal = (defaultStageId?: number) => {
    setLeadFirstName('');
    setLeadLastName('');
    setLeadEmail('');
    setLeadPhone('');
    setLeadValue(0);
    setLeadPriority(1);
    setLeadSource('Manual CRM');
    setLeadClassification('');
    setLeadStageId(defaultStageId || (stages[0]?.id ?? ''));
    setIsAddLeadOpen(true);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFirstName.trim() || !leadStageId) return;

    try {
      const newPipelineCard = await crmService.createLead({
        first_name: leadFirstName,
        last_name: leadLastName,
        email: leadEmail,
        phone: leadPhone,
        stage_id: Number(leadStageId),
        estimated_value: leadValue,
        priority: leadPriority,
        source: leadSource,
        classification: leadClassification || undefined,
      });

      setPipelines(prev => [newPipelineCard, ...prev]);
      setIsAddLeadOpen(false);
      toast.success('¡Nuevo prospecto creado exitosamente!');
    } catch (err: any) {
      console.error('Error creating lead:', err);
      const errMsg = err?.response?.data?.message || err?.response?.data?.error || 'Error al crear el prospecto';
      toast.error(errMsg);
    }
  };

  const handleMoveStageHorizontal = async (stageIndex: number, direction: 'left' | 'right') => {
    if (direction === 'left' && stageIndex === 0) return;
    if (direction === 'right' && stageIndex === stages.length - 1) return;

    const newStages = [...stages];
    const targetIndex = direction === 'left' ? stageIndex - 1 : stageIndex + 1;

    // Swap elements
    const temp = newStages[stageIndex];
    newStages[stageIndex] = newStages[targetIndex];
    newStages[targetIndex] = temp;

    // Re-assign sort_order
    const updatedStages = newStages.map((stg, idx) => ({
      ...stg,
      sort_order: idx + 1,
    }));

    setStages(updatedStages);

    try {
      await crmService.reorderStages(updatedStages.map(s => ({ id: s.id, sort_order: s.sort_order || 1 })));
      toast.success('Orden de etapas actualizado');
    } catch (err) {
      console.error('Error reordering stages:', err);
      toast.error('No se pudo guardar el nuevo orden de etapas');
    }
  };

  const handleReorderStagesDrag = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= stages.length || toIndex >= stages.length) return;

    const newStages = [...stages];
    const [movedStage] = newStages.splice(fromIndex, 1);
    newStages.splice(toIndex, 0, movedStage);

    const updatedStages = newStages.map((s, idx) => ({
      ...s,
      sort_order: idx + 1,
    }));

    setStages(updatedStages);

    try {
      await crmService.reorderStages(updatedStages.map(s => ({ id: s.id, sort_order: s.sort_order || 1 })));
      toast.success('Orden de etapas actualizado');
    } catch (err) {
      console.error('Error reordering stages:', err);
      toast.error('No se pudo guardar el nuevo orden de etapas');
    }
  };


  const handleAddStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    try {
      const stage = await crmService.createStage({
        name: newStageName,
        color: newStageColor,
      });
      setStages(prev => [...prev, stage]);
      setIsAddStageOpen(false);
      setNewStageName('');
      toast.success('Nueva etapa creada');
    } catch (err) {
      console.error('Error adding stage:', err);
      toast.error('Error al crear la etapa');
    }
  };

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !activityContent.trim()) return;

    try {
      const newAct = await crmService.logActivity(selectedItem.id, activityType, activityContent);
      setSelectedItem(prev => prev ? {
        ...prev,
        activities: [newAct, ...(prev.activities || [])]
      } : null);
      setPipelines(prev => prev.map(p => p.id === selectedItem.id ? {
        ...p,
        activities: [newAct, ...(p.activities || [])]
      } : p));
      setActivityContent('');
      toast.success('Actividad registrada');
    } catch (err) {
      console.error('Error logging activity:', err);
      toast.error('Error al guardar actividad');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !taskTitle.trim()) return;

    try {
      const newTask = await crmService.addTask({
        client_pipeline_id: selectedItem.id,
        title: taskTitle,
        due_at: taskDueAt || undefined,
      });
      setSelectedItem(prev => prev ? {
        ...prev,
        tasks: [newTask, ...(prev.tasks || [])]
      } : null);
      setTaskTitle('');
      setTaskDueAt('');
      toast.success('Tarea agregada');
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Error al agregar tarea');
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      const updated = await crmService.toggleTask(taskId);
      setSelectedItem(prev => prev ? {
        ...prev,
        tasks: (prev.tasks || []).map(t => t.id === taskId ? updated : t)
      } : null);
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleAddProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !proposalItem.trim()) return;

    try {
      const newProp = await crmService.addProposal({
        client_pipeline_id: selectedItem.id,
        item: proposalItem,
        qty: proposalQty,
        price: proposalPrice,
      });
      setSelectedItem(prev => prev ? {
        ...prev,
        proposals: [...(prev.proposals || []), newProp]
      } : null);
      setProposalItem('');
      setProposalQty(1);
      setProposalPrice(0);
      toast.success('Ítem de propuesta guardado');
    } catch (err) {
      console.error('Error adding proposal:', err);
      toast.error('Error al agregar propuesta');
    }
  };

  const handleDeleteProposal = async (proposalId: number) => {
    try {
      await crmService.deleteProposal(proposalId);
      setSelectedItem(prev => prev ? {
        ...prev,
        proposals: (prev.proposals || []).filter(p => p.id !== proposalId)
      } : null);
      toast.success('Ítem eliminado');
    } catch (err) {
      console.error('Error deleting proposal:', err);
    }
  };

  const handleGeneratePaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !paymentName.trim() || paymentAmount <= 0) return;

    try {
      const res = await crmService.generatePaymentLink({
        client_pipeline_id: selectedItem.id,
        name: paymentName,
        total_amount: paymentAmount,
      });
      const newPay = (res as any).data || res;
      setSelectedItem(prev => prev ? {
        ...prev,
        payments: [newPay, ...(prev.payments || [])]
      } : null);
      setGeneratedUrl(res.payment_url || '');
      setPaymentName('');
      setPaymentAmount(0);
      toast.success('Enlace de pago generado exitosamente');
    } catch (err) {
      console.error('Error generating payment link:', err);
      toast.error('Error al generar enlace de pago');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await crmService.downloadImportTemplate();
      toast.success('Plantilla PLANTILLA_CLIENTES.xlsx descargada');
    } catch (err) {
      console.error('Error downloading template:', err);
      toast.error('Error al descargar la plantilla Excel');
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      toast.error('Selecciona un archivo Excel o CSV para importar');
      return;
    }

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      if (currentWorkspace?.id || workspaceIdFromUrl) {
        formData.append('workspace_id', String(workspaceIdFromUrl || currentWorkspace?.id));
      }
      if (importStageId) {
        formData.append('stage_id', String(importStageId));
      }

      const res = await crmService.importLeads(formData);
      toast.success(res.imported_count > 0 
        ? `¡Éxito! Se importaron ${res.imported_count} prospectos correctamente.` 
        : 'Importación procesada.');
      
      if (res.errors && res.errors.length > 0) {
        toast.error(`Atención: Ocurrieron ${res.errors.length} observaciones en algunas filas.`, { duration: 5000 });
      }

      setIsImportModalOpen(false);
      setImportFile(null);
      fetchKanban();
    } catch (err: any) {
      console.error('Error importing leads:', err);
      toast.error(err.response?.data?.message || 'Error al importar prospectos desde el archivo');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <Kanban className="w-5 h-5" />
            </div>
            CRM & Embudo Comercial
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gestión de prospectos, reordenamiento horizontal de etapas y creación por columna.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/workspaces"
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all active:scale-95 border border-slate-200"
            title="Volver al Panel de Workspaces"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Workspaces</span>
          </Link>

          {currentWorkspace && (
            <>
              <button
                onClick={() => setIsMetaModalOpen(true)}
                className={`flex items-center gap-2 px-3.5 py-2.5 font-extrabold text-xs rounded-xl border transition-all active:scale-95 ${
                  currentWorkspace.meta_enabled
                    ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Configurar Integración Meta Leads (Facebook / Instagram)"
              >
                <Share2 className="w-4 h-4 text-blue-600" />
                <span>{currentWorkspace.meta_enabled ? 'Meta Conectado' : 'Configurar Meta'}</span>
              </button>


              <button
                onClick={() => setIsCustomFieldsModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-purple-50 text-purple-700 font-extrabold text-xs rounded-xl border border-purple-200/80 hover:bg-purple-100 transition-all active:scale-95"
                title="Gestionar Campos Personalizados Dinámicos"
              >
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>Custom Fields</span>
              </button>
            </>
          )}

          {canCreateLeads && (
            <button
              onClick={() => handleOpenAddLeadModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              Nuevo Prospecto
            </button>
          )}

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-extrabold text-xs rounded-xl border border-emerald-200/80 shadow-xs transition-all active:scale-95"
            title="Importar prospectos masivamente desde plantilla Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Importar Excel</span>
          </button>

          {canCreateStages && (
            <button
              onClick={() => setIsAddStageOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl border border-blue-200/60 hover:bg-blue-100 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nueva Etapa
            </button>
          )}
        </div>

      </div>

      {/* Stage Quick Navigation & Scroll Bar */}
      {!isLoading && stages.length > 0 && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-0.5">
            <span className="text-[11px] font-black uppercase text-slate-400 mr-1 flex-shrink-0 tracking-wider">
              Ir a Etapa:
            </span>
            {stages.map((stage) => {
              const count = pipelines.filter(p => p.stage_id === stage.id).length;
              return (
                <button
                  key={stage.id}
                  onClick={() => scrollToStage(stage.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all flex-shrink-0"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stage.color || '#3B82F6' }}
                  />
                  <span>{stage.name}</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-white rounded-md border border-slate-200 text-slate-500">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 pl-2 border-l border-slate-200">
            <button
              onClick={scrollBoardLeft}
              className="p-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
              title="Desplazar tablero hacia la izquierda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollBoardRight}
              className="p-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
              title="Desplazar tablero hacia la derecha"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Kanban Board */}
      {isLoading ? (
        <div className="py-20 flex flex-col justify-center items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-400">Cargando tablero CRM...</span>
        </div>
      ) : (
        <div
          ref={boardRef}
          onWheel={(e) => {
            if (boardRef.current && e.deltaY !== 0) {
              boardRef.current.scrollLeft += e.deltaY * 1.3;
            }
          }}
          className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar min-h-[70vh]"
        >
          {stages.map((stage, idx) => {
            const itemsInStage = pipelines.filter(p => Number(p.stage_id) === Number(stage.id));
            const totalStageValue = itemsInStage.reduce((acc, curr) => acc + Number(curr.estimated_value || curr.deal_value || 0), 0);

            return (
              <div
                key={stage.id}
                ref={(el) => { stageRefs.current[stage.id] = el; }}

                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDragEnter={() => setDragOverStageId(stage.id)}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverStageId(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverStageId(null);
                  const dragType = e.dataTransfer.getData('drag_type');
                  if (dragType === 'card') {
                    const pipelineId = e.dataTransfer.getData('pipeline_id');
                    if (pipelineId) {
                      handleMoveStage(Number(pipelineId), stage.id);
                    }
                  } else if (dragType === 'stage') {
                    const fromIndex = Number(e.dataTransfer.getData('stage_index'));
                    handleReorderStagesDrag(fromIndex, idx);
                  }
                }}
                className={`w-80 flex-shrink-0 bg-slate-50/80 rounded-2xl p-4 border transition-all flex flex-col max-h-[75vh] ${
                  dragOverStageId === stage.id
                    ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50/50'
                    : 'border-slate-200/80'
                } ${
                  draggedStageIndex === idx ? 'opacity-40 border-dashed border-blue-500' : ''
                }`}
              >
                {/* Stage Header - Entire header draggable while preserving GripVertical Icon */}
                <div
                  draggable={true}
                  onDragStart={(e) => {
                    e.stopPropagation();
                    e.dataTransfer.setData('drag_type', 'stage');
                    e.dataTransfer.setData('stage_index', String(idx));
                    setDraggedStageIndex(idx);
                  }}
                  onDragEnd={() => {
                    setDraggedStageIndex(null);
                    setDragOverStageId(null);
                  }}
                  className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60 cursor-grab active:cursor-grabbing hover:bg-slate-200/50 p-1.5 rounded-xl transition-all select-none"
                  title="Sujeta toda esta cabecera para reordenar la columna del Kanban"
                >
                  <div className="flex items-center gap-1.5">
                    {canReorderStages && (
                      <div
                        className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-grab"
                        title="Icono de arrastrar etapa"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: stage.color || '#3B82F6' }}
                    />
                    <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{stage.name}</h3>
                  </div>

                  {/* Stage Horizontal Controls & 3-Dots Dropdown Menu */}
                  <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
                    {canReorderStages && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStageHorizontal(idx, 'left');
                          }}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Mover Etapa a la Izquierda"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStageHorizontal(idx, 'right');
                          }}
                          disabled={idx === stages.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Mover Etapa a la Derecha"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {/* 3-Dots Vertical Dropdown Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenStageMenuId(openStageMenuId === stage.id ? null : stage.id);
                        }}
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
                        title="Opciones de Etapa"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openStageMenuId === stage.id && (
                        <div 
                          className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {canCreateLeads && (
                            <button
                              onClick={() => {
                                setOpenStageMenuId(null);
                                handleOpenAddLeadModal(stage.id);
                              }}
                              className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                            >
                              <UserPlus className="w-4 h-4 text-emerald-600" />
                              <span>Agregar Lead</span>
                            </button>
                          )}

                          {canAssignLeads && (
                            <button
                              onClick={() => {
                                setOpenStageMenuId(null);
                                const leadsInStage = pipelines.filter(p => p.stage_id === stage.id).map(p => p.id);
                                setAssignStageTarget(stage);
                                setAssignAgentUserId('');
                                setStageModalLeadIds(leadsInStage);
                              }}
                              className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                            >
                              <UserCheck className="w-4 h-4 text-indigo-600" />
                              <span>Asignar Leads de esta Etapa</span>
                            </button>
                          )}

                          {canEditStages && (
                            <button
                              onClick={() => handleOpenEditStageModal(stage)}
                              className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                              <span>Editar Etapa</span>
                            </button>
                          )}

                          {canDeleteStages && (
                            <button
                              onClick={() => {
                                setOpenStageMenuId(null);
                                handleDeleteStage(stage.id);
                              }}
                              className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-rose-600" />
                              <span>Eliminar Etapa</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setOpenStageMenuId(null);
                              handleExportStageLeads(stage);
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                            <span>Descargar Leads (Excel)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total Stage Value & Card Count */}
                <div className="mb-3 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {itemsInStage.length} Prospectos
                  </span>
                  <span className="text-emerald-600 font-extrabold">${totalStageValue.toLocaleString()}</span>
                </div>

                {/* Pipeline Cards Scroll Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {itemsInStage.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl font-medium space-y-2">
                      <p>Sin oportunidades</p>
                      <button
                        onClick={() => handleOpenAddLeadModal(stage.id)}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-lg border border-emerald-200 hover:bg-emerald-100"
                      >
                        + Crear Lead
                      </button>
                    </div>
                  ) : (
                    itemsInStage.map((item) => {
                      const clientName = item.client?.name || 'Cliente Sin Nombre';
                      const cardValue = Number(item.estimated_value || item.deal_value || 0);
                      const classification = item.client?.classification;
                      const isUrgent = classification === 'urgente';

                      return (
                        <div
                          key={item.id}
                          draggable={true}
                          onDragStart={(e) => {
                            e.stopPropagation();
                            e.dataTransfer.setData('drag_type', 'card');
                            e.dataTransfer.setData('pipeline_id', String(item.id));
                            setDraggedCardId(item.id);
                          }}
                          onDragEnd={() => {
                            setDraggedCardId(null);
                            setDragOverStageId(null);
                          }}
                          onClick={() => {
                            setSelectedItem(item);
                            setActiveTab('details');
                          }}
                          className={`p-4 rounded-xl bg-white border transition-all cursor-grab active:cursor-grabbing group space-y-3 relative overflow-hidden ${
                            isUrgent
                              ? 'border-rose-500 ring-2 ring-rose-500/60 shadow-lg shadow-rose-500/20 bg-rose-50/30 animate-pulse hover:animate-none'
                              : draggedCardId === item.id
                              ? 'opacity-40 scale-95 border-blue-500 border-dashed ring-2 ring-blue-400 shadow-2xs'
                              : 'border-slate-200/80 hover:border-blue-600 shadow-2xs hover:shadow-md'
                          }`}
                        >
                          {/* Urgent Flashing Badge Header */}
                          {isUrgent && (
                            <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg flex items-center justify-between shadow-xs animate-bounce mb-1">
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-yellow-300" />
                                <span>CLIENTE URGENTE</span>
                              </span>
                              <span className="text-[9px] bg-rose-900/80 px-1.5 py-0.5 rounded text-yellow-200">¡ATENCIÓN!</span>
                            </div>
                          )}

                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {classification === 'bueno' && (
                                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  👍 Bueno
                                </span>
                              )}
                              {classification === 'facil' && (
                                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-blue-100 text-blue-800 border border-blue-300">
                                  😊 Fácil
                                </span>
                              )}
                              {classification === 'urgente' && (
                                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-rose-600 text-white border border-rose-700 animate-pulse">
                                  ⚡ Urgente
                                </span>
                              )}
                              <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${
                                item.client?.source === 'meta' || item.client?.meta_lead_id
                                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {item.client?.source === 'meta' || item.client?.meta_lead_id ? 'Meta' : 'Manual'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                              {clientName}
                            </p>

                            {item.client && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedClientForDetails(item.client || null);
                                  setIsLeadCampaignModalOpen(true);
                                }}
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                                title="Ver Ficha de Campaña y Custom Fields"
                              >
                                <Info className="w-3 h-3" />
                                Campaña
                              </button>
                            )}
                          </div>


                          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                            <span className="font-black text-emerald-600 flex items-center">
                              <DollarSign className="w-3.5 h-3.5" />
                              {cardValue.toLocaleString()}
                            </span>

                            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                              {(item.activities?.length || 0) > 0 && (
                                <span className="flex items-center gap-1" title="Actividades">
                                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                                  {item.activities?.length}
                                </span>
                              )}
                              {(item.tasks?.length || 0) > 0 && (
                                <span className="flex items-center gap-1" title="Tareas">
                                  <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
                                  {item.tasks?.length}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Individual Agent Assignment & Stage Move */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] gap-2"
                          >
                            {/* Individual Agent Dropdown */}
                            <div className="flex items-center gap-1 min-w-0 flex-1">
                              <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <select
                                value={item.assigned_user_id || item.client?.assigned_to || ''}
                                onChange={async (e) => {
                                  const val = e.target.value;
                                  const newUserId = val ? Number(val) : undefined;
                                  try {
                                    await crmService.assignAgent([item.id], newUserId || null);
                                    const assignedU = usersList.find(u => u.id === newUserId);
                                    setPipelines(prev => prev.map(p => p.id === item.id ? { ...p, assigned_user_id: newUserId, assignedUser: assignedU } : p));
                                    toast.success('Agente asignado');
                                  } catch (err) {
                                    toast.error('Error al asignar agente');
                                  }
                                }}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-1.5 py-0.5 text-[10px] font-extrabold focus:outline-none hover:bg-white truncate cursor-pointer"
                                title="Asignar agente a este prospecto de forma individual"
                              >
                                <option value="">👤 Sin Asignar</option>
                                {usersList.map((u) => (
                                  <option key={u.id} value={u.id}>
                                    👤 {u.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Stage Move Dropdown */}
                            <div className="flex items-center gap-1 shrink-0">
                              <select
                                value={item.stage_id}
                                onChange={(e) => handleMoveStage(item.id, Number(e.target.value))}
                                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-1.5 py-0.5 text-[10px] font-bold focus:outline-none hover:bg-white cursor-pointer"
                              >
                                {stages.map(s => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Lead */}
      {isAddLeadOpen && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  Registrar Nuevo Prospecto (Lead)
                </h3>
                <button onClick={() => setIsAddLeadOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={leadFirstName}
                      onChange={(e) => setLeadFirstName(e.target.value)}
                      placeholder="Ej: Carlos"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      value={leadLastName}
                      onChange={(e) => setLeadLastName(e.target.value)}
                      placeholder="Ej: Mendoza"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="carlos@correo.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+593 99 123 4567"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Clasificación de Cliente</label>
                    <select
                      value={leadClassification}
                      onChange={(e) => setLeadClassification(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:bg-white"
                    >
                      <option value="">Sin Clasificación</option>
                      <option value="bueno">👍 Bueno</option>
                      <option value="facil">😊 Fácil de tratar</option>
                      <option value="urgente">⚡ Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Etapa Comercial</label>
                    <select
                      required
                      value={leadStageId}
                      onChange={(e) => setLeadStageId(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:bg-white"
                    >
                      {stages.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddLeadOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700"
                  >
                    Guardar Prospecto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* Modal: Add New Stage */}
      {isAddStageOpen && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-slate-900">Agregar Nueva Etapa</h3>
                <button onClick={() => setIsAddStageOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Etapa</label>
                  <input
                    type="text"
                    required
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="Ej: Calificación de Lead"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Color Identificador</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newStageColor}
                      onChange={(e) => setNewStageColor(e.target.value)}
                      className="w-12 h-10 rounded-xl cursor-pointer border border-slate-200 p-1 bg-slate-50"
                    />
                    <span className="text-xs font-mono font-bold text-slate-600">{newStageColor}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddStageOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 active:scale-95"
                  >
                    Crear Etapa
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* Comprehensive Lead Detail Modal */}
      {selectedItem && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
              {/* Modal Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white">
                    {selectedItem.stage?.name || 'Prospecto CRM'}
                  </span>
                  <h3 className="text-xl font-black">{selectedItem.title}</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Cliente: {selectedItem.client?.name || 'N/A'} • {selectedItem.client?.email || 'Sin email'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 gap-2 pt-2">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 ${
                    activeTab === 'details'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Información
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'activities'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Actividades ({selectedItem.activities?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'tasks'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Tareas ({selectedItem.tasks?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'proposals'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Propuesta ({selectedItem.proposals?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'payments'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Cobros ({selectedItem.payments?.length || 0})
                </button>
              </div>

              {/* Modal Body / Tab Contents */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
                {/* TAB: Details */}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Datos Comerciales</h4>
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Valor Estimado:</span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                            ${Number(selectedItem.estimated_value || selectedItem.deal_value || 0).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Etapa Actual:</span>
                          <select
                            value={selectedItem.stage_id}
                            onChange={(e) => handleMoveStage(selectedItem.id, Number(e.target.value))}
                            className="max-w-[210px] w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer truncate"
                          >
                            {stages.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Asesor Asignado:</span>
                          <div className="relative max-w-[210px] w-full">
                            <select
                              value={selectedItem.assigned_user_id || selectedItem.client?.assigned_to || ''}
                              onChange={async (e) => {
                                const val = e.target.value;
                                const newUserId = val ? Number(val) : undefined;
                                try {
                                  await crmService.assignAgent([selectedItem.id], newUserId || null);
                                  const assignedU = usersList.find(u => u.id === newUserId);
                                  setPipelines(prev => prev.map(p => {
                                    if (p.id === selectedItem.id) {
                                      return { ...p, assigned_user_id: newUserId, assignedUser: assignedU || undefined };
                                    }
                                    return p;
                                  }));
                                  setSelectedItem(prev => prev ? { ...prev, assigned_user_id: newUserId, assignedUser: assignedU || undefined } : null);
                                  toast.success('Asesor asignado correctamente');
                                } catch (err) {
                                  toast.error('No se pudo asignar el asesor');
                                }
                              }}
                              className="w-full bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-900/60 rounded-xl pl-3 pr-8 py-1.5 text-xs font-extrabold text-indigo-700 dark:text-indigo-300 focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer appearance-none truncate"
                            >
                              <option value="">-- Sin Asignar --</option>
                              {usersList.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.name} ({u.role || 'Usuario'})
                                </option>
                              ))}
                            </select>
                            <UserCheck className="w-4 h-4 text-indigo-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Contacto del Cliente</h4>
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedItem.client?.phone || 'Sin teléfono'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedItem.client?.email || 'Sin email'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: Activities */}
                {activeTab === 'activities' && (
                  <div className="space-y-6">
                    <form onSubmit={handleLogActivity} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">Registrar Nueva Interacción</h4>
                      <div className="flex gap-3">
                        <select
                          value={activityType}
                          onChange={(e) => setActivityType(e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="call">Llamada</option>
                          <option value="meeting">Reunión</option>
                          <option value="email">Correo</option>
                          <option value="note">Nota Interna</option>
                        </select>
                        <input
                          type="text"
                          required
                          value={activityContent}
                          onChange={(e) => setActivityContent(e.target.value)}
                          placeholder="Detalles sobre el contacto realizado..."
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
                        >
                          Guardar
                        </button>
                      </div>
                    </form>

                    <div className="space-y-3">
                      {(selectedItem.activities || []).length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-400 font-medium">No hay actividades registradas</p>
                      ) : (
                        selectedItem.activities?.map((act) => (
                          <div key={act.id} className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex gap-3 items-start shadow-2xs">
                            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px]">{act.type || 'Interacción'}</span>
                                <span className="text-[10px] text-slate-400">{act.created_at ? new Date(act.created_at).toLocaleDateString() : ''}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 mt-1 font-medium">{act.content || act.note}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: Tasks */}
                {activeTab === 'tasks' && (
                  <div className="space-y-6">
                    <form onSubmit={handleAddTask} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">Agregar Tarea Pendiente</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          placeholder="Ej: Enviar cotización actualizada"
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                        />
                        <input
                          type="date"
                          value={taskDueAt}
                          onChange={(e) => setTaskDueAt(e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
                        >
                          Agregar
                        </button>
                      </div>
                    </form>

                    <div className="space-y-2">
                      {(selectedItem.tasks || []).length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-400 font-medium">No hay tareas pendientes</p>
                      ) : (
                        selectedItem.tasks?.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => handleToggleTask(t.id)}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                              t.is_completed
                                ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${t.is_completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                                {t.is_completed && <Check className="w-3 h-3" />}
                              </div>
                              <span className="font-bold">{t.title}</span>
                            </div>
                            {t.due_at && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                                <Calendar className="w-3 h-3" />
                                {new Date(t.due_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: Proposals */}
                {activeTab === 'proposals' && (
                  <div className="space-y-6">
                    <form onSubmit={handleAddProposal} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">Agregar Ítem a Cotización</h4>
                      <div className="grid grid-cols-12 gap-2">
                        <input
                          type="text"
                          required
                          value={proposalItem}
                          onChange={(e) => setProposalItem(e.target.value)}
                          placeholder="Descripción del ítem/servicio..."
                          className="col-span-6 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                        />
                        <input
                          type="number"
                          min="1"
                          value={proposalQty}
                          onChange={(e) => setProposalQty(Number(e.target.value))}
                          placeholder="Cant."
                          className="col-span-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={proposalPrice}
                          onChange={(e) => setProposalPrice(Number(e.target.value))}
                          placeholder="Precio"
                          className="col-span-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="col-span-2 px-3 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
                        >
                          Añadir
                        </button>
                      </div>
                    </form>

                    <div className="space-y-2">
                      {(selectedItem.proposals || []).length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-400 font-medium">No hay propuestas agregadas</p>
                      ) : (
                        <>
                          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                  <th className="p-3">Ítem / Servicio</th>
                                  <th className="p-3 text-center">Cant.</th>
                                  <th className="p-3 text-right">Precio Unit.</th>
                                  <th className="p-3 text-right">Subtotal</th>
                                  <th className="p-3 text-center">Acción</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                                {selectedItem.proposals?.map((prop) => (
                                  <tr key={prop.id}>
                                    <td className="p-3 font-bold">{prop.item}</td>
                                    <td className="p-3 text-center">{prop.qty}</td>
                                    <td className="p-3 text-right">${Number(prop.price).toLocaleString()}</td>
                                    <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">${(prop.qty * Number(prop.price)).toLocaleString()}</td>
                                    <td className="p-3 text-center">
                                      <button
                                        onClick={() => handleDeleteProposal(prop.id)}
                                        className="text-rose-500 hover:text-rose-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 flex justify-between items-center text-sm font-black text-emerald-900 dark:text-emerald-200">
                            <span>Gran Total Propuesta:</span>
                            <span className="text-base text-emerald-700 dark:text-emerald-400">
                              ${(selectedItem.proposals || []).reduce((sum, p) => sum + (p.qty * Number(p.price)), 0).toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: Payments */}
                {activeTab === 'payments' && (
                  <div className="space-y-6">
                    <form onSubmit={handleGeneratePaymentLink} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">Generar Enlace de Pago por Token</h4>
                      <div className="grid grid-cols-12 gap-2">
                        <input
                          type="text"
                          required
                          value={paymentName}
                          onChange={(e) => setPaymentName(e.target.value)}
                          placeholder="Nombre del concepto/abono..."
                          className="col-span-6 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                        />
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(Number(e.target.value))}
                          placeholder="Monto ($)"
                          className="col-span-3 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="col-span-3 px-3 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-1"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          Generar Enlace
                        </button>
                      </div>
                    </form>

                    {generatedUrl && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 text-xs space-y-2">
                        <span className="font-bold text-blue-900 dark:text-blue-200 block">¡Enlace Generado Exitosamente!</span>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-blue-200 dark:border-blue-900">
                          <input
                            type="text"
                            readOnly
                            value={generatedUrl}
                            className="flex-1 bg-transparent text-slate-700 dark:text-slate-300 font-mono text-[11px] outline-none"
                          />
                          <a
                            href={generatedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-blue-600 text-white font-bold text-[11px] rounded-lg flex items-center gap-1"
                          >
                            Abrir <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {(selectedItem.payments || []).length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-400 font-medium">No se han generado enlaces de pago</p>
                      ) : (
                        selectedItem.payments?.map((pay) => (
                          <div key={pay.id} className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 shadow-2xs">
                            <div className="flex justify-between items-center font-extrabold">
                              <span className="text-slate-900 dark:text-white">{pay.name}</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">${Number(pay.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px]">
                              <span>Token: <code className="font-mono text-slate-700 dark:text-slate-300">{pay.token}</code></span>
                              <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                pay.status === 'review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}>
                                {pay.status}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* EDIT STAGE MODAL */}
      {isEditStageOpen && editingStage && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  Editar Etapa: {editingStage.name}
                </h3>
                <button onClick={() => setIsEditStageOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Etapa</label>
                  <input
                    type="text"
                    required
                    value={editStageName}
                    onChange={(e) => setEditStageName(e.target.value)}
                    placeholder="Ej: Propuesta Aprobada"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Color Identificador</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editStageColor}
                      onChange={(e) => setEditStageColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={editStageColor}
                      onChange={(e) => setEditStageColor(e.target.value)}
                      placeholder="#3B82F6"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  {canDeleteStages && (
                    <button
                      type="button"
                      onClick={() => handleDeleteStage()}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar Etapa</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setIsEditStageOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* META INTEGRATION & CUSTOM FIELDS MODALS */}
      <WorkspaceMetaModal
        workspace={currentWorkspace}
        isOpen={isMetaModalOpen}
        onClose={() => setIsMetaModalOpen(false)}
        onSaved={fetchKanban}
      />

      <WorkspaceCustomFieldsModal
        workspace={currentWorkspace}
        isOpen={isCustomFieldsModalOpen}
        onClose={() => setIsCustomFieldsModalOpen(false)}
        onUpdated={fetchKanban}
      />

      <LeadCampaignDetailsModal
        client={selectedClientForDetails}
        isOpen={isLeadCampaignModalOpen}
        onClose={() => setIsLeadCampaignModalOpen(false)}
      />

      {/* MODAL ASIGNAR LEADS DE LA ETAPA A AGENTE */}
      {assignStageTarget && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Asignar Prospectos de la Etapa</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Etapa: <strong className="text-slate-800 dark:text-slate-200">{assignStageTarget.name}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAssignStageTarget(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  1. Seleccionar Asesor / Agente:
                </label>
                <select
                  value={assignAgentUserId}
                  onChange={(e) => setAssignAgentUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Quitar Asignación (Sin Asignar) --</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      👤 {u.name} ({u.role || 'Usuario'}) {u.email ? `- ${u.email}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista de Leads de la Etapa con Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={
                        pipelines.filter(p => p.stage_id === assignStageTarget.id).length > 0 &&
                        pipelines.filter(p => p.stage_id === assignStageTarget.id).every(p => stageModalLeadIds.includes(p.id))
                      }
                      onChange={() => {
                        const allIds = pipelines.filter(p => p.stage_id === assignStageTarget.id).map(p => p.id);
                        const allChecked = allIds.length > 0 && allIds.every(id => stageModalLeadIds.includes(id));
                        if (allChecked) {
                          setStageModalLeadIds([]);
                        } else {
                          setStageModalLeadIds(allIds);
                        }
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>2. Seleccionar Leads a Asignar ({pipelines.filter(p => p.stage_id === assignStageTarget.id).length} en etapa)</span>
                  </label>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {stageModalLeadIds.length} Marcados
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50/50 dark:bg-slate-950/50">
                  {pipelines.filter(p => p.stage_id === assignStageTarget.id).length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6 font-medium">No hay prospectos en esta etapa</p>
                  ) : (
                    pipelines.filter(p => p.stage_id === assignStageTarget.id).map((p) => {
                      const isChecked = stageModalLeadIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setStageModalLeadIds(prev =>
                              prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                            );
                          }}
                          className={`p-2.5 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-all select-none ${
                            isChecked
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold shadow-2xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-medium hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer pointer-events-none shrink-0"
                            />
                            <span className="truncate">{p.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[130px] shrink-0">
                            {p.client?.name || 'Sin Cliente'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssignStageTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (stageModalLeadIds.length === 0) {
                      toast.error('Debe seleccionar al menos un prospecto');
                      return;
                    }
                    try {
                      const newUserId = assignAgentUserId ? Number(assignAgentUserId) : null;
                      await crmService.assignAgent(stageModalLeadIds, newUserId);
                      fetchKanban();
                      toast.success(`${stageModalLeadIds.length} prospectos asignados correctamente`);
                      setAssignStageTarget(null);
                    } catch (err) {
                      toast.error('Error al asignar prospectos de la etapa');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Confirmar Asignación ({stageModalLeadIds.length})</span>
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* MODAL IMPORTAR LEADS DESDE EXCEL */}
      {isImportModalOpen && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Importar Prospectos (Leads)</h3>
                    <p className="text-xs text-slate-500 font-medium">Carga masiva desde plantilla Excel/CSV</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportFile(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step 1: Download Template */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">1. Descargar Plantilla Oficial</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Descarga <span className="font-mono text-emerald-600 font-bold">PLANTILLA_CLIENTES.xlsx</span></p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all flex-shrink-0"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Descargar Excel</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Upload File */}
              <form onSubmit={handleImportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-white mb-2">
                    2. Seleccionar Archivo Diligenciado (.xlsx / .csv)
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {importFile ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        <FileSpreadsheet className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate max-w-[220px]">{importFile.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Haz clic o arrastra tu archivo aquí</p>
                        <p className="text-[10px] text-slate-400">Archivos soportados: .xlsx, .csv (Máx 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 3: Destination Stage Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-white mb-2">
                    3. Seleccionar Etapa de Destino (Etapa del Kanban)
                  </label>
                  <select
                    value={importStageId}
                    onChange={(e) => setImportStageId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:bg-white dark:focus:bg-slate-900"
                  >
                    <option value="">Por defecto (Primera Etapa / Según columna Etapa del Excel)</option>
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsImportModalOpen(false);
                      setImportFile(null);
                    }}
                    disabled={isImporting}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!importFile || isImporting}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isImporting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Importando...</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Importar Prospectos</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default CrmKanbanPage;


