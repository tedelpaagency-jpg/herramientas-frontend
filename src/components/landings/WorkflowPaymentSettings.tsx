import React from 'react';
import { PaymentConfig, LandingAvailableResources } from '../../types/landing';
import { CreditCard, Zap, DollarSign, Package } from 'lucide-react';

interface Props {
  workflowId?: number | null;
  onWorkflowChange: (id: number | null) => void;
  paymentConfig?: PaymentConfig | null;
  onPaymentConfigChange: (config: PaymentConfig) => void;
  resources?: LandingAvailableResources;
}

export const WorkflowPaymentSettings: React.FC<Props> = ({
  workflowId,
  onWorkflowChange,
  paymentConfig = { enabled: false, currency: 'USD', amount: 0, product_name: '' },
  onPaymentConfigChange,
  resources,
}) => {
  const config = paymentConfig || { enabled: false, currency: 'USD', amount: 0, product_name: '' };

  const updateConfig = (updates: Partial<PaymentConfig>) => {
    onPaymentConfigChange({
      ...config,
      ...updates,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 text-slate-100">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" /> Automatizaciones & Pagos Stripe
        </h3>
        <p className="text-xs text-slate-400">
          Vincular a Workflows automáticos de CRM y cobros mediante pasarela Stripe Checkout
        </p>
      </div>

      {/* Workflow Selector */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs">
        <label className="font-semibold text-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" /> Workflow CRM Automático
        </label>
        <p className="text-[11px] text-slate-400">
          Disparar un flujo de automatización cuando el lead o registro sea completado exitosamente.
        </p>
        <select
          value={workflowId || ''}
          onChange={(e) => onWorkflowChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
        >
          <option value="">-- Sin automatización de workflow --</option>
          {resources?.workflows.map((wf) => (
            <option key={wf.id} value={wf.id}>
              {wf.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stripe Payment Configuration */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">Integración con Pasarela de Pago Stripe</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-emerald-400">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => updateConfig({ enabled: e.target.checked })}
              className="rounded border-slate-700 bg-slate-900 text-emerald-500 w-4 h-4"
            />
            Habilitar Pago en Landing
          </label>
        </div>

        {config.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                <Package className="w-3.5 h-3.5" /> Nombre del Producto / Servicio
              </label>
              <input
                type="text"
                value={config.product_name || ''}
                onChange={(e) => updateConfig({ product_name: e.target.value })}
                placeholder="Ej. Plan Suscripción Pro"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Monto (Precio)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={config.amount || 0}
                onChange={(e) => updateConfig({ amount: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Moneda</label>
              <select
                value={config.currency || 'USD'}
                onChange={(e) => updateConfig({ currency: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="MXN">MXN ($)</option>
                <option value="PEN">PEN (S/)</option>
                <option value="COP">COP ($)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowPaymentSettings;
