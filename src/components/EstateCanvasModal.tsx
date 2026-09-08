'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Building2, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ExternalLink,
  QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EstateCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasData: any;
  onDownloadPdf?: () => void;
  onCopyWhatsApp?: () => void;
}

export const EstateCanvasModal: React.FC<EstateCanvasModalProps> = ({
  isOpen,
  onClose,
  canvasData,
  onDownloadPdf,
  onCopyWhatsApp,
}) => {
  if (!isOpen || !canvasData) return null;

  const [activeImage, setActiveImage] = useState<string>(
    canvasData.main_image || canvasData.gallery?.[0] || '/assets/images/placeholder-property.jpg'
  );

  const handleShareWhatsApp = () => {
    if (onCopyWhatsApp) {
      onCopyWhatsApp();
    } else {
      const text = `${canvasData.title}\nPrecio: ${canvasData.price_formatted}\nUbicación: ${canvasData.location?.summary || canvasData.location?.full_address}\n${canvasData.public_url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleCopyLink = () => {
    if (canvasData.public_url) {
      navigator.clipboard.writeText(canvasData.public_url);
      toast.success('¡Enlace público copiado!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl relative z-10 border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Top Bar Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              {canvasData.agency?.logo_url ? (
                <img 
                  src={canvasData.agency.logo_url} 
                  alt={canvasData.agency?.name} 
                  className="h-8 w-auto max-w-[120px] object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">
                  {canvasData.branding?.company_name?.substring(0, 2).toUpperCase() || 'ST'}
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-sm tracking-tight leading-none text-white">Canvas Publicitario del Inmueble</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Vista previa interactiva del flyer promocional</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Scrollable Area */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            {/* Title & Badges Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {canvasData.operation_type || 'Venta'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                    {canvasData.property_type || 'Inmueble'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{canvasData.title}</h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  📍 {canvasData.location?.summary || canvasData.location?.full_address || 'Ubicación no disponible'}
                </p>
              </div>

              {/* Price Banner */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-5 py-3 rounded-2xl shadow-md text-right flex-shrink-0">
                <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Precio de Lista</p>
                <p className="text-2xl font-black tracking-tight">{canvasData.price_formatted}</p>
              </div>
            </div>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-none">{canvasData.specs?.bedrooms || '-'}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Habitaciones</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-none">{canvasData.specs?.bathrooms || '-'}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Baños</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-none">{canvasData.specs?.garage || '-'}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Garaje</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Maximize className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-none">{canvasData.specs?.size ? `${canvasData.specs.size} m²` : '-'}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Área Total</p>
                </div>
              </div>
            </div>

            {/* Main Showcase Image & Gallery */}
            <div className="space-y-3">
              <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                <img 
                  src={activeImage} 
                  alt={canvasData.title} 
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Gallery thumbnails list */}
              {canvasData.gallery && canvasData.gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {canvasData.gallery.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImage === imgUrl ? 'border-blue-600 ring-2 ring-blue-600/30 scale-105' : 'border-slate-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Galería ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Features Checklist */}
            {canvasData.features && canvasData.features.length > 0 && (
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">Amenidades y Características</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {canvasData.features.map((feat: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{typeof feat === 'string' ? feat : feat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {canvasData.description && (
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Descripción del Inmueble</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                  {canvasData.description}
                </p>
              </div>
            )}

            {/* Contact & QR Card */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contacto & Asesoramiento</p>
                <p className="text-base font-extrabold text-white">{canvasData.contact?.name || 'Asesor Inmobiliario'}</p>
                <p className="text-xs text-slate-300">{canvasData.agency?.name || 'SANTUN Provider Portal'}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 font-mono">
                  {canvasData.contact?.phone && (
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-400" />{canvasData.contact.phone}</span>
                  )}
                  {canvasData.contact?.email && (
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" />{canvasData.contact.email}</span>
                  )}
                </div>
              </div>

              {canvasData.qr_code_url && (
                <div className="bg-white p-2 rounded-xl flex flex-col items-center justify-center flex-shrink-0 w-24">
                  <img src={canvasData.qr_code_url} alt="QR Code" className="w-20 h-20" />
                  <span className="text-[9px] font-bold text-slate-700 uppercase mt-1">Escanear Ficha</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Copiar Enlace Público</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartir WhatsApp</span>
              </button>

              {onDownloadPdf && (
                <button
                  onClick={onDownloadPdf}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar PDF</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EstateCanvasModal;
