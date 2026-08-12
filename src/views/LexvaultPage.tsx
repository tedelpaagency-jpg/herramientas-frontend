'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  FileText, 
  Download, 
  Copy, 
  Search, 
  Edit3, 
  Trash2, 
  PenTool, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { LexvaultTemplate, LexvaultDocument } from '../types';
import lexvaultService from '../services/lexvaultService';
import { TableSkeleton } from '@/components/Skeleton';
import { LexvaultTemplateModal } from '@/components/LexvaultTemplateModal';
import { LexvaultGenerateModal } from '@/components/LexvaultGenerateModal';
import { LexvaultSignModal } from '@/components/LexvaultSignModal';
import toast from 'react-hot-toast';

export const LexvaultPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'templates'>('documents');
  const [templates, setTemplates] = useState<LexvaultTemplate[]>([]);
  const [documents, setDocuments] = useState<LexvaultDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<LexvaultTemplate | null>(null);

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedTemplateForGen, setSelectedTemplateForGen] = useState<LexvaultTemplate | null>(null);

  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [selectedDocForSign, setSelectedDocForSign] = useState<LexvaultDocument | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tmplRes, docRes] = await Promise.all([
        lexvaultService.getTemplates(),
        lexvaultService.getDocuments(),
      ]);
      setTemplates(tmplRes);
      setDocuments(docRes);
    } catch (err) {
      console.error('Error fetching LexVault data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleOpenCreateTemplate = () => {
    setTemplateToEdit(null);
    setIsTemplateModalOpen(true);
  };

  const handleOpenEditTemplate = (tmpl: LexvaultTemplate) => {
    setTemplateToEdit(tmpl);
    setIsTemplateModalOpen(true);
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!confirm('¿Desea eliminar esta plantilla legal?')) return;
    try {
      await lexvaultService.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success('Plantilla eliminada');
    } catch (err) {
      console.error('Error deleting template:', err);
      toast.error('Error al eliminar plantilla');
    }
  };

  const handleOpenGenerateDoc = (tmpl?: LexvaultTemplate) => {
    const targetTmpl = tmpl || templates[0];
    if (!targetTmpl) {
      toast.error('Cree una plantilla legal primero');
      return;
    }
    setSelectedTemplateForGen(targetTmpl);
    setIsGenerateModalOpen(true);
  };

  const handleDownloadPdf = async (doc: LexvaultDocument) => {
    const toastId = toast.loading('Descargando PDF del contrato...');
    try {
      await lexvaultService.downloadDocumentPdf(doc.id, doc.document_number || doc.title);
      toast.success('¡PDF descargado con éxito!', { id: toastId });
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error('Error al descargar el PDF', { id: toastId });
    }
  };

  const handleCopySignLink = (doc: LexvaultDocument) => {
    const signUrl = `${window.location.origin}/contract/show/${btoa(doc.id.toString())}`;
    navigator.clipboard.writeText(signUrl);
    toast.success('¡Enlace de firma copiado al portapapeles!');
  };

  const handleDeleteDoc = async (id: number) => {
    if (!confirm('¿Desea eliminar este documento registrado?')) return;
    try {
      await lexvaultService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success('Documento eliminado');
    } catch (err) {
      console.error('Error deleting document:', err);
      toast.error('Error al eliminar documento');
    }
  };

  const handleOpenSignModal = (doc: LexvaultDocument) => {
    setSelectedDocForSign(doc);
    setIsSignModalOpen(true);
  };

  // Filtered documents
  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.document_number && d.document_number.toLowerCase().includes(search.toLowerCase())) ||
      (d.client?.name && d.client.name.toLowerCase().includes(search.toLowerCase()))
  );

  const pendingCount = documents.filter((d) => d.status === 'draft' || (d.status as any) == 1).length;
  const signedCount = documents.filter((d) => d.status === 'signed' || (d.status as any) == 2).length;
  const declinedCount = documents.filter((d) => d.status === 'declined' || (d.status as any) == 3).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            LexVault - Bóveda de Documentos Legales
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Generación dinámica de contratos, sustitución de tokens y firma digital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreateTemplate}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-sm shadow-2xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Nueva Plantilla</span>
          </button>

          <button
            onClick={() => handleOpenGenerateDoc()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generar Contrato</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">{documents.length}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-1">Contratos Totales</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-emerald-600 leading-none">{signedCount}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-1">Firmados</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-amber-600 leading-none">{pendingCount}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-1">Pendientes</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-rose-600 leading-none">{declinedCount}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-1">Rechazados</p>
          </div>
        </div>
      </div>

      {/* Filter & Tab Switcher Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'documents' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Contratos Generados ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'templates' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Plantillas Legales ({templates.length})</span>
          </button>
        </div>

        {activeTab === 'documents' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por documento o cliente..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        )}
      </div>

      {/* Content Body */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : activeTab === 'documents' ? (
        /* TAB 1: CONTRATOS GENERADOS HISTORIAL */
        documents.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200/80 shadow-sm">
            <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No hay contratos registrados</h3>
            <p className="text-xs text-slate-500 mt-1">Seleccione una plantilla legal para emitir un contrato.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">N° Documento</th>
                    <th className="py-3.5 px-4">Título / Contrato</th>
                    <th className="py-3.5 px-4">Cliente</th>
                    <th className="py-3.5 px-4">Fecha</th>
                    <th className="py-3.5 px-4 text-center">Estado</th>
                    <th className="py-3.5 px-4 text-center w-44">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredDocs.map((doc) => {
                    const isSigned = doc.status === 'signed' || (doc.status as any) == 2;
                    const isDeclined = doc.status === 'declined' || (doc.status as any) == 3;

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                          {doc.document_number || `#LEX-${doc.id}`}
                        </td>
                        <td className="py-3.5 px-4">
                          <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            {doc.template?.category || 'Contrato Legal'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {doc.client?.name || 'Cliente Particular'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isSigned ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Firmado
                            </span>
                          ) : isDeclined ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                              Rechazado
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* PDF Download Direct Button */}
                            <button
                              onClick={() => handleDownloadPdf(doc)}
                              className="p-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-colors"
                              title="Descargar PDF del contrato"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {/* Copy Sign Link */}
                            <button
                              onClick={() => handleCopySignLink(doc)}
                              className="p-1.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                              title="Copiar enlace de firma"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Sign Button */}
                            <button
                              onClick={() => handleOpenSignModal(doc)}
                              className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors"
                              title="Firmar / Gestionar Firma"
                            >
                              <PenTool className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* TAB 2: PLANTILLAS LEGALES GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tmpl) => (
            <div key={tmpl.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                    {tmpl.category || 'Contrato'}
                  </span>
                  {tmpl.tokens_json && (
                    <span className="text-[10px] font-bold text-slate-400">
                      {tmpl.tokens_json.length} variables
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-1">{tmpl.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 font-mono leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mt-3">
                  {(tmpl.html_content || tmpl.template_body || '').replace(/<[^>]*>?/gm, '').substring(0, 140)}...
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenGenerateDoc(tmpl)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Usar Plantilla</span>
                </button>

                <button
                  onClick={() => handleOpenEditTemplate(tmpl)}
                  className="p-2 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Editar plantilla"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteTemplate(tmpl.id)}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Eliminar plantilla"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modales */}
      <LexvaultTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSuccess={fetchData}
        templateToEdit={templateToEdit}
      />

      <LexvaultGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSuccess={(doc) => {
          fetchData();
          if (doc?.id) {
            lexvaultService.downloadDocumentPdf(doc.id, doc.document_number);
          }
        }}
        template={selectedTemplateForGen}
      />

      <LexvaultSignModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSuccess={fetchData}
        document={selectedDocForSign}
      />
    </div>
  );
};

export default LexvaultPage;
