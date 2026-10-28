'use client';

import React from 'react';
import PublicPortalHomeView from '@/components/inmobiliaria/PublicPortalHomeView';
import ClientRoot from '@/components/ClientRoot';
import { PublicAgencyConfig } from '@/services/publicInmobiliariaService';

// Stylesheets for Public Real Estate Portal
import '../../../public/assets/css/bootstrap.min.css';
import '../../../public/assets/css/bootstrap-icons.css';
import '../../../public/assets/css/animate.min.css';
import '../../../public/assets/css/swiper-bundle.min.css';
import '../../../public/assets/css/nice-select.css';
import '../../../public/assets/css/boxicons.min.css';
import '../../../public/assets/css/style.css';

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
