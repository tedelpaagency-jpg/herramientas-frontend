'use client';

import React, { useEffect, useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle, Users, BarChart3, ChevronRight, UserCheck, PlayCircle, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import courseService from '../services/courseService';
import { StudentProgressItem, StudentDetailProgressResponse } from '../types/course';
import toast from 'react-hot-toast';

interface CourseStudentProgressModalProps {
  courseId: number;
  courseTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseStudentProgressModal: React.FC<CourseStudentProgressModalProps> = ({
  courseId,
  courseTitle = 'Curso',
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentProgressItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Detalle de un alumno seleccionado
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressItem | null>(null);
  const [studentDetailLoading, setStudentDetailLoading] = useState(false);
  const [studentDetail, setStudentDetail] = useState<StudentDetailProgressResponse | null>(null);

  useEffect(() => {
    if (isOpen && courseId) {
      loadStudentsProgress();
    } else {
      setSelectedStudent(null);
      setStudentDetail(null);
    }
  }, [isOpen, courseId]);

  const loadStudentsProgress = async () => {
    setLoading(true);
    try {
      const res = await courseService.getStudentsProgress(courseId);
      if (res.status === 'success' && res.data) {
        setStudents(res.data.data || []);
      }
    } catch (err: any) {
      toast.error('Error al cargar el avance de alumnos');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = async (student: StudentProgressItem) => {
    setSelectedStudent(student);
    setStudentDetailLoading(true);
    const userId = student.user_id || student.user.id;
    try {
      const res = await courseService.getStudentDetailProgress(courseId, userId);
      if (res.status === 'success' && res.data) {
        setStudentDetail(res.data);
      }
    } catch (err: any) {
      toast.error('Error al cargar el desglose de avance del usuario');
    } finally {
      setStudentDetailLoading(false);
    }
  };

  if (!isOpen) return null;

  // Flatten materials across sections for detailed material log
  const flattenedMaterials = studentDetail?.materials || (
    studentDetail?.sections?.flatMap(s => s.materials.map(m => ({ ...m, section_title: s.title }))) || []
  );

  // Filtrado de alumnos
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.user.name.toLowerCase().includes(search.toLowerCase()) ||
      s.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Estadísticas globales
  const totalStudents = students.length;
  const completedStudents = students.filter(s => s.status === 'completed').length;
  const inProgressStudents = students.filter(s => s.status === 'in_progress').length;
  const notStartedStudents = students.filter(s => s.status === 'assigned').length;
  const avgProgress = totalStudents > 0
    ? Math.round(students.reduce((acc, curr) => acc + curr.progress_percentage, 0) / totalStudents)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <span>Avance de Alumnos</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white truncate max-w-xl">
                {courseTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {selectedStudent ? (
          /* VISTA DETALLADA DEL ALUMNO SELECCIONADO */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <button
              onClick={() => { setSelectedStudent(null); setStudentDetail(null); }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la lista de estudiantes</span>
            </button>

            {/* Ficha Alumno */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedStudent.user.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedStudent.user.email}
                </p>
                {selectedStudent.assigned_at && (
                  <p className="text-[11px] text-slate-400">
                    Asignado el: {new Date(selectedStudent.assigned_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {selectedStudent.progress_percentage}%
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">
                    {selectedStudent.completed_materials_count ?? selectedStudent.completed_count} / {selectedStudent.total_materials_count ?? selectedStudent.total_count} Materiales
                  </span>
                </div>

                <div className="w-32 bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedStudent.progress_percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Desglose por Lecciones/Materiales */}
            {studentDetailLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-xs font-semibold text-slate-500">Cargando progreso detallado del alumno...</p>
              </div>
            ) : studentDetail ? (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Desglose de Lecciones & Materiales
                </h4>

                <div className="space-y-2">
                  {flattenedMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                        mat.is_completed
                          ? 'bg-emerald-500/5 border-emerald-500/20 dark:bg-emerald-950/20 dark:border-emerald-800/40'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-xl shrink-0 ${
                          mat.is_completed
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {mat.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {mat.section_title || 'Sección'}
                          </p>
                          <h5 className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {mat.title}
                          </h5>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            Tipo: {mat.type}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {mat.is_completed ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                              ✓ Completado
                            </span>
                            {mat.completed_at && (
                              <p className="text-[10px] text-slate-400 font-medium">
                                {new Date(mat.completed_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold">
                            Pendiente
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          /* VISTA PRINCIPAL: RESUMEN GENERAL & TABLA DE ALUMNOS */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Total Asignados
                </span>
                <p className="text-2xl font-black text-indigo-950 dark:text-indigo-100 mt-1">
                  {totalStudents}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Completados (100%)
                </span>
                <p className="text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1">
                  {completedStudents}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  En Progreso
                </span>
                <p className="text-2xl font-black text-amber-950 dark:text-amber-100 mt-1">
                  {inProgressStudents}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Promedio Avance
                </span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {avgProgress}%
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">Todos los estados</option>
                  <option value="completed">Completado</option>
                  <option value="in_progress">En progreso</option>
                  <option value="assigned">No iniciado</option>
                </select>
              </div>
            </div>

            {/* Student Progress Table */}
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-xs font-semibold text-slate-500">Cargando reporte de avance de alumnos...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  {students.length === 0 ? 'No hay alumnos asignados a este curso todavía.' : 'No se encontraron alumnos con ese criterio de búsqueda.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="p-3.5 pl-5">Estudiante</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5">Progreso</th>
                      <th className="p-3.5">Completados</th>
                      <th className="p-3.5 pr-5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
                    {filteredStudents.map((s) => (
                      <tr
                        key={s.user_id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="p-3.5 pl-5">
                          <span className="block font-black text-slate-900 dark:text-white">{s.user.name}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{s.user.email}</span>
                        </td>
                        <td className="p-3.5">
                          {s.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold">
                              ✓ Completado
                            </span>
                          ) : s.status === 'in_progress' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-extrabold">
                              ⟳ En progreso
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-extrabold">
                              ○ No iniciado
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-slate-900 dark:text-white w-10">
                              {s.progress_percentage}%
                            </span>
                            <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  s.progress_percentage === 100
                                    ? 'bg-emerald-500'
                                    : s.progress_percentage > 0
                                    ? 'bg-amber-500'
                                    : 'bg-slate-400'
                                }`}
                                style={{ width: `${s.progress_percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">
                          {s.completed_materials_count ?? s.completed_count} / {s.total_materials_count ?? s.total_count}
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <button
                            onClick={() => handleSelectStudent(s)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                          >
                            <span>Ver Detalle</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseStudentProgressModal;
