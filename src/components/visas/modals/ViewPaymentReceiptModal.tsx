'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  DollarSign, 
  Calendar,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { normalizeFileUrl } from '@/services/apiClient';

export interface ViewPaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptUrl: string | null | undefined;
  title?: string;
  applicantName?: string;
  dossierCode?: string;
  cost?: number | string;
  uploadedAt?: string | null;
  onApprove?: () => void;
  onReject?: () => void;
  isProcessingAction?: boolean;
}

export const ViewPaymentReceiptModal: React.FC<ViewPaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptUrl,
  title,
  applicantName,
  dossierCode,
  cost,
  uploadedAt,
  onApprove,
  onReject,
  isProcessingAction = false,
}) => {
  const [loadError, setLoadError] = useState(false);

  if (!isOpen || !receiptUrl) return null;

  const normalizedUrl = normalizeFileUrl(receiptUrl);
  const cleanLower = normalizedUrl.toLowerCase().split('?')[0];
  const isPdf = cleanLower.endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {title || 'Comprobante de Pago'}
                </h3>
                {dossierCode && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs font-semibold">
                    {dossierCode}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                {applicantName && (
                  <span>Titular: <strong className="text-slate-700 dark:text-slate-200">{applicantName}</strong></span>
                )}
                {cost !== undefined && (
                  <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" /> ${Number(cost).toFixed(2)} USD
                  </span>
                )}
                {uploadedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(uploadedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={normalizedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Abrir en pestaña nueva"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={normalizedUrl}
              download
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Descargar archivo"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100/60 dark:bg-slate-950/60 flex items-center justify-center min-h-[350px]">
          {loadError ? (
            <div className="p-8 text-center max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                No se pudo previsualizar el documento
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Puede descargarlo o abrirlo directamente para revisarlo en su visor del sistema.
              </p>
              <div className="pt-2">
                <a
                  href={normalizedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir en nueva pestaña</span>
                </a>
              </div>
            </div>
          ) : isPdf ? (
            <div className="w-full h-[620px] rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
              <iframe
                src={`${normalizedUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-0"
                title="Comprobante de Pago PDF"
                onError={() => setLoadError(true)}
              />
            </div>
          ) : (
            <div className="relative max-w-full max-h-[620px] rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center p-2">
              <img
                src={normalizedUrl}
                alt="Comprobante de Pago"
                className="max-h-[600px] w-auto object-contain rounded-lg transition-transform"
                onError={() => setLoadError(true)}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Revise minuciosamente el valor, fecha y número de transacción antes de aprobar.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onReject && (
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={onReject}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs transition-all disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Rechazar Comprobante</span>
              </button>
            )}

            {onApprove && (
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={onApprove}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aprobar Solicitud</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPaymentReceiptModal;
