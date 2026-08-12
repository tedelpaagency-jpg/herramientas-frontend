import React, { useEffect, useState } from 'react';
import { W8Form } from '../types';
import w8Service from '../services/w8Service';
import { FileText, Download, Plus } from 'lucide-react';

export const W8FormsPage: React.FC = () => {
  const [forms, setForms] = useState<W8Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    w8Service.getW8Forms().then(setForms).finally(() => setIsLoading(false));
  }, []);

  const handleDownloadPdf = (id: number) => {
    window.open(w8Service.getPdfUrl(id), '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <FileText className="w-7 h-7 text-sky-500" />
            <span>Formularios Fiscales W-8BEN</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Generación y descarga de PDF vía `/v1/w8-forms`</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center"><div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {forms.map((f) => (
            <div key={f.id} className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-base">{f.applicant_name}</h3>
                <p className="text-xs text-slate-400">TIN/Tax ID: {f.tax_id}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                  {f.status || 'Completado'}
                </span>
              </div>
              <button
                onClick={() => handleDownloadPdf(f.id)}
                className="p-3 rounded-2xl bg-sky-600/20 text-sky-400 hover:bg-sky-600 hover:text-white transition-all"
                title="Descargar PDF"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default W8FormsPage;
