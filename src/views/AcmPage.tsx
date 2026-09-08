'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Plus, MapPin, ChevronRight, User, Home, Calculator, Search, CheckCircle2,
  Camera, Image as ImageIcon, Map as MapIcon, Crosshair,
  TrendingDown, TrendingUp, Maximize, Activity, Trash2,
  Download, Share2, Globe, FileBadge, PieChart as PieChartIcon, Target, FileText,
  Info, Layers, RefreshCw, Edit3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import { acmService } from '../services/acmService';
import { useTheme } from '../context/ThemeContext';
import { AcmEstimation, AcmZone } from '../types/acm';

const AcmZoneDrawerMap = dynamic(() => import('../components/acm/AcmZoneDrawerMap'), { ssr: false });
const AcmLocationPickerMap = dynamic(() => import('../components/acm/AcmLocationPickerMap'), { ssr: false });

export function AcmPage() {
  const [activeTab, setActiveTab] = useState<'estimations' | 'zones'>('estimations');
  const [view, setView] = useState<'list' | 'wizard'>('list');
  const [editingEstimation, setEditingEstimation] = useState<AcmEstimation | null>(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Tab Navigation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00a884] to-teal-500 text-white flex items-center justify-center shadow-md shadow-[#00a884]/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Módulo de Valoración ACM & Zonas Geoespaciales
            </h1>
            <p className="text-xs text-slate-500">
              Análisis comparativo de mercado, tasación pericial y delimitación de áreas por polígonos.
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setActiveTab('estimations'); setView('list'); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'estimations'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-[#00a884]" /> Expedientes ACM
          </button>
          <button
            onClick={() => setActiveTab('zones')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'zones'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-600" /> Zonas & Polígonos
          </button>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === 'estimations' ? (
        view === 'list' ? (
          <ACMListView
            onNew={() => { setEditingEstimation(null); setView('wizard'); }}
            onEdit={(item) => { setEditingEstimation(item); setView('wizard'); }}
          />
        ) : (
          <ACMWizard
            initialData={editingEstimation}
            onCancel={() => setView('list')}
            onSave={() => setView('list')}
          />
        )
      ) : (
        <AcmZonesView />
      )}
    </div>
  );
}

function ACMListView({ onNew, onEdit }: { onNew: () => void; onEdit: (item: AcmEstimation) => void }) {
  const [inspections, setInspections] = useState<AcmEstimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchEstimations = async () => {
    setLoading(true);
    try {
      const res = await acmService.getEstimations({ search });
      setInspections(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar los expedientes ACM');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimations();
  }, [search]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('¿Desea eliminar este expediente ACM?')) return;
    try {
      await acmService.deleteEstimation(id);
      toast.success('Expediente eliminado');
      fetchEstimations();
    } catch (err) {
      toast.error('Error al eliminar expediente');
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, id, dirección..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-[#00a884] outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={fetchEstimations}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            title="Actualizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onNew}
            className="px-4 py-2 bg-[#00a884] hover:bg-[#009272] text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm shadow-[#00a884]/20"
          >
            <Plus className="w-4 h-4" /> Nueva Valoración ACM
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Activity className="w-8 h-8 animate-spin mx-auto text-[#00a884] mb-2" />
          <p className="text-sm font-semibold">Cargando expedientes de tasación...</p>
        </div>
      ) : inspections.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Calculator className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">Sin expedientes registrados</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Haga clic en "Nueva Valoración ACM" para iniciar una tasación comparativa pericial.
          </p>
          <button
            onClick={onNew}
            className="mt-4 px-4 py-2 bg-[#00a884] text-white rounded-lg text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Crear Primer Expediente
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Código / Expediente</th>
                  <th className="p-3.5">Cliente / Propietario</th>
                  <th className="p-3.5">Ubicación / Dirección</th>
                  <th className="p-3.5">Tipología</th>
                  <th className="p-3.5">Área Útil / Terreno</th>
                  <th className="p-3.5">Valor Sugerido</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5">Fecha</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {inspections.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onEdit(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="p-3.5 font-bold font-mono text-[#00a884]">
                      {item.code}
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">
                      {item.client_name}
                      {item.client_phone && (
                        <span className="block text-[10px] text-slate-400 font-normal">{item.client_phone}</span>
                      )}
                    </td>
                    <td className="p-3.5 max-w-xs truncate">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-[#00a884] shrink-0" />
                        <span className="truncate">{item.location_str || 'Sin dirección registrada'}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-700">{item.property_type}</span>
                      <span className={`block text-[10px] font-bold uppercase ${item.transaction_type === 'alquiler' ? 'text-blue-600' : 'text-slate-400'}`}>
                        {item.transaction_type}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">
                      {item.area_util || item.area_terreno} m²
                    </td>
                    <td className="p-3.5 font-black text-sm text-[#00a884]">
                      ${(item.transaction_type === 'alquiler' ? item.suggested_rent : item.suggested_value)?.toLocaleString('es-EC')}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                          item.status === 'Completado'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : item.status === 'En Proceso'
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-blue-50 text-blue-600 border-blue-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px]">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); acmService.downloadPdf(item.id); }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Exportar Informe Pericial en PDF"
                      >
                        <FileBadge className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className="p-1.5 text-slate-500 hover:text-[#00a884] hover:bg-slate-100 rounded-lg transition-colors"
                        title="Ver / Editar Expediente"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar"
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
    </div>
  );
}

function ACMWizard({
  initialData,
  onCancel,
  onSave,
}: {
  initialData?: AcmEstimation | null;
  onCancel: () => void;
  onSave: () => void;
}) {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [zoneDetected, setZoneDetected] = useState<{ name: string; suggestedSuelo: number; suggestedConstruccion: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePhotoCategory, setActivePhotoCategory] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [availableZones, setAvailableZones] = useState<AcmZone[]>([]);

  const [photos, setPhotos] = useState<{ [key: string]: any[] }>({
    fachada: initialData?.photos?.fachada || [],
    social: initialData?.photos?.social || [],
    humedas: initialData?.photos?.humedas || [],
    anexos: initialData?.photos?.anexos || [],
  });

  const [formData, setFormData] = useState({
    clientName: initialData?.client_name || '',
    clientId: initialData?.client_id || '',
    clientPhone: initialData?.client_phone || '',
    propertyType: initialData?.property_type || 'Departamento',
    propertySubtype: initialData?.property_subtype || '',
    locationStr: initialData?.location_str || '',
    lat: initialData?.lat || null as number | null,
    lng: initialData?.lng || null as number | null,
    transactionType: initialData?.transaction_type || 'venta',
    capRate: initialData?.cap_rate ? String(initialData.cap_rate) : '6',
    areaTerreno: initialData?.area_terreno ? String(initialData.area_terreno) : '',
    valorTerreno: initialData?.valor_terreno ? String(initialData.valor_terreno) : '',
    areaUtil: initialData?.area_util ? String(initialData.area_util) : '',
    areaAbierta: initialData?.area_abierta ? String(initialData.area_abierta) : '',
    precioBase: initialData?.precio_base ? String(initialData.precio_base) : '',
    habitaciones: initialData?.habitaciones ? String(initialData.habitaciones) : '',
    banos: initialData?.banos ? String(initialData.banos) : '',
    numParqueaderos: initialData?.num_parqueaderos ? String(initialData.num_parqueaderos) : '0',
    valorParqueadero: initialData?.valor_parqueadero ? String(initialData.valor_parqueadero) : '7000',
    bodegas: initialData?.bodegas ? String(initialData.bodegas) : '0',
    valorBodega: initialData?.valor_bodega ? String(initialData.valor_bodega) : '3000',
    anoConstruccion: initialData?.ano_construccion || new Date().getFullYear(),
    estadoConservacion: initialData?.estado_conservacion ? String(initialData.estado_conservacion) : '3',
    tipoUbicacion: initialData?.tipo_ubicacion || 'medianero',
    margenNegociacion: initialData?.margen_negociacion ? String(initialData.margen_negociacion) : '8',
    plusvaliaZona: initialData?.plusvalia_zona ? String(initialData.plusvalia_zona) : '0',
    obsolescencia: initialData?.obsolescencia ? String(initialData.obsolescencia) : '0',
    amenities: initialData?.amenities || {
      seguridad: false, piscina: false, elevador: false, amoblado: false,
      garaje: false, bbq: false, aire: false, terraza: false,
    },
  });

  // Fetch zones matching the current expediente transaction_type (venta / alquiler)
  useEffect(() => {
    acmService.getZones({ transaction_type: formData.transactionType })
      .then((res) => setAvailableZones(res.data || []))
      .catch(() => {});
  }, [formData.transactionType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [name]: checked },
    }));
  };

  const triggerFileInput = (category: string) => {
    setActivePhotoCategory(category);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !activePhotoCategory) return;
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7),
    }));
    setPhotos((prev) => ({
      ...prev,
      [activePhotoCategory]: [...(prev[activePhotoCategory] || []), ...newPhotos],
    }));
    e.target.value = '';
  };

  const removePhoto = (category: string, photoId: string) => {
    setPhotos((prev) => ({
      ...prev,
      [category]: (prev[category] || []).filter((p) => p.id !== photoId),
    }));
  };

  const handleGetLocationAndDetectZone = async () => {
    setIsLocating(true);
    const targetLat = formData.lat || -1.0227;
    const targetLng = formData.lng || -79.4623;

    try {
      setFormData((prev) => ({
        ...prev,
        lat: targetLat,
        lng: targetLng,
        locationStr: prev.locationStr || 'Av. Walter Andrade, Quevedo, Los Ríos',
      }));

      const res = await acmService.detectZone(targetLat, targetLng, formData.transactionType);
      if (res.detected && res.zone) {
        setZoneDetected({
          name: res.zone.name,
          suggestedSuelo: res.zone.suggestedSuelo,
          suggestedConstruccion: res.zone.suggestedConstruccion,
        });
        toast.success(`Zona detectada: ${res.zone.name}`);
      } else {
        toast.error('No se encontró una zona delimitada en estas coordenadas. Puede ingresar los valores manualmente.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al detectar zona geoespacial');
    } finally {
      setIsLocating(false);
    }
  };

  const applyZoneValues = () => {
    if (zoneDetected) {
      setFormData((prev) => ({
        ...prev,
        valorTerreno: zoneDetected.suggestedSuelo.toString(),
        precioBase: zoneDetected.suggestedConstruccion.toString(),
      }));
      setZoneDetected(null);
      toast.success('Valores sugeridos aplicados');
    }
  };

  const calculations = useMemo(() => {
    const isTerrain = formData.propertyType === 'Terreno Urbano';
    const isAlquiler = formData.transactionType === 'alquiler';

    const areaT = Number(formData.areaTerreno) || 0;
    const baseT = Number(formData.valorTerreno) || 0;
    const areaU = Number(formData.areaUtil) || 0;
    const areaA = Number(formData.areaAbierta) || 0;
    const baseM2 = Number(formData.precioBase) || 0;

    const antiguedad = new Date().getFullYear() - (Number(formData.anoConstruccion) || new Date().getFullYear());
    const estado = Number(formData.estadoConservacion) || 3;

    const valorSuelo = areaT * baseT;

    let valorFisicoBrutoConstruccion = 0;
    let montoDepreciacion = 0;
    let valorFisicoNetoConstruccion = 0;
    let parqueaderos = 0;
    let valorBodegas = 0;
    let factorAmenities = 0;

    if (!isTerrain) {
      const valorBaseCubierto = areaU * baseM2;
      const factorAreaAbierta = 0.35;
      const valorAreasAbiertas = areaA * (baseM2 * factorAreaAbierta);
      valorFisicoBrutoConstruccion = valorBaseCubierto + valorAreasAbiertas;

      let coeficienteEstado = 0.15;
      switch (estado) {
        case 5: coeficienteEstado = 0.0; break;
        case 4: coeficienteEstado = 0.05; break;
        case 3: coeficienteEstado = 0.15; break;
        case 2: coeficienteEstado = 0.35; break;
        case 1: coeficienteEstado = 0.60; break;
        default: coeficienteEstado = 0.15;
      }

      const vidaUtil = 70;
      let factorEdad = 1 - antiguedad / vidaUtil;
      factorEdad = Math.max(factorEdad, 0.2);

      const porcentajeDepreciacion = 1 - factorEdad * (1 - coeficienteEstado);
      montoDepreciacion = valorFisicoBrutoConstruccion * porcentajeDepreciacion;
      valorFisicoNetoConstruccion = valorFisicoBrutoConstruccion - montoDepreciacion;

      parqueaderos = (Number(formData.numParqueaderos) || 0) * (Number(formData.valorParqueadero) || 0);
      valorBodegas = (Number(formData.bodegas) || 0) * (Number(formData.valorBodega) || 0);

      if (formData.amenities.seguridad) factorAmenities += 0.02;
      if (formData.amenities.piscina) factorAmenities += 0.03;
      if (formData.amenities.elevador) factorAmenities += 0.04;
      if (formData.amenities.terraza) factorAmenities += 0.01;
    }

    const subtotalFisicoNeto = valorSuelo + valorFisicoNetoConstruccion + parqueaderos + valorBodegas;

    let factorUbicacion = 0;
    if (formData.tipoUbicacion === 'esquinero') factorUbicacion = 0.05;
    if (formData.tipoUbicacion === 'interior') factorUbicacion = -0.05;

    const plusvaliaManual = (Number(formData.plusvaliaZona) || 0) / 100;
    const obsolescenciaManual = (Number(formData.obsolescencia) || 0) / 100;

    const factorMercadoTotal = factorUbicacion + factorAmenities + plusvaliaManual - obsolescenciaManual;
    const ajusteMercado = subtotalFisicoNeto * factorMercadoTotal;

    const valorMercadoBruto = subtotalFisicoNeto + ajusteMercado;

    const negociacion = (Number(formData.margenNegociacion) || 0) / 100;
    const montoNegociacion = valorMercadoBruto * negociacion;
    const valorComercialSugerido = valorMercadoBruto - montoNegociacion;

    const capRate = Number(formData.capRate) || 0;
    const valorAlquilerMensual = (valorComercialSugerido * (capRate / 100)) / 12;

    const waterfallData = [
      { name: 'Suelo Base', valor: valorSuelo, type: 'base' },
      ...(isTerrain ? [] : [
        { name: 'Construcción', valor: valorFisicoBrutoConstruccion, type: 'add' },
        { name: 'Depreciación', valor: -montoDepreciacion, type: 'sub' },
        { name: 'Anexos', valor: parqueaderos + valorBodegas, type: 'add' },
      ]),
      { name: 'Plusvalía', valor: ajusteMercado, type: ajusteMercado >= 0 ? 'add' : 'sub' },
      { name: 'Liquidez', valor: -montoNegociacion, type: 'sub' },
    ].filter((d) => d.valor !== 0);

    const pieData = [
      { name: 'Suelo', value: valorSuelo, color: '#94a3b8' },
      ...(isTerrain ? [] : [
        { name: 'Construcción', value: valorFisicoNetoConstruccion, color: '#3b82f6' },
        { name: 'Anexos', value: parqueaderos + valorBodegas, color: '#0ea5e9' },
      ]),
    ].filter((d) => d.value > 0);

    const scoreArea = Math.min(((isTerrain ? areaT : areaU + areaA) / (isTerrain ? 1000 : 250)) * 100, 100);
    const scoreConservacion = isTerrain ? 100 : Math.max(0, (estado / 5) * 100 - antiguedad);
    const scoreUbicacion = Math.min(Math.max(70 + factorUbicacion * 100 + plusvaliaManual * 100, 0), 100);
    const scoreLiquidez = Math.max(100 - negociacion * 100 * 2, 0);

    const radarData = [
      ...(isTerrain ? [] : [{ subject: 'Conservación', score: scoreConservacion, fullMark: 100 }]),
      { subject: 'Ubicación', score: scoreUbicacion, fullMark: 100 },
      { subject: 'Liquidez', score: scoreLiquidez, fullMark: 100 },
      { subject: 'Tamaño', score: scoreArea, fullMark: 100 },
    ];

    return {
      isCalculable: isTerrain ? areaT > 0 && baseT > 0 : (areaU > 0 && baseM2 > 0) || (areaT > 0 && baseT > 0),
      isTerrain, isAlquiler,
      valorFisicoBruto: valorSuelo + valorFisicoBrutoConstruccion,
      montoDepreciacion,
      anexos: parqueaderos + valorBodegas,
      ajusteMercado,
      montoNegociacion,
      valorComercialSugerido,
      valorAlquilerMensual,
      waterfallData, pieData, radarData,
    };
  }, [formData]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.max(0, val));
  };

  const handleSaveEstimation = async () => {
    if (!formData.clientName) {
      toast.error('Ingrese el nombre del cliente');
      return;
    }
    setSaving(true);
    try {
      const payload: Partial<AcmEstimation> = {
        client_name: formData.clientName,
        client_id: formData.clientId,
        client_phone: formData.clientPhone,
        property_type: formData.propertyType,
        property_subtype: formData.propertySubtype,
        transaction_type: formData.transactionType as 'venta' | 'alquiler',
        location_str: formData.locationStr,
        lat: formData.lat,
        lng: formData.lng,
        area_terreno: Number(formData.areaTerreno) || 0,
        valor_terreno: Number(formData.valorTerreno) || 0,
        area_util: Number(formData.areaUtil) || 0,
        area_abierta: Number(formData.areaAbierta) || 0,
        precio_base: Number(formData.precioBase) || 0,
        habitaciones: Number(formData.habitaciones) || 0,
        banos: Number(formData.banos) || 0,
        num_parqueaderos: Number(formData.numParqueaderos) || 0,
        valor_parqueadero: Number(formData.valorParqueadero) || 0,
        bodegas: Number(formData.bodegas) || 0,
        valor_bodega: Number(formData.valorBodega) || 0,
        ano_construccion: Number(formData.anoConstruccion) || null,
        estado_conservacion: Number(formData.estadoConservacion) || 3,
        tipo_ubicacion: formData.tipoUbicacion,
        margen_negociacion: Number(formData.margenNegociacion) || 0,
        plusvalia_zona: Number(formData.plusvaliaZona) || 0,
        obsolescencia: Number(formData.obsolescencia) || 0,
        cap_rate: Number(formData.capRate) || 6,
        amenities: formData.amenities,
        photos: {
          fachada: photos.fachada.map((p) => ({ id: p.id, preview: p.preview })),
          social: photos.social.map((p) => ({ id: p.id, preview: p.preview })),
          humedas: photos.humedas.map((p) => ({ id: p.id, preview: p.preview })),
          anexos: photos.anexos.map((p) => ({ id: p.id, preview: p.preview })),
        },
        calculations: calculations,
        suggested_value: calculations.valorComercialSugerido,
        suggested_rent: calculations.valorAlquilerMensual,
        status: step === 3 ? 'Completado' : 'En Proceso',
      };

      if (initialData?.id) {
        await acmService.updateEstimation(initialData.id, payload);
        toast.success('Expediente actualizado exitosamente');
      } else {
        await acmService.createEstimation(payload);
        toast.success('Expediente guardado exitosamente');
      }
      onSave();
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar el expediente ACM');
    } finally {
      setSaving(false);
    }
  };

  const PhotoGalleryCard = ({ id, title, subtitle, icon: Icon }: any) => {
    const categoryPhotos = photos[id] || [];
    const hasPhotos = categoryPhotos.length > 0;

    return (
      <div
        className={`border rounded-xl overflow-hidden transition-all flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm ${
          hasPhotos ? 'border-slate-200' : 'border-dashed border-slate-300 hover:bg-slate-50 cursor-pointer hover:border-[#00a884]/50'
        }`}
      >
        <div
          className={`p-4 flex items-center justify-between ${
            !hasPhotos ? 'h-full flex-col justify-center text-center py-8' : 'border-b border-slate-100 py-3 bg-slate-50'
          }`}
          onClick={() => !hasPhotos && triggerFileInput(id)}
        >
          <div className={`flex ${hasPhotos ? 'items-center gap-3' : 'flex-col items-center'}`}>
            <div
              className={`rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm ${
                hasPhotos ? 'w-8 h-8' : 'w-12 h-12 mb-3'
              }`}
            >
              <Icon className={`w-5 h-5 ${hasPhotos ? 'text-[#00a884]' : 'text-slate-400'}`} />
            </div>
            <div className={!hasPhotos ? 'text-center' : ''}>
              <p className="font-semibold text-slate-800 text-xs">{title}</p>
              {!hasPhotos && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {hasPhotos && (
            <button
              onClick={(e) => { e.stopPropagation(); triggerFileInput(id); }}
              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#00a884]"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {hasPhotos && (
          <div className="p-3 bg-white dark:bg-slate-900 min-h-[90px]">
            <div className="flex flex-wrap gap-2">
              {categoryPhotos.map((photo) => (
                <div key={photo.id} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  <img src={photo.preview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(id, photo.id)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep1 = () => {
    const categoriesWithPhotos = Object.values(photos).filter((arr) => arr.length > 0).length;

    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-20">
        <input type="file" multiple accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

        {/* Identificación Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#00a884]" />
              <h3 className="text-base font-bold text-slate-800">Identificación del Expediente</h3>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
              <button
                onClick={() => setFormData((prev) => ({ ...prev, transactionType: 'venta' }))}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  formData.transactionType === 'venta' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Avalúo para Venta
              </button>
              <button
                onClick={() => setFormData((prev) => ({ ...prev, transactionType: 'alquiler' }))}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  formData.transactionType === 'alquiler' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Canon de Alquiler
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Propietario / Solicitante *</label>
              <input
                type="text" name="clientName" value={formData.clientName} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a884] outline-none"
                placeholder="Nombre completo del cliente"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Identificación</label>
              <input
                type="text" name="clientId" value={formData.clientId} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a884] outline-none"
                placeholder="C.I. / RUC"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipología Principal</label>
              <select
                name="propertyType" value={formData.propertyType} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a884] outline-none font-medium"
              >
                <option>Departamento</option>
                <option>Casa Independiente</option>
                <option>Terreno Urbano</option>
                <option>Local Comercial</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Subtipología</label>
              <input
                type="text" name="propertySubtype" value={formData.propertySubtype} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a884] outline-none"
                placeholder="Ej. Duplex, Esquinero"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Teléfono Contacto</label>
              <input
                type="text" name="clientPhone" value={formData.clientPhone} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a884] outline-none"
                placeholder="09..."
              />
            </div>
          </div>
        </div>

        {/* Geoespacial Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-[#00a884]" />
              <h3 className="text-base font-bold text-slate-800">Cruce de Zonificación Geoespacial</h3>
            </div>
            <button
              onClick={handleGetLocationAndDetectZone} disabled={isLocating}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 border border-slate-200"
            >
              {isLocating ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
              Capturar GPS y Validar Zona
            </button>
          </div>

          {zoneDetected && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900">Ubicación dentro de zona delimitada: {zoneDetected.name}</h4>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Valor referencial: <strong className="font-bold">${zoneDetected.suggestedSuelo}/m² (Suelo)</strong> y <strong className="font-bold">${zoneDetected.suggestedConstruccion}/m² (Construcción)</strong>.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto shrink-0">
                <button onClick={() => setZoneDetected(null)} className="px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100 rounded-lg">
                  Ignorar
                </button>
                <button onClick={applyZoneValues} className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-sm">
                  Aplicar Valores Base
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase">Dirección Verificada</label>
              <textarea
                name="locationStr" value={formData.locationStr} onChange={handleChange} rows={3}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a884] outline-none resize-none"
                placeholder="Referencia exacta para la pericia..."
              />
              {formData.lat && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Coordenadas Fijadas
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-100">
                    {formData.lat.toFixed(5)}, {formData.lng?.toFixed(5)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                Ubicación Manual en Mapa (Haz clic o arrastra el pin)
              </label>
              <AcmLocationPickerMap
                lat={formData.lat}
                lng={formData.lng}
                zones={availableZones}
                onLocationChange={(newLat, newLng) => {
                  setFormData((prev) => ({
                    ...prev,
                    lat: newLat,
                    lng: newLng,
                  }));
                  // Auto-detect zone when marker is placed manually
                  acmService.detectZone(newLat, newLng, formData.transactionType).then((res) => {
                    if (res.detected && res.zone) {
                      setZoneDetected({
                        name: res.zone.name,
                        suggestedSuelo: res.zone.suggestedSuelo,
                        suggestedConstruccion: res.zone.suggestedConstruccion,
                      });
                      toast.success(`Zona detectada: ${res.zone.name}`);
                    } else {
                      setZoneDetected(null);
                    }
                  }).catch(() => {});
                }}
              />
            </div>
          </div>
        </div>

        {/* Fotográfico Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#00a884]" />
              <h3 className="text-base font-bold text-slate-800">Expediente Fotográfico Pericial</h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
              {categoriesWithPhotos}/{formData.propertyType === 'Terreno Urbano' ? 2 : 4} Secciones Activas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PhotoGalleryCard id="fachada" title={formData.propertyType === 'Terreno Urbano' ? 'Frente y Vías' : 'Fachada y Entorno'} subtitle="Vista exterior" icon={Home} />
            {formData.propertyType !== 'Terreno Urbano' && (
              <>
                <PhotoGalleryCard id="social" title="Áreas Sociales" subtitle="Salas, comedores" icon={ImageIcon} />
                <PhotoGalleryCard id="humedas" title="Zonas Húmedas" subtitle="Cocinas, baños" icon={Activity} />
              </>
            )}
            <PhotoGalleryCard id="anexos" title="Anexos / Extras" subtitle="Parqueaderos, linderos" icon={Plus} />
          </div>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="flex flex-col xl:flex-row gap-6 max-w-[1400px] mx-auto pb-20">
        {/* Left Column: Inputs Form */}
        <div className="flex-1 space-y-6">
          {/* Dimensional Data */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Maximize className="w-4 h-4 text-[#00a884]" />
                {calculations.isTerrain ? 'Datos Dimensionales del Terreno' : 'Datos Dimensionales y Distribución'}
              </h3>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Área Terreno (m²)</label>
                <input type="number" name="areaTerreno" value={formData.areaTerreno} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none" placeholder="0" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Valor Suelo ($/m²)</label>
                <input type="number" name="valorTerreno" value={formData.valorTerreno} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none" placeholder="0" />
              </div>

              {!calculations.isTerrain && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-600 mb-1 uppercase">Área Construcción (m²)</label>
                    <input type="number" name="areaUtil" value={formData.areaUtil} onChange={handleChange} className="w-full bg-blue-50/50 border border-blue-200 rounded-lg p-2 text-xs font-bold outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-600 mb-1 uppercase">Valor Construcción ($/m²)</label>
                    <input type="number" name="precioBase" value={formData.precioBase} onChange={handleChange} className="w-full bg-blue-50/50 border border-blue-200 rounded-lg p-2 text-xs font-bold outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Áreas Abiertas (m²)</label>
                    <input type="number" name="areaAbierta" value={formData.areaAbierta} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none" placeholder="Patios..." />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Habitaciones</label>
                    <input type="number" name="habitaciones" value={formData.habitaciones} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Baños</label>
                    <input type="number" name="banos" value={formData.banos} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none" placeholder="0" />
                  </div>

                  <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Cocheras</label>
                      <input type="number" name="numParqueaderos" value={formData.numParqueaderos} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Valor C/U ($)</label>
                      <input type="number" name="valorParqueadero" value={formData.valorParqueadero} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Bodegas</label>
                      <input type="number" name="bodegas" value={formData.bodegas} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Valor C/U ($)</label>
                      <input type="number" name="valorBodega" value={formData.valorBodega} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Homogenization Factors */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-500" /> Factores de Homogeneización Pericial
              </h3>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!calculations.isTerrain && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Año de Construcción</label>
                    <input type="number" name="anoConstruccion" value={formData.anoConstruccion} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Conservación (Ross-Heidecke)</label>
                    <select name="estadoConservacion" value={formData.estadoConservacion} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none">
                      <option value="5">Excelente (Nuevo/Remodelado)</option>
                      <option value="4">Muy Bueno (Poco uso)</option>
                      <option value="3">Bueno/Normal (Mantenimiento regular)</option>
                      <option value="2">Regular (Reparaciones medias)</option>
                      <option value="1">Malo (Reparaciones graves)</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Ubicación / Topografía</label>
                <select name="tipoUbicacion" value={formData.tipoUbicacion} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none">
                  <option value="esquinero">Esquinero / Preferencial (Suma valor)</option>
                  <option value="medianero">Medianero / Normal (Neutro)</option>
                  <option value="interior">Interior / Irregular (Resta valor)</option>
                </select>
              </div>

              <div>
                <label className="flex justify-between text-[11px] font-bold text-slate-500 mb-1 uppercase">
                  <span>Negociación (Castigo)</span>
                  <span className="text-rose-500">-{formData.margenNegociacion}%</span>
                </label>
                <input type="range" name="margenNegociacion" min="0" max="25" value={formData.margenNegociacion} onChange={handleChange} className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg cursor-pointer" />
              </div>

              {calculations.isAlquiler && (
                <div className="sm:col-span-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <label className="flex justify-between text-xs font-bold text-blue-700 mb-2 uppercase">
                    <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/> Cap Rate Anual</span>
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded">{formData.capRate}%</span>
                  </label>
                  <input type="range" name="capRate" min="2" max="15" step="0.5" value={formData.capRate} onChange={handleChange} className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer" />
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {!calculations.isTerrain && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Servicios y Plusvalía (Amenities)
                </h3>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'seguridad', label: 'Seguridad Privada' },
                  { id: 'piscina', label: 'Piscina / Áreas' },
                  { id: 'elevador', label: 'Ascensores' },
                  { id: 'amoblado', label: 'Amoblado' },
                  { id: 'garaje', label: 'Garaje Techado' },
                  { id: 'bbq', label: 'Zona BBQ' },
                  { id: 'aire', label: 'Climatización' },
                  { id: 'terraza', label: 'Terraza Privada' },
                ].map((amenity) => (
                  <label key={amenity.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox" name={amenity.id} checked={formData.amenities[amenity.id]} onChange={handleCheckboxChange}
                      className="w-4 h-4 accent-[#00a884] rounded"
                    />
                    <span className="text-xs font-medium text-slate-700">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recharts Analytics Panel */}
        <div className="w-full xl:w-[400px] shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm sticky top-6 space-y-4 p-5">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00a884]" /> Analítica Pericial
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {formData.transactionType}
              </span>
            </div>

            {calculations.isCalculable ? (
              <div className="space-y-4">
                <div className="text-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {calculations.isAlquiler ? 'Canon de Arriendo Sugerido' : 'Valor Comercial Sugerido'}
                  </p>
                  <h2 className={`text-3xl font-black ${calculations.isAlquiler ? 'text-blue-600' : 'text-[#00a884]'}`}>
                    {calculations.isAlquiler
                      ? formatCurrency(calculations.valorAlquilerMensual)
                      : formatCurrency(calculations.valorComercialSugerido)}
                  </h2>
                </div>

                {/* Waterfall Chart */}
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-[11px] font-bold text-slate-700 uppercase mb-2">Flujo de Valor de Mercado</p>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={calculations.waterfallData} margin={{ top: 5, right: 5, left: -25, bottom: 20 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: isDark ? '#94a3b8' : '#64748b' }} angle={-30} textAnchor="end" />
                        <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', color: isDark ? '#f8fafc' : '#0f172a', borderRadius: '8px' }} formatter={(val: any) => formatCurrency(Math.abs(val))} />
                        <Bar dataKey="valor" radius={[3, 3, 0, 0]}>
                          {calculations.waterfallData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.type === 'base' ? '#94a3b8' : entry.type === 'sub' ? '#f43f5e' : '#10b981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Composition Pie Chart */}
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-[11px] font-bold text-slate-700 uppercase mb-2">Composición Física</p>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={calculations.pieData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                          {calculations.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', color: isDark ? '#f8fafc' : '#0f172a', borderRadius: '8px' }} formatter={(val: any) => formatCurrency(val)} />
                        <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ fontSize: '10px', color: isDark ? '#94a3b8' : '#475569' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Score Radar Chart */}
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-[11px] font-bold text-slate-700 uppercase mb-2">Perfil del Inmueble (Score)</p>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={calculations.radarData}>
                        <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 9 }} />
                        <Radar name="Score" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400">
                <Calculator className="w-8 h-8 mb-2 stroke-1" />
                <p className="text-xs font-bold text-slate-600">Simulador en Espera</p>
                <p className="text-[11px] text-slate-400 mt-1">Ingrese las áreas y valores base para proyectar la analítica.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
        <button onClick={onCancel} className="hover:text-[#00a884]">ACM</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800">Expediente Pericial</span>
      </div>

      {/* Stepper Graphic */}
      <div className="flex items-center justify-between w-full max-w-xl mx-auto mb-8">
        {[
          { num: 1, title: 'Inspección', desc: 'Identificación y fotos' },
          { num: 2, title: 'Valuación', desc: 'Simulador y gráficos' },
          { num: 3, title: 'Publicación', desc: 'Informe final' },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center cursor-pointer" onClick={() => step > s.num && setStep(s.num)}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
              step === s.num ? 'bg-white dark:bg-slate-800 border-[#00a884] text-[#00a884] shadow-md' :
              step > s.num ? 'bg-[#00a884] border-[#00a884] text-white' :
              'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
            }`}>
              {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
            </div>
            <span className="text-xs font-bold mt-2 text-slate-800">{s.title}</span>
          </div>
        ))}
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && (
        <div className="max-w-2xl mx-auto text-center space-y-6 py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">¡Expediente Listo para Guardar!</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            El modelo pericial ha calculado el valor comercial en <strong>{formatCurrency(calculations.valorComercialSugerido)}</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button onClick={handleSaveEstimation} disabled={saving} className="px-6 py-2.5 bg-[#00a884] hover:bg-[#009272] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md">
              <Download className="w-4 h-4" /> Guardar Expediente
            </button>
            {initialData?.id && (
              <button onClick={() => acmService.downloadPdf(initialData.id)} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md">
                <FileBadge className="w-4 h-4" /> Exportar Informe PDF
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center z-50 md:pl-64 shadow-lg">
        <button onClick={() => (step === 1 ? onCancel() : setStep(step - 1))} className="px-5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold">
          {step === 1 ? 'Cancelar' : 'Anterior'}
        </button>

        <div className="flex items-center gap-3">
          {initialData?.id && (
            <button
              onClick={() => acmService.downloadPdf(initialData.id)}
              className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileBadge className="w-4 h-4" /> PDF
            </button>
          )}
          <button
            onClick={step < 3 ? () => setStep(step + 1) : handleSaveEstimation}
            disabled={saving}
            className="px-6 py-2 bg-[#00a884] hover:bg-[#009272] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
          >
            {saving ? 'Guardando...' : step === 1 ? 'Continuar a Valuación' : step === 2 ? 'Finalizar Análisis' : 'Guardar Expediente'}
            {step < 3 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function AcmZonesView() {
  const [zones, setZones] = useState<AcmZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTransactionType, setFilterTransactionType] = useState<'all' | 'venta' | 'alquiler'>('all');

  // Zone creation form
  const [name, setName] = useState('');
  const [transactionType, setTransactionType] = useState<'venta' | 'alquiler'>('venta');
  const [suggestedSuelo, setSuggestedSuelo] = useState('');
  const [suggestedConstruccion, setSuggestedConstruccion] = useState('');
  const [color, setColor] = useState('#00a884');
  const [description, setDescription] = useState('');
  const [currentVertices, setCurrentVertices] = useState<Array<{ lat: number; lng: number }>>([]);
  const [creating, setCreating] = useState(false);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await acmService.getZones({
        search,
        transaction_type: filterTransactionType !== 'all' ? filterTransactionType : undefined,
      });
      setZones(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar zonas de valoración');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, [search, filterTransactionType]);

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Ingrese el nombre de la zona');
    if (currentVertices.length < 3) return toast.error('Debe marcar al menos 3 vértices en el mapa para delimitar el polígono');
    if (!suggestedSuelo || !suggestedConstruccion) return toast.error('Ingrese los valores sugeridos por m²');

    setCreating(true);
    try {
      await acmService.createZone({
        name,
        transaction_type: transactionType,
        suggested_suelo: Number(suggestedSuelo),
        suggested_construccion: Number(suggestedConstruccion),
        coordinates: currentVertices,
        color,
        description,
      });

      toast.success(`Zona para ${transactionType.toUpperCase()} registrada exitosamente`);
      setName('');
      setSuggestedSuelo('');
      setSuggestedConstruccion('');
      setDescription('');
      setCurrentVertices([]);
      fetchZones();
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar zona');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteZone = async (id: number) => {
    if (!confirm('¿Desea eliminar esta zona de valoración?')) return;
    try {
      await acmService.deleteZone(id);
      toast.success('Zona eliminada');
      fetchZones();
    } catch (err) {
      toast.error('Error al eliminar zona');
    }
  };

  return (
    <div className="space-y-6">
      {/* Interactive Map & Zone Delimitation Form */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">Delimitador de Zonas por Polígonos</h2>
          </div>
          <span className="text-xs text-slate-500">
            Haz clic en el mapa para definir la forma de la zona.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <AcmZoneDrawerMap
              zones={zones}
              currentVertices={currentVertices}
              onVerticesChange={setCurrentVertices}
              selectedColor={color}
              isDrawing={true}
            />
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium">
                Vértices activos: <strong className="text-slate-800">{currentVertices.length}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentVertices((prev) => prev.slice(0, -1))}
                  disabled={currentVertices.length === 0}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  Deshacer Último Punto
                </button>
                <button
                  onClick={() => setCurrentVertices([])}
                  disabled={currentVertices.length === 0}
                  className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded hover:bg-rose-100 disabled:opacity-50"
                >
                  Limpiar Polígono
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateZone} className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase">Parámetros de la Zona</h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Modalidad de Zona *</label>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
                <button
                  type="button"
                  onClick={() => { setTransactionType('venta'); setColor('#00a884'); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    transactionType === 'venta' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Zona Venta
                </button>
                <button
                  type="button"
                  onClick={() => { setTransactionType('alquiler'); setColor('#2563eb'); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    transactionType === 'alquiler' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Zona Alquiler
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Nombre de la Zona *</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 font-semibold outline-none"
                placeholder="Ej. Zona Comercial Norte"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Suelo ($/m²) *</label>
                <input
                  type="number" value={suggestedSuelo} onChange={(e) => setSuggestedSuelo(e.target.value)} required
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-bold text-emerald-600 outline-none"
                  placeholder="250"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Construcción ($/m²) *</label>
                <input
                  type="number" value={suggestedConstruccion} onChange={(e) => setSuggestedConstruccion(e.target.value)} required
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-bold text-blue-600 outline-none"
                  placeholder="750"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Color Identificador</label>
              <div className="flex items-center gap-3">
                <input
                  type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                />
                <span className="text-xs font-mono font-semibold text-slate-600">{color}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Descripción / Observaciones</label>
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 outline-none resize-none"
                placeholder="Detalles sobre sectorización..."
              />
            </div>

            <button
              type="submit" disabled={creating}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Guardar Zona Delimitada
            </button>
          </form>
        </div>
      </div>

      {/* Zones List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">Zonas Registradas ({zones.length})</h3>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setFilterTransactionType('all')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterTransactionType === 'all' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterTransactionType('venta')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterTransactionType === 'venta' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Venta
              </button>
              <button
                onClick={() => setFilterTransactionType('alquiler')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterTransactionType === 'alquiler' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Alquiler
              </button>
            </div>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar zona..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Cargando zonas...</div>
        ) : zones.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-medium">
            No existen zonas de valoración delimitadas para esta modalidad.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Zona</th>
                  <th className="p-3">Modalidad</th>
                  <th className="p-3">Suelo ($/m²)</th>
                  <th className="p-3">Construcción ($/m²)</th>
                  <th className="p-3">Vértices</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: zone.color || '#3b82f6' }}></span>
                      {zone.name}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                          zone.transaction_type === 'alquiler'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {zone.transaction_type || 'venta'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-emerald-600">${zone.suggested_suelo} / m²</td>
                    <td className="p-3 font-bold text-blue-600">${zone.suggested_construccion} / m²</td>
                    <td className="p-3">{zone.coordinates?.length || 0} puntos</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteZone(zone.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AcmPage;
