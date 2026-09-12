import React, { useState } from 'react';
import { FormSchema, FormFieldSchema } from '../../types/landing';
import { ChevronRight, ChevronLeft, Check, Send, Loader2 } from 'lucide-react';

interface Props {
  formSchema: FormSchema;
  onSubmit: (answers: Record<string, any>) => void;
  loading?: boolean;
  submitText?: string;
}

export const DynamicFormRenderer: React.FC<Props> = ({
  formSchema,
  onSubmit,
  loading = false,
  submitText,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields = formSchema.fields || [];
  const steps = formSchema.steps || [];
  const layout = formSchema.layout || 'linear';

  const handleInputChange = (field: FormFieldSchema, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field.name]: value,
    }));
    if (errors[field.name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field.name];
        return updated;
      });
    }
  };

  // Group fields per step if multi_step
  const currentStepFields = layout === 'multi_step' && steps.length > 0
    ? fields.filter((f) => (f.step_index ?? 0) === currentStepIndex)
    : fields;

  const validateCurrentFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    currentStepFields.forEach((field) => {
      if (field.required) {
        const val = formData[field.name];
        if (!val || (typeof val === 'string' && val.trim() === '')) {
          newErrors[field.name] = `${field.label} es obligatorio`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentFields()) return;
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentFields()) return;
    onSubmit(formData);
  };

  const isLastStep = layout !== 'multi_step' || steps.length === 0 || currentStepIndex === steps.length - 1;
  const progressPercent = steps.length > 0 ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 100;

  return (
    <form onSubmit={handleSubmit} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-slate-100">
      {/* Title / Subtitle */}
      {(formSchema.title || formSchema.subtitle) && (
        <div className="text-center space-y-1">
          {formSchema.title && <h3 className="text-xl font-bold text-white">{formSchema.title}</h3>}
          {formSchema.subtitle && <p className="text-xs text-slate-400">{formSchema.subtitle}</p>}
        </div>
      )}

      {/* Multi-step progress bar */}
      {layout === 'multi_step' && steps.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Paso {currentStepIndex + 1} de {steps.length}: {steps[currentStepIndex]?.title}</span>
            <span className="text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Field Rendering */}
      <div className="space-y-4">
        {currentStepFields.map((field) => (
          <div key={field.id} className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-slate-300">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={field.placeholder || ''}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="">-- Seleccionar --</option>
                {field.options?.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={!!formData[field.name]}
                  onChange={(e) => handleInputChange(field, e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600 w-4 h-4"
                />
                {field.placeholder || 'Acepto las condiciones'}
              </label>
            ) : field.type === 'file' ? (
              <div className="space-y-1">
                <input
                  type="file"
                  onChange={(e) => handleInputChange(field, e.target.files?.[0] || null)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">Archivos permitidos: imágenes, PDF, comprobantes de pago (Máx. 5MB)</p>
              </div>
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={field.placeholder || ''}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            )}

            {errors[field.name] && (
              <p className="text-[11px] text-red-400 font-medium">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Navigation & Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {layout === 'multi_step' && currentStepIndex > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
        ) : <div />}

        {isLastStep ? (
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs px-5 py-2.5 rounded-lg font-semibold shadow-lg transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                {submitText || formSchema.submit_button_text || 'Enviar Registro'}
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default DynamicFormRenderer;
