'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Search, Filter, Loader2, Sparkles
} from 'lucide-react';
import courseService from '../services/courseService';
import { MyCourseAssignment } from '../types/course';
import { StackedPathCard } from '../components/StackedPathCard';
import toast from 'react-hot-toast';

export const MyCoursesPage: React.FC = () => {
  const [assignments, setAssignments] = useState<MyCourseAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const res = await courseService.getMyCourses({
        search: search.trim(),
        status: statusFilter,
        page,
        per_page: 12,
      });

      if (res.status === 'success' && res.data) {
        setAssignments(res.data.data || []);
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

  const getProgressPercentage = (assignment: MyCourseAssignment) => {
    if (typeof assignment.progress_percentage === 'number') {
      return assignment.progress_percentage;
    }
    if (assignment.status === 'completed') return 100;
    if (assignment.status === 'in_progress') return 50;
    return 0;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner - Igual a los otros módulos */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Módulo de Capacitación</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Mis Cursos</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Continúa con tus rutas de aprendizaje asignadas y completa tu formación profesional.
          </p>
        </div>
      </div>

      {/* Filter and Search Toolbar - Igual a los otros módulos */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar ruta de aprendizaje..."
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
            <option value="assigned">Asignados</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completados</option>
          </select>
        </div>
      </div>

      {/* Stacked Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cargando tus rutas de aprendizaje...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">No tienes rutas de aprendizaje asignadas</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            {search || statusFilter ? 'No hay resultados que coincidan con los filtros.' : 'Actualmente no tienes ninguna ruta asignada. Consulta con tu administrador.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-6 pt-10">
          {assignments.map((assignment) => {
            const course = assignment.course;
            const sections = course?.sections || [];
            const hasSections = sections.length > 0;
            const completedMaterialIds = new Set<number>(
              assignment.completed_materials
                ? assignment.completed_materials.map((m: any) => typeof m === 'number' ? m : m.material_id)
                : []
            );
            const totalSections = assignment.total_sections_count ?? (hasSections ? sections.length : (assignment.total_materials_count || 1));
            const completedSections = assignment.completed_sections_count ?? (
              hasSections
                ? (assignment.status === 'completed'
                    ? sections.length
                    : sections.filter(sec => {
                        const mats = sec.materials || [];
                        return mats.length > 0 ? mats.every(m => completedMaterialIds.has(m.id)) : false;
                      }).length)
                : (assignment.completed_materials_count || (assignment.status === 'completed' ? totalSections : 0))
            );
            const progress = typeof assignment.progress_percentage === 'number'
              ? assignment.progress_percentage
              : (totalSections > 0
                  ? Math.round((completedSections / totalSections) * 100)
                  : getProgressPercentage(assignment));

            const courseImages = [
              course.main_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
              course.banner_image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
              course.thumb_image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
            ];

            return (
              <Link 
                key={assignment.id} 
                href={`/my-courses/${course.id}`}
                className="flex justify-center"
              >
                <StackedPathCard
                  title={course.title}
                  progress={progress}
                  completedCourses={completedSections}
                  totalCourses={totalSections}
                  remainingHours={assignment.status === 'completed' ? 0 : 20}
                  images={courseImages}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
