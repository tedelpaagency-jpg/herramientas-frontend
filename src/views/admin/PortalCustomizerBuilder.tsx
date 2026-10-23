'use client';

import React, { useState } from 'react';
import {
  Globe, Sparkles, Building2, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle,
  RefreshCw, Loader2, ExternalLink, Eye, Image as ImageIcon, Laptop, Tablet, Smartphone,
  Share2, Search, Check, Palette, ArrowUpRight, HelpCircle
} from 'lucide-react';
import MediaPicker from '@/components/media/MediaPicker';
import PortalLivePreview from '@/components/inmobiliaria/PortalLivePreview';
import {
  FREE_STOCK_HERO_IMAGES,
  FREE_STOCK_ABOUT_IMAGES,
  FreeStockImage,
} from '@/constants/realEstateDefaults';

const REAL_ESTATE_COLOR_PRESETS = [
  { name: 'Esmeralda Premier', primary: '#00a884', secondary: '#161a1b' },
  { name: 'Azul Ejecutivo', primary: '#0284c7', secondary: '#0f172a' },
  { name: 'Grafito & Oro', primary: '#d97706', secondary: '#18181b' },
  { name: 'Azul Zafiro', primary: '#2563eb', secondary: '#0f172a' },
  { name: 'Terracota Cálido', primary: '#ea580c', secondary: '#1c1917' },
  { name: 'Verde Bosque Lujo', primary: '#059669', secondary: '#064e3b' },
];

interface PortalCustomizerBuilderProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  targetType: 'white_label' | 'agency';
  selectedId: number | null;
  agencies: any[];
  setTargetType: (type: 'white_label' | 'agency') => void;
  setSelectedId: (id: number | null) => void;
  populateForm: (entity: any, type: 'white_label' | 'agency') => void;
  setCurrentAgency: (agency: any) => void;
  handleVerifyDomain: () => Promise<void>;
  verifyingDomain: boolean;
  domainVerificationResult?: any;
  onSave?: (e?: any) => Promise<void>;
  saving?: boolean;
}

