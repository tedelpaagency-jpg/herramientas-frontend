'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { AcmPage } from '@/views/AcmPage';

export default function AcmRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <AcmPage />
      </Layout>
    </ProtectedRoute>
  );
}
