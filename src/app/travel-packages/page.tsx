'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { TravelPackageCartProvider } from '@/context/TravelPackageCartContext';
import { TravelPackagePosPage } from '@/views/TravelPackagePosPage';

export default function TravelPackagesRoutePage() {
  return (
    <ProtectedRoute permission="packages.view">
      <Layout>
        <TravelPackageCartProvider>
          <TravelPackagePosPage />
        </TravelPackageCartProvider>
      </Layout>
    </ProtectedRoute>
  );
}
