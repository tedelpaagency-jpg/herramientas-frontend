'use client';

import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { loadStripe, Stripe, Appearance } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeAppearanceConfig } from '../../types/landing';
import { Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export interface StripeBillingDetails {
  name?: string;
  email?: string;
  phone?: string;
}

export interface StripePaymentRef {
  confirmPayment: (billingDetails?: StripeBillingDetails) => Promise<{ success: boolean; paymentIntentId?: string; error?: string }>;
}

export const getValidReturnUrl = (targetWin?: Window | null): string => {
  let url = '';

  // 1. Try window.top
  try {
    if (typeof window !== 'undefined' && window.top?.location?.href) {
      const topHref = window.top.location.href;
      if (!topHref.startsWith('about:') && !topHref.startsWith('blob:') && !topHref.startsWith('data:')) {
        url = topHref;
      }
    }
  } catch (e) {}

  // 2. Try window.location
  if (!url) {
    try {
      if (typeof window !== 'undefined' && window.location?.href) {
        const href = window.location.href;
        if (!href.startsWith('about:') && !href.startsWith('blob:') && !href.startsWith('data:')) {
          url = href;
        }
      }
    } catch (e) {}
  }

  // 3. Try targetWin
  if (!url && targetWin) {
    try {
      const targetHref = targetWin.location?.href;
      if (targetHref && !targetHref.startsWith('about:') && !targetHref.startsWith('blob:') && !targetHref.startsWith('data:')) {
        url = targetHref;
      }
    } catch (e) {}
  }

  // 4. Verify absolute http/https protocol
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url;
  }

  if (typeof window !== 'undefined' && window.location?.origin && (window.location.origin.startsWith('http://') || window.location.origin.startsWith('https://'))) {
    return window.location.origin;
  }

  return 'https://santun.tedelpa.com';
};

export const formatToE164Phone = (rawPhone?: string | null): string | undefined => {
  if (!rawPhone || typeof rawPhone !== 'string') return undefined;
  const trimmed = rawPhone.trim();
  if (!trimmed) return undefined;

  // Already E.164 (e.g. +593983725228, +14155552671)
  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, '');
  if (!digits || digits.length < 7) return undefined;

  // If starts with + but had spaces or dashes (e.g. +593 98 372 5228)
  if (trimmed.startsWith('+')) {
    const candidate = `+${digits}`;
    if (/^\+[1-9]\d{7,14}$/.test(candidate)) return candidate;
  }

  // If starts with 0 (e.g. 0983725228), strip leading 0
  const noZero = digits.startsWith('0') ? digits.substring(1) : digits;

  // If digits already include known international prefix without the '+' sign
  if (noZero.length >= 10) {
    const knownPrefixes = ['593', '56', '52', '57', '54', '51', '58', '502', '503', '504', '505', '506', '507', '1', '34'];
    for (const prefix of knownPrefixes) {
      if (noZero.startsWith(prefix)) {
        return `+${noZero}`;
      }
    }
    return `+${noZero}`;
  }

  // 9 digits without country code (typical Ecuador/Chile mobile: e.g. 983725228)
  if (noZero.length === 9) {
    return `+593${noZero}`;
  }

  return `+${noZero}`;
};

interface InnerProps {
  onReady?: () => void;
  appearanceConfig?: StripeAppearanceConfig | null;
  targetWindow?: Window | null;
}

const StripeInnerCheckout = forwardRef<StripePaymentRef, InnerProps>(({ onReady, appearanceConfig, targetWindow }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [elementError, setElementError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useImperativeHandle(ref, () => ({
    confirmPayment: async (billingDetails?: StripeBillingDetails) => {
      if (!stripe || !elements) {
        return { success: false, error: 'La pasarela de pago segura aún se está inicializando. Por favor intenta en un segundo.' };
      }

      setElementError(null);

      try {
        const returnUrl = getValidReturnUrl(targetWindow);
        const confirmParams: any = {
          return_url: returnUrl,
        };

        const cleanName = billingDetails?.name?.trim();
        const cleanEmail = billingDetails?.email?.trim();
        const cleanPhone = formatToE164Phone(billingDetails?.phone);

        // Always guarantee billing_details object is provided
        const billingDetailsObj: Record<string, string> = {
          name: cleanName || 'Cliente',
        };

        if (cleanEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          billingDetailsObj.email = cleanEmail;
          confirmParams.receipt_email = cleanEmail;
        }

        if (cleanPhone) {
          billingDetailsObj.phone = cleanPhone;
        }

        confirmParams.payment_method_data = {
          billing_details: billingDetailsObj,
        };

        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams,
          redirect: 'if_required',
        });

        if (error) {
          console.error('[Stripe confirmPayment error]', {
            type: error.type,
            code: error.code,
            decline_code: error.decline_code,
            message: error.message,
          });
          const msg = error.message || 'Error al procesar el pago con la tarjeta.';
          setElementError(msg);
          return { success: false, error: msg };
        }

        if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
          return { success: true, paymentIntentId: paymentIntent.id };
        }

        const fallbackMsg = `Estado de pago no confirmado: ${paymentIntent?.status || 'desconocido'}`;
        setElementError(fallbackMsg);
        return { success: false, error: fallbackMsg };
      } catch (err: any) {
        const msg = err?.message || 'Error de conexión con la pasarela Stripe.';
        setElementError(msg);
        return { success: false, error: msg };
      }
    },
  }));

  return (
    <div className="space-y-3 w-full">
      <PaymentElement
        id="payment-element"
        options={{
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
          },
          fields: {
            billingDetails: {
              name: 'never',
              email: 'never',
              phone: 'auto',
            },
          },
          paymentMethodOrder: ['card'],
          wallets: {
            applePay: 'auto',
            googlePay: 'auto',
          },
        }}
        onReady={() => {
          setIsReady(true);
          if (onReady) onReady();
        }}
        onLoadError={(event) => {
          console.error('[Stripe PaymentElement Load Error]', event);
          setElementError(event.error?.message || 'Error al inicializar la pasarela de pago.');
        }}
        onChange={(event) => {
          if (event.complete) {
            setElementError(null);
          }
        }}
      />

      {elementError && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{elementError}</span>
        </div>
      )}
    </div>
  );
});

