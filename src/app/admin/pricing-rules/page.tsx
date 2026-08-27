'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { AdminPricingRulesPage } from '@/views/AdminPricingRulesPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Layout>
        <AdminPricingRulesPage />
      </Layout>
    </ProtectedRoute>
  );
}
