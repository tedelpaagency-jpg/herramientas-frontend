import { Suspense } from 'react';
import PublicInmobiliariaPrivacyView from '@/views/inmobiliaria/PublicInmobiliariaPrivacyView';

export const metadata = {
  title: 'Política de Privacidad y Uso de Datos | Portal Inmobiliario',
  description: 'Conozca nuestras políticas de privacidad, tratamiento de datos personales y garantías de seguridad.',
};

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PublicInmobiliariaPrivacyView />
    </Suspense>
  );
}
