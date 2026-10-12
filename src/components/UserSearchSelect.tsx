'use client';

import React, { useMemo } from 'react';
import { SearchableSelect, SearchableSelectOption } from './SearchableSelect';
import { User as UserIcon, Building2 } from 'lucide-react';
import { User, Agency } from '../types';

export interface UserSearchSelectProps {
  users: User[] | any[];
  value: string | number | null | undefined;
  onChange: (userId: any) => void;
  agencies?: Agency[] | any[];
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

export const UserSearchSelect: React.FC<UserSearchSelectProps> = ({
  users,
  value,
  onChange,
  agencies = [],
  placeholder = '-- Seleccionar Usuario / Asesor --',
  allowAll = false,
  allLabel = '👤 Todos los Asesores / Usuarios',
  allValue = '',
  disabled = false,
  className = '',
  buttonClassName = '',
  size = 'md',
  required = false,
}) => {
  const options: SearchableSelectOption[] = useMemo(() => {
    return users.map((u) => {
      // Resolve agency name
      let agencyName = u.agency?.name;
      if (!agencyName && u.agency_id && agencies.length > 0) {
        const match = agencies.find((a: any) => a.id === u.agency_id);
        if (match) agencyName = match.name;
      }
      if (!agencyName && u.agencies && Array.isArray(u.agencies) && u.agencies.length > 0) {
        agencyName = u.agencies.map((a: any) => a.name).join(', ');
      }

      const sublabelParts: string[] = [];
      if (agencyName) sublabelParts.push(`🏢 ${agencyName}`);
      if (u.email) sublabelParts.push(u.email);

      return {
        value: u.id,
        label: u.name,
        sublabel: sublabelParts.length > 0 ? sublabelParts.join(' • ') : undefined,
        badge: u.role || undefined,
        icon: (
          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold flex items-center justify-center text-[10px] shrink-0">
            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
          </div>
        ),
      };
    });
  }, [users, agencies]);

  const allOption = allowAll
    ? {
        value: allValue,
        label: `${allLabel} (${users.length})`,
        icon: <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
      }
    : undefined;

  return (
    <SearchableSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Buscar por nombre, email o agencia..."
      emptyMessage="No se encontraron usuarios"
      icon={<UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
      disabled={disabled}
      className={className}
      buttonClassName={buttonClassName}
      size={size}
      required={required}
      allOption={allOption}
    />
  );
};

export default UserSearchSelect;
