import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import LandingClientPage from './LandingClientPage';
import { getLandingMetadata } from '@/utils/seoHelper';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const rawId = (searchParams?.id as string) || (searchParams?.slug as string) || '';
  return await getLandingMetadata(rawId, host);
}

export default function PublicLandingRoute() {
  return <LandingClientPage />;
}
