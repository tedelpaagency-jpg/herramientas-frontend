'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, Eye, Plus, Trash2, ArrowUp, ArrowDown, Move, 
  Layers, CheckSquare, Square, DollarSign, Image as ImageIcon, 
  Type, User, Tag, Shield, RefreshCw, X, Check, Lock, Unlock, Sliders,
  Globe, Folder, Film, Sparkles, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { 
  MarketingTemplate, 
  MarketingTemplateElement, 
  MarketingMediaResource, 
  MarketingCreativeCategory,
  AspectRatioType, 
  ElementType 
} from '../../types/marketingB2B';
import { Media } from '../../types/media';
import { MediaPicker } from '../media/MediaPicker';
import marketingB2BService from '../../services/marketingB2BService';
import { normalizeFileUrl } from '../../services/apiClient';
import toast from 'react-hot-toast';

const COUNTRIES = [
  { code: '', name: 'Global / Todos los países' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'ES', name: 'España' },
  { code: 'MX', name: 'México' },
  { code: 'CO', name: 'Colombia' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'CA', name: 'Canadá' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Perú' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'PA', name: 'Panamá' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'BR', name: 'Brasil' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'FR', name: 'Francia' },
  { code: 'IT', name: 'Italia' },
  { code: 'DE', name: 'Alemania' },
];

interface TemplateVisualEditorProps {
  template?: MarketingTemplate | null;
  initialMedia?: Media | null;
  initialResource?: MarketingMediaResource | null;
  onSaved?: (savedTemplate: MarketingTemplate) => void;
  onClose?: () => void;
}

export const TemplateVisualEditor: React.FC<TemplateVisualEditorProps> = ({
  template,
  initialMedia,
  initialResource,
  onSaved,
  onClose,
}) => {
  const [templateName, setTemplateName] = useState(template?.name || 'Nueva Plantilla Publicitaria');
  const [description, setDescription] = useState(template?.description || '');
  const [baseCost, setBaseCost] = useState<number>(template?.base_cost ? Number(template.base_cost) : 25.00);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(template?.suggested_price ? Number(template.suggested_price) : 75.00);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(template?.aspect_ratio || initialResource?.aspect_ratio || '9:16');
  const [isPublished, setIsPublished] = useState<boolean>(template?.is_published || false);
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Media Library Background
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(() => {
    if (template?.media) return template.media;
    if (initialMedia) return initialMedia;
    return null;
  });

  // Legacy Master Resource support
  const [resource, setResource] = useState<MarketingMediaResource | null>(
    template?.resource || initialResource || null
  );

  // Segmentación: País y Categoría
  const [country, setCountry] = useState<string>(template?.country || '');
  const [categoryId, setCategoryId] = useState<number | ''>(template?.category_id || '');
  const [categories, setCategories] = useState<MarketingCreativeCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      setIsLoadingCategories(true);
      try {
        const cats = await marketingB2BService.getCategories({ is_active: true });
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories in editor:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCats();
  }, []);

  // Layers list
  const [elements, setElements] = useState<MarketingTemplateElement[]>(() => {
    if (template?.elements && template.elements.length > 0) {
      return template.elements;
    }
    // Default initial layers
    return [
      {
        element_type: 'agency_logo',
        label: 'Logo de la Agencia',
        field_key: 'agency_logo',
        is_agency_editable: false,
        is_required: true,
        default_value: '',
        relative_x: 0.30,
        relative_y: 0.82,
        relative_width: 0.40,
        relative_height: 0.10,
        z_index: 10,
        styles: {
          border_radius: 12,
          opacity: 1,
        },
      },
      {
        element_type: 'sale_price',
        label: 'Insignia de Precio de Venta',
        field_key: 'sale_price',
        is_agency_editable: true,
        is_required: true,
        default_value: '$99.00',
        relative_x: 0.15,
        relative_y: 0.12,
        relative_width: 0.70,
        relative_height: 0.08,
        z_index: 20,
        styles: {
          color: '#FFFFFF',
          background_color: '#10B981',
          font_size_rel: 0.038,
          font_weight: 'bold',
          text_align: 'center',
          opacity: 1,
          border_radius: 20,
        },
      },
      {
        element_type: 'agent_name',
        label: 'Nombre del Agente',
        field_key: 'agent_name',
        is_agency_editable: true,
        is_required: false,
        default_value: 'Tu Asesor Comercial',
        relative_x: 0.10,
        relative_y: 0.74,
        relative_width: 0.80,
        relative_height: 0.05,
        z_index: 15,
        styles: {
          color: '#FFFFFF',
          background_color: '#0F172A',
          font_size_rel: 0.025,
          font_weight: '600',
          text_align: 'center',
          opacity: 0.85,
          border_radius: 8,
        },
      },
    ];
  });

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; initialX: number; initialY: number } | null>(null);

  // Aspect ratio calculations
  const getAspectRatioDimensions = (ratio: AspectRatioType) => {
    switch (ratio) {
      case '9:16': return { aspect: '9 / 16', maxWidth: '340px' };
      case '1:1':  return { aspect: '1 / 1',  maxWidth: '440px' };
      case '4:5':  return { aspect: '4 / 5',  maxWidth: '380px' };
      case '16:9': return { aspect: '16 / 9', maxWidth: '560px' };
      case '4:3':  return { aspect: '4 / 3',  maxWidth: '480px' };
      default:     return { aspect: '9 / 16', maxWidth: '340px' };
    }
  };

  const currentAspect = getAspectRatioDimensions(aspectRatio);

  // Layer manipulation
  const handleAddElement = (type: ElementType) => {
    const count = elements.length + 1;
    let newElem: MarketingTemplateElement;

    switch (type) {
      case 'text':
        newElem = {
          element_type: 'text',
          label: `Texto Titular ${count}`,
          field_key: `text_${Date.now()}`,
          is_agency_editable: true,
          is_required: false,
          default_value: '¡Oportunidad Exclusiva!',
          relative_x: 0.10,
          relative_y: 0.25,
          relative_width: 0.80,
          relative_height: 0.07,
          z_index: count + 5,
          styles: {
            color: '#FFFFFF',
            background_color: '#0F172A',
            font_size_rel: 0.032,
            font_weight: 'bold',
            text_align: 'center',
            opacity: 0.9,
            border_radius: 8,
          },
        };
        break;
      case 'badge':
        newElem = {
          element_type: 'badge',
          label: `Insignia Destacada`,
          field_key: `badge_${Date.now()}`,
          is_agency_editable: false,
          is_required: false,
          default_value: 'NUEVO INGRESO',
          relative_x: 0.25,
          relative_y: 0.05,
          relative_width: 0.50,
          relative_height: 0.05,
          z_index: count + 5,
          styles: {
            color: '#FFFFFF',
            background_color: '#7C3AED',
            font_size_rel: 0.024,
            font_weight: '800',
            text_align: 'center',
            opacity: 1,
            border_radius: 16,
          },
        };
        break;
      case 'custom_field':
        newElem = {
          element_type: 'custom_field',
          label: `Contacto / WhatsApp`,
          field_key: `contact_info`,
          is_agency_editable: true,
          is_required: false,
          default_value: '+52 998 123 4567',
          relative_x: 0.15,
          relative_y: 0.68,
          relative_width: 0.70,
          relative_height: 0.05,
          z_index: count + 5,
          styles: {
            color: '#E2E8F0',
            font_size_rel: 0.024,
            font_weight: '600',
            text_align: 'center',
            opacity: 1,
          },
        };
        break;
      default:
        return;
    }

    setElements((prev) => [...prev, newElem]);
    setSelectedElementId(newElem.field_key);
    toast.success(`Capa "${newElem.label}" agregada`);
  };

  const handleUpdateElement = (index: number, updates: Partial<MarketingTemplateElement>) => {
    setElements((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleUpdateElementStyles = (index: number, styleUpdates: Record<string, any>) => {
    setElements((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        styles: { ...(copy[index].styles || {}), ...styleUpdates },
      };
      return copy;
    });
  };

  const handleDeleteElement = (index: number) => {
    setElements((prev) => prev.filter((_, i) => i !== index));
    setSelectedElementId(null);
  };

  const handleMoveLayer = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index + 1 : index - 1;
    if (targetIdx < 0 || targetIdx >= elements.length) return;

    setElements((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      // Reindex z-indexes
      return copy.map((el, i) => ({ ...el, z_index: (i + 1) * 5 }));
    });
  };

  // Dragging logic on the canvas
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveDragIndex(index);
    setSelectedElementId(elements[index].field_key);

    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: elements[index].relative_x,
      initialY: elements[index].relative_y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeDragIndex === null || !dragStart || !canvasContainerRef.current) return;

    const rect = canvasContainerRef.current.getBoundingClientRect();
    const deltaX = (e.clientX - dragStart.mouseX) / rect.width;
    const deltaY = (e.clientY - dragStart.mouseY) / rect.height;

    const currentElem = elements[activeDragIndex];
    let newX = Math.max(0, Math.min(1 - currentElem.relative_width, dragStart.initialX + deltaX));
    let newY = Math.max(0, Math.min(1 - currentElem.relative_height, dragStart.initialY + deltaY));

    // Snap to center horizontally (with 2% threshold)
    const centerX = (1 - currentElem.relative_width) / 2;
    if (Math.abs(newX - centerX) < 0.02) {
      newX = centerX;
    }

    handleUpdateElement(activeDragIndex, {
      relative_x: Math.round(newX * 1000) / 1000,
      relative_y: Math.round(newY * 1000) / 1000,
    });
  };

  const handleMouseUp = () => {
    setActiveDragIndex(null);
    setDragStart(null);
  };

  const isVideoMedia = (() => {
    if (selectedMedia) {
      if (selectedMedia.file_type === 'video') return true;
      if (selectedMedia.mime_type && selectedMedia.mime_type.startsWith('video/')) return true;
      const pathOrUrl = (selectedMedia.extension || selectedMedia.url || selectedMedia.file_name || '').toLowerCase();
      if (pathOrUrl.endsWith('.mp4') || pathOrUrl.endsWith('.mov') || pathOrUrl.endsWith('.webm')) return true;
      return false;
    }
    if (resource) {
      return resource.type === 'video' || (resource.mime_type ? resource.mime_type.startsWith('video/') : false);
    }
    if (template?.media_type === 'video' || template?.media?.file_type === 'video' || template?.resource?.type === 'video') return true;
    const pathOrUrl = (template?.media_url || template?.preview_image_url || '').toLowerCase();
    if (pathOrUrl.endsWith('.mp4') || pathOrUrl.endsWith('.mov') || pathOrUrl.endsWith('.webm')) return true;
    return false;
  })();

  const rawBackgroundUrl = (() => {
    if (isVideoMedia) {
      return (
        selectedMedia?.full_url ||
        selectedMedia?.url ||
        template?.media?.full_url ||
        template?.media?.url ||
        template?.media_url ||
        template?.resource?.file_url ||
        resource?.file_url ||
        (template?.preview_image_url && /\.(mp4|webm|mov)(\?.*)?$/i.test(template.preview_image_url) ? template.preview_image_url : null) ||
        null
      );
    }
    return (
      selectedMedia?.full_url ||
      selectedMedia?.url ||
      template?.media?.full_url ||
      template?.media?.url ||
      template?.preview_full_url ||
      template?.preview_image_url ||
      template?.media_url ||
      template?.resource?.file_url ||
      resource?.file_url ||
      null
    );
  })();

  const backgroundUrl = normalizeFileUrl(rawBackgroundUrl);

  const handleSave = async () => {
    const hasMedia = !!(selectedMedia?.id || template?.media_id || resource?.id || template?.resource_id || backgroundUrl);
    if (!hasMedia) {
      toast.error('Debe seleccionar una imagen o video desde la biblioteca de medios.');
      return;
    }

    if (!templateName.trim()) {
      toast.error('Ingrese un nombre para la plantilla.');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Guardando plantilla publicitaria...');

    try {
      const payload: any = {
        name: templateName,
        description,
        country: country || null,
        category_id: categoryId ? Number(categoryId) : null,
        aspect_ratio: aspectRatio,
        base_cost: Number(baseCost),
        suggested_price: Number(suggestedPrice),
        currency: 'USD',
        is_published: isPublished,
        safe_zone_config: {
          top: 0.10,
          bottom: 0.15,
          left: 0.05,
          right: 0.05,
        },
        elements,
      };

      if (selectedMedia?.id) {
        payload.media_id = selectedMedia.id;
      } else if (template?.media_id) {
        payload.media_id = template.media_id;
      }

      if (resource?.id) {
        payload.resource_id = resource.id;
      } else if (template?.resource_id) {
        payload.resource_id = template.resource_id;
      }

      let result: MarketingTemplate;
      if (template?.id) {
        result = await marketingB2BService.updateTemplate(template.id, payload);
        toast.success('Plantilla actualizada exitosamente', { id: toastId });
      } else {
        result = await marketingB2BService.createTemplate(payload);
        toast.success('Plantilla creada y guardada', { id: toastId });
      }

      if (onSaved) {
        onSaved(result);
      }
    } catch (err: any) {
      console.error('Error saving template:', err);
      const msg = err?.response?.data?.message || 'Error al guardar la plantilla';
      toast.error(msg, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedElem = elements.find((e) => e.field_key === selectedElementId);
  const selectedElemIdx = elements.findIndex((e) => e.field_key === selectedElementId);

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 dark:bg-purple-600/20 border border-purple-500/20 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="text-base font-black bg-transparent text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-purple-500 outline-none transition-colors"
              placeholder="Nombre de la Plantilla"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Editor Visual de Plantillas Multicanal B2B</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Formato */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs">
            <span>Formato:</span>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatioType)}
              className="bg-transparent text-purple-600 dark:text-purple-400 font-black outline-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
            >
              <option value="9:16">9:16 (Stories)</option>
              <option value="1:1">1:1 (Post Feed)</option>
              <option value="4:5">4:5 (Vertical)</option>
              <option value="16:9">16:9 (Horizontal)</option>
              <option value="4:3">4:3 (Estándar)</option>
            </select>
          </div>

          {/* Safe zones toggle */}
          <button
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              showSafeZones 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300' 
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Zonas Seguras</span>
          </button>

          {/* Publicar / Borrador */}
          <button
            onClick={() => setIsPublished(!isPublished)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 cursor-pointer ${
              isPublished
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {isPublished ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isPublished ? 'Publicada' : 'Borrador'}</span>
          </button>

          {/* Guardar */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Guardar Plantilla</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Capas y Configuraciones */}
        <div className="w-80 bg-slate-50/70 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 overflow-y-auto space-y-6 shrink-0">
          {/* Fondo Multimedia (Biblioteca de Medios) */}
          <div className="space-y-3 bg-white dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Fondo Multimedia</span>
              </h4>
              <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full">
                Biblioteca
              </span>
            </div>

            <MediaPicker
              value={selectedMedia ? (selectedMedia.full_url || selectedMedia.url) : backgroundUrl}
              onChange={({ id, url, media }) => {
                if (media) {
                  setSelectedMedia(media);
                } else if (id) {
                  setSelectedMedia({
                    id,
                    url,
                    full_url: url,
                    original_name: 'Media seleccionado',
                    file_name: '',
                    disk: 'public',
                    path: url,
                    size: 0,
                  } as any);
                }
              }}
              onClear={() => {
                setSelectedMedia(null);
                setResource(null);
              }}
              type="all"
              allowedTypes={['image', 'video']}
              buttonLabel="Seleccionar de Biblioteca"
              placeholder="Ninguna imagen o video seleccionado"
            />
          </div>

          {/* Segmentación: País y Categoría */}
          <div className="space-y-3 bg-white dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Segmentación & Clasificación</span>
            </h4>

            {/* Selector de País */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>País de Destino / Audiencia</span>
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500 cursor-pointer [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name === 'Global / Todos los países' ? '' : c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Categoría (Exclusiva de Marca Blanca) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>Categoría de Creativo</span>
                </label>
                <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                  Marca Blanca
                </span>
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500 cursor-pointer [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
              >
                <option value="">Sin categoría específica</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && !isLoadingCategories && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400/80 italic">
                  No hay categorías creadas aún. Puedes agregarlas desde la pestaña "Categorías".
                </p>
              )}
            </div>
          </div>

          {/* Configuración Comercial */}
          <div className="space-y-3 bg-white dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Condiciones Comerciales</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Costo Base ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={baseCost}
                  onChange={(e) => setBaseCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-black text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Precio Sugerido ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={suggestedPrice}
                  onChange={(e) => setSuggestedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-black text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              Ganancia sugerida para agencia: ${(suggestedPrice - baseCost).toFixed(2)}
            </div>
          </div>

          {/* Botones Agregar Capas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase text-slate-500 dark:text-slate-400">
              <span>Capas Disponibles</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{elements.length} capas</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAddElement('text')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Texto</span>
              </button>
              <button
                onClick={() => handleAddElement('badge')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Insignia</span>
              </button>
              <button
                onClick={() => handleAddElement('custom_field')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Contacto</span>
              </button>
            </div>
          </div>

          {/* Lista de Capas (Stack) */}
          <div className="space-y-2">
            <div className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Orden de Capas (Z-Index)</div>
            <div className="space-y-2">
              {elements.map((elem, idx) => {
                const isSelected = elem.field_key === selectedElementId;
                return (
                  <div
                    key={elem.field_key}
                    onClick={() => setSelectedElementId(elem.field_key)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-600/10 dark:bg-purple-600/15 border-purple-500 ring-1 ring-purple-500/20'
                        : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {elem.element_type === 'agency_logo' && <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />}
                      {elem.element_type === 'sale_price' && <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      {elem.element_type === 'agent_name' && <User className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                      {elem.element_type === 'text' && <Type className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
                      {elem.element_type === 'badge' && <Tag className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                      {elem.element_type === 'custom_field' && <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{elem.label}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <span>{elem.is_agency_editable ? 'Editable por agencia' : 'Fijo'}</span>
                          <span>•</span>
                          <span className="font-mono">z:{elem.z_index}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveLayer(idx, 'up'); }}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Mover arriba"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveLayer(idx, 'down'); }}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Mover abajo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {elem.element_type !== 'agency_logo' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteElement(idx); }}
                          className="p-1 text-slate-400 hover:text-rose-500"
                          title="Eliminar capa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Canvas Interactivo con Coordenadas Relativas */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="flex-1 bg-slate-100/90 dark:bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative select-none"
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 dark:from-purple-900/10 via-transparent to-transparent pointer-events-none" />

          {/* Canvas Wrapper */}
          <div
            ref={canvasContainerRef}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-800 bg-slate-900 transition-all"
            style={{
              aspectRatio: currentAspect.aspect,
              maxWidth: currentAspect.maxWidth,
              width: '100%',
            }}
          >
            {/* Background Image / Video from Media Library */}
            {backgroundUrl ? (
              isVideoMedia ? (
                <video
                  src={backgroundUrl}
                  className="w-full h-full object-cover pointer-events-none"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={backgroundUrl}
                  alt="Fondo de la Plantilla"
                  className="w-full h-full object-cover pointer-events-none"
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-xs p-6 text-center space-y-3 bg-slate-950">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-white text-xs font-bold">Sin imagen o video seleccionado</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Elige una imagen o video desde la biblioteca de medios en el panel lateral para visualizar la plantilla.
                  </p>
                </div>
              </div>
            )}

            {/* Social Media Safe Zones Overlay */}
            {showSafeZones && (
              <div className="absolute inset-0 pointer-events-none z-30">
                {/* Zona segura superior (10%) */}
                <div className="absolute top-0 left-0 right-0 h-[10%] border-b border-dashed border-amber-400/50 bg-amber-500/10 flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300/80">
                    Safe Zone Superior (Historias / Header)
                  </span>
                </div>
                {/* Zona segura inferior (15%) */}
                <div className="absolute bottom-0 left-0 right-0 h-[15%] border-t border-dashed border-amber-400/50 bg-amber-500/10 flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300/80">
                    Safe Zone Inferior (Botones / Controles)
                  </span>
                </div>
              </div>
            )}

            {/* Capas Relativas (0.0 a 1.0) */}
            {elements.map((elem, idx) => {
              const isSelected = elem.field_key === selectedElementId;
              const isLogo = elem.element_type === 'agency_logo';

              return (
                <div
                  key={elem.field_key}
                  onMouseDown={(e) => handleMouseDown(e, idx)}
                  className={`absolute transition-all cursor-move flex items-center justify-center text-center ${
                    isSelected ? 'ring-2 ring-purple-500 shadow-xl' : 'hover:ring-1 hover:ring-white/40'
                  }`}
                  style={{
                    left: `${elem.relative_x * 100}%`,
                    top: `${elem.relative_y * 100}%`,
                    width: `${elem.relative_width * 100}%`,
                    height: `${elem.relative_height * 100}%`,
                    zIndex: elem.z_index,
                    backgroundColor: (elem.styles?.background_color && elem.styles.background_color !== 'transparent' && elem.styles.background_color !== 'none')
                      ? elem.styles.background_color
                      : 'transparent',
                    color: elem.styles?.color || '#FFFFFF',
                    borderRadius: `${elem.styles?.border_radius || 0}px`,
                    opacity: elem.styles?.opacity ?? 1,
                  }}
                >
                  {isLogo ? (
                    <div className="w-full h-full flex items-center justify-center p-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/20">
                      <span className="text-[11px] font-black text-white flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> [LOGO AGENCIA]
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`w-full px-2 truncate leading-tight ${
                        (!elem.styles?.background_color || elem.styles.background_color === 'transparent' || elem.styles.background_color === 'none')
                          ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] [text-shadow:_0_2px_5px_rgba(0,0,0,0.9)]'
                          : ''
                      }`}
                      style={{
                        fontSize: elem.styles?.font_size_rel 
                          ? `${elem.styles.font_size_rel * 400}px` 
                          : '12px',
                        fontWeight: elem.styles?.font_weight || 'bold',
                        textAlign: elem.styles?.text_align || 'center',
                      }}
                    >
                      {elem.default_value || elem.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Arrastra las capas para posicionarlas
            </span>
            <span>•</span>
            <span className="text-slate-400 dark:text-slate-500">Coordenadas relativas 0.0 - 1.0</span>
          </div>
        </div>

        {/* Right Sidebar: Propiedades de la Capa Seleccionada */}
        <div className="w-80 bg-slate-50/70 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 overflow-y-auto space-y-6 shrink-0">
          {selectedElem && selectedElemIdx !== -1 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  <span>Propiedades de Capa</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{selectedElem.element_type}</span>
              </div>

              {/* Etiqueta y Llave */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Etiqueta</label>
                <input
                  type="text"
                  value={selectedElem.label}
                  onChange={(e) => handleUpdateElement(selectedElemIdx, { label: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              {/* Valor por defecto / Texto */}
              {selectedElem.element_type !== 'agency_logo' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Texto / Valor Predeterminado</label>
                  <input
                    type="text"
                    value={selectedElem.default_value || ''}
                    onChange={(e) => handleUpdateElement(selectedElemIdx, { default_value: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>
              )}

              {/* Editable por Agencia Toggle */}
              <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Editable por Agencia</span>
                  <input
                    type="checkbox"
                    checked={selectedElem.is_agency_editable}
                    onChange={(e) => handleUpdateElement(selectedElemIdx, { is_agency_editable: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer"
                  />
                </label>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Si está activo, el agente podrá modificar este campo al generar su creativo comercial.
                </p>
              </div>

              {/* Posición Relativa */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Posición y Tamaño Relativo (0.0 - 1.0)</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500">X:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={selectedElem.relative_x}
                      onChange={(e) => handleUpdateElement(selectedElemIdx, { relative_x: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Y:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={selectedElem.relative_y}
                      onChange={(e) => handleUpdateElement(selectedElemIdx, { relative_y: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Ancho:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.05"
                      max="1"
                      value={selectedElem.relative_width}
                      onChange={(e) => handleUpdateElement(selectedElemIdx, { relative_width: parseFloat(e.target.value) || 0.1 })}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Alto:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.02"
                      max="1"
                      value={selectedElem.relative_height}
                      onChange={(e) => handleUpdateElement(selectedElemIdx, { relative_height: parseFloat(e.target.value) || 0.05 })}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Estilos Visuales */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Estilos y Colores</div>

                {selectedElem.element_type !== 'agency_logo' && (() => {
                  const rawBg = selectedElem.styles?.background_color;
                  const isTransparent = !rawBg || rawBg === 'transparent' || rawBg === 'none';
                  const currentHexBg = (!isTransparent && rawBg?.startsWith('#')) ? rawBg : '#0F172A';

                  return (
                    <div className="space-y-3.5">
                      {/* Color de Texto */}
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Color de Texto</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElem.styles?.color || '#FFFFFF'}
                            onChange={(e) => handleUpdateElementStyles(selectedElemIdx, { color: e.target.value })}
                            className="w-7 h-7 rounded-lg bg-transparent cursor-pointer border border-slate-300 dark:border-slate-700 shrink-0"
                          />
                          <div className="flex items-center gap-1">
                            {['#FFFFFF', '#0F172A', '#FBBF24', '#34D399', '#38BDF8'].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => handleUpdateElementStyles(selectedElemIdx, { color: c })}
                                className={`w-4 h-4 rounded-full border transition-transform hover:scale-110 cursor-pointer ${
                                  (selectedElem.styles?.color || '#FFFFFF').toLowerCase() === c.toLowerCase()
                                    ? 'ring-2 ring-purple-500 scale-105'
                                    : 'border-slate-300 dark:border-slate-700'
                                }`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Alineación de Texto */}
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Alineación</label>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleUpdateElementStyles(selectedElemIdx, { text_align: 'left' })}
                            className={`p-1.5 rounded-md transition-all cursor-pointer ${
                              selectedElem.styles?.text_align === 'left'
                                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                            title="Alinear a la izquierda"
                          >
                            <AlignLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateElementStyles(selectedElemIdx, { text_align: 'center' })}
                            className={`p-1.5 rounded-md transition-all cursor-pointer ${
                              !selectedElem.styles?.text_align || selectedElem.styles?.text_align === 'center'
                                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                            title="Alinear al centro"
                          >
                            <AlignCenter className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateElementStyles(selectedElemIdx, { text_align: 'right' })}
                            className={`p-1.5 rounded-md transition-all cursor-pointer ${
                              selectedElem.styles?.text_align === 'right'
                                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                            title="Alinear a la derecha"
                          >
                            <AlignRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Control de Fondo con opción Sin Fondo */}
                      <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Fondo de la Capa</label>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isTransparent
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {isTransparent ? 'Sin Fondo (Transparente)' : 'Con Fondo'}
                          </span>
                        </div>

                        {/* Botones de Selección Rápida Con Fondo / Sin Fondo */}
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => handleUpdateElementStyles(selectedElemIdx, { background_color: currentHexBg })}
                            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              !isTransparent
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-600" style={{ backgroundColor: currentHexBg }} />
                            <span>Con Fondo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateElementStyles(selectedElemIdx, { background_color: 'transparent' })}
                            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isTransparent
                                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            <span className="text-[11px]">🚫</span>
                            <span>Sin Fondo</span>
                          </button>
                        </div>

                        {/* Si tiene fondo: Selector de Color + Paleta */}
                        {!isTransparent ? (
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={currentHexBg}
                                onChange={(e) => handleUpdateElementStyles(selectedElemIdx, { background_color: e.target.value })}
                                className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-slate-300 dark:border-slate-700 shrink-0"
                              />
                              <input
                                type="text"
                                value={currentHexBg}
                                onChange={(e) => handleUpdateElementStyles(selectedElemIdx, { background_color: e.target.value })}
                                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white uppercase outline-none focus:border-purple-500"
                                placeholder="#000000"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              {[
                                { name: 'Negro Carbón', hex: '#0F172A' },
                                { name: 'Esmeralda', hex: '#10B981' },
                                { name: 'Púrpura', hex: '#7C3AED' },
                                { name: 'Azul Real', hex: '#2563EB' },
                                { name: 'Rojo', hex: '#EF4444' },
                                { name: 'Ámbar', hex: '#F59E0B' },
                                { name: 'Blanco', hex: '#FFFFFF' },
                              ].map((c) => (
                                <button
                                  key={c.hex}
                                  type="button"
                                  title={c.name}
                                  onClick={() => handleUpdateElementStyles(selectedElemIdx, { background_color: c.hex })}
                                  className={`w-5 h-5 rounded-md border transition-all cursor-pointer hover:scale-110 ${
                                    currentHexBg.toLowerCase() === c.hex.toLowerCase()
                                      ? 'ring-2 ring-purple-500 scale-105 border-white dark:border-slate-900'
                                      : 'border-slate-300 dark:border-slate-700'
                                  }`}
                                  style={{ backgroundColor: c.hex }}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-dashed border-purple-500/30 text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-2">
                            <span className="text-base shrink-0">✨</span>
                            <span className="leading-snug">Texto limpio sin caja de fondo. Se aplica sombra para resaltar sobre cualquier imagen o video.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Opacidad */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Opacidad</span>
                    <span>{Math.round((selectedElem.styles?.opacity ?? 1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={selectedElem.styles?.opacity ?? 1}
                    onChange={(e) => handleUpdateElementStyles(selectedElemIdx, { opacity: parseFloat(e.target.value) })}
                    className="w-full accent-purple-600 dark:accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* Redondeo de bordes */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Radio de Borde</span>
                    <span>{selectedElem.styles?.border_radius || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="2"
                    value={selectedElem.styles?.border_radius || 0}
                    onChange={(e) => handleUpdateElementStyles(selectedElemIdx, { border_radius: parseInt(e.target.value) })}
                    className="w-full accent-purple-600 dark:accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400 dark:text-slate-500">
              <Sliders className="w-8 h-8" />
              <p className="text-xs font-bold">Selecciona una capa en el lienzo o en la lista lateral para editar sus propiedades.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateVisualEditor;
