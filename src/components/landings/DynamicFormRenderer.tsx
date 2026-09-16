import React, { useState } from 'react';
import { FormSchema, FormFieldSchema, PaymentConfig } from '../../types/landing';
import { ChevronRight, ChevronLeft, Check, Send, Loader2, CreditCard, Lock, ShieldCheck } from 'lucide-react';

interface Props {
  formSchema: FormSchema;
  onSubmit: (answers: Record<string, any>) => void;
  loading?: boolean;
  isFormLoading?: boolean;
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
  isFormLoading = false,
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
  const customStyles = formSchema?.styles || {};

  // Border Radius Mapping
  const radiusClassMap: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl',
    full: 'rounded-full',
  };
  const activeRadiusClass = customStyles.border_radius
    ? (radiusClassMap[customStyles.border_radius] || 'rounded-xl')
    : 'rounded-xl';

  // Base container class calculation
  let containerClasses = className;
  if (!containerClasses) {
    if (customStyles.card_style === 'minimal') {
      containerClasses = isDark ? 'space-y-6 text-slate-100' : 'space-y-5 text-slate-900';
    } else if (customStyles.card_style === 'glass') {
      containerClasses = `space-y-6 p-6 sm:p-8 shadow-2xl backdrop-blur-md ${activeRadiusClass} ${
        isDark ? 'bg-slate-900/70 text-slate-100 border border-white/10' : 'bg-white/80 text-slate-900 border border-white/20'
      }`;
    } else if (customStyles.card_style === 'bordered') {
      containerClasses = `space-y-6 p-6 sm:p-8 ${activeRadiusClass} ${
        isDark ? 'bg-slate-950/60 text-slate-100 border border-slate-800' : 'bg-slate-50/60 text-slate-900 border border-slate-300'
      }`;
    } else {
      // Default Card
      containerClasses = `space-y-6 p-6 sm:p-8 shadow-xl ${activeRadiusClass} ${
        isDark ? 'bg-slate-900 text-slate-100 border border-slate-800' : 'bg-white text-slate-900 border border-slate-200'
      }`;
    }
  }

  // Inline CSS Overrides
  const containerStyle: React.CSSProperties = {
    ...(customStyles.bg_color ? { backgroundColor: customStyles.bg_color } : {}),
    ...(customStyles.text_color ? { color: customStyles.text_color } : {}),
    ...(customStyles.border_radius === 'none' ? { borderRadius: '0px' } : {}),
  };

  const titleStyle: React.CSSProperties = customStyles.text_color ? { color: customStyles.text_color } : {};
  const subtitleStyle: React.CSSProperties = customStyles.text_color ? { color: customStyles.text_color, opacity: 0.8 } : {};
  const labelStyle: React.CSSProperties = customStyles.text_color ? { color: customStyles.text_color } : {};

  const titleClasses = isDark ? 'text-xl font-bold text-white' : 'text-xl font-extrabold text-slate-900';
  const subtitleClasses = isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500';
  const labelClasses = isDark ? 'block text-xs font-medium text-slate-300' : 'block text-xs font-semibold text-slate-700';

  const inputClasses = `w-full p-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${activeRadiusClass} ${
    isDark
      ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
      : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600'
  }`;

  const inputInlineStyle: React.CSSProperties = {
    ...(customStyles.input_bg_color ? { backgroundColor: customStyles.input_bg_color } : {}),
    ...(customStyles.input_text_color ? { color: customStyles.input_text_color } : {}),
    ...(customStyles.input_border_color ? { borderColor: customStyles.input_border_color } : {}),
    ...(customStyles.border_radius === 'none' ? { borderRadius: '0px' } : {}),
  };

  const buttonInlineStyle: React.CSSProperties = {
    ...(customStyles.button_bg_color ? { background: customStyles.button_bg_color, backgroundColor: customStyles.button_bg_color } : {}),
    ...(customStyles.button_text_color ? { color: customStyles.button_text_color } : {}),
    ...(customStyles.border_radius === 'none' ? { borderRadius: '0px' } : {}),
  };

  if (isFormLoading) {
    const isDarkVariant = variant === 'dark';
    const bgCol = customStyles.bg_color || (isDarkVariant ? '#0f172a' : '#ffffff');
    const cardBorder = isDarkVariant ? '1px solid #1e293b' : '1px solid #e2e8f0';
    const boxBg = isDarkVariant ? '#1e293b' : '#e2e8f0';
    const inputBg = customStyles.input_bg_color || (isDarkVariant ? '#020617' : '#f8fafc');
    const inputBorder = customStyles.input_border_color ? `1px solid ${customStyles.input_border_color}` : (isDarkVariant ? '1px solid #1e293b' : '1px solid #cbd5e1');

    return (
      <div
        className={`space-y-4 p-5 sm:p-6 animate-pulse ${activeRadiusClass} ${className || ''}`}
        style={{
          backgroundColor: bgCol,
          border: cardBorder,
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* Header / Title skeleton */}
        <div className="space-y-2 text-center py-1">
          <div
            style={{
              height: '22px',
              width: '60%',
              margin: '0 auto',
              backgroundColor: boxBg,
              borderRadius: '8px',
            }}
          />
          <div
            style={{
              height: '14px',
              width: '40%',
              margin: '6px auto 0 auto',
              backgroundColor: boxBg,
              borderRadius: '6px',
              opacity: 0.7,
            }}
          />
        </div>

        {/* Input fields skeleton */}
        <div className="space-y-4 pt-2">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="space-y-2">
              <div
                style={{
                  height: '14px',
                  width: '30%',
                  backgroundColor: boxBg,
                  borderRadius: '4px',
                }}
              />
              <div
                style={{
                  height: '44px',
                  width: '100%',
                  backgroundColor: inputBg,
                  border: inputBorder,
                  borderRadius: '12px',
                }}
              />
            </div>
          ))}
        </div>

        {/* Submit button skeleton */}
        <div className="pt-3">
          <div
            style={{
              height: '48px',
              width: '100%',
              backgroundColor: customStyles.button_bg_color || (isDarkVariant ? '#4f46e5' : '#6366f1'),
              borderRadius: '12px',
              opacity: 0.8,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${containerClasses} flex flex-col w-full`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        ...containerStyle,
      }}
    >
      {/* Title / Subtitle */}
      {(formSchema?.title || formSchema?.subtitle) && (
        <div className="text-center space-y-1 w-full" style={{ width: '100%', textAlign: 'center' }}>
          {formSchema.title && <h3 className={titleClasses} style={titleStyle}>{formSchema.title}</h3>}
          {formSchema.subtitle && <p className={subtitleClasses} style={subtitleStyle}>{formSchema.subtitle}</p>}
        </div>
      )}

      {/* Multi-step progress bar */}
      {layout === 'multi_step' && steps.length > 0 && (
        <div className="space-y-2 w-full" style={{ width: '100%' }}>
          <div className={`flex justify-between items-center text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={subtitleStyle}>
            <span>Paso {currentStepIndex + 1} de {steps.length}: {steps[currentStepIndex]?.title}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold" style={titleStyle}>{progressPercent}%</span>
          </div>
          <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 ease-out"
              style={{
                width: `${progressPercent}%`,
                ...(customStyles.button_bg_color ? { background: customStyles.button_bg_color } : {}),
              }}
            />
          </div>
        </div>
      )}

      {/* Field Rendering */}
      <div className="flex flex-col space-y-4 w-full" style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem' }}>
        {currentStepFields.map((field) => (
          <div
            key={field.id}
            className="flex flex-col space-y-1.5 text-left w-full"
            style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box', textAlign: 'left' }}
          >
            <label
              className={`${labelClasses} block w-full text-left mb-1`}
              style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...labelStyle }}
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={field.placeholder || ''}
                rows={3}
                className={`${inputClasses} block w-full`}
                style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...inputInlineStyle }}
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className={`${inputClasses} block w-full`}
                style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...inputInlineStyle }}
              >
                <option value="" style={{ backgroundColor: customStyles.input_bg_color, color: customStyles.input_text_color }}>-- Seleccionar --</option>
                {field.options?.map((opt, i) => (
                  <option key={i} value={opt.value} style={{ backgroundColor: customStyles.input_bg_color, color: customStyles.input_text_color }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label
                className={`flex items-center gap-2.5 cursor-pointer text-xs ${isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}`}
                style={{ display: 'flex', alignItems: 'center', width: '100%', ...labelStyle }}
              >
                <input
                  type="checkbox"
                  checked={!!formData[field.name]}
                  onChange={(e) => handleInputChange(field, e.target.checked)}
                  className="rounded border-slate-300 bg-white text-indigo-600 w-4 h-4 focus:ring-indigo-500"
                  style={{ display: 'inline-block', width: '16px', height: '16px', margin: '0' }}
                />
                <span>{field.placeholder || 'Acepto las condiciones'}</span>
              </label>
            ) : field.type === 'file' ? (
              <div className="flex flex-col space-y-1 w-full" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <input
                  type="file"
                  onChange={(e) => handleInputChange(field, e.target.files?.[0] || null)}
                  className={`w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer ${inputClasses}`}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...inputInlineStyle }}
                />
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`} style={subtitleStyle}>Archivos permitidos: imágenes, PDF, comprobantes de pago (Máx. 5MB)</p>
              </div>
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={field.placeholder || ''}
                className={`${inputClasses} block w-full`}
                style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...inputInlineStyle }}
              />
            )}

            {errors[field.name] && (
              <p className="text-[11px] text-red-500 font-semibold" style={{ display: 'block', width: '100%', marginTop: '4px' }}>
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Stripe Payment Card Input Box if enabled */}
      {paymentConfig?.enabled && isLastStep && (
        <div
          className={`p-4 ${activeRadiusClass} border text-xs flex flex-col space-y-4 w-full ${
            isDark
              ? 'bg-slate-950/90 border-emerald-500/40 text-slate-200'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          }`}
          style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box', gap: '1rem' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5 w-full"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
          >
            <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span className="font-bold text-xs">Datos de Tarjeta de Crédito / Débito (Stripe)</span>
            </div>
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Lock className="w-3 h-3 text-emerald-500" /> SSL 256-Bit
            </span>
          </div>

          {/* Product & Price Summary */}
          <div
            className="flex items-center justify-between text-xs p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-500/30 w-full shadow-xs"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}
          >
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {paymentConfig.product_name || 'Servicio / Registro'}
            </span>
            <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
              ${paymentConfig.amount || 0} {paymentConfig.currency || 'USD'}
            </span>
          </div>

          {/* Interactive Card Inputs */}
          <div
            className="flex flex-col space-y-3 w-full"
            style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.75rem' }}
          >
            {/* Nombre del Titular */}
            <div
              className="flex flex-col space-y-1 text-left w-full"
              style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}
            >
              <label
                className={`${labelClasses} block w-full text-left mb-1`}
                style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...labelStyle }}
              >
                Nombre en la Tarjeta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="EJ. JUAN PEREZ"
                value={formData['card_holder_name'] || ''}
                onChange={(e) => handleInputChange({ id: 'card_holder_name', name: 'card_holder_name', label: 'Nombre en la Tarjeta', type: 'text' }, e.target.value.toUpperCase())}
                className={`${inputClasses} block w-full`}
                style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...inputInlineStyle }}
              />
              {errors['card_holder_name'] && <p className="text-[11px] text-red-500 font-semibold">{errors['card_holder_name']}</p>}
            </div>

            {/* Número de Tarjeta */}
            <div
              className="flex flex-col space-y-1 text-left w-full"
              style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}
            >
              <label
                className={`${labelClasses} block w-full text-left mb-1`}
                style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...labelStyle }}
              >
                Número de Tarjeta <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full" style={{ position: 'relative', width: '100%' }}>
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
                  className={`${inputClasses} font-mono tracking-wider block w-full`}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...inputInlineStyle }}
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" style={{ position: 'absolute', right: '12px', top: '14px' }} />
              </div>
              {errors['card_number'] && <p className="text-[11px] text-red-500 font-semibold">{errors['card_number']}</p>}
            </div>

            {/* Expiración y CVC Grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', width: '100%', gap: '0.75rem' }}
            >
              {/* Expiración */}
              <div
                className="flex flex-col space-y-1 text-left w-full"
                style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}
              >
                <label
                  className={`${labelClasses} block w-full text-left mb-1`}
                  style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...labelStyle }}
                >
                  Vencimiento (MM/AA) <span className="text-red-500">*</span>
                </label>
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
                  className={`${inputClasses} font-mono block w-full`}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...inputInlineStyle }}
                />
                {errors['card_expiry'] && <p className="text-[11px] text-red-500 font-semibold">{errors['card_expiry']}</p>}
              </div>

              {/* CVC / CVV */}
              <div
                className="flex flex-col space-y-1 text-left w-full"
                style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}
              >
                <label
                  className={`${labelClasses} block w-full text-left mb-1`}
                  style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...labelStyle }}
                >
                  CVC / CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="123"
                  value={formData['card_cvc'] || ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                    handleInputChange({ id: 'card_cvc', name: 'card_cvc', label: 'CVC / CVV', type: 'text' }, raw);
                  }}
                  className={`${inputClasses} font-mono block w-full`}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...inputInlineStyle }}
                />
                {errors['card_cvc'] && <p className="text-[11px] text-red-500 font-semibold">{errors['card_cvc']}</p>}
              </div>
            </div>
          </div>

          {/* Security badge footer */}
          <div
            className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] text-slate-500 dark:text-slate-400 border-t border-emerald-500/20 mt-1"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '0.5rem' }}
          >
            <span className="flex items-center gap-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Transacción directa verificada por Stripe
            </span>
            <span>Visa · Mastercard · Amex · Discover</span>
          </div>
        </div>
      )}

      {/* Navigation & Action Buttons */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 w-full"
        style={{ display: 'flex', width: '100%', boxSizing: 'border-box', marginTop: '0.5rem' }}
      >
        {layout === 'multi_step' && currentStepIndex > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
            className={`inline-flex items-center justify-center gap-1 text-xs px-4 py-2.5 ${activeRadiusClass} font-medium transition ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
        ) : null}

        {isLastStep ? (
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-white text-sm px-6 py-3.5 ${activeRadiusClass} font-bold shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 cursor-pointer ${
              paymentConfig?.enabled
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
            }`}
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              textAlign: 'center',
              ...buttonInlineStyle,
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : paymentConfig?.enabled ? (
              <>
                <CreditCard className="w-4 h-4 text-white shrink-0" />
                <span>{submitText || `Pagar $${paymentConfig.amount || 0} ${paymentConfig.currency || 'USD'}`}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 shrink-0" />
                <span>{submitText || formSchema?.submit_button_text || 'Enviar Registro'}</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-3 ${activeRadiusClass} font-semibold transition shadow-md cursor-pointer`}
            style={{ ...buttonInlineStyle }}
          >
            <span>Siguiente</span> <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default DynamicFormRenderer;
