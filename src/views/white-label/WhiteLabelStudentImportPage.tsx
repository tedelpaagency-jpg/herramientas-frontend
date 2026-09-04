'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  Users,
  Layers,
  ArrowRight,
  RotateCcw,
  Search,
  History,
  Shield,
  FileText,
  Clock,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import studentImportService, {
  ImportPreviewRow,
  ImportSummary,
  ImportExecuteResult,
  ImportHistoryRecord,
} from '../../services/studentImportService';
import { useAuth } from '../../context/AuthContext';

export const WhiteLabelStudentImportPage: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'import' | 'history'>('import');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Estados de proceso
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Datos de preview
  const [previewSummary, setPreviewSummary] = useState<ImportSummary | null>(null);
  const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([]);
  const [targetWhiteLabel, setTargetWhiteLabel] = useState<{ id: number; name: string } | null>(null);

  // Filtros de preview
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'NUEVO' | 'EXISTENTE_ASIGNAR' | 'EXISTENTE' | 'NO_IMPORTABLE' | 'ERROR'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Resultado final de importación
  const [importResult, setImportResult] = useState<ImportExecuteResult | null>(null);

  // Historial
  const [historyList, setHistoryList] = useState<ImportHistoryRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await studentImportService.getHistory();
      setHistoryList(Array.isArray(res) ? res : (res as any)?.data || []);
    } catch (err: any) {
      console.error('Error cargando historial de importaciones:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv') && !file.name.toLowerCase().endsWith('.txt')) {
      toast.error('Por favor seleccione un archivo CSV válido exportado desde Moodle.');
      return;
    }
    setSelectedFile(file);
    setPreviewSummary(null);
    setPreviewRows([]);
    setImportResult(null);
    validateFile(file);
  };

  const validateFile = async (file: File) => {
    setIsValidating(true);
    try {
      const data = await studentImportService.validateCsv(file);
      setPreviewSummary(data.summary);
      setPreviewRows(data.rows);
      setTargetWhiteLabel(data.white_label);
      toast.success('Archivo analizado exitosamente. Revise la previsualización antes de importar.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al validar el archivo CSV.');
      setSelectedFile(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!selectedFile) return;
    setShowConfirmModal(false);
    setIsImporting(true);

    try {
      const result = await studentImportService.executeImport(selectedFile);
      setImportResult(result);
      toast.success('¡Importación completada! Las agencias y usuarios han sido creados.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error durante la ejecución de la importación.');
    } finally {
      setIsImporting(false);
    }
  };

  const resetProcess = () => {
    setSelectedFile(null);
    setPreviewSummary(null);
    setPreviewRows([]);
    setImportResult(null);
    setShowConfirmModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filtrado de filas en la tabla de Preview
  const filteredPreviewRows = previewRows.filter((row) => {
    const matchesStatus = filterStatus === 'ALL' || row.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      row.moodle_id.toLowerCase().includes(query) ||
      row.agency_name.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query) ||
      row.username.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Módulo White Label & Moodle
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            Importador Masivo de Estudiantes a Agencias
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Convierte automáticamente cada estudiante del CSV de Moodle en una <strong>Agency independiente</strong> y en el <strong>Administrador de su Agencia</strong>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Importar CSV</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial</span>
          </button>
        </div>
      </div>

      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* PASO 1: SELECCIÓN DE ARCHIVO (Si no hay archivo o para cambiarlo) */}
          {!previewSummary && !importResult && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="max-w-2xl mx-auto text-center space-y-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Seleccione el archivo CSV exportado desde Moodle
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  El sistema detectará automáticamente las columnas <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-blue-600">id, username, firstname, lastname, email</code>, validará duplicados y creará cada Agencia de forma aislada.
                </p>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`max-w-2xl mx-auto p-10 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    Arrastre su archivo CSV aquí o haga clic para seleccionar
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    Formatos soportados: .csv (separado por comas o punto y coma), .txt (hasta 20MB)
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* Information Cards */}
              <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-800 dark:text-slate-200">1 Estudiante = 1 Agency</span>
                    <span className="text-[11px] text-slate-500 leading-tight">Cada alumno tendrá su propio espacio de agencia independiente.</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-start gap-2">
                  <Users className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-800 dark:text-slate-200">Rol agency_admin</span>
                    <span className="text-[11px] text-slate-500 leading-tight">El usuario se crea como administrador general de su agencia.</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-800 dark:text-slate-200">Anti-Duplicados</span>
                    <span className="text-[11px] text-slate-500 leading-tight">Verificación por Moodle ID, email y usuario antes de crear.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator during validation */}
          {isValidating && (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Analizando archivo CSV y verificando duplicados con la base de datos...
              </p>
            </div>
          )}

          {/* PASO 2: PREVIEW DE REGISTROS */}
          {previewSummary && !importResult && !isValidating && (
            <div className="space-y-6 animate-fade-in">
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Total en CSV</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {previewSummary.total_records}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400">Nuevas Agencies</span>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    {previewSummary.new_agencies}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">Asignar a Marca</span>
                  <div className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-1">
                    {previewSummary.assigned_existing || 0}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">Ya en esta Marca</span>
                  <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1">
                    {previewSummary.existing_users}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">Eliminados Moodle</span>
                  <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
                    {previewSummary.deleted_moodle}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400">Con Errores</span>
                  <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">
                    {previewSummary.error_records}
                  </div>
                </div>
              </div>

              {/* Action & Filter Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filtrar por nombre, email, id..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e: any) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    <option value="ALL">Todos los estados</option>
                    <option value="NUEVO">Solo Nuevos ({previewSummary.new_agencies})</option>
                    <option value="EXISTENTE_ASIGNAR">Existentes a Asignar ({previewSummary.assigned_existing || 0})</option>
                    <option value="EXISTENTE">Ya en esta Marca ({previewSummary.existing_users})</option>
                    <option value="NO_IMPORTABLE">Solo Eliminados ({previewSummary.deleted_moodle})</option>
                    <option value="ERROR">Solo Errores ({previewSummary.error_records})</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={resetProcess}
                    disabled={isImporting}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cambiar Archivo
                  </button>

                  {(() => {
                    const totalActionable = previewSummary.new_agencies + (previewSummary.assigned_existing || 0);
                    return (
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        disabled={isImporting || totalActionable === 0}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                      >
                        <span>Importar / Asignar {totalActionable} Estudiantes</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* Table of Preview Rows */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800 sticky top-0 backdrop-blur-xs">
                      <tr>
                        <th className="p-3.5">Moodle ID</th>
                        <th className="p-3.5">Nombre & Apellido</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Agency a Crear / Asignar</th>
                        <th className="p-3.5">Estado</th>
                        <th className="p-3.5">Detalle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredPreviewRows.map((row) => (
                        <tr key={row.index} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-slate-600 dark:text-slate-400">
                            #{row.moodle_id}
                          </td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            <div>{row.firstname} {row.lastname}</div>
                            {row.username && <div className="text-[10px] font-mono text-slate-400 font-normal">@{row.username}</div>}
                          </td>
                          <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                            {row.email}
                          </td>
                          <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400">
                            {row.can_import ? (
                              <span className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                                {row.agency_name}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic font-normal">{row.agency_name || '—'}</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {row.status === 'NUEVO' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {row.status_label}
                              </span>
                            )}
                            {row.status === 'EXISTENTE_ASIGNAR' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Asignar a Marca
                              </span>
                            )}
                            {row.status === 'EXISTENTE' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1">
                                <Users className="w-3 h-3" /> Ya en esta Marca
                              </span>
                            )}
                            {row.status === 'NO_IMPORTABLE' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> No Importable
                              </span>
                            )}
                            {row.status === 'ERROR' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Error
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-500 text-[11px]">
                            {row.reason || (row.is_suspended ? 'Usuario suspendido en Moodle' : 'Listo para creación')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: PANTALLA DE RESULTADOS POST-IMPORTACIÓN */}
          {importResult && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
              <div className="text-center max-w-md mx-auto space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  ¡Importación Completada!
                </h2>
                <p className="text-xs text-slate-500">
                  Las Agencias y usuarios administradores han sido creados correctamente en su White Label.
                </p>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Procesados</span>
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
                    {importResult.summary.total_processed}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-600">Nuevas Agencies</span>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    {importResult.summary.created_agencies}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-purple-600">Existentes Asignados</span>
                  <div className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-1">
                    {importResult.summary.assigned_existing || 0}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-600">Usuarios Creados</span>
                  <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1">
                    {importResult.summary.created_users}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Ya en esta Marca</span>
                  <div className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">
                    {importResult.summary.existing_records}
                  </div>
                </div>
              </div>

              {/* Error list if any */}
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="max-w-3xl mx-auto p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Registros con errores que no pudieron procesarse ({importResult.errors.length}):
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto text-xs">
                    {importResult.errors.map((err, i) => (
                      <div key={i} className="text-rose-700 flex items-center justify-between border-b border-rose-100 py-1">
                        <span><strong>#{err.moodle_id}</strong> {err.name} ({err.email})</span>
                        <span className="text-[11px] text-rose-500 font-medium">{err.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={resetProcess}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Importar Otro Archivo</span>
                </button>

                <Link
                  href="/admin/agencies"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Ver Agencias Creadas</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HISTORIAL DE IMPORTACIONES */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              Historial de Importaciones de Estudiantes
            </h3>
            <button
              onClick={loadHistory}
              disabled={isLoadingHistory}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Actualizar Historial"
            >
              <RotateCcw className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isLoadingHistory ? (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Cargando historial de importaciones...
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No hay importaciones registradas previamente en este White Label.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">ID / Fecha</th>
                    <th className="p-3.5">Archivo</th>
                    <th className="p-3.5 text-center">Total</th>
                    <th className="p-3.5 text-center">Nuevas Agencies</th>
                    <th className="p-3.5 text-center">Existentes Asignados</th>
                    <th className="p-3.5 text-center">Ya en Marca</th>
                    <th className="p-3.5 text-center">Errores</th>
                    <th className="p-3.5">Importado Por</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {historyList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800 dark:text-slate-200">#{item.id}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-3.5 font-bold font-mono text-blue-600">
                        {item.filename}
                      </td>
                      <td className="p-3.5 text-center font-bold">
                        {item.total_records}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          +{item.created_agencies}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {item.assigned_existing && item.assigned_existing > 0 ? (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-bold text-[10px]">
                            +{item.assigned_existing}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center text-slate-500">
                        {item.existing_records}
                      </td>
                      <td className="p-3.5 text-center">
                        {item.error_records > 0 ? (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px]">
                            {item.error_records}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">
                        {item.imported_by_user?.name || `Usuario #${item.imported_by}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && previewSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  ¿Deseas importar y asignar estos estudiantes?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Confirmación de creación y asignación a tu Marca Blanca.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">White Label Anfitriona:</span>
                <span className="font-extrabold text-blue-600">{targetWhiteLabel?.name || 'Tu Marca Blanca'}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Nuevas Agencies a crear:</span>
                <span className="font-extrabold text-emerald-600">+{previewSummary.new_agencies}</span>
              </div>
              {previewSummary.assigned_existing && previewSummary.assigned_existing > 0 ? (
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Agencies / Usuarios a asignar a esta Marca:</span>
                  <span className="font-extrabold text-purple-600">+{previewSummary.assigned_existing}</span>
                </div>
              ) : null}
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Ya pertenecientes a esta Marca (sin cambios):</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{previewSummary.existing_users}</span>
              </div>
              {previewSummary.deleted_moodle > 0 && (
                <div className="flex justify-between font-medium text-amber-600">
                  <span>Eliminados en Moodle (omitidos):</span>
                  <span className="font-bold">{previewSummary.deleted_moodle}</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Esta operación creará las nuevas Agencies requeridas y asignará tanto las nuevas como las existentes a tu Marca Blanca anfitriona, estableciendo al estudiante como Administrador de su propia Agency.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isImporting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={handleExecuteImport}
                disabled={isImporting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
              >
                {isImporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sí, Ejecutar Importación</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhiteLabelStudentImportPage;
