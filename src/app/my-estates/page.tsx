'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { EstatesPage } from '@/views/EstatesPage';

export default function MyEstatesRoute() {
  return (
    <ProtectedRoute permission="view_estates">
      <Layout>
        <EstatesPage initialScope="my_estates" />
      </Layout>
    </ProtectedRoute>
  );
}

