import React, { useState } from 'react';
import { FormSchema, FormFieldSchema, PaymentConfig } from '../../types/landing';
import { ChevronRight, ChevronLeft, Check, Send, Loader2, CreditCard, Lock, ShieldCheck } from 'lucide-react';

interface Props {
  formSchema: FormSchema;
  onSubmit: (answers: Record<string, any>) => void;
  loading?: boolean;
  submitText?: string;
  variant?: 'light' | 'dark' | 'standalone' | 'custom';
  className?: string;
  paymentConfig?: PaymentConfig | null;
  stripePublishableKey?: string | null;
}

export const DynamicFormRenderer: React.FC<Props> = ({
  formSchema,
  onSubmit,
  loading = false,
  submitText,
  variant = 'standalone',
  className,
  paymentConfig,
  stripePublishableKey,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields = formSchema?.fields || [];
  const steps = formSchema?.steps || [];
  const layout = formSchema?.layout || 'linear';

  const handleInputChange = (field: FormFieldSchema, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field.name]: value,
    }));
    if (errors[field.name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field.name];
        return updated;
      });
    }
  };

  // Group fields per step if multi_step
  const currentStepFields = layout === 'multi_step' && steps.length > 0
    ? fields.filter((f) => (f.step_index ?? 0) === currentStepIndex)
    : fields;

  const isLastStep = layout !== 'multi_step' || steps.length === 0 || currentStepIndex === steps.length - 1;

  const validateCurrentFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    currentStepFields.forEach((field) => {
      if (field.required) {
        const val = formData[field.name];
        if (!val || (typeof val === 'string' && val.trim() === '')) {
          newErrors[field.name] = `${field.label} es obligatorio`;
        }
      }
    });

    if (paymentConfig?.enabled && isLastStep) {
      if (!formData['card_holder_name'] || !formData['card_holder_name'].trim()) {
        newErrors['card_holder_name'] = 'Nombre en la tarjeta es obligatorio';
      }
      if (!formData['card_number'] || formData['card_number'].replace(/\s/g, '').length < 15) {
        newErrors['card_number'] = 'Número de tarjeta obligatorio (mín. 15-16 dígitos)';
      }
      if (!formData['card_expiry'] || !/^\d{2}\/\d{2}$/.test(formData['card_expiry'])) {
        newErrors['card_expiry'] = 'Fecha de expiración requerida (MM/AA)';
      }
      if (!formData['card_cvc'] || formData['card_cvc'].length < 3) {
        newErrors['card_cvc'] = 'Código CVC / CVV obligatorio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentFields()) return;
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentFields()) return;
    onSubmit(formData);
  };

  const progressPercent = steps.length > 0 ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 100;

  const isDark = variant === 'dark';

  const containerClasses = className
    ? className
    : (isDark
        ? 'space-y-6 text-slate-100'
        : 'space-y-5 text-slate-900');

  const titleClasses = isDark ? 'text-xl font-bold text-white' : 'text-xl font-extrabold text-slate-900';
  const subtitleClasses = isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500';
  const labelClasses = isDark ? 'block text-xs font-medium text-slate-300' : 'block text-xs font-semibold text-slate-700';

  const inputClasses = isDark
    ? 'w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition'
    : 'w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition';

  return (
    <form onSubmit={handleSubmit} className={containerClasses}>
      {/* Title / Subtitle */}
      {(formSchema?.title || formSchema?.subtitle) && (
        <div className="text-center space-y-1">
          {formSchema.title && <h3 className={titleClasses}>{formSchema.title}</h3>}
          {formSchema.subtitle && <p className={subtitleClasses}>{formSchema.subtitle}</p>}
        </div>
      )}

      {/* Multi-step progress bar */}
      {layout === 'multi_step' && steps.length > 0 && (
        <div className="space-y-2">
          <div className={`flex justify-between items-center text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span>Paso {currentStepIndex + 1} de {steps.length}: {steps[currentStepIndex]?.title}</span>
            <span className="text-indigo-600 font-bold">{progressPercent}%</span>
          </div>
          <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Field Rendering */}
      <div className="space-y-4">
        {currentStepFields.map((field) => (
          <div key={field.id} className="space-y-1.5 text-left">
            <label className={labelClasses}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={field.placeholder || ''}
                rows={3}
                className={inputClasses}
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className={inputClasses}
              >
                <option value="">-- Seleccionar --</option>
                {field.options?.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label className={`flex items-center gap-2.5 cursor-pointer text-xs ${isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
                <input
                  type="checkbox"
                  checked={!!formData[field.name]}
                  onChange={(e) => handleInputChange(field, e.target.checked)}
                  className="rounded border-slate-300 bg-white text-indigo-600 w-4 h-4 focus:ring-indigo-500"
                />
                {field.placeholder || 'Acepto las condiciones'}
              </label>
            ) : field.type === 'file' ? (
              <div className="space-y-1">
                <input
                  type="file"
                  onChange={(e) => handleInputChange(field, e.target.files?.[0] || null)}
                  className={`w-full rounded-xl p-2 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer ${inputClasses}`}
                />
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Archivos permitidos: imágenes, PDF, comprobantes de pago (Máx. 5MB)</p>
              </div>
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={field.placeholder || ''}
                className={inputClasses}
              />
            )}

            {errors[field.name] && (
              <p className="text-[11px] text-red-500 font-semibold">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Stripe Payment Card Input Box if enabled */}
      {paymentConfig?.enabled && isLastStep && (
        <div className={`p-4 rounded-2xl border text-xs space-y-4 ${
          isDark
            ? 'bg-slate-950/90 border-emerald-500/40 text-slate-200'
            : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4.5 h-4.5 text-emerald-500" />
              <span className="font-bold">Datos de Tarjeta de Crédito / Débito (Stripe)</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-500" /> SSL 256-Bit
            </span>
          </div>

          {/* Product & Price Summary */}
          <div className="flex items-center justify-between text-xs p-2.5 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-emerald-500/20">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {paymentConfig.product_name || 'Servicio / Registro'}
            </span>
            <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
              ${paymentConfig.amount || 0} {paymentConfig.currency || 'USD'}
            </span>
          </div>

          {/* Interactive Card Inputs */}
          <div className="space-y-3">
            {/* Nombre del Titular */}
            <div className="space-y-1 text-left">
              <label className={labelClasses}>Nombre en la Tarjeta <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="EJ. JUAN PEREZ"
                value={formData['card_holder_name'] || ''}
                onChange={(e) => handleInputChange({ id: 'card_holder_name', name: 'card_holder_name', label: 'Nombre en la Tarjeta', type: 'text' }, e.target.value.toUpperCase())}
                className={inputClasses}
              />
              {errors['card_holder_name'] && <p className="text-[11px] text-red-500 font-semibold">{errors['card_holder_name']}</p>}
            </div>

            {/* Número de Tarjeta */}
            <div className="space-y-1 text-left">
              <label className={labelClasses}>Número de Tarjeta <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  value={formData['card_number'] || ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                    handleInputChange({ id: 'card_number', name: 'card_number', label: 'Número de Tarjeta', type: 'text' }, formatted);
                  }}
                  className={`${inputClasses} font-mono tracking-wider`}
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
              {errors['card_number'] && <p className="text-[11px] text-red-500 font-semibold">{errors['card_number']}</p>}
            </div>

            {/* Expiración y CVC Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Expiración */}
              <div className="space-y-1 text-left">
                <label className={labelClasses}>Vencimiento (MM/AA) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="MM/AA"
                  value={formData['card_expiry'] || ''}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 3) {
                      val = val.slice(0, 2) + '/' + val.slice(2, 4);
                    }
                    handleInputChange({ id: 'card_expiry', name: 'card_expiry', label: 'Fecha de Vencimiento', type: 'text' }, val);
                  }}
                  className={`${inputClasses} font-mono`}
                />
                {errors['card_expiry'] && <p className="text-[11px] text-red-500 font-semibold">{errors['card_expiry']}</p>}
              </div>

              {/* CVC / CVV */}
              <div className="space-y-1 text-left">
                <label className={labelClasses}>CVC / CVV <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="123"
                  value={formData['card_cvc'] || ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                    handleInputChange({ id: 'card_cvc', name: 'card_cvc', label: 'CVC / CVV', type: 'text' }, raw);
                  }}
                  className={`${inputClasses} font-mono`}
                />
                {errors['card_cvc'] && <p className="text-[11px] text-red-500 font-semibold">{errors['card_cvc']}</p>}
              </div>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Transacción directa verificada por Stripe
            </span>
            <span>Visa · Mastercard · Amex · Discover</span>
          </div>
        </div>
      )}

      {/* Navigation & Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {layout === 'multi_step' && currentStepIndex > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
            className={`inline-flex items-center gap-1 text-xs px-4 py-2 rounded-xl font-medium transition ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
        ) : <div />}

        {isLastStep ? (
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center gap-2 text-white text-xs px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-emerald-500/20 transition disabled:opacity-50 ${
              paymentConfig?.enabled
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : paymentConfig?.enabled ? (
              <>
                <CreditCard className="w-4 h-4 text-white" />
                {submitText || `Pagar $${paymentConfig.amount || 0} ${paymentConfig.currency || 'USD'}`}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {submitText || formSchema?.submit_button_text || 'Enviar Registro'}
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-2.5 rounded-xl font-semibold transition shadow-md"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default DynamicFormRenderer;
