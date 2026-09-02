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

interface PublicContractSignPageProps {
  id: string;
}

export const PublicContractSignPage: React.FC<PublicContractSignPageProps> = ({ id }) => {
  const [document, setDocument] = useState<LexvaultDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
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

  // Canvas drawing handlers
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

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
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
  };

  const handleSign = async () => {
    if (!document) return;
    setIsSubmitting(true);
    const toastId = toast.loading('Registrando su firma digital...');

    try {
      let updatedDoc: LexvaultDocument;
      if (signatureMode === 'draw') {
        const canvas = canvasRef.current;
        if (!canvas) {
          toast.error('Ocurrió un problema con el lienzo de firma', { id: toastId });
          setIsSubmitting(false);
          return;
        }
        const dataUrl = canvas.toDataURL('image/png');
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Public Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                LexVault • Portal de Firma Digital
              </h1>
              <p className="text-xs text-slate-400">
                Ref: <span className="font-mono text-blue-400 font-bold">{document.document_number || `#LEX-${document.id}`}</span>
              </p>
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
                <div className="space-y-3 max-w-xl mx-auto">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                      Dibuje su firma dentro del recuadro
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

                  <button
                    onClick={handleSign}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg hover:shadow-emerald-900/20 flex items-center justify-center gap-2"
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
        <p>Garantía de Validez Legal e Inmutabilidad Electrónica • LexVault System</p>
      </footer>
    </div>
  );
};

export default PublicContractSignPage;
