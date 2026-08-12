import React, { useEffect, useState } from 'react';
import { LexvaultTemplate } from '../types';
import lexvaultService from '../services/lexvaultService';
import { ShieldCheck, FilePlus, Download } from 'lucide-react';

export const LexvaultPage: React.FC = () => {
  const [templates, setTemplates] = useState<LexvaultTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<LexvaultTemplate | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    lexvaultService.getTemplates().then(setTemplates).finally(() => setIsLoading(false));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    setIsGenerating(true);

    try {
      const doc = await lexvaultService.generateDocument(selectedTemplate.id, docTitle, {});
      alert('¡Documento Legal Generado con Éxito!');
      if (doc.id) {
        window.open(lexvaultService.getDocumentPdfUrl(doc.id), '_blank');
      }
      setSelectedTemplate(null);
    } catch (err) {
      console.error('Error generating document:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <ShieldCheck className="w-7 h-7 text-sky-500" />
            <span>LexVault - Bóveda de Documentos Legales</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Conectado a `/v1/lexvault/templates` y `/v1/lexvault/generate-document`</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center"><div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <div key={t.id} className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 uppercase">
                  {t.category || 'Contrato'}
                </span>
                <h3 className="font-bold text-white text-base mt-2">{t.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3">{t.description || t.template_body}</p>
              </div>

              <button
                onClick={() => setSelectedTemplate(t)}
                className="mt-6 w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-2xl text-white font-bold text-xs"
              >
                Generar Documento
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-white mb-2">Generar: {selectedTemplate.title}</h3>
            <form onSubmit={handleGenerate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs text-slate-300">Título / Referencia del Documento</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Ej. Promesa de Compraveta - Juan Pérez"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setSelectedTemplate(null)} className="px-4 py-2 text-xs text-slate-400">Cancelar</button>
                <button type="submit" disabled={isGenerating} className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold">
                  {isGenerating ? 'Generando PDF...' : 'Generar PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LexvaultPage;
