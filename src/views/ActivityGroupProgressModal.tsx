'use client';

import React, { useEffect, useState } from 'react';
import { X, Search, CheckCircle2, Clock, Users, BarChart3, ChevronRight, PlayCircle, ArrowLeft, Loader2, FileCheck } from 'lucide-react';
import activityService from '../services/activityService';
import { StudentActivityProgressItem, StudentActivityDetailProgressResponse } from '../types/activity';
import toast from 'react-hot-toast';

interface ActivityGroupProgressModalProps {
  groupId: number;
  groupTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityGroupProgressModal: React.FC<ActivityGroupProgressModalProps> = ({
  groupId,
  groupTitle = 'Grupo de Actividades',
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentActivityProgressItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Detalle de un alumno seleccionado
  const [selectedStudent, setSelectedStudent] = useState<StudentActivityProgressItem | null>(null);
  const [studentDetailLoading, setStudentDetailLoading] = useState(false);
  const [studentDetail, setStudentDetail] = useState<StudentActivityDetailProgressResponse | null>(null);

  useEffect(() => {
    if (isOpen && groupId) {
      loadStudentsProgress();
    } else {
      setSelectedStudent(null);
      setStudentDetail(null);
    }
  }, [isOpen, groupId]);

  const loadStudentsProgress = async () => {
    setLoading(true);
    try {
      const res = await activityService.getStudentsProgress(groupId);
      if (res.status === 'success' && res.data) {
        setStudents(res.data.data || []);
      }
    } catch (err: any) {
      toast.error('Error al cargar el avance de alumnos');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = async (student: StudentActivityProgressItem) => {
    setSelectedStudent(student);
    setStudentDetailLoading(true);
    const userId = student.user.id;
    try {
      const res = await activityService.getStudentDetailProgress(groupId, userId);
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
            {selectedStudent ? (
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                title="Volver al listado"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="p-3 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                <BarChart3 className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {selectedStudent
                  ? `Detalle de Avance: ${selectedStudent.user.name}`
                  : `Progreso General: ${groupTitle}`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedStudent
                  ? selectedStudent.user.email
                  : `Seguimiento de cumplimiento de actividades por usuario`}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {selectedStudent ? (
            /* VISTA DE DETALLE DE ALUMNO SELECCIONADO */
            studentDetailLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-xs font-bold">Cargando desglose de actividades...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Avance General
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {selectedStudent.progress_percentage}%
                      </span>
                      <span className="text-xs text-slate-500">
                        ({selectedStudent.completed_activities} / {selectedStudent.total_activities} completadas)
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Estado Actual
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                      {selectedStudent.status === 'completed' ? '✓ Completado' : selectedStudent.status === 'in_progress' ? '▶ En Proceso' : '⏳ Asignado'}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Fecha Asignación
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {selectedStudent.assigned_at ? new Date(selectedStudent.assigned_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Desglose Actividad por Actividad
                  </h4>

                  {studentDetail?.activities.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No hay actividades en este grupo
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                      {studentDetail?.activities.map((act) => (
                        <div
                          key={act.activity_id}
                          className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl shrink-0 ${
                              act.is_completed
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}>
                              {act.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-extrabold text-xs text-slate-900 dark:text-white">
                                {act.title}
                              </p>
                              <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                                Requerimiento: {act.submission_type === 'none' ? 'Sin entrega' : act.submission_type}
                              </p>
                              {act.submission && (
                                <div className="mt-1 text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                                  {act.submission.submission_type === 'text' && (
                                    <p className="italic">" {act.submission.content} "</p>
                                  )}
                                  {act.submission.file_name && (
                                    <p className="font-bold text-blue-600 dark:text-blue-400">
                                      📄 Archivo entregado: {act.submission.file_name}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            {act.is_completed ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                                ✓ Completada
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                                ⏳ Pendiente
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            /* VISTA PRINCIPAL: RESUMEN Y LISTA DE ALUMNOS */
            <>
              {/* Tarjetas de Métricas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                    Total Usuarios
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {totalStudents}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                    Completados
                  </span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {completedStudents}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40">
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                    En Proceso
                  </span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {inProgressStudents}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/40">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                    Promedio Avance
                  </span>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {avgProgress}%
                  </span>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar usuario..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  {['all', 'completed', 'in_progress', 'assigned'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        statusFilter === st
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {st === 'all' && 'Todos'}
                      {st === 'completed' && 'Completados'}
                      {st === 'in_progress' && 'En Proceso'}
                      {st === 'assigned' && 'Pendientes'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabla de Alumnos */}
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-xs font-bold">Cargando progreso de usuarios...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                  <Users className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    No se encontraron registros de progreso
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.assignment_id}
                      onClick={() => handleSelectStudent(student)}
                      className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {student.user.name ? student.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                            {student.user.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{student.user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        {/* Barra de Progreso */}
                        <div className="w-36 hidden sm:block">
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-slate-500">Progreso</span>
                            <span className="text-slate-900 dark:text-white">
                              {student.progress_percentage}% ({student.completed_activities}/{student.total_activities})
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                              style={{ width: `${student.progress_percentage}%` }}
                            />
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-end">
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

export default ActivityGroupProgressModal;
