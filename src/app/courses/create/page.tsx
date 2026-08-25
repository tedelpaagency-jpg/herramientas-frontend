'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CourseAdminRoute from '@/components/CourseAdminRoute';
import Layout from '@/components/Layout';
import CourseFormPage from '@/views/CourseFormPage';

export default function CourseCreateRoutePage() {
  return (
    <ProtectedRoute>
      <CourseAdminRoute>
        <Layout>
          <CourseFormPage />
        </Layout>
      </CourseAdminRoute>
    </ProtectedRoute>
  );
}
