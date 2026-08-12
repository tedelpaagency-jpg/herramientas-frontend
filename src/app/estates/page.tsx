'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { EstatesPage } from '@/views/EstatesPage';

export default function EstatesRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <EstatesPage />
      </Layout>
    </ProtectedRoute>
  );
}
