'use client';

import React from 'react';
import { TravelPackagePosPage } from '../../../views/TravelPackagePosPage';
import { TravelPackageCartProvider } from '../../../context/TravelPackageCartContext';

export default function Page() {
  return (
    <TravelPackageCartProvider>
      <TravelPackagePosPage />
    </TravelPackageCartProvider>
  );
}
