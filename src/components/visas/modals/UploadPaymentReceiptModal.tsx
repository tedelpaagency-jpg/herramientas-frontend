'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, X, AlertTriangle, FileText, CheckCircle2, RefreshCw, 
  DollarSign, ShieldAlert, Image as ImageIcon 
} from 'lucide-react';
import toast from 'react-hot-toast';
import visaWholesaleService, { VisaDossier } from '@/services/visaWholesaleService';

interface UploadPaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: VisaDossier;
  onSuccess: (updatedDossier: VisaDossier) => void;
}

export const UploadPaymentReceiptModal: React.FC<UploadPaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  dossier,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const costDisplay = dossier.cost && Number(dossier.cost) > 0 
    ? Number(dossier.cost).toFixed(2) 
    : '150.00';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 15 * 1024 * 1024) {
      toast.error('El archivo no puede exceder los 15MB');
      return;
    }

    setFile(selected);
    if (selected.type.startsWith('image/')) {
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Por favor seleccione el comprobante de pago');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await visaWholesaleService.uploadPaymentReceipt(dossier.id, file);
      toast.success(res?.message || 'Comprobante enviado exitosamente para revisión');
      if (res?.data) {
        onSuccess({
          ...dossier,
          payment_receipt_url: res.data.payment_receipt_url,
          payment_status: res.data.payment_status,
          approval_status: res.data.approval_status,
          status: res.data.status,
          can_share_link: res.data.can_share_link,
          rejection_reason: null,
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Error al subir comprobante:', err);
      toast.error(err.response?.data?.message || 'Error al subir el comprobante de pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 rounded-xl">
              <Upload className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {dossier.payment_status === 'comprobante_rechazado' 
                  ? 'Actualizar Comprobante de Pago' 
                  : 'Cargar Comprobante de Pago'}
              </h3>
              <p className="text-xs text-slate-500">Expediente: <strong className="font-mono text-slate-700 dark:text-slate-300">{dossier.code}</strong> • {dossier.applicant_name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Banner de Costo */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Costo del Trámite Consular:
              </span>
            </div>
            <span className="text-sm font-black text-sky-700 dark:text-sky-300 font-mono">
              Q{costDisplay}
            </span>
          </div>

          {/* Alerta de Rechazo Anterior (si aplica) */}
          {dossier.payment_status === 'comprobante_rechazado' && dossier.rejection_reason && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 text-rose-900 dark:text-rose-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Comprobante anterior rechazado por el operador:</span>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-300 bg-white/70 dark:bg-slate-900/60 p-2 rounded-lg border border-rose-200/60 dark:border-rose-800/40 font-medium">
                "{dossier.rejection_reason}"
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400">
                Por favor adjunte un comprobante corregido con número de transacción legible.
              </p>
            </div>
          )}

          {/* Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Archivo del comprobante (PDF, JPG, PNG o WEBP, máx 15MB) *
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/20"
            >
              {file ? (
                <div className="space-y-2">
                  {previewUrl ? (
                    <div className="flex justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Vista previa del comprobante" 
                        className="max-h-40 rounded-lg border border-slate-200 dark:border-slate-700 object-contain shadow-xs" 
                      />
                    </div>
                  ) : (
                    <FileText className="w-10 h-10 text-sky-600 dark:text-sky-400 mx-auto" />
                  )}
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{file.name}</p>
                  <p className="text-[11px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB • Clic para cambiar archivo</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto shadow-xs border border-slate-200 dark:border-slate-700">
                    <Upload className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Haga clic aquí para seleccionar el comprobante
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Formatos admitidos: PDF, JPG, PNG o WEBP
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <strong>Flujo de Aprobación:</strong> Una vez cargado el comprobante, el operador mayorista revisará la transacción. Al ser aprobada, el enlace público se habilitará automáticamente para que pueda compartirlo con el cliente.
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !file}
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all shadow-md shadow-sky-600/20 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Enviando comprobante...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enviar Comprobante</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPaymentReceiptModal;
