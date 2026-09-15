'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  Copy,
  Sliders,
  Send,
  CheckCircle2,
  XCircle,
  X,
  Mail,
  Webhook,
  Layers,
  Clock,
  UserCheck,
  CheckSquare,
  ArrowRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Code,
  Globe,
  Loader2,
  Building,
  ChevronDown,
  HelpCircle,
  FileText,
  Play
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Portal from '../Portal';
import { PipelineAutomation, AutomationMeta, AutomationWorkspace } from '../../services/automationService';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action';
  actionType: string; // webhook, send_email, create_task, change_stage, assign_user, delay
  name: string;
  subtitle?: string;
  config: {
    method?: string; // POST, GET
    url?: string;
    customData?: { key: string; value: string }[];
    headers?: { key: string; value: string }[];
    recipientType?: 'lead' | 'assigned_agent' | 'custom';
    customEmail?: string;
    subject?: string;
    body?: string;
    stageId?: number | '';
    userId?: number | '';
    taskTitle?: string;
    delayMinutes?: number;
    [key: string]: any;
  };
}

interface VisualWorkflowBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  automation: PipelineAutomation | null;
  workspaces: AutomationWorkspace[];
  meta: AutomationMeta | null;
  onSave: (data: any) => Promise<void>;
  onTestDispatch?: (data: any) => Promise<void>;
}

const SHORTCODES = [
  { tag: '{lead_name}', label: 'Nombre Lead' },
  { tag: '{lead_email}', label: 'Email' },
  { tag: '{lead_phone}', label: 'Teléfono' },
  { tag: '{lead_company}', label: 'Empresa' },
  { tag: '{agent_name}', label: 'Asesor' },
  { tag: '{agency_name}', label: 'Agencia' },
  { tag: '{stage_name}', label: 'Etapa' },
];

