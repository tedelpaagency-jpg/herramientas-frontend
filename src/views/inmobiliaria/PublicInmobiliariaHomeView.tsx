'use client';

import React from 'react';
import PublicPortalHomeView from '@/components/inmobiliaria/PublicPortalHomeView';
import ClientRoot from '@/components/ClientRoot';
import { PublicAgencyConfig } from '@/services/publicInmobiliariaService';

interface PublicInmobiliariaHomeViewProps {
  initialConfig?: PublicAgencyConfig | null;
  domainOverride?: string;
}

export const PublicInmobiliariaHomeView: React.FC<PublicInmobiliariaHomeViewProps> = ({
  initialConfig,
  domainOverride,
}) => {
  return (
    <div className="travel-agency-03-root">
      <ClientRoot>
        <PublicPortalHomeView
          initialAgency={initialConfig}
          domain={domainOverride}
        />
      </ClientRoot>
    </div>
  );
};

export default PublicInmobiliariaHomeView;
