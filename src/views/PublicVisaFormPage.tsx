'use client';

import React, { useEffect, useState } from 'react';
import visaService from '../services/visaService';
import { 
  FileCheck, Upload, Eye, RefreshCw, User, FileText, Globe, Home, Briefcase, Award, ShieldAlert, Users, PhoneCall, Building, HelpCircle
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
      await visaService.saveVisaField(visaData?.id || 0, fieldName, value);
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
      const res = await visaService.uploadVisaFile(visaData.id, fieldName, file);
      setDynamicFields((prev) => ({ ...prev, [fieldName]: res.file_url }));
      toast.success('Archivo adjuntado correctamente');
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error('Error al subir el archivo');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center text-slate-800 space-y-3">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500">Cargando formulario consular exacto CI3...</p>
      </div>
    );
  }

  if (!visaData) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center text-slate-800 p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl max-w-md text-center space-y-3 shadow-md">
          <FileCheck className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-black text-slate-900">Formulario No Disponible</h2>
          <p className="text-xs text-slate-500">
            Este formulario ya no se encuentra disponible o la URL ha caducado. Consulta con tu asesor para más información.
          </p>
        </div>
      </div>
    );
  }

  const isUsa = visaData.visa_type === 'USA';
  const isCanada = visaData.visa_type === 'CANADA';
  const countryName = isUsa ? 'Estados Unidos' : isCanada ? 'Canadá' : 'Europa';

  const getInputClass = (fieldName: string) => {
    const st = fieldStatuses[fieldName];
    let base = "w-full px-3.5 py-2.5 bg-white border rounded-xl text-slate-900 text-xs font-medium focus:outline-none transition-colors ";
    if (st === 'valid') return base + "border-emerald-500 ring-1 ring-emerald-500/30";
    if (st === 'invalid') return base + "border-rose-500 ring-1 ring-rose-500/30";
    return base + "border-slate-300 focus:border-sky-600";
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-md shadow-sky-600/20">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {isUsa ? 'Formulario - Visa Americana' : isCanada ? 'Formulario - Visa Canadiense' : 'Formulario de Solicitud de Visado'}
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Nombre: <strong className="text-slate-900">{visaData.applicant_name}</strong> | {visaData.agency_name}
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

        {/* 1. INFORMACIÓN PERSONAL */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
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

        {/* 11. SUBIR DOCUMENTOS CON PREVIEW */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
            <Upload className="w-4 h-4 text-sky-600" />
            <span>11. Subir Documentos</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* Comprobante */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between items-center space-y-3">
              <label className="text-xs font-bold text-slate-800">Foto de Comprobante</label>
              <div className="w-full h-36 border-2 border-dashed border-slate-300 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                {dynamicFields['proof_file'] ? (
                  <img src={dynamicFields['proof_file']} alt="Comprobante" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Esperando imagen</span>
                )}
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
                {dynamicFields['id_card_file'] ? (
                  <img src={dynamicFields['id_card_file']} alt="Carnet" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Esperando imagen</span>
                )}
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
                {dynamicFields['passport_file'] ? (
                  <img src={dynamicFields['passport_file']} alt="Pasaporte" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Esperando imagen</span>
                )}
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
