'use client';

import React from 'react';
import { 
  User, FileText, Globe, Home, Briefcase, Users, Building, HelpCircle 
} from 'lucide-react';
import { ConsularSubFormProps } from './SchengenConsularForm';

export interface UsaCanadaConsularFormProps extends ConsularSubFormProps {
  countryName?: string;
  isUsa?: boolean;
}

export const UsaCanadaConsularForm: React.FC<UsaCanadaConsularFormProps> = ({
  formData = {},
  onFieldChange,
  onFieldBlur,
  applicantName = '',
  passportNumber = '',
  countryName = 'Estados Unidos',
  isUsa = true,
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['name'] ?? applicantName ?? ''}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={(e) => handleBlur('name', e.target.value)}
              placeholder="Nombre(s) completos"
              className={getInputClass('name')}
            />
          </div>

          <div>
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
            <input
              type="text"
              name="born_city"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['born_city'] || ''}
              onChange={(e) => handleChange('born_city', e.target.value)}
              onBlur={(e) => handleBlur('born_city', e.target.value)}
              placeholder="Lugar de nacimiento (ciudad, provincia, país)"
              className={getInputClass('born_city')}
            />
          </div>

          <div>
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['morefullname'] || ''}
              onChange={(e) => handleChange('morefullname', e.target.value)}
              onBlur={(e) => handleBlur('morefullname', e.target.value)}
              placeholder="Otro nombre/apellido usado"
              className={getInputClass('morefullname')}
            />
          </div>

          <div>
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
              <option value="">Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              name="another_nationality"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['another_nationality'] || ''}
              onChange={(e) => handleChange('another_nationality', e.target.value)}
              onBlur={(e) => handleBlur('another_nationality', e.target.value)}
              placeholder="Origen de nacionalidad"
              className={getInputClass('another_nationality')}
            />
          </div>

          <div>
            <select
              name="has_other_nationality"
              disabled={readOnly}
              value={formData['has_other_nationality'] || ''}
              onChange={(e) => {
                handleChange('has_other_nationality', e.target.value);
                handleBlur('has_other_nationality', e.target.value);
              }}
              className={getInputClass('has_other_nationality')}
            >
              <option value="">¿Mantiene otra nacionalidad?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['has_other_nationality'] === 'Sí' && (
            <>
              <div>
                <input
                  type="text"
                  name="what_nationality"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['what_nationality'] || ''}
                  onChange={(e) => handleChange('what_nationality', e.target.value)}
                  onBlur={(e) => handleBlur('what_nationality', e.target.value)}
                  placeholder="¿Cuál(es)?"
                  className={getInputClass('what_nationality')}
                />
              </div>

              <div>
                <select
                  name="has_other_passport"
                  disabled={readOnly}
                  value={formData['has_other_passport'] || ''}
                  onChange={(e) => {
                    handleChange('has_other_passport', e.target.value);
                    handleBlur('has_other_passport', e.target.value);
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
              disabled={readOnly}
              value={formData['is_resident_other_country'] || ''}
              onChange={(e) => {
                handleChange('is_resident_other_country', e.target.value);
                handleBlur('is_resident_other_country', e.target.value);
              }}
              className={getInputClass('is_resident_other_country')}
            >
              <option value="">¿Es residente permanente de otro país?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['is_resident_other_country'] === 'Sí' && (
            <div>
              <input
                type="text"
                name="permanent_residence_country"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['permanent_residence_country'] || ''}
                onChange={(e) => handleChange('permanent_residence_country', e.target.value)}
                onBlur={(e) => handleBlur('permanent_residence_country', e.target.value)}
                placeholder="País/países de residencia permanente"
                className={getInputClass('permanent_residence_country')}
              />
            </div>
          )}

          <div>
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['travel_date'] || ''}
              onChange={(e) => handleChange('travel_date', e.target.value)}
              onBlur={(e) => handleBlur('travel_date', e.target.value)}
              placeholder="Fecha aproximada de viaje"
              className={getInputClass('travel_date')}
            />
          </div>

          <div>
            <input
              type="text"
              name="stay_duration"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['stay_duration'] || ''}
              onChange={(e) => handleChange('stay_duration', e.target.value)}
              onBlur={(e) => handleBlur('stay_duration', e.target.value)}
              placeholder="Tiempo de estadía"
              className={getInputClass('stay_duration')}
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="text"
              name="address_in_usa"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['address_in_usa'] || ''}
              onChange={(e) => handleChange('address_in_usa', e.target.value)}
              onBlur={(e) => handleBlur('address_in_usa', e.target.value)}
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
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['payer_name'] || ''}
                onChange={(e) => handleChange('payer_name', e.target.value)}
                onBlur={(e) => handleBlur('payer_name', e.target.value)}
                placeholder="Nombre completo"
                className={getInputClass('payer_name')}
              />
            </div>

            <div>
              <input
                type="text"
                name="payer_phone"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['payer_phone'] || ''}
                onChange={(e) => handleChange('payer_phone', e.target.value)}
                onBlur={(e) => handleBlur('payer_phone', e.target.value)}
                placeholder="Número telefónico"
                className={getInputClass('payer_phone')}
              />
            </div>

            <div>
              <input
                type="email"
                name="payer_email"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['payer_email'] || ''}
                onChange={(e) => handleChange('payer_email', e.target.value)}
                onBlur={(e) => handleBlur('payer_email', e.target.value)}
                placeholder="Correo electrónico"
                className={getInputClass('payer_email')}
              />
            </div>

            <div>
              <input
                type="text"
                name="payer_relationship"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['payer_relationship'] || ''}
                onChange={(e) => handleChange('payer_relationship', e.target.value)}
                onBlur={(e) => handleBlur('payer_relationship', e.target.value)}
                placeholder="Relación con esa persona"
                className={getInputClass('payer_relationship')}
              />
            </div>

            <div className="md:col-span-2">
              <input
                type="text"
                name="payer_address"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['payer_address'] || ''}
                onChange={(e) => handleChange('payer_address', e.target.value)}
                onBlur={(e) => handleBlur('payer_address', e.target.value)}
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
              disabled={readOnly}
              value={formData['has_other_persons'] || ''}
              onChange={(e) => {
                handleChange('has_other_persons', e.target.value);
                handleBlur('has_other_persons', e.target.value);
              }}
              className={getInputClass('has_other_persons')}
            >
              <option value="">¿Otras personas viajarán con usted?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['has_other_persons'] === 'Sí' && (
            <>
              <div>
                <select
                  name="has_group"
                  disabled={readOnly}
                  value={formData['has_group'] || ''}
                  onChange={(e) => {
                    handleChange('has_group', e.target.value);
                    handleBlur('has_group', e.target.value);
                  }}
                  className={getInputClass('has_group')}
                >
                  <option value="">¿viajará como parte de un grupo o una organización?</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData['has_group'] === 'Sí' && (
                <div>
                  <input
                    type="text"
                    name="name_group"
                    disabled={readOnly}
                    readOnly={readOnly}
                    value={formData['name_group'] || ''}
                    onChange={(e) => handleChange('name_group', e.target.value)}
                    onBlur={(e) => handleBlur('name_group', e.target.value)}
                    placeholder="Nombre del grupo/organización"
                    className={getInputClass('name_group')}
                  />
                </div>
              )}

              {formData['has_group'] === 'No' && (
                <div>
                  <textarea
                    rows={3}
                    name="persons_details"
                    disabled={readOnly}
                    readOnly={readOnly}
                    value={formData['persons_details'] || ''}
                    onChange={(e) => handleChange('persons_details', e.target.value)}
                    onBlur={(e) => handleBlur('persons_details', e.target.value)}
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
              disabled={readOnly}
              value={formData['has_been_usa'] || ''}
              onChange={(e) => {
                handleChange('has_been_usa', e.target.value);
                handleBlur('has_been_usa', e.target.value);
              }}
              className={getInputClass('has_been_usa')}
            >
              <option value="">¿Alguna vez ha estado en los {countryName}?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['has_been_usa'] === 'Sí' && (
            <>
              <div>
                <input
                  type="date"
                  name="date_been_usa"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['date_been_usa'] || ''}
                  onChange={(e) => handleChange('date_been_usa', e.target.value)}
                  onBlur={(e) => handleBlur('date_been_usa', e.target.value)}
                  placeholder="Fecha de llegada"
                  className={getInputClass('date_been_usa')}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="days_been_usa"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['days_been_usa'] || ''}
                  onChange={(e) => handleChange('days_been_usa', e.target.value)}
                  onBlur={(e) => handleBlur('days_been_usa', e.target.value)}
                  placeholder="Días de la estadía"
                  className={getInputClass('days_been_usa')}
                />
              </div>
            </>
          )}

          <div>
            <select
              name="has_usa_licence"
              disabled={readOnly}
              value={formData['has_usa_licence'] || ''}
              onChange={(e) => {
                handleChange('has_usa_licence', e.target.value);
                handleBlur('has_usa_licence', e.target.value);
              }}
              className={getInputClass('has_usa_licence')}
            >
              <option value="">¿Mantiene o ha mantenido una licencia de conducir en los {countryName}?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['has_usa_licence'] === 'Sí' && (
            <>
              <div>
                <input
                  type="text"
                  name="licence_usa"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['licence_usa'] || ''}
                  onChange={(e) => handleChange('licence_usa', e.target.value)}
                  onBlur={(e) => handleBlur('licence_usa', e.target.value)}
                  placeholder="Número de la licencia de conducir"
                  className={getInputClass('licence_usa')}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="licence_usa_state"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['licence_usa_state'] || ''}
                  onChange={(e) => handleChange('licence_usa_state', e.target.value)}
                  onBlur={(e) => handleBlur('licence_usa_state', e.target.value)}
                  placeholder="Estado que la emitió"
                  className={getInputClass('licence_usa_state')}
                />
              </div>
            </>
          )}

          <div>
            <select
              name="has_emited_visa"
              disabled={readOnly}
              value={formData['has_emited_visa'] || ''}
              onChange={(e) => {
                handleChange('has_emited_visa', e.target.value);
                handleBlur('has_emited_visa', e.target.value);
              }}
              className={getInputClass('has_emited_visa')}
            >
              <option value="">¿Alguna vez se le ha emitido una visa {isUsa ? 'americana' : 'canadiense'}?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['has_emited_visa'] === 'Sí' && (
            <>
              <div>
                <input
                  type="date"
                  name="date_emited_visa"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['date_emited_visa'] || ''}
                  onChange={(e) => handleChange('date_emited_visa', e.target.value)}
                  onBlur={(e) => handleBlur('date_emited_visa', e.target.value)}
                  placeholder="Fecha última emisión"
                  className={getInputClass('date_emited_visa')}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="no_emited_visa"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['no_emited_visa'] || ''}
                  onChange={(e) => handleChange('no_emited_visa', e.target.value)}
                  onBlur={(e) => handleBlur('no_emited_visa', e.target.value)}
                  placeholder="Número de visa"
                  className={getInputClass('no_emited_visa')}
                />
              </div>

              <div className="md:col-span-2">
                <select
                  name="has_fingerprint"
                  disabled={readOnly}
                  value={formData['has_fingerprint'] || ''}
                  onChange={(e) => {
                    handleChange('has_fingerprint', e.target.value);
                    handleBlur('has_fingerprint', e.target.value);
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
                  disabled={readOnly}
                  value={formData['visa_lost'] || ''}
                  onChange={(e) => {
                    handleChange('visa_lost', e.target.value);
                    handleBlur('visa_lost', e.target.value);
                  }}
                  className={getInputClass('visa_lost')}
                >
                  <option value="">¿Su visa se le ha perdido o ha sido robada?</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData['visa_lost'] === 'Sí' && (
                <>
                  <input
                    type="date"
                    name="visa_lost_date"
                    disabled={readOnly}
                    readOnly={readOnly}
                    value={formData['visa_lost_date'] || ''}
                    onChange={(e) => handleChange('visa_lost_date', e.target.value)}
                    onBlur={(e) => handleBlur('visa_lost_date', e.target.value)}
                    placeholder="Fecha del suceso"
                    className={getInputClass('visa_lost_date')}
                  />
                  <textarea
                    rows={2}
                    name="visa_lost_details"
                    disabled={readOnly}
                    readOnly={readOnly}
                    value={formData['visa_lost_details'] || ''}
                    onChange={(e) => handleChange('visa_lost_details', e.target.value)}
                    onBlur={(e) => handleBlur('visa_lost_details', e.target.value)}
                    placeholder="Explique qué ocurrió"
                    className={getInputClass('visa_lost_details')}
                  />
                </>
              )}

              <div className="md:col-span-2">
                <select
                  name="visa_revoked"
                  disabled={readOnly}
                  value={formData['visa_revoked'] || ''}
                  onChange={(e) => {
                    handleChange('visa_revoked', e.target.value);
                    handleBlur('visa_revoked', e.target.value);
                  }}
                  className={getInputClass('visa_revoked')}
                >
                  <option value="">¿Su visa ha sido cancelada o revocada?</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData['visa_revoked'] === 'Sí' && (
                <div className="md:col-span-2">
                  <textarea
                    rows={2}
                    name="visa_revoked_details"
                    disabled={readOnly}
                    readOnly={readOnly}
                    value={formData['visa_revoked_details'] || ''}
                    onChange={(e) => handleChange('visa_revoked_details', e.target.value)}
                    onBlur={(e) => handleBlur('visa_revoked_details', e.target.value)}
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
              disabled={readOnly}
              value={formData['visa_denied'] || ''}
              onChange={(e) => {
                handleChange('visa_denied', e.target.value);
                handleBlur('visa_denied', e.target.value);
              }}
              className={getInputClass('visa_denied')}
            >
              <option value="">¿Alguna vez le han negado la visa, le han negado la admisión o le han retirado su solicitud?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['visa_denied'] === 'Sí' && (
            <div className="md:col-span-2">
              <textarea
                rows={2}
                name="visa_denied_details"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['visa_denied_details'] || ''}
                onChange={(e) => handleChange('visa_denied_details', e.target.value)}
                onBlur={(e) => handleBlur('visa_denied_details', e.target.value)}
                placeholder="Si es afirmativa, explique"
                className={getInputClass('visa_denied_details')}
              />
            </div>
          )}

          <div className="md:col-span-2">
            <select
              name="immigrant_petition"
              disabled={readOnly}
              value={formData['immigrant_petition'] || ''}
              onChange={(e) => {
                handleChange('immigrant_petition', e.target.value);
                handleBlur('immigrant_petition', e.target.value);
              }}
              className={getInputClass('immigrant_petition')}
            >
              <option value="">¿Alguien ha presentado alguna vez una petición de inmigrante en su nombre?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['immigrant_petition'] === 'Sí' && (
            <div className="md:col-span-2">
              <textarea
                rows={2}
                name="immigrant_petition_details"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['immigrant_petition_details'] || ''}
                onChange={(e) => handleChange('immigrant_petition_details', e.target.value)}
                onBlur={(e) => handleBlur('immigrant_petition_details', e.target.value)}
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['home_address'] || ''}
              onChange={(e) => handleChange('home_address', e.target.value)}
              onBlur={(e) => handleBlur('home_address', e.target.value)}
              placeholder="Dirección completa de su domicilio (avenida, calles, código postal)"
              className={getInputClass('home_address')}
            />
          </div>

          <div>
            <input
              type="text"
              name="home_city"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['home_city'] || ''}
              onChange={(e) => handleChange('home_city', e.target.value)}
              onBlur={(e) => handleBlur('home_city', e.target.value)}
              placeholder="Ciudad"
              className={getInputClass('home_city')}
            />
          </div>

          <div>
            <input
              type="text"
              name="home_province"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['home_province'] || ''}
              onChange={(e) => handleChange('home_province', e.target.value)}
              onBlur={(e) => handleBlur('home_province', e.target.value)}
              placeholder="Provincia/Estado"
              className={getInputClass('home_province')}
            />
          </div>

          <div className="md:col-span-2">
            <select
              name="same_postal_address"
              disabled={readOnly}
              value={formData['same_postal_address'] || ''}
              onChange={(e) => {
                handleChange('same_postal_address', e.target.value);
                handleBlur('same_postal_address', e.target.value);
              }}
              className={getInputClass('same_postal_address')}
            >
              <option value="">¿Su dirección postal es la misma que su domicilio?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['same_postal_address'] === 'No' && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="postal_address"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['postal_address'] || ''}
                  onChange={(e) => handleChange('postal_address', e.target.value)}
                  onBlur={(e) => handleBlur('postal_address', e.target.value)}
                  placeholder="Dirección postal completa"
                  className={getInputClass('postal_address')}
                />
              </div>
              <input
                type="text"
                name="postal_city"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['postal_city'] || ''}
                onChange={(e) => handleChange('postal_city', e.target.value)}
                onBlur={(e) => handleBlur('postal_city', e.target.value)}
                placeholder="Ciudad"
                className={getInputClass('postal_city')}
              />
              <input
                type="text"
                name="postal_province"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['postal_province'] || ''}
                onChange={(e) => handleChange('postal_province', e.target.value)}
                onBlur={(e) => handleBlur('postal_province', e.target.value)}
                placeholder="Provincia/Estado"
                className={getInputClass('postal_province')}
              />
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="postal_zip"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['postal_zip'] || ''}
                  onChange={(e) => handleChange('postal_zip', e.target.value)}
                  onBlur={(e) => handleBlur('postal_zip', e.target.value)}
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['phone_primary'] || ''}
              onChange={(e) => handleChange('phone_primary', e.target.value)}
              onBlur={(e) => handleBlur('phone_primary', e.target.value)}
              placeholder="Número telefónico primario"
              className={getInputClass('phone_primary')}
            />
          </div>

          <div>
            <input
              type="text"
              name="phone_secondary"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['phone_secondary'] || ''}
              onChange={(e) => handleChange('phone_secondary', e.target.value)}
              onBlur={(e) => handleBlur('phone_secondary', e.target.value)}
              placeholder="Número telefónico secundario"
              className={getInputClass('phone_secondary')}
            />
          </div>

          <div>
            <input
              type="text"
              name="phone_work"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['phone_work'] || ''}
              onChange={(e) => handleChange('phone_work', e.target.value)}
              onBlur={(e) => handleBlur('phone_work', e.target.value)}
              placeholder="Número telefónico laboral"
              className={getInputClass('phone_work')}
            />
          </div>

          <div>
            <select
              name="other_phones_used"
              disabled={readOnly}
              value={formData['other_phones_used'] || ''}
              onChange={(e) => {
                handleChange('other_phones_used', e.target.value);
                handleBlur('other_phones_used', e.target.value);
              }}
              className={getInputClass('other_phones_used')}
            >
              <option value="">¿Ha usado algún otro número telefónico en los últimos 5 años?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['other_phones_used'] === 'Sí' && (
            <div className="md:col-span-2">
              <input
                type="text"
                name="other_phones_details"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['other_phones_details'] || ''}
                onChange={(e) => handleChange('other_phones_details', e.target.value)}
                onBlur={(e) => handleBlur('other_phones_details', e.target.value)}
                placeholder="Indique cuáles"
                className={getInputClass('other_phones_details')}
              />
            </div>
          )}

          <div>
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

          <div>
            <select
              name="other_emails_used"
              disabled={readOnly}
              value={formData['other_emails_used'] || ''}
              onChange={(e) => {
                handleChange('other_emails_used', e.target.value);
                handleBlur('other_emails_used', e.target.value);
              }}
              className={getInputClass('other_emails_used')}
            >
              <option value="">¿Ha usado algún otro correo electrónico en los últimos 5 años?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['other_emails_used'] === 'Sí' && (
            <div className="md:col-span-2">
              <input
                type="text"
                name="other_emails_details"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['other_emails_details'] || ''}
                onChange={(e) => handleChange('other_emails_details', e.target.value)}
                onBlur={(e) => handleBlur('other_emails_details', e.target.value)}
                placeholder="Indique cuáles"
                className={getInputClass('other_emails_details')}
              />
            </div>
          )}

          <div className="md:col-span-2">
            <select
              name="social_media_presence"
              disabled={readOnly}
              value={formData['social_media_presence'] || ''}
              onChange={(e) => {
                handleChange('social_media_presence', e.target.value);
                handleBlur('social_media_presence', e.target.value);
              }}
              className={getInputClass('social_media_presence')}
            >
              <option value="">¿Mantiene presencia en alguna de las redes sociales?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['social_media_presence'] === 'Sí' && (
            <div className="md:col-span-2">
              <input
                type="text"
                name="social_media_details"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['social_media_details'] || ''}
                onChange={(e) => handleChange('social_media_details', e.target.value)}
                onBlur={(e) => handleBlur('social_media_details', e.target.value)}
                placeholder="Indique la red social e identificador"
                className={getInputClass('social_media_details')}
              />
            </div>
          )}

          <div className="md:col-span-2">
            <select
              name="other_web_presence"
              disabled={readOnly}
              value={formData['other_web_presence'] || ''}
              onChange={(e) => {
                handleChange('other_web_presence', e.target.value);
                handleBlur('other_web_presence', e.target.value);
              }}
              className={getInputClass('other_web_presence')}
            >
              <option value="">¿Desea proporcionar información sobre otros sitios web o apps que haya usado en los últimos 5 años?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['other_web_presence'] === 'Sí' && (
            <div className="md:col-span-2">
              <input
                type="text"
                name="other_web_details"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['other_web_details'] || ''}
                onChange={(e) => handleChange('other_web_details', e.target.value)}
                onBlur={(e) => handleBlur('other_web_details', e.target.value)}
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
            <input
              type="text"
              name="passport_country_city"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['passport_country_city'] || ''}
              onChange={(e) => handleChange('passport_country_city', e.target.value)}
              onBlur={(e) => handleBlur('passport_country_city', e.target.value)}
              placeholder="País y ciudad de emisión"
              className={getInputClass('passport_country_city')}
            />
          </div>

          <div>
            <input
              type="date"
              name="passport_issue_date"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['passport_issue_date'] || ''}
              onChange={(e) => handleChange('passport_issue_date', e.target.value)}
              onBlur={(e) => handleBlur('passport_issue_date', e.target.value)}
              placeholder="Fecha de emisión"
              className={getInputClass('passport_issue_date')}
            />
          </div>

          <div>
            <input
              type="date"
              name="passport_expiry_date"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['passport_expiry_date'] || ''}
              onChange={(e) => handleChange('passport_expiry_date', e.target.value)}
              onBlur={(e) => handleBlur('passport_expiry_date', e.target.value)}
              placeholder="Fecha de expiración"
              className={getInputClass('passport_expiry_date')}
            />
          </div>

          <div className="md:col-span-2">
            <select
              name="passport_lost"
              disabled={readOnly}
              value={formData['passport_lost'] || ''}
              onChange={(e) => {
                handleChange('passport_lost', e.target.value);
                handleBlur('passport_lost', e.target.value);
              }}
              className={getInputClass('passport_lost')}
            >
              <option value="">¿Alguna vez su pasaporte se le ha perdido o ha sido robado?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['passport_lost'] === 'Sí' && (
            <>
              <input
                type="text"
                name="lost_passport_number"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['lost_passport_number'] || ''}
                onChange={(e) => handleChange('lost_passport_number', e.target.value)}
                onBlur={(e) => handleBlur('lost_passport_number', e.target.value)}
                placeholder="Número de pasaporte/documento de viaje"
                className={getInputClass('lost_passport_number')}
              />
              <input
                type="text"
                name="lost_passport_country"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['lost_passport_country'] || ''}
                onChange={(e) => handleChange('lost_passport_country', e.target.value)}
                onBlur={(e) => handleBlur('lost_passport_country', e.target.value)}
                placeholder="País/autoridad que emitió el pasaporte/documento"
                className={getInputClass('lost_passport_country')}
              />
              <div className="md:col-span-2">
                <textarea
                  rows={2}
                  name="lost_passport_details"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['lost_passport_details'] || ''}
                  onChange={(e) => handleChange('lost_passport_details', e.target.value)}
                  onBlur={(e) => handleBlur('lost_passport_details', e.target.value)}
                  placeholder="Explique qué ocurrió"
                  className={getInputClass('lost_passport_details')}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 7. INFORMACIÓN DE CONTACTO EN DESTINO */}
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['us_contact_name'] || ''}
              onChange={(e) => handleChange('us_contact_name', e.target.value)}
              onBlur={(e) => handleBlur('us_contact_name', e.target.value)}
              placeholder="Nombres completos de quien lo recibirá"
              className={getInputClass('us_contact_name')}
            />
          </div>

          <div>
            <input
              type="text"
              name="us_contact_organization"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['us_contact_organization'] || ''}
              onChange={(e) => handleChange('us_contact_organization', e.target.value)}
              onBlur={(e) => handleBlur('us_contact_organization', e.target.value)}
              placeholder="Nombre de la organización/hotel que lo recibirá"
              className={getInputClass('us_contact_organization')}
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="text"
              name="us_contact_relationship"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['us_contact_relationship'] || ''}
              onChange={(e) => handleChange('us_contact_relationship', e.target.value)}
              onBlur={(e) => handleBlur('us_contact_relationship', e.target.value)}
              placeholder="Indicar la relación que tiene con la persona u organización"
              className={getInputClass('us_contact_relationship')}
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="text"
              name="us_contact_address"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['us_contact_address'] || ''}
              onChange={(e) => handleChange('us_contact_address', e.target.value)}
              onBlur={(e) => handleBlur('us_contact_address', e.target.value)}
              placeholder={`Dirección completa en los ${countryName}`}
              className={getInputClass('us_contact_address')}
            />
          </div>

          <div>
            <input
              type="text"
              name="us_contact_city"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['us_contact_city'] || ''}
              onChange={(e) => handleChange('us_contact_city', e.target.value)}
              onBlur={(e) => handleBlur('us_contact_city', e.target.value)}
              placeholder="Ciudad"
              className={getInputClass('us_contact_city')}
            />
          </div>

          <div>
            <input
              type="text"
              name="us_contact_state"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['us_contact_state'] || ''}
              onChange={(e) => handleChange('us_contact_state', e.target.value)}
              onBlur={(e) => handleBlur('us_contact_state', e.target.value)}
              placeholder="Estado"
              className={getInputClass('us_contact_state')}
            />
          </div>

          <div>
            <input
              type="text"
              name="us_contact_zip"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['us_contact_zip'] || ''}
              onChange={(e) => handleChange('us_contact_zip', e.target.value)}
              onBlur={(e) => handleBlur('us_contact_zip', e.target.value)}
              placeholder="Código postal"
              className={getInputClass('us_contact_zip')}
            />
          </div>

          <div>
            <input
              type="text"
              name="us_contact_phone"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['us_contact_phone'] || ''}
              onChange={(e) => handleChange('us_contact_phone', e.target.value)}
              onBlur={(e) => handleBlur('us_contact_phone', e.target.value)}
              placeholder="Número telefónico"
              className={getInputClass('us_contact_phone')}
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="email"
              name="us_contact_email"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['us_contact_email'] || ''}
              onChange={(e) => handleChange('us_contact_email', e.target.value)}
              onBlur={(e) => handleBlur('us_contact_email', e.target.value)}
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
          {/* Padre */}
          <div>
            <p className="text-xs font-bold text-slate-800 mb-2">1. Padre</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="father_name"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['father_name'] || ''}
                onChange={(e) => handleChange('father_name', e.target.value)}
                onBlur={(e) => handleBlur('father_name', e.target.value)}
                placeholder="Nombre completo del padre"
                className={getInputClass('father_name')}
              />
              <input
                type="date"
                name="father_birthday"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['father_birthday'] || ''}
                onChange={(e) => handleChange('father_birthday', e.target.value)}
                onBlur={(e) => handleBlur('father_birthday', e.target.value)}
                placeholder="Fecha de nacimiento (opcional)"
                className={getInputClass('father_birthday')}
              />
              <div>
                <select
                  name="father_in_usa"
                  disabled={readOnly}
                  value={formData['father_in_usa'] || ''}
                  onChange={(e) => {
                    handleChange('father_in_usa', e.target.value);
                    handleBlur('father_in_usa', e.target.value);
                  }}
                  className={getInputClass('father_in_usa')}
                >
                  <option value="">¿Está su padre en los {countryName}?</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
              {formData['father_in_usa'] === 'Sí' && (
                <select
                  name="father_status"
                  disabled={readOnly}
                  value={formData['father_status'] || ''}
                  onChange={(e) => {
                    handleChange('father_status', e.target.value);
                    handleBlur('father_status', e.target.value);
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

          {/* Madre */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-800 mb-2">2. Madre</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="mother_name"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['mother_name'] || ''}
                onChange={(e) => handleChange('mother_name', e.target.value)}
                onBlur={(e) => handleBlur('mother_name', e.target.value)}
                placeholder="Nombre completo de la madre"
                className={getInputClass('mother_name')}
              />
              <input
                type="date"
                name="mother_birthday"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['mother_birthday'] || ''}
                onChange={(e) => handleChange('mother_birthday', e.target.value)}
                onBlur={(e) => handleBlur('mother_birthday', e.target.value)}
                placeholder="Fecha de nacimiento (opcional)"
                className={getInputClass('mother_birthday')}
              />
              <div>
                <select
                  name="mother_in_usa"
                  disabled={readOnly}
                  value={formData['mother_in_usa'] || ''}
                  onChange={(e) => {
                    handleChange('mother_in_usa', e.target.value);
                    handleBlur('mother_in_usa', e.target.value);
                  }}
                  className={getInputClass('mother_in_usa')}
                >
                  <option value="">¿Está su madre en los {countryName}?</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
              {formData['mother_in_usa'] === 'Sí' && (
                <select
                  name="mother_status"
                  disabled={readOnly}
                  value={formData['mother_status'] || ''}
                  onChange={(e) => {
                    handleChange('mother_status', e.target.value);
                    handleBlur('mother_status', e.target.value);
                  }}
                  className={getInputClass('mother_status')}
                >
                  <option value="">¿Estatus en {countryName}?</option>
                  <option value="Ciudadana americana">Ciudadana americana</option>
                  <option value="Residente legal permanente">Residente legal permanente</option>
                </select>
              )}
            </div>
          </div>

          {/* Parientes inmediatos */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-800 mb-2">3. Parientes inmediatos</p>
            <select
              name="immediate_relatives_usa"
              disabled={readOnly}
              value={formData['immediate_relatives_usa'] || ''}
              onChange={(e) => {
                handleChange('immediate_relatives_usa', e.target.value);
                handleBlur('immediate_relatives_usa', e.target.value);
              }}
              className={getInputClass('immediate_relatives_usa')}
            >
              <option value="">¿Tiene parientes inmediatos en los {countryName}?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>

            {formData['immediate_relatives_usa'] === 'Sí' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <input
                  type="text"
                  name="immediate_relative_name"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['immediate_relative_name'] || ''}
                  onChange={(e) => handleChange('immediate_relative_name', e.target.value)}
                  onBlur={(e) => handleBlur('immediate_relative_name', e.target.value)}
                  placeholder="Nombres completos"
                  className={getInputClass('immediate_relative_name')}
                />
                <input
                  type="text"
                  name="immediate_relative_relationship"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['immediate_relative_relationship'] || ''}
                  onChange={(e) => handleChange('immediate_relative_relationship', e.target.value)}
                  onBlur={(e) => handleBlur('immediate_relative_relationship', e.target.value)}
                  placeholder="Parentesco"
                  className={getInputClass('immediate_relative_relationship')}
                />
                <select
                  name="immediate_relative_status"
                  disabled={readOnly}
                  value={formData['immediate_relative_status'] || ''}
                  onChange={(e) => {
                    handleChange('immediate_relative_status', e.target.value);
                    handleBlur('immediate_relative_status', e.target.value);
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

          {/* Divorciado/a */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-800 mb-2">4. Divorciado/a</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="previous_spouses"
                disabled={readOnly}
                value={formData['previous_spouses'] || ''}
                onChange={(e) => {
                  handleChange('previous_spouses', e.target.value);
                  handleBlur('previous_spouses', e.target.value);
                }}
                className={getInputClass('previous_spouses')}
              >
                <option value="">¿Se ha divorciado con anterioridad?</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>

              {formData['previous_spouses'] === 'Sí' && (
                <input
                  type="number"
                  name="previous_spouses_number"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_spouses_number'] || ''}
                  onChange={(e) => handleChange('previous_spouses_number', e.target.value)}
                  onBlur={(e) => handleBlur('previous_spouses_number', e.target.value)}
                  placeholder="Número de previos esposos/esposas"
                  className={getInputClass('previous_spouses_number')}
                />
              )}
            </div>

            {formData['previous_spouses'] === 'Sí' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input
                  type="text"
                  name="previous_spouse1_name"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_spouse1_name'] || ''}
                  onChange={(e) => handleChange('previous_spouse1_name', e.target.value)}
                  onBlur={(e) => handleBlur('previous_spouse1_name', e.target.value)}
                  placeholder="Nombre completo del previo matrimonio 1"
                  className={getInputClass('previous_spouse1_name')}
                />
                <input
                  type="date"
                  name="previous_spouse1_birthday"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_spouse1_birthday'] || ''}
                  onChange={(e) => handleChange('previous_spouse1_birthday', e.target.value)}
                  onBlur={(e) => handleBlur('previous_spouse1_birthday', e.target.value)}
                  placeholder="Fecha de nacimiento"
                  className={getInputClass('previous_spouse1_birthday')}
                />
                <input
                  type="text"
                  name="previous_spouse1_country"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_spouse1_country'] || ''}
                  onChange={(e) => handleChange('previous_spouse1_country', e.target.value)}
                  onBlur={(e) => handleBlur('previous_spouse1_country', e.target.value)}
                  placeholder="País/región de origen"
                  className={getInputClass('previous_spouse1_country')}
                />
                <input
                  type="text"
                  name="previous_spouse1_city"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_spouse1_city'] || ''}
                  onChange={(e) => handleChange('previous_spouse1_city', e.target.value)}
                  onBlur={(e) => handleBlur('previous_spouse1_city', e.target.value)}
                  placeholder="Ciudad de nacimiento"
                  className={getInputClass('previous_spouse1_city')}
                />
                <input
                  type="text"
                  name="previous_spouse1_dates"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_spouse1_dates'] || ''}
                  onChange={(e) => handleChange('previous_spouse1_dates', e.target.value)}
                  onBlur={(e) => handleBlur('previous_spouse1_dates', e.target.value)}
                  placeholder="Fecha de casamiento y disolución"
                  className={getInputClass('previous_spouse1_dates')}
                />
                <input
                  type="text"
                  name="previous_spouse1_marriage_place"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_spouse1_marriage_place'] || ''}
                  onChange={(e) => handleChange('previous_spouse1_marriage_place', e.target.value)}
                  onBlur={(e) => handleBlur('previous_spouse1_marriage_place', e.target.value)}
                  placeholder="País/región donde el casamiento fue consumado"
                  className={getInputClass('previous_spouse1_marriage_place')}
                />
              </div>
            )}
          </div>

          {/* Cónyuge / Pareja */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-800 mb-2">5. Cónyuge / Unión libre / Unión civil</p>
            <select
              name="spouse"
              disabled={readOnly}
              value={formData['spouse'] || ''}
              onChange={(e) => {
                handleChange('spouse', e.target.value);
                handleBlur('spouse', e.target.value);
              }}
              className={getInputClass('spouse')}
            >
              <option value="">¿Cónyuge / Unión libre / Unión civil?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>

            {formData['spouse'] === 'Sí' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input
                  type="text"
                  name="spouse_name"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['spouse_name'] || ''}
                  onChange={(e) => handleChange('spouse_name', e.target.value)}
                  onBlur={(e) => handleBlur('spouse_name', e.target.value)}
                  placeholder="Nombres completos"
                  className={getInputClass('spouse_name')}
                />
                <input
                  type="date"
                  name="spouse_birthday"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['spouse_birthday'] || ''}
                  onChange={(e) => handleChange('spouse_birthday', e.target.value)}
                  onBlur={(e) => handleBlur('spouse_birthday', e.target.value)}
                  placeholder="Fecha de nacimiento"
                  className={getInputClass('spouse_birthday')}
                />
                <input
                  type="text"
                  name="spouse_country"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['spouse_country'] || ''}
                  onChange={(e) => handleChange('spouse_country', e.target.value)}
                  onBlur={(e) => handleBlur('spouse_country', e.target.value)}
                  placeholder="País/región de origen"
                  className={getInputClass('spouse_country')}
                />
                <input
                  type="text"
                  name="spouse_city"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['spouse_city'] || ''}
                  onChange={(e) => handleChange('spouse_city', e.target.value)}
                  onBlur={(e) => handleBlur('spouse_city', e.target.value)}
                  placeholder="Ciudad de nacimiento"
                  className={getInputClass('spouse_city')}
                />
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="spouse_address"
                    disabled={readOnly}
                    readOnly={readOnly}
                    value={formData['spouse_address'] || ''}
                    onChange={(e) => handleChange('spouse_address', e.target.value)}
                    onBlur={(e) => handleBlur('spouse_address', e.target.value)}
                    placeholder="Dirección de domicilio"
                    className={getInputClass('spouse_address')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Viudo/a */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-800 mb-2">6. Viudo/a</p>
            <select
              name="widow"
              disabled={readOnly}
              value={formData['widow'] || ''}
              onChange={(e) => {
                handleChange('widow', e.target.value);
                handleBlur('widow', e.target.value);
              }}
              className={getInputClass('widow')}
            >
              <option value="">¿Viudo/a?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>

            {formData['widow'] === 'Sí' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input
                  type="text"
                  name="widow_name"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['widow_name'] || ''}
                  onChange={(e) => handleChange('widow_name', e.target.value)}
                  onBlur={(e) => handleBlur('widow_name', e.target.value)}
                  placeholder="Nombres completos"
                  className={getInputClass('widow_name')}
                />
                <input
                  type="date"
                  name="widow_birthday"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['widow_birthday'] || ''}
                  onChange={(e) => handleChange('widow_birthday', e.target.value)}
                  onBlur={(e) => handleBlur('widow_birthday', e.target.value)}
                  placeholder="Fecha de nacimiento"
                  className={getInputClass('widow_birthday')}
                />
                <input
                  type="text"
                  name="widow_country"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['widow_country'] || ''}
                  onChange={(e) => handleChange('widow_country', e.target.value)}
                  onBlur={(e) => handleBlur('widow_country', e.target.value)}
                  placeholder="País/región de origen"
                  className={getInputClass('widow_country')}
                />
                <input
                  type="text"
                  name="widow_city"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['widow_city'] || ''}
                  onChange={(e) => handleChange('widow_city', e.target.value)}
                  onBlur={(e) => handleBlur('widow_city', e.target.value)}
                  placeholder="Ciudad de nacimiento"
                  className={getInputClass('widow_city')}
                />
              </div>
            )}
          </div>

          {/* Otros familiares */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-800 mb-2">7. Otros familiares</p>
            <select
              name="other_relative"
              disabled={readOnly}
              value={formData['other_relative'] || ''}
              onChange={(e) => {
                handleChange('other_relative', e.target.value);
                handleBlur('other_relative', e.target.value);
              }}
              className={getInputClass('other_relative')}
            >
              <option value="">¿Otros familiares?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>

            {formData['other_relative'] === 'Sí' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input
                  type="text"
                  name="other_relative_name"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['other_relative_name'] || ''}
                  onChange={(e) => handleChange('other_relative_name', e.target.value)}
                  onBlur={(e) => handleBlur('other_relative_name', e.target.value)}
                  placeholder="Nombres completos"
                  className={getInputClass('other_relative_name')}
                />
                <input
                  type="date"
                  name="other_relative_birthday"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['other_relative_birthday'] || ''}
                  onChange={(e) => handleChange('other_relative_birthday', e.target.value)}
                  onBlur={(e) => handleBlur('other_relative_birthday', e.target.value)}
                  placeholder="Fecha de nacimiento"
                  className={getInputClass('other_relative_birthday')}
                />
                <input
                  type="text"
                  name="other_relative_country"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['other_relative_country'] || ''}
                  onChange={(e) => handleChange('other_relative_country', e.target.value)}
                  onBlur={(e) => handleBlur('other_relative_country', e.target.value)}
                  placeholder="País/región de origen"
                  className={getInputClass('other_relative_country')}
                />
                <input
                  type="text"
                  name="other_relative_city"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['other_relative_city'] || ''}
                  onChange={(e) => handleChange('other_relative_city', e.target.value)}
                  onBlur={(e) => handleBlur('other_relative_city', e.target.value)}
                  placeholder="Ciudad de nacimiento"
                  className={getInputClass('other_relative_city')}
                />
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="other_relative_address"
                    disabled={readOnly}
                    readOnly={readOnly}
                    value={formData['other_relative_address'] || ''}
                    onChange={(e) => handleChange('other_relative_address', e.target.value)}
                    onBlur={(e) => handleBlur('other_relative_address', e.target.value)}
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
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['current_occupation'] || ''}
              onChange={(e) => handleChange('current_occupation', e.target.value)}
              onBlur={(e) => handleBlur('current_occupation', e.target.value)}
              placeholder="Ocupación primaria (especificar)"
              className={getInputClass('current_occupation')}
            />
            <input
              type="text"
              name="current_employer"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['current_employer'] || ''}
              onChange={(e) => handleChange('current_employer', e.target.value)}
              onBlur={(e) => handleBlur('current_employer', e.target.value)}
              placeholder="Nombre del empleador o institución educativa"
              className={getInputClass('current_employer')}
            />
            <div className="md:col-span-2">
              <input
                type="text"
                name="current_address"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['current_address'] || ''}
                onChange={(e) => handleChange('current_address', e.target.value)}
                onBlur={(e) => handleBlur('current_address', e.target.value)}
                placeholder="Dirección completa"
                className={getInputClass('current_address')}
              />
            </div>
            <input
              type="text"
              name="current_city_country"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['current_city_country'] || ''}
              onChange={(e) => handleChange('current_city_country', e.target.value)}
              onBlur={(e) => handleBlur('current_city_country', e.target.value)}
              placeholder="País, provincia, ciudad y código postal"
              className={getInputClass('current_city_country')}
            />
            <input
              type="text"
              name="current_phone"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['current_phone'] || ''}
              onChange={(e) => handleChange('current_phone', e.target.value)}
              onBlur={(e) => handleBlur('current_phone', e.target.value)}
              placeholder="Número telefónico"
              className={getInputClass('current_phone')}
            />
            <input
              type="date"
              name="current_start_date"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['current_start_date'] || ''}
              onChange={(e) => handleChange('current_start_date', e.target.value)}
              onBlur={(e) => handleBlur('current_start_date', e.target.value)}
              className={getInputClass('current_start_date')}
            />
            <input
              type="number"
              name="current_income"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['current_income'] || ''}
              onChange={(e) => handleChange('current_income', e.target.value)}
              onBlur={(e) => handleBlur('current_income', e.target.value)}
              placeholder="Ingreso mensual (si está empleado)"
              className={getInputClass('current_income')}
            />
            <div className="md:col-span-2">
              <textarea
                rows={2}
                name="current_responsibilities"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['current_responsibilities'] || ''}
                onChange={(e) => handleChange('current_responsibilities', e.target.value)}
                onBlur={(e) => handleBlur('current_responsibilities', e.target.value)}
                placeholder="Brevemente describa sus responsabilidades"
                className={getInputClass('current_responsibilities')}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-800 mb-2">2. Pasado</p>
            <select
              name="previously_employed"
              disabled={readOnly}
              value={formData['previously_employed'] || ''}
              onChange={(e) => {
                handleChange('previously_employed', e.target.value);
                handleBlur('previously_employed', e.target.value);
              }}
              className={getInputClass('previously_employed')}
            >
              <option value="">¿Estuvo previamente empleado?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>

            {formData['previously_employed'] === 'Sí' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input
                  type="text"
                  name="previous_employer1_name"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_employer1_name'] || ''}
                  onChange={(e) => handleChange('previous_employer1_name', e.target.value)}
                  onBlur={(e) => handleBlur('previous_employer1_name', e.target.value)}
                  placeholder="Nombre de la empresa"
                  className={getInputClass('previous_employer1_name')}
                />
                <input
                  type="text"
                  name="previous_employer1_address"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_employer1_address'] || ''}
                  onChange={(e) => handleChange('previous_employer1_address', e.target.value)}
                  onBlur={(e) => handleBlur('previous_employer1_address', e.target.value)}
                  placeholder="Dirección completa"
                  className={getInputClass('previous_employer1_address')}
                />
                <input
                  type="text"
                  name="previous_employer1_city_country"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_employer1_city_country'] || ''}
                  onChange={(e) => handleChange('previous_employer1_city_country', e.target.value)}
                  onBlur={(e) => handleBlur('previous_employer1_city_country', e.target.value)}
                  placeholder="País, provincia, ciudad y código postal"
                  className={getInputClass('previous_employer1_city_country')}
                />
                <input
                  type="text"
                  name="previous_employer1_phone"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_employer1_phone'] || ''}
                  onChange={(e) => handleChange('previous_employer1_phone', e.target.value)}
                  onBlur={(e) => handleBlur('previous_employer1_phone', e.target.value)}
                  placeholder="Número telefónico"
                  className={getInputClass('previous_employer1_phone')}
                />
                <input
                  type="text"
                  name="previous_employer1_role"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_employer1_role'] || ''}
                  onChange={(e) => handleChange('previous_employer1_role', e.target.value)}
                  onBlur={(e) => handleBlur('previous_employer1_role', e.target.value)}
                  placeholder="Rol/cargo que desempeñaba"
                  className={getInputClass('previous_employer1_role')}
                />
                <input
                  type="text"
                  name="previous_employer1_supervisor"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_employer1_supervisor'] || ''}
                  onChange={(e) => handleChange('previous_employer1_supervisor', e.target.value)}
                  onBlur={(e) => handleBlur('previous_employer1_supervisor', e.target.value)}
                  placeholder="Nombres completos de su supervisor/jefe directo"
                  className={getInputClass('previous_employer1_supervisor')}
                />
                <input
                  type="text"
                  name="previous_employer1_period"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_employer1_period'] || ''}
                  onChange={(e) => handleChange('previous_employer1_period', e.target.value)}
                  onBlur={(e) => handleBlur('previous_employer1_period', e.target.value)}
                  placeholder="¿Desde cuándo hasta cuándo laboró?"
                  className={getInputClass('previous_employer1_period')}
                />
                <textarea
                  rows={2}
                  name="previous_employer1_responsibilities"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['previous_employer1_responsibilities'] || ''}
                  onChange={(e) => handleChange('previous_employer1_responsibilities', e.target.value)}
                  onBlur={(e) => handleBlur('previous_employer1_responsibilities', e.target.value)}
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
              disabled={readOnly}
              value={formData['studied_high_school_or_higher'] || ''}
              onChange={(e) => {
                handleChange('studied_high_school_or_higher', e.target.value);
                handleBlur('studied_high_school_or_higher', e.target.value);
              }}
              className={getInputClass('studied_high_school_or_higher')}
            >
              <option value="">¿Ha estudiado bachillerato o nivel superior?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>

            {formData['studied_high_school_or_higher'] === 'Sí' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input
                  type="text"
                  name="education_institution"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['education_institution'] || ''}
                  onChange={(e) => handleChange('education_institution', e.target.value)}
                  onBlur={(e) => handleBlur('education_institution', e.target.value)}
                  placeholder="Nombre de la institución"
                  className={getInputClass('education_institution')}
                />
                <input
                  type="text"
                  name="education_address"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['education_address'] || ''}
                  onChange={(e) => handleChange('education_address', e.target.value)}
                  onBlur={(e) => handleBlur('education_address', e.target.value)}
                  placeholder="Dirección completa"
                  className={getInputClass('education_address')}
                />
                <input
                  type="text"
                  name="education_city_country"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['education_city_country'] || ''}
                  onChange={(e) => handleChange('education_city_country', e.target.value)}
                  onBlur={(e) => handleBlur('education_city_country', e.target.value)}
                  placeholder="País, provincia, ciudad y código postal"
                  className={getInputClass('education_city_country')}
                />
                <input
                  type="text"
                  name="education_phone"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['education_phone'] || ''}
                  onChange={(e) => handleChange('education_phone', e.target.value)}
                  onBlur={(e) => handleBlur('education_phone', e.target.value)}
                  placeholder="Número telefónico"
                  className={getInputClass('education_phone')}
                />
                <input
                  type="text"
                  name="education_course"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['education_course'] || ''}
                  onChange={(e) => handleChange('education_course', e.target.value)}
                  onBlur={(e) => handleBlur('education_course', e.target.value)}
                  placeholder="Especificar curso de estudio / especialidad"
                  className={getInputClass('education_course')}
                />
                <input
                  type="text"
                  name="education_supervisor"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['education_supervisor'] || ''}
                  onChange={(e) => handleChange('education_supervisor', e.target.value)}
                  onBlur={(e) => handleBlur('education_supervisor', e.target.value)}
                  placeholder="Nombres completos de supervisor/jefe directo"
                  className={getInputClass('education_supervisor')}
                />
                <input
                  type="text"
                  name="education_period"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['education_period'] || ''}
                  onChange={(e) => handleChange('education_period', e.target.value)}
                  onBlur={(e) => handleBlur('education_period', e.target.value)}
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
            disabled={readOnly}
            readOnly={readOnly}
            value={formData['clan_or_tribe'] || ''}
            onChange={(e) => handleChange('clan_or_tribe', e.target.value)}
            onBlur={(e) => handleBlur('clan_or_tribe', e.target.value)}
            placeholder="¿Pertenece a algún clan o tribu? (indicar el nombre)"
            className={getInputClass('clan_or_tribe')}
          />

          <input
            type="text"
            name="other_language"
            disabled={readOnly}
            readOnly={readOnly}
            value={formData['other_language'] || ''}
            onChange={(e) => handleChange('other_language', e.target.value)}
            onBlur={(e) => handleBlur('other_language', e.target.value)}
            placeholder="¿Qué otro idioma domina aparte del español?"
            className={getInputClass('other_language')}
          />

          <div className="md:col-span-2">
            <textarea
              rows={2}
              name="countries_visited_last5years"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['countries_visited_last5years'] || ''}
              onChange={(e) => handleChange('countries_visited_last5years', e.target.value)}
              onBlur={(e) => handleBlur('countries_visited_last5years', e.target.value)}
              placeholder="¿Ha viajado a otro país/región en los últimos 5 años? Indique en cuáles estuvo"
              className={getInputClass('countries_visited_last5years')}
            />
          </div>

          <div className="md:col-span-2">
            <textarea
              rows={2}
              name="organization_participation"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['organization_participation'] || ''}
              onChange={(e) => handleChange('organization_participation', e.target.value)}
              onBlur={(e) => handleBlur('organization_participation', e.target.value)}
              placeholder="¿Ha pertenecido, contribuido o trabajado para alguna organización profesional, social o benéfica? Indique cuáles"
              className={getInputClass('organization_participation')}
            />
          </div>

          <div className="md:col-span-2">
            <textarea
              rows={2}
              name="special_skills"
              disabled={readOnly}
              readOnly={readOnly}
              value={formData['special_skills'] || ''}
              onChange={(e) => handleChange('special_skills', e.target.value)}
              onBlur={(e) => handleBlur('special_skills', e.target.value)}
              placeholder="¿Tiene alguna habilidad o capacitación especializada (armas de fuego, explosivos, experiencia nuclear, biológica o química)? Explique"
              className={getInputClass('special_skills')}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">¿Ha servido en la milicia?</label>
            <select
              name="military_service"
              disabled={readOnly}
              value={formData['military_service'] || ''}
              onChange={(e) => {
                handleChange('military_service', e.target.value);
                handleBlur('military_service', e.target.value);
              }}
              className={getInputClass('military_service')}
            >
              <option value="">¿Ha servido en la milicia?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData['military_service'] === 'Sí' && (
            <>
              <input
                type="text"
                name="military_country"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['military_country'] || ''}
                onChange={(e) => handleChange('military_country', e.target.value)}
                onBlur={(e) => handleBlur('military_country', e.target.value)}
                placeholder="Nombre del país/región en la que sirvió"
                className={getInputClass('military_country')}
              />
              <input
                type="text"
                name="military_branch"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['military_branch'] || ''}
                onChange={(e) => handleChange('military_branch', e.target.value)}
                onBlur={(e) => handleBlur('military_branch', e.target.value)}
                placeholder="Rama de servicio"
                className={getInputClass('military_branch')}
              />
              <input
                type="text"
                name="military_rank"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['military_rank'] || ''}
                onChange={(e) => handleChange('military_rank', e.target.value)}
                onBlur={(e) => handleBlur('military_rank', e.target.value)}
                placeholder="Rango/posición"
                className={getInputClass('military_rank')}
              />
              <input
                type="text"
                name="military_specialty"
                disabled={readOnly}
                readOnly={readOnly}
                value={formData['military_specialty'] || ''}
                onChange={(e) => handleChange('military_specialty', e.target.value)}
                onBlur={(e) => handleBlur('military_specialty', e.target.value)}
                placeholder="Especialidad militar"
                className={getInputClass('military_specialty')}
              />
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="military_period"
                  disabled={readOnly}
                  readOnly={readOnly}
                  value={formData['military_period'] || ''}
                  onChange={(e) => handleChange('military_period', e.target.value)}
                  onBlur={(e) => handleBlur('military_period', e.target.value)}
                  placeholder="¿Desde cuándo hasta cuándo estuvo sirviendo?"
                  className={getInputClass('military_period')}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
