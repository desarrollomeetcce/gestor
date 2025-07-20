'use server';


import { getSessionUser } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma'
import LinksPageClient from './components/form';


export default async function LinksPage() {
  const session = await getSessionUser();
  if (!session) return <p className="p-6">No has iniciado sesión.</p>;

  const [links, allUsers, allProfiles, linkTypes] = await Promise.all([
    prisma.link.findMany({
      where: {
        OR: [
          { ownerId: session.userId },
          { users: { some: { id: session.userId } } },
          {
            profiles: session.profileId
              ? { some: { id: session.profileId } }
              : undefined,
          },
        ],
      },
      include: {
        type: true,
        users: true,
        profiles: true,
      },
      orderBy: {id: 'desc'},
    }),
    prisma.user.findMany({
      where: { id: { not: session.userId } },
      select: { id: true, name: true },
    }),
    prisma.profile.findMany(),
    prisma.linkType.findMany(),
  ]);

  return (
    <LinksPageClient
      initialLinks={links}
      allUsers={allUsers}
      allProfiles={allProfiles}
      linkTypes={linkTypes}
    />
  );
}