StripeInnerCheckout.displayName = 'StripeInnerCheckout';

interface Props {
  clientSecret: string | null;
  publishableKey: string | null;
  appearanceConfig?: StripeAppearanceConfig | null;
  isPreview?: boolean;
  targetWindow?: Window | null;
}

// Cache loadStripe instances by publishable key + target window
const stripeInstances = new Map<string, Promise<Stripe | null>>();

const getStripePromise = (key: string, win?: Window | null): Promise<Stripe | null> => {
  const targetWin = (win || (typeof window !== 'undefined' ? window : null)) as any;
  if (!targetWin) return Promise.resolve(null);

  const isIframe = typeof window !== 'undefined' && targetWin !== window;
  const cacheKey = `${key}_${isIframe ? 'frame' : 'top'}`;

  if (!stripeInstances.has(cacheKey)) {
    const promise = new Promise<Stripe | null>((resolve) => {
      // 1. If targetWin already has Stripe constructor:
      if (targetWin.Stripe) {
        try {
          return resolve(targetWin.Stripe(key));
        } catch (e) {
          console.error('Error invoking targetWin.Stripe:', e);
        }
      }

      // 2. Ensure Stripe.js script tag exists in targetDoc
      const targetDoc = targetWin.document;
      if (targetDoc && !targetDoc.querySelector('script[src*="js.stripe.com"]')) {
        const script = targetDoc.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        targetDoc.head.appendChild(script);
      }

      // 3. Poll targetWin.Stripe
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (targetWin.Stripe) {
          clearInterval(interval);
          try {
            resolve(targetWin.Stripe(key));
          } catch (e) {
            console.error('Error invoking targetWin.Stripe after poll:', e);
            resolve(null);
          }
        } else if (attempts > 50) {
          clearInterval(interval);
          loadStripe(key).then(resolve).catch(() => resolve(null));
        }
      }, 50);
    });

    stripeInstances.set(cacheKey, promise);
  }

  return stripeInstances.get(cacheKey)!;
};

