'use client';

import React from 'react';
import { SchengenConsularForm } from './SchengenConsularForm';
import { UsaCanadaConsularForm } from './UsaCanadaConsularForm';

export interface ConsularFormRendererProps {
  countryDestination?: string;
  visaType?: string;
  processSlug?: string;
  formData: Record<string, any>;
  onFieldChange?: (fieldName: string, value: any) => void;
  onFieldBlur?: (fieldName: string, value: any) => void;
  onSaveSection?: (sectionId: string, fields: Record<string, any>) => void;
  savingSectionId?: string | null;
  savedSectionId?: string | null;
  applicantName?: string;
  passportNumber?: string;
  readOnly?: boolean;
}

export const ConsularFormRenderer: React.FC<ConsularFormRendererProps> = ({
  countryDestination = '',
  visaType = '',
  processSlug = '',
  formData = {},
  onFieldChange,
  onFieldBlur,
  onSaveSection,
  savingSectionId = null,
  savedSectionId = null,
  applicantName = '',
  passportNumber = '',
  readOnly = false,
}) => {
  const norm = (countryDestination + ' ' + visaType + ' ' + processSlug).toLowerCase();

  const isSchengen = norm.includes('schengen') || norm.includes('europa') || norm.includes('europe');
  const isCanada = norm.includes('canad') || norm.includes('imm-5257') || norm.includes('imm5257');
  const isUk = norm.includes('reino unido') || norm.includes('uk') || norm.includes('united kingdom') || norm.includes('inglaterra');
  const isUsa = !isSchengen && !isCanada && !isUk;
  const countryName = isUsa ? 'Estados Unidos' : isCanada ? 'Canadá' : isUk ? 'Reino Unido' : 'Espacio Schengen (Europa)';

  if (isSchengen) {
    return (
      <SchengenConsularForm
        formData={formData}
        onFieldChange={onFieldChange}
        onFieldBlur={onFieldBlur}
        onSaveSection={onSaveSection}
        savingSectionId={savingSectionId}
        savedSectionId={savedSectionId}
        applicantName={applicantName}
        passportNumber={passportNumber}
        readOnly={readOnly}
      />
    );
  }

  return (
    <UsaCanadaConsularForm
      formData={formData}
      onFieldChange={onFieldChange}
      onFieldBlur={onFieldBlur}
      onSaveSection={onSaveSection}
      savingSectionId={savingSectionId}
      savedSectionId={savedSectionId}
      applicantName={applicantName}
      passportNumber={passportNumber}
      countryName={countryName}
      isUsa={isUsa}
      readOnly={readOnly}
    />
  );
};

export default ConsularFormRenderer;
