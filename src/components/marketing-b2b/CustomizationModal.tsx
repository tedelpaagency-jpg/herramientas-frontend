'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Download, Lock, CheckCircle2, AlertCircle, 
  RefreshCw, Image as ImageIcon, Film, User as UserIcon, 
  Building2, DollarSign, Type, Layers, ExternalLink
} from 'lucide-react';
import { MarketingTemplate, MarketingTemplateElement } from '../../types/marketingB2B';
import { ProfitCalculator } from './ProfitCalculator';
import marketingB2BService from '../../services/marketingB2BService';
import { useAuth } from '../../context/AuthContext';
import { normalizeFileUrl } from '../../services/apiClient';
import Portal from '../Portal';
import toast from 'react-hot-toast';

interface CustomizationModalProps {
  template: MarketingTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerationStarted: (generation: { id: number; uuid: string; status: string }) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  template,
  isOpen,
  onClose,
  onGenerationStarted,
}) => {
  const { user, currentAgency } = useAuth();

  const [salePrice, setSalePrice] = useState<number>(0);
  const [format, setFormat] = useState<string>('png');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Initialize form data when template changes or modal opens
  useEffect(() => {
    if (!template) return;

    // Set initial sale price to suggested price or base cost + 20%
    const initialSalePrice = Number(template.suggested_price) || (Number(template.base_cost) * 1.25);
    setSalePrice(initialSalePrice);

    // Default format based on resource type
    if (template.resource?.type === 'video') {
      setFormat('mp4');
    } else {
      setFormat('png');
    }

    // Initialize fields with agency defaults
    const initialPayload: Record<string, any> = {};
    const defaultAgencyLogo = currentAgency?.logo || user?.agency?.logo || '';
    const defaultAgentName = user?.name || '';

    if (defaultAgencyLogo) {
      setLogoPreview(defaultAgencyLogo);
    }

    if (template.elements && template.elements.length > 0) {
      template.elements.forEach((el) => {
        if (el.element_type === 'agency_logo') {
          initialPayload[el.field_key] = defaultAgencyLogo || el.default_value || '';
        } else if (el.element_type === 'agent_name') {
          initialPayload[el.field_key] = defaultAgentName || el.default_value || '';
        } else if (el.element_type === 'sale_price') {
          initialPayload[el.field_key] = `$${initialSalePrice.toFixed(2)}`;
        } else {
          initialPayload[el.field_key] = el.default_value || '';
        }
      });
    }

    setFormData(initialPayload);
  }, [template, isOpen, user, currentAgency]);

  if (!isOpen || !template) return null;

  const baseCost = Number(template.base_cost) || 0;
  const isVideo =
    template.media_type === 'video' ||
    template.resource?.type === 'video' ||
    template.media?.file_type === 'video' ||
    Boolean(template.resource?.mime_type && template.resource.mime_type.startsWith('video/')) ||
    Boolean(template.media?.mime_type && template.media.mime_type.startsWith('video/')) ||
    /\.(mp4|webm|mov)(\?.*)?$/i.test(template.media_url || template.media?.url || template.preview_image_url || template.resource?.file_url || '');

  const rawVideoUrl =
    template.media?.full_url ||
    template.media?.url ||
    template.media_url ||
    template.resource?.file_url ||
    (template.preview_image_url && /\.(mp4|webm|mov)(\?.*)?$/i.test(template.preview_image_url) ? template.preview_image_url : null);

  const videoSrc = normalizeFileUrl(rawVideoUrl);
  const imageSrc = normalizeFileUrl(
    template.preview_image_url ||
    template.preview_full_url ||
    template.resource?.file_url ||
    template.media?.full_url ||
    template.media?.url
  );
  const posterUrl = normalizeFileUrl(
    template.resource?.thumbnail_url ||
    (!/\.(mp4|webm|mov)(\?.*)?$/i.test(template.preview_image_url || '') ? template.preview_image_url : undefined)
  );

  // Aspect ratio styling for preview container
  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[580px]';
      case '1:1':
        return 'aspect-square max-h-[480px]';
      case '4:5':
        return 'aspect-[4/5] max-h-[540px]';
      case '16:9':
        return 'aspect-[16/9] max-h-[380px]';
      case '4:3':
        return 'aspect-[4/3] max-h-[420px]';
      default:
        return 'aspect-[9/16] max-h-[580px]';
    }
  };

  const handleInputChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida (PNG, JPG, SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      setFormData((prev) => ({
        ...prev,
        [fieldKey]: result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (salePrice < baseCost) {
      toast.error('El precio de venta no puede ser menor al costo base establecido.');
      return;
    }

    // Check required fields
    if (template.elements) {
      for (const el of template.elements) {
        if (el.is_required && el.is_agency_editable) {
          const val = formData[el.field_key];
          if (!val || String(val).trim() === '') {
            toast.error(`El campo "${el.label}" es obligatorio`);
            return;
          }
        }
      }
    }

    setIsSubmitting(true);
    try {
      // Sync price in payload
      const finalPayload = {
        ...formData,
        sale_price_number: salePrice,
        price_display: `$${salePrice.toFixed(2)} ${template.currency}`,
      };

      const res = await marketingB2BService.requestGeneration({
        template_id: template.id,
        sale_price: salePrice,
        format: format,
        customization_payload: finalPayload,
      });

      toast.success('¡Generación iniciada con éxito! Renderizando en segundo plano...');
      onGenerationStarted(res);
      onClose();
    } catch (err: any) {
      console.error('Error starting generation:', err);
      const msg = err.response?.data?.message || 'Error al iniciar la generación';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 w-screen h-screen z-[9999] overflow-y-auto bg-black/75 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
        <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">{template.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-purple-700 dark:text-purple-300">
                  {template.aspect_ratio}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  {isVideo ? <Film className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400" /> : <ImageIcon className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />}
                  {isVideo ? 'video' : 'imagen'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personaliza con los datos de tu agencia y genera el creativo en alta resolución
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          
          {/* Left Column: Live Canvas Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-100/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 relative">
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800/60 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Vista Previa Dinámica
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">En Tiempo Real</span>
            </div>

            {/* Canvas Container */}
            <div className={`relative w-full ${getAspectRatioClass(template.aspect_ratio)} rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-black flex items-center justify-center`}>
              
              {/* Master Media Background */}
              {isVideo && videoSrc ? (
                <video
                  src={videoSrc}
                  poster={posterUrl || undefined}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <img
                  src={imageSrc}
                  alt={template.name}
                  className="w-full h-full object-cover pointer-events-none"
                />
              )}

              {/* Elements Dynamic Overlay */}
              {template.elements?.map((el, idx) => {
                const styles = el.styles || {};
                const value = formData[el.field_key] ?? el.default_value ?? '';
                const fontSizePercent = (styles.font_size_rel || 0.035) * 100;
                const isTransparent = !styles.background_color || styles.background_color === 'transparent' || styles.background_color === 'none';

                return (
                  <div
                    key={el.id || idx}
                    style={{
                      position: 'absolute',
                      left: `${(el.relative_x || 0) * 100}%`,
                      top: `${(el.relative_y || 0) * 100}%`,
                      width: `${(el.relative_width || 0.3) * 100}%`,
                      height: `${(el.relative_height || 0.1) * 100}%`,
                      zIndex: el.z_index || 10,
                      color: styles.color || '#ffffff',
                      backgroundColor: isTransparent ? 'transparent' : styles.background_color,
                      textAlign: styles.text_align || 'center',
                      borderRadius: isTransparent ? '0px' : `${styles.border_radius || 0}px`,
                      opacity: styles.opacity ?? 1,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: styles.text_align === 'left' ? 'flex-start' : styles.text_align === 'right' ? 'flex-end' : 'center',
                    }}
                    className="select-none transition-all duration-150 pointer-events-none"
                  >
                    {el.element_type === 'agency_logo' ? (
                      logoPreview || value ? (
                        <img
                          src={logoPreview || value}
                          alt="Logo Agencia"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-purple-900/40 border border-dashed border-purple-400 rounded-lg text-purple-200 text-[10px] p-1 font-bold">
                          <Building2 className="w-4 h-4 mb-0.5" />
                          <span>Logo Agencia</span>
                        </div>
                      )
                    ) : el.element_type === 'sale_price' ? (
                      <span 
                        style={{ fontSize: `${Math.max(12, fontSizePercent * 3.5)}px`, fontWeight: styles.font_weight || 'bold' }}
                        className="tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_5px_rgba(0,0,0,0.9)]"
                      >
                        ${salePrice.toFixed(2)} <span className="text-[0.65em] opacity-80">{template.currency}</span>
                      </span>
                    ) : (
                      <span 
                        style={{ fontSize: `${Math.max(11, fontSizePercent * 3.2)}px`, fontWeight: styles.font_weight || 'normal' }}
                        className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_5px_rgba(0,0,0,0.9)] px-1 truncate w-full"
                      >
                        {value || el.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <p className="text-[11px] text-slate-500 mt-3 text-center">
              La vista previa se escala dinámicamente; la exportación final se renderiza en alta resolución (1080p+).
            </p>
          </div>

          {/* Right Column: Customization Controls & Pricing */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Commercial Calculator Component */}
              <ProfitCalculator
                baseCost={baseCost}
                salePrice={salePrice}
                currency={template.currency}
                isReadOnly={false}
                onChangeSalePrice={(newPrice) => setSalePrice(newPrice)}
              />

              {/* Editable Fields Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-300 flex items-center gap-2">
                    <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Campos Personalizables para tu Agencia
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Solo los campos habilitados por la Marca Blanca son editables
                  </span>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {template.elements?.filter(el => el.is_agency_editable).map((el) => {
                    const value = formData[el.field_key] || '';

                    if (el.element_type === 'agency_logo') {
                      return (
                        <div key={el.id || el.field_key} className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                            {el.label} {el.is_required && <span className="text-red-500">*</span>}
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                              {logoPreview ? (
                                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-1" />
                              ) : (
                                <Building2 className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors">
                                <ImageIcon className="w-3.5 h-3.5" /> Subir Logo Personalizado
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleLogoUpload(e, el.field_key)}
                                />
                              </label>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Formatos admitidos: PNG transparente o SVG.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (el.element_type === 'sale_price') {
                      return (
                        <div key={el.id || el.field_key} className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                            {el.label} ({template.currency}) {el.is_required && <span className="text-red-500">*</span>}
                          </label>
                          <div className="relative">
                            <DollarSign className="w-4 h-4 text-emerald-500 dark:text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="number"
                              min={baseCost}
                              step="0.01"
                              value={salePrice}
                              onChange={(e) => setSalePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-emerald-500 transition-colors"
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            El precio final que verá tu cliente en el flyer publicitario.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div key={el.id || el.field_key} className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          {el.label} {el.is_required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          value={value}
                          placeholder={el.default_value || `Escribe ${el.label.toLowerCase()}...`}
                          onChange={(e) => handleInputChange(el.field_key, e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs rounded-xl px-3 py-2.5 outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                    );
                  })}

                  {(!template.elements || template.elements.filter(el => el.is_agency_editable).length === 0) && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400">
                      Esta plantilla solo requiere ajustar tu precio de venta comercial.
                    </div>
                  )}
                </div>
              </div>

              {/* Export Format Selector */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Formato de Salida:</span>
                <div className="flex items-center gap-2">
                  {isVideo ? (
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-black uppercase">
                      MP4 (Video Alta Definición)
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setFormat('png')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${format === 'png' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400'}`}
                      >
                        PNG (Calidad Premium)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormat('jpg')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${format === 'jpg' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400'}`}
                      >
                        JPG (Comprimido)
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isSubmitting || salePrice < baseCost}
                className="flex-1 max-w-sm flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Iniciando Renderizado...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generar Creativo Personalizado
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  </Portal>
);
};

export default CustomizationModal;
