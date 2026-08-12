import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Building2, ArrowLeft, ImagePlus, Upload, Trash2, GripVertical,
  Save, X, CheckSquare, Square, Loader2
} from 'lucide-react';
import estateService from '../services/estateService';
import { Estate } from '../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const AMENITIES = [
  { key: 'air_condition', label: 'Aire acondicionado' },
  { key: 'cable_tv', label: 'TV con cable' },
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'fire_detector', label: 'Detector de humo/CO' },
  { key: 'cameras', label: 'Cámaras de seguridad' },
  { key: 'security', label: 'Seguridad' },
  { key: 'disabled_access', label: 'Acceso discapacitados' },
  { key: 'elevator', label: 'Elevador' },
  { key: 'fence', label: 'Cerca' },
  { key: 'garden', label: 'Jardín' },
  { key: 'swimming_Pool', label: 'Piscina' },
  { key: 'terraza', label: 'Terraza' },
  { key: 'furnishing', label: 'Amoblado' },
  { key: 'garage', label: 'Garaje' },
  { key: 'parking', label: 'Parqueadero' },
  { key: 'heating', label: 'Calefacción' },
  { key: 'intercom', label: 'Intercomunicador' },
  { key: 'BBQ', label: 'Área BBQ' },
  { key: 'electric_door', label: 'Portón eléctrico' },
  { key: 'electric_fiance', label: 'Cerco eléctrico' },
  { key: 'meeting_room', label: 'Sala de reuniones' },
];

function MapPicker({ location, onLocationChange }: { location: string, onLocationChange: (val: string) => void }) {
  const defaultPosition = location && location.includes(',') && !location.includes('http')
    ? (location.split(',').map(coord => parseFloat(coord.trim())) as [number, number])
    : [-1.025452, -79.461677] as [number, number];

  const [position, setPosition] = useState<[number, number]>(defaultPosition);

  const markerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationChange(`${lat.toFixed(6)},${lng.toFixed(6)}`);
      }
    });
    return null;
  };

  return (
    <MapContainer center={position} zoom={13} style={{ height: '300px', width: '100%' }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={position} icon={markerIcon} />
      <MapEvents />
    </MapContainer>
  );
}

interface ImageItem {
  filename: string;
  url: string;
}

const ESTATE_API_BASE = 'https://santun.tedelpa.com/api/v1';

