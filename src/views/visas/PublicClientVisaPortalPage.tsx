'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import visaWholesaleService, { VisaDocument, VisaMessage, VisaTimelineEvent } from '@/services/visaWholesaleService';
import { normalizeFileUrl } from '@/services/apiClient';
import { 
  ShieldCheck, CheckCircle2, Clock, AlertTriangle, AlertCircle, 
  Upload, FileText, Send, Eye, RefreshCw, Check, ArrowRight, Lock, 
  HelpCircle, ChevronDown, ChevronUp, User, Globe, Sun, Moon, 
  Building2, Phone, Mail, MessageSquare, Calendar, Sparkles, History
} from 'lucide-react';
import ConsularFormRenderer from '@/components/visas/forms/ConsularFormRenderer';
import VisaProcessTimeline from '@/components/visas/VisaProcessTimeline';
import toast from 'react-hot-toast';

export const PublicClientVisaPortalPage: React.FC = () => {
  const params = useParams();
  const token = params?.token as string;

  const [portalData, setPortalData] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // Dark Mode Toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Agency Floating Logo Error handling
  const [hasLogoError, setHasLogoError] = useState(false);

  // Policy Modal
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [isAcceptingPolicy, setIsAcceptingPolicy] = useState(false);

  // Document Upload
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDocForUpload, setSelectedDocForUpload] = useState<VisaDocument | null>(null);

  // Messaging
  const [clientMessage, setClientMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Auto-save feedback
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Initialize Dark Mode from localStorage or system preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('visa_portal_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      } else if (savedTheme === 'light') {
        setIsDarkMode(false);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
      }
    } catch (e) {
      // Ignore if localStorage unavailable
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('visa_portal_theme', next ? 'dark' : 'light');
      } catch (e) {}
      return next;
    });
  };

  const fetchPortal = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await visaWholesaleService.getPublicPortalData(token);
      if (res?.data) {
        setPortalData(res.data);
        setFormData(res.data.dossier?.form_data || {});
        setHasLogoError(false);

        const sections = res.data.process?.form_schema?.sections || [];
        if (sections.length > 0 && !activeSectionId) {
          setActiveSectionId(sections[0].id);
        }

        // Show policy modal if not accepted yet
        if (!res.data.dossier?.terms_accepted_at) {
          setShowPolicyModal(true);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al cargar el portal');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortal();
  }, [token]);

  // Handle Input Change with Progressive Auto-save
  const handleInputChange = (fieldName: string, value: any) => {
    const updated = { ...formData, [fieldName]: value };
    setFormData(updated);

    // Debounced progressive save
    if ((window as any)._saveTimeout) {
      clearTimeout((window as any)._saveTimeout);
    }
    (window as any)._saveTimeout = setTimeout(async () => {
      try {
        await visaWholesaleService.savePublicProgress(token, updated);
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.error('Error auto-saving progress:', err);
      }
    }, 1000);
  };

  const handleAcceptPolicies = async () => {
    if (!policyAccepted) {
      toast.error('Debe marcar la casilla de aceptación para continuar.');
      return;
    }
    setIsAcceptingPolicy(true);
    try {
      await visaWholesaleService.acceptPublicPolicies(token);
      toast.success('¡Políticas y consentimiento aceptados!');
      setShowPolicyModal(false);
      fetchPortal();
    } catch (err) {
      toast.error('Error al registrar consentimiento.');
    } finally {
      setIsAcceptingPolicy(false);
    }
  };

  const handleTriggerUpload = (doc: VisaDocument) => {
    setSelectedDocForUpload(doc);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDocForUpload) return;

    setIsUploading(true);
    toast.loading('Subiendo documento...', { id: 'upload-toast' });
    try {
      const formPayload = new FormData();
      formPayload.append('file', file);
      formPayload.append('document_id', String(selectedDocForUpload.id));
      formPayload.append('document_type', selectedDocForUpload.document_type);
      formPayload.append('name', selectedDocForUpload.name);

      await visaWholesaleService.uploadPublicDocument(token, formPayload);
      toast.success(`Documento '${selectedDocForUpload.name}' cargado exitosamente.`, { id: 'upload-toast' });
      fetchPortal();
    } catch (err) {
      toast.error('Error al cargar documento.', { id: 'upload-toast' });
    } finally {
      setIsUploading(false);
      setSelectedDocForUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessage.trim()) return;

    setIsSendingMessage(true);
    try {
      await visaWholesaleService.sendPublicMessage(token, clientMessage);
      setClientMessage('');
      toast.success('Mensaje enviado a su asesor.');
      fetchPortal();
    } catch (err) {
      toast.error('Error al enviar mensaje.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleSubmitFinalForm = async () => {
    if (!confirm('¿Confirma que ha completado todos los datos requeridos y desea enviar el expediente a revisión consular?')) {
      return;
    }

    setIsSubmittingForm(true);
    try {
      const res = await visaWholesaleService.submitPublicForm(token, formData);
      toast.success(res.message || '¡Formulario enviado con éxito!');
      fetchPortal();
    } catch (err) {
      toast.error('Error al enviar el formulario.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (isLoading || !portalData) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors">
          <div className="text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-sky-600 dark:text-sky-400" />
            <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">Cargando su portal migratorio seguro...</p>
          </div>
        </div>
      </div>
    );
  }

  const { dossier, agency, client, process, documents, timeline, messages, policies } = portalData;
  const applicantDisplayName = dossier?.applicant_name || client?.name || 'Solicitante';

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
          className="hidden"
        />

        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 shadow-xs transition-colors">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
            {/* Agency / Brand */}
            <div className="flex items-center gap-3">
              <span className="p-2 bg-sky-50 dark:bg-sky-950/60 rounded-xl text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-tight">
                    {agency?.name || 'Portal Migratorio Oficial'}
                  </h1>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Expediente <span className="font-bold text-sky-600 dark:text-sky-400">{dossier?.code}</span>
                </p>
              </div>
            </div>

            {/* Actions: Theme Toggle & Status Badge */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Dark Mode Switch */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Alternar tema claro y oscuro"
                title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span className="hidden sm:inline">{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
              </button>

              {/* Status Pill */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider">
                  Estado
                </span>
                <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 capitalize">
                  {dossier?.status?.replace(/_/g, ' ') || 'En Gestión'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Layout: Form on Left, Traceability on Right */}
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ============================================================== */}
            {/* COLUMNA IZQUIERDA: FORMULARIO CONSULAR, DOCUMENTOS & MENSAJES */}
            {/* ============================================================== */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              
              {/* Form Header Info Banner */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>{process?.flag_icon || '🌐'}</span>
                      <span>{process?.name || 'Solicitud de Visado'}</span>
                      <span className="text-slate-400 dark:text-slate-600">•</span>
                      <span>{dossier?.country_destination || process?.country || 'Destino'}</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                      Formulario Consular Oficial
                    </h2>
                  </div>

                  {lastSavedTime && (
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-2xs">
                      <Check className="w-3.5 h-3.5" /> Guardado a las {lastSavedTime}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Por favor complete con veracidad todos los campos obligatorios requeridos por la autoridad consular. Sus respuestas se guardan automáticamente a medida que las escribe.
                </p>
              </div>

              {/* Formulario Consular Renderizado */}
              <div className="rounded-2xl overflow-hidden">
                <ConsularFormRenderer
                  countryDestination={dossier?.country_destination}
                  visaType={process?.name?.includes('Schengen') || process?.name?.includes('Europa') ? 'SCHENGEN' : process?.name?.includes('Canad') ? 'CANADA' : (process?.name?.includes('Reino Unido') || process?.name?.includes('UK')) ? 'UK' : 'USA'}
                  processSlug={process?.slug}
                  formData={formData}
                  onFieldChange={handleInputChange}
                  applicantName={applicantDisplayName}
                />
              </div>

              {/* CHECKLIST DE DOCUMENTOS DE SOPORTE */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                      <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                      <span>Checklist de Documentos de Soporte</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Adjunte los documentos solicitados en formato PDF o fotografía nítida (JPG, PNG, máx 15MB).
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
                  {documents?.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No se han configurado documentos específicos para este trámite.
                    </div>
                  ) : (
                    documents?.map((doc: VisaDocument) => (
                      <div key={doc.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900">
                        <div className="space-y-1 max-w-md">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-slate-800 dark:text-slate-200">{doc.name}</strong>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              doc.status === 'aprobado' ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                              doc.status === 'observado' ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                              doc.status === 'recibido' ? 'bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              {doc.status}
                            </span>
                          </div>

                          {doc.observation && (
                            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                              <strong>Observación del especialista:</strong> {doc.observation}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {doc.file_url && (
                            <a
                              href={normalizeFileUrl(doc.file_url)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg inline-flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> Ver
                            </a>
                          )}

                          <button
                            onClick={() => handleTriggerUpload(doc)}
                            disabled={isUploading}
                            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            {doc.file_url ? 'Reemplazar' : 'Subir Archivo'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* MENSAJES & CONSULTAS CON EL ASESOR */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                      <span>Comunicación con su Asesor</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Canal directo para aclaraciones sobre su documentación o requisitos consulares.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {messages?.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic py-4 text-center">
                      No hay mensajes previos. Escriba abajo si tiene alguna inquietud.
                    </p>
                  ) : (
                    messages?.map((msg: VisaMessage) => (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-2xl text-xs space-y-1 transition-colors ${
                          msg.sender_type === 'cliente'
                            ? 'bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/50 text-sky-900 dark:text-sky-100 ml-6 sm:ml-12'
                            : 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 mr-6 sm:mr-12'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-400 font-bold">
                          <span>{msg.sender_name || (msg.sender_type === 'cliente' ? 'Usted' : 'Asesor Consular')}</span>
                          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span>
                        </div>
                        <p className="leading-relaxed">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    placeholder="Escriba su consulta o respuesta sobre el trámite..."
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSendingMessage || !clientMessage.trim()}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 flex-shrink-0 shadow-sm disabled:opacity-50 transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </form>
              </div>

              {/* SUBMIT FORM BUTTON CARD */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-black">¿Completó toda su información?</h4>
                    <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                      Al enviar el formulario, el equipo especializado procederá con la auditoría técnica y revisión consular de sus datos y documentos adjuntos.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmitFinalForm}
                  disabled={isSubmittingForm}
                  className="w-full py-3.5 px-6 bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-sm rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>{isSubmittingForm ? 'Enviando formulario a revisión...' : 'Enviar Formulario a Revisión Consular Oficial'}</span>
                </button>
              </div>

            </div>

            {/* ============================================================== */}
            {/* COLUMNA DERECHA: TRAZABILIDAD, FASES, PROGRESO & AUDITORÍA     */}
            {/* ============================================================== */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-1">
              
              {/* Executive Overview & Progress Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block">
                      Solicitante Principal
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
                      {applicantDisplayName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Trámite de Visado {process?.name}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Avance</span>
                    <div className="text-2xl font-black text-sky-600 dark:text-sky-400">{dossier?.progress ?? 0}%</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${dossier?.progress ?? 0}%` }}
                  />
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Código</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{dossier?.code}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Destino</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {dossier?.country_destination || process?.country || 'Destino'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Responsable</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 capitalize truncate block">
                      {dossier?.current_responsible === 'cliente' ? 'Cliente (Usted)' : 'Asesor Consular'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Prioridad</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 capitalize truncate block">
                      {dossier?.priority || 'Normal'}
                    </span>
                  </div>
                </div>

                {/* Alerta de Acción Requerida */}
                {dossier?.action_required && (
                  <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl p-3.5 flex items-start gap-2.5 text-rose-800 dark:text-rose-200">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block font-bold text-rose-900 dark:text-rose-100">Acción Requerida para su Trámite</strong>
                      <p className="mt-0.5 text-rose-700 dark:text-rose-300">{dossier.action_required}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* LÍNEA DE FASES DEL PROCESO MIGRATORIO (TRAZABILIDAD OFICIAL) */}
              {portalData?.phases && portalData.phases.length > 0 && (
                <div className="rounded-2xl overflow-hidden shadow-sm">
                  <VisaProcessTimeline
                    dossierId={dossier?.id}
                    dossierCode={dossier?.code}
                    currentPhaseId={dossier?.current_phase_id}
                    phases={portalData.phases}
                    histories={portalData.phase_histories || []}
                    isOperator={false}
                    readOnly={true}
                  />
                </div>
              )}

              {/* TIMELINE DE AUDITORÍA & EVENTOS PÚBLICOS */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
                    <History className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>Trazabilidad & Registro de Eventos</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {timeline?.length || 0} registros
                  </span>
                </div>

                <div className="relative pl-5 sm:pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-5">
                  {timeline?.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">
                      El expediente ha sido iniciado. Los eventos de trazabilidad se registrarán aquí en tiempo real.
                    </p>
                  ) : (
                    timeline?.map((ev: VisaTimelineEvent) => (
                      <div key={ev.id} className="relative">
                        <div className="absolute -left-[27px] sm:-left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-white dark:border-slate-900 shadow-xs" />
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{ev.title}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                            {new Date(ev.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          {ev.description && (
                            <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{ev.description}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* AGENCIA EMISORA & CONTACTO CARD */}
              <div className="bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sky-600 dark:text-sky-400 shadow-2xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Agencia Emisora
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {agency?.name || 'Agencia de Viajes'}
                    </h4>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400">
                  {agency?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${agency.email}`} className="hover:text-sky-600 dark:hover:text-sky-400 truncate">
                        {agency.email}
                      </a>
                    </div>
                  )}
                  {agency?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${agency.phone}`} className="hover:text-sky-600 dark:hover:text-sky-400">
                        {agency.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Trámite protegido con cifrado SSL de extremo a extremo.</span>
                </div>
              </div>

            </div>

          </div>
        </main>

        {/* ============================================================== */}
        {/* LOGO DE LA AGENCIA FLOTANDO EN LA ESQUINA INFERIOR DERECHA     */}
        {/* "y debe aparecer el logo de la agencia que creo el expediente  */}
        {/* en la esquina inferior derecha flotando y sino tiene logo que  */}
        {/* no salga nada"                                                */}
        {/* ============================================================== */}
        {agency?.logo && !hasLogoError && (
          <aside
            aria-label="Logo de la agencia"
            className="fixed bottom-6 right-6 z-40 pointer-events-auto"
          >
            <div className="flex items-center gap-3 px-3.5 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-sky-500/10 group">
              <img
                src={normalizeFileUrl(agency.logo)}
                alt={agency.name || 'Agencia de viajes'}
                onError={() => setHasLogoError(true)}
                className="h-10 w-auto max-w-[130px] object-contain drop-shadow-2xs"
              />
              {agency?.name && (
                <div className="hidden sm:block text-left border-l border-slate-200 dark:border-slate-800 pl-3">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                    Agencia Emisora
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                    {agency.name}
                  </span>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Modal Obligatorio: Políticas Legales y Consentimiento */}
        {showPolicyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col transition-colors">
              <div className="text-center space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3 flex-shrink-0">
                <span className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl inline-block mb-1 border border-sky-100 dark:border-sky-900">
                  <ShieldCheck className="w-8 h-8" />
                </span>
                <h3 className="font-black text-slate-900 dark:text-slate-100 text-lg">Términos del Servicio & Privacidad</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Por favor lea y acepte las políticas antes de iniciar su formulario de visado.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/50">
                {policies?.terms_and_conditions && (
                  <div dangerouslySetInnerHTML={{ __html: policies.terms_and_conditions }} />
                )}
                {policies?.data_treatment_policy && (
                  <div dangerouslySetInnerHTML={{ __html: policies.data_treatment_policy }} />
                )}
                {policies?.retention_policy && (
                  <div dangerouslySetInnerHTML={{ __html: policies.retention_policy }} />
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 flex-shrink-0">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policyAccepted}
                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-sky-600 focus:ring-sky-500 dark:bg-slate-800"
                  />
                  <span>
                    He leído, comprendo y acepto los Términos y Condiciones, autorizando el tratamiento y almacenamiento seguro de mis datos personales para mi solicitud migratoria.
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleAcceptPolicies}
                  disabled={!policyAccepted || isAcceptingPolicy}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-sky-600/20 disabled:opacity-50"
                >
                  {isAcceptingPolicy ? 'Registrando consentimiento...' : 'Aceptar y Continuar al Formulario'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
