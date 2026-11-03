'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import {
  getCachedAgencyConfig,
  publicInmobiliariaService,
  PublicAgencyConfig,
} from '@/services/publicInmobiliariaService';
import Header2Style3 from '@/components/layout/Header2Style3';
import Footer from '@/components/layout/Footer';

export const PublicInmobiliariaPrivacyView: React.FC = () => {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get('domain');

  const [agency, setAgency] = useState<PublicAgencyConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = getCachedAgencyConfig();
    if (cached) {
      setAgency(cached);
      setLoading(false);
    }

    const currentDomain =
      domainParam || (typeof window !== 'undefined' ? window.location.hostname : undefined);

    publicInmobiliariaService.getConfig(currentDomain)
      .then((res) => {
        if (res?.data) setAgency(res.data);
      })
      .finally(() => setLoading(false));
  }, [domainParam]);

  const agencyName = agency?.commercial_name || agency?.name || 'Immobillis';
  const primaryColor = agency?.primary_color || '#2067F5';
  const agencyEmail = agency?.email || 'informacion@immobillis.com';
  const agencyPhone = agency?.phone || agency?.whatsapp || '+593 0984113967';
  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '') || '593984113967';
  const agencyCity = agency?.city || 'Quevedo';
  const agencyCountry = agency?.country || 'Ecuador';

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header2Style3 />

      {/* Header / Hero de Privacidad */}
      <section className="relative py-14 lg:py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-emerald-400 text-xs font-black uppercase tracking-wider backdrop-blur-md border border-white/10">
            <ShieldCheck className="w-4 h-4" />
            <span>Transparencia &amp; Protección de Datos</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Política de Privacidad y Uso de Datos
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            En <span className="text-white font-bold">{agencyName}</span> valoramos su confianza y garantizamos la seguridad, confidencialidad y correcto tratamiento de su información personal.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors no-underline">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-200 font-semibold">Política de Privacidad</span>
          </div>
        </div>
      </section>

      {/* Cuerpo Principal del Documento Legal */}
      <main className="flex-1 py-14 lg:py-20 bg-slate-50/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Tarjeta de Resumen / Compromiso */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 m-0">
                  Compromiso con su Privacidad
                </h2>
                <p className="text-xs text-slate-500 m-0">
                  Última actualización: {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              La presente Política de Privacidad regula el tratamiento de los datos personales recabados a través de este portal inmobiliario y de nuestros canales de atención comercial y digital. Cumplimos con los principios internacionales de licitud, consentimiento, finalidad, lealtad y seguridad de los datos.
            </p>
          </div>

          {/* 1. Responsable del Tratamiento */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-base sm:text-lg font-black m-0">
                1. Responsable del Tratamiento de sus Datos
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              El responsable directo de la recolección, almacenamiento y tratamiento de sus datos personales es:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 font-semibold text-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Razón Social / Nombre:</span>
                {agencyName}
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Ubicación:</span>
                {agencyCity}, {agencyCountry}
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Correo de Privacidad:</span>
                <a href={`mailto:${agencyEmail}`} className="text-blue-600 hover:underline">
                  {agencyEmail}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Teléfono de Contacto:</span>
                <a href={`tel:${agencyPhone}`} className="text-blue-600 hover:underline">
                  {agencyPhone}
                </a>
              </div>
            </div>
          </section>

          {/* 2. Datos Personales Recabados */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base sm:text-lg font-black m-0">
                2. Datos Personales que Recabamos
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              En función de su interacción con nosotros (solicitud de información, consignación de propiedad, agendamiento de visitas o contratación de servicios), recopilamos los siguientes datos:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 p-0 m-0 list-none">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Datos de Contacto e Identificación:</strong> Nombres completos, número de cédula o pasaporte, correo electrónico, número de WhatsApp o telefónico.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Preferencias Inmobiliarias:</strong> Tipología de inmueble buscado (casa, departamento, terreno, bodega, etc.), presupuesto aproximado, ubicación geográfica deseada y amenidades requeridas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Datos del Inmueble en Consignación:</strong> Dirección, metraje, planos, certificados de gravamen, fotografías y títulos de propiedad aportados voluntariamente para promoción.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Datos de Navegación:</strong> Dirección IP, tipo de dispositivo y navegador para optimizar el rendimiento y la seguridad del portal.</span>
              </li>
            </ul>
          </section>

          {/* 3. Finalidades del Tratamiento */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900">
              <Eye className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base sm:text-lg font-black m-0">
                3. Finalidades del Tratamiento
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tratamos su información exclusivamente con las siguientes finalidades legítimas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Intermediación Inmobiliaria</h4>
                <p className="text-xs text-slate-600 m-0">
                  Coordinar visitas, absolver dudas técnicas y legales, y facilitar las negociaciones de compraventa o arrendamiento.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Elaboración Contractual</h4>
                <p className="text-xs text-slate-600 m-0">
                  Redactar promesas de compraventa, contratos de arrendamiento y coordinar trámites notariales y registrales.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Comunicaciones y Ofertas</h4>
                <p className="text-xs text-slate-600 m-0">
                  Notificarle sobre nuevas propiedades que se ajusten estrictamente a su presupuesto e intereses específicos.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Cumplimiento Legal y Prevención</h4>
                <p className="text-xs text-slate-600 m-0">
                  Atender regulaciones contra el lavado de activos, financiamiento del terrorismo y requerimientos de organismos de control.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Derechos ARCO */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900">
              <UserCheck className="w-5 h-5 text-amber-500" />
              <h3 className="text-base sm:text-lg font-black m-0">
                4. Sus Derechos (Acceso, Rectificación, Cancelación y Oposición)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Como titular de sus datos personales, usted tiene derecho a:
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600">
              <p className="m-0"><strong>&bull; Acceso:</strong> Solicitar conocer qué datos personales tenemos en nuestros registros y el uso que se les da.</p>
              <p className="m-0"><strong>&bull; Rectificación:</strong> Pedir la corrección inmediata de datos erróneos, incompletos o desactualizados.</p>
              <p className="m-0"><strong>&bull; Cancelación o Eliminación:</strong> Solicitar la eliminación total de sus datos cuando ya no sean requeridos para los fines contratados.</p>
              <p className="m-0"><strong>&bull; Oposición:</strong> Negarse en cualquier momento a que utilicemos sus datos para el envío de boletines o publicidad comercial.</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>¿Cómo ejercer sus derechos?</strong> Envíe un correo electrónico a{' '}
                <a href={`mailto:${agencyEmail}?subject=Ejercicio%20de%20Derechos%20ARCO`} className="font-bold underline text-amber-950">
                  {agencyEmail}
                </a>{' '}
                adjuntando copia de su cédula o documento de identidad e indicando el derecho que desea ejercer. Responderemos en un plazo máximo de 5 días hábiles.
              </div>
            </div>
          </section>

          {/* 5. Seguridad y Transferencias */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base sm:text-lg font-black m-0">
                5. Seguridad de la Información y Transferencias
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Adoptamos rigurosas medidas técnicas, administrativas y físicas para proteger sus datos personales contra daño, pérdida, alteración, destrucción o uso no autorizado. Nunca vendemos ni alquilamos su información personal a terceros.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sus datos únicamente podrán ser transferidos a notarios públicos, instituciones financieras (si solicita gestión de crédito hipotecario) o autoridades competentes por mandato judicial o legal expreso.
            </p>
          </section>

          {/* Tarjeta de Contacto Directo */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-black text-white m-0">
                ¿Tiene dudas sobre el tratamiento de sus datos?
              </h4>
              <p className="text-xs text-slate-300 m-0">
                Nuestro oficial de privacidad está listo para asesorarle en cualquier momento.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`mailto:${agencyEmail}`}
                className="px-4 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all no-underline shadow-xs"
              >
                Escribir al Correo
              </a>
              <a
                href={`https://wa.me/${cleanPhone}?text=Hola,%20deseo%20consultar%20sobre%20el%20tratamiento%20de%20mis%20datos%20personales.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all no-underline shadow-xs flex items-center gap-1.5"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer agency={agency || undefined} />
    </div>
  );
};

export default PublicInmobiliariaPrivacyView;
