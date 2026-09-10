'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle, 
  Play, 
  Video 
} from 'lucide-react';
import { loginMediaService } from '../services/loginMediaService';
import { PublicLoginVideoItem, PublicLoginLogoItem, LoginTexts, PublicWhiteLabelInfo } from '../types/loginMedia';
import { normalizeFileUrl } from '../services/apiClient';

const isMp4Video = (url?: string | null): boolean => {
  if (!url) return false;
  const clean = url.toLowerCase();
  return clean.endsWith('.mp4') || clean.includes('.mp4') || clean.startsWith('data:video/') || clean.includes('video');
};

// Componente dedicado con soporte nativo de autoplay, buffering y prevención de pantalla negra
const CardVideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.load();
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsLoaded(true))
          .catch((err) => {
            console.warn('Autoplay aviso:', err);
          });
      }
    }
  }, [src]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-slate-950">
      {/* Fondo degradado ambiental para evitar fotogramas o cuadros negros durante buffering */}
      <div 
        className={`absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900/60 via-indigo-950/80 to-slate-950 transition-opacity duration-700 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      {!hasError && (
        <video
          key={src}
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          onCanPlay={() => {
            setIsLoaded(true);
            videoRef.current?.play().catch(() => {});
          }}
          onLoadedData={() => {
            setIsLoaded(true);
            videoRef.current?.play().catch(() => {});
          }}
          onError={(e) => {
            console.warn('Error cargando video src:', src, e);
            setHasError(true);
          }}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 filter brightness-[0.95] contrast-[1.05] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

const rewardsData = [
  { 
    id: 1, 
    title: 'Propiedades Exclusivas', 
    subtitle: 'Gestión inmobiliaria premium',
    emoji: '🏢',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  { 
    id: 2, 
    title: 'Embudo CRM & Leads', 
    subtitle: 'Seguimiento automatizado',
    emoji: '🚀',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  { 
    id: 3, 
    title: 'Bóveda Legal LexVault', 
    subtitle: 'Contratos y firmas digitales',
    emoji: '📜',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  { 
    id: 4, 
    title: 'Ruleta & Recompensas', 
    subtitle: 'Gamificación de ventas',
    emoji: '🎁',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4',
  }
];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@tedelpa.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Estados dinámicos de videos, logos y textos configurables por Marca Blanca / Dominio
  const [dynamicWhiteLabel, setDynamicWhiteLabel] = useState<PublicWhiteLabelInfo | null>(null);
  const [dynamicVideos, setDynamicVideos] = useState<PublicLoginVideoItem[]>([]);
  const [dynamicLogos, setDynamicLogos] = useState<PublicLoginLogoItem[]>([]);
  const [dynamicTexts, setDynamicTexts] = useState<LoginTexts | null>(null);

  const { login, currentWhiteLabel, currentAgency, user } = useAuth();
  const router = useRouter();

  const activeWl = dynamicWhiteLabel || currentWhiteLabel || (user as any)?.white_label;
  const brandName = activeWl?.name || currentAgency?.name || 'SANTUN';
  const brandLogoRaw = activeWl?.logo || activeWl?.logo_2 || activeWl?.logo_icon || currentAgency?.logo || null;
  const brandLogo = brandLogoRaw ? normalizeFileUrl(brandLogoRaw) : null;
  const customLoginBg = activeWl?.login_background ? normalizeFileUrl(activeWl.login_background) : (currentAgency?.login_background || (typeof window !== 'undefined' ? localStorage.getItem('santun_login_background') : null));

  // Carga de configuración pública del login con resolución por dominio
  useEffect(() => {
    let isMounted = true;
    const loadConfiguration = async () => {
      try {
        const config = await loginMediaService.getPublicConfiguration();
        if (isMounted && config) {
          if (config.white_label) {
            setDynamicWhiteLabel(config.white_label);
          }
          if (config.texts) {
            setDynamicTexts(config.texts);
          }
          if (Array.isArray(config.videos) && config.videos.length > 0) {
            setDynamicVideos(config.videos);
          }
          if (Array.isArray(config.logos) && config.logos.length > 0) {
            setDynamicLogos(config.logos);
          }
        }
      } catch (e) {
        // En caso de error, el fallback asegura que la pantalla continúe operando normalmente
      }
    };

    loadConfiguration();
    return () => { isMounted = false; };
  }, []);

  // Lista efectiva de videos dinámicos si existen, de lo contrario fallback a rewardsData
  const effectiveVideos = (dynamicVideos.length > 0)
    ? dynamicVideos.map((dv, idx) => ({
        id: dv.id,
        title: dv.title,
        subtitle: dv.subtitle || rewardsData[idx % rewardsData.length]?.subtitle || 'Módulo empresarial interactivo',
        emoji: rewardsData[idx % rewardsData.length]?.emoji || '🏢',
        videoUrl: normalizeFileUrl(dv.url),
      }))
    : rewardsData;

  useEffect(() => {
    if (effectiveVideos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % effectiveVideos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [effectiveVideos.length]);

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
    const total = effectiveVideos.length;
    if (total <= 1) {
      return "transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-40 scale-100 translate-x-0 translate-y-0 opacity-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]";
    }
    const diff = (index - activeIndex + total) % total;
    const baseTransition = "transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]";

    if (diff === 0) {
      return `${baseTransition} z-40 scale-100 translate-x-0 translate-y-0 opacity-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]`;
    } else if (diff === 1) {
      return `${baseTransition} z-30 scale-[0.7] translate-x-[35%] -translate-y-4 rotate-[6deg] opacity-60 brightness-[0.6] shadow-xl`;
    } else if (diff === total - 1) {
      return `${baseTransition} z-30 scale-[0.7] -translate-x-[35%] -translate-y-4 -rotate-[6deg] opacity-60 brightness-[0.6] shadow-xl`;
    } else {
      return `${baseTransition} z-10 scale-[0.5] translate-x-0 -translate-y-10 opacity-0 pointer-events-none`;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] dark:bg-[#121413] flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden transition-colors">
      
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 md:p-12 relative z-10">
        <div className="w-full max-w-[1140px] flex flex-col lg:flex-row gap-10 lg:gap-24 items-center justify-center z-10">
          
          {/* ================= TEXTO MÓVIL (Solo visible < lg) ================= */}
          <div className="lg:hidden flex flex-col items-center text-center mt-6 px-4 order-1 max-w-[420px]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-blue-600 uppercase">
                {dynamicTexts?.portal_badge || `${brandName} Provider Portal`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight leading-[1.2] mb-3">
              {dynamicTexts?.main_title ? (
                <span>{dynamicTexts.main_title}</span>
              ) : (
                <>Plataforma de gestión empresarial y servicios <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">en tiempo real</span>.</>
              )}
            </h1>
          </div>

          {/* ================= SECCIÓN IZQUIERDA: Carrusel de Tarjetas con Video MP4 ================= */}
          <div className="flex w-full lg:w-[55%] flex-col items-center lg:items-start justify-center relative min-h-[400px] lg:min-h-[550px] order-3 lg:order-1 mt-8 lg:mt-0">
            
            <div className="hidden lg:block mb-12 z-40 max-w-[420px]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
                  {dynamicTexts?.portal_badge || `${brandName} Provider Portal`}
                </span>
              </div>
              
              <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight leading-[1.2] mb-3">
                {dynamicTexts?.main_title ? (
                  <span>{dynamicTexts.main_title}</span>
                ) : (
                  <>
                    Plataforma de gestión <br />
                    empresarial <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">conectada a Laravel</span>.
                  </>
                )}
              </h1>
              
              <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {dynamicTexts?.main_subtitle || 'Accede a tu panel centralizado para inmuebles, CRM, POS y documentos legales.'}
              </p>
            </div>

            {/* CARRUSEL DE TARJETAS CON REPRODUCCIÓN DE VIDEO MP4 INTEGRADO */}
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] h-[380px] sm:h-[440px] flex items-center justify-center mx-auto lg:mx-0 lg:ml-16">
              {effectiveVideos.map((reward, i) => {
                const videoSrc = (customLoginBg && isMp4Video(customLoginBg)) 
                  ? customLoginBg 
                  : reward.videoUrl;

                return (
                  <div 
                    key={reward.id} 
                    className={`absolute w-[230px] sm:w-[270px] h-[360px] sm:h-[420px] rounded-[24px] ${getCardStyle(i)}`}
                  >
                    <div className="w-full h-full rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden border border-white/20 bg-slate-900 text-white shadow-2xl">
                      
                      {/* Video MP4 reproducido mediante el componente dedicado CardVideoPlayer */}
                      {videoSrc && <CardVideoPlayer src={videoSrc} />}

                      {/* Capa de degradado dentro de la tarjeta optimizada para claridad y vibrancia de video */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/30 z-10 pointer-events-none" />

                      {/* Encabezado de la Tarjeta */}
                      <div className="flex justify-between items-center z-20">
                        <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white/90 text-[11px] font-semibold flex items-center gap-1.5 border border-white/20 shadow-sm">
                          <Star className="w-3 h-3 fill-current text-amber-400" /> {dynamicTexts?.card_badge || `${brandName} Premium`}
                        </div>
                        <div className="bg-black/30 backdrop-blur-md p-1 rounded-full border border-white/10 flex items-center gap-1 px-2 text-[10px] text-blue-300 font-bold">
                          <Video className="w-3 h-3 text-blue-400 animate-pulse" /> MP4
                        </div>
                      </div>

                      {/* Pie de la Tarjeta */}
                      <div className="z-20 flex flex-col gap-3">
                        <div>
                          <h3 className="text-white font-bold text-xl tracking-tight mb-1 flex items-center gap-2 drop-shadow-md">
                            {reward.title} {reward.emoji}
                          </h3>
                          <p className="text-white/90 text-[13px] font-medium drop-shadow-xs">
                            {reward.subtitle}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-grow h-10 rounded-full border border-white/30 bg-black/40 backdrop-blur-md flex items-center px-4 shadow-sm hover:bg-black/60 transition-colors">
                            <span className="text-white text-[12px] font-semibold flex items-center gap-1.5">
                              <Play className="w-3 h-3 text-blue-400 fill-blue-400" /> {dynamicTexts?.card_button_text || 'Explorar módulo'}
                            </span>
                          </div>
                          <Heart className="w-6 h-6 text-white hover:text-pink-400 transition-colors cursor-pointer" />
                          <Send className="w-6 h-6 text-white hover:text-blue-400 transition-colors cursor-pointer" />
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ================= SECCIÓN DERECHA: Formulario de Login ================= */}
          <div className="w-full max-w-[420px] flex flex-col items-center z-20 shrink-0 order-2 lg:order-2">
            <div className="bg-white dark:bg-slate-900 w-full px-6 py-8 sm:px-8 sm:py-10 flex flex-col rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-slate-100/80 dark:border-slate-800 min-h-[480px] justify-center relative">
              
              <div className="animate-slide-up-fade w-full flex flex-col">
                <div className="mb-8">
                  {brandLogo ? (
                    <img src={brandLogo} alt={brandName} className="h-10 max-w-[160px] object-contain mb-5" />
                  ) : (
                    <div className="bg-blue-600 w-10 h-10 rounded-[10px] flex items-center justify-center mb-5 shadow-sm shadow-blue-600/20">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1.5">
                    {dynamicTexts?.form_title ? (
                      dynamicTexts.form_title.includes('{brand}')
                        ? dynamicTexts.form_title.replace('{brand}', brandName)
                        : dynamicTexts.form_title
                    ) : (
                      `Bienvenido a ${brandName}`
                    )}
                  </h2>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                    {dynamicTexts?.form_subtitle || 'Ingresa tus credenciales para acceder al panel de control.'}
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
                      className="w-full h-11 bg-slate-50/50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-[14px] focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-[2px] focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
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
                        className="w-full h-11 bg-slate-50/50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-11 text-[14px] focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-[2px] focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
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
      <footer className="w-full py-8 sm:py-10 bg-white dark:bg-[#121413] border-t border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center z-10">
        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-6 text-center px-4">
          {dynamicTexts?.footer_text || 'Con el respaldo de la arquitectura Laravel 12 & Next.js'}
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16 px-6">
          {dynamicLogos.length > 0 ? (
            dynamicLogos.map((logo) => (
              <div key={logo.id} className="flex items-center justify-center transition-all duration-300 opacity-100 hover:scale-105 cursor-default">
                {logo.url ? (
                  <img
                    src={normalizeFileUrl(logo.url)}
                    alt={logo.name}
                    className="h-8 sm:h-10 max-h-10 max-w-[140px] object-contain drop-shadow-xs"
                  />
                ) : (
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-sm tracking-wider uppercase">
                    {logo.name}
                  </span>
                )}
              </div>
            ))
          ) : (
            <>
              <span className="text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm tracking-wider uppercase">{brandName.toUpperCase()} ECOSYSTEM</span>
              <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm tracking-wider uppercase">LEXVAULT</span>
              <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm tracking-wider uppercase">POS SALES</span>
              <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm tracking-wider uppercase">CRM PIPELINE</span>
            </>
          )}
        </div>
      </footer>

    </div>
  );
};

export default LoginPage;
