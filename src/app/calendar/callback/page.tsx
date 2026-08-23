'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import googleCalendarService from '@/services/googleCalendarService';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GoogleOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setStatus('error');
      setErrorMessage('No se encontró el código de autorización de Google.');
      return;
    }

    googleCalendarService
      .exchangeCode(code)
      .then(() => {
        setStatus('success');
        setTimeout(() => {
          router.push('/calendar');
        }, 2000);
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.response?.data?.message || 'Error al vincular con Google.');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl space-y-4">
        {status === 'loading' && (
          <>
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
            <h3 className="text-lg font-bold">Viculando con Google Calendar...</h3>
            <p className="text-xs text-slate-400">Intercambiando credenciales y autorizando permisos de desarrollador.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-300">¡Cuenta Vinculada con Éxito!</h3>
            <p className="text-xs text-slate-300">Redirigiendo a su calendario...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-rose-300">Error de Vinculación</h3>
            <p className="text-xs text-slate-400">{errorMessage}</p>
            <button
              onClick={() => router.push('/calendar')}
              className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl"
            >
              Volver al Calendario
            </button>
          </>
        )}
      </div>
    </div>
  );
}
