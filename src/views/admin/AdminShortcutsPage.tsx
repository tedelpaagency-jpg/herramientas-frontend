'use client';

import React, { useEffect, useState } from 'react';
import shortcutService from '../../services/shortcutService';
import { Shortcut, ShortcutModuleDefinition } from '../../types';
import ShortcutIcon, { ICON_CATALOG } from '@/components/ShortcutIcon';
import { 
  Plus, Edit, Trash2, ArrowUp, ArrowDown, ExternalLink, LayoutGrid, 
  Search, CheckCircle2, XCircle, Globe, RefreshCw, Layers, ShieldCheck, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export const AdminShortcutsPage: React.FC = () => {
  const { user } = useAuth();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [availableModules, setAvailableModules] = useState<ShortcutModuleDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);

  // Form Fields
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'modulo' | 'enlace_externo'>('modulo');
  const [destino, setDestino] = useState('');
  const [icono, setIcono] = useState('Zap');
  const [orden, setOrden] = useState<number>(1);
  const [activo, setActivo] = useState(true);

  // Icon Picker Filter
  const [iconSearch, setIconSearch] = useState('');

  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
  const isWhiteLabelAdmin = user?.role === 'white_label_admin' || user?.roles?.some((r: any) => r.name === 'white_label_admin');

  const fetchShortcuts = async () => {
    setIsLoading(true);
    try {
      const [shortcutsData, modulesData] = await Promise.all([
        shortcutService.getShortcuts(),
        shortcutService.getAvailableModules(),
      ]);
      setShortcuts(shortcutsData);
      setAvailableModules(modulesData);
    } catch (err) {
      console.error('Error fetching shortcuts:', err);
      toast.error('Error al cargar la lista de accesos directos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShortcuts();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingShortcut(null);
    setNombre('');
    setTipo('modulo');
    setDestino(availableModules.length > 0 ? availableModules[0].path : '/');
    setIcono('Zap');
    setOrden(shortcuts.length + 1);
    setActivo(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (shortcut: Shortcut) => {
    setEditingShortcut(shortcut);
    setNombre(shortcut.nombre);
    setTipo(shortcut.tipo);
    setDestino(shortcut.destino);
    setIcono(shortcut.icono || 'Link');
    setOrden(shortcut.orden);
    setActivo(shortcut.activo);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error('Por favor ingresa un nombre para el acceso directo');
      return;
    }

    if (!destino.trim()) {
      toast.error('Por favor selecciona o ingresa un destino');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Shortcut> = {
        nombre: nombre.trim(),
        tipo,
        destino: destino.trim(),
        icono,
        orden,
        activo,
      };

      if (editingShortcut) {
        await shortcutService.updateShortcut(editingShortcut.id, payload);
        toast.success('Acceso directo actualizado correctamente');
      } else {
        await shortcutService.createShortcut(payload);
        toast.success('Acceso directo creado correctamente');
      }

      setIsModalOpen(false);
      fetchShortcuts();
      window.dispatchEvent(new CustomEvent('shortcuts-updated'));
    } catch (err: any) {
      console.error('Error saving shortcut:', err);
      const errMsg = err?.response?.data?.message || 'Error al guardar el acceso directo';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (shortcut: Shortcut) => {
    try {
      await shortcutService.toggleShortcutActive(shortcut.id);
      setShortcuts((prev) =>
        prev.map((s) => (s.id === shortcut.id ? { ...s, activo: !s.activo } : s))
      );
      toast.success(shortcut.activo ? 'Acceso directo desactivado' : 'Acceso directo activado');
      window.dispatchEvent(new CustomEvent('shortcuts-updated'));
    } catch (err) {
      console.error('Error toggling shortcut status:', err);
      toast.error('Error al cambiar estado del acceso directo');
    }
  };

  const handleDelete = async (shortcut: Shortcut) => {
    if (!confirm(`¿Estás seguro de eliminar el acceso directo "${shortcut.nombre}"?`)) return;

    try {
      await shortcutService.deleteShortcut(shortcut.id);
      setShortcuts((prev) => prev.filter((s) => s.id !== shortcut.id));
      toast.success('Acceso directo eliminado');
      window.dispatchEvent(new CustomEvent('shortcuts-updated'));
    } catch (err) {
      console.error('Error deleting shortcut:', err);
      toast.error('Error al eliminar el acceso directo');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === shortcuts.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newShortcuts = [...shortcuts];
    const temp = newShortcuts[index];
    newShortcuts[index] = newShortcuts[targetIndex];
    newShortcuts[targetIndex] = temp;

    // Update order property
    const reordered = newShortcuts.map((item, i) => ({
      ...item,
      orden: i + 1,
    }));

    setShortcuts(reordered);

    try {
      await shortcutService.reorderShortcuts(
        reordered.map((s) => ({ id: s.id, orden: s.orden }))
      );
      toast.success('Orden actualizado');
      window.dispatchEvent(new CustomEvent('shortcuts-updated'));
    } catch (err) {
      console.error('Error reordering shortcuts:', err);
      toast.error('Error al reordenar accesos directos');
      fetchShortcuts();
    }
  };

  // Filter Lucide icons for selector grid
  const availableIcons = Object.keys(ICON_CATALOG).filter((iconKey) =>
    iconKey.toLowerCase().includes(iconSearch.toLowerCase().trim())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-sky-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Accesos Directos del Header</h1>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium">
            Administra los accesos rápidos visibles en el encabezado para todas las agencias de tu Marca Blanca.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Acceso Directo</span>
        </button>
      </div>

      {/* Main List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
            Listado de Accesos Directos ({shortcuts.length})
          </h2>
          <button
            onClick={fetchShortcuts}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Recargar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-sky-600" />
            <p className="text-xs font-semibold">Cargando accesos directos...</p>
          </div>
        ) : shortcuts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <LayoutGrid className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No hay accesos directos creados aún.
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              Crea tu primer acceso directo para que aparezca en la barra superior de tu plataforma.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl hover:bg-sky-500 transition-colors shadow-xs"
            >
              + Crear Acceso Directo
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-center w-16">Orden</th>
                  <th className="px-4 py-3 text-center w-16">Icono</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Destino</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {shortcuts.map((shortcut, index) => (
                  <tr
                    key={shortcut.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Order & Reorder Controls */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300 w-5">
                          {shortcut.orden}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, 'up')}
                            className="p-1 text-slate-400 hover:text-sky-600 disabled:opacity-20 disabled:hover:text-slate-400"
                            title="Mover arriba"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={index === shortcuts.length - 1}
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="p-1 text-slate-400 hover:text-sky-600 disabled:opacity-20 disabled:hover:text-slate-400"
                            title="Mover abajo"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Icon Preview */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto border border-sky-100 dark:border-sky-900">
                        <ShortcutIcon name={shortcut.icono} className="w-4 h-4" />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {shortcut.nombre}
                    </td>

                    {/* Type Badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {shortcut.tipo === 'modulo' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          <LayoutGrid className="w-3 h-3" />
                          Módulo del sistema
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <ExternalLink className="w-3 h-3" />
                          Enlace externo
                        </span>
                      )}
                    </td>

                    {/* Target */}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate font-mono text-[11px]">
                      {shortcut.destino}
                    </td>

                    {/* Active Status */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(shortcut)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          shortcut.activo
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {shortcut.activo ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>Activo</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Inactivo</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(shortcut)}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(shortcut)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-sky-600" />
                <span>{editingShortcut ? 'Editar Acceso Directo' : 'Nuevo Acceso Directo'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Nombre */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Acceso Directo *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Capacitación o Portal Externo"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Tipo de Acceso */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Acceso *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTipo('modulo');
                      if (availableModules.length > 0 && !availableModules.some((m) => m.path === destino)) {
                        setDestino(availableModules[0].path);
                      }
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      tipo === 'modulo'
                        ? 'border-sky-600 bg-sky-50/80 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5 text-sky-600" />
                    <span>Módulo del Sistema</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTipo('enlace_externo');
                      if (destino.startsWith('/')) {
                        setDestino('https://');
                      }
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      tipo === 'enlace_externo'
                        ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ExternalLink className="w-5 h-5 text-emerald-600" />
                    <span>Enlace Externo</span>
                  </button>
                </div>
              </div>

              {/* Destino Config (Dynamic Module vs External URL) */}
              {tipo === 'modulo' ? (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Seleccionar Módulo Destino *
                  </label>
                  <select
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-sky-500"
                  >
                    {availableModules.map((m) => (
                      <option key={m.key} value={m.path}>
                        [{m.category || 'Módulo'}] {m.name} ({m.path})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL Externa *
                  </label>
                  <input
                    type="url"
                    required
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    placeholder="https://www.ejemplo.com"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Debe comenzar con http:// o https://
                  </p>
                </div>
              )}

              {/* Icon Visual Selector */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Seleccionar Icono *
                  </label>
                  <span className="text-[10px] font-bold text-sky-600 flex items-center gap-1">
                    Seleccionado: <ShortcutIcon name={icono} className="w-3.5 h-3.5 inline" /> ({icono})
                  </span>
                </div>

                {/* Icon Search */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Buscar icono por nombre..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>

                {/* Icon Grid */}
                <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 max-h-36 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 custom-scrollbar">
                  {availableIcons.map((iconKey) => (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setIcono(iconKey)}
                      title={iconKey}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                        icono === iconKey
                          ? 'bg-sky-600 text-white shadow-md scale-105 ring-2 ring-sky-400'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <ShortcutIcon name={iconKey} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Orden & Activo */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Orden de Visualización
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={orden}
                    onChange={(e) => setOrden(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={activo}
                      onChange={(e) => setActivo(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Acceso Activo
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : editingShortcut ? 'Guardar Cambios' : 'Crear Acceso Directo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShortcutsPage;
