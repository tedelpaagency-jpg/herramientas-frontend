import React from 'react';
import PublicPortalLoader from '@/components/inmobiliaria/PublicPortalLoader';

export default function PropertiesLoading() {
  return (
    <PublicPortalLoader
      isOpen={true}
      message="Cargando propiedades..."
    />
  );
}
