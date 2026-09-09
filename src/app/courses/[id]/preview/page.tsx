'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CourseAdminRoute from '@/components/CourseAdminRoute';
import Layout from '@/components/Layout';
import MyCourseDetailPage from '@/views/MyCourseDetailPage';

export default function CoursePreviewRoutePage() {
  return (
    <ProtectedRoute>
      <CourseAdminRoute>
        <Layout>
          <MyCourseDetailPage isPreview={true} />
        </Layout>
      </CourseAdminRoute>
    </ProtectedRoute>
  );
}
