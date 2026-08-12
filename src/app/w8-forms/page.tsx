'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { W8FormsPage } from '@/views/W8FormsPage';

export default function W8FormsRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <W8FormsPage />
      </Layout>
    </ProtectedRoute>
  );
}
