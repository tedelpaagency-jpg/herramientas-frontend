import PublicHunterStorePage from '@/views/PublicHunterStorePage';

export default function HunterStorePublicPage({ params }: { params: { id: string } }) {
  return <PublicHunterStorePage idOrToken={params.id} />;
}
