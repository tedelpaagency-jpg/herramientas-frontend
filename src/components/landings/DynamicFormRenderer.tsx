import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FormSchema, FormFieldSchema, PaymentConfig, StripeAppearanceConfig, FormStyleConfig } from '../../types/landing';
import { isColorDark, defaultStripeAppearance } from '../../utils/stripeAppearance';
import { ChevronRight, ChevronLeft, Check, Send, Loader2, CreditCard, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export const isValidStripePublishableKey = (key?: string | null): boolean => {
  if (!key || typeof key !== 'string') return false;
  const clean = key.trim();
  return clean.startsWith('pk_test_') || clean.startsWith('pk_live_');
};

// Carga asíncrona y resiliente del script oficial de Stripe.js v3 en el documento y ventana activa
const loadStripeJs = (targetDoc?: Document | null, targetWin?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const win = targetWin || (typeof window !== 'undefined' ? window : null);
    const topWin: any = typeof window !== 'undefined' ? window : null;
    const doc = targetDoc || (win?.document || (typeof document !== 'undefined' ? document : null));
    const topDoc = typeof document !== 'undefined' ? document : null;

    if (win?.Stripe) return resolve(win.Stripe);
    if (topWin?.Stripe) {
      if (win) win.Stripe = topWin.Stripe;
      return resolve(topWin.Stripe);
    }

    let resolved = false;
    let pollTimer: any = null;
    let failTimer: any = null;

    const cleanup = () => {
      if (pollTimer) clearInterval(pollTimer);
      if (failTimer) clearTimeout(failTimer);
    };

    const safeResolve = (stripeInst: any) => {
      if (resolved || !stripeInst) return;
      resolved = true;
      cleanup();
      if (win && !win.Stripe) win.Stripe = stripeInst;
      resolve(stripeInst);
    };

    const safeReject = (err: any) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      reject(err);
    };

    const injectScript = (d: Document | null) => {
      if (!d) return;
      if (!d.querySelector('script[src*="js.stripe.com/v3"]')) {
        const script = d.createElement('script');
        script.id = 'stripe-js-script';
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
          const s = win?.Stripe || topWin?.Stripe;
          if (s) safeResolve(s);
        };
        script.onerror = (e) => {
          console.warn('Stripe.js load error in document:', e);
        };
        (d.head || d.body || d.documentElement).appendChild(script);
      }
    };

    injectScript(topDoc);
    if (doc && doc !== topDoc) {
      injectScript(doc);
    }

    // Polling cada 50ms para capturar Stripe tan pronto como esté disponible
    pollTimer = setInterval(() => {
      const s = win?.Stripe || topWin?.Stripe;
      if (s) {
        safeResolve(s);
      }
    }, 50);

    // Timeout máximo de 6 segundos
    failTimer = setTimeout(() => {
      const s = win?.Stripe || topWin?.Stripe;
      if (s) {
        safeResolve(s);
      } else {
        safeReject(new Error('Tiempo de espera agotado al conectar con Stripe.js'));
      }
    }, 6000);
  });
};

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
  termsAndConditions?: string | null;
  privacyPolicy?: string | null;
  stripeAppearance?: StripeAppearanceConfig | null;
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
  termsAndConditions,
  privacyPolicy,
  stripeAppearance,
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
  const hasValidStripeKey = Boolean(stripePublishableKey && isValidStripePublishableKey(stripePublishableKey));
  const [stripeElementError, setStripeElementError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);

  const cardWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const stripeInstanceRef = useRef<any>(null);
  const elementsInstanceRef = useRef<any>(null);
  const cardElementRef = useRef<any>(null);

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

    if (paymentConfig?.enabled && isLastStep) {
      if (!formData['card_holder_name'] || !formData['card_holder_name'].trim()) {
        newErrors['card_holder_name'] = 'Nombre en la tarjeta es obligatorio';
      }
      if (!hasValidStripeKey) {
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
    }

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
        if (hasValidStripeKey) {
          if (!isStripeLoaded || !stripeInstanceRef.current || !cardElementRef.current) {
            setStripeElementError('Conectando de forma segura con Stripe. Por favor intenta en unos segundos.');
            setIsProcessingPayment(false);
            return;
          }

          const cardHolder = (formData['card_holder_name'] || '').trim();
          if (!cardHolder) {
            setErrors((prev) => ({ ...prev, card_holder_name: 'Nombre en la tarjeta es obligatorio' }));
            setIsProcessingPayment(false);
            return;
          }

          // Tokenización oficial Stripe Card Element unificado (Cumplimiento PCI-DSS SAQ A)
          const { token, error } = await stripeInstanceRef.current.createToken(
            cardElementRef.current,
            { name: cardHolder }
          );

          if (error) {
            setStripeElementError(error.message || 'Error al validar los datos de la tarjeta bancaria.');
            setIsProcessingPayment(false);
            return;
          }

          if (!token || !token.id) {
            setStripeElementError('No fue posible tokenizar la tarjeta en Stripe de forma segura.');
            setIsProcessingPayment(false);
            return;
          }

          await onSubmit({
            ...formData,
            stripe_token: token.id,
            card_holder_name: cardHolder,
          });
        } else {
          await onSubmit(formData);
        }
      } catch (err: any) {
        console.error('Submit error:', err);
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

  const getStripeElementContainerStyle = (isFocused: boolean, hasFieldErr: boolean): React.CSSProperties => ({
    backgroundColor: effectiveStripeAppearance.input_bg_color || (isDark ? '#020617' : '#ffffff'),
    color: effectiveStripeAppearance.input_text_color || (isDark ? '#ffffff' : '#0f172a'),
    borderColor: hasFieldErr
      ? '#ef4444'
      : isFocused
      ? (effectiveStripeAppearance.button_bg_color || '#6366f1')
      : (effectiveStripeAppearance.input_border_color || (isDark ? '#1e293b' : '#cbd5e1')),
    borderWidth: effectiveStripeAppearance.input_border_width || '1px',
    borderStyle: 'solid',
    borderRadius: effectiveStripeAppearance.input_border_radius || activeRadiusPixels,
    padding: effectiveStripeAppearance.input_padding || '12px 14px',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '44px',
    outline: 'none',
    boxShadow: isFocused
      ? `0 0 0 3px ${effectiveStripeAppearance.button_bg_color ? `${effectiveStripeAppearance.button_bg_color}33` : 'rgba(99, 102, 241, 0.2)'}`
      : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: 'text',
  });

  useEffect(() => {
    if (!paymentConfig?.enabled || !isLastStep || !hasValidStripeKey || !stripePublishableKey) {
      return;
    }

    let isCancelled = false;
    let cardEl: any = null;

    const doc = cardContainerRef.current?.ownerDocument || (typeof document !== 'undefined' ? document : null);
    const win: any = doc?.defaultView || (typeof window !== 'undefined' ? window : null);

    loadStripeJs(doc, win)
      .then((stripeConstructor) => {
        if (isCancelled) return;

        const stripeFactory = win?.Stripe || stripeConstructor;
        if (!stripeFactory) {
          throw new Error('Stripe.js no está disponible.');
        }

        const stripe = stripeFactory(stripePublishableKey.trim());
        stripeInstanceRef.current = stripe;

        const elements = stripe.elements();
        elementsInstanceRef.current = elements;

        const elementStyles = {
          base: {
            color: effectiveStripeAppearance.input_text_color || (isDark ? '#f8fafc' : '#0f172a'),
            fontFamily: effectiveStripeAppearance.font_family || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: effectiveStripeAppearance.font_size || '15px',
            lineHeight: '22px',
            '::placeholder': {
              color: isDark ? '#64748b' : '#94a3b8',
            },
            iconColor: effectiveStripeAppearance.button_bg_color || (isDark ? '#38bdf8' : '#6366f1'),
          },
          invalid: {
            color: effectiveStripeAppearance.error_color || '#ef4444',
            iconColor: effectiveStripeAppearance.error_color || '#ef4444',
          },
        };

        cardEl = elements.create('card', {
          style: elementStyles,
          hidePostalCode: true,
        });

        cardElementRef.current = cardEl;

        cardEl.on('focus', () => {
          if (cardWrapperRef.current) {
            cardWrapperRef.current.style.borderColor = effectiveStripeAppearance.button_bg_color || '#6366f1';
            cardWrapperRef.current.style.boxShadow = `0 0 0 3px ${effectiveStripeAppearance.button_bg_color ? `${effectiveStripeAppearance.button_bg_color}33` : 'rgba(99, 102, 241, 0.2)'}`;
          }
        });

        cardEl.on('blur', () => {
          if (cardWrapperRef.current) {
            cardWrapperRef.current.style.borderColor = effectiveStripeAppearance.input_border_color || (isDark ? '#1e293b' : '#cbd5e1');
            cardWrapperRef.current.style.boxShadow = 'none';
          }
        });

        cardEl.on('change', (e: any) => {
          if (e.error) {
            setStripeElementError(e.error.message);
          } else {
            setStripeElementError(null);
          }
        });

        if (cardContainerRef.current) {
          cardContainerRef.current.innerHTML = '';
          cardEl.mount(cardContainerRef.current);
        }

        setIsStripeLoaded(true);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Error inicializando Stripe Card Element:', err);
        setStripeElementError('No se pudo inicializar la pasarela de pagos segura de Stripe.');
      });

    return () => {
      isCancelled = true;
      if (cardEl) {
        try { cardEl.destroy(); } catch {}
      }
      cardElementRef.current = null;
      setIsStripeLoaded(false);
    };
  }, [
    paymentConfig?.enabled,
    isLastStep,
    hasValidStripeKey,
    stripePublishableKey,
    stripeAppearanceKey,
    isDark,
  ]);



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
      <style>{`
        .StripeElement {
          width: 100% !important;
        }
      `}</style>
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
                style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...stripeLabelStyle }}
              >
                Nombre en la Tarjeta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="EJ. JUAN PEREZ"
                required
                value={formData['card_holder_name'] || ''}
                onChange={(e) => handleInputChange({ id: 'card_holder_name', name: 'card_holder_name', label: 'Nombre en la Tarjeta', type: 'text' }, e.target.value.toUpperCase())}
                onBlur={() => {
                  if (!formData['card_holder_name'] || !formData['card_holder_name'].trim()) {
                    setErrors((prev) => ({ ...prev, card_holder_name: 'Nombre en la tarjeta es obligatorio' }));
                  }
                }}
                className={`w-full transition focus:outline-none focus:ring-2 block ${errors['card_holder_name'] ? 'focus:ring-red-500/30' : 'focus:ring-indigo-500/20'}`}
                style={{
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  ...stripeInputStyle,
                  ...(errors['card_holder_name'] ? { borderColor: '#ef4444', borderWidth: '1.5px', borderStyle: 'solid' } : {}),
                }}
              />
              {errors['card_holder_name'] && (
                <p className="text-[11px] font-semibold flex items-center gap-1.5 mt-1 animate-in fade-in" style={stripeErrorStyle}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors['card_holder_name']}</span>
                </p>
              )}
            </div>

            {/* Datos de la Tarjeta (Stripe Card Element normal unificado) */}
            <div
              className="flex flex-col space-y-1 text-left w-full"
              style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}
            >
              <label
                className={`${labelClasses} block w-full text-left mb-1`}
                style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...stripeLabelStyle }}
              >
                Datos de la Tarjeta <span className="text-red-500">*</span>
              </label>
              {hasValidStripeKey ? (
                <div
                  ref={cardWrapperRef}
                  className="stripe-card-wrapper w-full"
                  style={{
                    backgroundColor: effectiveStripeAppearance.input_bg_color || (isDark ? '#020617' : '#ffffff'),
                    borderWidth: effectiveStripeAppearance.input_border_width || '1px',
                    borderStyle: 'solid',
                    borderColor: stripeElementError
                      ? '#ef4444'
                      : (effectiveStripeAppearance.input_border_color || (isDark ? '#1e293b' : '#cbd5e1')),
                    borderRadius: effectiveStripeAppearance.input_border_radius || activeRadiusPixels,
                    padding: effectiveStripeAppearance.input_padding || '12px 14px',
                    boxSizing: 'border-box',
                    width: '100%',
                    minHeight: '44px',
                    cursor: 'text',
                    position: 'relative',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onClick={() => {
                    if (cardElementRef.current) {
                      try { cardElementRef.current.focus(); } catch {}
                    }
                  }}
                >
                  {!isStripeLoaded && (
                    <div className="flex items-center gap-2 text-xs opacity-50 py-0.5 mb-1.5 select-none pointer-events-none">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500 shrink-0" />
                      <span>Cargando interfaz segura de Stripe...</span>
                    </div>
                  )}
                  {/* IMPORTANTE: Este contenedor nunca debe tener hijos React para no romper el iframe de Stripe */}
                  <div
                    ref={cardContainerRef}
                    id="stripe-card-element-mount"
                    style={{
                      width: '100%',
                      minHeight: '20px',
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative w-full" style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="0000 0000 0000 0000"
                      required
                      value={formData['card_number'] || ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                        const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                        handleInputChange({ id: 'card_number', name: 'card_number', label: 'Número de Tarjeta', type: 'text' }, formatted);
                      }}
                      className="w-full font-mono tracking-wider transition focus:outline-none focus:ring-2 block"
                      style={{
                        display: 'block',
                        width: '100%',
                        boxSizing: 'border-box',
                        ...stripeInputStyle,
                      }}
                    />
                    <CreditCard className="w-4 h-4 pointer-events-none opacity-60" style={{ position: 'absolute', right: '12px', top: '14px', color: effectiveStripeAppearance.input_text_color || '#94a3b8' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/AA"
                      required
                      value={formData['card_expiry'] || ''}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length >= 3) {
                          val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        }
                        handleInputChange({ id: 'card_expiry', name: 'card_expiry', label: 'Fecha de Vencimiento', type: 'text' }, val);
                      }}
                      className="w-full font-mono transition focus:outline-none focus:ring-2 block"
                      style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...stripeInputStyle }}
                    />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="CVC"
                      required
                      value={formData['card_cvc'] || ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                        handleInputChange({ id: 'card_cvc', name: 'card_cvc', label: 'CVC / CVV', type: 'text' }, raw);
                      }}
                      className="w-full font-mono transition focus:outline-none focus:ring-2 block"
                      style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...stripeInputStyle }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error retornado por Stripe */}
            {stripeElementError && (
              <div className="flex flex-col gap-1.5 mt-1">
                <p className="text-[11px] font-semibold flex items-center gap-1.5" style={stripeErrorStyle}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{stripeElementError}</span>
                </p>
              </div>
            )}
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
            disabled={loading || isProcessingPayment || Boolean(paymentConfig?.enabled && hasValidStripeKey && !isStripeLoaded)}
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
            ) : paymentConfig?.enabled && hasValidStripeKey && !isStripeLoaded ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Conectando con Stripe...</span>
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
