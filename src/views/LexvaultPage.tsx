'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Layers,
  Eye,
  Building2,
  FileCheck
} from 'lucide-react';
import { LexvaultTemplate, LexvaultDocument } from '../types';
import lexvaultService from '../services/lexvaultService';
import { TableSkeleton } from '@/components/Skeleton';
import { LexvaultTemplateModal } from '@/components/LexvaultTemplateModal';
import { LexvaultGenerateModal } from '@/components/LexvaultGenerateModal';
import { LexvaultSignModal } from '@/components/LexvaultSignModal';
import { LetterheadGuideModal } from '@/components/LetterheadGuideModal';
import toast from 'react-hot-toast';

export const LexvaultPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'documents' | 'templates'>('documents');
  const [templates, setTemplates] = useState<LexvaultTemplate[]>([]);
  const [documents, setDocuments] = useState<LexvaultDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modales
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedTemplateForGen, setSelectedTemplateForGen] = useState<LexvaultTemplate | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [selectedDocForSign, setSelectedDocForSign] = useState<LexvaultDocument | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tmplResult, docResult] = await Promise.allSettled([
        lexvaultService.getTemplates(),
        lexvaultService.getDocuments(),
      ]);

      if (tmplResult.status === 'fulfilled') {
        setTemplates(tmplResult.value);
      } else {
        console.error('Error fetching templates:', tmplResult.reason);
      }

      if (docResult.status === 'fulfilled') {
        setDocuments(docResult.value);
      } else {
        console.error('Error fetching documents:', docResult.reason);
      }
    } catch (err) {
      console.error('Error fetching LexVault data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      (d.client?.name && d.client.name.toLowerCase().includes(search.toLowerCase())) ||
      (d.agency?.name && d.agency.name.toLowerCase().includes(search.toLowerCase())) ||
      (d.whiteLabel?.name && d.whiteLabel.name.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(search.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
      (t.agency?.name && t.agency.name.toLowerCase().includes(search.toLowerCase())) ||
      (t.whiteLabel?.name && t.whiteLabel.name.toLowerCase().includes(search.toLowerCase()))
  );

  const pendingCount = documents.filter((d) => d.status === 'draft' || (d.status as any) == 1).length;
  const signedCount = documents.filter((d) => d.status === 'signed' || (d.status as any) == 2).length;
  const declinedCount = documents.filter((d) => d.status === 'declined' || (d.status as any) == 3).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-blue-600 shrink-0" />
            <span>LexVault - Bóveda Legal & Contratos</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Plantillas con membrete individual, redacción en vista completa y firma digital.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsGuideModalOpen(true)}
            className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 rounded-xl font-bold text-sm shadow-2xs transition-all flex items-center gap-2"
            title="Ver guía y descargar plantilla base tamaño carta para Canva o Photoshop"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Plantilla Guía Carta</span>
          </button>

          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 px-4 py-2.5 rounded-xl font-bold text-sm shadow-2xs transition-all flex items-center gap-2"
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
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{documents.length}</p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">Contratos Totales</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-emerald-600 leading-none">{signedCount}</p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">Firmados</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-amber-600 leading-none">{pendingCount}</p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">Pendientes</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-rose-600 leading-none">{declinedCount}</p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">Rechazados</p>
          </div>
        </div>
      </div>

      {/* Filter & Tab Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'documents' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Contratos Generados ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'templates' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Plantillas Legales ({templates.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === 'documents'
                ? "Buscar contrato, cliente o marca blanca..."
                : "Buscar plantilla por título o categoría..."
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          />
        </div>
      </div>

      {/* Content Body */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : activeTab === 'documents' ? (
        /* TAB 1: CONTRATOS GENERADOS HISTORIAL */
        documents.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No hay contratos registrados para su marca blanca / agencia</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Seleccione una plantilla legal para emitir su primer contrato con membrete.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    <th className="py-3.5 px-4">N° Documento</th>
                    <th className="py-3.5 px-4">Título / Contrato</th>
                    <th className="py-3.5 px-4">Cliente</th>
                    <th className="py-3.5 px-4">Membrete / Fondo</th>
                    <th className="py-3.5 px-4">Fecha</th>
                    <th className="py-3.5 px-4 text-center">Estado</th>
                    <th className="py-3.5 px-4 text-center w-52">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredDocs.map((doc) => {
                    const isSigned = doc.status === 'signed' || (doc.status as any) == 2;
                    const isDeclined = doc.status === 'declined' || (doc.status as any) == 3;
                    const hasBg = Boolean(doc.background_image && doc.background_image !== 'none');

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                          <Link 
                            href={`/lexvault/contracts/${doc.id}`}
                            className="hover:underline hover:text-blue-700 dark:hover:text-blue-300"
                            title="Editar contrato individual"
                          >
                            {doc.document_number || `#LEX-${doc.id}`}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <Link 
                            href={`/lexvault/contracts/${doc.id}`}
                            className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                            title="Editar contrato individual"
                          >
                            {doc.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              {doc.template?.category || 'Contrato Legal'}
                            </span>
                            {doc.whiteLabel?.name && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">
                                {doc.whiteLabel.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                          {doc.client?.name || 'Cliente Particular'}
                        </td>
                        <td className="py-3.5 px-4">
                          {hasBg ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Membrete Asignado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                              Sin fondo (Blanco)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isSigned ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              Firmado
                            </span>
                          ) : isDeclined ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                              Rechazado
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              Borrador
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Contract in Full Document Sheet View */}
                            <Link
                              href={`/lexvault/contracts/${doc.id}`}
                              className="p-1.5 rounded-lg text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 transition-colors inline-block"
                              title="Editar contrato individual en vista completa de documento"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>

                            {/* PDF Download Direct Button */}
                            <button
                              onClick={() => handleDownloadPdf(doc)}
                              className="p-1.5 rounded-lg text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition-colors"
                              title="Descargar PDF del contrato"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {/* Copy Sign Link */}
                            <button
                              onClick={() => handleCopySignLink(doc)}
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                              title="Copiar enlace de firma público"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Sign Button */}
                            <button
                              onClick={() => handleOpenSignModal(doc)}
                              className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 transition-colors"
                              title="Gestionar Firma Digital"
                            >
                              <PenTool className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="p-1.5 rounded-lg text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 transition-colors"
                              title="Eliminar contrato"
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
        templates.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No hay plantillas registradas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Crea una nueva plantilla para redactarla en el editor de hoja completa.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    <th className="py-3.5 px-4 w-20">ID</th>
                    <th className="py-3.5 px-4">Título de Plantilla</th>
                    <th className="py-3.5 px-4">Categoría</th>
                    <th className="py-3.5 px-4">Fondo Asignado</th>
                    <th className="py-3.5 px-4 text-center">Variables</th>
                    <th className="py-3.5 px-4">Fecha Creación</th>
                    <th className="py-3.5 px-4 text-center w-60">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredTemplates.map((tmpl) => {
                    const hasBg = Boolean(tmpl.background_image && tmpl.background_image !== 'none');

                    return (
                      <tr key={tmpl.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                          #{tmpl.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{tmpl.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-mono mt-0.5 max-w-md">
                            {(tmpl.html_content || tmpl.template_body || '').replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {tmpl.category || 'Contrato'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {hasBg ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Membrete Asignado
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Sin fondo (Limpio)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {tmpl.tokens_json ? tmpl.tokens_json.length : 0} variables
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                          {tmpl.created_at ? new Date(tmpl.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Directly in Full Document View */}
                            <Link
                              href={`/lexvault/templates/${tmpl.id}`}
                              className="p-1.5 rounded-lg text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 transition-colors inline-block"
                              title="Editar plantilla en vista completa de documento"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleOpenGenerateDoc(tmpl)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                              title="Usar plantilla para generar contrato"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Emitir</span>
                            </button>

                            <button
                              onClick={() => handleDeleteTemplate(tmpl.id)}
                              className="p-1.5 rounded-lg text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 transition-colors"
                              title="Eliminar plantilla"
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
      )}

      {/* Creation Modal (Solo para crear inicialmente; la edición se realiza en vista completa) */}
      <LexvaultTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSuccess={fetchData}
      />

      {/* Modal para generar contrato con token replacements */}
      <LexvaultGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSuccess={(doc) => {
          fetchData();
          if (doc?.id) {
            toast.success('Contrato emitido exitosamente');
            router.push(`/lexvault/contracts/${doc.id}`);
          }
        }}
        template={selectedTemplateForGen}
      />

      {/* Modal para firma digital */}
      <LexvaultSignModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSuccess={fetchData}
        document={selectedDocForSign}
      />

      {/* Modal de guía y descarga de plantilla tamaño carta */}
      <LetterheadGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
};

export default LexvaultPage;
