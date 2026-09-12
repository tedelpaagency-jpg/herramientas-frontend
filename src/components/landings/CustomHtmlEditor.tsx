import React, { useState } from 'react';
import { Code, Upload, Eye, Copy, Check, FileText } from 'lucide-react';

interface Props {
  customHtml: string;
  onChange: (html: string) => void;
}

export const CustomHtmlEditor: React.FC<Props> = ({ customHtml, onChange }) => {
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        onChange(content);
      }
    };
    reader.readAsText(file);
  };

  const handleInsertPlaceholder = () => {
    const placeholder = '{{DYNAMIC_FORM}}';
    if (!customHtml.includes(placeholder)) {
      onChange(customHtml + `\n\n<!-- Formulario Dinámico -->\n${placeholder}\n`);
    }
  };

  const handleCopyTag = () => {
    navigator.clipboard.writeText('{{DYNAMIC_FORM}}');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-400" /> Plantilla HTML Personalizada
          </h3>
          <p className="text-xs text-slate-400">
            Sube un archivo .html completo (ej. Ameripass) o edita la estructura directamente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* File Upload Button */}
          <label className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition border border-slate-700">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Subir archivo .html</span>
            <input type="file" accept=".html,.htm" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveView('editor')}
              className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                activeView === 'editor' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Código
            </button>
            <button
              type="button"
              onClick={() => setActiveView('preview')}
              className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                activeView === 'preview' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Vista Previa
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Form Tag helper badge */}
      <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300">Etiqueta de Formulario:</span>
          <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-400 font-mono border border-slate-800">
            {'{{DYNAMIC_FORM}}'}
          </code>
          <span className="text-slate-400 hidden sm:inline">
            Incrustará el formulario interactivo en esa posición del HTML.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInsertPlaceholder}
            className="text-xs bg-amber-900/60 hover:bg-amber-800 text-amber-200 px-2.5 py-1 rounded border border-amber-700/60 transition"
          >
            + Insertar al final
          </button>
          <button
            type="button"
            onClick={handleCopyTag}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* View Content */}
      {activeView === 'editor' ? (
        <textarea
          value={customHtml}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<!DOCTYPE html>&#10;<html>&#10;  <body>&#10;    <h1>Mi Landing Ameripass</h1>&#10;    {{DYNAMIC_FORM}}&#10;  </body>&#10;</html>"
          className="w-full h-96 bg-slate-950 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:border-amber-500 focus:outline-none resize-y"
          spellCheck={false}
        />
      ) : (
        <div className="w-full h-96 bg-white rounded-lg border border-slate-800 overflow-hidden">
          <iframe
            srcDoc={customHtml.replace('{{DYNAMIC_FORM}}', '<div style="padding:20px;background:#f3f4f6;border:2px dashed #6366f1;text-align:center;color:#4f46e5;font-family:sans-serif;font-weight:bold;">[FORMULARIO DINÁMICO SE MOSTRARÁ AQUÍ]</div>')}
            title="HTML Landing Preview"
            className="w-full h-full border-0"
          />
        </div>
      )}
    </div>
  );
};

export default CustomHtmlEditor;
