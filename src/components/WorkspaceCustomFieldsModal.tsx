import React, { useEffect, useState } from 'react';
import { Workspace, WorkspaceMetaCustomField } from '../types';
import workspaceMetaService from '../services/workspaceMetaService';
import { Sliders, Plus, Edit3, Trash2, Check, X, Layers, AlertCircle } from 'lucide-react';

interface WorkspaceCustomFieldsModalProps {
  workspace: Workspace | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export const WorkspaceCustomFieldsModal: React.FC<WorkspaceCustomFieldsModalProps> = ({
  workspace,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [fields, setFields] = useState<WorkspaceMetaCustomField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    internal_name: '',
    label: '',
    field_key: '',
    type: 'text',
    optionsText: '',
    is_required: false,
    is_active: true,
  });

  const [errorMsg, setErrorMsg] = useState('');

  const fetchFields = async () => {
    if (!workspace) return;
    setIsLoading(true);
    try {
      const data = await workspaceMetaService.getCustomFields(workspace.id);
      setFields(data);
    } catch (err) {
      console.error('Error fetching custom fields:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (workspace && isOpen) {
      fetchFields();
      resetForm();
    }
  }, [workspace, isOpen]);

  const resetForm = () => {
    setIsEditing(false);
    setEditingFieldId(null);
    setFormData({
      internal_name: '',
      label: '',
      field_key: '',
      type: 'text',
      optionsText: '',
      is_required: false,
      is_active: true,
    });
    setErrorMsg('');
  };

  if (!isOpen || !workspace) return null;

  const handleEditClick = (field: WorkspaceMetaCustomField) => {
    setIsEditing(true);
    setEditingFieldId(field.id);
    setFormData({
      internal_name: field.internal_name,
      label: field.label,
      field_key: field.field_key,
      type: field.type || 'text',
      optionsText: Array.isArray(field.options) ? field.options.join(', ') : '',
      is_required: !!field.is_required,
      is_active: field.is_active !== false,
    });
  };

  const handleSubmitField = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const optionsArray = formData.type === 'select' && formData.optionsText
      ? formData.optionsText.split(',').map(s => s.trim()).filter(Boolean)
      : null;

    const payload = {
      internal_name: formData.internal_name,
      label: formData.label,
      field_key: formData.field_key || undefined,
      type: formData.type,
      options: optionsArray,
      is_required: formData.is_required,
      is_active: formData.is_active,
    };

    try {
      if (editingFieldId) {
        await workspaceMetaService.updateCustomField(editingFieldId, payload);
      } else {
        await workspaceMetaService.createCustomField(workspace.id, payload);
      }

      resetForm();
      fetchFields();
      if (onUpdated) onUpdated();
    } catch (err: any) {
      console.error('Error saving custom field:', err);
      setErrorMsg(err?.response?.data?.message || 'Error al guardar el campo personalizado.');
    }
  };

  const handleDeleteField = async (id: number) => {
    if (!confirm('¿Desea eliminar este campo personalizado del Workspace?')) return;
    try {
      await workspaceMetaService.deleteCustomField(id);
      fetchFields();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Error deleting custom field:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Campos Personalizados (Custom Fields)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Workspace: <span className="font-bold text-slate-700 dark:text-slate-300">{workspace.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Side */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
              {isEditing ? <Edit3 className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-purple-600" />}
              <span>{isEditing ? 'Editar Campo' : 'Agregar Nuevo Campo'}</span>
            </h4>

            <form onSubmit={handleSubmitField} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Interno
                </label>
                <input
                  type="text"
                  required
                  value={formData.internal_name}
                  onChange={(e) => setFormData({ ...formData, internal_name: e.target.value })}
                  placeholder="Ej. Presupuesto"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Etiqueta Mostrada (Label)
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ej. Presupuesto Estimado ($)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Key / Identificador (Slug)
                </label>
                <input
                  type="text"
                  value={formData.field_key}
                  onChange={(e) => setFormData({ ...formData, field_key: e.target.value })}
                  placeholder="Ej. budget"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Campo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                >
                  <option value="text">Texto (Text)</option>
                  <option value="number">Número (Number)</option>
                  <option value="select">Selección Desplegable (Select)</option>
                  <option value="date">Fecha (Date)</option>
                  <option value="boolean">Booleano (Sí/No)</option>
                </select>
              </div>

              {formData.type === 'select' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Opciones (Separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.optionsText}
                    onChange={(e) => setFormData({ ...formData, optionsText: e.target.value })}
                    placeholder="Casa, Departamento, Terreno"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
              )}

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_required}
                    onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Requerido</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Activo</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-200 rounded-lg font-bold"
                  >
                    Cancelar
                  </button>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Actualizar' : 'Agregar Campo'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Table Side */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-500" />
                Campos Configurados ({fields.length})
              </span>
            </h4>

            {isLoading ? (
              <p className="text-xs text-slate-400 py-4 text-center">Cargando campos...</p>
            ) : fields.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">No se han configurado campos personalizados para este Workspace.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="px-3 py-2.5">Campo</th>
                      <th className="px-3 py-2.5">Key</th>
                      <th className="px-3 py-2.5">Tipo</th>
                      <th className="px-3 py-2.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {fields.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-3 py-2.5">
                          <p className="font-bold text-slate-900 dark:text-white">{f.label}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{f.internal_name} {f.is_required ? '(Requerido)' : ''}</p>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-[11px] text-purple-600 dark:text-purple-400">
                          {f.field_key}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {f.type}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right space-x-1">
                          <button
                            onClick={() => handleEditClick(f)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteField(f.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-5 border-t border-slate-200 dark:border-slate-800 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCustomFieldsModal;
