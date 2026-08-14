'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { LexvaultDocumentDetailView } from '@/views/LexvaultDocumentDetailView';

export default function LexvaultTemplateDetailPage() {
  const params = useParams();
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id || '';

  return (
    <ProtectedRoute>
      <Layout>
        <LexvaultDocumentDetailView id={idStr} type="template" />
      </Layout>
    </ProtectedRoute>
  );
}
