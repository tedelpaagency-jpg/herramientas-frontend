'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { AdminClearingPage } from '@/views/AdminClearingPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Layout>
        <AdminClearingPage />
      </Layout>
    </ProtectedRoute>
  );
}
