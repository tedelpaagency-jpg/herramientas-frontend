'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Trash2,
  Send,
  LogIn,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Webhook,
  Mail,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import estateService, { EstateApprovalSettings } from '@/services/estateService';
import { useAuth } from '@/context/AuthContext';

interface EstateApprovalSettingsPanelProps {
  agencyId?: number;
  onSaved?: () => void;
  isModal?: boolean;
}

export const EstateApprovalSettingsPanel: React.FC<EstateApprovalSettingsPanelProps> = ({
  agencyId,
  onSaved,
  isModal = false,
}) => {
  const { user, hasPermission } = useAuth();

  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
  const hasEstateAccess =
    isSuperAdmin ||
    hasPermission([
      'view_estates',
      'manage_estates',
      'estates.view',
      'estates.manage',
      'estates.create',
      'portal_inmobiliario.manage',
      'portal_inmobiliario',
    ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [agencyName, setAgencyName] = useState<string>('');

  const [settings, setSettings] = useState<EstateApprovalSettings>({
    require_admin_approval_to_publish: false,
    require_admin_approval_to_delete: false,
    notify_on_property_upload: false,
    notify_property_upload_emails: '',
    notify_on_property_delete: false,
    notify_property_delete_emails: '',
    notify_on_user_login: false,
    notify_user_login_emails: '',
    webhook_url: '',
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await estateService.getSettings(agencyId);
      if (data) {
        setSettings({
          require_admin_approval_to_publish: !!data.require_admin_approval_to_publish,
          require_admin_approval_to_delete: !!data.require_admin_approval_to_delete,
          notify_on_property_upload: !!data.notify_on_property_upload,
          notify_property_upload_emails: data.notify_property_upload_emails || '',
          notify_on_property_delete: !!data.notify_on_property_delete,
          notify_property_delete_emails: data.notify_property_delete_emails || '',
          notify_on_user_login: !!data.notify_on_user_login,
          notify_user_login_emails: data.notify_user_login_emails || '',
          webhook_url: data.webhook_url || '',
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al cargar configuración de propiedades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [agencyId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await estateService.updateSettings(settings, agencyId);
      if (updated) {
        setSettings({
          require_admin_approval_to_publish: !!updated.require_admin_approval_to_publish,
          require_admin_approval_to_delete: !!updated.require_admin_approval_to_delete,
          notify_on_property_upload: !!updated.notify_on_property_upload,
          notify_property_upload_emails: updated.notify_property_upload_emails || '',
          notify_on_property_delete: !!updated.notify_on_property_delete,
          notify_property_delete_emails: updated.notify_property_delete_emails || '',
          notify_on_user_login: !!updated.notify_on_user_login,
          notify_user_login_emails: updated.notify_user_login_emails || '',
          webhook_url: updated.webhook_url || '',
        });
      }
      toast.success('¡Configuración y automatizaciones de propiedades guardadas exitosamente!');
      if (onSaved) onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (!hasEstateAccess) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-black text-slate-800 dark:text-white">Acceso Restringido</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Su cuenta no cuenta con los permisos de gestión inmobiliaria necesarios para configurar las aprobaciones y automatizaciones de propiedades.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500">Cargando configuración de propiedades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Módulo de Propiedades &bull; Políticas &amp; Automatizaciones
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Flujos de Aprobación &amp; Automatizaciones Inmobiliarias
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Controla la visibilidad pública de las propiedades captadas por agentes, exige confirmación administrativa antes de suprimir inmuebles y activa alertas instantáneas.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-xs font-black text-white flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* BLOQUE 1: APROBACIONES ADMINISTRATIVAS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Políticas de Aprobación de Inmuebles
              </h3>
              <p className="text-xs text-slate-500">
                Reglas aplicadas a los agentes y asesores comerciales cuando crean o eliminan propiedades.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opción 1: Aprobación para mostrar */}
            <div
              onClick={() =>
                setSettings({
                  ...settings,
                  require_admin_approval_to_publish: !settings.require_admin_approval_to_publish,
                })
              }
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                settings.require_admin_approval_to_publish
                  ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      settings.require_admin_approval_to_publish
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Aprobación de Admin para Mostrar / Publicar
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {settings.require_admin_approval_to_publish
                        ? 'Activado: Los inmuebles de asesores quedan pendientes de revisión antes de mostrarse en la web.'
                        : 'Desactivado: Las propiedades de los asesores se publican inmediatamente en el portal.'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.require_admin_approval_to_publish}
                  onChange={() => {}}
                  className="rounded-lg w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer pointer-events-none mt-1"
                />
              </div>

              <div className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>
                  {settings.require_admin_approval_to_publish
                    ? 'Requiere verificación (verify = 1) por el Administrador'
                    : 'Auto-publicación inmediata'}
                </span>
              </div>
            </div>

            {/* Opción 2: Aprobación para eliminar */}
            <div
              onClick={() =>
                setSettings({
                  ...settings,
                  require_admin_approval_to_delete: !settings.require_admin_approval_to_delete,
                })
              }
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                settings.require_admin_approval_to_delete
                  ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      settings.require_admin_approval_to_delete
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Aprobación de Admin para Eliminar
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {settings.require_admin_approval_to_delete
                        ? 'Activado: Asesores no pueden borrar propiedades; se envía una solicitud para que el admin confirme.'
                        : 'Desactivado: Asesores con permisos pueden eliminar directamente sus propiedades.'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.require_admin_approval_to_delete}
                  onChange={() => {}}
                  className="rounded-lg w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer pointer-events-none mt-1"
                />
              </div>

              <div className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  {settings.require_admin_approval_to_delete
                    ? 'Protección contra borrado accidental o no autorizado'
                    : 'Borrado directo permitido'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE 2: AUTOMATIZACIONES DE NOTIFICACIÓN */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Automatizaciones de Notificación en Tiempo Real
              </h3>
              <p className="text-xs text-slate-500">
                Dispara correos electrónicos instantáneos y alertas ante eventos clave de propiedades y seguridad.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Auto 1: Notificar subida de propiedad */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Notificar Subida de una Propiedad
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Envía un correo con los detalles del inmueble, precio y asesor responsable.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notify_on_property_upload}
                    onChange={(e) =>
                      setSettings({ ...settings, notify_on_property_upload: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {settings.notify_on_property_upload && (
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Correos electrónicos destinatarios (separados por coma):
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="admin@tuagencia.com, gerencia@tuagencia.com (vacío = correo de la agencia)"
                      value={settings.notify_property_upload_emails}
                      onChange={(e) =>
                        setSettings({ ...settings, notify_property_upload_emails: e.target.value })
                      }
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Auto 2: Notificar eliminación de propiedad */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Notificar Eliminación o Solicitud de Baja
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Alerta al administrador cuando se da de baja una propiedad o se solicita su retiro.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notify_on_property_delete}
                    onChange={(e) =>
                      setSettings({ ...settings, notify_on_property_delete: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {settings.notify_on_property_delete && (
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Correos electrónicos destinatarios (separados por coma):
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="admin@tuagencia.com, auditoria@tuagencia.com"
                      value={settings.notify_property_delete_emails}
                      onChange={(e) =>
                        setSettings({ ...settings, notify_property_delete_emails: e.target.value })
                      }
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Auto 3: Notificar inicio de sesión */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Notificar Inicio de Sesión de Usuarios
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Alerta de seguridad inmediata con IP, fecha y usuario que accede al sistema.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notify_on_user_login}
                    onChange={(e) =>
                      setSettings({ ...settings, notify_on_user_login: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {settings.notify_on_user_login && (
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Correos de supervisión para alertas de login:
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="seguridad@tuagencia.com, admin@tuagencia.com"
                      value={settings.notify_user_login_emails}
                      onChange={(e) =>
                        setSettings({ ...settings, notify_user_login_emails: e.target.value })
                      }
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Opcional: Webhook general */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 space-y-2">
              <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Webhook className="w-3.5 h-3.5 text-indigo-500" />
                <span>Webhook HTTP (POST) para Eventos de Propiedades</span>
              </label>
              <input
                type="url"
                placeholder="https://n8n.tuempresa.com/webhook/propiedades (opcional)"
                value={settings.webhook_url}
                onChange={(e) => setSettings({ ...settings, webhook_url: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Se enviarán los payloads en formato JSON cada vez que ocurra la subida o eliminación de un inmueble.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs font-black text-white flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Guardando...' : 'Guardar Configuración'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EstateApprovalSettingsPanel;

