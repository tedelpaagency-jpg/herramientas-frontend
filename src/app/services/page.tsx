import { Suspense } from 'react';
import PublicInmobiliariaServicesView from '@/views/inmobiliaria/PublicInmobiliariaServicesView';

export const metadata = {
  title: 'Servicios Inmobiliarios Especializados | Inmobiliaria',
  description: 'Compra, venta, alquiler, asesoría legal, créditos hipotecarios y avalúos comerciales con expertos certificados.',
};

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PublicInmobiliariaServicesView />
    </Suspense>
  );
}

