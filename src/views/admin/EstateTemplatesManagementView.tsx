'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Download,
  Eye,
  LayoutTemplate,
  Check,
  X,
  Code,
  Layers,
  Search,
  Maximize2,
  HelpCircle,
  FileCode,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import estateTemplateService, { EstateTemplateItem } from '@/services/estateTemplateService';
import {
  substituteTemplateShortcuts,
  downloadHtmlAsPng,
  prepareHtmlForRendering,
  TemplateDataPayload,
} from '@/utils/estateTemplateRenderer';

// Muestra de datos para la previsualización interactiva
const SAMPLE_ESTATE_PAYLOAD: TemplateDataPayload = {
  logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
  property_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  property_image_1: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  property_image_2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  property_image_3: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  property_image_4: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  agent_name: 'Carlos Mendoza',
  agent_phone: '+593 99 876 5432',
  property_price: '$285,000 USD',
  plain_amenities: '3 Hab • 2 Baños • 220 m²',
  amenities: `
    <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);padding:6px 14px;border-radius:9999px;color:#fff;font-weight:700;font-size:14px;">🛏️ 3 Hab.</span>
    <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);padding:6px 14px;border-radius:9999px;color:#fff;font-weight:700;font-size:14px;">🚿 2 Baños</span>
    <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);padding:6px 14px;border-radius:9999px;color:#fff;font-weight:700;font-size:14px;">🚗 2 Estac.</span>
    <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);padding:6px 14px;border-radius:9999px;color:#fff;font-weight:700;font-size:14px;">📐 220 m²</span>
  `,
  property_title: 'Villa Moderna con Piscina & Jardín',
  location: 'Cumbayá, Quito',
  operation_type: 'En Venta',
  property_type: 'Casa Residencial',
};

const SHORTCUTS_LIST = [
  { key: '{{logo}}', label: 'Logo', desc: 'Logo de la agencia inmobiliaria' },
  { key: '{{property_image}}', label: 'Imagen de la Propiedad', desc: 'Foto principal o seleccionada' },
  { key: '{{property_image_1}}', label: 'Foto #1', desc: 'Primera foto del carrusel' },
  { key: '{{property_image_2}}', label: 'Foto #2', desc: 'Segunda foto del carrusel' },
  { key: '{{property_image_3}}', label: 'Foto #3', desc: 'Tercera foto del carrusel' },
  { key: '{{agent_name}}', label: 'Nombre y Apellido', desc: 'Nombre del asesor o agente' },
  { key: '{{agent_phone}}', label: 'Número de Teléfono', desc: 'Teléfono o WhatsApp de contacto' },
  { key: '{{property_price}}', label: 'Precio de la Propiedad', desc: 'Precio formateado (ej. $285,000 USD)' },
  { key: '{{amenities}}', label: 'Amenidades', desc: 'Hab, baños, estac. y m²' },
  { key: '{{property_title}}', label: 'Título del Inmueble', desc: 'Título principal de la propiedad' },
  { key: '{{location}}', label: 'Ubicación', desc: 'Ciudad y sector o provincia' },
];