export const PortalCustomizerBuilder: React.FC<PortalCustomizerBuilderProps> = ({
  form,
  setForm,
  targetType,
  selectedId,
  agencies,
  setTargetType,
  setSelectedId,
  populateForm,
  setCurrentAgency,
  handleVerifyDomain,
  verifyingDomain,
  domainVerificationResult,
  onSave,
  saving = false,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeBuilderTab, setActiveBuilderTab] = useState<'hero' | 'domain' | 'identity' | 'about' | 'cta' | 'seo'>('hero');

  const effectiveDomain = form.custom_domain
    ? form.custom_domain.replace(/^https?:\/\//i, '').split('/')[0]
    : 'inmosoft.pro';

  const previewUrl = `/travel-agency-03?domain=${encodeURIComponent(effectiveDomain)}`;
  const liveUrl = form.custom_domain
    ? (form.custom_domain.startsWith('http') ? form.custom_domain : `https://${form.custom_domain}`)
    : `https://inmosoft.pro?domain=${encodeURIComponent(effectiveDomain)}`;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner del Portal */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 rounded-3xl shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Constructor del Portal Web Inmobiliario</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Diseño y Personalización de tu Sitio Público
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Configura en tiempo real la identidad, portada, imágenes en alta resolución, dominio web propio y posicionamiento SEO de tu portal de bienes raíces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Switch Habilitar Portal */}
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 flex items-center gap-3">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">Estado del Sitio:</span>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${form.frontend_enabled ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
                  {form.frontend_enabled ? 'Publicado y Activo' : 'Desactivado'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(form.frontend_enabled)}
                  onChange={(e) => setForm({ ...form, frontend_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
              </label>
            </div>

            {/* Guardar Cambios Button */}
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{saving ? 'Guardando...' : 'Guardar Cambios del Portal'}</span>
              </button>
            )}

            {/* Accesos Directos */}
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Ver Portal en Vivo</span>
            </a>
          </div>
        </div>
      </div>

      {/* Aviso si está seleccionada Marca Blanca en vez de Agencia */}
      {targetType === 'white_label' && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 shrink-0 text-amber-500" />
            <span className="text-xs">
              Los sitios web públicos pertenecen a las <strong>Agencias Inmobiliarias</strong>. Selecciona una agencia para configurar su portal exclusivo.
            </span>
          </div>
          {agencies.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setTargetType('agency');
                const firstAg = agencies[0];
                if (firstAg) {
                  setSelectedId(firstAg.id);
                  populateForm(firstAg, 'agency');
                  setCurrentAgency(firstAg);
                }
              }}
              className="px-3.5 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-xl shadow-xs shrink-0 hover:bg-amber-700 cursor-pointer"
            >
              Seleccionar Agencia
            </button>
          )}
        </div>
      )}

      {/* 2. Grid Principal: Constructor (Izquierda) + Vista Previa en Vivo (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA: CONTROLES DEL CONSTRUCTOR (7 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Navegación por Módulos del Constructor */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveBuilderTab('hero')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBuilderTab === 'hero'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Portada &amp; Hero</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveBuilderTab('domain')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBuilderTab === 'domain'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Dominio &amp; DNS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveBuilderTab('identity')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBuilderTab === 'identity'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colores &amp; Logo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveBuilderTab('about')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBuilderTab === 'about'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Conócenos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveBuilderTab('cta')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBuilderTab === 'cta'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Consignación</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveBuilderTab('seo')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBuilderTab === 'seo'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEO</span>
            </button>
          </div>

          {/* TAB 1: PORTADA & HERO */}
          {activeBuilderTab === 'hero' && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  Imagen de Portada (Hero Banner)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Esta imagen es el primer impacto visual que recibirán los visitantes de tu sitio web.
                </p>
              </div>

              {/* Opción 1: Subir Imagen Propia */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase block">
                  Opción 1: Subir Imagen Personalizada de tu Agencia
                </span>
                <MediaPicker
                  value={form.banner_image}
                  type="image"
                  buttonLabel="Subir o Seleccionar de Galería"
                  onChange={({ url }) => {
                    setForm((prev: any) => ({
                      ...prev,
                      banner_image: url || prev.banner_image,
                    }));
                  }}
                />
              </div>

              {/* Opción 2: Galería de Fotos Inmobiliarias Gratuitas en Alta Definición */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase block">
                    Opción 2: Elegir de la Galería Gratuita en Alta Definición (Presets 1-Clic)
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Fotografía Profesional Libre de Derechos
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {FREE_STOCK_HERO_IMAGES.map((preset: FreeStockImage) => {
                    const isSelected = form.banner_image === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setForm((prev: any) => ({
                            ...prev,
                            banner_image: preset.url,
                          }));
                        }}
                        className={`relative rounded-xl overflow-hidden border-2 text-left transition-all group cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-[1.02] shadow-md'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="h-20 w-full overflow-hidden bg-slate-100">
                          <img
                            src={preset.thumb}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-900">
                          <span className="text-[11px] font-bold text-slate-800 dark:text-white line-clamp-1 block leading-tight">
                            {preset.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Títulos del Hero */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                    Título Principal de Portada (Hero Title):
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Encuentra la Propiedad de tus Sueños"
                    value={form.hero_title || ''}
                    onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                    Subtítulo de Portada (Hero Subtitle):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ej. Las mejores opciones en venta y renta con asesoría jurídica y notarial garantizada."
                    value={form.hero_subtitle || ''}
                    onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOMINIO & VERIFICACIÓN DNS */}
          {activeBuilderTab === 'domain' && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  Dominio Personalizado &amp; Certificado DNS
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conecta tu propio dominio web (ej. <code>inmobiliariapremier.com</code>) para que tus clientes accedan directamente a tu portal.
                </p>
              </div>

              {/* Estado de Verificación DNS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Portal Público:</span>
                  {form.frontend_enabled ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Habilitado y Visible</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Desactivado</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Estado de DNS:</span>
                  {form.custom_domain_verified ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Dominio Verificado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Verificación Pendiente</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Input de Dominio y Verificación */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Dominio Personalizado (Custom Domain):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="ej. inmobiliariapremier.com o propiedades.midominio.com"
                    value={form.custom_domain || ''}
                    onChange={(e) => setForm({ ...form, custom_domain: e.target.value })}
                    className="flex-grow px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyDomain}
                    disabled={verifyingDomain || !form.custom_domain}
                    className="px-4 py-2.5 text-xs font-bold bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {verifyingDomain ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Verificar DNS</span>
                      </>
                    )}
                  </button>
                </div>

                {domainVerificationResult && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    domainVerificationResult.verified
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  }`}>
                    {domainVerificationResult.verified ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{domainVerificationResult.message}</span>
                  </div>
                )}
              </div>

              {/* Guía Rápida de Registros DNS */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Instrucciones para apuntar tu dominio:
                </span>
                <p className="text-[11px] text-slate-500">
                  En el panel de tu proveedor de dominio (GoDaddy, Namecheap, Cloudflare), agrega un registro CNAME o tipo A:
                </p>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] uppercase text-slate-400 block">Tipo CNAME:</span>
                    <strong>CNAME</strong> @ o www &rarr; <code>inmosoft.pro</code>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] uppercase text-slate-400 block">O Tipo A:</span>
                    <strong>A</strong> @ &rarr; <code>187.127.255.159</code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COLORES & LOGOTIPO */}
          {activeBuilderTab === 'identity' && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-600" />
                  Colores &amp; Logotipo del Portal
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Personaliza los colores distintivos de los botones, acentos y logotipo de tu agencia.
                </p>
              </div>

              {/* Selector de Paletas */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block">
                  Paleta de Color para el Portal:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {REAL_ESTATE_COLOR_PRESETS.map((p) => {
                    const isSelected = form.primary_color === p.primary;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          setForm((prev: any) => ({
                            ...prev,
                            primary_color: p.primary,
                            button_color: p.primary,
                            secondary_color: p.secondary,
                          }));
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-xs ring-1 ring-emerald-500'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: p.primary }} />
                        <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector Manual */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Color Principal (Acentos/Botones):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.primary_color || '#00a884'}
                      onChange={(e) => setForm({ ...form, primary_color: e.target.value, button_color: e.target.value })}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.primary_color || '#00a884'}
                      onChange={(e) => setForm({ ...form, primary_color: e.target.value, button_color: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Color Secundario (Topbar/Footer):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.secondary_color || '#161a1b'}
                      onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.secondary_color || '#161a1b'}
                      onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Logotipo del Portal */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                    Logotipo Principal para el Portal Web:
                  </label>
                  <MediaPicker
                    value={form.logo}
                    type="image"
                    buttonLabel="Seleccionar Logo del Portal"
                    onChange={({ url }) => setForm((prev: any) => ({ ...prev, logo: url || prev.logo }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                    Favicon (Ícono de Pestaña del Navegador):
                  </label>
                  <MediaPicker
                    value={form.favicon}
                    type="image"
                    buttonLabel="Seleccionar Favicon"
                    onChange={({ url }) => setForm((prev: any) => ({ ...prev, favicon: url || prev.favicon }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECCIÓN CONÓCENOS */}
          {activeBuilderTab === 'about' && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Sección «Conócenos» (Nosotros)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Muestra la trayectoria, valores y confianza de tu equipo inmobiliario.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                  Título de la Sección:
                </label>
                <input
                  type="text"
                  placeholder="ej. Somos Tu Aliado Inmobiliario de Confianza"
                  value={form.about_title || ''}
                  onChange={(e) => setForm({ ...form, about_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                  Texto de Presentación y Experiencia:
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe la experiencia de tu agencia, cobertura geográfica y por qué los clientes deben confiar en ti..."
                  value={form.about_text || ''}
                  onChange={(e) => setForm({ ...form, about_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium"
                />
              </div>

              {/* Presets de Fotos de Asesoría */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase block">
                  Fotografía de Asesoría Profesional (Presets incluidos):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {FREE_STOCK_ABOUT_IMAGES.map((preset) => (
                    <div key={preset.id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <img src={preset.thumb} alt={preset.name} className="w-full h-16 object-cover" />
                      <div className="p-1.5 bg-white dark:bg-slate-900 text-center">
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate block">
                          {preset.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONSIGNACIÓN & CONTACTO */}
          {activeBuilderTab === 'cta' && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  Banner de Consignación &amp; Contacto Directo
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Invita a propietarios a vender o rentar sus inmuebles contigo mediante WhatsApp y llamada.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                  Texto del Banner de Consignación (Llamada a la Acción):
                </label>
                <input
                  type="text"
                  placeholder="ej. ¿Deseas vender o consignar tu propiedad? Te ayudamos a colocarla al mejor precio."
                  value={form.cta_text || ''}
                  onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                    Teléfono de Contacto:
                  </label>
                  <input
                    type="text"
                    placeholder="ej. +52 55 1234 5678"
                    value={form.phone || ''}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                    WhatsApp para Prospectos:
                  </label>
                  <input
                    type="text"
                    placeholder="ej. +52 55 1234 5678"
                    value={form.whatsapp || ''}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: OPTIMIZACIÓN SEO & REDES SOCIALES */}
          {activeBuilderTab === 'seo' && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600" />
                  Optimización SEO &amp; Vista Previa para Redes
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configura cómo aparecerá tu portal inmobiliario en Google y cuando compartas enlaces en WhatsApp.
                </p>
              </div>

              {/* Simulador Google */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Simulación de Búsqueda en Google:
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 block font-mono truncate">
                  https://{effectiveDomain} &rsaquo; propiedades
                </span>
                <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
                  {form.seo_title || `${form.name || 'Inmobiliaria'} — Compra, Venta y Renta de Inmuebles`}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {form.seo_description || 'Explora nuestro catálogo exclusivo de casas, departamentos, terrenos y oficinas en venta y renta con asesoría jurídica garantizada.'}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                  Título SEO (&lt;title&gt;):
                </label>
                <input
                  type="text"
                  placeholder="ej. Inmobiliaria Premier — Venta y Renta de Inmuebles Exclusivos"
                  value={form.seo_title || ''}
                  onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                  Meta Descripción SEO:
                </label>
                <textarea
                  rows={3}
                  placeholder="Descripción concisa que llamará la atención de los clientes en Google..."
                  value={form.seo_description || ''}
                  onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium"
                />
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: VISTA PREVIA INTERACTIVA EN TIEMPO REAL (6 cols) */}
        <div className="lg:col-span-6 sticky top-6 space-y-3">
          {/* Barra de Controles de Vista Previa */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-slate-900 dark:text-white">
                Vista Previa del Portal
              </span>
            </div>

            {/* Selector de Dispositivo */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                title="Vista Escritorio"
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deviceMode === 'desktop' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('tablet')}
                title="Vista Tablet"
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deviceMode === 'tablet' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                title="Vista Móvil"
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deviceMode === 'mobile' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Marco Interactivo del Portal */}
          <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-h-[780px] overflow-y-auto">
            <PortalLivePreview
              agencyName={form.name || 'Inmobiliaria'}
              logoUrl={form.logo}
              bannerImage={form.banner_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'}
              heroTitle={form.hero_title || 'Encuentra la Propiedad de tus Sueños'}
              heroSubtitle={form.hero_subtitle || 'Las mejores opciones en venta y renta con asesoría jurídica y crediticia garantizada.'}
              aboutTitle={form.about_title || 'Tu Aliado Inmobiliario de Confianza'}
              aboutText={form.about_text || 'Acompañamos a familias e inversionistas a tomar la mejor decisión patrimonial con total transparencia y seguridad notarial.'}
              ctaText={form.cta_text || '¿Deseas vender o consignar tu inmueble? Lo comercializamos al mejor precio de mercado.'}
              primaryColor={form.primary_color || '#00a884'}
              secondaryColor={form.secondary_color || '#161a1b'}
              phone={form.phone || '+52 55 1234 5678'}
              whatsapp={form.whatsapp || '+52 55 1234 5678'}
              deviceMode={deviceMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalCustomizerBuilder;
