'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
  Layers,
  Eye
} from 'lucide-react';
import { LexvaultTemplate, LexvaultDocument } from '../types';
import lexvaultService from '../services/lexvaultService';
import { TableSkeleton } from '@/components/Skeleton';
import { LexvaultTemplateModal } from '@/components/LexvaultTemplateModal';
import { LexvaultGenerateModal } from '@/components/LexvaultGenerateModal';
import { LexvaultSignModal } from '@/components/LexvaultSignModal';
import { LexvaultDetailModal } from '@/components/LexvaultDetailModal';
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

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<LexvaultDocument | null>(null);
  const [selectedTemplateForDetail, setSelectedTemplateForDetail] = useState<LexvaultTemplate | null>(null);

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
  const handleOpenDocDetail = (doc: LexvaultDocument) => {
    setSelectedDocForDetail(doc);
    setSelectedTemplateForDetail(null);
    setIsDetailModalOpen(true);
  };

  const handleOpenTemplateDetail = (tmpl: LexvaultTemplate) => {
    setSelectedTemplateForDetail(tmpl);
    setSelectedDocForDetail(null);
    setIsDetailModalOpen(true);
  };

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
    setSelectedTemplateForGen(tmpl || null);
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

  // Filtered documents & templates
  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.document_number && d.document_number.toLowerCase().includes(search.toLowerCase())) ||
      (d.client?.name && d.client.name.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(search.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  );

  const pendingCount = documents.filter((d) => d.status === 'draft' || (d.status as any) == 1).length;
  const signedCount = documents.filter((d) => d.status === 'signed' || (d.status as any) == 2).length;
  const declinedCount = documents.filter((d) => d.status === 'declined' || (d.status as any) == 3).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            LexVault - Bóveda de Documentos Legales
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Generación dinámica de contratos, sustitución de tokens y firma digital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreateTemplate}
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm shadow-2xs transition-all flex items-center gap-2"
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
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{documents.length}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-1">Contratos Totales</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-emerald-600 leading-none">{signedCount}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-1">Firmados</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-amber-600 leading-none">{pendingCount}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-1">Pendientes</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === 'documents'
                ? "Buscar por documento o cliente..."
                : "Buscar plantilla..."
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
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
                    <th className="py-3.5 px-4 text-center w-52">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredDocs.map((doc) => {
                    const isSigned = doc.status === 'signed' || (doc.status as any) == 2;
                    const isDeclined = doc.status === 'declined' || (doc.status as any) == 3;

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
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
                            {/* View Document Detail Component / Page (Word Paper) */}
                            <Link
                              href={`/lexvault/contracts/${doc.id}`}
                              className="p-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors inline-block"
                              title="Ver detalle del contrato (Hoja Carta)"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

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
                              title="Copiar enlace de firma público"
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
        /* TAB 2: PLANTILLAS LEGALES TABLA */
        filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200/80 shadow-sm">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No hay plantillas registradas</h3>
            <p className="text-xs text-slate-500 mt-1">Haga clic en "Nueva Plantilla" para crear la primera plantilla legal.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4 w-20">ID</th>
                    <th className="py-3.5 px-4">Título de Plantilla</th>
                    <th className="py-3.5 px-4">Categoría</th>
                    <th className="py-3.5 px-4 text-center">Variables</th>
                    <th className="py-3.5 px-4">Fecha Creación</th>
                    <th className="py-3.5 px-4 text-center w-60">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTemplates.map((tmpl) => (
                    <tr key={tmpl.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        #{tmpl.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <h4 className="font-bold text-slate-900 text-sm">{tmpl.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 font-mono mt-0.5 max-w-md">
                          {(tmpl.html_content || tmpl.template_body || '').replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          {tmpl.category || 'Contrato'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {tmpl.tokens_json ? tmpl.tokens_json.length : 0} variables
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {tmpl.created_at ? new Date(tmpl.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Template Detail Component / Page (Word Paper) */}
                          <Link
                            href={`/lexvault/templates/${tmpl.id}`}
                            className="p-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors inline-block"
                            title="Ver vista previa de plantilla (Hoja Carta)"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleOpenGenerateDoc(tmpl)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                            title="Usar plantilla para generar contrato"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Usar</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditTemplate(tmpl)}
                            className="p-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors"
                            title="Editar plantilla"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteTemplate(tmpl.id)}
                            className="p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors"
                            title="Eliminar plantilla"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
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
