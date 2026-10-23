'use client';

import React from 'react';
import TravelAgency03Page from '@/app/travel-agency-03/page';
import ClientRoot from '@/components/ClientRoot';
import { PublicAgencyConfig } from '@/services/publicInmobiliariaService';

interface PublicInmobiliariaHomeViewProps {
  initialConfig?: PublicAgencyConfig | null;
  domainOverride?: string;
}

export const PublicInmobiliariaHomeView: React.FC<PublicInmobiliariaHomeViewProps> = () => {
  return (
    <div className="travel-agency-03-root">
      <ClientRoot>
        <TravelAgency03Page />
      </ClientRoot>
    </div>
  );
};

export default PublicInmobiliariaHomeView;
