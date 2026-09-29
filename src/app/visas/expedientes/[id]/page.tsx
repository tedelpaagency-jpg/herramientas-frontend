'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { VisaDossier360Page } from '@/views/visas/VisaDossier360Page';

export default function VisaDossier360Route() {
  return (
    <ProtectedRoute permission={['view_visas', 'visas.view']}>
      <Layout>
        <VisaDossier360Page />
      </Layout>
    </ProtectedRoute>
  );
}
