'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import landingService from '@/services/landingService';
import DynamicFormRenderer from '@/components/landings/DynamicFormRenderer';
import { Globe, AlertTriangle, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function CustomHtmlIframeContainer({
  customHtml,
  formSchema,
  paymentConfig,
  stripePublishableKey,
  termsAndConditions,
  onSubmit,
  submitted,
}: {
  customHtml: string;
  formSchema: any;
  paymentConfig?: any;
  stripePublishableKey?: string | null;
  termsAndConditions?: string | null;
  onSubmit: (answers: Record<string, any>) => void;
  submitted: boolean;
}) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(900);
  const [isStyleReady, setIsStyleReady] = useState(false);

  let customFormClass = formSchema?.className || formSchema?.class_name || 'space-y-5';
  const match = customHtml.match(/\{\{DYNAMIC_FORM(?::|\s+class=["']?)([^}"']+)["']?\}\}/i);
  if (match && match[1]) {
    customFormClass = match[1].trim();
  }

  const processedHtml = React.useMemo(() => {
    let raw = customHtml.replace(
      /\{\{DYNAMIC_FORM[^}]*\}\}/gi,
      `<div id="react-dynamic-form-container" class="${customFormClass}"></div>`
    );

    const tailwindConfigHeader = `
      <script>
        window.tailwind = {
          darkMode: 'class',
          theme: { extend: {} }
        };
      </script>
      <style>
        html { color-scheme: light; }
        #react-dynamic-form-container form {
          display: flex !important;
          flex-direction: column !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        #react-dynamic-form-container label {
          display: block !important;
          width: 100% !important;
          text-align: left !important;
          float: none !important;
          margin-bottom: 4px !important;
        }
        #react-dynamic-form-container input,
        #react-dynamic-form-container select,
        #react-dynamic-form-container textarea {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
          max-width: 100% !important;
        }
        #react-dynamic-form-container button {
          box-sizing: border-box !important;
        }
      </style>
    `;

    if (raw.includes('</head>')) {
      return raw.replace('</head>', `${tailwindConfigHeader}</head>`);
    } else if (raw.includes('<head>')) {
      return raw.replace('<head>', `<head>${tailwindConfigHeader}`);
    } else if (raw.includes('<html>')) {
      return raw.replace('<html>', `<html><head>${tailwindConfigHeader}</head>`);
    } else {
      return `<!DOCTYPE html><html><head>${tailwindConfigHeader}</head><body>${raw}</body></html>`;
    }
  }, [customHtml, customFormClass]);

  const checkAndMountTarget = React.useCallback(() => {
    const iframeNode = iframeRef.current;
    if (!iframeNode) return;
    const doc = iframeNode.contentDocument || iframeNode.contentWindow?.document;
    if (!doc) return;

    const el = doc.getElementById('react-dynamic-form-container');
    if (el && el !== mountTarget) {
      setMountTarget(el);
    }

    if (doc.body) {
      const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, doc.body.offsetHeight, 600);
      setIframeHeight(height);
    }
  }, [mountTarget]);

  // Immediately poll every 15ms after component mounts to find target before onLoad fires
  useEffect(() => {
    checkAndMountTarget();
    const timer = setInterval(() => {
      checkAndMountTarget();
    }, 15);

    // Fallback: guarantee form styles transition after max 350ms
    const fallbackTimer = setTimeout(() => {
      setIsStyleReady(true);
    }, 350);

    return () => {
      clearInterval(timer);
      clearTimeout(fallbackTimer);
    };
  }, [checkAndMountTarget]);

  const setupIframe = () => {
    checkAndMountTarget();
    const iframeNode = iframeRef.current;
    if (!iframeNode) return;
    const doc = iframeNode.contentDocument || iframeNode.contentWindow?.document;
    if (!doc) return;

    // Inject tailwind config script if not present
    if (!doc.head.querySelector('script[id="tailwind-config-script"]')) {
      const configScript = doc.createElement('script');
      configScript.id = 'tailwind-config-script';
      configScript.textContent = `
        window.tailwind = {
          darkMode: 'class',
          theme: { extend: {} }
        };
      `;
      doc.head.insertBefore(configScript, doc.head.firstChild);
    }

    // Ensure Tailwind CSS script is injected in iframe head if not already present
    const existingScript = doc.querySelector('script[src*="tailwindcss"]');
    const existingLink = doc.querySelector('link[href*="tailwind"]');

    if (!existingScript && !existingLink) {
      const twScript = doc.createElement('script');
      twScript.src = 'https://cdn.tailwindcss.com';
      twScript.onload = () => {
        setTimeout(() => setIsStyleReady(true), 60);
      };
      twScript.onerror = () => {
        setIsStyleReady(true);
      };
      doc.head.appendChild(twScript);
    } else {
      setTimeout(() => setIsStyleReady(true), 60);
    }

    if (typeof window !== 'undefined' && window.ResizeObserver && doc.body) {
      const ro = new ResizeObserver(() => {
        if (doc.body) {
          const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, doc.body.offsetHeight, 600);
          setIframeHeight(height);
        }
      });
      ro.observe(doc.body);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <Toaster position="top-right" />
      <iframe
        ref={iframeRef}
        srcDoc={processedHtml}
        title="Custom Landing Page"
        onLoad={setupIframe}
        className="w-full border-0 block overflow-hidden"
        style={{ height: `${iframeHeight}px`, minHeight: '100vh', width: '100%' }}
      />
      {mountTarget && createPortal(
        submitted ? (
          <div className="text-center py-6 space-y-2 bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-950">¡Registro Completado!</h3>
            <p className="text-xs text-emerald-800">Gracias por contactarnos. Tu información ha sido recibida con éxito.</p>
          </div>
        ) : (
          <DynamicFormRenderer
            formSchema={formSchema}
            onSubmit={onSubmit}
            className={customFormClass}
            paymentConfig={paymentConfig}
            stripePublishableKey={stripePublishableKey}
            termsAndConditions={termsAndConditions}
            isFormLoading={!isStyleReady}
          />
        ),
        mountTarget
      )}
    </div>
  );
}

