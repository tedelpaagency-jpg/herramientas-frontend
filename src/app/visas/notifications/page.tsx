'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { VisaNotificationsPage } from '@/views/visas/VisaNotificationsPage';

export default function VisaNotificationsRoute() {
  return (
    <ProtectedRoute permission={['view_visas', 'visas.view']}>
      <Layout>
        <VisaNotificationsPage />
      </Layout>
    </ProtectedRoute>
  );
}
