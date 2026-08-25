'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Search, Filter, PlayCircle, CheckCircle2, Clock, Loader2, Sparkles, FolderOpen, ArrowRight
} from 'lucide-react';
import courseService from '../services/courseService';
import { MyCourseAssignment } from '../types/course';
import toast from 'react-hot-toast';

export const MyCoursesPage: React.FC = () => {
  const [assignments, setAssignments] = useState<MyCourseAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const res = await courseService.getMyCourses({
        search: search.trim(),
        status: statusFilter,
        page,
        per_page: 9,
      });

      if (res.status === 'success' && res.data) {
        setAssignments(res.data.data || []);
        setTotalPages(res.data.last_page || 1);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar mis cursos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, [search, statusFilter, page]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completado</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>En Progreso</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Asignado</span>
          </span>
        );
    }
  };

  const getProgressPercentage = (status: string) => {
    if (status === 'completed') return 100;
    if (status === 'in_progress') return 50;
    return 0;
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

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Capacitación Continua</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Mis Cursos Asignados</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Accede al contenido de tus cursos asignados, reproduce videos explicativos, revisa materiales en PDF y marca tu avance.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar entre mis cursos..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-bold">
            <Filter className="w-4 h-4" />
            <span>Estado:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="assigned">Asignados</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completados</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cargando tus cursos asignados...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">No tienes cursos asignados</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            {search || statusFilter ? 'No hay resultados que coincidan con la búsqueda.' : 'Actualmente no tienes ningún curso asignado. Consulta con tu administrador o gerente.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => {
            const course = assignment.course;
            const progress = getProgressPercentage(assignment.status);
            return (
              <div
                key={assignment.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {course.main_image ? (
                    <img
                      src={course.main_image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600/10 to-indigo-600/10 text-blue-600">
                      <BookOpen className="w-12 h-12 opacity-40 mb-2" />
                      <span className="text-xs font-bold text-slate-400">Sin imagen de portada</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(assignment.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {course.description || 'Sin descripción disponible.'}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Progreso del Curso</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          progress === 100 ? 'bg-emerald-500' : progress > 0 ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Stats & Button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] font-medium text-slate-400">
                      <span>Asignado el {formatDate(assignment.assigned_at)}</span>
                    </div>

                    <Link
                      href={`/my-courses/${course.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 active:scale-95"
                    >
                      <span>{assignment.status === 'completed' ? 'Ver Curso' : assignment.status === 'in_progress' ? 'Continuar' : 'Iniciar'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
