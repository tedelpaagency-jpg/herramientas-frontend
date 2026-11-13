'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Building2, ArrowLeft, ImagePlus, Upload, Trash2, GripVertical,
  Save, X, CheckSquare, Square, Loader2, User as UserIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import estateService from '../services/estateService';
import estateCatalogService, { LocationsHierarchyData } from '../services/estateCatalogService';
import { useAuth } from '../context/AuthContext';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

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
  { key: 'offices', label: 'Oficinas' },
  { key: 'maneuvering', label: 'Patio de maniobras' },
  { key: 'hospital_cerca', label: 'Hospital / Clínica cerca' },
  { key: 'escuela_cerca', label: 'Escuela / Colegio cerca' },
];

const MapPicker = dynamic(() => import('../components/MapPicker'), { ssr: false });

interface ImageItem {
  filename: string;
  url: string;
}

export const EstateFormPage: React.FC = () => {
  const router = useRouter();
  const { user, dashboardType } = useAuth();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEditing = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isWhiteLabelOrSuperAdmin = dashboardType === 'white_label_admin' || dashboardType === 'super_admin' || user?.role === 'white_label_admin' || user?.role === 'super_admin';

  const isAgencyAdmin = Boolean(
    isWhiteLabelOrSuperAdmin ||
    dashboardType === 'agency_admin' ||
    ['agency_admin', 'admin', 'gerente', 'gerente_comercial'].includes(user?.role || '') ||
    user?.roles?.some((r: any) => ['agency_admin', 'admin', 'gerente', 'gerente_comercial', 'super_admin', 'white_label_admin'].includes(r.name))
  );

  const [creatorUser, setCreatorUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [locationsData, setLocationsData] = useState<LocationsHierarchyData | null>(null);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<{ id: number; name: string }[]>([]);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(true);

  const [form, setForm] = useState({
    title: '',
    description: '',
    full_address: '',
    province: '',
    neighborhood: '',
    parroquia: '',
    country: 'Ecuador',
    pais_id: null as number | null,
    province_id: null as number | null,
    canton_id: null as number | null,
    parroquia_id: null as number | null,
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
    meeting_room: false, offices: false, maneuvering: false, hospital_cerca: false,
    escuela_cerca: false,
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const data = await estateCatalogService.getLocationsHierarchy();
        setLocationsData(data);

        // Preselección de país asignado a la agencia del usuario
        if (!isEditing && data?.countries?.length) {
          const agencyCountryName = user?.agency?.country;
          const agencyPaisId = user?.agency?.pais_id;
          const matchedCountry =
            data.countries.find(
              (c) =>
                (agencyPaisId && Number(c.id) === Number(agencyPaisId)) ||
                (agencyCountryName && c.name.toLowerCase() === agencyCountryName.toLowerCase())
            ) ||
            data.countries.find((c) => c.name.toLowerCase() === 'ecuador') ||
            data.countries[0];

          if (matchedCountry) {
            setForm((prev) => ({
              ...prev,
              pais_id: Number(matchedCountry.id),
              country: matchedCountry.name,
            }));
          }
        }
      } catch (err) {
        console.error('Error loading locations:', err);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, [user?.agency?.country, user?.agency?.pais_id, isEditing]);

  // Tipos de propiedad desde la BD (tabla estate_type)
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setLoadingPropertyTypes(true);
        const types = await estateService.getCategoriesCatalog();
        setPropertyTypes(
          (Array.isArray(types) ? types : [])
            .map((t: any) => ({ id: Number(t.id), name: String(t.name) }))
            .filter((t) => t.id > 0 && t.name)
        );
      } catch (err) {
        console.error('Error loading property types:', err);
        toast.error('No se pudieron cargar los tipos de propiedad');
      } finally {
        setLoadingPropertyTypes(false);
      }
    };
    fetchPropertyTypes();
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    const fetchEstate = async () => {
      try {
        const estateData = await estateService.getEstate(Number(id));
        const e: any = estateData;
        const creator = e.user || (e.user_id ? { id: e.user_id, name: e.user_name || `Asesor #${e.user_id}` } : null);
        setCreatorUser(creator);

        // Standard advisers cannot modify someone else's property
        const currentUserId = Number(user?.id);
        const creatorId = Number(e.user_id || e.user?.id);
        if (!isAgencyAdmin && currentUserId && creatorId && currentUserId !== creatorId) {
          toast.error('No tienes permisos para modificar este inmueble. Solo puedes editar tus propias propiedades.');
          router.replace('/estates');
          return;
        }

        setForm({
          title: e.title || '',
          description: e.description || '',
          full_address: e.full_address || e.address || '',
          province: e.province || '',
          neighborhood: e.neighborhood || '',
          parroquia: e.parroquia || '',
          country: e.country || 'Ecuador',
          pais_id: e.pais_id ? Number(e.pais_id) : null,
          province_id: e.province_id ? Number(e.province_id) : null,
          canton_id: e.canton_id ? Number(e.canton_id) : null,
          parroquia_id: e.parroquia_id ? Number(e.parroquia_id) : null,
          price: e.price || '',
          unit_price: e.unit_price || '',
          before_price_label: e.before_price_label || '',
          after_price_label: e.after_price_label || '',
          property_type: e.property_type ? String(e.property_type) : '',
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
          meeting_room: Boolean(e.meeting_room), offices: Boolean(e.offices),
          maneuvering: Boolean(e.maneuvering), hospital_cerca: Boolean(e.hospital_cerca),
          escuela_cerca: Boolean(e.escuela_cerca),
        });

        const imgs: string[] = [];
        if (e.images) {
          const raw = Array.isArray(e.images)
            ? e.images.map((i: any) => typeof i === 'string' ? i : i.image_path)
            : (typeof e.images === 'string' ? JSON.parse(e.images) : []);
          imgs.push(...raw);
        }
        if (e.image && !imgs.includes(e.image)) {
          imgs.unshift(e.image);
        }

        if (imgs.length > 0) {
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
      const uploadedData = await estateService.uploadImages(selectedFiles);
      const newImages: ImageItem[] = Array.isArray(uploadedData) ? uploadedData : [uploadedData];
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
      const imageFilenames = uploadedImages.map(img => img.filename);
      const payload: any = {
        ...form,
        highlight: form.highlight ? 1 : 0,
        images: imageFilenames,
        image: imageFilenames.length > 0 ? imageFilenames[0] : null,
        ...AMENITIES.reduce((acc, a) => {
          acc[a.key] = (form as any)[a.key] ? 1 : 0;
          return acc;
        }, {} as any),
      };

      if (isEditing && id) {
        delete payload.user_id;
        delete payload.user_type;
        await estateService.updateEstate(Number(id), payload);
        if (imageFilenames.length > 0) {
          await estateService.updateImages(Number(id), imageFilenames);
        }
        toast.success('Propiedad actualizada exitosamente');
      } else {
        await estateService.createEstate(payload);
        toast.success('Propiedad creada exitosamente');
      }

      router.push('/estates');
    } catch (err: any) {
      console.error('Error saving estate:', err);
      const msg = err?.response?.data?.message || 'Error al guardar la propiedad. Revise los datos e intente de nuevo.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const labelCls = 'block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1';
  const inputCls = 'w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors';
  const sectionCls = 'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-5';
  const sectionHeaderCls = 'px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2';

  // Locations cascading logic
  const availableCountries = locationsData?.countries || [];

  const selectedCountry = availableCountries.find(
    c => c.name.toLowerCase() === (form.country || 'ecuador').toLowerCase() || (form.pais_id && c.id === form.pais_id)
  );

  const availableProvinces = (locationsData?.provinces || []).filter(p => {
    if (!selectedCountry) return true;
    return p.country_id === selectedCountry.id;
  });

  const selectedProvince = availableProvinces.find(
    p => p.name.toLowerCase() === (form.province || '').toLowerCase() || (form.province_id && p.id === form.province_id)
  );

  const availableCities = (locationsData?.cities || []).filter(c => {
    if (selectedProvince) {
      return (c.province_id && c.province_id === selectedProvince.id) || 
             (c.province && c.province.toLowerCase() === selectedProvince.name.toLowerCase());
    }
    if (selectedCountry) {
      return c.country_id === selectedCountry.id;
    }
    return true;
  });

  const selectedCity = availableCities.find(
    c => c.name.toLowerCase() === (form.neighborhood || '').toLowerCase() || (form.canton_id && c.id === form.canton_id)
  );

  const availableParroquias = selectedCity
    ? (locationsData?.parroquias || []).filter(p => p.city_id === selectedCity.id)
    : [];

  const hasParroquias = availableParroquias.length > 0;

  const handleCountrySelect = (countryName: string) => {
    const cObj = availableCountries.find(c => c.name === countryName);
    setForm(prev => ({
      ...prev,
      country: countryName,
      pais_id: cObj?.id || null,
      province: '',
      province_id: null,
      neighborhood: '',
      canton_id: null,
      parroquia: '',
      parroquia_id: null,
    }));
  };

  const handleProvinceSelect = (provinceName: string) => {
    const pObj = availableProvinces.find(p => p.name === provinceName);
    setForm(prev => ({
      ...prev,
      province: provinceName,
      province_id: pObj?.id || null,
      neighborhood: '',
      canton_id: null,
      parroquia: '',
      parroquia_id: null,
    }));
  };

  const handleCitySelect = (cityName: string) => {
    const cityObj = availableCities.find(c => c.name === cityName);
    setForm(prev => ({
      ...prev,
      neighborhood: cityName,
      canton_id: cityObj?.id || null,
      parroquia: '',
      parroquia_id: null,
    }));
  };

  const handleParroquiaSelect = (parroquiaName: string) => {
    const parroquiaObj = availableParroquias.find(p => p.name === parroquiaName);
    setForm(prev => ({
      ...prev,
      parroquia: parroquiaName,
      parroquia_id: parroquiaObj?.id || null,
    }));
  };

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
            onClick={() => router.push('/estates')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              {isEditing ? 'Editar Inmueble' : 'Agregar Inmueble'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">Completa todos los campos y guarda los cambios.</p>
              {isEditing && creatorUser && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Asesor Creador: <strong className="text-slate-900 dark:text-white">{creatorUser.name || `ID #${creatorUser.id}`}</strong></span>
                  <span className="text-[10px] text-slate-400 font-normal ml-0.5">(Inmutable)</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        <div className={sectionCls}>
          <div className={sectionHeaderCls}>
            <ImagePlus className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Galería de Imágenes</h3>
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
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Información</h3>
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
                <label htmlFor="highlight" className="text-sm text-slate-700 dark:text-slate-200 font-medium cursor-pointer">Marcar como destacado</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={labelCls}>País <span className="text-rose-500">*</span></label>
                {availableCountries.length > 0 ? (
                  <select
                    className={inputCls}
                    value={form.country}
                    onChange={e => handleCountrySelect(e.target.value)}
                  >
                    <option value="">Seleccione país</option>
                    {availableCountries.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className={inputCls}
                    value={form.country}
                    onChange={e => handleChange('country', e.target.value)}
                  />
                )}
              </div>

              <div>
                <label className={labelCls}>Provincia / Estado <span className="text-rose-500">*</span></label>
                {availableProvinces.length > 0 ? (
                  <select
                    className={inputCls}
                    value={form.province}
                    onChange={e => handleProvinceSelect(e.target.value)}
                  >
                    <option value="">Seleccione provincia</option>
                    {availableProvinces.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="Ej: Pichincha"
                    value={form.province}
                    onChange={e => handleChange('province', e.target.value)}
                  />
                )}
              </div>

              <div>
                <label className={labelCls}>Ciudad / Cantón <span className="text-rose-500">*</span></label>
                {availableCities.length > 0 ? (
                  <select
                    className={inputCls}
                    value={form.neighborhood}
                    onChange={e => handleCitySelect(e.target.value)}
                  >
                    <option value="">Seleccione ciudad</option>
                    {availableCities.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="Ej: Quito"
                    value={form.neighborhood}
                    onChange={e => handleChange('neighborhood', e.target.value)}
                  />
                )}
              </div>

              <div>
                <label className={labelCls}>
                  Parroquia / Sector
                  {hasParroquias && <span className="text-rose-500 ml-0.5">*</span>}
                </label>
                {hasParroquias ? (
                  <select
                    className={inputCls}
                    value={form.parroquia}
                    onChange={e => handleParroquiaSelect(e.target.value)}
                  >
                    <option value="">Seleccione parroquia</option>
                    {availableParroquias.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} {p.type ? `(${p.type})` : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    className={`${inputCls} bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-60 text-slate-400`}
                    disabled
                    value=""
                  >
                    <option value="">
                      {!form.neighborhood ? 'Seleccione ciudad primero' : 'Sin parroquias registradas'}
                    </option>
                  </select>
                )}
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
                placeholder="Ej: -0.250000,-78.562500, Q3JG+QVH, La Libertad o enlace de Google Maps"
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
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Precio</h3>
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
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Información Adicional</h3>
                  </div>
                  <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Tipo de Propiedad <span className="text-rose-500">*</span></label>
                      <select className={inputCls} value={form.property_type} onChange={e => handleChange('property_type', e.target.value)} required disabled={loadingPropertyTypes}>
                        <option value="">{loadingPropertyTypes ? 'Cargando tipos...' : 'Seleccionar'}</option>
                        {propertyTypes.map(t => (
                          <option key={t.id} value={String(t.id)}>{t.name}</option>
                        ))}
                        {form.property_type && !loadingPropertyTypes && !propertyTypes.some(t => String(t.id) === String(form.property_type)) && (
                          <option value={form.property_type}>{`Tipo #${form.property_type} (no encontrado)`}</option>
                        )}
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
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Servicios y Comodidades</h3>
                  </div>
                  <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AMENITIES.map(amenity => (
                    <label key={amenity.key} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => handleChange(amenity.key, !(form as any)[amenity.key])}
                        className="flex-shrink-0"
                      >
                        {(form as any)[amenity.key] ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
                        )}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Videos */}
              <div className={sectionCls}>
                <div className={sectionHeaderCls}>
                  <span className="text-lg">🎥</span>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Video</h3>
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
                  onClick={() => router.push('/estates')}
                  className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
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
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ImagePlus className="w-5 h-5 text-blue-600" />
                      Subir Imágenes
                    </h3>
                    <button
                      onClick={() => { setShowImageModal(false); setSelectedFiles([]); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                    >
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Arrastra las fotos aquí</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">o haz click para seleccionar archivos</p>
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
