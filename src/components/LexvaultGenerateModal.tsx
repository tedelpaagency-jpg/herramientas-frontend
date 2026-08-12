'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, UserCheck, Sparkles, Eye, Download } from 'lucide-react';
import { LexvaultTemplate, Client } from '../types';
import lexvaultService from '../services/lexvaultService';
import clientService from '../services/clientService';
import toast from 'react-hot-toast';

interface LexvaultGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (generatedDoc: any) => void;
  template: LexvaultTemplate | null;
}

export const LexvaultGenerateModal: React.FC<LexvaultGenerateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  template,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [docTitle, setDocTitle] = useState('');
  const [tokens, setTokens] = useState<string[]>([]);
  const [replacements, setReplacements] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewTab, setPreviewTab] = useState<'form' | 'preview'>('form');

  useEffect(() => {
    if (!isOpen || !template) return;

    setDocTitle(`${template.title} - ${new Date().toLocaleDateString()}`);

    // Cargar lista de clientes
    clientService.getClients().then(setClients).catch(console.error);

    // Extraer tokens automáticamente del cuerpo HTML de la plantilla
    const bodyHtml = template.html_content || template.template_body || '';
    const regex = /(?:\{\{|\[)([A-Z0-9_]+)(?:\}\}|\])/g;
    let match;
    const extracted: string[] = [];
    while ((match = regex.exec(bodyHtml)) !== null) {
      if (!extracted.includes(match[1]) && !['FIRMA', 'FIRMA_CLIENTE', 'FIRMA_USUARIO'].includes(match[1])) {
        extracted.push(match[1]);
      }
    }

    setTokens(extracted);

    // Inicializar valores por defecto
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
  }, [isOpen, template]);

  if (!isOpen || !template) return null;

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
    let html = template.html_content || template.template_body || '';
    Object.entries(replacements).forEach(([key, val]) => {
      html = html.replace(new RegExp(`(?:\\{\\{|\\[)${key}(?:\\}\\}|\\])`, 'g'), val || `[${key}]`);
    });
    return html;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Generando contrato legal...');

    try {
      const doc = await lexvaultService.generateDocument({
        template_id: template.id,
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
          className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]"
        >
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Generar Documento: {template.title}</h3>
                <p className="text-[11px] text-slate-400">Complete los datos requeridos para emitir el contrato</p>
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
                {/* Referencia y Cliente Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vincular Cliente (Opcional)</label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => handleClientSelect(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
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
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre / Título de Referencia</label>
                    <input
                      type="text"
                      required
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                {/* Tokens Input Fields */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">Campos de la Plantilla</h4>
                  {tokens.length === 0 ? (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                      No se detectaron variables adicionales en esta plantilla. Puede proceder directamente a la emisión.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tokens.map((tok) => (
                        <div key={tok}>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            {tok.replace(/_/g, ' ')}
                          </label>
                          <input
                            type="text"
                            value={replacements[tok] || ''}
                            onChange={(e) => handleInputChange(tok, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                            placeholder={`Ingrese ${tok.toLowerCase().replace(/_/g, ' ')}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Live Preview Tab */
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 font-serif text-xs text-slate-800 leading-relaxed max-h-[60vh] overflow-y-auto whitespace-pre-line shadow-inner">
                <div dangerouslySetInnerHTML={{ __html: getRenderedPreviewHtml() }} />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 flex-shrink-0">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
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
