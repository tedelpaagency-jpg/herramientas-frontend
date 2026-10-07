import React, { useState, useEffect, useRef } from 'react';
import { FormSchema, FormFieldSchema, PaymentConfig, StripeAppearanceConfig } from '../../types/landing';
import { isColorDark } from '../../utils/stripeAppearance';
import { ChevronRight, ChevronLeft, Check, Send, Loader2, CreditCard, Lock, ShieldCheck } from 'lucide-react';

// Carga asíncrona del script oficial de Stripe.js v3 en el documento y ventana del contenedor
const loadStripeJs = (targetDoc?: Document | null, targetWin?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const win = targetWin || (typeof window !== 'undefined' ? window : null);
    const doc = targetDoc || (win?.document || (typeof document !== 'undefined' ? document : null));
    if (!win || !doc) return resolve(null);

    if (win.Stripe) {
      return resolve(win.Stripe);
    }

    // Fallback: si window global ya tiene Stripe cargado, enlazarlo a targetWin
    if (typeof window !== 'undefined' && (window as any).Stripe && !win.Stripe) {
      win.Stripe = (window as any).Stripe;
      return resolve(win.Stripe);
    }

    const existing = (doc.querySelector('script[src*="js.stripe.com/v3"]') as HTMLScriptElement | null) ||
      (doc.getElementById('stripe-js-script') as HTMLScriptElement | null);
    if (existing) {
      if (win.Stripe) return resolve(win.Stripe);
      existing.addEventListener('load', () => resolve(win.Stripe));
      existing.addEventListener('error', (err) => reject(err));
      setTimeout(() => {
        if (win.Stripe) resolve(win.Stripe);
      }, 300);
      return;
    }

    const script = doc.createElement('script');
    script.id = 'stripe-js-script';
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => resolve(win.Stripe);
    script.onerror = (e) => reject(e);
    (doc.head || doc.body).appendChild(script);
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

  // Stripe Elements State & Refs
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isCardFocused, setIsCardFocused] = useState(false);
  const [stripeElementError, setStripeElementError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const stripeInstanceRef = useRef<any>(null);
  const elementsInstanceRef = useRef<any>(null);
  const cardElementRef = useRef<any>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

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

      if (stripePublishableKey) {
        if (!isStripeLoaded) {
          newErrors['stripe_card'] = 'La pasarela de pago segura aún se está inicializando. Por favor espera un momento.';
        } else if (!isCardComplete) {
          newErrors['stripe_card'] = 'El número de tarjeta está incompleto. Recuerda que las tarjetas bancarias tienen 16 dígitos completos.';
        }
      } else {
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

    if (paymentConfig?.enabled && stripePublishableKey && stripeInstanceRef.current) {
      const cardElement = elementsInstanceRef.current?.getElement('card') || cardElementRef.current;
      if (!cardElement) {
        setStripeElementError('El formulario de tarjeta no está listo aún. Por favor recarga la página.');
        return;
      }
      setIsProcessingPayment(true);
      setStripeElementError(null);
      try {
        const { token, error } = await stripeInstanceRef.current.createToken(cardElement, {
          name: formData['card_holder_name'] || formData['name'] || '',
        });

        if (error) {
          setStripeElementError(error.message || 'Error al validar la tarjeta en Stripe');
          setIsProcessingPayment(false);
          return;
        }

        if (token) {
          const submissionData = { ...formData, stripe_token: token.id };
          delete submissionData['card_number'];
          delete submissionData['card_expiry'];
          delete submissionData['card_cvc'];
          onSubmit(submissionData);
        }
      } catch (err: any) {
        setStripeElementError(err.message || 'Error de comunicación con Stripe');
      } finally {
        setIsProcessingPayment(false);
      }
    } else {
      onSubmit(formData);
    }
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

  // Stripe Appearance Integration
  const effectiveStripeAppearance: StripeAppearanceConfig | undefined =
    stripeAppearance ||
    paymentConfig?.stripe_appearance ||
    formSchema?.stripe_appearance;

  const stripeBoxStyle: React.CSSProperties = effectiveStripeAppearance
    ? {
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
      }
    : {};

  const stripeInputStyle: React.CSSProperties = effectiveStripeAppearance
    ? {
        backgroundColor: effectiveStripeAppearance.input_bg_color || inputInlineStyle.backgroundColor,
        color: effectiveStripeAppearance.input_text_color || inputInlineStyle.color,
        borderColor: effectiveStripeAppearance.input_border_color || inputInlineStyle.borderColor,
        borderWidth: effectiveStripeAppearance.input_border_width || '1px',
        borderRadius: effectiveStripeAppearance.input_border_radius || '12px',
        padding: effectiveStripeAppearance.input_padding || '12px 14px',
        fontSize: effectiveStripeAppearance.font_size || '13px',
        fontFamily: effectiveStripeAppearance.font_family || undefined,
      }
    : inputInlineStyle;

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

  // Serialized key to avoid re-triggering effect on every render
  const stripeAppearanceKey = JSON.stringify(effectiveStripeAppearance || {});

  // Lifecycle & mounting of official Stripe Elements (card iframe)
  useEffect(() => {
    if (!paymentConfig?.enabled || !stripePublishableKey || !isLastStep) return;

    let isMounted = true;
    let timerId: any = null;

    const targetDoc = cardContainerRef.current?.ownerDocument || (typeof document !== 'undefined' ? document : null);
    const targetWin = targetDoc?.defaultView || (typeof window !== 'undefined' ? window : null);

    loadStripeJs(targetDoc, targetWin)
      .then((StripeClass) => {
        if (!isMounted || !StripeClass) return;

        // Inicializar Stripe en el contexto de la ventana donde reside el contenedor DOM
        if (!stripeInstanceRef.current || (stripeInstanceRef.current as any)._targetWin !== targetWin) {
          stripeInstanceRef.current = StripeClass(stripePublishableKey);
          (stripeInstanceRef.current as any)._targetWin = targetWin;
          elementsInstanceRef.current = null;
          cardElementRef.current = null;
        }
        const stripe = stripeInstanceRef.current;

        if (!elementsInstanceRef.current) {
          elementsInstanceRef.current = stripe.elements();
        }

        const isBgDark = isDark || (effectiveStripeAppearance?.bg_color ? isColorDark(effectiveStripeAppearance.bg_color) : false);

        // Estilos conformes a las reglas oficiales de Stripe Elements
        const cardStyle = {
          base: {
            color: effectiveStripeAppearance?.input_text_color || (isBgDark ? '#f8fafc' : '#0f172a'),
            fontFamily: effectiveStripeAppearance?.font_family || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: effectiveStripeAppearance?.font_size || '14px',
            fontWeight: (effectiveStripeAppearance?.font_weight as string) || '500',
            fontSmoothing: 'antialiased',
            '::placeholder': {
              color: effectiveStripeAppearance?.input_placeholder_color || (isBgDark ? '#64748b' : '#94a3b8'),
            },
            iconColor: effectiveStripeAppearance?.input_focus_border_color || '#10b981',
          },
          invalid: {
            color: effectiveStripeAppearance?.error_color || '#ef4444',
            iconColor: effectiveStripeAppearance?.error_color || '#ef4444',
          },
          complete: {
            color: effectiveStripeAppearance?.success_color || '#10b981',
            iconColor: effectiveStripeAppearance?.success_color || '#10b981',
          },
        };

        // Si el elemento ya existe, actualizamos sus estilos según las reglas de Stripe de forma dinámica sin destruir el elemento
        const existingCard = elementsInstanceRef.current.getElement('card') || cardElementRef.current;
        if (existingCard) {
          try {
            existingCard.update({ style: cardStyle });
            cardElementRef.current = existingCard;
            setIsStripeLoaded(true);
            return;
          } catch (e) {
            return;
          }
        }

        const card = elementsInstanceRef.current.create('card', {
          style: cardStyle,
          hidePostalCode: true,
        });

        const mountToContainer = () => {
          if (!isMounted) return;
          if (cardContainerRef.current) {
            try {
              cardContainerRef.current.innerHTML = '';
              card.mount(cardContainerRef.current);
              cardElementRef.current = card;

              card.on('ready', () => {
                setIsStripeLoaded(true);
              });

              card.on('change', (event: any) => {
                setIsCardComplete(Boolean(event.complete));
                if (event.error) {
                  setStripeElementError(event.error.message);
                } else {
                  setStripeElementError(null);
                }
                if (event.complete) {
                  setErrors((prev) => {
                    if (!prev['stripe_card']) return prev;
                    const updated = { ...prev };
                    delete updated['stripe_card'];
                    return updated;
                  });
                }
              });

              card.on('focus', () => setIsCardFocused(true));
              card.on('blur', () => setIsCardFocused(false));
            } catch (err) {
              console.warn('Error al montar Stripe Card Element:', err);
            }
          } else {
            timerId = setTimeout(mountToContainer, 50);
          }
        };

        mountToContainer();
      })
      .catch((err) => {
        console.error('Error al inicializar Stripe Elements:', err);
      });

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [paymentConfig?.enabled, stripePublishableKey, isLastStep, stripeAppearanceKey, isDark]);

  useEffect(() => {
    return () => {
      if (cardElementRef.current) {
        try {
          cardElementRef.current.unmount();
        } catch (_) {}
        cardElementRef.current = null;
      }
    };
  }, []);

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
            {field.type !== 'checkbox' && (
              <label
                className={`${labelClasses} block w-full text-left mb-1`}
                style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...labelStyle }}
              >
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}

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
                style={{ display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer', ...labelStyle }}
              >
                <input
                  type="checkbox"
                  checked={!!formData[field.name]}
                  onChange={(e) => handleInputChange(field, e.target.checked)}
                  className="rounded border-slate-300 bg-white text-indigo-600 w-4 h-4 focus:ring-indigo-500"
                  style={{ display: 'inline-block', width: '16px', height: '16px', margin: '0 6px 0 0', flexShrink: 0, cursor: 'pointer' }}
                />
                <span style={{ cursor: 'pointer', lineHeight: 1.3 }}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </span>
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
                value={formData['card_holder_name'] || ''}
                onChange={(e) => handleInputChange({ id: 'card_holder_name', name: 'card_holder_name', label: 'Nombre en la Tarjeta', type: 'text' }, e.target.value.toUpperCase())}
                className={`${inputClasses} block w-full`}
                style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...stripeInputStyle }}
              />
              {errors['card_holder_name'] && <p className="text-[11px] font-semibold" style={stripeErrorStyle}>{errors['card_holder_name']}</p>}
            </div>

            {stripePublishableKey ? (
              /* Contenedor Iframe Seguro Stripe Elements */
              <div
                className="flex flex-col space-y-1 text-left w-full"
                style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}
              >
                <label
                  className={`${labelClasses} block w-full text-left mb-1`}
                  style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...stripeLabelStyle }}
                >
                  Tarjeta de Crédito o Débito (16 dígitos) <span className="text-red-500">*</span>
                </label>
                <div
                  className="w-full transition-all duration-200"
                  style={{
                    backgroundColor: effectiveStripeAppearance?.input_bg_color || (isDark ? '#020617' : '#ffffff'),
                    borderWidth: effectiveStripeAppearance?.input_border_width || '1px',
                    borderStyle: 'solid',
                    borderColor: isCardFocused
                      ? (effectiveStripeAppearance?.input_focus_border_color || '#10b981')
                      : (stripeElementError || errors['stripe_card']
                        ? (effectiveStripeAppearance?.error_color || '#ef4444')
                        : (effectiveStripeAppearance?.input_border_color || (isDark ? '#334155' : '#cbd5e1'))),
                    borderRadius: effectiveStripeAppearance?.input_border_radius || '10px',
                    padding: effectiveStripeAppearance?.input_padding || '12px 14px',
                    boxShadow: isCardFocused
                      ? `0 0 0 2px ${(effectiveStripeAppearance?.input_focus_border_color || '#10b981')}33`
                      : 'none',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    width: '100%',
                  }}
                >
                  <div ref={cardContainerRef} style={{ width: '100%' }} />
                </div>
                {stripeElementError && (
                  <p className="text-[11px] font-semibold mt-1" style={stripeErrorStyle}>
                    {stripeElementError}
                  </p>
                )}
                {errors['stripe_card'] && !stripeElementError && (
                  <p className="text-[11px] font-semibold mt-1" style={stripeErrorStyle}>
                    {errors['stripe_card']}
                  </p>
                )}
                {!isStripeLoaded && !stripeElementError && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Cargando interfaz segura de Stripe...</span>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback en caso de que no haya clave pública configurada */
              <>
                {/* Número de Tarjeta */}
                <div
                  className="flex flex-col space-y-1 text-left w-full"
                  style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}
                >
                  <label
                    className={`${labelClasses} block w-full text-left mb-1`}
                    style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...stripeLabelStyle }}
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
                      style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...stripeInputStyle }}
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" style={{ position: 'absolute', right: '12px', top: '14px' }} />
                  </div>
                  {errors['card_number'] && <p className="text-[11px] font-semibold" style={stripeErrorStyle}>{errors['card_number']}</p>}
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
                      style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...stripeLabelStyle }}
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
                      style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...stripeInputStyle }}
                    />
                    {errors['card_expiry'] && <p className="text-[11px] font-semibold" style={stripeErrorStyle}>{errors['card_expiry']}</p>}
                  </div>

                  {/* CVC / CVV */}
                  <div
                    className="flex flex-col space-y-1 text-left w-full"
                    style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}
                  >
                    <label
                      className={`${labelClasses} block w-full text-left mb-1`}
                      style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '4px', ...stripeLabelStyle }}
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
                      style={{ display: 'block', width: '100%', boxSizing: 'border-box', ...stripeInputStyle }}
                    />
                    {errors['card_cvc'] && <p className="text-[11px] font-semibold" style={stripeErrorStyle}>{errors['card_cvc']}</p>}
                  </div>
                </div>
              </>
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
                accentColor: 'var(--yes-green, #10b981)',
                cursor: 'pointer',
                flexShrink: 0,
                boxSizing: 'border-box',
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
                accentColor: 'var(--yes-green, #10b981)',
                cursor: 'pointer',
                flexShrink: 0,
                boxSizing: 'border-box',
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
            className={`w-full flex items-center justify-center gap-2 text-white text-sm px-6 py-3.5 ${activeRadiusClass} font-bold shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 cursor-pointer ${
              effectiveStripeAppearance && paymentConfig?.enabled
                ? ''
                : paymentConfig?.enabled
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
