'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, Search, Filter, Loader2, Sparkles
} from 'lucide-react';
import activityService from '../services/activityService';
import { MyActivityAssignment } from '../types/activity';
import { StackedPathCard } from '../components/StackedPathCard';
import toast from 'react-hot-toast';

export const MyActivitiesPage: React.FC = () => {
  const [assignments, setAssignments] = useState<MyActivityAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchMyActivities = async () => {
    setLoading(true);
    try {
      const res = await activityService.getMyActivities({
        search: search.trim(),
        page,
        per_page: 12,
      });

      if (res.status === 'success' && res.data) {
        setAssignments(res.data.data || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar mis actividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyActivities();
  }, [search, statusFilter, page]);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Módulo de Actividades</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Mis Actividades</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Consulta los grupos de actividades asignados, completa los requerimientos y realiza tus entregas.
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
            placeholder="Buscar grupo de actividades..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cargando tus grupos de actividades...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">No tienes actividades asignadas</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            {search ? 'No hay resultados que coincidan con la búsqueda.' : 'Actualmente no tienes ningún grupo de actividades asignado. Consulta con tu administrador.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-14 gap-x-8 md:gap-x-10 pt-10">
          {assignments.map((assignment) => {
            const grp = assignment.group;
            if (!grp) return null;

            const grpImages = [
              grp.main_image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
            ];

            return (
              <Link 
                key={assignment.assignment_id} 
                href={`/my-activities/${grp.id}`}
                className="flex justify-center"
              >
                <StackedPathCard
                  title={grp.title}
                  progress={assignment.progress_percentage || 0}
                  completedCourses={assignment.completed_activities || 0}
                  totalCourses={assignment.total_activities || 1}
                  remainingHours={assignment.status === 'completed' ? 0 : 5}
                  images={grpImages}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyActivitiesPage;
