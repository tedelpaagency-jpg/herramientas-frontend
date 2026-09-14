import React, { useState, useEffect } from 'react';
import { LandingTemplate, BuilderSchema, FormSchema, ActionType, PaymentConfig, LandingAvailableResources } from '../../types/landing';
import landingService from '../../services/landingService';
import FormSchemaEditor from './FormSchemaEditor';
import CustomHtmlEditor from './CustomHtmlEditor';
import WorkflowPaymentSettings from './WorkflowPaymentSettings';
import DynamicFormRenderer from './DynamicFormRenderer';
import { X, Save, Layout, Layers, Zap, Code, Eye, Plus, Trash2, Loader2, Globe } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  landing: LandingTemplate | null;
  onSaved: () => void;
}

export const LandingBuilderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  landing,
  onSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'form' | 'html' | 'automation' | 'preview'>('blocks');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resources, setResources] = useState<LandingAvailableResources | undefined>();

  // State fields
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<'visual' | 'custom_html'>('visual');
  const [customHtml, setCustomHtml] = useState('');
  const [actionType, setActionType] = useState<ActionType>('lead');
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [stageId, setStageId] = useState<number | null>(null);
  const [workflowId, setWorkflowId] = useState<number | null>(null);
  const [courseIds, setCourseIds] = useState<number[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    enabled: false,
    currency: 'USD',
    amount: 0,
    product_name: '',
  });

  const [builderSchema, setBuilderSchema] = useState<BuilderSchema>({
    blocks: [
      {
        id: 'hero_1',
        type: 'hero',
        title: 'Bienvenidos a nuestra plataforma',
        subtitle: 'Transforma tu negocio con nuestras herramientas avanzadas',
        bg_color: '#0f172a',
        text_color: '#ffffff',
        button_text: 'Comenzar Ahora',
      },
      {
        id: 'form_1',
        type: 'form',
        title: 'Formulario de Registro',
      },
    ],
  });

  const [formSchema, setFormSchema] = useState<FormSchema>({
    layout: 'linear',
    title: 'Completa tu información',
    submit_button_text: 'Enviar Registro',
    fields: [
      { id: 'f_name', name: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'f_email', name: 'email', label: 'Correo Electrónico', type: 'email', required: true },
      { id: 'f_phone', name: 'phone', label: 'Teléfono', type: 'phone', required: false },
    ],
  });

  useEffect(() => {
    if (isOpen) {
      loadResources();
      if (landing) {
        setTitle(landing.title || '');
        setMode(landing.mode || 'visual');
        setCustomHtml(landing.custom_html || '');
        setActionType(landing.action_type || 'lead');
        setWorkspaceId(landing.workspace_id || null);
        setStageId(landing.stage_id || null);
        setWorkflowId(landing.workflow_id || null);
        setCourseIds(landing.course_ids || []);
        setPaymentConfig(landing.payment_config || { enabled: false, currency: 'USD', amount: 0, product_name: '' });
        if (landing.builder_schema) setBuilderSchema(landing.builder_schema);
        if (landing.form_schema) setFormSchema(landing.form_schema);
      }
    }
  }, [isOpen, landing]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await landingService.getAvailableResources();
      setResources(res);
    } catch (err) {
      console.error('Failed to load landing resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor ingresa un título para la landing page.');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<LandingTemplate> = {
        title: title.trim(),
        name: title.trim(),
        mode,
        custom_html: customHtml,
        action_type: actionType,
        workspace_id: workspaceId,
        stage_id: stageId,
        workflow_id: workflowId,
        course_ids: courseIds,
        payment_config: paymentConfig,
        builder_schema: builderSchema,
        form_schema: formSchema,
      };

      if (landing && landing.id) {
        await landingService.updateLandingBuilder(landing.id, payload);
      } else {
        await landingService.createLanding(payload);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      console.error('Error saving landing:', err);
      let serverMsg = err?.response?.data?.message || err?.message;
      if (err?.message === 'Network Error' || err?.code === 'ERR_NETWORK') {
        serverMsg = 'Error de conexión con el servidor. Por favor verifica tu conexión a internet o intenta nuevamente.';
      }
      alert(`Error al guardar la landing page: ${serverMsg || 'Error de conexión'}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la Landing Page..."
                className="bg-transparent text-lg font-bold text-white placeholder-slate-500 focus:outline-none border-b border-transparent focus:border-indigo-500"
              />
              <p className="text-xs text-slate-400">Web Builder Visual & Form Builder Dinámico</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setMode('visual')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  mode === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Diseñador Visual
              </button>
              <button
                type="button"
                onClick={() => setMode('custom_html')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  mode === 'custom_html' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom HTML
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs px-4 py-2 rounded-xl font-semibold transition shadow-lg disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar Landing
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs">
          {mode === 'visual' && (
            <button
              type="button"
              onClick={() => setActiveTab('blocks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'blocks' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layout className="w-4 h-4" /> Bloques Web
            </button>
          )}

          {mode === 'custom_html' && (
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'html' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" /> Editor HTML
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'form' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> Formulario Dinámico
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('automation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'automation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-400" /> Workflows & Stripe
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'preview' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" /> Vista Previa
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB: VISUAL BLOCKS */}
          {mode === 'visual' && activeTab === 'blocks' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-300">Secciones y Bloques de la Página</span>
                <button
                  type="button"
                  onClick={() => {
                    const newBlock = {
                      id: `block_${Date.now()}`,
                      type: 'cta' as const,
                      title: 'Nueva Sección CTA',
                      subtitle: 'Agrega tu llamado a la acción',
                    };
                    setBuilderSchema({
                      ...builderSchema,
                      blocks: [...builderSchema.blocks, newBlock],
                    });
                  }}
                  className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" /> Agregar Sección
                </button>
              </div>

              {builderSchema.blocks.map((block, idx) => (
                <div key={block.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-indigo-400">Bloque #{idx + 1}: {block.type.toUpperCase()}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setBuilderSchema({
                          ...builderSchema,
                          blocks: builderSchema.blocks.filter((_, i) => i !== idx),
                        });
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Título del Bloque</label>
                      <input
                        type="text"
                        value={block.title || ''}
                        onChange={(e) => {
                          const updated = [...builderSchema.blocks];
                          updated[idx].title = e.target.value;
                          setBuilderSchema({ ...builderSchema, blocks: updated });
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Subtítulo</label>
                      <input
                        type="text"
                        value={block.subtitle || ''}
                        onChange={(e) => {
                          const updated = [...builderSchema.blocks];
                          updated[idx].subtitle = e.target.value;
                          setBuilderSchema({ ...builderSchema, blocks: updated });
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: CUSTOM HTML */}
          {mode === 'custom_html' && activeTab === 'html' && (
            <CustomHtmlEditor customHtml={customHtml} onChange={setCustomHtml} />
          )}

          {/* TAB: DYNAMIC FORM */}
          {activeTab === 'form' && (
            <FormSchemaEditor
              formSchema={formSchema}
              onChange={setFormSchema}
              actionType={actionType}
              onActionTypeChange={setActionType}
              workspaceId={workspaceId}
              onWorkspaceChange={setWorkspaceId}
              stageId={stageId}
              onStageChange={setStageId}
              courseIds={courseIds}
              onCourseIdsChange={setCourseIds}
              resources={resources}
            />
          )}

          {/* TAB: AUTOMATION & PAYMENTS */}
          {activeTab === 'automation' && (
            <WorkflowPaymentSettings
              workflowId={workflowId}
              onWorkflowChange={setWorkflowId}
              paymentConfig={paymentConfig}
              onPaymentConfigChange={setPaymentConfig}
              resources={resources}
            />
          )}

          {/* TAB: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-6 max-w-xl mx-auto py-4">
              <div className="text-center space-y-2">
                <span className="bg-emerald-950 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-800 font-semibold">
                  Vista Previa Interactiva del Formulario
                </span>
              </div>
              <DynamicFormRenderer
                formSchema={formSchema}
                onSubmit={(data) => {
                  alert('Formulario enviado (Vista previa):\n' + JSON.stringify(data, null, 2));
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingBuilderModal;
