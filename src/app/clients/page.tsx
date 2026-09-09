'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { ClientsPage } from '@/views/ClientsPage';

export default function ClientsRoute() {
  return (
    <ProtectedRoute permission={['view_clients', 'view_crm']}>
      <Layout>
        <ClientsPage />
      </Layout>
    </ProtectedRoute>
  );
}
