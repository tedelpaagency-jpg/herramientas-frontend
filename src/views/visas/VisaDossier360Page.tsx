'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import visaWholesaleService, { 
  VisaDossier, VisaDocument, VisaMessage, VisaTimelineEvent, formatPublicDossierLink 
} from '@/services/visaWholesaleService';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, ArrowLeft, Download, Copy, Check, ExternalLink, 
  Clock, AlertTriangle, AlertCircle, CheckCircle2, User, Users, 
  Building2, Calendar, FileText, Send, Eye, RefreshCw, Upload, 
  Lock, Unlock, MessageSquare, History, CheckSquare, Sparkles, X, ChevronRight, UserCheck, MapPin,
  File, Edit2
} from 'lucide-react';
import ConsularFormRenderer from '@/components/visas/forms/ConsularFormRenderer';
import VisaProcessTimeline from '@/components/visas/VisaProcessTimeline';
import toast from 'react-hot-toast';
import { ViewPaymentReceiptModal } from '@/components/visas/modals/ViewPaymentReceiptModal';

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

  // Estados para Comprobante de Cita Consular (Operador / Marca Blanca)
  const [appointmentFile, setAppointmentFile] = useState<File | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentLocation, setAppointmentLocation] = useState<string>('');
  const [appointmentNotes, setAppointmentNotes] = useState<string>('');
  const [isUploadingAppointment, setIsUploadingAppointment] = useState(false);
  const [isEditingAppointment, setIsEditingAppointment] = useState(false);

  const [newMessage, setNewMessage] = useState('');
  const [messageVisibility, setMessageVisibility] = useState<'public' | 'internal'>('public');

  const [copiedLink, setCopiedLink] = useState(false);

  // Modal y acciones de aprobación / rechazo de pago por operador mayorista
  const [isRejectPaymentModalOpen, setIsRejectPaymentModalOpen] = useState(false);
  const [paymentRejectionReason, setPaymentRejectionReason] = useState('');
  const [isProcessingPaymentDecision, setIsProcessingPaymentDecision] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<{ url?: string | null; title?: string } | null>(null);
  const [isTogglingLock, setIsTogglingLock] = useState(false);

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

  useEffect(() => {
    if (dossier) {
      if (dossier.appointment_date) {
        try {
          const d = new Date(dossier.appointment_date);
          const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          setAppointmentDate(iso);
        } catch {
          setAppointmentDate(dossier.appointment_date);
        }
      } else {
        setAppointmentDate('');
      }
      setAppointmentLocation(dossier.appointment_location || '');
      setAppointmentNotes(dossier.appointment_notes || '');
    }
  }, [dossier]);

  const handleCopyClientLink = async () => {
    if (!dossier) return;
    if (!dossier.is_exempt && dossier.approval_status !== 'aprobado') {
      const msg = dossier.payment_status === 'comprobante_rechazado'
        ? `Enlace bloqueado: Comprobante rechazado (${dossier.rejection_reason || 'Favor subir uno nuevo'}).`
        : dossier.payment_status === 'comprobante_enviado'
        ? 'Enlace bloqueado: Comprobante en revisión por el operador mayorista.'
        : 'Enlace bloqueado: Debe adjuntar el comprobante de pago y esperar aprobación del operador.';
      toast.error(msg, { duration: 6000 });
      return;
    }
    try {
      const res = await visaWholesaleService.getClientLink(dossier.id);
      const url = formatPublicDossierLink(dossier.access_token, res?.public_link);
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast.success('¡Enlace único copiado al portapapeles!');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al obtener enlace.');
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

  const handleApprovePayment = async () => {
    if (!dossier) return;
    if (!confirm(`¿Aprobar solicitud y comprobante del expediente ${dossier.code}? Esto habilitará de inmediato el enlace público para el cliente final.`)) {
      return;
    }

    setIsProcessingPaymentDecision(true);
    try {
      await visaWholesaleService.approveDossierPayment(dossier.id);
      toast.success(`¡Solicitud ${dossier.code} aprobada! Enlace público habilitado.`);
      fetchDossier();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al aprobar solicitud');
    } finally {
      setIsProcessingPaymentDecision(false);
    }
  };

  const handleConfirmRejectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dossier) return;
    if (!paymentRejectionReason.trim()) {
      toast.error('Debe ingresar el motivo de rechazo del comprobante');
      return;
    }

    setIsProcessingPaymentDecision(true);
    try {
      await visaWholesaleService.rejectDossierPayment(dossier.id, paymentRejectionReason.trim());
      toast.success('Comprobante rechazado. La agencia ha sido notificada para actualizarlo.');
      setIsRejectPaymentModalOpen(false);
      setPaymentRejectionReason('');
      fetchDossier();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al rechazar comprobante');
    } finally {
      setIsProcessingPaymentDecision(false);
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

  const handleUploadAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dossier) return;
    if (!appointmentFile && !dossier.appointment_receipt_url) {
      toast.error('Seleccione un archivo válido (PDF, PNG o JPG)');
      return;
    }

    setIsUploadingAppointment(true);
    try {
      await visaWholesaleService.uploadAppointmentReceipt(dossier.id, appointmentFile || undefined, {
        appointment_date: appointmentDate || undefined,
        appointment_location: appointmentLocation || undefined,
        appointment_notes: appointmentNotes || undefined,
      });
      toast.success(dossier.appointment_receipt_url ? '¡Datos y comprobante de cita actualizados exitosamente!' : '¡Comprobante de cita consular cargado exitosamente!');
      setAppointmentFile(null);
      setIsEditingAppointment(false);
      fetchDossier();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al subir comprobante de cita');
    } finally {
      setIsUploadingAppointment(false);
    }
  };

  const handleToggleFormLock = async () => {
    if (!dossier) return;
    const targetState = !dossier.is_form_locked;
    const confirmMsg = targetState
      ? `¿Bloquear el formulario público del expediente ${dossier.code}? Esto ocultará la sección de datos personales en el portal del cliente y dejará exclusivamente la columna de seguimiento.`
      : `¿Habilitar nuevamente la edición del formulario para el cliente en el expediente ${dossier.code}? El cliente podrá actualizar y corregir su información.`;

    if (!confirm(confirmMsg)) return;

    setIsTogglingLock(true);
    try {
      await visaWholesaleService.toggleFormLock(dossier.id, targetState);
      toast.success(targetState ? 'Formulario público bloqueado para protección de datos personales.' : 'Edición del formulario habilitada para el cliente.');
      fetchDossier();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al modificar estado de bloqueo del formulario.');
    } finally {
      setIsTogglingLock(false);
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

  const processType = dossier.processType || (dossier as any).process_type;
  const stages = processType?.stages_schema || [];
  const supportDocuments = dossier.documents?.filter(d => d.document_type !== 'cita_consular') || [];
  const requiredDocsCount = supportDocuments.length;
  const approvedDocsCount = supportDocuments.filter(d => d.status === 'aprobado').length;

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

        <div className="flex flex-wrap items-center gap-2">
          {dossier.payment_receipt_url && (
            <button
              type="button"
              onClick={() => setIsReceiptModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-bold border border-sky-200 dark:border-sky-800 transition-all cursor-pointer"
              title="Ver Comprobante de Pago Subido en modal"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Ver Comprobante</span>
            </button>
          )}

          {dossier.appointment_receipt_url && (
            <button
              type="button"
              onClick={() => setViewingDoc({ url: dossier.appointment_receipt_url!, title: 'Comprobante de Cita Consular' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold border border-purple-200 dark:border-purple-800 transition-all cursor-pointer"
              title="Ver Comprobante de Cita Consular en modal"
            >
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Ver Cita</span>
            </button>
          )}

          {isMayorista && (
            <button
              type="button"
              disabled={isTogglingLock}
              onClick={handleToggleFormLock}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                dossier.is_form_locked
                  ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title={
                dossier.is_form_locked
                  ? 'Formulario bloqueado al cliente (Protección de datos). Clic para habilitar edición.'
                  : 'Formulario editable para el cliente. Clic para bloquearlo y dejar solo seguimiento.'
              }
            >
              {dossier.is_form_locked ? <Unlock className="w-3.5 h-3.5 text-amber-600" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
              <span>{dossier.is_form_locked ? 'Habilitar Edición' : 'Bloquear Formulario'}</span>
            </button>
          )}

          {isMayorista && !dossier.is_exempt && dossier.approval_status !== 'aprobado' && (
            <div className="flex items-center gap-2 mr-1 pr-2 border-r border-slate-200 dark:border-slate-700">
              <button
                disabled={isProcessingPaymentDecision}
                onClick={handleApprovePayment}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/30 disabled:opacity-50"
                title="Aprobar Solicitud y Pago (Habilita el Enlace Público)"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Aprobar Solicitud y Pago</span>
              </button>
              <button
                disabled={isProcessingPaymentDecision}
                onClick={() => {
                  setPaymentRejectionReason('');
                  setIsRejectPaymentModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800 transition-all disabled:opacity-50"
                title="Rechazar Comprobante indicando motivo"
              >
                <X className="w-3.5 h-3.5" />
                <span>Rechazar</span>
              </button>
            </div>
          )}

          {(!dossier.is_exempt && dossier.approval_status !== 'aprobado') ? (
            <button
              onClick={handleCopyClientLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-semibold transition-all border border-amber-200 dark:border-amber-800"
              title="Enlace público bloqueado hasta la aprobación del comprobante de pago"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Link Bloqueado (Requiere Aprobación)</span>
            </button>
          ) : (
            <button
              onClick={handleCopyClientLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold transition-all border border-emerald-200 dark:border-emerald-800"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Copiado' : 'Copiar Link del Cliente'}
            </button>
          )}

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
                {dossier.applicant_name || dossier.client?.name || 'Solicitante'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {dossier.agency?.name || 'Agencia'}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>{processType?.flag_icon} {processType?.name} ({processType?.country})</span>
              <span>• Creado: {new Date(dossier.created_at).toLocaleDateString()}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Estado de Pago & Aprobación B2B */}
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Pago & Aprobación</span>
              {dossier.is_exempt ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Sparkles className="w-3.5 h-3.5" /> Exonerado
                </span>
              ) : dossier.approval_status === 'aprobado' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado (${Number(dossier.cost || 150).toFixed(2)})
                </span>
              ) : dossier.payment_status === 'comprobante_rechazado' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300" title={dossier.rejection_reason || 'Rechazado'}>
                  <AlertCircle className="w-3.5 h-3.5" /> Rechazado
                </span>
              ) : dossier.payment_status === 'comprobante_enviado' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300">
                  <Clock className="w-3.5 h-3.5" /> Por Revisar
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300">
                  <AlertTriangle className="w-3.5 h-3.5" /> Pendiente Pago (${Number(dossier.cost || 150).toFixed(2)})
                </span>
              )}
            </div>

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

        {/* Banner de Comprobante Rechazado */}
        {!dossier.is_exempt && dossier.payment_status === 'comprobante_rechazado' && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-800 dark:text-rose-200">Comprobante de Pago Rechazado por el Operador Mayorista</p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                Motivo: <strong>{dossier.rejection_reason || 'Monto o comprobante incorrecto.'}</strong>
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
                La agencia debe actualizar el comprobante desde su panel para volver a someterlo a revisión. El link público permanecerá bloqueado.
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar & Stages */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Progreso: {dossier.progress}%
              </span>
              <span className="text-slate-400">• Fase / Etapa:</span>
              <strong className="text-sky-600 dark:text-sky-400 font-semibold capitalize">
                {(dossier.currentPhase || dossier.current_phase)?.name 
                  ? `Fase ${(dossier.currentPhase || dossier.current_phase)?.order}: ${(dossier.currentPhase || dossier.current_phase)?.name}`
                  : dossier.current_stage_key.replace('_', ' ')}
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
          <History className="w-4 h-4" /> Timeline & Trazabilidad
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
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.applicant_name || dossier.client?.name || 'Solicitante Principal'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Documento / Pasaporte:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.passport_number || dossier.client?.document_number || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Correo Electrónico:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.applicant_email || dossier.client?.email || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Teléfono / WhatsApp:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.applicant_phone || dossier.client?.phone || 'N/A'}</strong>
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
                    <strong className="text-slate-800 dark:text-slate-200">{processType?.name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">País de Destino:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{processType?.country}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Agencia Afiliada:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{dossier.agency?.name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-sky-500" />
                      Operador Mayorista:
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {dossier.assignedOperator?.name || (dossier as any).assigned_operator?.name || dossier.agency?.assigned_operator?.name || (dossier.agency as any)?.assignedOperator?.name || 'Asignado por Agencia'}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                    <span className="text-slate-400">Términos Aceptados por Cliente:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {dossier.terms_accepted_at ? new Date(dossier.terms_accepted_at).toLocaleString() : 'Pendiente de aceptación'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duración Estimada:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{processType?.estimated_duration || '3-6 meses'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Fase Actual & Acceso a Trazabilidad */}
            <div className="p-4 bg-gradient-to-r from-sky-50 via-indigo-50 to-slate-50 dark:from-sky-950/30 dark:via-indigo-950/30 dark:to-slate-900 border border-sky-200/80 dark:border-sky-800/80 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  Estado del Trámite & Trazabilidad de Fases
                </span>
                <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  {(dossier.currentPhase || (dossier as any).current_phase)?.name
                    ? `Fase ${(dossier.currentPhase || (dossier as any).current_phase)?.order}: ${(dossier.currentPhase || (dossier as any).current_phase)?.name}`
                    : 'Fase Inicial en Curso'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Progreso global: <strong className="text-slate-700 dark:text-slate-200">{dossier.progress}%</strong> • Consulte las fases completadas, la fase activa y las pendientes en la pestaña Timeline.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all shrink-0 active:scale-95"
              >
                <History className="w-4 h-4" />
                <span>Ver Trazabilidad y Fases</span>
                <ChevronRight className="w-4 h-4" />
              </button>
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

        {/* TAB 2: FORMULARIO CONSULAR OFICIAL */}
        {activeTab === 'formulario' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Formulario Consular Oficial ({dossier.country_destination || dossier.processType?.name || 'Visado'})
                </h4>
                <p className="text-xs text-slate-500">
                  Visualización completa de las casillas y respuestas oficiales registradas para el expediente.
                </p>
              </div>

              {isMayorista && (
                <button
                  type="button"
                  disabled={isTogglingLock}
                  onClick={handleToggleFormLock}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    dossier.is_form_locked
                      ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {dossier.is_form_locked ? <Unlock className="w-3.5 h-3.5 text-amber-600" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{dossier.is_form_locked ? 'Habilitar Edición al Cliente' : 'Bloquear Formulario Público'}</span>
                </button>
              )}
            </div>

            {/* Banner de Estado de Protección de Datos */}
            {dossier.is_form_locked ? (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 gap-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Formulario Público Oculto y Bloqueado:</strong> Para resguardo de datos personales, el cliente final actualmente solo visualiza el panel de seguimiento.
                  </span>
                </div>
                {isMayorista && (
                  <button
                    type="button"
                    disabled={isTogglingLock}
                    onClick={handleToggleFormLock}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shrink-0 cursor-pointer text-xs"
                  >
                    Habilitar Edición
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Edición Pública Habilitada:</strong> El cliente puede visualizar y editar sus respuestas en el enlace público.
                  </span>
                </div>
                {isMayorista && (
                  <button
                    type="button"
                    disabled={isTogglingLock}
                    onClick={handleToggleFormLock}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg shrink-0 cursor-pointer text-xs"
                  >
                    Bloquear Formulario
                  </button>
                )}
              </div>
            )}

            <ConsularFormRenderer
              countryDestination={dossier.country_destination}
              visaType={dossier.processType?.name?.includes('Schengen') || dossier.processType?.name?.includes('Europa') ? 'SCHENGEN' : dossier.processType?.name?.includes('Canad') ? 'CANADA' : (dossier.processType?.name?.includes('Reino Unido') || dossier.processType?.name?.includes('UK')) ? 'UK' : 'USA'}
              processSlug={dossier.processType?.slug}
              formData={dossier.form_data || {}}
              applicantName={dossier.applicant_name || dossier.client?.name}
              readOnly={true}
            />
          </div>
        )}

        {/* TAB 3: DOCUMENTOS */}
        {activeTab === 'documentos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMNA IZQUIERDA: ÁREA DE CITA CONSULAR (Operador Mayorista / Marca Blanca) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border-2 border-dashed border-sky-300/80 dark:border-sky-800/80 rounded-2xl p-5 shadow-sm space-y-4 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Comprobante de Cita Consular
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Confirmación oficial de la cita (PDF, PNG o JPG)
                    </p>
                  </div>
                </div>

                {dossier.appointment_receipt_url ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Programada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300">
                    <Clock className="w-3.5 h-3.5" /> Pendiente
                  </span>
                )}
              </div>

              {/* Vista si YA hay comprobante y no se está editando */}
              {dossier.appointment_receipt_url && !isEditingAppointment ? (
                <div className="space-y-4">
                  {/* Contenedor de Previsualización */}
                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 overflow-hidden">
                    {dossier.appointment_receipt_url.toLowerCase().includes('.pdf') ? (
                      <div className="flex flex-col items-center justify-center py-5 text-center space-y-2.5">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">Confirmación de Cita Consular</p>
                          <span className="text-[10px] text-slate-500 font-mono">Documento PDF Oficial</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewingDoc({ url: dossier.appointment_receipt_url!, title: 'Comprobante de Cita Consular' })}
                          className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver en Pantalla Completa
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative max-h-52 overflow-hidden rounded-lg bg-black/5 dark:bg-black/30 flex items-center justify-center">
                          <img
                            src={dossier.appointment_receipt_url}
                            alt="Comprobante de Cita Consular"
                            className="max-h-52 object-contain rounded-lg cursor-pointer hover:scale-102 transition-transform duration-200"
                            onClick={() => setViewingDoc({ url: dossier.appointment_receipt_url!, title: 'Comprobante de Cita Consular' })}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                          <span>Imagen de confirmación</span>
                          <button
                            type="button"
                            onClick={() => setViewingDoc({ url: dossier.appointment_receipt_url!, title: 'Comprobante de Cita Consular' })}
                            className="text-sky-600 dark:text-sky-400 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Ampliar imagen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metadatos de la cita */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block text-[11px]">Fecha y Hora de la Cita:</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {dossier.appointment_date
                            ? new Date(dossier.appointment_date).toLocaleString('es-ES', {
                                dateStyle: 'full',
                                timeStyle: 'short',
                              })
                            : 'Fecha no especificada'}
                        </strong>
                      </div>
                    </div>

                    {dossier.appointment_location && (
                      <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 block text-[11px]">Sede Consular / Embajada:</span>
                          <strong className="text-slate-800 dark:text-slate-200">{dossier.appointment_location}</strong>
                        </div>
                      </div>
                    )}

                    {dossier.appointment_notes && (
                      <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                        <FileText className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 block text-[11px]">Instrucciones / Notas:</span>
                          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{dossier.appointment_notes}</p>
                        </div>
                      </div>
                    )}

                    {dossier.appointment_receipt_uploaded_at && (
                      <div className="text-[10px] text-slate-400 pt-1 text-right">
                        Actualizado: {new Date(dossier.appointment_receipt_uploaded_at).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={dossier.appointment_receipt_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Descargar
                    </a>

                    {isMayorista && (
                      <button
                        type="button"
                        onClick={() => setIsEditingAppointment(true)}
                        className="flex-1 py-2 px-3 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Actualizar Cita
                      </button>
                    )}
                  </div>
                </div>
              ) : isMayorista ? (
                /* FORMULARIO DE CARGA PARA OPERADOR / MARCA BLANCA */
                <form onSubmit={handleUploadAppointment} className="space-y-3.5">
                  {/* Dropzone del Archivo */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Archivo de Cita Consular <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 rounded-xl p-4 text-center transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAppointmentFile(e.target.files[0]);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      {appointmentFile ? (
                        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-sky-200 dark:border-sky-800">
                          <div className="flex items-center gap-2 overflow-hidden text-left">
                            <File className="w-5 h-5 text-sky-600 shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {appointmentFile.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {(appointmentFile.size / 1024 / 1024).toFixed(2)} MB • {appointmentFile.type || 'Archivo'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAppointmentFile(null);
                            }}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                            title="Quitar archivo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1 py-1">
                          <div className="w-9 h-9 mx-auto rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                            <Upload className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Haga clic o arrastre el archivo aquí
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Admite <strong>PDF, PNG o JPG</strong> (Máx. 15 MB)
                          </p>
                          {dossier.appointment_receipt_url && (
                            <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium pt-0.5">
                              (Si no selecciona un archivo nuevo, se mantendrá el comprobante actual)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Campos de datos de la cita */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Fecha y Hora de la Cita
                      </label>
                      <input
                        type="datetime-local"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Sede Consular / Embajada
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Embajada de EE.UU. / Centro de Atención CAS"
                        value={appointmentLocation}
                        onChange={(e) => setAppointmentLocation(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Instrucciones / Notas para el Solicitante
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ej: Presentarse con 15 min de anticipación portando hoja de confirmación..."
                        value={appointmentNotes}
                        onChange={(e) => setAppointmentNotes(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>
                  </div>

                  {/* BOTÓN INFERIOR DE ENVÍO (Rectángulo inferior resaltado en la imagen) */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isUploadingAppointment || (!appointmentFile && !dossier.appointment_receipt_url)}
                      className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isUploadingAppointment ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Guardando cita...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>{dossier.appointment_receipt_url ? 'Guardar Cambios de la Cita' : 'Subir Comprobante de Cita'}</span>
                        </>
                      )}
                    </button>

                    {isEditingAppointment && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAppointment(false);
                          setAppointmentFile(null);
                        }}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                /* Estado para Agencias / Clientes cuando la cita aún no ha sido cargada */
                <div className="py-8 px-4 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-900">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Cita Consular Pendiente</h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                      El operador mayorista o la marca blanca adjuntará el comprobante oficial en PDF, PNG o JPG tan pronto como la cita sea programada.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* COLUMNA DERECHA: CHECKLIST DE DOCUMENTOS SOPORTES */}
            <div className="lg:col-span-7 space-y-4">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" /> Subir Documento
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                {supportDocuments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 italic">
                    No hay documentos de soporte adicionales registrados.
                  </div>
                ) : (
                  supportDocuments.map((doc) => {
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
                            <button
                              type="button"
                              onClick={() => doc.file_url && setViewingDoc({ url: doc.file_url, title: doc.name })}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                              title="Ver documento en modal"
                            >
                              <Eye className="w-3.5 h-3.5" /> Ver Archivo
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Sin archivo adjunto</span>
                          )}

                          {/* Botones de Mayorista para Revisión */}
                          {isMayorista && (
                            <>
                              <button
                                onClick={() => handleOpenObserveModal(doc)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-xs font-semibold rounded-lg inline-flex items-center gap-1 cursor-pointer"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" /> Observar
                              </button>

                              <button
                                onClick={() => handleApproveDocument(doc)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" /> Aprobar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
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

        {/* TAB 5: TIMELINE & TRAZABILIDAD COMPLETA */}
        {activeTab === 'timeline' && (
          <div className="space-y-8">
            {/* Trazabilidad de Fases: Estados completados, actual y faltantes */}
            <div className="space-y-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-sky-500" />
                  Trazabilidad de Fases del Proceso Migratorio
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Línea de tiempo del trámite: consulte las fases completadas con sus notas y validador, el estado y fase actual en curso, y todas las fases que faltan por realizar para completar el visado.
                </p>
              </div>

              <VisaProcessTimeline
                dossierId={dossier.id}
                dossierCode={dossier.code}
                currentPhaseId={dossier.current_phase_id}
                phases={dossier.phases || processType?.phases || []}
                histories={dossier.phaseHistories || (dossier as any).phase_histories || []}
                isOperator={isMayorista}
                onPhaseAdvanced={fetchDossier}
              />
            </div>

            {/* Registro de Auditoría y Eventos del Sistema */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Registro de Auditoría y Eventos del Expediente ({dossier.timelineEvents?.length || (dossier as any).timeline_events?.length || 0})
                </h4>
                <p className="text-xs text-slate-400">
                  Historial cronológico de cambios de estado, notificaciones, interacciones y auditoría del sistema.
                </p>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-5">
                {(dossier.timelineEvents || (dossier as any).timeline_events)?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No hay eventos adicionales registrados en el historial.</p>
                ) : (
                  (dossier.timelineEvents || (dossier as any).timeline_events)?.map((ev: any) => (
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
                  ))
                )}
              </div>
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

      {/* Modal: Rechazar Comprobante de Pago por Operador */}
      {isRejectPaymentModalOpen && dossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Rechazar Comprobante de Pago</h3>
                <p className="text-xs text-slate-500 font-mono">{dossier.code} — {dossier.agency?.name || 'Agencia'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Indique el motivo del rechazo para que la agencia afiliada pueda corregir y cargar un nuevo comprobante dentro del mismo expediente. El link público permanecerá bloqueado.
            </p>

            <form onSubmit={handleConfirmRejectPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Motivo del Rechazo *
                </label>
                <textarea
                  rows={3}
                  required
                  value={paymentRejectionReason}
                  onChange={(e) => setPaymentRejectionReason(e.target.value)}
                  placeholder="Ej. El monto transferido no coincide con el costo del servicio..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRejectPaymentModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPaymentDecision}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isProcessingPaymentDecision ? 'Procesando...' : 'Confirmar Rechazo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Ver Comprobante de Pago */}
      <ViewPaymentReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptUrl={dossier?.payment_receipt_url}
        applicantName={dossier?.applicant_name}
        dossierCode={dossier?.code}
        cost={dossier?.cost}
        uploadedAt={dossier?.payment_receipt_uploaded_at || dossier?.updated_at}
        onApprove={(isMayorista && !dossier?.is_exempt && dossier?.approval_status !== 'aprobado') ? () => {
          setIsReceiptModalOpen(false);
          handleApprovePayment();
        } : undefined}
        onReject={(isMayorista && !dossier?.is_exempt && dossier?.approval_status !== 'aprobado') ? () => {
          setIsReceiptModalOpen(false);
          setPaymentRejectionReason('');
          setIsRejectPaymentModalOpen(true);
        } : undefined}
        isProcessingAction={isProcessingPaymentDecision}
      />

      {/* Modal para Ver Documento del Expediente */}
      <ViewPaymentReceiptModal
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        receiptUrl={viewingDoc?.url}
        title={viewingDoc?.title || 'Documento'}
        applicantName={dossier?.applicant_name}
        dossierCode={dossier?.code}
      />
    </div>
  );
};
