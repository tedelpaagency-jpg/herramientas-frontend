'use client';

import React from 'react';
import { PublicMagicLinkApprovePage } from '../../../../views/PublicMagicLinkApprovePage';

export default function Page({ params }: { params: { token: string } }) {
  return <PublicMagicLinkApprovePage token={params.token} />;
}