export const StripePaymentSection = forwardRef<StripePaymentRef, Props>(
  ({ clientSecret, publishableKey, appearanceConfig, isPreview = false, targetWindow }, ref) => {
    const stripePromise = React.useMemo(() => {
      if (isPreview || !publishableKey) return null;
      return getStripePromise(publishableKey, targetWindow);
    }, [publishableKey, isPreview, targetWindow]);

    // If in builder preview or no live credentials yet
    if (isPreview || !clientSecret || !publishableKey || !stripePromise) {
      return (
        <div
          className="w-full rounded-2xl border p-4 space-y-3 transition-all"
          style={{
            backgroundColor: appearanceConfig?.input_bg_color || 'rgba(255, 255, 255, 0.04)',
            borderColor: appearanceConfig?.container_border_color || 'rgba(16, 185, 129, 0.25)',
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pasarela de Pago Segura Stripe (Elements SSL)</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              Modo Seguro
            </span>
          </div>

          <div className="space-y-2.5 py-1">
            <div className="flex flex-col space-y-1">
              <div className="h-3 w-28 bg-slate-300/30 rounded animate-pulse" />
              <div
                className="h-10 w-full rounded-xl border flex items-center px-3 text-xs text-slate-400 select-none"
                style={{
                  backgroundColor: appearanceConfig?.input_bg_color || '#ffffff',
                  borderColor: appearanceConfig?.input_border_color || '#cbd5e1',
                }}
              >
                0000 0000 0000 0000
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col space-y-1">
                <div className="h-3 w-16 bg-slate-300/30 rounded animate-pulse" />
                <div
                  className="h-10 w-full rounded-xl border flex items-center px-3 text-xs text-slate-400 select-none"
                  style={{
                    backgroundColor: appearanceConfig?.input_bg_color || '#ffffff',
                    borderColor: appearanceConfig?.input_border_color || '#cbd5e1',
                  }}
                >
                  MM / AA
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="h-3 w-12 bg-slate-300/30 rounded animate-pulse" />
                <div
                  className="h-10 w-full rounded-xl border flex items-center px-3 text-xs text-slate-400 select-none"
                  style={{
                    backgroundColor: appearanceConfig?.input_bg_color || '#ffffff',
                    borderColor: appearanceConfig?.input_border_color || '#cbd5e1',
                  }}
                >
                  CVC
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encriptación de 256 bits directa con Stripe</span>
          </div>
        </div>
      );
    }

    // Helper to sanitize CSS colors for Stripe Elements Appearance API (rejects gradients, extracts valid HEX/RGB/HSL)
    const toValidStripeColor = (colorStr: string | undefined | null, fallback: string): string => {
      if (!colorStr || typeof colorStr !== 'string') return fallback;
      const trimmed = colorStr.trim();

      // If it's a gradient, extract the first hex or rgb/hsl inside it
      if (trimmed.includes('gradient')) {
        const hexMatch = trimmed.match(/#([0-9a-fA-F]{3,8})/);
        if (hexMatch) return hexMatch[0];
        const rgbMatch = trimmed.match(/(rgb|hsl)a?\([^\)]+\)/i);
        if (rgbMatch) return rgbMatch[0];
        return fallback;
      }

      // Valid Direct Hex
      if (/^#([0-9a-fA-F]{3,8})$/.test(trimmed)) {
        return trimmed;
      }

      // Valid Direct rgb / rgba / hsl / hsla
      if (/^(rgb|hsl)a?\(.+?\)$/i.test(trimmed)) {
        return trimmed;
      }

      const anyHex = trimmed.match(/#([0-9a-fA-F]{3,8})/);
      if (anyHex) return anyHex[0];

      return fallback;
    };

    const primaryColor = toValidStripeColor(
      appearanceConfig?.checkbox_accent_color || appearanceConfig?.button_bg_color,
      '#0891b2'
    );
    const bgColor = toValidStripeColor(appearanceConfig?.input_bg_color, '#ffffff');
    const textColor = toValidStripeColor(appearanceConfig?.input_text_color, '#0f172a');
    const dangerColor = toValidStripeColor(appearanceConfig?.error_color, '#ef4444');
    const borderColor = toValidStripeColor(appearanceConfig?.input_border_color, '#cbd5e1');
    const focusBorderColor = toValidStripeColor(appearanceConfig?.input_focus_border_color, primaryColor);

    const borderRadiusStr = appearanceConfig?.input_border_radius
      ? (String(appearanceConfig.input_border_radius).endsWith('px') || String(appearanceConfig.input_border_radius).endsWith('rem')
          ? String(appearanceConfig.input_border_radius)
          : `${appearanceConfig.input_border_radius}px`)
      : '12px';

    // Compute Stripe Appearance (clean variables, avoid invalid rules that crash Stripe validator)
    const appearance: Appearance = {
      theme: (appearanceConfig?.theme === 'night' ? 'night' : appearanceConfig?.theme === 'flat' ? 'flat' : 'stripe') as any,
      variables: {
        colorPrimary: primaryColor,
        colorBackground: bgColor,
        colorText: textColor,
        colorDanger: dangerColor,
        fontFamily: appearanceConfig?.font_family || 'system-ui, -apple-system, sans-serif',
        borderRadius: borderRadiusStr,
        spacingUnit: '4px',
      },
      rules: {
        '.Input': {
          borderColor: borderColor,
          boxShadow: 'none',
        },
        '.Input:focus': {
          borderColor: focusBorderColor,
          boxShadow: `0 0 0 1px ${focusBorderColor}`,
        },
      },
    };

    return (
      <div className="w-full">
        <Elements
          key={`${publishableKey}_${clientSecret}_${targetWindow ? 'frame' : 'top'}`}
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance,
          }}
        >
          <div
            className="w-full rounded-2xl border p-4 space-y-3 transition-all"
            style={{
              backgroundColor: appearanceConfig?.bg_transparent ? 'transparent' : appearanceConfig?.bg_color || undefined,
              borderColor: appearanceConfig?.container_border_color || 'rgba(16, 185, 129, 0.25)',
              borderWidth: appearanceConfig?.container_border_width || '1px',
              borderRadius: appearanceConfig?.container_border_radius || '16px',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/20">
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: appearanceConfig?.title_color || undefined }}>
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Datos de Pago Seguros</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Stripe SSL</span>
              </div>
            </div>

            <StripeInnerCheckout ref={ref} appearanceConfig={appearanceConfig} targetWindow={targetWindow} />
          </div>
        </Elements>
      </div>
    );
  }
);

StripePaymentSection.displayName = 'StripePaymentSection';

export default StripePaymentSection;
