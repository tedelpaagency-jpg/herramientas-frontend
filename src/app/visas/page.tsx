'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { VisasPage } from '@/views/VisasPage';

export default function VisasRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <VisasPage />
      </Layout>
    </ProtectedRoute>
  );
}
