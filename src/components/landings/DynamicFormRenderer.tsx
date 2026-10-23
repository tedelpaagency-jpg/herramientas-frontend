import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FormSchema, FormFieldSchema, PaymentConfig, StripeAppearanceConfig, FormStyleConfig } from '../../types/landing';
import { isColorDark, defaultStripeAppearance } from '../../utils/stripeAppearance';
import { ChevronRight, ChevronLeft, Check, Send, Loader2, CreditCard, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import StripePaymentSection, { StripePaymentRef } from './StripePaymentSection';
import landingService from '../../services/landingService';

export const isValidStripePublishableKey = (key?: string | null): boolean => {
  if (!key || typeof key !== 'string') return false;
  const clean = key.trim();
  return clean.startsWith('pk_test_') || clean.startsWith('pk_live_');
};

interface Props {
  landingId?: string | number | null;
  isPreview?: boolean;
  formSchema: FormSchema;
  onSubmit: (answers: Record<string, any>) => void;
  loading?: boolean;
  isFormLoading?: boolean;
  submitText?: string;
  variant?: 'light' | 'dark' | 'standalone' | 'custom';
  className?: string;
  paymentConfig?: PaymentConfig | null;
  stripePublishableKey?: string | null;
  termsAndConditions?: string | null;
  privacyPolicy?: string | null;
  stripeAppearance?: StripeAppearanceConfig | null;
  targetWindow?: Window | null;
}

export const DynamicFormRenderer: React.FC<Props> = ({
  landingId,
  isPreview = false,
  formSchema,
  onSubmit,
  loading = false,
  isFormLoading = false,
  submitText,
  variant = 'standalone',
  className,
  paymentConfig,
  stripePublishableKey,
  termsAndConditions,
  privacyPolicy,
  stripeAppearance,
  targetWindow,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  // Stripe Payment State
  const [resolvedPublishableKey, setResolvedPublishableKey] = useState<string | null>(stripePublishableKey || null);

  useEffect(() => {
    if (stripePublishableKey) {
      setResolvedPublishableKey(stripePublishableKey);
    }
  }, [stripePublishableKey]);

  const activePublishableKey = resolvedPublishableKey || stripePublishableKey || null;
  const hasValidStripeKey = Boolean(activePublishableKey && isValidStripePublishableKey(activePublishableKey));
  const [stripeElementError, setStripeElementError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false);
  const stripeRef = useRef<StripePaymentRef>(null);
  const isFetchingIntentRef = useRef(false);

  // Initialize PaymentIntent from backend (guaranteed single execution)
  useEffect(() => {
    if (!paymentConfig?.enabled || !landingId || isPreview) return;
    if (clientSecret) return; // Ya existe un PaymentIntent cargado
    if (isFetchingIntentRef.current) return; // Ya hay una petición en curso

    isFetchingIntentRef.current = true;
    let isMounted = true;
    const fetchIntent = async () => {
      try {
        setIsLoadingPaymentIntent(true);
        const res = await landingService.createPaymentIntent(landingId, {
          name: formData['name'] || formData['first_name'] || '',
          email: formData['email'] || '',
          amount: paymentConfig.amount,
        });
        if (isMounted && res?.client_secret) {
          setClientSecret(res.client_secret);
          if (res.publishable_key) {
            setResolvedPublishableKey(res.publishable_key);
          }
        }
      } catch (err: any) {
        console.error('Error fetching Stripe PaymentIntent:', err);
        if (isMounted) {
          setStripeElementError(
            err?.response?.data?.message || 'No fue posible conectar con la pasarela de pagos segura.'
          );
        }
      } finally {
        isFetchingIntentRef.current = false;
        if (isMounted) {
          setIsLoadingPaymentIntent(false);
        }
      }
    };

    fetchIntent();

    return () => {
      isMounted = false;
      isFetchingIntentRef.current = false;
    };
  }, [paymentConfig?.enabled, landingId, isPreview, paymentConfig?.amount, clientSecret]);

  const getFormattedTermsHtml = (raw: string | null | undefined): string => {
    if (!raw || !raw.trim()) return '';
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(raw);
    if (hasHtmlTags) {
      return raw;
    }
    return raw
      .split(/\n{2,}/)
      .map((p) => `<p style="margin-bottom:0.75rem;">${p.replace(/\n/g, '<br />')}</p>`)
      .join('');
  };

  const effectiveFormSchema: FormSchema = useMemo(() => {
    let resolved: any = formSchema;
    if (typeof resolved === 'string') {
      try {
        resolved = JSON.parse(resolved);
      } catch {
        resolved = {};
      }
    }
    if (resolved && typeof resolved.styles === 'string') {
      try {
        resolved = {
          ...resolved,
          styles: JSON.parse(resolved.styles),
        };
      } catch {}
    }
    return resolved || {};
  }, [formSchema]);

  const fields = effectiveFormSchema?.fields || [];
  const steps = effectiveFormSchema?.steps || [];
  const layout = effectiveFormSchema?.layout || 'linear';

  const isFieldRequired = (field: FormFieldSchema): boolean => {
    if (Boolean(field.required)) {
      return true;
    }
    if (Boolean(field.is_system_field)) {
      return true;
    }
    if (field.name && ['name', 'email'].includes(field.name.toLowerCase().trim())) {
      return true;
    }
    return false;
  };

  const handleInputChange = (field: FormFieldSchema, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field.name]: value,
    }));
    if (errors[field.name]) {
      const isEmpty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
      if (!isEmpty) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[field.name];
          return updated;
        });
      }
    }
  };

  const handleFieldBlur = (field: FormFieldSchema) => {
    const required = isFieldRequired(field);
    const val = formData[field.name];
    const isEmpty = val === undefined || val === null || (typeof val === 'string' && val.trim() === '');

    if (required && isEmpty) {
      setErrors((prev) => ({
        ...prev,
        [field.name]: `${field.label || 'Este campo'} es obligatorio`,
      }));
    } else if (!isEmpty && field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof val === 'string' && !emailRegex.test(val.trim())) {
        setErrors((prev) => ({
          ...prev,
          [field.name]: 'Ingresa un correo electrónico válido',
        }));
      }
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
      const required = isFieldRequired(field);
      const val = formData[field.name];
      const isEmpty = val === undefined || val === null || (typeof val === 'string' && val.trim() === '');

      if (required && isEmpty) {
        newErrors[field.name] = `${field.label || 'Este campo'} es obligatorio`;
      } else if (!isEmpty && field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof val === 'string' && !emailRegex.test(val.trim())) {
          newErrors[field.name] = 'Ingresa un correo electrónico válido';
        }
      }
    });

    if (termsAndConditions && termsAndConditions.trim() && isLastStep) {
      if (!termsAccepted) {
        newErrors['termsCheck'] = 'Debes aceptar los Términos y Condiciones para continuar';
      }
    }

    if (privacyPolicy && privacyPolicy.trim() && isLastStep) {
      if (!privacyAccepted) {
        newErrors['privacyCheck'] = 'Debes aceptar las Políticas de Privacidad para continuar';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentFields()) return;

    if (paymentConfig?.enabled) {
      setIsProcessingPayment(true);
      setStripeElementError(null);

      try {
        if (isPreview || !landingId || !activePublishableKey) {
          await onSubmit(formData);
          return;
        }

        if (!clientSecret) {
          throw new Error('La pasarela de pago segura aún se está preparando. Por favor espera unos segundos.');
        }

        if (!stripeRef.current) {
          throw new Error('El formulario de tarjeta no está listo.');
        }

        // Process payment securely with Stripe Elements & 3DS
        const payRes = await stripeRef.current.confirmPayment();
        if (!payRes.success || !payRes.paymentIntentId) {
          throw new Error(payRes.error || 'No fue posible autorizar el pago con tu entidad bancaria.');
        }

        // Submit form including verified Stripe payment_intent_id
        await onSubmit({
          ...formData,
          payment_intent_id: payRes.paymentIntentId,
        });
      } catch (err: any) {
        setStripeElementError(err?.response?.data?.message || err?.message || 'Error al procesar el pago.');
      } finally {
        setIsProcessingPayment(false);
      }
    } else {
      await onSubmit(formData);
    }
  };

  const progressPercent = steps.length > 0 ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 100;

  const customStyles: FormStyleConfig = effectiveFormSchema?.styles || {};
  const isDark = customStyles.bg_color
    ? isColorDark(customStyles.bg_color)
    : (variant === 'dark');

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
  const radiusPixelsMap: Record<string, string> = {
    none: '0px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  };
  const activeRadiusClass = customStyles.border_radius
    ? (radiusClassMap[customStyles.border_radius] || 'rounded-xl')
    : 'rounded-xl';
  const activeRadiusPixels = customStyles.border_radius
    ? (radiusPixelsMap[customStyles.border_radius] || customStyles.border_radius)
    : '12px';

  const cardStyle = customStyles.card_style || 'card';

  // Base card styling
  const cardBaseStyle: React.CSSProperties =
    cardStyle === 'minimal'
      ? {
          backgroundColor: customStyles.bg_color || 'transparent',
          color: customStyles.text_color || (isDark ? '#f8fafc' : '#0f172a'),
          border: 'none',
          boxShadow: 'none',
          padding: 0,
        }
      : cardStyle === 'glass'
      ? {
          backgroundColor: customStyles.bg_color || (isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)'),
          color: customStyles.text_color || (isDark ? '#f8fafc' : '#0f172a'),
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: activeRadiusPixels,
          padding: '1.75rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        }
      : cardStyle === 'bordered'
      ? {
          backgroundColor: customStyles.bg_color || (isDark ? '#020617' : '#f8fafc'),
          color: customStyles.text_color || (isDark ? '#f8fafc' : '#0f172a'),
          border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
          borderRadius: activeRadiusPixels,
          padding: '1.75rem',
          boxShadow: 'none',
        }
      : {
          // Default Card
          backgroundColor: customStyles.bg_color || (isDark ? '#0f172a' : '#ffffff'),
          color: customStyles.text_color || (isDark ? '#f8fafc' : '#0f172a'),
          border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
          borderRadius: activeRadiusPixels,
          padding: '1.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        };

  // Base container class calculation
  let containerClasses = className || '';
  if (!containerClasses || containerClasses === 'space-y-5') {
    if (cardStyle === 'minimal') {
      containerClasses = isDark ? 'space-y-6 text-slate-100' : 'space-y-5 text-slate-900';
    } else if (cardStyle === 'glass') {
      containerClasses = `space-y-6 p-6 sm:p-8 shadow-2xl backdrop-blur-md ${activeRadiusClass} ${
        isDark ? 'bg-slate-900/70 text-slate-100 border border-white/10' : 'bg-white/80 text-slate-900 border border-white/20'
      }`;
    } else if (cardStyle === 'bordered') {
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
    ...cardBaseStyle,
    ...(customStyles.bg_color ? { backgroundColor: customStyles.bg_color } : {}),
    ...(customStyles.text_color ? { color: customStyles.text_color } : {}),
    ...(customStyles.border_radius ? { borderRadius: activeRadiusPixels } : {}),
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
    backgroundColor: customStyles.input_bg_color || (isDark ? '#020617' : '#ffffff'),
    color: customStyles.input_text_color || (isDark ? '#ffffff' : '#0f172a'),
    borderColor: customStyles.input_border_color || (isDark ? '#1e293b' : '#cbd5e1'),
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: activeRadiusPixels,
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  };

  const buttonInlineStyle: React.CSSProperties = {
    background: customStyles.button_bg_color || (isDark ? '#4f46e5' : '#6366f1'),
    backgroundColor: !customStyles.button_bg_color?.includes('gradient')
      ? (customStyles.button_bg_color || (isDark ? '#4f46e5' : '#6366f1'))
      : undefined,
    backgroundImage: customStyles.button_bg_color?.includes('gradient')
      ? customStyles.button_bg_color
      : 'none',
    color: customStyles.button_text_color || '#ffffff',
    borderRadius: activeRadiusPixels,
    padding: '14px 24px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
  };

  // Stripe Appearance Integration
  const effectiveStripeAppearance: StripeAppearanceConfig = useMemo(() => {
    let resolved: any =
      stripeAppearance ||
      paymentConfig?.stripe_appearance ||
      formSchema?.stripe_appearance;

    if (typeof resolved === 'string') {
      try {
        resolved = JSON.parse(resolved);
      } catch {
        resolved = null;
      }
    }

    return {
      ...defaultStripeAppearance,
      ...(resolved && typeof resolved === 'object' ? resolved : {}),
    };
  }, [stripeAppearance, paymentConfig?.stripe_appearance, formSchema?.stripe_appearance]);

  const stripeBoxStyle: React.CSSProperties = {
    backgroundColor: effectiveStripeAppearance.bg_transparent
      ? 'transparent'
      : (effectiveStripeAppearance.bg_color || (isDark ? '#090d16' : '#f0fdf4')),
    borderColor: effectiveStripeAppearance.container_border_color || (isDark ? '#1e293b' : '#a7f3d0'),
    borderWidth: effectiveStripeAppearance.container_border_width || '1px',
    borderStyle: 'solid',
    borderRadius: effectiveStripeAppearance.container_border_radius || '16px',
    padding: effectiveStripeAppearance.spacing_unit || '16px',
    color: effectiveStripeAppearance.text_color || (isDark ? '#f8fafc' : '#064e3b'),
    fontFamily: effectiveStripeAppearance.font_family || undefined,
    boxShadow: effectiveStripeAppearance.container_shadow === 'none' ? 'none' : undefined,
  };

  const stripeInputStyle: React.CSSProperties = {
    backgroundColor: effectiveStripeAppearance.input_bg_color || '#ffffff',
    color: effectiveStripeAppearance.input_text_color || '#0f172a',
    borderColor: effectiveStripeAppearance.input_border_color || '#cbd5e1',
    borderWidth: effectiveStripeAppearance.input_border_width || '1px',
    borderStyle: 'solid',
    borderRadius: effectiveStripeAppearance.input_border_radius || '12px',
    padding: effectiveStripeAppearance.input_padding || '12px 14px',
    fontSize: effectiveStripeAppearance.font_size || '13px',
    fontFamily: effectiveStripeAppearance.font_family || undefined,
  };

  const stripeLabelStyle: React.CSSProperties = effectiveStripeAppearance
    ? {
        color: effectiveStripeAppearance.label_color || effectiveStripeAppearance.text_color || labelStyle.color,
        fontWeight: (effectiveStripeAppearance.font_weight as any) || '600',
        fontSize: '11px',
        fontFamily: effectiveStripeAppearance.font_family || undefined,
      }
    : labelStyle;

  const stripeTitleStyle: React.CSSProperties = effectiveStripeAppearance
    ? {
        color: effectiveStripeAppearance.title_color || effectiveStripeAppearance.text_color,
        fontFamily: effectiveStripeAppearance.font_family || undefined,
      }
    : {};

  const stripeButtonStyle: React.CSSProperties = effectiveStripeAppearance
    ? {
        background: effectiveStripeAppearance.button_bg_color || buttonInlineStyle.background,
        backgroundColor: !effectiveStripeAppearance.button_bg_color?.includes('gradient')
          ? effectiveStripeAppearance.button_bg_color
          : undefined,
        color: effectiveStripeAppearance.button_text_color || '#ffffff',
        borderRadius: effectiveStripeAppearance.button_border_radius || activeRadiusClass,
        padding: effectiveStripeAppearance.button_padding || '14px 24px',
      }
    : buttonInlineStyle;

  const stripeErrorStyle: React.CSSProperties = effectiveStripeAppearance?.error_color
    ? {
        color: effectiveStripeAppearance.error_color,
      }
    : {};

  const stripeLinkStyle: React.CSSProperties = effectiveStripeAppearance?.link_color
    ? {
        color: effectiveStripeAppearance.link_color,
      }
    : {};

  const stripeCheckboxStyle: React.CSSProperties = {
    accentColor: effectiveStripeAppearance.checkbox_accent_color || 'var(--yes-green, #10b981)',
    backgroundColor: effectiveStripeAppearance.checkbox_bg_color || '#ffffff',
    borderColor: effectiveStripeAppearance.checkbox_border_color || '#cbd5e1',
    borderRadius: effectiveStripeAppearance.checkbox_border_radius || '4px',
    cursor: 'pointer',
  };

  // Serialized key to avoid re-triggering effect on every render
  const stripeAppearanceKey = JSON.stringify(effectiveStripeAppearance || {});



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
        {currentStepFields.map((field) => {
          const required = isFieldRequired(field);
          const hasError = Boolean(errors[field.name]);
          const fieldInputStyle: React.CSSProperties = {
            ...inputInlineStyle,
            ...(hasError ? { borderColor: '#ef4444', borderWidth: '1.5px', borderStyle: 'solid' } : {}),
          };
          const fieldClasses = `${inputClasses} ${hasError ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20' : ''} block w-full`;

          return (
            <div
              key={field.id}
              className="flex flex-col space-y-1.5 text-left w-full"
              style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box', textAlign: 'left' }}
            >
              {field.type !== 'checkbox' && (
                <label
                  className={`${labelClasses} block w-full text-left mb-1`}
                  style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...labelStyle }}
                >
                  {field.label} {required && <span className="text-red-500 font-bold ml-0.5" title="Campo obligatorio">*</span>}
                </label>
              )}

              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  placeholder={field.placeholder || ''}
                  required={required}
                  rows={3}
                  className={fieldClasses}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...fieldInputStyle }}
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  required={required}
                  className={fieldClasses}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...fieldInputStyle }}
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
                  style={{ display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer', ...labelStyle }}
                >
                  <input
                    type="checkbox"
                    checked={!!formData[field.name]}
                    onChange={(e) => handleInputChange(field, e.target.checked)}
                    onBlur={() => handleFieldBlur(field)}
                    required={required}
                    className="w-4 h-4"
                    style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      margin: '0 6px 0 0',
                      flexShrink: 0,
                      ...stripeCheckboxStyle,
                    }}
                  />
                  <span style={{ cursor: 'pointer', lineHeight: 1.3 }}>
                    {field.label} {required && <span className="text-red-500 font-bold ml-0.5" title="Campo obligatorio">*</span>}
                  </span>
                </label>
              ) : field.type === 'file' ? (
                <div className="flex flex-col space-y-1 w-full" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <input
                    type="file"
                    onChange={(e) => handleInputChange(field, e.target.files?.[0] || null)}
                    onBlur={() => handleFieldBlur(field)}
                    required={required}
                    className={`w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer ${fieldClasses}`}
                    style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...fieldInputStyle }}
                  />
                  <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`} style={subtitleStyle}>Archivos permitidos: imágenes, PDF, comprobantes de pago (Máx. 5MB)</p>
                </div>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  placeholder={field.placeholder || ''}
                  required={required}
                  className={fieldClasses}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...fieldInputStyle }}
                />
              )}

              {hasError && (
                <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1.5 mt-1 animate-in fade-in" style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', marginTop: '4px' }}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors[field.name]}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Stripe Payment Card Input Box if enabled */}
      {paymentConfig?.enabled && isLastStep && (
        <div
          className={`p-4 ${activeRadiusClass} border text-xs flex flex-col space-y-4 w-full ${
            effectiveStripeAppearance
              ? ''
              : isDark
                ? 'bg-slate-950/90 border-emerald-500/40 text-slate-200'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          }`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            boxSizing: 'border-box',
            gap: '1rem',
            ...stripeBoxStyle,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b pb-2.5 w-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderColor: effectiveStripeAppearance?.container_border_color || 'rgba(16, 185, 129, 0.2)',
            }}
          >
            <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard className="w-4.5 h-4.5 shrink-0" style={{ color: effectiveStripeAppearance?.button_bg_color || '#10b981' }} />
              <span className="font-bold text-xs" style={stripeTitleStyle}>
                Datos de Tarjeta de Crédito / Débito (Stripe)
              </span>
            </div>
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: effectiveStripeAppearance?.theme === 'night' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(16, 185, 129, 0.15)',
                color: effectiveStripeAppearance?.text_color || '#10b981',
              }}
            >
              <Lock className="w-3 h-3" /> SSL 256-Bit
            </span>
          </div>

          {/* Product & Price Summary */}
          <div
            className="flex items-center justify-between text-xs p-3 rounded-xl border w-full shadow-xs"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: effectiveStripeAppearance?.input_bg_color || (isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
              borderColor: effectiveStripeAppearance?.input_border_color || 'rgba(16, 185, 129, 0.3)',
              color: effectiveStripeAppearance?.text_color || undefined,
            }}
          >
            <span className="font-semibold">
              {paymentConfig.product_name || 'Servicio / Registro'}
            </span>
            <span
              className="font-extrabold text-sm"
              style={{ color: effectiveStripeAppearance?.button_bg_color || '#10b981' }}
            >
              ${paymentConfig.amount || 0} {paymentConfig.currency || 'USD'}
            </span>
          </div>

          {/* Stripe Elements Secure Payment Section */}
          <div className="w-full mt-2 space-y-2">
            {isLoadingPaymentIntent ? (
              <div className="flex items-center justify-center p-6 border rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Cargando formulario seguro de Stripe...</span>
              </div>
            ) : (
              <StripePaymentSection
                ref={stripeRef}
                clientSecret={clientSecret}
                publishableKey={activePublishableKey}
                appearanceConfig={effectiveStripeAppearance}
                isPreview={isPreview || !landingId}
                targetWindow={targetWindow}
              />
            )}

            {stripeElementError && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{stripeElementError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Terms & Conditions Checkbox & Modal Link */}
      {termsAndConditions && termsAndConditions.trim() !== '' && isLastStep && (
        <div className="form-check mt-3 mb-3 text-left w-full" style={{ marginTop: '0.75rem', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', boxSizing: 'border-box' }}>
            <input
              type="checkbox"
              id="termsCheck"
              required
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (errors['termsCheck']) {
                  setErrors((prev) => {
                    const u = { ...prev };
                    delete u['termsCheck'];
                    return u;
                  });
                }
              }}
              style={{
                display: 'inline-block',
                width: '18px',
                height: '18px',
                minWidth: '18px',
                minHeight: '18px',
                maxWidth: '18px',
                maxHeight: '18px',
                margin: '0 6px 0 0',
                padding: 0,
                flexShrink: 0,
                boxSizing: 'border-box',
                ...stripeCheckboxStyle,
              }}
            />
            <label htmlFor="termsCheck" style={{ display: 'inline-block', textTransform: 'none', color: customStyles.text_color || (isDark ? '#ffffff' : '#1e293b'), fontSize: '0.8rem', margin: 0, cursor: 'pointer', lineHeight: 1.3 }}>
              He leído y acepto los <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} style={{ color: effectiveStripeAppearance?.link_color || 'var(--yes-green, #10b981)', textDecoration: 'underline', fontWeight: 600 }}>Términos y Condiciones</a>
            </label>
          </div>
          {errors['termsCheck'] && (
            <p className="text-[11px] text-red-500 font-semibold" style={{ marginTop: '4px', textAlign: 'left' }}>
              {errors['termsCheck']}
            </p>
          )}
        </div>
      )}

      {/* Privacy Policy Checkbox & Modal Link */}
      {privacyPolicy && privacyPolicy.trim() !== '' && isLastStep && (
        <div className="form-check mt-3 mb-3 text-left w-full" style={{ marginTop: '0.75rem', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', boxSizing: 'border-box' }}>
            <input
              type="checkbox"
              id="privacyCheck"
              required
              checked={privacyAccepted}
              onChange={(e) => {
                setPrivacyAccepted(e.target.checked);
                if (errors['privacyCheck']) {
                  setErrors((prev) => {
                    const u = { ...prev };
                    delete u['privacyCheck'];
                    return u;
                  });
                }
              }}
              style={{
                display: 'inline-block',
                width: '18px',
                height: '18px',
                minWidth: '18px',
                minHeight: '18px',
                maxWidth: '18px',
                maxHeight: '18px',
                margin: '0 6px 0 0',
                padding: 0,
                flexShrink: 0,
                boxSizing: 'border-box',
                ...stripeCheckboxStyle,
              }}
            />
            <label htmlFor="privacyCheck" style={{ display: 'inline-block', textTransform: 'none', color: customStyles.text_color || (isDark ? '#ffffff' : '#1e293b'), fontSize: '0.8rem', margin: 0, cursor: 'pointer', lineHeight: 1.3 }}>
              He leído y acepto las <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }} style={{ color: effectiveStripeAppearance?.link_color || 'var(--yes-green, #10b981)', textDecoration: 'underline', fontWeight: 600 }}>Políticas de Privacidad</a>
            </label>
          </div>
          {errors['privacyCheck'] && (
            <p className="text-[11px] text-red-500 font-semibold" style={{ marginTop: '4px', textAlign: 'left' }}>
              {errors['privacyCheck']}
            </p>
          )}
        </div>
      )}

      {/* Terms Modal Popup (Positioned High Up near Top of Viewport) */}
      {showTermsModal && termsAndConditions && (
        <div
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-sm font-sans"
          onClick={() => setShowTermsModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.82)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '20px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
        >
          <div
            className="modal-content bg-dark text-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0d0d0f',
              border: '1px solid var(--yes-green, #10b981)',
              borderRadius: '1rem',
              maxWidth: '42rem',
              width: '92%',
              maxHeight: '88vh',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 25px rgba(16, 185, 129, 0.25)',
              zIndex: 1000000
            }}
          >
            <div className="modal-header flex items-center justify-between p-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h5 className="modal-title font-bold text-base m-0" style={{ color: 'var(--yes-green, #10b981)', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                Términos y Condiciones
              </h5>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="btn-close btn-close-white text-slate-400 hover:text-white p-1"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer', padding: '0.25rem', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
            <div
              className="modal-body p-5 overflow-y-auto text-left terms-rich-html-content"
              style={{ padding: '1.25rem', fontSize: '0.85rem', lineHeight: '1.6', color: '#cbd5e1', maxHeight: '68vh', overflowY: 'auto', wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: getFormattedTermsHtml(termsAndConditions) }}
            />
            <div className="modal-footer flex items-center justify-end gap-2 p-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', padding: '1rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="btn btn-secondary px-4 py-2 text-xs font-semibold rounded-lg"
                style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cerrar y Entendido
              </button>
              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                  if (errors['termsCheck']) {
                    setErrors((prev) => {
                      const u = { ...prev };
                      delete u['termsCheck'];
                      return u;
                    });
                  }
                }}
                className="btn text-xs font-bold rounded-lg"
                style={{ backgroundColor: 'var(--yes-green, #10b981)', color: '#000000', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Aceptar Términos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal Popup (Positioned High Up near Top of Viewport) */}
      {showPrivacyModal && privacyPolicy && (
        <div
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-sm font-sans"
          onClick={() => setShowPrivacyModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.82)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '20px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
        >
          <div
            className="modal-content bg-dark text-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0d0d0f',
              border: '1px solid var(--yes-green, #10b981)',
              borderRadius: '1rem',
              maxWidth: '42rem',
              width: '92%',
              maxHeight: '88vh',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 25px rgba(16, 185, 129, 0.25)',
              zIndex: 1000000
            }}
          >
            <div className="modal-header flex items-center justify-between p-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h5 className="modal-title font-bold text-base m-0" style={{ color: 'var(--yes-green, #10b981)', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                Políticas de Privacidad
              </h5>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="btn-close btn-close-white text-slate-400 hover:text-white p-1"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer', padding: '0.25rem', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
            <div
              className="modal-body p-5 overflow-y-auto text-left terms-rich-html-content"
              style={{ padding: '1.25rem', fontSize: '0.85rem', lineHeight: '1.6', color: '#cbd5e1', maxHeight: '68vh', overflowY: 'auto', wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: getFormattedTermsHtml(privacyPolicy) }}
            />
            <div className="modal-footer flex items-center justify-end gap-2 p-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', padding: '1rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="btn btn-secondary px-4 py-2 text-xs font-semibold rounded-lg"
                style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cerrar y Entendido
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrivacyAccepted(true);
                  setShowPrivacyModal(false);
                  if (errors['privacyCheck']) {
                    setErrors((prev) => {
                      const u = { ...prev };
                      delete u['privacyCheck'];
                      return u;
                    });
                  }
                }}
                className="btn text-xs font-bold rounded-lg"
                style={{ backgroundColor: 'var(--yes-green, #10b981)', color: '#000000', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Aceptar Políticas
              </button>
            </div>
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
            disabled={loading || isProcessingPayment}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            className={`w-full flex items-center justify-center gap-2 text-sm px-6 py-3.5 ${activeRadiusClass} font-bold shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer ${
              effectiveStripeAppearance && paymentConfig?.enabled
                ? 'text-white'
                : customStyles.button_bg_color
                ? ''
                : paymentConfig?.enabled
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
            }`}
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              textAlign: 'center',
              ...(paymentConfig?.enabled && effectiveStripeAppearance
                ? {
                    ...stripeButtonStyle,
                    ...(isBtnHovered && effectiveStripeAppearance.button_hover_bg_color
                      ? {
                          backgroundColor: effectiveStripeAppearance.button_hover_bg_color,
                          background: effectiveStripeAppearance.button_hover_bg_color,
                        }
                      : {}),
                  }
                : buttonInlineStyle),
            }}
          >
            {loading || isProcessingPayment ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isProcessingPayment ? 'Validando pago seguro con Stripe...' : 'Enviando...'}</span>
              </>
            ) : paymentConfig?.enabled ? (
              <>
                <CreditCard className="w-4 h-4 shrink-0" style={{ color: stripeButtonStyle.color || '#ffffff' }} />
                <span>
                  {effectiveStripeAppearance?.button_text ||
                    submitText ||
                    `Pagar $${paymentConfig.amount || 0} ${paymentConfig.currency || 'USD'}`}
                </span>
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
