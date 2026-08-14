'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Plus, Code, HelpCircle } from 'lucide-react';
import { LexvaultTemplate } from '../types';
import lexvaultService from '../services/lexvaultService';
import toast from 'react-hot-toast';

import WordDocumentPaper, { PAGE_BREAK_MARKER } from './WordDocumentPaper';

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
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Custom Fields & Tokens State
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');

  const defaultTokens = [
    'CIUDAD',
    'FECHA',
    'CLIENTE_NOMBRE',
    'CLIENTE_CEDULA',
    'CLIENTE_CORREO',
    'CLIENTE_TELEFONO',
    'DIRECCION_INMUEBLE',
    'MONTO',
    'FIRMA_CLIENTE',
    'FIRMA_USUARIO',
  ];

  useEffect(() => {
    if (templateToEdit) {
      setTitle(templateToEdit.title || '');
      setCategory(templateToEdit.category || 'Contrato');
      setHtmlContent(templateToEdit.html_content || templateToEdit.template_body || '');
      setCustomFields(templateToEdit.fields_json || {});
    } else {
      setTitle('');
      setCategory('Contrato');
      setCustomFields({});
      setHtmlContent(
        `<h2>CONTRATO DE ARRENDAMIENTO / PROMESA DE COMPRAVENTA</h2>\n<p>En la ciudad de {{CIUDAD}}, el {{FECHA}}, comparecen por una parte {{CLIENTE_NOMBRE}} con Cédula/RUC N° {{CLIENTE_CEDULA}}, en calidad de ARRENDATARIO, y por otra parte la Inmobiliaria.</p>\n<p><strong>PRIMERA: OBJETO.</strong> El propietario entrega en alquiler el inmueble ubicado en {{DIRECCION_INMUEBLE}} por el valor de USD $ {{MONTO}}.</p>\n<br/><br/>\n<table style="width:100%;"><tr><td style="text-align:center;">{{FIRMA_CLIENTE}}<br/>_____________________<br/>Firma Cliente</td><td style="text-align:center;">{{FIRMA_USUARIO}}<br/>_____________________<br/>Firma Asesor</td></tr></table>`
      );
    }
    setActiveTab('editor');
  }, [isOpen, templateToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(templateToEdit ? 'Actualizando plantilla...' : 'Guardando plantilla legal...');

    // Extract all tokens from HTML
    const regex = /(?:\{\{|\[)([A-Z0-9_]+)(?:\}\}|\])/g;
    let match;
    const extractedTokens: string[] = [];
    while ((match = regex.exec(htmlContent)) !== null) {
      if (!extractedTokens.includes(match[1])) {
        extractedTokens.push(match[1]);
      }
    }
    Object.keys(customFields).forEach((k) => {
      if (!extractedTokens.includes(k)) extractedTokens.push(k);
    });

    try {
      const payload = {
        title,
        category,
        html_content: htmlContent,
        tokens_json: extractedTokens,
        fields_json: customFields,
      };

      if (templateToEdit) {
        await lexvaultService.updateTemplate(templateToEdit.id, payload);
        toast.success('Plantilla legal actualizada', { id: toastId });
      } else {
        await lexvaultService.createTemplate({
          ...payload,
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
    const formatted = tokenName.toUpperCase().trim().replace(/[^A-Z0-9_]/g, '_');
    setHtmlContent((prev) => prev + ` {{${formatted}}}`);
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    const formattedKey = newFieldName.toUpperCase().trim().replace(/[^A-Z0-9_]/g, '_');
    const label = newFieldLabel.trim() || formattedKey.replace(/_/g, ' ');

    setCustomFields((prev) => ({
      ...prev,
      [formattedKey]: label,
    }));

    // Insert into textarea
    insertToken(formattedKey);

    toast.success(`Campo {{${formattedKey}}} agregado como shortcut e insertado.`);
    setNewFieldName('');
    setNewFieldLabel('');
    setIsAddFieldModalOpen(false);
  };

  // Combine default + custom tokens for shortcuts
  const allShortcutTokens = Array.from(new Set([...defaultTokens, ...Object.keys(customFields)]));

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
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
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

            <div className="flex items-center gap-3">
              <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    activeTab === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Vista Previa Carta
                </button>
              </div>

              <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
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

            {activeTab === 'editor' ? (
              <>
                {/* Shortcuts Toolbar Bar with Add Custom Variable Button */}
                <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold text-blue-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Code className="w-4 h-4 text-blue-600" />
                      <span>Shortcuts / Variables de Sustitución:</span>
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsAddFieldModalOpen(true)}
                      className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Agregar Campo Personalizado</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setHtmlContent((prev) => prev + `\n${PAGE_BREAK_MARKER}\n`)}
                      className="px-2.5 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-[11px] hover:bg-amber-600 transition-all shadow-2xs flex items-center gap-1"
                      title="Insertar nueva hoja (Salto de Página)"
                    >
                      <span>+ Salto de Hoja (Nueva Página)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => insertToken('FIRMA')}
                      className="px-2.5 py-1 rounded-xl bg-purple-600 text-white font-extrabold text-[11px] hover:bg-purple-700 transition-all shadow-2xs flex items-center gap-1"
                      title="Insertar ubicación de Firma Digital [FIRMA]"
                    >
                      <span>✍️ + [FIRMA]</span>
                    </button>

                    {allShortcutTokens.map((tok) => (
                      <button
                        key={tok}
                        type="button"
                        onClick={() => insertToken(tok)}
                        className="px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-[11px] font-extrabold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                        title={customFields[tok] || `Insertar {{${tok}}}`}
                      >
                        {`+ {{${tok}}}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cuerpo del Documento Legal (HTML / Texto)
                  </label>
                  <textarea
                    required
                    rows={12}
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  />
                </div>
              </>
            ) : (
              /* Word Letter Paper Preview */
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                <WordDocumentPaper
                  htmlContent={htmlContent || '<p className="text-slate-400 italic">Sin contenido aún</p>'}
                  onContentChange={setHtmlContent}
                  title={title || 'Plantilla de Contrato'}
                  documentNumber={templateToEdit ? `PLANTILLA #${templateToEdit.id}` : 'NUEVA PLANTILLA'}
                  watermarkText="VISTA PREVIA CARTA"
                  editablePages={true}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 flex-shrink-0">
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

      {/* Modal para Agregar Campo / Variable Personalizada */}
      {isAddFieldModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddFieldModalOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 relative z-10 max-w-md w-full space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-600" />
                <span>Agregar Campo Personalizado</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddFieldModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomField} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre de la Variable (Token)</label>
                <input
                  type="text"
                  required
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="Ej. NUMERO_MOTOR, VALOR_CANON, PLACA"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Se convertirá automáticamente a MAYÚSCULAS sin espacios.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Etiqueta / Descripción para el Usuario</label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="Ej. Número de motor del vehículo"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFieldModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Crear Shortcut
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LexvaultTemplateModal;
