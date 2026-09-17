'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Users, UserPlus, Search, Trash2, CheckCircle2, Clock, PlayCircle, Loader2, CheckSquare, Square
} from 'lucide-react';
import activityService from '../services/activityService';
import userService from '../services/userService';
import { ActivityGroup, ActivityGroupUserAssignment } from '../types/activity';
import toast from 'react-hot-toast';

interface ActivityGroupAssignmentsModalProps {
  group: ActivityGroup;
  onClose: () => void;
}

interface UserOption {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export const ActivityGroupAssignmentsModal: React.FC<ActivityGroupAssignmentsModalProps> = ({ group, onClose }) => {
  const [assignments, setAssignments] = useState<ActivityGroupUserAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-complete & Search Users
  const [isAssigning, setIsAssigning] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [availableUsers, setAvailableUsers] = useState<UserOption[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [unassigningId, setUnassigningId] = useState<number | null>(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await activityService.getActivityGroup(group.id);
      if (res.status === 'success' && res.data) {
        setAssignments(res.data.assignments || []);
      }
    } catch (err) {
      toast.error('Error al cargar las asignaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [group.id]);

  // Buscar usuarios disponibles para asignar
  useEffect(() => {
    if (!isAssigning) return;
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await userService.getUsers({ search: userSearch, per_page: 100 });
        if (res.status === 'success' && res.data) {
          const list = res.data.data || [];
          setAvailableUsers(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userSearch, isAssigning]);

  const toggleSelectUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAssign = async () => {
    if (selectedUserIds.length === 0) {
      toast.error('Selecciona al menos un usuario para asignar');
      return;
    }

    setSubmitting(true);
    try {
      const res = await activityService.assignUsers(group.id, selectedUserIds);
      toast.success(res.message || 'Usuarios asignados correctamente');
      setSelectedUserIds([]);
      setIsAssigning(false);
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al asignar usuarios');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassign = async (assignment: ActivityGroupUserAssignment) => {
    setUnassigningId(assignment.id);
    try {
      await activityService.unassignUser(group.id, assignment.user_id);
      toast.success('Asignación removida correctamente');
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al quitar asignación');
    } finally {
      setUnassigningId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completado
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            <PlayCircle className="w-3.5 h-3.5" />
            En Proceso
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            Asignado
          </span>
        );
    }
  };

  const assignedUserIds = new Set(assignments.map((a) => a.user_id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Asignaciones de Usuarios
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {group.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          {/* Action Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Usuarios Asignados ({assignments.length})
            </div>
            {!isAssigning && (
              <button
                onClick={() => setIsAssigning(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                Asignar Nuevos Usuarios
              </button>
            )}
          </div>

          {/* User Selection Form */}
          {isAssigning && (
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-blue-900 dark:text-blue-300">
                  Seleccionar usuarios para asignar
                </h4>
                <button
                  onClick={() => {
                    setIsAssigning(false);
                    setSelectedUserIds([]);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Cancelar
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Buscar usuarios por nombre o correo..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                {searchLoading ? (
                  <div className="py-6 flex items-center justify-center text-slate-400 gap-2 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    Cargando usuarios...
                  </div>
                ) : availableUsers.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No se encontraron usuarios
                  </div>
                ) : (
                  availableUsers.map((u) => {
                    const isAlreadyAssigned = assignedUserIds.has(u.id);
                    const isSelected = selectedUserIds.includes(u.id);

                    return (
                      <div
                        key={u.id}
                        onClick={() => !isAlreadyAssigned && toggleSelectUser(u.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                          isAlreadyAssigned
                            ? 'opacity-50 bg-slate-100 dark:bg-slate-800/40 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 cursor-pointer border border-blue-300 dark:border-blue-700'
                            : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button type="button" className="text-blue-600">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          <div>
                            <p className="font-bold text-xs text-slate-900 dark:text-white">
                              {u.name}
                            </p>
                            <p className="text-[11px] text-slate-500">{u.email}</p>
                          </div>
                        </div>

                        {isAlreadyAssigned && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            Ya asignado
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-blue-200/60 dark:border-blue-900/40">
                <button
                  onClick={handleAssign}
                  disabled={submitting || selectedUserIds.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirmar Asignación ({selectedUserIds.length})
                </button>
              </div>
            </div>
          )}

          {/* Assignments List */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs font-bold">Cargando asignaciones...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                No hay usuarios asignados a este grupo de actividades
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Haz clic en "Asignar Nuevos Usuarios" para dar acceso a los miembros de tu equipo.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-3.5 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {assignment.user?.name ? assignment.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {assignment.user?.name || 'Usuario no disponible'}
                      </p>
                      <p className="text-[11px] text-slate-400">{assignment.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(assignment.status)}
                    <button
                      onClick={() => handleUnassign(assignment)}
                      disabled={unassigningId === assignment.id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Quitar asignación"
                    >
                      {unassigningId === assignment.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityGroupAssignmentsModal;
