'use client';

import React from 'react';
import {
  Download,
  FileText,
  X,
  CheckCircle2,
  Sparkles,
  Info,
  Maximize2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Portal from './Portal';

/**
 * Generates and downloads a high-resolution 2550 x 3300 px (300 DPI) US Letter guide template PNG.
 * Perfect for Canva, Photoshop, Illustrator, Figma, or Word.
 */
export const downloadLetterheadGuideTemplate = (filename = 'plantilla_guia_membrete_carta_2550x3300.png') => {
  try {
    const width = 2550;
    const height = 3300;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      toast.error('No se pudo generar la plantilla en este navegador.');
      return;
    }

    // 1. Clean White Base
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Subtle background grid pattern
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 2;
    const gridSize = 100;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer border of sheet
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // 2. Margins (1 inch = 300 px on 300 DPI)
    const margin = 300;
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 12]);
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
    ctx.setLineDash([]);

    // Margin corner labels
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Margen 1" (300 px)', margin + 20, margin + 50);

    // 3. HEADER ZONE (Top: 0 to 450 px)
    const headerHeight = 450;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.08)'; // Light Blue
    ctx.fillRect(0, 0, width, headerHeight);

    // Header divider line
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 6;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, headerHeight);
    ctx.lineTo(width, headerHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Header Badge & Text
    ctx.fillStyle = '#1D4ED8';
    ctx.font = 'bold 54px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▲ ZONA DE ENCABEZADO / MEMBRETE SUPERIOR ▲', width / 2, 180);

    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#3B82F6';
    ctx.fillText('Coloca aquí tu Logotipo, Nombre de Empresa, Slogan o Pleca decorativa', width / 2, 250);
    ctx.font = 'italic 34px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Altura máxima recomendada: 350 a 450 px (1.2 a 1.5 pulgadas)', width / 2, 310);

    // 4. FOOTER ZONE (Bottom: 2950 to 3300 px -> height 350 px)
    const footerTop = 2950;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)'; // Light Emerald
    ctx.fillRect(0, footerTop, width, height - footerTop);

    // Footer divider line
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 6;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, footerTop);
    ctx.lineTo(width, footerTop);
    ctx.stroke();
    ctx.setLineDash([]);

    // Footer Badge & Text
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 54px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▼ ZONA DE PIE DE PÁGINA / DATOS DE CONTACTO ▼', width / 2, footerTop + 140);

    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#10B981';
    ctx.fillText('Coloca aquí Dirección, Teléfonos, Sitio Web, Correo, Redes o Registro Legal', width / 2, footerTop + 200);
    ctx.font = 'italic 34px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Altura máxima recomendada: 250 a 350 px (0.8 a 1.2 pulgadas)', width / 2, footerTop + 260);

    // 5. CENTRAL SAFE ZONE (Between 450 px and 2950 px)
    const centerY = (headerHeight + footerTop) / 2;

    // Rounded Info Box in the Center
    const boxW = 1800;
    const boxH = 1200;
    const boxX = (width - boxW) / 2;
    const boxY = centerY - boxH / 2;

    // Card background
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 40);
    ctx.fill();
    ctx.stroke();

    // Box Header
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ÁREA SEGURA PARA EL TEXTO DEL CONTRATO', width / 2, boxY + 140);

    ctx.fillStyle = '#475569';
    ctx.font = '40px sans-serif';
    ctx.fillText('Esta zona debe permanecer 100% BLANCA o TRANSPARENTE.', width / 2, boxY + 220);
    ctx.fillText('Aquí es donde el sistema imprime las cláusulas y firmas del contrato.', width / 2, boxY + 280);

    // Divider inside card
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(boxX + 100, boxY + 340);
    ctx.lineTo(boxX + boxW - 100, boxY + 340);
    ctx.stroke();

    // Specs list
    ctx.textAlign = 'left';
    const listX = boxX + 150;
    let listY = boxY + 440;
    const itemGap = 90;

    const specs = [
      { label: '📐 Tamaño de Hoja:', desc: 'Carta (US Letter) 8.5 × 11 pulgadas (215.9 × 279.4 mm)' },
      { label: '🎯 Resolución Recomendada:', desc: '2550 × 3300 px a 300 DPI (alta calidad de impresión / PDF)' },
      { label: '🌐 Resolución Mínima Web:', desc: '816 × 1056 px (proporción 8.5 : 11)' },
      { label: '🖼️ Formato Recomendado:', desc: 'PNG con fondo transparente (para que solo se vea tu membrete)' },
      { label: '🛠️ Herramientas de Diseño:', desc: 'Canva, Adobe Photoshop, Illustrator, Figma o Microsoft Word' },
      { label: '⚠️ Importante:', desc: 'No coloques textos largos o marcas de agua oscuras en el centro' },
    ];

    specs.forEach((item) => {
      ctx.font = 'bold 40px sans-serif';
      ctx.fillStyle = '#1E293B';
      ctx.fillText(item.label, listX, listY);

      ctx.font = '38px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(item.desc, listX + 540, listY);

      listY += itemGap;
    });

    // Bottom banner inside card
    ctx.fillStyle = '#EFF6FF';
    ctx.beginPath();
    ctx.roundRect(boxX + 80, boxY + boxH - 180, boxW - 160, 120, 20);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#1D4ED8';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText('💡 Tip: Puedes usar esta misma imagen como guía de fondo en tu editor de diseño.', width / 2, boxY + boxH - 105);

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Error al generar la imagen de plantilla.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('¡Plantilla guía tamaño carta descargada con éxito!');
    }, 'image/png');
  } catch (err) {
    console.error('Error generating letterhead guide:', err);
    toast.error('Error al generar la plantilla de descarga.');
  }
};

