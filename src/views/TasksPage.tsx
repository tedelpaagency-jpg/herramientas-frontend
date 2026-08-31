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

  const handleSelectWorkspace = (wsId: number) => {
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
      // Reload kanban data to pick default/first remaining workspace
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
        return <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">Alta</span>;
      case 2:
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px]">Media</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">Baja</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 space-y-6">
      {/* Top Header Bar */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-800/80 backdrop-blur-md p-5 rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden">
        {/* Workspace Color Line Accent at top header */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300"
          style={{ backgroundColor: activeWorkspace?.color || '#3B82F6' }}
        />

        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-inner border transition-all"
            style={{
              backgroundColor: `${activeWorkspace?.color || '#3B82F6'}20`,
              color: activeWorkspace?.color || '#3B82F6',
              borderColor: `${activeWorkspace?.color || '#3B82F6'}40`,
            }}
          >
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Gestión de Tareas
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-semibold border"
                style={{
                  backgroundColor: `${activeWorkspace?.color || '#3B82F6'}20`,
                  color: activeWorkspace?.color || '#93C5FD',
                  borderColor: `${activeWorkspace?.color || '#3B82F6'}40`,
                }}
              >
                {activeWorkspace ? activeWorkspace.name : 'Personal & Equipo'}
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {activeWorkspace?.description || 'Organiza tus workspaces, etapas dinámicas y seguimiento de tareas'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Create Workspace Button */}
          <button
            onClick={() => {
              setWsName('');
              setWsDescription('');
              setWsColor('#3B82F6');
              setIsAddWorkspaceOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-700/90 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-600 active:scale-95 shadow-sm"
          >
            <FolderKanban className="w-4 h-4 text-indigo-400" />
            <span>Nuevo Workspace</span>
          </button>

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
              className="p-2 bg-slate-700/90 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-600 active:scale-95"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <div className="h-6 w-px bg-slate-700/80 mx-1 hidden sm:block" />

          {/* Create Stage Button */}
          <button
            onClick={() => setIsAddStageOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-700/90 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-600 active:scale-95"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
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
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Tarea</span>
            </button>
          )}
        </div>
      </div>

      {/* WORKSPACES SELECTOR STRIP / TABS */}
      <div className="bg-slate-800/40 p-2.5 rounded-2xl border border-slate-800/80 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-black uppercase text-slate-400 px-3 flex items-center gap-1 flex-shrink-0 tracking-wider">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Workspaces:
        </span>
        {workspaces.map((ws) => {
          const isActive = activeWorkspace?.id === ws.id;
          return (
            <button
              key={ws.id}
              onClick={() => handleSelectWorkspace(ws.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex-shrink-0 relative overflow-hidden border ${
                isActive
                  ? 'bg-slate-800 text-white border-slate-600 shadow-md ring-1 ring-white/10'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-slate-800'
              }`}
            >
              {/* Color Accent Line / Dot for each Workspace tab */}
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-xs"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título o descripción..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-300 px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Todas las Prioridades</option>
            <option value="high">Prioridad Alta</option>
            <option value="medium">Prioridad Media</option>
            <option value="low">Prioridad Baja</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium text-sm flex justify-center items-center gap-2">
          <Clock className="w-5 h-5 animate-spin text-indigo-400" />
          <span>Cargando tablero de tareas...</span>
        </div>
      ) : stages.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/40 border border-slate-800 rounded-3xl space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No hay etapas configuradas en "{activeWorkspace?.name}"</h3>
          <p className="text-xs text-slate-400">Crea etapas de tareas para comenzar a organizar tu tablero en este workspace.</p>
          <button
            onClick={() => setIsAddStageOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
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
                className="w-80 flex-shrink-0 bg-slate-800/60 border border-slate-700/60 rounded-3xl p-4 flex flex-col gap-3 shadow-xl backdrop-blur-md relative overflow-hidden"
              >
                {/* SYSTEM ACCENT COLOR LINE AT TOP OF STAGE COLUMN */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 transition-colors"
                  style={{ backgroundColor: stage.color || '#3B82F6' }}
                />

                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block shadow-sm flex-shrink-0"
                      style={{ backgroundColor: stage.color || '#3B82F6' }}
                    />
                    <h3 className="font-extrabold text-sm text-white line-clamp-1">{stage.name}</h3>
                    <span className="px-2 py-0.5 bg-slate-700/80 rounded-full text-[11px] font-extrabold text-slate-300 border border-slate-600/50">
                      {stageTasks.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Column Left/Right */}
                    {sIdx > 0 && (
                      <button
                        onClick={() => handleMoveStageOrder(stage.id, 'left')}
                        title="Mover columna a la izquierda"
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    {sIdx < stages.length - 1 && (
                      <button
                        onClick={() => handleMoveStageOrder(stage.id, 'right')}
                        title="Mover columna a la derecha"
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
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
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Task Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[680px] pr-1">
                  {stageTasks.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 font-medium text-xs border border-dashed border-slate-700/60 rounded-2xl">
                      Sin tareas en esta etapa
                    </div>
                  ) : (
                    stageTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-2xl border transition-all space-y-3 shadow-md relative overflow-hidden ${
                          task.status === 1
                            ? 'bg-slate-900/60 border-slate-800/80 opacity-60'
                            : 'bg-slate-800/90 border-slate-700/80 hover:border-indigo-500/50'
                        }`}
                      >
                        {/* Side color bar for task stage identification */}
                        <div
                          className="absolute top-0 bottom-0 left-0 w-1 opacity-70"
                          style={{ backgroundColor: stage.color || '#3B82F6' }}
                        />

                        {/* Task Top Meta */}
                        <div className="flex items-start justify-between gap-2 pl-1">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => handleToggleTaskStatus(task.id)}
                              className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors"
                              title={task.status === 1 ? 'Marcar pendiente' : 'Marcar completada'}
                            >
                              {task.status === 1 ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-500" />
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
                              className={`text-xs font-bold text-white hover:text-indigo-300 cursor-pointer leading-tight ${
                                task.status === 1 ? 'line-through text-slate-400' : ''
                              }`}
                            >
                              {task.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {getPriorityBadge(task.priority)}
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Description snippet */}
                        {task.description && (
                          <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed pl-7">
                            {task.description}
                          </p>
                        )}

                        {/* Task Footer Info */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[10px] text-slate-400 font-medium pl-1">
                          {/* Due Date */}
                          {task.due_date ? (
                            <div className="flex items-center gap-1 text-slate-300">
                              <Calendar className="w-3 h-3 text-indigo-400" />
                              <span>{String(task.due_date).substring(0, 10)}</span>
                            </div>
                          ) : (
                            <div />
                          )}

                          {/* Move to another Stage Dropdown */}
                          <select
                            value={task.stage_id}
                            onChange={(e) => handleMoveTaskStage(task.id, Number(e.target.value))}
                            className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg text-[10px] px-2 py-0.5 font-bold focus:outline-none"
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
                  className="w-full py-2 bg-slate-700/40 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 border-dashed flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Agregar Tarea</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CREAR WORKSPACE */}
      {isAddWorkspaceOpen && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-indigo-400" />
                  Nuevo Workspace de Tareas
                </h3>
                <button
                  onClick={() => setIsAddWorkspaceOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nombre del Workspace *</label>
                  <input
                    type="text"
                    required
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    placeholder="Ej: Proyectos Personales, Operaciones"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Descripción (Opcional)</label>
                  <textarea
                    rows={2}
                    value={wsDescription}
                    onChange={(e) => setWsDescription(e.target.value)}
                    placeholder="Propósito de este workspace..."
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Color Identificador del Sistema</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={wsColor}
                      onChange={(e) => setWsColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-400">{wsColor}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddWorkspaceOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingWorkspace}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20"
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
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  Editar Workspace
                </h3>
                <button onClick={() => setEditingWorkspace(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateWorkspace} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nombre del Workspace *</label>
                  <input
                    type="text"
                    required
                    value={editWsName}
                    onChange={(e) => setEditWsName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Descripción</label>
                  <textarea
                    rows={2}
                    value={editWsDescription}
                    onChange={(e) => setEditWsDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Color Identificador del Sistema</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editWsColor}
                      onChange={(e) => setEditWsColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-400">{editWsColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleDeleteWorkspace(editingWorkspace.id)}
                    className="px-3 py-2 bg-rose-950 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold hover:bg-rose-900"
                  >
                    Eliminar Workspace
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingWorkspace(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submittingWorkspace}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20"
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
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white">Nueva Etapa en "{activeWorkspace?.name}"</h3>
                <button
                  onClick={() => setIsAddStageOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStage} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nombre de la Etapa *</label>
                  <input
                    type="text"
                    required
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="Ej: En Revisión"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Color Identificador (Línea de Acento)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newStageColor}
                      onChange={(e) => setNewStageColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-400">{newStageColor}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddStageOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingStage}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20"
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
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white">Editar Etapa</h3>
                <button onClick={() => setEditingStage(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStage} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nombre de la Etapa *</label>
                  <input
                    type="text"
                    required
                    value={editStageName}
                    onChange={(e) => setEditStageName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Color Identificador (Línea de Acento)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editStageColor}
                      onChange={(e) => setEditStageColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-400">{editStageColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleDeleteStage(editingStage.id)}
                    className="px-3 py-2 bg-rose-950 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold hover:bg-rose-900"
                  >
                    Eliminar Etapa
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingStage(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20"
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
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white">
                  {editingTask ? 'Editar Tarea' : `Nueva Tarea en "${activeWorkspace?.name}"`}
                </h3>
                <button
                  onClick={() => {
                    setIsAddTaskOpen(false);
                    setEditingTask(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Título de la Tarea *</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Ej: Revisar informe comercial"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Descripción (Opcional)</label>
                  <textarea
                    rows={3}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Detalles adicionales sobre lo que se debe hacer..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Prioridad</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option value={1}>Baja</option>
                      <option value={2}>Media</option>
                      <option value={3}>Alta</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Fecha Límite</label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Asignar a Usuario / Agente</label>
                  <select
                    value={taskAssignedUserId}
                    onChange={(e) => setTaskAssignedUserId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="">Mi usuario (Asignarme a mí)</option>
                    {teamUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddTaskOpen(false);
                      setEditingTask(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTask}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20"
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
