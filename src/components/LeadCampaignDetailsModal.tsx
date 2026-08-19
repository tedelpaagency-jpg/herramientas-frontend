import React from 'react';
import { Client } from '../types';
import { User, Mail, Phone, MapPin, Tag, CheckCircle2, AlertCircle, HelpCircle, X, Share2, Layers } from 'lucide-react';

interface LeadCampaignDetailsModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadCampaignDetailsModal: React.FC<LeadCampaignDetailsModalProps> = ({
  client,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !client) return null;

  const isMeta = client.source === 'meta' || !!client.meta_lead_id;
  const workspace = client.workspace;
  const customFieldValues = client.custom_field_values || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg ${
              isMeta ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              {isMeta ? <Share2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {client.name || `${client.first_name || ''} ${client.last_name || ''}`}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                  isMeta
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60'
                }`}>
                  {isMeta ? 'Origen: Meta' : 'Origen: Manual'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Prospecto ID #{client.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="space-y-2">
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-semibold">{client.email || 'Sin correo electrónico'}</span>
              </div>
              {client.phone && (
                <div className="flex items-center text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>{client.phone}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {(client.city || client.country) && (
                <div className="flex items-center text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 mr-2 text-rose-600" />
                  <span>{client.city ? `${client.city}, ` : ''}{client.country || 'Ecuador'}</span>
                </div>
              )}
              {client.company && (
                <div className="flex items-center text-slate-700 dark:text-slate-300">
                  <Tag className="w-4 h-4 mr-2 text-amber-600" />
                  <span>{client.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section: Información de Campaña */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>Información de Campaña</span>
            </h4>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Workspace:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {workspace?.name || 'Workspace Principal'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Campaña Meta:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {workspace?.meta_campaign_name || client.meta_campaign_id || 'Sin campaña'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Formulario Meta:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {workspace?.meta_form_name || client.meta_form_id || 'Sin formulario'}
                </span>
              </div>

              {client.meta_lead_id && (
                <div>
                  <span className="text-slate-400 font-medium block">ID de Lead Meta:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                    {client.meta_lead_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section: Campos de Campaña (Custom Fields) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Campos de Campaña</span>
            </h4>

            {customFieldValues.length === 0 ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-500 font-medium">
                  {isMeta
                    ? 'No se registraron campos personalizados específicos para este prospecto.'
                    : 'Este prospecto fue creado de manera manual o el Workspace no posee Custom Fields configurados.'}
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="px-4 py-3">Campo</th>
                      <th className="px-4 py-3">Valor</th>
                      <th className="px-4 py-3 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {customFieldValues.map((cf) => {
                      const isReceived = cf.status === 'received' && cf.value !== null && cf.value !== undefined;
                      const isNotReceived = cf.status === 'not_received' || (!isReceived && cf.value === null);

                      return (
                        <tr key={cf.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                            {cf.field_name || cf.field_key}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                            {isReceived && cf.value ? (
                              <span>{cf.value}</span>
                            ) : (
                              <span className="text-slate-400 italic">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isReceived ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Recibido</span>
                              </span>
                            ) : isNotReceived ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                <span>No recibido</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <HelpCircle className="w-3 h-3 text-slate-500" />
                                <span>Pendiente</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-5 border-t border-slate-200 dark:border-slate-800 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCampaignDetailsModal;
