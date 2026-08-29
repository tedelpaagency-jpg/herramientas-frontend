'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import TasksPage from '@/views/TasksPage';

export default function TasksRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <TasksPage />
      </Layout>
    </ProtectedRoute>
  );
}
