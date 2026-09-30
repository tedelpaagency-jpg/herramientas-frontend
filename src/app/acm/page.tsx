'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { AcmPage } from '@/views/AcmPage';

export default function AcmRoute() {
  return (
    <ProtectedRoute permission="view_estates">
      <Layout>
        <AcmPage />
      </Layout>
    </ProtectedRoute>
  );
}
