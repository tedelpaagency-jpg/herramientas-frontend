'use client';

import React, { useEffect, useState } from 'react';
import { Visa, VisaRef } from '../types';
import visaService from '../services/visaService';
import { FileCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface VisaFormModalProps {
  visa: Visa | null;
  visaRefs: VisaRef[];
  defaultRefId?: number | string | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (createdVisa?: Visa) => void;
}

export const VisaFormModal: React.FC<VisaFormModalProps> = ({
  visa,
  visaRefs,
  defaultRefId,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [formData, setFormData] = useState({
    applicant_name: '',
    description: '',
    visa_type: 'USA',
    visa_ref_id: '',
    processing_location: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (visa) {
        setFormData({
          applicant_name: visa.applicant_name || '',
          description: visa.description || '',
          visa_type: visa.visa_type || 'USA',
          visa_ref_id: visa.visa_ref_id ? String(visa.visa_ref_id) : '',
          processing_location: (visa.fields && visa.fields.processing_location) || '',
        });
      } else {
        setFormData({
          applicant_name: '',
          description: '',
          visa_type: 'USA',
          visa_ref_id: defaultRefId && defaultRefId !== 'general' ? String(defaultRefId) : (visaRefs.length > 0 ? String(visaRefs[0].id) : ''),
          processing_location: '',
        });
      }
    }
  }, [visa, isOpen, visaRefs, defaultRefId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: Partial<Visa> = {
        applicant_name: formData.applicant_name,
        description: formData.description,
        visa_type: formData.visa_type,
        visa_ref_id: formData.visa_ref_id ? Number(formData.visa_ref_id) : undefined,
        country_destination: formData.visa_type === 'USA' ? 'Estados Unidos' : formData.visa_type === 'CANADA' ? 'Canadá' : 'Europa',
        status: visa ? visa.status : '1',
        fields: {
          ...(visa?.fields || {}),
          processing_location: formData.processing_location,
        },
      };

      let savedResult: Visa | undefined;
      if (visa) {
        savedResult = await visaService.updateVisa(visa.id, payload);
        toast.success('Solicitud de visa actualizada');
      } else {
        savedResult = await visaService.createVisa(payload);
        toast.success('Nueva solicitud de visa habilitada');
      }
      onSaved(savedResult);
      onClose();
    } catch (err) {
      console.error('Error saving visa:', err);
      toast.error('Error al guardar la solicitud');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {visa ? 'Actualizar Solicitud de Visa' : 'Nueva Solicitud de Visa'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Form (matching CI3 modal_visa_form.php) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombres del Solicitante *</label>
            <input
              type="text"
              required
              value={formData.applicant_name}
              onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
              placeholder="Ej. Juan Pérez Gómez"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción / Observaciones</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción breve u observaciones de la solicitud..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Visa *</label>
            <select
              value={formData.visa_type}
              onChange={(e) => setFormData({ ...formData, visa_type: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="USA">Visa Americana</option>
              <option value="CANADA">Visa Canadiense</option>
              <option value="SCHENGEN">Visa Schengen (Europa)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lugar donde se tramita la visa *</label>
            <select
              value={formData.processing_location || ''}
              onChange={(e) => setFormData({ ...formData, processing_location: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="">Seleccionar Lugar de Trámite</option>
              <option value="Quito">Quito</option>
              <option value="Guayaquil">Guayaquil</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Grupo de Visa (Referencia)</label>
            <select
              value={formData.visa_ref_id}
              onChange={(e) => setFormData({ ...formData, visa_ref_id: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="">Seleccionar Grupo</option>
              {visaRefs.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              {isSaving ? 'Guardando...' : visa ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisaFormModal;
