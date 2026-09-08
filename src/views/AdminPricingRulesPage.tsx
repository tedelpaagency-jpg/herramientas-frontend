'use client';

import React, { useState, useEffect } from 'react';
import { wholesaleService } from '../services/wholesaleService';
import { Plus, Trash2, Shield, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminPricingRulesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    target_type: 'category',
    target_id: '',
    category: 'rentals',
    markup_type: 'percentage',
    markup_value: 15,
    priority: 10,
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await wholesaleService.getPricingRules();
      setRules(res.data || []);
    } catch (err: any) {
      toast.error('Error al cargar reglas de precio.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await wholesaleService.createPricingRule({
        ...form,
        target_id: form.target_id ? parseInt(form.target_id) : null,
      });
      toast.success('Regla de precio creada exitosamente.');
      setShowModal(false);
      fetchRules();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear la regla.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRule = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta regla de precio?')) return;
    try {
      await wholesaleService.deletePricingRule(id);
      toast.success('Regla eliminada.');
      fetchRules();
    } catch (err: any) {
      toast.error('Error al eliminar la regla.');
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black text-xs uppercase tracking-widest">
            PRICING ENGINE — GESTIÓN CORPORATIVA
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Reglas de Pricing por Prioridad
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Regla de Margen
        </button>
      </div>

      {/* Explicacion de Jerarquia */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span className="text-xs text-slate-300">
            <strong>Evaluación Top-Down por Prioridad ASC:</strong> 1 (Alta = Inmueble/Tour ID) &gt; 5 (Media = Proveedor ID) &gt; 10 (Baja = Categoría).
          </span>
        </div>
      </div>

      {/* Tabla de Reglas */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
          Cargando reglas de precio del PricingEngine...
        </div>
      ) : rules.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
          No hay reglas configuradas. Se aplicará el margen global por defecto de la plataforma (15%).
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">Prioridad</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">Nombre de Regla</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">Nivel (Target)</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">Categoría / Target ID</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">Margen Plataforma</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 font-black text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                      Priority #{rule.priority}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {rule.name}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-xs uppercase font-semibold text-slate-500 whitespace-nowrap">
                      {rule.target_type}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {rule.target_type === 'category' ? rule.category : `Target ID #${rule.target_id}`}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                      {rule.markup_type === 'percentage' ? `${rule.markup_value}%` : `$${rule.markup_value}`}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Nueva Regla */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <form
            onSubmit={handleCreateRule}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Nueva Regla de PricingEngine
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Nombre de la Regla</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. Margen Rentas Cortas Galápagos"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Target Type</label>
                <select
                  value={form.target_type}
                  onChange={(e) => setForm({ ...form, target_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="category">Categoría</option>
                  <option value="provider">Proveedor Específico</option>
                  <option value="item">Ítem Específico</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Prioridad (Priority)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {form.target_type === 'category' ? (
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Categoría Target</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="rentals">Rentas Cortas</option>
                  <option value="hotels">Hoteles</option>
                  <option value="activities">Tours / Actividades</option>
                  <option value="transfers">Transfers</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Target ID (# ID)</label>
                <input
                  type="number"
                  required
                  value={form.target_id}
                  onChange={(e) => setForm({ ...form, target_id: e.target.value })}
                  placeholder="ID del proveedor o del inmueble"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Tipo de Margen</label>
                <select
                  value={form.markup_type}
                  onChange={(e) => setForm({ ...form, markup_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Monto Fijo ($)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Valor de Margen</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.markup_value}
                  onChange={(e) => setForm({ ...form, markup_value: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20"
              >
                {submitting ? 'Guardando...' : 'Crear Regla'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
