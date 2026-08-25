'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CourseAdminRoute from '@/components/CourseAdminRoute';
import Layout from '@/components/Layout';
import CoursesPage from '@/views/CoursesPage';

export default function CoursesAdminRoutePage() {
  return (
    <ProtectedRoute>
      <CourseAdminRoute>
        <Layout>
          <CoursesPage />
        </Layout>
      </CourseAdminRoute>
    </ProtectedRoute>
  );
}
