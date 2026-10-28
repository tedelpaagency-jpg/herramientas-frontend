'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  ChevronRight,
  Send,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import publicInmobiliariaService, {
  PublicAgencyConfig,
} from '@/services/publicInmobiliariaService';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import Header2Style3 from '@/components/layout/Header2Style3';
import Footer from '@/components/layout/Footer';
import { DEFAULT_FALLBACK_AGENCY } from '@/constants/realEstateDefaults';

export const PublicInmobiliariaContactView: React.FC = () => {
  const searchParams = useSearchParams();
  const domainParam = searchParams?.get('domain') || null;

  const [agency, setAgency] = useState<PublicAgencyConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Comprar una propiedad');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  useEffect(() => {
    let active = true;
    publicInmobiliariaService
      .getConfig(domainParam || undefined)
      .then((res) => {
        if (active && res.data) {
          setAgency(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [domainParam]);

  const effectiveAgency: PublicAgencyConfig = agency || DEFAULT_FALLBACK_AGENCY;
  const primaryColor = effectiveAgency.primary_color || '#00a884';

  const rawAgencyName = effectiveAgency.name || 'Inmobiliaria';
  const agencyName =
    rawAgencyName === 'Portal Inmobiliario' && effectiveAgency.commercial_name
      ? effectiveAgency.commercial_name
      : rawAgencyName === 'Portal Inmobiliario'
      ? 'Inmobiliaria'
      : rawAgencyName;

  const agencyPhone = effectiveAgency.phone || effectiveAgency.whatsapp || '+52 55 1234 5678';
  const rawPhone = agencyPhone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  const waPhone = rawPhone.replace('+', '');
  const agencyEmail = effectiveAgency.email || 'contacto@inmobiliaria.com';
  const fullAddress =
    [effectiveAgency.address, effectiveAgency.city, effectiveAgency.province]
      .filter(Boolean)
      .join(', ') || 'Centro Corporativo Inmobiliario';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatus('error');
      setResponseMsg('Por favor completa tu nombre y mensaje.');
      return;
    }

    setSubmitting(true);
    setStatus('idle');
    setResponseMsg('');

    try {
      const res = await publicInmobiliariaService.sendContactMessage(
        {
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          subject,
          message: message.trim(),
        },
        domainParam || undefined
      );

      setStatus('success');
      setResponseMsg(res.message || '¡Tu mensaje ha sido enviado exitosamente! Nos contactaremos contigo muy pronto.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setResponseMsg(err.message || 'Ocurrió un error al enviar el mensaje. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="travel-agency-03-root min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header con Topbar slider */}
      <TopbarSlider agency={effectiveAgency} />
      <Header2Style3 agency={effectiveAgency} />

      {/* 2. Hero Breadcrumb Header */}
      <section className="relative py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00a884_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <nav className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-slate-300 mb-4 border border-white/10">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-400 font-bold">Contacto</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
            Estamos Aquí para Asesorarte
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            ¿Deseas comprar, vender o rentar un inmueble? Ponte en contacto con los asesores certificados de{' '}
            <strong className="text-white">{agencyName}</strong>.
          </p>
        </div>
      </section>

      {/* 3. Contenido Principal de Contacto */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Columna Izquierda: Tarjetas de Información de Contacto */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black tracking-wide uppercase border border-emerald-200/60">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Canales de Atención</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Comunícate con Nuestros Especialistas
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Elige el medio de tu preferencia. Nuestro equipo te brindará respuesta inmediata y seguimiento profesional personalizado.
              </p>

              {/* Cards de Información */}
              <div className="space-y-4 pt-2">
                {/* Teléfono y WhatsApp */}
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all duration-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Llamada Telefónica
                      </span>
                      <a
                        href={`tel:${rawPhone}`}
                        className="text-sm sm:text-base font-black text-slate-900 hover:text-emerald-700 transition-colors"
                      >
                        {agencyPhone}
                      </a>
                    </div>
                  </div>

                  {waPhone && (
                    <a
                      href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                        `Hola ${agencyName}, me comunico desde su portal inmobiliario para solicitar asesoría.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Escribir por WhatsApp</span>
                    </a>
                  )}
                </div>

                {/* Correo Electrónico */}
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all duration-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Correo Electrónico
                    </span>
                    <a
                      href={`mailto:${agencyEmail}`}
                      className="text-sm sm:text-base font-black text-slate-900 hover:text-emerald-700 transition-colors break-all"
                    >
                      {agencyEmail}
                    </a>
                  </div>
                </div>

                {/* Dirección / Ubicación */}
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all duration-200 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Oficina Principal
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      {fullAddress}
                    </p>
                  </div>
                </div>

                {/* Horario */}
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all duration-200 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Horario de Atención
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      Lunes a Viernes: 08:30 – 18:30 hrs<br />
                      Sábados: 09:00 – 14:00 hrs
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario de Contacto Interactivo */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-7 sm:p-10 relative overflow-hidden">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Envíanos tu Consulta
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                    Completa el formulario y uno de nuestros agentes te contactará de inmediato.
                  </p>
                </div>

                {/* Banner de Estado */}
                {status === 'success' && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold leading-relaxed">{responseMsg}</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold leading-relaxed">{responseMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre Completo */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Juan Carlos Pérez"
                      className="w-full px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/60 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Correo Electrónico */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/60 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-2xs"
                      />
                    </div>

                    {/* Teléfono / WhatsApp */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+52 55 1234 5678"
                        className="w-full px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/60 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Asunto / Interés */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Interés Principal
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/60 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-2xs cursor-pointer"
                    >
                      <option value="Comprar una propiedad">Deseo comprar una propiedad</option>
                      <option value="Alquilar o Rentar">Deseo alquilar / rentar un inmueble</option>
                      <option value="Vender mi propiedad">Deseo consignar / vender mi propiedad</option>
                      <option value="Asesoría Legal e Hipotecaria">Asesoría Legal e Hipotecaria</option>
                      <option value="Consulta General">Consulta general</option>
                    </select>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Mensaje / Detalles de tu Búsqueda *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Indícanos qué tipo de propiedad buscas, zona, presupuesto o cualquier duda..."
                      className="w-full px-4 py-3 text-xs sm:text-sm font-medium rounded-xl border border-slate-300 bg-slate-50/60 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-2xs"
                    />
                  </div>

                  {/* Botón de Enviar */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-black text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition-all duration-150 shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Enviando mensaje...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Mensaje a Asesoría</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center font-medium pt-1">
                    Tus datos se encuentran 100% protegidos y serán tratados con absoluta confidencialidad.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <Footer agency={effectiveAgency} />
    </div>
  );
};

export default PublicInmobiliariaContactView;

