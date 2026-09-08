'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import BrandingCustomizationPage from '@/views/admin/BrandingCustomizationPage';

export default function BrandingRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <BrandingCustomizationPage />
      </Layout>
    </ProtectedRoute>
  );
}