export const EstateTemplatesManagementView: React.FC = () => {
  const { user, currentAgency } = useAuth();
  const agency = (user as any)?.agency || (user as any)?.agency_data || currentAgency;

  const isSuperAdmin =
    user?.role === 'super_admin' || user?.roles?.some((r) => r.name === 'super_admin');
  const isWhiteLabelAdmin =
    user?.role === 'white_label_admin' || user?.roles?.some((r) => r.name === 'white_label_admin');
  const canManage = isSuperAdmin || isWhiteLabelAdmin;

  const [templates, setTemplates] = useState<EstateTemplateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterRatio, setFilterRatio] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal Editor state
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<EstateTemplateItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    aspect_ratio: '1:1',
    width: 1080,
    height: 1080,
    html_content: '',
  });
  const [saving, setSaving] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<'editor' | 'preview'>('editor');

  // Preview Modal state
  const [previewModalTemplate, setPreviewModalTemplate] = useState<EstateTemplateItem | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await estateTemplateService.getTemplates();
      setTemplates(res.templates);
    } catch (err: any) {
      toast.error('Error al cargar plantillas HTML');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchRatio = filterRatio === 'all' || tpl.aspect_ratio === filterRatio;
      const matchSearch =
        !searchQuery.trim() ||
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tpl.description && tpl.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRatio && matchSearch;
    });
  }, [templates, filterRatio, searchQuery]);

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      description: '',
      aspect_ratio: '1:1',
      width: 1080,
      height: 1080,
      html_content: `<div style="position: relative; width: 1080px; height: 1080px; background-color: #0f172a; overflow: hidden; font-family: sans-serif; box-sizing: border-box;">
  <img src="{{property_image}}" alt="Propiedad" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" />
  <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,23,42,0.7) 0%, transparent 40%, rgba(15,23,42,0.95) 85%);"></div>

  <div style="position: absolute; top: 40px; left: 40px; right: 40px; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
    <div style="background: rgba(255,255,255,0.95); padding: 12px 24px; border-radius: 16px;">
      <img src="{{logo}}" alt="Logo" style="max-height: 50px; object-fit: contain;" />
    </div>
    <span style="background: #10b981; color: #fff; padding: 10px 24px; border-radius: 9999px; font-weight: 800; font-size: 18px;">DESTACADO</span>
  </div>

  <div style="position: absolute; bottom: 40px; left: 40px; right: 40px; z-index: 10;">
    <div style="background: #e2b728; color: #000; padding: 10px 24px; border-radius: 14px; font-weight: 900; font-size: 32px; display: inline-block; margin-bottom: 14px;">
      {{property_price}}
    </div>
    <h1 style="color: #ffffff; font-size: 42px; font-weight: 900; line-height: 1.2; margin: 0 0 10px 0;">
      {{property_title}}
    </h1>
    <p style="color: #cbd5e1; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">
      📍 {{location}}
    </p>

    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px;">
      {{amenities}}
    </div>

    <div style="background: rgba(255,255,255,0.12); backdrop-filter: blur(12px); border: 1.5px solid rgba(255,255,255,0.25); border-radius: 20px; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <p style="color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 700; margin: 0; text-transform: uppercase;">Asesor Inmobiliario</p>
        <p style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0;">{{agent_name}}</p>
      </div>
      <div style="background: #ffffff; color: #0f172a; padding: 12px 24px; border-radius: 14px; font-weight: 800; font-size: 20px;">
        📞 {{agent_phone}}
      </div>
    </div>
  </div>
</div>`,
    });
    setPreviewTab('editor');
    setEditorOpen(true);
  };

  const handleOpenEdit = (tpl: EstateTemplateItem) => {
    setEditingTemplate(tpl);
    setFormData({
      name: tpl.name,
      description: tpl.description || '',
      aspect_ratio: tpl.aspect_ratio || '1:1',
      width: tpl.width || 1080,
      height: tpl.height || 1080,
      html_content: tpl.html_content,
    });
    setPreviewTab('editor');
    setEditorOpen(true);
  };

  const handleInsertShortcut = (shortcut: string) => {
    setFormData((prev) => ({
      ...prev,
      html_content: prev.html_content + shortcut,
    }));
    toast.success(`Atajo ${shortcut} insertado`, { duration: 1500 });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('El nombre de la plantilla es obligatorio');
      return;
    }
    if (!formData.html_content.trim()) {
      toast.error('El código HTML de la plantilla no puede estar vacío');
      return;
    }

    setSaving(true);
    try {
      if (editingTemplate) {
        await estateTemplateService.updateTemplate(editingTemplate.id, formData);
        toast.success('¡Plantilla actualizada con éxito!');
      } else {
        await estateTemplateService.createTemplate(formData);
        toast.success('¡Plantilla creada con éxito!');
      }
      setEditorOpen(false);
      fetchTemplates();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar plantilla');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tpl: EstateTemplateItem) => {
    if (!window.confirm(`¿Estás seguro de eliminar la plantilla "${tpl.name}"?`)) {
      return;
    }
    try {
      await estateTemplateService.deleteTemplate(tpl.id);
      toast.success('Plantilla eliminada correctamente');
      fetchTemplates();
    } catch (err: any) {
      toast.error('Error al eliminar la plantilla');
    }
  };

  const handleDownloadSample = async (tpl: EstateTemplateItem) => {
    try {
      toast.loading('Generando imagen PNG de alta resolución...', { id: 'render-png' });
      const renderedHtml = substituteTemplateShortcuts(tpl.html_content, SAMPLE_ESTATE_PAYLOAD);
      await downloadHtmlAsPng(
        renderedHtml,
        tpl.width || 1080,
        tpl.height || 1080,
        `${tpl.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
      );
      toast.success('¡Imagen PNG descargada con éxito!', { id: 'render-png' });
    } catch (err: any) {
      toast.error('Error al renderizar el PNG', { id: 'render-png' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Superior estilo Marketing B2B */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Plantillas Creativas Inmobiliarias
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Plantillas HTML para flyers de propiedades con atajos automáticos y descarga en PNG
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {canManage && (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="px-5 py-2.5 rounded-xl bg-primary hover:brightness-110 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-primary/20 transition-all duration-150 active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Plantilla HTML</span>
              </button>
            )}
          </div>
        </div>

        {/* Banner informativo de permisos si no es admin de marca blanca */}
        {!canManage && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs font-semibold">
              <strong className="font-extrabold">Catálogo de Creativos:</strong> Puedes previsualizar y descargar cualquier plantilla con tus propiedades en el listado de inmuebles. Solo el administrador de Marca Blanca puede crear, editar o eliminar estas plantillas.
            </p>
          </div>
        )}

        {/* Barra de Filtros por Aspect Ratio y Búsqueda */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Todas las plantillas' },
              { id: '1:1', label: 'Cuadrado (1:1)' },
              { id: '4:5', label: 'Retrato (4:5)' },
              { id: '9:16', label: 'Story & Reel (9:16)' },
              { id: '16:9', label: 'Horizontal (16:9)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterRatio(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                  filterRatio === tab.id
                    ? 'bg-slate-900 text-white shadow-xs font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar plantilla..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            />
          </div>
        </div>

        {/* Grid de Plantillas */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <LayoutTemplate className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No se encontraron plantillas</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {canManage
                ? 'Comienza creando tu primera plantilla HTML para que todos los asesores puedan generar imágenes publicitarias.'
                : 'Aún no hay plantillas agregadas para esta Marca Blanca.'}
            </p>
            {canManage && (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="mt-4 px-5 py-2.5 bg-primary hover:brightness-110 active:scale-[0.98] text-white rounded-xl text-xs font-extrabold inline-flex items-center gap-2 shadow-md shadow-primary/20 transition-all duration-150 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Plantilla</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => {
              const renderedSample = substituteTemplateShortcuts(tpl.html_content, SAMPLE_ESTATE_PAYLOAD);

              return (
                <div
                  key={tpl.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Contenedor Superior: Miniatura escalada con iframe aislado */}
                  <div className="relative bg-slate-950 h-56 overflow-hidden flex items-center justify-center p-2 border-b border-slate-100 dark:border-slate-800">
                    {(() => {
                      const ratioStr = (tpl.aspect_ratio || '1:1').trim();
                      const tplW = tpl.width || 1080;
                      let tplH = tpl.height || 1080;
                      if (ratioStr === '4:5' || ratioStr === '4/5') tplH = Math.round(tplW * 1.25);
                      else if (ratioStr === '9:16' || ratioStr === '9/16') tplH = Math.round(tplW * (16 / 9));
                      else if (ratioStr === '16:9' || ratioStr === '16/9') tplH = Math.round(tplW * (9 / 16));
                      else if (ratioStr === '1:1') tplH = tplW;

                      const scale = Math.min(208 / tplH, 320 / tplW);
                      const cardW = Math.round(tplW * scale);
                      const cardH = Math.round(tplH * scale);

                      return (
                        <div
                          style={{
                            width: `${cardW}px`,
                            height: `${cardH}px`,
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '8px',
                          }}
                        >
                          <iframe
                            srcDoc={prepareHtmlForRendering(renderedSample, tplW, tplH, agency)}
                            title={tpl.name}
                            sandbox="allow-same-origin"
                            tabIndex={-1}
                            aria-hidden="true"
                            style={{
                              width: `${tplW}px`,
                              height: `${tplH}px`,
                              transform: `scale(${scale})`,
                              transformOrigin: 'top left',
                              border: 'none',
                              pointerEvents: 'none',
                              userSelect: 'none',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              background: 'transparent',
                            }}
                          />
                        </div>
                      );
                    })()}

                    {/* Badges de aspecto y resolución */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black tracking-wide border border-white/20">
                        {tpl.aspect_ratio}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-md text-slate-300 text-[10px] font-semibold border border-white/10">
                        {tpl.width}x{tpl.height}px
                      </span>
                    </div>

                    {/* Botón de inspección rápida al hacer hover */}
                    <button
                      type="button"
                      onClick={() => setPreviewModalTemplate(tpl)}
                      className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-2xs cursor-pointer z-10"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Vista Previa Interactiva</span>
                    </button>
                  </div>

                  {/* Cuerpo de la tarjeta */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                        {tpl.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium mb-4">
                        {tpl.description || 'Plantilla HTML para flyer y post publicitario inmobiliario.'}
                      </p>
                    </div>

                    {/* Acciones de la tarjeta */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadSample(tpl)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Descargar imagen PNG de prueba con datos simulados"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar PNG</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewModalTemplate(tpl)}
                          className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Ver en detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canManage && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(tpl)}
                              className="p-1.5 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Editar código de la plantilla"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(tpl)}
                              className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar plantilla"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL EDITOR: Crear / Editar Plantilla HTML con Shortcuts */}
        {/* ======================================================== */}
        {editorOpen && (
          <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
            <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden flex flex-col max-h-[92vh]">
              
              {/* Encabezado del Modal */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {editingTemplate ? 'Editar Plantilla HTML' : 'Nueva Plantilla HTML Inmobiliaria'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Utiliza atajos dinámicos para insertar información del inmueble en el diseño
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('editor')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        previewTab === 'editor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Código HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('preview')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        previewTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Previsualizar
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditorOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Formulario / Contenido */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
                {previewTab === 'editor' ? (
                  <>
                    {/* Campos Generales */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Nombre de la Plantilla *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ej. Flyer Post Instagram Cuadrado"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Proporción (Aspect Ratio)
                        </label>
                        <select
                          value={formData.aspect_ratio}
                          onChange={(e) => {
                            const ratio = e.target.value;
                            let w = 1080;
                            let h = 1080;
                            if (ratio === '9:16') {
                              w = 1080;
                              h = 1920;
                            } else if (ratio === '16:9') {
                              w = 1200;
                              h = 675;
                            } else if (ratio === '4:5') {
                              w = 1080;
                              h = 1350;
                            }
                            setFormData({
                              ...formData,
                              aspect_ratio: ratio,
                              width: w,
                              height: h,
                            });
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                        >
                          <option value="1:1">Cuadrado (1:1 - 1080x1080)</option>
                          <option value="9:16">Vertical Story (9:16 - 1080x1920)</option>
                          <option value="16:9">Horizontal (16:9 - 1200x675)</option>
                          <option value="4:5">Retrato Feed (4:5 - 1080x1350)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Resolución (Ancho x Alto px)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={formData.width}
                            onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                            placeholder="Ancho"
                          />
                          <input
                            type="number"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                            placeholder="Alto"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Barra de Atajos Interactivos (Shortcuts) */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Code className="w-4 h-4 text-amber-500" />
                          <span>Atajos Dinámicos Disponibles (Haz clic para insertar):</span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Se sustituyen automáticamente con los datos del inmueble
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {SHORTCUTS_LIST.map((sc) => (
                          <button
                            key={sc.key}
                            type="button"
                            onClick={() => handleInsertShortcut(sc.key)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1.5"
                            title={sc.desc}
                          >
                            <span className="text-amber-600 font-black">+</span>
                            <span>{sc.key}</span>
                            <span className="text-[10px] font-sans text-slate-400">({sc.label})</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Editor de Código HTML / CSS */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Código HTML &amp; Estilos CSS en Línea:
                      </label>
                      <textarea
                        rows={14}
                        required
                        value={formData.html_content}
                        onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner"
                        placeholder="<div>...</div>"
                        spellCheck={false}
                      />
                    </div>
                  </>
                ) : (
                  /* Pestaña de Previsualización en Vivo con Datos de Muestra */
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl min-h-[460px] overflow-hidden">
                    {(() => {
                      const ratioStr = (formData.aspect_ratio || '1:1').trim();
                      const tplW = formData.width || 1080;
                      let tplH = formData.height || 1080;
                      if (ratioStr === '4:5' || ratioStr === '4/5') tplH = Math.round(tplW * 1.25);
                      else if (ratioStr === '9:16' || ratioStr === '9/16') tplH = Math.round(tplW * (16 / 9));
                      else if (ratioStr === '16:9' || ratioStr === '16/9') tplH = Math.round(tplW * (9 / 16));
                      else if (ratioStr === '1:1') tplH = tplW;

                      const scale = Math.min(420 / tplH, 550 / tplW);
                      const boxW = Math.round(tplW * scale);
                      const boxH = Math.round(tplH * scale);
                      const rendered = substituteTemplateShortcuts(formData.html_content, SAMPLE_ESTATE_PAYLOAD);

                      return (
                        <div
                          style={{
                            width: `${boxW}px`,
                            height: `${boxH}px`,
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '16px',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                          }}
                        >
                          <iframe
                            srcDoc={prepareHtmlForRendering(rendered, tplW, tplH, agency)}
                            title="Previsualización"
                            sandbox="allow-same-origin"
                            tabIndex={-1}
                            aria-hidden="true"
                            style={{
                              width: `${tplW}px`,
                              height: `${tplH}px`,
                              transform: `scale(${scale})`,
                              transformOrigin: 'top left',
                              border: 'none',
                              pointerEvents: 'none',
                              userSelect: 'none',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              background: 'transparent',
                            }}
                          />
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Footer Modal con Botones */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400">
                    Solo administradores de Marca Blanca pueden registrar o modificar estas plantillas.
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditorOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 font-bold text-xs active:scale-[0.98] transition-all duration-150 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 rounded-xl bg-primary hover:brightness-110 active:scale-[0.98] text-white font-extrabold text-xs shadow-md shadow-primary/25 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {saving ? 'Guardando...' : editingTemplate ? 'Guardar Cambios' : 'Crear Plantilla'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL VISTA PREVIA DETALLADA / TEST PNG                  */}
        {/* ======================================================== */}
        {previewModalTemplate && (
          <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 dark:bg-slate-950/60">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {previewModalTemplate.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Resolución: {previewModalTemplate.width}x{previewModalTemplate.height}px ({previewModalTemplate.aspect_ratio})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadSample(previewModalTemplate)}
                    className="px-4 py-2 bg-primary hover:brightness-110 active:scale-[0.98] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all duration-150 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar PNG de Prueba</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewModalTemplate(null)}
                    className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 bg-slate-950 flex items-center justify-center overflow-auto min-h-[460px]">
                {(() => {
                  const ratioStr = (previewModalTemplate.aspect_ratio || '1:1').trim();
                  const tplW = previewModalTemplate.width || 1080;
                  let tplH = previewModalTemplate.height || 1080;
                  if (ratioStr === '4:5' || ratioStr === '4/5') tplH = Math.round(tplW * 1.25);
                  else if (ratioStr === '9:16' || ratioStr === '9/16') tplH = Math.round(tplW * (16 / 9));
                  else if (ratioStr === '16:9' || ratioStr === '16/9') tplH = Math.round(tplW * (9 / 16));
                  else if (ratioStr === '1:1') tplH = tplW;

                  const scale = Math.min(460 / tplH, 650 / tplW);
                  const boxW = Math.round(tplW * scale);
                  const boxH = Math.round(tplH * scale);
                  const rendered = substituteTemplateShortcuts(previewModalTemplate.html_content, SAMPLE_ESTATE_PAYLOAD);

                  return (
                    <div
                      style={{
                        width: `${boxW}px`,
                        height: `${boxH}px`,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                      }}
                    >
                      <iframe
                        srcDoc={prepareHtmlForRendering(rendered, tplW, tplH, agency)}
                        title={previewModalTemplate.name}
                        sandbox="allow-same-origin"
                        tabIndex={-1}
                        aria-hidden="true"
                        style={{
                          width: `${tplW}px`,
                          height: `${tplH}px`,
                          transform: `scale(${scale})`,
                          transformOrigin: 'top left',
                          border: 'none',
                          pointerEvents: 'none',
                          userSelect: 'none',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          background: 'transparent',
                        }}
                      />
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstateTemplatesManagementView;

