'use client';

import React, { useState } from 'react';
import { StripeAppearanceConfig } from '../../types/landing';
import { defaultStripeAppearance, stripePresets, isColorDark } from '../../utils/stripeAppearance';
import {
  Palette, Sliders, Type, CreditCard, Sparkles, Check, Lock, ShieldCheck,
  Eye, RefreshCw, Layers, AlertCircle, CheckCircle2, ChevronRight
} from 'lucide-react';

interface Props {
  config?: StripeAppearanceConfig;
  onChange: (config: StripeAppearanceConfig) => void;
  compact?: boolean;
}

export const StripeAppearanceEditor: React.FC<Props> = ({
  config,
  onChange,
  compact = false,
}) => {
  const currentConfig: StripeAppearanceConfig = { ...defaultStripeAppearance, ...config };

  const [activeSection, setActiveSection] = useState<'presets' | 'background' | 'typography' | 'inputs' | 'buttons' | 'states'>('presets');
  const [previewError, setPreviewError] = useState(false);
  const [previewSuccess, setPreviewSuccess] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const updateField = (field: keyof StripeAppearanceConfig, value: any) => {
    onChange({
      ...currentConfig,
      [field]: value,
    });
  };

  const applyPreset = (presetKey: string) => {
    const preset = stripePresets[presetKey];
    if (preset) {
      onChange({ ...preset.config });
    }
  };

  // Preview Box Styles
  const isDarkBg = isColorDark(currentConfig.bg_color || '');
  const containerRadius = currentConfig.container_border_radius || '16px';
  const inputRadius = currentConfig.input_border_radius || '12px';
  const buttonRadius = currentConfig.button_border_radius || '14px';

  const containerShadowMap: Record<string, string> = {
    none: 'none',
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.2)',
    '2xl': '0 25px 50px -12px rgba(0,0,0,0.35)',
  };

  const previewBoxStyle: React.CSSProperties = {
    backgroundColor: currentConfig.bg_transparent ? 'transparent' : currentConfig.bg_color || '#ffffff',
    borderColor: currentConfig.container_border_color || '#e2e8f0',
    borderWidth: currentConfig.container_border_width || '1px',
    borderStyle: 'solid',
    borderRadius: containerRadius,
    boxShadow: containerShadowMap[currentConfig.container_shadow || 'md'],
    padding: currentConfig.spacing_unit || '16px',
    color: currentConfig.text_color || (isDarkBg ? '#ffffff' : '#0f172a'),
    fontFamily: currentConfig.font_family || 'system-ui, sans-serif',
    transition: 'all 0.2s ease',
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: currentConfig.input_bg_color || '#ffffff',
    color: currentConfig.input_text_color || '#0f172a',
    borderColor: currentConfig.input_border_color || '#cbd5e1',
    borderWidth: currentConfig.input_border_width || '1px',
    borderStyle: 'solid',
    borderRadius: inputRadius,
    padding: currentConfig.input_padding || '12px 14px',
    fontSize: currentConfig.font_size || '13px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: currentConfig.font_family || 'system-ui, sans-serif',
  };

  const labelStyle: React.CSSProperties = {
    color: currentConfig.label_color || currentConfig.text_color || '#475569',
    fontSize: '11px',
    fontWeight: (currentConfig.font_weight as any) || '600',
    marginBottom: '4px',
    display: 'block',
    textTransform: 'none',
  };

  const buttonStyle: React.CSSProperties = {
    background: isButtonHovered && currentConfig.button_hover_bg_color
      ? currentConfig.button_hover_bg_color
      : currentConfig.button_bg_color || '#10b981',
    backgroundColor: !currentConfig.button_bg_color?.includes('gradient')
      ? (isButtonHovered && currentConfig.button_hover_bg_color ? currentConfig.button_hover_bg_color : currentConfig.button_bg_color)
      : undefined,
    color: currentConfig.button_text_color || '#ffffff',
    borderRadius: buttonRadius,
    padding: currentConfig.button_padding || '14px 24px',
    fontWeight: '700',
    fontSize: '13px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease',
  };

  return (
    <div className="space-y-6">
      {/* Subnav Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSection('presets')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'presets' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Presets Rápidos</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('background')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'background' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Fondo & Contenedor</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('typography')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'typography' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Tipografía</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('inputs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'inputs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Campos / Inputs</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('buttons')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'buttons' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Botones</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('states')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'states' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Estados & Alertas</span>
        </button>
      </div>

      {/* Main Layout: Controls Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* SECTION: PRESETS */}
          {activeSection === 'presets' && (
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Estilos Predefinidos Profesionales</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Aplica combinaciones armoniosas probadas con 1 clic para tu pasarela Stripe.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(stripePresets).map(([key, p]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPreset(key)}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-indigo-500 text-left transition-all group flex flex-col justify-between space-y-2.5 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs text-white group-hover:text-indigo-400 transition-colors">
                        {p.name}
                      </span>
                      <div className="flex -space-x-1.5">
                        {p.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {p.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: FONDO & CONTENEDOR */}
          {activeSection === 'background' && (
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Personalización del Fondo y Contenedor</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Background color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color de Fondo General</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      disabled={currentConfig.bg_transparent}
                      value={currentConfig.bg_color && currentConfig.bg_color.startsWith('#') ? currentConfig.bg_color : '#064e3b'}
                      onChange={(e) => updateField('bg_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent disabled:opacity-40"
                    />
                    <input
                      type="text"
                      disabled={currentConfig.bg_transparent}
                      value={currentConfig.bg_color || ''}
                      onChange={(e) => updateField('bg_color', e.target.value)}
                      placeholder="#064e3b o rgba(...)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs disabled:opacity-40"
                    />
                  </div>
                  <label className="flex items-center gap-2 pt-1 cursor-pointer text-slate-400 text-[11px]">
                    <input
                      type="checkbox"
                      checked={!!currentConfig.bg_transparent}
                      onChange={(e) => updateField('bg_transparent', e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-indigo-600 w-3.5 h-3.5"
                    />
                    <span>Fondo transparente (sin color de caja)</span>
                  </label>
                </div>

                {/* Border Color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color del Borde del Contenedor</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.container_border_color && currentConfig.container_border_color.startsWith('#') ? currentConfig.container_border_color : '#10b981'}
                      onChange={(e) => updateField('container_border_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.container_border_color || ''}
                      onChange={(e) => updateField('container_border_color', e.target.value)}
                      placeholder="#10b981 o rgba(...)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Border Width */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Grosor del Borde</label>
                  <select
                    value={currentConfig.container_border_width || '1px'}
                    onChange={(e) => updateField('container_border_width', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="0px">Sin borde (0px)</option>
                    <option value="1px">Fino (1px)</option>
                    <option value="2px">Medio (2px)</option>
                    <option value="3px">Grueso (3px)</option>
                  </select>
                </div>

                {/* Border Radius */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Redondeado del Contenedor</label>
                  <select
                    value={currentConfig.container_border_radius || '16px'}
                    onChange={(e) => updateField('container_border_radius', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="0px">Recto / Cuadrado (0px)</option>
                    <option value="8px">Suave (8px)</option>
                    <option value="12px">Estándar (12px)</option>
                    <option value="16px">Redondeado (16px)</option>
                    <option value="20px">Extra Redondeado (20px)</option>
                    <option value="28px">Ultra Redondeado (28px)</option>
                  </select>
                </div>

                {/* Container Shadow */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Sombra del Contenedor</label>
                  <select
                    value={currentConfig.container_shadow || 'md'}
                    onChange={(e) => updateField('container_shadow', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="none">Sin sombra (Plano)</option>
                    <option value="sm">Sutil (sm)</option>
                    <option value="md">Media (md)</option>
                    <option value="lg">Pronunciada (lg)</option>
                    <option value="xl">Elevada (xl)</option>
                    <option value="2xl">Flotante 3D (2xl)</option>
                  </select>
                </div>

                {/* Spacing / Padding */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Espaciado Interno (Padding)</label>
                  <select
                    value={currentConfig.spacing_unit || '16px'}
                    onChange={(e) => updateField('spacing_unit', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="12px">Compacto (12px)</option>
                    <option value="16px">Estándar (16px)</option>
                    <option value="20px">Cómodo (20px)</option>
                    <option value="24px">Amplio (24px)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: TIPOGRAFÍA */}
          {activeSection === 'typography' && (
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-400" />
                <span>Tipografía & Textos</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Text Color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color del Texto General</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.text_color && currentConfig.text_color.startsWith('#') ? currentConfig.text_color : '#ffffff'}
                      onChange={(e) => updateField('text_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.text_color || ''}
                      onChange={(e) => updateField('text_color', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Title Color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color de Títulos</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.title_color && currentConfig.title_color.startsWith('#') ? currentConfig.title_color : '#ffffff'}
                      onChange={(e) => updateField('title_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.title_color || ''}
                      onChange={(e) => updateField('title_color', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Label Color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color de Etiquetas de Campos</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.label_color && currentConfig.label_color.startsWith('#') ? currentConfig.label_color : '#cbd5e1'}
                      onChange={(e) => updateField('label_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.label_color || ''}
                      onChange={(e) => updateField('label_color', e.target.value)}
                      placeholder="#cbd5e1"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Tamaño de Letra Base</label>
                  <select
                    value={currentConfig.font_size || '13px'}
                    onChange={(e) => updateField('font_size', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="12px">Pequeño (12px)</option>
                    <option value="13px">Estándar (13px)</option>
                    <option value="14px">Medio (14px)</option>
                    <option value="15px">Grande (15px)</option>
                  </select>
                </div>

                {/* Font Weight */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Peso Tipográfico</label>
                  <select
                    value={currentConfig.font_weight || '600'}
                    onChange={(e) => updateField('font_weight', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="400">Normal (400)</option>
                    <option value="500">Medio (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Negrita / Bold (700)</option>
                  </select>
                </div>

                {/* Font Family */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Familia Tipográfica</label>
                  <select
                    value={currentConfig.font_family || 'system-ui, sans-serif'}
                    onChange={(e) => updateField('font_family', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="system-ui, sans-serif">Sistema Nativo (System UI)</option>
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Montserrat', sans-serif">Montserrat</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                    <option value="'Poppins', sans-serif">Poppins</option>
                    <option value="monospace">Monoespaciada (Monospace)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: INPUTS */}
          {activeSection === 'inputs' && (
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Personalización de Inputs y Tarjeta</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Input BG */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color de Fondo del Input</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.input_bg_color && currentConfig.input_bg_color.startsWith('#') ? currentConfig.input_bg_color : '#ffffff'}
                      onChange={(e) => updateField('input_bg_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.input_bg_color || ''}
                      onChange={(e) => updateField('input_bg_color', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Input Text */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color del Texto del Input</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.input_text_color && currentConfig.input_text_color.startsWith('#') ? currentConfig.input_text_color : '#0f172a'}
                      onChange={(e) => updateField('input_text_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.input_text_color || ''}
                      onChange={(e) => updateField('input_text_color', e.target.value)}
                      placeholder="#0f172a"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Input Placeholder */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color del Placeholder</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.input_placeholder_color && currentConfig.input_placeholder_color.startsWith('#') ? currentConfig.input_placeholder_color : '#94a3b8'}
                      onChange={(e) => updateField('input_placeholder_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.input_placeholder_color || ''}
                      onChange={(e) => updateField('input_placeholder_color', e.target.value)}
                      placeholder="#94a3b8"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Input Border Color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color del Borde del Input</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.input_border_color && currentConfig.input_border_color.startsWith('#') ? currentConfig.input_border_color : '#cbd5e1'}
                      onChange={(e) => updateField('input_border_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.input_border_color || ''}
                      onChange={(e) => updateField('input_border_color', e.target.value)}
                      placeholder="#cbd5e1"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Input Focus Border Color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color de Borde al Enfocar (Focus)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.input_focus_border_color && currentConfig.input_focus_border_color.startsWith('#') ? currentConfig.input_focus_border_color : '#10b981'}
                      onChange={(e) => updateField('input_focus_border_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.input_focus_border_color || ''}
                      onChange={(e) => updateField('input_focus_border_color', e.target.value)}
                      placeholder="#10b981"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Input Border Width */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Grosor de Borde del Input</label>
                  <select
                    value={currentConfig.input_border_width || '1px'}
                    onChange={(e) => updateField('input_border_width', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="1px">Normal (1px)</option>
                    <option value="2px">Marcado (2px)</option>
                  </select>
                </div>

                {/* Input Border Radius */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Redondeado del Input</label>
                  <select
                    value={currentConfig.input_border_radius || '12px'}
                    onChange={(e) => updateField('input_border_radius', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="0px">Cuadrado (0px)</option>
                    <option value="6px">Suave (6px)</option>
                    <option value="10px">Estándar (10px)</option>
                    <option value="12px">Redondeado (12px)</option>
                    <option value="16px">Extra Redondeado (16px)</option>
                    <option value="9999px">Cápsula / Redondo (Pill)</option>
                  </select>
                </div>

                {/* Input Padding / Height */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Padding / Altura de los Inputs</label>
                  <select
                    value={currentConfig.input_padding || '12px 14px'}
                    onChange={(e) => updateField('input_padding', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="8px 12px">Compacto (8px / 12px)</option>
                    <option value="12px 14px">Estándar (12px / 14px)</option>
                    <option value="14px 16px">Cómodo (14px / 16px)</option>
                    <option value="16px 18px">Amplio (16px / 18px)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: BOTONES */}
          {activeSection === 'buttons' && (
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-pink-400" />
                <span>Personalización del Botón de Pago</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Button Text */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Texto del Botón</label>
                  <input
                    type="text"
                    value={currentConfig.button_text || ''}
                    onChange={(e) => updateField('button_text', e.target.value)}
                    placeholder="Ej. Completar Registro y Pago Seguro"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  />
                </div>

                {/* Button BG */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Fondo del Botón (Color o Gradiente)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.button_bg_color && currentConfig.button_bg_color.startsWith('#') ? currentConfig.button_bg_color : '#10b981'}
                      onChange={(e) => updateField('button_bg_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.button_bg_color || ''}
                      onChange={(e) => updateField('button_bg_color', e.target.value)}
                      placeholder="#10b981 o linear-gradient(...)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Button Text Color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color del Texto del Botón</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.button_text_color && currentConfig.button_text_color.startsWith('#') ? currentConfig.button_text_color : '#ffffff'}
                      onChange={(e) => updateField('button_text_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.button_text_color || ''}
                      onChange={(e) => updateField('button_text_color', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Button Hover BG */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Color al pasar el mouse (Hover)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.button_hover_bg_color && currentConfig.button_hover_bg_color.startsWith('#') ? currentConfig.button_hover_bg_color : '#059669'}
                      onChange={(e) => updateField('button_hover_bg_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.button_hover_bg_color || ''}
                      onChange={(e) => updateField('button_hover_bg_color', e.target.value)}
                      placeholder="#059669"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Button Radius */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Redondeado del Botón</label>
                  <select
                    value={currentConfig.button_border_radius || '14px'}
                    onChange={(e) => updateField('button_border_radius', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="0px">Cuadrado (0px)</option>
                    <option value="8px">Suave (8px)</option>
                    <option value="12px">Estándar (12px)</option>
                    <option value="14px">Redondeado (14px)</option>
                    <option value="20px">Extra Redondeado (20px)</option>
                    <option value="9999px">Cápsula / Redondo (Pill)</option>
                  </select>
                </div>

                {/* Button Padding */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-slate-300 font-semibold">Tamaño y Padding del Botón</label>
                  <select
                    value={currentConfig.button_padding || '14px 24px'}
                    onChange={(e) => updateField('button_padding', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  >
                    <option value="10px 18px">Compacto (10px / 18px)</option>
                    <option value="14px 24px">Estándar (14px / 24px)</option>
                    <option value="16px 30px">Grande / Destacado (16px / 30px)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ESTADOS & ALERTAS */}
          {activeSection === 'states' && (
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Colores de Mensajes de Estado & Enlaces</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Error Color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Mensajes de Error</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.error_color && currentConfig.error_color.startsWith('#') ? currentConfig.error_color : '#ef4444'}
                      onChange={(e) => updateField('error_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.error_color || ''}
                      onChange={(e) => updateField('error_color', e.target.value)}
                      placeholder="#ef4444"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Success Color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Mensajes de Éxito</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.success_color && currentConfig.success_color.startsWith('#') ? currentConfig.success_color : '#10b981'}
                      onChange={(e) => updateField('success_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.success_color || ''}
                      onChange={(e) => updateField('success_color', e.target.value)}
                      placeholder="#10b981"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Link Color */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">Enlaces (Links)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentConfig.link_color && currentConfig.link_color.startsWith('#') ? currentConfig.link_color : '#10b981'}
                      onChange={(e) => updateField('link_color', e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentConfig.link_color || ''}
                      onChange={(e) => updateField('link_color', e.target.value)}
                      placeholder="#10b981"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Real-Time Interactive Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Vista Previa en Tiempo Real</span>
            </span>
            <div className="flex items-center gap-2 text-[10px]">
              <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white">
                <input
                  type="checkbox"
                  checked={previewError}
                  onChange={(e) => setPreviewError(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-rose-500 w-3 h-3"
                />
                <span>Simular Error</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white">
                <input
                  type="checkbox"
                  checked={previewSuccess}
                  onChange={(e) => setPreviewSuccess(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 w-3 h-3"
                />
                <span>Simular Éxito</span>
              </label>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div style={previewBoxStyle} className="space-y-4">
              {/* Header Box */}
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" style={{ color: currentConfig.title_color || '#10b981' }} />
                  <span
                    className="font-extrabold text-xs"
                    style={{ color: currentConfig.title_color || currentConfig.text_color }}
                  >
                    Datos de Tarjeta (Stripe Checkout)
                  </span>
                </div>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1"
                  style={{
                    backgroundColor: `${currentConfig.title_color || '#10b981'}20`,
                    color: currentConfig.title_color || '#10b981',
                  }}
                >
                  <Lock className="w-3 h-3" /> SSL 256-Bit
                </span>
              </div>

              {/* Price Summary Tag */}
              <div
                className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-black/10 dark:border-white/10"
                style={{
                  backgroundColor: currentConfig.input_bg_color || '#ffffff',
                  color: currentConfig.input_text_color || '#0f172a',
                }}
              >
                <span className="font-semibold opacity-80">Servicio / Membresía Pro</span>
                <span className="font-black text-sm" style={{ color: currentConfig.button_bg_color || '#10b981' }}>
                  $99.00 USD
                </span>
              </div>

              {/* Cardholder field */}
              <div className="space-y-1 text-left">
                <label style={labelStyle}>
                  Nombre en la Tarjeta <span style={{ color: currentConfig.error_color || '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value="JUAN PEREZ"
                  style={inputStyle}
                  className="font-medium"
                />
              </div>

              {/* Card number field */}
              <div className="space-y-1 text-left">
                <label style={labelStyle}>
                  Número de Tarjeta <span style={{ color: currentConfig.error_color || '#ef4444' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value="4242 •••• •••• 4242"
                    style={inputStyle}
                    className="font-mono tracking-wider"
                  />
                  <CreditCard
                    className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none opacity-60"
                    style={{ color: currentConfig.input_text_color }}
                  />
                </div>
              </div>

              {/* Grid: Expiration & CVC */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="space-y-1">
                  <label style={labelStyle}>
                    Vencimiento (MM/AA) <span style={{ color: currentConfig.error_color || '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="12/28"
                    style={inputStyle}
                    className="font-mono text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label style={labelStyle}>
                    CVC / CVV <span style={{ color: currentConfig.error_color || '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="•••"
                    style={inputStyle}
                    className="font-mono text-center"
                  />
                </div>
              </div>

              {/* Simulated Error Message */}
              {previewError && (
                <div
                  className="p-2.5 rounded-xl border text-[11px] font-semibold flex items-center gap-2 animate-in fade-in"
                  style={{
                    backgroundColor: `${currentConfig.error_color || '#ef4444'}15`,
                    borderColor: `${currentConfig.error_color || '#ef4444'}40`,
                    color: currentConfig.error_color || '#ef4444',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>El número de tarjeta no es válido o ha expirado.</span>
                </div>
              )}

              {/* Simulated Success Message */}
              {previewSuccess && (
                <div
                  className="p-2.5 rounded-xl border text-[11px] font-semibold flex items-center gap-2 animate-in fade-in"
                  style={{
                    backgroundColor: `${currentConfig.success_color || '#10b981'}15`,
                    borderColor: `${currentConfig.success_color || '#10b981'}40`,
                    color: currentConfig.success_color || '#10b981',
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>¡Transacción autorizada correctamente por Stripe!</span>
                </div>
              )}

              {/* Simulated Terms Link */}
              <div className="text-[11px] text-left opacity-90">
                <span>Al continuar aceptas los </span>
                <span
                  className="underline font-bold cursor-pointer"
                  style={{ color: currentConfig.link_color || '#10b981' }}
                >
                  Términos y Condiciones
                </span>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  style={buttonStyle}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                >
                  <Lock className="w-4 h-4" />
                  <span>{currentConfig.button_text || 'Completar Registro y Pago Seguro'}</span>
                </button>
              </div>

              {/* Security Footer */}
              <div className="pt-1 flex items-center justify-between text-[10px] opacity-70 border-t border-black/10 dark:border-white/10">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Stripe Elements SSL
                </span>
                <span>Visa · MC · Amex</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeAppearanceEditor;
