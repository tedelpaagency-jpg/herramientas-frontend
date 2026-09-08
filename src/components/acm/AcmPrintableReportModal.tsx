'use client';

import React from 'react';
import { AcmEstimation } from '../../types/acm';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend 
} from 'recharts';
import { Printer, Download, X, MapPin, CheckCircle2, User, Building2, Calendar } from 'lucide-react';
import acmService from '../../services/acmService';

interface AcmPrintableReportModalProps {
  estimation: AcmEstimation;
  onClose: () => void;
}

export default function AcmPrintableReportModal({ estimation, onClose }: AcmPrintableReportModalProps) {
  const calculations = estimation.calculations || {};
  const photos = estimation.photos || { fachada: [], social: [], humedas: [], anexos: [] };
  const amenities = estimation.amenities || {};

  const allPhotos = [
    ...(photos.fachada || []).map((p) => ({ ...p, cat: 'Fachada' })),
    ...(photos.social || []).map((p) => ({ ...p, cat: 'Social' })),
    ...(photos.humedas || []).map((p) => ({ ...p, cat: 'Zonas Húmedas' })),
    ...(photos.anexos || []).map((p) => ({ ...p, cat: 'Anexos' })),
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.max(0, val || 0));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex justify-center overflow-y-auto p-2 sm:p-6 print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto print:shadow-none print:w-full print:max-w-none print:my-0 print:rounded-none">
        
        {/* Modal Action Header (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#00a884]" />
            <h3 className="font-bold text-sm">Vista Previa e Impresión del Informe Pericial ACM</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => acmService.downloadPdf(estimation.id)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> PDF Servidor
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#00a884] hover:bg-[#009272] text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" /> Imprimir / Guardar PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-800 bg-white print:p-4 print:space-y-4">
          
          {/* Header Banner */}
          <div className="border-b-2 border-[#00a884] pb-4 flex justify-between items-end">
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight uppercase block">
                INFORME PERICIAL DE VALORACIÓN COMPARATIVA (ACM)
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Análisis técnico de mercado y tasación física estructurada
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-bold text-[#00a884] block">{estimation.code}</span>
              <span className="text-xs text-slate-400 font-medium">
                Fecha: {estimation.created_at ? new Date(estimation.created_at).toLocaleDateString('es-EC') : new Date().toLocaleDateString('es-EC')}
              </span>
            </div>
          </div>

          {/* Hero Result Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              {estimation.transaction_type === 'alquiler' ? 'Canon de Arriendo Sugerido (Mensual)' : 'Valor Comercial Sugerido de Mercado'}
            </span>
            <h2 className={`text-4xl font-black ${estimation.transaction_type === 'alquiler' ? 'text-blue-600' : 'text-[#00a884]'}`}>
              {estimation.transaction_type === 'alquiler'
                ? formatCurrency(estimation.suggested_rent)
                : formatCurrency(estimation.suggested_value)}
            </h2>
            <div className="text-xs text-slate-500 font-medium pt-1">
              Modalidad: <strong className="font-bold text-slate-800 uppercase">{estimation.transaction_type}</strong> • 
              Nivel de Confianza: <strong className="font-bold text-slate-800">{estimation.confidence || 'Alta'}</strong> • 
              Flexibilidad Negociación: <strong className="font-bold text-rose-500">-{estimation.margen_negociacion}%</strong>
            </div>
          </div>

          {/* 1. Datos del Cliente & Inmueble */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1.5 border-l-4 border-[#00a884] rounded-r">
              1. Identificación del Expediente & Solicitante
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-2">
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Solicitante:</span>
                <span className="font-bold text-slate-800">{estimation.client_name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Identificación:</span>
                <span className="font-semibold text-slate-700">{estimation.client_id || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Teléfono:</span>
                <span className="font-semibold text-slate-700">{estimation.client_phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Tipología:</span>
                <span className="font-semibold text-slate-700">{estimation.property_type}</span>
              </div>
              <div className="col-span-2 sm:col-span-4 border-t pt-2 mt-1">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Dirección Verificada:</span>
                <span className="font-medium text-slate-800">{estimation.location_str || 'No registrada'}</span>
              </div>
            </div>
          </div>

          {/* 2. Matriz Dimensional */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1.5 border-l-4 border-[#00a884] rounded-r">
              2. Matriz Dimensional & Avalúo Físico
            </h4>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2">Componente</th>
                  <th className="p-2">Área / Cantidad</th>
                  <th className="p-2">Valor Base ($/m²)</th>
                  <th className="p-2">Criterio / Ajuste</th>
                  <th className="p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-2 font-bold">Terreno / Suelo</td>
                  <td className="p-2">{estimation.area_terreno} m²</td>
                  <td className="p-2">${estimation.valor_terreno} / m²</td>
                  <td className="p-2">Valor base de zona</td>
                  <td className="p-2 text-right font-bold">${(estimation.area_terreno * estimation.valor_terreno).toLocaleString('es-EC')}</td>
                </tr>
                {estimation.property_type !== 'Terreno Urbano' && (
                  <tr>
                    <td className="p-2 font-bold">Construcción Útil</td>
                    <td className="p-2">{estimation.area_util} m²</td>
                    <td className="p-2">${estimation.precio_base} / m²</td>
                    <td className="p-2">Ross-Heidecke (Estado {estimation.estado_conservacion}/5)</td>
                    <td className="p-2 text-right font-bold">${(estimation.area_util * estimation.precio_base).toLocaleString('es-EC')}</td>
                  </tr>
                )}
                {estimation.num_parqueaderos > 0 && (
                  <tr>
                    <td className="p-2">Cocheras / Parqueaderos</td>
                    <td className="p-2">{estimation.num_parqueaderos} u.</td>
                    <td className="p-2">${estimation.valor_parqueadero} c/u</td>
                    <td className="p-2">Anexo directo</td>
                    <td className="p-2 text-right">${(estimation.num_parqueaderos * estimation.valor_parqueadero).toLocaleString('es-EC')}</td>
                  </tr>
                )}
                {estimation.bodegas > 0 && (
                  <tr>
                    <td className="p-2">Bodegas</td>
                    <td className="p-2">{estimation.bodegas} u.</td>
                    <td className="p-2">${estimation.valor_bodega} c/u</td>
                    <td className="p-2">Anexo directo</td>
                    <td className="p-2 text-right">${(estimation.bodegas * estimation.valor_bodega).toLocaleString('es-EC')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 3. Gráficos Recharts en Vivo */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1.5 border-l-4 border-[#00a884] rounded-r">
              3. Analítica Gráfica Pericial & Perfil de Mercado
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 rounded-xl p-4">
              
              {/* Waterfall Chart */}
              <div>
                <p className="text-[11px] font-bold text-slate-700 uppercase mb-2 text-center">Flujo de Mercado</p>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calculations.waterfallData || []} margin={{ top: 5, right: 5, left: -25, bottom: 25 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-30} textAnchor="end" />
                      <Tooltip formatter={(val: any) => formatCurrency(Math.abs(val))} />
                      <Bar dataKey="valor">
                        {(calculations.waterfallData || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.type === 'base' ? '#94a3b8' : entry.type === 'sub' ? '#f43f5e' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Composition Pie */}
              <div>
                <p className="text-[11px] font-bold text-slate-700 uppercase mb-2 text-center">Composición Física</p>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={calculations.pieData || []} innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                        {(calculations.pieData || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: any) => formatCurrency(val)} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '9px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar Score */}
              <div>
                <p className="text-[11px] font-bold text-slate-700 uppercase mb-2 text-center">Perfil Score del Inmueble</p>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="60%" data={calculations.radarData || []}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 8 }} />
                      <Radar name="Score" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>

          {/* 4. Amenities */}
          {Object.keys(amenities).some((k) => amenities[k]) && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1.5 border-l-4 border-[#00a884] rounded-r">
                4. Caracterización de Plusvalía (Amenities)
              </h4>
              <div className="flex flex-wrap gap-2 p-2">
                {Object.keys(amenities).map((k) => (
                  amenities[k] ? (
                    <span key={k} className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
                      ✔ {k}
                    </span>
                  ) : null
                ))}
              </div>
            </div>
          )}

          {/* 5. Dossier Fotográfico */}
          {allPhotos.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1.5 border-l-4 border-[#00a884] rounded-r">
                5. Expediente Fotográfico Registrado
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2">
                {allPhotos.map((p, idx) => (
                  <div key={idx} className="border rounded-lg overflow-hidden border-slate-200">
                    <img src={p.preview} alt="photo" className="w-full h-28 object-cover" />
                    <span className="block text-[10px] font-bold text-slate-500 text-center py-1 bg-slate-50 uppercase">{p.cat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Boxes */}
          <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs font-bold text-slate-700 print:pt-8">
            <div>
              <div className="border-t border-slate-300 w-48 mx-auto mb-1"></div>
              <span>Perito Valuador Técnico</span>
            </div>
            <div>
              <div className="border-t border-slate-300 w-48 mx-auto mb-1"></div>
              <span>Firma de Conformidad Cliente</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