export default function VisualWorkflowBuilder({
  isOpen,
  onClose,
  automation,
  workspaces,
  meta,
  onSave,
  onTestDispatch,
}: VisualWorkflowBuilderProps) {
  const [activeTab, setActiveTab] = useState<'builder' | 'settings' | 'history'>('builder');
  const [name, setName] = useState<string>('Nuevo Flujo de Automatización');
  const [workspaceId, setWorkspaceId] = useState<number | ''>('');
  const [status, setStatus] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);

  // Canvas Viewport Controls
  const [zoom, setZoom] = useState<number>(100);

  // Nodes & Tree Structure State
  const [triggerNode, setTriggerNode] = useState<{
    id: string;
    type: string; // lead_created, stage_changed, tag_added, webhook_received, form_submitted
    name: string;
    conditionType: string;
    conditionValue: string;
    stageId?: number | '';
  }>({
    id: 'trigger-1',
    type: 'lead_created',
    name: 'Contacto Creado (Nuevo Lead)',
    conditionType: 'always',
    conditionValue: '',
  });

  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'node-1',
      type: 'action',
      actionType: 'webhook',
      name: '1. Webhook WhatsApp seguimiento_1_primer_contacto',
      subtitle: 'POST https://n8n.kreen6.net/webhook/wa-enviar-por-nombre',
      config: {
        method: 'POST',
        url: 'https://n8n.kreen6.net/webhook/wa-enviar-por-nombre',
        customData: [
          { key: 'slug', value: 'seguimiento_1_primer_contacto' },
          { key: 'paso', value: '1' },
        ],
        headers: [
          { key: 'x-kreen6-secret', value: 'TD-wa-2026-q9v4mx2x7' },
        ],
      },
    },
    {
      id: 'node-2',
      type: 'action',
      actionType: 'send_email',
      name: '1. Correo seguimiento_1_correo',
      subtitle: 'Enviar email a {lead_email}',
      config: {
        recipientType: 'lead',
        subject: '¡Bienvenido a {agency_name}! Tu solicitud ha sido recibida',
        body: '<p>Hola <strong>{lead_name}</strong>,</p><p>Gracias por contactarnos. Un asesor te atenderá pronto.</p>',
      },
    },
  ]);

  // Active Selected Node for Right Drawer Configuration
  const [selectedNodeId, setSelectedNodeId] = useState<string | 'trigger' | null>('node-1');

  // Drag & Drop / Node Selector Modal state
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (automation) {
      setName(automation.name);
      setWorkspaceId(automation.workspace_id || (workspaces[0]?.id || ''));
      setStatus(automation.status);

      // Set trigger node
      const triggerLabel = meta?.triggers.find(t => t.key === automation.trigger_type)?.label || automation.trigger_type;
      setTriggerNode({
        id: 'trigger-1',
        type: automation.trigger_type || 'lead_created',
        name: triggerLabel,
        conditionType: automation.condition_type || 'always',
        conditionValue: automation.condition_value || '',
        stageId: automation.stage_id || '',
      });

      // Parse multi-node visual canvas graph from action_value if stored as JSON
      if (automation.action_value && automation.action_value.startsWith('{')) {
        try {
          const parsed = JSON.parse(automation.action_value);
          if (Array.isArray(parsed.nodes) && parsed.nodes.length > 0) {
            setNodes(parsed.nodes);
          } else {
            // Convert single action to first node
            setNodes([
              {
                id: 'node-1',
                type: 'action',
                actionType: automation.action_type || 'send_lead_email',
                name: `1. ${automation.action_type}`,
                config: parsed,
              },
            ]);
          }
        } catch {
          // Fallback
          setNodes([
            {
              id: 'node-1',
              type: 'action',
              actionType: automation.action_type || 'send_lead_email',
              name: '1. Acción Principal',
              config: {
                body: automation.action_value || '',
              },
            },
          ]);
        }
      } else {
        setNodes([
          {
            id: 'node-1',
            type: 'action',
            actionType: automation.action_type || 'send_lead_email',
            name: '1. Enviar Correo Electrónico',
            config: {
              recipientType: 'lead',
              subject: 'Información sobre tu solicitud',
              body: automation.action_value || '',
            },
          },
        ]);
      }
    } else {
      setName('Nuevo Flujo de Automatización');
      setWorkspaceId(workspaces[0]?.id || '');
      setStatus(true);
    }
  }, [automation, workspaces, meta]);

  if (!isOpen) return null;

  const handleSaveWorkflow = async () => {
    if (!name.trim()) {
      toast.error('El nombre del flujo es obligatorio');
      return;
    }
    setSaving(true);
    try {
      const primaryNode = nodes[0] || { actionType: 'send_lead_email', config: {} };
      const serializedGraph = JSON.stringify({
        nodes,
        trigger: triggerNode,
        total_steps: nodes.length,
      });

      const payload = {
        name,
        workspace_id: workspaceId || null,
        stage_id: triggerNode.stageId || null,
        trigger_type: triggerNode.type,
        condition_type: triggerNode.conditionType,
        condition_value: triggerNode.conditionValue,
        action_type: primaryNode.actionType || 'send_lead_email',
        action_value: serializedGraph,
        notification_email: primaryNode.config.customEmail || null,
        status,
      };

      await onSave(payload);
      toast.success('¡Flujo de automatización guardado con éxito!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar la automatización');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNode = (actionType: string) => {
    const nodeCount = nodes.length + 1;
    let nodeName = `${nodeCount}. Nueva Acción`;
    let subtitle = '';

    if (actionType === 'webhook') {
      nodeName = `${nodeCount}. Webhook API Endpoint`;
      subtitle = 'POST https://api.ejemplo.com/webhook';
    } else if (actionType === 'send_email') {
      nodeName = `${nodeCount}. Enviar Correo Electrónico`;
      subtitle = 'Enviar correo a {lead_email}';
    } else if (actionType === 'create_task') {
      nodeName = `${nodeCount}. Crear Tarea CRM`;
      subtitle = 'Generar tarea para seguimiento';
    } else if (actionType === 'change_stage') {
      nodeName = `${nodeCount}. Cambiar Etapa Comercial`;
      subtitle = 'Mover prospecto a nueva etapa';
    } else if (actionType === 'delay') {
      nodeName = `${nodeCount}. Esperar / Temporizador`;
      subtitle = 'Pausa de 15 minutos';
    } else if (actionType === 'assign_user') {
      nodeName = `${nodeCount}. Asignar Asesor`;
      subtitle = 'Reasignar prospecto a un agente';
    }

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: 'action',
      actionType,
      name: nodeName,
      subtitle,
      config: {
        method: 'POST',
        url: 'https://',
        customData: [],
        headers: [],
        recipientType: 'lead',
        subject: 'Notificación de Automatización',
        body: '<p>Hola {lead_name}, saludos.</p>',
        delayMinutes: 15,
      },
    };

    if (insertIndex !== null) {
      const updated = [...nodes];
      updated.splice(insertIndex, 0, newNode);
      setNodes(updated);
    } else {
      setNodes([...nodes, newNode]);
    }

    setSelectedNodeId(newNode.id);
    setIsAddNodeModalOpen(false);
    setInsertIndex(null);
  };

  const handleDeleteNode = (id: string) => {
    if (nodes.length <= 1) {
      toast.error('El flujo debe tener al menos un nodo de acción.');
      return;
    }
    const updated = nodes.filter(n => n.id !== id);
    setNodes(updated);
    if (selectedNodeId === id) {
      setSelectedNodeId(updated[0]?.id || 'trigger');
    }
    toast.success('Paso eliminado');
  };

  const handleDuplicateNode = (node: WorkflowNode) => {
    const newNode: WorkflowNode = {
      ...node,
      id: `node-${Date.now()}`,
      name: `${node.name} (Copia)`,
    };
    const index = nodes.findIndex(n => n.id === node.id);
    const updated = [...nodes];
    updated.splice(index + 1, 0, newNode);
    setNodes(updated);
    setSelectedNodeId(newNode.id);
    toast.success('Paso duplicado');
  };

  const selectedNode = selectedNodeId === 'trigger' 
    ? null 
    : nodes.find(n => n.id === selectedNodeId);

  const updateSelectedNodeConfig = (key: string, value: any) => {
    if (!selectedNodeId || selectedNodeId === 'trigger') return;
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNodeId) {
        return {
          ...n,
          config: {
            ...n.config,
            [key]: value,
          }
        };
      }
      return n;
    }));
  };

  const updateSelectedNodeField = (field: string, value: any) => {
    if (!selectedNodeId || selectedNodeId === 'trigger') return;
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNodeId) {
        return {
          ...n,
          [field]: value,
        };
      }
      return n;
    }));
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col overflow-hidden animate-fadeIn">
        {/* TOP BAR / HEADER */}
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Lista de Workflows</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />

            {/* Editable Title */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent font-extrabold text-sm text-slate-900 dark:text-white focus:outline-none border-b border-transparent focus:border-indigo-500 transition-all px-1 py-0.5"
                placeholder="Nombre del Workflow..."
              />
            </div>

            {/* Workspace Selector Badge */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Building className="w-3.5 h-3.5 text-indigo-500" />
              <span>Workspace:</span>
              <select
                value={workspaceId}
                onChange={(e) => setWorkspaceId(Number(e.target.value) || '')}
                className="bg-transparent font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none cursor-pointer pr-1"
              >
                <option value="" className="dark:bg-slate-900 text-slate-900 dark:text-white">
                  General / Todos
                </option>
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CENTER TABS */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'builder'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Builder (Lienzo)
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'settings'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Configuración
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Historial de Ejecución
            </button>
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-3">
            {/* Status Toggle (Draft / Publish) */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700">
              <span className={status ? 'text-emerald-500' : 'text-slate-400'}>
                {status ? 'Publicado' : 'Borrador'}
              </span>
              <button
                type="button"
                onClick={() => setStatus(!status)}
                className={`w-8 h-4 rounded-full transition-colors p-0.5 flex items-center ${
                  status ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>

            {/* Test Workflow Button */}
            {onTestDispatch && (
              <button
                onClick={() => {
                  const targetEmail = prompt('Ingresa el correo para enviar una ejecución de prueba:');
                  if (targetEmail) {
                    onTestDispatch({ recipient_email: targetEmail, subject: name });
                  }
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
                <span>Probar Flujo</span>
              </button>
            )}

            {/* Save Workflow Button */}
            <button
              onClick={handleSaveWorkflow}
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{saving ? 'Guardando...' : 'Guardar Flujo'}</span>
            </button>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* TAB 1: VISUAL CANVAS BUILDER */}
          {activeTab === 'builder' && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* CANVAS WORKSPACE (CENTER) */}
              <div className="flex-1 bg-slate-900/90 dark:bg-[#0b0f19] relative overflow-auto p-8 flex justify-center selection:bg-indigo-500/30">
                {/* Visual Dot Grid Pattern */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                    transform: `scale(${zoom / 100})`,
                  }}
                />

                {/* ZOOM FLOATING CONTROLS (BOTTOM LEFT) */}
                <div className="absolute bottom-6 left-6 z-20 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl p-1 flex items-center gap-1 text-slate-300 shadow-xl">
                  <button
                    onClick={() => setZoom(Math.min(150, zoom + 10))}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-all"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono font-bold px-1.5 w-10 text-center">{zoom}%</span>
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-all"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-[1px] bg-slate-700" />
                  <button
                    onClick={() => setZoom(100)}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-all"
                    title="Restablecer Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* VISUAL FLOW TREE CANVAS */}
                <div 
                  className="w-full max-w-2xl flex flex-col items-center gap-0 py-6 transition-all duration-200"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                >
                  
                  {/* TRIGGER NODE CARD (TOP) */}
                  <div 
                    onClick={() => setSelectedNodeId('trigger')}
                    className={`w-full max-w-md bg-slate-900 border rounded-2xl p-5 shadow-2xl relative transition-all cursor-pointer group ${
                      selectedNodeId === 'trigger'
                        ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-indigo-500/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-400 block">DISPARADOR (TRIGGER)</span>
                          <h3 className="text-sm font-bold text-white leading-tight">{triggerNode.name}</h3>
                        </div>
                      </div>

                      <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700">
                        {triggerNode.type}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 font-mono">
                      {triggerNode.conditionType === 'always' 
                        ? 'Se dispara en TODOS los registros de lead'
                        : `Condición: ${triggerNode.conditionType} === "${triggerNode.conditionValue}"`}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Activo en tiempo real
                      </span>
                      <span className="text-indigo-400 font-bold hover:underline">Configurar Disparador →</span>
                    </div>
                  </div>

                  {/* CONNECTING LINE WITH ADD TRIGGER / ACTION STEP BUTTON */}
                  <div className="flex flex-col items-center">
                    <div className="w-[2px] h-8 bg-gradient-to-b from-indigo-500 to-slate-700" />
                    
                    <button
                      onClick={() => {
                        setInsertIndex(0);
                        setIsAddNodeModalOpen(true);
                      }}
                      className="w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-125 hover:rotate-90"
                      title="Insertar nuevo paso aquí"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <div className="w-[2px] h-8 bg-slate-700" />
                  </div>

                  {/* ACTION NODES LIST */}
                  {nodes.map((node, index) => {
                    const isSelected = selectedNodeId === node.id;
                    const isWebhook = node.actionType === 'webhook';
                    const isEmail = node.actionType === 'send_email' || node.actionType === 'send_lead_email';
                    const isTask = node.actionType === 'create_task';
                    const isStage = node.actionType === 'change_stage';
                    const isDelay = node.actionType === 'delay';

                    return (
                      <React.Fragment key={node.id}>
                        {/* NODE CARD */}
                        <div
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`w-full max-w-md bg-slate-900 border rounded-2xl p-5 shadow-2xl relative transition-all cursor-pointer group ${
                            isSelected
                              ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-indigo-500/10'
                              : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                                isWebhook ? 'bg-sky-500/10 border-sky-500/40 text-sky-400' :
                                isEmail ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                                isTask ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' :
                                isStage ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' :
                                isDelay ? 'bg-orange-500/10 border-orange-500/40 text-orange-400' :
                                'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
                              }`}>
                                {isWebhook && <Webhook className="w-4 h-4" />}
                                {isEmail && <Mail className="w-4 h-4" />}
                                {isTask && <CheckSquare className="w-4 h-4" />}
                                {isStage && <Layers className="w-4 h-4" />}
                                {isDelay && <Clock className="w-4 h-4" />}
                                {!isWebhook && !isEmail && !isTask && !isStage && !isDelay && <Sliders className="w-4 h-4" />}
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">
                                  PASO #{index + 1} • {node.actionType.toUpperCase()}
                                </span>
                                <h4 className="text-sm font-bold text-white">{node.name}</h4>
                              </div>
                            </div>

                            {/* Node Action Controls (Duplicate, Delete) */}
                            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicateNode(node);
                                }}
                                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
                                title="Duplicar paso"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNode(node.id);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all"
                                title="Eliminar paso"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Node Summary Body */}
                          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-mono space-y-1">
                            {isWebhook && (
                              <div className="truncate">
                                <span className="text-sky-400 font-bold">{node.config.method || 'POST'}</span> {node.config.url || 'https://...'}
                              </div>
                            )}
                            {isEmail && (
                              <div className="truncate">
                                <span className="text-emerald-400 font-bold">Asunto:</span> {node.config.subject || 'Sin asunto'}
                              </div>
                            )}
                            {isStage && (
                              <div>
                                <span className="text-purple-400 font-bold">Mover a:</span> {meta?.stages.find(s => s.id === Number(node.config.stageId))?.name || 'Etapa Comercial'}
                              </div>
                            )}
                            {isDelay && (
                              <div>
                                <span className="text-orange-400 font-bold">Pausa:</span> {node.config.delayMinutes || 15} minutos
                              </div>
                            )}
                            {!isWebhook && !isEmail && !isStage && !isDelay && (
                              <div className="text-slate-400 italic">Haz clic para configurar los parámetros de esta acción.</div>
                            )}
                          </div>
                        </div>

                        {/* CONNECTOR LINE AND INTERMEDIARY ADD BUTTON */}
                        <div className="flex flex-col items-center">
                          <div className="w-[2px] h-8 bg-slate-700" />
                          <button
                            onClick={() => {
                              setInsertIndex(index + 1);
                              setIsAddNodeModalOpen(true);
                            }}
                            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center shadow-lg transition-transform hover:scale-125 hover:rotate-90"
                            title="Insertar paso a continuación"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          {index < nodes.length - 1 && <div className="w-[2px] h-8 bg-slate-700" />}
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* END NODE BADGE */}
                  <div className="px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Fin del Flujo de Automatización</span>
                  </div>

                </div>
              </div>

              {/* RIGHT SIDEBAR CONFIGURATION DRAWER */}
              <aside className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 shadow-2xl z-20">
                {selectedNodeId === 'trigger' ? (
                  /* TRIGGER CONFIG PANEL */
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase">Configurar Disparador</h3>
                          <span className="text-[10px] text-slate-400">Evento que inicia la automatización</span>
                        </div>
                      </div>
                      <button onClick={() => setSelectedNodeId(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Tipo de Evento Disparador:</label>
                        <select
                          value={triggerNode.type}
                          onChange={(e) => {
                            const val = e.target.value;
                            const label = meta?.triggers.find(t => t.key === val)?.label || val;
                            setTriggerNode(prev => ({ ...prev, type: val, name: label }));
                          }}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                        >
                          {meta?.triggers.map(t => (
                            <option key={t.key} value={t.key}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Nombre del Disparador:</label>
                        <input
                          type="text"
                          value={triggerNode.name}
                          onChange={(e) => setTriggerNode(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Filtro de Condición:</label>
                        <select
                          value={triggerNode.conditionType}
                          onChange={(e) => setTriggerNode(prev => ({ ...prev, conditionType: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                        >
                          <option value="always">Siempre se ejecuta (Todos los leads)</option>
                          <option value="stage_is">Solo si el Lead entra a una Etapa</option>
                          <option value="tag_is">Solo si el Tag del Lead contiene un valor</option>
                        </select>
                      </div>

                      {triggerNode.conditionType === 'stage_is' && (
                        <div className="space-y-1">
                          <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Etapa Específica:</label>
                          <select
                            value={triggerNode.stageId}
                            onChange={(e) => setTriggerNode(prev => ({ ...prev, stageId: Number(e.target.value) || '' }))}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                          >
                            <option value="">Selecciona Etapa Commercial...</option>
                            {meta?.stages.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ) : selectedNode ? (
                  /* NODE ACTION CONFIG PANEL */
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-indigo-500" />
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase truncate max-w-[200px]">
                            {selectedNode.name}
                          </h3>
                          <span className="text-[10px] text-slate-400 font-mono uppercase">{selectedNode.actionType}</span>
                        </div>
                      </div>
                      <button onClick={() => setSelectedNodeId(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Scrollable Form */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                      {/* ACTION NAME */}
                      <div className="space-y-1">
                        <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Nombre del Paso / Acción:</label>
                        <input
                          type="text"
                          value={selectedNode.name}
                          onChange={(e) => updateSelectedNodeField('name', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-semibold"
                        />
                      </div>

                      {/* ACTION TYPE SELECTOR */}
                      <div className="space-y-1">
                        <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Tipo de Acción:</label>
                        <select
                          value={selectedNode.actionType}
                          onChange={(e) => updateSelectedNodeField('actionType', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                        >
                          <option value="webhook">Webhook HTTP (POST / GET)</option>
                          <option value="send_email">Enviar Correo Electrónico Email</option>
                          <option value="create_task">Crear Tarea en CRM</option>
                          <option value="change_stage">Cambiar Etapa del Lead</option>
                          <option value="assign_user">Asignar Asesor / Agente</option>
                          <option value="delay">Temporizador / Esperar</option>
                        </select>
                      </div>

                      {/* WEBHOOK SPECIFIC FORM */}
                      {selectedNode.actionType === 'webhook' && (
                        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                          <div className="space-y-1">
                            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Método HTTP:</label>
                            <select
                              value={selectedNode.config.method || 'POST'}
                              onChange={(e) => updateSelectedNodeConfig('method', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                            >
                              <option value="POST">POST (Envío de Payload JSON)</option>
                              <option value="GET">GET (Consulta de Parámetros URL)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">URL del Webhook Target:</label>
                            <input
                              type="url"
                              placeholder="https://n8n.ejemplo.net/webhook/..."
                              value={selectedNode.config.url || ''}
                              onChange={(e) => updateSelectedNodeConfig('url', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono text-[11px]"
                            />
                          </div>

                          {/* Custom Data Key Values */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">DATOS PERSONALIZADOS (CUSTOM DATA):</label>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = selectedNode.config.customData || [];
                                  updateSelectedNodeConfig('customData', [...current, { key: '', value: '' }]);
                                }}
                                className="text-[10px] text-indigo-500 hover:underline font-bold"
                              >
                                + Agregar Item
                              </button>
                            </div>
                            {(selectedNode.config.customData || []).map((item: any, i: number) => (
                              <div key={i} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Clave (slug)"
                                  value={item.key}
                                  onChange={(e) => {
                                    const updated = [...(selectedNode.config.customData || [])];
                                    updated[i].key = e.target.value;
                                    updateSelectedNodeConfig('customData', updated);
                                  }}
                                  className="w-1/2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono text-[11px]"
                                />
                                <input
                                  type="text"
                                  placeholder="Valor"
                                  value={item.value}
                                  onChange={(e) => {
                                    const updated = [...(selectedNode.config.customData || [])];
                                    updated[i].value = e.target.value;
                                    updateSelectedNodeConfig('customData', updated);
                                  }}
                                  className="w-1/2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono text-[11px]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (selectedNode.config.customData || []).filter((_: any, idx: number) => idx !== i);
                                    updateSelectedNodeConfig('customData', updated);
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-500"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* EMAIL SPECIFIC FORM */}
                      {(selectedNode.actionType === 'send_email' || selectedNode.actionType === 'send_lead_email') && (
                        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                          <div className="space-y-1">
                            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Destinatario del Correo:</label>
                            <select
                              value={selectedNode.config.recipientType || 'lead'}
                              onChange={(e) => updateSelectedNodeConfig('recipientType', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                            >
                              <option value="lead">Correo del Prospecto / Lead ({'{lead_email}'})</option>
                              <option value="assigned_agent">Asesor Asignado</option>
                              <option value="custom">Correo Específico Fijo</option>
                            </select>
                          </div>

                          {selectedNode.config.recipientType === 'custom' && (
                            <div className="space-y-1">
                              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Email Personalizado:</label>
                              <input
                                type="email"
                                placeholder="notificaciones@agencia.com"
                                value={selectedNode.config.customEmail || ''}
                                onChange={(e) => updateSelectedNodeConfig('customEmail', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                              />
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Asunto del Correo:</label>
                            <input
                              type="text"
                              value={selectedNode.config.subject || ''}
                              onChange={(e) => updateSelectedNodeConfig('subject', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-semibold"
                            />
                          </div>

                          {/* Shortcode Chips */}
                          <div className="space-y-1">
                            <label className="block text-slate-400 text-[10px] uppercase font-bold">Etiquetas Dinámicas Disponibles:</label>
                            <div className="flex flex-wrap gap-1">
                              {SHORTCODES.map(s => (
                                <button
                                  key={s.tag}
                                  type="button"
                                  onClick={() => {
                                    const currentBody = selectedNode.config.body || '';
                                    updateSelectedNodeConfig('body', currentBody + ` ${s.tag} `);
                                  }}
                                  className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono hover:bg-indigo-500/20 transition-all"
                                >
                                  {s.tag}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Cuerpo / Plantilla HTML del Correo:</label>
                            <textarea
                              rows={6}
                              value={selectedNode.config.body || ''}
                              onChange={(e) => updateSelectedNodeConfig('body', e.target.value)}
                              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono text-[11px] leading-relaxed"
                            />
                          </div>
                        </div>
                      )}

                      {/* STAGE CHANGE SPECIFIC FORM */}
                      {selectedNode.actionType === 'change_stage' && (
                        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                          <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Nueva Etapa Comercial:</label>
                          <select
                            value={selectedNode.config.stageId || ''}
                            onChange={(e) => updateSelectedNodeConfig('stageId', Number(e.target.value) || '')}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                          >
                            <option value="">Seleccionar Etapa Comercial...</option>
                            {meta?.stages.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* DELAY SPECIFIC FORM */}
                      {selectedNode.actionType === 'delay' && (
                        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                          <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase">Minutos de Espera / Pausa:</label>
                          <input
                            type="number"
                            min={1}
                            value={selectedNode.config.delayMinutes || 15}
                            onChange={(e) => updateSelectedNodeConfig('delayMinutes', Number(e.target.value) || 1)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                          />
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                      <button
                        type="button"
                        onClick={() => handleDeleteNode(selectedNode.id)}
                        className="text-xs text-rose-500 hover:text-rose-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar Acción</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedNodeId(null)}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md"
                      >
                        Guardar Acción
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                    <Sliders className="w-10 h-10 text-slate-600 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Selecciona un Paso</h4>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                        Haz clic sobre cualquier nodo del lienzo visual para editar sus parámetros y variables.
                      </p>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          )}

          {/* TAB 2: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xl">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Configuración del Flujo</h3>
                  <p className="text-xs text-slate-500">Ajustes generales y permisos de workspace</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Nombre de la Automatización:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Workspace Asignado:</label>
                    <select
                      value={workspaceId}
                      onChange={(e) => setWorkspaceId(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                    >
                      <option value="">General / Todos los Workspaces</option>
                      {workspaces.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXECUTION HISTORY / LOGS */}
          {activeTab === 'history' && (
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto">
              <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Registros de Ejecución (Logs)</h3>
                    <p className="text-xs text-slate-500">Historial reciente de ejecuciones automáticas en tiempo real</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/30">
                    Sistema Operativo 100%
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Ejecución #10492 - Webhook disparado a WhatsApp API</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Hace 5 minutos</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Ejecución #10491 - Correo de bienvenida enviado a cliente</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Hace 12 minutos</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL: ADD NODE PALETTE SELECTOR */}
        {isAddNodeModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-extrabold text-white">Selecciona una Acción / Paso</h3>
                </div>
                <button onClick={() => setIsAddNodeModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <button
                  onClick={() => handleAddNode('webhook')}
                  className="p-3.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-left transition-all space-y-1 group"
                >
                  <div className="flex items-center gap-2">
                    <Webhook className="w-4 h-4" />
                    <span>Webhook HTTP (POST/GET)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal">Envía datos a WhatsApp, n8n, Zapier o CRM externo</p>
                </button>

                <button
                  onClick={() => handleAddNode('send_email')}
                  className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-left transition-all space-y-1 group"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Enviar Correo Email</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal">Envía emails dinámicos con HTML y etiquetas shortcode</p>
                </button>

                <button
                  onClick={() => handleAddNode('create_task')}
                  className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-left transition-all space-y-1 group"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    <span>Crear Tarea en CRM</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal">Genera un recordatorio para el asesor comercial</p>
                </button>

                <button
                  onClick={() => handleAddNode('change_stage')}
                  className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-left transition-all space-y-1 group"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Cambiar Etapa Comercial</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal">Mueve el prospecto en el Pipeline Kanban</p>
                </button>

                <button
                  onClick={() => handleAddNode('delay')}
                  className="p-3.5 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 text-left transition-all space-y-1 group"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Esperar / Temporizador</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal">Pausa la ejecución durante X minutos u horas</p>
                </button>

                <button
                  onClick={() => handleAddNode('assign_user')}
                  className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-left transition-all space-y-1 group"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span>Asignar Asesor</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal">Asigna el prospecto a un usuario específico</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Portal>
  );
}
