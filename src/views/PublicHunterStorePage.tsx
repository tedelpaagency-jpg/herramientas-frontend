'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  MessageSquare,
  User,
} from 'lucide-react';
import { HunterStore } from '../types/hunter';
import hunterService from '../services/hunterService';
import { normalizeFileUrl } from '../services/apiClient';
import toast from 'react-hot-toast';

interface PublicHunterStorePageProps {
  idOrToken: string;
}

export const PublicHunterStorePage: React.FC<PublicHunterStorePageProps> = ({ idOrToken }) => {
  const [store, setStore] = useState<HunterStore | null>(null);
  const [agency, setAgency] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State (Actual Hunter Lead Capture Fields)
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
    if (!phone.trim()) {
      toast.error('Por favor ingrese su número de teléfono o WhatsApp');
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-slate-800">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600">Cargando perfil del asesor Hunter...</p>
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

  // Single Resource (Image or Video)
  const rawMediaUrl = store.media?.url || store.media_url;
  const isLinkedVideo = store.media?.mime_type?.startsWith('video/') || (rawMediaUrl && rawMediaUrl.match(/\.(mp4|webm|mov|ogg)($|\?)/i));
  const effectiveMediaType = isLinkedVideo ? 'video' : (store.media_type || 'image');

  const mediaImgSrc =
    normalizeFileUrl(rawMediaUrl) ||
    normalizeFileUrl(store.photo) ||
    normalizeFileUrl(agency?.banner) ||
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans p-3 sm:p-6 md:p-8 lg:p-10">
      <main className="flex-1 w-full max-w-[1240px] mx-auto flex items-center justify-center">
        {/* Main Split Card: White Background Container */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.06)] border border-slate-200/80 p-3 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            
            {/* ================= COLUMNA IZQUIERDA: UN SOLO RECURSO (MEDIA + TÍTULO Y TEXTO SUPERPUESTOS) ================= */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col">
              <div className="relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[640px] rounded-[2rem] overflow-hidden bg-slate-950 flex flex-col justify-between shadow-md group">
                
                {/* Visual Media (Image or Video) */}
                {effectiveMediaType === 'video' && rawMediaUrl ? (
                  rawMediaUrl.includes('youtube.com') || rawMediaUrl.includes('youtu.be') ? (
                    (() => {
                      let embedUrl = rawMediaUrl;
                      if (rawMediaUrl.includes('watch?v=')) {
                        const videoId = rawMediaUrl.split('watch?v=')[1]?.split('&')[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1`;
                      } else if (rawMediaUrl.includes('youtu.be/')) {
                        const videoId = rawMediaUrl.split('youtu.be/')[1]?.split('?')[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1`;
                      }
                      return (
                        <iframe
                          src={embedUrl}
                          className="absolute inset-0 w-full h-full border-0 object-cover"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Promocional Hunter"
                        />
                      );
                    })()
                  ) : (
                    <video
                      src={normalizeFileUrl(rawMediaUrl)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )
                ) : (
                  <img
                    src={mediaImgSrc}
                    alt={store.name}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700"
                    onError={(e) => {
                      (e.target as any).src =
                        'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                )}

                {/* Top Overlay: Logo / Brand Badge */}
                <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white shadow-md">
                    {agency?.logo ? (
                      <img
                        src={normalizeFileUrl(agency.logo)}
                        alt={agency.name}
                        className="w-5 h-5 rounded-full object-contain bg-white/90 p-0.5"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px] shadow-sm">
                        <Sparkles className="w-3 h-3 text-slate-950" />
                      </div>
                    )}
                    <span className="font-extrabold text-xs tracking-wide">
                      {agency?.name || 'SANTUN Hunter Network'}
                    </span>
                  </div>

                  {locationText && (
                    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-white/90 text-[11px] font-bold">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{locationText}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Overlay: Indicators + Title + Subtitle Text */}
                <div className="relative z-10 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-6 sm:p-8 lg:p-10 flex flex-col justify-end pt-24">
                  {/* Mockup-style dash indicators */}
                  <div className="flex items-center gap-2 mb-3.5">
                    <span className="w-8 h-1 bg-white rounded-full shadow-xs" />
                    <span className="w-2.5 h-1 bg-white/40 rounded-full" />
                    <span className="w-2.5 h-1 bg-white/40 rounded-full" />
                  </div>

                  {/* Image Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
                    {store.name}
                  </h1>

                  {/* Image Description Text */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-lg drop-shadow-sm">
                    {store.address ? `${store.address}. ` : locationText ? `${locationText}. ` : ''}
                    Asesor comercial verificado para acompañarte con atención inmediata, personalizada y transparente en todos tus requerimientos.
                  </p>

                  {/* Direct Contact Quick Chips in Overlay */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-2 border-t border-white/15">
                    {store.phone && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-white font-mono text-[11px] font-bold">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        {store.phone}
                      </span>
                    )}
                    {store.email && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-white text-[11px] font-bold">
                        <Mail className="w-3 h-3 text-sky-400" />
                        {store.email}
                      </span>
                    )}
                    {store.ruc_dni && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md text-white/80 font-mono text-[10px]">
                        ID: {store.ruc_dni}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* ================= COLUMNA DERECHA: FORMULARIO CON FONDO BLANCO Y DATOS ACTUALES ================= */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 bg-white">
              {isSubmitted ? (
                /* SUCCESS STATE */
                <div className="w-full max-w-md mx-auto space-y-6 text-center py-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      ¡Solicitud Registrada!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                      Muchas gracias <strong className="text-slate-900">{clientName}</strong>. Tu información ha sido enviada con éxito a nuestro asesor comercial <strong className="text-slate-900">{store.name}</strong>.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 text-left text-xs space-y-2.5 font-medium">
                    <p className="text-slate-400 uppercase text-[10px] font-black tracking-wider">Detalles del Registro</p>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Cliente:</span>
                      <span className="text-slate-900 font-bold">{clientName}</span>
                    </div>
                    {phone && (
                      <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Teléfono:</span>
                        <span className="text-emerald-700 font-bold font-mono">{phone}</span>
                      </div>
                    )}
                    {email && (
                      <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Correo:</span>
                        <span className="text-slate-800 font-medium">{email}</span>
                      </div>
                    )}
                    {serviceName && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-500">Servicio:</span>
                        <span className="text-amber-700 font-bold">{serviceName}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    {store.phone && (
                      <a
                        href={`https://wa.me/${store.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${store.name}, acabo de registrar mis datos en tu tienda Hunter. Mi nombre es ${clientName}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
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
                      className="w-full py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Enviar Otra Solicitud
                    </button>
                  </div>
                </div>
              ) : (
                /* CAPTURE FORM */
                <div className="w-full max-w-lg mx-auto flex flex-col space-y-6">
                  {/* Top Badge & Header */}
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-black text-[11px] uppercase tracking-wider shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Atención Prioritaria</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Solicitar Información
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Completa tus datos para recibir asesoría personalizada y directa.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmitRequest} className="space-y-4">
                    {/* Fila 1: Nombre Completo y WhatsApp/Teléfono (2 Columnas estilo Mockup) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                          Nombre Completo *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Ej. Carlos Mendoza"
                            className="w-full h-12 pl-10 pr-3.5 bg-slate-50/90 hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                          Teléfono / WhatsApp *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ej. 0991234567"
                            className="w-full h-12 pl-10 pr-3.5 bg-slate-50/90 hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fila 2: Correo Electrónico (Opcional) */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                        Correo Electrónico (Opcional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nombre@ejemplo.com"
                          className="w-full h-12 pl-10 pr-4 bg-slate-50/90 hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Fila 3: Servicio de Interés / Asunto */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                        Servicio o Trámite de Interés
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={serviceName}
                          onChange={(e) => setServiceName(e.target.value)}
                          placeholder="Ej. Asesoría de Visas, Inmueble, Crédito..."
                          className="w-full h-12 pl-10 pr-4 bg-slate-50/90 hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Fila 4: Comentarios o Detalles */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                        Comentarios o Detalles
                      </label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <textarea
                          rows={2}
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="Escribe aquí cualquier detalle adicional para tu asesor..."
                          className="w-full pl-10 pr-4 py-3 bg-slate-50/90 hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit CTA Button (Inspirado en el botón ámbar del diseño) */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-13 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.99] text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-400/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Enviando Solicitud...</span>
                        </>
                      ) : (
                        <>
                          <span>Enviar Solicitud</span>
                          <ArrowRight className="w-4 h-4 font-bold" />
                        </>
                      )}
                    </button>

                    {/* Opciones directas y sellos de seguridad */}
                    {store.phone && (
                      <div className="pt-1">
                        <div className="relative flex items-center justify-center my-2">
                          <div className="border-t border-slate-200 w-full" />
                          <span className="bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">O</span>
                          <div className="border-t border-slate-200 w-full" />
                        </div>

                        <a
                          href={`https://wa.me/${store.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${store.name}, deseo información sobre tus servicios.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-800 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs group"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                          <span>Contactar directamente por WhatsApp</span>
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-slate-400 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Tus datos están protegidos y se envían de forma confidencial.</span>
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-8 text-center text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} {agency?.name || 'SANTUN Hunter'} • Portal Oficial de Asesores Aliados</p>
      </footer>
    </div>
  );
};

export default PublicHunterStorePage;
