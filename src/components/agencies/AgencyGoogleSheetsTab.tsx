'use client';

import React, { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Play,
  Save,
  Layers,
  Clock,
  ShieldAlert,
  Info,
  Calendar,
  Building2,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import googleSheetsService, {
  AgencyGoogleSheetsConfigData,
  GoogleSheetsSyncLogItem,
  AgencyGoogleSheetsResponse,
} from '../../services/googleSheetsService';

interface AgencyGoogleSheetsTabProps {
  agencyId: number;
  agencyName?: string;
}

export const AgencyGoogleSheetsTab: React.FC<AgencyGoogleSheetsTabProps> = ({ agencyId, agencyName }) => {
  const [data, setData] = useState<AgencyGoogleSheetsResponse | null>(null);
  const [logs, setLogs] = useState<GoogleSheetsSyncLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form states
  const [isEnabled, setIsEnabled] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetName, setSheetName] = useState('Propiedades');
  const [extractedSpreadsheetId, setExtractedSpreadsheetId] = useState<string | null>(null);

  // Helper para extraer ID de hoja de Google
  const extractId = (url: string): string | null => {
    if (!url) return null;
    if (/^[a-zA-Z0-9-_]{30,60}$/.test(url.trim())) return url.trim();
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const handleUrlChange = (value: string) => {
    setSheetUrl(value);
    setExtractedSpreadsheetId(extractId(value));
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resData, logsData] = await Promise.all([
        googleSheetsService.getAgencyConfig(agencyId),
        googleSheetsService.getAgencyLogs(agencyId),
      ]);
      setData(resData);
      setLogs(logsData);
      setIsEnabled(resData.config.is_enabled);
      setSheetUrl(resData.config.sheet_url || '');
      setSheetName(resData.config.sheet_name || 'Propiedades');
      setExtractedSpreadsheetId(resData.config.spreadsheet_id || extractId(resData.config.sheet_url || ''));
    } catch (err: any) {
      console.error('Error fetching agency Google Sheets data:', err);
      toast.error(err?.response?.data?.message || 'Error al cargar la configuración de Google Sheets de la agencia');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [agencyId]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success('¡Correo de la Service Account copiado al portapapeles!');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Guardar configuración de la agencia
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Guardando configuración...');

    try {
      await googleSheetsService.updateAgencyConfig(agencyId, {
        is_enabled: isEnabled,
        sheet_url: sheetUrl.trim() || undefined,
        sheet_name: sheetName.trim() || 'Propiedades',
      });
      toast.success('Configuración guardada exitosamente.', { id: toastId });
      await fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar la configuración', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // Validar documento y permisos con Google API
  const handleValidate = async () => {
    if (!sheetUrl.trim()) {
      toast.error('Primero ingresa la URL del documento de Google Sheets.');
      return;
    }

    setIsValidating(true);
    const toastId = toast.loading('Validando permisos y acceso en Google Sheets...');

    try {
      // Guardar primero para asegurar que el ID esté en la base de datos
      await googleSheetsService.updateAgencyConfig(agencyId, {
        is_enabled: isEnabled,
        sheet_url: sheetUrl.trim(),
        sheet_name: sheetName.trim() || 'Propiedades',
      });

      const res = await googleSheetsService.validateAgencyDocument(agencyId);
      toast.success(res.message || '¡Documento validado exitosamente!', { id: toastId });
      await fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al validar el documento', { id: toastId });
      await fetchData();
    } finally {
      setIsValidating(false);
    }
  };

  // Sincronizar todas las propiedades manualmente
  const handleSyncAll = async () => {
    if (!confirm('¿Deseas sincronizar todas las propiedades activas de esta agencia con el documento de Google Sheets ahora?')) {
      return;
    }

    setIsSyncingAll(true);
    const toastId = toast.loading('Sincronizando catálogo completo con Google Sheets...');

    try {
      const res = await googleSheetsService.syncAllAgencyEstates(agencyId);
      toast.success(res.message || '¡Sincronización completada exitosamente!', { id: toastId });
      await fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al sincronizar propiedades', { id: toastId });
    } finally {
      setIsSyncingAll(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
        <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">Cargando integración de Google Sheets...</p>
      </div>
    );
  }

  const globalConfigured = data?.global.has_credentials && data?.global.is_enabled;
  const serviceAccountEmail = data?.global.service_account_email || '';
  const config = data?.config;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Alerta de Configuración Global */}
      {!globalConfigured && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-black text-amber-900">Credenciales Globales de Google API Pendientes</p>
            <p className="text-amber-800 leading-relaxed font-medium">
              El Super Administrador debe habilitar la integración y cargar las credenciales globales de Google Service Account en el panel principal para que la sincronización automática pueda operar.
            </p>
          </div>
        </div>
      )}

      {/* Banner Principal de Instrucción: Compartir Documento */}
      {serviceAccountEmail && (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 border border-emerald-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Paso Obligatorio: Comparte tu Documento con la Cuenta de Servicio
              </h3>
              <p className="text-xs text-slate-500">
                Para que el sistema pueda insertar, actualizar y borrar filas en tu Google Sheets, dale permisos de <b>Editor</b> a este correo:
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <div className="w-full flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 text-xs font-mono font-bold text-slate-800 select-all truncate shadow-2xs">
              {serviceAccountEmail}
            </div>
            <button
              type="button"
              onClick={() => handleCopyEmail(serviceAccountEmail)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer border-none shrink-0"
            >
              {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedEmail ? '¡Copiado!' : 'Copiar Correo'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Formulario de Configuración de la Hoja */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-0.5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Documento de Google Sheets Asignado</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Cada agencia cuenta con su propio documento independiente y privado.
            </p>
          </div>

          {/* Toggle Activar/Desactivar Sincronización */}
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            <span className="ml-2.5 text-xs font-bold text-slate-700">
              {isEnabled ? 'Sincronización Activa' : 'Sincronización Pausada'}
            </span>
          </label>
        </div>

        {/* Status de Conexión & Métricas */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            config?.connection_status === 'valid'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : config?.connection_status === 'error'
              ? 'bg-rose-50/70 border-rose-200 text-rose-900'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-start gap-3">
            {config?.connection_status === 'valid' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : config?.connection_status === 'error' ? (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="text-xs font-black m-0">
                Estado:{' '}
                {config?.connection_status === 'valid'
                  ? 'Documento Verificado y Listo'
                  : config?.connection_status === 'error'
                  ? 'Error al Conectar con el Documento'
                  : 'Pendiente de Validación'}
              </p>
              {config?.last_error && (
                <p className="text-[11px] font-medium text-rose-700">{config.last_error}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-[11px] opacity-80 pt-0.5">
                {config?.last_synced_at && (
                  <span>
                    Última sincronización: {new Date(config.last_synced_at).toLocaleString('es-EC')}
                  </span>
                )}
                {data?.stats && (
                  <span>
                    Propiedades: <b>{data.stats.synced_estates}</b> sincronizadas de <b>{data.stats.total_estates}</b>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleValidate}
              disabled={isValidating || !sheetUrl.trim()}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-800 font-extrabold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
              <span>{isValidating ? 'Validando...' : 'Validar Documento'}</span>
            </button>
          </div>
        </div>

        {/* Inputs de URL y Nombre de Hoja */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>URL o Enlace de Google Sheets</span>
              {extractedSpreadsheetId && (
                <a
                  href={`https://docs.google.com/spreadsheets/d/${extractedSpreadsheetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Abrir en Google Sheets</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </label>
            <input
              type="text"
              value={sheetUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
            />
            {extractedSpreadsheetId && (
              <p className="text-[11px] text-slate-400 font-mono">
                ID detectado: <b className="text-slate-600">{extractedSpreadsheetId}</b>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Nombre de la Pestaña / Hoja</label>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="Propiedades"
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <p className="text-[11px] text-slate-400">Por defecto: <b>Propiedades</b></p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncAll}
              disabled={isSyncingAll || !extractedSpreadsheetId || config?.connection_status !== 'valid'}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? 'Sincronizando Todo...' : 'Sincronizar Todas las Propiedades'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>

      {/* Historial de Logs Recientes */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Historial de Operaciones Recientes</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-bold">Últimos {logs.length} registros</span>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Aún no hay registros de sincronización para esta agencia.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Fecha y Hora</th>
                  <th className="py-2.5 px-3">Operación</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Propiedad</th>
                  <th className="py-2.5 px-3">Mensaje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString('es-EC')}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-slate-100 text-slate-700 capitalize">
                        {log.operation.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                          log.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700'
                            : log.status === 'error'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {log.status === 'success' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span className="capitalize">{log.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-bold truncate max-w-[180px]">
                      {log.estate ? (
                        <span>#{log.estate.id} {log.estate.title}</span>
                      ) : (
                        <span className="text-slate-400 font-normal">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={log.message}>
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyGoogleSheetsTab;

