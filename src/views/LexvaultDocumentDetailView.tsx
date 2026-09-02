'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Copy, PenTool, ShieldCheck, FileText, CheckCircle2, Clock, XCircle, Sparkles } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'contract') {
        const doc = await lexvaultService.getDocument(id);
        setDocument(doc);
      } else {
        const tmpls = await lexvaultService.getTemplates();
        const found = tmpls.find((t) => t.id.toString() === id.toString());
        if (found) {
          setTemplate(found);
        } else {
          setError('Plantilla no encontrada');
        }
      }
    } catch (err) {
      console.error('Error fetching detail view:', err);
      setError('Error al obtener la información solicitada.');
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

  if (isLoading) {
    return (
      <div className="p-12 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">Cargando documento en formato hoja Carta...</p>
      </div>
    );
  }

  if (error || (!document && !template)) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
        <FileText className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Elemento no encontrado</h3>
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

  const title = document ? document.title : template ? template.title : 'Detalle de Documento';
  const docNumber = document ? document.document_number || `#LEX-${document.id}` : template ? `PLANTILLA #${template.id}` : '';
  const bodyHtml = document
    ? (document as any).rendered_content || document.rendered_html || document.filled_content || document.template?.html_content || ''
    : template
    ? template.html_content || template.template_body || ''
    : '';

  const isSigned = document && (document.status === 'signed' || (document.status as any) == 2);
  const isDeclined = document && (document.status === 'declined' || (document.status as any) == 3);

  const watermarkText = document
    ? isSigned
      ? 'FIRMADO DIGITALMENTE'
      : isDeclined
      ? 'RECHAZADO'
      : 'PENDIENTE DE FIRMA'
    : 'PLANTILLA BASE';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/lexvault"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shrink-0"
            title="Volver a Bóveda Legal"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
              {document && (
                isSigned ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Firmado
                  </span>
                ) : isDeclined ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                    Rechazado
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                    Pendiente
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {docNumber} {document?.client?.name ? `• Cliente: ${document.client.name}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                title="Copiar Enlace de Firma Público"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden md:inline">Copiar Enlace Firma</span>
              </button>
            </>
          )}

          {template && (
            <Link
              href={`/lexvault`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Usar esta Plantilla</span>
            </Link>
          )}
        </div>
      </div>

      {/* Word Document Letter Paper Viewer */}
      <WordDocumentPaper
        htmlContent={bodyHtml}
        title={title}
        documentNumber={docNumber}
        watermarkText={watermarkText}
        fieldValues={document?.field_values_json || {}}
        signatureUrl={
          document?.pdf_path ||
          document?.pdf_url ||
          (document as any)?.signature_image ||
          (document as any)?.signature_path ||
          (document as any)?.signature_url ||
          undefined
        }
        onSave={async (updatedHtml, savedFieldValues) => {
          if (document?.id) {
            try {
              await lexvaultService.updateDocument(document.id, {
                rendered_html: updatedHtml,
                content: updatedHtml,
                filled_content: updatedHtml,
                field_values_json: savedFieldValues,
              });
              toast.success('Documento y valores de campos guardados en el servidor');
            } catch (err) {
              console.error('Error saving document:', err);
              toast.error('Error al guardar el documento en la base de datos');
            }
          }
        }}
      />
    </div>
  );
};

export default LexvaultDocumentDetailView;
