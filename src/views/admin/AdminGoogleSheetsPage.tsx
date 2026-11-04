'use client';

import React, { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Key,
  Mail,
  Upload,
  ExternalLink,
  Info,
  Lock,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  Calendar,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import googleSheetsService, { GoogleSheetsGlobalSettings } from '../../services/googleSheetsService';
import { useAuth } from '../../context/AuthContext';

export const AdminGoogleSheetsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<GoogleSheetsGlobalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Form states
  const [isEnabled, setIsEnabled] = useState(false);
  const [serviceAccountEmail, setServiceAccountEmail] = useState('');
  const [serviceAccountJson, setServiceAccountJson] = useState('');
  const [jsonParsedInfo, setJsonParsedInfo] = useState<{ clientEmail?: string; projectId?: string } | null>(null);

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.role === 'superadmin' ||
    user?.roles?.some((r: any) => r.name === 'super_admin' || r.name === 'superadmin');

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await googleSheetsService.getGlobalSettings();
      setSettings(data);
      setIsEnabled(data.is_enabled);
      setServiceAccountEmail(data.service_account_email || '');
    } catch (err: any) {
      console.error('Error fetching Google Sheets global settings:', err);
      toast.error(err?.response?.data?.message || 'Error al cargar la configuración de Google Sheets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Manejo de carga de archivo JSON de credenciales
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Por favor selecciona un archivo con extensión .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.client_email || !parsed.private_key) {
          toast.error('El archivo JSON no contiene las claves "client_email" o "private_key" requeridas por Google.');
          return;
        }

        setServiceAccountJson(text);
        setServiceAccountEmail(parsed.client_email);
        setJsonParsedInfo({
          clientEmail: parsed.client_email,
          projectId: parsed.project_id,
        });
        toast.success(`Credenciales de "${parsed.client_email}" cargadas correctamente.`);
      } catch (err) {
        toast.error('El archivo no tiene un formato JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  // Manejo de edición manual del textarea de JSON
  const handleJsonTextChange = (text: string) => {
    setServiceAccountJson(text);
    if (!text.trim()) {
      setJsonParsedInfo(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      if (parsed.client_email) {
        setServiceAccountEmail(parsed.client_email);
        setJsonParsedInfo({
          clientEmail: parsed.client_email,
          projectId: parsed.project_id,
        });
      }
    } catch {
      // Ignorar mientras escribe
    }
  };

  // Probar conexión
  const handleTestConnection = async () => {
    setIsTesting(true);
    const toastId = toast.loading('Probando conexión con Google Sheets API...');
    try {
      const payload = serviceAccountJson.trim() ? { service_account_json: serviceAccountJson.trim() } : undefined;
      const res = await googleSheetsService.testGlobalConnection(payload);

      toast.success(res.message || '¡Conexión establecida exitosamente!', { id: toastId });
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              connection_status: 'connected',
              last_validated_at: res.last_validated_at,
              last_error: null,
            }
          : null
      );
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Error al conectar con Google Sheets API';
      toast.error(errMsg, { id: toastId });
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              connection_status: 'error',
              last_error: errMsg,
            }
          : null
      );
    } finally {
      setIsTesting(false);
    }
  };

  // Guardar configuración
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Guardando configuración global...');

    try {
      const payload: any = {
        is_enabled: isEnabled,
        service_account_email: serviceAccountEmail.trim() || undefined,
      };

      if (serviceAccountJson.trim()) {
        payload.service_account_json = serviceAccountJson.trim();
      }

      const res = await googleSheetsService.updateGlobalSettings(payload);
      toast.success(res.message || 'Configuración guardada exitosamente', { id: toastId });
      setSettings(res.data);
      setServiceAccountJson(''); // Limpiar el JSON del campo por seguridad una vez guardado
      setJsonParsedInfo(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar la configuración', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-lg mx-auto mt-12">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-black text-slate-800">Acceso Restringido</h2>
        <p className="text-xs text-slate-500 mt-1">
          Esta sección está reservada exclusivamente para el Super Administrador de la plataforma.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs border border-emerald-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Integración Google Sheets
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Configuración global de credenciales Google Service Account para sincronización multi-tenant de propiedades.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Recargar configuración"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Cargando credenciales y estado de conexión...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Columna Izquierda: Formulario de Configuración Global */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="space-y-0.5">
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-600" />
                    <span>Credenciales de Servicio (API)</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Conexión centralizada mediante Google Service Account (OAuth 2.0 JWT RFC 7523).
                  </p>
                </div>

                {/* Switch Habilitar/Deshabilitar */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                  <span className="ml-2.5 text-xs font-bold text-slate-700">
                    {isEnabled ? 'Activado' : 'Desactivado'}
                  </span>
                </label>
              </div>

              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  settings?.connection_status === 'connected'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : settings?.connection_status === 'error'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {settings?.connection_status === 'connected' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : settings?.connection_status === 'error' ? (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs font-black m-0">
                      Estado:{' '}
                      {settings?.connection_status === 'connected'
                        ? 'Conexión Exitosa con Google API'
                        : settings?.connection_status === 'error'
                        ? 'Error de Conexión'
                        : 'Sin Verificar o Desconectado'}
                    </p>
                    {settings?.last_error && (
                      <p className="text-[11px] font-medium text-rose-700 mt-1 line-clamp-2">
                        {settings.last_error}
                      </p>
                    )}
                    {settings?.last_validated_at && (
                      <p className="text-[11px] opacity-75 mt-0.5">
                        Última validación: {new Date(settings.last_validated_at).toLocaleString('es-EC')}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || (!settings?.has_credentials && !serviceAccountJson.trim())}
                  className="px-4 py-2 min-h-[38px] rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-800 font-extrabold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Probando...' : 'Probar Conexión'}</span>
                </button>
              </div>

              {/* Service Account Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Google Service Account Email</span>
                </label>
                <input
                  type="email"
                  value={serviceAccountEmail}
                  onChange={(e) => setServiceAccountEmail(e.target.value)}
                  placeholder="ej: tedelpa-sheets@tu-proyecto.iam.gserviceaccount.com"
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  Las agencias deberán compartir su documento de Google Sheets con este correo otorgando rol de <b>Editor</b>.
                </p>
              </div>

              {/* Upload JSON file / Paste JSON */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-400" />
                    <span>Credenciales Google Service Account (JSON)</span>
                  </label>
                  {settings?.has_credentials && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-100">
                      <Lock className="w-3 h-3" />
                      <span>Credencial Cifrada Activa</span>
                    </span>
                  )}
                </div>

                {/* Dropzone / Upload button */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl bg-slate-50/50 hover:bg-emerald-50/20 cursor-pointer transition-all text-xs font-bold text-slate-600">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Subir archivo .json de Google Cloud</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Textarea para pegar JSON */}
                <textarea
                  rows={4}
                  value={serviceAccountJson}
                  onChange={(e) => handleJsonTextChange(e.target.value)}
                  placeholder={
                    settings?.has_credentials
                      ? '•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••• (Credencial guardada en el backend. Pega un nuevo JSON si deseas reemplazarla).'
                      : 'Pega aquí el contenido completo del archivo JSON descargado de Google Cloud Console...'
                  }
                  className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y"
                />

                {jsonParsedInfo && (
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>JSON parseado con éxito</span>
                    </p>
                    <p className="text-[11px]">
                      <b>Client Email:</b> {jsonParsedInfo.clientEmail}
                    </p>
                    {jsonParsedInfo.projectId && (
                      <p className="text-[11px]">
                        <b>Project ID:</b> {jsonParsedInfo.projectId}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Botón Guardar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 min-h-[42px] rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Configuración'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Columna Derecha: Tarjetas Informativas y Guía */}
          <div className="space-y-6">
            {/* Tarjeta de Seguridad */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Seguridad & Cifrado AES-256
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                El JSON de la Service Account y su llave privada se almacenan con el sistema de cifrado criptográfico de Laravel (OpenSSL AES-256-CBC).
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Nunca se expone la llave privada en las respuestas API ni en React.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Tokens JWT generados nativamente en el backend sin dependencias pesadas.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Aislamiento multi-tenant estricto por cada agencia.</span>
                </li>
              </ul>
            </div>

            {/* Guía Rápida Google Cloud */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Pasos en Google Cloud Console
              </h3>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  Ingresa a{' '}
                  <a
                    href="https://console.cloud.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold underline inline-flex items-center gap-0.5"
                  >
                    Google Cloud Console <ExternalLink className="w-3 h-3" />
                  </a>.
                </li>
                <li>Crea un proyecto o selecciona uno existente.</li>
                <li>
                  En <b>APIs & Services</b> &rarr; <b>Library</b>, busca y habilita <b>Google Sheets API</b>.
                </li>
                <li>
                  En <b>IAM & Admin</b> &rarr; <b>Service Accounts</b>, crea una cuenta de servicio (ej: <code>tedelpa-sheets</code>).
                </li>
                <li>
                  Entra a la cuenta de servicio, ve a la pestaña <b>Keys</b> &rarr; <b>Add Key</b> &rarr; <b>Create new key</b> &rarr; <b>JSON</b>.
                </li>
                <li>Sube ese archivo JSON en esta pantalla y haz clic en <b>Probar Conexión</b>.</li>
              </ol>
            </div>

            {/* Estructura Oficial de las 7 Columnas */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Estructura Oficial (7 Columnas)</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Todas las hojas sincronizadas respetarán obligatoriamente este orden exacto:
              </p>
              <div className="space-y-1 text-xs font-mono bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="font-bold text-slate-800">A: Estado</span>
                  <span className="text-slate-500">Disponible / No disponible / Remate</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="font-bold text-slate-800">B: Tipo</span>
                  <span className="text-slate-500">Casa, Departamento, etc.</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="font-bold text-slate-800">C: Ciudad</span>
                  <span className="text-slate-500">Ciudad de ubicación</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="font-bold text-slate-800">D: Título</span>
                  <span className="text-slate-500">Nombre de la propiedad</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="font-bold text-slate-800">E: Descripción</span>
                  <span className="text-slate-500">Texto completo preservado</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="font-bold text-slate-800">F: Precio</span>
                  <span className="text-slate-500">Valor numérico</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="font-bold text-slate-800">G: Link</span>
                  <span className="text-slate-500">URL pública directa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGoogleSheetsPage;
