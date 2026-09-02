'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PenTool, Upload, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { LexvaultDocument } from '../types';
import lexvaultService from '../services/lexvaultService';
import toast from 'react-hot-toast';

import WordDocumentPaper from './WordDocumentPaper';

interface LexvaultSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  document: LexvaultDocument | null;
}

export const LexvaultSignModal: React.FC<LexvaultSignModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  document,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload' | 'decline'>('draw');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !document) return null;

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
    setIsSubmitting(true);
    const toastId = toast.loading('Registrando firma digital...');

    try {
      if (signatureMode === 'draw') {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        await lexvaultService.signDocument(document.id, dataUrl);
      } else if (signatureMode === 'upload' && signatureFile) {
        await lexvaultService.signDocument(document.id, signatureFile);
      } else {
        toast.error('Por favor introduzca su firma digital', { id: toastId });
        setIsSubmitting(false);
        return;
      }

      toast.success('¡Contrato firmado digitalmente con éxito!', { id: toastId });
      onSuccess();
      onClose();
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
    if (!declineReason.trim()) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Procesando rechazo del contrato...');

    try {
      await lexvaultService.declineDocument(document.id, declineReason);
      toast.success('Contrato marcado como rechazado', { id: toastId });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error declining document:', err);
      toast.error('Error al rechazar el documento', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const bodyHtml = (document as any).rendered_content || document.rendered_html || document.filled_content || document.template?.html_content || '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl relative z-10 border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Firma Digital de Contrato: {document.title}</h3>
                <p className="text-[11px] text-slate-400 font-mono">Ref: {document.document_number || `#${document.id}`}</p>
              </div>
            </div>

            <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {/* Document Paper Preview */}
            <div className="max-h-[45vh] overflow-y-auto border border-slate-200 rounded-2xl">
              <WordDocumentPaper
                htmlContent={bodyHtml}
                title={document.title}
                documentNumber={document.document_number || `#LEX-${document.id}`}
                watermarkText="DOCUMENTO A FIRMAR"
              />
            </div>
            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSignatureMode('draw')}
                className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  signatureMode === 'draw' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Dibujar Firma</span>
              </button>
              <button
                type="button"
                onClick={() => setSignatureMode('upload')}
                className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  signatureMode === 'upload' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir Imagen</span>
              </button>
              <button
                type="button"
                onClick={() => setSignatureMode('decline')}
                className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  signatureMode === 'decline' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Rechazar</span>
              </button>
            </div>

            {/* Signature Draw Area */}
            {signatureMode === 'draw' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase">Dibuje su firma en el recuadro</label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Limpiar
                  </button>
                </div>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 overflow-hidden cursor-crosshair">
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={160}
                    className="w-full h-40 touch-none"
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
            )}

            {/* Upload File Area */}
            {signatureMode === 'upload' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Seleccione imagen de su firma (PNG/JPG)</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 border border-slate-200 rounded-xl p-3 bg-slate-50"
                />
              </div>
            )}

            {/* Decline Reason Area */}
            {signatureMode === 'decline' && (
              <form onSubmit={handleDecline} className="space-y-3">
                <label className="text-xs font-bold text-rose-700 uppercase">Motivo del rechazo del contrato</label>
                <textarea
                  required
                  rows={3}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Escriba la razón del rechazo..."
                  className="w-full p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Confirmar Rechazo
                </button>
              </form>
            )}

            {/* Submit Action for Sign */}
            {signatureMode !== 'decline' && (
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSign}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Firmando...' : 'Firmar y Guardar'}</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LexvaultSignModal;
