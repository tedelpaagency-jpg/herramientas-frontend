import React, { useEffect, useState } from 'react';
import { AgencyCustomField, agencyCustomFieldService } from '../services/agencyCustomFieldService';
import Portal from './Portal';
import { Sliders, Plus, Edit3, Trash2, Check, X, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AgencyCustomFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyId?: number;
  onUpdated?: () => void;
}

export const AgencyCustomFieldsModal: React.FC<AgencyCustomFieldsModalProps> = ({
  isOpen,
  onClose,
  agencyId,
  onUpdated,
}) => {
  const [fields, setFields] = useState<AgencyCustomField[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    label: '',
    internal_name: '',
    field_key: '',
    type: 'text',
    optionsText: '',
    is_required: false,
    is_active: true,
  });

  const fetchFields = async () => {
    setIsLoading(true);
    try {
      const data = await agencyCustomFieldService.getFields(agencyId, false);
      setFields(data);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar campos personalizados');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFields();
      resetForm();
    }
  }, [isOpen, agencyId]);

  const resetForm = () => {
    setIsEditing(false);
    setEditingFieldId(null);
    setFormData({
      label: '',
      internal_name: '',
      field_key: '',
      type: 'text',
      optionsText: '',
      is_required: false,
      is_active: true,
    });
  };

  if (!isOpen) return null;

  const handleEditClick = (field: AgencyCustomField) => {
    setIsEditing(true);
    setEditingFieldId(field.id);
    setFormData({
      label: field.label,
      internal_name: field.internal_name || field.label,
      field_key: field.field_key,
      type: field.type || 'text',
      optionsText: Array.isArray(field.options) ? field.options.join(', ') : '',
      is_required: !!field.is_required,
      is_active: field.is_active !== false,
    });
  };

  const handleSubmitField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      toast.error('El nombre / etiqueta del campo es requerido');
      return;
    }

    const optionsArray =
      formData.type === 'select' && formData.optionsText
        ? formData.optionsText.split(',').map((s) => s.trim()).filter(Boolean)
        : null;

    setSubmitting(true);
    try {
      if (isEditing && editingFieldId) {
        await agencyCustomFieldService.updateField(editingFieldId, {
          label: formData.label.trim(),
          internal_name: formData.internal_name.trim() || formData.label.trim(),
          type: formData.type,
          options: optionsArray,
          is_required: formData.is_required,
          is_active: formData.is_active,
        });
        toast.success('Campo personalizado actualizado');
      } else {
        await agencyCustomFieldService.createField({
          label: formData.label.trim(),
          internal_name: formData.internal_name.trim() || formData.label.trim(),
          field_key: formData.field_key.trim() || undefined,
          type: formData.type,
          options: optionsArray,
          is_required: formData.is_required,
          is_active: formData.is_active,
          agency_id: agencyId,
        });
        toast.success('Nuevo campo personalizado creado');
      }

      resetForm();
      fetchFields();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar campo personalizado');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    if (!window.confirm('¿Deseas eliminar este campo personalizado de clientes?')) return;
    try {
      await agencyCustomFieldService.deleteField(fieldId);
      toast.success('Campo eliminado');
      fetchFields();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar campo');
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Campos Personalizados de Clientes</h3>
                <p className="text-xs text-slate-500">
                  Configura los campos adicionales que tu agencia solicita a los clientes
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-1 flex-1">
            {/* Form Column */}
            <form onSubmit={handleSubmitField} className="space-y-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
              <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                {isEditing ? 'Editar Campo' : 'Nuevo Campo Personalizado'}
              </h4>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nombre / Etiqueta del Campo *</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ej: Número de Pasaporte, Fecha Visa"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tipo de Campo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                  >
                    <option value="text">Texto Corto</option>
                    <option value="textarea">Texto Largo / Área</option>
                    <option value="number">Número</option>
                    <option value="date">Fecha</option>
                    <option value="select">Desplegable (Select)</option>
                    <option value="boolean">Casilla (Checkbox)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Obligatorio</label>
                  <select
                    value={formData.is_required ? '1' : '0'}
                    onChange={(e) => setFormData({ ...formData, is_required: e.target.value === '1' })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                  >
                    <option value="0">Opcional</option>
                    <option value="1">Requerido (*)</option>
                  </select>
                </div>
              </div>

              {formData.type === 'select' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Opciones (separadas por coma)</label>
                  <input
                    type="text"
                    value={formData.optionsText}
                    onChange={(e) => setFormData({ ...formData, optionsText: e.target.value })}
                    placeholder="Opción 1, Opción 2, Opción 3"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active_check"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <label htmlFor="is_active_check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Campo activo en formulario
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200/60 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/15 transition-all"
                >
                  {submitting ? 'Guardando...' : isEditing ? 'Actualizar Campo' : 'Crear Campo'}
                </button>
              </div>
            </form>

            {/* List Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Campos Existentes ({fields.length})
              </h4>

              {isLoading ? (
                <div className="p-8 text-center text-slate-500 font-medium text-xs flex justify-center items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Cargando campos...</span>
                </div>
              ) : fields.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-xs text-slate-500">
                  No has agregado campos personalizados aun.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {fields.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{f.label}</span>
                          {f.is_required && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              *
                            </span>
                          )}
                          {!f.is_active && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              Inactivo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                          <span className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-indigo-700 font-semibold">{f.type}</span>
                          <span>key: {f.field_key}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(f)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteField(f.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AgencyCustomFieldsModal;
