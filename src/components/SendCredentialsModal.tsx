'use client';

import React, { useEffect, useState } from 'react';
import Portal from './Portal';
import { CredentialTemplate, User } from '../types';
import marketingService from '../services/marketingService';
import { 
  Key, Mail, X, Send, Eye, CheckCircle2, AlertCircle, Sparkles, UserCheck, ShieldCheck, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SendCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (templateId: number) => Promise<void>;
  targetMode: 'single' | 'batch' | 'all';
  targetUser?: User | null;
  selectedCount?: number;
  totalCount?: number;
  isSending?: boolean;
}

export const SendCredentialsModal: React.FC<SendCredentialsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  targetMode,
  targetUser,
  selectedCount = 0,
  totalCount = 0,
  isSending = false,
}) => {
  const [templates, setTemplates] = useState<CredentialTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>('');
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const data = await marketingService.getCredentialTemplates({ status: 1 });
      const activeList = Array.isArray(data) ? data.filter(t => t.status === 1) : [];
      setTemplates(activeList);

      if (activeList.length === 1) {
        setSelectedTemplateId(activeList[0].id);
      } else if (activeList.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(activeList[0].id);
      }
    } catch (err) {
      console.error('Error al cargar plantillas de credenciales:', err);
      toast.error('Error al obtener plantillas de credenciales activas');
    } finally {
      setLoadingTemplates(false);
    }
  };

  if (!isOpen) return null;

  const selectedTemplate = templates.find(t => t.id === Number(selectedTemplateId));

  const getSubstitutedPreview = (content: string) => {
    if (!content) return '';
    const name = targetUser ? (targetUser.name || 'Juan Pérez') : 'Juan Pérez';
    const email = targetUser ? targetUser.email : 'juan.perez@ejemplo.com';
    const phone = targetUser ? (targetUser.phone || '+593 99 999 9999') : '+593 99 999 9999';
    const company = targetUser?.agency?.name || 'Agencia Inmobiliaria';
    const role = targetUser?.role ? ucfirst(targetUser.role) : 'Agente Comercial';
    const loginUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://plataforma.com/login';

    return content
      .replace(/\{nombre\}/g, name)
      .replace(/\{apellido\}/g, '')
      .replace(/\{nombre_completo\}/g, name)
      .replace(/\{correo\}/g, email)
      .replace(/\{usuario\}/g, email)
      .replace(/\{contraseña\}/g, '<strong><em>[Contraseña temporal generada automáticamente]</em></strong>')
      .replace(/\{telefono\}/g, phone)
      .replace(/\{empresa\}/g, company)
      .replace(/\{rol\}/g, role)
      .replace(/\{url_login\}/g, loginUrl);
  };

  function ucfirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) {
      toast.error('Seleccione una plantilla de credenciales activa');
      return;
    }
    await onConfirm(Number(selectedTemplateId));
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Reenviar Credenciales de Acceso
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {targetMode === 'single' && targetUser && (
                    <span>Destinatario: <strong className="text-slate-800 dark:text-slate-200">{targetUser.name}</strong> ({targetUser.email})</span>
                  )}
                  {targetMode === 'batch' && (
                    <span>Enviando credenciales a un lote de <strong className="text-indigo-600 dark:text-indigo-400">{selectedCount} usuarios seleccionados</strong>.</span>
                  )}
                  {targetMode === 'all' && (
                    <span>Enviando credenciales a <strong className="text-purple-600 dark:text-purple-400">TODOS los usuarios permitidos ({totalCount})</strong>.</span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Template Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Seleccionar Plantilla de Credenciales *
              </label>

              {loadingTemplates ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  <span>Cargando plantillas de credenciales...</span>
                </div>
              ) : templates.length === 0 ? (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" /> No hay plantillas activas registradas
                  </div>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400">
                    Crea y activa primero una plantilla en el módulo de <strong>Emails y Campañas -&gt; Plantillas de Credenciales</strong>.
                  </p>
                </div>
              ) : (
                <select
                  required
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Asunto: {t.subject || 'Sin asunto'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Template Details & Live Preview */}
            {selectedTemplate && (
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300">
                    Asunto del Correo:
                  </span>
                  <span className="font-medium text-amber-600 dark:text-amber-400 font-mono text-[11px]">
                    {getSubstitutedPreview(selectedTemplate.subject || 'Credenciales de acceso')}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-indigo-500" /> Vista Previa del Mensaje
                  </span>
                  <div 
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto leading-relaxed custom-scrollbar font-sans"
                    dangerouslySetInnerHTML={{ __html: getSubstitutedPreview(selectedTemplate.body_html) }}
                  />
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl text-[11px] text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block">Generación Segura de Contraseña Temporal:</span>
                Al confirmar, el sistema generará de forma segura una nueva clave aleatoria para cada usuario, la actualizará con hash en la base de datos y la enviará al correo especificado.
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSending || !selectedTemplateId || templates.length === 0}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando credenciales...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirmar y Enviar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default SendCredentialsModal;
