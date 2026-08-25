'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Users, UserPlus, Search, Trash2, CheckCircle2, Clock, PlayCircle, Loader2, CheckSquare, Square
} from 'lucide-react';
import courseService from '../services/courseService';
import userService from '../services/userService';
import { Course, CourseUserAssignment } from '../types/course';
import toast from 'react-hot-toast';

interface CourseAssignmentsModalProps {
  course: Course;
  onClose: () => void;
}

interface UserOption {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export const CourseAssignmentsModal: React.FC<CourseAssignmentsModalProps> = ({ course, onClose }) => {
  const [assignments, setAssignments] = useState<CourseUserAssignment[]>([]);
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
      const res = await courseService.getAssignments(course.id, { per_page: 50 });
      if (res.status === 'success' && res.data) {
        setAssignments(res.data.data || []);
      }
    } catch (err) {
      toast.error('Error al cargar las asignaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [course.id]);

  // Buscar usuarios disponibles para asignar
  useEffect(() => {
    if (!isAssigning) return;
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await userService.getUsers({ search: userSearch, per_page: 10 });
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
      const res = await courseService.assignUsers(course.id, selectedUserIds);
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

  const handleUnassign = async (assignment: CourseUserAssignment) => {
    setUnassigningId(assignment.id);
    try {
      await courseService.unassignUser(course.id, assignment.user_id, assignment.id);
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
            <span>Completado</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>En Progreso</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Asignado</span>
          </span>
        );
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const alreadyAssignedUserIds = assignments.map((a) => a.user_id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Asignación de Usuarios</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white line-clamp-1">{course.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          {/* Action Bar */}
          {!isAssigning && (
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Usuarios Asignados ({assignments.length})
              </h3>
              <button
                onClick={() => setIsAssigning(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>Asignar Usuarios</span>
              </button>
            </div>
          )}

          {/* User Search & Selection Drawer */}
          {isAssigning && (
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Buscar y Seleccionar Usuarios</h4>
                <button
                  onClick={() => setIsAssigning(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Cerrar
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Buscar usuario por nombre o correo..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Users list autocomplete */}
              <div className="max-h-48 overflow-y-auto space-y-1 border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-white dark:bg-slate-900 custom-scrollbar">
                {searchLoading ? (
                  <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Buscando usuarios...</span>
                  </div>
                ) : availableUsers.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">No se encontraron usuarios.</p>
                ) : (
                  availableUsers.map((u) => {
                    const isAlreadyAssigned = alreadyAssignedUserIds.includes(u.id);
                    const isSelected = selectedUserIds.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => !isAlreadyAssigned && toggleSelectUser(u.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isAlreadyAssigned
                            ? 'opacity-40 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                          <div>
                            <span className="font-extrabold">{u.name}</span>
                            <span className="text-[11px] text-slate-400 ml-2">({u.email})</span>
                          </div>
                        </div>
                        {isAlreadyAssigned && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Ya asignado</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-500">
                  {selectedUserIds.length} usuario(s) seleccionado(s)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAssigning(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAssign}
                    disabled={submitting || selectedUserIds.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 disabled:opacity-40 transition-all shadow-md shadow-emerald-600/20"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Confirmar Asignación</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assignments List Table */}
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-500">No hay usuarios asignados a este curso.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                    <th className="py-3 px-3">Usuario</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-3">Fecha Asignación</th>
                    <th className="py-3 px-3">Fechas Avance</th>
                    <th className="py-3 px-3">Asignado por</th>
                    <th className="py-3 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-3">
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white">{assignment.user?.name || 'Usuario desconocido'}</p>
                          <p className="text-[11px] text-slate-400">{assignment.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">{getStatusBadge(assignment.status)}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-600 dark:text-slate-400">
                        {formatDate(assignment.assigned_at)}
                      </td>
                      <td className="py-3.5 px-3 text-[11px] text-slate-500">
                        <div>Inicio: {formatDate(assignment.started_at)}</div>
                        <div>Fin: {formatDate(assignment.completed_at)}</div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-500">
                        {assignment.assigner?.name || 'Sistema'}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          disabled={unassigningId === assignment.id}
                          onClick={() => handleUnassign(assignment)}
                          title="Quitar Asignación (Soft Delete)"
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        >
                          {unassigningId === assignment.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseAssignmentsModal;
