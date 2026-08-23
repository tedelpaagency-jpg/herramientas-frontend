'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { GoogleCalendarPage } from '@/views/GoogleCalendarPage';

export default function CalendarRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <GoogleCalendarPage />
      </Layout>
    </ProtectedRoute>
  );
}
