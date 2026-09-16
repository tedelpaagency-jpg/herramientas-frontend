import React, { useState } from 'react';
import { FormSchema, FormFieldSchema, FormStepSchema, FormStyleConfig, FormLayoutType, ActionType, LandingAvailableResources } from '../../types/landing';
import { Plus, Trash2, MoveUp, MoveDown, Layers, CheckSquare, ListOrdered, BookOpen, GitBranch, Palette, Sparkles, Sliders } from 'lucide-react';

interface Props {
  formSchema: FormSchema;
  onChange: (schema: FormSchema) => void;
  actionType: ActionType;
  onActionTypeChange: (actionType: ActionType) => void;
  workspaceId?: number | null;
  onWorkspaceChange: (id: number | null) => void;
  stageId?: number | null;
  onStageChange: (id: number | null) => void;
  courseIds?: number[] | null;
  onCourseIdsChange: (ids: number[]) => void;
  resources?: LandingAvailableResources;
}

export const FormSchemaEditor: React.FC<Props> = ({
  formSchema,
  onChange,
  actionType,
  onActionTypeChange,
  workspaceId,
  onWorkspaceChange,
  stageId,
  onStageChange,
  courseIds = [],
  onCourseIdsChange,
  resources,
}) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'steps' | 'styles' | 'automation'>('fields');

  const fields = formSchema.fields || [];
  const steps = formSchema.steps || [];
  const layout = formSchema.layout || 'linear';
  const currentStyles: FormStyleConfig = formSchema.styles || {};

  const updateSchema = (updates: Partial<FormSchema>) => {
    onChange({
      ...formSchema,
      ...updates,
    });
  };

  const handleUpdateStyles = (updates: Partial<FormStyleConfig>) => {
    updateSchema({
      styles: {
        ...currentStyles,
        ...updates,
      },
    });
  };

  const applyPreset = (presetKey: string) => {
    let preset: FormStyleConfig = {};
    if (presetKey === 'dark_luxe') {
      preset = {
        bg_color: '#0f172a',
        text_color: '#ffffff',
        input_bg_color: '#020617',
        input_text_color: '#ffffff',
        input_border_color: '#1e293b',
        button_bg_color: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        button_text_color: '#ffffff',
        border_radius: 'xl',
        card_style: 'card',
      };
    } else if (presetKey === 'clean_light') {
      preset = {
        bg_color: '#ffffff',
        text_color: '#0f172a',
        input_bg_color: '#f8fafc',
        input_text_color: '#0f172a',
        input_border_color: '#cbd5e1',
        button_bg_color: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        button_text_color: '#ffffff',
        border_radius: 'xl',
        card_style: 'card',
      };
    } else if (presetKey === 'emerald_finance') {
      preset = {
        bg_color: '#022c22',
        text_color: '#f0fdf4',
        input_bg_color: '#064e3b',
        input_text_color: '#ffffff',
        input_border_color: '#047857',
        button_bg_color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        button_text_color: '#ffffff',
        border_radius: 'xl',
        card_style: 'card',
      };
    } else if (presetKey === 'neon_cyber') {
      preset = {
        bg_color: '#18181b',
        text_color: '#38bdf8',
        input_bg_color: '#09090b',
        input_text_color: '#f0f9ff',
        input_border_color: '#0284c7',
        button_bg_color: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        button_text_color: '#ffffff',
        border_radius: 'xl',
        card_style: 'card',
      };
    } else if (presetKey === 'glassmorphic') {
      preset = {
        bg_color: 'rgba(15, 23, 42, 0.75)',
        text_color: '#ffffff',
        input_bg_color: 'rgba(2, 6, 23, 0.6)',
        input_text_color: '#ffffff',
        input_border_color: 'rgba(255, 255, 255, 0.15)',
        button_bg_color: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        button_text_color: '#ffffff',
        border_radius: '2xl',
        card_style: 'glass',
      };
    } else if (presetKey === 'minimal') {
      preset = {
        bg_color: 'transparent',
        text_color: '#0f172a',
        input_bg_color: '#ffffff',
        input_text_color: '#0f172a',
        input_border_color: '#e2e8f0',
        button_bg_color: '#4f46e5',
        button_text_color: '#ffffff',
        border_radius: 'lg',
        card_style: 'minimal',
      };
    }
    updateSchema({ styles: preset });
  };

  const handleAddField = () => {
    const newId = `field_${Date.now()}`;
    const newField: FormFieldSchema = {
      id: newId,
      name: `field_${fields.length + 1}`,
      label: `Nuevo Campo ${fields.length + 1}`,
      type: 'text',
      placeholder: '',
      required: false,
      step_index: 0,
    };
    updateSchema({ fields: [...fields, newField] });
  };

  const handleUpdateField = (index: number, updates: Partial<FormFieldSchema>) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...updates };
    updateSchema({ fields: updated });
  };

  const handleRemoveField = (index: number) => {
    const fieldToRemove = fields[index];
    const updated = fields.filter((_, i) => i !== index);
    
    // Clean up field references in steps
    const updatedSteps = steps.map(s => ({
      ...s,
      field_ids: s.field_ids.filter(id => id !== fieldToRemove.id),
    }));

    updateSchema({ fields: updated, steps: updatedSteps });
  };

  const handleAddStep = () => {
    const newStep: FormStepSchema = {
      title: `Paso ${steps.length + 1}`,
      description: 'Información general',
      field_ids: [],
    };
    updateSchema({ steps: [...steps, newStep] });
  };

  const handleUpdateStep = (index: number, updates: Partial<FormStepSchema>) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], ...updates };
    updateSchema({ steps: updated });
  };

  const handleRemoveStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index);
    updateSchema({ steps: updated });
  };

  const filteredStages = resources?.stages.filter(s => !workspaceId || s.workspace_id === Number(workspaceId)) || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Formulario Dinámico
          </h3>
          <p className="text-xs text-slate-400">Configura campos, steps, CRM Workspace y cursos automáticos</p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('fields')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'fields' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Campos ({fields.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'steps' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Estructura ({layout === 'multi_step' ? 'Multi-Step' : 'Lineal'})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('styles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'styles' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-pink-400" /> Estilos & Colores
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('automation')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'automation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            CRM & Cursos
          </button>
        </div>
      </div>

      {/* FIELDS TAB */}
      {activeTab === 'fields' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-300">Campos del Formulario</span>
            <button
              type="button"
              onClick={handleAddField}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="w-4 h-4" /> Agregar Campo
            </button>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {fields.map((field, idx) => {
              const isSystemField = field.is_system_field || ['name', 'email'].includes(field.name);

              return (
                <div key={field.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[11px]">#{idx + 1} ID: {field.id}</span>
                      {isSystemField && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                          🔒 Obligatorio del Sistema (Fijo)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={field.required || isSystemField}
                          disabled={isSystemField}
                          onChange={(e) => handleUpdateField(idx, { required: e.target.checked })}
                          className="rounded border-slate-700 bg-slate-900 text-indigo-600 disabled:opacity-50"
                        />
                        Requerido
                      </label>
                      {!isSystemField ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveField(idx)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Eliminar campo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-slate-600 p-1 cursor-not-allowed" title="Campo de sistema no eliminable">
                          <Trash2 className="w-4 h-4 opacity-30" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Nombre / Key</label>
                      <input
                        type="text"
                        value={field.name}
                        disabled={isSystemField}
                        onChange={(e) => handleUpdateField(idx, { name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Etiqueta (Label)</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleUpdateField(idx, { label: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Tipo de Campo</label>
                      <select
                        value={field.type}
                        disabled={isSystemField}
                        onChange={(e) => handleUpdateField(idx, { type: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white disabled:opacity-60"
                      >
                        <option value="text">Texto</option>
                        <option value="email">Correo Electrónico</option>
                        <option value="phone">Teléfono</option>
                        <option value="textarea">Área de Texto (Textarea)</option>
                        <option value="select">Lista Desplegable (Select)</option>
                        <option value="checkbox">Casilla (Checkbox)</option>
                        <option value="number">Número</option>
                        <option value="file">📁 Archivo / Comprobante (File Upload)</option>
                      </select>
                    </div>
                  </div>

                {layout === 'multi_step' && steps.length > 0 && (
                  <div className="pt-1">
                    <label className="block text-[11px] text-slate-400 mb-1">Asignar a Paso (Step)</label>
                    <select
                      value={field.step_index ?? 0}
                      onChange={(e) => handleUpdateField(idx, { step_index: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-indigo-300"
                    >
                      {steps.map((st, sIdx) => (
                        <option key={sIdx} value={sIdx}>
                          Paso {sIdx + 1}: {st.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* STEPS TAB */}
      {activeTab === 'steps' && (
        <div className="space-y-5">
          <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-lg text-xs space-y-2">
            <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4" /> Formato de Diseño del Formulario
            </span>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer ${
                layout === 'linear' ? 'border-indigo-500 bg-indigo-900/40' : 'border-slate-800 bg-slate-950'
              }`}>
                <input
                  type="radio"
                  name="form_layout"
                  value="linear"
                  checked={layout === 'linear'}
                  onChange={() => updateSchema({ layout: 'linear' })}
                  className="text-indigo-600"
                />
                <div>
                  <div className="font-medium text-white">Lineal</div>
                  <div className="text-[11px] text-slate-400">Todos los campos en una sola sección</div>
                </div>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer ${
                layout === 'multi_step' ? 'border-indigo-500 bg-indigo-900/40' : 'border-slate-800 bg-slate-950'
              }`}>
                <input
                  type="radio"
                  name="form_layout"
                  value="multi_step"
                  checked={layout === 'multi_step'}
                  onChange={() => {
                    updateSchema({ layout: 'multi_step' });
                    if (steps.length === 0) {
                      handleAddStep();
                    }
                  }}
                  className="text-indigo-600"
                />
                <div>
                  <div className="font-medium text-white">Multi-Paso (Wizard)</div>
                  <div className="text-[11px] text-slate-400">Barra de progreso por pasos interactivos</div>
                </div>
              </label>
            </div>
          </div>

          {layout === 'multi_step' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-300">Pasos del Wizard ({steps.length})</span>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" /> Agregar Paso
                </button>
              </div>

              {steps.map((step, sIdx) => (
                <div key={sIdx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-indigo-400">Paso #{sIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(sIdx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Título del Paso</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleUpdateStep(sIdx, { title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Descripción / Subtítulo</label>
                      <input
                        type="text"
                        value={step.description || ''}
                        onChange={(e) => handleUpdateStep(sIdx, { description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STYLES & COLORS TAB */}
      {activeTab === 'styles' && (
        <div className="space-y-6 text-xs">
          {/* Preset Palettes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Paletas de Estilo Prediseñadas
              </span>
              <span className="text-[11px] text-slate-400">Haz clic en un tema para aplicarlo al instante</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Preset 1: Dark Luxe */}
              <button
                type="button"
                onClick={() => applyPreset('dark_luxe')}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-indigo-500 text-left transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white group-hover:text-indigo-400">Dark Luxe</span>
                  <div className="flex -space-x-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0f172a] border border-white/20" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#6366f1] border border-white/20" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#a855f7] border border-white/20" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">Oscuro sofisticado con acentos índigo y púrpura</p>
              </button>

              {/* Preset 2: Clean Light */}
              <button
                type="button"
                onClick={() => applyPreset('clean_light')}
                className="p-3 rounded-xl border border-slate-800 bg-white text-slate-900 hover:border-indigo-500 text-left transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 group-hover:text-indigo-600">Clean Light</span>
                  <div className="flex -space-x-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ffffff] border border-slate-300" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#4f46e5] border border-slate-300" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#f8fafc] border border-slate-300" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-600">Fondo blanco puro, claro y corporativo</p>
              </button>

              {/* Preset 3: Emerald Finance */}
              <button
                type="button"
                onClick={() => applyPreset('emerald_finance')}
                className="p-3 rounded-xl border border-emerald-900 bg-[#022c22] text-emerald-100 hover:border-emerald-500 text-left transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 group-hover:text-emerald-400">Emerald Finance</span>
                  <div className="flex -space-x-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#022c22] border border-white/20" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#10b981] border border-white/20" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#059669] border border-white/20" />
                  </div>
                </div>
                <p className="text-[10px] text-emerald-300/80">Tono verde esmeralda para finanzas y conversión</p>
              </button>

              {/* Preset 4: Neon Cyber */}
              <button
                type="button"
                onClick={() => applyPreset('neon_cyber')}
                className="p-3 rounded-xl border border-slate-800 bg-[#18181b] text-cyan-300 hover:border-cyan-500 text-left transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 group-hover:text-cyan-400">Neon Cyber</span>
                  <div className="flex -space-x-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#18181b] border border-white/20" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#06b6d4] border border-white/20" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#38bdf8] border border-white/20" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">Fondo oscuro tecnológico con luces neón cían</p>
              </button>

              {/* Preset 5: Glassmorphic */}
              <button
                type="button"
                onClick={() => applyPreset('glassmorphic')}
                className="p-3 rounded-xl border border-white/20 bg-slate-900/80 backdrop-blur-md text-white hover:border-pink-500 text-left transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white group-hover:text-pink-400">Glassmorphic</span>
                  <div className="flex -space-x-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-900/60 border border-white/30" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ec4899] border border-white/30" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-300">Cristal translúcido brillante moderno</p>
              </button>

              {/* Preset 6: Minimalist */}
              <button
                type="button"
                onClick={() => applyPreset('minimal')}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-500 text-left transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 group-hover:text-white">Plano Minimal</span>
                  <div className="flex -space-x-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-transparent border border-slate-400" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#4f46e5] border border-slate-400" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">Sin caja de tarjeta ni fondo rígido</p>
              </button>
            </div>
          </div>

          {/* Container & Border Radius */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" /> Estilo de Tarjeta & Redondeado de Bordes
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card Style */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Estilo de Contenedor (Card)</label>
                <select
                  value={currentStyles.card_style || 'card'}
                  onChange={(e) => handleUpdateStyles({ card_style: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="card">Tarjeta Sólida (Sombra & Borde)</option>
                  <option value="glass">Efecto Cristal (Glassmorphic Blur)</option>
                  <option value="bordered">Borde Fino (Sin Elevación)</option>
                  <option value="minimal">Plano (Sin Contenedor)</option>
                </select>
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Redondeado de Esquinas (Border Radius)</label>
                <select
                  value={currentStyles.border_radius || 'xl'}
                  onChange={(e) => handleUpdateStyles({ border_radius: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="none">Recto / Cuadrado (0px)</option>
                  <option value="sm">Suave (6px)</option>
                  <option value="md">Estándar (8px)</option>
                  <option value="lg">Redondeado (12px)</option>
                  <option value="xl">Extra Redondeado (16px)</option>
                  <option value="2xl">Ultra Redondeado (24px)</option>
                  <option value="full">Cápsula / Redondo (Full)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Color Customizers */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-pink-400" /> Colores Personalizados (HEX / RGBA)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Contenedor BG */}
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400">Fondo del Formulario</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentStyles.bg_color && currentStyles.bg_color.startsWith('#') ? currentStyles.bg_color : '#0f172a'}
                    onChange={(e) => handleUpdateStyles({ bg_color: e.target.value })}
                    className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="#0f172a / transparent"
                    value={currentStyles.bg_color || ''}
                    onChange={(e) => handleUpdateStyles({ bg_color: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Texto & Titulo */}
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400">Color de Títulos & Etiquetas</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentStyles.text_color && currentStyles.text_color.startsWith('#') ? currentStyles.text_color : '#ffffff'}
                    onChange={(e) => handleUpdateStyles({ text_color: e.target.value })}
                    className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="#ffffff"
                    value={currentStyles.text_color || ''}
                    onChange={(e) => handleUpdateStyles({ text_color: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Inputs BG */}
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400">Fondo de Inputs</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentStyles.input_bg_color && currentStyles.input_bg_color.startsWith('#') ? currentStyles.input_bg_color : '#020617'}
                    onChange={(e) => handleUpdateStyles({ input_bg_color: e.target.value })}
                    className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="#020617"
                    value={currentStyles.input_bg_color || ''}
                    onChange={(e) => handleUpdateStyles({ input_bg_color: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Inputs Text */}
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400">Texto dentro de Inputs</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentStyles.input_text_color && currentStyles.input_text_color.startsWith('#') ? currentStyles.input_text_color : '#ffffff'}
                    onChange={(e) => handleUpdateStyles({ input_text_color: e.target.value })}
                    className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="#ffffff"
                    value={currentStyles.input_text_color || ''}
                    onChange={(e) => handleUpdateStyles({ input_text_color: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Inputs Border */}
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400">Borde de Inputs</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentStyles.input_border_color && currentStyles.input_border_color.startsWith('#') ? currentStyles.input_border_color : '#1e293b'}
                    onChange={(e) => handleUpdateStyles({ input_border_color: e.target.value })}
                    className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="#1e293b"
                    value={currentStyles.input_border_color || ''}
                    onChange={(e) => handleUpdateStyles({ input_border_color: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Botón Principal BG */}
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400">Fondo / Gradiente de Botón</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentStyles.button_bg_color && currentStyles.button_bg_color.startsWith('#') ? currentStyles.button_bg_color : '#4f46e5'}
                    onChange={(e) => handleUpdateStyles({ button_bg_color: e.target.value })}
                    className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="#4f46e5 / linear-gradient(...)"
                    value={currentStyles.button_bg_color || ''}
                    onChange={(e) => handleUpdateStyles({ button_bg_color: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTOMATION & CRM TAB */}
      {activeTab === 'automation' && (
        <div className="space-y-5 text-xs">
          {/* Action Type */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-emerald-400" /> Acción al Registrar Formulario
            </span>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer ${
                actionType === 'lead' ? 'border-emerald-500 bg-emerald-950/30' : 'border-slate-800 bg-slate-900'
              }`}>
                <input
                  type="radio"
                  name="action_type"
                  value="lead"
                  checked={actionType === 'lead'}
                  onChange={() => onActionTypeChange('lead')}
                  className="text-emerald-600"
                />
                <div>
                  <div className="font-medium text-white">Capturar Lead CRM</div>
                  <div className="text-[11px] text-slate-400">Guarda prospecto en Workspace seleccionado</div>
                </div>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer ${
                actionType === 'register_agency' ? 'border-emerald-500 bg-emerald-950/30' : 'border-slate-800 bg-slate-900'
              }`}>
                <input
                  type="radio"
                  name="action_type"
                  value="register_agency"
                  checked={actionType === 'register_agency'}
                  onChange={() => onActionTypeChange('register_agency')}
                  className="text-emerald-600"
                />
                <div>
                  <div className="font-medium text-white">Crear Agencia & Admin</div>
                  <div className="text-[11px] text-slate-400">Crea la agencia + usuario admin + auto-inscribe cursos</div>
                </div>
              </label>
            </div>
          </div>

          {/* CRM Workspace & Stage Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-300 mb-1">CRM Workspace Destino</label>
              <select
                value={workspaceId || ''}
                onChange={(e) => onWorkspaceChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              >
                <option value="">-- Seleccionar Workspace --</option>
                {resources?.workspaces.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Etapa de Entrada (Stage)</label>
              <select
                value={stageId || ''}
                onChange={(e) => onStageChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              >
                <option value="">-- Primera Etapa por Defecto --</option>
                {filteredStages.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Auto-enrollment LMS Courses if register_agency or courses available */}
          {(actionType === 'register_agency' || (courseIds && courseIds.length > 0)) && (
            <div className="p-3.5 bg-purple-950/30 border border-purple-800/50 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                <BookOpen className="w-4 h-4 text-purple-400" /> Cursos Automáticos para el Admin Creado
              </div>
              <p className="text-[11px] text-slate-400">
                Selecciona los cursos que se asignarán automáticamente al usuario administrador de la nueva agencia al completarse el formulario.
              </p>
              
              {(!resources?.courses || resources.courses.length === 0) ? (
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-400 text-xs italic">
                  No hay cursos activos disponibles en la plataforma. Crea cursos en el módulo LMS para matriculación automática.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {resources.courses.map(course => {
                    const safeCourseIds = courseIds || [];
                    const isChecked = safeCourseIds.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          isChecked ? 'border-purple-500 bg-purple-900/40 text-white font-bold' : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onCourseIdsChange([...safeCourseIds, course.id]);
                            } else {
                              onCourseIdsChange(safeCourseIds.filter(id => id !== course.id));
                            }
                          }}
                          className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="truncate">{course.title}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormSchemaEditor;
