'use client';

import React, { useState, useMemo } from 'react';
import { Permission } from '@/types';
import {
  getPermissionLabel,
  getPermissionDescription,
  getPermissionModule,
} from '@/utils/permissionLabels';
import {
  ArrowLeft,
  KeyRound,
  CheckCheck,
  Undo2,
  Search,
  FolderKanban,
  Lock,
  CheckCircle2,
  Save,
  X,
  Sparkles,
  Layers,
  Shield,
  ShieldCheck,
  AlertCircle,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface GroupPermissionsEditorViewProps {
  group: {
    id?: number;
    name: string;
    slug?: string;
    category?: string;
    description?: string;
    is_active?: boolean;
    is_system?: boolean;
    permissions: string[];
  };
  availablePermissions: Permission[];
  restrictedPermissions?: string[];
  isRestrictionActive?: boolean;
  onSave: (payload: {
    name: string;
    category?: string;
    description?: string;
    is_active: boolean;
    permissions: string[];
  }) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
  title?: string;
  subtitle?: string;
  backLabel?: string;
  badgeText?: string;
  icon?: React.ElementType;
}

export const GroupPermissionsEditorView: React.FC<GroupPermissionsEditorViewProps> = ({
  group,
  availablePermissions,
  restrictedPermissions = [],
  isRestrictionActive = false,
  onSave,
  onCancel,
  saving = false,
  title,
  subtitle,
  backLabel = 'Volver a Módulos',
  badgeText,
  icon: IconComponent = Layers,
}) => {
  const [name, setName] = useState<string>(group.name || '');
  const [category, setCategory] = useState<string>(group.category || '');
  const [description, setDescription] = useState<string>(group.description || '');
  const [isActive, setIsActive] = useState<boolean>(group.is_active ?? true);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(group.permissions || []);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlySelected, setOnlySelected] = useState<boolean>(false);
  const [localSaving, setLocalSaving] = useState<boolean>(false);

  const isSaving = saving || localSaving;

  const isPermAllowed = (permName: string): boolean => {
    if (!isRestrictionActive) return true;
    const lower = permName.toLowerCase();
    if (lower.startsWith('activities.')) {
      return restrictedPermissions.some(
        (p) => p.startsWith('activities.') || p.startsWith('courses.')
      );
    }
    return restrictedPermissions.includes(lower);
  };

  // Determine initial active category according to group rubro
  const getInitialCategory = (): string => {
    const text = `${group.name || ''} ${group.category || ''} ${group.slug || ''}`.toLowerCase();
    if (text.includes('inmobiliaria') || text.includes('propiedad') || text.includes('estate')) return 'Inmobiliaria';
    if (text.includes('turismo') || text.includes('viaje') || text.includes('visa') || text.includes('paquete')) return 'Turismo & Viajes';
    if (text.includes('landing')) return 'Landing Pages';
    if (text.includes('lexvault') || text.includes('contrato') || text.includes('legal')) return 'Legal & Contratos';
    if (text.includes('crm') || text.includes('cliente') || text.includes('lead') || text.includes('pipeline')) return 'CRM & Clientes';
    if (text.includes('marketing') || text.includes('campaña') || text.includes('email')) return 'Marketing & Campañas';
    if (text.includes('pos') || text.includes('producto') || text.includes('comercio')) return 'Comercio & POS';
    if (text.includes('curso') || text.includes('capacitac') || text.includes('academia') || text.includes('actividad')) return 'Capacitación & Academia';
    if (text.includes('rol') || text.includes('usuario')) return 'Roles & Usuarios';
    return 'all';
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(() => getInitialCategory());

  // List of all unique rubros present in available permissions
  const allRubros = useMemo(() => {
    const set = new Set<string>();
    availablePermissions.forEach((p) => {
      set.add(getPermissionModule(p.name));
    });
    return Array.from(set).sort();
  }, [availablePermissions]);

  // Group available permissions by system module domain and active rubro
  const groupedPermissions = useMemo(() => {
    const map: Record<string, Permission[]> = {};
    const q = searchQuery.toLowerCase().trim();

    availablePermissions.forEach((perm) => {
      const isSelected = selectedPermissions.includes(perm.name);
      if (onlySelected && !isSelected) return;

      const mod = getPermissionModule(perm.name);
      if (selectedCategory !== 'all' && mod !== selectedCategory) return;

      const label = getPermissionLabel(perm.name).toLowerCase();
      const desc = getPermissionDescription(perm.name).toLowerCase();

      const matches =
        !q ||
        perm.name.toLowerCase().includes(q) ||
        label.includes(q) ||
        desc.includes(q) ||
        mod.toLowerCase().includes(q);

      if (matches) {
        if (!map[mod]) map[mod] = [];
        map[mod].push(perm);
      }
    });

    return map;
  }, [availablePermissions, searchQuery, onlySelected, selectedPermissions, selectedCategory]);

  const totalAvailableCount = availablePermissions.length;
  const selectedCount = selectedPermissions.length;

  const handleTogglePerm = (permName: string) => {
    if (!isPermAllowed(permName)) {
      toast.error(`El permiso "${permName}" no está contratado en el plan de su Marca Blanca.`);
      return;
    }

    setSelectedPermissions((prev) => {
      const exists = prev.includes(permName);
      return exists ? prev.filter((p) => p !== permName) : [...prev, permName];
    });
  };

  const handleToggleModuleAll = (modulePerms: Permission[]) => {
    const allowed = modulePerms.filter((p) => isPermAllowed(p.name));
    const names = allowed.map((p) => p.name);
    const allSelected = names.length > 0 && names.every((p) => selectedPermissions.includes(p));

    setSelectedPermissions((prev) =>
      allSelected
        ? prev.filter((p) => !names.includes(p))
        : Array.from(new Set([...prev, ...names]))
    );
  };

  const handleSelectAll = () => {
    const allAllowed = availablePermissions
      .filter((p) => isPermAllowed(p.name))
      .map((p) => p.name);

    setSelectedPermissions(allAllowed);
    toast.success(`Todos los permisos seleccionados (${allAllowed.length})`);
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
    toast('Selección de permisos limpiada', { icon: '🧹' });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre del grupo es obligatorio');
      return;
    }

    setLocalSaving(true);
    try {
      await onSave({
        name: name.trim(),
        category: category.trim() || undefined,
        description: description.trim() || undefined,
        is_active: isActive,
        permissions: selectedPermissions,
      });
    } catch (err: any) {
      console.error('Error saving group permissions:', err);
      toast.error(err?.response?.data?.message || 'Error al guardar permisos del grupo');
    } finally {
      setLocalSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 w-full animate-in fade-in duration-200">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all shadow-xs shrink-0 cursor-pointer"
            title={backLabel}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
              <span>Gestión de Planes</span>
              <span>/</span>
              <span>Módulos</span>
              <span>/</span>
              <span className="text-amber-500">Configurar Permisos del Grupo</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex flex-wrap items-center gap-2">
              <span>{title || `Editar Permisos: ${group.name}`}</span>
              {(badgeText || group.category) && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {badgeText || group.category}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {selectedCount} de {totalAvailableCount} permisos asignados
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs transition-all shadow-md shadow-amber-500/20 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Cambios del Grupo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Group Metadata Info Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nombre del Módulo / Grupo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Módulo Actividad Inmobiliaria..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Categoría
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ej. PROPIEDADES, TURISMO..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all uppercase"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Estado
                </label>
                <label className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 accent-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isActive ? 'Grupo Activo' : 'Grupo Inactivo'}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Descripción del Módulo
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el alcance y objetivo de este grupo de permisos..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Selection Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar permiso por nombre, clave (ej. view_estates) o módulo..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Only Selected Filter Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <input
              type="checkbox"
              checked={onlySelected}
              onChange={(e) => setOnlySelected(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 accent-amber-500"
            />
            <span>Solo seleccionados ({selectedCount})</span>
          </label>
        </div>

        {/* Global Mass Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSelectAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Seleccionar Todos ({totalAvailableCount})</span>
          </button>

          <button
            type="button"
            onClick={handleDeselectAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Deseleccionar Todos</span>
          </button>
        </div>
      </div>

      {/* Rubro / Categoría Selector Chips */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rubro / Categoría:
            </span>
            {selectedCategory !== 'all' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Mostrando {selectedCategory}
              </span>
            )}
          </div>
          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Ver todos los rubros
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Todos ({totalAvailableCount})
          </button>
          {allRubros.map((rubro) => {
            const rubroPerms = availablePermissions.filter((p) => getPermissionModule(p.name) === rubro);
            const rubroSelected = rubroPerms.filter((p) => selectedPermissions.includes(p.name)).length;
            const isCurrent = selectedCategory === rubro;

            return (
              <button
                key={rubro}
                type="button"
                onClick={() => setSelectedCategory(rubro)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{rubro}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isCurrent
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {rubroSelected}/{rubroPerms.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorized Permissions Grid */}
      <div className="space-y-6">
        {Object.keys(groupedPermissions).length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            No se encontraron permisos que coincidan con la búsqueda.
          </div>
        ) : (
          Object.entries(groupedPermissions).map(([moduleName, modulePerms]) => {
            const allowed = modulePerms.filter((p) => isPermAllowed(p.name));
            const allSelected = allowed.length > 0 && allowed.every((p) => selectedPermissions.includes(p.name));
            const selectedInModule = modulePerms.filter((p) => selectedPermissions.includes(p.name)).length;

            return (
              <div
                key={moduleName}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs"
              >
                {/* Module Category Bar */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/20">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {moduleName}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {selectedInModule} de {modulePerms.length} permisos seleccionados
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleModuleAll(modulePerms)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer self-start sm:self-auto ${
                      allSelected
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {allSelected ? 'Deseleccionar Módulo' : 'Seleccionar Todo el Módulo'}
                  </button>
                </div>

                {/* Individual Permissions Grid */}
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {modulePerms.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.name);
                    const isAllowed = isPermAllowed(perm.name);
                    const label = getPermissionLabel(perm.name);
                    const desc = getPermissionDescription(perm.name);

                    return (
                      <div
                        key={perm.id}
                        onClick={() => handleTogglePerm(perm.name)}
                        className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all select-none flex items-start justify-between gap-3 ${
                          !isAllowed
                            ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
                            : isChecked
                              ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-600/50 text-slate-900 dark:text-slate-100 ring-1 ring-amber-500/20 shadow-2xs'
                              : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={!isAllowed}
                            readOnly
                            className="w-4 h-4 mt-0.5 rounded text-amber-500 focus:ring-amber-400 pointer-events-none accent-amber-500 shrink-0"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="font-bold text-xs leading-snug text-slate-900 dark:text-slate-100">
                              {label}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              {desc}
                            </div>
                            <div className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] text-slate-500 dark:text-slate-400">
                              {perm.name}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {!isAllowed ? (
                            <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> No contratado
                            </span>
                          ) : isChecked ? (
                            <span className="text-[9px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-700">
                              Activo
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sticky Bottom Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Total asignado a este grupo:
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
              {selectedCount} permisos
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSubmit()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs transition-all shadow-md shadow-amber-500/20 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPermissionsEditorView;
