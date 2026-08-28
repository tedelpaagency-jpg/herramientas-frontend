'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, UserCheck, Sparkles, Eye, Download, FileCode } from 'lucide-react';
import { LexvaultTemplate, Client } from '../types';
import lexvaultService from '../services/lexvaultService';
import clientService from '../services/clientService';
import WordDocumentPaper from './WordDocumentPaper';
import toast from 'react-hot-toast';

interface LexvaultGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (generatedDoc: any) => void;
  template?: LexvaultTemplate | null;
}

export const LexvaultGenerateModal: React.FC<LexvaultGenerateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  template = null,
}) => {
  const [availableTemplates, setAvailableTemplates] = useState<LexvaultTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<LexvaultTemplate | null>(template);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>(template?.id || '');

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [docTitle, setDocTitle] = useState('');
  const [tokens, setTokens] = useState<string[]>([]);
  const [replacements, setReplacements] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewTab, setPreviewTab] = useState<'form' | 'preview'>('form');

  // Load templates and clients on open
  useEffect(() => {
    if (!isOpen) return;

    loadTemplatesAndClients();
  }, [isOpen]);

  // When initial prop `template` changes or is set
  useEffect(() => {
    if (template) {
      setActiveTemplate(template);
      setSelectedTemplateId(template.id);
    }
  }, [template]);

  // When `activeTemplate` changes, re-extract tokens and default values
  useEffect(() => {
    if (!activeTemplate) {
      setTokens([]);
      setReplacements({});
      return;
    }

    if (!docTitle || docTitle.includes(activeTemplate.title)) {
      setDocTitle(`${activeTemplate.title} - ${new Date().toLocaleDateString()}`);
    }

    const bodyHtml = activeTemplate.html_content || activeTemplate.template_body || '';
    const regex = /(?:\{\{|\[)([A-Z0-9_]+)(?:\}\}|\])/g;
    let match;
    const extracted: string[] = [];
    while ((match = regex.exec(bodyHtml)) !== null) {
      if (!extracted.includes(match[1]) && !['FIRMA', 'FIRMA_CLIENTE', 'FIRMA_USUARIO'].includes(match[1])) {
        extracted.push(match[1]);
      }
    }

    if (activeTemplate.tokens_json && Array.isArray(activeTemplate.tokens_json)) {
      activeTemplate.tokens_json.forEach((tok) => {
        if (!extracted.includes(tok) && !['FIRMA', 'FIRMA_CLIENTE', 'FIRMA_USUARIO'].includes(tok)) {
          extracted.push(tok);
        }
      });
    }

    if (activeTemplate.fields_json) {
      Object.keys(activeTemplate.fields_json).forEach((tok) => {
        if (!extracted.includes(tok) && !['FIRMA', 'FIRMA_CLIENTE', 'FIRMA_USUARIO'].includes(tok)) {
          extracted.push(tok);
        }
      });
    }

    setTokens(extracted);

    // Default replacement values
    const initialReplacements: Record<string, string> = {};
    extracted.forEach((tok) => {
      if (tok.includes('FECHA')) {
        initialReplacements[tok] = new Date().toLocaleDateString();
      } else if (tok.includes('CIUDAD')) {
        initialReplacements[tok] = 'Quito';
      } else {
        initialReplacements[tok] = '';
      }
    });
    setReplacements(initialReplacements);
  }, [activeTemplate]);

  const loadTemplatesAndClients = async () => {
    try {
      const [tmplList, clientList] = await Promise.all([
        lexvaultService.getTemplates().catch(() => []),
        clientService.getClients().catch(() => []),
      ]);

      setAvailableTemplates(tmplList);
      setClients(clientList);

      if (!activeTemplate && tmplList.length > 0) {
        const firstTmpl = template || tmplList[0];
        setActiveTemplate(firstTmpl);
        setSelectedTemplateId(firstTmpl.id);
      }
    } catch (err) {
      console.error('Error loading template list:', err);
    }
  };

  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplateId(templateId);
    const selected = availableTemplates.find((t) => t.id === templateId);
    if (selected) {
      setActiveTemplate(selected);
      setDocTitle(`${selected.title} - ${new Date().toLocaleDateString()}`);
    }
  };

  const handleClientSelect = (clientIdStr: string) => {
    setSelectedClientId(clientIdStr);
    if (!clientIdStr) return;

    const client = clients.find((c) => c.id === parseInt(clientIdStr));
    if (client) {
      const clientFullName = client.name || `${client.first_name || ''} ${client.last_name || ''}`.trim();
      const clientDoc = client.identification_number || client.document_number || '';
      setReplacements((prev) => ({
        ...prev,
        CLIENTE_NOMBRE: clientFullName,
        CLIENTE_CEDULA: clientDoc,
        CLIENTE_CORREO: client.email || '',
        CLIENTE_TELEFONO: client.phone || '',
        DIRECCION: client.address || prev.DIRECCION || '',
      }));
    }
  };

  const handleInputChange = (tokenName: string, value: string) => {
    setReplacements((prev) => ({ ...prev, [tokenName]: value }));
  };

  const getRenderedPreviewHtml = (): string => {
    if (!activeTemplate) return '';
    let html = activeTemplate.html_content || activeTemplate.template_body || '';
    Object.entries(replacements).forEach(([key, val]) => {
      html = html.replace(new RegExp(`(?:\\{\\{|\\[)${key}(?:\\}\\}|\\])`, 'g'), val || `[${key}]`);
    });
    return html;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTemplate) {
      toast.error('Por favor seleccione una plantilla legal');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Generando contrato legal...');

    try {
      const doc = await lexvaultService.generateDocument({
        template_id: activeTemplate.id,
        client_id: selectedClientId ? parseInt(selectedClientId) : null,
        title: docTitle,
        replacements,
      });

      toast.success('¡Contrato legal generado exitosamente!', { id: toastId });
      onSuccess(doc);
      onClose();
    } catch (err) {
      console.error('Error generating contract:', err);
      toast.error('Error al generar el contrato legal', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[90vh]"
        >
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Generar Nuevo Contrato Legal</h3>
                <p className="text-[11px] text-slate-400">Selecciona la plantilla legal y completa los campos requeridos</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPreviewTab('form')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${previewTab === 'form' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Formulario
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('preview')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${previewTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Vista Previa
                </button>
              </div>

              <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
            {previewTab === 'form' ? (
              <>
                {/* 1. Selector de Plantilla Legal */}
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-2">
                  <label className="block text-xs font-extrabold text-purple-900 dark:text-purple-200 uppercase flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-purple-600" />
                    Seleccionar Plantilla Legal a Utilizar *
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleTemplateSelect(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                    required
                  >
                    <option value="">-- Seleccionar Plantilla Legal --</option>
                    {availableTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        📄 {t.title} ({t.category || 'General'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Referencia y Cliente Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Vincular Cliente (Opcional)</label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => handleClientSelect(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    >
                      <option value="">-- Seleccionar de la base de clientes --</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name || `${c.first_name || ''} ${c.last_name || ''}`} ({c.identification_number || c.email || 'Sin Doc'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Nombre / Título del Contrato</label>
                    <input
                      type="text"
                      required
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="Ej. Contrato de Arrendamiento - Cliente"
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                {/* 3. Tokens Input Fields */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">Campos de la Plantilla Seleccionada</h4>
                  {!activeTemplate ? (
                    <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      Selecciona una plantilla legal arriba para mostrar sus campos editables.
                    </p>
                  ) : tokens.length === 0 ? (
                    <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      No se detectaron variables adicionales en esta plantilla. Puede proceder directamente a la emisión.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tokens.map((tok) => (
                        <div key={tok}>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                            {activeTemplate.fields_json?.[tok] || tok.replace(/_/g, ' ')}
                          </label>
                          <input
                            type="text"
                            value={replacements[tok] || ''}
                            onChange={(e) => handleInputChange(tok, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                            placeholder={`Ingrese ${tok.toLowerCase().replace(/_/g, ' ')}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Live Preview Tab Word Letter Style */
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                <WordDocumentPaper
                  htmlContent={getRenderedPreviewHtml()}
                  title={docTitle || activeTemplate?.title || 'Contrato'}
                  documentNumber={`PROYECTO-${activeTemplate?.id || 'NEW'}`}
                  watermarkText="VISTA PREVIA"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !activeTemplate}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isSubmitting ? 'Emitiendo...' : 'Generar Contrato Legal'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LexvaultGenerateModal;
