'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, Plus, Search, Filter, Edit, Trash2, FolderOpen, Users, 
  Eye, CheckCircle2, Clock, XCircle, AlertCircle, Loader2, Sparkles, BarChart3
} from 'lucide-react';
import courseService from '../services/courseService';
import { Course } from '../types/course';
import toast from 'react-hot-toast';
import CourseResourcesModal from './CourseResourcesModal';
import CourseAssignmentsModal from './CourseAssignmentsModal';
import CourseStudentProgressModal from './CourseStudentProgressModal';

export const CoursesPage: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  // Modales
  const [deleteCourseId, setDeleteCourseId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [resourceCourse, setResourceCourse] = useState<Course | null>(null);
  const [assignmentCourse, setAssignmentCourse] = useState<Course | null>(null);
  const [progressCourse, setProgressCourse] = useState<Course | null>(null);
  const [previewCourseId, setPreviewCourseId] = useState<number | string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await courseService.getCourses({
        search: search.trim(),
        status: statusFilter,
        page,
        per_page: 9,
      });

      if (res.status === 'success' && res.data) {
        setCourses(res.data.data || []);
        setTotalPages(res.data.last_page || 1);
        setTotalCourses(res.data.total || 0);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, statusFilter, page]);

  const handleDelete = async () => {
    if (!deleteCourseId) return;
    setDeleting(true);
    try {
      await courseService.deleteCourse(deleteCourseId);
      toast.success('Curso eliminado exitosamente (Soft Delete)');
      setDeleteCourseId(null);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar curso');
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
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Módulo de Capacitación</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Gestión de Cursos</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Crea cursos, adjunta recursos educativos (videos y PDFs) y asigna colaboradores para dar seguimiento a su aprendizaje.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/courses/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Curso</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar cursos por título o descripción..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
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
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="draft">Borradores</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Grid of Courses */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cargando catálogo de cursos...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">No se encontraron cursos</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            {search || statusFilter ? 'Intenta ajustando los filtros de búsqueda.' : 'Aún no se ha creado ningún curso en el sistema. ¡Empieza creando uno nuevo!'}
          </p>
          <Link
            href="/courses/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Primer Curso</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Main Image Banner */}
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
                  {getStatusBadge(course.status)}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div className="space-y-2 flex-1">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {course.description || 'Sin descripción ingresada.'}
                  </p>
                </div>

                {/* Badges Info */}
                <div className="flex items-center gap-4 py-3 border-y border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-blue-500" />
                    <span>{course.resources_count ?? 0} Recurso(s)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>{course.assignments_count ?? 0} Asignado(s)</span>
                  </div>
                </div>

                {/* Footer Creator & Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[140px]">
                      Por: {course.creator?.name || 'Sistema'}
                    </span>
                    {(course.white_label || course.agency) && (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 truncate max-w-[140px]">
                        {course.white_label?.name || course.agency?.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setProgressCourse(course)}
                      title="Ver Avance de Alumnos"
                      className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/courses/${course.id}/preview`}
                      title="Vista Previa del Curso (Simulación Estudiante)"
                      className="p-2 rounded-xl text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setResourceCourse(course)}
                      title="Administrar Recursos"
                      className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setAssignmentCourse(course)}
                      title="Administrar Asignaciones"
                      className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/courses/${course.id}/edit`}
                      title="Editar Curso"
                      className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteCourseId(course.id)}
                      title="Eliminar Curso (Soft Delete)"
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Anterior
          </button>
          <span className="text-xs font-bold text-slate-500 px-3">
            Página {page} de {totalPages} ({totalCourses} cursos)
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCourseId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/50 text-rose-600 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">¿Eliminar este curso?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Esta acción aplicará Soft Delete. El curso no será borrado físicamente y podrá ser restaurado si es necesario.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={deleting}
                onClick={() => setDeleteCourseId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-all flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Sí, Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resources Modal */}
      {resourceCourse && (
        <CourseResourcesModal
          course={resourceCourse}
          onClose={() => { setResourceCourse(null); fetchCourses(); }}
        />
      )}

      {/* Assignments Modal */}
      {assignmentCourse && (
        <CourseAssignmentsModal
          course={assignmentCourse}
          onClose={() => { setAssignmentCourse(null); fetchCourses(); }}
        />
      )}

      {/* Student Progress Report Modal */}
      {progressCourse && (
        <CourseStudentProgressModal
          courseId={progressCourse.id}
          courseTitle={progressCourse.title}
          isOpen={Boolean(progressCourse)}
          onClose={() => setProgressCourse(null)}
        />
      )}
    </div>
  );
};

export default CoursesPage;
