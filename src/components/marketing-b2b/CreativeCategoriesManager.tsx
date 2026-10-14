'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderPlus, Tag, Edit3, Trash2, CheckCircle2, XCircle, 
  RefreshCw, Plus, Search, Palette, Sparkles, Layers,
  Compass, Plane, ShoppingBag, MapPin, Award, Star, Megaphone,
  Briefcase, Heart, Flame, Shield, X, Check
} from 'lucide-react';
import { MarketingCreativeCategory } from '../../types/marketingB2B';
import marketingB2BService from '../../services/marketingB2BService';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
];

const PRESET_ICONS = [
  { name: 'tag', label: 'Etiqueta', icon: Tag },
  { name: 'sparkles', label: 'Destacado', icon: Sparkles },
  { name: 'plane', label: 'Vuelos/Viajes', icon: Plane },
  { name: 'compass', label: 'Turismo', icon: Compass },
  { name: 'megaphone', label: 'Promociones', icon: Megaphone },
  { name: 'shopping-bag', label: 'Paquetes', icon: ShoppingBag },
  { name: 'map-pin', label: 'Destinos', icon: MapPin },
  { name: 'award', label: 'VIP / Premium', icon: Award },
  { name: 'flame', label: 'Tendencia', icon: Flame },
  { name: 'briefcase', label: 'Corporativo', icon: Briefcase },
];

export const CreativeCategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<MarketingCreativeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MarketingCreativeCategory | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    color: string;
    icon: string;
    is_active: boolean;
  }>({
    name: '',
    description: '',
    color: '#8B5CF6',
    icon: 'tag',
    is_active: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await marketingB2BService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      icon: 'tag',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: MarketingCreativeCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#8B5CF6',
      icon: category.icon || 'tag',
      is_active: category.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('El nombre de la categoría es obligatorio');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading(editingCategory ? 'Actualizando categoría...' : 'Creando categoría...');

    try {
      if (editingCategory) {
        await marketingB2BService.updateCategory(editingCategory.id, formData);
        toast.success('Categoría actualizada exitosamente', { id: toastId });
      } else {
        await marketingB2BService.createCategory(formData);
        toast.success('Categoría creada exitosamente', { id: toastId });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error('Error saving category:', err);
      const msg = err?.response?.data?.message || 'Error al guardar la categoría';
      toast.error(msg, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: MarketingCreativeCategory) => {
    const confirmMessage = (category.templates_count || 0) > 0
      ? `Esta categoría tiene ${category.templates_count} plantillas asociadas. ¿Seguro que deseas eliminarla?`
      : `¿Seguro que deseas eliminar la categoría "${category.name}"?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await marketingB2BService.deleteCategory(category.id);
      toast.success('Categoría eliminada');
      fetchCategories();
    } catch (err: any) {
      console.error('Error deleting category:', err);
      toast.error(err?.response?.data?.message || 'Error al eliminar categoría');
    }
  };

  const handleToggleActive = async (category: MarketingCreativeCategory) => {
    try {
      await marketingB2BService.updateCategory(category.id, {
        is_active: !category.is_active,
      });
      toast.success(category.is_active ? 'Categoría desactivada' : 'Categoría activada');
      fetchCategories();
    } catch (err) {
      toast.error('Error al cambiar estado');
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderIcon = (iconName?: string | null, className = 'w-4 h-4') => {
    const found = PRESET_ICONS.find((i) => i.name === iconName);
    const IconComp = found ? found.icon : Tag;
    return <IconComp className={className} />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm dark:shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Tag className="w-3 h-3" />
            <span>Exclusivo para Creativos B2B</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Categorías de Plantillas</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Define las categorías temáticas exclusivas para clasificar los creativos de tu marca blanca (ej. Vuelos, Hoteles, Escapadas, Ofertas Flash).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            title="Refrescar categorías"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-500 dark:text-purple-400' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2 outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Total: <span className="text-slate-900 dark:text-white font-black">{categories.length}</span> categorías
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Cargando categorías de creativos...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
            <Tag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">No hay categorías creadas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Crea tu primera categoría para organizar las plantillas y permitir que las agencias filtren sus creativos por temática.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Crear primera categoría
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => {
            const color = cat.color || '#8B5CF6';

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar with Icon & Actions */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: color }}
                    >
                      {renderIcon(cat.icon, 'w-5 h-5')}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          cat.is_active
                            ? 'text-emerald-500 hover:bg-emerald-500/10'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={cat.is_active ? 'Categoría activa (clic para desactivar)' : 'Inactiva (clic para activar)'}
                      >
                        {cat.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Editar categoría"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Name and Description */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900 dark:text-white truncate">{cat.name}</h4>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                        title={`Color: ${color}`}
                      />
                    </div>
                    {cat.description ? (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Sin descripción</p>
                    )}
                  </div>
                </div>

                {/* Footer with Template Count and Status Badge */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold">
                    <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{cat.templates_count || 0} plantillas</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      cat.is_active
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: formData.color }}
                >
                  {renderIcon(formData.icon, 'w-5 h-5')}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingCategory ? 'Editar Categoría de Creativos' : 'Nueva Categoría de Creativos'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Exclusiva para las plantillas de tu Marca Blanca</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre de la Categoría *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Vuelos Internacionales, Escapadas de Fin de Semana"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Descripción (Opcional)</label>
                <textarea
                  rows={2}
                  placeholder="Describe brevemente qué tipo de creativos agrupa..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              {/* Color Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Color Identificador</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-7 h-7 rounded-lg transition-transform cursor-pointer ${
                        formData.color === c ? 'scale-110 ring-2 ring-purple-500 shadow-lg' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <div className="flex items-center gap-1 ml-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-7 h-7 rounded bg-transparent cursor-pointer border border-slate-300 dark:border-slate-700"
                    />
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{formData.color}</span>
                  </div>
                </div>
              </div>

              {/* Icon Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Icono Representativo</label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_ICONS.map((item) => {
                    const IconC = item.icon;
                    const isSelected = formData.icon === item.name;

                    return (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() => setFormData({ ...formData, icon: item.name })}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-300 ring-1 ring-purple-500/30'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <IconC className="w-4 h-4" />
                        <span className="truncate w-full text-center">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggle Activo */}
              <div className="pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Categoría Activa</span>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeCategoriesManager;
