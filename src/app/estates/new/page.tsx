'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { EstateFormPage } from '@/views/EstateFormPage';

export default function EstateFormNewRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <EstateFormPage />
      </Layout>
    </ProtectedRoute>
  );
}
