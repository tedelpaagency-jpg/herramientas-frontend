'use client';

import React, { useMemo } from 'react';
import { SearchableSelect, SearchableSelectOption } from './SearchableSelect';
import { Building2 } from 'lucide-react';
import { Agency } from '../types';

export interface AgencySearchSelectProps {
  agencies: Agency[] | any[];
  value: string | number | null | undefined;
  onChange: (agencyId: any) => void;
  placeholder?: string;
  allowAll?: boolean;
  allLabel?: string;
  allValue?: string | number;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
}

export const AgencySearchSelect: React.FC<AgencySearchSelectProps> = ({
  agencies,
  value,
  onChange,
  placeholder = '-- Seleccionar Agencia --',
  allowAll = false,
  allLabel = '🏢 Todas las Agencias',
  allValue = '',
  disabled = false,
  className = '',
  buttonClassName = '',
  size = 'md',
  required = false,
}) => {
  const options: SearchableSelectOption[] = useMemo(() => {
    return agencies.map((ag) => {
      const locationParts = [ag.city, ag.province, ag.country].filter(Boolean);
      const sublabel = locationParts.length > 0 ? locationParts.join(', ') : ag.domain || ag.ruc || '';

      return {
        value: ag.id,
        label: ag.name,
        sublabel: sublabel ? `📍 ${sublabel}` : undefined,
        badge: `ID #${ag.id}`,
        icon: <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />,
      };
    });
  }, [agencies]);

  const allOption = allowAll
    ? {
        value: allValue,
        label: `${allLabel} (${agencies.length})`,
        icon: <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />,
      }
    : undefined;

  return (
    <SearchableSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Buscar agencia por nombre, ciudad o ID..."
      emptyMessage="No se encontraron agencias"
      icon={<Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />}
      disabled={disabled}
      className={className}
      buttonClassName={buttonClassName}
      size={size}
      required={required}
      allOption={allOption}
    />
  );
};

export default AgencySearchSelect;
