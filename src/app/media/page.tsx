'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import MediaLibraryPage from '@/views/MediaLibraryPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Layout>
        <MediaLibraryPage />
      </Layout>
    </ProtectedRoute>
  );
}
