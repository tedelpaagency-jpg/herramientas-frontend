/**
 * Canonical definitions for visa sections and their respective field keys.
 * Used to calculate per-section completion and drive section-level saving.
 */

export interface VisaSectionDef {
  id: string;
  title: string;
  fields: string[];
}

export const SCHENGEN_SECTIONS: VisaSectionDef[] = [
  {
    id: 'casillas_1_11',
    title: 'Casillas 1-11: Datos Personales e Identificación',
    fields: [
      'surname',
      'birth_surname',
      'first_names',
      'birthday',
      'birth_place',
      'birth_country',
      'current_nationality',
      'sex',
      'marital_status',
      'cedula',
      'processing_location',
    ],
  },
  {
    id: 'casillas_12_16',
    title: 'Casillas 12-16: Documento de Viaje / Pasaporte',
    fields: [
      'travel_document_type',
      'passport_number',
      'passport_issue_date',
      'passport_expiry_date',
      'passport_country_city',
    ],
  },
  {
    id: 'casillas_17_18',
    title: 'Casillas 17-18: Familiar Ciudadano UE / EEE / Suiza / RU',
    fields: ['eu_family_member'],
  },
  {
    id: 'casillas_19_20',
    title: 'Casillas 19-20: Domicilio, Contacto y Residencia',
    fields: [
      'home_address',
      'phone_primary',
      'email_primary',
      'resident_other_country',
    ],
  },
  {
    id: 'casillas_21_22',
    title: 'Casillas 21-22: Profesión y Datos del Empleador / Estudios',
    fields: ['current_occupation', 'current_employer_school'],
  },
  {
    id: 'casillas_23_28',
    title: 'Casillas 23-28: Motivos del Viaje y Datos de la Estancia',
    fields: [
      'travel_purpose',
      'schengen_main_destination',
      'schengen_first_entry',
      'entries_requested',
      'intended_arrival_date',
      'intended_departure_date',
    ],
  },
  {
    id: 'casillas_29_30',
    title: 'Casillas 29-30: Impresiones Dactilares y Permisos de Entrada',
    fields: ['fingerprints_taken', 'final_destination_permit'],
  },
  {
    id: 'casillas_31_32',
    title: 'Casillas 31-32: Invitación, Hotel u Organización',
    fields: ['host_invitation_details', 'company_invitation_details'],
  },
  {
    id: 'casilla_33',
    title: 'Casilla 33: Gastos de Viaje y Medios de Subsistencia',
    fields: ['travel_expenses_covered_by', 'means_of_support'],
  },
  {
    id: 'casilla_34',
    title: 'Casilla 34: Tercera Persona Cumplimentadora',
    fields: ['third_party_filler'],
  },
];

export const USA_CANADA_SECTIONS: VisaSectionDef[] = [
  {
    id: 'sec_personal',
    title: '1. Información Personal',
    fields: [
      'name',
      'birthday',
      'born_city',
      'marital_status',
      'sex',
      'has_other_nationality',
    ],
  },
  {
    id: 'sec_travel_1',
    title: '2. Información del Viaje 1',
    fields: [
      'travel_date',
      'stay_duration',
      'address_in_usa',
      'payer_name',
      'payer_phone',
    ],
  },
  {
    id: 'sec_travel_2',
    title: '3. Información del Viaje 2',
    fields: ['has_other_persons'],
  },
  {
    id: 'sec_travel_3',
    title: '4. Información del Viaje 3',
    fields: ['has_been_usa'],
  },
  {
    id: 'sec_contact',
    title: '5. Domicilio e Información de Contacto',
    fields: [
      'street_address',
      'city',
      'state_province',
      'phone_primary',
      'email_primary',
    ],
  },
  {
    id: 'sec_passport',
    title: '6. Información del Pasaporte',
    fields: [
      'passport_type',
      'passport_number',
      'passport_country_city',
      'passport_issue_date',
      'passport_expiry_date',
    ],
  },
  {
    id: 'sec_destination_contact',
    title: '7. Información de Contacto en Destino',
    fields: ['contact_person_name', 'contact_phone'],
  },
  {
    id: 'sec_family',
    title: '8. Información Familiar',
    fields: [
      'father_surname',
      'father_first_names',
      'mother_surname',
      'mother_first_names',
    ],
  },
  {
    id: 'sec_work_education',
    title: '9. Información Laboral / Educativa',
    fields: [
      'primary_occupation',
      'employer_school_name',
      'employer_phone',
      'monthly_salary',
    ],
  },
  {
    id: 'sec_additional',
    title: '10. Información Adicional',
    fields: ['languages_spoken', 'traveled_last_five_years'],
  },
  {
    id: 'sec_documents',
    title: 'Subir Documentos',
    fields: ['proof_file', 'id_card_file', 'passport_file'],
  },
];

export interface SectionProgressResult {
  total: number;
  filled: number;
  missing: number;
  percentage: number;
  isComplete: boolean;
  sectionFieldsData: Record<string, any>;
}

export function calculateSectionProgress(
  section: VisaSectionDef,
  formData: Record<string, any>,
  extraData?: Record<string, any>
): SectionProgressResult {
  const merged = { ...extraData, ...formData };
  const total = section.fields.length;
  let filled = 0;
  const sectionFieldsData: Record<string, any> = {};

  for (const field of section.fields) {
    const val = merged[field];
    sectionFieldsData[field] = val ?? '';
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      filled++;
    }
  }

  const missing = Math.max(0, total - filled);
  const percentage = total > 0 ? Math.round((filled / total) * 100) : 100;
  const isComplete = total > 0 && filled >= total;

  return {
    total,
    filled,
    missing,
    percentage,
    isComplete,
    sectionFieldsData,
  };
}
