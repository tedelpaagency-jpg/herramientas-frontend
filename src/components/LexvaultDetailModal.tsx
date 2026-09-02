'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, PenTool, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { LexvaultDocument, LexvaultTemplate } from '../types';
import WordDocumentPaper from './WordDocumentPaper';

interface LexvaultDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: LexvaultDocument | null;
  template?: LexvaultTemplate | null;
  onDownloadPdf?: (doc: LexvaultDocument) => void;
  onCopySignLink?: (doc: LexvaultDocument) => void;
  onOpenSignModal?: (doc: LexvaultDocument) => void;
}

export const LexvaultDetailModal: React.FC<LexvaultDetailModalProps> = ({
  isOpen,
  onClose,
  document,
  template,
  onDownloadPdf,
  onCopySignLink,
  onOpenSignModal,
}) => {
  if (!isOpen || (!document && !template)) return null;

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
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl relative z-10 border border-slate-800 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white tracking-tight">{title}</h3>
                  {document && (
                    isSigned ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Firmado
                      </span>
                    ) : isDeclined ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Rechazado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    )
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Ref: {docNumber} {document?.client?.name ? `• Cliente: ${document.client.name}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {document && onDownloadPdf && (
                <button
                  type="button"
                  onClick={() => onDownloadPdf(document)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Descargar PDF</span>
                </button>
              )}

              {document && onCopySignLink && (
                <button
                  type="button"
                  onClick={() => onCopySignLink(document)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copiar Enlace de Firma"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}

              {document && onOpenSignModal && (
                <button
                  type="button"
                  onClick={() => onOpenSignModal(document)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Firmar</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body with Word Document Paper */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
            <WordDocumentPaper
              htmlContent={bodyHtml}
              title={title}
              documentNumber={docNumber}
              watermarkText={watermarkText}
              signatureUrl={
                document?.pdf_path ||
                document?.pdf_url ||
                (document as any)?.signature_image ||
                (document as any)?.signature_path ||
                (document as any)?.signature_url ||
                undefined
              }
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LexvaultDetailModal;
