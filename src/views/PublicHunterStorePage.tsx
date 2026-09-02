'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Globe,
  Clock,
  ArrowRight,
  MessageSquare,
  Video,
  Play,
} from 'lucide-react';
import { HunterStore } from '../types/hunter';
import hunterService from '../services/hunterService';
import toast from 'react-hot-toast';

interface PublicHunterStorePageProps {
  idOrToken: string;
}

export const PublicHunterStorePage: React.FC<PublicHunterStorePageProps> = ({ idOrToken }) => {
  const [store, setStore] = useState<HunterStore | null>(null);
  const [agency, setAgency] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchPublicStore = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await hunterService.getPublicStore(idOrToken);
        setStore(data.store);
        setAgency(data.agency);
      } catch (err: any) {
        console.error('Error loading public hunter store:', err);
        setError(err?.response?.data?.message || 'La tienda o asesor Hunter no fue encontrado o ha expirado.');
      } finally {
        setIsLoading(false);
      }
    };

    if (idOrToken) {
      fetchPublicStore();
    }
  }, [idOrToken]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      toast.error('Por favor ingrese su nombre completo');
      return;
    }

    setIsSubmitting(true);
    try {
      await hunterService.submitPublicRequest(idOrToken, {
        client_name: clientName,
        email: email || undefined,
        phone: phone || undefined,
        service_name: serviceName || 'Solicitud de Información General',
        comments: comments || undefined,
      });

      setIsSubmitted(true);
      toast.success('¡Registro enviado exitosamente!');
    } catch (err: any) {
      console.error('Error submitting hunter request:', err);
      toast.error(err?.response?.data?.message || 'Error al enviar la solicitud. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-800">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500">Cargando perfil del asesor Hunter...</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Tienda o Asesor no disponible</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error || 'El enlace de la tienda Hunter no es válido o ha finalizado su periodo de vigencia.'}
          </p>
          <div className="pt-2 text-xs text-slate-400 font-medium">
            Contacte directamente con soporte o con la agencia emisora del enlace.
          </div>
        </div>
      </div>
    );
  }

  const locationText = [store.canton, store.province, store.country || 'Ecuador'].filter(Boolean).join(', ');

  // Helper function to render media player / image preview on the left panel
  const renderMediaContent = () => {
    if (store.media_type === 'video' && store.media_url) {
      if (store.media_url.includes('youtube.com') || store.media_url.includes('youtu.be')) {
        let embedUrl = store.media_url;
        if (store.media_url.includes('watch?v=')) {
          const videoId = store.media_url.split('watch?v=')[1]?.split('&')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1`;
        } else if (store.media_url.includes('youtu.be/')) {
          const videoId = store.media_url.split('youtu.be/')[1]?.split('?')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1`;
        }
        return (
          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 relative">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Promocional Hunter"
            />
          </div>
        );
      }

      return (
        <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 relative">
          <video
            src={store.media_url}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // Default Image Media Hero Card (Split Screen Left side - Light style card container)
    const mediaImgSrc = store.media_url || agency?.banner || '/hunter_store_promo_hero_1788379001819.jpg';

    return (
      <div className="w-full h-[340px] sm:h-[400px] lg:h-[460px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative group">
        <img
          src={mediaImgSrc}
          alt={store.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700"
          onError={(e) => {
            (e.target as any).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> Asesor Aliado Oficial
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/90 text-slate-900 font-extrabold text-[10px] shadow-sm backdrop-blur-md">
              Atención Personalizada
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-sm">
            {store.name}
          </h2>

          <p className="text-xs text-slate-200 font-medium line-clamp-2 max-w-lg">
            Registra tus datos a continuación para recibir atención inmediata de nuestro asesor comercial verificado.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden font-sans">
      {/* Soft Pastel Background Ambient Glow Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-blue-200/50 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-indigo-200/40 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-sky-200/50 rounded-full blur-[140px]" />
      </div>

      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 md:p-10 relative z-10">
        <div className="w-full max-w-[1180px] flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center">
          
          {/* ================= SECCIÓN IZQUIERDA: Contenido Visual Claro (Media / Video / Branding) ================= */}
          <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start justify-center space-y-6">
            
            {/* Header Branding Badge */}
            <div className="w-full space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[11px] uppercase tracking-wider shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{agency?.name || 'SANTUN Hunter Network'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Conéctate con tu asesor <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Hunter de confianza</span>.
              </h1>

              {locationText && (
                <p className="text-xs text-slate-600 font-bold flex items-center justify-center lg:justify-start gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{locationText}</span>
                  {store.ruc_dni && (
                    <span className="ml-2 font-mono text-slate-400">• RUC/DNI: {store.ruc_dni}</span>
                  )}
                </p>
              )}
            </div>

            {/* Media Player / Promo Hero Image */}
            <div className="w-full">
              {renderMediaContent()}
            </div>

            {/* Contact Quick Chips */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {store.phone && (
                <a
                  href={`https://wa.me/${store.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 transition-all font-bold text-xs shadow-sm group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-emerald-600/20">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-[10px] uppercase font-bold text-emerald-700">WhatsApp Directo</p>
                    <p className="truncate font-mono text-emerald-950 font-black">{store.phone}</p>
                  </div>
                </a>
              )}

              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-900 transition-all font-bold text-xs shadow-sm group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-blue-600/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-[10px] uppercase font-bold text-blue-700">Correo de Contacto</p>
                    <p className="truncate font-mono text-blue-950 font-black">{store.email}</p>
                  </div>
                </a>
              )}
            </div>

          </div>

          {/* ================= SECCIÓN DERECHA: Formulario de Captura Claro (Estilo Card) ================= */}
          <div className="w-full max-w-[440px] flex flex-col items-center z-20 shrink-0">
            <div className="bg-white w-full px-6 py-8 sm:px-8 sm:py-9 flex flex-col rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-200/80 relative">
              
              {isSubmitted ? (
                /* SUCCESS STATE CLARO */
                <div className="animate-in fade-in space-y-6 text-center py-4">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-lg">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">¡Solicitud Registrada!</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Muchas gracias <strong className="text-slate-900">{clientName}</strong>. Tu información fue enviada a nuestro asesor comercial <strong className="text-blue-600">{store.name}</strong>.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
                    <p className="text-slate-400 uppercase text-[10px] font-bold">Resumen de Registro:</p>
                    <p><span className="text-slate-500">Cliente:</span> <span className="text-slate-900 font-bold">{clientName}</span></p>
                    {phone && <p><span className="text-slate-500">Teléfono:</span> <span className="text-emerald-700 font-bold">{phone}</span></p>}
                    {serviceName && <p><span className="text-slate-500">Servicio:</span> <span className="text-purple-700 font-bold">{serviceName}</span></p>}
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    {store.phone && (
                      <a
                        href={`https://wa.me/${store.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${store.name}, acabo de registrar mis datos en tu tienda Hunter. Mi nombre es ${clientName}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Abrir WhatsApp Ahora</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setClientName('');
                        setEmail('');
                        setPhone('');
                        setServiceName('');
                        setComments('');
                      }}
                      className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Enviar Otra Solicitud
                    </button>
                  </div>
                </div>
              ) : (
                /* CAPTURE FORM CLARO */
                <div className="w-full flex flex-col space-y-6">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 mb-3">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Registro de Información
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Completa tus datos para recibir atención directa de tu asesor.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitRequest} className="space-y-4">
                    {/* Client Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej. Carlos Mendoza"
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 font-bold text-xs transition-all"
                      />
                    </div>

                    {/* WhatsApp & Email */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                          WhatsApp / Teléfono *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ej. 0991234567"
                          className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 font-bold text-xs transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                          Correo Electrónico (Opcional)
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ejemplo@correo.com"
                          className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 font-bold text-xs transition-all"
                        />
                      </div>
                    </div>

                    {/* Service Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Servicio de Interés / Asunto
                      </label>
                      <input
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="Ej. Asesoría de Visas, Paquete de Viaje, Inmueble..."
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 font-bold text-xs transition-all"
                      />
                    </div>

                    {/* Comments */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Comentarios / Detalles
                      </label>
                      <textarea
                        rows={2}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Cualquier información adicional para tu asesor..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 font-medium text-xs transition-all resize-none"
                      />
                    </div>

                    {/* Privacy notice */}
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Tus datos están protegidos y sólo se transmiten al asesor oficial.</span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Enviando Registro...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Solicitud al Asesor</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 font-mono">
        <p>SANTUN Hunter Portal • Red de Asesores Aliados</p>
      </footer>
    </div>
  );
};

export default PublicHunterStorePage;
