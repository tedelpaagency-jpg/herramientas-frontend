import React, { useEffect, useState } from 'react';
import { Workspace } from '../types';
import workspaceMetaService from '../services/workspaceMetaService';
import { Share2, Webhook, Copy, Check, Unlink, X, AlertCircle } from 'lucide-react';

interface WorkspaceMetaModalProps {
  workspace: Workspace | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const WorkspaceMetaModal: React.FC<WorkspaceMetaModalProps> = ({
  workspace,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [formData, setFormData] = useState({
    meta_enabled: false,
    meta_campaign_id: '',
    meta_campaign_name: '',
    meta_form_id: '',
    meta_form_name: '',
    meta_page_id: '',
    meta_webhook_enabled: true,
  });

  const [webhookInfo, setWebhookInfo] = useState<{ webhook_url: string; verify_token: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (workspace && isOpen) {
      setFormData({
        meta_enabled: !!workspace.meta_enabled,
        meta_campaign_id: workspace.meta_campaign_id || '',
        meta_campaign_name: workspace.meta_campaign_name || '',
        meta_form_id: workspace.meta_form_id || '',
        meta_form_name: workspace.meta_form_name || '',
        meta_page_id: workspace.meta_page_id || '',
        meta_webhook_enabled: workspace.meta_webhook_enabled !== false,
      });

      // Load webhook details
      workspaceMetaService
        .getWebhookInfo(workspace.id)
        .then((info) => setWebhookInfo(info))
        .catch((err) => console.error('Error fetching webhook info:', err));
    }
  }, [workspace, isOpen]);

  if (!isOpen || !workspace) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');

    try {
      await workspaceMetaService.updateWorkspaceMeta(workspace.id, formData);
      onSaved();
      onClose();
    } catch (err: any) {
      console.error('Error updating Meta config:', err);
      setErrorMsg(err?.response?.data?.message || 'Error al guardar la configuración de Meta.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('¿Desea desconectar la integración de Meta de este Workspace? Los prospectos históricos permanecerán intactos.')) {
      return;
    }

    setIsSaving(true);
    try {
      await workspaceMetaService.disconnectWorkspaceMeta(workspace.id);
      onSaved();
      onClose();
    } catch (err: any) {
      console.error('Error disconnecting Meta:', err);
      setErrorMsg('Error al desconectar la integración.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = (text: string, type: 'url' | 'token') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Configurar Integración Meta (Facebook / Instagram)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Workspace: <span className="font-bold text-slate-700 dark:text-slate-300">{workspace.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Switch Activar Meta */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Integración con Meta Leads
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Permite recibir automáticamente prospectos provenientes de anuncios y formularios de Meta.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.meta_enabled}
                onChange={(e) => setFormData({ ...formData, meta_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {formData.meta_enabled && (
            <>
              {/* Campaign & Form Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ID de Campaña Meta (Campaign ID)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_campaign_id}
                    onChange={(e) => setFormData({ ...formData, meta_campaign_id: e.target.value })}
                    placeholder="Ej. 120209483948"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre de Campaña Meta
                  </label>
                  <input
                    type="text"
                    value={formData.meta_campaign_name}
                    onChange={(e) => setFormData({ ...formData, meta_campaign_name: e.target.value })}
                    placeholder="Ej. Campaña Inmobiliaria Guatemala 2026"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ID de Formulario Meta (Form ID)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_form_id}
                    onChange={(e) => setFormData({ ...formData, meta_form_id: e.target.value })}
                    placeholder="Ej. 984729104857"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre de Formulario Meta
                  </label>
                  <input
                    type="text"
                    value={formData.meta_form_name}
                    onChange={(e) => setFormData({ ...formData, meta_form_name: e.target.value })}
                    placeholder="Ej. Formulario Prospectos Residencial"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ID de Página de Facebook / Instagram (Page ID)
                </label>
                <input
                  type="text"
                  value={formData.meta_page_id}
                  onChange={(e) => setFormData({ ...formData, meta_page_id: e.target.value })}
                  placeholder="Ej. 102938475610"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              {/* Webhook Configuration Details */}
              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/80 dark:border-blue-900/50 space-y-3">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs">
                  <Webhook className="w-4 h-4 text-blue-600" />
                  <span>Configuración del Webhook para Meta Developers</span>
                </div>

                {webhookInfo && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        URL de Callback (Webhook Endpoint)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={webhookInfo.webhook_url}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-mono select-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(webhookInfo.webhook_url, 'url')}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          title="Copiar URL"
                        >
                          {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Token de Verificación (Verify Token)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={webhookInfo.verify_token}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-mono select-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(webhookInfo.verify_token, 'token')}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          title="Copiar Token"
                        >
                          {copiedToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
            {workspace.meta_enabled ? (
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={isSaving}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Unlink className="w-4 h-4" />
                <span>Desconectar Meta</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>{isSaving ? 'Guardando...' : 'Guardar Configuración'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceMetaModal;
