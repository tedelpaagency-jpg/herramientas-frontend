'use client';

import React, { useEffect, useState } from 'react';
import visaService from '../services/visaService';
import { normalizeFileUrl } from '../services/apiClient';
import { 
  FileCheck, Upload, Eye, RefreshCw, User, FileText, Globe, Home, Briefcase, Award, ShieldAlert, Users, PhoneCall, Building, HelpCircle, Compass, CreditCard, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PublicVisaFormPageProps {
  encodedId: string;
}

export const PublicVisaFormPage: React.FC<PublicVisaFormPageProps> = ({ encodedId }) => {
  const [visaData, setVisaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>({});
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, 'valid' | 'invalid'>>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const fetchPublicVisa = async () => {
      setIsLoading(true);
      try {
        const data = await visaService.getVisaPublic(encodedId);
        setVisaData(data);
        setDynamicFields(data.fields || {});
      } catch (err) {
        console.error('Error fetching public visa:', err);
        toast.error('Este formulario no se encuentra disponible o ha sido deshabilitado');
      } finally {
        setIsLoading(false);
      }
    };

    if (encodedId) {
      fetchPublicVisa();
    }
  }, [encodedId]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setDynamicFields((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFieldBlur = async (fieldName: string, value: any) => {
    const isVal = String(value || '').trim() !== '';
    setFieldStatuses((prev) => ({ ...prev, [fieldName]: isVal ? 'valid' : 'invalid' }));

    setAutoSaveStatus('saving');
    try {
      if (encodedId) {
        await visaService.saveVisaFieldPublic(encodedId, fieldName, value);
      } else {
        await visaService.saveVisaField(visaData?.id || 0, fieldName, value);
      }
      setAutoSaveStatus('saved');
      toast.success('Guardado', { duration: 1500, id: 'autosave-toast' });
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Error auto-saving field:', err);
      setAutoSaveStatus('idle');
    }
  };

  const handleFileUpload = async (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !visaData) return;

    try {
      const res = await visaService.uploadVisaFilePublic(encodedId, fieldName, file);
      const cleanUrl = normalizeFileUrl(res.file_url);
      setDynamicFields((prev) => ({ ...prev, [fieldName]: cleanUrl }));
      toast.success('Archivo adjuntado correctamente');
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error('Error al subir el archivo');
    }
  };

  const renderFilePreview = (rawUrl: string | undefined, label: string) => {
    const fileUrl = normalizeFileUrl(rawUrl);
    if (!fileUrl) {
      return <span className="text-xs text-slate-400 font-medium">Esperando imagen</span>;
    }

    const isPdf = fileUrl.toLowerCase().endsWith('.pdf') || fileUrl.includes('.pdf?');

    if (isPdf) {
      return (
        <div className="flex flex-col items-center justify-center p-2 text-center space-y-1 w-full h-full">
          <FileText className="w-10 h-10 text-rose-500" />
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold text-sky-600 hover:underline flex items-center space-x-1"
          >
            <span>Ver PDF adjunto</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      );
    }

    return (
      <a href={fileUrl} target="_blank" rel="noreferrer" className="w-full h-full block group relative">
        <img src={fileUrl} alt={label} className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold space-x-1">
          <Eye className="w-4 h-4" />
          <span>Ver archivo</span>
        </div>
      </a>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#121413] flex flex-col justify-center items-center text-slate-800 dark:text-slate-200 space-y-3">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500">Cargando formulario consular...</p>
      </div>
    );
  }

  if (!visaData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#121413] flex flex-col justify-center items-center text-slate-800 dark:text-slate-200 p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl max-w-md text-center space-y-3 shadow-md">
          <FileCheck className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Formulario No Disponible</h2>
          <p className="text-xs text-slate-500">
            Este formulario ya no se encuentra disponible o la URL ha caducado. Consulta con tu asesor para más información.
          </p>
        </div>
      </div>
    );
  }

  const isUsa = visaData.visa_type === 'USA';
  const isCanada = visaData.visa_type === 'CANADA';
  const isSchengen = visaData.visa_type === 'SCHENGEN';
  const countryName = isUsa ? 'Estados Unidos' : isCanada ? 'Canadá' : 'Espacio Schengen (Europa)';

  const getInputClass = (fieldName: string) => {
    const st = fieldStatuses[fieldName];
    let base = "w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none transition-colors ";
    if (st === 'valid') return base + "border-emerald-500 ring-1 ring-emerald-500/30";
    if (st === 'invalid') return base + "border-rose-500 ring-1 ring-rose-500/30";
    return base + "border-slate-300 focus:border-sky-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121413] text-slate-900 dark:text-slate-100 py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-md shadow-sky-600/20">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {isUsa ? 'Formulario - Visa Americana (DS-160)' : isCanada ? 'Formulario - Visa Canadiense (IMM-5257)' : 'Solicitud de Visado Schengen (Oficial)'}
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Solicitante: <strong className="text-slate-900 dark:text-slate-100">{visaData.applicant_name}</strong> | {visaData.agency_name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {autoSaveStatus === 'saving' && (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Guardando...</span>
              </span>
            )}
            {autoSaveStatus === 'saved' && (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Guardado en tiempo real ✓
              </span>
            )}
          </div>
        </div>

        {/* IF SCHENGEN VISA TYPE -> RENDER 34 OFFICIAL CASILLAS FROM visa_schengen.pdf */}
        {isSchengen ? (
          <div className="space-y-6">
            
            {/* SCHENGEN BLOQUE 1: DATOS PERSONALES (CASILLAS 1 A 11) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <User className="w-4 h-4 text-sky-600" />
                <span>Casillas 1-11: Datos Personales e Identificación</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">1. Apellido(s) *</label>
                  <input
                    type="text"
                    name="surname"
                    value={dynamicFields['surname'] || visaData.applicant_name}
                    onChange={(e) => handleFieldChange('surname', e.target.value)}
                    onBlur={(e) => handleFieldBlur('surname', e.target.value)}
                    placeholder="1. Apellido(s)"
                    className={getInputClass('surname')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">2. Apellido(s) de nacimiento (anteriores)</label>
                  <input
                    type="text"
                    name="birth_surname"
                    value={dynamicFields['birth_surname'] || ''}
                    onChange={(e) => handleFieldChange('birth_surname', e.target.value)}
                    onBlur={(e) => handleFieldBlur('birth_surname', e.target.value)}
                    placeholder="2. Apellido(s) de nacimiento"
                    className={getInputClass('birth_surname')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">3. Nombre(s) *</label>
                  <input
                    type="text"
                    name="first_names"
                    value={dynamicFields['first_names'] || ''}
                    onChange={(e) => handleFieldChange('first_names', e.target.value)}
                    onBlur={(e) => handleFieldBlur('first_names', e.target.value)}
                    placeholder="3. Nombre(s)"
                    className={getInputClass('first_names')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">4. Fecha de nacimiento (día-mes-año) *</label>
                  <input
                    type="date"
                    name="birthday"
                    value={dynamicFields['birthday'] || ''}
                    onChange={(e) => handleFieldChange('birthday', e.target.value)}
                    onBlur={(e) => handleFieldBlur('birthday', e.target.value)}
                    className={getInputClass('birthday')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">5. Lugar de nacimiento *</label>
                  <input
                    type="text"
                    name="birth_place"
                    value={dynamicFields['birth_place'] || ''}
                    onChange={(e) => handleFieldChange('birth_place', e.target.value)}
                    onBlur={(e) => handleFieldBlur('birth_place', e.target.value)}
                    placeholder="5. Lugar de nacimiento"
                    className={getInputClass('birth_place')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">6. País de nacimiento *</label>
                  <input
                    type="text"
                    name="birth_country"
                    value={dynamicFields['birth_country'] || ''}
                    onChange={(e) => handleFieldChange('birth_country', e.target.value)}
                    onBlur={(e) => handleFieldBlur('birth_country', e.target.value)}
                    placeholder="6. País de nacimiento"
                    className={getInputClass('birth_country')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">7. Nacionalidad actual *</label>
                  <input
                    type="text"
                    name="current_nationality"
                    value={dynamicFields['current_nationality'] || ''}
                    onChange={(e) => handleFieldChange('current_nationality', e.target.value)}
                    onBlur={(e) => handleFieldBlur('current_nationality', e.target.value)}
                    placeholder="Nacionalidad actual"
                    className={getInputClass('current_nationality')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">7. Nacionalidad de nacimiento (si difiere)</label>
                  <input
                    type="text"
                    name="birth_nationality"
                    value={dynamicFields['birth_nationality'] || ''}
                    onChange={(e) => handleFieldChange('birth_nationality', e.target.value)}
                    onBlur={(e) => handleFieldBlur('birth_nationality', e.target.value)}
                    placeholder="Nacionalidad de nacimiento"
                    className={getInputClass('birth_nationality')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">7. Otras nacionalidades</label>
                  <input
                    type="text"
                    name="other_nationalities"
                    value={dynamicFields['other_nationalities'] || ''}
                    onChange={(e) => handleFieldChange('other_nationalities', e.target.value)}
                    onBlur={(e) => handleFieldBlur('other_nationalities', e.target.value)}
                    placeholder="Otras nacionalidades"
                    className={getInputClass('other_nationalities')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">8. Sexo *</label>
                  <select
                    name="sex"
                    value={dynamicFields['sex'] || ''}
                    onChange={(e) => {
                      handleFieldChange('sex', e.target.value);
                      handleFieldBlur('sex', e.target.value);
                    }}
                    className={getInputClass('sex')}
                  >
                    <option value="">8. Sexo</option>
                    <option value="Varón">Varón</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">9. Estado civil *</label>
                  <select
                    name="marital_status"
                    value={dynamicFields['marital_status'] || ''}
                    onChange={(e) => {
                      handleFieldChange('marital_status', e.target.value);
                      handleFieldBlur('marital_status', e.target.value);
                    }}
                    className={getInputClass('marital_status')}
                  >
                    <option value="">9. Estado civil</option>
                    <option value="Soltero/a">Soltero/a</option>
                    <option value="Casado/a">Casado/a</option>
                    <option value="Unión registrada">Unión registrada</option>
                    <option value="Separado/a">Separado/a</option>
                    <option value="Divorciado/a">Divorciado/a</option>
                    <option value="Viudo/a">Viudo/a</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">10. Persona que ejerce la patria potestad (menores) / tutor legal</label>
                  <textarea
                    rows={2}
                    name="tutor_details"
                    value={dynamicFields['tutor_details'] || ''}
                    onChange={(e) => handleFieldChange('tutor_details', e.target.value)}
                    onBlur={(e) => handleFieldBlur('tutor_details', e.target.value)}
                    placeholder="Apellidos, nombre, dirección si difiere, número de teléfono, correo electrónico y nacionalidad"
                    className={getInputClass('tutor_details')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">11. Número de documento nacional de identidad *</label>
                  <input
                    type="text"
                    name="cedula"
                    value={dynamicFields['cedula'] || ''}
                    onChange={(e) => handleFieldChange('cedula', e.target.value)}
                    onBlur={(e) => handleFieldBlur('cedula', e.target.value)}
                    placeholder="Número de cédula"
                    className={getInputClass('cedula')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lugar donde se tramita la visa *</label>
                  <select
                    name="processing_location"
                    value={dynamicFields['processing_location'] || ''}
                    onChange={(e) => {
                      handleFieldChange('processing_location', e.target.value);
                      handleFieldBlur('processing_location', e.target.value);
                    }}
                    className={getInputClass('processing_location')}
                  >
                    <option value="">Lugar donde se tramita la visa</option>
                    <option value="Quito">Quito</option>
                    <option value="Guayaquil">Guayaquil</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SCHENGEN BLOQUE 2: DOCUMENTO DE VIAJE (CASILLAS 12 A 16) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Casillas 12-16: Documento de Viaje / Pasaporte</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">12. Tipo de documento de viaje *</label>
                  <select
                    name="travel_document_type"
                    value={dynamicFields['travel_document_type'] || ''}
                    onChange={(e) => {
                      handleFieldChange('travel_document_type', e.target.value);
                      handleFieldBlur('travel_document_type', e.target.value);
                    }}
                    className={getInputClass('travel_document_type')}
                  >
                    <option value="">12. Tipo de documento de viaje</option>
                    <option value="Pasaporte ordinario">Pasaporte ordinario</option>
                    <option value="Pasaporte diplomático">Pasaporte diplomático</option>
                    <option value="Pasaporte de servicio">Pasaporte de servicio</option>
                    <option value="Pasaporte oficial">Pasaporte oficial</option>
                    <option value="Pasaporte especial">Pasaporte especial</option>
                    <option value="Otro documento de viaje">Otro documento de viaje</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">13. Número del documento de viaje *</label>
                  <input
                    type="text"
                    name="passport_number"
                    value={dynamicFields['passport_number'] || visaData.passport_number || ''}
                    onChange={(e) => handleFieldChange('passport_number', e.target.value)}
                    onBlur={(e) => handleFieldBlur('passport_number', e.target.value)}
                    placeholder="Número de pasaporte"
                    className={getInputClass('passport_number')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">14. Fecha de expedición *</label>
                  <input
                    type="date"
                    name="passport_issue_date"
                    value={dynamicFields['passport_issue_date'] || ''}
                    onChange={(e) => handleFieldChange('passport_issue_date', e.target.value)}
                    onBlur={(e) => handleFieldBlur('passport_issue_date', e.target.value)}
                    className={getInputClass('passport_issue_date')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">15. Válido hasta *</label>
                  <input
                    type="date"
                    name="passport_expiry_date"
                    value={dynamicFields['passport_expiry_date'] || ''}
                    onChange={(e) => handleFieldChange('passport_expiry_date', e.target.value)}
                    onBlur={(e) => handleFieldBlur('passport_expiry_date', e.target.value)}
                    className={getInputClass('passport_expiry_date')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">16. Expedido por (país) *</label>
                  <input
                    type="text"
                    name="passport_country_city"
                    value={dynamicFields['passport_country_city'] || ''}
                    onChange={(e) => handleFieldChange('passport_country_city', e.target.value)}
                    onBlur={(e) => handleFieldBlur('passport_country_city', e.target.value)}
                    placeholder="Expedido por (país)"
                    className={getInputClass('passport_country_city')}
                  />
                </div>
              </div>
            </div>

            {/* SCHENGEN BLOQUE 3: FAMILIAR DE CIUDADANO UE/EEE/SUIZA/RU (CASILLAS 17 Y 18) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Casillas 17-18: Datos de Familiar Ciudadano UE / EEE / Suiza / RU</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">17. ¿Es familiar de un ciudadano de la UE, del EEE, de Suiza o RU?</label>
                  <select
                    name="eu_family_member"
                    value={dynamicFields['eu_family_member'] || ''}
                    onChange={(e) => {
                      handleFieldChange('eu_family_member', e.target.value);
                      handleFieldBlur('eu_family_member', e.target.value);
                    }}
                    className={getInputClass('eu_family_member')}
                  >
                    <option value="">¿Es familiar de un ciudadano UE/EEE/Suiza/RU?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['eu_family_member'] === 'Sí' && (
                  <>
                    <div>
                      <input
                        type="text"
                        name="eu_family_surname"
                        value={dynamicFields['eu_family_surname'] || ''}
                        onChange={(e) => handleFieldChange('eu_family_surname', e.target.value)}
                        onBlur={(e) => handleFieldBlur('eu_family_surname', e.target.value)}
                        placeholder="Apellido(s) del familiar"
                        className={getInputClass('eu_family_surname')}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="eu_family_name"
                        value={dynamicFields['eu_family_name'] || ''}
                        onChange={(e) => handleFieldChange('eu_family_name', e.target.value)}
                        onBlur={(e) => handleFieldBlur('eu_family_name', e.target.value)}
                        placeholder="Nombre(s) del familiar"
                        className={getInputClass('eu_family_name')}
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        name="eu_family_birthday"
                        value={dynamicFields['eu_family_birthday'] || ''}
                        onChange={(e) => handleFieldChange('eu_family_birthday', e.target.value)}
                        onBlur={(e) => handleFieldBlur('eu_family_birthday', e.target.value)}
                        className={getInputClass('eu_family_birthday')}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="eu_family_nationality"
                        value={dynamicFields['eu_family_nationality'] || ''}
                        onChange={(e) => handleFieldChange('eu_family_nationality', e.target.value)}
                        onBlur={(e) => handleFieldBlur('eu_family_nationality', e.target.value)}
                        placeholder="Nacionalidad"
                        className={getInputClass('eu_family_nationality')}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        name="eu_family_doc_number"
                        value={dynamicFields['eu_family_doc_number'] || ''}
                        onChange={(e) => handleFieldChange('eu_family_doc_number', e.target.value)}
                        onBlur={(e) => handleFieldBlur('eu_family_doc_number', e.target.value)}
                        placeholder="Número de documento de viaje o de identidad"
                        className={getInputClass('eu_family_doc_number')}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">18. Relación de parentesco con el ciudadano de la UE/EEE/Suiza/RU</label>
                      <select
                        name="eu_family_relationship"
                        value={dynamicFields['eu_family_relationship'] || ''}
                        onChange={(e) => {
                          handleFieldChange('eu_family_relationship', e.target.value);
                          handleFieldBlur('eu_family_relationship', e.target.value);
                        }}
                        className={getInputClass('eu_family_relationship')}
                      >
                        <option value="">Relación de parentesco</option>
                        <option value="Cónyuge">Cónyuge</option>
                        <option value="Hijo/a">Hijo/a</option>
                        <option value="Nieto/a">Nieto/a</option>
                        <option value="Ascendiente dependiente">Ascendiente dependiente</option>
                        <option value="Pareja de hecho registrada">Pareja de hecho registrada</option>
                        <option value="Otras">Otras</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SCHENGEN BLOQUE 4: DOMICILIO, CONTACTO Y RESIDENCIA (CASILLAS 19 Y 20) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Home className="w-4 h-4 text-sky-600" />
                <span>Casillas 19-20: Domicilio, Contacto y Residencia</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">19. Domicilio postal y dirección de correo electrónico del solicitante *</label>
                  <input
                    type="text"
                    name="home_address"
                    value={dynamicFields['home_address'] || ''}
                    onChange={(e) => handleFieldChange('home_address', e.target.value)}
                    onBlur={(e) => handleFieldBlur('home_address', e.target.value)}
                    placeholder="Domicilio postal y correo electrónico completo"
                    className={getInputClass('home_address')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Número(s) de teléfono *</label>
                  <input
                    type="text"
                    name="phone_primary"
                    value={dynamicFields['phone_primary'] || ''}
                    onChange={(e) => handleFieldChange('phone_primary', e.target.value)}
                    onBlur={(e) => handleFieldBlur('phone_primary', e.target.value)}
                    placeholder="Número(s) de teléfono"
                    className={getInputClass('phone_primary')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    name="email_primary"
                    value={dynamicFields['email_primary'] || ''}
                    onChange={(e) => handleFieldChange('email_primary', e.target.value)}
                    onBlur={(e) => handleFieldBlur('email_primary', e.target.value)}
                    placeholder="Correo electrónico"
                    className={getInputClass('email_primary')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">20. ¿Residente en un país distinto del país de nacionalidad actual?</label>
                  <select
                    name="resident_other_country"
                    value={dynamicFields['resident_other_country'] || ''}
                    onChange={(e) => {
                      handleFieldChange('resident_other_country', e.target.value);
                      handleFieldBlur('resident_other_country', e.target.value);
                    }}
                    className={getInputClass('resident_other_country')}
                  >
                    <option value="">¿Residente en otro país?</option>
                    <option value="No">No</option>
                    <option value="Sí">Sí</option>
                  </select>
                </div>

                {dynamicFields['resident_other_country'] === 'Sí' && (
                  <>
                    <div>
                      <input
                        type="text"
                        name="residence_permit_number"
                        value={dynamicFields['residence_permit_number'] || ''}
                        onChange={(e) => handleFieldChange('residence_permit_number', e.target.value)}
                        onBlur={(e) => handleFieldBlur('residence_permit_number', e.target.value)}
                        placeholder="Permiso de residencia o equivalente Nº"
                        className={getInputClass('residence_permit_number')}
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        name="residence_permit_expiry"
                        value={dynamicFields['residence_permit_expiry'] || ''}
                        onChange={(e) => handleFieldChange('residence_permit_expiry', e.target.value)}
                        onBlur={(e) => handleFieldBlur('residence_permit_expiry', e.target.value)}
                        className={getInputClass('residence_permit_expiry')}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SCHENGEN BLOQUE 5: PROFESIÓN Y EMPLEADOR / ESTUDIOS (CASILLAS 21 Y 22) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-sky-600" />
                <span>Casillas 21-22: Profesión y Datos del Empleador / Centro de Estudios</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">21. Profesión actual *</label>
                  <input
                    type="text"
                    name="current_occupation"
                    value={dynamicFields['current_occupation'] || ''}
                    onChange={(e) => handleFieldChange('current_occupation', e.target.value)}
                    onBlur={(e) => handleFieldBlur('current_occupation', e.target.value)}
                    placeholder="21. Profesión actual"
                    className={getInputClass('current_occupation')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">22. Nombre, dirección y número de teléfono del empleador. (Para estudiantes: centro de enseñanza)</label>
                  <textarea
                    rows={3}
                    name="current_employer_school"
                    value={dynamicFields['current_employer_school'] || ''}
                    onChange={(e) => handleFieldChange('current_employer_school', e.target.value)}
                    onBlur={(e) => handleFieldBlur('current_employer_school', e.target.value)}
                    placeholder="Nombre, dirección y teléfono del empleador o centro de enseñanza"
                    className={getInputClass('current_employer_school')}
                  />
                </div>
              </div>
            </div>

            {/* SCHENGEN BLOQUE 6: MOTIVO Y DATOS DEL VIAJE (CASILLAS 23 A 28) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-sky-600" />
                <span>Casillas 23-28: Motivos del Viaje y Datos de la Estancia</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">23. Motivo(s) del viaje *</label>
                  <select
                    name="travel_purpose"
                    value={dynamicFields['travel_purpose'] || ''}
                    onChange={(e) => {
                      handleFieldChange('travel_purpose', e.target.value);
                      handleFieldBlur('travel_purpose', e.target.value);
                    }}
                    className={getInputClass('travel_purpose')}
                  >
                    <option value="">23. Motivo(s) del viaje</option>
                    <option value="Turismo">Turismo</option>
                    <option value="Negocios">Negocios</option>
                    <option value="Visita a familiares o amigos">Visita a familiares o amigos</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Visita oficial">Visita oficial</option>
                    <option value="Motivos médicos">Motivos médicos</option>
                    <option value="Estudios">Estudios</option>
                    <option value="Tránsito aeroportuario">Tránsito aeroportuario</option>
                    <option value="Otros">Otros (especifíquese)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">24. Información adicional sobre el motivo de la estancia</label>
                  <textarea
                    rows={2}
                    name="travel_purpose_details"
                    value={dynamicFields['travel_purpose_details'] || ''}
                    onChange={(e) => handleFieldChange('travel_purpose_details', e.target.value)}
                    onBlur={(e) => handleFieldBlur('travel_purpose_details', e.target.value)}
                    placeholder="Información adicional sobre el motivo de la estancia"
                    className={getInputClass('travel_purpose_details')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">25. Estado miembro de destino principal *</label>
                  <input
                    type="text"
                    name="schengen_main_destination"
                    value={dynamicFields['schengen_main_destination'] || ''}
                    onChange={(e) => handleFieldChange('schengen_main_destination', e.target.value)}
                    onBlur={(e) => handleFieldBlur('schengen_main_destination', e.target.value)}
                    placeholder="Ej. España, Francia, Alemania"
                    className={getInputClass('schengen_main_destination')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">26. Estado miembro de primera entrada *</label>
                  <input
                    type="text"
                    name="schengen_first_entry"
                    value={dynamicFields['schengen_first_entry'] || ''}
                    onChange={(e) => handleFieldChange('schengen_first_entry', e.target.value)}
                    onBlur={(e) => handleFieldBlur('schengen_first_entry', e.target.value)}
                    placeholder="Ej. España"
                    className={getInputClass('schengen_first_entry')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">27. Número de entradas que solicita *</label>
                  <select
                    name="entries_requested"
                    value={dynamicFields['entries_requested'] || ''}
                    onChange={(e) => {
                      handleFieldChange('entries_requested', e.target.value);
                      handleFieldBlur('entries_requested', e.target.value);
                    }}
                    className={getInputClass('entries_requested')}
                  >
                    <option value="">27. Número de entradas</option>
                    <option value="Una">Una</option>
                    <option value="Dos">Dos</option>
                    <option value="Múltiples">Múltiples</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">28. Fecha prevista de llegada al espacio Schengen *</label>
                  <input
                    type="date"
                    name="schengen_arrival_date"
                    value={dynamicFields['schengen_arrival_date'] || ''}
                    onChange={(e) => handleFieldChange('schengen_arrival_date', e.target.value)}
                    onBlur={(e) => handleFieldBlur('schengen_arrival_date', e.target.value)}
                    className={getInputClass('schengen_arrival_date')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">28. Fecha prevista de salida del espacio Schengen *</label>
                  <input
                    type="date"
                    name="schengen_departure_date"
                    value={dynamicFields['schengen_departure_date'] || ''}
                    onChange={(e) => handleFieldChange('schengen_departure_date', e.target.value)}
                    onBlur={(e) => handleFieldBlur('schengen_departure_date', e.target.value)}
                    className={getInputClass('schengen_departure_date')}
                  />
                </div>
              </div>
            </div>

            {/* SCHENGEN BLOQUE 7: ANTECEDENTES Y PERMISOS (CASILLAS 29 Y 30) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-sky-600" />
                <span>Casillas 29-30: Impresiones Dactilares y Permisos de Entrada</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">29. Impresiones dactilares tomadas anteriormente para solicitudes de visado Schengen</label>
                  <select
                    name="fingerprints_taken"
                    value={dynamicFields['fingerprints_taken'] || ''}
                    onChange={(e) => {
                      handleFieldChange('fingerprints_taken', e.target.value);
                      handleFieldBlur('fingerprints_taken', e.target.value);
                    }}
                    className={getInputClass('fingerprints_taken')}
                  >
                    <option value="">¿Huellas dactilares tomadas anteriormente?</option>
                    <option value="NO">NO</option>
                    <option value="SÍ">SÍ</option>
                  </select>
                </div>

                {dynamicFields['fingerprints_taken'] === 'SÍ' && (
                  <>
                    <div>
                      <input
                        type="date"
                        name="fingerprints_date"
                        value={dynamicFields['fingerprints_date'] || ''}
                        onChange={(e) => handleFieldChange('fingerprints_date', e.target.value)}
                        onBlur={(e) => handleFieldBlur('fingerprints_date', e.target.value)}
                        placeholder="Fecha, si se conoce"
                        className={getInputClass('fingerprints_date')}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="fingerprints_visa_number"
                        value={dynamicFields['fingerprints_visa_number'] || ''}
                        onChange={(e) => handleFieldChange('fingerprints_visa_number', e.target.value)}
                        onBlur={(e) => handleFieldBlur('fingerprints_visa_number', e.target.value)}
                        placeholder="Número de visado, si se conoce"
                        className={getInputClass('fingerprints_visa_number')}
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">30. Permiso de entrada al país de destino final, si ha lugar</label>
                  <textarea
                    rows={2}
                    name="final_destination_permit"
                    value={dynamicFields['final_destination_permit'] || ''}
                    onChange={(e) => handleFieldChange('final_destination_permit', e.target.value)}
                    onBlur={(e) => handleFieldBlur('final_destination_permit', e.target.value)}
                    placeholder="Expedido por... Válido desde... Hasta..."
                    className={getInputClass('final_destination_permit')}
                  />
                </div>
              </div>
            </div>

            {/* SCHENGEN BLOQUE 8: INVITACIÓN / ALOJAMIENTO / ORGANIZACIÓN (CASILLAS 31 Y 32) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Building className="w-4 h-4 text-sky-600" />
                <span>Casillas 31-32: Invitación, Hotel u Organización en el Estado Miembro</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">31. Apellido(s) y nombre(s) de la persona que invita / Nombre del hotel u hostal</label>
                  <textarea
                    rows={3}
                    name="host_invitation_details"
                    value={dynamicFields['host_invitation_details'] || ''}
                    onChange={(e) => handleFieldChange('host_invitation_details', e.target.value)}
                    onBlur={(e) => handleFieldBlur('host_invitation_details', e.target.value)}
                    placeholder="Nombre del hotel o persona que emitió la invitación, domicilio postal, dirección de correo electrónico y número(s) de teléfono"
                    className={getInputClass('host_invitation_details')}
                  />
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">32. Nombre y dirección de la empresa u organización que ha emitido la invitación</label>
                  <textarea
                    rows={3}
                    name="company_invitation_details"
                    value={dynamicFields['company_invitation_details'] || ''}
                    onChange={(e) => handleFieldChange('company_invitation_details', e.target.value)}
                    onBlur={(e) => handleFieldBlur('company_invitation_details', e.target.value)}
                    placeholder="Nombre y dirección de la empresa/organización, persona de contacto y número(s) de teléfono"
                    className={getInputClass('company_invitation_details')}
                  />
                </div>
              </div>
            </div>

            {/* SCHENGEN BLOQUE 9: GASTOS DE VIAJE Y SUBSISTENCIA (CASILLA 33) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span>Casilla 33: Gastos de Viaje y Medios de Subsistencia</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">33. Los gastos de viaje y subsistencia del solicitante durante su estancia están cubiertos por:</label>
                  <select
                    name="travel_expenses_covered_by"
                    value={dynamicFields['travel_expenses_covered_by'] || ''}
                    onChange={(e) => {
                      handleFieldChange('travel_expenses_covered_by', e.target.value);
                      handleFieldBlur('travel_expenses_covered_by', e.target.value);
                    }}
                    className={getInputClass('travel_expenses_covered_by')}
                  >
                    <option value="">¿Quién cubre los gastos de viaje?</option>
                    <option value="Por el propio solicitante">Por el propio solicitante</option>
                    <option value="Por un patrocinador (anfitrión, empresa u organización)">Por un patrocinador (anfitrión, empresa u organización)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Medios de subsistencia y detalles de cobertura</label>
                  <textarea
                    rows={3}
                    name="means_of_support"
                    value={dynamicFields['means_of_support'] || ''}
                    onChange={(e) => handleFieldChange('means_of_support', e.target.value)}
                    onBlur={(e) => handleFieldBlur('means_of_support', e.target.value)}
                    placeholder="Especificar si es Efectivo, Tarjeta de crédito, Alojamiento ya pagado, Transporte pagado, Patrocinador, etc."
                    className={getInputClass('means_of_support')}
                  />
                </div>
              </div>
            </div>

            {/* SCHENGEN BLOQUE 10: TERCERA PERSONA CUMPLIMENTADORA (CASILLA 34) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>Casilla 34: Datos de la persona que cumplimenta el impreso (si difiere)</span>
              </h2>

              <div>
                <textarea
                  rows={2}
                  name="third_party_filler"
                  value={dynamicFields['third_party_filler'] || ''}
                  onChange={(e) => handleFieldChange('third_party_filler', e.target.value)}
                  onBlur={(e) => handleFieldBlur('third_party_filler', e.target.value)}
                  placeholder="Apellidos, nombre, domicilio postal, dirección de correo electrónico y número de teléfono de la persona que llena la solicitud"
                  className={getInputClass('third_party_filler')}
                />
              </div>
            </div>
          </div>
        ) : (
          /* FORMULARIO USA / CANADA (DS-160 / IMM-5257) */
          <div className="space-y-6">
            
            {/* 1. INFORMACIÓN PERSONAL */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <User className="w-4 h-4 text-sky-600" />
                <span>1. Información Personal</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={dynamicFields['name'] || visaData.applicant_name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={(e) => handleFieldBlur('name', e.target.value)}
                    placeholder="Nombre(s) completos"
                    className={getInputClass('name')}
                  />
                </div>

                <div>
                  <input
                    type="date"
                    name="birthday"
                    value={dynamicFields['birthday'] || ''}
                    onChange={(e) => handleFieldChange('birthday', e.target.value)}
                    onBlur={(e) => handleFieldBlur('birthday', e.target.value)}
                    className={getInputClass('birthday')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="born_city"
                    value={dynamicFields['born_city'] || ''}
                    onChange={(e) => handleFieldChange('born_city', e.target.value)}
                    onBlur={(e) => handleFieldBlur('born_city', e.target.value)}
                    placeholder="Lugar de nacimiento (ciudad, provincia, país)"
                    className={getInputClass('born_city')}
                  />
                </div>

                <div>
                  <select
                    name="marital_status"
                    value={dynamicFields['marital_status'] || ''}
                    onChange={(e) => {
                      handleFieldChange('marital_status', e.target.value);
                      handleFieldBlur('marital_status', e.target.value);
                    }}
                    className={getInputClass('marital_status')}
                  >
                    <option value="">Estatus marital</option>
                    <option value="Soltero">Soltero</option>
                    <option value="Casado">Casado</option>
                    <option value="Divorciado">Divorciado</option>
                    <option value="Viudo">Viudo</option>
                    <option value="Unión civil">Unión civil</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    name="morefullname"
                    value={dynamicFields['morefullname'] || ''}
                    onChange={(e) => handleFieldChange('morefullname', e.target.value)}
                    onBlur={(e) => handleFieldBlur('morefullname', e.target.value)}
                    placeholder="Otro nombre/apellido usado"
                    className={getInputClass('morefullname')}
                  />
                </div>

                <div>
                  <select
                    name="sex"
                    value={dynamicFields['sex'] || ''}
                    onChange={(e) => {
                      handleFieldChange('sex', e.target.value);
                      handleFieldBlur('sex', e.target.value);
                    }}
                    className={getInputClass('sex')}
                  >
                    <option value="">Sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    name="another_nationality"
                    value={dynamicFields['another_nationality'] || ''}
                    onChange={(e) => handleFieldChange('another_nationality', e.target.value)}
                    onBlur={(e) => handleFieldBlur('another_nationality', e.target.value)}
                    placeholder="Origen de nacionalidad"
                    className={getInputClass('another_nationality')}
                  />
                </div>

                <div>
                  <select
                    name="has_other_nationality"
                    value={dynamicFields['has_other_nationality'] || ''}
                    onChange={(e) => {
                      handleFieldChange('has_other_nationality', e.target.value);
                      handleFieldBlur('has_other_nationality', e.target.value);
                    }}
                    className={getInputClass('has_other_nationality')}
                  >
                    <option value="">¿Mantiene otra nacionalidad?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['has_other_nationality'] === 'Sí' && (
                  <>
                    <div>
                      <input
                        type="text"
                        name="what_nationality"
                        value={dynamicFields['what_nationality'] || ''}
                        onChange={(e) => handleFieldChange('what_nationality', e.target.value)}
                        onBlur={(e) => handleFieldBlur('what_nationality', e.target.value)}
                        placeholder="¿Cuál(es)?"
                        className={getInputClass('what_nationality')}
                      />
                    </div>

                    <div>
                      <select
                        name="has_other_passport"
                        value={dynamicFields['has_other_passport'] || ''}
                        onChange={(e) => {
                          handleFieldChange('has_other_passport', e.target.value);
                          handleFieldBlur('has_other_passport', e.target.value);
                        }}
                        className={getInputClass('has_other_passport')}
                      >
                        <option value="">¿Tiene pasaporte de otra nacionalidad?</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <select
                    name="is_resident_other_country"
                    value={dynamicFields['is_resident_other_country'] || ''}
                    onChange={(e) => {
                      handleFieldChange('is_resident_other_country', e.target.value);
                      handleFieldBlur('is_resident_other_country', e.target.value);
                    }}
                    className={getInputClass('is_resident_other_country')}
                  >
                    <option value="">¿Es residente permanente de otro país?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['is_resident_other_country'] === 'Sí' && (
                  <div>
                    <input
                      type="text"
                      name="permanent_residence_country"
                      value={dynamicFields['permanent_residence_country'] || ''}
                      onChange={(e) => handleFieldChange('permanent_residence_country', e.target.value)}
                      onBlur={(e) => handleFieldBlur('permanent_residence_country', e.target.value)}
                      placeholder="País/países de residencia permanente"
                      className={getInputClass('permanent_residence_country')}
                    />
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    name="cedula"
                    value={dynamicFields['cedula'] || ''}
                    onChange={(e) => handleFieldChange('cedula', e.target.value)}
                    onBlur={(e) => handleFieldBlur('cedula', e.target.value)}
                    placeholder="Número de cédula"
                    className={getInputClass('cedula')}
                  />
                </div>

                <div>
                  <select
                    name="processing_location"
                    value={dynamicFields['processing_location'] || ''}
                    onChange={(e) => {
                      handleFieldChange('processing_location', e.target.value);
                      handleFieldBlur('processing_location', e.target.value);
                    }}
                    className={getInputClass('processing_location')}
                  >
                    <option value="">Lugar donde se tramita la visa</option>
                    <option value="Quito">Quito</option>
                    <option value="Guayaquil">Guayaquil</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. INFORMACIÓN DEL VIAJE 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-sky-600" />
                <span>2. Información del Viaje 1</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    name="travel_date"
                    value={dynamicFields['travel_date'] || ''}
                    onChange={(e) => handleFieldChange('travel_date', e.target.value)}
                    onBlur={(e) => handleFieldBlur('travel_date', e.target.value)}
                    placeholder="Fecha aproximada de viaje"
                    className={getInputClass('travel_date')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="stay_duration"
                    value={dynamicFields['stay_duration'] || ''}
                    onChange={(e) => handleFieldChange('stay_duration', e.target.value)}
                    onBlur={(e) => handleFieldBlur('stay_duration', e.target.value)}
                    placeholder="Tiempo de estadía"
                    className={getInputClass('stay_duration')}
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="address_in_usa"
                    value={dynamicFields['address_in_usa'] || ''}
                    onChange={(e) => handleFieldChange('address_in_usa', e.target.value)}
                    onBlur={(e) => handleFieldBlur('address_in_usa', e.target.value)}
                    placeholder={`Dirección en ${countryName}`}
                    className={getInputClass('address_in_usa')}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 mb-3">¿Quién paga el viaje?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="payer_name"
                      value={dynamicFields['payer_name'] || ''}
                      onChange={(e) => handleFieldChange('payer_name', e.target.value)}
                      onBlur={(e) => handleFieldBlur('payer_name', e.target.value)}
                      placeholder="Nombre completo"
                      className={getInputClass('payer_name')}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="payer_phone"
                      value={dynamicFields['payer_phone'] || ''}
                      onChange={(e) => handleFieldChange('payer_phone', e.target.value)}
                      onBlur={(e) => handleFieldBlur('payer_phone', e.target.value)}
                      placeholder="Número telefónico"
                      className={getInputClass('payer_phone')}
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="payer_email"
                      value={dynamicFields['payer_email'] || ''}
                      onChange={(e) => handleFieldChange('payer_email', e.target.value)}
                      onBlur={(e) => handleFieldBlur('payer_email', e.target.value)}
                      placeholder="Correo electrónico"
                      className={getInputClass('payer_email')}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="payer_relationship"
                      value={dynamicFields['payer_relationship'] || ''}
                      onChange={(e) => handleFieldChange('payer_relationship', e.target.value)}
                      onBlur={(e) => handleFieldBlur('payer_relationship', e.target.value)}
                      placeholder="Relación con esa persona"
                      className={getInputClass('payer_relationship')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="payer_address"
                      value={dynamicFields['payer_address'] || ''}
                      onChange={(e) => handleFieldChange('payer_address', e.target.value)}
                      onBlur={(e) => handleFieldBlur('payer_address', e.target.value)}
                      placeholder="Dirección"
                      className={getInputClass('payer_address')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. INFORMACIÓN DEL VIAJE 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-sky-600" />
                <span>3. Información del Viaje 2</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <select
                    name="has_other_persons"
                    value={dynamicFields['has_other_persons'] || ''}
                    onChange={(e) => {
                      handleFieldChange('has_other_persons', e.target.value);
                      handleFieldBlur('has_other_persons', e.target.value);
                    }}
                    className={getInputClass('has_other_persons')}
                  >
                    <option value="">¿Otras personas viajarán con usted?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['has_other_persons'] === 'Sí' && (
                  <>
                    <div>
                      <select
                        name="has_group"
                        value={dynamicFields['has_group'] || ''}
                        onChange={(e) => {
                          handleFieldChange('has_group', e.target.value);
                          handleFieldBlur('has_group', e.target.value);
                        }}
                        className={getInputClass('has_group')}
                      >
                        <option value="">¿viajará como parte de un grupo o una organización?</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    {dynamicFields['has_group'] === 'Sí' && (
                      <div>
                        <input
                          type="text"
                          name="name_group"
                          value={dynamicFields['name_group'] || ''}
                          onChange={(e) => handleFieldChange('name_group', e.target.value)}
                          onBlur={(e) => handleFieldBlur('name_group', e.target.value)}
                          placeholder="Nombre del grupo/organización"
                          className={getInputClass('name_group')}
                        />
                      </div>
                    )}

                    {dynamicFields['has_group'] === 'No' && (
                      <div>
                        <textarea
                          rows={3}
                          name="persons_details"
                          value={dynamicFields['persons_details'] || ''}
                          onChange={(e) => handleFieldChange('persons_details', e.target.value)}
                          onBlur={(e) => handleFieldBlur('persons_details', e.target.value)}
                          placeholder="indicar los nombres completos y la relación que tiene con el/los acompañante/s"
                          className={getInputClass('persons_details')}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 4. INFORMACIÓN DEL VIAJE 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-sky-600" />
                <span>4. Información del Viaje 3</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    name="has_been_usa"
                    value={dynamicFields['has_been_usa'] || ''}
                    onChange={(e) => {
                      handleFieldChange('has_been_usa', e.target.value);
                      handleFieldBlur('has_been_usa', e.target.value);
                    }}
                    className={getInputClass('has_been_usa')}
                  >
                    <option value="">¿Alguna vez ha estado en los {countryName}?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['has_been_usa'] === 'Sí' && (
                  <>
                    <div>
                      <input
                        type="date"
                        name="date_been_usa"
                        value={dynamicFields['date_been_usa'] || ''}
                        onChange={(e) => handleFieldChange('date_been_usa', e.target.value)}
                        onBlur={(e) => handleFieldBlur('date_been_usa', e.target.value)}
                        placeholder="Fecha de llegada"
                        className={getInputClass('date_been_usa')}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="days_been_usa"
                        value={dynamicFields['days_been_usa'] || ''}
                        onChange={(e) => handleFieldChange('days_been_usa', e.target.value)}
                        onBlur={(e) => handleFieldBlur('days_been_usa', e.target.value)}
                        placeholder="Días de la estadía"
                        className={getInputClass('days_been_usa')}
                      />
                    </div>
                  </>
                )}

                <div>
                  <select
                    name="has_usa_licence"
                    value={dynamicFields['has_usa_licence'] || ''}
                    onChange={(e) => {
                      handleFieldChange('has_usa_licence', e.target.value);
                      handleFieldBlur('has_usa_licence', e.target.value);
                    }}
                    className={getInputClass('has_usa_licence')}
                  >
                    <option value="">¿Mantiene o ha mantenido una licencia de conducir en los {countryName}?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['has_usa_licence'] === 'Sí' && (
                  <>
                    <div>
                      <input
                        type="text"
                        name="licence_usa"
                        value={dynamicFields['licence_usa'] || ''}
                        onChange={(e) => handleFieldChange('licence_usa', e.target.value)}
                        onBlur={(e) => handleFieldBlur('licence_usa', e.target.value)}
                        placeholder="Número de la licencia de conducir"
                        className={getInputClass('licence_usa')}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="licence_usa_state"
                        value={dynamicFields['licence_usa_state'] || ''}
                        onChange={(e) => handleFieldChange('licence_usa_state', e.target.value)}
                        onBlur={(e) => handleFieldBlur('licence_usa_state', e.target.value)}
                        placeholder="Estado que la emitió"
                        className={getInputClass('licence_usa_state')}
                      />
                    </div>
                  </>
                )}

                <div>
                  <select
                    name="has_emited_visa"
                    value={dynamicFields['has_emited_visa'] || ''}
                    onChange={(e) => {
                      handleFieldChange('has_emited_visa', e.target.value);
                      handleFieldBlur('has_emited_visa', e.target.value);
                    }}
                    className={getInputClass('has_emited_visa')}
                  >
                    <option value="">¿Alguna vez se le ha emitido una visa {isUsa ? 'americana' : 'canadiense'}?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['has_emited_visa'] === 'Sí' && (
                  <>
                    <div>
                      <input
                        type="date"
                        name="date_emited_visa"
                        value={dynamicFields['date_emited_visa'] || ''}
                        onChange={(e) => handleFieldChange('date_emited_visa', e.target.value)}
                        onBlur={(e) => handleFieldBlur('date_emited_visa', e.target.value)}
                        placeholder="Fecha última emisión"
                        className={getInputClass('date_emited_visa')}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="no_emited_visa"
                        value={dynamicFields['no_emited_visa'] || ''}
                        onChange={(e) => handleFieldChange('no_emited_visa', e.target.value)}
                        onBlur={(e) => handleFieldBlur('no_emited_visa', e.target.value)}
                        placeholder="Número de visa"
                        className={getInputClass('no_emited_visa')}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <select
                        name="has_fingerprint"
                        value={dynamicFields['has_fingerprint'] || ''}
                        onChange={(e) => {
                          handleFieldChange('has_fingerprint', e.target.value);
                          handleFieldBlur('has_fingerprint', e.target.value);
                        }}
                        className={getInputClass('has_fingerprint')}
                      >
                        <option value="">¿Se registraron las huellas dactilares de sus diez dedos?</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <select
                        name="visa_lost"
                        value={dynamicFields['visa_lost'] || ''}
                        onChange={(e) => {
                          handleFieldChange('visa_lost', e.target.value);
                          handleFieldBlur('visa_lost', e.target.value);
                        }}
                        className={getInputClass('visa_lost')}
                      >
                        <option value="">¿Su visa se le ha perdido o ha sido robada?</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    {dynamicFields['visa_lost'] === 'Sí' && (
                      <>
                        <input
                          type="date"
                          name="visa_lost_date"
                          value={dynamicFields['visa_lost_date'] || ''}
                          onChange={(e) => handleFieldChange('visa_lost_date', e.target.value)}
                          onBlur={(e) => handleFieldBlur('visa_lost_date', e.target.value)}
                          placeholder="Fecha del suceso"
                          className={getInputClass('visa_lost_date')}
                        />
                        <textarea
                          rows={2}
                          name="visa_lost_details"
                          value={dynamicFields['visa_lost_details'] || ''}
                          onChange={(e) => handleFieldChange('visa_lost_details', e.target.value)}
                          onBlur={(e) => handleFieldBlur('visa_lost_details', e.target.value)}
                          placeholder="Explique qué ocurrió"
                          className={getInputClass('visa_lost_details')}
                        />
                      </>
                    )}

                    <div className="md:col-span-2">
                      <select
                        name="visa_revoked"
                        value={dynamicFields['visa_revoked'] || ''}
                        onChange={(e) => {
                          handleFieldChange('visa_revoked', e.target.value);
                          handleFieldBlur('visa_revoked', e.target.value);
                        }}
                        className={getInputClass('visa_revoked')}
                      >
                        <option value="">¿Su visa ha sido cancelada o revocada?</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    {dynamicFields['visa_revoked'] === 'Sí' && (
                      <div className="md:col-span-2">
                        <textarea
                          rows={2}
                          name="visa_revoked_details"
                          value={dynamicFields['visa_revoked_details'] || ''}
                          onChange={(e) => handleFieldChange('visa_revoked_details', e.target.value)}
                          onBlur={(e) => handleFieldBlur('visa_revoked_details', e.target.value)}
                          placeholder="Explique qué ocurrió"
                          className={getInputClass('visa_revoked_details')}
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="md:col-span-2">
                  <select
                    name="visa_denied"
                    value={dynamicFields['visa_denied'] || ''}
                    onChange={(e) => {
                      handleFieldChange('visa_denied', e.target.value);
                      handleFieldBlur('visa_denied', e.target.value);
                    }}
                    className={getInputClass('visa_denied')}
                  >
                    <option value="">¿Alguna vez le han negado la visa, le han negado la admisión o le han retirado su solicitud?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['visa_denied'] === 'Sí' && (
                  <div className="md:col-span-2">
                    <textarea
                      rows={2}
                      name="visa_denied_details"
                      value={dynamicFields['visa_denied_details'] || ''}
                      onChange={(e) => handleFieldChange('visa_denied_details', e.target.value)}
                      onBlur={(e) => handleFieldBlur('visa_denied_details', e.target.value)}
                      placeholder="Si es afirmativa, explique"
                      className={getInputClass('visa_denied_details')}
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <select
                    name="immigrant_petition"
                    value={dynamicFields['immigrant_petition'] || ''}
                    onChange={(e) => {
                      handleFieldChange('immigrant_petition', e.target.value);
                      handleFieldBlur('immigrant_petition', e.target.value);
                    }}
                    className={getInputClass('immigrant_petition')}
                  >
                    <option value="">¿Alguien ha presentado alguna vez una petición de inmigrante en su nombre?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['immigrant_petition'] === 'Sí' && (
                  <div className="md:col-span-2">
                    <textarea
                      rows={2}
                      name="immigrant_petition_details"
                      value={dynamicFields['immigrant_petition_details'] || ''}
                      onChange={(e) => handleFieldChange('immigrant_petition_details', e.target.value)}
                      onBlur={(e) => handleFieldBlur('immigrant_petition_details', e.target.value)}
                      placeholder="En caso afirmativa, explique"
                      className={getInputClass('immigrant_petition_details')}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 5. DOMICILIO E INFORMACIÓN DE CONTACTO */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Home className="w-4 h-4 text-sky-600" />
                <span>5. Domicilio e Información de Contacto</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="home_address"
                    value={dynamicFields['home_address'] || ''}
                    onChange={(e) => handleFieldChange('home_address', e.target.value)}
                    onBlur={(e) => handleFieldBlur('home_address', e.target.value)}
                    placeholder="Dirección completa de su domicilio (avenida, calles, código postal)"
                    className={getInputClass('home_address')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="home_city"
                    value={dynamicFields['home_city'] || ''}
                    onChange={(e) => handleFieldChange('home_city', e.target.value)}
                    onBlur={(e) => handleFieldBlur('home_city', e.target.value)}
                    placeholder="Ciudad"
                    className={getInputClass('home_city')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="home_province"
                    value={dynamicFields['home_province'] || ''}
                    onChange={(e) => handleFieldChange('home_province', e.target.value)}
                    onBlur={(e) => handleFieldBlur('home_province', e.target.value)}
                    placeholder="Provincia/Estado"
                    className={getInputClass('home_province')}
                  />
                </div>

                <div className="md:col-span-2">
                  <select
                    name="same_postal_address"
                    value={dynamicFields['same_postal_address'] || ''}
                    onChange={(e) => {
                      handleFieldChange('same_postal_address', e.target.value);
                      handleFieldBlur('same_postal_address', e.target.value);
                    }}
                    className={getInputClass('same_postal_address')}
                  >
                    <option value="">¿Su dirección postal es la misma que su domicilio?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['same_postal_address'] === 'No' && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        name="postal_address"
                        value={dynamicFields['postal_address'] || ''}
                        onChange={(e) => handleFieldChange('postal_address', e.target.value)}
                        onBlur={(e) => handleFieldBlur('postal_address', e.target.value)}
                        placeholder="Dirección postal completa"
                        className={getInputClass('postal_address')}
                      />
                    </div>
                    <input
                      type="text"
                      name="postal_city"
                      value={dynamicFields['postal_city'] || ''}
                      onChange={(e) => handleFieldChange('postal_city', e.target.value)}
                      onBlur={(e) => handleFieldBlur('postal_city', e.target.value)}
                      placeholder="Ciudad"
                      className={getInputClass('postal_city')}
                    />
                    <input
                      type="text"
                      name="postal_province"
                      value={dynamicFields['postal_province'] || ''}
                      onChange={(e) => handleFieldChange('postal_province', e.target.value)}
                      onBlur={(e) => handleFieldBlur('postal_province', e.target.value)}
                      placeholder="Provincia/Estado"
                      className={getInputClass('postal_province')}
                    />
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        name="postal_zip"
                        value={dynamicFields['postal_zip'] || ''}
                        onChange={(e) => handleFieldChange('postal_zip', e.target.value)}
                        onBlur={(e) => handleFieldBlur('postal_zip', e.target.value)}
                        placeholder="Código postal"
                        className={getInputClass('postal_zip')}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    name="phone_primary"
                    value={dynamicFields['phone_primary'] || ''}
                    onChange={(e) => handleFieldChange('phone_primary', e.target.value)}
                    onBlur={(e) => handleFieldBlur('phone_primary', e.target.value)}
                    placeholder="Número telefónico primario"
                    className={getInputClass('phone_primary')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="phone_secondary"
                    value={dynamicFields['phone_secondary'] || ''}
                    onChange={(e) => handleFieldChange('phone_secondary', e.target.value)}
                    onBlur={(e) => handleFieldBlur('phone_secondary', e.target.value)}
                    placeholder="Número telefónico secundario"
                    className={getInputClass('phone_secondary')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="phone_work"
                    value={dynamicFields['phone_work'] || ''}
                    onChange={(e) => handleFieldChange('phone_work', e.target.value)}
                    onBlur={(e) => handleFieldBlur('phone_work', e.target.value)}
                    placeholder="Número telefónico laboral"
                    className={getInputClass('phone_work')}
                  />
                </div>

                <div>
                  <select
                    name="other_phones_used"
                    value={dynamicFields['other_phones_used'] || ''}
                    onChange={(e) => {
                      handleFieldChange('other_phones_used', e.target.value);
                      handleFieldBlur('other_phones_used', e.target.value);
                    }}
                    className={getInputClass('other_phones_used')}
                  >
                    <option value="">¿Ha usado algún otro número telefónico en los últimos 5 años?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['other_phones_used'] === 'Sí' && (
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="other_phones_details"
                      value={dynamicFields['other_phones_details'] || ''}
                      onChange={(e) => handleFieldChange('other_phones_details', e.target.value)}
                      onBlur={(e) => handleFieldBlur('other_phones_details', e.target.value)}
                      placeholder="Indique cuáles"
                      className={getInputClass('other_phones_details')}
                    />
                  </div>
                )}

                <div>
                  <input
                    type="email"
                    name="email_primary"
                    value={dynamicFields['email_primary'] || ''}
                    onChange={(e) => handleFieldChange('email_primary', e.target.value)}
                    onBlur={(e) => handleFieldBlur('email_primary', e.target.value)}
                    placeholder="Correo electrónico"
                    className={getInputClass('email_primary')}
                  />
                </div>

                <div>
                  <select
                    name="other_emails_used"
                    value={dynamicFields['other_emails_used'] || ''}
                    onChange={(e) => {
                      handleFieldChange('other_emails_used', e.target.value);
                      handleFieldBlur('other_emails_used', e.target.value);
                    }}
                    className={getInputClass('other_emails_used')}
                  >
                    <option value="">¿Ha usado algún otro correo electrónico en los últimos 5 años?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['other_emails_used'] === 'Sí' && (
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="other_emails_details"
                      value={dynamicFields['other_emails_details'] || ''}
                      onChange={(e) => handleFieldChange('other_emails_details', e.target.value)}
                      onBlur={(e) => handleFieldBlur('other_emails_details', e.target.value)}
                      placeholder="Indique cuáles"
                      className={getInputClass('other_emails_details')}
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <select
                    name="social_media_presence"
                    value={dynamicFields['social_media_presence'] || ''}
                    onChange={(e) => {
                      handleFieldChange('social_media_presence', e.target.value);
                      handleFieldBlur('social_media_presence', e.target.value);
                    }}
                    className={getInputClass('social_media_presence')}
                  >
                    <option value="">¿Mantiene presencia en alguna de las redes sociales?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['social_media_presence'] === 'Sí' && (
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="social_media_details"
                      value={dynamicFields['social_media_details'] || ''}
                      onChange={(e) => handleFieldChange('social_media_details', e.target.value)}
                      onBlur={(e) => handleFieldBlur('social_media_details', e.target.value)}
                      placeholder="Indique la red social e identificador"
                      className={getInputClass('social_media_details')}
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <select
                    name="other_web_presence"
                    value={dynamicFields['other_web_presence'] || ''}
                    onChange={(e) => {
                      handleFieldChange('other_web_presence', e.target.value);
                      handleFieldBlur('other_web_presence', e.target.value);
                    }}
                    className={getInputClass('other_web_presence')}
                  >
                    <option value="">¿Desea proporcionar información sobre otros sitios web o apps que haya usado en los últimos 5 años?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['other_web_presence'] === 'Sí' && (
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="other_web_details"
                      value={dynamicFields['other_web_details'] || ''}
                      onChange={(e) => handleFieldChange('other_web_details', e.target.value)}
                      onBlur={(e) => handleFieldBlur('other_web_details', e.target.value)}
                      placeholder="Indique el sitio y su identificador"
                      className={getInputClass('other_web_details')}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 6. INFORMACIÓN DEL PASAPORTE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>6. Información del Pasaporte</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="passport_number"
                    value={dynamicFields['passport_number'] || visaData.passport_number || ''}
                    onChange={(e) => handleFieldChange('passport_number', e.target.value)}
                    onBlur={(e) => handleFieldBlur('passport_number', e.target.value)}
                    placeholder="Número de pasaporte"
                    className={getInputClass('passport_number')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="passport_country_city"
                    value={dynamicFields['passport_country_city'] || ''}
                    onChange={(e) => handleFieldChange('passport_country_city', e.target.value)}
                    onBlur={(e) => handleFieldBlur('passport_country_city', e.target.value)}
                    placeholder="País y ciudad de emisión"
                    className={getInputClass('passport_country_city')}
                  />
                </div>

                <div>
                  <input
                    type="date"
                    name="passport_issue_date"
                    value={dynamicFields['passport_issue_date'] || ''}
                    onChange={(e) => handleFieldChange('passport_issue_date', e.target.value)}
                    onBlur={(e) => handleFieldBlur('passport_issue_date', e.target.value)}
                    placeholder="Fecha de emisión"
                    className={getInputClass('passport_issue_date')}
                  />
                </div>

                <div>
                  <input
                    type="date"
                    name="passport_expiry_date"
                    value={dynamicFields['passport_expiry_date'] || ''}
                    onChange={(e) => handleFieldChange('passport_expiry_date', e.target.value)}
                    onBlur={(e) => handleFieldBlur('passport_expiry_date', e.target.value)}
                    placeholder="Fecha de expiración"
                    className={getInputClass('passport_expiry_date')}
                  />
                </div>

                <div className="md:col-span-2">
                  <select
                    name="passport_lost"
                    value={dynamicFields['passport_lost'] || ''}
                    onChange={(e) => {
                      handleFieldChange('passport_lost', e.target.value);
                      handleFieldBlur('passport_lost', e.target.value);
                    }}
                    className={getInputClass('passport_lost')}
                  >
                    <option value="">¿Alguna vez su pasaporte se le ha perdido o ha sido robado?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['passport_lost'] === 'Sí' && (
                  <>
                    <input
                      type="text"
                      name="lost_passport_number"
                      value={dynamicFields['lost_passport_number'] || ''}
                      onChange={(e) => handleFieldChange('lost_passport_number', e.target.value)}
                      onBlur={(e) => handleFieldBlur('lost_passport_number', e.target.value)}
                      placeholder="Número de pasaporte/documento de viaje"
                      className={getInputClass('lost_passport_number')}
                    />
                    <input
                      type="text"
                      name="lost_passport_country"
                      value={dynamicFields['lost_passport_country'] || ''}
                      onChange={(e) => handleFieldChange('lost_passport_country', e.target.value)}
                      onBlur={(e) => handleFieldBlur('lost_passport_country', e.target.value)}
                      placeholder="País/autoridad que emitió el pasaporte/documento"
                      className={getInputClass('lost_passport_country')}
                    />
                    <div className="md:col-span-2">
                      <textarea
                        rows={2}
                        name="lost_passport_details"
                        value={dynamicFields['lost_passport_details'] || ''}
                        onChange={(e) => handleFieldChange('lost_passport_details', e.target.value)}
                        onBlur={(e) => handleFieldBlur('lost_passport_details', e.target.value)}
                        placeholder="Explique qué ocurrió"
                        className={getInputClass('lost_passport_details')}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 7. INFORMACIÓN DE CONTACTO EN LOS ESTADOS UNIDOS / CANADÁ */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Building className="w-4 h-4 text-sky-600" />
                <span>7. Información de contacto en los {countryName}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="us_contact_name"
                    value={dynamicFields['us_contact_name'] || ''}
                    onChange={(e) => handleFieldChange('us_contact_name', e.target.value)}
                    onBlur={(e) => handleFieldBlur('us_contact_name', e.target.value)}
                    placeholder="Nombres completos de quien lo recibirá"
                    className={getInputClass('us_contact_name')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="us_contact_organization"
                    value={dynamicFields['us_contact_organization'] || ''}
                    onChange={(e) => handleFieldChange('us_contact_organization', e.target.value)}
                    onBlur={(e) => handleFieldBlur('us_contact_organization', e.target.value)}
                    placeholder="Nombre de la organización/hotel que lo recibirá"
                    className={getInputClass('us_contact_organization')}
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="us_contact_relationship"
                    value={dynamicFields['us_contact_relationship'] || ''}
                    onChange={(e) => handleFieldChange('us_contact_relationship', e.target.value)}
                    onBlur={(e) => handleFieldBlur('us_contact_relationship', e.target.value)}
                    placeholder="Indicar la relación que tiene con la persona u organización"
                    className={getInputClass('us_contact_relationship')}
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="us_contact_address"
                    value={dynamicFields['us_contact_address'] || ''}
                    onChange={(e) => handleFieldChange('us_contact_address', e.target.value)}
                    onBlur={(e) => handleFieldBlur('us_contact_address', e.target.value)}
                    placeholder={`Dirección completa en los ${countryName}`}
                    className={getInputClass('us_contact_address')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="us_contact_city"
                    value={dynamicFields['us_contact_city'] || ''}
                    onChange={(e) => handleFieldChange('us_contact_city', e.target.value)}
                    onBlur={(e) => handleFieldBlur('us_contact_city', e.target.value)}
                    placeholder="Ciudad"
                    className={getInputClass('us_contact_city')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="us_contact_state"
                    value={dynamicFields['us_contact_state'] || ''}
                    onChange={(e) => handleFieldChange('us_contact_state', e.target.value)}
                    onBlur={(e) => handleFieldBlur('us_contact_state', e.target.value)}
                    placeholder="Estado"
                    className={getInputClass('us_contact_state')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="us_contact_zip"
                    value={dynamicFields['us_contact_zip'] || ''}
                    onChange={(e) => handleFieldChange('us_contact_zip', e.target.value)}
                    onBlur={(e) => handleFieldBlur('us_contact_zip', e.target.value)}
                    placeholder="Código postal"
                    className={getInputClass('us_contact_zip')}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="us_contact_phone"
                    value={dynamicFields['us_contact_phone'] || ''}
                    onChange={(e) => handleFieldChange('us_contact_phone', e.target.value)}
                    onBlur={(e) => handleFieldBlur('us_contact_phone', e.target.value)}
                    placeholder="Número telefónico"
                    className={getInputClass('us_contact_phone')}
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="email"
                    name="us_contact_email"
                    value={dynamicFields['us_contact_email'] || ''}
                    onChange={(e) => handleFieldChange('us_contact_email', e.target.value)}
                    onBlur={(e) => handleFieldBlur('us_contact_email', e.target.value)}
                    placeholder="Correo electrónico"
                    className={getInputClass('us_contact_email')}
                  />
                </div>
              </div>
            </div>

            {/* 8. INFORMACIÓN FAMILIAR */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>8. Información Familiar</span>
              </h2>

              <div className="space-y-4">
                {/* 1. Padre */}
                <div>
                  <p className="text-xs font-bold text-slate-800 mb-2">1. Padre</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="father_name"
                      value={dynamicFields['father_name'] || ''}
                      onChange={(e) => handleFieldChange('father_name', e.target.value)}
                      onBlur={(e) => handleFieldBlur('father_name', e.target.value)}
                      placeholder="Nombre completo del padre"
                      className={getInputClass('father_name')}
                    />
                    <input
                      type="date"
                      name="father_birthday"
                      value={dynamicFields['father_birthday'] || ''}
                      onChange={(e) => handleFieldChange('father_birthday', e.target.value)}
                      onBlur={(e) => handleFieldBlur('father_birthday', e.target.value)}
                      placeholder="Fecha de nacimiento (opcional)"
                      className={getInputClass('father_birthday')}
                    />
                    <div>
                      <select
                        name="father_in_usa"
                        value={dynamicFields['father_in_usa'] || ''}
                        onChange={(e) => {
                          handleFieldChange('father_in_usa', e.target.value);
                          handleFieldBlur('father_in_usa', e.target.value);
                        }}
                        className={getInputClass('father_in_usa')}
                      >
                        <option value="">¿Está su padre en los {countryName}?</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    {dynamicFields['father_in_usa'] === 'Sí' && (
                      <select
                        name="father_status"
                        value={dynamicFields['father_status'] || ''}
                        onChange={(e) => {
                          handleFieldChange('father_status', e.target.value);
                          handleFieldBlur('father_status', e.target.value);
                        }}
                        className={getInputClass('father_status')}
                      >
                        <option value="">¿Estatus en {countryName}?</option>
                        <option value="Ciudadano americano">Ciudadano americano</option>
                        <option value="Residente legal permanente">Residente legal permanente</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* 2. Madre */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 mb-2">2. Madre</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="mother_name"
                      value={dynamicFields['mother_name'] || ''}
                      onChange={(e) => handleFieldChange('mother_name', e.target.value)}
                      onBlur={(e) => handleFieldBlur('mother_name', e.target.value)}
                      placeholder="Nombre completo de la madre"
                      className={getInputClass('mother_name')}
                    />
                    <input
                      type="date"
                      name="mother_birthday"
                      value={dynamicFields['mother_birthday'] || ''}
                      onChange={(e) => handleFieldChange('mother_birthday', e.target.value)}
                      onBlur={(e) => handleFieldBlur('mother_birthday', e.target.value)}
                      placeholder="Fecha de nacimiento (opcional)"
                      className={getInputClass('mother_birthday')}
                    />
                    <div>
                      <select
                        name="mother_in_usa"
                        value={dynamicFields['mother_in_usa'] || ''}
                        onChange={(e) => {
                          handleFieldChange('mother_in_usa', e.target.value);
                          handleFieldBlur('mother_in_usa', e.target.value);
                        }}
                        className={getInputClass('mother_in_usa')}
                      >
                        <option value="">¿Está su madre en los {countryName}?</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    {dynamicFields['mother_in_usa'] === 'Sí' && (
                      <select
                        name="mother_status"
                        value={dynamicFields['mother_status'] || ''}
                        onChange={(e) => {
                          handleFieldChange('mother_status', e.target.value);
                          handleFieldBlur('mother_status', e.target.value);
                        }}
                        className={getInputClass('mother_status')}
                      >
                        <option value="">¿Estatus en {countryName}?</option>
                        <option value="Ciudadana americano">Ciudadana americano</option>
                        <option value="Residente legal permanente">Residente legal permanente</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* 3. Parientes inmediatos */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 mb-2">3. Parientes inmediatos</p>
                  <select
                    name="immediate_relatives_usa"
                    value={dynamicFields['immediate_relatives_usa'] || ''}
                    onChange={(e) => {
                      handleFieldChange('immediate_relatives_usa', e.target.value);
                      handleFieldBlur('immediate_relatives_usa', e.target.value);
                    }}
                    className={getInputClass('immediate_relatives_usa')}
                  >
                    <option value="">¿Tiene parientes inmediatos en los {countryName}?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>

                  {dynamicFields['immediate_relatives_usa'] === 'Sí' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      <input
                        type="text"
                        name="immediate_relative_name"
                        value={dynamicFields['immediate_relative_name'] || ''}
                        onChange={(e) => handleFieldChange('immediate_relative_name', e.target.value)}
                        onBlur={(e) => handleFieldBlur('immediate_relative_name', e.target.value)}
                        placeholder="Nombres completos"
                        className={getInputClass('immediate_relative_name')}
                      />
                      <input
                        type="text"
                        name="immediate_relative_relationship"
                        value={dynamicFields['immediate_relative_relationship'] || ''}
                        onChange={(e) => handleFieldChange('immediate_relative_relationship', e.target.value)}
                        onBlur={(e) => handleFieldBlur('immediate_relative_relationship', e.target.value)}
                        placeholder="Parentesco"
                        className={getInputClass('immediate_relative_relationship')}
                      />
                      <select
                        name="immediate_relative_status"
                        value={dynamicFields['immediate_relative_status'] || ''}
                        onChange={(e) => {
                          handleFieldChange('immediate_relative_status', e.target.value);
                          handleFieldBlur('immediate_relative_status', e.target.value);
                        }}
                        className={getInputClass('immediate_relative_status')}
                      >
                        <option value="">Indicar estatus</option>
                        <option value="Ciudadano americano">Ciudadano americano</option>
                        <option value="Residente legal permanente">Residente legal permanente</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 4. Divorciado/a */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 mb-2">4. Divorciado/a</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="previous_spouses"
                      value={dynamicFields['previous_spouses'] || ''}
                      onChange={(e) => {
                        handleFieldChange('previous_spouses', e.target.value);
                        handleFieldBlur('previous_spouses', e.target.value);
                      }}
                      className={getInputClass('previous_spouses')}
                    >
                      <option value="">¿Se ha divorciado con anterioridad?</option>
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>

                    {dynamicFields['previous_spouses'] === 'Sí' && (
                      <input
                        type="number"
                        name="previous_spouses_number"
                        value={dynamicFields['previous_spouses_number'] || ''}
                        onChange={(e) => handleFieldChange('previous_spouses_number', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_spouses_number', e.target.value)}
                        placeholder="Número de previos esposos/esposas"
                        className={getInputClass('previous_spouses_number')}
                      />
                    )}
                  </div>

                  {dynamicFields['previous_spouses'] === 'Sí' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <input
                        type="text"
                        name="previous_spouse1_name"
                        value={dynamicFields['previous_spouse1_name'] || ''}
                        onChange={(e) => handleFieldChange('previous_spouse1_name', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_spouse1_name', e.target.value)}
                        placeholder="Nombre completo del previo matrimonio 1"
                        className={getInputClass('previous_spouse1_name')}
                      />
                      <input
                        type="date"
                        name="previous_spouse1_birthday"
                        value={dynamicFields['previous_spouse1_birthday'] || ''}
                        onChange={(e) => handleFieldChange('previous_spouse1_birthday', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_spouse1_birthday', e.target.value)}
                        placeholder="Fecha de nacimiento"
                        className={getInputClass('previous_spouse1_birthday')}
                      />
                      <input
                        type="text"
                        name="previous_spouse1_country"
                        value={dynamicFields['previous_spouse1_country'] || ''}
                        onChange={(e) => handleFieldChange('previous_spouse1_country', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_spouse1_country', e.target.value)}
                        placeholder="País/región de origen"
                        className={getInputClass('previous_spouse1_country')}
                      />
                      <input
                        type="text"
                        name="previous_spouse1_city"
                        value={dynamicFields['previous_spouse1_city'] || ''}
                        onChange={(e) => handleFieldChange('previous_spouse1_city', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_spouse1_city', e.target.value)}
                        placeholder="Ciudad de nacimiento"
                        className={getInputClass('previous_spouse1_city')}
                      />
                      <input
                        type="text"
                        name="previous_spouse1_dates"
                        value={dynamicFields['previous_spouse1_dates'] || ''}
                        onChange={(e) => handleFieldChange('previous_spouse1_dates', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_spouse1_dates', e.target.value)}
                        placeholder="Fecha de casamiento y disolución"
                        className={getInputClass('previous_spouse1_dates')}
                      />
                      <input
                        type="text"
                        name="previous_spouse1_marriage_place"
                        value={dynamicFields['previous_spouse1_marriage_place'] || ''}
                        onChange={(e) => handleFieldChange('previous_spouse1_marriage_place', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_spouse1_marriage_place', e.target.value)}
                        placeholder="País/región donde el casamiento fue consumado"
                        className={getInputClass('previous_spouse1_marriage_place')}
                      />
                    </div>
                  )}
                </div>

                {/* 5. Cónyuge / Unión libre */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 mb-2">5. Cónyuge / Unión libre / Unión civil</p>
                  <select
                    name="spouse"
                    value={dynamicFields['spouse'] || ''}
                    onChange={(e) => {
                      handleFieldChange('spouse', e.target.value);
                      handleFieldBlur('spouse', e.target.value);
                    }}
                    className={getInputClass('spouse')}
                  >
                    <option value="">¿Cónyuge / Unión libre / Unión civil?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>

                  {dynamicFields['spouse'] === 'Sí' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <input
                        type="text"
                        name="spouse_name"
                        value={dynamicFields['spouse_name'] || ''}
                        onChange={(e) => handleFieldChange('spouse_name', e.target.value)}
                        onBlur={(e) => handleFieldBlur('spouse_name', e.target.value)}
                        placeholder="Nombres completos"
                        className={getInputClass('spouse_name')}
                      />
                      <input
                        type="date"
                        name="spouse_birthday"
                        value={dynamicFields['spouse_birthday'] || ''}
                        onChange={(e) => handleFieldChange('spouse_birthday', e.target.value)}
                        onBlur={(e) => handleFieldBlur('spouse_birthday', e.target.value)}
                        placeholder="Fecha de nacimiento"
                        className={getInputClass('spouse_birthday')}
                      />
                      <input
                        type="text"
                        name="spouse_country"
                        value={dynamicFields['spouse_country'] || ''}
                        onChange={(e) => handleFieldChange('spouse_country', e.target.value)}
                        onBlur={(e) => handleFieldBlur('spouse_country', e.target.value)}
                        placeholder="País/región de origen"
                        className={getInputClass('spouse_country')}
                      />
                      <input
                        type="text"
                        name="spouse_city"
                        value={dynamicFields['spouse_city'] || ''}
                        onChange={(e) => handleFieldChange('spouse_city', e.target.value)}
                        onBlur={(e) => handleFieldBlur('spouse_city', e.target.value)}
                        placeholder="Ciudad de nacimiento"
                        className={getInputClass('spouse_city')}
                      />
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          name="spouse_address"
                          value={dynamicFields['spouse_address'] || ''}
                          onChange={(e) => handleFieldChange('spouse_address', e.target.value)}
                          onBlur={(e) => handleFieldBlur('spouse_address', e.target.value)}
                          placeholder="Dirección de domicilio"
                          className={getInputClass('spouse_address')}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Viudo/a */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 mb-2">6. Viudo/a</p>
                  <select
                    name="widow"
                    value={dynamicFields['widow'] || ''}
                    onChange={(e) => {
                      handleFieldChange('widow', e.target.value);
                      handleFieldBlur('widow', e.target.value);
                    }}
                    className={getInputClass('widow')}
                  >
                    <option value="">¿Viudo/a?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>

                  {dynamicFields['widow'] === 'Sí' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <input
                        type="text"
                        name="widow_name"
                        value={dynamicFields['widow_name'] || ''}
                        onChange={(e) => handleFieldChange('widow_name', e.target.value)}
                        onBlur={(e) => handleFieldBlur('widow_name', e.target.value)}
                        placeholder="Nombres completos"
                        className={getInputClass('widow_name')}
                      />
                      <input
                        type="date"
                        name="widow_birthday"
                        value={dynamicFields['widow_birthday'] || ''}
                        onChange={(e) => handleFieldChange('widow_birthday', e.target.value)}
                        onBlur={(e) => handleFieldBlur('widow_birthday', e.target.value)}
                        placeholder="Fecha de nacimiento"
                        className={getInputClass('widow_birthday')}
                      />
                      <input
                        type="text"
                        name="widow_country"
                        value={dynamicFields['widow_country'] || ''}
                        onChange={(e) => handleFieldChange('widow_country', e.target.value)}
                        onBlur={(e) => handleFieldBlur('widow_country', e.target.value)}
                        placeholder="País/región de origen"
                        className={getInputClass('widow_country')}
                      />
                      <input
                        type="text"
                        name="widow_city"
                        value={dynamicFields['widow_city'] || ''}
                        onChange={(e) => handleFieldChange('widow_city', e.target.value)}
                        onBlur={(e) => handleFieldBlur('widow_city', e.target.value)}
                        placeholder="Ciudad de nacimiento"
                        className={getInputClass('widow_city')}
                      />
                    </div>
                  )}
                </div>

                {/* 7. Otros familiares */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 mb-2">7. Otros familiares</p>
                  <select
                    name="other_relative"
                    value={dynamicFields['other_relative'] || ''}
                    onChange={(e) => {
                      handleFieldChange('other_relative', e.target.value);
                      handleFieldBlur('other_relative', e.target.value);
                    }}
                    className={getInputClass('other_relative')}
                  >
                    <option value="">¿Otros familiares?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>

                  {dynamicFields['other_relative'] === 'Sí' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <input
                        type="text"
                        name="other_relative_name"
                        value={dynamicFields['other_relative_name'] || ''}
                        onChange={(e) => handleFieldChange('other_relative_name', e.target.value)}
                        onBlur={(e) => handleFieldBlur('other_relative_name', e.target.value)}
                        placeholder="Nombres completos"
                        className={getInputClass('other_relative_name')}
                      />
                      <input
                        type="date"
                        name="other_relative_birthday"
                        value={dynamicFields['other_relative_birthday'] || ''}
                        onChange={(e) => handleFieldChange('other_relative_birthday', e.target.value)}
                        onBlur={(e) => handleFieldBlur('other_relative_birthday', e.target.value)}
                        placeholder="Fecha de nacimiento"
                        className={getInputClass('other_relative_birthday')}
                      />
                      <input
                        type="text"
                        name="other_relative_country"
                        value={dynamicFields['other_relative_country'] || ''}
                        onChange={(e) => handleFieldChange('other_relative_country', e.target.value)}
                        onBlur={(e) => handleFieldBlur('other_relative_country', e.target.value)}
                        placeholder="País/región de origen"
                        className={getInputClass('other_relative_country')}
                      />
                      <input
                        type="text"
                        name="other_relative_city"
                        value={dynamicFields['other_relative_city'] || ''}
                        onChange={(e) => handleFieldChange('other_relative_city', e.target.value)}
                        onBlur={(e) => handleFieldBlur('other_relative_city', e.target.value)}
                        placeholder="Ciudad de nacimiento"
                        className={getInputClass('other_relative_city')}
                      />
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          name="other_relative_address"
                          value={dynamicFields['other_relative_address'] || ''}
                          onChange={(e) => handleFieldChange('other_relative_address', e.target.value)}
                          onBlur={(e) => handleFieldBlur('other_relative_address', e.target.value)}
                          placeholder="Dirección de domicilio"
                          className={getInputClass('other_relative_address')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 9. INFORMACIÓN LABORAL / EDUCATIVA */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-sky-600" />
                <span>9. Información Laboral / Educativa</span>
              </h2>

              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-800">1. Actual</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="current_occupation"
                    value={dynamicFields['current_occupation'] || ''}
                    onChange={(e) => handleFieldChange('current_occupation', e.target.value)}
                    onBlur={(e) => handleFieldBlur('current_occupation', e.target.value)}
                    placeholder="Ocupación primaria (especificar)"
                    className={getInputClass('current_occupation')}
                  />
                  <input
                    type="text"
                    name="current_employer"
                    value={dynamicFields['current_employer'] || ''}
                    onChange={(e) => handleFieldChange('current_employer', e.target.value)}
                    onBlur={(e) => handleFieldBlur('current_employer', e.target.value)}
                    placeholder="Nombre del empleador o institución educativa"
                    className={getInputClass('current_employer')}
                  />
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="current_address"
                      value={dynamicFields['current_address'] || ''}
                      onChange={(e) => handleFieldChange('current_address', e.target.value)}
                      onBlur={(e) => handleFieldBlur('current_address', e.target.value)}
                      placeholder="Dirección completa"
                      className={getInputClass('current_address')}
                    />
                  </div>
                  <input
                    type="text"
                    name="current_city_country"
                    value={dynamicFields['current_city_country'] || ''}
                    onChange={(e) => handleFieldChange('current_city_country', e.target.value)}
                    onBlur={(e) => handleFieldBlur('current_city_country', e.target.value)}
                    placeholder="País, provincia, ciudad y código postal"
                    className={getInputClass('current_city_country')}
                  />
                  <input
                    type="text"
                    name="current_phone"
                    value={dynamicFields['current_phone'] || ''}
                    onChange={(e) => handleFieldChange('current_phone', e.target.value)}
                    onBlur={(e) => handleFieldBlur('current_phone', e.target.value)}
                    placeholder="Número telefónico"
                    className={getInputClass('current_phone')}
                  />
                  <input
                    type="date"
                    name="current_start_date"
                    value={dynamicFields['current_start_date'] || ''}
                    onChange={(e) => handleFieldChange('current_start_date', e.target.value)}
                    onBlur={(e) => handleFieldBlur('current_start_date', e.target.value)}
                    className={getInputClass('current_start_date')}
                  />
                  <input
                    type="number"
                    name="current_income"
                    value={dynamicFields['current_income'] || ''}
                    onChange={(e) => handleFieldChange('current_income', e.target.value)}
                    onBlur={(e) => handleFieldBlur('current_income', e.target.value)}
                    placeholder="Ingreso mensual (si está empleado)"
                    className={getInputClass('current_income')}
                  />
                  <div className="md:col-span-2">
                    <textarea
                      rows={2}
                      name="current_responsibilities"
                      value={dynamicFields['current_responsibilities'] || ''}
                      onChange={(e) => handleFieldChange('current_responsibilities', e.target.value)}
                      onBlur={(e) => handleFieldBlur('current_responsibilities', e.target.value)}
                      placeholder="Brevemente describa sus responsabilidades"
                      className={getInputClass('current_responsibilities')}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 mb-2">2. Pasado</p>
                  <select
                    name="previously_employed"
                    value={dynamicFields['previously_employed'] || ''}
                    onChange={(e) => {
                      handleFieldChange('previously_employed', e.target.value);
                      handleFieldBlur('previously_employed', e.target.value);
                    }}
                    className={getInputClass('previously_employed')}
                  >
                    <option value="">¿Estuvo previamente empleado?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>

                  {dynamicFields['previously_employed'] === 'Sí' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <input
                        type="text"
                        name="previous_employer1_name"
                        value={dynamicFields['previous_employer1_name'] || ''}
                        onChange={(e) => handleFieldChange('previous_employer1_name', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_employer1_name', e.target.value)}
                        placeholder="Nombre de la empresa"
                        className={getInputClass('previous_employer1_name')}
                      />
                      <input
                        type="text"
                        name="previous_employer1_address"
                        value={dynamicFields['previous_employer1_address'] || ''}
                        onChange={(e) => handleFieldChange('previous_employer1_address', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_employer1_address', e.target.value)}
                        placeholder="Dirección completa"
                        className={getInputClass('previous_employer1_address')}
                      />
                      <input
                        type="text"
                        name="previous_employer1_city_country"
                        value={dynamicFields['previous_employer1_city_country'] || ''}
                        onChange={(e) => handleFieldChange('previous_employer1_city_country', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_employer1_city_country', e.target.value)}
                        placeholder="País, provincia, ciudad y código postal"
                        className={getInputClass('previous_employer1_city_country')}
                      />
                      <input
                        type="text"
                        name="previous_employer1_phone"
                        value={dynamicFields['previous_employer1_phone'] || ''}
                        onChange={(e) => handleFieldChange('previous_employer1_phone', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_employer1_phone', e.target.value)}
                        placeholder="Número telefónico"
                        className={getInputClass('previous_employer1_phone')}
                      />
                      <input
                        type="text"
                        name="previous_employer1_role"
                        value={dynamicFields['previous_employer1_role'] || ''}
                        onChange={(e) => handleFieldChange('previous_employer1_role', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_employer1_role', e.target.value)}
                        placeholder="Rol/cargo que desempeñaba"
                        className={getInputClass('previous_employer1_role')}
                      />
                      <input
                        type="text"
                        name="previous_employer1_supervisor"
                        value={dynamicFields['previous_employer1_supervisor'] || ''}
                        onChange={(e) => handleFieldChange('previous_employer1_supervisor', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_employer1_supervisor', e.target.value)}
                        placeholder="Nombres completos de su supervisor/jefe directo"
                        className={getInputClass('previous_employer1_supervisor')}
                      />
                      <input
                        type="text"
                        name="previous_employer1_period"
                        value={dynamicFields['previous_employer1_period'] || ''}
                        onChange={(e) => handleFieldChange('previous_employer1_period', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_employer1_period', e.target.value)}
                        placeholder="¿Desde cuándo hasta cuándo laboró?"
                        className={getInputClass('previous_employer1_period')}
                      />
                      <textarea
                        rows={2}
                        name="previous_employer1_responsibilities"
                        value={dynamicFields['previous_employer1_responsibilities'] || ''}
                        onChange={(e) => handleFieldChange('previous_employer1_responsibilities', e.target.value)}
                        onBlur={(e) => handleFieldBlur('previous_employer1_responsibilities', e.target.value)}
                        placeholder="Brevemente describa sus responsabilidades"
                        className={getInputClass('previous_employer1_responsibilities')}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 mb-2">3. Bachillerato o Superior</p>
                  <select
                    name="studied_high_school_or_higher"
                    value={dynamicFields['studied_high_school_or_higher'] || ''}
                    onChange={(e) => {
                      handleFieldChange('studied_high_school_or_higher', e.target.value);
                      handleFieldBlur('studied_high_school_or_higher', e.target.value);
                    }}
                    className={getInputClass('studied_high_school_or_higher')}
                  >
                    <option value="">¿Ha estudiado bachillerato o nivel superior?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>

                  {dynamicFields['studied_high_school_or_higher'] === 'Sí' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <input
                        type="text"
                        name="education_institution"
                        value={dynamicFields['education_institution'] || ''}
                        onChange={(e) => handleFieldChange('education_institution', e.target.value)}
                        onBlur={(e) => handleFieldBlur('education_institution', e.target.value)}
                        placeholder="Nombre de la institución"
                        className={getInputClass('education_institution')}
                      />
                      <input
                        type="text"
                        name="education_address"
                        value={dynamicFields['education_address'] || ''}
                        onChange={(e) => handleFieldChange('education_address', e.target.value)}
                        onBlur={(e) => handleFieldBlur('education_address', e.target.value)}
                        placeholder="Dirección completa"
                        className={getInputClass('education_address')}
                      />
                      <input
                        type="text"
                        name="education_city_country"
                        value={dynamicFields['education_city_country'] || ''}
                        onChange={(e) => handleFieldChange('education_city_country', e.target.value)}
                        onBlur={(e) => handleFieldBlur('education_city_country', e.target.value)}
                        placeholder="País, provincia, ciudad y código postal"
                        className={getInputClass('education_city_country')}
                      />
                      <input
                        type="text"
                        name="education_phone"
                        value={dynamicFields['education_phone'] || ''}
                        onChange={(e) => handleFieldChange('education_phone', e.target.value)}
                        onBlur={(e) => handleFieldBlur('education_phone', e.target.value)}
                        placeholder="Número telefónico"
                        className={getInputClass('education_phone')}
                      />
                      <input
                        type="text"
                        name="education_course"
                        value={dynamicFields['education_course'] || ''}
                        onChange={(e) => handleFieldChange('education_course', e.target.value)}
                        onBlur={(e) => handleFieldBlur('education_course', e.target.value)}
                        placeholder="Especificar curso de estudio / especialidad"
                        className={getInputClass('education_course')}
                      />
                      <input
                        type="text"
                        name="education_supervisor"
                        value={dynamicFields['education_supervisor'] || ''}
                        onChange={(e) => handleFieldChange('education_supervisor', e.target.value)}
                        onBlur={(e) => handleFieldBlur('education_supervisor', e.target.value)}
                        placeholder="Nombres completos de supervisor/jefe directo"
                        className={getInputClass('education_supervisor')}
                      />
                      <input
                        type="text"
                        name="education_period"
                        value={dynamicFields['education_period'] || ''}
                        onChange={(e) => handleFieldChange('education_period', e.target.value)}
                        onBlur={(e) => handleFieldBlur('education_period', e.target.value)}
                        placeholder="¿Desde cuándo hasta cuándo estudió?"
                        className={getInputClass('education_period')}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 10. INFORMACIÓN ADICIONAL */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>10. Información Adicional</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="clan_or_tribe"
                  value={dynamicFields['clan_or_tribe'] || ''}
                  onChange={(e) => handleFieldChange('clan_or_tribe', e.target.value)}
                  onBlur={(e) => handleFieldBlur('clan_or_tribe', e.target.value)}
                  placeholder="¿Pertenece a algún clan o tribu? (indicar el nombre)"
                  className={getInputClass('clan_or_tribe')}
                />

                <input
                  type="text"
                  name="other_language"
                  value={dynamicFields['other_language'] || ''}
                  onChange={(e) => handleFieldChange('other_language', e.target.value)}
                  onBlur={(e) => handleFieldBlur('other_language', e.target.value)}
                  placeholder="¿Qué otro idioma domina aparte del español?"
                  className={getInputClass('other_language')}
                />

                <div className="md:col-span-2">
                  <textarea
                    rows={2}
                    name="countries_visited_last5years"
                    value={dynamicFields['countries_visited_last5years'] || ''}
                    onChange={(e) => handleFieldChange('countries_visited_last5years', e.target.value)}
                    onBlur={(e) => handleFieldBlur('countries_visited_last5years', e.target.value)}
                    placeholder="¿Ha viajado a otro país/región en los últimos 5 años? Indique en cuáles estuvo"
                    className={getInputClass('countries_visited_last5years')}
                  />
                </div>

                <div className="md:col-span-2">
                  <textarea
                    rows={2}
                    name="organization_participation"
                    value={dynamicFields['organization_participation'] || ''}
                    onChange={(e) => handleFieldChange('organization_participation', e.target.value)}
                    onBlur={(e) => handleFieldBlur('organization_participation', e.target.value)}
                    placeholder="¿Ha pertenecido, contribuido o trabajado para alguna organización profesional, social o benéfica? Indique cuáles"
                    className={getInputClass('organization_participation')}
                  />
                </div>

                <div className="md:col-span-2">
                  <textarea
                    rows={2}
                    name="special_skills"
                    value={dynamicFields['special_skills'] || ''}
                    onChange={(e) => handleFieldChange('special_skills', e.target.value)}
                    onBlur={(e) => handleFieldBlur('special_skills', e.target.value)}
                    placeholder="¿Tiene alguna habilidad o capacitación especializada (armas de fuego, explosivos, experiencia nuclear, biológica o química)? Explique"
                    className={getInputClass('special_skills')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">¿Ha servido en la milicia?</label>
                  <select
                    name="military_service"
                    value={dynamicFields['military_service'] || ''}
                    onChange={(e) => {
                      handleFieldChange('military_service', e.target.value);
                      handleFieldBlur('military_service', e.target.value);
                    }}
                    className={getInputClass('military_service')}
                  >
                    <option value="">¿Ha servido en la milicia?</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {dynamicFields['military_service'] === 'Sí' && (
                  <>
                    <input
                      type="text"
                      name="military_country"
                      value={dynamicFields['military_country'] || ''}
                      onChange={(e) => handleFieldChange('military_country', e.target.value)}
                      onBlur={(e) => handleFieldBlur('military_country', e.target.value)}
                      placeholder="Nombre del país/región en la que sirvió"
                      className={getInputClass('military_country')}
                    />
                    <input
                      type="text"
                      name="military_branch"
                      value={dynamicFields['military_branch'] || ''}
                      onChange={(e) => handleFieldChange('military_branch', e.target.value)}
                      onBlur={(e) => handleFieldBlur('military_branch', e.target.value)}
                      placeholder="Rama de servicio"
                      className={getInputClass('military_branch')}
                    />
                    <input
                      type="text"
                      name="military_rank"
                      value={dynamicFields['military_rank'] || ''}
                      onChange={(e) => handleFieldChange('military_rank', e.target.value)}
                      onBlur={(e) => handleFieldBlur('military_rank', e.target.value)}
                      placeholder="Rango/posición"
                      className={getInputClass('military_rank')}
                    />
                    <input
                      type="text"
                      name="military_specialty"
                      value={dynamicFields['military_specialty'] || ''}
                      onChange={(e) => handleFieldChange('military_specialty', e.target.value)}
                      onBlur={(e) => handleFieldBlur('military_specialty', e.target.value)}
                      placeholder="Especialidad militar"
                      className={getInputClass('military_specialty')}
                    />
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        name="military_period"
                        value={dynamicFields['military_period'] || ''}
                        onChange={(e) => handleFieldChange('military_period', e.target.value)}
                        onBlur={(e) => handleFieldBlur('military_period', e.target.value)}
                        placeholder="¿Desde cuándo hasta cuándo estuvo sirviendo?"
                        className={getInputClass('military_period')}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBIR DOCUMENTOS CON PREVIEW */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <Upload className="w-4 h-4 text-sky-600" />
            <span>Subir Documentos</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* Comprobante */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between items-center space-y-3">
              <label className="text-xs font-bold text-slate-800">Foto de Comprobante</label>
              <div className="w-full h-36 border-2 border-dashed border-slate-300 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                {renderFilePreview(dynamicFields['proof_file'], 'Comprobante')}
              </div>
              <label className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                Seleccionar
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload('proof_file', e)}
                />
              </label>
            </div>

            {/* Foto Carnet */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between items-center space-y-3">
              <label className="text-xs font-bold text-slate-800">Foto Carnet</label>
              <div className="w-full h-36 border-2 border-dashed border-slate-300 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                {renderFilePreview(dynamicFields['id_card_file'], 'Carnet')}
              </div>
              <label className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                Seleccionar
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload('id_card_file', e)}
                />
              </label>
            </div>

            {/* Subir Pasaporte */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between items-center space-y-3">
              <label className="text-xs font-bold text-slate-800">Subir Pasaporte</label>
              <div className="w-full h-36 border-2 border-dashed border-slate-300 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                {renderFilePreview(dynamicFields['passport_file'], 'Pasaporte')}
              </div>
              <label className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                Seleccionar
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload('passport_file', e)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Disclaimer Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center text-xs text-slate-600 font-medium space-y-1">
          <p>
            {visaData.agency_name} no se responsabiliza por datos que no sean verídicos arriba anotados ya que confiamos en la buena fe y veracidad de la información brindada por el aplicante.
          </p>
          <p className="text-[11px] text-slate-400 mt-2">© {new Date().getFullYear()} {visaData.agency_name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default PublicVisaFormPage;
