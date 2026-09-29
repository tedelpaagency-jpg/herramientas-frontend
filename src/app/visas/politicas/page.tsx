'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { VisaAgencyPoliciesPage } from '@/views/visas/VisaAgencyPoliciesPage';

export default function VisaAgencyPoliciesRoute() {
  return (
    <ProtectedRoute permission={['view_visas', 'visas.view']}>
      <Layout>
        <VisaAgencyPoliciesPage />
      </Layout>
    </ProtectedRoute>
  );
}
