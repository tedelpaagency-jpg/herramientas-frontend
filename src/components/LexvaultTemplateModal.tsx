'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  ArrowRight, 
  UploadCloud, 
  Image as ImageIcon, 
  Check, 
  Loader2, 
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';
import { LexvaultTemplate } from '../types';
import lexvaultService from '../services/lexvaultService';
import toast from 'react-hot-toast';

interface LexvaultTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LexvaultTemplateModal: React.FC<LexvaultTemplateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Contrato');
  const [description, setDescription] = useState('');
  const [bgMode, setBgMode] = useState<'none' | 'upload' | 'url'>('none');
  const [bgUrl, setBgUrl] = useState('');
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor seleccione un archivo de imagen (PNG, JPG, WebP)');
      return;
    }

    setIsUploadingBg(true);
    const toastId = toast.loading('Subiendo fondo de hoja...');
    try {
      const res = await lexvaultService.uploadBackground(file);
      setBgUrl(res.url);
      setBgMode('upload');
      toast.success('Fondo de hoja cargado exitosamente', { id: toastId });
    } catch (err) {
      console.error('Error subiendo fondo:', err);
      toast.error('Error al subir la imagen de fondo', { id: toastId });
    } finally {
      setIsUploadingBg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Por favor ingrese un título para la plantilla');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creando plantilla legal...');

    try {
      const finalBg = bgMode === 'none' ? null : (bgUrl.trim() || null);

      const created = await lexvaultService.createTemplate({
        title: title.trim(),
        category: category.trim(),
        description: description.trim() || undefined,
        background_image: finalBg || undefined,
        is_active: true,
      });

      toast.success('Plantilla creada. Abriendo editor de documento completo...', { id: toastId });
      onSuccess();
      onClose();

      // Redirigir inmediatamente a la vista completa de redacción del documento
      router.push(`/lexvault/templates/${created.id}`);
    } catch (err: any) {
      console.error('Error creating template:', err);
      const msg = err.response?.data?.message || 'Error al crear la plantilla legal';
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Nueva Plantilla Legal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Crea la base de la plantilla y edítala en vista completa.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Título del Documento / Contrato <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Contrato de Arrendamiento Comercial"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Categoría Legal
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 cursor-pointer"
              >
                <option value="Contrato">Contrato General</option>
                <option value="Convenio">Convenio de Cooperación</option>
                <option value="Acuerdo de Confidencialidad (NDA)">Acuerdo de Confidencialidad (NDA)</option>
                <option value="Declaración Jurada">Declaración Jurada</option>
                <option value="Prestación de Servicios">Prestación de Servicios</option>
                <option value="Poder Legal">Poder Especial / General</option>
                <option value="Pagaré">Pagaré a la Orden</option>
                <option value="Recibo / Finiquito">Recibo / Finiquito</option>
                <option value="Otro">Otro Documento</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Descripción / Uso Interno <span className="text-slate-400 font-normal lowercase">(opcional)</span>
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve indicación sobre el propósito de este modelo de contrato..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 resize-none"
              />
            </div>

            {/* Individual Letterhead / Fondo de Hoja Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Fondo de Hoja / Membrete Individual
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Personalizable por plantilla</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Option 1: No Background */}
                <button
                  type="button"
                  onClick={() => {
                    setBgMode('none');
                    setBgUrl('');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    bgMode === 'none'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FileCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <span className="block text-xs font-bold">Sin Fondo (Blanco)</span>
                    <span className="block text-[10px] text-slate-400 leading-tight mt-0.5">Hoja limpia estándar</span>
                  </div>
                </button>

                {/* Option 2: Upload Background */}
                <label
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    bgMode === 'upload' && bgUrl
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-600/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <UploadCloud className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div className="overflow-hidden">
                    <span className="block text-xs font-bold truncate">
                      {isUploadingBg ? 'Subiendo...' : bgUrl ? 'Membrete Cargado' : 'Subir Membrete'}
                    </span>
                    <span className="block text-[10px] text-slate-400 leading-tight mt-0.5 truncate">
                      {bgUrl ? 'Fondo asignado' : 'PNG, JPG hoja Carta'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploadingBg}
                  />
                </label>
              </div>

              {/* Show uploaded image preview or URL input */}
              {bgUrl && bgMode !== 'none' && (
                <div className="mt-2.5 p-2 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-mono text-[11px] text-emerald-800 dark:text-emerald-300 truncate">
                      {bgUrl}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBgUrl('');
                      setBgMode('none');
                    }}
                    className="text-rose-600 hover:text-rose-700 font-bold text-[11px] shrink-0"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isUploadingBg}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creando plantilla...</span>
                  </>
                ) : (
                  <>
                    <span>Crear y Abrir en Editor Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LexvaultTemplateModal;
