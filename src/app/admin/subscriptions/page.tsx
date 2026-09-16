'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { AdminSubscriptionsPage } from '@/views/admin/AdminSubscriptionsPage';

export default function AdminSubscriptionsRoute() {
  return (
    <ProtectedRoute permission={['manage_agencies', 'manage_users', 'view_subscriptions', 'subscriptions.view']}>
      <Layout>
        <AdminSubscriptionsPage />
      </Layout>
    </ProtectedRoute>
  );
}
