import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  User as UserIcon,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Clock,
  AlertCircle,
  X,
  Sparkles,
  CheckCircle2,
  Circle,
  FolderKanban,
  Settings,
  Layers,
  LayoutGrid,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { taskService, UserTaskWorkspace, UserTaskStage, UserTask } from '../services/taskService';
import Portal from '../components/Portal';

export default function TasksPage() {
  const { user } = useAuth();

  const [workspaces, setWorkspaces] = useState<UserTaskWorkspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<UserTaskWorkspace | null>(null);
  const [stages, setStages] = useState<UserTaskStage[]>([]);
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [teamUsers, setTeamUsers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // View Mode: 'workspaces' = List/Grid of Workspaces first, 'kanban' = Inside selected Workspace sequences
  const [viewMode, setViewMode] = useState<'workspaces' | 'kanban'>('workspaces');

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Workspace Modals
  const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState<boolean>(false);
  const [wsName, setWsName] = useState<string>('');
  const [wsDescription, setWsDescription] = useState<string>('');
  const [wsColor, setWsColor] = useState<string>('#3B82F6');
  const [submittingWorkspace, setSubmittingWorkspace] = useState<boolean>(false);

  const [editingWorkspace, setEditingWorkspace] = useState<UserTaskWorkspace | null>(null);
  const [editWsName, setEditWsName] = useState<string>('');
  const [editWsDescription, setEditWsDescription] = useState<string>('');
  const [editWsColor, setEditWsColor] = useState<string>('#3B82F6');

  // Stage Modals
  const [isAddStageOpen, setIsAddStageOpen] = useState<boolean>(false);
  const [newStageName, setNewStageName] = useState<string>('');
  const [newStageColor, setNewStageColor] = useState<string>('#3B82F6');
  const [submittingStage, setSubmittingStage] = useState<boolean>(false);

  const [editingStage, setEditingStage] = useState<UserTaskStage | null>(null);
  const [editStageName, setEditStageName] = useState<string>('');
  const [editStageColor, setEditStageColor] = useState<string>('#3B82F6');

  // Task Modals
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);
  const [targetStageId, setTargetStageId] = useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<number>(2);
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [taskAssignedUserId, setTaskAssignedUserId] = useState<number | ''>('');
  const [submittingTask, setSubmittingTask] = useState<boolean>(false);

  // Task Edit Modal
  const [editingTask, setEditingTask] = useState<UserTask | null>(null);

  useEffect(() => {
    loadKanbanData();
  }, []);

  const loadKanbanData = async (workspaceId?: number) => {
    setLoading(true);
    try {
      const data = await taskService.getKanbanData(undefined, workspaceId);
      setWorkspaces(data.workspaces || []);
      setActiveWorkspace(data.active_workspace || null);
      setStages(data.stages || []);
      setTasks(data.tasks || []);
      setTeamUsers(data.team_users || []);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWorkspaceSequences = (wsId: number) => {
    loadKanbanData(wsId);
    setViewMode('kanban');
  };

  const handleSelectWorkspaceInKanban = (wsId: number) => {
    if (activeWorkspace?.id === wsId) return;
    loadKanbanData(wsId);
  };

  // --- WORKSPACE ACTIONS ---
  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim()) {
      toast.error('El nombre del workspace es requerido');
      return;
    }
    setSubmittingWorkspace(true);
    try {
      const created = await taskService.createWorkspace({
        name: wsName.trim(),
        description: wsDescription.trim() || undefined,
        color: wsColor,
      });
      setIsAddWorkspaceOpen(false);
      setWsName('');
      setWsDescription('');
      setWsColor('#3B82F6');
      toast.success(`Workspace "${created.name}" creado exitosamente`);
      loadKanbanData(created.id);
      setViewMode('kanban');
    } catch (err) {
      console.error(err);
      toast.error('Error al crear workspace');
    } finally {
      setSubmittingWorkspace(false);
    }
  };

  const handleUpdateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkspace || !editWsName.trim()) return;
    setSubmittingWorkspace(true);
    try {
      const updated = await taskService.updateWorkspace(editingWorkspace.id, {
        name: editWsName.trim(),
        description: editWsDescription.trim() || undefined,
        color: editWsColor,
      });
      setWorkspaces((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
      if (activeWorkspace?.id === updated.id) {
        setActiveWorkspace(updated);
      }
      setEditingWorkspace(null);
      toast.success('Workspace actualizado');
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar el workspace');
    } finally {
      setSubmittingWorkspace(false);
    }
  };

  const handleDeleteWorkspace = async (wsId: number) => {
    const wsToDelete = workspaces.find((w) => w.id === wsId);
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el workspace "${wsToDelete?.name || ''}"?\n\nSe eliminarán todas sus etapas y tareas asociadas.`
    );
    if (!confirmed) return;

    try {
      await taskService.deleteWorkspace(wsId);
      toast.success('Workspace eliminado');
      setEditingWorkspace(null);
      if (activeWorkspace?.id === wsId) {
        setViewMode('workspaces');
      }
      loadKanbanData();
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar workspace');
    }
  };

  // --- STAGE ACTIONS ---
  const handleCreateStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace) {
      toast.error('Selecciona un workspace válido');
      return;
    }
    if (!newStageName.trim()) {
      toast.error('El nombre de la etapa es requerido');
      return;
    }
    setSubmittingStage(true);
    try {
      const created = await taskService.createStage({
        workspace_id: activeWorkspace.id,
        name: newStageName.trim(),
        color: newStageColor,
      });
      setStages((prev) => [...prev, created]);
      setIsAddStageOpen(false);
      setNewStageName('');
      setNewStageColor('#3B82F6');
      toast.success(`Etapa "${created.name}" creada exitosamente`);
    } catch (err) {
      console.error(err);
      toast.error('Error al crear la etapa');
    } finally {
      setSubmittingStage(false);
    }
  };

  const handleUpdateStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage || !editStageName.trim()) return;
    try {
      const updated = await taskService.updateStage(editingStage.id, {
        name: editStageName.trim(),
        color: editStageColor,
      });
      setStages((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setEditingStage(null);
      toast.success('Etapa actualizada');
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar etapa');
    }
  };

  const handleDeleteStage = async (stageId: number) => {
    const stageToDelete = stages.find((s) => s.id === stageId);
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar la etapa "${stageToDelete?.name || ''}"?\n\nLas tareas asociadas serán eliminadas.`
    );
    if (!confirmed) return;

    try {
      await taskService.deleteStage(stageId);
      setStages((prev) => prev.filter((s) => s.id !== stageId));
      setTasks((prev) => prev.filter((t) => t.stage_id !== stageId));
      if (editingStage?.id === stageId) setEditingStage(null);
      toast.success('Etapa eliminada');
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar la etapa');
    }
  };

  const handleMoveStageOrder = async (stageId: number, direction: 'left' | 'right') => {
    const index = stages.findIndex((s) => s.id === stageId);
    if (index < 0) return;
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === stages.length - 1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    const newStages = [...stages];
    const temp = newStages[index];
    newStages[index] = newStages[targetIndex];
    newStages[targetIndex] = temp;

    const reordered = newStages.map((s, idx) => ({ ...s, sort_order: idx + 1 }));
    setStages(reordered);

    try {
      await taskService.reorderStages(
        reordered.map((s) => ({ id: s.id, sort_order: s.sort_order }))
      );
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar orden de etapas');
    }
  };

  // --- TASK ACTIONS ---
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace || !targetStageId || !taskTitle.trim()) {
      toast.error('El título de la tarea es requerido');
      return;
    }
    setSubmittingTask(true);
    try {
      const created = await taskService.createTask({
        workspace_id: activeWorkspace.id,
        stage_id: targetStageId,
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
        priority: taskPriority,
        due_date: taskDueDate || undefined,
        assigned_user_id: taskAssignedUserId ? Number(taskAssignedUserId) : undefined,
      });
      setTasks((prev) => [created, ...prev]);
      setIsAddTaskOpen(false);
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority(2);
      setTaskDueDate('');
      setTaskAssignedUserId('');
      toast.success('Tarea creada exitosamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al crear tarea');
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !taskTitle.trim()) return;
    setSubmittingTask(true);
    try {
      const updated = await taskService.updateTask(editingTask.id, {
        title: taskTitle.trim(),
        description: taskDescription.trim() || null,
        priority: taskPriority,
        due_date: taskDueDate || null,
        assigned_user_id: taskAssignedUserId ? Number(taskAssignedUserId) : undefined,
      });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTask(null);
      toast.success('Tarea actualizada');
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar tarea');
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('¿Deseas eliminar esta tarea?')) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (editingTask?.id === taskId) setEditingTask(null);
      toast.success('Tarea eliminada');
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar tarea');
    }
  };

  const handleToggleTaskStatus = async (taskId: number) => {
    try {
      const updated = await taskService.toggleTaskStatus(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      toast.success(updated.status === 1 ? 'Tarea completada' : 'Tarea marcada pendiente');
    } catch (err) {
      console.error(err);
      toast.error('Error al cambiar estado');
    }
  };

  const handleMoveTaskStage = async (taskId: number, newStageId: number) => {
    try {
      const updated = await taskService.moveTaskStage(taskId, newStageId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      toast.success('Tarea movida de etapa');
    } catch (err) {
      console.error(err);
      toast.error('Error al mover tarea');
    }
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === 'all' ||
      (priorityFilter === 'high' && t.priority === 3) ||
      (priorityFilter === 'medium' && t.priority === 2) ||
      (priorityFilter === 'low' && t.priority === 1);
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 3:
        return <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-[10px]">Alta</span>;
      case 2:
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">Media</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-[10px]">Baja</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-6 space-y-6">
      {/* ---------------------------------------------------- */}
      {/* VIEW MODE 1: WORKSPACES DIRECTORY LIST / GRID FIRST  */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'workspaces' ? (
        <div className="space-y-6">
          {/* Header Bar for Workspaces View */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black border border-blue-200 dark:border-blue-800">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Workspaces de Tareas & Secuencias
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Selecciona un workspace para acceder a sus secuencias de tareas y etapas dinámicas.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setWsName('');
                setWsDescription('');
                setWsColor('#3B82F6');
                setIsAddWorkspaceOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Workspace</span>
            </button>
          </div>

          {/* Workspaces Table */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium text-sm flex justify-center items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <Clock className="w-5 h-5 animate-spin text-blue-600" />
              <span>Cargando tabla de workspaces...</span>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No hay workspaces creados</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crea tu primer workspace de tareas para estructurar tus secuencias de trabajo.
              </p>
              <button
                onClick={() => setIsAddWorkspaceOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Workspace</span>
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                      <th className="py-4 px-6">Workspace</th>
                      <th className="py-4 px-6">Descripción</th>
                      <th className="py-4 px-6 text-center">Color Identificador</th>
                      <th className="py-4 px-6 text-center">Secuencia / Etapas</th>
                      <th className="py-4 px-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {workspaces.map((ws) => (
                      <tr
                        key={ws.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Workspace Name & ID */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm border flex-shrink-0 shadow-2xs"
                              style={{
                                backgroundColor: `${ws.color || '#3B82F6'}15`,
                                color: ws.color || '#3B82F6',
                                borderColor: `${ws.color || '#3B82F6'}30`,
                              }}
                            >
                              <Layers className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {ws.name}
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                ID: #{ws.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300 max-w-md">
                          <p className="line-clamp-2">
                            {ws.description || 'Sin descripción adicional para este workspace.'}
                          </p>
                        </td>

                        {/* Color Code Badge */}
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                            <span
                              className="w-3 h-3 rounded-full shadow-2xs inline-block"
                              style={{ backgroundColor: ws.color || '#3B82F6' }}
                            />
                            <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                              {ws.color || '#3B82F6'}
                            </span>
                          </div>
                        </td>

                        {/* Sequence Badge */}
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                            <CheckSquare className="w-3.5 h-3.5" />
                            Etapas Dinámicas
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenWorkspaceSequences(ws.id)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                            >
                              <span>Acceder a Secuencias</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                setEditingWorkspace(ws);
                                setEditWsName(ws.name);
                                setEditWsDescription(ws.description || '');
                                setEditWsColor(ws.color || '#3B82F6');
                              }}
                              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                              title="Configuración de Workspace"
                            >
                              <Settings className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteWorkspace(ws.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                              title="Eliminar Workspace"
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
        </div>
      ) : (
        /* ---------------------------------------------------- */
        /* VIEW MODE 2: INSIDE WORKSPACE TASK SEQUENCES KANBAN  */
        /* ---------------------------------------------------- */
        <div className="space-y-6">
          {/* Top Header Bar inside Workspace */}
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Workspace Color Line Accent at top header */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300"
              style={{ backgroundColor: activeWorkspace?.color || '#3B82F6' }}
            />

            <div className="flex items-center gap-3.5">
              <button
                onClick={() => setViewMode('workspaces')}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 shadow-2xs"
                title="Volver al Listado de Workspaces"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Workspaces</span>
              </button>

              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-xs border transition-all"
                style={{
                  backgroundColor: `${activeWorkspace?.color || '#3B82F6'}15`,
                  color: activeWorkspace?.color || '#3B82F6',
                  borderColor: `${activeWorkspace?.color || '#3B82F6'}30`,
                }}
              >
                <CheckSquare className="w-5 h-5" />
              </div>

              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  {activeWorkspace ? activeWorkspace.name : 'Secuencia de Tareas'}
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-bold border"
                    style={{
                      backgroundColor: `${activeWorkspace?.color || '#3B82F6'}15`,
                      color: activeWorkspace?.color || '#2563EB',
                      borderColor: `${activeWorkspace?.color || '#3B82F6'}30`,
                    }}
                  >
                    Secuencia Activa
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {activeWorkspace?.description || 'Gestiona las etapas dinámicas y tareas de este workspace'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Edit Active Workspace Settings */}
              {activeWorkspace && (
                <button
                  onClick={() => {
                    setEditingWorkspace(activeWorkspace);
                    setEditWsName(activeWorkspace.name);
                    setEditWsDescription(activeWorkspace.description || '');
                    setEditWsColor(activeWorkspace.color || '#3B82F6');
                  }}
                  title="Configurar Workspace Activo"
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 active:scale-95 shadow-2xs"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700/80 mx-1 hidden sm:block" />

              {/* Create Stage Button */}
              <button
                onClick={() => setIsAddStageOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 active:scale-95 shadow-2xs"
              >
                <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Nueva Etapa</span>
              </button>

              {/* Create Task Button */}
              {stages.length > 0 && (
                <button
                  onClick={() => {
                    setTargetStageId(stages[0].id);
                    setTaskTitle('');
                    setTaskDescription('');
                    setTaskPriority(2);
                    setTaskDueDate('');
                    setTaskAssignedUserId('');
                    setIsAddTaskOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Tarea</span>
                </button>
              )}
            </div>
          </div>

          {/* WORKSPACES SELECTOR STRIP / TABS IN KANBAN VIEW */}
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shadow-2xs">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 px-3 flex items-center gap-1 flex-shrink-0 tracking-wider">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Cambiar Workspace:
            </span>
            {workspaces.map((ws) => {
              const isActive = activeWorkspace?.id === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => handleSelectWorkspaceInKanban(ws.id)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex-shrink-0 relative overflow-hidden border ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 shadow-2xs font-extrabold'
                      : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-2xs"
                    style={{ backgroundColor: ws.color || '#3B82F6' }}
                  />
                  <span>{ws.name}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: ws.color || '#3B82F6' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título o descripción..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-300 px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todas las Prioridades</option>
                <option value="high">Prioridad Alta</option>
                <option value="medium">Prioridad Media</option>
                <option value="low">Prioridad Baja</option>
              </select>
            </div>
          </div>

          {/* KANBAN BOARD / SEQUENCES */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium text-sm flex justify-center items-center gap-2">
              <Clock className="w-5 h-5 animate-spin text-blue-600" />
              <span>Cargando secuencia de tareas...</span>
            </div>
          ) : stages.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-2xs">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No hay etapas configuradas en "{activeWorkspace?.name}"</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Crea etapas para comenzar la secuencia de trabajo en este workspace.</p>
              <button
                onClick={() => setIsAddStageOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Etapa</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-6 min-h-[600px] snap-x">
              {stages.map((stage, sIdx) => {
                const stageTasks = filteredTasks.filter((t) => t.stage_id === stage.id);

                return (
                  <div
                    key={stage.id}
                    className="w-[85vw] sm:w-80 flex-shrink-0 bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-3 sm:p-4 flex flex-col gap-3 shadow-2xs relative overflow-hidden"
                  >
                    {/* SYSTEM ACCENT COLOR LINE AT TOP OF STAGE COLUMN */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5 transition-colors"
                      style={{ backgroundColor: stage.color || '#3B82F6' }}
                    />

                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full inline-block shadow-2xs flex-shrink-0"
                          style={{ backgroundColor: stage.color || '#3B82F6' }}
                        />
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">{stage.name}</h3>
                        <span className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded-full text-[11px] font-extrabold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {stageTasks.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Move Column Left/Right */}
                        {sIdx > 0 && (
                          <button
                            onClick={() => handleMoveStageOrder(stage.id, 'left')}
                            title="Mover columna a la izquierda"
                            className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        )}
                        {sIdx < stages.length - 1 && (
                          <button
                            onClick={() => handleMoveStageOrder(stage.id, 'right')}
                            title="Mover columna a la derecha"
                            className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}

                        {/* Column Edit Menu */}
                        <button
                          onClick={() => {
                            setEditingStage(stage);
                            setEditStageName(stage.name);
                            setEditStageColor(stage.color);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Task Cards Container */}
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[680px] pr-1">
                      {stageTasks.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 font-medium text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/30">
                          Sin tareas en esta etapa
                        </div>
                      ) : (
                        stageTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-4 rounded-2xl border transition-all space-y-3 shadow-2xs relative overflow-hidden ${
                              task.status === 1
                                ? 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800 opacity-60'
                                : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-blue-500/50'
                            }`}
                          >
                            {/* Side color bar for task stage identification */}
                            <div
                              className="absolute top-0 bottom-0 left-0 w-1 opacity-80"
                              style={{ backgroundColor: stage.color || '#3B82F6' }}
                            />

                            {/* Task Top Meta */}
                            <div className="flex items-start justify-between gap-2 pl-1">
                              <div className="flex items-start gap-2">
                                <button
                                  onClick={() => handleToggleTaskStatus(task.id)}
                                  className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors"
                                  title={task.status === 1 ? 'Marcar pendiente' : 'Marcar completada'}
                                >
                                  {task.status === 1 ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-400" />
                                  )}
                                </button>
                                <h4
                                  onClick={() => {
                                    setEditingTask(task);
                                    setTaskTitle(task.title);
                                    setTaskDescription(task.description || '');
                                    setTaskPriority(task.priority);
                                    setTaskDueDate(task.due_date ? String(task.due_date).substring(0, 10) : '');
                                    setTaskAssignedUserId(task.user_id || '');
                                  }}
                                  className={`text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer leading-tight ${
                                    task.status === 1 ? 'line-through text-slate-400 dark:text-slate-500' : ''
                                  }`}
                                >
                                  {task.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                {getPriorityBadge(task.priority)}
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Description snippet */}
                            {task.description && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed pl-7">
                                {task.description}
                              </p>
                            )}

                            {/* Task Footer Info */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-medium pl-1">
                              {/* Due Date */}
                              {task.due_date ? (
                                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                                  <Calendar className="w-3 h-3 text-blue-600" />
                                  <span>{String(task.due_date).substring(0, 10)}</span>
                                </div>
                              ) : (
                                <div />
                              )}

                              {/* Move to another Stage Dropdown */}
                              <select
                                value={task.stage_id}
                                onChange={(e) => handleMoveTaskStage(task.id, Number(e.target.value))}
                                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] px-2 py-0.5 font-bold focus:outline-none"
                              >
                                {stages.map((st) => (
                                  <option key={st.id} value={st.id}>
                                    {st.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Task Button at bottom of column */}
                    <button
                      onClick={() => {
                        setTargetStageId(stage.id);
                        setTaskTitle('');
                        setTaskDescription('');
                        setTaskPriority(2);
                        setTaskDueDate('');
                        setTaskAssignedUserId('');
                        setIsAddTaskOpen(true);
                      }}
                      className="w-full py-2 bg-white/70 dark:bg-slate-800/40 hover:bg-white text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 border-dashed flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-600" />
                      <span>Agregar Tarea</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL CREAR WORKSPACE */}
      {isAddWorkspaceOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-4 sm:p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-blue-600" />
                  Nuevo Workspace de Tareas
                </h3>
                <button
                  onClick={() => setIsAddWorkspaceOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre del Workspace *</label>
                  <input
                    type="text"
                    required
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    placeholder="Ej: Proyectos Personales, Operaciones"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Descripción (Opcional)</label>
                  <textarea
                    rows={2}
                    value={wsDescription}
                    onChange={(e) => setWsDescription(e.target.value)}
                    placeholder="Propósito de este workspace..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Color Identificador del Sistema</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={wsColor}
                      onChange={(e) => setWsColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-500">{wsColor}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddWorkspaceOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingWorkspace}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    {submittingWorkspace ? 'Guardando...' : 'Crear Workspace'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* MODAL EDITAR WORKSPACE */}
      {editingWorkspace && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-4 sm:p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Editar Workspace
                </h3>
                <button onClick={() => setEditingWorkspace(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateWorkspace} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre del Workspace *</label>
                  <input
                    type="text"
                    required
                    value={editWsName}
                    onChange={(e) => setEditWsName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Descripción</label>
                  <textarea
                    rows={2}
                    value={editWsDescription}
                    onChange={(e) => setEditWsDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Color Identificador del Sistema</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editWsColor}
                      onChange={(e) => setEditWsColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-500">{editWsColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleDeleteWorkspace(editingWorkspace.id)}
                    className="px-3 py-2 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold hover:bg-rose-100"
                  >
                    Eliminar Workspace
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingWorkspace(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submittingWorkspace}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      {submittingWorkspace ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* MODAL CREAR ETAPA */}
      {isAddStageOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-4 sm:p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Nueva Etapa en "{activeWorkspace?.name}"</h3>
                <button
                  onClick={() => setIsAddStageOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStage} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre de la Etapa *</label>
                  <input
                    type="text"
                    required
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="Ej: En Revisión"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Color Identificador (Línea de Acento)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newStageColor}
                      onChange={(e) => setNewStageColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-500">{newStageColor}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddStageOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingStage}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    {submittingStage ? 'Guardando...' : 'Crear Etapa'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* MODAL EDITAR ETAPA */}
      {editingStage && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-4 sm:p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Editar Etapa</h3>
                <button onClick={() => setEditingStage(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStage} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre de la Etapa *</label>
                  <input
                    type="text"
                    required
                    value={editStageName}
                    onChange={(e) => setEditStageName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Color Identificador (Línea de Acento)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editStageColor}
                      onChange={(e) => setEditStageColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-500">{editStageColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleDeleteStage(editingStage.id)}
                    className="px-3 py-2 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold hover:bg-rose-100"
                  >
                    Eliminar Etapa
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingStage(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
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

      {/* MODAL CREAR / EDITAR TAREA */}
      {(isAddTaskOpen || editingTask) && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {editingTask ? 'Editar Tarea' : `Nueva Tarea en "${activeWorkspace?.name}"`}
                </h3>
                <button
                  onClick={() => {
                    setIsAddTaskOpen(false);
                    setEditingTask(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Título de la Tarea *</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Ej: Revisar informe comercial"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Descripción (Opcional)</label>
                  <textarea
                    rows={3}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Detalles adicionales sobre lo que se debe hacer..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Prioridad</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value={1}>Baja</option>
                      <option value={2}>Media</option>
                      <option value={3}>Alta</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Fecha Límite</label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Asignar a Usuario / Agente</label>
                  <select
                    value={taskAssignedUserId}
                    onChange={(e) => setTaskAssignedUserId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="">Mi usuario (Asignarme a mí)</option>
                    {teamUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddTaskOpen(false);
                      setEditingTask(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTask}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    {submittingTask ? 'Guardando...' : editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
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
