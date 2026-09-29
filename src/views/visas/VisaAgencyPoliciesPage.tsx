'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import visaWholesaleService, { AgencyVisaPolicy } from '@/services/visaWholesaleService';
import { 
  FileText, ShieldCheck, Check, Save, ArrowLeft, RefreshCw, Eye, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';

export const VisaAgencyPoliciesPage: React.FC = () => {
  const [policy, setPolicy] = useState<AgencyVisaPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'retention'>('terms');

  const [terms, setTerms] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [retention, setRetention] = useState('');
  const [version, setVersion] = useState('1.0');

  // Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchPolicy = async () => {
    setIsLoading(true);
    try {
      const data = await visaWholesaleService.getAgencyPolicies();
      if (data) {
        setPolicy(data);
        setTerms(data.terms_and_conditions || '');
        setPrivacy(data.data_treatment_policy || '');
        setRetention(data.retention_policy || '');
        setVersion(data.version || '1.0');
      }
    } catch (err) {
      toast.error('Error al cargar políticas de la agencia');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await visaWholesaleService.updateAgencyPolicies({
        terms_and_conditions: terms,
        data_treatment_policy: privacy,
        retention_policy: retention,
        version: version,
      });
      toast.success('¡Políticas legales de la agencia actualizadas exitosamente!');
      fetchPolicy();
    } catch (err) {
      toast.error('Error al guardar políticas.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FileText className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Políticas Legales & Consentimiento</h1>
          </div>
          <p className="text-sm text-slate-500">
            Términos y condiciones, protección de datos y retención exigidos al cliente en modal antes de iniciar el formulario.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> Vista Previa (Modal del Cliente)
          </button>

          <Link
            href="/visas"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
          Cargando configuración de políticas...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab('terms')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'terms'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                1. Términos y Condiciones
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                2. Tratamiento de Datos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('retention')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'retention'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                3. Retención y Eliminación
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Versión:</span>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-16 px-2 py-1 text-xs text-center font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-slate-100"
              />
            </div>
          </div>

          {activeTab === 'terms' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Términos y Condiciones del Servicio Migratorio (HTML o Texto)
              </label>
              <p className="text-xs text-slate-400">
                Regula la relación entre el solicitante, la agencia y la mayorista migratoria. Establece claramente que la concesión de visas depende de la autoridad consular.
              </p>
              <textarea
                rows={12}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full p-4 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100"
              />
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Política de Tratamiento y Protección de Datos Personales
              </label>
              <p className="text-xs text-slate-400">
                Consentimiento informado conforme a normativas de privacidad para el manejo de información sensible y biométrica.
              </p>
              <textarea
                rows={12}
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full p-4 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100"
              />
            </div>
          )}

          {activeTab === 'retention' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Política de Retención, Custodia y Eliminación de Expedientes
              </label>
              <p className="text-xs text-slate-400">
                Establece los plazos de conservación activa y procedimientos de supresión segura de información.
              </p>
              <textarea
                rows={12}
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className="w-full p-4 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100"
              />
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Guardando políticas...' : 'Guardar y Publicar Políticas'}
            </button>
          </div>
        </form>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Políticas Legales y Consentimiento (Versión {version})
                </h3>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div dangerouslySetInnerHTML={{ __html: terms }} />
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div dangerouslySetInnerHTML={{ __html: privacy }} />
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div dangerouslySetInnerHTML={{ __html: retention }} />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
