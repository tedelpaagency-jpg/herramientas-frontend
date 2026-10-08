'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  PenTool, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Download, 
  AlertCircle,
  FileText,
  Lock
} from 'lucide-react';
import { LexvaultDocument } from '../types';
import lexvaultService from '../services/lexvaultService';
import WordDocumentPaper from '../components/WordDocumentPaper';
import toast from 'react-hot-toast';
import { normalizeFileUrl } from '../services/apiClient';

interface PublicContractSignPageProps {
  id: string;
}

export const PublicContractSignPage: React.FC<PublicContractSignPageProps> = ({ id }) => {
  const [document, setDocument] = useState<LexvaultDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMobileDrawing, setIsMobileDrawing] = useState(false);
  const [isMobileSignModalOpen, setIsMobileSignModalOpen] = useState(false);
  const [capturedSignatureDataUrl, setCapturedSignatureDataUrl] = useState<string | null>(null);
  const [hasMobileDrawn, setHasMobileDrawn] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload' | 'p12' | 'decline'>('draw');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [p12File, setP12File] = useState<File | null>(null);
  const [p12Password, setP12Password] = useState<string>('');
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic token substitution for public contract viewer
  const bodyHtml = useMemo(() => {
    let rawHtml = document?.rendered_html || document?.filled_content || document?.content || document?.template?.html_content || '';
    const fieldValues = document?.field_values_json || document?.fields_json || {};

    if (fieldValues && typeof fieldValues === 'object') {
      Object.entries(fieldValues).forEach(([token, val]) => {
        if (val !== undefined && val !== null && String(val).trim()) {
          const valStr = String(val).trim();
          const regex1 = new RegExp(`\\{\\{${token}\\}\\}`, 'gi');
          const regex2 = new RegExp(`\\[${token}\\]`, 'gi');
          rawHtml = rawHtml.replace(regex1, valStr).replace(regex2, valStr);
        }
      });
    }

    if (document?.client) {
      const clientName = document.client.name || `${document.client.first_name || ''} ${document.client.last_name || ''}`.trim();
      const clientDoc = document.client.identification_number || document.client.document_number || '';
      if (clientName) {
        rawHtml = rawHtml.replace(/\{\{CLIENTE_NOMBRE\}\}/gi, clientName).replace(/\[CLIENTE_NOMBRE\]/gi, clientName);
      }
      if (clientDoc) {
        rawHtml = rawHtml.replace(/\{\{CLIENTE_CEDULA\}\}/gi, clientDoc).replace(/\[CLIENTE_CEDULA\]/gi, clientDoc);
      }
    }

    return rawHtml;
  }, [document]);

  // Helper to decode ID parameter (Base64 encoded, URL-encoded or raw ID)
  const getDecodedId = (rawId: string): string => {
    if (!rawId) return rawId;
    try {
      const unescaped = decodeURIComponent(rawId);
      const decoded = atob(unescaped);
      if (decoded && decoded.trim().length > 0) {
        return decoded.trim();
      }
    } catch (e) {
      // Ignorar si no es Base64 válido
    }
    try {
      const decoded = atob(rawId);
      if (decoded && decoded.trim().length > 0) {
        return decoded.trim();
      }
    } catch (e) {
      // Ignorar si no es Base64
    }
    return rawId;
  };

  const fetchContract = async () => {
    setIsLoading(true);
    setError(null);
    const docId = getDecodedId(id);

    try {
      const data = await lexvaultService.getPublicDocument(docId);
      setDocument(data);
    } catch (err: any) {
      console.error('Error fetching public contract:', err);
      setError('No se pudo cargar el contrato. Verifique el enlace o contacte a su asesor legal.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchContract();
    }
  }, [id]);

  // Prevent background scroll when mobile sign modal is open
  useEffect(() => {
    if (isMobileSignModalOpen && typeof window !== 'undefined') {
      const prevOverflow = window.document.body.style.overflow;
      window.document.body.style.overflow = 'hidden';
      return () => {
        window.document.body.style.overflow = prevOverflow;
      };
    }
  }, [isMobileSignModalOpen]);

  // Canvas drawing handlers (Desktop inline)
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setCapturedSignatureDataUrl(null);
  };

  // Mobile Modal Drawing Handlers (Fixed viewport, zero scrolling interference)
  const startMobileDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsMobileDrawing(true);
    setHasMobileDrawn(true);
    drawMobile(e);
  };

  const stopMobileDrawing = () => {
    setIsMobileDrawing(false);
    const canvas = mobileCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const drawMobile = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isMobileDrawing) return;
    const canvas = mobileCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearMobileCanvas = () => {
    const canvas = mobileCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasMobileDrawn(false);
  };

  const acceptMobileSignature = () => {
    const canvas = mobileCanvasRef.current;
    if (!canvas || !hasMobileDrawn) {
      toast.error('Por favor dibuja tu firma antes de guardar');
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedSignatureDataUrl(dataUrl);

    // Synchronize to main canvas preview if available
    const mainCanvas = canvasRef.current;
    if (mainCanvas) {
      const mainCtx = mainCanvas.getContext('2d');
      if (mainCtx) {
        const img = new Image();
        img.onload = () => {
          mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
          mainCtx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
        };
        img.src = dataUrl;
      }
    }

    setIsMobileSignModalOpen(false);
    toast.success('¡Firma capturada correctamente!');
  };

  const handleSign = async () => {
    if (!document) return;
    setIsSubmitting(true);
    const toastId = toast.loading('Registrando su firma digital...');

    try {
      let updatedDoc: LexvaultDocument;
      if (signatureMode === 'draw') {
        const dataUrl = capturedSignatureDataUrl || canvasRef.current?.toDataURL('image/png');
        if (!dataUrl) {
          toast.error('Por favor dibuje su firma antes de enviar', { id: toastId });
          setIsSubmitting(false);
          return;
        }
        updatedDoc = await lexvaultService.signPublicDocument(document.id, dataUrl);
      } else if (signatureMode === 'upload' && signatureFile) {
        updatedDoc = await lexvaultService.signPublicDocument(document.id, signatureFile);
      } else if (signatureMode === 'p12' && p12File) {
        updatedDoc = await lexvaultService.signPublicDocument(document.id, p12File, p12Password);
      } else {
        toast.error('Por favor dibuje, suba su imagen o seleccione su archivo P12 antes de enviar', { id: toastId });
        setIsSubmitting(false);
        return;
      }

      toast.success('¡Contrato firmado exitosamente!', { id: toastId });
      setDocument(updatedDoc);
    } catch (err: any) {
      console.error('Error signing document:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Error al registrar la firma digital';
      toast.error(errMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document || !declineReason.trim()) {
      toast.error('Por favor especifique el motivo del rechazo');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Enviando rechazo del contrato...');

    try {
      const updatedDoc = await lexvaultService.declinePublicDocument(document.id, declineReason);
      toast.success('Contrato marcado como rechazado', { id: toastId });
      setDocument(updatedDoc);
    } catch (err) {
      console.error('Error declining document:', err);
      toast.error('Error al enviar el rechazo', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!document) return;
    const toastId = toast.loading('Descargando copia PDF del contrato...');
    try {
      await lexvaultService.downloadPublicDocumentPdf(document.id, document.document_number || document.title);
      toast.success('PDF descargado con éxito', { id: toastId });
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error('Error al descargar el PDF', { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-400">Cargando documento legal y verificando firmas...</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Enlace de Contrato Inválido</h3>
          <p className="text-xs text-slate-400 mb-6">{error || 'El contrato solicitado no existe o ha sido removido.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const isSigned = document?.status === 'signed' || (document?.status as any) == 2;
  const isDeclined = document?.status === 'declined' || (document?.status as any) == 3;
  const isPending = !isSigned && !isDeclined;

  const watermarkText = isSigned ? 'FIRMADO DIGITALMENTE' : isDeclined ? 'RECHAZADO' : 'PENDIENTE DE FIRMA';

  const contractBg = document?.background_image || document?.bg_image_url || document?.template?.background_image || undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Public Header with Agency Logo & Branding */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {(() => {
              const agency = document.agency;
              const whiteLabel = (document as any).whiteLabel || (document as any).white_label;
              const logoUrl = agency?.logo 
                ? normalizeFileUrl(agency.logo) 
                : agency?.logo_2 
                ? normalizeFileUrl(agency.logo_2) 
                : whiteLabel?.logo 
                ? normalizeFileUrl(whiteLabel.logo) 
                : null;
              const agencyName = agency?.name || agency?.razon_social || whiteLabel?.name || 'Agencia Autorizada';

              return logoUrl ? (
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white/5 border border-slate-700/80 p-1 flex items-center justify-center shrink-0 shadow-md">
                  <img
                    src={logoUrl}
                    alt={agencyName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                  {agencyName.substring(0, 2).toUpperCase()}
                </div>
              );
            })()}

            <div>
              <h1 className="font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                {document.agency?.name || document.agency?.razon_social || (document as any).whiteLabel?.name || 'Agencia Autorizada'}
              </h1>
              <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5 font-medium mt-0.5">
                <span className="font-mono text-blue-400 font-bold">{document.document_number || `#LEX-${document.id}`}</span>
                {(() => {
                  const parts = [
                    document.agency?.phone ? `Tel: ${document.agency.phone}` : null,
                    document.agency?.email,
                    document.agency?.city ? `${document.agency.city}${document.agency.province ? `, ${document.agency.province}` : ''}` : document.agency?.address,
                  ].filter(Boolean);
                  if (parts.length === 0) return null;
                  return (
                    <>
                      <span>•</span>
                      <span>{parts.join(' • ')}</span>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSigned && (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Firmado
              </span>
            )}
            {isDeclined && (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Rechazado
              </span>
            )}
            {isPending && (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> Pendiente de Firma
              </span>
            )}

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Descargar PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Review Body */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8 flex-1">
        {/* Document Banner */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">{document.title}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Revise cuidadosamente los términos descritos en la hoja tamaño Carta antes de emitir su firma o rechazo.
            </p>
          </div>
          {document.client?.name && (
            <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 shrink-0 text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Cliente Destinatario</p>
              <p className="text-xs font-extrabold text-blue-400">{document.client.name}</p>
            </div>
          )}
        </div>

        {/* Word Document Letter Paper Component (Strictly Read-Only for Public Viewer) */}
        <WordDocumentPaper
          htmlContent={bodyHtml}
          title={document.title}
          documentNumber={document.document_number || `#LEX-${document.id}`}
          watermarkText={watermarkText}
          backgroundImageUrl={contractBg}
          editablePages={false}
          signatureUrl={
            document.pdf_path ||
            document.pdf_url ||
            (document as any)?.signature_image ||
            (document as any)?.signature_path ||
            (document as any)?.signature_url ||
            undefined
          }
        />

        {/* Client Action Box: Sign / Decline / Status Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          {isSigned ? (
            <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-black text-emerald-300">Este contrato ya se encuentra firmado</h3>
              <p className="text-xs text-emerald-200 max-w-lg mx-auto">
                La firma digital ha sido registrada y respaldada electrónicamente. Puede descargar su copia en formato PDF en cualquier momento.
              </p>
              <button
                onClick={handleDownloadPdf}
                className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-all shadow-md inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Copia PDF Firmada</span>
              </button>
            </div>
          ) : isDeclined ? (
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-6 text-center space-y-3">
              <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
              <h3 className="text-lg font-black text-rose-300">El contrato ha sido rechazado</h3>
              <p className="text-xs text-rose-200 max-w-lg mx-auto">
                El cliente ha marcado este contrato como rechazado. Póngase en contacto con la administración para renegociar las cláusulas.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-blue-500" />
                    <span>Emisión de Firma o Rechazo del Contrato</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Seleccione su método de firma digital para legalizar este documento.
                  </p>
                </div>

                {/* Mode Switcher */}
                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setSignatureMode('draw')}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      signatureMode === 'draw' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Dibujar Firma</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMode('upload')}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      signatureMode === 'upload' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Imagen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMode('p12')}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      signatureMode === 'p12' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Firma P12 (.p12 / .pfx)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMode('decline')}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      signatureMode === 'decline' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-400 hover:bg-rose-900/30'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rechazar</span>
                  </button>
                </div>
              </div>

              {/* Mode: Draw Signature */}
              {signatureMode === 'draw' && (
                <div className="space-y-4 max-w-xl mx-auto">
                  {/* Mobile Direct Button */}
                  <div className="p-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 rounded-2xl border border-blue-500/30 text-center space-y-2.5">
                    <div className="text-xs text-blue-200 font-bold flex items-center justify-center gap-1.5">
                      <PenTool className="w-4 h-4 text-blue-400" />
                      <span>Firma Táctil Optimizada para Móviles y Tablets</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Evita que la pantalla se mueva mientras firmas. Abre el lienzo táctil a pantalla completa.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsMobileSignModalOpen(true)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                    >
                      <PenTool className="w-4 h-4" />
                      <span>{capturedSignatureDataUrl ? 'Volver a Dibujar Firma en Pantalla Completa' : 'Abrir Modal de Firma Táctil (Móvil)'}</span>
                    </button>
                  </div>

                  {/* Captured Signature Preview (if signed via mobile modal) */}
                  {capturedSignatureDataUrl && (
                    <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={capturedSignatureDataUrl}
                          alt="Firma Capturada"
                          className="h-12 w-28 object-contain bg-white rounded-lg p-1 border border-slate-300"
                        />
                        <div>
                          <span className="block text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Firma Capturada
                          </span>
                          <span className="block text-[10px] text-slate-400">Lista para ser enviada</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-xs text-rose-400 hover:text-rose-300 font-bold px-2 py-1"
                      >
                        Quitar
                      </button>
                    </div>
                  )}

                  {/* Desktop Inline Canvas */}
                  <div className="hidden sm:block space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                        O dibuje directamente aquí (Computadora / Mouse)
                      </label>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" /> Limpiar Trazo
                      </button>
                    </div>

                    <div className="border-2 border-dashed border-slate-700 rounded-2xl bg-white overflow-hidden cursor-crosshair shadow-inner">
                      <canvas
                        ref={canvasRef}
                        width={550}
                        height={180}
                        className="w-full h-44 touch-none"
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={stopDrawing}
                        onTouchMove={draw}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSign}
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg hover:shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isSubmitting ? 'Registrando...' : 'Confirmar y Firmar Documento'}</span>
                  </button>
                </div>
              )}

              {/* Mode: Upload Signature Image */}
              {signatureMode === 'upload' && (
                <div className="space-y-4 max-w-xl mx-auto">
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Cargue una imagen nítida de su firma (Formato PNG o JPG)
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-300 border border-slate-700 rounded-2xl p-4 bg-slate-800"
                  />
                  <button
                    onClick={handleSign}
                    disabled={isSubmitting || !signatureFile}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isSubmitting ? 'Registrando...' : 'Subir y Registrar Firma'}</span>
                  </button>
                </div>
              )}

              {/* Mode: P12 Signature Certificate File */}
              {signatureMode === 'p12' && (
                <div className="space-y-4 max-w-xl mx-auto">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                      Archivo de Firma Electrónica Certificada (.p12 o .pfx)
                    </label>
                    <input
                      type="file"
                      accept=".p12,.pfx"
                      onChange={(e) => setP12File(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-300 border border-slate-700 rounded-2xl p-4 bg-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                      Contraseña del Certificado P12 (Opcional)
                    </label>
                    <input
                      type="password"
                      value={p12Password}
                      onChange={(e) => setP12Password(e.target.value)}
                      placeholder="Ingrese la clave de su firma electrónica..."
                      className="w-full text-xs text-slate-200 border border-slate-700 rounded-2xl p-3.5 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleSign}
                    disabled={isSubmitting || !p12File}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>{isSubmitting ? 'Verificando y Firmando...' : 'Firmar con Certificado Digital P12'}</span>
                  </button>
                </div>
              )}

              {/* Mode: Decline Contract */}
              {signatureMode === 'decline' && (
                <form onSubmit={handleDecline} className="space-y-4 max-w-xl mx-auto">
                  <label className="block text-xs font-extrabold text-rose-300 uppercase tracking-wider">
                    Motivo del Rechazo del Contrato
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Explique las razones por las cuales no acepta las cláusulas del contrato..."
                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !declineReason.trim()}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>{isSubmitting ? 'Enviando...' : 'Rechazar Contrato Legal'}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>Garantía de Validez Legal e Inmutabilidad Electrónica • {document.agency?.name || 'Portal de Firma Digital'}</p>
      </footer>

      {/* Dedicated Fullscreen Touch Modal for Mobile Signing */}
      {isMobileSignModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col justify-between p-3 sm:p-5 select-none overscroll-none touch-none">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Lienzo de Firma Táctil Móvil</h3>
                <p className="text-[11px] text-slate-400">Dibuja con tu dedo dentro del recuadro blanco</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSignModalOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Canvas Box */}
          <div className="my-3 flex-1 flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl relative border-2 border-indigo-500/40">
            <div className="absolute top-2 left-3 pointer-events-none text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Área de Firma • Desliza el dedo
            </div>
            <canvas
              ref={mobileCanvasRef}
              width={600}
              height={380}
              className="w-full h-full touch-none cursor-crosshair"
              onMouseDown={startMobileDrawing}
              onMouseUp={stopMobileDrawing}
              onMouseLeave={stopMobileDrawing}
              onMouseMove={drawMobile}
              onTouchStart={(e) => {
                e.preventDefault();
                startMobileDrawing(e);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                drawMobile(e);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopMobileDrawing();
              }}
            />
          </div>

          {/* Modal Bottom Actions */}
          <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-slate-800 flex-shrink-0">
            <button
              type="button"
              onClick={clearMobileCanvas}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Limpiar Trazo</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMobileSignModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={acceptMobileSignature}
                disabled={!hasMobileDrawn}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aceptar Firma</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicContractSignPage;
