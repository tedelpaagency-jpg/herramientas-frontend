'use client';

import React from 'react';
import { 
  User, FileText, Globe, Home, Briefcase, ShieldAlert, Users, Building, HelpCircle, CreditCard 
} from 'lucide-react';

export interface ConsularSubFormProps {
  formData: Record<string, any>;
  onFieldChange?: (fieldName: string, value: any) => void;
  onFieldBlur?: (fieldName: string, value: any) => void;
  applicantName?: string;
  passportNumber?: string;
  readOnly?: boolean;
}

export const SchengenConsularForm: React.FC<ConsularSubFormProps> = ({
  formData = {},
  onFieldChange,
  onFieldBlur,
  applicantName = '',
  passportNumber = '',
  readOnly = false,
}) => {
  const handleChange = (name: string, value: any) => {
    if (readOnly) return;
    onFieldChange?.(name, value);
  };

  const handleBlur = (name: string, value: any) => {
    if (readOnly) return;
    onFieldBlur?.(name, value);
  };

  const getInputClass = (_fieldName: string) => {
    if (readOnly) {
      return "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-medium cursor-default focus:outline-none";
    }
    return "w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-sky-600 transition-colors";
  };

  return (
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['surname'] ?? applicantName ?? ''}
              onChange={(e) => handleChange('surname', e.target.value)}
              onBlur={(e) => handleBlur('surname', e.target.value)}
              placeholder="1. Apellido(s)"
              className={getInputClass('surname')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">2. Apellido(s) de nacimiento (anteriores)</label>
            <input
              type="text"
              name="birth_surname"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['birth_surname'] || ''}
              onChange={(e) => handleChange('birth_surname', e.target.value)}
              onBlur={(e) => handleBlur('birth_surname', e.target.value)}
              placeholder="2. Apellido(s) de nacimiento"
              className={getInputClass('birth_surname')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">3. Nombre(s) *</label>
            <input
              type="text"
              name="first_names"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['first_names'] || ''}
              onChange={(e) => handleChange('first_names', e.target.value)}
              onBlur={(e) => handleBlur('first_names', e.target.value)}
              placeholder="3. Nombre(s)"
              className={getInputClass('first_names')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">4. Fecha de nacimiento (día-mes-año) *</label>
            <input
              type="date"
              name="birthday"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['birthday'] || ''}
              onChange={(e) => handleChange('birthday', e.target.value)}
              onBlur={(e) => handleBlur('birthday', e.target.value)}
              className={getInputClass('birthday')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">5. Lugar de nacimiento *</label>
            <input
              type="text"
              name="birth_place"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['birth_place'] || ''}
              onChange={(e) => handleChange('birth_place', e.target.value)}
              onBlur={(e) => handleBlur('birth_place', e.target.value)}
              placeholder="5. Lugar de nacimiento"
              className={getInputClass('birth_place')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">6. País de nacimiento *</label>
            <input
              type="text"
              name="birth_country"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['birth_country'] || ''}
              onChange={(e) => handleChange('birth_country', e.target.value)}
              onBlur={(e) => handleBlur('birth_country', e.target.value)}
              placeholder="6. País de nacimiento"
              className={getInputClass('birth_country')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">7. Nacionalidad actual *</label>
            <input
              type="text"
              name="current_nationality"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['current_nationality'] || ''}
              onChange={(e) => handleChange('current_nationality', e.target.value)}
              onBlur={(e) => handleBlur('current_nationality', e.target.value)}
              placeholder="Nacionalidad actual"
              className={getInputClass('current_nationality')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">7. Nacionalidad de nacimiento (si difiere)</label>
            <input
              type="text"
              name="birth_nationality"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['birth_nationality'] || ''}
              onChange={(e) => handleChange('birth_nationality', e.target.value)}
              onBlur={(e) => handleBlur('birth_nationality', e.target.value)}
              placeholder="Nacionalidad de nacimiento"
              className={getInputClass('birth_nationality')}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">7. Otras nacionalidades</label>
            <input
              type="text"
              name="other_nationalities"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['other_nationalities'] || ''}
              onChange={(e) => handleChange('other_nationalities', e.target.value)}
              onBlur={(e) => handleBlur('other_nationalities', e.target.value)}
              placeholder="Otras nacionalidades"
              className={getInputClass('other_nationalities')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">8. Sexo *</label>
            <select
              name="sex"
              disabled={readOnly}
              value={formData['sex'] || ''}
              onChange={(e) => {
                handleChange('sex', e.target.value);
                handleBlur('sex', e.target.value);
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
              disabled={readOnly}
              value={formData['marital_status'] || ''}
              onChange={(e) => {
                handleChange('marital_status', e.target.value);
                handleBlur('marital_status', e.target.value);
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['tutor_details'] || ''}
              onChange={(e) => handleChange('tutor_details', e.target.value)}
              onBlur={(e) => handleBlur('tutor_details', e.target.value)}
              placeholder="Apellidos, nombre, dirección si difiere, número de teléfono, correo electrónico y nacionalidad"
              className={getInputClass('tutor_details')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">11. Número de documento nacional de identidad *</label>
            <input
              type="text"
              name="cedula"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['cedula'] || ''}
              onChange={(e) => handleChange('cedula', e.target.value)}
              onBlur={(e) => handleBlur('cedula', e.target.value)}
              placeholder="Número de cédula"
              className={getInputClass('cedula')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lugar donde se tramita la visa *</label>
            <select
              name="processing_location"
              disabled={readOnly}
              value={formData['processing_location'] || ''}
              onChange={(e) => {
                handleChange('processing_location', e.target.value);
                handleBlur('processing_location', e.target.value);
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
              disabled={readOnly}
              value={formData['travel_document_type'] || ''}
              onChange={(e) => {
                handleChange('travel_document_type', e.target.value);
                handleBlur('travel_document_type', e.target.value);
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['passport_number'] || passportNumber || ''}
              onChange={(e) => handleChange('passport_number', e.target.value)}
              onBlur={(e) => handleBlur('passport_number', e.target.value)}
              placeholder="Número de pasaporte"
              className={getInputClass('passport_number')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">14. Fecha de expedición *</label>
            <input
              type="date"
              name="passport_issue_date"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['passport_issue_date'] || ''}
              onChange={(e) => handleChange('passport_issue_date', e.target.value)}
              onBlur={(e) => handleBlur('passport_issue_date', e.target.value)}
              className={getInputClass('passport_issue_date')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">15. Válido hasta *</label>
            <input
              type="date"
              name="passport_expiry_date"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['passport_expiry_date'] || ''}
              onChange={(e) => handleChange('passport_expiry_date', e.target.value)}
              onBlur={(e) => handleBlur('passport_expiry_date', e.target.value)}
              className={getInputClass('passport_expiry_date')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">16. Expedido por (país) *</label>
            <input
              type="text"
              name="passport_country_city"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['passport_country_city'] || ''}
              onChange={(e) => handleChange('passport_country_city', e.target.value)}
              onBlur={(e) => handleBlur('passport_country_city', e.target.value)}
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
              disabled={readOnly}
              value={formData['eu_family_member'] || ''}
              onChange={(e) => {
                handleChange('eu_family_member', e.target.value);
                handleBlur('eu_family_member', e.target.value);
              }}
              className={getInputClass('eu_family_member')}
            >
              <option value="">¿Es familiar de un ciudadano UE/EEE/Suiza/RU?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['eu_family_member'] === 'Sí' && (
            <>
              <div>
                <input
                  type="text"
                  name="eu_family_surname"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['eu_family_surname'] || ''}
                  onChange={(e) => handleChange('eu_family_surname', e.target.value)}
                  onBlur={(e) => handleBlur('eu_family_surname', e.target.value)}
                  placeholder="Apellido(s) del familiar"
                  className={getInputClass('eu_family_surname')}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="eu_family_name"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['eu_family_name'] || ''}
                  onChange={(e) => handleChange('eu_family_name', e.target.value)}
                  onBlur={(e) => handleBlur('eu_family_name', e.target.value)}
                  placeholder="Nombre(s) del familiar"
                  className={getInputClass('eu_family_name')}
                />
              </div>
              <div>
                <input
                  type="date"
                  name="eu_family_birthday"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['eu_family_birthday'] || ''}
                  onChange={(e) => handleChange('eu_family_birthday', e.target.value)}
                  onBlur={(e) => handleBlur('eu_family_birthday', e.target.value)}
                  className={getInputClass('eu_family_birthday')}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="eu_family_nationality"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['eu_family_nationality'] || ''}
                  onChange={(e) => handleChange('eu_family_nationality', e.target.value)}
                  onBlur={(e) => handleBlur('eu_family_nationality', e.target.value)}
                  placeholder="Nacionalidad"
                  className={getInputClass('eu_family_nationality')}
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="eu_family_doc_number"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['eu_family_doc_number'] || ''}
                  onChange={(e) => handleChange('eu_family_doc_number', e.target.value)}
                  onBlur={(e) => handleBlur('eu_family_doc_number', e.target.value)}
                  placeholder="Número de documento de viaje o de identidad"
                  className={getInputClass('eu_family_doc_number')}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">18. Relación de parentesco con el ciudadano de la UE/EEE/Suiza/RU</label>
                <select
                  name="eu_family_relationship"
                  disabled={readOnly}
                  value={formData['eu_family_relationship'] || ''}
                  onChange={(e) => {
                    handleChange('eu_family_relationship', e.target.value);
                    handleBlur('eu_family_relationship', e.target.value);
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['home_address'] || ''}
              onChange={(e) => handleChange('home_address', e.target.value)}
              onBlur={(e) => handleBlur('home_address', e.target.value)}
              placeholder="Domicilio postal y correo electrónico completo"
              className={getInputClass('home_address')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Número(s) de teléfono *</label>
            <input
              type="text"
              name="phone_primary"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['phone_primary'] || ''}
              onChange={(e) => handleChange('phone_primary', e.target.value)}
              onBlur={(e) => handleBlur('phone_primary', e.target.value)}
              placeholder="Número(s) de teléfono"
              className={getInputClass('phone_primary')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email_primary"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['email_primary'] || ''}
              onChange={(e) => handleChange('email_primary', e.target.value)}
              onBlur={(e) => handleBlur('email_primary', e.target.value)}
              placeholder="Correo electrónico"
              className={getInputClass('email_primary')}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">20. ¿Residente en un país distinto del país de nacionalidad actual?</label>
            <select
              name="resident_other_country"
              disabled={readOnly}
              value={formData['resident_other_country'] || ''}
              onChange={(e) => {
                handleChange('resident_other_country', e.target.value);
                handleBlur('resident_other_country', e.target.value);
              }}
              className={getInputClass('resident_other_country')}
            >
              <option value="">¿Residente en otro país?</option>
              <option value="No">No</option>
              <option value="Sí">Sí</option>
            </select>
          </div>

          {formData['resident_other_country'] === 'Sí' && (
            <>
              <div>
                <input
                  type="text"
                  name="residence_permit_number"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['residence_permit_number'] || ''}
                  onChange={(e) => handleChange('residence_permit_number', e.target.value)}
                  onBlur={(e) => handleBlur('residence_permit_number', e.target.value)}
                  placeholder="Permiso de residencia o equivalente Nº"
                  className={getInputClass('residence_permit_number')}
                />
              </div>
              <div>
                <input
                  type="date"
                  name="residence_permit_expiry"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['residence_permit_expiry'] || ''}
                  onChange={(e) => handleChange('residence_permit_expiry', e.target.value)}
                  onBlur={(e) => handleBlur('residence_permit_expiry', e.target.value)}
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['current_occupation'] || ''}
              onChange={(e) => handleChange('current_occupation', e.target.value)}
              onBlur={(e) => handleBlur('current_occupation', e.target.value)}
              placeholder="21. Profesión actual"
              className={getInputClass('current_occupation')}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">22. Nombre, dirección y número de teléfono del empleador. (Para estudiantes: centro de enseñanza)</label>
            <textarea
              rows={3}
              name="current_employer_school"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['current_employer_school'] || ''}
              onChange={(e) => handleChange('current_employer_school', e.target.value)}
              onBlur={(e) => handleBlur('current_employer_school', e.target.value)}
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
              disabled={readOnly}
              value={formData['travel_purpose'] || ''}
              onChange={(e) => {
                handleChange('travel_purpose', e.target.value);
                handleBlur('travel_purpose', e.target.value);
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['travel_purpose_details'] || ''}
              onChange={(e) => handleChange('travel_purpose_details', e.target.value)}
              onBlur={(e) => handleBlur('travel_purpose_details', e.target.value)}
              placeholder="Información adicional sobre el motivo de la estancia"
              className={getInputClass('travel_purpose_details')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">25. Estado miembro de destino principal *</label>
            <input
              type="text"
              name="schengen_main_destination"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['schengen_main_destination'] || ''}
              onChange={(e) => handleChange('schengen_main_destination', e.target.value)}
              onBlur={(e) => handleBlur('schengen_main_destination', e.target.value)}
              placeholder="Ej. España, Francia, Alemania"
              className={getInputClass('schengen_main_destination')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">26. Estado miembro de primera entrada *</label>
            <input
              type="text"
              name="schengen_first_entry"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['schengen_first_entry'] || ''}
              onChange={(e) => handleChange('schengen_first_entry', e.target.value)}
              onBlur={(e) => handleBlur('schengen_first_entry', e.target.value)}
              placeholder="Ej. España"
              className={getInputClass('schengen_first_entry')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">27. Número de entradas que solicita *</label>
            <select
              name="entries_requested"
              disabled={readOnly}
              value={formData['entries_requested'] || ''}
              onChange={(e) => {
                handleChange('entries_requested', e.target.value);
                handleBlur('entries_requested', e.target.value);
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['schengen_arrival_date'] || ''}
              onChange={(e) => handleChange('schengen_arrival_date', e.target.value)}
              onBlur={(e) => handleBlur('schengen_arrival_date', e.target.value)}
              className={getInputClass('schengen_arrival_date')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">28. Fecha prevista de salida del espacio Schengen *</label>
            <input
              type="date"
              name="schengen_departure_date"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['schengen_departure_date'] || ''}
              onChange={(e) => handleChange('schengen_departure_date', e.target.value)}
              onBlur={(e) => handleBlur('schengen_departure_date', e.target.value)}
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
              disabled={readOnly}
              value={formData['fingerprints_taken'] || ''}
              onChange={(e) => {
                handleChange('fingerprints_taken', e.target.value);
                handleBlur('fingerprints_taken', e.target.value);
              }}
              className={getInputClass('fingerprints_taken')}
            >
              <option value="">¿Huellas dactilares tomadas anteriormente?</option>
              <option value="NO">NO</option>
              <option value="SÍ">SÍ</option>
            </select>
          </div>

          {formData['fingerprints_taken'] === 'SÍ' && (
            <>
              <div>
                <input
                  type="date"
                  name="fingerprints_date"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['fingerprints_date'] || ''}
                  onChange={(e) => handleChange('fingerprints_date', e.target.value)}
                  onBlur={(e) => handleBlur('fingerprints_date', e.target.value)}
                  placeholder="Fecha, si se conoce"
                  className={getInputClass('fingerprints_date')}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="fingerprints_visa_number"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['fingerprints_visa_number'] || ''}
                  onChange={(e) => handleChange('fingerprints_visa_number', e.target.value)}
                  onBlur={(e) => handleBlur('fingerprints_visa_number', e.target.value)}
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['final_destination_permit'] || ''}
              onChange={(e) => handleChange('final_destination_permit', e.target.value)}
              onBlur={(e) => handleBlur('final_destination_permit', e.target.value)}
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['host_invitation_details'] || ''}
              onChange={(e) => handleChange('host_invitation_details', e.target.value)}
              onBlur={(e) => handleBlur('host_invitation_details', e.target.value)}
              placeholder="Nombre del hotel o persona que emitió la invitación, domicilio postal, dirección de correo electrónico y número(s) de teléfono"
              className={getInputClass('host_invitation_details')}
            />
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">32. Nombre y dirección de la empresa u organización que ha emitido la invitación</label>
            <textarea
              rows={3}
              name="company_invitation_details"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['company_invitation_details'] || ''}
              onChange={(e) => handleChange('company_invitation_details', e.target.value)}
              onBlur={(e) => handleBlur('company_invitation_details', e.target.value)}
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
              disabled={readOnly}
              value={formData['travel_expenses_covered_by'] || ''}
              onChange={(e) => {
                handleChange('travel_expenses_covered_by', e.target.value);
                handleBlur('travel_expenses_covered_by', e.target.value);
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['means_of_support'] || ''}
              onChange={(e) => handleChange('means_of_support', e.target.value)}
              onBlur={(e) => handleBlur('means_of_support', e.target.value)}
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
            disabled={readOnly}
            readOnly={readOnly}
            value={formData['third_party_filler'] || ''}
            onChange={(e) => handleChange('third_party_filler', e.target.value)}
            onBlur={(e) => handleBlur('third_party_filler', e.target.value)}
            placeholder="Apellidos, nombre, domicilio postal, dirección de correo electrónico y número de teléfono de la persona que llena la solicitud"
            className={getInputClass('third_party_filler')}
          />
        </div>
      </div>
    </div>
  );
};
