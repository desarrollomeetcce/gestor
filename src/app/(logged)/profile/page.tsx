import { prisma } from '@/app/lib/prisma'
import ProfilesPageClient from './components/profiles-view';


export default async function Page() {
  const initialProfiles = await prisma.profile.findMany({
    include: { permissions: true },
    orderBy: { name: 'asc' }
  });

  const allPermissions = await prisma.permission.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <ProfilesPageClient
      initialProfiles={initialProfiles}
      allPermissions={allPermissions}
    />
  );
}
