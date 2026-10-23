'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { loadStripe, Stripe, Appearance } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeAppearanceConfig } from '../../types/landing';
import { Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export interface StripePaymentRef {
  confirmPayment: () => Promise<{ success: boolean; paymentIntentId?: string; error?: string }>;
}

interface InnerProps {
  onReady?: () => void;
  appearanceConfig?: StripeAppearanceConfig | null;
}

const StripeInnerCheckout = forwardRef<StripePaymentRef, InnerProps>(({ onReady, appearanceConfig }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [elementError, setElementError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useImperativeHandle(ref, () => ({
    confirmPayment: async () => {
      if (!stripe || !elements) {
        return { success: false, error: 'La pasarela de pago segura aún se está inicializando. Por favor intenta en un segundo.' };
      }

      setElementError(null);

      try {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
        });

        if (error) {
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
        }}
        onReady={() => {
          setIsReady(true);
          if (onReady) onReady();
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
}

// Cache loadStripe instances by publishable key
const stripeInstances = new Map<string, Promise<Stripe | null>>();

const getStripePromise = (key: string): Promise<Stripe | null> => {
  if (!stripeInstances.has(key)) {
    stripeInstances.set(key, loadStripe(key));
  }
  return stripeInstances.get(key)!;
};

export const StripePaymentSection = forwardRef<StripePaymentRef, Props>(
  ({ clientSecret, publishableKey, appearanceConfig, isPreview = false }, ref) => {
    // If in builder preview or no live credentials yet
    if (isPreview || !clientSecret || !publishableKey) {
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

    const stripePromise = getStripePromise(publishableKey);

    // Compute Stripe Appearance
    const appearance: Appearance = {
      theme: (appearanceConfig?.theme === 'night' ? 'night' : appearanceConfig?.theme === 'flat' ? 'flat' : 'stripe') as any,
      variables: {
        colorPrimary: appearanceConfig?.button_bg_color?.includes('#')
          ? appearanceConfig.button_bg_color
          : appearanceConfig?.checkbox_accent_color || '#10b981',
        colorBackground: appearanceConfig?.input_bg_color || '#ffffff',
        colorText: appearanceConfig?.input_text_color || '#0f172a',
        colorDanger: appearanceConfig?.error_color || '#ef4444',
        fontFamily: appearanceConfig?.font_family || 'system-ui, sans-serif',
        borderRadius: appearanceConfig?.input_border_radius || '12px',
        spacingUnit: '4px',
      },
      rules: {
        '.Input': {
          borderColor: appearanceConfig?.input_border_color || '#cbd5e1',
          boxShadow: 'none',
        },
        '.Input:focus': {
          borderColor: appearanceConfig?.input_focus_border_color || '#10b981',
          boxShadow: `0 0 0 1px ${appearanceConfig?.input_focus_border_color || '#10b981'}`,
        },
        '.Label': {
          color: appearanceConfig?.label_color || appearanceConfig?.text_color || '#0f172a',
          fontWeight: '600',
          fontSize: '12px',
          marginBottom: '6px',
        },
      },
    };

    return (
      <Elements
        key={clientSecret}
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

          <StripeInnerCheckout ref={ref} appearanceConfig={appearanceConfig} />
        </div>
      </Elements>
    );
  }
);

StripePaymentSection.displayName = 'StripePaymentSection';

export default StripePaymentSection;
