'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, UserCheck, Sparkles, Eye, Download, FileCode, Image as ImageIcon, Plus, Trash2, Sliders, Check } from 'lucide-react';
import { LexvaultTemplate, Client } from '../types';
import lexvaultService from '../services/lexvaultService';
import clientService from '../services/clientService';
import WordDocumentPaper from './WordDocumentPaper';
import toast from 'react-hot-toast';
import { downloadLetterheadGuideTemplate } from './LetterheadGuideModal';

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
  const [customTokens, setCustomTokens] = useState<string[]>([]);
  const [newCustomTokenInput, setNewCustomTokenInput] = useState('');
  const [isAddingCustomToken, setIsAddingCustomToken] = useState(false);
  const [replacements, setReplacements] = useState<Record<string, string>>({});
  const [customBg, setCustomBg] = useState<string | null>(template?.background_image || null);
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
      setCustomBg(template.background_image || null);
    }
  }, [template]);

  // When `activeTemplate` changes, re-extract tokens and default values
  useEffect(() => {
    if (!activeTemplate) {
      setTokens([]);
      setCustomTokens([]);
      setReplacements({});
      setCustomBg(null);
      return;
    }

    setCustomBg(activeTemplate.background_image || null);

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
    setCustomTokens([]);

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
      setClients(Array.isArray(clientList) ? clientList : (clientList as any).data || []);

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

  const handleAddCustomToken = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = newCustomTokenInput.trim();
    if (!raw) return;

    // Normalize token name to UPPERCASE_SNAKE_CASE without brackets
    const formattedToken = raw
      .replace(/[\{\}\[\]]/g, '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');

    if (!formattedToken) {
      toast.error('Nombre de shortcut no válido');
      return;
    }

    if (tokens.includes(formattedToken)) {
      toast.error(`El shortcut {{${formattedToken}}} ya existe`);
      return;
    }

    setTokens((prev) => [...prev, formattedToken]);
    setCustomTokens((prev) => [...prev, formattedToken]);
    setReplacements((prev) => ({ ...prev, [formattedToken]: '' }));
    setNewCustomTokenInput('');
    setIsAddingCustomToken(false);
    toast.success(`Campo {{${formattedToken}}} agregado al contrato`);
  };

  const handleRemoveCustomToken = (tokenToRemove: string) => {
    setTokens((prev) => prev.filter((t) => t !== tokenToRemove));
    setCustomTokens((prev) => prev.filter((t) => t !== tokenToRemove));
    setReplacements((prev) => {
      const next = { ...prev };
      delete next[tokenToRemove];
      return next;
    });
    toast.success(`Campo {{${tokenToRemove}}} removido`);
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
        background_image: customBg === 'none' ? 'none' : (customBg || undefined),
        tokens_json: tokens,
        custom_tokens: customTokens,
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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

                {/* 2b. Selector de Fondo de Hoja Individual para el Contrato */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      Fondo de Hoja / Membrete de este Contrato
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Individual por contrato</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomBg(activeTemplate?.background_image || null)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        customBg === (activeTemplate?.background_image || null) && customBg !== 'none'
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/30'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="block truncate">De la Plantilla</span>
                      <span className="block text-[10px] font-normal text-slate-400 truncate">
                        {activeTemplate?.background_image ? 'Membrete original' : 'Sin fondo'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomBg('none')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        customBg === 'none'
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/30'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="block">Sin Fondo</span>
                      <span className="block text-[10px] font-normal text-slate-400">Hoja blanca limpia</span>
                    </button>

                    <label className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold text-left cursor-pointer transition-all flex flex-col justify-center">
                      <span className="truncate">{customBg && customBg !== 'none' && customBg !== activeTemplate?.background_image ? 'Membrete Nuevo' : 'Subir Fondo'}</span>
                      <span className="text-[10px] font-normal text-slate-400 truncate">PNG/JPG Carta</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const res = await lexvaultService.uploadBackground(file);
                            setCustomBg(res.url);
                            toast.success('Membrete asignado a este contrato');
                          } catch {
                            toast.error('Error al subir membrete');
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Tamaño Carta recomendado: 2550 × 3300 px (300 DPI)</span>
                    <button
                      type="button"
                      onClick={() => downloadLetterheadGuideTemplate()}
                      className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Plantilla Guía Carta</span>
                    </button>
                  </div>
                </div>

                {/* 3. Tokens & Custom Contract Shortcuts */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-purple-600" />
                        Shortcuts y Campos del Contrato ({tokens.length})
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Los shortcuts de la plantilla se copiaron para este contrato. Puedes llenarlos o agregar campos propios adicionales.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingCustomToken((prev) => !prev)}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Agregar Campo Propio</span>
                    </button>
                  </div>

                  {/* Add Custom Token Inline Form */}
                  {isAddingCustomToken && (
                    <div className="p-3 bg-purple-50/80 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 space-y-2 animate-in fade-in">
                      <label className="block text-[11px] font-bold text-purple-900 dark:text-purple-200 uppercase">
                        Nuevo Campo Propio para este Contrato (ej. GARANTE, NOTARIA, FORMA_PAGO)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCustomTokenInput}
                          onChange={(e) => setNewCustomTokenInput(e.target.value)}
                          placeholder="Nombre del campo (se usará como {{CAMPO}})"
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomToken(e);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomToken}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCustomToken(false);
                            setNewCustomTokenInput('');
                          }}
                          className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded-xl text-xs font-bold transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {!activeTemplate ? (
                    <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      Selecciona una plantilla legal arriba para mostrar sus campos editables.
                    </p>
                  ) : tokens.length === 0 ? (
                    <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      No hay shortcuts registrados en esta plantilla. Puedes hacer clic en &quot;+ Agregar Campo Propio&quot; para definir variables personalizadas.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                      {tokens.map((tok) => {
                        const isCustom = customTokens.includes(tok);
                        return (
                          <div key={tok} className="relative p-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono truncate">
                                {`{{${tok}}}`}
                              </label>
                              <div className="flex items-center gap-1 shrink-0">
                                {isCustom ? (
                                  <>
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                      Propio
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCustomToken(tok)}
                                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                                      title="Eliminar campo propio"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium text-slate-400 dark:text-slate-500">
                                    De plantilla
                                  </span>
                                )}
                              </div>
                            </div>
                            <input
                              type="text"
                              value={replacements[tok] || ''}
                              onChange={(e) => handleInputChange(tok, e.target.value)}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                              placeholder={`Valor para ${tok}...`}
                            />
                          </div>
                        );
                      })}
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
                  backgroundImageUrl={customBg === 'none' ? 'none' : (customBg || undefined)}
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
