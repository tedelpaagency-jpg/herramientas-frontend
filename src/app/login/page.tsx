import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import LoginPage from '@/views/LoginPage';
import { getDomainMetadata } from '@/utils/seoHelper';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  return await getDomainMetadata(host);
}

export default function LoginRoute() {
  return <LoginPage />;
}