function PublicLandingContent() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get('id') || searchParams.get('slug') || '';

  const [loading, setLoading] = useState(true);
  const [landing, setLanding] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Isolate public landing from global dashboard theme (strip dark mode class)
    const htmlEl = document.documentElement;
    const hadDark = htmlEl.classList.contains('dark');
    if (hadDark) {
      htmlEl.classList.remove('dark');
    }

    return () => {
      if (hadDark) {
        htmlEl.classList.add('dark');
      }
    };
  }, []);

  useEffect(() => {
    if (!rawId) {
      setLoading(false);
      setErrorStatus(404);
      setErrorMessage('Identificador de Landing Page no proporcionado.');
      return;
    }

    loadLanding();
  }, [rawId]);

  const loadLanding = async () => {
    try {
      setLoading(true);
      setErrorStatus(null);
      const data = await landingService.getPublicLanding(rawId);
      setLanding(data);
    } catch (err: any) {
      console.error('Error loading public landing:', err);
      const status = err.response?.status || 500;
      setErrorStatus(status);
      setErrorMessage(err.response?.data?.message || 'No se pudo cargar la Landing Page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLead = async (formData: Record<string, any>) => {
    try {
      const payload = {
        landing_id: landing.id,
        id: landing.id,
        name: formData.name || formData.first_name || 'Prospecto',
        last_name: formData.last_name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        answers: formData,
      };

      const res = await landingService.submitPublicLead(payload);
      setSubmitted(true);
      toast.success(res?.message || '¡Gracias por registrarte! Nos pondremos en contacto contigo pronto.');
      
      if (res?.redirect_url) {
        setTimeout(() => {
          window.location.href = res.redirect_url;
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error submitting lead:', err);
      toast.error(err.response?.data?.message || 'Error al enviar el formulario. Intenta nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="landing-standalone-root light min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-4" style={{ colorScheme: 'light' }}>
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm text-slate-600 font-semibold">Cargando Landing Page...</p>
      </div>
    );
  }

  if (errorStatus === 403 || landing?.status === 0) {
    return (
      <div className="landing-standalone-root light min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center" style={{ colorScheme: 'light' }}>
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mb-6 shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Landing Page Suspendida</h1>
        <p className="text-sm text-slate-600 max-w-md mb-6">
          {errorMessage || 'Esta página web se encuentra suspendida temporalmente por administración.'}
        </p>
        <span className="text-xs text-slate-400 font-mono">ID: {rawId}</span>
      </div>
    );
  }

  if (errorStatus === 404 || !landing) {
    return (
      <div className="landing-standalone-root light min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center" style={{ colorScheme: 'light' }}>
        <div className="w-16 h-16 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 mb-6 shadow-md">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Landing Page No Encontrada</h1>
        <p className="text-sm text-slate-600 max-w-md mb-6">
          {errorMessage || 'El enlace al que intentas acceder no existe o fue eliminado.'}
        </p>
      </div>
    );
  }

  const isCustomHtml = landing.mode === 'custom_html' && landing.custom_html;

  // Custom HTML Rendering with full style isolation and native script execution via Iframe + React Portal
  if (isCustomHtml) {
    let decodedHtml = landing.custom_html || '';
    if (typeof decodedHtml === 'string' && decodedHtml.startsWith('base64:')) {
      try {
        decodedHtml = decodeURIComponent(escape(atob(decodedHtml.replace(/^base64:/, ''))));
      } catch (e) {
        console.error('Error decoding custom_html base64:', e);
        decodedHtml = landing.custom_html || '';
      }
    }

    return (
      <CustomHtmlIframeContainer
        customHtml={decodedHtml}
        formSchema={landing.form_schema}
        paymentConfig={landing.payment_config}
        stripePublishableKey={landing.stripe_publishable_key}
        termsAndConditions={landing.terms_and_conditions}
        onSubmit={handleSubmitLead}
        submitted={submitted}
      />
    );
  }

  // Visual / Builder Mode Rendering
  const blocks = landing.builder_schema?.blocks || [
    {
      id: 'hero_1',
      type: 'hero',
      title: landing.title || landing.name || 'Bienvenidos',
      subtitle: 'Completa la información a continuación para ponerte en contacto.',
    },
  ];

  return (
    <div className="landing-standalone-root light min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans antialiased" style={{ colorScheme: 'dark' }}>
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white shadow-md">
            <Globe className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-white">{landing.agency_name || landing.title || 'Plataforma Web'}</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-10">
        {blocks.map((b: any) => (
          <div key={b.id} className="text-center space-y-3 py-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {b.title}
            </h1>
            {b.subtitle && <p className="text-slate-400 text-base max-w-xl mx-auto">{b.subtitle}</p>}
          </div>
        ))}

        {/* Dynamic Form Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-14 h-14 text-teal-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">¡Gracias por registrarte!</h3>
              <p className="text-sm text-slate-400">Hemos recibido tus datos con éxito.</p>
            </div>
          ) : (
            <DynamicFormRenderer
              formSchema={landing.form_schema}
              onSubmit={handleSubmitLead}
              variant="dark"
              paymentConfig={landing.payment_config}
              stripePublishableKey={landing.stripe_publishable_key}
              termsAndConditions={landing.terms_and_conditions}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {landing.agency_name || 'Todos los derechos reservados.'}
      </footer>
    </div>
  );
}

export default function PublicLandingPage() {
  return (
    <Suspense fallback={
      <div className="landing-standalone-root light min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    }>
      <PublicLandingContent />
    </Suspense>
  );
}
