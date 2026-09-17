'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckSquare, Plus, Search, Filter, Edit, Trash2, Users, 
  CheckCircle2, Clock, XCircle, AlertCircle, Loader2, Sparkles, BarChart3
} from 'lucide-react';
import activityService from '../services/activityService';
import { ActivityGroup } from '../types/activity';
import toast from 'react-hot-toast';
import ActivityGroupAssignmentsModal from './ActivityGroupAssignmentsModal';
import ActivityGroupProgressModal from './ActivityGroupProgressModal';

export const ActivitiesPage: React.FC = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGroups, setTotalGroups] = useState(0);

  // Modales
  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [assignmentGroup, setAssignmentGroup] = useState<ActivityGroup | null>(null);
  const [progressGroup, setProgressGroup] = useState<ActivityGroup | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await activityService.getActivityGroups({
        search: search.trim(),
        status: statusFilter,
        page,
        per_page: 9,
      });

      if (res.status === 'success' && res.data) {
        setGroups(res.data.data || []);
        setTotalPages(res.data.last_page || 1);
        setTotalGroups(res.data.total || 0);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar grupos de actividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [search, statusFilter, page]);

  const handleDelete = async () => {
    if (!deleteGroupId) return;
    setDeleting(true);
    try {
      await activityService.deleteActivityGroup(deleteGroupId);
      toast.success('Grupo de actividades eliminado exitosamente (Soft Delete)');
      setDeleteGroupId(null);
      fetchGroups();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar grupo');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Activo</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Borrador</span>
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            <span>Inactivo</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[11px] uppercase tracking-wider">
              Gestión de Actividades
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-blue-600" />
            Grupos de Actividades
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Administra grupos de actividades, contenido teórico, requerimientos de entrega y progreso de tu equipo.
          </p>
        </div>

        <Link
          href="/activities/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/25 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Crear Grupo de Actividades</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por título o descripción..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none"
            >
              <option value="">Todos los Estados</option>
              <option value="active">Activo</option>
              <option value="draft">Borrador</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-9 h-9 animate-spin text-blue-600" />
          <p className="text-xs font-extrabold">Cargando grupos de actividades...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-4 p-8">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              No se encontraron grupos de actividades
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search || statusFilter
                ? 'Intenta ajustar tus filtros de búsqueda.'
                : 'Comienza creando tu primer grupo de actividades para asignar a tu equipo.'}
            </p>
          </div>
          {!search && !statusFilter && (
            <Link
              href="/activities/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              Crear Grupo
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((grp) => (
            <div
              key={grp.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Card Image Banner */}
              <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {grp.main_image ? (
                  <img
                    src={grp.main_image}
                    alt={grp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 p-6 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                        <CheckSquare className="w-5 h-5 text-blue-400" />
                      </span>
                    </div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                      GRUPO DE ACTIVIDADES
                    </p>
                  </div>
                )}

                <div className="absolute top-3 right-3">{getStatusBadge(grp.status)}</div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {grp.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {grp.description || 'Sin descripción detallada.'}
                  </p>
                </div>

                {/* Counters */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-bold">
                      {grp.activities_count || grp.activities?.length || 0} Actividades
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-xs font-bold">
                      {grp.assignments_count || grp.assignments?.length || 0} Asignados
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setAssignmentGroup(grp)}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Asignar usuarios"
                    >
                      <Users className="w-4 h-4 text-indigo-600" />
                    </button>

                    <button
                      onClick={() => setProgressGroup(grp)}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Ver progreso de alumnos"
                    >
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                    </button>

                    <Link
                      href={`/activities/${grp.id}/edit`}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Editar grupo"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Link>
                  </div>

                  <button
                    onClick={() => setDeleteGroupId(grp.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Eliminar grupo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-slate-500">
            Mostrando página <span className="font-bold">{page}</span> de{' '}
            <span className="font-bold">{totalPages}</span> ({totalGroups} grupos en total)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {deleteGroupId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 dark:bg-rose-950/60 rounded-2xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                ¿Eliminar Grupo?
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              El grupo de actividades y sus actividades asociadas serán desactivados (Soft Delete). Podrás recuperarlo si es necesario.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteGroupId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-rose-600/20"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales de Gestión */}
      {assignmentGroup && (
        <ActivityGroupAssignmentsModal
          group={assignmentGroup}
          onClose={() => setAssignmentGroup(null)}
        />
      )}

      {progressGroup && (
        <ActivityGroupProgressModal
          groupId={progressGroup.id}
          groupTitle={progressGroup.title}
          isOpen={true}
          onClose={() => setProgressGroup(null)}
        />
      )}
    </div>
  );
};

export default ActivitiesPage;
