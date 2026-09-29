'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowLeft, 
  RefreshCw, 
  ShieldCheck 
} from 'lucide-react';
import passwordResetService from '../../services/passwordResetService';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccess?: (confirmedEmail: string) => void;
  brandName?: string;
  brandLogo?: string | null;
}

type Step = 'email' | 'code' | 'password' | 'success';

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccess,
  brandName = 'SANTUN',
  brandLogo = null,
}) => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Sync initial email when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setStep('email');
      setCode('');
      setResetToken('');
      setPassword('');
      setPasswordConfirmation('');
      setErrorMessage(null);
      setSuccessInfo(null);
    }
  }, [isOpen, initialEmail]);

  // Countdown timer for code resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  // Step 1: Send Verification Code
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const res = await passwordResetService.sendResetCode(email.trim());
      setSuccessInfo(res.message || 'Código de verificación enviado a tu correo.');
      setCountdown(60); // 60s cooldown for resend
      setStep('code');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Error al enviar el código de verificación. Intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 & 3: Validate Verification Code
  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.trim();
    if (cleanCode.length < 6) {
      setErrorMessage('Ingresa el código completo de 6 dígitos.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const res = await passwordResetService.verifyResetCode(email.trim(), cleanCode);
      setResetToken(res.reset_token);
      setSuccessInfo('Código validado con éxito.');
      setStep('password');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Código de verificación incorrecto o expirado.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Update Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await passwordResetService.resetPassword({
        email: email.trim(),
        reset_token: resetToken,
        password,
        password_confirmation: passwordConfirmation,
      });

      setStep('success');
      if (onSuccess) {
        onSuccess(email.trim());
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Error al actualizar la contraseña. Inicia el proceso nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          {brandLogo ? (
            <img src={brandLogo} alt={brandName} className="h-8 max-w-[130px] object-contain mb-3" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center mb-3 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
          )}

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {step === 'email' && 'Recuperar Contraseña'}
            {step === 'code' && 'Validar Código'}
            {step === 'password' && 'Nueva Contraseña'}
            {step === 'success' && '¡Contraseña Actualizada!'}
          </h2>

          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 max-w-[340px]">
            {step === 'email' && 'Paso 1 de 3: Confirma tu correo para recibir un código de verificación seguro.'}
            {step === 'code' && `Paso 2 de 3: Ingresa el código de 6 dígitos que enviamos a tu correo.`}
            {step === 'password' && 'Paso 3 de 3: Ingresa tu nueva contraseña y repítela para confirmar.'}
            {step === 'success' && 'Tu contraseña se ha restablecido correctamente. Ya puedes iniciar sesión.'}
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successInfo && step !== 'success' && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successInfo}</span>
          </div>
        )}

        {/* STEP 1: CONFIRMAR CORREO */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Correo Electrónico Registrado
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 text-[14px] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enviando código...</span>
                </>
              ) : (
                <>
                  <span>Enviar Código de Verificación</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          </form>
        )}

        {/* STEP 2 & 3: VALIDAR CÓDIGO DE VERIFICACIÓN */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Código de 6 dígitos
                </label>
                <span className="text-[11px] text-blue-600 font-mono font-bold truncate max-w-[200px]">
                  {email}
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  className="w-full h-13 text-center tracking-[12px] font-mono text-2xl font-black bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-slate-900 dark:text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                El código expira en 15 minutos. Revisa también tu carpeta de spam.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length < 6}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validando código...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Validar Código</span>
                </>
              )}
            </button>

            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cambiar correo</span>
              </button>

              <button
                type="button"
                disabled={countdown > 0 || isLoading}
                onClick={() => handleSendCode()}
                className="font-bold text-blue-600 hover:text-blue-700 disabled:text-slate-400"
              >
                {countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar código'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: ACTUALIZAR CONTRASEÑA */}
        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 text-[14px] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Confirmar Contraseña (Repetir)
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 text-[14px] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && passwordConfirmation && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold">
                  {password === passwordConfirmation ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Las contraseñas coinciden
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Las contraseñas no coinciden
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || password.length < 8 || password !== passwordConfirmation}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Actualizando contraseña...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Actualizar Contraseña</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP SUCCESS */}
        {step === 'success' && (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                ¡Tu contraseña fue actualizada exitosamente!
              </p>
              <p className="text-xs text-slate-500">
                Ahora puedes ingresar al sistema con tu nueva clave de acceso.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Iniciar Sesión Ahora
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetModal;
