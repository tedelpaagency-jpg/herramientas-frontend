'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import MyCoursesPage from '@/views/MyCoursesPage';

export default function MyCoursesRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <MyCoursesPage />
      </Layout>
    </ProtectedRoute>
  );
}
