'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Copy, 
  PenTool, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles,
  Image as ImageIcon,
  UploadCloud,
  X,
  Check,
  Save,
  Layers,
  FileCheck
} from 'lucide-react';
import { LexvaultDocument, LexvaultTemplate } from '../types';
import lexvaultService from '../services/lexvaultService';
import WordDocumentPaper from '../components/WordDocumentPaper';
import toast from 'react-hot-toast';

interface LexvaultDocumentDetailViewProps {
  id: string;
  type: 'contract' | 'template';
}

export const LexvaultDocumentDetailView: React.FC<LexvaultDocumentDetailViewProps> = ({ id, type }) => {
  const [document, setDocument] = useState<LexvaultDocument | null>(null);
  const [template, setTemplate] = useState<LexvaultTemplate | null>(null);
  const [currentBg, setCurrentBg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Background Selection Modal / Popover
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'contract') {
        const doc = await lexvaultService.getDocument(id);
        setDocument(doc);
        const initialBg = doc.background_image || doc.bg_image_url || doc.template?.background_image || null;
        setCurrentBg(initialBg);
      } else {
        const tmpl = await lexvaultService.getTemplate(id);
        setTemplate(tmpl);
        const initialBg = tmpl.background_image || tmpl.bg_image_url || null;
        setCurrentBg(initialBg);
      }
    } catch (err: any) {
      console.error('Error fetching detail view:', err);
      setError('No fue posible cargar el registro solicitado.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, type]);

  const handleDownloadPdf = async () => {
    if (!document) return;
    const toastId = toast.loading('Descargando PDF del contrato...');
    try {
      await lexvaultService.downloadDocumentPdf(document.id, document.document_number || document.title);
      toast.success('¡PDF descargado con éxito!', { id: toastId });
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error('Error al descargar el PDF', { id: toastId });
    }
  };

  const handleCopySignLink = () => {
    if (!document) return;
    const signUrl = `${window.location.origin}/contract/show/${btoa(document.id.toString())}`;
    navigator.clipboard.writeText(signUrl);
    toast.success('¡Enlace de firma copiado al portapapeles!');
  };

  const handleUploadBg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Seleccione un archivo de imagen válido');
      return;
    }

    setIsUploadingBg(true);
    const toastId = toast.loading('Subiendo imagen de fondo...');
    try {
      const res = await lexvaultService.uploadBackground(file);
      setCurrentBg(res.url);
      toast.success('Fondo de hoja actualizado en vista previa', { id: toastId });
      setIsBgModalOpen(false);
    } catch (err) {
      console.error('Error subiendo fondo:', err);
      toast.error('Error al subir la imagen de fondo', { id: toastId });
    } finally {
      setIsUploadingBg(false);
    }
  };

  const handleApplyUrlBg = () => {
    if (urlInput.trim()) {
      setCurrentBg(urlInput.trim());
      setUrlInput('');
      setIsBgModalOpen(false);
      toast.success('Fondo asignado en vista previa');
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">Cargando documento en vista completa...</p>
      </div>
    );
  }

  if (error || (!document && !template)) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto my-8">
        <FileText className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Elemento no encontrado</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">{error || 'No fue posible cargar el registro seleccionado.'}</p>
        <Link
          href="/lexvault"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a LexVault</span>
        </Link>
      </div>
    );
  }

  const title = document ? document.title : template ? template.title : 'Documento Legal';
  const docNumber = document 
    ? (document.document_number || `#LEX-${document.id}`) 
    : template 
    ? `PLANTILLA #${template.id} • ${template.category || 'General'}` 
    : '';

  const bodyHtml = document
    ? ((document as any).rendered_content || document.rendered_html || document.filled_content || document.template?.html_content || '')
    : template
    ? (template.html_content || template.template_body || '')
    : '';

  const isSigned = document && (document.status === 'signed' || (document.status as any) == 2);
  const isDeclined = document && (document.status === 'declined' || (document.status as any) == 3);

  const watermarkText = document
    ? isSigned
      ? 'FIRMADO DIGITALMENTE'
      : isDeclined
      ? 'RECHAZADO'
      : 'PENDIENTE DE FIRMA'
    : 'MODO EDICIÓN - PLANTILLA';

  const canEdit = type === 'template' ? true : (!isSigned && !isDeclined);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-3.5">
          <Link
            href="/lexvault"
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors shrink-0 shadow-2xs"
            title="Volver a Bóveda Legal"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
              {type === 'template' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Plantilla Base
                </span>
              ) : isSigned ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Firmado
                </span>
              ) : isDeclined ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Rechazado
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Borrador
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
              <span>{docNumber}</span>
              {document?.client?.name ? <span>• Cliente: {document.client.name}</span> : null}
              {template?.whiteLabel?.name ? <span>• Marca Blanca: {template.whiteLabel.name}</span> : null}
              {template?.agency?.name ? <span>• Agencia: {template.agency.name}</span> : null}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Fondo de Hoja Individual Selector Button */}
          {canEdit && (
            <button
              onClick={() => setIsBgModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-2 shadow-2xs"
              title="Personalizar fondo de hoja o membrete para este documento"
            >
              <ImageIcon className={`w-4 h-4 ${currentBg && currentBg !== 'none' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Fondo: {currentBg && currentBg !== 'none' ? 'Membrete Asignado' : 'Sin Fondo'}</span>
            </button>
          )}

          {document && (
            <>
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>

              <button
                onClick={handleCopySignLink}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                title="Copiar Enlace de Firma Público"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copiar Enlace</span>
              </button>
            </>
          )}

          {template && (
            <Link
              href="/lexvault"
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Ver Plantillas</span>
            </Link>
          )}
        </div>
      </div>

      {/* Background Picker Modal */}
      {isBgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Fondo de Hoja / Membrete Individual
                </h4>
              </div>
              <button
                onClick={() => setIsBgModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selecciona qué fondo de hoja tendrá este {type === 'template' ? 'modelo de plantilla' : 'contrato'}. Se aplicará en todas las hojas.
            </p>

            <div className="space-y-3">
              {/* Option 1: Clean White Sheet (No Background) */}
              <button
                type="button"
                onClick={() => {
                  setCurrentBg('none');
                  setIsBgModalOpen(false);
                  toast.success('Fondo quitado (Hoja Blanca)');
                }}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  !currentBg || currentBg === 'none'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="block text-xs font-bold">Sin Fondo (Hoja Limpia)</span>
                    <span className="block text-[10px] text-slate-400">Fondo blanco sin membrete gráfico</span>
                  </div>
                </div>
                {(!currentBg || currentBg === 'none') && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              {/* Option 2: Upload new background image */}
              <label className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left flex items-center justify-between cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <UploadCloud className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="block text-xs font-bold">Subir Nuevo Fondo / Membrete</span>
                    <span className="block text-[10px] text-slate-400">Archivo de imagen PNG o JPG tamaño Carta</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadBg}
                  disabled={isUploadingBg}
                  className="hidden"
                />
              </label>

              {/* Option 3: Image URL input */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  O pegar URL de imagen:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://.../membrete.jpg o /storage/..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrlBg}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Asignar
                  </button>
                </div>
              </div>

              {/* Active Background Preview */}
              {currentBg && currentBg !== 'none' && (
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={currentBg}
                      alt="Thumbnail Fondo"
                      className="w-8 h-10 object-cover border border-slate-300 dark:border-slate-600 rounded-xs shrink-0"
                    />
                    <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300 truncate">
                      {currentBg}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentBg('none')}
                    className="text-rose-600 font-bold text-xs shrink-0 hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsBgModalOpen(false)}
                className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Word Document Paper Workspace */}
      <WordDocumentPaper
        htmlContent={bodyHtml}
        title={title}
        documentNumber={docNumber}
        watermarkText={watermarkText}
        backgroundImageUrl={currentBg === 'none' ? 'none' : (currentBg || undefined)}
        editablePages={canEdit}
        showToolbar={true}
        fieldValues={document?.field_values_json || {}}
        signatureUrl={
          document?.pdf_path ||
          document?.pdf_url ||
          (document as any)?.signature_image ||
          (document as any)?.signature_path ||
          undefined
        }
        onSave={async (updatedHtml, savedFieldValues) => {
          const toastId = toast.loading('Guardando documento en el servidor...');
          try {
            const finalBgValue = currentBg === 'none' ? '' : (currentBg || null);

            if (type === 'template' && template?.id) {
              await lexvaultService.updateTemplate(template.id, {
                html_content: updatedHtml,
                background_image: finalBgValue || undefined,
              });
              toast.success('¡Plantilla y fondo de hoja guardados exitosamente!', { id: toastId });
            } else if (document?.id) {
              await lexvaultService.updateDocument(document.id, {
                rendered_html: updatedHtml,
                content: updatedHtml,
                filled_content: updatedHtml,
                background_image: finalBgValue || undefined,
                field_values_json: savedFieldValues,
              });
              toast.success('¡Contrato y fondo de hoja guardados exitosamente!', { id: toastId });
            }
          } catch (err) {
            console.error('Error saving document:', err);
            toast.error('Error al guardar los cambios en la base de datos', { id: toastId });
          }
        }}
      />
    </div>
  );
};

export default LexvaultDocumentDetailView;
