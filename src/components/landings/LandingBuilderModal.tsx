'use client';

import React, { useState, useEffect } from 'react';
import { LandingTemplate, BuilderSchema, FormSchema, ActionType, PaymentConfig, LandingAvailableResources } from '../../types/landing';
import landingService from '../../services/landingService';
import FormSchemaEditor from './FormSchemaEditor';
import CustomHtmlEditor from './CustomHtmlEditor';
import WorkflowPaymentSettings from './WorkflowPaymentSettings';
import DynamicFormRenderer from './DynamicFormRenderer';
import { X, Save, Layout, Layers, Zap, Code, Eye, Plus, Trash2, Loader2, Globe, ExternalLink, Copy, Check, ArrowRight } from 'lucide-react';
import { prepareLandingHtml } from '@/utils/landingHtmlHelper';

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
  const [activeTab, setActiveTab] = useState<'blocks' | 'form' | 'html' | 'automation' | 'domain' | 'preview'>('blocks');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resources, setResources] = useState<LandingAvailableResources | undefined>();

  // State fields
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<'visual' | 'custom_html'>('visual');
  const [customHtml, setCustomHtml] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [copiedRedirect, setCopiedRedirect] = useState(false);
  const [actionType, setActionType] = useState<ActionType>('lead');
  const [planId, setPlanId] = useState<number | null>(null);
  const [defaultPassword, setDefaultPassword] = useState<string>('Acceso@2026');
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [stageId, setStageId] = useState<number | null>(null);
  const [workflowId, setWorkflowId] = useState<number | null>(null);
  const [courseIds, setCourseIds] = useState<number[]>([]);
  const [termsAndConditions, setTermsAndConditions] = useState<string>('');
  const [privacyPolicy, setPrivacyPolicy] = useState<string>('');
  const [sendCredentials, setSendCredentials] = useState<boolean>(true);
  const [credentialTemplateId, setCredentialTemplateId] = useState<number | null>(null);
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
        let rawHtml = landing.custom_html || '';
        if (typeof rawHtml === 'string' && rawHtml.startsWith('base64:')) {
          try {
            rawHtml = decodeURIComponent(escape(atob(rawHtml.replace(/^base64:/, ''))));
          } catch (e) {
            console.error('Error decoding custom_html base64 in builder:', e);
            rawHtml = landing.custom_html || '';
          }
        }
        setMode(landing.mode === 'custom_html' || (rawHtml && rawHtml.length > 50) ? 'custom_html' : (landing.mode || 'visual'));
        setCustomHtml(rawHtml);
        setActionType(landing.action_type || 'lead');
        setPlanId(landing.plan_id || null);
        setDefaultPassword(landing.default_password || (landing.form_schema as any)?.default_password || 'Acceso@2026');
        setWorkspaceId(landing.workspace_id || null);
        setStageId(landing.stage_id || null);
        setWorkflowId(landing.workflow_id || null);
        setCourseIds(landing.course_ids || []);
        setTermsAndConditions(landing.terms_and_conditions || '');
        setPrivacyPolicy(landing.privacy_policy || '');
        setSendCredentials(landing.send_credentials !== undefined ? Boolean(landing.send_credentials) : ((landing.form_schema as any)?.send_credentials !== false));
        setCredentialTemplateId(landing.credential_template_id || (landing.form_schema as any)?.credential_template_id || null);
        setCustomDomain(landing.custom_domain || '');

        const initialPayment = landing.payment_config || { enabled: false, currency: 'USD', amount: 0, product_name: '' };
        const initialFormSchema = landing.form_schema || {
          layout: 'linear',
          fields: [
            { id: 'f_name', name: 'name', label: 'Nombre Completo', type: 'text', required: true },
            { id: 'f_email', name: 'email', label: 'Correo Electrónico', type: 'email', required: true },
            { id: 'f_phone', name: 'phone', label: 'Teléfono', type: 'phone', required: false },
          ],
        };
        const initialStripeAppearance = landing.stripe_appearance || initialPayment.stripe_appearance || initialFormSchema.stripe_appearance;

        if (initialStripeAppearance) {
          initialPayment.stripe_appearance = initialStripeAppearance;
          initialFormSchema.stripe_appearance = initialStripeAppearance;
        }

        setPaymentConfig(initialPayment);
        setFormSchema(initialFormSchema);
        if (landing.builder_schema) setBuilderSchema(landing.builder_schema);
      }
    }
  }, [isOpen, landing]);

  const handleFormSchemaChange = (newSchema: FormSchema) => {
    setFormSchema(newSchema);
    if (newSchema.stripe_appearance) {
      setPaymentConfig((prev) => ({ ...prev, stripe_appearance: newSchema.stripe_appearance }));
    }
  };

  const handlePaymentConfigChange = (newConfig: PaymentConfig) => {
    setPaymentConfig(newConfig);
    if (newConfig.stripe_appearance) {
      setFormSchema((prev) => ({ ...prev, stripe_appearance: newConfig.stripe_appearance }));
    }
  };

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
      let safeCustomHtml = customHtml;
      if (customHtml && customHtml.trim()) {
        try {
          safeCustomHtml = `base64:${btoa(unescape(encodeURIComponent(customHtml)))}`;
        } catch {
          safeCustomHtml = customHtml;
        }
      }

      const activeStripeAppearance = formSchema?.stripe_appearance || paymentConfig?.stripe_appearance;

      const finalMode = (mode === 'custom_html' || (customHtml && customHtml.trim().length > 50)) ? 'custom_html' : mode;
      const cleanCustomDomain = customDomain.trim()
        ? customDomain.trim().toLowerCase().replace(/^https?:\/\//i, '').replace(/\/+$/, '')
        : null;

      const payload: Partial<LandingTemplate> = {
        title: title.trim(),
        name: title.trim(),
        mode: finalMode,
        custom_html: safeCustomHtml,
        custom_domain: cleanCustomDomain,
        action_type: actionType,
        plan_id: planId,
        default_password: defaultPassword,
        workspace_id: workspaceId,
        stage_id: stageId,
        workflow_id: workflowId,
        course_ids: courseIds,
        terms_and_conditions: termsAndConditions,
        privacy_policy: privacyPolicy,
        payment_config: paymentConfig,
        builder_schema: builderSchema,
        form_schema: {
          ...formSchema,
          send_credentials: sendCredentials,
          credential_template_id: credentialTemplateId,
        },
        stripe_appearance: activeStripeAppearance,
        send_credentials: sendCredentials,
        credential_template_id: credentialTemplateId,
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
            onClick={() => setActiveTab('domain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'domain' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-300" /> Dominio Web
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
              onChange={handleFormSchemaChange}
              actionType={actionType}
              onActionTypeChange={setActionType}
              planId={planId}
              onPlanChange={setPlanId}
              defaultPassword={defaultPassword}
              onDefaultPasswordChange={setDefaultPassword}
              workspaceId={workspaceId}
              onWorkspaceChange={setWorkspaceId}
              stageId={stageId}
              onStageChange={setStageId}
              courseIds={courseIds}
              onCourseIdsChange={setCourseIds}
              resources={resources}
              termsAndConditions={termsAndConditions}
              onTermsAndConditionsChange={setTermsAndConditions}
              privacyPolicy={privacyPolicy}
              onPrivacyPolicyChange={setPrivacyPolicy}
              sendCredentials={sendCredentials}
              onSendCredentialsChange={setSendCredentials}
              credentialTemplateId={credentialTemplateId}
              onCredentialTemplateIdChange={setCredentialTemplateId}
            />
          )}

          {/* TAB: AUTOMATION & PAYMENTS */}
          {activeTab === 'automation' && (
            <WorkflowPaymentSettings
              workflowId={workflowId}
              onWorkflowChange={setWorkflowId}
              paymentConfig={paymentConfig}
              onPaymentConfigChange={handlePaymentConfigChange}
              resources={resources}
            />
          )}

          {/* TAB: CUSTOM DOMAIN & REDIRECTION */}
          {activeTab === 'domain' && (() => {
            const encodedId = landing?.encoded_id || (landing?.id ? btoa(String(landing.id)) : '');
            const targetPortalBase = (landing?.white_label as any)?.custom_domain
              ? `https://${(landing?.white_label as any).custom_domain.replace(/^https?:\/\//i, '').replace(/\/+$/, '')}`
              : (typeof window !== 'undefined' ? window.location.origin : 'https://santun.tedelpa.com');
            const targetRedirectUrl = encodedId ? `${targetPortalBase}/landing?id=${encodedId}` : `${targetPortalBase}/landing`;

            return (
              <div className="max-w-3xl mx-auto space-y-6 py-2">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Dominio Web Personalizado</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Asigna un dominio o subdominio propio a esta Landing Page. Cuando cualquier visitante ingrese a este dominio (ej. <span className="font-mono text-emerald-400 font-bold">yes360.academy</span>), será redirigido automáticamente a la landing oficial de tu portal.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Dominio o Subdominio (sin http:// ni https://)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Globe className="w-4 h-4 text-emerald-400" />
                      </div>
                      <input
                        type="text"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="ej. yes360.academy o promo.yes360.academy"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Puedes ingresar dominios raíz como <span className="text-slate-400 font-mono">yes360.academy</span> o subdominios como <span className="text-slate-400 font-mono">certificacion.yes360.academy</span>.
                    </p>
                  </div>

                  {/* Destino de Redirección Automática */}
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <ArrowRight className="w-4 h-4 text-emerald-400" />
                        Destino de Redirección Automática
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Redirección 302 Activa
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs font-mono text-slate-300 break-all">
                      <span className="truncate flex-1 select-all text-indigo-300">
                        {targetRedirectUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(targetRedirectUrl);
                          setCopiedRedirect(true);
                          setTimeout(() => setCopiedRedirect(false), 2000);
                        }}
                        className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0"
                        title="Copiar URL de destino"
                      >
                        {copiedRedirect ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={targetRedirectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 transition shrink-0"
                        title="Abrir destino en nueva pestaña"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Cualquier parámetro de seguimiento o campaña (ej. <span className="text-slate-400 font-mono">?utm_source=...</span>) será reenviado automáticamente al portal.
                    </p>
                  </div>

                  {/* DNS Setup Card */}
                  <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 space-y-2 text-xs">
                    <span className="font-bold text-slate-200">Guía de Configuración DNS:</span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      En el proveedor donde gestionas el DNS de tu dominio (GoDaddy, Namecheap, Cloudflare, etc.), añade los registros según corresponda:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold">Registro A (Dominio Raíz)</span>
                        <div><span className="text-indigo-400 font-bold">Host / Nombre:</span> @</div>
                        <div><span className="text-indigo-400 font-bold">Apunta a:</span> IP de tu servidor</div>
                      </div>
                      <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold">Registro CNAME (Subdominio / WWW)</span>
                        <div><span className="text-indigo-400 font-bold">Host / Nombre:</span> www o subdominio</div>
                        <div><span className="text-indigo-400 font-bold">Apunta a:</span> portal de tu marca blanca</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-6 max-w-4xl mx-auto py-4">
              <div className="text-center space-y-2">
                <span className="bg-emerald-950 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-800 font-semibold">
                  {mode === 'custom_html' ? 'Vista Previa Interactiva de Landing HTML Custom' : 'Vista Previa Interactiva del Formulario'}
                </span>
              </div>

              {mode === 'custom_html' && customHtml ? (
                <div className="w-full h-[600px] bg-white rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                  <iframe
                    srcDoc={prepareLandingHtml(customHtml, {
                      formPlaceholderHtml: '<div style="padding:24px;background:#f8fafc;border:2px dashed #6366f1;border-radius:16px;text-align:center;color:#4f46e5;font-family:sans-serif;font-weight:bold;">[FORMULARIO DINÁMICO SE MOSTRARÁ AQUÍ]</div>',
                      injectFormStyles: false,
                    })}
                    title="Custom HTML Landing Preview"
                    className="w-full h-full border-0 block"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </div>
              ) : (
                <div className="max-w-xl mx-auto">
                  <DynamicFormRenderer
                    formSchema={formSchema}
                    paymentConfig={paymentConfig}
                    termsAndConditions={termsAndConditions}
                    privacyPolicy={privacyPolicy}
                    stripeAppearance={formSchema?.stripe_appearance || paymentConfig?.stripe_appearance}
                    onSubmit={(data) => {
                      alert('Formulario enviado (Vista previa):\n' + JSON.stringify(data, null, 2));
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingBuilderModal;
