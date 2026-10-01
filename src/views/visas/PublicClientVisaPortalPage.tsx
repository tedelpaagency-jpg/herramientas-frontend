'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import visaWholesaleService, { VisaDocument, VisaMessage, VisaTimelineEvent } from '@/services/visaWholesaleService';
import { 
  ShieldCheck, CheckCircle2, Clock, AlertTriangle, AlertCircle, 
  Upload, FileText, Send, Eye, RefreshCw, Check, ArrowRight, Lock, 
  HelpCircle, ChevronDown, ChevronUp, User, Globe
} from 'lucide-react';
import ConsularFormRenderer from '@/components/visas/forms/ConsularFormRenderer';
import toast from 'react-hot-toast';

export const PublicClientVisaPortalPage: React.FC = () => {
  const params = useParams();
  const token = params?.token as string;

  const [portalData, setPortalData] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // Policy Modal
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [isAcceptingPolicy, setIsAcceptingPolicy] = useState(false);

  // Document Upload
  const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDocForUpload, setSelectedDocForUpload] = useState<VisaDocument | null>(null);

  // Messaging
  const [clientMessage, setClientMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Auto-save feedback
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const fetchPortal = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await visaWholesaleService.getPublicPortalData(token);
      if (res?.data) {
        setPortalData(res.data);
        setFormData(res.data.dossier?.form_data || {});

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-sky-600" />
          <p className="text-slate-600 font-semibold text-sm">Cargando su portal migratorio seguro...</p>
        </div>
      </div>
    );
  }

  const { dossier, agency, client, process, documents, timeline, messages, policies } = portalData;
  const sections = process?.form_schema?.sections || [];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
        className="hidden"
      />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-sky-50 rounded-xl text-sky-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {agency?.name || 'Servicio de Visados'}
              </h1>
              <p className="text-[11px] text-slate-500 font-mono">Expediente {dossier?.code}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Estado Actual</span>
            <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 capitalize">
              {dossier?.status?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-24">
        {/* Banner Solicitante & Progreso */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider block">
                {process?.flag_icon} {process?.name} ({process?.country})
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                Bienvenido/a, {client?.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Complete la información solicitada y adjunte sus documentos de soporte. Guardado progresivo automático.
              </p>
            </div>

            <div className="w-full sm:w-auto text-left sm:text-right">
              <span className="text-xs text-slate-500 font-medium">Avance del Formulario:</span>
              <div className="text-2xl font-black text-sky-600">{dossier?.progress}%</div>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${dossier?.progress}%` }}
            />
          </div>

          {lastSavedTime && (
            <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Guardado automático a las {lastSavedTime}</span>
            </div>
          )}
        </div>

        {/* Alerta de Acción Requerida */}
        {dossier?.action_required && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800">
            <AlertCircle className="w-6 h-6 flex-shrink-0 text-rose-600" />
            <div className="text-xs">
              <strong className="block font-bold text-sm text-rose-900">Acción Requerida para su Trámite</strong>
              <p className="mt-0.5">{dossier.action_required}</p>
            </div>
          </div>
        )}

        {/* SECCIÓN 1: FORMULARIO CONSULAR OFICIAL COMPLETO (EXACTAMENTE IGUAL A VISAS MINORISTAS) */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Formulario Consular Oficial</h3>
              <p className="text-xs text-slate-500">
                Complete la información oficial requerida por la autoridad migratoria ({dossier?.country_destination || process?.name || 'Destino'}). Los datos se guardan automáticamente.
              </p>
            </div>
            {lastSavedTime && (
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Guardado a las {lastSavedTime}
              </span>
            )}
          </div>

          <ConsularFormRenderer
            countryDestination={dossier?.country_destination}
            visaType={process?.name?.includes('Schengen') || process?.name?.includes('Europa') ? 'SCHENGEN' : process?.name?.includes('Canad') ? 'CANADA' : 'USA'}
            processSlug={process?.slug}
            formData={formData}
            onFieldChange={handleInputChange}
            applicantName={portalData?.client?.name}
          />
        </div>

        {/* SECCIÓN 2: CHECKLIST DE DOCUMENTOS */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Checklist de Documentos de Soporte</h3>
            <p className="text-xs text-slate-500">
              Adjunte los documentos solicitados en formato PDF o fotografía nítida (JPG, PNG, máx 15MB).
            </p>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {documents?.map((doc: VisaDocument) => (
              <div key={doc.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-slate-800">{doc.name}</strong>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      doc.status === 'aprobado' ? 'bg-emerald-100 text-emerald-700' :
                      doc.status === 'observado' ? 'bg-rose-100 text-rose-700' :
                      doc.status === 'recibido' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  {doc.observation && (
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                      <strong>Observación del especialista:</strong> {doc.observation}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1"
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
            ))}
          </div>
        </div>

        {/* SECCIÓN 3: MENSAJES & CONSULTAS */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Comunicación con su Asesor</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {messages?.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No hay mensajes previos.</p>
            ) : (
              messages?.map((msg: VisaMessage) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl text-xs space-y-0.5 ${
                    msg.sender_type === 'cliente'
                      ? 'bg-sky-50 border border-sky-100 text-sky-900 ml-6'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 mr-6'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                    <span>{msg.sender_name || (msg.sender_type === 'cliente' ? 'Usted' : 'Asesor')}</span>
                    <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <p>{msg.message}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
              placeholder="Escriba su consulta o respuesta sobre el trámite..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={isSendingMessage}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold text-xs flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* SECCIÓN 4: TRAZABILIDAD (TIMELINE PÚBLICA) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Progreso y Trazabilidad del Trámite</h3>
          <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
            {timeline?.map((ev: VisaTimelineEvent) => (
              <div key={ev.id} className="relative">
                <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-white" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">{ev.title}</span>
                  <span className="text-[10px] text-slate-400 block">{new Date(ev.created_at).toLocaleString()}</span>
                  <p className="text-slate-600 mt-0.5">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Al enviar la información, el equipo mayorista procederá con la revisión consular.</span>
          </div>

          <button
            onClick={handleSubmitFinalForm}
            disabled={isSubmittingForm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            {isSubmittingForm ? 'Enviando información...' : 'Enviar Formulario para Revisión Consular'}
          </button>
        </div>
      </div>

      {/* Modal Obligatorio: Políticas Legales y Consentimiento */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="text-center space-y-1 border-b border-slate-100 pb-3 flex-shrink-0">
              <span className="p-3 bg-sky-50 text-sky-600 rounded-2xl inline-block mb-1">
                <ShieldCheck className="w-8 h-8" />
              </span>
              <h3 className="font-black text-slate-900 text-lg">Términos del Servicio & Privacidad</h3>
              <p className="text-xs text-slate-500">
                Por favor lea y acepte las políticas antes de iniciar su formulario de visado.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs text-slate-600 leading-relaxed border border-slate-100 p-4 rounded-xl bg-slate-50/50">
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

            <div className="pt-2 border-t border-slate-100 space-y-3 flex-shrink-0">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
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
  );
};
