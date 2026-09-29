'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import visaWholesaleService, { 
  VisaDossier, VisaDocument, VisaMessage, VisaTimelineEvent 
} from '@/services/visaWholesaleService';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, ArrowLeft, Download, Copy, Check, ExternalLink, 
  Clock, AlertTriangle, AlertCircle, CheckCircle2, User, Users, 
  Building2, Calendar, FileText, Send, Eye, RefreshCw, Upload, 
  Lock, MessageSquare, History, CheckSquare, Sparkles, X, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export const VisaDossier360Page: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const dossierId = Number(params?.id);

  const [dossier, setDossier] = useState<VisaDossier | null>(null);
  const [activeTab, setActiveTab] = useState<'resumen' | 'formulario' | 'documentos' | 'mensajes' | 'timeline'>('resumen');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isObserveModalOpen, setIsObserveModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<VisaDocument | null>(null);
  const [observeData, setObserveData] = useState<{
    observation: string;
    observation_reason: string;
    responsible_to_fix: 'cliente' | 'agencia';
  }>({
    observation: '',
    observation_reason: 'Documento correspondiente a una fecha anterior. Favor cargar versión actualizada.',
    responsible_to_fix: 'cliente',
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('');
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newMessage, setNewMessage] = useState('');
  const [messageVisibility, setMessageVisibility] = useState<'public' | 'internal'>('public');

  const [copiedLink, setCopiedLink] = useState(false);

  const isMayorista = user?.role === 'super_admin' || 
    user?.role === 'white_label_admin' || 
    user?.roles?.some((r: any) => ['super_admin', 'white_label_admin', 'mayorista_supervisor', 'mayorista_operador'].includes(r.name));

  const fetchDossier = async () => {
    if (!dossierId) return;
    setIsLoading(true);
    try {
      const data = await visaWholesaleService.getDossier(dossierId);
      setDossier(data);
    } catch (err) {
      console.error('Error al cargar expediente:', err);
      toast.error('No se pudo cargar el expediente migratorio.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDossier();
  }, [dossierId]);

  const handleCopyClientLink = async () => {
    if (!dossier) return;
    try {
      const res = await visaWholesaleService.getClientLink(dossier.id);
      const url = res?.public_link || `${window.location.origin}/visas/portal/${dossier.access_token}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast.success('¡Enlace único copiado al portapapeles!');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      toast.error('Error al obtener enlace.');
    }
  };

  const handleDownloadPdf = async () => {
    if (!dossier) return;
    toast.loading('Generando expediente PDF...', { id: 'pdf-toast' });
    try {
      await visaWholesaleService.downloadDossierPdf(dossier.id, dossier.code);
      toast.success('Expediente PDF descargado correctamente.', { id: 'pdf-toast' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Acceso denegado: no tiene permisos para descargar el PDF.', { id: 'pdf-toast' });
    }
  };

  const handleStageChange = async (newStageKey: string) => {
    if (!dossier) return;
    try {
      await visaWholesaleService.updateDossier(dossier.id, { current_stage_key: newStageKey });
      toast.success('Etapa actualizada exitosamente.');
      fetchDossier();
    } catch (err) {
      toast.error('Error al actualizar etapa.');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!dossier) return;
    try {
      await visaWholesaleService.updateDossier(dossier.id, { status: newStatus });
      toast.success('Estado del servicio actualizado.');
      fetchDossier();
    } catch (err) {
      toast.error('Error al actualizar estado.');
    }
  };

  const handleExternalResultChange = async (result: string) => {
    if (!dossier) return;
    try {
      await visaWholesaleService.updateDossier(dossier.id, { external_result: result });
      toast.success('Resultado consular actualizado.');
      fetchDossier();
    } catch (err) {
      toast.error('Error al actualizar resultado.');
    }
  };

  const handleOpenObserveModal = (doc: VisaDocument) => {
    setSelectedDoc(doc);
    setObserveData({
      observation: '',
      observation_reason: 'El documento presentado corresponde a una fecha anterior. Favor cargar versión actualizada.',
      responsible_to_fix: 'cliente',
    });
    setIsObserveModalOpen(true);
  };

  const submitObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    if (!observeData.observation.trim()) {
      toast.error('Ingrese el detalle de la observación');
      return;
    }

    setIsSubmitting(true);
    try {
      await visaWholesaleService.observeDocument(selectedDoc.id, {
        observation: observeData.observation,
        observation_reason: observeData.observation_reason,
        responsible_to_fix: observeData.responsible_to_fix,
      });
      toast.success('Documento observado con retroalimentación registrada.');
      setIsObserveModalOpen(false);
      fetchDossier();
    } catch (err) {
      toast.error('Error al registrar observación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveDocument = async (doc: VisaDocument) => {
    try {
      await visaWholesaleService.approveDocument(doc.id);
      toast.success(`Documento '${doc.name}' aprobado exitosamente.`);
      fetchDossier();
    } catch (err) {
      toast.error('Error al aprobar documento.');
    }
  };

  const submitDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dossier || !uploadFile) {
      toast.error('Seleccione un archivo válido');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('document_type', uploadDocType || 'general');
      formData.append('name', uploadDocName || uploadFile.name);

      await visaWholesaleService.uploadDocument(dossier.id, formData);
      toast.success('Documento cargado correctamente.');
      setIsUploadModalOpen(false);
      setUploadFile(null);
      fetchDossier();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar documento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dossier || !newMessage.trim()) return;

    try {
      await visaWholesaleService.sendMessage(dossier.id, newMessage, messageVisibility);
      setNewMessage('');
      toast.success(messageVisibility === 'internal' ? 'Nota interna guardada.' : 'Mensaje enviado.');
      fetchDossier();
    } catch (err) {
      toast.error('Error al enviar mensaje.');
    }
  };

  if (isLoading || !dossier) {
    return (
      <div className="p-12 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-sky-500" />
        <p className="font-semibold text-slate-700 dark:text-slate-300">Cargando expediente 360°...</p>
      </div>
    );
  }

  const stages = dossier.processType?.stages_schema || [];
  const requiredDocsCount = dossier.documents?.length || 0;
  const approvedDocsCount = dossier.documents?.filter(d => d.status === 'aprobado').length || 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al listado
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyClientLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold transition-all border border-emerald-200 dark:border-emerald-800"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Copiado' : 'Copiar Link del Cliente'}
          </button>

          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold transition-all border border-indigo-200 dark:border-indigo-800"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar Expediente PDF
          </button>
        </div>
      </div>

      {/* 360° Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono font-black text-2xl text-sky-600 dark:text-sky-400 tracking-tight">
                {dossier.code}
              </span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {dossier.client?.name || 'Cliente'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {dossier.agency?.name || 'Agencia'}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>{dossier.processType?.flag_icon} {dossier.processType?.name} ({dossier.processType?.country})</span>
              <span>• Creado: {new Date(dossier.created_at).toLocaleDateString()}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Estado del Servicio</span>
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 capitalize border border-sky-200 dark:border-sky-800">
                {dossier.status.replace('_', ' ')}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Resultado Consular</span>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-lg uppercase border ${
                dossier.external_result === 'aprobado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                dossier.external_result === 'rechazado' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {dossier.external_result}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Stages */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Progreso: {dossier.progress}%
              </span>
              <span className="text-slate-400">• Etapa Actual:</span>
              <strong className="text-sky-600 dark:text-sky-400 font-semibold capitalize">
                {dossier.current_stage_key.replace('_', ' ')}
              </strong>
            </div>

            {/* Stage Selector for Operators */}
            {isMayorista && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Avanzar Etapa:</span>
                <select
                  value={dossier.current_stage_key}
                  onChange={(e) => handleStageChange(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-slate-100"
                >
                  {stages.map((st) => (
                    <option key={st.key} value={st.key}>
                      {st.name} ({st.weight}%)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${dossier.progress}%` }}
            />
          </div>
        </div>

        {/* Action Required Banner */}
        {dossier.action_required && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-300 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>Acción Requerida: <strong>{dossier.action_required}</strong></span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-200/60 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-semibold">
                Responsable: {dossier.current_responsible.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('documentos')}
              className="text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline"
            >
              Gestionar en Documentos →
            </button>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 sm:space-x-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('resumen')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'resumen'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Resumen
        </button>

        <button
          onClick={() => setActiveTab('formulario')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'formulario'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Formulario Consular
        </button>

        <button
          onClick={() => setActiveTab('documentos')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'documentos'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Documentos ({approvedDocsCount}/{requiredDocsCount})
        </button>

        <button
          onClick={() => setActiveTab('mensajes')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'mensajes'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Mensajería & Notas ({dossier.messages?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'timeline'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" /> Timeline ({dossier.timelineEvents?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm min-h-[400px]">
        {/* TAB 1: RESUMEN */}
        {activeTab === 'resumen' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información del Solicitante */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-500" />
                  Datos del Cliente Solicitante
                </h3>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Nombre Completo:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.client?.name || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Documento / Cédula:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.client?.document_number || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Correo Electrónico:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.client?.email || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Teléfono / WhatsApp:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.client?.phone || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Grupo Familiar/Corporativo:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {dossier.group ? `${dossier.group.name} (${dossier.group.group_type})` : 'Individual'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Información del Trámite */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  Detalles del Trámite Migratorio
                </h3>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Tipo de Proceso:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.processType?.name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">País de Destino:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.processType?.country}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Agencia Afiliada:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.agency?.name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Términos Aceptados por Cliente:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {dossier.terms_accepted_at ? new Date(dossier.terms_accepted_at).toLocaleString() : 'Pendiente de aceptación'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duración Estimada:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.processType?.estimated_duration || '3-6 meses'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Notas Internas */}
            {isMayorista && (
              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Notas Internas de la Mayorista (Confidencial)
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {dossier.internal_notes || 'No se han registrado notas internas confidenciales aún.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FORMULARIO */}
        {activeTab === 'formulario' && (
          <div className="space-y-6">
            {dossier.processType?.form_schema?.sections?.map((section) => {
              const formData = dossier.form_data || {};
              return (
                <div key={section.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{section.title}</h4>
                    {section.description && <p className="text-xs text-slate-400">{section.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.fields?.map((field) => {
                      const val = formData[field.name];
                      return (
                        <div key={field.name} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                          <div className="flex justify-between items-center text-[11px] text-slate-500 mb-1">
                            <span className="font-medium">{field.label}</span>
                            {field.required_for_review && (
                              <span className="text-[10px] font-bold text-sky-600 bg-sky-100 dark:bg-sky-950/60 px-1.5 py-0.2 rounded">
                                Requerido para Revisión
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {val !== undefined && val !== null && val !== '' 
                              ? (Array.isArray(val) ? val.join(', ') : String(val)) 
                              : <span className="text-slate-400 italic">No proporcionado</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: DOCUMENTOS */}
        {activeTab === 'documentos' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Checklist de Documentos Soportes</h3>
                <p className="text-xs text-slate-500">Documentos cargados desde el formulario del cliente o por la agencia.</p>
              </div>

              <button
                onClick={() => {
                  setUploadDocType('general');
                  setUploadDocName('');
                  setUploadFile(null);
                  setIsUploadModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold"
              >
                <Upload className="w-3.5 h-3.5" /> Subir Documento
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              {dossier.documents?.map((doc) => {
                const statusBadges = {
                  pendiente: 'bg-slate-100 text-slate-600 border-slate-200',
                  recibido: 'bg-sky-100 text-sky-700 border-sky-200',
                  en_revision: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                  observado: 'bg-rose-100 text-rose-700 border-rose-200',
                  aprobado: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                };

                return (
                  <div key={doc.id} className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{doc.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${statusBadges[doc.status] || statusBadges.pendiente}`}>
                          {doc.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">v{doc.version}</span>
                      </div>

                      {doc.observation && (
                        <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900 mt-1">
                          <strong>Observación:</strong> {doc.observation}
                          {doc.responsible_to_fix && <span className="ml-2 font-medium">(Responsable: {doc.responsible_to_fix})</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.file_url ? (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver Archivo
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Sin archivo adjunto</span>
                      )}

                      {/* Botones de Mayorista para Revisión */}
                      {isMayorista && (
                        <>
                          <button
                            onClick={() => handleOpenObserveModal(doc)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-xs font-semibold rounded-lg inline-flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" /> Observar
                          </button>

                          <button
                            onClick={() => handleApproveDocument(doc)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Aprobar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: MENSAJES */}
        {activeTab === 'mensajes' && (
          <div className="space-y-4">
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
              {dossier.messages?.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400 italic">No hay mensajes registrados en este expediente.</p>
              ) : (
                dossier.messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      msg.visibility === 'internal'
                        ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <strong className="font-bold">{msg.sender_name || msg.user?.name || 'Usuario'}</strong>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 uppercase font-medium">
                          {msg.sender_type}
                        </span>
                        {msg.visibility === 'internal' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 uppercase font-bold flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Nota Interna
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Input de Mensaje */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Enviar Mensaje / Nota:</span>
                {isMayorista && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 cursor-pointer flex items-center gap-1">
                      <input
                        type="radio"
                        name="vis"
                        checked={messageVisibility === 'public'}
                        onChange={() => setMessageVisibility('public')}
                      />
                      Público (Cliente & Agencia)
                    </label>
                    <label className="text-xs text-amber-600 dark:text-amber-400 cursor-pointer flex items-center gap-1">
                      <input
                        type="radio"
                        name="vis"
                        checked={messageVisibility === 'internal'}
                        onChange={() => setMessageVisibility('internal')}
                      />
                      <Lock className="w-3 h-3" /> Solo Interno
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escriba su mensaje relacionado a este expediente..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold flex items-center justify-center flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Trazabilidad Histórica Completa</h3>
            <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
              {dossier.timelineEvents?.map((ev) => (
                <div key={ev.id} className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-sky-500 border-2 border-white dark:border-slate-900" />
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ev.title}</span>
                      <span className="text-[10px] text-slate-400">• {new Date(ev.created_at).toLocaleString()}</span>
                      <span className="text-[10px] uppercase font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.2 rounded">
                        {ev.actor_type}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{ev.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Observar Documento */}
      {isObserveModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Observar Documento: {selectedDoc.name}
              </h3>
              <button onClick={() => setIsObserveModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={submitObservation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  ¿Quién debe solucionarlo? *
                </label>
                <div className="flex gap-4">
                  <label className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="resp"
                      checked={observeData.responsible_to_fix === 'cliente'}
                      onChange={() => setObserveData({ ...observeData, responsible_to_fix: 'cliente' })}
                    />
                    Cliente Final
                  </label>
                  <label className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="resp"
                      checked={observeData.responsible_to_fix === 'agencia'}
                      onChange={() => setObserveData({ ...observeData, responsible_to_fix: 'agencia' })}
                    />
                    Ejecutivo de Agencia
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Comentario / Qué está mal y qué se necesita *
                </label>
                <textarea
                  required
                  rows={3}
                  value={observeData.observation}
                  onChange={(e) => setObserveData({ ...observeData, observation: e.target.value })}
                  placeholder="Ej: El documento presentado corresponde a una fecha anterior. Favor cargar versión actualizada de los últimos 3 meses."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsObserveModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-500 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Registrar Observación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Subir Documento */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Cargar Documento al Expediente</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={submitDocumentUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre del Documento *
                </label>
                <input
                  type="text"
                  required
                  value={uploadDocName}
                  onChange={(e) => setUploadDocName(e.target.value)}
                  placeholder="Ej: Pasaporte Vigente o Rol de Pagos"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Archivo (PDF, PNG, JPG, WEBP - máx 15MB) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-500 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-sky-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Cargando...' : 'Subir Archivo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
