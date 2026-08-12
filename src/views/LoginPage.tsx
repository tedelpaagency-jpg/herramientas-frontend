'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Star, 
  MoreHorizontal, 
  Heart, 
  Send,
  Globe,
  AlertCircle
} from 'lucide-react';

const rewardsData = [
  { 
    id: 1, 
    title: 'Propiedades Exclusivas', 
    subtitle: 'Gestión inmobiliaria premium',
    emoji: '🏢',
  },
  { 
    id: 2, 
    title: 'Embudo CRM & Leads', 
    subtitle: 'Seguimiento automatizado',
    emoji: '🚀',
  },
  { 
    id: 3, 
    title: 'Bóveda Legal LexVault', 
    subtitle: 'Contratos y firmas digitales',
    emoji: '📜',
  },
  { 
    id: 4, 
    title: 'Ruleta & Recompensas', 
    subtitle: 'Gamificación de ventas',
    emoji: '🎁',
  }
];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@tedelpa.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % rewardsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else {
        setError('Credenciales inválidas o sin respuesta del servidor de Laravel.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardStyle = (index: number) => {
    const diff = (index - activeIndex + rewardsData.length) % rewardsData.length;
    const baseTransition = "transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]";

    if (diff === 0) {
      return `${baseTransition} z-40 scale-100 translate-x-0 translate-y-0 opacity-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]`;
    } else if (diff === 1) {
      return `${baseTransition} z-30 scale-[0.7] translate-x-[35%] -translate-y-4 rotate-[6deg] opacity-60 brightness-[0.6] shadow-xl`;
    } else if (diff === rewardsData.length - 1) {
      return `${baseTransition} z-30 scale-[0.7] -translate-x-[35%] -translate-y-4 -rotate-[6deg] opacity-60 brightness-[0.6] shadow-xl`;
    } else {
      return `${baseTransition} z-10 scale-[0.5] translate-x-0 -translate-y-10 opacity-0 pointer-events-none`;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 md:p-12 relative">
        <div className="w-full max-w-[1140px] flex flex-col lg:flex-row gap-10 lg:gap-24 items-center justify-center z-10">
          
          {/* ================= TEXTO MÓVIL (Solo visible < lg) ================= */}
          <div className="lg:hidden flex flex-col items-center text-center mt-6 px-4 order-1 max-w-[420px]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-blue-600 uppercase">SANTUN Provider Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight leading-[1.2] mb-3">
              Plataforma de gestión empresarial y servicios <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">en tiempo real</span>.
            </h1>
          </div>

          {/* ================= SECCIÓN IZQUIERDA: Carrusel ================= */}
          <div className="flex w-full lg:w-[55%] flex-col items-center lg:items-start justify-center relative min-h-[400px] lg:min-h-[550px] order-3 lg:order-1 mt-8 lg:mt-0">
            
            <div className="hidden lg:block mb-12 z-40 max-w-[420px]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">SANTUN Provider Portal</span>
              </div>
              
              <h1 className="text-3xl font-semibold text-slate-800 tracking-tight leading-[1.2] mb-3">
                Plataforma de gestión <br />
                empresarial <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">conectada a Laravel</span>.
              </h1>
              
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                Accede a tu panel centralizado para inmuebles, CRM, POS y documentos legales.
              </p>
            </div>

            {/* CARRUSEL DE RECOMPENSAS / TARJETAS 3D */}
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] h-[380px] sm:h-[440px] flex items-center justify-center mx-auto lg:mx-0 lg:ml-16">
              {rewardsData.map((reward, i) => (
                <div 
                  key={reward.id} 
                  className={`absolute w-[230px] sm:w-[270px] h-[360px] sm:h-[420px] rounded-[24px] ${getCardStyle(i)}`}
                >
                  <div className="w-full h-full rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden border border-white/20 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white">
                    <div className="flex justify-between items-center z-20">
                      <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white/90 text-[11px] font-semibold flex items-center gap-1.5 border border-white/10">
                        <Star className="w-3 h-3 fill-current text-amber-400" /> SANTUN Premium
                      </div>
                      <MoreHorizontal className="text-white w-5 h-5 opacity-80" />
                    </div>

                    <div className="z-20 flex flex-col gap-3">
                      <div>
                        <h3 className="text-white font-bold text-xl tracking-tight mb-1 flex items-center gap-2">
                          {reward.title} {reward.emoji}
                        </h3>
                        <p className="text-white/80 text-[13px] font-medium">
                          {reward.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-grow h-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center px-4">
                          <span className="text-white/80 text-[12px] font-semibold">Explorar módulo</span>
                        </div>
                        <Heart className="w-6 h-6 text-white" />
                        <Send className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= SECCIÓN DERECHA: Formulario ================= */}
          <div className="w-full max-w-[420px] flex flex-col items-center z-20 shrink-0 order-2 lg:order-2">
            <div className="bg-white w-full px-6 py-8 sm:px-8 sm:py-10 flex flex-col rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/80 min-h-[480px] justify-center relative">
              
              <div className="animate-slide-up-fade w-full flex flex-col">
                <div className="mb-8">
                  <div className="bg-blue-600 w-10 h-10 rounded-[10px] flex items-center justify-center mb-5 shadow-sm shadow-blue-600/20">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
                    Bienvenido a SANTUN
                  </h2>
                  <p className="text-[13px] text-slate-500 font-medium">
                    Ingresa tus credenciales para acceder al panel de control.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                      Correo Electrónico o Usuario
                    </label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@tedelpa.com"
                      className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-xl px-4 text-[14px] focus:bg-white focus:outline-none focus:ring-[2px] focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                        Contraseña
                      </label>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert('Contacte a su administrador.'); }} className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-11 text-[14px] focus:bg-white focus:outline-none focus:ring-[2px] focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full h-11 rounded-xl mt-3 text-[14px] font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                      !isSubmitting
                        ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98]' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ================= SECCIÓN INFERIOR: Aliados ================= */}
      <footer className="w-full py-8 sm:py-10 bg-white border-t border-slate-100 flex flex-col items-center justify-center z-10">
        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-6 text-center px-4">
          Con el respaldo de la arquitectura Laravel 12
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700 cursor-default px-6 text-slate-700 font-bold text-sm">
          <span>SANTUN ECOSYSTEM</span>
          <span>•</span>
          <span>LEXVAULT</span>
          <span>•</span>
          <span>POS SALES</span>
          <span>•</span>
          <span>CRM PIPELINE</span>
        </div>
      </footer>

    </div>
  );
};

export default LoginPage;
