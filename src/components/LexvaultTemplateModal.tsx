'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Plus, Code, HelpCircle } from 'lucide-react';
import { LexvaultTemplate } from '../types';
import lexvaultService from '../services/lexvaultService';
import toast from 'react-hot-toast';

interface LexvaultTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  templateToEdit?: LexvaultTemplate | null;
}

export const LexvaultTemplateModal: React.FC<LexvaultTemplateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  templateToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Contrato');
  const [htmlContent, setHtmlContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (templateToEdit) {
      setTitle(templateToEdit.title || '');
      setCategory(templateToEdit.category || 'Contrato');
      setHtmlContent(templateToEdit.html_content || templateToEdit.template_body || '');
    } else {
      setTitle('');
      setCategory('Contrato');
      setHtmlContent(
        `<h2>CONTRATO DE ARRENDAMIENTO / PROMESA DE COMPRAVENTA</h2>\n<p>En la ciudad de {{CIUDAD}}, el {{FECHA}}, comparecen por una parte {{CLIENTE_NOMBRE}} con Cédula/RUC N° {{CLIENTE_CEDULA}}, en calidad de ARRENDATARIO, y por otra parte la Inmobiliaria.</p>\n<p><strong>PRIMERA: OBJETO.</strong> El propietario entrega en alquiler el inmueble ubicado en {{DIRECCION_INMUEBLE}} por el valor de USD $ {{MONTO}}.</p>\n<br/><br/>\n<table style="width:100%;"><tr><td style="text-align:center;">{{FIRMA_CLIENTE}}<br/>_____________________<br/>Firma Cliente</td><td style="text-align:center;">{{FIRMA_USUARIO}}<br/>_____________________<br/>Firma Asesor</td></tr></table>`
      );
    }
  }, [isOpen, templateToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(templateToEdit ? 'Actualizando plantilla...' : 'Guardando plantilla legal...');

    try {
      if (templateToEdit) {
        await lexvaultService.updateTemplate(templateToEdit.id, {
          title,
          category,
          html_content: htmlContent,
        });
        toast.success('Plantilla legal actualizada', { id: toastId });
      } else {
        await lexvaultService.createTemplate({
          title,
          category,
          html_content: htmlContent,
          is_active: true,
        });
        toast.success('Plantilla legal creada exitosamente', { id: toastId });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving template:', err);
      toast.error('Error al guardar la plantilla legal', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertToken = (tokenName: string) => {
    setHtmlContent((prev) => prev + ` {{${tokenName}}}`);
  };

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
          className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 border border-slate-200 overflow-hidden my-auto"
        >
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  {templateToEdit ? 'Editar Plantilla Legal' : 'Nueva Plantilla Legal LexVault'}
                </h3>
                <p className="text-[11px] text-slate-400">{"Configure los marcadores dinámicos tipo {{NOMBRE_TOKEN}}"}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título de la Plantilla</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  placeholder="Ej. Promesa de Compraventa Inmobiliaria"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                >
                  <option value="Contrato">Contrato</option>
                  <option value="Promesa">Promesa de Compraventa</option>
                  <option value="Arrendamiento">Arrendamiento</option>
                  <option value="Servicios">Prestación de Servicios</option>
                  <option value="Poder">Poder Legal</option>
                  <option value="Otro">Otro Documento</option>
                </select>
              </div>
            </div>

            {/* Quick Token Bar */}
            <div className="bg-blue-50/80 p-3 rounded-2xl border border-blue-100">
              <p className="text-[11px] font-bold text-blue-900 mb-1.5 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-600" />
                <span>Insertar Variables Rápidas (Haga clic para agregar al documento):</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['CIUDAD', 'FECHA', 'CLIENTE_NOMBRE', 'CLIENTE_CEDULA', 'DIRECCION_INMUEBLE', 'MONTO', 'FIRMA_CLIENTE', 'FIRMA_USUARIO'].map((tok) => (
                  <button
                    key={tok}
                    type="button"
                    onClick={() => insertToken(tok)}
                    className="px-2 py-0.5 rounded-lg bg-white border border-blue-200 text-[10px] font-extrabold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    {`+ {{${tok}}}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cuerpo del Documento Legal (HTML / Texto)</label>
              <textarea
                required
                rows={12}
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                {isSubmitting ? 'Guardando...' : templateToEdit ? 'Actualizar Plantilla' : 'Crear Plantilla'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LexvaultTemplateModal;