export const EstateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageItem[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    full_address: '',
    province: '',
    neighborhood: '',
    country: 'Ecuador',
    price: '',
    unit_price: '',
    before_price_label: '',
    after_price_label: '',
    property_type: '',
    property_status: '2',
    status: '1',
    highlight: false,
    size: '',
    size_bulding: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    no_garage: '',
    construction_year: '',
    location: '',
    video: '',
    air_condition: false, cable_tv: false, wifi: false, fire_detector: false,
    cameras: false, security: false, disabled_access: false, elevator: false,
    fence: false, garden: false, swimming_Pool: false, terraza: false,
    furnishing: false, garage: false, parking: false, heating: false,
    intercom: false, BBQ: false, electric_door: false, electric_fiance: false,
    meeting_room: false,
  });

  useEffect(() => {
    if (!isEditing) return;
    const fetchEstate = async () => {
      try {
        const token = localStorage.getItem('santun_auth_token');
        const res = await fetch(`${ESTATE_API_BASE}/estates/${id}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        const json = await res.json();
        const e: any = json.data ?? json;

        setForm({
          title: e.title || '',
          description: e.description || '',
          full_address: e.full_address || e.address || '',
          province: e.province || '',
          neighborhood: e.neighborhood || '',
          country: e.country || 'Ecuador',
          price: e.price || '',
          unit_price: e.unit_price || '',
          before_price_label: e.before_price_label || '',
          after_price_label: e.after_price_label || '',
          property_type: e.property_type || '',
          property_status: e.property_status || '2',
          status: e.status || '1',
          highlight: Boolean(e.highlight),
          size: e.size || '',
          size_bulding: e.size_bulding || '',
          rooms: e.rooms || '',
          bedrooms: e.bedrooms || '',
          bathrooms: e.bathrooms || '',
          no_garage: e.no_garage || '',
          construction_year: e.construction_year || '',
          location: e.location || '',
          video: e.video || '',
          air_condition: Boolean(e.air_condition), cable_tv: Boolean(e.cable_tv),
          wifi: Boolean(e.wifi), fire_detector: Boolean(e.fire_detector),
          cameras: Boolean(e.cameras), security: Boolean(e.security),
          disabled_access: Boolean(e.disabled_access), elevator: Boolean(e.elevator),
          fence: Boolean(e.fence), garden: Boolean(e.garden),
          swimming_Pool: Boolean(e.swimming_Pool), terraza: Boolean(e.terraza),
          furnishing: Boolean(e.furnishing), garage: Boolean(e.garage),
          parking: Boolean(e.parking), heating: Boolean(e.heating),
          intercom: Boolean(e.intercom), BBQ: Boolean(e.BBQ),
          electric_door: Boolean(e.electric_door), electric_fiance: Boolean(e.electric_fiance),
          meeting_room: Boolean(e.meeting_room),
        });

        if (e.images) {
          const imgs: string[] = Array.isArray(e.images)
            ? e.images.map((i: any) => typeof i === 'string' ? i : i.image_path)
            : JSON.parse(e.images);

          setUploadedImages(imgs.map((filename: string) => ({
            filename,
            url: filename.startsWith('http') ? filename : `https://santun.tedelpa.com/public/${filename}`,
          })));
        }
      } catch (err) {
        console.error('Error loading estate:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEstate();
  }, [id]);

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeSelectedFile = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadSelectedImages = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploadingImages(true);
    try {
      const token = localStorage.getItem('santun_auth_token');
      const formData = new FormData();
      selectedFiles.forEach(f => formData.append('files[]', f));

      const res = await fetch(`${ESTATE_API_BASE}/estates/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        body: formData,
      });
      const json = await res.json();

      const newImages: ImageItem[] = Array.isArray(json.data) ? json.data : [json.data];
      setUploadedImages(prev => [...prev, ...newImages.map((img: any) => ({
        filename: img.path || img.filename,
        url: img.url || img.path,
      }))]);
      setSelectedFiles([]);
    } catch (err) {
      console.error('Error uploading images:', err);
    } finally {
      setIsUploadingImages(false);
    }
  };

  const removeUploadedImage = (idx: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('santun_auth_token');
      const payload = {
        ...form,
        highlight: form.highlight ? 1 : 0,
        images: uploadedImages.map(img => img.filename),
        ...AMENITIES.reduce((acc, a) => {
          acc[a.key] = (form as any)[a.key] ? 1 : 0;
          return acc;
        }, {} as any),
      };

      const url = isEditing
        ? `${ESTATE_API_BASE}/estates/${id}`
        : `${ESTATE_API_BASE}/estates`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (isEditing && uploadedImages.length > 0) {
        const savedJson = await res.json();
        const savedId = savedJson.data?.id ?? id;
        await fetch(`${ESTATE_API_BASE}/estates/${savedId}/images`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ images: uploadedImages.map(img => img.filename) }),
        });
      }

      navigate('/estates');
    } catch (err) {
      console.error('Error saving estate:', err);
      alert('Error al guardar la propiedad. Revise los datos e intente de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const labelCls = 'block text-xs font-bold text-slate-600 mb-1';
  const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors';
  const sectionCls = 'bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5';
  const sectionHeaderCls = 'px-5 py-3.5 border-b border-slate-100 flex items-center gap-2';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-0">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/estates')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              {isEditing ? 'Editar Inmueble' : 'Agregar Inmueble'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Completa todos los campos y guarda los cambios.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        <div className={sectionCls}>
          <div className={sectionHeaderCls}>
            <ImagePlus className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Galería de Imágenes</h3>
          </div>
          <div className="p-5">
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors mb-4"
            >
              <Upload className="w-4 h-4" />
              Seleccionar / Subir Fotos
            </button>

            {uploadedImages.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative group w-28 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(idx)}
                        className="p-1 bg-rose-600 rounded-full text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No se han subido imágenes aún.</p>
            )}
          </div>
        </div>

        <div className={sectionCls}>
          <div className={sectionHeaderCls}>
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Información</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-2">
                <label className={labelCls}>Título <span className="text-rose-500">*</span></label>
                <input type="text" className={inputCls} required value={form.title} onChange={e => handleChange('title', e.target.value)} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="highlight"
                  checked={form.highlight}
                  onChange={e => handleChange('highlight', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="highlight" className="text-sm text-slate-700 font-medium cursor-pointer">Marcar como destacado</label>
              </div>
            </div>

            <div>
              <label className={labelCls}>Descripción</label>
              <ReactQuill
                theme="snow"
                className="quill-container"
                value={form.description}
                onChange={value => handleChange('description', value)}
              />
            </div>

            <div>
              <label className={labelCls}>Dirección completa <span className="text-rose-500">*</span></label>
              <input type="text" className={inputCls} required value={form.full_address} onChange={e => handleChange('full_address', e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>País <span className="text-rose-500">*</span></label>
                <input type="text" className={inputCls} value={form.country} onChange={e => handleChange('country', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Provincia / Estado <span className="text-rose-500">*</span></label>
                <input type="text" className={inputCls} value={form.province} onChange={e => handleChange('province', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Ciudad / Cantón <span className="text-rose-500">*</span></label>
                <input type="text" className={inputCls} value={form.neighborhood} onChange={e => handleChange('neighborhood', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Ubicación en mapa</label>
              <MapPicker
                location={form.location}
                onLocationChange={value => handleChange('location', value)}
              />
              <textarea
                rows={2}
                className={inputCls + ' mt-2'}
                placeholder="Ej: -0.250000,-78.562500 o https://goo.gl/maps/..."
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
              />
              </div>
            </div>
          </div>
              {/* 3. Precio */}
              <div className={sectionCls}>
                <div className={sectionHeaderCls}>
                  <span className="text-lg">💰</span>
                  <h3 className="font-bold text-slate-800 text-sm">Precio</h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Precio <span className="text-rose-500">*</span></label>
                    <input type="number" step="any" className={inputCls} required value={form.price} onChange={e => handleChange('price', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Precio por unidad</label>
                    <input type="text" className={inputCls} value={form.unit_price} onChange={e => handleChange('unit_price', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Etiqueta antes del precio</label>
                    <input type="text" className={inputCls} placeholder="Desde" value={form.before_price_label} onChange={e => handleChange('before_price_label', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Etiqueta después del precio</label>
                    <input type="text" className={inputCls} placeholder="/ mes" value={form.after_price_label} onChange={e => handleChange('after_price_label', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* 4. Información Adicional */}
              <div className={sectionCls}>
                <div className={sectionHeaderCls}>
                  <span className="text-lg">📋</span>
                  <h3 className="font-bold text-slate-800 text-sm">Información Adicional</h3>
                </div>
                <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Tipo de Propiedad <span className="text-rose-500">*</span></label>
                    <select className={inputCls} value={form.property_type} onChange={e => handleChange('property_type', e.target.value)} required>
                      <option value="">Seleccionar</option>
                      <option value="1">Casa</option>
                      <option value="2">Departamento</option>
                      <option value="3">Terreno / Lote</option>
                      <option value="4">Comercial</option>
                      <option value="5">Oficina</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Tipo de Transacción <span className="text-rose-500">*</span></label>
                    <select className={inputCls} value={form.property_status} onChange={e => handleChange('property_status', e.target.value)}>
                      <option value="1">En Alquiler</option>
                      <option value="2">En Venta</option>
                      <option value="3">En Remate</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Estado <span className="text-rose-500">*</span></label>
                    <select className={inputCls} value={form.status} onChange={e => handleChange('status', e.target.value)}>
                      <option value="1">Disponible</option>
                      <option value="2">Vendido</option>
                      <option value="3">Alquilado</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Terreno (m²)</label>
                    <input type="number" className={inputCls} value={form.size} onChange={e => handleChange('size', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Construcción (m²)</label>
                    <input type="text" className={inputCls} value={form.size_bulding} onChange={e => handleChange('size_bulding', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Habitaciones</label>
                    <input type="number" className={inputCls} value={form.rooms} onChange={e => handleChange('rooms', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Dormitorios</label>
                    <input type="number" className={inputCls} value={form.bedrooms} onChange={e => handleChange('bedrooms', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Baños</label>
                    <input type="number" className={inputCls} value={form.bathrooms} onChange={e => handleChange('bathrooms', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Cochera</label>
                    <input type="number" className={inputCls} value={form.no_garage} onChange={e => handleChange('no_garage', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Año de Construcción</label>
                    <input type="number" className={inputCls} value={form.construction_year} onChange={e => handleChange('construction_year', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* 5. Amenidades */}
              <div className={sectionCls}>
                <div className={sectionHeaderCls}>
                  <span className="text-lg">✨</span>
                  <h3 className="font-bold text-slate-800 text-sm">Servicios y Comodidades</h3>
                </div>
                <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AMENITIES.map(amenity => (
                    <label key={amenity.key} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => handleChange(amenity.key, !(form as any)[amenity.key])}
                        className="flex-shrink-0"
                      >
                        {(form as any)[amenity.key] ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                        )}
                      </div>
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Videos */}
              <div className={sectionCls}>
                <div className={sectionHeaderCls}>
                  <span className="text-lg">🎥</span>
                  <h3 className="font-bold text-slate-800 text-sm">Video</h3>
                </div>
                <div className="p-5">
                  <label className={labelCls}>URL de YouTube</label>
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.video}
                    onChange={e => handleChange('video', e.target.value)}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between py-2">
                <button
                  type="button"
                  onClick={() => navigate('/estates')}
                  className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Guardando...' : 'Guardar Propiedad'}
                </button>
              </div>
            </form>

            {/* Modal Subir Imágenes */}
            {showImageModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ImagePlus className="w-5 h-5 text-blue-600" />
                      Subir Imágenes
                    </h3>
                    <button
                      onClick={() => { setShowImageModal(false); setSelectedFiles([]); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Drag & Drop Zone */}
                    <div
                      onDrop={handleFileDrop}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                    >
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-700">Arrastra las fotos aquí</p>
                      <p className="text-xs text-slate-500 mt-1">o haz click para seleccionar archivos</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </div>

                    {/* Preview de archivos seleccionados */}
                    {selectedFiles.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-2">{selectedFiles.length} archivo(s) seleccionado(s):</p>
                        <div className="flex flex-wrap gap-3">
                          {selectedFiles.map((file, idx) => (
                            <div key={idx} className="relative group w-24 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeSelectedFile(idx)}
                                className="absolute top-1 right-1 p-0.5 bg-rose-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <p className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] truncate px-1 py-0.5">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Imágenes ya subidas */}
                    {uploadedImages.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-2">Imágenes actuales ({uploadedImages.length}):</p>
                        <div className="flex flex-wrap gap-3">
                          {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative group w-24 h-20 rounded-lg overflow-hidden border border-slate-200">
                              <img src={img.url} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeUploadedImage(idx)}
                                className="absolute top-1 right-1 p-0.5 bg-rose-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              {idx === 0 && (
                                <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-white text-[9px] text-center py-0.5">Principal</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Modal Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => { setShowImageModal(false); setSelectedFiles([]); }}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Cerrar
                      </button>
                      {selectedFiles.length > 0 && (
                        <button
                          type="button"
                          onClick={uploadSelectedImages}
                          disabled={isUploadingImages}
                          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors disabled:opacity-60"
                        >
                          {isUploadingImages ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          {isUploadingImages ? 'Subiendo...' : `Subir ${selectedFiles.length} imagen(es)`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      );
};

          export default EstateFormPage;
