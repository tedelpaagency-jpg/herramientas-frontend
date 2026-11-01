'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Building2, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Portal from '@/components/Portal';
import PasswordResetModal from './PasswordResetModal';
import toast from 'react-hot-toast';
import { normalizeFileUrl } from '@/services/apiClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency?: any;
  redirectTo?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  agency,
  redirectTo = '/dashboard',
}) => {
  const router = useRouter();
  const { login, currentWhiteLabel, currentAgency, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Resolver branding activo (White Label o Agencia)
  const activeWl = currentWhiteLabel || (user as any)?.white_label;
  const effectiveAgency = agency || currentAgency || (user as any)?.agency;

  const brandName = 
    activeWl?.name || 
    effectiveAgency?.name || 
    effectiveAgency?.trade_name || 
    'Portal Inmobiliario';

  const brandLogoRaw = 
    activeWl?.logo || 
    activeWl?.logo_2 || 
    activeWl?.logo_icon || 
    effectiveAgency?.logo || 
    effectiveAgency?.logo_url || 
    null;

  const brandLogo = brandLogoRaw ? normalizeFileUrl(brandLogoRaw) : null;
  const primaryColor = 
    effectiveAgency?.primary_color || 
    effectiveAgency?.button_color || 
    activeWl?.button_color || 
    activeWl?.primary_color || 
    '#059669';

  // Cargar credencial guardada si el usuario marcó "Recordarme" previamente
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('santun_remember_email');
      const savedRemember = localStorage.getItem('santun_remember_me');
      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (savedRemember === 'true') {
        setRememberMe(true);
      }
      setError(null);

      // Auto-enfoque en el input correspondiente
      setTimeout(() => {
        if (savedEmail) {
          const passInput = document.getElementById('modal-login-password');
          passInput?.focus();
        } else {
          emailInputRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Manejar tecla ESC para cerrar modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isResetOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isResetOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Por favor ingresa tu correo electrónico y contraseña.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem('santun_remember_email', email.trim());
          localStorage.setItem('santun_remember_me', 'true');
        } else {
          localStorage.removeItem('santun_remember_email');
          localStorage.removeItem('santun_remember_me');
        }
      }

      await login(email.trim(), password, rememberMe);
      toast.success('¡Bienvenido de vuelta!');
      onClose();

      // Redirección suave al dashboard o URL solicitada
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      } else {
        router.push(redirectTo);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else {
        setError('Credenciales inválidas. Verifica tu correo y contraseña.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Portal>
        <AnimatePresence>
          {isOpen && !isResetOpen && (
            <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              {/* Backdrop con desenfoque de alta fidelidad */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/65 backdrop-blur-md"
                aria-hidden="true"
              />

              {/* Ventana Modal - Física Orgánica Emil Kowalski (escala sutil 0.96 -> 1, ease-out desacelerado) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white w-full max-w-[440px] rounded-3xl shadow-2xl relative z-10 border border-slate-200/80 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden my-auto flex flex-col transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-login-title"
              >
                {/* Botón Cerrar (Discreto y Táctil) */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center justify-center active:scale-[0.92] transition-all duration-150 cursor-pointer"
                  aria-label="Cerrar ventana"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Cabecera / Identidad de Marca */}
                <div className="pt-8 pb-4 px-6 sm:px-8 text-center flex flex-col items-center">
                  <div className="mb-4">
                    {brandLogo ? (
                      <div className="h-12 max-w-[210px] flex items-center justify-center">
                        <img
                          src={brandLogo}
                          alt={brandName}
                          className="max-h-12 w-auto object-contain"
                          onError={(e) => {
                            // Fallback a ícono si la URL del logo falla
                            (e.currentTarget as HTMLElement).style.display = 'none';
                            const fallback = document.getElementById('modal-brand-fallback');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      </div>
                    ) : null}

                    <div
                      id="modal-brand-fallback"
                      className="w-13 h-13 rounded-2xl flex items-center justify-center shadow-md text-white mx-auto"
                      style={{
                        backgroundColor: primaryColor,
                        display: brandLogo ? 'none' : 'flex',
                      }}
                    >
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>

                  <h3
                    id="modal-login-title"
                    className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
                  >
                    Acceso al Portal
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-1.5 max-w-xs mx-auto">
                    Inicia sesión para gestionar tus inmuebles, leads y cartera de clientes en <strong className="font-bold text-slate-700 dark:text-slate-300">{brandName}</strong>.
                  </p>
                </div>

                {/* Mensaje de Error (animado si ocurre) */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.16 }}
                      className="px-6 sm:px-8 overflow-hidden"
                    >
                      <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs font-semibold leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="flex-1">{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Formulario de Inicio de Sesión */}
                <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-8 pt-3 space-y-4">
                  {/* Campo: Correo Electrónico */}
                  <div>
                    <label 
                      htmlFor="modal-login-email" 
                      className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-0.5"
                    >
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        ref={emailInputRef}
                        id="modal-login-email"
                        type="email"
                        autoComplete="email"
                        required
                        disabled={isSubmitting}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="tu-correo@agencia.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-150 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Campo: Contraseña */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5 ml-0.5">
                      <label 
                        htmlFor="modal-login-password" 
                        className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                      >
                        Contraseña
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsResetOpen(true)}
                        className="text-[11px] font-bold text-primary hover:underline transition-all cursor-pointer"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="modal-login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        disabled={isSubmitting}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-150 disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Recordarme */}
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary/30 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Recordarme en este equipo
                      </span>
                    </label>
                  </div>

                  {/* Botón Primario de Inicio de Sesión (Micro-interacción táctil Emil Kowalski) */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 px-4 rounded-xl text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                    style={{
                      backgroundColor: primaryColor,
                      boxShadow: `0 8px 20px -4px ${primaryColor}55`,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Iniciando sesión...</span>
                      </>
                    ) : (
                      <>
                        <span>Ingresar al Sistema</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Badge de Conexión Segura */}
                  <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Conexión cifrada segura SSL • 256 bits</span>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Portal>

      {/* Modal de Recuperación de Contraseña */}
      {isResetOpen && (
        <PasswordResetModal
          isOpen={isResetOpen}
          onClose={() => setIsResetOpen(false)}
          initialEmail={email}
          brandName={brandName}
          brandLogo={brandLogo}
          onSuccess={(confirmedEmail) => {
            setEmail(confirmedEmail);
            setIsResetOpen(false);
            toast.success('Contraseña actualizada. Ya puedes iniciar sesión.');
          }}
        />
      )}
    </>
  );
};

export default LoginModal;