interface LetterheadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LetterheadGuideModal: React.FC<LetterheadGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-200 dark:border-blue-800 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Guía de Membrete & Fondo Tamaño Carta
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Requisitos de dimensiones y zonas seguras para contratos y plantillas
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Visual Mockup */}
          <div className="space-y-4">
            <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-6">
              {/* Visual Sheet Preview */}
              <div className="w-48 h-64 bg-white rounded-lg shadow-md border-2 border-slate-300 relative overflow-hidden flex flex-col justify-between shrink-0 select-none">
                {/* Header Zone */}
                <div className="h-12 bg-blue-100/80 border-b border-dashed border-blue-400 p-1 text-center flex flex-col justify-center">
                  <span className="text-[8px] font-bold text-blue-700 leading-tight">ENCABEZADO / LOGO</span>
                  <span className="text-[7px] text-blue-500">Max 450 px</span>
                </div>

                {/* Safe Text Zone */}
                <div className="flex-1 p-2 text-center flex flex-col justify-center items-center">
                  <span className="text-[9px] font-extrabold text-slate-700 uppercase tracking-wider">
                    Área de Contrato
                  </span>
                  <span className="text-[7px] text-slate-400 leading-tight mt-0.5">
                    Dejar blanco o transparente para las cláusulas
                  </span>
                </div>

                {/* Footer Zone */}
                <div className="h-10 bg-emerald-100/80 border-t border-dashed border-emerald-400 p-1 text-center flex flex-col justify-center">
                  <span className="text-[8px] font-bold text-emerald-700 leading-tight">PIE DE PÁGINA</span>
                  <span className="text-[7px] text-emerald-600">Contacto / Legal (Max 350 px)</span>
                </div>
              </div>

              {/* Quick Specs summary */}
              <div className="space-y-2.5 flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg font-bold text-[11px] border border-blue-200 dark:border-blue-800">
                    📐 Tamaño Carta: 8.5 × 11 pulgadas
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold text-[11px] border border-emerald-200 dark:border-emerald-800">
                    300 DPI (Imprenta)
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  <p className="flex items-start gap-1.5 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Resolución Óptima:</strong> 2550 × 3300 píxeles a 300 DPI.</span>
                  </p>
                  <p className="flex items-start gap-1.5 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Resolución Alternativa Web:</strong> 816 × 1056 píxeles a 96 DPI.</span>
                  </p>
                  <p className="flex items-start gap-1.5 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Formato:</strong> PNG transparente (recomendado) o JPG de alta fidelidad.</span>
                  </p>
                  <p className="flex items-start gap-1.5 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Centro limpio:</strong> Evita marcas de agua invasivas en el centro para que el texto sea legible.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* How to use in Canva / Photoshop */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>¿Cómo usar la plantilla en Canva o Photoshop?</span>
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs font-medium leading-relaxed pl-1">
                <li>Descarga la plantilla con el botón inferior.</li>
                <li>En Canva, crea un diseño personalizado de <strong>2550 × 3300 px</strong> y coloca la plantilla como capa de fondo guía.</li>
                <li>Coloca tu logotipo en la cabecera superior y tus datos de contacto en el pie inferior.</li>
                <li>Oculta o elimina la capa de guía y exporta como <strong>PNG transparente</strong>.</li>
                <li>¡Sube tu archivo a la plantilla o contrato y encajará con precisión milimétrica!</li>
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 font-medium text-center sm:text-left">
              Archivo listo para importar en Canva, Photoshop o Figma
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => downloadLetterheadGuideTemplate()}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Plantilla Guía (PNG 2550×3300)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default LetterheadGuideModal;
